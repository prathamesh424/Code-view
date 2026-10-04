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

const challengesBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.codevisualizer.app" },
    { "@type": "ListItem", position: 2, name: "Challenges", item: "https://www.codevisualizer.app/challenges" },
  ],
};

const challengesFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are Code Visualizer coding challenges?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Code Visualizer challenges are interactive coding puzzles with instant visual feedback. Instead of just passing or failing test cases, you watch your code execute step-by-step to see where logic errors occur.",
      },
    },
    {
      "@type": "Question",
      name: "How do visual coding challenges differ from LeetCode?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlike traditional competitive programming platforms like LeetCode or HackerRank that only show console output, Code Visualizer shows animated memory, variable changes, call stacks, and pointer movements while running test cases.",
      },
    },
    {
      "@type": "Question",
      name: "Can I submit my own coding challenge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Code Visualizer is open source and community-driven. You can create custom challenges and test cases, share them with peers, or contribute new problems via our GitHub repository.",
      },
    },
  ],
};

const challengesWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Coding Challenges & Logic Puzzles — Code Visualizer",
  description: "Practice coding interview questions with visual feedback. Solve logic puzzles and improve your problem-solving skills.",
  url: "https://www.codevisualizer.app/challenges",
  isPartOf: { "@type": "WebSite", url: "https://www.codevisualizer.app" },
  about: { "@type": "Thing", name: "Coding Interview Challenges" },
  educationalLevel: "Beginner to Advanced",
  learningResourceType: "Interactive coding challenge platform",
};

export default function ChallengesLayout({
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
            challengesBreadcrumbJsonLd,
            challengesFaqJsonLd,
            challengesWebPageJsonLd,
          ]),
        }}
      />
      {children}
    </>
  );
}
