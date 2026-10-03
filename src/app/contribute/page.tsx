'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  GitBranch, GitPullRequest, Star, Heart, ExternalLink, Copy, Check,
  Bug, Lightbulb, Palette, FileText, Zap, Code2, BookOpen, Users,
  ArrowRight, ChevronDown, ChevronUp, Terminal, Sparkles,
  GitFork, Shield, MessageSquare, Trophy, Rocket, Globe,
  Database, BarChart3, Cpu, Layers, Package,
} from 'lucide-react';

/* ── Constants ── */

const REPO_URL = 'https://github.com/prathamesh424/Code-view';

const CONTRIBUTION_STEPS = [
  {
    step: 1,
    title: 'Fork & Clone',
    icon: GitFork,
    color: 'text-info',
    bg: 'bg-info/10 border-info/20',
    description: 'Fork the repository and clone it to your local machine.',
    command: 'git clone https://github.com/<your-username>/Code-view.git',
  },
  {
    step: 2,
    title: 'Install & Run',
    icon: Terminal,
    color: 'text-success',
    bg: 'bg-success/10 border-success/20',
    description: 'Install dependencies and start the dev server.',
    command: 'npm install && npm run dev',
  },
  {
    step: 3,
    title: 'Create a Branch',
    icon: GitBranch,
    color: 'text-accent-secondary',
    bg: 'bg-accent-secondary/10 border-accent-secondary/20',
    description: 'Create a descriptive feature or fix branch.',
    command: 'git checkout -b feat/my-awesome-feature',
  },
  {
    step: 4,
    title: 'Code & Commit',
    icon: Code2,
    color: 'text-warning',
    bg: 'bg-warning/10 border-warning/20',
    description: 'Make your changes, test, and commit with conventional commits.',
    command: 'git commit -m "feat(algorithms): add Kruskal\'s MST"',
  },
  {
    step: 5,
    title: 'Open a PR',
    icon: GitPullRequest,
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/20',
    description: 'Push your branch and open a Pull Request with screenshots.',
    command: 'git push origin feat/my-awesome-feature',
  },
];

const CONTRIBUTION_TYPES = [
  {
    icon: Bug,
    title: 'Bug Fixes',
    description: 'Find and fix visualizer glitches, rendering issues, or responsiveness bugs.',
    difficulty: 'Beginner',
    color: 'text-error',
    bg: 'bg-error/8',
    borderColor: 'border-error/20',
    link: `${REPO_URL}/labels/bug`,
  },
  {
    icon: Lightbulb,
    title: 'New Visualizers',
    description: 'Add new algorithm or data structure visualizations like Trie, AVL Tree, or Kruskal\'s.',
    difficulty: 'Intermediate',
    color: 'text-warning',
    bg: 'bg-warning/8',
    borderColor: 'border-warning/20',
    link: `${REPO_URL}/labels/enhancement`,
  },
  {
    icon: Palette,
    title: 'UI/UX Polish',
    description: 'Improve animations, dark/light mode contrast, accessibility, and mobile experience.',
    difficulty: 'Beginner',
    color: 'text-accent-secondary',
    bg: 'bg-accent-secondary/8',
    borderColor: 'border-accent-secondary/20',
    link: `${REPO_URL}/labels/enhancement`,
  },
  {
    icon: FileText,
    title: 'Documentation',
    description: 'Write tutorials, improve code comments, create usage guides, or fix typos.',
    difficulty: 'Beginner',
    color: 'text-info',
    bg: 'bg-info/8',
    borderColor: 'border-info/20',
    link: `${REPO_URL}/labels/documentation`,
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimize animation frame rates, WASM loading, bundle size, and memory usage.',
    difficulty: 'Advanced',
    color: 'text-accent',
    bg: 'bg-accent/8',
    borderColor: 'border-accent/20',
    link: `${REPO_URL}/labels/performance`,
  },
  {
    icon: Shield,
    title: 'Testing',
    description: 'Add component tests, visual regression tests, and E2E test coverage.',
    difficulty: 'Intermediate',
    color: 'text-success',
    bg: 'bg-success/8',
    borderColor: 'border-success/20',
    link: `${REPO_URL}/issues`,
  },
];

const GOOD_FIRST_ISSUES = [
  {
    title: 'Add Trie (Prefix Tree) visualizer',
    labels: ['enhancement', 'good first issue'],
    category: 'Data Structure',
  },
  {
    title: 'Add AVL Tree with rotation animations',
    labels: ['enhancement', 'help wanted'],
    category: 'Data Structure',
  },
  {
    title: 'Implement Kruskal\'s MST algorithm visualizer',
    labels: ['enhancement', 'good first issue'],
    category: 'Algorithm',
  },
  {
    title: 'Add keyboard shortcuts for algorithm controls',
    labels: ['enhancement', 'good first issue'],
    category: 'UX',
  },
  {
    title: 'Visual EXPLAIN QUERY PLAN for SQL Playground',
    labels: ['enhancement', 'help wanted'],
    category: 'SQL',
  },
  {
    title: 'Export visualization as GIF/MP4',
    labels: ['enhancement', 'help wanted'],
    category: 'Feature',
  },
];

