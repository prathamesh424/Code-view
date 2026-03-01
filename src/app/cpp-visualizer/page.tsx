import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Play, HardDrive, Pointer, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "C++ Visualizer — Pointers, Memory & RAII Visualization",
  description:
    "Visualize C++ code execution with pointer tracking, memory addresses, stack/heap allocation, RAII, and smart pointers — all rendered step by step.",
  keywords: [
    "cpp visualizer",
    "c++ visualizer",
    "c++ memory visualizer",
    "c++ pointer visualizer",
    "c++ debugger online",
    "c++ stack heap",
  ],
  alternates: { canonical: "https://www.codevisualizer.app/cpp-visualizer" },
  openGraph: {
    title: "C++ Visualizer — Pointers, Memory & RAII Visualization",
    description:
      "Visualize C++ execution: pointers, memory, stack/heap, and RAII — step by step.",
    url: "https://www.codevisualizer.app/cpp-visualizer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "C++ Visualizer — Pointers, Memory & RAII Visualization",
    description: "See C++ pointers, memory addresses, stack/heap, and RAII in action.",
  },
};

export default function CppVisualizerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            <Play className="w-3 h-3 fill-current" />
            C++
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            C++ Code{" "}
            <span className="gradient-text">Visualizer</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Understand C++ memory management at a glance. See pointers resolve,
            watch stack frames push and pop, trace heap allocations, and
            visualize RAII and smart pointer lifetimes.
          </p>
          <div className="mt-8">
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover shadow-lg shadow-accent/25 transition-all duration-200 hover:-translate-y-0.5"
            >
              Open C++ Playground
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
                icon: Pointer,
                title: "Pointers & References",
                description:
                  "Watch pointers resolve to memory addresses. See the difference between references and pointers in real-time.",
              },
              {
                icon: HardDrive,
                title: "Stack & Heap Memory",
                description:
                  "Visualize stack frame allocation for local variables and heap allocation for dynamic objects with new/delete.",
              },
              {
                icon: Shield,
                title: "RAII & Smart Pointers",
                description:
                  "See how unique_ptr, shared_ptr, and RAII patterns manage resource lifetimes automatically.",
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
            Why Use a C++ Visualizer?
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            C++ gives you direct control over memory — but that power comes
            with complexity. Dangling pointers, memory leaks, buffer overflows,
            and undefined behavior are notoriously hard to debug mentally.
          </p>
          <p className="text-muted leading-relaxed">
            Code Visualizer&apos;s C++ visualizer makes memory management visual.
            See exactly where each object lives in memory, when it&apos;s
            allocated, and when it&apos;s freed. No more guessing about
            pointer arithmetic or scope lifetimes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Related Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/blog/stack-vs-heap"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                Blog: Stack vs Heap →
              </span>
              <p className="text-sm text-muted mt-1">
                Master the difference between stack and heap memory allocation.
              </p>
            </Link>
            <Link
              href="/java-visualizer"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                Java Visualizer →
              </span>
              <p className="text-sm text-muted mt-1">
                Compare manual C++ memory management with Java&apos;s garbage collector.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
