import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { LanguageShowcase } from '@/components/landing/LanguageShowcase';
import { InteractiveDemo } from '@/components/landing/InteractiveDemo';
import { PopularVisualizations } from '@/components/landing/PopularVisualizations';
import { ContinueSection } from '@/components/landing/ContinueSection';
import { ExploreCTAs } from '@/components/landing/ExploreCTAs';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <InteractiveDemo />
      <PopularVisualizations />
      <Features />
      <LanguageShowcase />
      <ContinueSection />
      <ExploreCTAs />

      {/* Internal Links Section for SEO */}
      <section className="py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Explore Code Visualizers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {[
              { href: '/javascript-visualizer', label: 'JavaScript', color: 'text-warning' },
              { href: '/python-visualizer', label: 'Python', color: 'text-info' },
              { href: '/cpp-visualizer', label: 'C++', color: 'text-accent' },
              { href: '/java-visualizer', label: 'Java', color: 'text-error' },
              { href: '/event-loop-visualizer', label: 'Event Loop', color: 'text-success' },
              { href: '/debugger-online', label: 'Debugger', color: 'text-accent-secondary' },
              { href: '/sql-playground', label: 'SQL Playground', color: 'text-info' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-surface hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 group"
              >
                <span className={`text-sm font-semibold ${item.color} group-hover:scale-105 transition-transform`}>
                  {item.label}
                </span>
                <span className="text-xs text-muted">Visualizer</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
