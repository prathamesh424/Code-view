'use client';

import { useEditorStore } from '@/stores/editor-store';
import { EventLoop } from './js/EventLoop';
import { PythonInternals } from './python/PythonInternals';
import { MemoryLayout } from './cpp/MemoryLayout';
import { JVMView } from './java/JVMView';

export function EngineView() {
  const { language } = useEditorStore();

  switch (language) {
    case 'javascript':
      return <EventLoop />;
    case 'python':
      return <PythonInternals />;
    case 'c':
    case 'cpp':
      return <MemoryLayout />;
    case 'java':
      return <JVMView />;
    default:
      return (
        <div className="h-full flex items-center justify-center text-muted text-sm">
          Select a language to see engine internals
        </div>
      );
  }
}
