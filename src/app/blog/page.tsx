import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { BlogCommunitySection } from './BlogCommunitySection';

export const metadata: Metadata = {
  title: "CodeVisualizer Blog — Tutorials, CS Concepts & Programming Guides",
  description:
    "Read tutorials on computer science fundamentals, coding tips, and how to use visualization to learn programming faster. Articles on JavaScript event loop, Python memory, algorithms, and more.",
  keywords: [
    "programming blog",
    "computer science tutorials",
    "coding tips",
    "javascript event loop explained",
    "python memory management",
    "stack vs heap",
    "algorithm tutorials",
    "data structure guides",
    "learn programming",
    "cs fundamentals",
    "code visualization blog",
  ],
  alternates: { canonical: "https://www.codevisualizer.app/blog" },
  openGraph: {
    title: "CodeVisualizer Blog — Tutorials & CS Concepts",
    description:
      "Read tutorials on computer science fundamentals, coding tips, and how to use visualization to learn programming faster.",
    url: "https://www.codevisualizer.app/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeVisualizer Blog — Tutorials & CS Concepts",
    description:
      "In-depth articles on JavaScript, Python, algorithms, data structures, and how code really works under the hood.",
  },
};

const blogBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.codevisualizer.app" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.codevisualizer.app/blog" },
  ],
};

const blogCollectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Code Visualizer Developer Blog",
  description: "In-depth tutorials and articles on computer science fundamentals, event loop mechanics, memory models, algorithms, and data structures.",
  url: "https://www.codevisualizer.app/blog",
  publisher: {
    "@type": "Organization",
    name: "Code Visualizer",
    url: "https://www.codevisualizer.app",
    logo: "https://www.codevisualizer.app/apple-touch-icon.png",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([blogBreadcrumbJsonLd, blogCollectionJsonLd]),
        }}
      />
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