const TECH_STACK = [
  { name: 'Next.js 15', icon: Globe, description: 'App Router, SSR' },
  { name: 'React 19', icon: Layers, description: 'Concurrent features' },
  { name: 'TypeScript 5', icon: Code2, description: 'Strict type safety' },
  { name: 'Tailwind v4', icon: Palette, description: 'Utility-first CSS' },
  { name: 'Framer Motion', icon: Sparkles, description: 'Smooth animations' },
  { name: 'sql.js (WASM)', icon: Database, description: 'In-browser SQLite' },
  { name: 'Monaco Editor', icon: Terminal, description: 'Code editing' },
  { name: 'Zustand', icon: Package, description: 'State management' },
];

const ROADMAP_ITEMS = [
  {
    category: 'Data Structures',
    icon: Layers,
    items: [
      'Trie (Prefix Tree) with auto-complete simulation',
      'AVL Tree & Red-Black Tree with rotation animations',
      'Segment Tree & Fenwick Tree (BIT)',
      'Disjoint Set Union (Union-Find) with path compression',
    ],
  },
  {
    category: 'Algorithms',
    icon: BarChart3,
    items: [
      'Minimum Spanning Tree (Prim\'s & Kruskal\'s)',
      'Bellman-Ford & Floyd-Warshall shortest path',
      'Topological Sort (Kahn\'s & DFS)',
      '0/1 Knapsack & LCS interactive tables',
    ],
  },
  {
    category: 'SQL Playground',
    icon: Database,
    items: [
      'Visual EXPLAIN QUERY PLAN execution tree',
      'Relational Schema ER diagram generator',
      'Custom CSV/JSON dataset import',
    ],
  },
  {
    category: 'General Features',
    icon: Cpu,
    items: [
      'Export visualization as GIF or MP4',
      'Voice narration / AI walkthrough',
      'Collaborative real-time editing',
      'Mobile-first touch gesture controls',
    ],
  },
];

const COMMIT_TYPES = [
  { prefix: 'feat:', description: 'A new visualizer, feature, or tool', color: 'text-success' },
  { prefix: 'fix:', description: 'A bug fix or UI correction', color: 'text-error' },
  { prefix: 'docs:', description: 'Documentation or README changes', color: 'text-info' },
  { prefix: 'style:', description: 'Formatting, CSS adjustments', color: 'text-accent-secondary' },
  { prefix: 'refactor:', description: 'Code improvements without feature changes', color: 'text-warning' },
  { prefix: 'perf:', description: 'Performance improvements', color: 'text-accent' },
];

/* ── Helper components ── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: noop */
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-surface-tertiary transition-colors text-muted hover:text-foreground"
      aria-label="Copy command"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function DifficultyBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    Beginner: 'bg-success/10 text-success border-success/20',
    Intermediate: 'bg-warning/10 text-warning border-warning/20',
    Advanced: 'bg-error/10 text-error border-error/20',
  };
  return (
    <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border', styles[level])}>
      {level}
    </span>
  );
}

function LabelPill({ label }: { label: string }) {
  const styles: Record<string, string> = {
    'enhancement': 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20',
    'good first issue': 'bg-success/10 text-success border-success/20',
    'help wanted': 'bg-warning/10 text-warning border-warning/20',
    'bug': 'bg-error/10 text-error border-error/20',
    'documentation': 'bg-info/10 text-info border-info/20',
  };
  return (
    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', styles[label] || 'bg-surface-secondary text-muted border-border')}>
      {label}
    </span>
  );
}

/* ── Collapsible section ── */

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-secondary/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4.5 h-4.5 text-accent" />
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main page ── */

