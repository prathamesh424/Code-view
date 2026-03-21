import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import { getExampleById, POPULAR_EXAMPLES, buildPlaygroundUrl } from '@/lib/examples';

export function PopularVisualizations() {
  const cards = POPULAR_EXAMPLES
    .map((id) => getExampleById(id))
    .filter((item) => item !== undefined);

  return (
    <section className="py-14 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-5">
          <Flame className="w-5 h-5 text-warning" />
          <h2 className="text-2xl font-bold text-foreground">Popular Visualizations</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((example) => (
            <Link
              key={example.id}
              href={buildPlaygroundUrl(example)}
              className="group rounded-xl border border-border bg-surface p-4 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 transition-all"
            >
              <p className="text-xs uppercase tracking-wide text-accent mb-1">{example.category.replace('-', ' ')}</p>
              <h3 className="text-lg font-semibold text-foreground mb-2">{example.title}</h3>
              <p className="text-sm text-muted line-clamp-2 mb-3">{example.description}</p>
              <span className="text-sm text-accent font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Run this example
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
