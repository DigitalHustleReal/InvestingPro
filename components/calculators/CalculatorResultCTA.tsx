"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, CreditCard, Landmark, Shield, PiggyBank, Calculator } from 'lucide-react';

export interface CalculatorCTAConfig {
  headline: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  icon: React.ElementType;
  accentColor?: string; // tailwind bg class for icon bg
}

const CALCULATOR_CTA_MAP: Record<string, CalculatorCTAConfig> = {
  sip: {
    headline: 'Ready to start your SIP?',
    description: 'Compare top-rated mutual funds and start your SIP in minutes.',
    primaryHref: '/mutual-funds/best-sip',
    primaryLabel: 'Compare SIP Funds',
    secondaryHref: '/mutual-funds',
    secondaryLabel: 'Browse All Funds',
    icon: TrendingUp,
    accentColor: 'bg-green-100 dark:bg-green-900/40',
  },
  lumpsum: {
    headline: 'Ready to invest a lumpsum?',
    description: 'Find the best mutual funds for one-time investments.',
    primaryHref: '/mutual-funds',
    primaryLabel: 'Compare Mutual Funds',
    secondaryHref: '/mutual-funds/elss',
    secondaryLabel: 'ELSS Tax-Saving Funds',
    icon: TrendingUp,
    accentColor: 'bg-green-100 dark:bg-green-900/40',
  },
  emi: {
    headline: 'Ready to apply for a loan?',
    description: 'Compare loan interest rates from 50+ lenders and get the lowest EMI.',
    primaryHref: '/loans',
    primaryLabel: 'Compare Loan Rates',
    secondaryHref: '/loans/home-loans',
    secondaryLabel: 'Compare Home Loans',
    icon: Landmark,
    accentColor: 'bg-amber-100 dark:bg-amber-900/40',
  },
  'home-loan-emi': {
    headline: 'Compare home loan rates now',
    description: 'Find the lowest home loan interest rates from top banks.',
    primaryHref: '/loans/home-loans',
    primaryLabel: 'Compare Home Loan Rates',
    secondaryHref: '/calculators/emi',
    secondaryLabel: 'Back to EMI Calculator',
    icon: Landmark,
    accentColor: 'bg-amber-100 dark:bg-amber-900/40',
  },
  ppf: {
    headline: 'Explore more tax-saving options',
    description: 'Compare PPF, ELSS, NPS, and FDs to maximize your 80C deductions.',
    primaryHref: '/ppf-nps',
    primaryLabel: 'PPF & NPS Details',
    secondaryHref: '/mutual-funds/elss',
    secondaryLabel: 'ELSS Funds (80C)',
    icon: PiggyBank,
    accentColor: 'bg-green-100 dark:bg-green-900/40',
  },
  nps: {
    headline: 'Explore NPS investment options',
    description: 'Compare NPS tier 1 & tier 2 plans, pension fund managers, and returns.',
    primaryHref: '/ppf-nps',
    primaryLabel: 'Explore NPS Plans',
    secondaryHref: '/calculators/retirement',
    secondaryLabel: 'Retirement Calculator',
    icon: PiggyBank,
    accentColor: 'bg-green-100 dark:bg-green-900/40',
  },
  fd: {
    headline: 'Find the highest FD interest rates',
    description: 'Compare FD rates from 50+ banks and NBFCs — updated daily.',
    primaryHref: '/fixed-deposits',
    primaryLabel: 'Compare FD Rates',
    icon: PiggyBank,
    accentColor: 'bg-amber-100 dark:bg-amber-900/40',
  },
  rd: {
    headline: 'Find the best RD rates',
    description: 'Compare Recurring Deposit rates from top banks.',
    primaryHref: '/fixed-deposits',
    primaryLabel: 'Compare FD & RD Rates',
    icon: PiggyBank,
    accentColor: 'bg-amber-100 dark:bg-amber-900/40',
  },
  tax: {
    headline: 'Save more tax with the right investments',
    description: 'Compare ELSS funds, PPF, NPS, and FDs to maximize your 80C savings.',
    primaryHref: '/mutual-funds/elss',
    primaryLabel: 'ELSS Tax-Saving Funds',
    secondaryHref: '/ppf-nps',
    secondaryLabel: 'PPF & NPS',
    icon: Calculator,
    accentColor: 'bg-green-100 dark:bg-green-900/40',
  },
  swp: {
    headline: 'Find funds with consistent returns for SWP',
    description: 'Compare top mutual funds suitable for Systematic Withdrawal Plans.',
    primaryHref: '/mutual-funds',
    primaryLabel: 'Compare Mutual Funds',
    secondaryHref: '/calculators/retirement',
    secondaryLabel: 'Retirement Calculator',
    icon: TrendingUp,
    accentColor: 'bg-green-100 dark:bg-green-900/40',
  },
  retirement: {
    headline: 'Start building your retirement corpus',
    description: 'Compare NPS, ELSS, and mutual funds to secure your retirement.',
    primaryHref: '/ppf-nps',
    primaryLabel: 'Explore NPS Plans',
    secondaryHref: '/mutual-funds',
    secondaryLabel: 'Compare Mutual Funds',
    icon: PiggyBank,
    accentColor: 'bg-green-100 dark:bg-green-900/40',
  },
  insurance: {
    headline: 'Compare insurance plans',
    description: 'Find the right term or health insurance coverage for your family.',
    primaryHref: '/insurance',
    primaryLabel: 'Compare Insurance Plans',
    icon: Shield,
    accentColor: 'bg-green-100 dark:bg-green-900/40',
  },
  'credit-card': {
    headline: 'Find the right credit card for your spending',
    description: 'Compare 100+ credit cards and maximize your rewards.',
    primaryHref: '/credit-cards',
    primaryLabel: 'Compare Credit Cards',
    icon: CreditCard,
    accentColor: 'bg-amber-100 dark:bg-amber-900/40',
  },
};

interface CalculatorResultCTAProps {
  calculatorType: keyof typeof CALCULATOR_CTA_MAP;
  className?: string;
}

export function CalculatorResultCTA({ calculatorType, className = '' }: CalculatorResultCTAProps) {
  const config = CALCULATOR_CTA_MAP[calculatorType];
  if (!config) return null;

  const { headline, description, primaryHref, primaryLabel, secondaryHref, secondaryLabel, icon: Icon, accentColor } = config;

  return (
    <div className={`mt-6 rounded-2xl border border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-900/20 p-5 ${className}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl ${accentColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-green-700 dark:text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{headline}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={primaryHref}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-800 hover:bg-green-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              {primaryLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            {secondaryHref && secondaryLabel && (
              <Link
                href={secondaryHref}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg hover:border-green-400 dark:hover:border-green-600 transition-colors"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { CALCULATOR_CTA_MAP };
