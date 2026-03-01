'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Operation = 'and' | 'or' | 'xor' | 'not' | 'leftshift' | 'rightshift';

const OPERATIONS: { id: Operation; label: string; symbol: string; desc: string }[] = [
  { id: 'and', label: 'AND', symbol: '&', desc: 'Both bits must be 1' },
  { id: 'or', label: 'OR', symbol: '|', desc: 'Either bit must be 1' },
  { id: 'xor', label: 'XOR', symbol: '^', desc: 'Bits must differ' },
  { id: 'not', label: 'NOT', symbol: '~', desc: 'Flip all bits' },
  { id: 'leftshift', label: 'Left Shift', symbol: '<<', desc: 'Shift bits left (×2)' },
  { id: 'rightshift', label: 'Right Shift', symbol: '>>', desc: 'Shift bits right (÷2)' },
];

const TRICKS = [
  { name: 'Check if power of 2', code: 'n & (n-1) === 0', example: '8 & 7 = 0 → true' },
  { name: 'Check if even', code: 'n & 1 === 0', example: '6 & 1 = 0 → even' },
  { name: 'Toggle bit at pos k', code: 'n ^ (1 << k)', example: '5 ^ (1<<1) = 7' },
  { name: 'Set bit at pos k', code: 'n | (1 << k)', example: '5 | (1<<1) = 7' },
  { name: 'Clear bit at pos k', code: 'n & ~(1 << k)', example: '7 & ~(1<<1) = 5' },
  { name: 'Multiply by 2', code: 'n << 1', example: '5 << 1 = 10' },
  { name: 'Divide by 2', code: 'n >> 1', example: '10 >> 1 = 5' },
  { name: 'Swap without temp', code: 'a^=b; b^=a; a^=b', example: 'a=5, b=3 → a=3, b=5' },
];

function toBinary(n: number, bits: number = 8): string {
  if (n < 0) {
    // Two's complement
    return (n >>> 0).toString(2).slice(-bits);
  }
  return n.toString(2).padStart(bits, '0');
}

