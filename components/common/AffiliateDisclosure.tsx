import React from 'react';
import { Info } from 'lucide-react';
import Link from 'next/link';

interface AffiliateDisclosureProps {
    variant?: 'button' | 'tooltip' | 'inline';
    size?: 'xs' | 'sm';
    className?: string;
    hasAffiliateLink?: boolean; // Only show if affiliate link exists
}

/**
 * AffiliateDisclosure - FTC-compliant disclosure component
 * 
 * Displays affiliate relationship disclosure near monetization points.
 * Must be placed close to affiliate links per FTC guidelines.
 * 
 * IMPORTANT: Only renders when hasAffiliateLink=true (contextual)
 */
export default function AffiliateDisclosure({ 
    variant = 'button', 
    size = 'xs',
    className = '',
    hasAffiliateLink = false
}: AffiliateDisclosureProps) {
    
    // CONTEXTUAL: Only show if affiliate link exists
    if (!hasAffiliateLink) {
        return null;
    }
    
    // Button variant - appears below "Apply Now" buttons
    if (variant === 'button') {
        return (
            <p className={`text-[10px] text-slate-600 text-center flex items-center justify-center gap-0.5 ${className}`}>
                <Info className="w-3 h-3" aria-hidden="true" />
                <span>We may earn a commission</span>
            </p>
        );
    }
    
    // Tooltip variant - full disclosure text
    if (variant === 'tooltip') {
        return (
            <div className={`text-xs text-slate-600 max-w-xs ${className}`}>
                <p className="mb-2">
                    We're reader-supported. When you click our links, we may earn a commission.
                </p>
                <Link 
                    href="/how-we-make-money" 
                    className="text-primary-600 hover:text-primary-700 font-medium underline"
                >
                    Learn how we make money →
                </Link>
            </div>
        );
    }
    
    // Inline variant - banner style disclosure
    if (variant === 'inline') {
        return (
            <div className={`px-4 py-2 bg-primary-50/50 border-t border-primary-100 ${className}`}>
                <p className="text-[10px] text-slate-600 text-center">
                    <strong className="font-semibold">Advertiser Disclosure:</strong>{' '}
                    We earn commission from some partners. This doesn't affect our editorial independence.{' '}
                    <Link 
                        href="/how-we-make-money" 
                        className="underline hover:text-primary-700"
                    >
                        How we make money
                    </Link>
                </p>
            </div>
        );
    }
    
    return null;
}
