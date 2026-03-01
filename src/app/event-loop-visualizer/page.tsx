import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Play, Clock, Repeat, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Event Loop Visualizer — Understand JavaScript Async Execution",
  description:
    "Interactive event loop visualizer. Watch setTimeout, Promises, async/await, and microtask/macrotask queues execute in real-time. Understand JavaScript concurrency.",
  keywords: [
    "event loop visualizer",
    "javascript event loop",
    "event loop explained",
    "microtask queue",
    "macrotask queue",
    "setTimeout visualizer",
    "promise visualizer",
    "async await visualizer",
  ],
  alternates: { canonical: "https://www.codevisualizer.app/event-loop-visualizer" },
  openGraph: {
    title: "Event Loop Visualizer — Understand JavaScript Async Execution",
    description:
      "Interactive event loop visualizer. Watch setTimeout, Promises, and async/await execute in real-time.",
    url: "https://www.codevisualizer.app/event-loop-visualizer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Loop Visualizer — JS Async Execution",
    description:
      "Watch the JavaScript event loop in real-time: setTimeout, Promises, microtasks, and macrotasks.",
  },
};

export default function EventLoopVisualizerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-sm font-medium mb-6">
            <Play className="w-3 h-3 fill-current" />
            Event Loop
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Event Loop{" "}
            <span className="gradient-text">Visualizer</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Finally understand JavaScript&apos;s event loop. Watch how
            setTimeout, Promises, async/await, and queueMicrotask interact
            with the call stack, microtask queue, and macrotask queue — in
            real-time.
          </p>
          <div className="mt-8">
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover shadow-lg shadow-accent/25 transition-all duration-200 hover:-translate-y-0.5"
            >
              Try the Event Loop Visualizer
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            What You&apos;ll See
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "Macrotask Queue",
                description:
                  "Watch setTimeout and setInterval callbacks queue up and execute after the current call stack clears.",
              },
              {
                icon: Zap,
                title: "Microtask Queue",
                description:
                  "See how Promise.then, queueMicrotask, and async/await callbacks execute before macrotasks.",
              },
              {
                icon: Repeat,
                title: "The Full Loop",
                description:
                  "Understand the complete cycle: call stack → microtasks → render → macrotasks, and why order matters.",
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
            Why Is the Event Loop So Important?
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            The event loop is the heart of JavaScript&apos;s concurrency model.
            Every setTimeout, every fetch call, every DOM event handler goes
            through the event loop. Misunderstanding it leads to race
            conditions, UI freezes, and unpredictable async behavior.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            The classic interview question &ldquo;What does this code
            output?&rdquo; almost always involves the event loop. With
            Code Visualizer&apos;s visualizer, you can paste any snippet and
            watch the execution order unfold — no more guessing.
          </p>
          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Common Misconceptions
          </h3>
          <p className="text-muted leading-relaxed">
            Many developers think setTimeout(fn, 0) runs immediately, or
            that async/await makes code synchronous. The event loop
            visualizer shows you exactly why these assumptions are wrong.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Related Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/blog/javascript-event-loop-explained"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                Blog: JavaScript Event Loop Explained →
              </span>
              <p className="text-sm text-muted mt-1">
                Complete guide to understanding the JavaScript event loop with examples.
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
                Full JavaScript execution visualizer with closures, scopes, and more.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
