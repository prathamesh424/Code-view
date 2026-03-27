export type Language = 'javascript' | 'python' | 'c' | 'cpp' | 'java';

export interface ExecutionStep {
  line: number;
  type: 'expression' | 'statement' | 'call' | 'return' | 'assignment' | 'loop' | 'conditional' | 'output';
  description: string;
  callStack: StackFrame[];
  variables: Variable[];
  consoleOutput: ConsoleEntry[];
  timestamp: number;
}

export interface StackFrame {
  id: string;
  name: string;
  line: number;
  variables: Variable[];
  isActive: boolean;
}

export interface Variable {
  name: string;
  value: string;
  type: string;
  scope: 'local' | 'global' | 'closure';
  changed?: boolean;
  address?: string; // for C/C++
}

export interface ConsoleEntry {
  type: 'log' | 'error' | 'warn' | 'info';
  value: string;
  timestamp: number;
}

export interface Breakpoint {
  line: number;
  enabled: boolean;
}

// JS-specific engine state
export interface JSEngineState {
  callStack: StackFrame[];
  microtaskQueue: QueueItem[];
  macrotaskQueue: QueueItem[];
  webAPIs: WebAPIItem[];
  eventLoopPhase: 'callstack' | 'microtasks' | 'render' | 'macrotasks' | 'idle';
  currentTask: string | null;
}

export interface QueueItem {
  id: string;
  label: string;
  callback: string;
  type: 'promise' | 'then' | 'queueMicrotask' | 'setTimeout' | 'setInterval' | 'requestAnimationFrame' | 'fetch';
  delay?: number;
  addedAt: number;
}

export interface WebAPIItem {
  id: string;
  label: string;
  type: 'timer' | 'fetch' | 'dom' | 'other';
  remaining: number;
  total: number;
}

// Python-specific engine state
export interface PythonEngineState {
  frameStack: PythonFrame[];
  gilState: 'locked' | 'unlocked' | 'waiting';
  bytecodeOps: BytecodeOp[];
  currentOpIndex: number;
}

export interface PythonFrame {
  id: string;
  functionName: string;
  filename: string;
  line: number;
  locals: Variable[];
  globals: Variable[];
}

export interface BytecodeOp {
  offset: number;
  opcode: string;
  arg: string;
  isActive: boolean;
}

// C/C++ specific engine state
export interface CppEngineState {
  stackMemory: MemoryBlock[];
  heapMemory: MemoryBlock[];
  pointers: PointerRelation[];
  memoryErrors: MemoryError[];
}

export interface MemoryBlock {
  address: string;
  name: string;
  value: string;
  type: string;
  size: number;
  isFreed?: boolean;
  region: 'stack' | 'heap';
}

export interface PointerRelation {
  from: string; // pointer variable name
  fromAddress: string;
  toAddress: string;
  isValid: boolean;
}

export interface MemoryError {
  type: 'leak' | 'double-free' | 'use-after-free' | 'buffer-overflow' | 'null-deref';
  message: string;
  address: string;
}

// Java-specific engine state
export interface JavaEngineState {
  jvmPhase: 'loading' | 'verifying' | 'interpreting' | 'jit' | 'gc';
  classLoader: ClassInfo[];
  heapGenerations: {
    young: HeapObject[];
    old: HeapObject[];
    permanent: HeapObject[];
  };
  gcRoots: string[];
  gcActive: boolean;
}

export interface ClassInfo {
  name: string;
  methods: string[];
  fields: string[];
  isLoaded: boolean;
}

export interface HeapObject {
  id: string;
  className: string;
  fields: Record<string, string>;
  reachable: boolean;
  age: number;
}

export type EngineState = JSEngineState | PythonEngineState | CppEngineState | JavaEngineState;

export interface ExecutionEngine {
  language: Language;
  execute(code: string, onStep: (step: ExecutionStep, engineState: any) => void | Promise<void>): Promise<void>;
  step(): Promise<ExecutionStep | null>;
  pause(): void;
  resume(): void;
  reset(): void;
  isRunning(): boolean;
}
