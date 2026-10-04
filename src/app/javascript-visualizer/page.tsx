import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Play, Layers, Zap, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "JavaScript Visualizer — See JS Execution Step by Step",
  description:
    "Visualize JavaScript code execution in real-time. Watch the event loop, call stack, closures, promises, async/await, and the V8 engine internals — all step by step.",
  keywords: [
    "javascript visualizer",
    "javascript execution visualizer",
    "js event loop visualizer",
    "javascript call stack",
    "javascript closures",
    "js debugger",
    "v8 engine visualizer",
  ],
  alternates: { canonical: "https://www.codevisualizer.app/javascript-visualizer" },
  openGraph: {
    title: "JavaScript Visualizer — See JS Execution Step by Step",
    description:
      "Visualize JavaScript code execution in real-time. Watch the event loop, call stack, closures, promises, and async/await — all step by step.",
    url: "https://www.codevisualizer.app/javascript-visualizer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JavaScript Visualizer — See JS Execution Step by Step",
    description:
      "Visualize JavaScript execution: event loop, call stack, closures, promises, async/await.",
  },
};

export default function JavaScriptVisualizerPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.codevisualizer.app" },
      { "@type": "ListItem", position: 2, name: "JavaScript Visualizer", item: "https://www.codevisualizer.app/javascript-visualizer" },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a JavaScript visualizer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A JavaScript visualizer is an interactive tool that shows you how JavaScript code executes step by step. It displays the call stack, event loop, microtask and macrotask queues, closures, and scope chains in real-time, making it easier to understand complex async behavior like Promises and async/await.",
        },
      },
      {
        "@type": "Question",
        name: "How does the JavaScript event loop work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The JavaScript event loop processes code in a specific order: first, it executes all synchronous code on the call stack, then drains the microtask queue (Promise callbacks, queueMicrotask), then executes one macrotask (setTimeout, setInterval callbacks), and repeats. This cycle ensures non-blocking I/O while maintaining a single-threaded execution model.",
        },
      },
      {
        "@type": "Question",
        name: "Is Code Visualizer a good alternative to Python Tutor for JavaScript?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Code Visualizer goes beyond Python Tutor by offering event loop visualization, V8 engine internals, closure and scope chain tracking, and async/await execution tracing — all with a modern, beautiful interface. It supports JavaScript, Python, C++, and Java.",
        },
      },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "JavaScript Visualizer — See JS Execution Step by Step",
    description: "Visualize JavaScript code execution in real-time. Watch the event loop, call stack, closures, promises, async/await, and the V8 engine internals — all step by step.",
    url: "https://www.codevisualizer.app/javascript-visualizer",
    isPartOf: { "@type": "WebSite", url: "https://www.codevisualizer.app" },
    about: {
      "@type": "Thing",
      name: "JavaScript Code Execution Visualization",
    },
    educationalLevel: "Beginner to Advanced",
    learningResourceType: "Interactive visualization tool",
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, faqJsonLd, webPageJsonLd]) }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning text-sm font-medium mb-6">
            <Play className="w-3 h-3 fill-current" />
            JavaScript
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            JavaScript Code{" "}
            <span className="gradient-text">Visualizer</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Understand how JavaScript really executes. Watch the event loop spin,
            see the call stack grow and shrink, trace closures, and follow
            promises through the microtask queue — all in real-time.
          </p>
          <div className="mt-8">
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover shadow-lg shadow-accent/25 transition-all duration-200 hover:-translate-y-0.5"
            >
              Open JavaScript Playground
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            What You Can Visualize
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Layers,
                title: "Call Stack & Scope Chain",
                description:
                  "Watch function calls push onto the stack and pop off. See how scope chains resolve variables through closures.",
              },
              {
                icon: Clock,
                title: "Event Loop & Task Queues",
                description:
                  "Understand setTimeout, Promises, and async/await by watching the macro-task and micro-task queues in action.",
              },
              {
                icon: Zap,
                title: "V8 Engine Internals",
                description:
                  "See how the V8 engine processes your code: parsing, compilation, garbage collection, and memory allocation.",
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

        {/* Content Section */}
        <section className="mb-16 prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Why Use a JavaScript Visualizer?
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            JavaScript&apos;s asynchronous nature makes it one of the hardest
            languages to debug mentally. Between the event loop, callback
            queues, closures, and prototype chains, understanding what
            happens at each step can be overwhelming.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            Code Visualizer&apos;s JavaScript visualizer breaks down every line of
            execution, showing you exactly what the engine does: which
            functions are on the call stack, which variables are in scope,
            and how async operations are queued and resolved.
          </p>
          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Perfect for Learning
          </h3>
          <p className="text-muted leading-relaxed">
            Whether you&apos;re preparing for a JavaScript interview, studying
            for a CS course, or debugging production code, the visual
            step-by-step execution makes complex concepts click instantly.
          </p>
        </section>

        {/* Related links */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Related Resources
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
                Deep-dive into setTimeout, Promises, and async/await execution order.
              </p>
            </Link>
            <Link
              href="/blog/javascript-event-loop-explained"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                Blog: JS Event Loop Explained →
              </span>
              <p className="text-sm text-muted mt-1">
                Complete guide to understanding the JavaScript event loop.
              </p>
            </Link>
            <Link
              href="/debugger-online"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                Online Debugger →
              </span>
              <p className="text-sm text-muted mt-1">
                Set breakpoints and step through code with our interactive debugger.
              </p>
            </Link>
            <Link
              href="/python-visualizer"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                Python Visualizer →
              </span>
              <p className="text-sm text-muted mt-1">
                Visualize Python execution, memory management, and the GIL.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
