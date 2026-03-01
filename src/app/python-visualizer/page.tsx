import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Play, Database, MemoryStick, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Python Visualizer — Trace Python Execution & Memory",
  description:
    "Visualize Python code execution step by step. Watch memory allocation, reference counting, the GIL, list/dict internals, and garbage collection in real-time.",
  keywords: [
    "python visualizer",
    "python tutor",
    "python execution visualizer",
    "python memory visualizer",
    "python debugger",
    "python tutor alternative",
    "python step by step",
  ],
  alternates: { canonical: "https://www.codevisualizer.app/python-visualizer" },
  openGraph: {
    title: "Python Visualizer — Trace Python Execution & Memory",
    description:
      "Visualize Python code execution step by step. Watch memory allocation, reference counting, the GIL, and garbage collection.",
    url: "https://www.codevisualizer.app/python-visualizer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Visualizer — Trace Python Execution & Memory",
    description:
      "Step-by-step Python code visualization: memory, GIL, reference counting, and more.",
  },
};

export default function PythonVisualizerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-info/10 border border-info/20 text-info text-sm font-medium mb-6">
            <Play className="w-3 h-3 fill-current" />
            Python
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Python Code{" "}
            <span className="gradient-text">Visualizer</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            The best Python Tutor alternative. Trace through your Python code
            line by line and see variables, memory allocations, reference counts,
            and the GIL — all visualized in real-time.
          </p>
          <div className="mt-8">
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover shadow-lg shadow-accent/25 transition-all duration-200 hover:-translate-y-0.5"
            >
              Open Python Playground
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            What You Can Visualize
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Database,
                title: "Memory & References",
                description:
                  "See how Python objects are stored in memory, how references work, and when objects become garbage-collectible.",
              },
              {
                icon: MemoryStick,
                title: "Stack & Heap Layout",
                description:
                  "Watch the call stack grow as functions are called and visualize objects being allocated on the heap.",
              },
              {
                icon: RefreshCw,
                title: "GIL & Garbage Collection",
                description:
                  "Understand CPython's Global Interpreter Lock and see reference counting and cyclic garbage collection in action.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Why Use a Python Visualizer?
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            Python&apos;s simplicity hides powerful complexity. Mutable default
            arguments, shallow vs deep copies, reference semantics, and the
            GIL can trip up even experienced developers.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            Code Visualizer lets you paste any Python snippet and step through it
            line by line, watching exactly how variables are created, how
            objects are referenced, and when memory is freed. It&apos;s the
            best way to truly understand Python internals.
          </p>
          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Better Than Python Tutor
          </h3>
          <p className="text-muted leading-relaxed">
            Unlike traditional tools, Code Visualizer shows you the full picture:
            memory layout, reference counting, garbage collection cycles,
            and even GIL states — all with a modern, beautiful interface.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Related Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/blog/python-memory-management"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                Blog: Python Memory Management →
              </span>
              <p className="text-sm text-muted mt-1">
                Deep dive into how CPython manages memory, reference counting, and the GC.
              </p>
            </Link>
            <Link
              href="/blog/stack-vs-heap"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                Blog: Stack vs Heap →
              </span>
              <p className="text-sm text-muted mt-1">
                Understand the difference between stack and heap memory allocation.
              </p>
            </Link>
            <Link
              href="/javascript-visualizer"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                JavaScript Visualizer →
              </span>
              <p className="text-sm text-muted mt-1">
                Visualize JS event loop, closures, and async execution.
              </p>
            </Link>
            <Link
              href="/cpp-visualizer"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                C++ Visualizer →
              </span>
              <p className="text-sm text-muted mt-1">
                See pointers, memory addresses, and RAII in action.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
