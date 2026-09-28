'use client';

import { useState, useMemo } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  Send,
  Star,
  CheckCircle2,
  Bug,
  Lightbulb,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  MessageCircle,
  Github,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type FeedbackType = 'bug' | 'feature' | 'general' | 'other';

const FEEDBACK_TYPES: { value: FeedbackType; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'bug', label: 'Bug Report', icon: Bug, desc: 'Something is broken or behaving unexpectedly' },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb, desc: 'An idea or algorithm you want added' },
  { value: 'general', label: 'General Feedback', icon: MessageCircle, desc: 'Your thoughts, praise, or UX suggestions' },
  { value: 'other', label: 'Other', icon: HelpCircle, desc: 'Questions or anything else' },
];

const RATING_LABELS: Record<number, string> = {
  1: 'Poor — needs major work',
  2: 'Fair — has some issues',
  3: 'Good — works as expected',
  4: 'Great — very helpful',
  5: 'Excellent — love it!',
};

const PLACEHOLDERS: Record<FeedbackType, string> = {
  bug: 'What went wrong? Please include the steps to reproduce, the algorithm/visualizer, and your browser...',
  feature: 'What would you like to see added? (e.g. Red-Black Tree visualizer, more Python syntax, code export)...',
  general: 'What do you think of the app? What is working well and what could be improved?...',
  other: 'Ask a question, share an idea, or leave any note for the team...',
};

