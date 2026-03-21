'use client';

import { useVisualizerStore } from '@/stores/visualizer-store';
import { Database, Layers3, Variable } from 'lucide-react';

export function MemorySnapshotPanel() {
  const { callStack, variables, cppEngineState } = useVisualizerStore();

  const heapCount = cppEngineState?.heapMemory.length ?? 0;
  const stackMemCount = cppEngineState?.stackMemory.length ?? 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-3 py-2 border-b border-border bg-surface">
      <div className="rounded-lg border border-border bg-background px-3 py-2">
        <p className="text-[11px] text-muted mb-1">Call Stack</p>
        <p className="text-sm font-semibold text-foreground inline-flex items-center gap-1">
          <Layers3 className="w-3.5 h-3.5 text-accent" />
          {callStack.length} frames
        </p>
      </div>
      <div className="rounded-lg border border-border bg-background px-3 py-2">
        <p className="text-[11px] text-muted mb-1">Variables</p>
        <p className="text-sm font-semibold text-foreground inline-flex items-center gap-1">
          <Variable className="w-3.5 h-3.5 text-info" />
          {variables.length} tracked
        </p>
      </div>
      <div className="rounded-lg border border-border bg-background px-3 py-2">
        <p className="text-[11px] text-muted mb-1">Stack Memory</p>
        <p className="text-sm font-semibold text-foreground inline-flex items-center gap-1">
          <Database className="w-3.5 h-3.5 text-warning" />
          {stackMemCount} blocks
        </p>
      </div>
      <div className="rounded-lg border border-border bg-background px-3 py-2">
        <p className="text-[11px] text-muted mb-1">Heap Memory</p>
        <p className="text-sm font-semibold text-foreground inline-flex items-center gap-1">
          <Database className="w-3.5 h-3.5 text-success" />
          {heapCount} objects
        </p>
      </div>
    </div>
  );
}
