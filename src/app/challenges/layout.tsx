import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Challenges — Practice Coding Problems with Test Cases",
  description:
    "Practice coding challenges with built-in test cases. Solve problems in JavaScript, Python, C++, and Java. Write solutions, run tests, and verify your approach — all in the browser.",
  keywords: [
    "code challenges",
    "coding practice",
    "programming challenges",
    "leetcode alternative",
    "code problems",
    "coding interview practice",
    "algorithm challenges",
    "data structure problems",
  ],
  alternates: {
    canonical: "https://www.codevisualizer.app/challenges",
  },
  openGraph: {
    title: "Code Challenges — Practice Coding Problems Online",
    description:
      "Practice coding challenges with built-in test cases. Solve problems and verify your solutions in the browser.",
    url: "https://www.codevisualizer.app/challenges",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Challenges — Coding Practice Online",
    description:
      "Solve coding problems with test cases in JavaScript, Python, C++, and Java.",
  },
};

export default function ChallengesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
