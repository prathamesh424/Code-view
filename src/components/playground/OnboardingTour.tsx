'use client';

import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';

const ONBOARDING_KEY = 'cv_onboarding_seen_v1';

export function OnboardingTour() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(ONBOARDING_KEY);
      if (!seen) setOpen(true);
    } catch {
      setOpen(false);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(ONBOARDING_KEY, '1');
    } catch {
      // ignore storage errors
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-accent/30 bg-surface shadow-2xl shadow-accent/10 p-4">
      <button
        onClick={dismiss}
        className="absolute top-2 right-2 p-1 rounded-md text-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
        aria-label="Dismiss onboarding"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-accent" />
        <p className="text-sm font-semibold text-foreground">Quick start guide</p>
      </div>
      <ol className="space-y-2 text-sm text-muted list-decimal ml-4">
        <li>Write or paste code.</li>
        <li>Click Visualize Execution.</li>
        <li>Step through execution visually.</li>
      </ol>
      <button
        onClick={dismiss}
        className="mt-4 w-full px-3 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
      >
        Got it
      </button>
    </div>
  );
}
