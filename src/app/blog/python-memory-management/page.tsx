import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Python Memory Management — Reference Counting, GC & the GIL",
  description:
    "Deep dive into how CPython manages memory. Learn about reference counting, cyclic garbage collection, memory pools, and how the GIL affects multi-threaded Python programs.",
  keywords: [
    "python memory management",
    "python reference counting",
    "python garbage collection",
    "python GIL",
    "cpython memory",
    "python memory leak",
  ],
  alternates: {
    canonical: "https://www.codevisualizer.app/blog/python-memory-management",
  },
  openGraph: {
    title: "Python Memory Management — Reference Counting, GC & the GIL",
    description:
      "Deep dive into how CPython manages memory: reference counting, garbage collection, and the GIL.",
    url: "https://www.codevisualizer.app/blog/python-memory-management",
    type: "article",
    publishedTime: "2026-02-20T00:00:00Z",
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Memory Management",
    description:
      "Reference counting, garbage collection, memory pools, and the GIL explained.",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Python Memory Management — Reference Counting, GC & the GIL",
  description:
    "Deep dive into how CPython manages memory. Learn about reference counting, cyclic garbage collection, memory pools, and how the GIL affects multi-threaded Python programs.",
  url: "https://www.codevisualizer.app/blog/python-memory-management",
  datePublished: "2026-02-20T00:00:00Z",
  dateModified: "2026-02-20T00:00:00Z",
  author: { "@type": "Organization", name: "CodeView" },
  publisher: {
    "@type": "Organization",
    name: "CodeView",
    url: "https://www.codevisualizer.app",
  },
};

export default function PythonMemoryManagementArticle() {
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
            Python Memory Management —{" "}
            <span className="gradient-text">
              Reference Counting, GC &amp; the GIL
            </span>
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              February 20, 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              10 min read
            </span>
          </div>
        </header>

        <div className="prose-custom">
          <p className="text-muted leading-relaxed text-lg mb-6">
            Python&apos;s memory management is often taken for granted. You
            create objects, use them, and they magically disappear when
            you&apos;re done. But under the hood, CPython uses a
            sophisticated system of reference counting, cyclic garbage
            collection, and memory pools to keep your program running
            efficiently.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            Reference Counting
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            Every Python object has a reference count — a number tracking how
            many variables or data structures point to it. When you assign an
            object to a variable, the count goes up. When the variable goes
            out of scope or is reassigned, the count goes down. When the
            count reaches zero, the object is immediately freed.
          </p>
          <div className="bg-surface border border-border rounded-xl p-4 mb-4 font-mono text-sm">
            <div className="text-muted">
              <span className="text-accent">import</span> sys
            </div>
            <div className="text-muted mt-1">
              a = [<span className="text-success">1</span>,{" "}
              <span className="text-success">2</span>,{" "}
              <span className="text-success">3</span>]
            </div>
            <div className="text-muted mt-1">
              <span className="text-info">print</span>(sys.getrefcount(a)){" "}
              <span className="text-muted"># 2 (a + getrefcount arg)</span>
            </div>
            <div className="text-muted mt-1">
              b = a{" "}
              <span className="text-muted"># refcount increases to 3</span>
            </div>
            <div className="text-muted mt-1">
              <span className="text-accent">del</span> b{" "}
              <span className="text-muted"># refcount back to 2</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            Cyclic Garbage Collection
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            Reference counting has a weakness: circular references. If
            object A references object B and B references A, their reference
            counts never reach zero — even if no other code uses them.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            CPython solves this with a generational garbage collector. It
            tracks objects in three generations (0, 1, 2). New objects start
            in generation 0. Objects that survive a GC cycle get promoted to
            the next generation. Older generations are collected less
            frequently, since long-lived objects are less likely to become
            garbage.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            Memory Pools (pymalloc)
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            For small objects (≤512 bytes), CPython doesn&apos;t use the
            system allocator directly. Instead, it maintains its own memory
            pool system called pymalloc. Memory is divided into arenas (256
            KB), pools (4 KB), and blocks — optimized for frequent
            allocation and deallocation of small objects like integers and
            short strings.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            The Global Interpreter Lock (GIL)
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            The GIL is a mutex that ensures only one thread executes Python
            bytecode at a time. It exists because CPython&apos;s reference
            counting is not thread-safe. Without the GIL, two threads could
            modify a reference count simultaneously, causing memory
            corruption.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            The GIL means CPU-bound multi-threaded Python code won&apos;t
            benefit from multiple cores. For CPU-parallelism, use{" "}
            <code className="text-accent">multiprocessing</code> or{" "}
            <code className="text-accent">concurrent.futures</code> instead.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Visualize It
          </h3>
          <p className="text-muted leading-relaxed mb-4">
            Use{" "}
            <Link
              href="/python-visualizer"
              className="text-accent hover:underline"
            >
              CodeView&apos;s Python Visualizer
            </Link>{" "}
            to see reference counts change in real-time as you create,
            assign, and delete objects.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
            Common Memory Pitfalls
          </h2>
          <ul className="list-disc list-inside text-muted space-y-2 mb-4 ml-4">
            <li>
              <strong className="text-foreground">Mutable default arguments</strong>:
              Default lists/dicts are shared across function calls
            </li>
            <li>
              <strong className="text-foreground">Large global variables</strong>:
              They live for the entire program lifetime
            </li>
            <li>
              <strong className="text-foreground">Circular references with __del__</strong>:
              Can prevent garbage collection entirely
            </li>
            <li>
              <strong className="text-foreground">Caching without limits</strong>:
              Unbounded caches cause memory to grow forever
            </li>
          </ul>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Continue Learning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/python-visualizer"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                Python Visualizer →
              </span>
              <p className="text-sm text-muted mt-1">
                See memory and reference counting in action.
              </p>
            </Link>
            <Link
              href="/blog/stack-vs-heap"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                Stack vs Heap →
              </span>
              <p className="text-sm text-muted mt-1">
                Understand how stack and heap differ across languages.
              </p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
