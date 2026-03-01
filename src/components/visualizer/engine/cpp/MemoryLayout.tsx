'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVisualizerStore } from '@/stores/visualizer-store';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MemoryLayout() {
  const { cppEngineState } = useVisualizerStore();

  if (!cppEngineState) {
    return (
      <div className="h-full flex items-center justify-center text-muted text-sm">
        Run C/C++ code to see memory layout
      </div>
    );
  }

  const { stackMemory, heapMemory, pointers, memoryErrors } = cppEngineState;

  return (
    <div className="h-full flex flex-col p-3 overflow-y-auto gap-4">
      {/* Memory Errors */}
      {memoryErrors.length > 0 && (
        <div className="rounded-lg border border-error/30 bg-error/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-error" />
            <span className="text-xs font-semibold text-error">Memory Errors</span>
          </div>
          {memoryErrors.map((err, i) => (
            <div key={i} className="text-[10px] text-error/80 font-mono mb-1">
              [{err.type}] {err.message} @ {err.address}
            </div>
          ))}
        </div>
      )}

      {/* Stack and Heap side by side */}
      <div className="flex gap-3">
        {/* Stack */}
        <div className="flex-1 rounded-lg border border-border bg-surface p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--stack-mem)' }} />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Stack
            </span>
            <span className="ml-auto text-[10px] text-muted">
              ↓ grows down
            </span>
          </div>

          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {stackMemory.length === 0 ? (
                <div className="text-[10px] text-muted italic py-2 text-center">Empty</div>
              ) : (
                [...stackMemory].reverse().map((block) => (
                  <motion.div
                    key={block.address}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-md border border-stack-mem/30 bg-stack-mem/5 px-2 py-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted">{block.address}</span>
                      <span className="text-[10px] text-muted">{block.size}B</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono font-semibold text-stack-mem">{block.name}</span>
                      <span className="text-[10px] text-muted">=</span>
                      <span className="text-xs font-mono text-foreground">{block.value}</span>
                    </div>
                    <div className="text-[10px] text-muted font-mono mt-0.5">{block.type}</div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Heap */}
        <div className="flex-1 rounded-lg border border-border bg-surface p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--heap)' }} />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Heap
            </span>
            <span className="ml-auto text-[10px] text-muted">
              ↑ grows up
            </span>
          </div>

          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {heapMemory.length === 0 ? (
                <div className="text-[10px] text-muted italic py-2 text-center">Empty</div>
              ) : (
                heapMemory.map((block) => (
                  <motion.div
                    key={block.address}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      'rounded-md border px-2 py-1.5',
                      block.isFreed
                        ? 'border-error/30 bg-error/5 line-through opacity-50'
                        : 'border-heap/30 bg-heap/5'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted">{block.address}</span>
                      {block.isFreed && (
                        <span className="text-[10px] text-error font-bold">FREED</span>
                      )}
                    </div>
                    <div className="text-xs font-mono font-semibold text-heap mt-0.5">
                      {block.name}: {block.value}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Pointer Relationships */}
      {pointers.length > 0 && (
        <div className="rounded-lg border border-border bg-surface p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--pointer)' }} />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Pointers
            </span>
          </div>

          <div className="space-y-1.5">
            {pointers.map((ptr, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  'flex items-center gap-2 px-2 py-1 rounded-md text-[10px] font-mono',
                  ptr.isValid
                    ? 'bg-pointer/5 border border-pointer/20'
                    : 'bg-error/5 border border-error/20'
                )}
              >
                <span className={ptr.isValid ? 'text-pointer font-bold' : 'text-error font-bold'}>
                  {ptr.from}
                </span>
                <span className="text-muted">{ptr.fromAddress}</span>
                <ArrowRight className={cn('w-3 h-3', ptr.isValid ? 'text-pointer' : 'text-error')} />
                <span className={ptr.isValid ? 'text-foreground' : 'text-error line-through'}>
                  {ptr.toAddress}
                </span>
                {!ptr.isValid && (
                  <span className="text-error ml-auto">dangling!</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
