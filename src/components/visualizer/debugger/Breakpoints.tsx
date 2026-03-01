'use client';

import { useEditorStore } from '@/stores/editor-store';
import { Circle, CircleDot } from 'lucide-react';

export function Breakpoints() {
  const { breakpoints, toggleBreakpoint } = useEditorStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <CircleDot className="w-3.5 h-3.5 text-breakpoint" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          Breakpoints
        </span>
        <span className="ml-auto text-[10px] text-muted bg-surface-tertiary px-1.5 py-0.5 rounded-full">
          {breakpoints.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {breakpoints.length === 0 ? (
          <div className="text-xs text-muted text-center py-4">
            Click the gutter to add breakpoints
          </div>
        ) : (
          breakpoints.map((bp) => (
            <button
              key={bp.line}
              onClick={() => toggleBreakpoint(bp.line)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface-secondary text-xs transition-colors cursor-pointer"
            >
              {bp.enabled ? (
                <Circle className="w-3 h-3 text-breakpoint fill-breakpoint" />
              ) : (
                <Circle className="w-3 h-3 text-muted" />
              )}
              <span className="font-mono text-muted">Line {bp.line}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
