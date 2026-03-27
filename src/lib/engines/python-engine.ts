import type {
  ExecutionStep,
  StackFrame,
  Variable,
  ConsoleEntry,
  PythonEngineState,
  PythonFrame,
  BytecodeOp,
} from '@/types';
import { generateId } from '@/lib/utils';

/**
 * Python Engine — runs Python code via the Wandbox API for real output,
 * then uses static analysis for step-by-step visualization.
 * Falls back to pure static analysis if the API is unreachable.
 */
export class PythonEngine {
  private steps: ExecutionStep[] = [];
  private consoleOutput: ConsoleEntry[] = [];
  private pendingOutput: string[] = [];
  private pendingErrors: string[] = [];
  private running = false;
  private paused = false;
  private speed = 1;
  private onStepCallback: ((step: ExecutionStep, state: PythonEngineState) => void | Promise<void>) | null = null;

  setSpeed(speed: number) {
    this.speed = speed;
  }

  async execute(
    code: string,
    onStep: (step: ExecutionStep, state: PythonEngineState) => void | Promise<void>
  ): Promise<void> {
    this.reset();
    this.running = true;
    this.onStepCallback = onStep;

    // Step 1: Run code via API for real output (store separately, don't add to console yet)
    await this.fetchRealOutput(code);

    // Step 2: Static analysis — console entries are added progressively
    await this.executeStaticAnalysis(code);

    // Step 3: Flush any remaining output that wasn't matched to a line
    this.flushRemaining();

    this.running = false;
  }

  /**
   * Fetch real execution output from the Wandbox API via our proxy.
   * Stores output lines in pendingOutput/pendingErrors — NOT in consoleOutput yet.
   */
  private async fetchRealOutput(code: string): Promise<void> {
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: 'python', code }),
      });

      if (response.ok) {
        const data = await response.json();
        const stdout: string = data.run?.stdout ?? '';
        const stderr: string = data.run?.stderr ?? data.compile?.stderr ?? '';

        if (stdout) {
          this.pendingOutput = stdout.split('\n').filter(Boolean);
        }
        if (stderr) {
          this.pendingErrors = stderr.split('\n').filter(Boolean);
        }
      }
    } catch {
      // API unavailable — static analysis will add simulated output
    }
  }

  /** Consume the next pending output line and add it to consoleOutput */
  private consumeNextOutput(): void {
    if (this.pendingOutput.length > 0) {
      const value = this.pendingOutput.shift()!;
      this.consoleOutput.push({ type: 'log', value, timestamp: Date.now() });
    }
  }

  /** Add any remaining pending output/errors to console */
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

  /**
   * Static analysis fallback — when Pyodide can't load, we parse
   * the Python code line-by-line and simulate execution.
   */
  private async executeStaticAnalysis(code: string): Promise<void> {
    const lines = code.split('\n');
    const callStack: StackFrame[] = [
      { id: generateId(), name: '<module>', line: 1, variables: [], isActive: true },
    ];
    const variables: Variable[] = [];
    const frameStack: PythonFrame[] = [
      { id: generateId(), functionName: '<module>', filename: '<string>', line: 1, locals: [], globals: [] },
    ];

    for (let i = 0; i < lines.length; i++) {
      if (!this.running) break;
      while (this.paused) {
        await this.delay(100);
      }

      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;

      const lineNum = i + 1;
      let description = `Execute line ${lineNum}`;
      let type: ExecutionStep['type'] = 'statement';

      // Basic pattern matching
      if (line.startsWith('def ')) {
        const name = line.match(/def\s+(\w+)/)?.[1] ?? 'unknown';
        description = `Define function "${name}"`;
        type = 'statement';
      } else if (line.startsWith('class ')) {
        const name = line.match(/class\s+(\w+)/)?.[1] ?? 'unknown';
        description = `Define class "${name}"`;
      } else if (line.startsWith('for ') || line.startsWith('while ')) {
        description = `Loop: ${line}`;
        type = 'loop';
      } else if (line.startsWith('if ') || line.startsWith('elif ') || line.startsWith('else:')) {
        description = `Conditional: ${line}`;
        type = 'conditional';
      } else if (line.startsWith('return ')) {
        description = `Return: ${line}`;
        type = 'return';
      } else if (line.startsWith('print(')) {
        const content = line.match(/print\((.+)\)/)?.[1] ?? '';
        description = `Output: print(${content})`;
        type = 'output';
        // Consume next real output line, or simulate if API had no output
        if (this.pendingOutput.length > 0) {
          this.consumeNextOutput();
        } else if (this.consoleOutput.length === 0 || !this.consoleOutput.some(e => e.type === 'log')) {
          this.consoleOutput.push({ type: 'log', value: content.replace(/['"]/g, ''), timestamp: Date.now() });
        }
      } else if (line.includes('=') && !line.includes('==')) {
        const [varName, varValue] = line.split('=').map((s) => s.trim());
        if (varName && varValue) {
          description = `Assign: ${varName} = ${varValue}`;
          type = 'assignment';
          variables.push({ name: varName, value: varValue, type: 'unknown', scope: 'local' });
        }
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

      const engineState: PythonEngineState = {
        frameStack: [...frameStack],
        gilState: 'locked',
        bytecodeOps: this.generateBytecodeOps(code).map((op, idx) => ({
          ...op,
          isActive: idx === i,
        })),
        currentOpIndex: i,
      };

      this.steps.push(step);
      if (this.onStepCallback) {
        await this.onStepCallback(step, engineState);
      }

      await this.delay(Math.max(100, 600 / this.speed));
    }

    this.running = false;
  }

  private generateBytecodeOps(code: string): BytecodeOp[] {
    const lines = code.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
    return lines.map((line, i) => {
      const trimmed = line.trim();
      let opcode = 'LOAD_CONST';
      if (trimmed.startsWith('def ')) opcode = 'MAKE_FUNCTION';
      else if (trimmed.startsWith('class ')) opcode = 'BUILD_CLASS';
      else if (trimmed.startsWith('return ')) opcode = 'RETURN_VALUE';
      else if (trimmed.startsWith('print(')) opcode = 'CALL_FUNCTION';
      else if (trimmed.includes('=')) opcode = 'STORE_NAME';
      else if (trimmed.startsWith('for ')) opcode = 'FOR_ITER';
      else if (trimmed.startsWith('if ')) opcode = 'POP_JUMP_IF_FALSE';
      else if (trimmed.startsWith('import ')) opcode = 'IMPORT_NAME';

      return {
        offset: i * 2,
        opcode,
        arg: trimmed.substring(0, 30),
        isActive: false,
      };
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  stop() {
    this.running = false;
    this.paused = false;
  }

  reset() {
    this.steps = [];
    this.consoleOutput = [];
    this.pendingOutput = [];
    this.pendingErrors = [];
    this.running = false;
    this.paused = false;
    this.onStepCallback = null;
  }

  isRunning() {
    return this.running;
  }
}
