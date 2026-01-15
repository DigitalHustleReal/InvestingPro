/**
 * Sharable Comparison Card Component
 * 
 * Displays a side-by-side comparison that can be shared as image or text.
 */

"use client";

import React, { useState } from 'react';
import { Share2, Twitter, Copy, Check, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface ComparisonItem {
    label: string;
    valueA: string | number;
    valueB: string | number;
    highlight?: 'a' | 'b' | 'both' | 'none';
}

export interface SharableComparisonCardProps {
    /**
     * Comparison title
     */
    title: string;
    
    /**
     * Item A name
     */
    itemA: string;
    
    /**
     * Item B name
     */
    itemB: string;
    
    /**
     * Comparison items
     */
    items: ComparisonItem[];
    
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
     * Show share options
     */
    showShare?: boolean;
    
    /**
     * Custom className
     */
    className?: string;
}

/**
 * Sharable Comparison Card Component
 */
export default function SharableComparisonCard({
    title,
    itemA,
    itemB,
    items,
    articleUrl,
    articleTitle,
    category,
    showShare = true,
    className
}: SharableComparisonCardProps) {
    const [copied, setCopied] = useState(false);

    const formatValue = (val: string | number): string => {
        if (typeof val === 'number') {
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

    const handleTweet = () => {
        // Create comparison summary for tweet
        const summary = items.slice(0, 3).map(item => 
            `${item.label}: ${formatValue(item.valueA)} vs ${formatValue(item.valueB)}`
        ).join(' | ');
        
        const tweetText = `${title}: ${itemA} vs ${itemB}\n\n${summary}${articleUrl ? ` ${articleUrl}` : ''}${category ? ` #${category.replace(/-/g, '')}` : ''} #InvestingPro`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(tweetUrl, '_blank', 'width=550,height=420');
        
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'comparison_card_tweet', {
                comparison_title: title,
                category: category
            });
        }
    };

    const handleCopy = async () => {
        const text = `${title}\n\n${itemA} vs ${itemB}\n\n${items.map(item => 
            `${item.label}: ${formatValue(item.valueA)} vs ${formatValue(item.valueB)}`
        ).join('\n')}`;
        
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('Comparison copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy');
        }
    };

    const handleShare = async () => {
        const shareText = `${title}: ${itemA} vs ${itemB}`;
        
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

    return (
        <Card className={cn("border-slate-200 dark:border-slate-800 overflow-hidden", className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                        {title}
                    </CardTitle>
                    {showShare && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleTweet}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                aria-label="Tweet comparison"
                                title="Tweet this comparison"
                            >
                                <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                            </button>
                            <button
                                onClick={handleCopy}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                aria-label="Copy comparison"
                                title="Copy comparison"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-success-600" />
                                ) : (
                                    <Copy className="w-4 h-4 text-slate-400" />
                                )}
                            </button>
                            {navigator.share && (
                                <button
                                    onClick={handleShare}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                    aria-label="Share comparison"
                                    title="Share comparison"
                                >
                                    <Share2 className="w-4 h-4 text-slate-400" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                <th className="text-left p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 w-1/3">
                                    Feature
                                </th>
                                <th className="text-center p-3 text-sm font-semibold text-slate-900 dark:text-white w-1/3">
                                    {itemA}
                                </th>
                                <th className="text-center p-3 text-sm font-semibold text-slate-900 dark:text-white w-1/3">
                                    {itemB}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => {
                                const highlightA = item.highlight === 'a' || item.highlight === 'both';
                                const highlightB = item.highlight === 'b' || item.highlight === 'both';
                                
                                return (
                                    <tr 
                                        key={index}
                                        className={cn(
                                            "border-b border-slate-100 dark:border-slate-800",
                                            index % 2 === 0 && "bg-slate-50/50 dark:bg-slate-900/50"
                                        )}
                                    >
                                        <td className="p-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {item.label}
                                        </td>
                                        <td className={cn(
                                            "p-3 text-sm text-center font-semibold",
                                            highlightA && "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                                        )}>
                                            {formatValue(item.valueA)}
                                        </td>
                                        <td className={cn(
                                            "p-3 text-sm text-center font-semibold",
                                            highlightB && "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                                        )}>
                                            {formatValue(item.valueB)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
