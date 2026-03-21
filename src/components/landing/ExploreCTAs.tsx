import Link from 'next/link';

const CTA_ITEMS = [
  {
    title: 'Try a Data Structure Visualization',
    description: 'See stacks, queues, trees, heaps, and graphs update in real time.',
    href: '/data-structures',
  },
  {
    title: 'Explore Algorithms',
    description: 'Compare sorting, searching, pathfinding, and dynamic programming flows.',
    href: '/algorithms',
  },
  {
    title: 'Practice Coding Challenges',
    description: 'Run tests, iterate quickly, and track solved problems.',
    href: '/challenges',
  },
];

export function ExploreCTAs() {
  return (
    <section className="py-14 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-4">
          {CTA_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-border bg-surface p-5 hover:border-accent/40 hover:bg-accent/5 transition-all"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
