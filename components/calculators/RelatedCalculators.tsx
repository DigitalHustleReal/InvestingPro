"use client";

import React from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface RelatedCalculator {
  id: string;
  name: string;
  description: string;
  href: string;
  icon?: string;
}

const CALCULATOR_MAP: Record<string, RelatedCalculator[]> = {
  credit_card: [
    {
      id: 'rewards',
      name: 'Rewards Calculator',
      description: 'Calculate potential rewards earnings',
      href: '/calculators/credit-card-rewards'
    },
    {
      id: 'payoff',
      name: 'Payoff Calculator',
      description: 'Plan your credit card debt payoff',
      href: '/calculators/credit-card-payoff'
    }
  ],
  loan: [
    {
      id: 'emi',
      name: 'EMI Calculator',
      description: 'Calculate monthly loan payments',
      href: '/calculators/emi'
    },
    {
      id: 'eligibility',
      name: 'Loan Eligibility',
      description: 'Check how much you can borrow',
      href: '/calculators/loan-eligibility'
    }
  ],
  mutual_fund: [
    {
      id: 'sip',
      name: 'SIP Calculator',
      description: 'Plan your systematic investments',
      href: '/calculators/sip'
    },
    {
      id: 'lumpsum',
      name: 'Lumpsum Calculator',
      description: 'Calculate one-time investment returns',
      href: '/calculators/lumpsum'
    }
  ]
};

interface RelatedCalculatorsProps {
  category: 'credit_card' | 'loan' | 'mutual_fund';
  className?: string;
}

export default function RelatedCalculators({ category, className }: RelatedCalculatorsProps) {
  const calculators = CALCULATOR_MAP[category] || CALCULATOR_MAP.credit_card;

  return (
    <div className={cn("bg-gradient-to-br from-primary-50 to-white dark:from-primary-950/20 dark:to-slate-900 border border-primary-200 dark:border-primary-800/30 rounded-2xl p-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h3 className="font-bold text-slate-900 dark:text-white">Related Calculators</h3>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        Make informed decisions with our financial calculators
      </p>

      {/* Calculator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {calculators.map((calc) => (
          <Link key={calc.id} href={calc.href}>
            <div className="group bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-primary-500 dark:hover:border-primary-600 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {calc.name}
                </h4>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {calc.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Link href="/calculators">
          <Button variant="ghost" className="w-full text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30">
            View All Calculators
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
