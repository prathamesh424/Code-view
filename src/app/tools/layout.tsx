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

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