export default function ContributePage() {
  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* ── Hero Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-4">
            <Heart className="w-3.5 h-3.5" />
            <span>Open Source</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
            Help Build the Future of
            <br />
            <span className="gradient-text">Code Visualization</span>
          </h1>

          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Code-View is an open-source, community-driven platform making complex CS concepts visual and interactive.
            Every contribution — from fixing a typo to building a new algorithm visualizer — makes learning accessible to developers worldwide.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/20"
            >
              <GitFork className="w-4 h-4" />
              Fork on GitHub
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-surface text-foreground font-medium text-sm hover:border-border-hover transition-all hover:-translate-y-0.5"
            >
              <Star className="w-4 h-4 text-warning" />
              Star the Repo
            </a>
            <Link
              href="/feedback"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-surface text-foreground font-medium text-sm hover:border-border-hover transition-all hover:-translate-y-0.5"
            >
              <MessageSquare className="w-4 h-4 text-accent-secondary" />
              Give Feedback
            </Link>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors">
              <Star className="w-3.5 h-3.5 text-warning" />
              <span>Stars on GitHub</span>
            </a>
            <a href={`${REPO_URL}/pulls`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors">
              <GitPullRequest className="w-3.5 h-3.5 text-accent" />
              <span>PRs Welcome</span>
            </a>
            <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors">
              <Shield className="w-3.5 h-3.5 text-success" />
              <span>MIT License</span>
            </a>
            <a href={`${REPO_URL}/graphs/contributors`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors">
              <Users className="w-3.5 h-3.5 text-accent-secondary" />
              <span>Contributors</span>
            </a>
          </div>
        </motion.div>

        {/* ── How to Contribute (Steps) ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 sm:mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Get Started in 5 Steps
            </h2>
            <p className="text-sm text-muted max-w-lg mx-auto">
              From fork to merged PR — here&apos;s how to make your first contribution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CONTRIBUTION_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                  className={cn(
                    'relative p-4 rounded-xl border bg-surface group hover:shadow-lg transition-all duration-300',
                    step.bg
                  )}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold', step.bg, step.color)}>
                      {step.step}
                    </div>
                    <Icon className={cn('w-4 h-4', step.color)} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-xs text-muted leading-relaxed mb-3">{step.description}</p>
                  <div className="flex items-center gap-1 bg-background/60 rounded-lg p-2 border border-border/50">
                    <code className="text-[10px] text-accent font-mono flex-1 break-all leading-relaxed">{step.command}</code>
                    <CopyButton text={step.command} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── Ways to Contribute ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 sm:mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Ways to Contribute
            </h2>
            <p className="text-sm text-muted max-w-lg mx-auto">
              You don&apos;t need to be a DSA expert — every skill level has a place here.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONTRIBUTION_TYPES.map((type, i) => {
              const Icon = type.icon;
              return (
                <motion.a
                  key={type.title}
                  href={type.link}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                  className={cn(
                    'group p-5 rounded-xl border bg-surface hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer',
                    type.borderColor
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', type.bg)}>
                      <Icon className={cn('w-4.5 h-4.5', type.color)} />
                    </div>
                    <DifficultyBadge level={type.difficulty} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">{type.title}</h3>
                  <p className="text-xs text-muted leading-relaxed mb-3">{type.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:gap-2 transition-all">
                    Browse issues <ArrowRight className="w-3 h-3" />
                  </span>
                </motion.a>
              );
            })}
          </div>
        </motion.section>

        {/* ── Good First Issues ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-12 sm:mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-warning" />
              Ideas to Start With
            </h2>
            <p className="text-sm text-muted max-w-lg mx-auto">
              Curated ideas perfect for first-time contributors and those looking for impactful work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOOD_FIRST_ISSUES.map((issue, i) => (
              <motion.a
                key={issue.title}
                href={`${REPO_URL}/issues`}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: i % 2 === 0 ? -12 : 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface hover:border-accent/30 hover:shadow-md transition-all group"
              >
                <div className="w-5 h-5 rounded-full border-2 border-accent/40 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-accent group-hover:bg-accent/10 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/60 group-hover:bg-accent transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-snug mb-1.5 group-hover:text-accent transition-colors">
                    {issue.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-medium text-muted bg-surface-secondary px-1.5 py-0.5 rounded">
                      {issue.category}
                    </span>
                    {issue.labels.map((label) => (
                      <LabelPill key={label} label={label} />
                    ))}
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-accent flex-shrink-0 mt-1 transition-colors" />
              </motion.a>
            ))}
          </div>

          <div className="text-center mt-6">
            <a
              href={`${REPO_URL}/labels/good%20first%20issue`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:border-accent/30 hover:bg-accent/5 transition-all"
            >
              View all open issues
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.section>

        {/* ── Tech Stack ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12 sm:mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Tech Stack You&apos;ll Work With
            </h2>
            <p className="text-sm text-muted max-w-lg mx-auto">
              Modern, well-documented technologies that are a joy to develop with.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TECH_STACK.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-all text-center group"
                >
                  <Icon className="w-5 h-5 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold text-foreground mb-0.5">{tech.name}</p>
                  <p className="text-[11px] text-muted">{tech.description}</p>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ── Roadmap ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-12 sm:mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
              <Rocket className="w-5 h-5 text-accent" />
              Roadmap & Wishlist
            </h2>
            <p className="text-sm text-muted max-w-lg mx-auto">
              Pick any item from our roadmap — your contribution will shape the platform&apos;s future.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ROADMAP_ITEMS.map((section) => (
              <CollapsibleSection
                key={section.category}
                title={section.category}
                icon={section.icon}
                defaultOpen={section.category === 'Data Structures'}
              >
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-sm bg-accent/40" />
                      </div>
                      <span className="text-xs text-foreground/80 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            ))}
          </div>
        </motion.section>

        {/* ── Coding Guidelines & Commit Convention ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12 sm:mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coding Guidelines */}
            <div className="p-6 rounded-xl border border-border bg-surface">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4.5 h-4.5 text-accent" />
                <h3 className="text-base font-semibold text-foreground">Coding Guidelines</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { label: 'TypeScript', desc: 'Strongly typed — avoid `any`' },
                  { label: 'Tailwind CSS v4', desc: 'Use design tokens from globals.css' },
                  { label: 'Framer Motion', desc: 'Smooth animations & layout transitions' },
                  { label: 'React state/refs', desc: 'Local state for step counters, Zustand for global' },
                  { label: 'Cleanups', desc: 'Always clear timers, listeners & WASM on unmount' },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-foreground">{item.label}:</span>{' '}
                      <span className="text-xs text-muted">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Commit Convention */}
            <div className="p-6 rounded-xl border border-border bg-surface">
              <div className="flex items-center gap-2 mb-4">
                <GitBranch className="w-4.5 h-4.5 text-accent" />
                <h3 className="text-base font-semibold text-foreground">Commit Convention</h3>
              </div>
              <p className="text-xs text-muted mb-4">
                We follow{' '}
                <a href="https://www.conventionalcommits.org/" target="_blank" rel="noreferrer" className="text-accent hover:underline">
                  Conventional Commits
                </a>
                :
              </p>
              <div className="space-y-2">
                {COMMIT_TYPES.map((ct) => (
                  <div key={ct.prefix} className="flex items-center gap-3 p-2 rounded-lg bg-background/60 border border-border/50">
                    <code className={cn('text-xs font-mono font-semibold min-w-[72px]', ct.color)}>{ct.prefix}</code>
                    <span className="text-xs text-muted">{ct.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Recognition & Community ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mb-12 sm:mb-16"
        >
          <div className="p-8 sm:p-10 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 via-surface to-accent-secondary/5 text-center">
            <Trophy className="w-8 h-8 text-warning mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
              Every Contributor Gets Recognized
            </h2>
            <p className="text-sm text-muted max-w-xl mx-auto mb-6 leading-relaxed">
              All contributors are featured in our README, release notes, and contributor wall.
              Your work helps thousands of learners, students, and interview candidates worldwide.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 rounded-xl border border-border/60 bg-surface/60">
                <Users className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">Contributors Wall</p>
                <p className="text-[11px] text-muted mt-1">Featured in README</p>
              </div>
              <div className="p-4 rounded-xl border border-border/60 bg-surface/60">
                <Star className="w-5 h-5 text-warning mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">Release Credits</p>
                <p className="text-[11px] text-muted mt-1">Mentioned in changelogs</p>
              </div>
              <div className="p-4 rounded-xl border border-border/60 bg-surface/60">
                <Heart className="w-5 h-5 text-error mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">Community Impact</p>
                <p className="text-[11px] text-muted mt-1">Help learners worldwide</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Final CTA ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center pb-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
            Ready to Make an Impact?
          </h2>
          <p className="text-sm text-muted max-w-lg mx-auto mb-6">
            Join our growing community and help make learning algorithms and code execution visual and accessible to all.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/20"
            >
              <GitFork className="w-4 h-4" />
              Fork & Contribute
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`${REPO_URL}/issues/new/choose`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface text-foreground font-medium text-sm hover:border-accent/30 transition-all hover:-translate-y-0.5"
            >
              <Bug className="w-4 h-4 text-error" />
              Report a Bug
            </a>
            <a
              href={`${REPO_URL}/issues/new/choose`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface text-foreground font-medium text-sm hover:border-accent/30 transition-all hover:-translate-y-0.5"
            >
              <Lightbulb className="w-4 h-4 text-warning" />
              Request a Feature
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-muted">
            <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              <FileText className="w-3 h-3" /> Full Contributing Guide
            </a>
            <span className="text-border">·</span>
            <a href={`${REPO_URL}/blob/main/CODE_OF_CONDUCT.md`} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Shield className="w-3 h-3" /> Code of Conduct
            </a>
            <span className="text-border">·</span>
            <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> MIT License
            </a>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
