'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
              <Play className="w-3 h-3 fill-current" />
              Interactive Code Execution Visualizer
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight"
          >
            See How Your Code{' '}
            <span className="gradient-text">Really Works</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
          >
            Visualize code execution in real-time. Watch the event loop spin,
            memory allocate, pointers resolve, and the JVM garbage collect —
            all step by step.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-base hover:bg-accent-hover shadow-lg shadow-accent/25 transition-all duration-200 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              Open Playground
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-muted font-medium text-base hover:text-foreground hover:bg-surface-secondary transition-all duration-200"
            >
              Learn More
            </a>
          </motion.div>

          {/* Code preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 relative"
          >
            <div className="gradient-border rounded-xl overflow-hidden shadow-2xl shadow-accent/5">
              <div className="bg-surface p-1">
                {/* Window chrome */}
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border">
                  <div className="w-2.5 h-2.5 rounded-full bg-error/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
                  <span className="ml-3 text-xs text-muted font-mono">playground.js</span>
                </div>
                {/* Code block */}
                <div className="p-4 sm:p-6 text-left font-mono text-xs sm:text-sm space-y-1">
                  <div className="flex">
                    <span className="text-muted w-8 select-none">1</span>
                    <span>
                      <span className="text-info">console</span>
                      <span className="text-muted">.</span>
                      <span className="text-warning">log</span>
                      <span className="text-muted">(</span>
                      <span className="text-success">&quot;Start&quot;</span>
                      <span className="text-muted">);</span>
                    </span>
                  </div>
                  <div className="flex bg-line-active rounded">
                    <span className="text-muted w-8 select-none">2</span>
                    <span>
                      <span className="text-accent-secondary">setTimeout</span>
                      <span className="text-muted">(</span>
                      <span className="text-muted">() =&gt; </span>
                      <span className="text-info">console</span>
                      <span className="text-muted">.</span>
                      <span className="text-warning">log</span>
                      <span className="text-muted">(</span>
                      <span className="text-success">&quot;Timer&quot;</span>
                      <span className="text-muted">), 0);</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-muted w-8 select-none">3</span>
                    <span>
                      <span className="text-accent">Promise</span>
                      <span className="text-muted">.</span>
                      <span className="text-warning">resolve</span>
                      <span className="text-muted">().</span>
                      <span className="text-warning">then</span>
                      <span className="text-muted">(() =&gt; </span>
                      <span className="text-info">console</span>
                      <span className="text-muted">.</span>
                      <span className="text-warning">log</span>
                      <span className="text-muted">(</span>
                      <span className="text-success">&quot;Promise&quot;</span>
                      <span className="text-muted">));</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-muted w-8 select-none">4</span>
                    <span>
                      <span className="text-info">console</span>
                      <span className="text-muted">.</span>
                      <span className="text-warning">log</span>
                      <span className="text-muted">(</span>
                      <span className="text-success">&quot;End&quot;</span>
                      <span className="text-muted">);</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
