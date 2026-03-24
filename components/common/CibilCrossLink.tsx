import React from 'react';
import Link from 'next/link';
import { BarChart3, ArrowRight, Shield } from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CibilCrossLinkProps {
  /**
   * 'cards'  — "See which credit cards you qualify for"
   * 'loans'  — "Check your loan eligibility"
   * 'generic' — generic CIBIL awareness
   */
  context?: 'cards' | 'loans' | 'generic';
  className?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CONTEXT_CONFIG = {
  cards: {
    headline: 'Know which cards you actually qualify for',
    sub: 'Use our free CIBIL Score Simulator to see your approval odds before applying — no credit check required.',
    cta: 'Check My Eligibility',
    href: '/cibil-score/simulator',
  },
  loans: {
    headline: 'Check your loan eligibility in seconds',
    sub: 'Your CIBIL score determines your interest rate. A 750+ score can save you ₹2–4 lakh on a ₹50L home loan.',
    cta: 'Simulate My CIBIL Score',
    href: '/cibil-score/simulator',
  },
  generic: {
    headline: 'Your CIBIL score determines what you can borrow',
    sub: 'Free simulator — no registration, no credit check. See your approval chances instantly.',
    cta: 'Check Free CIBIL Score',
    href: '/cibil-score',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CibilCrossLink({
  context = 'generic',
  className = '',
}: CibilCrossLinkProps) {
  const config = CONTEXT_CONFIG[context];

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 bg-gradient-to-r from-primary-50 to-primary-50/50 dark:from-primary-950/40 dark:to-slate-900 border border-primary-100 dark:border-primary-900/50 rounded-xl ${className}`}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/60 flex items-center justify-center flex-shrink-0">
        <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-0.5">
          {config.headline}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {config.sub}
        </p>
      </div>

      {/* Trust signal + CTA */}
      <div className="flex flex-col items-start sm:items-end gap-1.5 flex-shrink-0">
        <div className="flex items-center gap-1 text-[10px] text-primary-600 dark:text-primary-400 font-semibold">
          <Shield className="w-3 h-3" />
          No credit check
        </div>
        <Link
          href={config.href}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
        >
          {config.cta}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
