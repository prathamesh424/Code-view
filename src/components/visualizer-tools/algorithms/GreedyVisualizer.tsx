'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Problem = 'activity-selection' | 'fractional-knapsack' | 'job-sequencing';

interface Activity {
  id: string;
  start: number;
  end: number;
  state: 'default' | 'considering' | 'selected' | 'rejected';
}

interface KnapsackItem {
  id: string;
  weight: number;
  value: number;
  ratio: number;
  fraction: number;
  state: 'default' | 'considering' | 'selected' | 'partial' | 'rejected';
}

interface Job {
  id: string;
  deadline: number;
  profit: number;
  state: 'default' | 'considering' | 'selected' | 'rejected';
  slot: number;
}

const PROBLEMS: Record<Problem, { name: string; desc: string }> = {
  'activity-selection': { name: 'Activity Selection', desc: 'Select maximum non-overlapping activities (greedy by earliest finish time)' },
  'fractional-knapsack': { name: 'Fractional Knapsack', desc: 'Maximize value with fractional items allowed (greedy by value/weight ratio)' },
  'job-sequencing': { name: 'Job Sequencing', desc: 'Maximize profit by scheduling jobs before their deadlines' },
};

export function GreedyVisualizer() {
  const [problem, setProblem] = useState<Problem>('activity-selection');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [knapsackItems, setKnapsackItems] = useState<KnapsackItem[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [slots, setSlots] = useState<(string | null)[]>([]);
  const [message, setMessage] = useState('Select a problem and click Animate');
  const [isAnimating, setIsAnimating] = useState(false);
  const [infoText, setInfoText] = useState('');
  const cancelRef = useRef(false);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  /* ── Activity Selection ── */
  const animateActivitySelection = async () => {
    const acts: Activity[] = [
      { id: 'A', start: 1, end: 3, state: 'default' as const },
      { id: 'B', start: 2, end: 5, state: 'default' as const },
      { id: 'C', start: 3, end: 4, state: 'default' as const },
      { id: 'D', start: 0, end: 7, state: 'default' as const },
      { id: 'E', start: 5, end: 8, state: 'default' as const },
      { id: 'F', start: 6, end: 9, state: 'default' as const },
      { id: 'G', start: 8, end: 10, state: 'default' as const },
    ].sort((a, b) => a.end - b.end);

    setActivities([...acts]);
    setKnapsackItems([]);
    setJobs([]);
    setSlots([]);
    setMessage('Greedy strategy: sort by finish time, pick non-overlapping');
    await sleep(800);

    const selected: string[] = [];
    let lastEnd = -1;

    for (let i = 0; i < acts.length; i++) {
      if (cancelRef.current) return;
      acts[i] = { ...acts[i], state: 'considering' };
      setActivities([...acts]);
      setMessage(`Considering ${acts[i].id}: [${acts[i].start}, ${acts[i].end})`);
      await sleep(600);

      if (acts[i].start >= lastEnd) {
        acts[i] = { ...acts[i], state: 'selected' };
        selected.push(acts[i].id);
        lastEnd = acts[i].end;
        setInfoText(`Selected: {${selected.join(', ')}} | Last end = ${lastEnd}`);
        setMessage(`✓ Select ${acts[i].id} — starts at ${acts[i].start} ≥ last end ${lastEnd === acts[i].end ? '(first)' : ''}`);
      } else {
        acts[i] = { ...acts[i], state: 'rejected' };
        setMessage(`✗ Reject ${acts[i].id} — starts at ${acts[i].start} < last end ${lastEnd}`);
      }
      setActivities([...acts]);
      await sleep(500);
    }

    setMessage(`Maximum ${selected.length} activities selected: {${selected.join(', ')}}`);
  };

  /* ── Fractional Knapsack ── */
  const animateFractionalKnapsack = async () => {
    const capacity = 15;
    const items: KnapsackItem[] = [
      { id: 'I1', weight: 5, value: 60, ratio: 12, fraction: 0, state: 'default' as const },
      { id: 'I2', weight: 3, value: 45, ratio: 15, fraction: 0, state: 'default' as const },
      { id: 'I3', weight: 6, value: 48, ratio: 8, fraction: 0, state: 'default' as const },
      { id: 'I4', weight: 4, value: 40, ratio: 10, fraction: 0, state: 'default' as const },
      { id: 'I5', weight: 2, value: 10, ratio: 5, fraction: 0, state: 'default' as const },
    ].sort((a, b) => b.ratio - a.ratio);

    setKnapsackItems([...items]);
    setActivities([]);
    setJobs([]);
    setSlots([]);
    setMessage(`Greedy: sort by value/weight ratio, capacity = ${capacity}`);
    await sleep(800);

    let remainingCapacity = capacity;
    let totalValue = 0;

    for (let i = 0; i < items.length; i++) {
      if (cancelRef.current) return;
      items[i] = { ...items[i], state: 'considering' };
      setKnapsackItems([...items]);
      setMessage(`Considering ${items[i].id}: w=${items[i].weight}, v=${items[i].value}, ratio=${items[i].ratio}`);
      await sleep(600);

      if (remainingCapacity <= 0) {
        items[i] = { ...items[i], state: 'rejected' };
        setMessage(`✗ No capacity left, reject ${items[i].id}`);
      } else if (items[i].weight <= remainingCapacity) {
        items[i] = { ...items[i], state: 'selected', fraction: 1 };
        remainingCapacity -= items[i].weight;
        totalValue += items[i].value;
        setMessage(`✓ Take all of ${items[i].id} (fraction=1.0)`);
      } else {
        const frac = remainingCapacity / items[i].weight;
        items[i] = { ...items[i], state: 'partial', fraction: frac };
        totalValue += items[i].value * frac;
        remainingCapacity = 0;
        setMessage(`◐ Take ${(frac * 100).toFixed(1)}% of ${items[i].id}`);
      }
      setInfoText(`Total value: ${totalValue.toFixed(1)} | Remaining capacity: ${remainingCapacity}`);
      setKnapsackItems([...items]);
      await sleep(500);
    }

    setMessage(`Maximum value = ${totalValue.toFixed(1)} with capacity ${capacity}`);
  };

  /* ── Job Sequencing ── */
  const animateJobSequencing = async () => {
    const jobsData: Job[] = [
      { id: 'J1', deadline: 2, profit: 100, state: 'default' as const, slot: -1 },
      { id: 'J2', deadline: 1, profit: 19, state: 'default' as const, slot: -1 },
      { id: 'J3', deadline: 2, profit: 27, state: 'default' as const, slot: -1 },
      { id: 'J4', deadline: 1, profit: 25, state: 'default' as const, slot: -1 },
      { id: 'J5', deadline: 3, profit: 15, state: 'default' as const, slot: -1 },
    ].sort((a, b) => b.profit - a.profit);

    const maxDeadline = Math.max(...jobsData.map(j => j.deadline));
    const slotArr: (string | null)[] = Array(maxDeadline).fill(null);

    setJobs([...jobsData]);
    setSlots([...slotArr]);
    setActivities([]);
    setKnapsackItems([]);
    setMessage('Greedy: sort by profit descending, assign to latest available slot');
    await sleep(800);

    let totalProfit = 0;

    for (let i = 0; i < jobsData.length; i++) {
      if (cancelRef.current) return;
      jobsData[i] = { ...jobsData[i], state: 'considering' };
      setJobs([...jobsData]);
      setMessage(`Considering ${jobsData[i].id}: profit=${jobsData[i].profit}, deadline=${jobsData[i].deadline}`);
      await sleep(600);

      let assigned = false;
      for (let s = jobsData[i].deadline - 1; s >= 0; s--) {
        if (slotArr[s] === null) {
          slotArr[s] = jobsData[i].id;
          jobsData[i] = { ...jobsData[i], state: 'selected', slot: s };
          totalProfit += jobsData[i].profit;
          assigned = true;
          setMessage(`✓ Assign ${jobsData[i].id} to slot ${s + 1}`);
          break;
        }
      }

      if (!assigned) {
        jobsData[i] = { ...jobsData[i], state: 'rejected' };
        setMessage(`✗ No slot available for ${jobsData[i].id}`);
      }

      setJobs([...jobsData]);
      setSlots([...slotArr]);
      setInfoText(`Total profit: ${totalProfit} | Slots: [${slotArr.map(s => s || '_').join(', ')}]`);
      await sleep(500);
    }

    setMessage(`Maximum profit = ${totalProfit} with ${slotArr.filter(Boolean).length} jobs scheduled`);
  };

  const animate = async () => {
    cancelRef.current = false;
    setIsAnimating(true);
    setActivities([]);
    setKnapsackItems([]);
    setJobs([]);
    setSlots([]);
    setInfoText('');
    await sleep(100);

    if (problem === 'activity-selection') await animateActivitySelection();
    else if (problem === 'fractional-knapsack') await animateFractionalKnapsack();
    else await animateJobSequencing();

    setIsAnimating(false);
  };

  const reset = () => {
    cancelRef.current = true;
    setActivities([]);
    setKnapsackItems([]);
    setJobs([]);
    setSlots([]);
    setInfoText('');
    setIsAnimating(false);
    setMessage('Select a problem and click Animate');
  };

  const stateColor = (state: string) => {
    switch (state) {
      case 'considering': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'selected': return 'bg-green-500/20 border-green-500 text-green-400';
      case 'partial': return 'bg-blue-500/20 border-blue-500 text-blue-400';
      case 'rejected': return 'bg-red-500/10 border-red-500/30 text-red-400/60';
      default: return 'bg-surface-secondary border-border text-foreground';
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

        {/* Activity Selection timeline */}
        {activities.length > 0 && (
          <div className="space-y-2">
            {/* Timeline header */}
            <div className="flex items-center gap-1 mb-3">
              <div className="w-10 text-[10px] font-mono text-muted">Act</div>
              <div className="flex-1 flex">
                {Array.from({ length: 11 }, (_, i) => (
                  <div key={i} className="flex-1 text-center text-[9px] font-mono text-muted">{i}</div>
                ))}
              </div>
            </div>
            {activities.map((act) => (
              <div key={act.id} className="flex items-center gap-1">
                <div className={cn('w-10 text-xs font-bold', act.state === 'selected' ? 'text-green-400' : act.state === 'rejected' ? 'text-red-400/50' : 'text-foreground')}>
                  {act.id}
                </div>
                <div className="flex-1 relative h-7">
                  {/* Background ticks */}
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: 11 }, (_, i) => (
                      <div key={i} className="flex-1 border-l border-border/30" />
                    ))}
                  </div>
                  {/* Activity bar */}
                  <motion.div
                    className={cn('absolute h-full rounded-md border-2 transition-all duration-300', stateColor(act.state))}
                    style={{
                      left: `${(act.start / 10) * 100}%`,
                      width: `${((act.end - act.start) / 10) * 100}%`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono">
                      [{act.start},{act.end})
                    </span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fractional Knapsack */}
        {knapsackItems.length > 0 && (
          <div className="space-y-2">
            {knapsackItems.map((item) => (
              <motion.div
                key={item.id}
                className={cn('flex items-center gap-4 px-4 py-3 rounded-lg border-2 transition-all duration-300', stateColor(item.state))}
                layout
              >
                <span className="font-bold text-sm w-8">{item.id}</span>
                <div className="flex-1 grid grid-cols-4 gap-2 text-xs font-mono">
                  <span>w={item.weight}</span>
                  <span>v={item.value}</span>
                  <span>v/w={item.ratio}</span>
                  <span>
                    {item.fraction > 0
                      ? item.fraction === 1
                        ? '✓ 100%'
                        : `◐ ${(item.fraction * 100).toFixed(1)}%`
                      : '—'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Job Sequencing */}
        {jobs.length > 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  className={cn('flex items-center gap-4 px-4 py-3 rounded-lg border-2 transition-all duration-300', stateColor(job.state))}
                  layout
                >
                  <span className="font-bold text-sm w-8">{job.id}</span>
                  <div className="flex-1 grid grid-cols-3 gap-2 text-xs font-mono">
                    <span>profit={job.profit}</span>
                    <span>deadline={job.deadline}</span>
                    <span>{job.slot >= 0 ? `slot=${job.slot + 1}` : '—'}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Slot visualization */}
            <div className="flex gap-2 mt-4">
              <span className="text-xs font-bold text-muted self-center">Slots:</span>
              {slots.map((slot, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-16 h-12 rounded-lg border-2 flex flex-col items-center justify-center font-mono text-xs transition-all duration-300',
                    slot ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-surface-secondary border-border text-muted'
                  )}
                >
                  <span className="font-bold">{slot || '—'}</span>
                  <span className="text-[9px] opacity-50">t={i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activities.length === 0 && knapsackItems.length === 0 && jobs.length === 0 && (
          <div className="text-muted text-sm italic text-center py-16">
            Click Animate to start the greedy algorithm visualization
          </div>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        {[
          ['Considering', 'bg-yellow-500/20 border-yellow-500'],
          ['Selected', 'bg-green-500/20 border-green-500'],
          ['Partial', 'bg-blue-500/20 border-blue-500'],
          ['Rejected', 'bg-red-500/10 border-red-500/30'],
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
