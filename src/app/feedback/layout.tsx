import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback — Share Your Thoughts on Code Visualizer",
  description:
    "Send us feedback, report bugs, request new algorithm visualizers, or share suggestions. Help improve Code Visualizer for the developer community.",
  keywords: [
    "code visualizer feedback",
    "report bug",
    "feature request",
    "algorithm visualizer feedback",
    "code view suggestions",
    "open source feedback",
  ],
  alternates: {
    canonical: "https://www.codevisualizer.app/feedback",
  },
  openGraph: {
    title: "Feedback — Share Your Thoughts on Code Visualizer",
    description:
      "Send us feedback, report bugs, request new visualizers, or share suggestions for Code Visualizer.",
    url: "https://www.codevisualizer.app/feedback",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feedback — Code Visualizer",
    description:
      "Report bugs, request features, and share suggestions with the Code Visualizer team.",
  },
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
