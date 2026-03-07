'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, Play, Menu, X, Database, BarChart3, Wrench, Trophy, BookOpen, Home } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/playground', label: 'Playground', icon: Play },
  { href: '/data-structures', label: 'Data Structures', icon: Database },
  { href: '/algorithms', label: 'Algorithms', icon: BarChart3 },
  { href: '/tools', label: 'Tools', icon: Wrench },
  { href: '/challenges', label: 'Challenges', icon: Trophy },
  { href: '/blog', label: 'Blog', icon: BookOpen },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Code2 className="w-4 h-4 text-accent" />
              </div>
              <span className="font-bold text-lg gradient-text hidden sm:block">
                Code Visualizer
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                      pathname === item.href
                        ? 'bg-accent/10 text-accent'
                        : 'text-muted hover:text-foreground hover:bg-surface-secondary'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-secondary transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay + drawer */}
      {mobileOpen && (
        <>
          <div className="mobile-overlay md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-14 left-0 right-0 z-50 md:hidden bg-surface border-b border-border animate-slide-down safe-area-bottom shadow-2xl">
            <nav className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-accent/10 text-accent'
                        : 'text-muted hover:text-foreground hover:bg-surface-secondary active:bg-surface-tertiary'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
}

