import Link from "next/link";
import { Code2 } from "lucide-react";

const VISUALIZER_LINKS = [
  { href: "/javascript-visualizer", label: "JavaScript Visualizer" },
  { href: "/python-visualizer", label: "Python Visualizer" },
  { href: "/cpp-visualizer", label: "C++ Visualizer" },
  { href: "/java-visualizer", label: "Java Visualizer" },
  { href: "/event-loop-visualizer", label: "Event Loop Visualizer" },
  { href: "/debugger-online", label: "Online Debugger" },
];

const RESOURCE_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/blog/javascript-event-loop-explained", label: "JS Event Loop Guide" },
  { href: "/blog/python-memory-management", label: "Python Memory Guide" },
  { href: "/blog/stack-vs-heap", label: "Stack vs Heap" },
];

const TOOL_LINKS = [
  { href: "/playground", label: "Code Playground" },
  { href: "/sql-playground", label: "SQL Playground" },
  { href: "/algorithms", label: "Algorithms" },
  { href: "/data-structures", label: "Data Structures" },
  { href: "/tools", label: "Developer Tools" },
  { href: "/challenges", label: "Challenges" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-accent" />
              </div>
              <span className="font-bold text-lg gradient-text">Code Visualizer</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Interactive code execution visualizer and debugger. Understand how
              your code really works — step by step.
            </p>
          </div>

          {/* Visualizers */}
          <nav aria-label="Visualizer pages">
            <h3 className="font-semibold text-foreground text-sm mb-3">
              Visualizers
            </h3>
            <ul className="space-y-2">
              {VISUALIZER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Blog and resources">
            <h3 className="font-semibold text-foreground text-sm mb-3">
              Resources
            </h3>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Tools */}
          <nav aria-label="Tools and playground">
            <h3 className="font-semibold text-foreground text-sm mb-3">
              Tools
            </h3>
            <ul className="space-y-2">
              {TOOL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Code Visualizer. Built with Next.js,
            Monaco Editor, and Framer Motion.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <Link href="/blog" className="hover:text-accent transition-colors">
              Blog
            </Link>
            <Link
              href="/playground"
              className="hover:text-accent transition-colors"
            >
              Playground
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
