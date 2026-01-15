"use client";

import React from 'react';
import { Button } from "@/components/ui/Button";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';

interface DecisionCTAProps {
    /**
     * Decision-focused CTA text
     * Examples: "Find Your Perfect Card", "Start Your Investment Journey", "Make Your Decision"
     */
    text: string;
    
    /**
     * Target URL (can be internal or external affiliate link)
     */
    href: string;
    
    /**
     * Product ID for affiliate tracking (if applicable)
     */
    productId?: string;
    
    /**
     * Article ID for content attribution (if applicable)
     */
    articleId?: string | null;
    
    /**
     * Variant: primary (default), secondary, outline
     */
    variant?: "primary" | "secondary" | "outline";
    
    /**
     * Size: sm, default, lg
     */
    size?: "sm" | "default" | "lg";
    
    /**
     * Show icon (ArrowRight for internal, ExternalLink for external)
     */
    showIcon?: boolean;
    
    /**
     * Is this an external/affiliate link?
     */
    isExternal?: boolean;
    
    /**
     * Additional className
     */
    className?: string;
    
    /**
     * Track conversion event
     */
    onConversion?: (event: { type: string; productId?: string; articleId?: string | null }) => void;
}

/**
 * Decision-Focused CTA Component
 * 
 * Replaces generic CTAs ("Apply Now", "Learn More") with decision-focused language
 * that aligns with our positioning: "Compare. Decide. Apply."
 * 
 * Features:
 * - Decision-focused messaging
 * - Affiliate link tracking (if productId provided)
 * - Conversion tracking
 * - Consistent styling
 */
export default function DecisionCTA({
    text,
    href,
    productId,
    articleId,
    variant = "primary",
    size = "default",
    showIcon = true,
    isExternal = false,
    className,
    onConversion
}: DecisionCTAProps) {
    const handleClick = () => {
        // Track conversion if callback provided
        if (onConversion) {
            onConversion({
                type: 'cta_click',
                productId,
                articleId
            });
        }
        
        // Track affiliate click if productId provided
        if (productId && isExternal) {
            // Affiliate tracking is handled by /api/out endpoint
            // We can add client-side analytics here if needed
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'affiliate_click', {
                    product_id: productId,
                    article_id: articleId,
                    cta_text: text
                });
            }
        }
    };

    const buttonVariant = variant === "primary" ? "default" : variant === "secondary" ? "secondary" : "outline";
    const Icon = isExternal ? ExternalLink : ArrowRight;
    
    // If it's an external affiliate link with productId, use the tracking URL
    const finalHref = isExternal && productId 
        ? `/api/out?id=${productId}${articleId ? `&article=${articleId}` : ''}`
        : href;

    if (isExternal && productId) {
        // External affiliate link - use anchor tag with tracking
        return (
            <Button
                asChild
                variant={buttonVariant}
                size={size}
                className={cn("group", className)}
            >
                <a
                    href={finalHref}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    onClick={handleClick}
                >
                    {text}
                    {showIcon && <Icon className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />}
                </a>
            </Button>
        );
    }

    // Internal link - use Next.js Link
    return (
        <Button
            asChild
            variant={buttonVariant}
            size={size}
            className={cn("group", className)}
        >
            <Link href={finalHref} onClick={handleClick}>
                {text}
                {showIcon && <Icon className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />}
            </Link>
        </Button>
    );
}

/**
 * Pre-configured Decision CTAs for common use cases
 */
export const DecisionCTAs = {
    CreditCard: {
        primary: (productId?: string) => ({
            text: "Find Your Perfect Card",
            href: productId ? `/credit-cards/${productId}` : "/credit-cards/find-your-card",
            productId,
            isExternal: !!productId
        }),
        compare: {
            text: "Compare All Cards",
            href: "/credit-cards#compare",
            isExternal: false
        },
        apply: (productId: string) => ({
            text: "Apply Instantly",
            href: `/api/out?id=${productId}`,
            productId,
            isExternal: true
        })
    },
    MutualFund: {
        primary: (productId?: string) => ({
            text: "Start Your Investment Journey",
            href: productId ? `/mutual-funds/${productId}` : "/mutual-funds/find-your-fund",
            productId,
            isExternal: !!productId
        }),
        compare: {
            text: "Compare All Funds",
            href: "/mutual-funds#compare",
            isExternal: false
        },
        apply: (productId: string) => ({
            text: "Start SIP Now",
            href: `/api/out?id=${productId}`,
            productId,
            isExternal: true
        })
    },
    Loan: {
        primary: (productId?: string) => ({
            text: "Check Your Eligibility",
            href: productId ? `/loans/${productId}` : "/loans",
            productId,
            isExternal: !!productId
        }),
        apply: (productId: string) => ({
            text: "Apply for Loan",
            href: `/api/out?id=${productId}`,
            productId,
            isExternal: true
        })
    },
    Insurance: {
        primary: (productId?: string) => ({
            text: "Get Protected Now",
            href: productId ? `/insurance/${productId}` : "/insurance#protection-score",
            productId,
            isExternal: !!productId
        }),
        apply: (productId: string) => ({
            text: "Buy Policy",
            href: `/api/out?id=${productId}`,
            productId,
            isExternal: true
        })
    },
    Generic: {
        decide: {
            text: "Make Your Decision",
            href: "#",
            isExternal: false
        },
        compare: {
            text: "Compare Options",
            href: "#compare",
            isExternal: false
        }
    }
};
