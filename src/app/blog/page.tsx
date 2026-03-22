import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { BlogCommunitySection } from './BlogCommunitySection';

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
            loop to memory management and beyond. Read from our community developers.
          </p>
        </div>

        <BlogCommunitySection />
      </div>
    </div>
  );
}
