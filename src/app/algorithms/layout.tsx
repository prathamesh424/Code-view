import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algorithm Visualizer - Sorting, Searching & Pathfinding",
  description:
    "Step-by-step algorithm visualizations. Watch Bubble Sort, Dijkstra's Algorithm, BFS, and DFS run in real-time to understand the logic.",
  keywords: [
    "algorithm visualizer",
    "sorting visualizer",
    "binary search visualizer",
    "pathfinding visualizer",
    "bfs dfs visualizer",
    "recursion tree visualizer",
    "dynamic programming visualizer",
    "algorithm animation",
    "sorting algorithm comparison",
  ],
  alternates: {
    canonical: "https://www.codevisualizer.app/algorithms",
  },
  openGraph: {
    title: "Algorithm Visualizer - Sorting, Searching & Pathfinding",
    description:
      "Step-by-step algorithm visualizations. Watch Bubble Sort, Dijkstra's Algorithm, BFS, and DFS run in real-time.",
    url: "https://www.codevisualizer.app/algorithms",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Algorithm Visualizer - Sorting, Searching & Pathfinding",
    description:
      "Step-by-step algorithm visualizations. Watch sorting, searching, and pathfinding algorithms run in real-time.",
  },
};

export default function AlgorithmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
