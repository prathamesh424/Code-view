'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVisualizerStore } from '@/stores/visualizer-store';
import { Layers } from 'lucide-react';

export function CallStack() {
  const { callStack } = useVisualizerStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Layers className="w-3.5 h-3.5 text-callstack" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          Call Stack
        </span>
        <span className="ml-auto text-[10px] text-muted bg-surface-tertiary px-1.5 py-0.5 rounded-full">
          {callStack.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence mode="popLayout">
          {callStack.length === 0 ? (
            <div className="text-xs text-muted text-center py-4">
              No frames on stack
            </div>
          ) : (
            [...callStack].reverse().map((frame) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`mb-1 px-2.5 py-1.5 rounded-md text-xs font-mono border transition-colors ${
                  frame.isActive
                    ? 'bg-callstack/10 border-callstack/30 text-callstack'
                    : 'bg-surface-secondary border-border text-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold truncate">{frame.name}</span>
                  {frame.line > 0 && (
                    <span className="text-[10px] opacity-60">L{frame.line}</span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
