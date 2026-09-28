'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Play, Database, BarChart3, Wrench, Trophy, BookOpen,
  MessageSquare, Library, ChevronLeft, ChevronRight, Code2,
  Home, X,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback, useRef } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/playground', label: 'Playground', icon: Play },
  { href: '/sql-playground', label: 'SQL', icon: Database },
  { href: '/data-structures', label: 'Structures', icon: Database },
  { href: '/algorithms', label: 'Algorithms', icon: BarChart3 },
  { href: '/tools', label: 'Tools', icon: Wrench },
  { href: '/challenges', label: 'Challenges', icon: Trophy },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/examples', label: 'Examples', icon: Library },
  { href: '/feedback', label: 'Feedback', icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sidebar is expanded if user pinned it OR is hovering over it
  const expanded = pinned || hovered;

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileOpen(false);
      setPinned(false);
      setHovered(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Hover handlers with a small delay on leave to prevent flicker
  const handleMouseEnter = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => {
      setHovered(false);
    }, 100);
  }, []);

  // Clean up timer
  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const sidebarWidth = expanded ? 'w-[220px]' : 'w-[60px]';

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="sidebar-mobile-bar">
        <button
          onClick={() => setMobileOpen(true)}
          className="sidebar-hamburger"
          aria-label="Open navigation"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="5" x2="15" y2="5" />
            <line x1="3" y1="9" x2="15" y2="9" />
            <line x1="3" y1="13" x2="15" y2="13" />
          </svg>
        </button>
        <Link href="/" className="sidebar-mobile-logo">
          <Code2 className="w-4 h-4 text-accent" />
          <span className="font-semibold text-sm text-foreground">Code Visualizer</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={cn(
          'sidebar-mobile-drawer',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-border">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <Code2 className="w-4 h-4 text-accent" />
            <span className="font-semibold text-sm text-foreground">Code Visualizer</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-secondary transition-colors text-muted"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'sidebar-link',
                  active && 'sidebar-link-active'
                )}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-border">
          <ThemeToggle />
        </div>
      </aside>

      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          'sidebar-desktop',
          sidebarWidth,
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Logo area */}
        <div className="flex items-center h-14 px-3 border-b border-border flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Code2 className="w-4 h-4 text-accent" />
            </div>
            {expanded && (
              <span className="font-semibold text-sm text-foreground truncate">
                Code Visualizer
              </span>
            )}
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!expanded ? item.label : undefined}
                className={cn(
                  'sidebar-link',
                  !expanded && 'justify-center px-0',
                  active && 'sidebar-link-active'
                )}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {expanded && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="px-2 py-3 border-t border-border space-y-2 flex-shrink-0">
          {expanded && <ThemeToggle />}
          <button
            onClick={() => setPinned(!pinned)}
            className={cn(
              'sidebar-link justify-center text-muted hover:text-foreground',
              !expanded && 'px-0'
            )}
            title={pinned ? 'Unpin sidebar' : 'Pin sidebar open'}
            aria-label={pinned ? 'Unpin sidebar' : 'Pin sidebar open'}
          >
            {pinned ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
