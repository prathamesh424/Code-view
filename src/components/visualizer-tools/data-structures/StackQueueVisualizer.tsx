'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, RotateCcw, ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StackItem {
  value: number;
  id: string;
  state: 'default' | 'active' | 'pushing' | 'popping';
}

interface QueueItem {
  value: number;
  id: string;
  state: 'default' | 'active' | 'enqueueing' | 'dequeueing';
}

export function StackQueueVisualizer() {
  const [stack, setStack] = useState<StackItem[]>([
    { value: 10, id: 's-0', state: 'default' },
    { value: 25, id: 's-1', state: 'default' },
    { value: 7, id: 's-2', state: 'default' },
  ]);
  const [queue, setQueue] = useState<QueueItem[]>([
    { value: 15, id: 'q-0', state: 'default' },
    { value: 30, id: 'q-1', state: 'default' },
    { value: 8, id: 'q-2', state: 'default' },
  ]);
  const [stackInput, setStackInput] = useState('');
  const [queueInput, setQueueInput] = useState('');
  const [stackMessage, setStackMessage] = useState('');
  const [queueMessage, setQueueMessage] = useState('');

  // Stack operations
  const push = () => {
    const val = parseInt(stackInput);
    if (isNaN(val)) { setStackMessage('Enter a valid number'); return; }
    setStack(prev => [...prev, { value: val, id: `s-${Date.now()}`, state: 'pushing' }]);
    setStackInput('');
    setStackMessage(`Pushed ${val} onto stack`);
    setTimeout(() => setStack(prev => prev.map(i => ({ ...i, state: 'default' as const }))), 500);
  };

  const pop = () => {
    if (stack.length === 0) { setStackMessage('Stack underflow!'); return; }
    const top = stack[stack.length - 1];
    setStack(prev => {
      const copy = [...prev];
      copy[copy.length - 1] = { ...copy[copy.length - 1], state: 'popping' };
      return copy;
    });
    setStackMessage(`Popped ${top.value} from stack`);
    setTimeout(() => setStack(prev => prev.slice(0, -1)), 400);
  };

  const peek = () => {
    if (stack.length === 0) { setStackMessage('Stack is empty'); return; }
    const top = stack[stack.length - 1];
    setStack(prev => prev.map((item, i) => ({
      ...item,
      state: i === prev.length - 1 ? 'active' as const : 'default' as const,
    })));
    setStackMessage(`Top element: ${top.value}`);
    setTimeout(() => setStack(prev => prev.map(i => ({ ...i, state: 'default' as const }))), 1000);
  };

  // Queue operations
  const enqueue = () => {
    const val = parseInt(queueInput);
    if (isNaN(val)) { setQueueMessage('Enter a valid number'); return; }
    setQueue(prev => [...prev, { value: val, id: `q-${Date.now()}`, state: 'enqueueing' }]);
    setQueueInput('');
    setQueueMessage(`Enqueued ${val}`);
    setTimeout(() => setQueue(prev => prev.map(i => ({ ...i, state: 'default' as const }))), 500);
  };

  const dequeue = () => {
    if (queue.length === 0) { setQueueMessage('Queue is empty!'); return; }
    const front = queue[0];
    setQueue(prev => {
      const copy = [...prev];
      copy[0] = { ...copy[0], state: 'dequeueing' };
      return copy;
    });
    setQueueMessage(`Dequeued ${front.value}`);
    setTimeout(() => setQueue(prev => prev.slice(1)), 400);
  };

  const peekQueue = () => {
    if (queue.length === 0) { setQueueMessage('Queue is empty'); return; }
    const front = queue[0];
    setQueue(prev => prev.map((item, i) => ({
      ...item,
      state: i === 0 ? 'active' as const : 'default' as const,
    })));
    setQueueMessage(`Front element: ${front.value}`);
    setTimeout(() => setQueue(prev => prev.map(i => ({ ...i, state: 'default' as const }))), 1000);
  };

  const resetAll = () => {
    setStack([
      { value: 10, id: `s-${Date.now()}-0`, state: 'default' },
      { value: 25, id: `s-${Date.now()}-1`, state: 'default' },
      { value: 7, id: `s-${Date.now()}-2`, state: 'default' },
    ]);
    setQueue([
      { value: 15, id: `q-${Date.now()}-0`, state: 'default' },
      { value: 30, id: `q-${Date.now()}-1`, state: 'default' },
      { value: 8, id: `q-${Date.now()}-2`, state: 'default' },
    ]);
    setStackMessage('');
    setQueueMessage('');
  };

  const stackColors: Record<string, string> = {
    default: 'bg-accent/15 border-accent/40',
    active: 'bg-yellow-500/20 border-yellow-500',
    pushing: 'bg-green-500/20 border-green-500',
    popping: 'bg-red-500/20 border-red-500',
  };

  const queueColors: Record<string, string> = {
    default: 'bg-blue-500/15 border-blue-500/40',
    active: 'bg-yellow-500/20 border-yellow-500',
    enqueueing: 'bg-green-500/20 border-green-500',
    dequeueing: 'bg-red-500/20 border-red-500',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={resetAll} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors">
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stack */}
        <div className="bg-surface rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ArrowUp className="w-5 h-5 text-accent" />
              Stack <span className="text-xs font-normal text-muted">(LIFO)</span>
            </h3>
            <span className="text-xs font-mono text-muted">size: {stack.length}</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <input
              type="number"
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              placeholder="Value"
              className="w-20 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              onKeyDown={e => e.key === 'Enter' && push()}
            />
            <button onClick={push} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors">
              <Plus className="w-3.5 h-3.5 inline mr-1" />Push
            </button>
            <button onClick={pop} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors">
              <Trash2 className="w-3.5 h-3.5 inline mr-1" />Pop
            </button>
            <button onClick={peek} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/30 transition-colors">
              Peek
            </button>
          </div>

          {stackMessage && (
            <div className="text-xs text-accent font-mono bg-accent/5 px-2 py-1.5 rounded mb-3 border border-accent/20">
              {stackMessage}
            </div>
          )}

          <div className="flex flex-col-reverse items-center gap-1 min-h-[200px] border border-dashed border-border/60 rounded-lg p-3">
            <div className="w-full text-center text-[10px] text-muted font-mono border-t border-border pt-1">
              ── BOTTOM ──
            </div>
            <AnimatePresence mode="popLayout">
              {stack.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -60, opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={cn(
                    'w-full max-w-[180px] h-10 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm relative transition-colors duration-300',
                    stackColors[item.state]
                  )}
                >
                  {item.value}
                  {idx === stack.length - 1 && (
                    <span className="absolute -right-12 text-[10px] text-accent font-mono">← TOP</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {stack.length === 0 && (
              <div className="text-muted text-xs italic py-8">Stack is empty</div>
            )}
          </div>
        </div>

        {/* Queue */}
        <div className="bg-surface rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ArrowDown className="w-5 h-5 text-blue-400" />
              Queue <span className="text-xs font-normal text-muted">(FIFO)</span>
            </h3>
            <span className="text-xs font-mono text-muted">size: {queue.length}</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <input
              type="number"
              value={queueInput}
              onChange={(e) => setQueueInput(e.target.value)}
              placeholder="Value"
              className="w-20 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              onKeyDown={e => e.key === 'Enter' && enqueue()}
            />
            <button onClick={enqueue} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors">
              <Plus className="w-3.5 h-3.5 inline mr-1" />Enqueue
            </button>
            <button onClick={dequeue} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors">
              <Trash2 className="w-3.5 h-3.5 inline mr-1" />Dequeue
            </button>
            <button onClick={peekQueue} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/30 transition-colors">
              Peek
            </button>
          </div>

          {queueMessage && (
            <div className="text-xs text-blue-400 font-mono bg-blue-500/5 px-2 py-1.5 rounded mb-3 border border-blue-500/20">
              {queueMessage}
            </div>
          )}

          <div className="flex flex-col items-center gap-1 min-h-[200px] border border-dashed border-border/60 rounded-lg p-3">
            <div className="w-full text-center text-[10px] text-muted font-mono border-b border-border pb-1">
              ── FRONT (dequeue here) ──
            </div>
            <AnimatePresence mode="popLayout">
              {queue.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={cn(
                    'w-full max-w-[180px] h-10 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm relative transition-colors duration-300',
                    queueColors[item.state]
                  )}
                >
                  {item.value}
                  {idx === 0 && queue.length > 0 && (
                    <span className="absolute -right-14 text-[10px] text-blue-400 font-mono">← FRONT</span>
                  )}
                  {idx === queue.length - 1 && queue.length > 0 && (
                    <span className="absolute -left-12 text-[10px] text-green-400 font-mono">REAR →</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {queue.length === 0 && (
              <div className="text-muted text-xs italic py-8">Queue is empty</div>
            )}
            <div className="w-full text-center text-[10px] text-muted font-mono border-t border-border pt-1">
              ── REAR (enqueue here) ──
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <h4 className="text-sm font-bold text-foreground mb-3">Complexity Comparison</h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-accent font-medium mb-2">Stack (LIFO)</div>
            <div className="space-y-1 text-muted font-mono">
              <div>Push: <span className="text-green-400">O(1)</span></div>
              <div>Pop: <span className="text-green-400">O(1)</span></div>
              <div>Peek: <span className="text-green-400">O(1)</span></div>
              <div>Search: <span className="text-yellow-400">O(n)</span></div>
            </div>
          </div>
          <div>
            <div className="text-blue-400 font-medium mb-2">Queue (FIFO)</div>
            <div className="space-y-1 text-muted font-mono">
              <div>Enqueue: <span className="text-green-400">O(1)</span></div>
              <div>Dequeue: <span className="text-green-400">O(1)</span></div>
              <div>Peek: <span className="text-green-400">O(1)</span></div>
              <div>Search: <span className="text-yellow-400">O(n)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
