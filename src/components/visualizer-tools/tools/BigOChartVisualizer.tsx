'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ComplexityData {
  name: string;
  notation: string;
  color: string;
  values: number[];
  description: string;
}

const INPUT_SIZES = [1, 2, 4, 8, 16, 32, 64, 128];

const COMPLEXITIES: ComplexityData[] = [
  { name: 'Constant', notation: 'O(1)', color: '#22c55e', values: INPUT_SIZES.map(() => 1), description: 'HashMap lookup, array access' },
  { name: 'Logarithmic', notation: 'O(log n)', color: '#3b82f6', values: INPUT_SIZES.map(n => Math.log2(Math.max(1, n))), description: 'Binary search, balanced BST ops' },
  { name: 'Linear', notation: 'O(n)', color: '#a855f7', values: INPUT_SIZES.map(n => n), description: 'Array traversal, linear search' },
  { name: 'Linearithmic', notation: 'O(n log n)', color: '#eab308', values: INPUT_SIZES.map(n => n * Math.log2(Math.max(1, n))), description: 'Merge sort, heap sort, quick sort (avg)' },
  { name: 'Quadratic', notation: 'O(n²)', color: '#f97316', values: INPUT_SIZES.map(n => n * n), description: 'Bubble sort, selection sort, nested loops' },
  { name: 'Cubic', notation: 'O(n³)', color: '#ef4444', values: INPUT_SIZES.map(n => n * n * n), description: 'Matrix multiplication (naive), Floyd-Warshall' },
  { name: 'Exponential', notation: 'O(2ⁿ)', color: '#dc2626', values: INPUT_SIZES.map(n => Math.pow(2, n)), description: 'Recursive Fibonacci, subsets, brute-force' },
];

const CHART_WIDTH = 600;
const CHART_HEIGHT = 350;
const PADDING = { top: 20, right: 30, bottom: 40, left: 60 };

