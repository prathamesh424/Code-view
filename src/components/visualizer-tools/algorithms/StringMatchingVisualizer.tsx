'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type MatchAlgo = 'naive' | 'kmp' | 'rabinkarp';

interface CharCell {
  char: string;
  state: 'default' | 'match' | 'mismatch' | 'found' | 'checking';
}

const ALGO_INFO: Record<MatchAlgo, { name: string; best: string; worst: string }> = {
  naive: { name: 'Naive', best: 'O(n·m)', worst: 'O(n·m)' },
  kmp: { name: 'KMP', best: 'O(n+m)', worst: 'O(n+m)' },
  rabinkarp: { name: 'Rabin-Karp', best: 'O(n+m)', worst: 'O(n·m)' },
};

export function StringMatchingVisualizer() {
  const [text, setText] = useState('ABABDABACDABABCABAB');
  const [pattern, setPattern] = useState('ABABCABAB');
  const [algo, setAlgo] = useState<MatchAlgo>('kmp');
  const [textCells, setTextCells] = useState<CharCell[]>([]);
  const [patternCells, setPatternCells] = useState<CharCell[]>([]);
  const [patternOffset, setPatternOffset] = useState(0);
  const [lpsTable, setLpsTable] = useState<number[]>([]);
  const [message, setMessage] = useState('Enter text and pattern, then click Animate');
  const [isAnimating, setIsAnimating] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [, setFoundPositions] = useState<number[]>([]);
  const cancelRef = useRef(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const resetCells = () => {
    setTextCells(text.split('').map(c => ({ char: c, state: 'default' })));
    setPatternCells(pattern.split('').map(c => ({ char: c, state: 'default' })));
    setPatternOffset(0);
    setComparisons(0);
    setFoundPositions([]);
    setLpsTable([]);
  };

  const animateKMP = async () => {
    const n = text.length, m = pattern.length;
    if (m === 0 || m > n) { setMessage('Invalid input'); return; }

    // Build LPS
    const lps = new Array(m).fill(0);
    let len = 0, i = 1;
    while (i < m) {
      if (pattern[i] === pattern[len]) { len++; lps[i] = len; i++; }
      else if (len !== 0) { len = lps[len - 1]; }
      else { lps[i] = 0; i++; }
    }
    setLpsTable(lps);

    const tCells: CharCell[] = text.split('').map(c => ({ char: c, state: 'default' }));
    const pCells: CharCell[] = pattern.split('').map(c => ({ char: c, state: 'default' }));
    setTextCells([...tCells]);
    setPatternCells([...pCells]);

    let ti = 0, pi = 0, comps = 0;
    const found: number[] = [];

    while (ti < n) {
      if (cancelRef.current) return;

      setPatternOffset(ti - pi);
      tCells.forEach((_, idx) => { tCells[idx] = { char: tCells[idx].char, state: found.includes(idx) ? 'found' : 'default' }; });
      pCells.forEach((_, idx) => { pCells[idx] = { char: pCells[idx].char, state: 'default' }; });

      tCells[ti] = { ...tCells[ti], state: 'checking' };
      pCells[pi] = { ...pCells[pi], state: 'checking' };
      setTextCells([...tCells]);
      setPatternCells([...pCells]);
      comps++;
      setComparisons(comps);
      setMessage(`Comparing text[${ti}]="${text[ti]}" with pattern[${pi}]="${pattern[pi]}"`);
      await sleep(400);

      if (text[ti] === pattern[pi]) {
        tCells[ti] = { ...tCells[ti], state: 'match' };
        pCells[pi] = { ...pCells[pi], state: 'match' };
        setTextCells([...tCells]);
        setPatternCells([...pCells]);
        await sleep(200);
        ti++; pi++;

        if (pi === m) {
          const startIdx = ti - m;
          for (let k = startIdx; k < ti; k++) {
            tCells[k] = { ...tCells[k], state: 'found' };
            found.push(k);
          }
          setTextCells([...tCells]);
          setFoundPositions([...found]);
          setMessage(`Pattern found at index ${startIdx}!`);
          await sleep(600);
          pi = lps[pi - 1];
        }
      } else {
        tCells[ti] = { ...tCells[ti], state: 'mismatch' };
        pCells[pi] = { ...pCells[pi], state: 'mismatch' };
        setTextCells([...tCells]);
        setPatternCells([...pCells]);
        await sleep(300);

        if (pi !== 0) {
          pi = lps[pi - 1];
          setMessage(`Mismatch! Using LPS, shift pattern to pi=${pi}`);
        } else {
          ti++;
        }
      }
    }

    setMessage(`Done! Found ${found.length > 0 ? `at positions: ${[...new Set(found.map(f => { for (const fp of [...new Set(found)].sort((a,b) => a-b)) { if (f >= fp && f < fp + m) return fp; } return f; }))].join(', ')}` : 'no match'}. ${comps} comparisons.`);
  };

  const animateNaive = async () => {
    const n = text.length, m = pattern.length;
    const tCells: CharCell[] = text.split('').map(c => ({ char: c, state: 'default' }));
    const pCells: CharCell[] = pattern.split('').map(c => ({ char: c, state: 'default' }));
    setTextCells([...tCells]);
    setPatternCells([...pCells]);

    let comps = 0;
    const found: number[] = [];

    for (let i = 0; i <= n - m; i++) {
      if (cancelRef.current) return;
      setPatternOffset(i);
      tCells.forEach((_, idx) => { tCells[idx] = { char: tCells[idx].char, state: found.includes(idx) ? 'found' : 'default' }; });
      pCells.forEach((_, idx) => { pCells[idx] = { char: pCells[idx].char, state: 'default' }; });

      let matched = true;
      for (let j = 0; j < m; j++) {
        if (cancelRef.current) return;
        tCells[i + j] = { ...tCells[i + j], state: 'checking' };
        pCells[j] = { ...pCells[j], state: 'checking' };
        setTextCells([...tCells]);
        setPatternCells([...pCells]);
        comps++;
        setComparisons(comps);
        await sleep(200);

        if (text[i + j] === pattern[j]) {
          tCells[i + j] = { ...tCells[i + j], state: 'match' };
          pCells[j] = { ...pCells[j], state: 'match' };
        } else {
          tCells[i + j] = { ...tCells[i + j], state: 'mismatch' };
          pCells[j] = { ...pCells[j], state: 'mismatch' };
          setTextCells([...tCells]);
          setPatternCells([...pCells]);
          matched = false;
          await sleep(200);
          break;
        }
        setTextCells([...tCells]);
        setPatternCells([...pCells]);
      }

      if (matched) {
        for (let j = 0; j < m; j++) {
          tCells[i + j] = { ...tCells[i + j], state: 'found' };
          found.push(i + j);
        }
        setTextCells([...tCells]);
        setFoundPositions([...found]);
        await sleep(400);
      }
    }

    setMessage(`Done! ${found.length > 0 ? 'Pattern found' : 'No match'}. ${comps} comparisons.`);
  };

  const animate = async () => {
    cancelRef.current = false;
    setIsAnimating(true);
    resetCells();
    await sleep(100);

    if (algo === 'kmp') await animateKMP();
    else await animateNaive(); // naive & rabin-karp use naive for visual simplicity

    setIsAnimating(false);
  };

  const reset = () => {
    cancelRef.current = true;
    setIsAnimating(false);
    resetCells();
    setMessage('Enter text and pattern, then click Animate');
  };

  const cellColor = (state: string) => {
    switch (state) {
      case 'match': return 'bg-green-500/20 border-green-500 text-green-400';
      case 'mismatch': return 'bg-red-500/20 border-red-500 text-red-400';
      case 'found': return 'bg-accent/20 border-accent text-accent';
      case 'checking': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      default: return 'bg-surface-secondary border-border text-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        {Object.entries(ALGO_INFO).map(([key, info]) => (
          <button key={key} onClick={() => setAlgo(key as MatchAlgo)} disabled={isAnimating}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              algo === key ? 'bg-accent/10 text-accent border-accent/30' : 'bg-surface-secondary text-muted border-border hover:text-foreground')}>
            {info.name}
          </button>
        ))}
        <button onClick={animate} disabled={isAnimating}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors disabled:opacity-50">
          <Play className="w-3.5 h-3.5 inline mr-1" />Animate
        </button>
        <button onClick={reset}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors ml-auto">
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted font-medium block mb-1">Text</label>
          <input value={text} onChange={e => setText(e.target.value.toUpperCase())} disabled={isAnimating}
            className="w-full px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
        <div>
          <label className="text-xs text-muted font-medium block mb-1">Pattern</label>
          <input value={pattern} onChange={e => setPattern(e.target.value.toUpperCase())} disabled={isAnimating}
            className="w-full px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
      </div>

      {message && (
        <motion.div key={message} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-sm text-accent font-mono bg-accent/5 px-3 py-2 rounded-lg border border-accent/20">{message}</motion.div>
      )}

      <div className="bg-surface rounded-xl border border-border p-4 overflow-x-auto">
        <h3 className="text-xs font-bold text-muted mb-3">Text</h3>
        <div className="flex gap-1 mb-4">
          {(textCells.length > 0 ? textCells : text.split('').map(c => ({ char: c, state: 'default' }))).map((cell, i) => (
            <div key={i} className={cn('w-8 h-8 rounded-lg border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-200', cellColor(cell.state))}>
              {cell.char}
            </div>
          ))}
        </div>

        <h3 className="text-xs font-bold text-muted mb-3">Pattern (offset: {patternOffset})</h3>
        <div className="flex gap-1" style={{ paddingLeft: `${patternOffset * 36}px` }}>
          {(patternCells.length > 0 ? patternCells : pattern.split('').map(c => ({ char: c, state: 'default' }))).map((cell, i) => (
            <div key={i} className={cn('w-8 h-8 rounded-lg border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-200', cellColor(cell.state))}>
              {cell.char}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {lpsTable.length > 0 && (
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="text-xs font-bold text-muted mb-2">LPS (Failure Function) Table</h3>
            <div className="flex gap-1">
              {lpsTable.map((v, i) => (
                <div key={i} className="text-center">
                  <div className="w-8 h-6 text-[9px] font-mono text-muted">{pattern[i]}</div>
                  <div className="w-8 h-8 rounded-lg border border-accent/30 bg-accent/10 flex items-center justify-center font-mono text-xs text-accent font-bold">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-surface rounded-xl border border-border p-4 text-xs">
          <h3 className="font-bold text-muted mb-2">Stats</h3>
          <div className="space-y-1 font-mono text-muted">
            <div>Algorithm: <span className="text-accent">{ALGO_INFO[algo].name}</span></div>
            <div>Comparisons: <span className="text-foreground">{comparisons}</span></div>
            <div>Best: <span className="text-green-400">{ALGO_INFO[algo].best}</span></div>
            <div>Worst: <span className="text-red-400">{ALGO_INFO[algo].worst}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
