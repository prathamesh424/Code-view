'use client';

import { useEditorStore } from '@/stores/editor-store';
import { LANGUAGES } from '@/lib/constants';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const isPlayground = pathname.startsWith('/playground');
  const { language, setLanguage, isRunning } = useEditorStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.id === language)!;

  const handleSelectLanguage = (newLang: typeof language) => {
    setOpen(false);
    if (newLang === language) return;
    setLanguage(newLang);
    if (isPlayground) {
      router.push(`/playground/${newLang}`);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => !isRunning && setOpen(!open)}
        disabled={isRunning}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
          'bg-surface-secondary border border-border hover:bg-surface-tertiary hover:border-border-hover',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <span
          className="w-5 h-5 rounded text-[10px] font-bold leading-5 text-center flex-shrink-0"
          style={{ backgroundColor: current.color + '20', color: current.color }}
        >
          {current.icon}
        </span>
        <span>{current.label}</span>
        <ChevronDown className={cn('w-3 h-3 text-muted transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 w-48 bg-surface border border-border rounded-lg shadow-xl z-50 py-1 animate-scale-in">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelectLanguage(lang.id)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer',
                lang.id === language
                  ? 'bg-accent/10 text-accent'
                  : 'text-foreground hover:bg-surface-secondary'
              )}
            >
              <span
                className="w-5 h-5 rounded text-[10px] font-bold leading-5 text-center flex-shrink-0"
                style={{ backgroundColor: lang.color + '20', color: lang.color }}
              >
                {lang.icon}
              </span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
