'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, List, Layers, GitBranch, Share2, Hash, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArrayVisualizer } from '@/components/visualizer-tools/data-structures/ArrayVisualizer';
import { LinkedListVisualizer } from '@/components/visualizer-tools/data-structures/LinkedListVisualizer';
import { StackQueueVisualizer } from '@/components/visualizer-tools/data-structures/StackQueueVisualizer';
import { TreeVisualizer } from '@/components/visualizer-tools/data-structures/TreeVisualizer';
import { GraphVisualizer } from '@/components/visualizer-tools/data-structures/GraphVisualizer';
import { HashMapVisualizer } from '@/components/visualizer-tools/data-structures/HashMapVisualizer';
import { HeapVisualizer } from '@/components/visualizer-tools/data-structures/HeapVisualizer';

const DS_OPTIONS = [
  { id: 'array', label: 'Array', icon: Database, description: 'Dynamic array with push, pop, insert, search operations', complexity: 'Access: O(1) | Search: O(n)' },
  { id: 'linked-list', label: 'Linked List', icon: List, description: 'Singly linked list with traversal and manipulation', complexity: 'Insert/Delete: O(1) | Search: O(n)' },
  { id: 'stack-queue', label: 'Stack & Queue', icon: Layers, description: 'LIFO Stack and FIFO Queue side by side', complexity: 'All operations: O(1)' },
  { id: 'tree', label: 'Binary Search Tree', icon: GitBranch, description: 'BST with insert, delete, search, and traversals', complexity: 'Balanced: O(log n)' },
  { id: 'graph', label: 'Graph', icon: Share2, description: 'Interactive graph with BFS, DFS, and Dijkstra algorithms', complexity: 'BFS/DFS: O(V + E)' },
  { id: 'hashmap', label: 'Hash Map', icon: Hash, description: 'Hash table with separate chaining collision resolution', complexity: 'Average: O(1)' },
  { id: 'heap', label: 'Heap', icon: ArrowUpDown, description: 'Min-heap and max-heap with insert, extract, and heapify', complexity: 'Insert/Extract: O(log n)' },
] as const;

type DSOption = typeof DS_OPTIONS[number]['id'];

const DS_COMPONENTS: Record<DSOption, React.FC> = {
  'array': ArrayVisualizer,
  'linked-list': LinkedListVisualizer,
  'stack-queue': StackQueueVisualizer,
  'tree': TreeVisualizer,
  'graph': GraphVisualizer,
  'hashmap': HashMapVisualizer,
  'heap': HeapVisualizer,
};

export default function DataStructuresPage() {
  const [selected, setSelected] = useState<DSOption>('array');
  const SelectedComponent = DS_COMPONENTS[selected];
  const selectedInfo = DS_OPTIONS.find(o => o.id === selected)!;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            <Database className="w-8 h-8 inline mr-3 text-accent -mt-1" />
            Master Data Structures Visually
          </h1>
          <p className="text-muted text-sm">
            Interactive visualizations of fundamental data structures. Observe operations in real-time with step-by-step animations.
          </p>
        </div>

        {/* DS Selection Grid */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-8 sm:grid sm:grid-cols-4 lg:grid-cols-7 sm:overflow-x-visible sm:pb-0">
          {DS_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setSelected(option.id)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 flex-shrink-0 min-w-[80px] sm:min-w-0',
                  selected === option.id
                    ? 'bg-accent/10 border-accent text-accent shadow-lg shadow-accent/5'
                    : 'bg-surface border-border text-muted hover:text-foreground hover:border-border-hover hover:bg-surface-secondary'
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium text-center">{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected DS Info */}
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 bg-surface rounded-xl border border-border px-4 sm:px-5 py-3">
            <div>
              <h2 className="text-xl font-bold text-foreground">{selectedInfo.label}</h2>
              <p className="text-xs text-muted mt-0.5">{selectedInfo.description}</p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-accent/5 border border-accent/20 flex-shrink-0">
              <span className="text-xs font-mono text-accent">{selectedInfo.complexity}</span>
            </div>
          </div>

          {/* Visualizer */}
          <SelectedComponent />
        </motion.div>
      </div>
    </div>
  );
}
