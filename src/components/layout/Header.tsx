'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, Play, Menu, X, Database, BarChart3, Wrench, Trophy } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: null },
  { href: '/playground', label: 'Playground', icon: 'play' },
  { href: '/data-structures', label: 'Data Structures', icon: 'database' },
  { href: '/algorithms', label: 'Algorithms', icon: 'chart' },
  { href: '/tools', label: 'Tools', icon: 'wrench' },
  { href: '/challenges', label: 'Challenges', icon: 'trophy' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <Code2 className="w-4 h-4 text-accent" />
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:block">
              CodeView
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
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
                {item.icon === 'play' && (
                  <Play className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                )}
                {item.icon === 'database' && (
                  <Database className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                )}
                {item.icon === 'chart' && (
                  <BarChart3 className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                )}
                {item.icon === 'wrench' && (
                  <Wrench className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                )}
                {item.icon === 'trophy' && (
                  <Trophy className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                )}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-secondary transition-colors"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface animate-slide-down">
          <div className="px-4 py-2 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted hover:text-foreground hover:bg-surface-secondary'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
