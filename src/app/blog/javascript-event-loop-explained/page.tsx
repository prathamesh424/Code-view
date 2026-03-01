import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "JavaScript Event Loop Explained — A Complete Visual Guide",
  description:
    "Understand how the JavaScript event loop works with interactive visualizations. Learn about the call stack, microtask queue, macrotask queue, and why Promise.then runs before setTimeout.",
  keywords: [
    "javascript event loop",
    "event loop explained",
    "microtask queue",
    "macrotask queue",
    "setTimeout vs promise",
    "javascript async",
    "call stack javascript",
  ],
  alternates: {
    canonical:
      "https://www.codevisualizer.app/blog/javascript-event-loop-explained",
  },
  openGraph: {
    title: "JavaScript Event Loop Explained — A Complete Visual Guide",
    description:
      "Understand how the JavaScript event loop works with interactive visualizations.",
    url: "https://www.codevisualizer.app/blog/javascript-event-loop-explained",
    type: "article",
    publishedTime: "2026-02-15T00:00:00Z",
  },
  twitter: {
    card: "summary_large_image",
    title: "JavaScript Event Loop Explained",
    description:
      "A complete visual guide to the JavaScript event loop, microtasks, and macrotasks.",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "JavaScript Event Loop Explained — A Complete Visual Guide",
  description:
    "Understand how the JavaScript event loop works with interactive visualizations. Learn about the call stack, microtask queue, macrotask queue, and why Promise.then runs before setTimeout.",
  url: "https://www.codevisualizer.app/blog/javascript-event-loop-explained",
  datePublished: "2026-02-15T00:00:00Z",
  dateModified: "2026-02-15T00:00:00Z",
  author: { "@type": "Organization", name: "Code Visualizer" },
  publisher: {
    "@type": "Organization",
    name: "Code Visualizer",
    url: "https://www.codevisualizer.app",
  },
};

export default function JavaScriptEventLoopArticle() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Blog
        </Link>

        {/* Article header */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            JavaScript Event Loop Explained —{" "}
            <span className="gradient-text">A Complete Visual Guide</span>
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              February 15, 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              12 min read
            </span>
          </div>
        </header>

        {/* Article body */}
        <div className="prose-custom">
          <p className="text-muted leading-relaxed text-lg mb-6">
            The JavaScript event loop is one of the most important concepts
            every JS developer must understand. It&apos;s the mechanism that
            allows JavaScript — a single-threaded language — to handle
            asynchronous operations like network requests, timers, and user
            interactions without blocking the main thread.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            What Is the Event Loop?
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            The event loop is a continuous process that checks whether the
            call stack is empty. When it is, it looks at the task queues
            (microtask and macrotask) and pushes the next callback onto the
            stack for execution.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            This is what makes <code className="text-accent">setTimeout</code>,{" "}
            <code className="text-accent">Promise.then</code>, and{" "}
            <code className="text-accent">async/await</code> work — they
            schedule callbacks onto these queues instead of blocking the main
            thread.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            The Call Stack
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            JavaScript has a single call stack, which means it can only
            execute one piece of code at a time. When a function is called,
            it&apos;s pushed onto the stack. When it returns, it&apos;s
            popped off. If the stack is too deep (infinite recursion), you
            get the famous &ldquo;Maximum call stack size exceeded&rdquo;
            error.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            Microtasks vs Macrotasks
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            Not all async callbacks are created equal. JavaScript has two
            task queues:
          </p>
          <ul className="list-disc list-inside text-muted space-y-2 mb-4 ml-4">
            <li>
              <strong className="text-foreground">Microtask queue</strong>:{" "}
              <code className="text-accent">Promise.then</code>,{" "}
              <code className="text-accent">queueMicrotask</code>,{" "}
              <code className="text-accent">MutationObserver</code>
            </li>
            <li>
              <strong className="text-foreground">Macrotask queue</strong>:{" "}
              <code className="text-accent">setTimeout</code>,{" "}
              <code className="text-accent">setInterval</code>,{" "}
              <code className="text-accent">setImmediate</code>, I/O
            </li>
          </ul>
          <p className="text-muted leading-relaxed mb-4">
            The crucial rule: <strong className="text-foreground">all microtasks
            are processed before the next macrotask</strong>. This is why{" "}
            <code className="text-accent">Promise.then</code> always executes
            before <code className="text-accent">setTimeout</code>, even if
            the timer is set to 0ms.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            Classic Interview Question
          </h2>
          <div className="bg-surface border border-border rounded-xl p-4 mb-4 font-mono text-sm">
            <div className="text-muted">
              <span className="text-info">console</span>.
              <span className="text-warning">log</span>(
              <span className="text-success">&quot;Start&quot;</span>);
            </div>
            <div className="text-muted mt-1">
              <span className="text-accent-secondary">setTimeout</span>(() =&gt;{" "}
              <span className="text-info">console</span>.
              <span className="text-warning">log</span>(
              <span className="text-success">&quot;Timeout&quot;</span>), 0);
            </div>
            <div className="text-muted mt-1">
              <span className="text-accent">Promise</span>.
              <span className="text-warning">resolve</span>().
              <span className="text-warning">then</span>(() =&gt;{" "}
              <span className="text-info">console</span>.
              <span className="text-warning">log</span>(
              <span className="text-success">&quot;Promise&quot;</span>));
            </div>
            <div className="text-muted mt-1">
              <span className="text-info">console</span>.
              <span className="text-warning">log</span>(
              <span className="text-success">&quot;End&quot;</span>);
            </div>
          </div>
          <p className="text-muted leading-relaxed mb-4">
            Output: <code className="text-accent">Start → End → Promise → Timeout</code>.
            The Promise callback (microtask) runs before the setTimeout
            callback (macrotask), even though both were scheduled before the
            call stack was empty.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Try It Yourself
          </h3>
          <p className="text-muted leading-relaxed mb-4">
            Paste this code into{" "}
            <Link href="/playground" className="text-accent hover:underline">
              Code Visualizer&apos;s playground
            </Link>{" "}
            and watch the event loop process each task in real-time.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            Async/Await and the Event Loop
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            <code className="text-accent">async/await</code> is syntactic
            sugar over Promises. When you <code className="text-accent">await</code>{" "}
            a value, the code after the await is scheduled as a microtask.
            The function pauses and the event loop continues processing
            other tasks.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            Conclusion
          </h2>
          <p className="text-muted leading-relaxed mb-6">
            The event loop is JavaScript&apos;s superpower and its biggest
            source of confusion. By visualizing each step — call stack,
            microtask queue, macrotask queue — you can build an intuitive
            mental model that makes async code predictable.
          </p>
        </div>

        {/* Related links */}
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Continue Learning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/event-loop-visualizer"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                Event Loop Visualizer →
              </span>
              <p className="text-sm text-muted mt-1">
                Interactive visual tool for the event loop.
              </p>
            </Link>
            <Link
              href="/blog/python-memory-management"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                Python Memory Management →
              </span>
              <p className="text-sm text-muted mt-1">
                Learn how Python handles memory differently.
              </p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
