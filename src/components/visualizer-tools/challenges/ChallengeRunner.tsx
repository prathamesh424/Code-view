'use client';

import { useState } from 'react';
import { Play, CheckCircle2, XCircle, RotateCcw, Trophy, Code2, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Link from 'next/link';

type Difficulty = 'easy' | 'medium' | 'hard';

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  description: string;
}

const difficultyColor = (d: Difficulty | string) => {
  switch (d) {
    case 'easy': return 'text-green-400 bg-green-500/10 border-green-500/30';
    case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    case 'hard': return 'text-red-400 bg-red-500/10 border-red-500/30';
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
  }
};

export function ChallengeRunner({ slug }: { slug: string }) {
  const challenge = useQuery(api.userChallenges.getBySlug, { slug });
  
  const [code, setCode] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Initialize code when challenge loads
  if (challenge && !initialized) {
    setCode(challenge.starterCode);
    setInitialized(true);
  }

  if (challenge === undefined) {
    return <div className="text-sm text-muted text-center py-20">Loading challenge...</div>;
  }

  if (challenge === null) {
    return (
      <div className="text-center py-20">
        <p className="text-muted mb-4">Challenge not found.</p>
        <Link href="/challenges" className="text-accent hover:underline text-sm">Back to challenges</Link>
      </div>
    );
  }

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    await new Promise(r => setTimeout(r, 200));

    const testResults: TestResult[] = [];
    for (const tc of challenge.testCases) {
      try {
        const inputs = tc.input.split('\n');
        const args = inputs.map((inp: string) => {
          try { return JSON.parse(inp); }
          catch { return inp; }
        });
        const fnMatch = code.match(/function\s+(\w+)/);
        if (!fnMatch) {
          testResults.push({ passed: false, input: tc.input, expected: tc.expected, actual: 'Error: No function found', description: tc.description });
          continue;
        }
        const fn = new Function(`${code}\nreturn ${fnMatch[1]}(${args.map((a: unknown) => JSON.stringify(a)).join(',')})`);
        const result = fn();
        const resultStr = JSON.stringify(result);
        const expectedParsed = JSON.stringify(JSON.parse(tc.expected));
        testResults.push({ passed: resultStr === expectedParsed, input: tc.input, expected: tc.expected, actual: resultStr, description: tc.description });
      } catch (e: unknown) {
        testResults.push({ passed: false, input: tc.input, expected: tc.expected, actual: `Error: ${(e as Error).message}`, description: tc.description });
      }
    }
    setResults(testResults);
    setIsRunning(false);
  };

  const allPassed = results.length > 0 && results.every(r => r.passed);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/challenges" className="text-sm text-accent hover:underline mb-6 inline-flex items-center gap-1">
        <ChevronLeft className="w-3.5 h-3.5" /> Back to challenges
      </Link>
      
      {/* Problem description */}
      <div className="bg-surface rounded-xl border border-border p-5">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold text-foreground">{challenge.title}</h2>
          <span className={cn('text-xs px-2.5 py-0.5 rounded-full border font-medium', difficultyColor(challenge.difficulty))}>{challenge.difficulty}</span>
          <span className="text-xs text-muted bg-surface-secondary px-2.5 py-0.5 rounded-full">{challenge.category}</span>
        </div>
        <p className="text-sm text-muted leading-relaxed mb-4">{challenge.description}</p>
        
        {challenge.examples && challenge.examples.length > 0 && (
          <div className="space-y-3 mb-5">
            {challenge.examples.map((ex: { input: string; output: string; explanation?: string }, i: number) => (
              <div key={i} className="bg-surface-secondary rounded-lg p-4 text-[13px] font-mono leading-relaxed border border-border">
                <div><span className="text-muted">Input:</span> <span className="text-foreground">{ex.input}</span></div>
                <div><span className="text-muted">Output:</span> <span className="text-accent">{ex.output}</span></div>
                {ex.explanation && <div><span className="text-muted">Explanation:</span> <span className="text-muted">{ex.explanation}</span></div>}
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-muted">Submitted by <span className="text-foreground font-medium">{challenge.authorName}</span></p>
      </div>

      {/* Code Editor */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-secondary">
          <span className="text-sm font-bold text-muted flex items-center gap-2"><Code2 className="w-4 h-4" /> Solution</span>
          <div className="flex gap-2">
            {challenge.hints && challenge.hints.length > 0 && (
              <button onClick={() => setShowHints(!showHints)}
                className="px-3 py-1.5 text-[11px] rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors font-medium">
                {showHints ? 'Hide' : 'Show'} Hints
              </button>
            )}
            {challenge.solution && (
              <button onClick={() => { 
                  setShowSolution(!showSolution); 
                  if (!showSolution) {
                    setCode(challenge.solution || challenge.starterCode); 
                  }
                }}
                className="px-3 py-1.5 text-[11px] rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors font-medium">
                {showSolution ? 'Hide' : 'Show'} Solution
              </button>
            )}
          </div>
        </div>

        {showHints && challenge.hints && (
          <div className="px-5 py-3 bg-yellow-500/5 border-b border-yellow-500/20 space-y-1.5">
            {challenge.hints.map((hint: string, i: number) => (
              <div key={i} className="text-[12px] text-yellow-400 flex items-center gap-2">
                <span className="opacity-70">💡</span> {hint}
              </div>
            ))}
          </div>
        )}

        <textarea value={code} onChange={e => setCode(e.target.value)} rows={Math.max(10, code.split('\n').length + 2)}
          className="w-full p-6 bg-transparent font-mono text-sm text-foreground leading-relaxed resize-none focus:outline-none" spellCheck={false} />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 items-center">
        <button onClick={runTests} disabled={isRunning}
          className="px-5 py-2.5 rounded-lg text-sm font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors disabled:opacity-50 flex items-center gap-2">
          <Play className="w-4 h-4" /> {isRunning ? 'Running...' : 'Run Tests'}
        </button>
        <button onClick={() => { setCode(challenge.starterCode); setResults([]); setShowHints(false); setShowSolution(false); }}
          className="px-5 py-2.5 rounded-lg text-sm font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        {results.length > 0 && (
          <span className={cn('text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2',
            allPassed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>
            {allPassed ? <><Trophy className="w-4 h-4" /> All Passed!</> : `${results.filter(r => r.passed).length}/${results.length} Passed`}
          </span>
        )}
      </div>

      {results.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-5 space-y-3">
          <h3 className="text-sm font-bold text-muted mb-3">Test Results</h3>
          {results.map((r, i) => (
            <div key={i} className={cn('rounded-lg p-4 text-sm font-mono border',
              r.passed ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20')}>
              <div className="flex items-center gap-2 mb-2">
                {r.passed ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                <span className={r.passed ? 'text-green-400' : 'text-red-400'}>Test {i + 1}: {r.description}</span>
              </div>
              <div className="ml-6 space-y-1 text-xs">
                <div><span className="text-muted">Input:</span> <span className="text-foreground">{r.input}</span></div>
                <div><span className="text-muted">Expected:</span> <span className="text-green-400">{r.expected}</span></div>
                {!r.passed && <div><span className="text-muted">Got:</span> <span className="text-red-400">{r.actual}</span></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
