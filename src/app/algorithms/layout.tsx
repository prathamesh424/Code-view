import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algorithm Visualizer — Sorting, Searching, Pathfinding & More",
  description:
    "Interactive algorithm visualizations: sorting (bubble, merge, quick sort), searching (binary search), pathfinding (BFS, DFS, Dijkstra, A*), recursion trees, dynamic programming, and backtracking — all animated step by step.",
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
    title: "Algorithm Visualizer — Sorting, Searching, Pathfinding & More",
    description:
      "Watch algorithms in action with real-time animations. Sorting, searching, graph traversal, DP, and backtracking visualized step by step.",
    url: "https://www.codevisualizer.app/algorithms",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Algorithm Visualizer — Interactive Algorithm Animations",
    description:
      "Visualize sorting, searching, pathfinding, and dynamic programming algorithms step by step.",
  },
};

export default function AlgorithmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