export function BitManipulationVisualizer() {
  const [valueA, setValueA] = useState(42);
  const [valueB, setValueB] = useState(27);
  const [shiftAmount, setShiftAmount] = useState(1);
  const [operation, setOperation] = useState<Operation>('and');
  const [bits] = useState(8);

  const result = useMemo(() => {
    switch (operation) {
      case 'and': return valueA & valueB;
      case 'or': return valueA | valueB;
      case 'xor': return valueA ^ valueB;
      case 'not': return ~valueA & ((1 << bits) - 1);
      case 'leftshift': return (valueA << shiftAmount) & ((1 << bits) - 1);
      case 'rightshift': return valueA >> shiftAmount;
    }
  }, [valueA, valueB, operation, shiftAmount, bits]);

  const binA = toBinary(valueA, bits);
  const binB = toBinary(valueB, bits);
  const binResult = toBinary(result, bits);

  const op = OPERATIONS.find(o => o.id === operation)!;
  const isUnary = operation === 'not' || operation === 'leftshift' || operation === 'rightshift';

  const getBitColor = (bit: string) => {
    return bit === '1' ? 'bg-accent/20 text-accent border-accent/50' : 'bg-surface-secondary text-muted border-border';
  };

  const getResultBitColor = (rBit: string) => {
    if (rBit === '1') return 'bg-green-500/20 text-green-400 border-green-500/50';
    return 'bg-surface-secondary text-muted border-border';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        {OPERATIONS.map(o => (
          <button key={o.id} onClick={() => setOperation(o.id)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              operation === o.id ? 'bg-accent/10 text-accent border-accent/30' : 'bg-surface-secondary text-muted border-border hover:text-foreground')}>
            {o.label} <span className="font-mono ml-1 opacity-60">{o.symbol}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main visualization */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-6">
          <div className="space-y-5">
            {/* Value A */}
            <div className="flex items-center gap-4">
              <div className="w-16 text-right">
                <input type="number" value={valueA} onChange={e => setValueA(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
                  className="w-16 px-2 py-1 rounded-lg bg-surface-secondary border border-border text-sm font-mono text-foreground text-right focus:outline-none focus:ring-1 focus:ring-accent" />
              </div>
              <div className="flex gap-1">
                {binA.split('').map((bit, i) => (
                  <motion.div key={`a-${i}`} layout
                    className={cn('w-8 h-8 rounded-lg border-2 flex items-center justify-center font-mono text-sm font-bold transition-all', getBitColor(bit))}>
                    {bit}
                  </motion.div>
                ))}
              </div>
              <span className="text-xs text-muted font-mono">A</span>
            </div>

            {/* Operator */}
            <div className="flex items-center gap-4">
              <div className="w-16 text-right text-xs text-accent font-bold font-mono">{op.symbol}</div>
              <div className="flex-1 border-b border-border/30" />
              <span className="text-[10px] text-muted">{op.desc}</span>
            </div>

            {/* Value B (if binary op) */}
            {!isUnary && (
              <div className="flex items-center gap-4">
                <div className="w-16 text-right">
                  <input type="number" value={valueB} onChange={e => setValueB(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
                    className="w-16 px-2 py-1 rounded-lg bg-surface-secondary border border-border text-sm font-mono text-foreground text-right focus:outline-none focus:ring-1 focus:ring-accent" />
                </div>
                <div className="flex gap-1">
                  {binB.split('').map((bit, i) => (
                    <motion.div key={`b-${i}`} layout
                      className={cn('w-8 h-8 rounded-lg border-2 flex items-center justify-center font-mono text-sm font-bold transition-all', getBitColor(bit))}>
                      {bit}
                    </motion.div>
                  ))}
                </div>
                <span className="text-xs text-muted font-mono">B</span>
              </div>
            )}

            {/* Shift amount */}
            {(operation === 'leftshift' || operation === 'rightshift') && (
              <div className="flex items-center gap-4">
                <div className="w-16 text-right text-xs text-muted">by</div>
                <input type="number" value={shiftAmount} min={0} max={7}
                  onChange={e => setShiftAmount(Math.max(0, Math.min(7, parseInt(e.target.value) || 0)))}
                  className="w-14 px-2 py-1 rounded-lg bg-surface-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-accent" />
                <span className="text-xs text-muted">positions</span>
              </div>
            )}

            {/* Divider */}
            <div className="border-t-2 border-accent/30" />

            {/* Result */}
            <div className="flex items-center gap-4">
              <div className="w-16 text-right font-mono text-sm font-bold text-green-400">{result}</div>
              <div className="flex gap-1">
                {binResult.split('').map((bit, i) => (
                  <motion.div key={`r-${i}`} layout
                    className={cn('w-8 h-8 rounded-lg border-2 flex items-center justify-center font-mono text-sm font-bold transition-all',
                      getResultBitColor(bit))}>
                    {bit}
                  </motion.div>
                ))}
              </div>
              <span className="text-xs text-green-400 font-mono font-bold">Result</span>
            </div>
          </div>

          {/* Expression */}
          <div className="mt-6 text-center bg-accent/5 rounded-lg py-2 font-mono text-sm text-accent">
            {isUnary
              ? `${op.symbol}${operation === 'not' ? '' : ' '}${valueA}${operation !== 'not' ? ` ${op.symbol} ${shiftAmount}` : ''} = ${result}`
              : `${valueA} ${op.symbol} ${valueB} = ${result}`
            }
          </div>
        </div>

        {/* Tricks */}
        <div className="space-y-4">
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="text-xs font-bold text-muted mb-3">Bit Tricks</h3>
            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {TRICKS.map((trick, i) => (
                <div key={i} className="bg-surface-secondary rounded-lg p-2.5 text-[11px]">
                  <div className="font-bold text-foreground mb-0.5">{trick.name}</div>
                  <code className="text-accent font-mono text-[10px]">{trick.code}</code>
                  <div className="text-muted mt-0.5 text-[10px]">{trick.example}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-4 text-xs">
            <h3 className="font-bold text-muted mb-2">Properties</h3>
            <div className="space-y-1 font-mono text-muted">
              <div>A (dec): <span className="text-foreground">{valueA}</span></div>
              <div>A (hex): <span className="text-accent">0x{valueA.toString(16).toUpperCase().padStart(2, '0')}</span></div>
              <div>A (oct): <span className="text-purple-400">0o{valueA.toString(8)}</span></div>
              {!isUnary && (
                <>
                  <div>B (dec): <span className="text-foreground">{valueB}</span></div>
                  <div>B (hex): <span className="text-accent">0x{valueB.toString(16).toUpperCase().padStart(2, '0')}</span></div>
                </>
              )}
              <div className="pt-1 border-t border-border/30">
                Result: <span className="text-green-400">{result}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
