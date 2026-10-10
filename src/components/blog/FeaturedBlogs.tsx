'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { STATIC_BLOG_POSTS } from '@/lib/blogs-data';

export function FeaturedBlogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    STATIC_BLOG_POSTS.forEach((post) => post.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  const filteredPosts = useMemo(() => {
    return STATIC_BLOG_POSTS.filter((post) => {
      const matchSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchTag = !selectedTag || post.tags.includes(selectedTag);

      return matchSearch && matchTag;
    });
  }, [searchQuery, selectedTag]);

  return (
    <div className="mb-16">
      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, playgrounds, memory models..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted/60"
          />
        </div>

        {/* Filter tags pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedTag === null
                ? 'bg-accent text-white shadow-sm'
                : 'bg-surface border border-border text-muted hover:text-foreground'
            }`}
          >
            All Guides
          </button>
          {['Java', 'Python', 'C++', 'C', 'JavaScript', 'Memory'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface border border-border text-muted hover:text-foreground'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Articles */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-surface/50">
          <p className="text-sm text-muted">No guides found matching &quot;{searchQuery}&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post, idx) => (
            <article
              key={post.slug}
              className={`group relative flex flex-col justify-between p-6 rounded-2xl border border-border bg-surface hover:border-accent/50 hover:bg-surface-secondary/40 transition-all duration-200 shadow-sm hover:shadow-md ${
                idx === 0 && !searchQuery && !selectedTag ? 'md:col-span-2 bg-gradient-to-br from-surface via-surface to-accent/5 border-accent/30' : ''
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-accent/10 border border-accent/20 text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                  {idx === 0 && !searchQuery && !selectedTag && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-warning ml-auto">
                      <Sparkles className="w-3 h-3" /> Featured Guide
                    </span>
                  )}
                </div>

                <h3
                  className={`font-bold text-foreground group-hover:text-accent transition-colors leading-snug mb-3 ${
                    idx === 0 && !searchQuery && !selectedTag ? 'text-xl sm:text-2xl' : 'text-lg'
                  }`}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <span className="absolute inset-0 z-10" />
                    {post.title}
                  </Link>
                </h3>

                <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-6">
                  {post.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs text-muted">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 font-medium text-accent group-hover:translate-x-1 transition-transform">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
