'use client';

import { useState, useMemo } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchResult {
  fullMatch: string;
  index: number;
  groups: string[];
}

const PRESETS = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', text: 'Contact us at hello@example.com or support@test.org' },
  { name: 'URL', pattern: 'https?://[\\w.-]+(?:/[\\w.-]*)*', text: 'Visit https://example.com/path or http://test.org' },
  { name: 'Phone', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', text: 'Call (555) 123-4567 or 555.987.6543' },
  { name: 'Hex Color', pattern: '#[0-9a-fA-F]{3,6}\\b', text: 'Colors: #FF0000, #0f0, #00FF00, #abc' },
  { name: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', text: 'Server at 192.168.1.1 or 10.0.0.255' },
  { name: 'Date', pattern: '\\d{4}[-/]\\d{2}[-/]\\d{2}', text: 'Born on 1990-05-15, graduated 2012/06/20' },
];

const CHEATSHEET = [
  { category: 'Anchors', items: [{ token: '^', desc: 'Start of string' }, { token: '$', desc: 'End of string' }, { token: '\\b', desc: 'Word boundary' }] },
  { category: 'Quantifiers', items: [{ token: '*', desc: '0 or more' }, { token: '+', desc: '1 or more' }, { token: '?', desc: '0 or 1' }, { token: '{n,m}', desc: 'n to m times' }] },
  { category: 'Classes', items: [{ token: '.', desc: 'Any char' }, { token: '\\d', desc: 'Digit' }, { token: '\\w', desc: 'Word char' }, { token: '\\s', desc: 'Whitespace' }] },
  { category: 'Groups', items: [{ token: '(...)', desc: 'Capture group' }, { token: '(?:...)', desc: 'Non-capture' }, { token: 'a|b', desc: 'Alternation' }] },
];

export function RegexPlaygroundVisualizer() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('gi');
  const [text, setText] = useState('Contact us at hello@example.com or support@test.org for more info.');
  const [error, setError] = useState('');

  const results = useMemo(() => {
    setError('');
    if (!pattern) return [];

    try {
      const regex = new RegExp(pattern, flags);
      const matches: MatchResult[] = [];

      if (flags.includes('g')) {
        let match;
        while ((match = regex.exec(text)) !== null) {
          matches.push({
            fullMatch: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (!match[0]) break; // Prevent infinite loop on zero-length match
        }
      } else {
        const match = regex.exec(text);
        if (match) {
          matches.push({
            fullMatch: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }
      return matches;
    } catch (e: unknown) {
      setError((e as Error).message);
      return [];
    }
  }, [pattern, flags, text]);

  // Build highlighted text
  const highlightedText = useMemo(() => {
    if (results.length === 0 || error) return [{ text, isMatch: false, matchIndex: -1 }];

    const segments: { text: string; isMatch: boolean; matchIndex: number }[] = [];
    let lastEnd = 0;

    const sorted = [...results].sort((a, b) => a.index - b.index);
    sorted.forEach((match, mi) => {
      if (match.index > lastEnd) {
        segments.push({ text: text.slice(lastEnd, match.index), isMatch: false, matchIndex: -1 });
      }
      segments.push({ text: match.fullMatch, isMatch: true, matchIndex: mi });
      lastEnd = match.index + match.fullMatch.length;
    });

    if (lastEnd < text.length) {
      segments.push({ text: text.slice(lastEnd), isMatch: false, matchIndex: -1 });
    }

    return segments;
  }, [text, results, error]);

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setPattern(preset.pattern);
    setText(preset.text);
    setFlags('gi');
  };

  const toggleFlag = (flag: string) => {
    setFlags(prev => prev.includes(flag) ? prev.replace(flag, '') : prev + flag);
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted">Presets:</span>
        {PRESETS.map(p => (
          <button key={p.name} onClick={() => loadPreset(p)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors">
            {p.name}
          </button>
        ))}
      </div>

      {/* Pattern Input */}
      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted font-medium block mb-1">Regular Expression</label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-surface-secondary border border-border rounded-lg overflow-hidden">
              <span className="text-accent font-mono text-sm px-2">/</span>
              <input value={pattern} onChange={e => setPattern(e.target.value)}
                className="flex-1 bg-transparent py-1.5 font-mono text-sm text-foreground focus:outline-none"
                placeholder="Enter regex pattern..." />
              <span className="text-accent font-mono text-sm px-1">/</span>
              <span className="text-accent font-mono text-sm pr-2">{flags}</span>
            </div>
            <div className="flex gap-1">
              {['g', 'i', 'm', 's'].map(f => (
                <button key={f} onClick={() => toggleFlag(f)}
                  className={cn('w-8 h-8 rounded-lg text-xs font-mono font-bold border transition-colors',
                    flags.includes(f) ? 'bg-accent/10 text-accent border-accent/30' : 'bg-surface-secondary text-muted border-border')}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted font-medium block mb-1">Test String</label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
            className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-accent resize-none" />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
          <AlertCircle className="w-4 h-4" />{error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Match Visualization */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="text-xs font-bold text-muted mb-2">Match Highlights</h3>
            <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {highlightedText.map((seg, i) =>
                seg.isMatch ? (
                  <span key={i} className="bg-accent/20 text-accent border-b-2 border-accent rounded px-0.5"
                    title={`Match ${seg.matchIndex + 1} at index ${results[seg.matchIndex]?.index}`}>
                    {seg.text}
                  </span>
                ) : (
                  <span key={i} className="text-foreground">{seg.text}</span>
                )
              )}
            </div>
          </div>

          {results.length > 0 && (
            <div className="bg-surface rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold text-muted mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-green-400" />
                {results.length} Match{results.length !== 1 ? 'es' : ''} Found
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {results.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs font-mono bg-surface-secondary rounded-lg p-2">
                    <span className="text-muted shrink-0">#{i + 1}</span>
                    <span className="text-accent font-bold">&quot;{r.fullMatch}&quot;</span>
                    <span className="text-muted">at index {r.index}</span>
                    {r.groups.length > 0 && (
                      <span className="text-purple-400">groups: [{r.groups.map(g => `"${g}"`).join(', ')}]</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cheatsheet */}
        <div className="bg-surface rounded-xl border border-border p-4">
          <h3 className="text-xs font-bold text-muted mb-3">Cheatsheet</h3>
          <div className="space-y-4">
            {CHEATSHEET.map(cat => (
              <div key={cat.category}>
                <h4 className="text-[10px] font-bold text-accent mb-1.5">{cat.category}</h4>
                <div className="space-y-1">
                  {cat.items.map(item => (
                    <div key={item.token} className="flex items-center gap-2 text-[11px]">
                      <code className="bg-accent/10 text-accent px-1.5 py-0.5 rounded font-mono text-[10px]">{item.token}</code>
                      <span className="text-muted">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
