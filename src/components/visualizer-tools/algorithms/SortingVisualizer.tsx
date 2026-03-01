'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, Shuffle, FastForward } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Bar {
  value: number;
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'min';
}

type SortAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';

const ALGO_INFO: Record<SortAlgorithm, { name: string; best: string; avg: string; worst: string; space: string; stable: boolean }> = {
  bubble: { name: 'Bubble Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true },
  selection: { name: 'Selection Sort', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: false },
  insertion: { name: 'Insertion Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true },
  merge: { name: 'Merge Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true },
  quick: { name: 'Quick Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: false },
};

function generateArray(size: number): Bar[] {
  return Array.from({ length: size }, () => ({
    value: Math.floor(Math.random() * 95) + 5,
    state: 'default' as const,
  }));
}

export function SortingVisualizer() {
  const [bars, setBars] = useState<Bar[]>(() => generateArray(30));
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [arraySize, setArraySize] = useState(30);
  const cancelRef = useRef(false);
  const speedRef = useRef(speed);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  const sleep = useCallback(() => {
    const ms = Math.max(1, 200 - speedRef.current * 2);
    return new Promise(resolve => setTimeout(resolve, ms));
  }, []);

  const newArray = () => {
    if (isRunning) return;
    setBars(generateArray(arraySize));
    setComparisons(0);
    setSwaps(0);
  };

  const resetStats = () => {
    setComparisons(0);
    setSwaps(0);
  };

  // ── Bubble Sort ──
  const bubbleSort = async () => {
    const arr = [...bars];
    const n = arr.length;
    let comp = 0, sw = 0;

    for (let i = 0; i < n - 1 && !cancelRef.current; i++) {
      for (let j = 0; j < n - i - 1 && !cancelRef.current; j++) {
        arr[j] = { ...arr[j], state: 'comparing' };
        arr[j + 1] = { ...arr[j + 1], state: 'comparing' };
        setBars([...arr]);
        comp++;
        setComparisons(comp);
        await sleep();

        if (arr[j].value > arr[j + 1].value) {
          arr[j] = { ...arr[j], state: 'swapping' };
          arr[j + 1] = { ...arr[j + 1], state: 'swapping' };
          setBars([...arr]);
          await sleep();

          const temp = arr[j].value;
          arr[j] = { ...arr[j], value: arr[j + 1].value };
          arr[j + 1] = { ...arr[j + 1], value: temp };
          sw++;
          setSwaps(sw);
        }

        arr[j] = { ...arr[j], state: 'default' };
        arr[j + 1] = { ...arr[j + 1], state: 'default' };
      }
      arr[n - i - 1] = { ...arr[n - i - 1], state: 'sorted' };
      setBars([...arr]);
    }
    arr[0] = { ...arr[0], state: 'sorted' };
    setBars([...arr]);
  };

  // ── Selection Sort ──
  const selectionSort = async () => {
    const arr = [...bars];
    const n = arr.length;
    let comp = 0, sw = 0;

    for (let i = 0; i < n - 1 && !cancelRef.current; i++) {
      let minIdx = i;
      arr[minIdx] = { ...arr[minIdx], state: 'min' };
      setBars([...arr]);

      for (let j = i + 1; j < n && !cancelRef.current; j++) {
        arr[j] = { ...arr[j], state: 'comparing' };
        setBars([...arr]);
        comp++;
        setComparisons(comp);
        await sleep();

        if (arr[j].value < arr[minIdx].value) {
          arr[minIdx] = { ...arr[minIdx], state: 'default' };
          minIdx = j;
          arr[minIdx] = { ...arr[minIdx], state: 'min' };
        } else {
          arr[j] = { ...arr[j], state: 'default' };
        }
        setBars([...arr]);
      }

      if (minIdx !== i) {
        arr[i] = { ...arr[i], state: 'swapping' };
        arr[minIdx] = { ...arr[minIdx], state: 'swapping' };
        setBars([...arr]);
        await sleep();

        const temp = arr[i].value;
        arr[i] = { ...arr[i], value: arr[minIdx].value };
        arr[minIdx] = { ...arr[minIdx], value: temp };
        sw++;
        setSwaps(sw);
      }

      arr[minIdx] = { ...arr[minIdx], state: 'default' };
      arr[i] = { ...arr[i], state: 'sorted' };
      setBars([...arr]);
    }
    arr[n - 1] = { ...arr[n - 1], state: 'sorted' };
    setBars([...arr]);
  };

  // ── Insertion Sort ──
  const insertionSort = async () => {
    const arr = [...bars];
    const n = arr.length;
    let comp = 0, sw = 0;

    arr[0] = { ...arr[0], state: 'sorted' };
    setBars([...arr]);

    for (let i = 1; i < n && !cancelRef.current; i++) {
      const key = arr[i].value;
      arr[i] = { ...arr[i], state: 'comparing' };
      setBars([...arr]);
      await sleep();

      let j = i - 1;
      while (j >= 0 && arr[j].value > key && !cancelRef.current) {
        comp++;
        setComparisons(comp);
        arr[j + 1] = { ...arr[j + 1], value: arr[j].value, state: 'swapping' };
        setBars([...arr]);
        await sleep();
        arr[j + 1] = { ...arr[j + 1], state: 'sorted' };
        sw++;
        setSwaps(sw);
        j--;
      }
      comp++;
      setComparisons(comp);
      arr[j + 1] = { ...arr[j + 1], value: key, state: 'sorted' };
      setBars([...arr]);
    }
  };

  // ── Merge Sort ──
  const mergeSort = async () => {
    const arr = [...bars];
    let comp = 0, sw = 0;

    const merge = async (start: number, mid: number, end: number) => {
      const left = arr.slice(start, mid + 1).map(b => b.value);
      const right = arr.slice(mid + 1, end + 1).map(b => b.value);
      let i = 0, j = 0, k = start;

      while (i < left.length && j < right.length && !cancelRef.current) {
        arr[k] = { ...arr[k], state: 'comparing' };
        setBars([...arr]);
        comp++;
        setComparisons(comp);
        await sleep();

        if (left[i] <= right[j]) {
          arr[k] = { value: left[i], state: 'swapping' };
          i++;
        } else {
          arr[k] = { value: right[j], state: 'swapping' };
          j++;
        }
        sw++;
        setSwaps(sw);
        setBars([...arr]);
        await sleep();
        arr[k] = { ...arr[k], state: 'default' };
        k++;
      }

      while (i < left.length && !cancelRef.current) {
        arr[k] = { value: left[i], state: 'default' };
        i++;
        k++;
        setBars([...arr]);
      }

      while (j < right.length && !cancelRef.current) {
        arr[k] = { value: right[j], state: 'default' };
        j++;
        k++;
        setBars([...arr]);
      }
    };

    const sort = async (start: number, end: number) => {
      if (start >= end || cancelRef.current) return;
      const mid = Math.floor((start + end) / 2);
      await sort(start, mid);
      await sort(mid + 1, end);
      await merge(start, mid, end);
    };

    await sort(0, arr.length - 1);
    setBars(arr.map(b => ({ ...b, state: 'sorted' as const })));
  };

  // ── Quick Sort ──
  const quickSort = async () => {
    const arr = [...bars];
    let comp = 0, sw = 0;

    const partition = async (low: number, high: number): Promise<number> => {
      const pivot = arr[high].value;
      arr[high] = { ...arr[high], state: 'pivot' };
      setBars([...arr]);
      let i = low - 1;

      for (let j = low; j < high && !cancelRef.current; j++) {
        arr[j] = { ...arr[j], state: 'comparing' };
        setBars([...arr]);
        comp++;
        setComparisons(comp);
        await sleep();

        if (arr[j].value < pivot) {
          i++;
          arr[j] = { ...arr[j], state: 'swapping' };
          arr[i] = { ...arr[i], state: 'swapping' };
          setBars([...arr]);
          await sleep();

          const temp = arr[i].value;
          arr[i] = { ...arr[i], value: arr[j].value };
          arr[j] = { ...arr[j], value: temp };
          sw++;
          setSwaps(sw);
        }

        arr[j] = { ...arr[j], state: 'default' };
        if (i >= low) arr[i] = { ...arr[i], state: 'default' };
        setBars([...arr]);
      }

      const temp = arr[i + 1].value;
      arr[i + 1] = { ...arr[i + 1], value: arr[high].value };
      arr[high] = { ...arr[high], value: temp, state: 'default' };
      arr[i + 1] = { ...arr[i + 1], state: 'sorted' };
      sw++;
      setSwaps(sw);
      setBars([...arr]);
      return i + 1;
    };

    const sort = async (low: number, high: number) => {
      if (low >= high || cancelRef.current) return;
      const pi = await partition(low, high);
      await sort(low, pi - 1);
      await sort(pi + 1, high);
    };

    await sort(0, arr.length - 1);
    setBars(arr.map(b => ({ ...b, state: 'sorted' as const })));
  };

  const run = async () => {
    cancelRef.current = false;
    setIsRunning(true);
    resetStats();

    const algos: Record<SortAlgorithm, () => Promise<void>> = {
      bubble: bubbleSort,
      selection: selectionSort,
      insertion: insertionSort,
      merge: mergeSort,
      quick: quickSort,
    };

    await algos[algorithm]();
    setIsRunning(false);
  };

  const stop = () => {
    cancelRef.current = true;
    setIsRunning(false);
  };

  const info = ALGO_INFO[algorithm];

  const barColors: Record<string, string> = {
    default: 'bg-accent/60',
    comparing: 'bg-yellow-500',
    swapping: 'bg-red-500',
    sorted: 'bg-green-500',
    pivot: 'bg-purple-500',
    min: 'bg-orange-500',
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted">Algorithm:</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as SortAlgorithm)}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted">Size:</label>
          <input
            type="range"
            min={10}
            max={80}
            value={arraySize}
            onChange={(e) => {
              const s = parseInt(e.target.value);
              setArraySize(s);
              if (!isRunning) setBars(generateArray(s));
            }}
            disabled={isRunning}
            className="w-24 accent-accent"
          />
          <span className="text-xs font-mono text-muted w-6">{arraySize}</span>
        </div>
        <div className="flex items-center gap-2">
          <FastForward className="w-3.5 h-3.5 text-muted" />
          <input
            type="range"
            min={1}
            max={100}
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-24 accent-accent"
          />
          <span className="text-xs font-mono text-muted w-6">{speed}%</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={isRunning ? stop : run}
            className={cn(
              'px-4 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              isRunning
                ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
            )}
          >
            {isRunning ? <><Pause className="w-3.5 h-3.5 inline mr-1" />Stop</> : <><Play className="w-3.5 h-3.5 inline mr-1" />Sort</>}
          </button>
          <button onClick={newArray} disabled={isRunning} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors disabled:opacity-50">
            <Shuffle className="w-3.5 h-3.5 inline mr-1" />New Array
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted">Comparisons:</span>
          <span className="font-mono font-bold text-yellow-400">{comparisons}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted">Swaps:</span>
          <span className="font-mono font-bold text-red-400">{swaps}</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex items-end gap-[1px] h-[280px]">
          {bars.map((bar, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 rounded-t-sm transition-all duration-75',
                barColors[bar.state]
              )}
              style={{ height: `${bar.value}%` }}
            />
          ))}
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <h3 className="font-bold text-foreground text-sm mb-3">{info.name}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <div className="text-muted mb-1">Best Case</div>
            <div className="font-mono font-bold text-green-400">{info.best}</div>
          </div>
          <div>
            <div className="text-muted mb-1">Average</div>
            <div className="font-mono font-bold text-yellow-400">{info.avg}</div>
          </div>
          <div>
            <div className="text-muted mb-1">Worst Case</div>
            <div className="font-mono font-bold text-red-400">{info.worst}</div>
          </div>
          <div>
            <div className="text-muted mb-1">Space</div>
            <div className="font-mono font-bold text-accent">{info.space}</div>
          </div>
          <div>
            <div className="text-muted mb-1">Stable</div>
            <div className={cn('font-mono font-bold', info.stable ? 'text-green-400' : 'text-red-400')}>
              {info.stable ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { label: 'Default', color: 'bg-accent/60' },
          { label: 'Comparing', color: 'bg-yellow-500' },
          { label: 'Swapping', color: 'bg-red-500' },
          { label: 'Sorted', color: 'bg-green-500' },
          { label: 'Pivot', color: 'bg-purple-500' },
          { label: 'Minimum', color: 'bg-orange-500' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={cn('w-3 h-3 rounded', l.color)} />
            <span className="text-muted">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
