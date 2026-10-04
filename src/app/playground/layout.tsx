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

const playgroundBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.codevisualizer.app" },
    { "@type": "ListItem", position: 2, name: "Playground", item: "https://www.codevisualizer.app/playground" },
  ],
};

const playgroundWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Online Code Playground & Visualizer — Run Code in Real-Time",
  description: "Free online code playground. Visualize execution flow, debug algorithms, and test data structures in JavaScript, Python, and C++ instantly.",
  url: "https://www.codevisualizer.app/playground",
  isPartOf: { "@type": "WebSite", url: "https://www.codevisualizer.app" },
  about: { "@type": "Thing", name: "Interactive Code Execution" },
  educationalLevel: "Beginner to Advanced",
  learningResourceType: "Interactive playground",
};

export default function PlaygroundLayout({
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
            playgroundBreadcrumbJsonLd,
            playgroundWebPageJsonLd,
          ]),
        }}
      />
      {children}
    </>
  );
}
