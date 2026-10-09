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
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.codevisualizer.app" },
      { "@type": "ListItem", position: 2, name: "C++ Visualizer", item: "https://www.codevisualizer.app/cpp-visualizer" },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a C++ visualizer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A C++ visualizer is an interactive tool that shows how C++ code executes step by step, displaying pointer resolution to memory addresses, stack frame allocation for local variables, heap allocation for dynamic objects, and RAII/smart pointer lifetime management in real-time.",
        },
      },
      {
        "@type": "Question",
        name: "How do pointers work in C++?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pointers in C++ store memory addresses of other variables or objects. They can be dereferenced to access the value at that address. Code Visualizer shows pointer arithmetic, reference vs pointer differences, dangling pointer detection, and how smart pointers (unique_ptr, shared_ptr) automate memory management through RAII.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between stack and heap memory in C++?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Stack memory is automatically managed and used for local variables and function call frames — it is fast but limited in size. Heap memory is manually managed using new/delete (or smart pointers) for dynamic allocation — it is larger but requires careful lifetime management to avoid memory leaks.",
        },
      },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "C++ Visualizer — Pointers, Memory & RAII Visualization",
    description: "Visualize C++ code execution with pointer tracking, memory addresses, stack/heap allocation, RAII, and smart pointers — all rendered step by step.",
    url: "https://www.codevisualizer.app/cpp-visualizer",
    isPartOf: { "@type": "WebSite", url: "https://www.codevisualizer.app" },
    about: { "@type": "Thing", name: "C++ Memory Management Visualization" },
    educationalLevel: "Intermediate to Advanced",
    learningResourceType: "Interactive visualization tool",
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, faqJsonLd, webPageJsonLd]) }} />
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
              href="/playground/cpp"
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
