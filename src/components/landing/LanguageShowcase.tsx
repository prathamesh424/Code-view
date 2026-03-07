'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { LANGUAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const LANGUAGE_PREVIEWS: Record<string, { title: string; features: string[] }> = {
  javascript: {
    title: 'JavaScript Engine',
    features: ['Event Loop Animation', 'Call Stack Push/Pop', 'Microtask vs Macrotask Queue', 'Web APIs Tracking', 'Closure & Scope Chain'],
  },
  python: {
    title: 'Python Runtime',
    features: ['Frame Stack Visualization', 'GIL State Monitor', 'Bytecode Disassembly', 'Variable Scope Tracking', 'Generator State'],
  },
  c: {
    title: 'C Memory Model',
    features: ['Stack vs Heap Layout', 'Pointer Arrow Diagrams', 'malloc/free Tracking', 'Buffer Overflow Detection', 'Memory Leak Warnings'],
  },
  cpp: {
    title: 'C++ Runtime',
    features: ['Smart Pointer Lifecycle', 'RAII Visualization', 'Reference Counting', 'Constructor/Destructor Flow', 'STL Container Layout'],
  },
  java: {
    title: 'Java Virtual Machine',
    features: ['JVM Architecture View', 'Garbage Collection Phases', 'Heap Generational Model', 'Class Loading Sequence', 'Object Lifecycle'],
  },
};

export function LanguageShowcase() {
  const [active, setActive] = useState('javascript');
  const preview = LANGUAGE_PREVIEWS[active];

  return (
    <section className="py-24 sm:py-32 bg-surface-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">
            <span className="gradient-text">5 Languages</span>, Deep Visualization
          </h2>
          <p className="mt-4 text-muted text-lg">
            Each language has its own engine-specific visualizations
          </p>
        </div>

        {/* Language tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2 p-1 bg-surface rounded-xl border border-border overflow-x-auto scrollbar-hide max-w-full">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setActive(lang.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0',
                  active === lang.id
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-muted hover:text-foreground hover:bg-surface-secondary'
                )}
              >
                <span
                  className="inline-block w-5 h-5 rounded text-[10px] font-bold leading-5 text-center mr-2"
                  style={{ backgroundColor: lang.color + '20', color: lang.color }}
                >
                  {lang.icon}
                </span>
                <span className="hidden sm:inline">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview card */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-xl bg-surface border border-border p-8">
            <h3 className="text-2xl font-bold mb-6">{preview.title}</h3>
            <div className="space-y-3">
              {preview.features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface-secondary"
                >
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
