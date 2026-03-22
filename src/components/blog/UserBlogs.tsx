'use client';

import { useState, useMemo } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  X, Send, PenLine, Clock, ArrowRight, Tag, Eye, Edit3,
  Settings, ChevronLeft, ChevronRight, Search, Bold, Italic,
  Heading1, Heading2, Code, List, Link as LinkIcon, Quote,
  CheckCircle2, ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

import Link from 'next/link';

// ── Simple Markdown renderer ──
function renderMarkdown(md: string): string {
  const html = md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-surface-secondary rounded-lg p-4 overflow-x-auto my-3 text-xs"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-surface-secondary px-1.5 py-0.5 rounded text-xs text-accent">$1</code>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-foreground mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-foreground mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-foreground mt-8 mb-4">$1</h1>')
    // Bold & Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full my-4" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-accent pl-4 my-3 text-muted italic">$1</blockquote>')
    // Unordered lists
    .replace(/^[*-] (.+)$/gm, '<li class="ml-4 list-disc text-sm text-muted">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-sm text-muted">$1</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-6 border-border" />')
    // Line breaks -> paragraphs
    .replace(/\n\n/g, '</p><p class="text-sm text-muted leading-relaxed mb-3">')
    .replace(/\n/g, '<br />');

  return `<p class="text-sm text-muted leading-relaxed mb-3">${html}</p>`;
}

// ── Toolbar Button ──
function ToolbarBtn({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} title={label}
      className="p-1.5 rounded hover:bg-surface-secondary text-muted hover:text-foreground transition-colors">
      <Icon className="w-4 h-4" />
    </button>
  );
}

const POSTS_PER_PAGE = 6;

