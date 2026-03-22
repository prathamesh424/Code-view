import { Trophy } from 'lucide-react';
import { UserChallenges } from '@/components/visualizer-tools/challenges/UserChallenges';

export const metadata = {
  title: "CodeVisualizer - Coding Challenges",
  description: "Practice coding problems with built-in test cases. Create and solve community challenges.",
};

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            <Trophy className="w-8 h-8 inline mr-3 text-accent -mt-1" />
            Community Coding Challenges
          </h1>
          <p className="text-muted text-sm">
            Practice coding problems with built-in test cases submitted by our community. Write your solution, run tests, and verify your approach.
          </p>
        </div>

        <UserChallenges />
      </div>
    </div>
  );
}
