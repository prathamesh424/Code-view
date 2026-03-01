import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coding Challenges & Logic Puzzles",
  description:
    "Practice coding interview questions with visual feedback. Solve logic puzzles and improve your problem-solving skills.",
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
    title: "Coding Challenges & Logic Puzzles",
    description:
      "Practice coding interview questions with visual feedback. Solve logic puzzles and improve your problem-solving skills.",
    url: "https://www.codevisualizer.app/challenges",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coding Challenges & Logic Puzzles",
    description:
      "Practice coding interview questions with visual feedback. Solve logic puzzles.",
  },
};

export default function ChallengesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
