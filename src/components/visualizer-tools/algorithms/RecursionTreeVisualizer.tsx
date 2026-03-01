'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type RecursionFn = 'fibonacci' | 'factorial' | 'power';

interface TreeNode {
  id: string;
  label: string;
  result?: number;
  state: 'pending' | 'computing' | 'computed' | 'memoized';
  children: TreeNode[];
  depth: number;
  x?: number;
  y?: number;
}

const FN_INFO: Record<RecursionFn, { name: string; desc: string; maxInput: number }> = {
  fibonacci: { name: 'Fibonacci', desc: 'fib(n) = fib(n-1) + fib(n-2)', maxInput: 8 },
  factorial: { name: 'Factorial', desc: 'fact(n) = n × fact(n-1)', maxInput: 8 },
  power: { name: 'Power of 2', desc: 'pow(n) = 2 × pow(n-1)', maxInput: 6 },
};

let nodeId = 0;
function buildFibTree(n: number, depth: number): TreeNode {
  const id = String(++nodeId);
  if (n <= 1) return { id, label: `fib(${n})`, result: n, state: 'pending', children: [], depth };
  return { id, label: `fib(${n})`, state: 'pending', children: [buildFibTree(n - 1, depth + 1), buildFibTree(n - 2, depth + 1)], depth };
}

function buildFactTree(n: number, depth: number): TreeNode {
  const id = String(++nodeId);
  if (n <= 1) return { id, label: `fact(${n})`, result: 1, state: 'pending', children: [], depth };
  return { id, label: `fact(${n})`, state: 'pending', children: [buildFactTree(n - 1, depth + 1)], depth };
}

function buildPowTree(n: number, depth: number): TreeNode {
  const id = String(++nodeId);
  if (n <= 0) return { id, label: `pow(${n})`, result: 1, state: 'pending', children: [], depth };
  return { id, label: `pow(${n})`, state: 'pending', children: [buildPowTree(n - 1, depth + 1)], depth };
}

function flattenTree(node: TreeNode): TreeNode[] {
  const result: TreeNode[] = [node];
  for (const child of node.children) result.push(...flattenTree(child));
  return result;
}

function computeResult(node: TreeNode, fn: RecursionFn): number {
  if (node.result !== undefined) return node.result;
  if (fn === 'fibonacci') return computeResult(node.children[0], fn) + computeResult(node.children[1], fn);
  if (fn === 'factorial') {
    const n = parseInt(node.label.match(/\d+/)?.[0] || '0');
    return n * computeResult(node.children[0], fn);
  }
  return 2 * computeResult(node.children[0], fn);
}

function assignPositions(node: TreeNode, x: number, y: number, spread: number): void {
  node.x = x;
  node.y = y;
  const childCount = node.children.length;
  if (childCount === 1) {
    assignPositions(node.children[0], x, y + 60, spread / 2);
  } else if (childCount === 2) {
    assignPositions(node.children[0], x - spread, y + 60, spread / 2);
    assignPositions(node.children[1], x + spread, y + 60, spread / 2);
  }
}

