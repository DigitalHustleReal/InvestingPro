import React from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';

// ─── Regulatory Body Config ───────────────────────────────────────────────────

type RegulatorySource =
  | 'RBI'       // credit cards, loans, fixed deposits
  | 'AMFI'      // mutual funds
  | 'IRDAI'     // insurance
  | 'SEBI'      // demat accounts, stocks
  | 'PFRDA'     // NPS, PPF
  | 'DICGC'     // FD insurance
  | 'NSE/BSE';  // exchange data

interface RegulatoryConfig {
  label: string;
  description: string;
  badgeColor: string;
}

const REGULATORY_CONFIG: Record<RegulatorySource, RegulatoryConfig> = {
  RBI: {
    label: 'RBI',
    description: 'Reserve Bank of India regulated',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50',
  },
  AMFI: {
    label: 'AMFI',
    description: 'AMFI-registered mutual fund data',
    badgeColor: 'bg-primary-50 text-primary-700 border-primary-100 dark:bg-primary-950/40 dark:text-primary-300 dark:border-primary-900/50',
  },
  IRDAI: {
    label: 'IRDAI',
    description: 'IRDAI-compliant insurance products',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50',
  },
  SEBI: {
    label: 'SEBI',
    description: 'SEBI-registered brokers & exchanges',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900/50',
  },
  PFRDA: {
    label: 'PFRDA',
    description: 'PFRDA-regulated pension schemes',
    badgeColor: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900/50',
  },
  DICGC: {
    label: 'DICGC',
    description: 'DICGC deposit insurance covered',
    badgeColor: 'bg-primary-50 text-primary-700 border-primary-100 dark:bg-primary-950/40 dark:text-primary-300 dark:border-primary-900/50',
  },
  'NSE/BSE': {
    label: 'NSE/BSE',
    description: 'Live exchange data',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/50',
  },
};

// ─── Helper: Relative time ────────────────────────────────────────────────────

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DataFreshnessBarProps {
  /**
   * When rates were last verified.
   * Defaults to today (assumes cron job ran today).
   */
  verifiedAt?: Date;
  /** Regulatory body that governs this data */
  source: RegulatorySource;
  /** How often data auto-updates */
  updateFrequency?: 'Daily' | 'Weekly' | 'Real-time';
  /** Optional count of products being shown */
  productCount?: number;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DataFreshnessBar({
  verifiedAt,
  source,
  updateFrequency = 'Daily',
  productCount,
  className = '',
}: DataFreshnessBarProps) {
  const verifiedDate = verifiedAt ?? new Date();
  const relativeTime = getRelativeTime(verifiedDate);
  const reg = REGULATORY_CONFIG[source];

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs ${className}`}
    >
      {/* Verified timestamp */}
      <div className="flex items-center gap-1.5 text-primary-700 dark:text-primary-400">
        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="font-semibold">
          Data verified{' '}
          <span
            title={verifiedDate.toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            className="cursor-help border-b border-dashed border-primary-300 dark:border-primary-600"
          >
            {relativeTime}
          </span>
        </span>
      </div>

      {/* Separator */}
      <span className="hidden sm:inline text-slate-200 dark:text-slate-700">|</span>

      {/* Regulatory badge */}
      <div
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-semibold tracking-wide uppercase text-[10px] ${reg.badgeColor}`}
        title={reg.description}
      >
        {reg.label}
      </div>

      {/* Update frequency */}
      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
        <RefreshCw className="w-3 h-3" />
        <span>Updated {updateFrequency.toLowerCase()}</span>
      </div>

      {/* Product count — optional */}
      {productCount !== undefined && productCount > 0 && (
        <>
          <span className="hidden sm:inline text-slate-200 dark:text-slate-700">|</span>
          <span className="text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{productCount}</span> products compared
          </span>
        </>
      )}
    </div>
  );
}
