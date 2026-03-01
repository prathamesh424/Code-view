import type {
  ExecutionStep,
  StackFrame,
  Variable,
  ConsoleEntry,
  CppEngineState,
  JavaEngineState,
  MemoryBlock,
  PointerRelation,
  HeapObject,
  ClassInfo,
} from '@/types';
import { generateId, formatAddress } from '@/lib/utils';
import type { Language } from '@/types';

interface ExecuteResponse {
  run: {
    stdout: string;
    stderr: string;
    code: number;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
  };
}

/**
 * API Engine — runs C, C++, and Java code via Wandbox API.
 * Generates engine visualization (memory layout, JVM) via static analysis.
 */
export class APIEngine {
  private steps: ExecutionStep[] = [];
  private consoleOutput: ConsoleEntry[] = [];
  private pendingOutput: string[] = [];
  private pendingErrors: string[] = [];
  private running = false;
  private paused = false;
  private speed = 1;
  private language: Language;
  private onStepCallback: ((step: ExecutionStep, state: CppEngineState | JavaEngineState) => void) | null = null;

  constructor(language: Language) {
    this.language = language;
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  async execute(
    code: string,
    onStep: (step: ExecutionStep, state: CppEngineState | JavaEngineState) => void
  ): Promise<void> {
    this.reset();
    this.running = true;
    this.onStepCallback = onStep;

    // Step 1: Run code via API — store output separately for progressive reveal
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: this.language, code }),
      });

      if (response.ok) {
        const data: ExecuteResponse = await response.json();
        const output = data.run?.stdout ?? '';
        const error = data.run?.stderr ?? data.compile?.stderr ?? '';

        if (output) {
          this.pendingOutput = output.split('\n').filter(Boolean);
        }
        if (error) {
          this.pendingErrors = error.split('\n').filter(Boolean);
        }
      } else {
        const errData = await response.json().catch(() => null);
        const msg = errData?.error ?? `API error (status ${response.status})`;
        this.pendingErrors = [msg];
      }
    } catch {
      this.pendingErrors = ['Network error — could not reach execution API'];
    }

    // Step 2: Static analysis — console entries drip-feed at output lines
    if (this.language === 'java') {
      await this.analyzeJava(code);
    } else {
      await this.analyzeCCpp(code);
    }

    // Step 3: Flush any remaining output not matched to a source line
    this.flushRemaining();

    this.running = false;
  }

  /** Consume the next pending output line into consoleOutput */
  private consumeNextOutput(): void {
    if (this.pendingOutput.length > 0) {
      const value = this.pendingOutput.shift()!;
      this.consoleOutput.push({ type: 'log', value, timestamp: Date.now() });
    }
  }

  /** Flush all remaining pending output/errors into consoleOutput */
  private flushRemaining(): void {
    for (const value of this.pendingOutput) {
      this.consoleOutput.push({ type: 'log', value, timestamp: Date.now() });
    }
    this.pendingOutput = [];
    for (const value of this.pendingErrors) {
      this.consoleOutput.push({ type: 'error', value, timestamp: Date.now() });
    }
    this.pendingErrors = [];
  }

  // ── C/C++ Static Analysis ──

  private async analyzeCCpp(code: string): Promise<void> {
    const lines = code.split('\n');
    const stackMemory: MemoryBlock[] = [];
    const heapMemory: MemoryBlock[] = [];
    const pointers: PointerRelation[] = [];
    const callStack: StackFrame[] = [
      { id: generateId(), name: 'main', line: 1, variables: [], isActive: true },
    ];
    const variables: Variable[] = [];
    let addressCounter = 0;

    for (let i = 0; i < lines.length; i++) {
      if (!this.running) break;
      while (this.paused) await this.delay(100);

      const line = lines[i].trim();
      if (!line || line.startsWith('//') || line.startsWith('#include') || line === '{' || line === '}') continue;

      const lineNum = i + 1;
      let description = `Execute line ${lineNum}`;
      let type: ExecutionStep['type'] = 'statement';

      // Detect variable declarations (int x = 42;)
      const varMatch = line.match(/^(int|float|double|char|long|short|bool|auto|string|std::string)\s+(\w+)\s*=\s*(.+);/);
      if (varMatch) {
        const [, varType, varName, varValue] = varMatch;
        const addr = formatAddress(addressCounter++);
        stackMemory.push({
          address: addr,
          name: varName,
          value: varValue.trim(),
          type: varType,
          size: this.getTypeSize(varType),
          region: 'stack',
        });
        variables.push({ name: varName, value: varValue.trim(), type: varType, scope: 'local', address: addr });
        description = `Stack alloc: ${varType} ${varName} = ${varValue.trim()} @ ${addr}`;
        type = 'assignment';
      }

      // Detect pointer declarations (int *ptr = &x;)
      const ptrMatch = line.match(/^(int|float|double|char)\s*\*\s*(\w+)\s*=\s*&(\w+);/);
      if (ptrMatch) {
        const [, ptrType, ptrName, targetName] = ptrMatch;
        const addr = formatAddress(addressCounter++);
        const targetBlock = stackMemory.find(m => m.name === targetName);
        const targetAddr = targetBlock?.address ?? '0x????';
        stackMemory.push({
          address: addr,
          name: ptrName,
          value: targetAddr,
          type: `${ptrType}*`,
          size: 8,
          region: 'stack',
        });
        pointers.push({
          from: ptrName,
          fromAddress: addr,
          toAddress: targetAddr,
          isValid: true,
        });
        variables.push({ name: ptrName, value: targetAddr, type: `${ptrType}*`, scope: 'local', address: addr });
        description = `Pointer: ${ptrName} → ${targetAddr} (points to ${targetName})`;
        type = 'assignment';
      }

      // Detect malloc / new
      const mallocMatch = line.match(/(\w+)\s*=\s*\(.*\)\s*malloc\((.+)\)/);
      const newMatch = line.match(/(\w+)\s*=\s*new\s+(\w+)(?:\[(\d+)\])?/);
      if (mallocMatch || newMatch) {
        const varName = (mallocMatch || newMatch)![1];
        const heapAddr = formatAddress(100 + addressCounter++);
        heapMemory.push({
          address: heapAddr,
          name: `*${varName}`,
          value: '0',
          type: 'heap-block',
          size: 4,
          region: 'heap',
        });
        const ptrBlock = stackMemory.find(m => m.name === varName);
        if (ptrBlock) {
          ptrBlock.value = heapAddr;
          pointers.push({
            from: varName,
            fromAddress: ptrBlock.address,
            toAddress: heapAddr,
            isValid: true,
          });
        }
        description = `Heap alloc: ${varName} → ${heapAddr}`;
        type = 'assignment';
      }

      // Detect free / delete
      const freeMatch = line.match(/free\((\w+)\)/);
      const deleteMatch = line.match(/delete\s+(\w+)/);
      if (freeMatch || deleteMatch) {
        const varName = (freeMatch || deleteMatch)![1];
        const heapBlock = heapMemory.find(m => m.name === `*${varName}`);
        if (heapBlock) {
          heapBlock.isFreed = true;
        }
        const ptr = pointers.find(p => p.from === varName);
        if (ptr) ptr.isValid = false;
        description = `Free memory: ${varName}`;
        type = 'statement';
      }

      // Detect printf/cout — consume next real output line
      if (line.includes('printf(') || line.includes('cout')) {
        description = `Output: ${line.substring(0, 60)}`;
        type = 'output';
        this.consumeNextOutput();
      }

      // Detect function calls
      const funcMatch = line.match(/(\w+)\s*\(/);
      if (funcMatch && !['if', 'for', 'while', 'printf', 'cout', 'malloc', 'free', 'sizeof', 'return'].includes(funcMatch[1])) {
        description = `Call: ${funcMatch[1]}()`;
        type = 'call';
      }

      // Detect for/while loops
      if (line.startsWith('for ') || line.startsWith('for(') || line.startsWith('while ') || line.startsWith('while(')) {
        description = `Loop: ${line.substring(0, 50)}`;
        type = 'loop';
      }

      // Detect if/else
      if (line.startsWith('if ') || line.startsWith('if(') || line.startsWith('else')) {
        description = `Conditional: ${line.substring(0, 50)}`;
        type = 'conditional';
      }

      // Detect return
      if (line.startsWith('return ')) {
        description = `Return: ${line}`;
        type = 'return';
      }

      const step: ExecutionStep = {
        line: lineNum,
        type,
        description,
        callStack: [...callStack],
        variables: [...variables],
        consoleOutput: [...this.consoleOutput],
        timestamp: Date.now(),
      };

      const engineState: CppEngineState = {
        stackMemory: stackMemory.map(m => ({ ...m })),
        heapMemory: heapMemory.map(m => ({ ...m })),
        pointers: pointers.map(p => ({ ...p })),
        memoryErrors: [],
      };

      this.steps.push(step);
      if (this.onStepCallback) {
        this.onStepCallback(step, engineState);
      }

      await this.delay(Math.max(100, 600 / this.speed));
    }
  }

  // ── Java Static Analysis ──

  private async analyzeJava(code: string): Promise<void> {
    const lines = code.split('\n');
    const callStack: StackFrame[] = [
      { id: generateId(), name: 'main', line: 1, variables: [], isActive: true },
    ];
    const variables: Variable[] = [];
    const classLoader: ClassInfo[] = [];
    const youngGen: HeapObject[] = [];
    const oldGen: HeapObject[] = [];
    const permanentGen: HeapObject[] = [];
    const gcRoots: string[] = ['main thread', 'System class'];

    // First pass: find classes
    const classRegex = /class\s+(\w+)(?:\s+extends\s+(\w+))?/g;
    let classMatch;
    while ((classMatch = classRegex.exec(code)) !== null) {
      classLoader.push({
        name: classMatch[1],
        methods: [],
        fields: [],
        isLoaded: false,
      });
    }

    for (let i = 0; i < lines.length; i++) {
      if (!this.running) break;
      while (this.paused) await this.delay(100);

      const line = lines[i].trim();
      if (!line || line.startsWith('//') || line.startsWith('import') || line === '{' || line === '}') continue;

      const lineNum = i + 1;
      let description = `Execute line ${lineNum}`;
      let type: ExecutionStep['type'] = 'statement';
      let jvmPhase: JavaEngineState['jvmPhase'] = 'interpreting';

      // Class definition
      const classDefMatch = line.match(/^(?:public\s+)?class\s+(\w+)/);
      if (classDefMatch) {
        const cls = classLoader.find(c => c.name === classDefMatch[1]);
        if (cls) cls.isLoaded = true;
        jvmPhase = 'loading';
        description = `Class loaded: ${classDefMatch[1]}`;
        permanentGen.push({
          id: generateId(),
          className: `Class<${classDefMatch[1]}>`,
          fields: {},
          reachable: true,
          age: 0,
        });
      }

      // Method definition
      const methodMatch = line.match(/(?:public|private|protected)?\s*(?:static\s+)?(?:\w+)\s+(\w+)\s*\(/);
      if (methodMatch && !['if', 'for', 'while'].includes(methodMatch[1])) {
        const cls = classLoader[classLoader.length - 1];
        if (cls) cls.methods.push(methodMatch[1]);
        description = `Method: ${methodMatch[1]}()`;
      }

      // new keyword (heap allocation)
      const newObjMatch = line.match(/new\s+(\w+)\s*\(([^)]*)\)/);
      if (newObjMatch) {
        const obj: HeapObject = {
          id: generateId(),
          className: newObjMatch[1],
          fields: {},
          reachable: true,
          age: 0,
        };
        youngGen.push(obj);
        description = `Heap alloc: new ${newObjMatch[1]}(${newObjMatch[2]}) → Young Gen`;
        type = 'expression';
        jvmPhase = 'interpreting';

        // Simulate GC aging
        if (youngGen.length > 5) {
          const aged = youngGen.shift()!;
          aged.age++;
          oldGen.push(aged);
        }
      }

      // Variable assignment
      const javaVarMatch = line.match(/^(?:final\s+)?(\w+(?:<\w+>)?)\s+(\w+)\s*=\s*(.+);/);
      if (javaVarMatch) {
        const [, varType, varName, varValue] = javaVarMatch;
        variables.push({ name: varName, value: varValue.trim(), type: varType, scope: 'local' });
        description = `Assign: ${varType} ${varName} = ${varValue.trim()}`;
        type = 'assignment';
      }

      // System.out.println — consume next real output line
      if (line.includes('System.out.println') || line.includes('System.out.print(')) {
        description = `Output: ${line.substring(0, 60)}`;
        type = 'output';
        this.consumeNextOutput();
      }

      // GC trigger simulation
      let gcActive = false;
      if (youngGen.length > 8) {
        jvmPhase = 'gc';
        gcActive = true;
        description += ' (Minor GC triggered)';
        // Move surviving objects to old gen
        const survivors = youngGen.filter(o => o.reachable);
        survivors.forEach(s => { s.age++; oldGen.push(s); });
        youngGen.length = 0;
      }

      // Remove unreachable (simulated)
      const removeMatch = line.match(/\.remove\(|= null/);
      if (removeMatch) {
        const lastYoung = youngGen[youngGen.length - 1];
        if (lastYoung) lastYoung.reachable = false;
        description = `Object becomes unreachable → eligible for GC`;
      }

      const step: ExecutionStep = {
        line: lineNum,
        type,
        description,
        callStack: [...callStack],
        variables: [...variables],
        consoleOutput: [...this.consoleOutput],
        timestamp: Date.now(),
      };

      const engineState: JavaEngineState = {
        jvmPhase,
        classLoader: classLoader.map(c => ({ ...c })),
        heapGenerations: {
          young: youngGen.map(o => ({ ...o })),
          old: oldGen.map(o => ({ ...o })),
          permanent: permanentGen.map(o => ({ ...o })),
        },
        gcRoots: [...gcRoots],
        gcActive,
      };

      this.steps.push(step);
      if (this.onStepCallback) {
        this.onStepCallback(step, engineState);
      }

      await this.delay(Math.max(100, 600 / this.speed));
    }
  }

  private getTypeSize(type: string): number {
    const sizes: Record<string, number> = {
      char: 1, bool: 1, short: 2, int: 4, float: 4,
      double: 8, long: 8, 'long long': 8, auto: 4, string: 24,
      'std::string': 24,
    };
    return sizes[type] ?? 4;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  pause() { this.paused = true; }
  resume() { this.paused = false; }
  stop() { this.running = false; this.paused = false; }
  reset() {
    this.steps = [];
    this.consoleOutput = [];
    this.pendingOutput = [];
    this.pendingErrors = [];
    this.running = false;
    this.paused = false;
    this.onStepCallback = null;
  }
  isRunning() { return this.running; }
}
