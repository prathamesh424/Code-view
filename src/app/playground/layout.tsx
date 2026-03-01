import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Playground — Run & Visualize Code Online Free",
  description:
    "Write and execute JavaScript, Python, C++, and Java code in your browser. Set breakpoints, step through execution, and visualize the call stack, memory, and event loop in real-time.",
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
    title: "Code Playground — Run & Visualize Code Online Free",
    description:
      "Write, execute, and visualize JavaScript, Python, C++, and Java code in your browser — no install required.",
    url: "https://www.codevisualizer.app/playground",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Playground — Run & Visualize Code Online Free",
    description:
      "Write, execute, and visualize code in your browser — no install required.",
  },
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
