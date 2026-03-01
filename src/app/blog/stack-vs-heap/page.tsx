import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Stack vs Heap Memory — What Every Developer Should Know",
  description:
    "Understand the difference between stack and heap memory allocation. Learn when each is used in C, C++, Java, Python, and JavaScript, and how it affects performance.",
  keywords: [
    "stack vs heap",
    "stack memory",
    "heap memory",
    "memory allocation",
    "stack vs heap difference",
    "stack overflow",
    "dynamic memory allocation",
  ],
  alternates: {
    canonical: "https://www.codevisualizer.app/blog/stack-vs-heap",
  },
  openGraph: {
    title: "Stack vs Heap Memory — What Every Developer Should Know",
    description:
      "Understand the difference between stack and heap memory allocation across programming languages.",
    url: "https://www.codevisualizer.app/blog/stack-vs-heap",
    type: "article",
    publishedTime: "2026-02-25T00:00:00Z",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stack vs Heap Memory",
    description:
      "Master the difference between stack and heap memory allocation.",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Stack vs Heap Memory — What Every Developer Should Know",
  description:
    "Understand the difference between stack and heap memory allocation. Learn when each is used in C, C++, Java, Python, and JavaScript, and how it affects performance.",
  url: "https://www.codevisualizer.app/blog/stack-vs-heap",
  datePublished: "2026-02-25T00:00:00Z",
  dateModified: "2026-02-25T00:00:00Z",
  author: { "@type": "Organization", name: "CodeView" },
  publisher: {
    "@type": "Organization",
    name: "CodeView",
    url: "https://www.codevisualizer.app",
  },
};

export default function StackVsHeapArticle() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Blog
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Stack vs Heap Memory —{" "}
            <span className="gradient-text">
              What Every Developer Should Know
            </span>
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              February 25, 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              8 min read
            </span>
          </div>
        </header>

        <div className="prose-custom">
          <p className="text-muted leading-relaxed text-lg mb-6">
            Stack and heap are two regions of memory that every program uses.
            Understanding the difference between them is fundamental to
            writing efficient code, debugging memory issues, and acing
            technical interviews.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            What Is Stack Memory?
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            The stack is a region of memory that operates in a last-in,
            first-out (LIFO) fashion. It&apos;s used for:
          </p>
          <ul className="list-disc list-inside text-muted space-y-2 mb-4 ml-4">
            <li>Local variables</li>
            <li>Function parameters</li>
            <li>Return addresses</li>
            <li>Stack frames (one per function call)</li>
          </ul>
          <p className="text-muted leading-relaxed mb-4">
            Stack allocation is extremely fast — it&apos;s just a pointer
            increment. Deallocation is equally fast: when a function returns,
            its entire stack frame is popped in one operation.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            What Is Heap Memory?
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            The heap is a larger, more flexible region of memory used for
            dynamic allocation. It&apos;s used for:
          </p>
          <ul className="list-disc list-inside text-muted space-y-2 mb-4 ml-4">
            <li>Objects created at runtime</li>
            <li>Data whose size isn&apos;t known at compile time</li>
            <li>Data that needs to outlive the function that created it</li>
          </ul>
          <p className="text-muted leading-relaxed mb-4">
            Heap allocation is slower because the allocator must find a
            suitable block of free memory. Deallocation requires either
            manual management (C/C++) or garbage collection (Java, Python,
            JS).
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            Stack vs Heap: Key Differences
          </h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-surface-secondary">
                  <th className="px-4 py-3 text-left text-foreground font-semibold">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-left text-foreground font-semibold">
                    Stack
                  </th>
                  <th className="px-4 py-3 text-left text-foreground font-semibold">
                    Heap
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted">
                <tr className="border-t border-border">
                  <td className="px-4 py-2">Speed</td>
                  <td className="px-4 py-2 text-success">Very fast</td>
                  <td className="px-4 py-2 text-warning">Slower</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-2">Size</td>
                  <td className="px-4 py-2">Limited (1-8 MB typical)</td>
                  <td className="px-4 py-2">Large (GBs)</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-2">Management</td>
                  <td className="px-4 py-2">Automatic (LIFO)</td>
                  <td className="px-4 py-2">Manual or GC</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-2">Lifetime</td>
                  <td className="px-4 py-2">Function scope</td>
                  <td className="px-4 py-2">Until freed/GC&apos;d</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-2">Fragmentation</td>
                  <td className="px-4 py-2">None</td>
                  <td className="px-4 py-2">Possible</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            Language-Specific Behavior
          </h2>
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
            C / C++
          </h3>
          <p className="text-muted leading-relaxed mb-4">
            Local variables go on the stack. <code className="text-accent">malloc</code>/
            <code className="text-accent">new</code> allocate on the heap.
            You&apos;re responsible for freeing heap memory with{" "}
            <code className="text-accent">free</code>/<code className="text-accent">delete</code>.
          </p>
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
            Java
          </h3>
          <p className="text-muted leading-relaxed mb-4">
            Primitives go on the stack; objects are always allocated on the
            heap. The JVM garbage collector handles deallocation using
            generational collection.
          </p>
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
            Python &amp; JavaScript
          </h3>
          <p className="text-muted leading-relaxed mb-4">
            Almost everything is a heap-allocated object. The stack stores
            function frames and references to objects. Garbage collection
            handles memory freeing automatically.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            See It in Action
          </h3>
          <p className="text-muted leading-relaxed mb-4">
            Use{" "}
            <Link
              href="/cpp-visualizer"
              className="text-accent hover:underline"
            >
              CodeView&apos;s C++ Visualizer
            </Link>{" "}
            or{" "}
            <Link
              href="/java-visualizer"
              className="text-accent hover:underline"
            >
              Java Visualizer
            </Link>{" "}
            to watch stack frames and heap objects being created and
            destroyed in real-time.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Continue Learning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/cpp-visualizer"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                C++ Visualizer →
              </span>
              <p className="text-sm text-muted mt-1">
                See pointers and memory management in action.
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
                Deep dive into reference counting and the GIL.
              </p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
