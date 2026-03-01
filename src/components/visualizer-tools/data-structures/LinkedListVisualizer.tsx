'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RotateCcw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListNode {
  value: number;
  id: string;
  state: 'default' | 'active' | 'found' | 'comparing' | 'inserting' | 'removing' | 'head' | 'tail';
}

export function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<ListNode[]>(() =>
    [15, 8, 23, 42, 11].map((v, i) => ({
      value: v,
      id: `node-${i}-${v}`,
      state: (i === 0 ? 'head' : i === 4 ? 'tail' : 'default') as ListNode['state'],
    }))
  );
  const [inputValue, setInputValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const updateHeadTail = useCallback((list: ListNode[]): ListNode[] => {
    return list.map((node, i) => ({
      ...node,
      state: list.length === 1 ? 'head' as const :
             i === 0 ? 'head' as const :
             i === list.length - 1 ? 'tail' as const :
             'default' as const,
    }));
  }, []);

  const prepend = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) { setMessage('Enter a valid number'); return; }
    const newNode: ListNode = { value: val, id: `node-${Date.now()}`, state: 'inserting' };
    setNodes(prev => updateHeadTail([newNode, ...prev]));
    setInputValue('');
    setMessage(`Prepended ${val} as new head`);
    setTimeout(() => setNodes(prev => updateHeadTail(prev)), 600);
  };

  const append = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) { setMessage('Enter a valid number'); return; }
    const newNode: ListNode = { value: val, id: `node-${Date.now()}`, state: 'inserting' };
    setNodes(prev => updateHeadTail([...prev, newNode]));
    setInputValue('');
    setMessage(`Appended ${val} as new tail`);
    setTimeout(() => setNodes(prev => updateHeadTail(prev)), 600);
  };

  const insertAt = () => {
    const val = parseInt(inputValue);
    const idx = parseInt(insertIndex);
    if (isNaN(val) || isNaN(idx)) { setMessage('Enter valid value and index'); return; }
    if (idx < 0 || idx > nodes.length) { setMessage(`Index out of bounds`); return; }
    const newNode: ListNode = { value: val, id: `node-${Date.now()}`, state: 'inserting' };
    setNodes(prev => updateHeadTail([...prev.slice(0, idx), newNode, ...prev.slice(idx)]));
    setInputValue('');
    setInsertIndex('');
    setMessage(`Inserted ${val} at position ${idx}`);
    setTimeout(() => setNodes(prev => updateHeadTail(prev)), 600);
  };

  const deleteHead = () => {
    if (nodes.length === 0) { setMessage('List is empty'); return; }
    setNodes(prev => {
      const copy = [...prev];
      copy[0] = { ...copy[0], state: 'removing' };
      return copy;
    });
    setMessage(`Deleted head node (${nodes[0].value})`);
    setTimeout(() => setNodes(prev => updateHeadTail(prev.slice(1))), 400);
  };

  const deleteTail = () => {
    if (nodes.length === 0) { setMessage('List is empty'); return; }
    setNodes(prev => {
      const copy = [...prev];
      copy[copy.length - 1] = { ...copy[copy.length - 1], state: 'removing' };
      return copy;
    });
    setMessage(`Deleted tail node (${nodes[nodes.length - 1].value})`);
    setTimeout(() => setNodes(prev => updateHeadTail(prev.slice(0, -1))), 400);
  };

  const searchNode = async () => {
    const val = parseInt(searchValue);
    if (isNaN(val)) { setMessage('Enter a number to search'); return; }
    setIsAnimating(true);
    let found = -1;

    for (let i = 0; i < nodes.length; i++) {
      setNodes(prev => prev.map((node, idx) => ({
        ...node,
        state: idx === i ? 'comparing' as const :
               idx < i ? 'default' as const : node.state,
      })));
      await new Promise(resolve => setTimeout(resolve, 500));

      if (nodes[i].value === val) {
        found = i;
        setNodes(prev => prev.map((node, idx) => ({
          ...node,
          state: idx === i ? 'found' as const : (idx === 0 ? 'head' as const : idx === prev.length - 1 ? 'tail' as const : 'default' as const),
        })));
        break;
      }
    }

    if (found === -1) {
      setNodes(prev => updateHeadTail(prev));
    }
    setMessage(found >= 0 ? `Found ${val} at position ${found} (traversed ${found + 1} nodes)` : `${val} not found`);
    setIsAnimating(false);
  };

  const reset = () => {
    setIsAnimating(false);
    setNodes(updateHeadTail(
      [15, 8, 23, 42, 11].map((v, i) => ({
        value: v,
        id: `node-${Date.now()}-${i}`,
        state: 'default' as const,
      }))
    ));
    setMessage('List reset');
  };

  const stateColors: Record<string, string> = {
    default: 'bg-surface-secondary border-border text-foreground',
    head: 'bg-green-500/15 border-green-500/60 text-green-400',
    tail: 'bg-blue-500/15 border-blue-500/60 text-blue-400',
    active: 'bg-accent/20 border-accent text-accent',
    found: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    comparing: 'bg-orange-500/20 border-orange-500 text-orange-400',
    inserting: 'bg-purple-500/20 border-purple-500 text-purple-400',
    removing: 'bg-red-500/20 border-red-500 text-red-400',
  };

  const stateLabels: Record<string, string> = {
    head: 'HEAD',
    tail: 'TAIL',
    found: 'FOUND',
    comparing: 'CHECKING',
    inserting: 'NEW',
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
        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={prepend} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors disabled:opacity-50">
            Prepend
          </button>
          <button onClick={append} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors disabled:opacity-50">
            Append
          </button>
          <button onClick={insertAt} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/30 transition-colors disabled:opacity-50">
            Insert At
          </button>
          <button onClick={deleteHead} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors disabled:opacity-50">
            Delete Head
          </button>
          <button onClick={deleteTail} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors disabled:opacity-50">
            Delete Tail
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
          <button onClick={searchNode} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 transition-colors disabled:opacity-50">
            <Search className="w-3.5 h-3.5 inline mr-1" />Search
          </button>
        </div>
        <button onClick={reset} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors ml-auto">
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset
        </button>
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

      {/* Linked List Visualization */}
      <div className="bg-surface rounded-xl border border-border p-6 overflow-x-auto">
        <div className="flex items-center gap-0 min-h-[100px]">
          <AnimatePresence mode="popLayout">
            {nodes.map((node, idx) => (
              <motion.div
                key={node.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex items-center"
              >
                <div className="flex flex-col items-center gap-1">
                  {stateLabels[node.state] && (
                    <span className="text-[10px] font-bold font-mono text-accent animate-pulse">
                      {stateLabels[node.state]}
                    </span>
                  )}
                  <div
                    className={cn(
                      'relative w-16 h-12 rounded-lg border-2 flex transition-all duration-300',
                      stateColors[node.state]
                    )}
                  >
                    {/* Value section */}
                    <div className="flex-1 flex items-center justify-center font-mono font-bold text-sm border-r border-current/20">
                      {node.value}
                    </div>
                    {/* Next pointer section */}
                    <div className="w-5 flex items-center justify-center">
                      {idx < nodes.length - 1 ? (
                        <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                      ) : (
                        <span className="text-[8px] text-red-400 font-mono">∅</span>
                      )}
                    </div>
                  </div>
                </div>
                {idx < nodes.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-muted mx-1 flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {nodes.length === 0 && (
            <div className="text-muted text-sm italic">List is empty (NULL)</div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-surface rounded-lg border border-border p-3 text-center">
          <div className="text-muted mb-1">Size</div>
          <div className="font-mono font-bold text-foreground">{nodes.length}</div>
        </div>
        <div className="bg-surface rounded-lg border border-border p-3 text-center">
          <div className="text-muted mb-1">Head</div>
          <div className="font-mono font-bold text-green-400">{nodes[0]?.value ?? 'NULL'}</div>
        </div>
        <div className="bg-surface rounded-lg border border-border p-3 text-center">
          <div className="text-muted mb-1">Tail</div>
          <div className="font-mono font-bold text-blue-400">{nodes[nodes.length - 1]?.value ?? 'NULL'}</div>
        </div>
        <div className="bg-surface rounded-lg border border-border p-3 text-center">
          <div className="text-muted mb-1">Insert/Delete</div>
          <div className="font-mono font-bold text-accent">O(1) head</div>
        </div>
      </div>
    </div>
  );
}
