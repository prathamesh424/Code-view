'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Shuffle, FastForward } from 'lucide-react';
import { cn } from '@/lib/utils';

type CellState = 'default' | 'comparing' | 'found' | 'eliminated' | 'low' | 'high' | 'mid';
type SearchAlgorithm = 'linear' | 'binary';

interface SearchItem {
  value: number;
  state: CellState;
}

function generateSortedArray(size: number): SearchItem[] {
  const arr: number[] = [];
  let v = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < size; i++) {
    arr.push(v);
    v += Math.floor(Math.random() * 8) + 1;
  }
  return arr.map(value => ({ value, state: 'default' as const }));
}

export function SearchingVisualizer() {
  const [items, setItems] = useState<SearchItem[]>(() => generateSortedArray(20));
  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>('binary');
  const [target, setTarget] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [steps, setSteps] = useState(0);
  const [message, setMessage] = useState('');
  const [arraySize, setArraySize] = useState(20);
  const cancelRef = useRef(false);
  const speedRef = useRef(speed);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  const sleep = useCallback(() => {
    const ms = Math.max(50, 500 - speedRef.current * 4);
    return new Promise(resolve => setTimeout(resolve, ms));
  }, []);

  const newArray = () => {
    if (isRunning) return;
    setItems(generateSortedArray(arraySize));
    setSteps(0);
    setMessage('');
  };

  const linearSearch = async () => {
    const val = parseInt(target);
    if (isNaN(val)) { setMessage('Enter a number to search'); return; }
    cancelRef.current = false;
    setIsRunning(true);
    const arr: SearchItem[] = items.map(i => ({ ...i, state: 'default' as CellState }));
    let stepCount = 0;
    let found = -1;

    for (let i = 0; i < arr.length && !cancelRef.current; i++) {
      arr[i] = { ...arr[i], state: 'comparing' as CellState };
      setItems([...arr]);
      stepCount++;
      setSteps(stepCount);
      await sleep();

      if (arr[i].value === val) {
        arr[i] = { ...arr[i], state: 'found' as CellState };
        setItems([...arr]);
        found = i;
        break;
      }

      arr[i] = { ...arr[i], state: 'eliminated' as CellState };
      setItems([...arr]);
    }

    setMessage(found >= 0
      ? `Found ${val} at index ${found} in ${stepCount} steps`
      : `${val} not found after ${stepCount} comparisons`
    );
    setIsRunning(false);
  };

  const binarySearch = async () => {
    const val = parseInt(target);
    if (isNaN(val)) { setMessage('Enter a number to search'); return; }
    cancelRef.current = false;
    setIsRunning(true);
    const arr: SearchItem[] = items.map(i => ({ ...i, state: 'default' as CellState }));
    let stepCount = 0;
    let low = 0, high = arr.length - 1;
    let found = -1;

    while (low <= high && !cancelRef.current) {
      const mid = Math.floor((low + high) / 2);

      // Reset states in current range
      for (let i = 0; i < arr.length; i++) {
        if (i < low || i > high) {
          arr[i] = { ...arr[i], state: 'eliminated' as CellState };
        } else {
          arr[i] = { ...arr[i], state: 'default' as CellState };
        }
      }

      arr[low] = { ...arr[low], state: 'low' as CellState };
      arr[high] = { ...arr[high], state: 'high' as CellState };
      arr[mid] = { ...arr[mid], state: 'mid' as CellState };
      setItems([...arr]);
      stepCount++;
      setSteps(stepCount);
      await sleep();
      await sleep();

      if (arr[mid].value === val) {
        arr[mid] = { ...arr[mid], state: 'found' as CellState };
        setItems([...arr]);
        found = mid;
        break;
      } else if (arr[mid].value < val) {
        arr[mid] = { ...arr[mid], state: 'comparing' as CellState };
        setItems([...arr]);
        await sleep();
        // Eliminate left half
        for (let i = low; i <= mid; i++) {
          arr[i] = { ...arr[i], state: 'eliminated' as CellState };
        }
        low = mid + 1;
      } else {
        arr[mid] = { ...arr[mid], state: 'comparing' as CellState };
        setItems([...arr]);
        await sleep();
        // Eliminate right half
        for (let i = mid; i <= high; i++) {
          arr[i] = { ...arr[i], state: 'eliminated' as CellState };
        }
        high = mid - 1;
      }
      setItems([...arr]);
    }

    setMessage(found >= 0
      ? `Found ${val} at index ${found} in ${stepCount} steps (Binary Search)`
      : `${val} not found after ${stepCount} comparisons`
    );
    setIsRunning(false);
  };

  const run = () => {
    if (algorithm === 'linear') linearSearch();
    else binarySearch();
  };

  const stop = () => {
    cancelRef.current = true;
    setIsRunning(false);
  };

  const cellColors: Record<CellState, string> = {
    default: 'bg-accent/15 border-accent/30 text-foreground',
    comparing: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    found: 'bg-green-500/25 border-green-500 text-green-400 font-bold',
    eliminated: 'bg-surface-tertiary/50 border-border/50 text-muted/50',
    low: 'bg-blue-500/20 border-blue-500 text-blue-400',
    high: 'bg-purple-500/20 border-purple-500 text-purple-400',
    mid: 'bg-orange-500/20 border-orange-500 text-orange-400 font-bold',
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted">Algorithm:</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as SearchAlgorithm)}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="linear">Linear Search</option>
            <option value="binary">Binary Search</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Target"
            disabled={isRunning}
            className="w-20 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            onKeyDown={e => e.key === 'Enter' && !isRunning && run()}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted">Size:</label>
          <input
            type="range"
            min={8}
            max={40}
            value={arraySize}
            onChange={(e) => {
              const s = parseInt(e.target.value);
              setArraySize(s);
              if (!isRunning) setItems(generateSortedArray(s));
            }}
            disabled={isRunning}
            className="w-20 accent-accent"
          />
          <span className="text-xs font-mono text-muted">{arraySize}</span>
        </div>
        <div className="flex items-center gap-2">
          <FastForward className="w-3.5 h-3.5 text-muted" />
          <input
            type="range"
            min={1}
            max={100}
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-20 accent-accent"
          />
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={isRunning ? stop : run}
            className={cn(
              'px-4 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              isRunning
                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
            )}
          >
            {isRunning ? <><Pause className="w-3.5 h-3.5 inline mr-1" />Stop</> : <><Play className="w-3.5 h-3.5 inline mr-1" />Search</>}
          </button>
          <button onClick={newArray} disabled={isRunning} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors disabled:opacity-50">
            <Shuffle className="w-3.5 h-3.5 inline mr-1" />New
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted">Steps:</span>
          <span className="font-mono font-bold text-accent">{steps}</span>
        </div>
        {message && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-accent font-mono"
          >
            {message}
          </motion.span>
        )}
      </div>

      {/* Array Visualization */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-end gap-1 flex-wrap justify-center">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              layout
              className="flex flex-col items-center gap-1"
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-lg border-2 flex items-center justify-center font-mono text-sm transition-all duration-200',
                  cellColors[item.state]
                )}
              >
                {item.value}
              </div>
              <span className="text-[10px] text-muted font-mono">{idx}</span>
              {item.state === 'low' && <span className="text-[9px] text-blue-400 font-mono font-bold">LOW</span>}
              {item.state === 'high' && <span className="text-[9px] text-purple-400 font-mono font-bold">HIGH</span>}
              {item.state === 'mid' && <span className="text-[9px] text-orange-400 font-mono font-bold">MID</span>}
              {item.state === 'found' && <span className="text-[9px] text-green-400 font-mono font-bold">FOUND!</span>}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="grid grid-cols-2 gap-6 text-xs">
          <div>
            <h4 className="font-bold text-foreground mb-2">Linear Search</h4>
            <div className="space-y-1 text-muted font-mono">
              <div>Time: <span className="text-yellow-400">O(n)</span></div>
              <div>Space: <span className="text-green-400">O(1)</span></div>
              <div>Requires sorted: <span className="text-green-400">No</span></div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-2">Binary Search</h4>
            <div className="space-y-1 text-muted font-mono">
              <div>Time: <span className="text-green-400">O(log n)</span></div>
              <div>Space: <span className="text-green-400">O(1)</span></div>
              <div>Requires sorted: <span className="text-yellow-400">Yes</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { label: 'Default', color: 'bg-accent/15 border-accent/30' },
          { label: 'Comparing', color: 'bg-yellow-500/20 border-yellow-500' },
          { label: 'Found', color: 'bg-green-500/25 border-green-500' },
          { label: 'Eliminated', color: 'bg-surface-tertiary/50 border-border/50' },
          { label: 'Low', color: 'bg-blue-500/20 border-blue-500' },
          { label: 'Mid', color: 'bg-orange-500/20 border-orange-500' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={cn('w-3 h-3 rounded border', l.color)} />
            <span className="text-muted">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
