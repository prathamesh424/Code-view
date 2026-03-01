'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  Panel,
  Group,
  Separator,
} from 'react-resizable-panels';
import { useEditorStore } from '@/stores/editor-store';
import { useVisualizerStore } from '@/stores/visualizer-store';
import { LanguageSelector } from '@/components/editor/LanguageSelector';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { VisualizerPanel } from '@/components/visualizer/VisualizerPanel';
import { JSEngine } from '@/lib/engines/js-engine';
import { PythonEngine } from '@/lib/engines/python-engine';
import { APIEngine } from '@/lib/engines/api-engine';
import { GripVertical } from 'lucide-react';
import type { ExecutionStep, EngineState, Language } from '@/types/engine';

function createEngine(language: Language) {
  switch (language) {
    case 'javascript':
      return new JSEngine();
    case 'python':
      return new PythonEngine();
    case 'c':
    case 'cpp':
    case 'java':
      return new APIEngine(language);
    default:
      return new JSEngine();
  }
}

export default function PlaygroundPage() {
  const {
    code,
    language,
    breakpoints,
    isRunning,
    isPaused,
    executionSpeed,
    setIsRunning,
    setIsPaused,
    setCurrentLine,
  } = useEditorStore();

  const {
    addStep,
    setCallStack,
    setVariables,
    setConsoleOutput,
    addConsoleOutput,
    setEngineState,
    setCurrentStepIndex,
    reset: resetVisualizer,
  } = useVisualizerStore();

  const engineRef = useRef<ReturnType<typeof createEngine> | null>(null);
  const abortRef = useRef(false);
  const pauseRef = useRef(false);
  const stepResolveRef = useRef<(() => void) | null>(null);

  // Sync pause state to ref
  useEffect(() => {
    pauseRef.current = isPaused;
  }, [isPaused]);

  const handleStep = useCallback(
    (step: ExecutionStep, engineState?: EngineState) => {
      addStep(step);
      setCurrentLine(step.line);
      setCallStack(step.callStack);
      setVariables(step.variables);

      if (step.consoleOutput) {
        setConsoleOutput(step.consoleOutput);
      }

      if (engineState) {
        setEngineState(engineState, language);
      }
    },
    [language, addStep, setCurrentLine, setCallStack, setVariables, setConsoleOutput, setEngineState]
  );

  const handleRun = useCallback(async () => {
    if (isRunning) return;

    resetVisualizer();
    setIsRunning(true);
    setIsPaused(false);
    abortRef.current = false;
    pauseRef.current = false;

    const engine = createEngine(language);
    engineRef.current = engine;
    engine.setSpeed(executionSpeed);

    let stepIndex = 0;

    try {
      await engine.execute(code, async (step: ExecutionStep, engineState?: EngineState) => {
        if (abortRef.current) throw new Error('ABORT');

        handleStep(step, engineState);
        setCurrentStepIndex(stepIndex++);

        // Check if we hit a breakpoint
        const activeBreakpoints = breakpoints
          .filter((b) => b.enabled)
          .map((b) => b.line);
        if (activeBreakpoints.includes(step.line)) {
          setIsPaused(true);
          pauseRef.current = true;
        }

        // Wait while paused
        while (pauseRef.current && !abortRef.current) {
          await new Promise<void>((resolve) => {
            stepResolveRef.current = resolve;
            setTimeout(resolve, 100);
          });
        }

        if (abortRef.current) throw new Error('ABORT');
      });
    } catch (e: unknown) {
      if (e instanceof Error && e.message !== 'ABORT') {
        addConsoleOutput({
          type: 'error',
          value: `Execution error: ${e.message}`,
          timestamp: Date.now(),
        });
      }
    } finally {
      setIsRunning(false);
      setIsPaused(false);
      setCurrentLine(null);
      engineRef.current = null;
    }
  }, [
    code,
    language,
    breakpoints,
    executionSpeed,
    isRunning,
    handleStep,
    resetVisualizer,
    setIsRunning,
    setIsPaused,
    setCurrentLine,
    setCurrentStepIndex,
    addConsoleOutput,
  ]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
    pauseRef.current = true;
  }, [setIsPaused]);

  const handleResume = useCallback(() => {
    setIsPaused(false);
    pauseRef.current = false;
    if (stepResolveRef.current) {
      stepResolveRef.current();
      stepResolveRef.current = null;
    }
  }, [setIsPaused]);

  const handleStepOver = useCallback(() => {
    // Release one step then pause again
    pauseRef.current = false;
    if (stepResolveRef.current) {
      stepResolveRef.current();
      stepResolveRef.current = null;
    }
    // Will pause on next step
    setTimeout(() => {
      pauseRef.current = true;
      setIsPaused(true);
    }, 50);
  }, [setIsPaused]);

  const handleStop = useCallback(() => {
    abortRef.current = true;
    pauseRef.current = false;
    if (stepResolveRef.current) {
      stepResolveRef.current();
      stepResolveRef.current = null;
    }
  }, []);

  const handleReset = useCallback(() => {
    handleStop();
    resetVisualizer();
    setCurrentLine(null);
  }, [handleStop, resetVisualizer, setCurrentLine]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        if (isRunning) {
          handleStop();
        } else {
          handleRun();
        }
      } else if (e.key === 'F10') {
        e.preventDefault();
        if (isRunning && isPaused) handleStepOver();
      } else if (e.key === 'F5') {
        e.preventDefault();
        if (isRunning && isPaused) handleResume();
        else if (!isRunning) handleRun();
      } else if (e.key === 'F6') {
        e.preventDefault();
        if (isRunning && !isPaused) handlePause();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isRunning, isPaused, handleRun, handleStop, handleStepOver, handleResume, handlePause]);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* SEO H1 — visually hidden but accessible to crawlers */}
      <h1 className="sr-only">Interactive Code Playground</h1>

      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-surface">
        <LanguageSelector />
        <div className="h-5 w-px bg-border" />
        <EditorToolbar
          onRun={handleRun}
          onPause={handlePause}
          onResume={handleResume}
          onStep={handleStepOver}
          onStop={handleStop}
          onReset={handleReset}
        />
      </div>

      {/* Split panels */}
      <Group orientation="horizontal" className="flex-1">
        <Panel defaultSize={50} minSize={30}>
          <CodeEditor />
        </Panel>

        <Separator className="w-1.5 bg-border/50 hover:bg-accent/50 transition-colors flex items-center justify-center group">
          <GripVertical className="w-3 h-3 text-muted group-hover:text-accent transition-colors" />
        </Separator>

        <Panel defaultSize={50} minSize={30}>
          <VisualizerPanel />
        </Panel>
      </Group>

      {/* SEO Content Section — provides crawlable text for search engines */}
      <section id="seo-content" className="px-6 py-8 border-t border-border bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-foreground mb-3">About the Code Playground</h2>
          <p className="text-sm text-muted leading-relaxed">
            Code Visualizer&apos;s interactive playground lets you write, run, and visualize code execution 
            in real-time. Paste any JavaScript, Python, C++, or Java snippet and watch as the call stack 
            grows, variables change, and memory is allocated — step by step. Set breakpoints, step over 
            function calls, and inspect the full program state at any point. Whether you&apos;re studying 
            Big O notation, debugging a tricky algorithm, or learning through visual learning, this 
            code debugger makes complex execution flows easy to understand. Perfect for coding interviews, 
            CS courses, and everyday development.
          </p>
        </div>
      </section>
    </div>
  );
}
