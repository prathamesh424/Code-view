'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

/**
 * Route-aware navigation shell.
 *
 *  - Home (`/`)  → top-bar only, full-width content
 *  - Other pages → collapsible sidebar + content area
 *
 * This avoids the "cluttered mega-navbar" problem by keeping
 * the home page marketing-focused and giving tool pages a
 * consistent sidebar rail for quick switching.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  if (isHome) {
    return (
      <>
        <Header />
        {children}
      </>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell-content">
        {children}
      </div>
    </div>
  );
}
