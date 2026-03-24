"use client";

import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────

interface NewsletterSubscribeProps {
  /**
   * compact  — single-line input + button (for page banners, footer)
   * section  — full card with headline, benefits, form (for homepage, article CTAs)
   */
  variant?: 'compact' | 'section';
  className?: string;
  /** Override the headline in 'section' variant */
  headline?: string;
  /** Override the sub-copy in 'section' variant */
  description?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewsletterSubscribe({
  variant = 'compact',
  className = '',
  headline = 'Get InvestingPro Weekly',
  description = '5 money tips every Monday morning. Free, no spam, unsubscribe anytime.',
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, frequency: 'weekly' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Subscription failed. Please try again.');
      }
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className={`flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/50 rounded-xl ${className}`}>
        <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-primary-800 dark:text-primary-300">You're in!</p>
          <p className="text-xs text-primary-600 dark:text-primary-400">
            Check your inbox for a confirmation email. First edition lands Monday 9am.
          </p>
        </div>
      </div>
    );
  }

  // ── Compact variant ────────────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="h-11 px-5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>Subscribe free <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
        {errorMsg && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errorMsg}</p>
        )}
      </div>
    );
  }

  // ── Section variant ────────────────────────────────────────────────────────
  return (
    <div className={`bg-gradient-to-br from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-8 text-white ${className}`}>
      <div className="max-w-2xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-4">
          <Mail className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold uppercase tracking-wide">Free weekly newsletter</span>
        </div>

        {/* Headline */}
        <h3 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">{headline}</h3>
        <p className="text-white/80 text-sm mb-6 leading-relaxed max-w-md mx-auto">{description}</p>

        {/* What you get */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
          {[
            { label: 'Best rate this week', sub: 'FD, SIP, loan comparisons' },
            { label: 'One tax tip', sub: 'Actionable, India-specific' },
            { label: 'Market in 60 seconds', sub: 'What actually matters' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-2 bg-white/10 rounded-xl p-3">
              <CheckCircle2 className="w-4 h-4 text-accent-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold">{item.label}</p>
                <p className="text-xs text-white/60">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="h-12 px-6 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-lg"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>Get Monday Tips <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        {errorMsg && (
          <p className="mt-3 text-xs text-red-300">{errorMsg}</p>
        )}

        <p className="text-white/40 text-xs mt-4">
          Join 10,000+ Indians making smarter money decisions. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
