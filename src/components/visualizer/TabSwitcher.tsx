'use client';

import { useVisualizerStore } from '@/stores/visualizer-store';
import { cn } from '@/lib/utils';
import { Bug, Cpu } from 'lucide-react';

export function TabSwitcher() {
  const { activeTab, setActiveTab } = useVisualizerStore();

  const tabs = [
    { id: 'debugger' as const, label: 'Debugger', icon: Bug },
    { id: 'engine' as const, label: 'Engine Internals', icon: Cpu },
  ];

  return (
    <div className="flex items-center border-b border-border bg-surface">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-all relative',
            activeTab === tab.id
              ? 'text-accent'
              : 'text-muted hover:text-foreground'
          )}
        >
          <tab.icon className="w-3.5 h-3.5" />
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-t" />
          )}
        </button>
      ))}
    </div>
  );
}
