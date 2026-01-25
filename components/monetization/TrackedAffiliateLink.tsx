"use client";

import React, { useCallback } from 'react';
import { trackAffiliateClick, AffiliateClickData } from '@/lib/tracking/affiliate-tracker';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface TrackedAffiliateLinkProps {
    /** Target URL to redirect to */
    href: string;
    /** Product name for tracking */
    productName: string;
    /** Product ID (optional) */
    productId?: string;
    /** Product slug (optional) */
    productSlug?: string;
    /** Product category */
    category?: string;
    /** Provider/issuer name */
    providerName?: string;
    /** Source page identifier (e.g., 'credit-cards', 'comparison') */
    sourcePage: string;
    /** Component type for attribution */
    sourceComponent?: 'product_card' | 'comparison_table' | 'article_cta' | 'sidebar' | 'button' | 'link';
    /** Related article ID if applicable */
    articleId?: string;
    /** Affiliate network */
    affiliateNetwork?: string;
    /** Link content */
    children: React.ReactNode;
    /** Additional class names */
    className?: string;
    /** Show external link icon */
    showIcon?: boolean;
    /** Variant styling */
    variant?: 'default' | 'button' | 'card' | 'text';
    /** Callback after click is tracked */
    onTrack?: (clickId: string | null) => void;
}

const variantStyles = {
    default: 'text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1',
    button: 'inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors',
    card: 'block w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary-500 hover:shadow-md transition-all',
    text: 'text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 underline-offset-2 hover:underline',
};

/**
 * TrackedAffiliateLink Component
 * 
 * An affiliate link that automatically tracks clicks for revenue attribution.
 * Opens link in new tab after tracking.
 * 
 * @example
 * <TrackedAffiliateLink
 *   href="https://affiliate.example.com/card"
 *   productName="HDFC Regalia"
 *   productId="123"
 *   category="credit_card"
 *   sourcePage="credit-cards"
 *   sourceComponent="product_card"
 *   variant="button"
 * >
 *   Apply Now
 * </TrackedAffiliateLink>
 */
export default function TrackedAffiliateLink({
    href,
    productName,
    productId,
    productSlug,
    category,
    providerName,
    sourcePage,
    sourceComponent = 'link',
    articleId,
    affiliateNetwork = 'direct',
    children,
    className,
    showIcon = true,
    variant = 'default',
    onTrack,
}: TrackedAffiliateLinkProps) {
    const handleClick = useCallback(async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        
        // Track the click
        const clickData: AffiliateClickData = {
            productId,
            productSlug,
            productName,
            category,
            providerName,
            sourcePage,
            sourceComponent,
            articleId,
            affiliateLink: href,
            affiliateNetwork,
        };
        
        const clickId = await trackAffiliateClick(clickData);
        
        // Call optional callback
        if (onTrack) {
            onTrack(clickId);
        }
        
        // Open link in new tab
        window.open(href, '_blank', 'noopener,noreferrer');
    }, [href, productId, productSlug, productName, category, providerName, sourcePage, sourceComponent, articleId, affiliateNetwork, onTrack]);

    return (
        <a
            href={href}
            onClick={handleClick}
            className={cn(variantStyles[variant], className)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            data-product={productSlug || productId}
            data-source={sourcePage}
        >
            {children}
            {showIcon && variant !== 'card' && (
                <ExternalLink className="w-4 h-4 shrink-0" />
            )}
        </a>
    );
}

/**
 * Simpler version for quick usage
 */
export function AffiliateButton({
    href,
    productName,
    sourcePage,
    children,
    className,
}: {
    href: string;
    productName: string;
    sourcePage: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <TrackedAffiliateLink
            href={href}
            productName={productName}
            sourcePage={sourcePage}
            sourceComponent="button"
            variant="button"
            className={className}
        >
            {children}
        </TrackedAffiliateLink>
    );
}
