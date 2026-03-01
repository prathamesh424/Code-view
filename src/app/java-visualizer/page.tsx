import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Play, Boxes, Recycle, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Java Visualizer — JVM, Garbage Collection & OOP Visualization",
  description:
    "Visualize Java code execution on the JVM. See the call stack, heap objects, garbage collection generations, and OOP concepts like inheritance and polymorphism — step by step.",
  keywords: [
    "java visualizer",
    "java execution visualizer",
    "jvm visualizer",
    "java garbage collection",
    "java memory visualizer",
    "java debugger online",
    "java oop visualizer",
  ],
  alternates: { canonical: "https://www.codevisualizer.app/java-visualizer" },
  openGraph: {
    title: "Java Visualizer — JVM, Garbage Collection & OOP Visualization",
    description:
      "Visualize Java execution on the JVM: call stack, heap, garbage collection, and OOP — step by step.",
    url: "https://www.codevisualizer.app/java-visualizer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Java Visualizer — JVM, GC & OOP Visualization",
    description: "See Java's JVM internals: call stack, heap, garbage collection, and OOP.",
  },
};

export default function JavaVisualizerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 border border-error/20 text-error text-sm font-medium mb-6">
            <Play className="w-3 h-3 fill-current" />
            Java
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Java Code{" "}
            <span className="gradient-text">Visualizer</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            See how the JVM executes your Java code. Watch object creation on the
            heap, trace method calls through the stack, visualize garbage
            collection generations (Young, Old, Permanent), and understand OOP at
            a deeper level.
          </p>
          <div className="mt-8">
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover shadow-lg shadow-accent/25 transition-all duration-200 hover:-translate-y-0.5"
            >
              Open Java Playground
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
                icon: Boxes,
                title: "Objects & Heap",
                description:
                  "Watch objects being allocated on the JVM heap. See fields, methods, and how references connect objects together.",
              },
              {
                icon: Recycle,
                title: "Garbage Collection",
                description:
                  "Visualize Young Gen, Old Gen, and how the JVM decides when to garbage collect unreachable objects.",
              },
              {
                icon: Layers,
                title: "Inheritance & Polymorphism",
                description:
                  "See how method dispatch works with inheritance, overriding, interfaces, and dynamic binding.",
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
            Why Use a Java Visualizer?
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            Java&apos;s automatic memory management and OOP abstractions are
            powerful — but understanding what happens under the hood is
            essential for writing efficient code and acing technical interviews.
          </p>
          <p className="text-muted leading-relaxed">
            Code Visualizer shows you every step: from object creation to garbage
            collection, from method dispatch to exception handling. See the
            JVM as it truly works.
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
                Understand Java&apos;s stack and heap memory model.
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
                Compare Java&apos;s GC with C++&apos;s manual memory management.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
