"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Sparkles, TrendingUp, Shield, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartCTAProps {
    variant?: 'primary' | 'secondary' | 'gradient' | 'outline' | 'premium';
    size?: 'sm' | 'md' | 'lg';
    href: string;
    label: string;
    sublabel?: string;
    icon?: 'arrow' | 'external' | 'sparkles' | 'trending' | 'shield' | 'star' | 'none';
    isExternal?: boolean;
    trackingId?: string;
    articleId?: string;
    className?: string;
    fullWidth?: boolean;
}

export default function SmartCTA({
    variant = 'primary',
    size = 'md',
    href,
    label,
    sublabel,
    icon = 'arrow',
    isExternal = false,
    trackingId,
    articleId,
    className,
    fullWidth = false
}: SmartCTAProps) {
    
    // Build tracking URL if this is an affiliate link
    const finalHref = trackingId 
        ? `/go/${trackingId}${articleId ? `?article=${articleId}` : ''}`
        : href;

    const IconComponent = {
        arrow: ArrowRight,
        external: ExternalLink,
        sparkles: Sparkles,
        trending: TrendingUp,
        shield: Shield,
        star: Star,
        none: null
    }[icon];

    const baseStyles = "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-300 active:scale-95";
    
    const variantStyles = {
        primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30",
        secondary: "bg-slate-800 hover:bg-slate-700 text-white",
        gradient: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105",
        outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10",
        premium: "bg-gradient-to-r from-accent-500 to-orange-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
    };

    const sizeStyles = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    const content = (
        <>
            <span className="flex flex-col items-start">
                <span>{label}</span>
                {sublabel && (
                    <span className={cn(
                        "font-normal opacity-80",
                        size === 'sm' ? 'text-xs' : 'text-sm'
                    )}>
                        {sublabel}
                    </span>
                )}
            </span>
            {IconComponent && (
                <IconComponent className={cn(
                    "transition-transform group-hover:translate-x-1",
                    size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'
                )} />
            )}
        </>
    );

    const combinedStyles = cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        "group",
        className
    );

    if (isExternal || trackingId) {
        return (
            <a
                href={finalHref}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={combinedStyles}
            >
                {content}
            </a>
        );
    }

    return (
        <Link href={finalHref} className={combinedStyles}>
            {content}
        </Link>
    );
}

// Preset CTAs for common use cases
export function ApplyNowCTA({ 
    href, 
    trackingId, 
    articleId,
    product = 'Credit Card'
}: { 
    href: string; 
    trackingId?: string;
    articleId?: string;
    product?: string;
}) {
    return (
        <SmartCTA
            variant="gradient"
            size="lg"
            href={href}
            trackingId={trackingId}
            articleId={articleId}
            label={`Apply for ${product}`}
            sublabel="Quick online application"
            icon="arrow"
            isExternal
            fullWidth
        />
    );
}

export function CompareNowCTA({ category }: { category: string }) {
    return (
        <SmartCTA
            variant="primary"
            size="md"
            href={`/${category}/compare`}
            label="Compare Options"
            sublabel="Find the best for you"
            icon="trending"
        />
    );
}

export function LearnMoreCTA({ href, label = "Learn More" }: { href: string; label?: string }) {
    return (
        <SmartCTA
            variant="outline"
            size="md"
            href={href}
            label={label}
            icon="arrow"
        />
    );
}
