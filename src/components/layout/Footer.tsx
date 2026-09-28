'use client';

import Link from "next/link";
import { Code2 } from "lucide-react";
import { usePathname } from "next/navigation";

const VISUALIZER_LINKS = [
  { href: "/javascript-visualizer", label: "JavaScript" },
  { href: "/python-visualizer", label: "Python" },
  { href: "/cpp-visualizer", label: "C++" },
  { href: "/java-visualizer", label: "Java" },
  { href: "/event-loop-visualizer", label: "Event Loop" },
  { href: "/debugger-online", label: "Debugger" },
];

const RESOURCE_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/examples", label: "Examples" },
  { href: "/challenges", label: "Challenges" },
  { href: "/feedback", label: "Feedback" },
];

const TOOL_LINKS = [
  { href: "/playground", label: "Playground" },
  { href: "/sql-playground", label: "SQL" },
  { href: "/algorithms", label: "Algorithms" },
  { href: "/data-structures", label: "Structures" },
  { href: "/tools", label: "Dev Tools" },
];

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // On sidebar pages, render a slim single-line footer
  if (!isHome) {
    return (
      <footer className="footer-compact">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-muted">
              &copy; {new Date().getFullYear()} Code Visualizer
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="text-border">·</span>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <span className="text-border">·</span>
            <Link href="/playground" className="hover:text-foreground transition-colors">Playground</Link>
            <span className="text-border">·</span>
            <Link href="/feedback" className="hover:text-foreground transition-colors">Feedback</Link>
          </div>
        </div>
      </footer>
    );
  }

  // Home page: full footer
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-3">
              <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-accent" />
              </div>
              <span className="font-semibold text-sm text-foreground">Code Visualizer</span>
            </Link>
            <p className="text-xs text-muted leading-relaxed max-w-[200px]">
              See how your code really works — step by step.
            </p>
          </div>

          {/* Visualizers */}
          <nav aria-label="Visualizers">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              Visualizers
            </h3>
            <ul className="space-y-1.5">
              {VISUALIZER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              Resources
            </h3>
            <ul className="space-y-1.5">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Tools */}
          <nav aria-label="Tools">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              Tools
            </h3>
            <ul className="space-y-1.5">
              {TOOL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted">
            &copy; {new Date().getFullYear()} Code Visualizer. Built with Next.js &amp; Monaco Editor.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-muted">
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/playground" className="hover:text-foreground transition-colors">Playground</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
