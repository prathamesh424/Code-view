import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { LanguageShowcase } from '@/components/landing/LanguageShowcase';
import { InteractiveDemo } from '@/components/landing/InteractiveDemo';
import { PopularVisualizations } from '@/components/landing/PopularVisualizations';
import { ContinueSection } from '@/components/landing/ContinueSection';
import { ExploreCTAs } from '@/components/landing/ExploreCTAs';
import Link from 'next/link';

const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Code Visualizer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Code Visualizer is a free, open-source web application that visualizes code execution step by step in real time for JavaScript, Python, C++, and Java. It displays call stacks, event loops, memory layouts (stack and heap), garbage collection, algorithm animations, and SQL queries directly in your browser without any software installation.",
      },
    },
    {
      "@type": "Question",
      name: "Is Code Visualizer free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Code Visualizer is 100% free and open source under the MIT license. You can use all visualizers, debuggers, algorithm modules, and the SQL playground without creating an account or paying any subscription fees.",
      },
    },
    {
      "@type": "Question",
      name: "How is Code Visualizer better than Python Tutor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "While Python Tutor focuses primarily on basic Python variables, Code Visualizer provides deep, multi-language engine insights: the JavaScript event loop (microtasks vs macrotasks), Python GIL and reference counting, C++ pointer dereferencing and RAII, JVM garbage collection generations, 10+ interactive algorithm visualizers (Sliding Window, Two Pointers, DP, Pathfinding), and an in-browser SQLite database playground.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use Code Visualizer for coding interview preparation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Code Visualizer is specifically designed to help software engineers master LeetCode and DSA interview patterns visually. It includes interactive visualizers for Sliding Window, Two Pointers, Dynamic Programming tables, Binary Search, BFS/DFS Pathfinding, Backtracking (N-Queens, Sudoku), and Greedy algorithms.",
      },
    },
    {
      "@type": "Question",
      name: "What programming languages are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Code Visualizer supports JavaScript (ES6+, V8 event loop), Python (CPython memory and GIL), C/C++ (pointers and RAII), Java (JVM stack and heap), and SQL (SQLite with interactive queries).",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeFaqJsonLd),
        }}
      />
      <Hero />
      <InteractiveDemo />
      <PopularVisualizations />
      <Features />
      <LanguageShowcase />
      <ContinueSection />
      <ExploreCTAs />

      {/* Internal Links Section for SEO */}
      <section className="py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Explore Code Visualizers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {[
              { href: '/javascript-visualizer', label: 'JavaScript', color: 'text-warning' },
              { href: '/python-visualizer', label: 'Python', color: 'text-info' },
              { href: '/cpp-visualizer', label: 'C++', color: 'text-accent' },
              { href: '/java-visualizer', label: 'Java', color: 'text-error' },
              { href: '/event-loop-visualizer', label: 'Event Loop', color: 'text-success' },
              { href: '/debugger-online', label: 'Debugger', color: 'text-accent-secondary' },
              { href: '/sql-playground', label: 'SQL Playground', color: 'text-info' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-surface hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 group"
              >
                <span className={`text-sm font-semibold ${item.color} group-hover:scale-105 transition-transform`}>
                  {item.label}
                </span>
                <span className="text-xs text-muted">Visualizer</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
