'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Play, Code2 } from 'lucide-react';
import { EXAMPLE_LIBRARY, type ExampleCategory, buildPlaygroundUrl } from '@/lib/examples';
import { addRecentVisualization, getFavoriteExamples, toggleFavoriteExample } from '@/lib/user-progress';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: Record<ExampleCategory, string> = {
  algorithms: 'Algorithms',
  'data-structures': 'Data Structures',
  'programming-concepts': 'Programming Concepts',
};

const CATEGORY_ORDER: ExampleCategory[] = ['algorithms', 'data-structures', 'programming-concepts'];

export default function ExamplesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavoriteExamples());
  }, []);

  const total = useMemo(
    () => CATEGORY_ORDER.reduce((acc, category) => acc + EXAMPLE_LIBRARY[category].length, 0),
    []
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">Ready-to-Run Examples</h1>
          <p className="text-muted text-sm sm:text-base max-w-2xl">
            Launch any snippet directly in the playground with one click. Includes algorithms, data structures, and core programming concepts.
          </p>
          <p className="text-xs text-muted mt-2">{total} curated examples available</p>
        </div>

        <div className="space-y-10">
          {CATEGORY_ORDER.map((category) => (
            <section key={category}>
              <h2 className="text-2xl font-bold text-foreground mb-4">{CATEGORY_LABELS[category]}</h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {EXAMPLE_LIBRARY[category].map((example) => {
                  const href = buildPlaygroundUrl(example);
                  const isFavorite = favorites.includes(example.id);

                  return (
                    <motion.article
                      key={example.id}
                      whileHover={{ y: -4 }}
                      className="rounded-xl border border-border bg-surface p-4"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{example.title}</h3>
                          <p className="text-xs text-accent mt-0.5">{example.language}</p>
                        </div>
                        <button
                          onClick={() => setFavorites(toggleFavoriteExample(example.id))}
                          className={cn(
                            'p-1.5 rounded-md border transition-colors',
                            isFavorite
                              ? 'border-error/40 text-error bg-error/10'
                              : 'border-border text-muted hover:text-foreground'
                          )}
                          aria-label="Favorite example"
                        >
                          <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
                        </button>
                      </div>

                      <p className="text-sm text-muted mb-2">{example.description}</p>
                      <p className="text-xs text-muted mb-3">{example.explanation}</p>

                      <pre className="rounded-lg bg-background border border-border p-3 text-[11px] text-muted font-mono overflow-x-auto max-h-36">
                        {example.code}
                      </pre>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={href}
                          onClick={() =>
                            addRecentVisualization({
                              id: example.id,
                              title: example.title,
                              href,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Visualize this example
                        </Link>
                        <Link
                          href="/playground"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted hover:text-foreground transition-colors"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          Open playground
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
