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

const algorithmsBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.codevisualizer.app" },
    { "@type": "ListItem", position: 2, name: "Algorithms", item: "https://www.codevisualizer.app/algorithms" },
  ],
};

const algorithmsItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Interactive Algorithm Visualizers",
  description: "Curated collection of interactive algorithm visualizations for computer science education and coding interview preparation.",
  numberOfItems: 10,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Sorting Algorithms",
      description: "Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, and Quick Sort animated with bar charts.",
      url: "https://www.codevisualizer.app/algorithms#sorting",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Searching Algorithms",
      description: "Linear Search and Binary Search compared side-by-side with step-by-step array inspection.",
      url: "https://www.codevisualizer.app/algorithms#searching",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Sliding Window Technique",
      description: "Fixed and variable-size sliding window visualizer for max sum subarray, longest unique substring, and min window sum.",
      url: "https://www.codevisualizer.app/algorithms#sliding-window",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Two Pointer Technique",
      description: "Two Sum Sorted, Container With Most Water, and Remove Duplicates visualized with dual converging pointers.",
      url: "https://www.codevisualizer.app/algorithms#two-pointers",
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Pathfinding Algorithms",
      description: "Grid-based pathfinding with BFS, DFS, Dijkstra, and A* shortest path search.",
      url: "https://www.codevisualizer.app/algorithms#pathfinding",
    },
    {
      "@type": "ListItem",
      position: 6,
      name: "Recursion Tree",
      description: "Call tree visualization for Fibonacci, Factorial, and Power with memoization cache tracking.",
      url: "https://www.codevisualizer.app/algorithms#recursion",
    },
    {
      "@type": "ListItem",
      position: 7,
      name: "Dynamic Programming Table",
      description: "2D table transitions for 0/1 Knapsack, Longest Common Subsequence, and Coin Change.",
      url: "https://www.codevisualizer.app/algorithms#dp",
    },
    {
      "@type": "ListItem",
      position: 8,
      name: "String Matching",
      description: "Naive pattern search, KMP (Knuth-Morris-Pratt), and Rabin-Karp rolling hash visualized.",
      url: "https://www.codevisualizer.app/algorithms#string-matching",
    },
    {
      "@type": "ListItem",
      position: 9,
      name: "Backtracking",
      description: "N-Queens constraint satisfaction and Sudoku Solver step-by-step state backtracking.",
      url: "https://www.codevisualizer.app/algorithms#backtracking",
    },
    {
      "@type": "ListItem",
      position: 10,
      name: "Greedy Algorithms",
      description: "Activity Selection and Fractional Knapsack greedy choice property visualizer.",
      url: "https://www.codevisualizer.app/algorithms#greedy",
    },
  ],
};

const algorithmsFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What algorithm visualizers are available on Code Visualizer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Code Visualizer provides 10 interactive algorithm visualization modules: Sorting (Bubble, Selection, Insertion, Merge, Quick), Searching (Linear, Binary), Sliding Window, Two Pointers, Pathfinding (BFS, DFS, Dijkstra, A*), Recursion Trees, Dynamic Programming (Knapsack, LCS), String Matching (KMP, Rabin-Karp), Backtracking (N-Queens, Sudoku), and Greedy algorithms.",
      },
    },
    {
      "@type": "Question",
      name: "How does the sliding window algorithm visualizer work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The sliding window visualizer animates both fixed-size and variable-size window techniques on arrays and strings. You can watch left and right boundary pointers expand and contract in real-time while the window state, running sum, and maximum values update step-by-step.",
      },
    },
    {
      "@type": "Question",
      name: "Why should I use an algorithm visualizer for coding interview preparation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Algorithm visualizers build spatial intuition for how pointers move, recursion unwinds, and dynamic programming tables populate. Seeing algorithms execute on dynamic inputs helps software engineers retain patterns and solve LeetCode problems faster during technical interviews.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between Dijkstra and A* pathfinding?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dijkstra's algorithm explores all directions equally by prioritizing nodes with the lowest cumulative cost, guaranteeing the shortest path but visiting more nodes. A* enhances Dijkstra by adding an admissible heuristic (estimated distance to target), directing search toward the goal and visiting significantly fewer nodes while maintaining optimality.",
      },
    },
  ],
};

const algorithmsHowToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Visualize and Learn an Algorithm Step by Step",
  description: "Learn how to use Code Visualizer to understand algorithm mechanics, pointer shifts, and time complexity.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Select Algorithm Category",
      text: "Choose from Sorting, Searching, Sliding Window, Two Pointers, Pathfinding, Recursion, DP, String Matching, Backtracking, or Greedy.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Customize Inputs and Speed",
      text: "Set array size, choose custom numbers or target values, and adjust playback speed from 0.5x to 4x.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Step Through Execution",
      text: "Use play, pause, or step buttons to observe comparisons, pointer swaps, and state transitions at each execution frame.",
    },
  ],
};

const algorithmsWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Algorithm Visualizer — Sorting, Searching, Sliding Window, DP & More",
  description: "Step-by-step algorithm visualizations. Watch Bubble Sort, Dijkstra's, Sliding Window, Two Pointers, Dynamic Programming, Greedy, and Backtracking algorithms run in real-time.",
  url: "https://www.codevisualizer.app/algorithms",
  isPartOf: { "@type": "WebSite", url: "https://www.codevisualizer.app" },
  about: { "@type": "Thing", name: "Data Structures and Algorithms Visualization" },
  educationalLevel: "Beginner to Advanced",
  learningResourceType: "Interactive algorithm visualizer",
};

export default function AlgorithmsLayout({
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
            algorithmsBreadcrumbJsonLd,
            algorithmsItemListJsonLd,
            algorithmsFaqJsonLd,
            algorithmsHowToJsonLd,
            algorithmsWebPageJsonLd,
          ]),
        }}
      />
      {children}
    </>
  );
}
