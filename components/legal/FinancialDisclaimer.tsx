'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

interface FinancialDisclaimerProps {
  variant?: 'full' | 'compact' | 'inline' | 'banner';
  className?: string;
  showIcon?: boolean;
}

export default function FinancialDisclaimer({ 
  variant = 'compact',
  className = '',
  showIcon = true 
}: FinancialDisclaimerProps) {
  if (variant === 'inline') {
    return (
      <p className={`text-xs text-slate-500 dark:text-slate-400 ${className}`}>
        Not financial advice. See{' '}
        <Link href="/disclaimer" className="underline hover:text-primary-600 transition-colors">
          disclaimer
        </Link>
        .
      </p>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-4 ${className}`}>
        <div className="flex items-start gap-3">
          {showIcon && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />}
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
              Investment Disclaimer
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
              This information is for educational purposes only and should not be considered financial advice. 
              Consult a licensed professional before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          {showIcon && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />}
          <div className="flex-1">
            <p className="text-sm text-amber-900 dark:text-amber-200">
              <strong>⚠️ Important Disclaimer:</strong> InvestingPro is not a registered investment advisor or SEBI-registered entity. 
              Content is for educational purposes only and should not be considered personalized financial advice. 
              Please consult a licensed financial professional before making investment decisions.{' '}
              <Link href="/disclaimer" className="underline font-medium hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                Read full disclaimer →
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`bg-slate-100 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        {showIcon && <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Important Financial Disclaimer
        </h3>
      </div>
      
      <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-1">
            📋 Not Financial Advice
          </p>
          <p>
            InvestingPro is not a registered investment advisor, broker-dealer, financial planner, or SEBI-registered entity. 
            The information provided is for educational and informational purposes only.
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-1">
            👤 No Personalized Advice
          </p>
          <p>
            Content on this platform is general in nature and does not take into account your individual financial situation, 
            goals, risk tolerance, or investment objectives.
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-1">
            🎓 Consult Professionals
          </p>
          <p>
            Before making any financial decisions, please consult with a licensed financial advisor, tax professional, 
            or legal counsel who can provide personalized advice based on your specific circumstances.
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-1">
            ⚠️ Investment Risks
          </p>
          <p>
            All investments carry risk. Past performance does not guarantee future results. You may lose some or all of 
            your investment. Never invest money you cannot afford to lose.
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-1">
            🤝 Affiliate Relationships
          </p>
          <p>
            We may earn commissions from affiliate links. This does not affect our recommendations or editorial independence. 
            See our{' '}
            <Link href="/affiliate-disclosure" className="text-primary-600 hover:text-primary-700 underline font-medium">
              Affiliate Disclosure
            </Link>
            {' '}for details.
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-1">
            🏛️ SEBI Compliance
          </p>
          <p>
            InvestingPro complies with SEBI regulations. We do not provide stock tips, investment recommendations, 
            or advice to buy/sell specific securities. We are an information and comparison platform only.
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-1">
            📊 Data Accuracy
          </p>
          <p>
            While we strive for accuracy, we cannot guarantee that all information is current, complete, or error-free. 
            Always verify information with official sources before making decisions.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-300 dark:border-slate-600">
          <Link 
            href="/disclaimer" 
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline font-medium transition-colors"
          >
            Read Complete Disclaimer →
          </Link>
        </div>
      </div>
    </div>
  );
}
