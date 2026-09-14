import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algorithm Visualizer — Sorting, Searching, Sliding Window, DP & More",
  description:
    "Step-by-step algorithm visualizations. Watch Bubble Sort, Dijkstra's, Sliding Window, Two Pointers, Dynamic Programming, Greedy, and Backtracking algorithms run in real-time to understand the logic.",
  keywords: [
    "algorithm visualizer",
    "sorting visualizer",
    "binary search visualizer",
    "pathfinding visualizer",
    "bfs dfs visualizer",
    "recursion tree visualizer",
    "dynamic programming visualizer",
    "sliding window visualizer",
    "sliding window technique",
    "two pointer visualizer",
    "two pointer technique",
    "greedy algorithm visualizer",
    "activity selection visualizer",
    "knapsack visualizer",
    "algorithm animation",
    "sorting algorithm comparison",
    "DSA visualizer",
    "data structures and algorithms visualizer",
    "coding interview preparation",
    "leetcode visualizer",
  ],
  alternates: {
    canonical: "https://www.codevisualizer.app/algorithms",
  },
  openGraph: {
    title: "Algorithm Visualizer — Sorting, Searching, Sliding Window, DP & More",
    description:
      "Step-by-step algorithm visualizations. Watch sorting, searching, sliding window, two pointers, DP, greedy, and backtracking algorithms run in real-time.",
    url: "https://www.codevisualizer.app/algorithms",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Algorithm Visualizer — Sorting, Sliding Window, DP & More",
    description:
      "Step-by-step algorithm visualizations with 10 categories: sorting, searching, sliding window, two pointers, pathfinding, recursion, DP, greedy, string matching, and backtracking.",
  },
};

export default function AlgorithmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
