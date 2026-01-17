"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Info } from 'lucide-react';
import { apiClient as api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { ContextualAffiliateLink as ContextualLink } from '@/lib/monetization/contextual-links';
import DisclosureBlock from './DisclosureBlock';

interface ContextualAffiliateLinkProps {
    link: ContextualLink;
    articleId?: string;
    className?: string;
    showDisclosure?: boolean;
}

/**
 * Contextual Affiliate Link Component
 * 
 * Displays affiliate links with:
 * - Clear disclosure
 * - Click tracking
 * - Source tracking
 * - No dark patterns
 */
export default function ContextualAffiliateLink({
    link,
    articleId,
    className = "",
    showDisclosure = true
}: ContextualAffiliateLinkProps) {
    const [clicked, setClicked] = React.useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        setClicked(true);

        try {
            // Track click with full context
            await fetch('/api/monetization/track-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: link.productId,
                    articleId: articleId || null,
                    sourcePage: typeof window !== 'undefined' ? window.location.pathname : '',
                    linkPosition: link.position,
                    linkContext: link.context,
                }),
            });

            // Open affiliate link
            if (typeof window !== 'undefined') {
                window.open(link.affiliateLink, '_blank', 'noopener,noreferrer');
            }

        } catch (error) {
            logger.error('Error tracking affiliate click', error as Error, { link });
            // Still open link even if tracking fails
            if (typeof window !== 'undefined') {
                window.open(link.affiliateLink, '_blank', 'noopener,noreferrer');
            }
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Link Button */}
            <div className="relative">
                <Button
                    onClick={handleClick}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium"
                    disabled={clicked}
                >
                    {clicked ? 'Opening...' : `Apply for ${link.productName}`}
                    <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                
                {/* Context Tooltip */}
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                    <Info className="w-3 h-3" />
                    <span>{link.context}</span>
                </div>
            </div>

            {/* Disclosure */}
            {showDisclosure && (
                <div className="text-xs text-slate-500 italic">
                    {link.disclosure}
                </div>
            )}
        </div>
    );
}

