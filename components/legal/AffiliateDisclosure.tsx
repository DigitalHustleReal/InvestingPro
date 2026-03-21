'use client';

import Link from 'next/link';
import { ExternalLink, Info } from 'lucide-react';

interface AffiliateDisclosureProps {
  variant?: 'badge' | 'banner' | 'inline' | 'tooltip';
  className?: string;
  showIcon?: boolean;
}

export default function AffiliateDisclosure({ 
  variant = 'badge',
  className = '',
  showIcon = true 
}: AffiliateDisclosureProps) {
  if (variant === 'badge') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-xs text-blue-700 dark:text-blue-300 ${className}`}>
        {showIcon && <ExternalLink className="w-3 h-3" />}
        <span className="font-medium">Affiliate Link</span>
      </span>
    );
  }

  if (variant === 'tooltip') {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-600 ${className}`} title="We may earn a commission if you apply through this link">
        {showIcon && <Info className="w-3.5 h-3.5" />}
        <span>Affiliate</span>
      </span>
    );
  }

  if (variant === 'inline') {
    return (
      <p className={`text-xs text-slate-600 dark:text-slate-400 ${className}`}>
        <strong>Affiliate Disclosure:</strong> We may earn a commission if you apply through our links. 
        This doesn't affect our recommendations or the price you pay.{' '}
        <Link href="/affiliate-disclosure" className="underline hover:text-primary-600 transition-colors font-medium">
          Learn more
        </Link>
      </p>
    );
  }

  // Banner variant
  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        {showIcon && <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />}
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
            📢 Affiliate Disclosure
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            We may earn commissions when you apply for products through our affiliate links. This helps us keep the platform 
            free and maintain high-quality content. Our recommendations are based on thorough research and are not influenced 
            by commission rates. We only recommend products we believe provide value.{' '}
            <Link 
              href="/affiliate-disclosure" 
              className="underline font-medium hover:text-blue-700 dark:hover:text-blue-200 transition-colors"
            >
              Full disclosure →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
