import { create } from 'zustand';
import type {
  ExecutionStep,
  StackFrame,
  Variable,
  ConsoleEntry,
  VisualizerTab,
  JSEngineState,
  PythonEngineState,
  CppEngineState,
  JavaEngineState,
  EngineState,
} from '@/types';

interface VisualizerState {
  // Tab state
  activeTab: VisualizerTab;
  setActiveTab: (tab: VisualizerTab) => void;

  // Execution steps
  steps: ExecutionStep[];
  currentStepIndex: number;
  addStep: (step: ExecutionStep) => void;
  setCurrentStepIndex: (index: number) => void;
  clearSteps: () => void;

  // Current debugger state (derived from current step)
  callStack: StackFrame[];
  variables: Variable[];
  consoleOutput: ConsoleEntry[];
  setCallStack: (stack: StackFrame[]) => void;
  setVariables: (vars: Variable[]) => void;
  setConsoleOutput: (entries: ConsoleEntry[]) => void;
  addConsoleOutput: (entry: ConsoleEntry) => void;
  clearConsoleOutput: () => void;

  // Engine-specific state
  jsEngineState: JSEngineState | null;
  pythonEngineState: PythonEngineState | null;
  cppEngineState: CppEngineState | null;
  javaEngineState: JavaEngineState | null;
  setJSEngineState: (state: JSEngineState) => void;
  setPythonEngineState: (state: PythonEngineState) => void;
  setCppEngineState: (state: CppEngineState) => void;
  setJavaEngineState: (state: JavaEngineState) => void;
  setEngineState: (state: EngineState, language: string) => void;

  // Full reset
  reset: () => void;
}

const initialJSEngineState: JSEngineState = {
  callStack: [],
  microtaskQueue: [],
  macrotaskQueue: [],
  webAPIs: [],
  eventLoopPhase: 'idle',
  currentTask: null,
};

const initialPythonEngineState: PythonEngineState = {
  frameStack: [],
  gilState: 'unlocked',
  bytecodeOps: [],
  currentOpIndex: -1,
};

const initialCppEngineState: CppEngineState = {
  stackMemory: [],
  heapMemory: [],
  pointers: [],
  memoryErrors: [],
};

const initialJavaEngineState: JavaEngineState = {
  jvmPhase: 'loading',
  classLoader: [],
  heapGenerations: { young: [], old: [], permanent: [] },
  gcRoots: [],
  gcActive: false,
};

export const useVisualizerStore = create<VisualizerState>((set) => ({
  activeTab: 'debugger',
  setActiveTab: (activeTab) => set({ activeTab }),

  steps: [],
  currentStepIndex: -1,
  addStep: (step) =>
    set((state) => ({
      steps: [...state.steps, step],
      currentStepIndex: state.steps.length,
    })),
  setCurrentStepIndex: (currentStepIndex) => set({ currentStepIndex }),
  clearSteps: () => set({ steps: [], currentStepIndex: -1 }),

  callStack: [],
  variables: [],
  consoleOutput: [],
  setCallStack: (callStack) => set({ callStack }),
  setVariables: (variables) => set({ variables }),
  setConsoleOutput: (entries) => set({ consoleOutput: entries }),
  addConsoleOutput: (entry) =>
    set((state) => ({ consoleOutput: [...state.consoleOutput, entry] })),
  clearConsoleOutput: () => set({ consoleOutput: [] }),

  jsEngineState: null,
  pythonEngineState: null,
  cppEngineState: null,
  javaEngineState: null,
  setJSEngineState: (jsEngineState) => set({ jsEngineState }),
  setPythonEngineState: (pythonEngineState) => set({ pythonEngineState }),
  setCppEngineState: (cppEngineState) => set({ cppEngineState }),
  setJavaEngineState: (javaEngineState) => set({ javaEngineState }),
  setEngineState: (state, language) => {
    switch (language) {
      case 'javascript':
        set({ jsEngineState: state as JSEngineState });
        break;
      case 'python':
        set({ pythonEngineState: state as PythonEngineState });
        break;
      case 'c':
      case 'cpp':
        set({ cppEngineState: state as CppEngineState });
        break;
      case 'java':
        set({ javaEngineState: state as JavaEngineState });
        break;
    }
  },

  reset: () =>
    set({
      steps: [],
      currentStepIndex: -1,
      callStack: [],
      variables: [],
      consoleOutput: [],
      jsEngineState: initialJSEngineState,
      pythonEngineState: initialPythonEngineState,
      cppEngineState: initialCppEngineState,
      javaEngineState: initialJavaEngineState,
    }),
}));
