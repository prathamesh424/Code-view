'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Problem = 'max-sum' | 'longest-substring' | 'min-window';

interface ArrayCell {
  value: string | number;
  state: 'default' | 'window' | 'left' | 'right' | 'optimal' | 'outside';
}

const PROBLEMS: Record<Problem, { name: string; desc: string }> = {
  'max-sum': { name: 'Max Sum Subarray', desc: 'Find the subarray of size K with maximum sum' },
  'longest-substring': { name: 'Longest Unique Substring', desc: 'Longest substring without repeating characters' },
  'min-window': { name: 'Smallest Window Sum ≥ Target', desc: 'Find the smallest subarray with sum ≥ target' },
};

export function SlidingWindowVisualizer() {
  const [problem, setProblem] = useState<Problem>('max-sum');
  const [cells, setCells] = useState<ArrayCell[]>([]);
  const [message, setMessage] = useState('Select a problem and click Animate');
  const [isAnimating, setIsAnimating] = useState(false);
  const [windowInfo, setWindowInfo] = useState<string>('');
  const [bestInfo, setBestInfo] = useState<string>('');
  const [leftPtr, setLeftPtr] = useState<number>(-1);
  const [rightPtr, setRightPtr] = useState<number>(-1);
  const cancelRef = useRef(false);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const initCells = (arr: (string | number)[]): ArrayCell[] =>
    arr.map((v) => ({ value: v, state: 'default' }));

  /* ── Max Sum Subarray (Fixed Window) ── */
  const animateMaxSum = async () => {
    const arr = [2, 1, 5, 1, 3, 2, 8, 1, 3, 2];
    const K = 3;
    const cells = initCells(arr);
    setCells([...cells]);
    setMessage(`Finding max sum subarray of size K=${K}`);
    await sleep(500);

    let windowSum = 0;
    let maxSum = -Infinity;
    let maxStart = 0;

    // Build first window
    for (let i = 0; i < K; i++) {
      if (cancelRef.current) return;
      windowSum += arr[i];
      cells[i] = { ...cells[i], state: 'window' };
      setRightPtr(i);
      setLeftPtr(0);
      setCells([...cells]);
      setWindowInfo(`Building window: sum = ${windowSum}`);
      await sleep(400);
    }
    maxSum = windowSum;
    maxStart = 0;
    setBestInfo(`Best: sum = ${maxSum} at [0..${K - 1}]`);
    await sleep(300);

    // Slide
    for (let i = K; i < arr.length; i++) {
      if (cancelRef.current) return;
      // Remove leftmost
      cells[i - K] = { ...cells[i - K], state: 'outside' };
      windowSum -= arr[i - K];
      // Add new right
      windowSum += arr[i];
      cells[i] = { ...cells[i], state: 'window' };
      setLeftPtr(i - K + 1);
      setRightPtr(i);
      setCells([...cells]);
      setWindowInfo(`Window [${i - K + 1}..${i}]: sum = ${windowSum}`);
      setMessage(`Slide → remove arr[${i - K}]=${arr[i - K]}, add arr[${i}]=${arr[i]}`);

      if (windowSum > maxSum) {
        maxSum = windowSum;
        maxStart = i - K + 1;
        setBestInfo(`Best: sum = ${maxSum} at [${maxStart}..${maxStart + K - 1}]`);
      }
      await sleep(500);
    }

    // Highlight optimal
    for (let i = 0; i < arr.length; i++) {
      cells[i] = {
        ...cells[i],
        state: i >= maxStart && i < maxStart + K ? 'optimal' : 'outside',
      };
    }
    setCells([...cells]);
    setMessage(`Maximum sum = ${maxSum} at indices [${maxStart}..${maxStart + K - 1}]`);
  };

  /* ── Longest Unique Substring (Variable Window) ── */
  const animateLongestSubstring = async () => {
    const str = 'abcabcbb';
    const arr = str.split('');
    const cells = initCells(arr);
    setCells([...cells]);
    setMessage('Finding longest substring without repeating characters');
    await sleep(500);

    const charSet = new Set<string>();
    let left = 0;
    let maxLen = 0;
    let maxStart = 0;

    for (let right = 0; right < arr.length; right++) {
      if (cancelRef.current) return;

      while (charSet.has(arr[right])) {
        if (cancelRef.current) return;
        charSet.delete(arr[left]);
        cells[left] = { ...cells[left], state: 'outside' };
        left++;
        setLeftPtr(left);
        setCells([...cells]);
        setMessage(`Shrink: duplicate '${arr[right]}' found, move left to ${left}`);
        await sleep(350);
      }

      charSet.add(arr[right]);
      cells[right] = { ...cells[right], state: 'window' };
      setRightPtr(right);
      setLeftPtr(left);
      setCells([...cells]);
      setWindowInfo(`Window: "${arr.slice(left, right + 1).join('')}" (len=${right - left + 1})`);

      if (right - left + 1 > maxLen) {
        maxLen = right - left + 1;
        maxStart = left;
        setBestInfo(`Best: "${arr.slice(maxStart, maxStart + maxLen).join('')}" (len=${maxLen})`);
      }
      await sleep(400);
    }

    // Highlight optimal
    for (let i = 0; i < arr.length; i++) {
      cells[i] = {
        ...cells[i],
        state: i >= maxStart && i < maxStart + maxLen ? 'optimal' : 'outside',
      };
    }
    setCells([...cells]);
    setMessage(`Longest unique substring: "${str.substring(maxStart, maxStart + maxLen)}" (length ${maxLen})`);
  };

  /* ── Smallest Window Sum ≥ Target (Variable Window) ── */
  const animateMinWindow = async () => {
    const arr = [2, 3, 1, 2, 4, 3];
    const target = 7;
    const cells = initCells(arr);
    setCells([...cells]);
    setMessage(`Finding smallest subarray with sum ≥ ${target}`);
    await sleep(500);

    let left = 0;
    let windowSum = 0;
    let minLen = Infinity;
    let minStart = 0;

    for (let right = 0; right < arr.length; right++) {
      if (cancelRef.current) return;
      windowSum += arr[right];
      cells[right] = { ...cells[right], state: 'window' };
      setRightPtr(right);
      setCells([...cells]);
      setWindowInfo(`Window [${left}..${right}]: sum = ${windowSum}`);
      setMessage(`Expand → add arr[${right}]=${arr[right]}, sum = ${windowSum}`);
      await sleep(400);

      while (windowSum >= target) {
        if (cancelRef.current) return;
        const curLen = right - left + 1;
        if (curLen < minLen) {
          minLen = curLen;
          minStart = left;
          setBestInfo(`Best: [${minStart}..${minStart + minLen - 1}] len=${minLen}, sum=${windowSum}`);
        }
        setMessage(`Shrink: sum ${windowSum} ≥ ${target}, try smaller window`);

        windowSum -= arr[left];
        cells[left] = { ...cells[left], state: 'outside' };
        left++;
        setLeftPtr(left);
        setCells([...cells]);
        setWindowInfo(`Window [${left}..${right}]: sum = ${windowSum}`);
        await sleep(350);
      }
    }

    // Highlight optimal
    for (let i = 0; i < arr.length; i++) {
      cells[i] = {
        ...cells[i],
        state: i >= minStart && i < minStart + minLen ? 'optimal' : 'outside',
      };
    }
    setCells([...cells]);
    setMessage(
      minLen === Infinity
        ? 'No subarray found'
        : `Smallest window: [${minStart}..${minStart + minLen - 1}], length = ${minLen}`
    );
  };

  const animate = async () => {
    cancelRef.current = false;
    setIsAnimating(true);
    setCells([]);
    setWindowInfo('');
    setBestInfo('');
    setLeftPtr(-1);
    setRightPtr(-1);
    await sleep(100);

    if (problem === 'max-sum') await animateMaxSum();
    else if (problem === 'longest-substring') await animateLongestSubstring();
    else await animateMinWindow();

    setIsAnimating(false);
  };

  const reset = () => {
    cancelRef.current = true;
    setCells([]);
    setWindowInfo('');
    setBestInfo('');
    setLeftPtr(-1);
    setRightPtr(-1);
    setIsAnimating(false);
    setMessage('Select a problem and click Animate');
  };

  const cellColor = (state: string) => {
    switch (state) {
      case 'window':
        return 'bg-blue-500/20 border-blue-500 text-blue-400';
      case 'left':
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'right':
        return 'bg-green-500/20 border-green-500 text-green-400';
      case 'optimal':
        return 'bg-accent/20 border-accent text-accent';
      case 'outside':
        return 'bg-surface-tertiary/50 border-border text-muted/50';
      default:
        return 'bg-surface-secondary border-border text-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Problem selector */}
      <div className="flex flex-wrap gap-3 items-center">
        {Object.entries(PROBLEMS).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setProblem(key as Problem)}
            disabled={isAnimating}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              problem === key
                ? 'bg-accent/10 text-accent border-accent/30'
                : 'bg-surface-secondary text-muted border-border hover:text-foreground'
            )}
          >
            {info.name}
          </button>
        ))}
        <button
          onClick={animate}
          disabled={isAnimating}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 inline mr-1" />
          Animate
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
          Reset
        </button>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-accent font-mono bg-accent/5 px-3 py-2 rounded-lg border border-accent/20"
        >
          {message}
        </motion.div>
      )}

      {/* Info bars */}
      <div className="flex flex-wrap gap-3">
        {windowInfo && (
          <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {windowInfo}
          </div>
        )}
        {bestInfo && (
          <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
            ✓ {bestInfo}
          </div>
        )}
      </div>

      {/* Array visualization */}
      <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
        <h3 className="text-xs font-bold text-muted mb-4">{PROBLEMS[problem].desc}</h3>

        {cells.length > 0 ? (
          <div className="space-y-4">
            {/* Pointer indicators */}
            <div className="flex gap-1 items-end">
              {cells.map((_, i) => (
                <div key={i} className="w-12 sm:w-14 text-center text-[10px] font-mono">
                  {i === leftPtr && i === rightPtr ? (
                    <span className="text-purple-400">L,R</span>
                  ) : i === leftPtr ? (
                    <span className="text-yellow-400">L ↓</span>
                  ) : i === rightPtr ? (
                    <span className="text-green-400">R ↓</span>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="flex gap-1">
              {cells.map((cell, i) => (
                <motion.div
                  key={i}
                  layout
                  className={cn(
                    'w-12 sm:w-14 h-12 sm:h-14 rounded-lg border-2 flex flex-col items-center justify-center font-mono transition-all duration-300',
                    cellColor(cell.state)
                  )}
                >
                  <span className="text-sm font-bold">{cell.value}</span>
                  <span className="text-[9px] opacity-50">[{i}]</span>
                </motion.div>
              ))}
            </div>

            {/* Window bracket */}
            {leftPtr >= 0 && rightPtr >= 0 && (
              <div className="flex gap-1">
                {cells.map((_, i) => (
                  <div key={i} className="w-12 sm:w-14 h-1 rounded-full">
                    {i >= leftPtr && i <= rightPtr && (
                      <div className="w-full h-full rounded-full bg-blue-500/50" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted text-sm italic text-center py-16">
            Click Animate to start the sliding window visualization
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-3 flex-wrap">
        {[
          ['In Window', 'bg-blue-500/20 border-blue-500'],
          ['Visited', 'bg-surface-tertiary/50 border-border'],
          ['Optimal', 'bg-accent/20 border-accent'],
        ].map(([label, cls]) => (
          <div key={label as string} className="flex items-center gap-2 text-[11px] text-muted">
            <div className={cn('w-3 h-3 rounded border', cls)} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
