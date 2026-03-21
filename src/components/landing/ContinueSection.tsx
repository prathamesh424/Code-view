'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { History, Heart, Trophy, ArrowRight } from 'lucide-react';
import { getRecentVisualizations, getFavoriteExamples, getSolvedChallenges } from '@/lib/user-progress';
import { getExampleById, buildPlaygroundUrl } from '@/lib/examples';

interface RecentItem {
  id: string;
  title: string;
  href: string;
  timestamp: number;
}

export function ContinueSection() {
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    setRecent(getRecentVisualizations().slice(0, 3));
    setFavorites(getFavoriteExamples());
    setSolvedCount(getSolvedChallenges().length);
  }, []);

  if (recent.length === 0 && favorites.length === 0 && solvedCount === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-5">Continue where you left off</h2>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-foreground">Recent Visualizations</h3>
            </div>
            <div className="space-y-2">
              {recent.length === 0 ? (
                <p className="text-sm text-muted">No recent visualizations yet.</p>
              ) : (
                recent.map((item) => (
                  <Link key={item.id} href={item.href} className="block text-sm text-muted hover:text-accent transition-colors">
                    {item.title}
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-error" />
              <h3 className="font-semibold text-foreground">Favorite Examples</h3>
            </div>
            <div className="space-y-2">
              {favorites.length === 0 ? (
                <p className="text-sm text-muted">Save favorites from the examples page.</p>
              ) : (
                favorites.slice(0, 3).map((id) => {
                  const example = getExampleById(id);
                  if (!example) return null;
                  return (
                    <Link key={id} href={buildPlaygroundUrl(example)} className="block text-sm text-muted hover:text-accent transition-colors">
                      {example.title}
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-warning" />
              <h3 className="font-semibold text-foreground">Challenge Progress</h3>
            </div>
            <p className="text-sm text-muted mb-4">You have solved {solvedCount} coding challenges.</p>
            <Link href="/challenges" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:gap-2 transition-all">
              Continue challenges
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