export function BigOChartVisualizer() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)']));
  const [hovered, setHovered] = useState<string | null>(null);
  const [maxN, setMaxN] = useState(64);

  const filterSizes = INPUT_SIZES.filter(n => n <= maxN);

  // Scale
  const activeComplexities = COMPLEXITIES.filter(c => selected.has(c.notation));
  const maxValue = Math.max(...activeComplexities.flatMap(c => c.values.slice(0, filterSizes.length)));
  const cappedMax = Math.min(maxValue, maxN * maxN * 2);

  const scaleX = (i: number) => PADDING.left + (i / (filterSizes.length - 1)) * (CHART_WIDTH - PADDING.left - PADDING.right);
  const scaleY = (v: number) => CHART_HEIGHT - PADDING.bottom - (Math.min(v, cappedMax) / cappedMax) * (CHART_HEIGHT - PADDING.top - PADDING.bottom);

  const toggleComplexity = (notation: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(notation)) next.delete(notation);
      else next.add(notation);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted mr-2">Toggle:</span>
        {COMPLEXITIES.map(c => (
          <button key={c.notation} onClick={() => toggleComplexity(c.notation)}
            className={cn('px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
              selected.has(c.notation) ? 'opacity-100' : 'opacity-40'
            )}
            style={{
              backgroundColor: selected.has(c.notation) ? `${c.color}20` : undefined,
              borderColor: c.color,
              color: c.color,
            }}>
            {c.notation}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted">Max n:</span>
          <select value={maxN} onChange={e => setMaxN(parseInt(e.target.value))}
            className="px-2 py-1 rounded-lg bg-surface-secondary border border-border text-xs text-foreground">
            {[8, 16, 32, 64, 128].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-4 overflow-x-auto">
          <svg width={CHART_WIDTH} height={CHART_HEIGHT} className="mx-auto">
            {/* Grid lines */}
            {Array.from({ length: 5 }, (_, i) => {
              const y = PADDING.top + (i / 4) * (CHART_HEIGHT - PADDING.top - PADDING.bottom);
              const label = Math.round(cappedMax * (1 - i / 4));
              return (
                <g key={`grid-${i}`}>
                  <line x1={PADDING.left} y1={y} x2={CHART_WIDTH - PADDING.right} y2={y}
                    className="stroke-border" strokeDasharray="4,4" />
                  <text x={PADDING.left - 8} y={y + 4} textAnchor="end" className="text-[9px] font-mono fill-muted">{label}</text>
                </g>
              );
            })}

            {/* X axis labels */}
            {filterSizes.map((n, i) => (
              <text key={`x-${n}`} x={scaleX(i)} y={CHART_HEIGHT - 10} textAnchor="middle"
                className="text-[9px] font-mono fill-muted">{n}</text>
            ))}
            <text x={CHART_WIDTH / 2} y={CHART_HEIGHT} textAnchor="middle" className="text-[10px] fill-muted">n (input size)</text>

            {/* Lines */}
            {activeComplexities.map(c => (
              <g key={c.notation}>
                <polyline
                  points={filterSizes.map((_, i) => `${scaleX(i)},${scaleY(c.values[INPUT_SIZES.indexOf(filterSizes[i])])}`).join(' ')}
                  fill="none"
                  stroke={c.color}
                  strokeWidth={hovered === c.notation ? 3 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={hovered && hovered !== c.notation ? 0.3 : 1}
                  onMouseEnter={() => setHovered(c.notation)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer transition-opacity duration-200"
                />
                {filterSizes.map((_, i) => (
                  <circle key={`${c.notation}-${i}`} cx={scaleX(i)} cy={scaleY(c.values[INPUT_SIZES.indexOf(filterSizes[i])])}
                    r={hovered === c.notation ? 4 : 2.5}
                    fill={c.color}
                    opacity={hovered && hovered !== c.notation ? 0.3 : 1}
                    className="transition-all duration-200" />
                ))}
              </g>
            ))}

            {/* Axes */}
            <line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={CHART_HEIGHT - PADDING.bottom} className="stroke-foreground/30" />
            <line x1={PADDING.left} y1={CHART_HEIGHT - PADDING.bottom} x2={CHART_WIDTH - PADDING.right} y2={CHART_HEIGHT - PADDING.bottom} className="stroke-foreground/30" />
          </svg>
        </div>

        {/* Info */}
        <div className="space-y-3">
          {COMPLEXITIES.map(c => (
            <div key={c.notation}
              onMouseEnter={() => { if (selected.has(c.notation)) setHovered(c.notation); }}
              onMouseLeave={() => setHovered(null)}
              className={cn('p-3 rounded-xl border transition-all cursor-pointer',
                selected.has(c.notation) ? 'bg-surface border-border' : 'bg-surface/50 border-border/30 opacity-50',
                hovered === c.notation && 'ring-1'
              )}
              style={{ borderColor: hovered === c.notation ? c.color : undefined, boxShadow: hovered === c.notation ? `0 0 10px ${c.color}20` : undefined }}
              onClick={() => toggleComplexity(c.notation)}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-xs font-bold" style={{ color: c.color }}>{c.notation}</span>
                <span className="text-[10px] text-muted ml-auto">{c.name}</span>
              </div>
              <p className="text-[10px] text-muted leading-relaxed">{c.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-surface rounded-xl border border-border p-4 overflow-x-auto">
        <h3 className="text-xs font-bold text-muted mb-3">Growth Comparison Table</h3>
        <table className="w-full text-xs font-mono">
          <thead>
            <tr>
              <th className="text-left text-muted pb-2 pr-4">Complexity</th>
              {filterSizes.map(n => <th key={n} className="text-center text-muted pb-2 px-2">n={n}</th>)}
            </tr>
          </thead>
          <tbody>
            {activeComplexities.map(c => (
              <tr key={c.notation} className="border-t border-border/30">
                <td className="py-1.5 pr-4 font-bold" style={{ color: c.color }}>{c.notation}</td>
                {filterSizes.map((_, i) => {
                  const val = c.values[INPUT_SIZES.indexOf(filterSizes[i])];
                  return <td key={i} className="text-center py-1.5 px-2 text-muted">{val > 1000000 ? '∞' : val % 1 === 0 ? val : val.toFixed(1)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
