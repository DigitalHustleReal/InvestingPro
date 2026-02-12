/**
 * Sharable Stat Card Component
 * 
 * Displays a statistic with one-click share functionality.
 * Can be shared as image or text.
 */

"use client";

import React, { useState } from 'react';
import { Share2, Twitter, Copy, Check, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getSocialColor } from '@/lib/utils/theme-colors';

export interface SharableStatCardProps {
    /**
     * Statistic title/label
     */
    title: string;
    
    /**
     * Statistic value
     */
    value: string | number;
    
    /**
     * Change indicator (optional)
     */
    change?: {
        value: number;
        type: 'increase' | 'decrease' | 'neutral';
        period?: string; // e.g., "vs last month"
    };
    
    /**
     * Source/attribution
     */
    source?: string;
    
    /**
     * Article URL for sharing
     */
    articleUrl?: string;
    
    /**
     * Article title for context
     */
    articleTitle?: string;
    
    /**
     * Category for hashtags
     */
    category?: string;
    
    /**
     * Icon to display
     */
    icon?: React.ComponentType<{ className?: string }>;
    
    /**
     * Variant: default, highlighted, minimal
     */
    variant?: 'default' | 'highlighted' | 'minimal';
    
    /**
     * Show share options
     */
    showShare?: boolean;
    
    /**
     * Custom className
     */
    className?: string;
}

/**
 * Sharable Stat Card Component
 */
export default function SharableStatCard({
    title,
    value,
    change,
    source,
    articleUrl,
    articleTitle,
    category,
    icon: Icon,
    variant = 'default',
    showShare = true,
    className
}: SharableStatCardProps) {
    const [copied, setCopied] = useState(false);

    const formatValue = (val: string | number): string => {
        if (typeof val === 'number') {
            // Format numbers with Indian notation
            if (val >= 10000000) {
                return `₹${(val / 10000000).toFixed(1)}Cr`;
            } else if (val >= 100000) {
                return `₹${(val / 100000).toFixed(1)}L`;
            } else if (val >= 1000) {
                return `₹${(val / 1000).toFixed(1)}K`;
            }
            return `₹${val.toLocaleString('en-IN')}`;
        }
        return val;
    };

    const getChangeIcon = () => {
        if (!change) return null;
        switch (change.type) {
            case 'increase':
                return <TrendingUp className="w-4 h-4" />;
            case 'decrease':
                return <TrendingDown className="w-4 h-4" />;
            default:
                return <Minus className="w-4 h-4" />;
        }
    };

    const getChangeColor = () => {
        if (!change) return '';
        switch (change.type) {
            case 'increase':
                return 'text-success-600 dark:text-success-400';
            case 'decrease':
                return 'text-danger-600 dark:text-danger-400';
            default:
                return 'text-slate-600 dark:text-slate-600';
        }
    };

    const handleShare = async () => {
        const shareText = `${title}: ${formatValue(value)}${source ? ` (Source: ${source})` : ''}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: articleTitle || title,
                    text: shareText,
                    url: articleUrl || window.location.href
                });
            } catch (error) {
                // User cancelled
            }
        } else {
            handleCopy();
        }
    };

    const handleTweet = () => {
        const tweetText = `${title}: ${formatValue(value)}${source ? ` (Source: ${source})` : ''}${articleUrl ? ` ${articleUrl}` : ''}${category ? ` #${category.replace(/-/g, '')}` : ''} #InvestingPro`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(tweetUrl, '_blank', 'width=550,height=420');
        
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'stat_card_tweet', {
                stat_title: title,
                stat_value: String(value),
                category: category
            });
        }
    };

    const handleCopy = async () => {
        const text = `${title}: ${formatValue(value)}${source ? ` (Source: ${source})` : ''}`;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('Stat copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy');
        }
    };

    if (variant === 'minimal') {
        return (
            <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg", className)}>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-600">{title}:</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{formatValue(value)}</span>
                {showShare && (
                    <button
                        onClick={handleCopy}
                        className="ml-2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                        aria-label="Copy stat"
                    >
                        {copied ? (
                            <Check className="w-3 h-3 text-success-600" />
                        ) : (
                            <Copy className="w-3 h-3 text-slate-600" />
                        )}
                    </button>
                )}
            </div>
        );
    }

    return (
        <Card className={cn(
            "border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-lg",
            variant === 'highlighted' && "border-primary-300 dark:border-primary-700 bg-gradient-to-br from-primary-50/50 to-white dark:from-primary-900/20 dark:to-slate-900",
            className
        )}>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-600 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4" />}
                        {title}
                    </span>
                    {showShare && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleTweet}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                aria-label="Tweet stat"
                                title="Tweet this stat"
                            >
                                <Twitter className="w-3.5 h-3.5" style={{ color: getSocialColor('twitter') }} />
                            </button>
                            <button
                                onClick={handleCopy}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                aria-label="Copy stat"
                                title="Copy stat"
                            >
                                {copied ? (
                                    <Check className="w-3.5 h-3.5 text-success-600" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                                )}
                            </button>
                        </div>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                        {formatValue(value)}
                    </span>
                    {change && (
                        <div className={cn("flex items-center gap-1 text-sm font-semibold", getChangeColor())}>
                            {getChangeIcon()}
                            <span>
                                {change.type === 'increase' ? '+' : change.type === 'decrease' ? '-' : ''}
                                {Math.abs(change.value)}%
                            </span>
                            {change.period && (
                                <span className="text-xs text-slate-500 dark:text-slate-600 ml-1">
                                    {change.period}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                {source && (
                    <p className="text-xs text-slate-500 dark:text-slate-600 mt-2">
                        Source: {source}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
