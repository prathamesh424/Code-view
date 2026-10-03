import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contribute — Open Source',
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
  ],
  openGraph: {
    title: 'Contribute to Code-View — Open Source',
    description:
      'Help build the future of code visualization. Contribute algorithms, fix bugs, improve docs, and join our growing open-source community.',
  },
};

export default function ContributeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
