import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Structures Visualizer - Learn Lists, Trees, & Graphs",
  description:
    "Visualize how data structures work. Interactive animations for Linked Lists, Binary Trees, Stacks, Queues, and Graphs to master CS concepts.",
  keywords: [
    "data structure visualizer",
    "binary search tree visualizer",
    "graph visualizer",
    "linked list visualizer",
    "hash map visualizer",
    "heap visualizer",
    "stack queue visualizer",
    "array visualizer",
    "interactive data structures",
  ],
  alternates: {
    canonical: "https://www.codevisualizer.app/data-structures",
  },
  openGraph: {
    title: "Data Structures Visualizer - Learn Lists, Trees, & Graphs",
    description:
      "Visualize how data structures work. Interactive animations for Linked Lists, Binary Trees, Stacks, Queues, and Graphs.",
    url: "https://www.codevisualizer.app/data-structures",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Structures Visualizer - Learn Lists, Trees, & Graphs",
    description:
      "Interactive animations for Linked Lists, Binary Trees, Stacks, Queues, and Graphs.",
  },
};

const dataStructuresBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.codevisualizer.app" },
    { "@type": "ListItem", position: 2, name: "Data Structures", item: "https://www.codevisualizer.app/data-structures" },
  ],
};

const dataStructuresItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Interactive Data Structure Visualizers",
  description: "Learn fundamental computer science data structures with animated, step-by-step visual models.",
  numberOfItems: 7,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Dynamic Array",
      description: "Array visualizer showing contiguous memory, index lookup O(1), and dynamic resizing.",
      url: "https://www.codevisualizer.app/data-structures#array",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Linked List",
      description: "Singly linked list visualizer with pointer updates for insert, delete, and traversal.",
      url: "https://www.codevisualizer.app/data-structures#linked-list",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Stack & Queue",
      description: "LIFO Stack and FIFO Queue visualizer showing push, pop, enqueue, and dequeue operations.",
      url: "https://www.codevisualizer.app/data-structures#stack-queue",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Binary Search Tree (BST)",
      description: "Interactive BST visualizer with node insertion, deletion, searching, and tree balancing.",
      url: "https://www.codevisualizer.app/data-structures#tree",
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Graph",
      description: "Graph representation visualizer with vertex, edge manipulation, BFS, and DFS traversal.",
      url: "https://www.codevisualizer.app/data-structures#graph",
    },
    {
      "@type": "ListItem",
      position: 6,
      name: "Hash Map",
      description: "Hash table visualizer showing hash function calculation, bucket arrays, and collision resolution.",
      url: "https://www.codevisualizer.app/data-structures#hashmap",
    },
    {
      "@type": "ListItem",
      position: 7,
      name: "Binary Heap",
      description: "Min-Heap and Max-Heap visualizer with heapify-up, heapify-down, and extract-min/max animations.",
      url: "https://www.codevisualizer.app/data-structures#heap",
    },
  ],
};

const dataStructuresFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What data structures can I visualize on Code Visualizer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can interactively visualize Dynamic Arrays, Singly Linked Lists, Stacks, Queues, Binary Search Trees (BST), Graphs, Hash Maps (with separate chaining), and Binary Heaps (Min/Max Heap).",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a stack and a queue?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Stack follows the Last-In, First-Out (LIFO) principle where elements are inserted (pushed) and removed (popped) from the same end (the top). A Queue follows First-In, First-Out (FIFO) where elements are added at the rear (enqueue) and removed from the front (dequeue). Both have O(1) time complexity for insertions and removals.",
      },
    },
    {
      "@type": "Question",
      name: "How does a hash map resolve collisions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When two distinct keys hash to the same bucket index, hash maps use collision resolution techniques. The most common is Separate Chaining, where each bucket contains a linked list of entries that share that index. Code Visualizer animates separate chaining so you can see key-value pairs link into buckets.",
      },
    },
    {
      "@type": "Question",
      name: "When should I use a Binary Search Tree instead of a Hash Map?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use a Hash Map when you only need O(1) average lookup, insertion, and deletion by key without needing sorted order. Use a Binary Search Tree (or Self-Balancing BST) when you need elements maintained in sorted order, need range queries (e.g., find all values between X and Y), or need predecessor/successor operations with O(log n) guarantees.",
      },
    },
  ],
};

const dataStructuresWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Data Structures Visualizer — Learn Lists, Trees, & Graphs",
  description: "Visualize how data structures work. Interactive animations for Linked Lists, Binary Trees, Stacks, Queues, and Graphs to master CS concepts.",
  url: "https://www.codevisualizer.app/data-structures",
  isPartOf: { "@type": "WebSite", url: "https://www.codevisualizer.app" },
  about: { "@type": "Thing", name: "Data Structures Computer Science Education" },
  educationalLevel: "Beginner to Advanced",
  learningResourceType: "Interactive data structure visualizer",
};

export default function DataStructuresLayout({
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
            dataStructuresBreadcrumbJsonLd,
            dataStructuresItemListJsonLd,
            dataStructuresFaqJsonLd,
            dataStructuresWebPageJsonLd,
          ]),
        }}
      />
      {children}
    </>
  );
}
