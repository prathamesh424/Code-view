import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { BlogCommunitySection } from './BlogCommunitySection';
import { buildPlaygroundUrl, getExampleById } from '@/lib/examples';

export const metadata: Metadata = {
  title: "CodeVisualizer Blog - Tutorials & CS Concepts",
  description:
    "Read tutorials on computer science fundamentals, coding tips, and how to use visualization to learn programming faster.",
  alternates: { canonical: "https://www.codevisualizer.app/blog" },
  openGraph: {
    title: "CodeVisualizer Blog - Tutorials & CS Concepts",
    description:
      "Read tutorials on computer science fundamentals, coding tips, and how to use visualization to learn programming faster.",
    url: "https://www.codevisualizer.app/blog",
    type: "website",
  },
};

const BLOG_POSTS = [
  {
    slug: "javascript-event-loop-explained",
    title: "JavaScript Event Loop Explained — A Complete Visual Guide",
    description:
      "Understand how the JavaScript event loop works with interactive visualizations. Learn about the call stack, microtask queue, macrotask queue, and why Promise.then runs before setTimeout.",
    date: "2026-02-15",
    readTime: "12 min read",
    tags: ["JavaScript", "Event Loop", "Async"],
  },
  {
    slug: "python-memory-management",
    title: "Python Memory Management — Reference Counting, GC & the GIL",
    description:
      "Deep dive into how CPython manages memory. Learn about reference counting, cyclic garbage collection, memory pools, and how the GIL affects multi-threaded Python programs.",
    date: "2026-02-20",
    readTime: "10 min read",
    tags: ["Python", "Memory", "GC"],
  },
  {
    slug: "stack-vs-heap",
    title: "Stack vs Heap Memory — What Every Developer Should Know",
    description:
      "Understand the difference between stack and heap memory allocation. Learn when each is used in C, C++, Java, Python, and JavaScript, and how it affects performance.",
    date: "2026-02-25",
    readTime: "8 min read",
    tags: ["Memory", "Stack", "Heap", "Fundamentals"],
  },
];

const BLOG_TO_EXAMPLE: Record<string, string> = {
  'javascript-event-loop-explained': 'event-loop',
  'python-memory-management': 'memory-allocation',
  'stack-vs-heap': 'recursion',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            <BookOpen className="w-3 h-3" />
            Developer Blog
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Latest Tech <span className="gradient-text">Articles</span>
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto">
            In-depth articles about how code really works — from the event
            loop to memory management and beyond.
          </p>
        </div>

        <div className="space-y-6">
          {BLOG_POSTS.map((post) => {
            const linkedExample = getExampleById(BLOG_TO_EXAMPLE[post.slug]);
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block p-6 rounded-xl border border-border bg-surface hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 text-xs text-muted mb-3">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  {post.description}
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-surface-secondary text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {linkedExample && (
                      <span className="px-2 py-1 rounded-md border border-border text-xs text-muted">Try this example</span>
                    )}
                    <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all flex-shrink-0">
                      Read more <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {BLOG_POSTS.map((post) => {
            const linkedExample = getExampleById(BLOG_TO_EXAMPLE[post.slug]);
            if (!linkedExample) return null;
            return (
              <Link
                key={`play-${post.slug}`}
                href={buildPlaygroundUrl(linkedExample)}
                className="px-3 py-2 rounded-lg border border-border text-sm text-muted hover:text-foreground hover:border-accent transition-colors"
              >
                Run in playground: {post.title.split(' ')[0]}
              </Link>
            );
          })}
        </div>

        <BlogCommunitySection />
      </div>
    </div>
  );
}
