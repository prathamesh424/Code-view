'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { MessageSquare, Send, Star, CheckCircle2, Clock, Bug, Lightbulb, MessageCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type FeedbackType = 'bug' | 'feature' | 'general' | 'other';

const FEEDBACK_TYPES: { value: FeedbackType; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'bug', label: 'Bug Report', icon: Bug, color: 'text-error' },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-warning' },
  { value: 'general', label: 'General Feedback', icon: MessageCircle, color: 'text-accent' },
  { value: 'other', label: 'Other', icon: HelpCircle, color: 'text-muted' },
];

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<FeedbackType>('general');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      setTimeout(() => setSubmitted(false), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            We Value Your Feedback
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Share Your <span className="gradient-text">Feedback</span>
          </h1>
          <p className="text-muted max-w-lg mx-auto">
            Help us improve Code Visualizer. Report bugs, suggest features, or just tell us what you think.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-xl border border-border bg-surface">
              {/* Name & Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={100}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={200}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="your@email.com (optional)"
                  />
                </div>
              </div>

              {/* Feedback Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Feedback Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FEEDBACK_TYPES.map((ft) => {
                    const Icon = ft.icon;
                    return (
                      <button
                        key={ft.value}
                        type="button"
                        onClick={() => setType(ft.value)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all',
                          type === ft.value
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border bg-background text-muted hover:border-border-hover'
                        )}
                      >
                        <Icon className={cn('w-4 h-4', type === ft.value ? 'text-accent' : ft.color)} />
                        {ft.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Rating (optional)</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star === rating ? 0 : star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          'w-6 h-6 transition-colors',
                          (hoverRating || rating) >= star
                            ? 'text-warning fill-warning'
                            : 'text-border'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  maxLength={2000}
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Tell us what's on your mind..."
                />
                <p className="text-xs text-muted mt-1">{message.length}/2000</p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !name.trim() || !message.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {submitting ? 'Sending...' : 'Send Feedback'}
              </button>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    Thank you! Your feedback has been submitted successfully.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Recent Feedback Sidebar */}
          <div className="lg:col-span-2">
            <div className="p-5 rounded-xl border border-border bg-surface">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted" />
                Recent Feedback
              </h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {feedbackList === undefined ? (
                  <div className="text-sm text-muted text-center py-8">Loading...</div>
                ) : feedbackList.length === 0 ? (
                  <div className="text-sm text-muted text-center py-8">No feedback yet. Be the first!</div>
                ) : (
                  feedbackList.map((fb) => (
                    <div
                      key={fb._id}
                      className="p-3 rounded-lg bg-background border border-border"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground">{fb.name}</span>
                        <span className="text-[10px] text-muted">
                          {new Date(fb.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={cn(
                        'inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase mb-1.5',
                        fb.type === 'bug' && 'bg-error/10 text-error',
                        fb.type === 'feature' && 'bg-warning/10 text-warning',
                        fb.type === 'general' && 'bg-accent/10 text-accent',
                        fb.type === 'other' && 'bg-surface-secondary text-muted',
                      )}>
                        {fb.type}
                      </span>
                      {fb.rating && (
                        <div className="flex gap-0.5 mb-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={cn('w-3 h-3', s <= fb.rating! ? 'text-warning fill-warning' : 'text-border')} />
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted line-clamp-3">{fb.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
