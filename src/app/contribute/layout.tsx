import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contribute — Open Source Code Visualizer',
  description:
    'Join the Code-View open source community. Learn how to contribute new algorithm visualizers, fix bugs, improve documentation, and make learning CS concepts accessible to everyone.',
  keywords: [
    'open source',
    'contribute',
    'github',
    'algorithm visualizer',
    'code view contribute',
    'good first issue',
    'hacktoberfest',
    'open source contribution',
    'open source project for beginners',
    'contribute to open source',
    'first open source contribution',
  ],
  alternates: {
    canonical: 'https://www.codevisualizer.app/contribute',
  },
  openGraph: {
    title: 'Contribute to Code-View — Open Source',
    description:
      'Help build the future of code visualization. Contribute algorithms, fix bugs, improve docs, and join our growing open-source community.',
    url: 'https://www.codevisualizer.app/contribute',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contribute to Code-View — Open Source',
    description:
      'Help build the future of code visualization. Contribute algorithms, fix bugs, and join our open-source community.',
  },
};

const contributeBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.codevisualizer.app" },
    { "@type": "ListItem", position: 2, name: "Contribute", item: "https://www.codevisualizer.app/contribute" },
  ],
};

const contributeHowToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Contribute to Code-View Open Source",
  description: "Step-by-step guide to contributing new visualizers, fixing bugs, and improving docs for the Code-View project.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Fork and Clone",
      text: "Fork https://github.com/prathamesh424/Code-view and clone your fork locally using git clone.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Install and Run",
      text: "Run npm install to install dependencies, then run npm run dev to launch the local development server at http://localhost:3000.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Pick an Issue or Add a Visualizer",
      text: "Browse GitHub Issues for 'good first issue' labels or propose a new algorithm or data structure visualization component.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Submit a Pull Request",
      text: "Commit your changes with clear messages, push to your branch, and open a PR with a description and screenshots.",
    },
  ],
};

const contributeWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Contribute to Code-View — Open Source",
  description: "Help build the future of code visualization. Contribute algorithms, fix bugs, improve docs, and join our growing open-source community.",
  url: "https://www.codevisualizer.app/contribute",
  isPartOf: { "@type": "WebSite", url: "https://www.codevisualizer.app" },
  about: { "@type": "Thing", name: "Open Source Software Development" },
};

export default function ContributeLayout({
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
            contributeBreadcrumbJsonLd,
            contributeHowToJsonLd,
            contributeWebPageJsonLd,
          ]),
        }}
      />
      {children}
    </>
  );
}
