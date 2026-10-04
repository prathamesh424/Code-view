import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Tools for Coding & Debugging",
  description:
    "Essential tools for developers: Regex tester, JSON formatter, Time complexity analyzer, and code converters.",
  keywords: [
    "big o chart",
    "big o calculator",
    "regex tester online",
    "regex playground",
    "bit manipulation visualizer",
    "complexity analyzer",
    "developer tools online",
    "time complexity calculator",
  ],
  alternates: {
    canonical: "https://www.codevisualizer.app/tools",
  },
  openGraph: {
    title: "Developer Tools for Coding & Debugging",
    description:
      "Essential tools for developers: Regex tester, JSON formatter, Time complexity analyzer, and code converters.",
    url: "https://www.codevisualizer.app/tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Tools for Coding & Debugging",
    description:
      "Essential tools for developers: Regex tester, Time complexity analyzer, and code converters.",
  },
};

const toolsBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.codevisualizer.app" },
    { "@type": "ListItem", position: 2, name: "Developer Tools", item: "https://www.codevisualizer.app/tools" },
  ],
};

const toolsItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Developer Productivity Tools",
  description: "Free in-browser developer utility tools for coding, debugging, regex testing, and complexity analysis.",
  numberOfItems: 4,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Big-O Chart & Complexity Guide",
      description: "Interactive Big-O complexity comparison chart from O(1) to O(2ⁿ).",
      url: "https://www.codevisualizer.app/tools#bigo",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Regex Playground",
      description: "Interactive regular expression tester with real-time match highlighting and group capture.",
      url: "https://www.codevisualizer.app/tools#regex",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Bit Manipulation Visualizer",
      description: "Bitwise operator visualizer for AND, OR, XOR, NOT, left shift, and right shift.",
      url: "https://www.codevisualizer.app/tools#bitwise",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Time Complexity Analyzer",
      description: "Automated code complexity estimation tool for time and space asymptotic analysis.",
      url: "https://www.codevisualizer.app/tools#complexity",
    },
  ],
};

const toolsFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What developer tools are available on Code Visualizer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Code Visualizer provides four essential developer tools: an interactive Big-O complexity chart, an online regex tester with live highlighting, a bit manipulation visualizer (AND, OR, XOR, shifts), and a time complexity analyzer.",
      },
    },
    {
      "@type": "Question",
      name: "What is Big-O notation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Big-O notation describes the upper bound of the execution time or space requirement of an algorithm in the worst-case scenario as input size (n) grows. Common complexities range from O(1) constant time (fastest) to O(log n), O(n), O(n log n), O(n²), and O(2ⁿ) exponential time (slowest).",
      },
    },
    {
      "@type": "Question",
      name: "How do I visualize bitwise operations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Bit Manipulation visualizer displays binary representations of integers bit by bit. When you execute operations like bitwise AND (&), OR (|), XOR (^), NOT (~), or bit shifts (<<, >>), each bit's transition is visually highlighted in real time.",
      },
    },
  ],
};

const toolsWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Developer Tools for Coding & Debugging",
  description: "Essential tools for developers: Regex tester, JSON formatter, Time complexity analyzer, and code converters.",
  url: "https://www.codevisualizer.app/tools",
  isPartOf: { "@type": "WebSite", url: "https://www.codevisualizer.app" },
  about: { "@type": "Thing", name: "Developer Tools" },
  educationalLevel: "Beginner to Advanced",
  learningResourceType: "Developer tool collection",
};

export default function ToolsLayout({
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
            toolsBreadcrumbJsonLd,
            toolsItemListJsonLd,
            toolsFaqJsonLd,
            toolsWebPageJsonLd,
          ]),
        }}
      />
      {children}
    </>
  );
}
