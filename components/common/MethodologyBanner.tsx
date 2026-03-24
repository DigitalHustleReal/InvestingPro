"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

// ─── Vertical Config ─────────────────────────────────────────────────────────

type Vertical =
  | 'credit-cards'
  | 'loans'
  | 'mutual-funds'
  | 'fixed-deposits'
  | 'demat-accounts'
  | 'insurance'
  | 'ppf-nps';

interface Factor {
  label: string;
  weight: string;
}

interface VerticalConfig {
  label: string;
  regulatoryBody: string;
  factors: Factor[];
  methodologyAnchor: string;
}

const VERTICAL_CONFIG: Record<Vertical, VerticalConfig> = {
  'credit-cards': {
    label: 'credit cards',
    regulatoryBody: 'RBI-regulated products',
    factors: [
      { label: 'Rewards rate', weight: '30%' },
      { label: 'Annual fee', weight: '25%' },
      { label: 'Features', weight: '15%' },
      { label: 'Interest rate', weight: '10%' },
      { label: 'Eligibility', weight: '10%' },
      { label: 'Issuer trust', weight: '10%' },
    ],
    methodologyAnchor: 'credit-cards-ranking',
  },
  'loans': {
    label: 'loans',
    regulatoryBody: 'RBI-regulated lenders',
    factors: [
      { label: 'Interest rate', weight: '40%' },
      { label: 'Processing fee', weight: '20%' },
      { label: 'Loan range', weight: '15%' },
      { label: 'Eligibility', weight: '15%' },
      { label: 'Lender trust', weight: '10%' },
    ],
    methodologyAnchor: 'personal-loans-ranking',
  },
  'mutual-funds': {
    label: 'mutual funds',
    regulatoryBody: 'AMFI-registered data',
    factors: [
      { label: '3Y returns (50% weight)', weight: '40%' },
      { label: 'Expense ratio', weight: '20%' },
      { label: 'Sharpe ratio', weight: '20%' },
      { label: 'AUM stability', weight: '10%' },
      { label: 'Fund manager', weight: '10%' },
    ],
    methodologyAnchor: 'mutual-funds-ranking',
  },
  'fixed-deposits': {
    label: 'fixed deposits',
    regulatoryBody: 'RBI-licensed institutions',
    factors: [
      { label: 'Interest rate', weight: '40%' },
      { label: 'DICGC cover', weight: '25%' },
      { label: 'Institution trust', weight: '20%' },
      { label: 'Tenure flexibility', weight: '15%' },
    ],
    methodologyAnchor: 'data-sources',
  },
  'demat-accounts': {
    label: 'demat accounts',
    regulatoryBody: 'SEBI-registered brokers',
    factors: [
      { label: 'Brokerage fees', weight: '35%' },
      { label: 'Platform quality', weight: '25%' },
      { label: 'Research tools', weight: '20%' },
      { label: 'Customer support', weight: '20%' },
    ],
    methodologyAnchor: 'data-sources',
  },
  'insurance': {
    label: 'insurance plans',
    regulatoryBody: 'IRDAI-compliant products',
    factors: [
      { label: 'Claim settlement ratio', weight: '35%' },
      { label: 'Premium value', weight: '30%' },
      { label: 'Coverage breadth', weight: '20%' },
      { label: 'Insurer stability', weight: '15%' },
    ],
    methodologyAnchor: 'data-sources',
  },
  'ppf-nps': {
    label: 'PPF & NPS schemes',
    regulatoryBody: 'PFRDA & RBI guidelines',
    factors: [
      { label: 'Returns', weight: '40%' },
      { label: 'Tax benefits', weight: '30%' },
      { label: 'Liquidity', weight: '20%' },
      { label: 'Safety', weight: '10%' },
    ],
    methodologyAnchor: 'data-sources',
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface MethodologyBannerProps {
  vertical: Vertical;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MethodologyBanner({ vertical, className = '' }: MethodologyBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const config = VERTICAL_CONFIG[vertical];

  return (
    <div className={`bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/50 rounded-xl ${className}`}>
      {/* Header row — always visible */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wide">
            How we rank {config.label}
          </span>
          <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400">
            — editorial independence, no pay-to-rank
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/methodology#${config.methodologyAnchor}`}
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            Full methodology
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            aria-label={expanded ? 'Hide ranking factors' : 'Show ranking factors'}
          >
            {expanded ? (
              <>Hide <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Show factors <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>
      </div>

      {/* Expandable factors */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-primary-100 dark:border-primary-900/50">
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 mb-3">
            Rankings use a weighted scoring model — no advertiser can pay to improve their rank. Data is sourced from{' '}
            <span className="font-semibold text-slate-600 dark:text-slate-300">{config.regulatoryBody}</span>.
          </p>
          <div className="flex flex-wrap gap-2">
            {config.factors.map((factor) => (
              <div
                key={factor.label}
                className="flex items-center gap-1.5 bg-white dark:bg-primary-900/40 border border-primary-100 dark:border-primary-800 rounded-lg px-3 py-1.5"
              >
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{factor.label}</span>
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{factor.weight}</span>
              </div>
            ))}
          </div>
          <Link
            href={`/methodology#${config.methodologyAnchor}`}
            className="sm:hidden inline-flex items-center gap-1 mt-3 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
          >
            See full methodology <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
