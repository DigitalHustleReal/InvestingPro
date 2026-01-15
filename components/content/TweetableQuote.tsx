/**
 * Tweetable Quote Component
 * 
 * Displays a quote with one-click tweet functionality.
 * Can be used as a standalone component or generated from text selection.
 */

"use client";

import React, { useState } from 'react';
import { Twitter, Copy, Check, Share2, Quote } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface TweetableQuoteProps {
    /**
     * The quote text to display
     */
    text: string;
    
    /**
     * Author of the quote (optional)
     */
    author?: string;
    
    /**
     * Source/article context (optional)
     */
    source?: string;
    
    /**
     * Article URL for attribution
     */
    articleUrl?: string;
    
    /**
     * Article title for tweet context
     */
    articleTitle?: string;
    
    /**
     * Category for hashtag suggestions
     */
    category?: string;
    
    /**
     * Variant: inline (within content) or standalone (card)
     */
    variant?: 'inline' | 'standalone';
    
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
 * Generate Twitter share URL
 */
function generateTweetUrl(
    text: string,
    articleUrl?: string,
    articleTitle?: string,
    category?: string
): string {
    // Twitter has 280 character limit
    const maxLength = 280;
    let tweetText = text;
    
    // Add attribution if space allows
    if (articleTitle && articleUrl) {
        const attribution = ` — ${articleTitle}`;
        const url = ` ${articleUrl}`;
        const hashtags = category ? ` #${category.replace(/-/g, '')} #InvestingPro` : ' #InvestingPro';
        
        const totalLength = tweetText.length + attribution.length + url.length + hashtags.length;
        
        if (totalLength <= maxLength) {
            tweetText = `${tweetText}${attribution}${url}${hashtags}`;
        } else {
            // Truncate quote to fit
            const availableSpace = maxLength - attribution.length - url.length - hashtags.length - 10; // 10 for "..."
            if (availableSpace > 50) {
                tweetText = `${tweetText.substring(0, availableSpace)}...${attribution}${url}${hashtags}`;
            } else {
                // Just use quote + URL if too long
                tweetText = `${tweetText.substring(0, maxLength - url.length - hashtags.length - 10)}...${url}${hashtags}`;
            }
        }
    } else {
        // Just add hashtag if no attribution
        const hashtags = category ? ` #${category.replace(/-/g, '')} #InvestingPro` : ' #InvestingPro';
        if (tweetText.length + hashtags.length <= maxLength) {
            tweetText = `${tweetText}${hashtags}`;
        }
    }
    
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
}

/**
 * Tweetable Quote Component
 */
export default function TweetableQuote({
    text,
    author,
    source,
    articleUrl,
    articleTitle,
    category,
    variant = 'standalone',
    showShare = true,
    className
}: TweetableQuoteProps) {
    const [copied, setCopied] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

    const handleTweet = () => {
        const tweetUrl = generateTweetUrl(text, articleUrl, articleTitle, category);
        window.open(tweetUrl, '_blank', 'width=550,height=420');
        
        // Track share event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'quote_tweet', {
                quote_text: text.substring(0, 50),
                category: category,
                article_url: articleUrl
            });
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('Quote copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy quote');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: articleTitle || 'Quote from InvestingPro',
                    text: text,
                    url: articleUrl || window.location.href
                });
            } catch (error) {
                // User cancelled or error
            }
        } else {
            // Fallback to copy
            handleCopy();
        }
    };

    // Inline variant (minimal, within content flow)
    if (variant === 'inline') {
        return (
            <div className={cn("my-6 flex items-start gap-3 group", className)}>
                <Quote className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                    <blockquote className="text-lg font-medium text-slate-900 dark:text-white italic border-l-4 border-primary-500 pl-4 py-2">
                        {text}
                    </blockquote>
                    {author && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            — {author}
                        </p>
                    )}
                    {showShare && (
                        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleTweet}
                                className="h-8 text-xs"
                            >
                                <Twitter className="w-3 h-3 mr-1" />
                                Tweet
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCopy}
                                className="h-8 text-xs"
                            >
                                {copied ? (
                                    <Check className="w-3 h-3 mr-1" />
                                ) : (
                                    <Copy className="w-3 h-3 mr-1" />
                                )}
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Standalone variant (card with full features)
    return (
        <Card className={cn("border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-50/50 to-slate-50 dark:from-slate-900/50 dark:to-slate-950 overflow-hidden", className)}>
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                            <Quote className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <blockquote className="text-lg font-semibold text-slate-900 dark:text-white leading-relaxed mb-4">
                            "{text}"
                        </blockquote>
                        
                        {(author || source) && (
                            <div className="mb-4">
                                {author && (
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        — {author}
                                    </p>
                                )}
                                {source && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Source: {source}
                                    </p>
                                )}
                            </div>
                        )}

                        {showShare && (
                            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-primary-200 dark:border-primary-800">
                                <Button
                                    size="sm"
                                    onClick={handleTweet}
                                    className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
                                >
                                    <Twitter className="w-4 h-4 mr-2" />
                                    Tweet This
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCopy}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy Quote
                                        </>
                                    )}
                                </Button>
                                {navigator.share && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
