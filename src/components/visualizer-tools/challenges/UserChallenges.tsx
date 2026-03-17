'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Plus, X, Send, User, ChevronRight, Code2, Play, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Difficulty = 'easy' | 'medium' | 'hard';

interface TestCase {
  input: string;
  expected: string;
  description: string;
}

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  description: string;
}

const difficultyColor = (d: Difficulty) => {
  switch (d) {
    case 'easy': return 'text-green-400 bg-green-500/10 border-green-500/30';
    case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    case 'hard': return 'text-red-400 bg-red-500/10 border-red-500/30';
  }
};

export function UserChallenges() {
  const challenges = useQuery(api.userChallenges.list);
  const createChallenge = useMutation(api.userChallenges.create);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [starterCode, setStarterCode] = useState('function solution() {\n  // Your code here\n}');
  const [testCases, setTestCases] = useState<TestCase[]>([{ input: '', expected: '', description: '' }]);
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Solving state
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [code, setCode] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expected: '', description: '' }]);
  };

  const removeTestCase = (idx: number) => {
    if (testCases.length <= 1) return;
    setTestCases(testCases.filter((_, i) => i !== idx));
  };

  const updateTestCase = (idx: number, field: keyof TestCase, value: string) => {
    const updated = [...testCases];
    updated[idx] = { ...updated[idx], [field]: value };
    setTestCases(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !authorName.trim() || !category.trim()) return;
    const validTests = testCases.filter(tc => tc.input.trim() && tc.expected.trim() && tc.description.trim());
    if (validTests.length === 0) return;

    setSubmitting(true);
    try {
      await createChallenge({
        title: title.trim(),
        difficulty,
        category: category.trim(),
        description: description.trim(),
        starterCode,
        testCases: validTests,
        authorName: authorName.trim(),
      });
      setShowForm(false);
      setTitle('');
      setCategory('');
      setDescription('');
      setStarterCode('function solution() {\n  // Your code here\n}');
      setTestCases([{ input: '', expected: '', description: '' }]);
      setAuthorName('');
    } finally {
      setSubmitting(false);
    }
  };

  const selectChallenge = (idx: number) => {
    if (!challenges) return;
    setSelectedIdx(idx);
    setCode(challenges[idx].starterCode);
    setResults([]);
  };

  const runTests = async () => {
    if (selectedIdx === null || !challenges) return;
    const challenge = challenges[selectedIdx];
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

  const selected = selectedIdx !== null && challenges ? challenges[selectedIdx] : null;
  const allPassed = results.length > 0 && results.every(r => r.passed);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-accent" />
          Community Challenges
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? 'Cancel' : 'Add Challenge'}
        </button>
      </div>

      {/* Submit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-6 p-5 rounded-xl border border-accent/20 bg-surface space-y-4 overflow-hidden"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Challenge Title *</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required maxLength={100}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent" placeholder="e.g. Find the Median" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Your Name *</label>
                <input type="text" value={authorName} onChange={e => setAuthorName(e.target.value)} required maxLength={50}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent" placeholder="Your name" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Category *</label>
                <input type="text" value={category} onChange={e => setCategory(e.target.value)} required maxLength={30}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent" placeholder="e.g. Arrays, Strings, DP" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Difficulty</label>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as const).map(d => (
                    <button key={d} type="button" onClick={() => setDifficulty(d)}
                      className={cn('flex-1 px-3 py-2 rounded-lg text-xs font-medium border capitalize transition-colors',
                        difficulty === d ? difficultyColor(d) : 'border-border bg-background text-muted')}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Description *</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} required maxLength={1000} rows={3}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent resize-none"
                placeholder="Describe the problem..." />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Starter Code</label>
              <textarea value={starterCode} onChange={e => setStarterCode(e.target.value)} rows={4} maxLength={2000}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm font-mono focus:outline-none focus:border-accent resize-none"
                spellCheck={false} />
            </div>

            {/* Test Cases */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-foreground">Test Cases *</label>
                <button type="button" onClick={addTestCase} className="text-xs text-accent hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Test Case
                </button>
              </div>
              <div className="space-y-3">
                {testCases.map((tc, i) => (
                  <div key={i} className="p-3 rounded-lg bg-background border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted">Test Case {i + 1}</span>
                      {testCases.length > 1 && (
                        <button type="button" onClick={() => removeTestCase(i)} className="text-error hover:text-error/80">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input type="text" value={tc.description} onChange={e => updateTestCase(i, 'description', e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-surface border border-border text-xs text-foreground focus:outline-none focus:border-accent" placeholder="Description (e.g. Basic case)" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={tc.input} onChange={e => updateTestCase(i, 'input', e.target.value)}
                        className="px-2 py-1.5 rounded bg-surface border border-border text-xs font-mono text-foreground focus:outline-none focus:border-accent" placeholder="Input (e.g. [1,2,3])" />
                      <input type="text" value={tc.expected} onChange={e => updateTestCase(i, 'expected', e.target.value)}
                        className="px-2 py-1.5 rounded bg-surface border border-border text-xs font-mono text-foreground focus:outline-none focus:border-accent" placeholder='Expected (e.g. 6)' />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50">
              {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? 'Submitting...' : 'Submit Challenge'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* User challenges list + solver */}
      {challenges === undefined ? (
        <div className="text-sm text-muted text-center py-10">Loading community challenges...</div>
      ) : challenges.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-border rounded-xl">
          <p className="text-sm text-muted">No community challenges yet. Be the first to add one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar */}
          <div className="bg-surface rounded-xl border border-border p-3 max-h-[600px] overflow-y-auto">
            <h3 className="text-xs font-bold text-muted mb-2">Community ({challenges.length})</h3>
            <div className="space-y-1.5">
              {challenges.map((c, i) => (
                <button key={c._id} onClick={() => selectChallenge(i)}
                  className={cn('w-full text-left p-2.5 rounded-lg transition-colors',
                    selectedIdx === i ? 'bg-accent/10 border border-accent/30' : 'bg-surface-secondary hover:bg-surface-secondary/70 border border-transparent')}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground truncate">{c.title}</span>
                    <ChevronRight className="w-3 h-3 text-muted flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full border font-medium', difficultyColor(c.difficulty))}>{c.difficulty}</span>
                    <span className="text-[9px] text-muted">{c.category}</span>
                  </div>
                  <div className="text-[9px] text-muted mt-1">by {c.authorName}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main area */}
          <div className="lg:col-span-3 space-y-4">
            {selected ? (
              <>
                <div className="bg-surface rounded-xl border border-border p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-sm font-bold text-foreground">{selected.title}</h2>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full border font-medium', difficultyColor(selected.difficulty))}>{selected.difficulty}</span>
                    <span className="text-[10px] text-muted bg-surface-secondary px-2 py-0.5 rounded-full">{selected.category}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed mb-2">{selected.description}</p>
                  <p className="text-[10px] text-muted">Submitted by <span className="text-foreground font-medium">{selected.authorName}</span></p>
                </div>

                <div className="bg-surface rounded-xl border border-border overflow-hidden">
                  <div className="px-4 py-2 border-b border-border bg-surface-secondary">
                    <span className="text-xs font-bold text-muted"><Code2 className="w-3.5 h-3.5 inline mr-1" />Your Solution</span>
                  </div>
                  <textarea value={code} onChange={e => setCode(e.target.value)} rows={Math.max(6, code.split('\n').length + 2)}
                    className="w-full p-4 bg-transparent font-mono text-sm text-foreground leading-5 resize-none focus:outline-none" spellCheck={false} />
                </div>

                <div className="flex gap-3 items-center">
                  <button onClick={runTests} disabled={isRunning}
                    className="px-4 py-2 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors disabled:opacity-50">
                    <Play className="w-3.5 h-3.5 inline mr-1" />{isRunning ? 'Running...' : 'Run Tests'}
                  </button>
                  <button onClick={() => { setCode(selected.starterCode); setResults([]); }}
                    className="px-4 py-2 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors">
                    <RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset
                  </button>
                  {results.length > 0 && (
                    <span className={cn('text-xs font-medium px-3 py-1.5 rounded-lg',
                      allPassed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>
                      {allPassed ? <><Trophy className="w-3.5 h-3.5 inline mr-1" /> All Passed!</> : `${results.filter(r => r.passed).length}/${results.length} Passed`}
                    </span>
                  )}
                </div>

                {results.length > 0 && (
                  <div className="bg-surface rounded-xl border border-border p-4 space-y-2">
                    <h3 className="text-xs font-bold text-muted mb-2">Test Results</h3>
                    {results.map((r, i) => (
                      <div key={i} className={cn('rounded-lg p-3 text-xs font-mono border',
                        r.passed ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20')}>
                        <div className="flex items-center gap-2 mb-1">
                          {r.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                          <span className={r.passed ? 'text-green-400' : 'text-red-400'}>Test {i + 1}: {r.description}</span>
                        </div>
                        <div className="ml-5 space-y-0.5 text-[10px]">
                          <div><span className="text-muted">Input:</span> <span className="text-foreground">{r.input}</span></div>
                          <div><span className="text-muted">Expected:</span> <span className="text-green-400">{r.expected}</span></div>
                          {!r.passed && <div><span className="text-muted">Got:</span> <span className="text-red-400">{r.actual}</span></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-60 text-sm text-muted border border-dashed border-border rounded-xl">
                Select a community challenge to solve
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
