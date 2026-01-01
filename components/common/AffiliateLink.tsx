"use client";

import React from 'react';
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { ExternalLink } from "lucide-react";
import { logger } from "@/lib/logger";

interface AffiliateLinkProps {
    productId: string;
    articleId?: string | null;
    children?: React.ReactNode;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export default function AffiliateLink({
    productId,
    articleId, // Kept for interface compatibility, can be passed as src
    children,
    className = "",
    variant = "default"
}: AffiliateLinkProps) {
    // Construct the tracking URL
    // We use a getter to safely access window in client, or fallback to empty
    const getSource = () => typeof window !== 'undefined' ? window.location.pathname : 'server-render';
    
    // Note: We compute the URL in the render. 
    // Ideally this should be robust to preventing hydration mismatch, but for query params it's usually fine.
    // better to use an effect if hydration is an issue, but standard <a> is best for performance.
    
    // Using a simpler approach to avoid hydration errors: just static construction, let the API handle "unknown" src if needed
    // or pass it via props if available from parent server component
    const trackingUrl = `/api/out?id=${productId}`;

    return (
        <Button
            asChild
            className={className}
            variant={variant}
        >
            <a 
                href={trackingUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                onClick={(e) => {
                    // Optional: Client side analytics (GA/PostHog) here
                    // e.g. sendEvent('affiliate_click', { productId })
                    
                    // Add source param dynamically at click time to ensure correct path
                    const currentUrl = new URL(e.currentTarget.href, window.location.origin);
                    currentUrl.searchParams.set('src', window.location.pathname);
                    e.currentTarget.href = currentUrl.toString();
                }}
            >
                {children || 'Apply Now'}
                <ExternalLink className="w-4 h-4 ml-2" />
            </a>
        </Button>
    );
}
