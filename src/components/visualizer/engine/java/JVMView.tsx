'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVisualizerStore } from '@/stores/visualizer-store';
import { Cpu, Package, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function JVMView() {
  const { javaEngineState } = useVisualizerStore();

  if (!javaEngineState) {
    return (
      <div className="h-full flex items-center justify-center text-muted text-sm">
        Run Java code to see JVM internals
      </div>
    );
  }

  const { jvmPhase, classLoader, heapGenerations, gcRoots, gcActive } = javaEngineState;

  const phases = [
    { id: 'loading', label: 'Class Loading', icon: Package },
    { id: 'verifying', label: 'Verification', icon: Cpu },
    { id: 'interpreting', label: 'Interpreting', icon: Cpu },
    { id: 'jit', label: 'JIT Compile', icon: Cpu },
    { id: 'gc', label: 'GC', icon: Trash2 },
  ];

  return (
    <div className="h-full flex flex-col p-3 overflow-y-auto gap-4">
      {/* JVM Phase */}
      <div className="rounded-lg border border-border bg-surface p-3">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            JVM Pipeline
          </span>
        </div>
        <div className="flex items-center gap-1">
          {phases.map((phase, i) => (
            <div key={phase.id} className="flex items-center gap-1">
              <motion.div
                animate={{
                  scale: jvmPhase === phase.id ? 1.1 : 1,
                }}
                className={cn(
                  'px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all duration-300',
                  jvmPhase === phase.id
                    ? phase.id === 'gc'
                      ? 'bg-error/20 text-error ring-1 ring-error/40'
                      : 'bg-accent/20 text-accent ring-1 ring-accent/40'
                    : 'bg-surface-secondary text-muted'
                )}
              >
                {phase.label}
              </motion.div>
              {i < phases.length - 1 && (
                <span className="text-muted text-[8px]">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Class Loader */}
      {classLoader.length > 0 && (
        <div className="rounded-lg border border-border bg-surface p-3">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-3.5 h-3.5 text-accent-secondary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Class Loader
            </span>
            <span className="text-[10px] text-muted bg-surface-tertiary px-1.5 py-0.5 rounded-full">
              {classLoader.length}
            </span>
          </div>
          <div className="space-y-1">
            {classLoader.map((cls, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  'px-2 py-1.5 rounded-md text-xs font-mono border',
                  cls.isLoaded
                    ? 'bg-success/5 border-success/20 text-success'
                    : 'bg-surface-secondary border-border text-muted'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{cls.name}</span>
                  <span className="text-[10px]">
                    {cls.isLoaded ? '✓ loaded' : 'pending'}
                  </span>
                </div>
                {cls.methods.length > 0 && (
                  <div className="text-[10px] text-muted mt-0.5">
                    methods: {cls.methods.join(', ')}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Heap Generations */}
      <div className="rounded-lg border border-border bg-surface p-3">
        <div className="flex items-center gap-2 mb-3">
          <Trash2 className={cn('w-3.5 h-3.5', gcActive ? 'text-error animate-pulse' : 'text-muted')} />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Heap Generations
          </span>
          {gcActive && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-error font-bold bg-error/10 px-1.5 py-0.5 rounded-full"
            >
              GC ACTIVE
            </motion.span>
          )}
        </div>

        <div className="space-y-3">
          {/* Young Generation */}
          <HeapGen
            title="Young Gen"
            color="var(--gc-young)"
            objects={heapGenerations.young}
            gcActive={gcActive}
          />

          {/* Old Generation */}
          <HeapGen
            title="Old Gen"
            color="var(--gc-old)"
            objects={heapGenerations.old}
            gcActive={gcActive}
          />

          {/* Permanent Generation */}
          <HeapGen
            title="Permanent Gen"
            color="var(--gc-perm)"
            objects={heapGenerations.permanent}
            gcActive={false}
          />
        </div>
      </div>

      {/* GC Roots */}
      {gcRoots.length > 0 && (
        <div className="rounded-lg border border-border bg-surface p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              GC Roots
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {gcRoots.map((root, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-mono font-semibold"
              >
                {root}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HeapGen({
  title,
  color,
  objects,
  gcActive,
}: {
  title: string;
  color: string;
  objects: { id: string; className: string; reachable: boolean; age: number }[];
  gcActive: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[10px] font-semibold text-muted">{title}</span>
        <span className="text-[10px] text-muted">({objects.length})</span>
      </div>
      <div className="flex flex-wrap gap-1 min-h-[28px] p-1.5 rounded-md border border-border/50 bg-surface-secondary/30">
        <AnimatePresence mode="popLayout">
          {objects.length === 0 ? (
            <span className="text-[10px] text-muted italic">empty</span>
          ) : (
            objects.map((obj) => (
              <motion.div
                key={obj.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: obj.reachable ? 1 : 0.4,
                  scale: 1,
                }}
                exit={{ opacity: 0, scale: 0 }}
                className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border',
                  obj.reachable
                    ? ''
                    : 'line-through border-dashed'
                )}
                style={{
                  backgroundColor: obj.reachable ? color + '15' : 'var(--error)10',
                  borderColor: obj.reachable ? color + '40' : 'var(--error)40',
                  color: obj.reachable ? color : 'var(--error)',
                }}
              >
                {obj.className}
                {gcActive && !obj.reachable && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="ml-1"
                  >
                    🗑
                  </motion.span>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