export function UserBlogList() {
  const blogs = useQuery(api.userBlogs.list);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    if (!blogs) return [];
    const tags = new Set<string>();
    blogs.forEach((b) => b.tags.forEach((t: string) => tags.add(t)));
    return Array.from(tags).sort();
  }, [blogs]);

  const filtered = useMemo(() => {
    if (!blogs) return [];
    return blogs.filter((b) => {
      const matchSearch = !searchQuery ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTag = !filterTag || b.tags.includes(filterTag);
      return matchSearch && matchTag;
    });
  }, [blogs, searchQuery, filterTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  // Reset to page 1 when filter changes
  const handleSearch = (q: string) => { setSearchQuery(q); setPage(1); };
  const handleTagFilter = (tag: string | null) => { setFilterTag(tag); setPage(1); };

  if (blogs === undefined) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-xl border border-border bg-surface animate-pulse">
            <div className="h-3 bg-surface-secondary rounded w-1/4 mb-3" />
            <div className="h-5 bg-surface-secondary rounded w-3/4 mb-2" />
            <div className="h-3 bg-surface-secondary rounded w-full mb-1" />
            <div className="h-3 bg-surface-secondary rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (blogs.length === 0) return null;

  return (
    <div>
      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        {allTags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            <button onClick={() => handleTagFilter(null)}
              className={cn('px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                !filterTag ? 'bg-accent/10 text-accent border-accent/30' : 'border-border text-muted hover:text-foreground')}>
              All
            </button>
            {allTags.slice(0, 8).map((tag) => (
              <button key={tag} onClick={() => handleTagFilter(filterTag === tag ? null : tag)}
                className={cn('px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                  filterTag === tag ? 'bg-accent/10 text-accent border-accent/30' : 'border-border text-muted hover:text-foreground')}>
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Blog cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-border rounded-xl">
          <p className="text-sm text-muted">No articles match your search.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {paginated.map((blog) => (
            <Link
              key={blog._id}
              href={`/blog/${blog.slug}`}
              className="block w-full text-left p-6 rounded-xl border border-border bg-surface hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 text-xs text-muted mb-3">
                <span className="font-medium text-foreground/70">{blog.authorName}</span>
                <span>•</span>
                <time className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                {blog.readTime && (
                  <>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </>
                )}
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors mb-2">{blog.title}</h3>
              <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4">{blog.summary}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {blog.tags.map((tag: string) => (
                    <span key={tag} className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-surface-secondary text-xs text-muted">
                      <Tag className="w-2.5 h-2.5" />{tag}
                    </span>
                  ))}
                </div>
                <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all flex-shrink-0">
                  Read more <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
            className="p-2 rounded-lg border border-border text-muted hover:text-foreground hover:border-border-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={cn('w-8 h-8 rounded-lg text-xs font-medium transition-colors',
                page === p ? 'bg-accent text-white' : 'border border-border text-muted hover:text-foreground hover:border-border-hover')}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
            className="p-2 rounded-lg border border-border text-muted hover:text-foreground hover:border-border-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Blog Reader ──
export function UserBlogReader({ slug, onBack, isRoute = false }: { slug: string; onBack?: () => void; isRoute?: boolean }) {
  const blog = useQuery(api.userBlogs.getBySlug, { slug });

  if (blog === undefined) {
    return <div className="text-sm text-muted text-center py-20">Loading article...</div>;
  }

  if (blog === null) {
    return (
      <div className="text-center py-20">
        <p className="text-muted mb-4">Article not found.</p>
        {isRoute ? (
          <Link href="/blog" className="text-accent hover:underline text-sm">Back to articles</Link>
        ) : (
          <button onClick={onBack} className="text-accent hover:underline text-sm">Back to articles</button>
        )}
      </div>
    );
  }

  const BackButton = () => (
    isRoute ? (
      <Link href="/blog" className="text-sm text-accent hover:underline mb-6 inline-flex items-center gap-1">
        <ChevronLeft className="w-3.5 h-3.5" /> Back to articles
      </Link>
    ) : (
      <button onClick={onBack} className="text-sm text-accent hover:underline mb-6 inline-flex items-center gap-1">
        <ChevronLeft className="w-3.5 h-3.5" /> Back to articles
      </button>
    )
  );

  return (
    <article className="max-w-3xl mx-auto">
      <BackButton />

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">{blog.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted mb-4">
          <span className="font-medium text-foreground/80">{blog.authorName}</span>
          <span>•</span>
          <time className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          {blog.readTime && (
            <>
              <span>•</span>
              <span>{blog.readTime}</span>
            </>
          )}
        </div>
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: string) => (
              <span key={tag} className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium">{tag}</span>
            ))}
          </div>
        )}
      </header>

      <div className="prose-custom" dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content) }} />
    </article>
  );
}

// ── Blog Editor ──
export function BlogEditor({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const createBlog = useMutation(api.userBlogs.create);

  const [step, setStep] = useState<'edit' | 'seo' | 'preview'>('edit');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // SEO fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState(false);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const insertAtCursor = (before: string, after = '') => {
    const textarea = document.getElementById('blog-editor') as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${before}${selected || 'text'}${after}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected || 'text').length);
    }, 0);
  };

  const canPublish = title.trim() && content.trim() && summary.trim() && authorName.trim();

  const handlePublish = async () => {
    if (!canPublish) return;
    setSubmitting(true);
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 8);
      const seoKw = seoKeywords.split(',').map((k) => k.trim()).filter(Boolean).slice(0, 10);
      await createBlog({
        title: title.trim(),
        content: content.trim(),
        summary: summary.trim(),
        tags,
        authorName: authorName.trim(),
        coverImageUrl: coverImageUrl.trim() || undefined,
        seoTitle: seoTitle.trim() || undefined,
        seoDescription: seoDescription.trim() || undefined,
        seoKeywords: seoKw.length > 0 ? seoKw : undefined,
      });
      setPublished(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  if (published) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20">
        <CheckCircle2 className="w-16 h-16 text-success mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Published!</h2>
        <p className="text-muted text-sm">Your article is now live and will appear in the sitemap.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-secondary text-muted hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <PenLine className="w-5 h-5 text-accent" />
            Write Article
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{wordCount} words • {readTime} min read</span>
        </div>
      </div>

      {/* Step tabs */}
      <div className="flex border-b border-border">
        {([
          { key: 'edit' as const, label: 'Write', icon: Edit3 },
          { key: 'seo' as const, label: 'SEO Settings', icon: Settings },
          { key: 'preview' as const, label: 'Preview', icon: Eye },
        ]).map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setStep(key)}
            className={cn('flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
              step === key ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-foreground')}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* ── WRITE TAB ── */}
      {step === 'edit' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150}
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="Your article title" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Author Name *</label>
              <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} maxLength={50}
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="Your name" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Summary *</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={300} rows={2}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors resize-none"
              placeholder="A brief summary that appears in the blog listing" />
            <p className="text-[10px] text-muted mt-0.5">{summary.length}/300</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Tags (comma separated)</label>
              <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} maxLength={100}
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="JavaScript, React, Tutorial" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Cover Image URL (optional)</label>
              <input type="url" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} maxLength={500}
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="https://..." />
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-0.5 p-1.5 rounded-lg bg-surface border border-border">
            <ToolbarBtn icon={Bold} label="Bold" onClick={() => insertAtCursor('**', '**')} />
            <ToolbarBtn icon={Italic} label="Italic" onClick={() => insertAtCursor('*', '*')} />
            <div className="w-px h-5 bg-border mx-1" />
            <ToolbarBtn icon={Heading1} label="Heading 1" onClick={() => insertAtCursor('\n# ')} />
            <ToolbarBtn icon={Heading2} label="Heading 2" onClick={() => insertAtCursor('\n## ')} />
            <div className="w-px h-5 bg-border mx-1" />
            <ToolbarBtn icon={Code} label="Code Block" onClick={() => insertAtCursor('\n```\n', '\n```\n')} />
            <ToolbarBtn icon={Quote} label="Blockquote" onClick={() => insertAtCursor('\n> ')} />
            <ToolbarBtn icon={List} label="List" onClick={() => insertAtCursor('\n- ')} />
            <div className="w-px h-5 bg-border mx-1" />
            <ToolbarBtn icon={LinkIcon} label="Link" onClick={() => insertAtCursor('[', '](https://)')} />
            <ToolbarBtn icon={ImageIcon} label="Image" onClick={() => insertAtCursor('![alt](', ')')} />
          </div>

          {/* Content Editor */}
          <div>
            <textarea id="blog-editor" value={content} onChange={(e) => setContent(e.target.value)} maxLength={20000} rows={20}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground text-sm font-mono leading-relaxed focus:outline-none focus:border-accent transition-colors resize-none"
              placeholder="Write your article content here using Markdown..."
              spellCheck={false} />
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-muted">{content.length}/20000 characters</p>
              <p className="text-[10px] text-muted">Markdown supported</p>
            </div>
          </div>
        </div>
      )}

      {/* ── SEO TAB ── */}
      {step === 'seo' && (
        <div className="space-y-5 p-6 rounded-xl border border-border bg-surface">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">Search Engine Optimization</h3>
            <p className="text-xs text-muted">Configure how your article appears in Google search results.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">SEO Title</label>
            <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={70}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
              placeholder={title || 'Custom title for search engines (defaults to article title)'} />
            <div className="flex justify-between mt-1">
              <p className="text-[10px] text-muted">Recommended: 50-60 characters</p>
              <p className={cn('text-[10px]', (seoTitle || title).length > 60 ? 'text-warning' : 'text-muted')}>{(seoTitle || title).length}/70</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">SEO Description</label>
            <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} maxLength={160} rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors resize-none"
              placeholder={summary || 'Custom description for search engines (defaults to summary)'} />
            <div className="flex justify-between mt-1">
              <p className="text-[10px] text-muted">Recommended: 120-155 characters</p>
              <p className={cn('text-[10px]', (seoDescription || summary).length > 155 ? 'text-warning' : 'text-muted')}>{(seoDescription || summary).length}/160</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Focus Keywords (comma separated)</label>
            <input type="text" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} maxLength={200}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
              placeholder="e.g. javascript tutorial, event loop, async programming" />
            <p className="text-[10px] text-muted mt-1">Up to 10 keywords to help search engines understand your content</p>
          </div>

          {/* Google Preview */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-2">Google Preview</label>
            <div className="p-4 rounded-lg bg-white border border-gray-200">
              <p className="text-xs text-green-700 font-mono mb-0.5 truncate">
                codevisualizer.app/blog/{title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'your-article-slug'}
              </p>
              <h4 className="text-blue-800 text-base font-medium leading-tight mb-1 line-clamp-1 hover:underline cursor-pointer">
                {seoTitle || title || 'Your Article Title'} | Code Visualizer
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                {seoDescription || summary || 'Your article description will appear here in search results...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── PREVIEW TAB ── */}
      {step === 'preview' && (
        <div className="p-6 rounded-xl border border-border bg-surface">
          {!title && !content ? (
            <div className="text-center py-16">
              <Eye className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted">Start writing to see a preview of your article.</p>
            </div>
          ) : (
            <article className="max-w-3xl mx-auto">
              <header className="mb-8">
                {coverImageUrl && (
                  <div className="mb-6 rounded-xl overflow-hidden bg-surface-secondary aspect-video flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverImageUrl} alt={title} className="w-full h-full object-cover" />
                  </div>
                )}
                <h1 className="text-3xl font-bold text-foreground leading-tight mb-4">{title || 'Untitled Article'}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted mb-4">
                  <span className="font-medium text-foreground/80">{authorName || 'Anonymous'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Today</span>
                  <span>•</span>
                  <span>{readTime} min read</span>
                </div>
                {tagsInput && (
                  <div className="flex flex-wrap gap-2">
                    {tagsInput.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium">{tag}</span>
                    ))}
                  </div>
                )}
              </header>

              {summary && (
                <p className="text-base text-muted italic border-l-2 border-accent pl-4 mb-6">{summary}</p>
              )}

              <div className="prose-custom" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
            </article>
          )}
        </div>
      )}

      {/* Bottom action bar */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground border border-border hover:border-border-hover transition-colors">
          Cancel
        </button>
        <div className="flex items-center gap-3">
          {step === 'edit' && (
            <button onClick={() => setStep('seo')} className="px-4 py-2 rounded-lg text-sm font-medium text-foreground border border-border hover:border-accent transition-colors flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" /> SEO Settings
            </button>
          )}
          {step === 'seo' && (
            <button onClick={() => setStep('preview')} className="px-4 py-2 rounded-lg text-sm font-medium text-foreground border border-border hover:border-accent transition-colors flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          )}
          <button onClick={handlePublish} disabled={submitting || !canPublish}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
