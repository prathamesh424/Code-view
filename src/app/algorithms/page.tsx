'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Search, Map, ArrowUpDown, GitBranch, Table2, Type, Undo2, ChevronDown } from 'lucide-react';
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const SelectedComponent = ALGO_COMPONENTS[selected];
  const selectedOption = ALGO_OPTIONS.find((o) => o.id === selected)!;
  const SelectedIcon = selectedOption.icon;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 inline mr-3 text-accent -mt-1" />
            Algorithm Visualizations
          </h1>
          <p className="text-muted text-sm">
            Watch algorithms in action with real-time animations. Adjust speed, change inputs, and compare different approaches.
          </p>
        </div>

        {/* Sticky Category Dropdown */}
        <div className="sticky top-14 z-30 pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-background/80 backdrop-blur-lg">
          <div ref={dropdownRef} className="relative">
            {/* Dropdown trigger */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left',
                dropdownOpen
                  ? 'bg-accent/10 border-accent'
                  : 'bg-surface border-border hover:border-border-hover'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                  'bg-accent/20'
                )}>
                  <SelectedIcon className="w-4.5 h-4.5 text-accent" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-accent">{selectedOption.label}</div>
                  <div className="text-xs text-muted truncate">{selectedOption.algorithms}</div>
                </div>
              </div>
              <ChevronDown className={cn(
                'w-5 h-5 text-muted transition-transform flex-shrink-0',
                dropdownOpen && 'rotate-180'
              )} />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-40 max-h-[60vh] overflow-y-auto"
              >
                {ALGO_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selected === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelected(option.id);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors',
                        isSelected
                          ? 'bg-accent/10'
                          : 'hover:bg-surface-secondary active:bg-surface-tertiary'
                      )}
                    >
                      <div className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                        isSelected ? 'bg-accent/20' : 'bg-surface-secondary'
                      )}>
                        <Icon className={cn('w-4.5 h-4.5', isSelected ? 'text-accent' : 'text-muted')} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={cn('font-bold text-sm', isSelected ? 'text-accent' : 'text-foreground')}>
                          {option.label}
                        </div>
                        <div className="text-xs text-muted mt-0.5 line-clamp-1">{option.description}</div>
                        <div className="text-[10px] text-muted/70 mt-0.5 font-mono">{option.algorithms}</div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
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

        {/* SEO Content Section — provides crawlable text for search engines */}
        <section id="seo-content" className="mt-12 pt-8 border-t border-border">
          <h2 className="text-lg font-semibold text-foreground mb-3">About the Algorithm Visualizer</h2>
          <p className="text-sm text-muted leading-relaxed">
            Code Visualizer&apos;s algorithm visualizer brings sorting, searching, pathfinding, and 
            dynamic programming algorithms to life with real-time animations. Watch Bubble Sort swap 
            elements, see Dijkstra&apos;s shortest path unfold on a grid, or trace recursive call trees 
            for Fibonacci — all step by step. Understanding Big O notation becomes intuitive when you 
            can see the difference between O(n²) and O(n log n) play out visually. This visual learning 
            tool doubles as a code debugger for algorithm logic, making it ideal for coding interviews, 
            competitive programming prep, and computer science education.
          </p>
        </section>
      </div>
    </div>
  );
}

