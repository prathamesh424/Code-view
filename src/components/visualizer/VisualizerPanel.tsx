'use client';

import { useVisualizerStore } from '@/stores/visualizer-store';
import { TabSwitcher } from './TabSwitcher';
import { DebuggerView } from './debugger/DebuggerView';
import { EngineView } from './engine/EngineView';

export function VisualizerPanel() {
  const { activeTab } = useVisualizerStore();

  return (
    <div className="h-full flex flex-col bg-background">
      <TabSwitcher />
      <div className="flex-1 overflow-hidden">
        {activeTab === 'debugger' ? <DebuggerView /> : <EngineView />}
      </div>
    </div>
  );
}
