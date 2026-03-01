import { create } from 'zustand';
import type { Language, Breakpoint } from '@/types';
import { DEFAULT_CODE } from '@/lib/constants';

interface EditorState {
  code: string;
  language: Language;
  breakpoints: Breakpoint[];
  isRunning: boolean;
  isPaused: boolean;
  currentLine: number | null;
  executionSpeed: number;

  setCode: (code: string) => void;
  setLanguage: (language: Language) => void;
  toggleBreakpoint: (line: number) => void;
  clearBreakpoints: () => void;
  setIsRunning: (running: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setCurrentLine: (line: number | null) => void;
  setExecutionSpeed: (speed: number) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: DEFAULT_CODE.javascript,
  language: 'javascript',
  breakpoints: [],
  isRunning: false,
  isPaused: false,
  currentLine: null,
  executionSpeed: 1,

  setCode: (code) => set({ code }),
  
  setLanguage: (language) => set({ 
    language, 
    code: DEFAULT_CODE[language],
    breakpoints: [],
    currentLine: null,
    isRunning: false,
    isPaused: false,
  }),
  
  toggleBreakpoint: (line) => set((state) => {
    const exists = state.breakpoints.find((b) => b.line === line);
    if (exists) {
      return { breakpoints: state.breakpoints.filter((b) => b.line !== line) };
    }
    return { breakpoints: [...state.breakpoints, { line, enabled: true }] };
  }),
  
  clearBreakpoints: () => set({ breakpoints: [] }),
  
  setIsRunning: (isRunning) => set({ isRunning }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setCurrentLine: (currentLine) => set({ currentLine }),
  setExecutionSpeed: (executionSpeed) => set({ executionSpeed }),
  
  reset: () => set({
    isRunning: false,
    isPaused: false,
    currentLine: null,
  }),
}));
