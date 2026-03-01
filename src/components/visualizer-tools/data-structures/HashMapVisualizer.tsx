'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RotateCcw, Hash, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HashEntry {
  key: string;
  value: string;
  state: 'default' | 'inserting' | 'found' | 'collision' | 'removing';
}

interface Bucket {
  entries: HashEntry[];
  state: 'default' | 'probing' | 'found';
}

const TABLE_SIZE = 8;

function hashFunction(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % TABLE_SIZE;
  }
  return hash;
}

function createInitialTable(): Bucket[] {
  const table: Bucket[] = Array.from({ length: TABLE_SIZE }, () => ({ entries: [], state: 'default' }));
  const initialData = [
    { key: 'name', value: '"Alice"' },
    { key: 'age', value: '25' },
    { key: 'city', value: '"NYC"' },
  ];
  for (const { key, value } of initialData) {
    const idx = hashFunction(key);
    table[idx].entries.push({ key, value, state: 'default' });
  }
  return table;
}

export function HashMapVisualizer() {
  const [table, setTable] = useState<Bucket[]>(() => createInitialTable());
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [message, setMessage] = useState('');
  const [hashCalc, setHashCalc] = useState<{ key: string; hash: number; steps: string } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const animateHash = async (key: string): Promise<number> => {
    const hash = hashFunction(key);
    let acc = 0;
    const chars = key.split('');
    chars.forEach((c) => {
      acc = (acc * 31 + c.charCodeAt(0)) % TABLE_SIZE;
    });
    setHashCalc({ key, hash, steps: `hash("${key}") = ${hash}` });

    // Highlight the target bucket
    setTable(prev => prev.map((b, i) => ({ ...b, state: i === hash ? 'probing' as const : 'default' as const })));
    await new Promise(resolve => setTimeout(resolve, 500));

    return hash;
  };

  const insert = async () => {
    if (!keyInput.trim()) { setMessage('Enter a key'); return; }
    setIsAnimating(true);
    const key = keyInput.trim();
    const value = valueInput.trim() || 'undefined';

    const hash = await animateHash(key);

    setTable(prev => {
      const newTable: Bucket[] = prev.map((b) => ({
        ...b,
        state: 'default' as Bucket['state'],
        entries: b.entries.map(e => ({ ...e, state: 'default' as HashEntry['state'] })),
      }));

      const bucket = newTable[hash];
      const existingIdx = bucket.entries.findIndex(e => e.key === key);

      if (existingIdx >= 0) {
        bucket.entries[existingIdx] = { key, value, state: 'inserting' as HashEntry['state'] };
        setMessage(`Updated "${key}" = ${value} at bucket ${hash}`);
      } else {
        if (bucket.entries.length > 0) {
          setMessage(`Collision! "${key}" hashes to bucket ${hash} (chaining). Inserted.`);
        } else {
          setMessage(`Inserted "${key}" = ${value} at bucket ${hash}`);
        }
        bucket.entries.push({ key, value, state: (bucket.entries.length > 0 ? 'collision' : 'inserting') as HashEntry['state'] });
      }

      return newTable;
    });

    setKeyInput('');
    setValueInput('');
    setTimeout(() => {
      setTable(prev => prev.map(b => ({
        ...b,
        entries: b.entries.map(e => ({ ...e, state: 'default' as const })),
      })));
      setIsAnimating(false);
    }, 1000);
  };

  const search = async () => {
    if (!searchInput.trim()) { setMessage('Enter a key to search'); return; }
    setIsAnimating(true);
    const key = searchInput.trim();

    const hash = await animateHash(key);

    const bucket = table[hash];
    const found = bucket.entries.find(e => e.key === key);

    setTable(prev => prev.map((b, i) => ({
      ...b,
      state: i === hash ? 'found' as const : 'default' as const,
      entries: b.entries.map(e => ({
        ...e,
        state: e.key === key ? 'found' as const : 'default' as const,
      })),
    })));

    setMessage(found ? `Found "${key}" = ${found.value} at bucket ${hash}` : `"${key}" not found (bucket ${hash} checked)`);

    setTimeout(() => {
      setTable(prev => prev.map(b => ({
        ...b,
        state: 'default' as const,
        entries: b.entries.map(e => ({ ...e, state: 'default' as const })),
      })));
      setIsAnimating(false);
    }, 1500);
  };

  const remove = async () => {
    if (!searchInput.trim()) { setMessage('Enter a key to remove'); return; }
    setIsAnimating(true);
    const key = searchInput.trim();

    const hash = await animateHash(key);

    setTable(prev => {
      const newTable = [...prev.map(b => ({ ...b, entries: [...b.entries] }))];
      const bucket = newTable[hash];
      const idx = bucket.entries.findIndex(e => e.key === key);

      if (idx >= 0) {
        bucket.entries[idx] = { ...bucket.entries[idx], state: 'removing' };
        setMessage(`Removing "${key}" from bucket ${hash}`);
        setTimeout(() => {
          setTable(prev2 => {
            const t = [...prev2.map(b => ({ ...b, entries: [...b.entries] }))];
            t[hash].entries = t[hash].entries.filter(e => e.key !== key);
            t[hash].state = 'default';
            return t;
          });
        }, 500);
      } else {
        setMessage(`"${key}" not found`);
      }

      return newTable;
    });

    setSearchInput('');
    setTimeout(() => setIsAnimating(false), 800);
  };

  const reset = () => {
    setIsAnimating(false);
    setTable(createInitialTable());
    setHashCalc(null);
    setMessage('');
  };

  const totalEntries = table.reduce((sum, b) => sum + b.entries.length, 0);
  const loadFactor = (totalEntries / TABLE_SIZE).toFixed(2);
  const collisions = table.filter(b => b.entries.length > 1).length;

  const bucketBorder: Record<string, string> = {
    default: 'border-border',
    probing: 'border-yellow-500',
    found: 'border-green-500',
  };

  const entryColors: Record<string, string> = {
    default: 'bg-accent/10 border-accent/30',
    inserting: 'bg-green-500/20 border-green-500',
    found: 'bg-green-500/20 border-green-500',
    collision: 'bg-orange-500/20 border-orange-500',
    removing: 'bg-red-500/20 border-red-500 opacity-50',
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Key"
            className="w-24 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            disabled={isAnimating}
          />
          <input
            type="text"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            placeholder="Value"
            className="w-24 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            disabled={isAnimating}
          />
          <button onClick={insert} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors disabled:opacity-50">
            <Plus className="w-3.5 h-3.5 inline mr-1" />Put
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Key"
            className="w-24 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            disabled={isAnimating}
          />
          <button onClick={search} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 transition-colors disabled:opacity-50">
            <Search className="w-3.5 h-3.5 inline mr-1" />Get
          </button>
          <button onClick={remove} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors disabled:opacity-50">
            Remove
          </button>
        </div>
        <button onClick={reset} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors ml-auto">
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset
        </button>
      </div>

      {/* Hash Calculation */}
      {hashCalc && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-mono bg-surface-secondary px-4 py-2 rounded-lg border border-border"
        >
          <Hash className="w-3.5 h-3.5 inline mr-2 text-accent" />
          <span className="text-muted">{hashCalc.steps}</span>
          <span className="text-accent ml-2">→ bucket [{hashCalc.hash}]</span>
        </motion.div>
      )}

      {/* Message */}
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-accent font-mono bg-accent/5 px-3 py-2 rounded-lg border border-accent/20"
        >
          {message}
        </motion.div>
      )}

      {/* Hash Table Visualization */}
      <div className="bg-surface rounded-xl border border-border p-5">
        <div className="space-y-2">
          {table.map((bucket, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-8 text-right font-mono text-xs text-muted">[{idx}]</div>
              <div
                className={cn(
                  'flex-1 min-h-[40px] rounded-lg border-2 px-3 py-1.5 flex items-center gap-2 transition-all duration-300',
                  bucketBorder[bucket.state],
                  bucket.entries.length === 0 ? 'bg-surface-secondary/50' : 'bg-surface-secondary'
                )}
              >
                {bucket.entries.length === 0 ? (
                  <span className="text-xs text-muted italic">empty</span>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {bucket.entries.map((entry, ei) => (
                      <motion.div
                        key={`${entry.key}-${ei}`}
                        layout
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className={cn(
                          'px-2.5 py-1 rounded-md border text-xs font-mono transition-colors duration-300 flex items-center gap-1',
                          entryColors[entry.state]
                        )}
                      >
                        <span className="text-foreground font-bold">{entry.key}</span>
                        <span className="text-muted">:</span>
                        <span className="text-accent">{entry.value}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                {bucket.entries.length > 1 && (
                  <span className="text-[10px] text-orange-400 ml-auto font-mono">chained</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-surface rounded-lg border border-border p-3 text-center">
          <div className="text-muted mb-1">Entries</div>
          <div className="font-mono font-bold text-foreground">{totalEntries}</div>
        </div>
        <div className="bg-surface rounded-lg border border-border p-3 text-center">
          <div className="text-muted mb-1">Table Size</div>
          <div className="font-mono font-bold text-foreground">{TABLE_SIZE}</div>
        </div>
        <div className="bg-surface rounded-lg border border-border p-3 text-center">
          <div className="text-muted mb-1">Load Factor</div>
          <div className="font-mono font-bold text-accent">{loadFactor}</div>
        </div>
        <div className="bg-surface rounded-lg border border-border p-3 text-center">
          <div className="text-muted mb-1">Collisions</div>
          <div className={cn('font-mono font-bold', collisions > 0 ? 'text-orange-400' : 'text-green-400')}>{collisions}</div>
        </div>
      </div>
    </div>
  );
}
