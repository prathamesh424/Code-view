'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, CheckCircle2, XCircle, Trophy, ChevronRight, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Difficulty = 'easy' | 'medium' | 'hard';

interface TestCase {
  input: string;
  expected: string;
  description: string;
}

interface Challenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  testCases: TestCase[];
  starterCode: string;
  hints: string[];
  solution: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    category: 'Arrays',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input has exactly one solution.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1, 2]' },
    ],
    testCases: [
      { input: '[2,7,11,15]\n9', expected: '[0,1]', description: 'Basic case' },
      { input: '[3,2,4]\n6', expected: '[1,2]', description: 'Middle elements' },
      { input: '[3,3]\n6', expected: '[0,1]', description: 'Same elements' },
    ],
    starterCode: `function twoSum(nums, target) {\n  // Your code here\n  \n}`,
    hints: ['Use a hash map to store seen values', 'For each number, check if target - number exists in the map'],
    solution: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'easy',
    category: 'Strings',
    description: 'Write a function that reverses a string. The input string is given as an array of characters `s`. Do it in-place with O(1) extra memory.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
    ],
    testCases: [
      { input: '["h","e","l","l","o"]', expected: '["o","l","l","e","h"]', description: 'Basic string' },
      { input: '["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]', description: 'Palindrome-like' },
      { input: '["a"]', expected: '["a"]', description: 'Single char' },
    ],
    starterCode: `function reverseString(s) {\n  // Modify s in-place\n  \n}`,
    hints: ['Use two pointers: one at start, one at end', 'Swap and move inward'],
    solution: `function reverseString(s) {\n  let l = 0, r = s.length - 1;\n  while (l < r) {\n    [s[l], s[r]] = [s[r], s[l]];\n    l++; r--;\n  }\n  return s;\n}`,
  },
  {
    id: 'max-subarray',
    title: 'Maximum Subarray',
    difficulty: 'medium',
    category: 'Dynamic Programming',
    description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6' },
    ],
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6', description: 'Mixed array' },
      { input: '[1]', expected: '1', description: 'Single element' },
      { input: '[-1,-2,-3]', expected: '-1', description: 'All negative' },
      { input: '[5,4,-1,7,8]', expected: '23', description: 'Mostly positive' },
    ],
    starterCode: `function maxSubArray(nums) {\n  // Your code here\n  \n}`,
    hints: ["Use Kadane's algorithm", 'Track current sum and max sum. Reset current sum when it goes below 0.'],
    solution: `function maxSubArray(nums) {\n  let maxSum = nums[0], curSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    curSum = Math.max(nums[i], curSum + nums[i]);\n    maxSum = Math.max(maxSum, curSum);\n  }\n  return maxSum;\n}`,
  },
  {
    id: 'valid-parens',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    category: 'Stack',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. An input string is valid if open brackets are closed by the same type and in the correct order.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    testCases: [
      { input: '"()"', expected: 'true', description: 'Simple pair' },
      { input: '"()[]{}"', expected: 'true', description: 'Multiple types' },
      { input: '"(]"', expected: 'false', description: 'Mismatch' },
      { input: '"([{}])"', expected: 'true', description: 'Nested' },
      { input: '""', expected: 'true', description: 'Empty string' },
    ],
    starterCode: `function isValid(s) {\n  // Your code here\n  \n}`,
    hints: ['Use a stack', 'Push opening brackets, pop on closing brackets and check match'],
    solution: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if ('({['.includes(c)) stack.push(c);\n    else if (stack.pop() !== map[c]) return false;\n  }\n  return stack.length === 0;\n}`,
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'easy',
    category: 'Dynamic Programming',
    description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1' },
    ],
    testCases: [
      { input: '2', expected: '2', description: '2 steps' },
      { input: '3', expected: '3', description: '3 steps' },
      { input: '5', expected: '8', description: '5 steps' },
      { input: '1', expected: '1', description: '1 step' },
    ],
    starterCode: `function climbStairs(n) {\n  // Your code here\n  \n}`,
    hints: ['This is similar to Fibonacci', 'dp[i] = dp[i-1] + dp[i-2]'],
    solution: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}`,
  },
  {
    id: 'container-water',
    title: 'Container With Most Water',
    difficulty: 'medium',
    category: 'Two Pointers',
    description: 'Given n non-negative integers `height` where each represents a point at coordinate (i, height[i]), find two lines that together with the x-axis form a container that holds the most water.',
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Lines at index 1 and 8 form the largest container' },
    ],
    testCases: [
      { input: '[1,8,6,2,5,4,8,3,7]', expected: '49', description: 'Standard case' },
      { input: '[1,1]', expected: '1', description: 'Two elements' },
      { input: '[4,3,2,1,4]', expected: '16', description: 'Equal heights' },
    ],
    starterCode: `function maxArea(height) {\n  // Your code here\n  \n}`,
    hints: ['Use two pointers starting from both ends', 'Move the pointer with smaller height inward'],
    solution: `function maxArea(height) {\n  let l = 0, r = height.length - 1, max = 0;\n  while (l < r) {\n    max = Math.max(max, Math.min(height[l], height[r]) * (r - l));\n    if (height[l] < height[r]) l++;\n    else r--;\n  }\n  return max;\n}`,
  },
];

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  description: string;
}

