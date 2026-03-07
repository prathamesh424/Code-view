'use client';

import { CallStack } from './CallStack';
import { Variables } from './Variables';
import { Breakpoints } from './Breakpoints';
import { ConsoleOutput } from './ConsoleOutput';

export function DebuggerView() {
  return (
    <div className="h-full flex flex-col overflow-y-auto md:overflow-hidden">
      {/* Top row: Call Stack + Variables */}
      <div className="flex flex-col md:flex-row flex-1 min-h-0 border-b border-border">
        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-border overflow-hidden min-h-[120px] md:min-h-0">
          <CallStack />
        </div>
        <div className="w-full md:w-1/2 overflow-hidden min-h-[120px] md:min-h-0">
          <Variables />
        </div>
      </div>

      {/* Bottom row: Breakpoints + Console */}
      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border overflow-hidden min-h-[100px] md:min-h-0">
          <Breakpoints />
        </div>
        <div className="w-full md:w-2/3 overflow-hidden min-h-[120px] md:min-h-0">
          <ConsoleOutput />
        </div>
      </div>
    </div>
  );
}

