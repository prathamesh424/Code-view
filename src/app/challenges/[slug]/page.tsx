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
  
  return {
    title: `Coding Challenge: ${resolvedParams.slug} | Code Visualizer`,
    description: `Solve and visualize the ${resolvedParams.slug} coding challenge step by step.`,
    alternates: {
      canonical: `https://www.codevisualizer.app/challenges/${resolvedParams.slug}`
    }
  };
}

export default async function ChallengePage({ params }: Props) {
  const resolvedParams = await params;
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChallengeRunner slug={resolvedParams.slug} />
      </div>
    </div>
  );
}
