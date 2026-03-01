'use client';

import { useRef, useEffect } from 'react';
import { useVisualizerStore } from '@/stores/visualizer-store';
import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ConsoleOutput() {
  const { consoleOutput } = useVisualizerStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Terminal className="w-3.5 h-3.5 text-info" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          Console
        </span>
        <span className="ml-auto text-[10px] text-muted bg-surface-tertiary px-1.5 py-0.5 rounded-full">
          {consoleOutput.length}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 font-mono text-xs bg-surface-secondary/30"
      >
        {consoleOutput.length === 0 ? (
          <div className="text-muted text-center py-4">
            No output yet — run your code
          </div>
        ) : (
          consoleOutput.map((entry, i) => (
            <div
              key={i}
              className={cn(
                'px-2 py-0.5 rounded-sm border-l-2',
                {
                  'border-foreground/20 text-foreground': entry.type === 'log',
                  'border-error text-error': entry.type === 'error',
                  'border-warning text-warning': entry.type === 'warn',
                  'border-info text-info': entry.type === 'info',
                }
              )}
            >
              <span className="opacity-40 mr-2 select-none">{`>`}</span>
              {entry.value}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
