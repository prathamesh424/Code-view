'use client';

import { useState } from 'react';
import { Plus, PenLine } from 'lucide-react';
import { UserBlogList, UserBlogReader, BlogEditor } from '@/components/blog/UserBlogs';

export function BlogCommunitySection() {
  const [showEditor, setShowEditor] = useState(false);
  const [readingSlug, setReadingSlug] = useState<string | null>(null);

  // Reading a specific user blog
  if (readingSlug) {
    return (
      <div className="mt-10">
        <UserBlogReader slug={readingSlug} onBack={() => setReadingSlug(null)} />
      </div>
    );
  }

  // Editor mode
  if (showEditor) {
    return (
      <div className="mt-10">
        <BlogEditor
          onClose={() => setShowEditor(false)}
          onSuccess={() => setShowEditor(false)}
        />
      </div>
    );
  }

  // Default: list view
  return (
    <div className="mt-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <PenLine className="w-5 h-5 text-accent" />
          Community Articles
        </h2>
        <button
          onClick={() => setShowEditor(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Write Article
        </button>
      </div>

      <UserBlogList onReadBlog={(slug) => setReadingSlug(slug)} />
    </div>
  );
}
