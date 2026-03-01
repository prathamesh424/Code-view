'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, TrendingUp, Regex, Binary, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BigOChartVisualizer } from '@/components/visualizer-tools/tools/BigOChartVisualizer';
import { RegexPlaygroundVisualizer } from '@/components/visualizer-tools/tools/RegexPlaygroundVisualizer';
import { BitManipulationVisualizer } from '@/components/visualizer-tools/tools/BitManipulationVisualizer';
import { ComplexityAnalyzerVisualizer } from '@/components/visualizer-tools/tools/ComplexityAnalyzerVisualizer';

const TOOL_OPTIONS = [
  {
    id: 'bigo',
    label: 'Big-O Chart',
    icon: TrendingUp,
    description: 'Interactive comparison chart of algorithm time complexities from O(1) to O(2ⁿ)',
  },
  {
    id: 'regex',
    label: 'Regex Playground',
    icon: Regex,
    description: 'Test and visualize regular expressions with real-time match highlighting',
  },
  {
    id: 'bitwise',
    label: 'Bit Manipulation',
    icon: Binary,
    description: 'Visualize bitwise operations (AND, OR, XOR, NOT, shifts) with binary representation',
  },
  {
    id: 'complexity',
    label: 'Complexity Analyzer',
    icon: Cpu,
    description: 'Paste code and get an estimated time & space complexity analysis',
  },
] as const;

type ToolOption = typeof TOOL_OPTIONS[number]['id'];

const TOOL_COMPONENTS: Record<ToolOption, React.FC> = {
  bigo: BigOChartVisualizer,
  regex: RegexPlaygroundVisualizer,
  bitwise: BitManipulationVisualizer,
  complexity: ComplexityAnalyzerVisualizer,
};

export default function ToolsPage() {
  const [selected, setSelected] = useState<ToolOption>('bigo');
  const SelectedComponent = TOOL_COMPONENTS[selected];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            <Wrench className="w-8 h-8 inline mr-3 text-accent -mt-1" />
            Developer Tools
          </h1>
          <p className="text-muted text-sm">
            Handy interactive tools for understanding complexity, regex patterns, bitwise operations, and more.
          </p>
        </div>

        {/* Tool Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TOOL_OPTIONS.map((option) => {
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
                </div>
              </button>
            );
          })}
        </div>

        {/* Tool Visualizer */}
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