function getAvatarColor(name: string) {
  const colors = [
    'bg-teal-500/15 text-teal-400 border-teal-500/30',
    'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'bg-purple-500/15 text-purple-400 border-purple-500/30',
    'bg-rose-500/15 text-rose-400 border-rose-500/30',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<FeedbackType>('general');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<'all' | FeedbackType>('all');

  const submitFeedback = useMutation(api.feedback.submit);
  const feedbackList = useQuery(api.feedback.list);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await submitFeedback({
        name: name.trim(),
        email: email.trim(),
        type,
        message: message.trim(),
        rating: rating > 0 ? rating : undefined,
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setType('general');
      setMessage('');
      setRating(0);
      setTimeout(() => setSubmitted(false), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const recentCount = feedbackList?.length ?? 0;

  // Average rating calculated from community entries with a rating
  const averageRating = useMemo(() => {
    if (!feedbackList || feedbackList.length === 0) return null;
    const rated = feedbackList.filter((fb) => typeof fb.rating === 'number' && fb.rating > 0);
    if (rated.length === 0) return null;
    const sum = rated.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return sum / rated.length;
  }, [feedbackList]);

  // Filtered list
  const filteredList = useMemo(() => {
    if (!feedbackList) return [];
    if (filterType === 'all') return feedbackList;
    return feedbackList.filter((fb) => fb.type === filterType);
  }, [feedbackList, filterType]);

  const activeRatingValue = hoverRating || rating;

  return (
    <div className="w-full flex-1 flex flex-col justify-start">
      <div className="feedback-container px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community Feedback</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
            Send us feedback
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-2xl">
            Have a suggestion, caught a bug, or want an algorithm added? Let us know — we read every piece of feedback.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Form (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type selector */}
                <div>
                  <label className="feedback-label mb-2">
                    Feedback category <span className="text-error">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FEEDBACK_TYPES.map((ft) => {
                      const Icon = ft.icon;
                      const selected = type === ft.value;
                      return (
                        <button
                          key={ft.value}
                          type="button"
                          onClick={() => setType(ft.value)}
                          className={cn(
                            'feedback-type-pill justify-center text-center py-2.5 px-2',
                            selected && 'feedback-type-pill-active'
                          )}
                        >
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{ft.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Email inputs */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="feedback-label">
                      Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      maxLength={100}
                      className="feedback-input"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="feedback-label">
                      Email <span className="text-muted font-normal">(optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={200}
                      className="feedback-input"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                {/* Message input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="feedback-label mb-0">
                      Message <span className="text-error">*</span>
                    </label>
                    <span className="text-[11px] text-muted">
                      {message.length} / 2000
                    </span>
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    maxLength={2000}
                    rows={5}
                    className="feedback-input resize-none"
                    placeholder={PLACEHOLDERS[type]}
                  />
                </div>

                {/* Star rating */}
                <div className="p-4 rounded-xl border border-border/70 bg-background/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-medium text-foreground block">
                        Rate your overall experience
                      </span>
                      <span className="text-[11px] text-muted">
                        Optional, click a star to set or clear
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star === rating ? 0 : star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 rounded transition-transform hover:scale-115 cursor-pointer"
                            aria-label={`Rate ${star} star`}
                          >
                            <Star
                              className={cn(
                                'w-5 h-5 transition-colors',
                                activeRatingValue >= star
                                  ? 'text-warning fill-warning'
                                  : 'text-border hover:text-warning/60'
                              )}
                            />
                          </button>
                        ))}
                      </div>

                      {activeRatingValue > 0 && (
                        <span className="text-xs font-medium text-warning tabular-nums">
                          {activeRatingValue}/5
                        </span>
                      )}
                    </div>
                  </div>

                  {activeRatingValue > 0 && (
                    <p className="text-[11px] text-muted mt-2 pt-2 border-t border-border/50">
                      {RATING_LABELS[activeRatingValue]}
                    </p>
                  )}
                </div>

                {/* Submit button & notification */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={submitting || !name.trim() || !message.trim()}
                    className="feedback-submit"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{submitting ? 'Submitting…' : 'Send feedback'}</span>
                  </button>

                  <p className="text-xs text-muted">
                    We never share your email with third parties.
                  </p>
                </div>

                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 p-3.5 rounded-xl bg-success/10 border border-success/20 text-success text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>Thank you! Your feedback has been submitted successfully.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Quick helper card */}
            <div className="mt-4 p-4 rounded-xl border border-border/60 bg-surface/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-foreground/80 flex-shrink-0" />
                <span>Prefer GitHub? Open an issue or contribute code on our repository.</span>
              </div>
              <a
                href="https://github.com/prathamesh424/Code-view"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-accent hover:underline flex-shrink-0"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Right Column: Recent Feedback (lg:col-span-5) */}
          <div className="lg:col-span-5">
            <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Recent feedback
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    {recentCount > 0 ? `${recentCount} shared thoughts from developers` : 'Community submissions'}
                  </p>
                </div>

                {averageRating !== null && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warning/10 border border-warning/20">
                    <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                    <span className="text-xs font-semibold text-warning">{averageRating.toFixed(1)}</span>
                    <span className="text-[10px] text-muted">avg</span>
                  </div>
                )}
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar">
                {(['all', 'bug', 'feature', 'general', 'other'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilterType(cat)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer capitalize whitespace-nowrap',
                      filterType === cat
                        ? 'bg-accent/15 text-accent font-semibold'
                        : 'text-muted hover:text-foreground hover:bg-surface-secondary'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Feedback List */}
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 feedback-scroll">
                {feedbackList === undefined ? (
                  <div className="text-xs text-muted text-center py-12">Loading feedback…</div>
                ) : filteredList.length === 0 ? (
                  <div className="text-xs text-muted text-center py-12 px-4 border border-dashed border-border rounded-xl">
                    {filterType === 'all'
                      ? 'No feedback yet — be the first to share your thoughts!'
                      : `No ${filterType} feedback entries found.`}
                  </div>
                ) : (
                  filteredList.map((fb) => {
                    const avatarStyle = getAvatarColor(fb.name || 'User');
                    const initial = (fb.name || 'U').trim().charAt(0).toUpperCase();

                    return (
                      <div key={fb._id} className="feedback-card">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border flex-shrink-0', avatarStyle)}>
                              {initial}
                            </div>
                            <span className="text-xs font-medium text-foreground truncate">
                              {fb.name}
                            </span>
                          </div>

                          <span className="text-[10px] text-muted tabular-nums flex-shrink-0">
                            {new Date(fb.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide',
                              fb.type === 'bug' && 'bg-error/10 text-error',
                              fb.type === 'feature' && 'bg-warning/10 text-warning',
                              fb.type === 'general' && 'bg-accent/10 text-accent',
                              fb.type === 'other' && 'bg-surface-tertiary text-muted'
                            )}
                          >
                            {fb.type === 'bug' && <Bug className="w-2.5 h-2.5" />}
                            {fb.type === 'feature' && <Lightbulb className="w-2.5 h-2.5" />}
                            {fb.type === 'general' && <MessageCircle className="w-2.5 h-2.5" />}
                            {fb.type === 'other' && <HelpCircle className="w-2.5 h-2.5" />}
                            {fb.type}
                          </span>

                          {fb.rating && (
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={cn(
                                    'w-2.5 h-2.5',
                                    s <= fb.rating!
                                      ? 'text-warning fill-warning'
                                      : 'text-border'
                                  )}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                          {fb.message}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
