'use client';

import { useVisualizerStore } from '@/stores/visualizer-store';

export function ExecutionTimeline() {
  const { steps, currentStepIndex, setCurrentStepIndex } = useVisualizerStore();

  if (steps.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-surface">
      <span className="text-xs text-muted whitespace-nowrap">Timeline</span>
      <input
        type="range"
        min={0}
        max={Math.max(0, steps.length - 1)}
        value={Math.min(currentStepIndex, steps.length - 1)}
        onChange={(e) => setCurrentStepIndex(Number(e.target.value))}
        className="w-full accent-[var(--accent)]"
      />
      <span className="text-xs text-muted whitespace-nowrap">
        {Math.min(currentStepIndex + 1, steps.length)}/{steps.length}
      </span>
    </div>
  );
}
