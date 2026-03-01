'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVisualizerStore } from '@/stores/visualizer-store';
import { Eye } from 'lucide-react';

export function Variables() {
  const { variables } = useVisualizerStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Eye className="w-3.5 h-3.5 text-success" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          Variables
        </span>
        <span className="ml-auto text-[10px] text-muted bg-surface-tertiary px-1.5 py-0.5 rounded-full">
          {variables.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {variables.length === 0 ? (
          <div className="text-xs text-muted text-center py-4">
            No variables in scope
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted border-b border-border">
                <th className="text-left px-3 py-1.5 font-medium">Name</th>
                <th className="text-left px-3 py-1.5 font-medium">Value</th>
                <th className="text-left px-3 py-1.5 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {variables.map((v, i) => (
                  <motion.tr
                    key={`${v.name}-${i}`}
                    initial={{ opacity: 0, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                    animate={{ opacity: 1, backgroundColor: 'transparent' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-border/50 font-mono"
                  >
                    <td className="px-3 py-1.5 text-foreground font-medium">
                      {v.name}
                      {v.address && (
                        <span className="text-[10px] text-muted ml-1">{v.address}</span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-accent">{v.value}</td>
                    <td className="px-3 py-1.5 text-muted">
                      <span className="px-1 py-0.5 rounded bg-surface-secondary text-[10px]">
                        {v.type}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
