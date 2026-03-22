import { ChallengeRunner } from '@/components/visualizer-tools/challenges/ChallengeRunner';

export const revalidate = 86400; // Next.js ISR: updates page at next build and serves statically

type Props = {
  params: Promise<{ slug: string }>;
};

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
