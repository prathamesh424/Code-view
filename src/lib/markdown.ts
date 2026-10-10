/**
 * Robust markdown to HTML converter for blog posts and guides.
 * Supports headings, code blocks, tables, blockquotes, lists, links, and text formatting.
 */
export function renderMarkdown(md: string): string {
  let html = md;

  // Code blocks (```language ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    // Escape HTML inside code block
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre class="bg-surface-secondary border border-border rounded-lg p-4 overflow-x-auto my-4 text-xs font-mono leading-relaxed text-foreground"><code>${escaped}</code></pre>`;
  });

  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, (_match, code) => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<code class="bg-surface-secondary px-1.5 py-0.5 rounded text-xs font-mono text-accent border border-border/50">${escaped}</code>`;
  });

  // Tables
  html = html.replace(
    /\|([^\n]+)\|\r?\n\|[-:\s|]+\|\r?\n((?:\|[^\n]+\|\r?\n?)+)/g,
    (_match, headerLine, rowsBlock) => {
      const headers = headerLine
        .split('|')
        .map((h: string) => h.trim())
        .filter(Boolean);
      const rows = rowsBlock
        .trim()
        .split(/\r?\n/)
        .map((r: string) =>
          r
            .split('|')
            .map((c: string) => c.trim())
            .filter(Boolean)
        );

      const thead = `<thead><tr class="border-b border-border bg-surface-secondary/50">${headers
        .map(
          (h: string) =>
            `<th class="px-4 py-2.5 text-left text-xs font-semibold text-foreground">${h}</th>`
        )
        .join('')}</tr></thead>`;

      const tbody = `<tbody>${rows
        .map(
          (row: string[]) =>
            `<tr class="border-b border-border/50 hover:bg-surface-secondary/30">${row
              .map(
                (cell: string) =>
                  `<td class="px-4 py-2.5 text-xs text-muted">${cell}</td>`
              )
              .join('')}</tr>`
        )
        .join('')}</tbody>`;

      return `<div class="overflow-x-auto my-6 border border-border rounded-lg"><table class="w-full border-collapse text-left">${thead}${tbody}</table></div>`;
    }
  );

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-foreground mt-8 mb-3 scroll-mt-20">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-foreground mt-10 mb-4 pb-2 border-b border-border scroll-mt-20">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl sm:text-3xl font-extrabold text-foreground mt-10 mb-5 scroll-mt-20">$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full my-4 border border-border shadow-sm" />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors">$1</a>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-accent bg-accent/5 rounded-r-lg px-4 py-3 my-4 text-sm text-foreground/90 italic">$1</blockquote>');

  // Unordered lists
  html = html.replace(/^[*-] (.+)$/gm, '<li class="ml-5 list-disc text-sm text-muted leading-relaxed my-1">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal text-sm text-muted leading-relaxed my-1">$1</li>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-8 border-border" />');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p class="text-sm sm:text-base text-muted leading-relaxed mb-4">');
  html = html.replace(/\n/g, '<br />');

  return `<p class="text-sm sm:text-base text-muted leading-relaxed mb-4">${html}</p>`;
}
