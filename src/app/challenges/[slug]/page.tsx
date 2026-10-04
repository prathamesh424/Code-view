import { ChallengeRunner } from '@/components/visualizer-tools/challenges/ChallengeRunner';
import { Metadata } from 'next';

export const revalidate = 86400; // Next.js ISR: updates page at next build and serves statically

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return [];
  try {
    const res = await fetch(`${convexUrl}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "userChallenges:listForSitemap",
        args: {},
        format: "json",
      }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.value ?? []).map((challenge: { slug: string }) => ({
      slug: challenge.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const challengeTitle = resolvedParams.slug.replace(/-/g, ' ');
  const title = `Coding Challenge: ${challengeTitle} | Code Visualizer`;
  const description = `Solve and visualize the ${challengeTitle} coding challenge step by step with animated execution.`;
  const url = `https://www.codevisualizer.app/challenges/${resolvedParams.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: "https://www.codevisualizer.app/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.codevisualizer.app/og-image.png"],
    },
  };
}

export default async function ChallengePage({ params }: Props) {
  const resolvedParams = await params;
  const challengeTitle = resolvedParams.slug.replace(/-/g, ' ');
  const challengeUrl = `https://www.codevisualizer.app/challenges/${resolvedParams.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.codevisualizer.app" },
      { "@type": "ListItem", position: 2, name: "Challenges", item: "https://www.codevisualizer.app/challenges" },
      { "@type": "ListItem", position: 3, name: challengeTitle, item: challengeUrl },
    ],
  };

  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: `Coding Challenge: ${challengeTitle}`,
    description: `Interactive coding challenge for ${challengeTitle} with animated execution.`,
    url: challengeUrl,
    educationalLevel: "Intermediate",
    learningResourceType: "Coding Challenge",
    isPartOf: {
      "@type": "WebSite",
      url: "https://www.codevisualizer.app",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, learningResourceJsonLd]),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChallengeRunner slug={resolvedParams.slug} />
      </div>
    </div>
  );
}
