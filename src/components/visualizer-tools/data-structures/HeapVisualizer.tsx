'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type HeapType = 'min' | 'max';

interface HeapNode {
  value: number;
  state: 'default' | 'comparing' | 'swapping' | 'inserting' | 'removing' | 'active';
}

function getParent(i: number) { return Math.floor((i - 1) / 2); }
function getLeft(i: number) { return 2 * i + 1; }
function getRight(i: number) { return 2 * i + 2; }

export function HeapVisualizer() {
  const [heap, setHeap] = useState<HeapNode[]>([
    { value: 5, state: 'default' },
    { value: 10, state: 'default' },
    { value: 8, state: 'default' },
    { value: 15, state: 'default' },
    { value: 20, state: 'default' },
    { value: 12, state: 'default' },
    { value: 9, state: 'default' },
  ]);
  const [heapType, setHeapType] = useState<HeapType>('min');
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const compare = useCallback((a: number, b: number): boolean => {
    return heapType === 'min' ? a < b : a > b;
  }, [heapType]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const insert = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) { setMessage('Enter a valid number'); return; }
    setIsAnimating(true);
    setInputValue('');

    const arr = [...heap, { value: val, state: 'inserting' as const }];
    setHeap([...arr]);
    setHistory(prev => [...prev, `Insert ${val}`]);
    await sleep(400);

    // Bubble up
    let i = arr.length - 1;
    while (i > 0) {
      const parent = getParent(i);
      arr[i] = { ...arr[i], state: 'comparing' };
      arr[parent] = { ...arr[parent], state: 'comparing' };
      setHeap([...arr]);
      await sleep(500);

      if (compare(arr[i].value, arr[parent].value)) {
        arr[i] = { ...arr[i], state: 'swapping' };
        arr[parent] = { ...arr[parent], state: 'swapping' };
        setHeap([...arr]);
        await sleep(400);

        const temp = arr[i].value;
        arr[i] = { ...arr[i], value: arr[parent].value, state: 'default' };
        arr[parent] = { ...arr[parent], value: temp, state: 'default' };
        setHeap([...arr]);
        i = parent;
      } else {
        arr[i] = { ...arr[i], state: 'default' };
        arr[parent] = { ...arr[parent], state: 'default' };
        setHeap([...arr]);
        break;
      }
    }

    arr.forEach((_, idx) => arr[idx] = { ...arr[idx], state: 'default' });
    setHeap([...arr]);
    setMessage(`Inserted ${val}. Heap property maintained.`);
    setIsAnimating(false);
  };

  const extractRoot = async () => {
    if (heap.length === 0) { setMessage('Heap is empty'); return; }
    setIsAnimating(true);

    const arr = [...heap];
    const extracted = arr[0].value;
    setHistory(prev => [...prev, `Extract ${extracted}`]);

    arr[0] = { ...arr[0], state: 'removing' };
    setHeap([...arr]);
    await sleep(400);

    if (arr.length === 1) {
      setHeap([]);
      setMessage(`Extracted ${extracted}. Heap is now empty.`);
      setIsAnimating(false);
      return;
    }

    // Move last to root
    arr[0] = { ...arr[arr.length - 1], state: 'active' };
    arr.pop();
    setHeap([...arr]);
    await sleep(400);

    // Bubble down
    let i = 0;
    while (true) {
      const left = getLeft(i);
      const right = getRight(i);
      let target = i;

      if (left < arr.length) {
        arr[left] = { ...arr[left], state: 'comparing' };
        if (compare(arr[left].value, arr[target].value)) target = left;
      }
      if (right < arr.length) {
        arr[right] = { ...arr[right], state: 'comparing' };
        if (compare(arr[right].value, arr[target].value)) target = right;
      }

      arr[i] = { ...arr[i], state: 'comparing' };
      setHeap([...arr]);
      await sleep(500);

      if (target !== i) {
        arr[i] = { ...arr[i], state: 'swapping' };
        arr[target] = { ...arr[target], state: 'swapping' };
        setHeap([...arr]);
        await sleep(400);

        const temp = arr[i].value;
        arr[i] = { ...arr[i], value: arr[target].value, state: 'default' };
        arr[target] = { ...arr[target], value: temp, state: 'default' };

        // Reset others
        if (left < arr.length && left !== target) arr[left] = { ...arr[left], state: 'default' };
        if (right < arr.length && right !== target) arr[right] = { ...arr[right], state: 'default' };

        setHeap([...arr]);
        i = target;
      } else {
        arr.forEach((_, idx) => arr[idx] = { ...arr[idx], state: 'default' });
        setHeap([...arr]);
        break;
      }
    }

    arr.forEach((_, idx) => arr[idx] = { ...arr[idx], state: 'default' });
    setHeap([...arr]);
    setMessage(`Extracted ${extracted} (${heapType === 'min' ? 'minimum' : 'maximum'}). Heapified.`);
    setIsAnimating(false);
  };

  const buildHeap = () => {
    const vals = [20, 15, 10, 8, 5, 12, 9];
    const arr = vals.map(v => ({ value: v, state: 'default' as const }));

    // Heapify
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      let idx = i;
      while (true) {
        const left = getLeft(idx);
        const right = getRight(idx);
        let target = idx;
        if (left < arr.length && compare(arr[left].value, arr[target].value)) target = left;
        if (right < arr.length && compare(arr[right].value, arr[target].value)) target = right;
        if (target !== idx) {
          const temp = arr[idx].value;
          arr[idx] = { ...arr[idx], value: arr[target].value };
          arr[target] = { ...arr[target], value: temp };
          idx = target;
        } else break;
      }
    }

    setHeap(arr);
    setHistory([]);
    setMessage(`Built ${heapType}-heap from array [${vals.join(', ')}]`);
  };

  const reset = () => {
    setIsAnimating(false);
    buildHeap();
  };

  const toggleType = () => {
    const newType = heapType === 'min' ? 'max' : 'min';
    setHeapType(newType);
    setMessage(`Switched to ${newType}-heap. Click Reset to rebuild.`);
  };

  // Tree layout helpers
  const getTreePositions = () => {
    if (heap.length === 0) return [];
    const width = 500;
    const positions: { x: number; y: number; parentX?: number; parentY?: number }[] = [];

    for (let i = 0; i < heap.length; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const posInLevel = i - (Math.pow(2, level) - 1);
      const nodesInLevel = Math.pow(2, level);
      const spacing = width / (nodesInLevel + 1);
      const x = spacing * (posInLevel + 1);
      const y = level * 70 + 30;
      const parentIdx = i > 0 ? getParent(i) : -1;
      positions.push({
        x,
        y,
        parentX: parentIdx >= 0 ? positions[parentIdx].x : undefined,
        parentY: parentIdx >= 0 ? positions[parentIdx].y : undefined,
      });
    }
    return positions;
  };

  const positions = getTreePositions();
  const svgHeight = heap.length > 0 ? (Math.floor(Math.log2(heap.length)) + 1) * 70 + 50 : 150;

  const stateColors: Record<string, { fill: string; stroke: string }> = {
    default: { fill: 'fill-accent/20', stroke: 'stroke-accent/50' },
    comparing: { fill: 'fill-yellow-500/20', stroke: 'stroke-yellow-500' },
    swapping: { fill: 'fill-red-500/20', stroke: 'stroke-red-500' },
    inserting: { fill: 'fill-green-500/20', stroke: 'stroke-green-500' },
    removing: { fill: 'fill-red-500/30', stroke: 'stroke-red-500' },
    active: { fill: 'fill-purple-500/20', stroke: 'stroke-purple-500' },
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={toggleType}
          disabled={isAnimating}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
            heapType === 'min'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
          )}
        >
          {heapType === 'min' ? <><ArrowUp className="w-3.5 h-3.5 inline mr-1" />Min-Heap</> : <><ArrowDown className="w-3.5 h-3.5 inline mr-1" />Max-Heap</>}
        </button>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value"
            className="w-20 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            disabled={isAnimating}
            onKeyDown={e => e.key === 'Enter' && insert()}
          />
          <button onClick={insert} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors disabled:opacity-50">
            <Plus className="w-3.5 h-3.5 inline mr-1" />Insert
          </button>
          <button onClick={extractRoot} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors disabled:opacity-50">
            <Trash2 className="w-3.5 h-3.5 inline mr-1" />Extract {heapType === 'min' ? 'Min' : 'Max'}
          </button>
        </div>
        <button onClick={reset} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors ml-auto">
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset
        </button>
      </div>

      {message && (
        <motion.div key={message} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-sm text-accent font-mono bg-accent/5 px-3 py-2 rounded-lg border border-accent/20">{message}</motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tree View */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-4">
          <h3 className="text-xs font-bold text-muted mb-2">Tree View</h3>
          {heap.length > 0 ? (
            <svg width={500} height={svgHeight} className="mx-auto">
              {positions.map((pos, i) =>
                pos.parentX !== undefined ? (
                  <line key={`e-${i}`} x1={pos.parentX} y1={(pos.parentY || 0) + 20} x2={pos.x} y2={pos.y}
                    className="stroke-border stroke-2" />
                ) : null
              )}
              {positions.map((pos, i) => {
                const colors = stateColors[heap[i].state];
                return (
                  <g key={`n-${i}`}>
                    <circle cx={pos.x} cy={pos.y + 10} r={20} className={cn('stroke-2 transition-all duration-300', colors.fill, colors.stroke)} />
                    <text x={pos.x} y={pos.y + 15} textAnchor="middle" className="text-xs font-mono font-bold fill-foreground">{heap[i].value}</text>
                  </g>
                );
              })}
            </svg>
          ) : (
            <div className="text-muted text-sm italic text-center py-12">Heap is empty</div>
          )}
        </div>

        {/* Array View + Info */}
        <div className="space-y-4">
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="text-xs font-bold text-muted mb-2">Array Representation</h3>
            <div className="flex flex-wrap gap-1">
              {heap.map((node, i) => (
                <div key={i} className={cn(
                  'w-10 h-10 rounded-lg border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-300',
                  node.state === 'comparing' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' :
                  node.state === 'swapping' ? 'bg-red-500/20 border-red-500 text-red-400' :
                  node.state === 'inserting' ? 'bg-green-500/20 border-green-500 text-green-400' :
                  'bg-accent/10 border-accent/30 text-foreground'
                )}>
                  {node.value}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {heap.map((_, i) => (
                <div key={i} className="w-10 text-center text-[9px] text-muted font-mono">[{i}]</div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-4 text-xs">
            <h3 className="font-bold text-muted mb-2">Properties</h3>
            <div className="space-y-1 text-muted font-mono">
              <div>Type: <span className={heapType === 'min' ? 'text-blue-400' : 'text-orange-400'}>{heapType}-heap</span></div>
              <div>Size: <span className="text-foreground">{heap.length}</span></div>
              <div>Root: <span className="text-accent">{heap[0]?.value ?? 'empty'}</span></div>
              <div>Insert: <span className="text-green-400">O(log n)</span></div>
              <div>Extract: <span className="text-green-400">O(log n)</span></div>
              <div>Peek: <span className="text-green-400">O(1)</span></div>
            </div>
          </div>

          {history.length > 0 && (
            <div className="bg-surface rounded-xl border border-border p-4 text-xs max-h-36 overflow-y-auto">
              <h3 className="font-bold text-muted mb-2">History</h3>
              {history.map((h, i) => (
                <div key={i} className="text-muted font-mono">{h}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
