'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVisualizerStore } from '@/stores/visualizer-store';
import { cn } from '@/lib/utils';
import { ArrowRight, RotateCw } from 'lucide-react';

export function EventLoop() {
  const { jsEngineState } = useVisualizerStore();

  if (!jsEngineState) {
    return (
      <div className="h-full flex items-center justify-center text-muted text-sm">
        Run JavaScript code to see the event loop visualization
      </div>
    );
  }

  const { callStack, microtaskQueue, macrotaskQueue, webAPIs, eventLoopPhase, currentTask } =
    jsEngineState;

  const phases = [
    { id: 'callstack', label: 'Call Stack', color: 'callstack' },
    { id: 'microtasks', label: 'Microtasks', color: 'microtask' },
    { id: 'render', label: 'Render', color: 'info' },
    { id: 'macrotasks', label: 'Macrotasks', color: 'macrotask' },
  ];

  return (
    <div className="h-full flex flex-col p-3 overflow-y-auto gap-4">
      {/* Current task description */}
      {currentTask && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 py-2 rounded-lg bg-accent/5 border border-accent/20 text-xs text-accent font-medium"
        >
          {currentTask}
        </motion.div>
      )}

      {/* Event Loop Phase Indicator */}
      <div className="flex items-center gap-1 justify-center">
        <RotateCw className={cn('w-4 h-4 text-accent', eventLoopPhase !== 'idle' && 'animate-spin-slow')} />
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">
          Event Loop
        </span>
      </div>

      <div className="flex items-center justify-center gap-1 flex-wrap">
        {phases.map((phase, i) => (
          <div key={phase.id} className="flex items-center gap-1">
            <div
              className={cn(
                'px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-300',
                eventLoopPhase === phase.id
                  ? `bg-${phase.color}/20 text-${phase.color} ring-1 ring-${phase.color}/40 scale-110`
                  : 'bg-surface-secondary text-muted'
              )}
              style={
                eventLoopPhase === phase.id
                  ? {
                      backgroundColor: `var(--${phase.color})20`,
                      color: `var(--${phase.color})`,
                      boxShadow: `0 0 10px var(--${phase.color})30`,
                    }
                  : undefined
              }
            >
              {phase.label}
            </div>
            {i < phases.length - 1 && (
              <ArrowRight className="w-3 h-3 text-muted" />
            )}
          </div>
        ))}
      </div>

      {/* Call Stack */}
      <Section title="Call Stack" color="var(--callstack)" count={callStack.length}>
        <AnimatePresence mode="popLayout">
          {callStack.length === 0 ? (
            <Empty text="Empty" />
          ) : (
            [...callStack].reverse().map((frame) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
                className="px-3 py-1.5 rounded-md text-xs font-mono font-semibold mb-1"
                style={{
                  backgroundColor: 'var(--callstack)',
                  color: 'white',
                  opacity: frame.isActive ? 1 : 0.5,
                }}
              >
                {frame.name}()
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </Section>

      {/* Microtask Queue */}
      <Section title="Microtask Queue" color="var(--microtask)" count={microtaskQueue.length}>
        <div className="flex flex-wrap gap-1">
          <AnimatePresence mode="popLayout">
            {microtaskQueue.length === 0 ? (
              <Empty text="Empty" />
            ) : (
              microtaskQueue.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold"
                  style={{ backgroundColor: 'var(--microtask)20', color: 'var(--microtask)', border: '1px solid var(--microtask)40' }}
                >
                  {item.label}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </Section>

      {/* Macrotask Queue */}
      <Section title="Macrotask Queue" color="var(--macrotask)" count={macrotaskQueue.length}>
        <div className="flex flex-wrap gap-1">
          <AnimatePresence mode="popLayout">
            {macrotaskQueue.length === 0 ? (
              <Empty text="Empty" />
            ) : (
              macrotaskQueue.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold"
                  style={{ backgroundColor: 'var(--macrotask)20', color: 'var(--macrotask)', border: '1px solid var(--macrotask)40' }}
                >
                  {item.label}
                  {item.delay !== undefined && (
                    <span className="ml-1 opacity-60">({item.delay}ms)</span>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </Section>

      {/* Web APIs */}
      <Section title="Web APIs" color="var(--webapi)" count={webAPIs.length}>
        <AnimatePresence mode="popLayout">
          {webAPIs.length === 0 ? (
            <Empty text="No active APIs" />
          ) : (
            webAPIs.map((api) => (
              <motion.div
                key={api.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-md mb-1"
                style={{ backgroundColor: 'var(--webapi)10', border: '1px solid var(--webapi)30' }}
              >
                <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--webapi)' }}>
                  {api.label}
                </span>
                <div className="w-16 h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: 'var(--webapi)', width: `${((api.total - api.remaining) / api.total) * 100}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${((api.total - api.remaining) / api.total) * 100}%` }}
                  />
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </Section>
    </div>
  );
}

function Section({
  title,
  color,
  count,
  children,
}: {
  title: string;
  color: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {title}
        </span>
        <span className="text-[10px] text-muted bg-surface-tertiary px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="text-[10px] text-muted italic py-1 px-2">{text}</div>
  );
}
