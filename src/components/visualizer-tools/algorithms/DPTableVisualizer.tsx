'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type DPProblem = 'fibonacci' | 'knapsack' | 'lcs' | 'coinchange';

interface Cell {
  value: number | string;
  state: 'default' | 'computing' | 'computed' | 'optimal' | 'highlight';
}

const PROBLEMS: Record<DPProblem, { name: string; desc: string }> = {
  fibonacci: { name: 'Fibonacci', desc: 'Bottom-up tabulation of fib(n)' },
  knapsack: { name: '0/1 Knapsack', desc: 'Maximize value within weight capacity' },
  lcs: { name: 'LCS', desc: 'Longest Common Subsequence of two strings' },
  coinchange: { name: 'Coin Change', desc: 'Minimum coins to make amount' },
};

export function DPTableVisualizer() {
  const [problem, setProblem] = useState<DPProblem>('fibonacci');
  const [table, setTable] = useState<Cell[][]>([]);
  const [message, setMessage] = useState('Select a problem and click Animate');
  const [isAnimating, setIsAnimating] = useState(false);
  const [rowLabels, setRowLabels] = useState<string[]>([]);
  const [colLabels, setColLabels] = useState<string[]>([]);
  const cancelRef = useRef(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const animateFib = async () => {
    const n = 10;
    const dp: Cell[][] = [Array.from({ length: n + 1 }, () => ({ value: 0, state: 'default' as const }))];
    setColLabels(Array.from({ length: n + 1 }, (_, i) => String(i)));
    setRowLabels(['fib']);
    dp[0][0] = { value: 0, state: 'computed' };
    dp[0][1] = { value: 1, state: 'computed' };
    setTable(dp.map(r => [...r]));
    await sleep(300);

    for (let i = 2; i <= n; i++) {
      if (cancelRef.current) return;
      dp[0][i] = { value: '?', state: 'computing' };
      dp[0][i - 1] = { ...dp[0][i - 1], state: 'highlight' };
      dp[0][i - 2] = { ...dp[0][i - 2], state: 'highlight' };
      setTable(dp.map(r => [...r]));
      setMessage(`Computing fib(${i}) = fib(${i - 1}) + fib(${i - 2})`);
      await sleep(500);

      const val = (dp[0][i - 1].value as number) + (dp[0][i - 2].value as number);
      dp[0][i] = { value: val, state: 'computed' };
      dp[0][i - 1] = { ...dp[0][i - 1], state: 'computed' };
      dp[0][i - 2] = { ...dp[0][i - 2], state: 'computed' };
      setTable(dp.map(r => [...r]));
      await sleep(300);
    }

    dp[0][n] = { ...dp[0][n], state: 'optimal' };
    setTable(dp.map(r => [...r]));
    setMessage(`fib(${n}) = ${dp[0][n].value}`);
  };

  const animateKnapsack = async () => {
    const weights = [2, 3, 4, 5];
    const values = [3, 4, 5, 6];
    const W = 8;
    const nItems = weights.length;
    const dp: Cell[][] = Array.from({ length: nItems + 1 }, () =>
      Array.from({ length: W + 1 }, () => ({ value: 0, state: 'default' as const }))
    );
    setColLabels(Array.from({ length: W + 1 }, (_, i) => `w=${i}`));
    setRowLabels(['∅', ...weights.map((w, i) => `i${i + 1}(${w},${values[i]})`)]);
    setTable(dp.map(r => [...r]));
    await sleep(300);

    for (let i = 1; i <= nItems; i++) {
      for (let w = 0; w <= W; w++) {
        if (cancelRef.current) return;
        dp[i][w] = { value: '?', state: 'computing' };
        setTable(dp.map(r => [...r]));
        setMessage(`Item ${i} (w=${weights[i - 1]}, v=${values[i - 1]}), capacity ${w}`);
        await sleep(200);

        if (weights[i - 1] <= w) {
          const include = (dp[i - 1][w - weights[i - 1]].value as number) + values[i - 1];
          const exclude = dp[i - 1][w].value as number;
          dp[i][w] = { value: Math.max(include, exclude), state: 'computed' };
        } else {
          dp[i][w] = { value: dp[i - 1][w].value, state: 'computed' };
        }
        setTable(dp.map(r => [...r]));
        await sleep(100);
      }
    }

    // Trace back
    let i = nItems, w = W;
    while (i > 0 && w > 0) {
      if (dp[i][w].value !== dp[i - 1][w].value) {
        dp[i][w] = { ...dp[i][w], state: 'optimal' };
        w -= weights[i - 1];
      }
      i--;
    }
    setTable(dp.map(r => [...r]));
    setMessage(`Max value = ${dp[nItems][W].value} with capacity ${W}`);
  };

  const animateLCS = async () => {
    const s1 = 'ABCBD';
    const s2 = 'BDCAB';
    const m = s1.length, n = s2.length;
    const dp: Cell[][] = Array.from({ length: m + 1 }, () =>
      Array.from({ length: n + 1 }, () => ({ value: 0, state: 'default' as const }))
    );
    setColLabels(['∅', ...s2.split('')]);
    setRowLabels(['∅', ...s1.split('')]);
    setTable(dp.map(r => [...r]));
    await sleep(300);

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (cancelRef.current) return;
        dp[i][j] = { value: '?', state: 'computing' };
        setTable(dp.map(r => [...r]));
        setMessage(`Comparing "${s1[i - 1]}" with "${s2[j - 1]}"`);
        await sleep(200);

        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = { value: (dp[i - 1][j - 1].value as number) + 1, state: 'computed' };
        } else {
          dp[i][j] = {
            value: Math.max(dp[i - 1][j].value as number, dp[i][j - 1].value as number),
            state: 'computed',
          };
        }
        setTable(dp.map(r => [...r]));
        await sleep(100);
      }
    }

    // Trace back
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = { ...dp[i][j], state: 'optimal' };
        i--; j--;
      } else if ((dp[i - 1][j].value as number) > (dp[i][j - 1].value as number)) {
        i--;
      } else {
        j--;
      }
    }
    setTable(dp.map(r => [...r]));
    setMessage(`LCS("${s1}", "${s2}") = ${dp[m][n].value}`);
  };

  const animateCoinChange = async () => {
    const coins = [1, 3, 4];
    const amount = 10;
    const dp: Cell[][] = [Array.from({ length: amount + 1 }, (_, i) => ({
      value: i === 0 ? 0 : '∞',
      state: i === 0 ? 'computed' as const : 'default' as const,
    }))];
    setColLabels(Array.from({ length: amount + 1 }, (_, i) => String(i)));
    setRowLabels([`coins: [${coins.join(',')}]`]);
    setTable(dp.map(r => [...r]));
    await sleep(300);

    for (const coin of coins) {
      for (let a = coin; a <= amount; a++) {
        if (cancelRef.current) return;
        dp[0][a] = { ...dp[0][a], state: 'computing' };
        if (a - coin >= 0) dp[0][a - coin] = { ...dp[0][a - coin], state: 'highlight' };
        setTable(dp.map(r => [...r]));
        setMessage(`Using coin ${coin} for amount ${a}`);
        await sleep(300);

        const prev = dp[0][a - coin].value;
        if (prev !== '∞') {
          const newVal = (prev as number) + 1;
          const cur = dp[0][a].value;
          if (cur === '∞' || newVal < (cur as number)) {
            dp[0][a] = { value: newVal, state: 'computed' };
          } else {
            dp[0][a] = { ...dp[0][a], state: 'computed' };
          }
        } else {
          dp[0][a] = { ...dp[0][a], state: dp[0][a].value === '∞' ? 'default' : 'computed' };
        }
        if (a - coin >= 0) dp[0][a - coin] = { ...dp[0][a - coin], state: dp[0][a - coin].value === '∞' ? 'default' : 'computed' };
        setTable(dp.map(r => [...r]));
        await sleep(200);
      }
    }

    if (dp[0][amount].value !== '∞') dp[0][amount] = { ...dp[0][amount], state: 'optimal' };
    setTable(dp.map(r => [...r]));
    setMessage(`Min coins for ${amount} = ${dp[0][amount].value}`);
  };

  const animate = async () => {
    cancelRef.current = false;
    setIsAnimating(true);
    setTable([]);
    await sleep(100);
    if (problem === 'fibonacci') await animateFib();
    else if (problem === 'knapsack') await animateKnapsack();
    else if (problem === 'lcs') await animateLCS();
    else await animateCoinChange();
    setIsAnimating(false);
  };

  const reset = () => {
    cancelRef.current = true;
    setTable([]);
    setRowLabels([]);
    setColLabels([]);
    setIsAnimating(false);
    setMessage('Select a problem and click Animate');
  };

  const cellColor = (state: string) => {
    switch (state) {
      case 'computing': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'computed': return 'bg-green-500/10 border-green-500/30 text-foreground';
      case 'optimal': return 'bg-accent/20 border-accent text-accent';
      case 'highlight': return 'bg-purple-500/20 border-purple-500 text-purple-400';
      default: return 'bg-surface-secondary border-border text-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        {Object.entries(PROBLEMS).map(([key, info]) => (
          <button key={key} onClick={() => setProblem(key as DPProblem)} disabled={isAnimating}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              problem === key ? 'bg-accent/10 text-accent border-accent/30' : 'bg-surface-secondary text-muted border-border hover:text-foreground')}>
            {info.name}
          </button>
        ))}
        <button onClick={animate} disabled={isAnimating}
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

      <div className="bg-surface rounded-xl border border-border p-4 overflow-x-auto">
        <h3 className="text-xs font-bold text-muted mb-3">{PROBLEMS[problem].desc}</h3>
        {table.length > 0 ? (
          <div className="inline-block">
            {colLabels.length > 0 && (
              <div className="flex gap-1 mb-1 ml-20">
                {colLabels.map((label, i) => (
                  <div key={i} className="w-10 h-6 flex items-center justify-center text-[9px] font-mono text-muted">{label}</div>
                ))}
              </div>
            )}
            {table.map((row, ri) => (
              <div key={ri} className="flex gap-1 mb-1 items-center">
                {rowLabels[ri] && (
                  <div className="w-20 text-right pr-2 text-[9px] font-mono text-muted truncate">{rowLabels[ri]}</div>
                )}
                {row.map((cell, ci) => (
                  <div key={ci} className={cn('w-10 h-10 rounded-lg border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-300', cellColor(cell.state))}>
                    {cell.value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted text-sm italic text-center py-16">Click Animate to fill the DP table</div>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        {[['Computing', 'bg-yellow-500/20 border-yellow-500'], ['Computed', 'bg-green-500/10 border-green-500/30'], ['Optimal', 'bg-accent/20 border-accent'], ['Referenced', 'bg-purple-500/20 border-purple-500']].map(([label, cls]) => (
          <div key={label as string} className="flex items-center gap-2 text-[11px] text-muted">
            <div className={cn('w-3 h-3 rounded border', cls)} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
