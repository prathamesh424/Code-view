'use client';

import { useMemo, useState } from 'react';
import { Share2, Copy, Twitter } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';

export function ShareVisualization() {
  const { code, language } = useEditorStore();
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams({ lang: language, code });
    return `${window.location.origin}/playground?${params.toString()}`;
  }, [code, language]);

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleTweet = () => {
    if (!shareUrl) return;
    const text = encodeURIComponent('Check out this code visualization I made on Code Visualizer');
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    if (!shareUrl) return;
    if (navigator.share) {
      await navigator.share({
        title: 'Code Visualizer',
        text: 'Check out this visualization',
        url: shareUrl,
      });
      return;
    }
    await handleCopy();
  };

  return (
    <div className="flex items-center gap-1.5">
      <button onClick={handleShare} className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md border border-border text-xs text-muted hover:text-foreground transition-colors">
        <Share2 className="w-3.5 h-3.5" />
        Share Visualization
      </button>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md border border-border text-xs text-muted hover:text-foreground transition-colors"
      >
        <Copy className="w-3.5 h-3.5" />
        {copied ? 'Copied' : 'Copy Link'}
      </button>
      <button
        onClick={handleTweet}
        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md border border-border text-xs text-muted hover:text-foreground transition-colors"
      >
        <Twitter className="w-3.5 h-3.5" />
        Tweet
      </button>
    </div>
  );
}
