import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ready-to-Run Code Examples — Algorithms, Data Structures & Concepts",
  description:
    "Browse curated, ready-to-run code examples for algorithms, data structures, and programming concepts. Launch any snippet into the interactive playground with one click.",
  keywords: [
    "code examples",
    "algorithm code snippets",
    "data structure examples",
    "javascript code examples",
    "python code examples",
    "cpp code examples",
    "interactive code snippets",
    "coding interview examples",
    "learn to code examples",
  ],
  alternates: {
    canonical: "https://www.codevisualizer.app/examples",
  },
  openGraph: {
    title: "Ready-to-Run Code Examples — Algorithms, Data Structures & Concepts",
    description:
      "Browse curated, ready-to-run code examples. Launch any snippet into the interactive playground with one click.",
    url: "https://www.codevisualizer.app/examples",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ready-to-Run Code Examples — Code Visualizer",
    description:
      "Curated code examples for algorithms, data structures, and core programming concepts. Run and visualize instantly.",
  },
};

const examplesBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.codevisualizer.app" },
    { "@type": "ListItem", position: 2, name: "Examples", item: "https://www.codevisualizer.app/examples" },
  ],
};

const examplesItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Curated Code Examples Library",
  description: "Library of interactive code examples for algorithms, data structures, and core programming concepts.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Algorithm Examples",
      description: "Ready-to-run implementations of sorting, searching, sliding window, and graph algorithms.",
      url: "https://www.codevisualizer.app/examples#algorithms",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Data Structure Examples",
      description: "Code snippets for linked lists, binary trees, stacks, queues, and hash tables.",
      url: "https://www.codevisualizer.app/examples#data-structures",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Programming Concepts Examples",
      description: "Interactive examples illustrating recursion, closures, async/await, and memory management.",
      url: "https://www.codevisualizer.app/examples#programming-concepts",
    },
  ],
};

const examplesWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Ready-to-Run Code Examples — Code Visualizer",
  description: "Browse curated code examples for algorithms, data structures, and programming concepts.",
  url: "https://www.codevisualizer.app/examples",
  isPartOf: { "@type": "WebSite", url: "https://www.codevisualizer.app" },
  about: { "@type": "Thing", name: "Computer Science Code Examples" },
  educationalLevel: "Beginner to Advanced",
  learningResourceType: "Interactive code examples",
};

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            examplesBreadcrumbJsonLd,
            examplesItemListJsonLd,
            examplesWebPageJsonLd,
          ]),
        }}
      />
      {children}
    </>
  );
}
