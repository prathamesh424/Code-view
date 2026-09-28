'use client';

import Link from 'next/link';
import { Code2, Play, BookOpen, ArrowRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

/**
 * Minimal top-bar used ONLY on the home page.
 * Keeps things clean: logo, a few key links, and a CTA.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const links = [
    { href: '/playground', label: 'Playground' },
    { href: '/algorithms', label: 'Algorithms' },
    { href: '/challenges', label: 'Challenges' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'header-scrolled'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Code2 className="w-4 h-4 text-accent" />
              </div>
              <span className="font-semibold text-[15px] text-foreground tracking-tight">
                Code Visualizer
              </span>
            </Link>

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-[13px] font-medium text-muted hover:text-foreground transition-colors rounded-md hover:bg-surface-secondary/60"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2.5">
              <ThemeToggle />

              <Link
                href="/playground"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium rounded-lg
                  bg-accent text-white hover:bg-accent-hover transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                Open Editor
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-secondary/60 transition-colors text-muted"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="4" y1="4" x2="14" y2="14" />
                    <line x1="14" y1="4" x2="4" y2="14" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="3" y1="5" x2="15" y2="5" />
                    <line x1="3" y1="9" x2="15" y2="9" />
                    <line x1="3" y1="13" x2="15" y2="13" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-16 left-0 right-0 z-50 md:hidden bg-surface border-b border-border shadow-xl animate-slide-down">
            <nav className="px-5 py-4 space-y-1">
              {[
                { href: '/playground', label: 'Playground', icon: Play },
                { href: '/algorithms', label: 'Algorithms', icon: BookOpen },
                { href: '/challenges', label: 'Challenges', icon: BookOpen },
                { href: '/blog', label: 'Blog', icon: BookOpen },
                { href: '/data-structures', label: 'Data Structures', icon: BookOpen },
                { href: '/tools', label: 'Tools', icon: BookOpen },
                { href: '/sql-playground', label: 'SQL Playground', icon: BookOpen },
                { href: '/examples', label: 'Examples', icon: BookOpen },
                { href: '/feedback', label: 'Feedback', icon: BookOpen },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
                >
                  {item.label}
                  <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}
