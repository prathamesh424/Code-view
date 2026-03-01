import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Data Structure Visualizer — Arrays, Trees, Graphs, Hash Maps & More",
  description:
    "Interactive data structure visualizations: arrays, linked lists, stacks, queues, binary search trees, graphs, hash maps, and heaps. Watch operations animate in real-time with complexity analysis.",
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
    title:
      "Data Structure Visualizer — Arrays, Trees, Graphs, Hash Maps & More",
    description:
      "Interactive visualizations of arrays, trees, graphs, hash maps, and heaps with real-time operation animations.",
    url: "https://www.codevisualizer.app/data-structures",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Structure Visualizer — Interactive DS Animations",
    description:
      "Visualize arrays, trees, graphs, hash maps, and heaps with real-time animations.",
  },
};

export default function DataStructuresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
