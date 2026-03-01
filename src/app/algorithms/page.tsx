'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Search, Map, ArrowUpDown, GitBranch, Table2, Type, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SortingVisualizer } from '@/components/visualizer-tools/algorithms/SortingVisualizer';
import { SearchingVisualizer } from '@/components/visualizer-tools/algorithms/SearchingVisualizer';
import { PathfindingVisualizer } from '@/components/visualizer-tools/algorithms/PathfindingVisualizer';
import { RecursionTreeVisualizer } from '@/components/visualizer-tools/algorithms/RecursionTreeVisualizer';
import { DPTableVisualizer } from '@/components/visualizer-tools/algorithms/DPTableVisualizer';
import { StringMatchingVisualizer } from '@/components/visualizer-tools/algorithms/StringMatchingVisualizer';
import { BacktrackingVisualizer } from '@/components/visualizer-tools/algorithms/BacktrackingVisualizer';

const ALGO_OPTIONS = [
  {
    id: 'sorting',
    label: 'Sorting',
    icon: ArrowUpDown,
    description: 'Visualize Bubble, Selection, Insertion, Merge, and Quick Sort with animated bar charts',
    algorithms: 'Bubble, Selection, Insertion, Merge, Quick',
  },
  {
    id: 'searching',
    label: 'Searching',
    icon: Search,
    description: 'Compare Linear Search vs Binary Search with step-by-step array visualization',
    algorithms: 'Linear Search, Binary Search',
  },
  {
    id: 'pathfinding',
    label: 'Pathfinding',
    icon: Map,
    description: 'Interactive grid-based pathfinding with BFS, DFS, Dijkstra, and A* algorithms',
    algorithms: 'BFS, DFS, Dijkstra, A*',
  },
  {
    id: 'recursion',
    label: 'Recursion Tree',
    icon: GitBranch,
    description: 'Visualize recursive call trees for Fibonacci, Factorial, and Power with memoization',
    algorithms: 'Fibonacci, Factorial, Power of 2',
  },
  {
    id: 'dp',
    label: 'Dynamic Programming',
    icon: Table2,
    description: 'Animate DP table construction for classic problems with cell-by-cell filling',
    algorithms: 'Fibonacci, Knapsack, LCS, Coin Change',
  },
  {
    id: 'string-matching',
    label: 'String Matching',
    icon: Type,
    description: 'Character-by-character string matching animation with pattern alignment',
    algorithms: 'Naive, KMP, Rabin-Karp',
  },
  {
    id: 'backtracking',
    label: 'Backtracking',
    icon: Undo2,
    description: 'Watch backtracking solve constraint satisfaction puzzles step by step',
    algorithms: 'N-Queens, Sudoku',
  },
] as const;

type AlgoOption = typeof ALGO_OPTIONS[number]['id'];

const ALGO_COMPONENTS: Record<AlgoOption, React.FC> = {
  sorting: SortingVisualizer,
  searching: SearchingVisualizer,
  pathfinding: PathfindingVisualizer,
  recursion: RecursionTreeVisualizer,
  dp: DPTableVisualizer,
  'string-matching': StringMatchingVisualizer,
  backtracking: BacktrackingVisualizer,
};

export default function AlgorithmsPage() {
  const [selected, setSelected] = useState<AlgoOption>('sorting');
  const SelectedComponent = ALGO_COMPONENTS[selected];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            <BarChart3 className="w-8 h-8 inline mr-3 text-accent -mt-1" />
            Algorithm Visualizer
          </h1>
          <p className="text-muted text-sm">
            Watch algorithms in action with real-time animations. Adjust speed, change inputs, and compare different approaches.
          </p>
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {ALGO_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setSelected(option.id)}
                className={cn(
                  'flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200',
                  selected === option.id
                    ? 'bg-accent/10 border-accent shadow-lg shadow-accent/5'
                    : 'bg-surface border-border hover:border-border-hover hover:bg-surface-secondary'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  selected === option.id ? 'bg-accent/20' : 'bg-surface-secondary'
                )}>
                  <Icon className={cn('w-5 h-5', selected === option.id ? 'text-accent' : 'text-muted')} />
                </div>
                <div>
                  <div className={cn('font-bold text-sm', selected === option.id ? 'text-accent' : 'text-foreground')}>
                    {option.label}
                  </div>
                  <div className="text-xs text-muted mt-0.5 line-clamp-2">{option.description}</div>
                  <div className="text-[10px] text-muted/70 mt-1 font-mono">{option.algorithms}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Visualizer */}
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SelectedComponent />
        </motion.div>
      </div>
    </div>
  );
}
