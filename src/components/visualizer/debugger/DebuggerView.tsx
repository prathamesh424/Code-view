'use client';

import { CallStack } from './CallStack';
import { Variables } from './Variables';
import { Breakpoints } from './Breakpoints';
import { ConsoleOutput } from './ConsoleOutput';

export function DebuggerView() {
  return (
    <div className="h-full flex flex-col">
      {/* Top row: Call Stack + Variables */}
      <div className="flex flex-1 min-h-0 border-b border-border">
        <div className="w-1/2 border-r border-border overflow-hidden">
          <CallStack />
        </div>
        <div className="w-1/2 overflow-hidden">
          <Variables />
        </div>
      </div>

      {/* Bottom row: Breakpoints + Console */}
      <div className="flex flex-1 min-h-0">
        <div className="w-1/3 border-r border-border overflow-hidden">
          <Breakpoints />
        </div>
        <div className="w-2/3 overflow-hidden">
          <ConsoleOutput />
        </div>
      </div>
    </div>
  );
}
