'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVisualizerStore } from '@/stores/visualizer-store';
import { Cpu, Code2, Lock } from 'lucide-react';

export function PythonInternals() {
  const { pythonEngineState } = useVisualizerStore();

  if (!pythonEngineState) {
    return (
      <div className="h-full flex items-center justify-center text-muted text-sm">
        Run Python code to see runtime internals
      </div>
    );
  }

  const { frameStack, gilState, bytecodeOps, currentOpIndex } = pythonEngineState;

  return (
    <div className="h-full flex flex-col p-3 overflow-y-auto gap-4">
      {/* GIL State */}
      <div className="rounded-lg border border-border bg-surface p-3">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-3.5 h-3.5 text-warning" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Global Interpreter Lock (GIL)
          </span>
        </div>
        <motion.div
          animate={{
            backgroundColor:
              gilState === 'locked'
                ? 'var(--gil-locked)'
                : gilState === 'unlocked'
                ? 'var(--gil-unlocked)'
                : 'var(--warning)',
          }}
          className="px-4 py-2 rounded-lg text-white text-xs font-bold text-center uppercase"
          style={{
            backgroundColor:
              gilState === 'locked'
                ? 'var(--gil-locked)'
                : gilState === 'unlocked'
                ? 'var(--gil-unlocked)'
                : 'var(--warning)',
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={gilState === 'locked' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-3 h-3 rounded-full bg-white/30"
            />
            GIL {gilState}
          </div>
          <div className="text-[10px] font-normal mt-1 opacity-70">
            {gilState === 'locked'
              ? 'Only one thread can execute Python bytecode'
              : gilState === 'unlocked'
              ? 'GIL released — I/O or native code running'
              : 'Waiting for GIL acquisition'}
          </div>
        </motion.div>
      </div>

      {/* Frame Stack */}
      <div className="rounded-lg border border-border bg-surface p-3">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Frame Stack
          </span>
          <span className="text-[10px] text-muted bg-surface-tertiary px-1.5 py-0.5 rounded-full">
            {frameStack.length}
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {frameStack.length === 0 ? (
            <div className="text-[10px] text-muted italic py-1">No frames</div>
          ) : (
            [...frameStack].reverse().map((frame) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-2 rounded-md border border-border bg-surface-secondary p-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-accent">
                    {frame.functionName}()
                  </span>
                  <span className="text-[10px] text-muted">
                    line {frame.line}
                  </span>
                </div>
                {frame.locals.length > 0 && (
                  <div className="space-y-0.5">
                    {frame.locals.slice(0, 5).map((v, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-mono">
                        <span className="text-muted">{v.name}:</span>
                        <span className="text-success">{v.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Bytecode Viewer */}
      <div className="rounded-lg border border-border bg-surface p-3">
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="w-3.5 h-3.5 text-info" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Bytecode (dis)
          </span>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-0.5">
          {bytecodeOps.map((op, i) => (
            <motion.div
              key={i}
              animate={{
                backgroundColor: i === currentOpIndex ? 'var(--line-active)' : 'transparent',
              }}
              className="flex items-center gap-3 px-2 py-0.5 rounded text-[10px] font-mono"
            >
              <span className="text-muted w-6 text-right">{op.offset}</span>
              <span
                className={
                  i === currentOpIndex ? 'text-accent font-bold' : 'text-foreground'
                }
              >
                {op.opcode}
              </span>
              <span className="text-muted truncate">{op.arg}</span>
              {i === currentOpIndex && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-accent ml-auto"
                >
                  ◀
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
