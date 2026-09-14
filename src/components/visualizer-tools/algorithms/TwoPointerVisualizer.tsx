'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Problem = 'two-sum' | 'container-water' | 'remove-duplicates';

interface ArrayCell {
  value: number;
  state: 'default' | 'left' | 'right' | 'found' | 'visited' | 'removed';
}

const PROBLEMS: Record<Problem, { name: string; desc: string }> = {
  'two-sum': { name: 'Two Sum (Sorted)', desc: 'Find two numbers that add up to target in a sorted array' },
  'container-water': { name: 'Container With Most Water', desc: 'Find two lines forming the container with most water' },
  'remove-duplicates': { name: 'Remove Duplicates', desc: 'Remove duplicates from sorted array in-place' },
};

export function TwoPointerVisualizer() {
  const [problem, setProblem] = useState<Problem>('two-sum');
  const [cells, setCells] = useState<ArrayCell[]>([]);
  const [message, setMessage] = useState('Select a problem and click Animate');
  const [isAnimating, setIsAnimating] = useState(false);
  const [leftPtr, setLeftPtr] = useState<number>(-1);
  const [rightPtr, setRightPtr] = useState<number>(-1);
  const [infoText, setInfoText] = useState('');
  const [waterBars, setWaterBars] = useState<{ height: number; state: string }[]>([]);
  const cancelRef = useRef(false);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  /* ── Two Sum Sorted ── */
  const animateTwoSum = async () => {
    const arr = [1, 2, 4, 6, 8, 11, 15];
    const target = 13;
    const cells: ArrayCell[] = arr.map((v) => ({ value: v, state: 'default' }));
    setCells([...cells]);
    setWaterBars([]);
    setMessage(`Finding two numbers that sum to ${target}`);
    await sleep(500);

    let left = 0, right = arr.length - 1;

    while (left < right) {
      if (cancelRef.current) return;
      // Reset previous
      cells.forEach((c, i) => {
        if (c.state !== 'found') cells[i] = { ...c, state: 'default' };
      });
      cells[left] = { ...cells[left], state: 'left' };
      cells[right] = { ...cells[right], state: 'right' };
      setLeftPtr(left);
      setRightPtr(right);
      setCells([...cells]);

      const sum = arr[left] + arr[right];
      setInfoText(`arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]} = ${sum}`);

      if (sum === target) {
        cells[left] = { ...cells[left], state: 'found' };
        cells[right] = { ...cells[right], state: 'found' };
        setCells([...cells]);
        setMessage(`Found! arr[${left}]=${arr[left]} + arr[${right}]=${arr[right]} = ${target}`);
        return;
      } else if (sum < target) {
        setMessage(`Sum ${sum} < ${target} → move left pointer right`);
        await sleep(600);
        cells[left] = { ...cells[left], state: 'visited' };
        left++;
      } else {
        setMessage(`Sum ${sum} > ${target} → move right pointer left`);
        await sleep(600);
        cells[right] = { ...cells[right], state: 'visited' };
        right--;
      }
      setCells([...cells]);
      await sleep(400);
    }
    setMessage('No pair found');
  };

  /* ── Container With Most Water ── */
  const animateContainerWater = async () => {
    const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
    const bars = heights.map((h) => ({ height: h, state: 'default' }));
    setWaterBars([...bars]);
    setCells([]);
    setMessage('Finding container with most water');
    await sleep(500);

    let left = 0, right = heights.length - 1;
    let maxArea = 0;
    let bestLeft = 0, bestRight = 0;

    while (left < right) {
      if (cancelRef.current) return;
      bars.forEach((b, i) => {
        if (i !== bestLeft && i !== bestRight) bars[i] = { ...b, state: 'default' };
      });
      bars[left] = { ...bars[left], state: 'left' };
      bars[right] = { ...bars[right], state: 'right' };
      setLeftPtr(left);
      setRightPtr(right);
      setWaterBars([...bars]);

      const area = Math.min(heights[left], heights[right]) * (right - left);
      setInfoText(`Area = min(${heights[left]}, ${heights[right]}) × ${right - left} = ${area}`);

      if (area > maxArea) {
        maxArea = area;
        bestLeft = left;
        bestRight = right;
        setMessage(`New max area: ${maxArea} at [${left}, ${right}]`);
      } else {
        setMessage(`Area ${area}, max remains ${maxArea}`);
      }
      await sleep(500);

      if (heights[left] < heights[right]) {
        bars[left] = { ...bars[left], state: 'visited' };
        left++;
      } else {
        bars[right] = { ...bars[right], state: 'visited' };
        right--;
      }
      setWaterBars([...bars]);
      await sleep(300);
    }

    bars.forEach((_, i) => {
      bars[i] = { ...bars[i], state: i === bestLeft || i === bestRight ? 'found' : 'visited' };
    });
    setWaterBars([...bars]);
    setMessage(`Maximum area = ${maxArea} between indices [${bestLeft}] and [${bestRight}]`);
  };

  /* ── Remove Duplicates ── */
  const animateRemoveDuplicates = async () => {
    const arr = [1, 1, 2, 2, 3, 4, 4, 5, 5, 5];
    const cells: ArrayCell[] = arr.map((v) => ({ value: v, state: 'default' }));
    setCells([...cells]);
    setWaterBars([]);
    setMessage('Remove duplicates in-place from sorted array');
    await sleep(500);

    let slow = 0;
    cells[0] = { ...cells[0], state: 'left' };
    setLeftPtr(0);
    setCells([...cells]);
    await sleep(400);

    for (let fast = 1; fast < arr.length; fast++) {
      if (cancelRef.current) return;
      cells[fast] = { ...cells[fast], state: 'right' };
      setRightPtr(fast);
      setCells([...cells]);
      setInfoText(`slow=${slow} (val=${arr[slow]}), fast=${fast} (val=${arr[fast]})`);

      if (arr[fast] !== arr[slow]) {
        slow++;
        arr[slow] = arr[fast];
        cells[slow] = { value: arr[slow], state: 'found' };
        setLeftPtr(slow);
        setMessage(`Unique! Move slow to ${slow}, copy ${arr[fast]}`);
      } else {
        cells[fast] = { ...cells[fast], state: 'removed' };
        setMessage(`Duplicate ${arr[fast]}, skip`);
      }
      setCells([...cells]);
      await sleep(500);
    }

    // Mark final unique portion
    for (let i = 0; i <= slow; i++) {
      cells[i] = { ...cells[i], state: 'found' };
    }
    for (let i = slow + 1; i < arr.length; i++) {
      cells[i] = { ...cells[i], state: 'removed' };
    }
    setCells([...cells]);
    setMessage(`${slow + 1} unique elements: [${arr.slice(0, slow + 1).join(', ')}]`);
  };

  const animate = async () => {
    cancelRef.current = false;
    setIsAnimating(true);
    setCells([]);
    setWaterBars([]);
    setInfoText('');
    setLeftPtr(-1);
    setRightPtr(-1);
    await sleep(100);

    if (problem === 'two-sum') await animateTwoSum();
    else if (problem === 'container-water') await animateContainerWater();
    else await animateRemoveDuplicates();

    setIsAnimating(false);
  };

  const reset = () => {
    cancelRef.current = true;
    setCells([]);
    setWaterBars([]);
    setInfoText('');
    setLeftPtr(-1);
    setRightPtr(-1);
    setIsAnimating(false);
    setMessage('Select a problem and click Animate');
  };

  const cellColor = (state: string) => {
    switch (state) {
      case 'left': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'right': return 'bg-cyan-500/20 border-cyan-500 text-cyan-400';
      case 'found': return 'bg-accent/20 border-accent text-accent';
      case 'visited': return 'bg-surface-tertiary/50 border-border text-muted/50';
      case 'removed': return 'bg-red-500/10 border-red-500/30 text-red-400/50 line-through';
      default: return 'bg-surface-secondary border-border text-foreground';
    }
  };

  const barColor = (state: string) => {
    switch (state) {
      case 'left': return 'bg-yellow-500';
      case 'right': return 'bg-cyan-500';
      case 'found': return 'bg-accent';
      case 'visited': return 'bg-muted/30';
      default: return 'bg-blue-500/60';
    }
  };

  return (
    <div className="space-y-6">
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
          <Play className="w-3.5 h-3.5 inline mr-1" />Animate
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset
        </button>
      </div>

      {message && (
        <motion.div key={message} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-sm text-accent font-mono bg-accent/5 px-3 py-2 rounded-lg border border-accent/20"
        >
          {message}
        </motion.div>
      )}

      {infoText && (
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {infoText}
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
        <h3 className="text-xs font-bold text-muted mb-4">{PROBLEMS[problem].desc}</h3>

        {/* Array cells */}
        {cells.length > 0 && (
          <div className="space-y-3">
            <div className="flex gap-1 items-end">
              {cells.map((_, i) => (
                <div key={i} className="w-12 sm:w-14 text-center text-[10px] font-mono">
                  {i === leftPtr && i === rightPtr ? (
                    <span className="text-purple-400">L,R</span>
                  ) : i === leftPtr ? (
                    <span className="text-yellow-400">L ↓</span>
                  ) : i === rightPtr ? (
                    <span className="text-cyan-400">R ↓</span>
                  ) : null}
                </div>
              ))}
            </div>
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
          </div>
        )}

        {/* Water bars */}
        {waterBars.length > 0 && (
          <div className="flex gap-2 items-end h-48 mt-4">
            {waterBars.map((bar, i) => {
              const maxH = Math.max(...waterBars.map(b => b.height));
              const hPercent = (bar.height / maxH) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-muted">{bar.height}</span>
                  <motion.div
                    className={cn('w-full rounded-t-md transition-colors duration-300', barColor(bar.state))}
                    style={{ height: `${hPercent}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${hPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="text-[9px] font-mono text-muted">{i}</span>
                </div>
              );
            })}
          </div>
        )}

        {cells.length === 0 && waterBars.length === 0 && (
          <div className="text-muted text-sm italic text-center py-16">
            Click Animate to start the two-pointer visualization
          </div>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        {[
          ['Left Pointer', 'bg-yellow-500/20 border-yellow-500'],
          ['Right Pointer', 'bg-cyan-500/20 border-cyan-500'],
          ['Found/Unique', 'bg-accent/20 border-accent'],
          ['Visited', 'bg-surface-tertiary/50 border-border'],
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
