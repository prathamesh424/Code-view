'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, RotateCcw, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArrayItem {
  value: number;
  id: string;
  state: 'default' | 'active' | 'found' | 'comparing' | 'inserting' | 'removing';
}

export function ArrayVisualizer() {
  const [items, setItems] = useState<ArrayItem[]>(() =>
    [10, 25, 7, 42, 18, 33, 5, 29].map((v, i) => ({
      value: v,
      id: `item-${i}-${v}`,
      state: 'default' as const,
    }))
  );
  const [inputValue, setInputValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => () => clearTimeouts(), [clearTimeouts]);

  const resetStates = useCallback(() => {
    setItems(prev => prev.map(item => ({ ...item, state: 'default' as const })));
  }, []);

  const pushItem = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) { setMessage('Enter a valid number'); return; }
    const newItem: ArrayItem = { value: val, id: `item-${Date.now()}`, state: 'inserting' };
    setItems(prev => [...prev, newItem]);
    setInputValue('');
    setMessage(`Pushed ${val} at index ${items.length}`);
    setTimeout(() => resetStates(), 600);
  };

  const popItem = () => {
    if (items.length === 0) { setMessage('Array is empty'); return; }
    const last = items[items.length - 1];
    setItems(prev => {
      const copy = [...prev];
      copy[copy.length - 1] = { ...copy[copy.length - 1], state: 'removing' };
      return copy;
    });
    setMessage(`Popped ${last.value} from index ${items.length - 1}`);
    setTimeout(() => {
      setItems(prev => prev.slice(0, -1));
    }, 400);
  };

  const insertAt = () => {
    const val = parseInt(inputValue);
    const idx = parseInt(insertIndex);
    if (isNaN(val) || isNaN(idx)) { setMessage('Enter valid number and index'); return; }
    if (idx < 0 || idx > items.length) { setMessage(`Index out of bounds (0-${items.length})`); return; }
    const newItem: ArrayItem = { value: val, id: `item-${Date.now()}`, state: 'inserting' };
    setItems(prev => [...prev.slice(0, idx), newItem, ...prev.slice(idx)]);
    setInputValue('');
    setInsertIndex('');
    setMessage(`Inserted ${val} at index ${idx}`);
    setTimeout(() => resetStates(), 600);
  };

  const removeAt = () => {
    const idx = parseInt(insertIndex);
    if (isNaN(idx) || idx < 0 || idx >= items.length) { setMessage(`Invalid index`); return; }
    setItems(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], state: 'removing' };
      return copy;
    });
    setMessage(`Removed ${items[idx].value} from index ${idx}`);
    setTimeout(() => {
      setItems(prev => prev.filter((_, i) => i !== idx));
    }, 400);
  };

  const linearSearch = async () => {
    const val = parseInt(searchValue);
    if (isNaN(val)) { setMessage('Enter a number to search'); return; }
    setIsAnimating(true);
    resetStates();
    let found = -1;

    for (let i = 0; i < items.length; i++) {
      await new Promise<void>(resolve => {
        const t = setTimeout(() => {
          setItems(prev => prev.map((item, idx) => ({
            ...item,
            state: idx === i ? 'comparing' as const : idx < i ? 'default' as const : item.state,
          })));
          resolve();
        }, 400);
        timeoutsRef.current.push(t);
      });

      if (items[i].value === val) {
        found = i;
        setItems(prev => prev.map((item, idx) => ({
          ...item,
          state: idx === i ? 'found' as const : 'default' as const,
        })));
        break;
      }
    }

    setMessage(found >= 0 ? `Found ${val} at index ${found}` : `${val} not found`);
    setIsAnimating(false);
  };

  const shuffle = () => {
    setItems(prev => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.map(item => ({ ...item, state: 'default' as const }));
    });
    setMessage('Array shuffled');
  };

  const reset = () => {
    clearTimeouts();
    setIsAnimating(false);
    setItems([10, 25, 7, 42, 18, 33, 5, 29].map((v, i) => ({
      value: v,
      id: `item-${Date.now()}-${i}`,
      state: 'default' as const,
    })));
    setMessage('Array reset');
  };

  const stateColors: Record<string, string> = {
    default: 'bg-accent/20 border-accent/40 text-foreground',
    active: 'bg-blue-500/20 border-blue-500 text-blue-400',
    found: 'bg-green-500/20 border-green-500 text-green-400',
    comparing: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    inserting: 'bg-purple-500/20 border-purple-500 text-purple-400',
    removing: 'bg-red-500/20 border-red-500 text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value"
            className="w-20 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            disabled={isAnimating}
          />
          <input
            type="number"
            value={insertIndex}
            onChange={(e) => setInsertIndex(e.target.value)}
            placeholder="Index"
            className="w-20 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            disabled={isAnimating}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={pushItem} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors disabled:opacity-50">
            <Plus className="w-3.5 h-3.5 inline mr-1" />Push
          </button>
          <button onClick={popItem} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors disabled:opacity-50">
            <Trash2 className="w-3.5 h-3.5 inline mr-1" />Pop
          </button>
          <button onClick={insertAt} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/30 transition-colors disabled:opacity-50">
            Insert At
          </button>
          <button onClick={removeAt} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/30 transition-colors disabled:opacity-50">
            Remove At
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
            className="w-20 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            disabled={isAnimating}
          />
          <button onClick={linearSearch} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 transition-colors disabled:opacity-50">
            <Search className="w-3.5 h-3.5 inline mr-1" />Search
          </button>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <button onClick={shuffle} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors disabled:opacity-50">
            <Shuffle className="w-3.5 h-3.5 inline mr-1" />Shuffle
          </button>
          <button onClick={reset} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors">
            <RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-accent font-mono bg-accent/5 px-3 py-2 rounded-lg border border-accent/20"
        >
          {message}
        </motion.div>
      )}

      {/* Array Visualization */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-end gap-1.5 flex-wrap min-h-[120px]">
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={cn(
                    'w-14 h-14 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm transition-colors duration-300',
                    stateColors[item.state]
                  )}
                >
                  {item.value}
                </div>
                <span className="text-[10px] text-muted font-mono">[{idx}]</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <div className="text-muted text-sm italic">Array is empty</div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { label: 'Default', color: 'bg-accent/20 border-accent/40' },
          { label: 'Comparing', color: 'bg-yellow-500/20 border-yellow-500' },
          { label: 'Found', color: 'bg-green-500/20 border-green-500' },
          { label: 'Inserting', color: 'bg-purple-500/20 border-purple-500' },
          { label: 'Removing', color: 'bg-red-500/20 border-red-500' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={cn('w-3 h-3 rounded border', l.color)} />
            <span className="text-muted">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