export function CodeChallengesVisualizer() {
  const [selectedId, setSelectedId] = useState(CHALLENGES[0].id);
  const [code, setCode] = useState(CHALLENGES[0].starterCode);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [filter, setFilter] = useState<Difficulty | 'all'>('all');

  const challenge = CHALLENGES.find(c => c.id === selectedId)!;
  const filtered = filter === 'all' ? CHALLENGES : CHALLENGES.filter(c => c.difficulty === filter);

  const selectChallenge = (id: string) => {
    const c = CHALLENGES.find(ch => ch.id === id)!;
    setSelectedId(id);
    setCode(c.starterCode);
    setResults([]);
    setShowHints(false);
    setShowSolution(false);
  };

  const runTests = useCallback(async () => {
    setIsRunning(true);
    setResults([]);
    await new Promise(r => setTimeout(r, 300));

    const testResults: TestResult[] = [];

    for (const tc of challenge.testCases) {
      try {
        // Parse inputs
        const inputs = tc.input.split('\n');
        const args = inputs.map(inp => {
          try { return JSON.parse(inp); }
          catch { return inp; }
        });

        // Extract function name
        const fnMatch = code.match(/function\s+(\w+)/);
        if (!fnMatch) {
          testResults.push({ passed: false, input: tc.input, expected: tc.expected, actual: 'Error: No function found', description: tc.description });
          continue;
        }

        // Execute
        const fn = new Function(`${code}\nreturn ${fnMatch[1]}(${args.map(a => JSON.stringify(a)).join(',')})`);
        const result = fn();
        const resultStr = JSON.stringify(result);
        const expectedParsed = JSON.stringify(JSON.parse(tc.expected));

        testResults.push({
          passed: resultStr === expectedParsed,
          input: tc.input,
          expected: tc.expected,
          actual: resultStr,
          description: tc.description,
        });
      } catch (e: unknown) {
        testResults.push({
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: `Error: ${(e as Error).message}`,
          description: tc.description,
        });
      }
    }

    setResults(testResults);
    setIsRunning(false);
  }, [code, challenge]);

  const allPassed = results.length > 0 && results.every(r => r.passed);
  const passedCount = results.filter(r => r.passed).length;

  const difficultyColor = (d: Difficulty) => {
    switch (d) {
      case 'easy': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'hard': return 'text-red-400 bg-red-500/10 border-red-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2 items-center">
        {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
          <button key={d} onClick={() => setFilter(d)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize',
              filter === d ? 'bg-accent/10 text-accent border-accent/30' : 'bg-surface-secondary text-muted border-border hover:text-foreground')}>
            {d}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Challenge list */}
        <div className="bg-surface rounded-xl border border-border p-3 max-h-[600px] overflow-y-auto">
          <h3 className="text-xs font-bold text-muted mb-2">Challenges</h3>
          <div className="space-y-1.5">
            {filtered.map(c => (
              <button key={c.id} onClick={() => selectChallenge(c.id)}
                className={cn('w-full text-left p-2.5 rounded-lg transition-colors',
                  selectedId === c.id ? 'bg-accent/10 border border-accent/30' : 'bg-surface-secondary hover:bg-surface-secondary/70 border border-transparent')}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{c.title}</span>
                  <ChevronRight className="w-3 h-3 text-muted" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full border font-medium', difficultyColor(c.difficulty))}>{c.difficulty}</span>
                  <span className="text-[9px] text-muted">{c.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Problem description */}
          <div className="bg-surface rounded-xl border border-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-sm font-bold text-foreground">{challenge.title}</h2>
              <span className={cn('text-[10px] px-2 py-0.5 rounded-full border font-medium', difficultyColor(challenge.difficulty))}>{challenge.difficulty}</span>
              <span className="text-[10px] text-muted bg-surface-secondary px-2 py-0.5 rounded-full">{challenge.category}</span>
            </div>
            <p className="text-xs text-muted leading-relaxed mb-3">{challenge.description}</p>
            <div className="space-y-2">
              {challenge.examples.map((ex, i) => (
                <div key={i} className="bg-surface-secondary rounded-lg p-2.5 text-[11px] font-mono">
                  <div><span className="text-muted">Input:</span> <span className="text-foreground">{ex.input}</span></div>
                  <div><span className="text-muted">Output:</span> <span className="text-accent">{ex.output}</span></div>
                  {ex.explanation && <div><span className="text-muted">Explanation:</span> <span className="text-muted">{ex.explanation}</span></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Code Editor */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-secondary">
              <span className="text-xs font-bold text-muted"><Code2 className="w-3.5 h-3.5 inline mr-1" />Solution</span>
              <div className="flex gap-2">
                <button onClick={() => setShowHints(!showHints)}
                  className="px-2 py-0.5 text-[10px] rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  {showHints ? 'Hide' : 'Show'} Hints
                </button>
                <button onClick={() => { setShowSolution(!showSolution); if (!showSolution) setCode(challenge.solution); }}
                  className="px-2 py-0.5 text-[10px] rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {showSolution ? 'Hide' : 'Show'} Solution
                </button>
              </div>
            </div>

            {showHints && (
              <div className="px-4 py-2 bg-yellow-500/5 border-b border-yellow-500/20">
                {challenge.hints.map((hint, i) => (
                  <div key={i} className="text-[11px] text-yellow-400">💡 {hint}</div>
                ))}
              </div>
            )}

            <textarea value={code} onChange={e => setCode(e.target.value)} rows={Math.max(8, code.split('\n').length + 2)}
              className="w-full p-4 bg-transparent font-mono text-sm text-foreground leading-5 resize-none focus:outline-none"
              spellCheck={false} />
          </div>

          {/* Run buttons */}
          <div className="flex gap-3 items-center">
            <button onClick={runTests} disabled={isRunning}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors disabled:opacity-50">
              <Play className="w-3.5 h-3.5 inline mr-1" />{isRunning ? 'Running...' : 'Run Tests'}
            </button>
            <button onClick={() => { setCode(challenge.starterCode); setResults([]); }}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors">
              <RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset
            </button>
            {results.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className={cn('text-xs font-medium px-3 py-1.5 rounded-lg',
                  allPassed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>
                {allPassed ? <><Trophy className="w-3.5 h-3.5 inline mr-1" /> All Passed!</> : `${passedCount}/${results.length} Passed`}
              </motion.div>
            )}
          </div>

          {/* Test Results */}
          {results.length > 0 && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold text-muted mb-3">Test Results</h3>
              <div className="space-y-2">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
