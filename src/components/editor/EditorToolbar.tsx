'use client';

import { useEditorStore } from '@/stores/editor-store';
import { useVisualizerStore } from '@/stores/visualizer-store';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { EXECUTION_SPEEDS } from '@/lib/constants';
import {
  Play,
  Pause,
  Square,
  SkipForward,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  onRun: () => void;
  onPause: () => void;
  onResume: () => void;
  onStep: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function EditorToolbar({
  onRun,
  onPause,
  onResume,
  onStep,
  onStop,
  onReset,
}: EditorToolbarProps) {
  const { isRunning, isPaused, executionSpeed, setExecutionSpeed } = useEditorStore();
  const { steps, currentStepIndex } = useVisualizerStore();

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 px-1 sm:px-3 py-1 sm:py-2 border-b border-border bg-surface flex-wrap">
      {/* Run / Pause / Resume */}
      {!isRunning ? (
        <Tooltip content="Run (Ctrl+Enter)">
          <Button size="sm" variant="primary" onClick={onRun}>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Run</span>
          </Button>
        </Tooltip>
      ) : isPaused ? (
        <Tooltip content="Resume">
          <Button size="sm" variant="primary" onClick={onResume}>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Resume</span>
          </Button>
        </Tooltip>
      ) : (
        <Tooltip content="Pause">
          <Button size="sm" variant="secondary" onClick={onPause}>
            <Pause className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pause</span>
          </Button>
        </Tooltip>
      )}

      {/* Step */}
      <Tooltip content="Step (F10)">
        <Button size="sm" variant="ghost" onClick={onStep} disabled={!isRunning}>
          <SkipForward className="w-3.5 h-3.5" />
        </Button>
      </Tooltip>

      {/* Stop */}
      <Tooltip content="Stop">
        <Button size="sm" variant="ghost" onClick={onStop} disabled={!isRunning}>
          <Square className="w-3.5 h-3.5" />
        </Button>
      </Tooltip>

      {/* Reset */}
      <Tooltip content="Reset (Ctrl+Shift+R)">
        <Button size="sm" variant="ghost" onClick={onReset}>
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </Tooltip>

      {/* Divider */}
      <div className="w-px h-5 bg-border mx-0.5 sm:mx-1 hidden sm:block" />

      {/* Speed control */}
      <div className="hidden sm:flex items-center gap-1.5">
        <span className="text-xs text-muted">Speed:</span>
        {EXECUTION_SPEEDS.map((s) => (
          <button
            key={s.value}
            onClick={() => setExecutionSpeed(s.value)}
            className={cn(
              'px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer',
              executionSpeed === s.value
                ? 'bg-accent text-white'
                : 'text-muted hover:text-foreground hover:bg-surface-secondary'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Step counter */}
      {steps.length > 0 && (
        <>
          <div className="w-px h-5 bg-border mx-0.5 sm:mx-1" />
          <span className="text-xs text-muted whitespace-nowrap">
            <span className="hidden sm:inline">Step </span>{currentStepIndex + 1}/{steps.length}
          </span>
        </>
      )}
    </div>
  );
}

