'use client';

import { useState, useMemo } from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisResult {
  complexity: string;
  reason: string;
  type: 'time' | 'space';
  confidence: 'high' | 'medium' | 'low';
}

interface Pattern {
  regex: RegExp;
  time: string;
  space: string;
  reason: string;
}

const PATTERNS: Pattern[] = [
  { regex: /for\s*\([^)]*\)\s*\{[\s\S]*?for\s*\([^)]*\)\s*\{[\s\S]*?for\s*\(/, time: 'O(n³)', space: 'O(1)', reason: 'Triple nested loop detected' },
  { regex: /for\s*\([^)]*\)\s*\{[\s\S]*?for\s*\([^)]*\)/, time: 'O(n²)', space: 'O(1)', reason: 'Double nested loop detected' },
  { regex: /while\s*\([^)]*\/\s*=?\s*2|>>|mid\s*=|binary[_\s]?search/i, time: 'O(log n)', space: 'O(1)', reason: 'Binary search / halving pattern detected' },
  { regex: /\.sort\s*\(|sort\s*\(|merge\s*sort|quick\s*sort|heap\s*sort/i, time: 'O(n log n)', space: 'O(n)', reason: 'Sort operation detected' },
  { regex: /function\s+(\w+)[\s\S]*?\1\s*\(/, time: 'O(2ⁿ)', space: 'O(n)', reason: 'Recursive calls detected (potentially exponential)' },
  { regex: /for\s*\(|while\s*\(|\.forEach|\.map\s*\(|\.filter\s*\(|\.reduce\s*\(/i, time: 'O(n)', space: 'O(1)', reason: 'Single loop / linear traversal detected' },
  { regex: /\[.*\]\s*=|new\s+Array\s*\(|new\s+Map|new\s+Set|new\s+Object/i, time: 'O(1)', space: 'O(n)', reason: 'Array/collection allocation detected' },
  { regex: /Map|HashMap|dict|Set|Object\.keys/i, time: 'O(1)', space: 'O(n)', reason: 'Hash-based lookup (amortized O(1))' },
];

const SAMPLE_SNIPPETS = [
  {
    name: 'Two Sum',
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
  },
  {
    name: 'Bubble Sort',
    code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
  },
  {
    name: 'Binary Search',
    code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
  },
  {
    name: 'Fibonacci (Recursive)',
    code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
  },
  {
    name: 'Merge Sort',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
  },
];

export function ComplexityAnalyzerVisualizer() {
  const [code, setCode] = useState(SAMPLE_SNIPPETS[0].code);

  const analysis = useMemo((): AnalysisResult[] => {
    if (!code.trim()) return [];
    const results: AnalysisResult[] = [];
    const matchedPatterns = new Set<string>();

    for (const pattern of PATTERNS) {
      if (pattern.regex.test(code) && !matchedPatterns.has(pattern.time + pattern.space)) {
        matchedPatterns.add(pattern.time + pattern.space);
        results.push({
          complexity: pattern.time,
          reason: pattern.reason,
          type: 'time',
          confidence: pattern.regex.source.includes('sort') || pattern.regex.source.includes('for') ? 'high' : 'medium',
        });
        if (pattern.space !== 'O(1)') {
          results.push({
            complexity: pattern.space,
            reason: pattern.reason + ' (space)',
            type: 'space',
            confidence: 'medium',
          });
        }
      }
    }

    if (results.length === 0) {
      results.push({
        complexity: 'O(1)',
        reason: 'No loops or recursive calls detected',
        type: 'time',
        confidence: 'low',
      });
    }

    return results;
  }, [code]);

  // Get the dominant complexity
  const dominantTime = useMemo(() => {
    const order = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2ⁿ)'];
    const timeResults = analysis.filter(a => a.type === 'time');
    if (timeResults.length === 0) return 'O(1)';
    return timeResults.reduce((max, cur) =>
      order.indexOf(cur.complexity) > order.indexOf(max.complexity) ? cur : max
    ).complexity;
  }, [analysis]);

  const dominantSpace = useMemo(() => {
    const order = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2ⁿ)'];
    const spaceResults = analysis.filter(a => a.type === 'space');
    if (spaceResults.length === 0) return 'O(1)';
    return spaceResults.reduce((max, cur) =>
      order.indexOf(cur.complexity) > order.indexOf(max.complexity) ? cur : max
    ).complexity;
  }, [analysis]);

  const complexityColor = (c: string) => {
    if (c === 'O(1)' || c === 'O(log n)') return 'text-green-400';
    if (c === 'O(n)' || c === 'O(n log n)') return 'text-yellow-400';
    return 'text-red-400';
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="space-y-6">
      {/* Sample snippets */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted">Samples:</span>
        {SAMPLE_SNIPPETS.map(s => (
          <button key={s.name} onClick={() => setCode(s.code)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors">
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Code Input */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-secondary">
            <span className="text-xs font-bold text-muted">Code Input</span>
            <span className="text-[10px] text-muted">{lineCount} lines</span>
          </div>
          <div className="flex">
            <div className="py-3 px-2 text-right select-none border-r border-border/30">
              {code.split('\n').map((_, i) => (
                <div key={i} className="text-[10px] font-mono text-muted/50 leading-5">{i + 1}</div>
              ))}
            </div>
            <textarea value={code} onChange={e => setCode(e.target.value)} rows={Math.max(10, lineCount + 2)}
              className="flex-1 p-3 bg-transparent font-mono text-sm text-foreground leading-5 resize-none focus:outline-none"
              spellCheck={false} />
          </div>
        </div>

        {/* Analysis */}
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="text-xs font-bold text-muted mb-3">Estimated Complexity</h3>
            <div className="space-y-3">
              <div className="bg-surface-secondary rounded-lg p-3">
                <div className="text-[10px] text-muted mb-1">TIME</div>
                <div className={cn('text-2xl font-bold font-mono', complexityColor(dominantTime))}>{dominantTime}</div>
              </div>
              <div className="bg-surface-secondary rounded-lg p-3">
                <div className="text-[10px] text-muted mb-1">SPACE</div>
                <div className={cn('text-2xl font-bold font-mono', complexityColor(dominantSpace))}>{dominantSpace}</div>
              </div>
            </div>
          </div>

          {/* Detailed findings */}
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="text-xs font-bold text-muted mb-2">Analysis Details</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {analysis.map((a, i) => (
                <div key={i} className="flex items-start gap-2 bg-surface-secondary rounded-lg p-2 text-[11px]">
                  <div className={cn('shrink-0 mt-0.5', a.type === 'time' ? 'text-accent' : 'text-purple-400')}>
                    {a.type === 'time' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={cn('font-mono font-bold', complexityColor(a.complexity))}>{a.complexity}</span>
                      <span className="text-muted capitalize text-[9px] bg-surface px-1.5 rounded">{a.type}</span>
                    </div>
                    <div className="text-muted mt-0.5">{a.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-3">
            <div className="flex items-start gap-2 text-[11px] text-muted">
              <AlertCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
              <p>This is a heuristic-based analysis using pattern matching. Actual complexity may vary based on input constraints and implementation details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
