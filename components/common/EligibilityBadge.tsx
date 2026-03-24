import React from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, XCircle, HelpCircle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type EligibilityStatus = 'likely' | 'possible' | 'unlikely' | 'unknown';

interface EligibilityConfig {
  label: string;
  subLabel: string;
  icon: React.ElementType;
  classes: string;
  iconColor: string;
}

const ELIGIBILITY_CONFIG: Record<EligibilityStatus, EligibilityConfig> = {
  likely: {
    label: 'Likely Approved',
    subLabel: 'CIBIL 750+',
    icon: CheckCircle2,
    classes: 'bg-primary-50 border-primary-100 text-primary-700 dark:bg-primary-950/40 dark:border-primary-900/50 dark:text-primary-300',
    iconColor: 'text-primary-500',
  },
  possible: {
    label: 'Possible',
    subLabel: 'CIBIL 700–749',
    icon: AlertCircle,
    classes: 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900/50 dark:text-amber-300',
    iconColor: 'text-amber-500',
  },
  unlikely: {
    label: 'Unlikely',
    subLabel: 'CIBIL below 700',
    icon: XCircle,
    classes: 'bg-red-50 border-red-100 text-red-700 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-300',
    iconColor: 'text-red-500',
  },
  unknown: {
    label: 'Check Score',
    subLabel: 'Know your CIBIL',
    icon: HelpCircle,
    classes: 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300',
    iconColor: 'text-slate-400',
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Derive eligibility status from CIBIL score.
 * minCibilScore: the minimum score the card/loan requires.
 * userCibilScore: the user's score (optional — show 'unknown' if not set).
 */
export function getEligibilityStatus(
  minCibilScore: number,
  userCibilScore?: number
): EligibilityStatus {
  if (!userCibilScore) return 'unknown';
  if (userCibilScore >= minCibilScore + 50) return 'likely';
  if (userCibilScore >= minCibilScore) return 'possible';
  return 'unlikely';
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface EligibilityBadgeProps {
  /**
   * Minimum CIBIL score required for this product.
   * Typical values: 650, 700, 720, 750, 780
   */
  minCibilScore: number;
  /**
   * User's CIBIL score (from profile/session).
   * If undefined, shows "Check Score" state.
   */
  userCibilScore?: number;
  /**
   * compact — icon + label only (for product cards)
   * full    — icon + label + sub-label + CTA link (for detail pages)
   */
  size?: 'compact' | 'full';
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EligibilityBadge({
  minCibilScore,
  userCibilScore,
  size = 'compact',
  className = '',
}: EligibilityBadgeProps) {
  const status = getEligibilityStatus(minCibilScore, userCibilScore);
  const config = ELIGIBILITY_CONFIG[status];
  const Icon = config.icon;

  if (size === 'compact') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-semibold ${config.classes} ${className}`}
        title={`Approval probability based on CIBIL score. Required: ${minCibilScore}+`}
      >
        <Icon className={`w-3 h-3 ${config.iconColor} flex-shrink-0`} />
        {config.label}
      </span>
    );
  }

  // Full size — used on detail pages or eligibility sections
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border ${config.classes} ${className}`}
    >
      <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold">{config.label}</p>
          <span className="text-xs opacity-70">{config.subLabel} recommended</span>
        </div>
        {status === 'unknown' && (
          <p className="text-xs mt-1 opacity-80">
            Check your free CIBIL score to see your approval odds.{' '}
            <Link
              href="/cibil-score/simulator"
              className="font-semibold underline underline-offset-2 hover:no-underline"
            >
              Simulate now →
            </Link>
          </p>
        )}
        {status === 'likely' && (
          <p className="text-xs mt-1 opacity-80">
            Your CIBIL score meets this card's requirements.
          </p>
        )}
        {status === 'possible' && (
          <p className="text-xs mt-1 opacity-80">
            You may qualify. Approval is at the issuer's discretion.{' '}
            <Link
              href="/cibil-score"
              className="font-semibold underline underline-offset-2 hover:no-underline"
            >
              Improve score →
            </Link>
          </p>
        )}
        {status === 'unlikely' && (
          <p className="text-xs mt-1 opacity-80">
            Score below minimum. Build your credit first.{' '}
            <Link
              href="/cibil-score"
              className="font-semibold underline underline-offset-2 hover:no-underline"
            >
              View improvement plan →
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
