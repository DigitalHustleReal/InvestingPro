/**
 * Quote Selector Hook & Component
 * 
 * Enables text selection → "Tweet This" menu appears
 * Provides quote selection functionality for any content
 */

"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Twitter, Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getSocialColor } from '@/lib/utils/theme-colors';

export interface QuoteSelectorProps {
    /**
     * Target element selector (default: article content)
     */
    targetSelector?: string;
    
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
     * Enable quote selection
     */
    enabled?: boolean;
    
    /**
     * Custom className
     */
    className?: string;
}

interface SelectionPosition {
    top: number;
    left: number;
    width: number;
}

/**
 * Quote Selector Component
 * 
 * Adds text selection → tweet functionality to any content
 */
export default function QuoteSelector({
    targetSelector = 'article, .prose, [data-content]',
    articleUrl,
    articleTitle,
    category,
    enabled = true,
    className
}: QuoteSelectorProps) {
    const [selectedText, setSelectedText] = useState<string>('');
    const [position, setPosition] = useState<SelectionPosition | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!enabled) return;

        const handleSelection = () => {
            const selection = window.getSelection();
            
            if (!selection || selection.isCollapsed) {
                setShowMenu(false);
                setSelectedText('');
                return;
            }

            const text = selection.toString().trim();
            
            // Only show menu for meaningful selections (at least 20 characters)
            if (text.length < 20) {
                setShowMenu(false);
                setSelectedText('');
                return;
            }

            setSelectedText(text);
            
            // Get selection position
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            setPosition({
                top: rect.bottom + window.scrollY + 10,
                left: rect.left + window.scrollX + (rect.width / 2),
                width: rect.width
            });
            
            setShowMenu(true);
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                const selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                }
                setShowMenu(false);
                setSelectedText('');
            }
        };

        // Listen for text selection
        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('selectionchange', handleSelection);
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('selectionchange', handleSelection);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [enabled]);

    const generateTweetUrl = (text: string): string => {
        const maxLength = 280;
        let tweetText = text;
        
        if (articleTitle && articleUrl) {
            const attribution = ` — ${articleTitle}`;
            const url = ` ${articleUrl}`;
            const hashtags = category ? ` #${category.replace(/-/g, '')} #InvestingPro` : ' #InvestingPro';
            
            const totalLength = tweetText.length + attribution.length + url.length + hashtags.length;
            
            if (totalLength <= maxLength) {
                tweetText = `${tweetText}${attribution}${url}${hashtags}`;
            } else {
                const availableSpace = maxLength - attribution.length - url.length - hashtags.length - 10;
                if (availableSpace > 50) {
                    tweetText = `${tweetText.substring(0, availableSpace)}...${attribution}${url}${hashtags}`;
                } else {
                    tweetText = `${tweetText.substring(0, maxLength - url.length - hashtags.length - 10)}...${url}${hashtags}`;
                }
            }
        } else {
            const hashtags = category ? ` #${category.replace(/-/g, '')} #InvestingPro` : ' #InvestingPro';
            if (tweetText.length + hashtags.length <= maxLength) {
                tweetText = `${tweetText}${hashtags}`;
            }
        }
        
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    };

    const handleTweet = () => {
        const tweetUrl = generateTweetUrl(selectedText);
        window.open(tweetUrl, '_blank', 'width=550,height=420');
        
        // Clear selection
        window.getSelection()?.removeAllRanges();
        setShowMenu(false);
        setSelectedText('');
        
        // Track event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'quote_tweet_selection', {
                quote_length: selectedText.length,
                category: category,
                article_url: articleUrl
            });
        }
        
        toast.success('Opening Twitter...');
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(selectedText);
            toast.success('Quote copied to clipboard!');
            
            // Clear selection
            window.getSelection()?.removeAllRanges();
            setShowMenu(false);
            setSelectedText('');
        } catch (error) {
            toast.error('Failed to copy quote');
        }
    };

    const handleClose = () => {
        window.getSelection()?.removeAllRanges();
        setShowMenu(false);
        setSelectedText('');
    };

    if (!showMenu || !position || !selectedText) {
        return null;
    }

    return (
        <div
            ref={menuRef}
            className={cn(
                "fixed z-50 animate-in fade-in slide-in-from-top-2 duration-200",
                className
            )}
            style={{
                top: `${position.top}px`,
                left: `${Math.max(10, position.left - 100)}px`,
                transform: 'translateX(-50%)'
            }}
        >
            <Card className="shadow-xl border-2 border-primary-200 dark:border-primary-800 bg-white dark:bg-slate-900">
                <div className="p-3 flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Selected Quote:</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
                            "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>
                <div className="px-3 pb-3 flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 pt-3">
                                    <Button
                                        size="sm"
                                        onClick={handleTweet}
                                        style={{ 
                                            backgroundColor: getSocialColor('twitter'),
                                            color: 'white'
                                        }}
                                        className="hover:opacity-90 transition-opacity flex-1"
                                    >
                        <Twitter className="w-4 h-4 mr-2" />
                        Tweet This
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopy}
                        className="flex-1"
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                    </Button>
                </div>
            </Card>
        </div>
    );
}

/**
 * Hook to enable quote selection on a specific element
 */
export function useQuoteSelector(
    targetElement: HTMLElement | null,
    options?: {
        articleUrl?: string;
        articleTitle?: string;
        category?: string;
    }
) {
    const [selectedText, setSelectedText] = useState<string>('');

    useEffect(() => {
        if (!targetElement) return;

        const handleSelection = () => {
            const selection = window.getSelection();
            if (selection && !selection.isCollapsed) {
                const text = selection.toString().trim();
                if (text.length >= 20) {
                    setSelectedText(text);
                } else {
                    setSelectedText('');
                }
            } else {
                setSelectedText('');
            }
        };

        targetElement.addEventListener('mouseup', handleSelection);
        targetElement.addEventListener('selectionchange', handleSelection);

        return () => {
            targetElement.removeEventListener('mouseup', handleSelection);
            targetElement.removeEventListener('selectionchange', handleSelection);
        };
    }, [targetElement]);

    return selectedText;
}
