import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Tools — Big-O Calculator, Regex Tester, Bit Manipulation",
  description:
    "Free interactive developer tools: Big-O complexity chart, regex playground with real-time matching, bit manipulation visualizer, and code complexity analyzer — all in your browser.",
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
    title: "Developer Tools — Big-O, Regex, Bit Manipulation & More",
    description:
      "Interactive developer tools: Big-O chart, regex tester, bit manipulation, and complexity analyzer.",
    url: "https://www.codevisualizer.app/tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Tools — Interactive Programming Utilities",
    description:
      "Big-O chart, regex playground, bit manipulation, and code complexity analyzer.",
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