export function RecursionTreeVisualizer() {
  const [fn, setFn] = useState<RecursionFn>('fibonacci');
  const [input, setInput] = useState(5);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [message, setMessage] = useState('Select a function and click Build & Animate');
  const [isAnimating, setIsAnimating] = useState(false);
  const [useMemo, setUseMemo] = useState(false);
  const [callCount, setCallCount] = useState(0);
  const cancelRef = useRef(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const buildTree = useCallback(() => {
    nodeId = 0;
    if (fn === 'fibonacci') return buildFibTree(input, 0);
    if (fn === 'factorial') return buildFactTree(input, 0);
    return buildPowTree(input, 0);
  }, [fn, input]);

  const animateTree = async () => {
    cancelRef.current = false;
    setIsAnimating(true);
    const root = buildTree();
    assignPositions(root, 250, 20, Math.min(100, 250 / (input + 1)));
    setTree({ ...root });
    setCallCount(0);

    const memo: Record<string, number> = {};
    let count = 0;

    const traverse = async (node: TreeNode): Promise<number> => {
      if (cancelRef.current) return 0;
      count++;
      setCallCount(count);

      if (useMemo && memo[node.label] !== undefined) {
        node.state = 'memoized';
        node.result = memo[node.label];
        setTree(prev => prev ? { ...prev } : null);
        setMessage(`${node.label} = ${node.result} (memoized)`);
        await sleep(300);
        return node.result;
      }

      node.state = 'computing';
      setTree(prev => prev ? { ...prev } : null);
      setMessage(`Computing ${node.label}...`);
      await sleep(400);

      if (node.children.length === 0) {
        node.state = 'computed';
        setTree(prev => prev ? { ...prev } : null);
        setMessage(`${node.label} = ${node.result} (base case)`);
        if (useMemo && node.result !== undefined) memo[node.label] = node.result;
        await sleep(200);
        return node.result ?? 0;
      }

      const results = [];
      for (const child of node.children) {
        results.push(await traverse(child));
      }

      node.result = computeResult(node, fn);
      node.state = 'computed';
      if (useMemo) memo[node.label] = node.result;
      setTree(prev => prev ? { ...prev } : null);
      setMessage(`${node.label} = ${node.result}`);
      await sleep(300);
      return node.result;
    };

    const result = await traverse(root);
    if (!cancelRef.current) {
      setMessage(`Result: ${root.label} = ${result}. Total calls: ${count}${useMemo ? ' (with memoization)' : ''}`);
    }
    setIsAnimating(false);
  };

  const reset = () => {
    cancelRef.current = true;
    setTree(null);
    setCallCount(0);
    setIsAnimating(false);
    setMessage('Select a function and click Build & Animate');
  };

  const stateColor = (state: string) => {
    switch (state) {
      case 'computing': return 'fill-yellow-500/30 stroke-yellow-500';
      case 'computed': return 'fill-green-500/30 stroke-green-500';
      case 'memoized': return 'fill-purple-500/30 stroke-purple-500';
      default: return 'fill-accent/10 stroke-accent/40';
    }
  };

  const stateText = (state: string) => {
    switch (state) {
      case 'computing': return 'fill-yellow-400';
      case 'computed': return 'fill-green-400';
      case 'memoized': return 'fill-purple-400';
      default: return 'fill-muted';
    }
  };

  const flatNodes = tree ? flattenTree(tree) : [];
  const maxX = Math.max(...flatNodes.map(n => n.x ?? 0), 500);
  const maxY = Math.max(...flatNodes.map(n => n.y ?? 0), 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        {Object.entries(FN_INFO).map(([key, info]) => (
          <button key={key} onClick={() => setFn(key as RecursionFn)} disabled={isAnimating}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              fn === key ? 'bg-accent/10 text-accent border-accent/30' : 'bg-surface-secondary text-muted border-border hover:text-foreground')}>
            {info.name}
          </button>
        ))}
        <input type="number" min={1} max={FN_INFO[fn].maxInput} value={input}
          onChange={e => setInput(Math.min(FN_INFO[fn].maxInput, Math.max(1, parseInt(e.target.value) || 1)))}
          disabled={isAnimating}
          className="w-16 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
        <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
          <input type="checkbox" checked={useMemo} onChange={e => setUseMemo(e.target.checked)} disabled={isAnimating}
            className="accent-accent" />
          Memoization
        </label>
        <button onClick={animateTree} disabled={isAnimating}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors disabled:opacity-50">
          <Play className="w-3.5 h-3.5 inline mr-1" />Animate
        </button>
        <button onClick={reset} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors ml-auto">
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset
        </button>
      </div>

      {message && (
        <motion.div key={message} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-sm text-accent font-mono bg-accent/5 px-3 py-2 rounded-lg border border-accent/20">{message}</motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 bg-surface rounded-xl border border-border p-4 overflow-x-auto">
          <h3 className="text-xs font-bold text-muted mb-2">Recursion Tree — {FN_INFO[fn].desc}</h3>
          {flatNodes.length > 0 ? (
            <svg width={maxX + 50} height={maxY + 60} className="mx-auto">
              {flatNodes.map(node =>
                node.children.map(child => (
                  <line key={`e-${node.id}-${child.id}`}
                    x1={node.x! + 25} y1={node.y! + 18}
                    x2={child.x! + 25} y2={child.y!}
                    className="stroke-border stroke-1" />
                ))
              )}
              {flatNodes.map(node => (
                <g key={node.id}>
                  <rect x={node.x!} y={node.y!} width={50} height={28} rx={6}
                    className={cn('stroke-2 transition-all duration-300', stateColor(node.state))} />
                  <text x={node.x! + 25} y={node.y! + 12} textAnchor="middle" className={cn('text-[9px] font-mono', stateText(node.state))}>
                    {node.label}
                  </text>
                  {node.result !== undefined && (
                    <text x={node.x! + 25} y={node.y! + 23} textAnchor="middle" className="text-[9px] font-mono font-bold fill-foreground">
                      = {node.result}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          ) : (
            <div className="text-muted text-sm italic text-center py-16">Click Animate to build tree</div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-surface rounded-xl border border-border p-4 text-xs">
            <h3 className="font-bold text-muted mb-2">Stats</h3>
            <div className="space-y-1 text-muted font-mono">
              <div>Function: <span className="text-accent">{FN_INFO[fn].name}</span></div>
              <div>Input: <span className="text-foreground">{input}</span></div>
              <div>Calls: <span className="text-foreground">{callCount}</span></div>
              <div>Memo: <span className={useMemo ? 'text-purple-400' : 'text-muted'}>{useMemo ? 'On' : 'Off'}</span></div>
            </div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-3">
            <h3 className="text-xs font-bold text-muted mb-2">Legend</h3>
            <div className="space-y-1.5 text-[11px]">
              {[['Pending', 'bg-accent/10 border-accent/40'], ['Computing', 'bg-yellow-500/20 border-yellow-500'], ['Computed', 'bg-green-500/20 border-green-500'], ['Memoized', 'bg-purple-500/20 border-purple-500']].map(([label, cls]) => (
                <div key={label as string} className="flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded border', cls)} />
                  <span className="text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
