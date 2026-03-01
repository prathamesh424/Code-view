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

export default function DataStructuresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
