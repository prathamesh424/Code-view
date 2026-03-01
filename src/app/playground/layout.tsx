import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Code Playground & Visualizer - Run Code in Real-Time",
  description:
    "Free online code playground. Visualize execution flow, debug algorithms, and test data structures in JavaScript, Python, and C++ instantly.",
  keywords: [
    "code playground",
    "online code editor",
    "run code online",
    "code runner",
    "javascript playground",
    "python playground",
    "online IDE",
    "code executor",
  ],
  alternates: {
    canonical: "https://www.codevisualizer.app/playground",
  },
  openGraph: {
    title: "Online Code Playground & Visualizer - Run Code in Real-Time",
    description:
      "Free online code playground. Visualize execution flow, debug algorithms, and test data structures in JavaScript, Python, and C++ instantly.",
    url: "https://www.codevisualizer.app/playground",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Code Playground & Visualizer - Run Code in Real-Time",
    description:
      "Free online code playground. Visualize execution flow, debug algorithms, and test data structures instantly.",
  },
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
