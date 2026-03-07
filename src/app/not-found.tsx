'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Code2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-lg mx-auto">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="relative inline-block mb-8">
            <span className="text-[10rem] sm:text-[12rem] font-black leading-none gradient-text select-none">
              404
            </span>
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{ rotate: [0, 10, -10, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Code2 className="w-12 h-12 sm:w-16 sm:h-16 text-accent/30" />
            </motion.div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Page Not Found
          </h1>
          <p className="text-muted text-sm sm:text-base mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            <br className="hidden sm:block" />
            Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30 w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/playground"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border text-foreground font-semibold text-sm hover:bg-surface-secondary transition-all w-full sm:w-auto justify-center"
          >
            <Code2 className="w-4 h-4" />
            Open Playground
          </Link>
        </motion.div>

        {/* Helpful links */}
        <motion.div
          className="mt-12 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-xs text-muted mb-4">Or try one of these:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/data-structures', label: 'Data Structures' },
              { href: '/algorithms', label: 'Algorithms' },
              { href: '/tools', label: 'Tools' },
              { href: '/blog', label: 'Blog' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg bg-surface-secondary text-xs text-muted hover:text-foreground hover:bg-surface-tertiary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
