"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Play, SkipForward, RotateCcw, Zap, ArrowRight } from "lucide-react";
import { buildPlaygroundUrl, getExampleById } from "@/lib/examples";

const Editor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] sm:h-[340px] rounded-xl border border-border bg-surface flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    ),
  },
);

const DEMO_CODE = `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

const answer = factorial(4);
console.log('Result:', answer);`;

const DEMO_STEPS = [
  { line: 1, message: "Define factorial function", stack: ["global"] },
  { line: 6, message: "Call factorial(4)", stack: ["global", "factorial(4)"] },
  {
    line: 3,
    message: "Recurse until base case",
    stack: [
      "global",
      "factorial(4)",
      "factorial(3)",
      "factorial(2)",
      "factorial(1)",
    ],
  },
  {
    line: 3,
    message: "Unwind and multiply results",
    stack: ["global", "factorial(4)", "factorial(3)", "factorial(2)"],
  },
  { line: 7, message: "Print final output: 24", stack: ["global"] },
];

export function InteractiveDemo() {
  const [code] = useState(DEMO_CODE);
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const editorRef = useRef<
    import("monaco-editor").editor.IStandaloneCodeEditor | null
  >(null);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const decorationIdsRef = useRef<string[]>([]);

  const current = DEMO_STEPS[stepIndex];
  const recursionExample = getExampleById("recursion");
  const playgroundHref = recursionExample
    ? buildPlaygroundUrl(recursionExample)
    : "/playground";

  const runDemo = () => {
    setStarted(true);
    setStepIndex(0);
  };

  const stepForward = () => {
    setStarted(true);
    setStepIndex((prev) => (prev >= DEMO_STEPS.length - 1 ? prev : prev + 1));
  };

  const reset = () => {
    setStarted(false);
    setStepIndex(0);
  };

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const monaco = monacoRef.current;
    decorationIdsRef.current = editorRef.current.deltaDecorations(
      decorationIdsRef.current,
      [
        {
          range: new monaco.Range(current.line, 1, current.line, 1),
          options: {
            isWholeLine: true,
            className: "current-line-highlight",
          },
        },
      ],
    );
  }, [current.line]);

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/5 via-background to-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-12 w-72 h-72 bg-info/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-5 sm:p-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            Zero setup required
          </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Step through code <span className="gradient-text">instantly.</span>
            </h2>
            <p className="text-muted text-sm sm:text-base mb-5 max-w-xl">
              Watch execution line-by-line. Click run, step through the call stack, and jump straight into the playground.
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              <button
                onClick={runDemo}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4" />
                Run Visualization
              </button>
              <button
                onClick={stepForward}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold text-foreground hover:border-accent hover:text-accent transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                Step Through
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wider text-muted">Execution Preview</p>
                <span className="text-xs text-muted">Step {stepIndex + 1}/{DEMO_STEPS.length}</span>
              </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                <div className="text-sm text-foreground font-semibold">{started ? current.message : 'Press Run Visualization to start.'}</div>
                <div className="flex flex-wrap gap-2">
                  {(started ? current.stack : ['global']).map((frame, idx) => (
                    <motion.span
                      key={`${frame}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-2 py-1 rounded-md bg-accent/10 border border-accent/20 text-xs text-accent font-mono"
                    >
                      {frame}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
              <div className="mt-3 h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                <motion.div
                  className="h-full bg-accent"
                  animate={{
                    width: `${((stepIndex + 1) / DEMO_STEPS.length) * 100}%`,
                  }}
                  transition={{ duration: 0.25 }}
                />
              </div>
            </div>

            <Link
              href={playgroundHref}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:gap-2 transition-all"
            >
              Open this exact example in playground
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-border shadow-xl shadow-accent/10 bg-[#0F172A]">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-[#111827]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FB7185]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
              <span className="ml-2 text-xs text-slate-300 font-mono">
                recursion-demo.js
              </span>
            </div>
            <Editor
              height="460px"
              language="javascript"
              value={code}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbersMinChars: 2,
                fontSize: 13,
                automaticLayout: true,
                wordWrap: "on",
              }}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                monacoRef.current = monaco;
                decorationIdsRef.current = editor.deltaDecorations(
                  [],
                  [
                    {
                      range: new monaco.Range(current.line, 1, current.line, 1),
                      options: {
                        isWholeLine: true,
                        className: "current-line-highlight",
                      },
                    },
                  ],
                );
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
