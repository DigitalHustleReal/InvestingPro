/**
 * Advanced Engagement Hooks
 * 
 * Tracks user engagement and triggers actions at milestones:
 * - Scroll depth (25%, 50%, 75%, 100%)
 * - Time on page
 * - Exit intent
 * - Reading completion
 */

"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { X, Mail, Calculator, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface EngagementHookProps {
    /**
     * Article ID for tracking
     */
    articleId?: string;
    
    /**
     * Article category
     */
    category?: string;
    
    /**
     * Article read time (minutes)
     */
    readTime?: number;
    
    /**
     * Target element to track (default: article content)
     */
    targetSelector?: string;
    
    /**
     * Enable scroll tracking
     */
    enableScrollTracking?: boolean;
    
    /**
     * Enable time tracking
     */
    enableTimeTracking?: boolean;
    
    /**
     * Enable exit intent detection
     */
    enableExitIntent?: boolean;
    
    /**
     * Custom className
     */
    className?: string;
}

interface EngagementState {
    scrollDepth: number;
    timeOnPage: number;
    milestones: Set<number>; // Scroll milestones reached (25, 50, 75, 100)
    hasShownNewsletter: boolean;
    hasShownCalculator: boolean;
    hasShownRelated: boolean;
}

/**
 * Engagement Hooks Component
 * 
 * Tracks user engagement and shows contextual prompts
 */
export default function EngagementHooks({
    articleId,
    category,
    readTime = 5,
    targetSelector = 'article, .prose, [data-content]',
    enableScrollTracking = true,
    enableTimeTracking = true,
    enableExitIntent = true,
    className
}: EngagementHookProps) {
    const pathname = usePathname();
    const [state, setState] = useState<EngagementState>({
        scrollDepth: 0,
        timeOnPage: 0,
        milestones: new Set(),
        hasShownNewsletter: false,
        hasShownCalculator: false,
        hasShownRelated: false
    });
    
    const [showNewsletterPrompt, setShowNewsletterPrompt] = useState(false);
    const [showCalculatorPrompt, setShowCalculatorPrompt] = useState(false);
    const [showExitIntent, setShowExitIntent] = useState(false);

    // Track scroll depth
    useEffect(() => {
        if (!enableScrollTracking) return;

        const handleScroll = () => {
            const target = document.querySelector(targetSelector);
            if (!target) return;

            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const targetTop = target.getBoundingClientRect().top + scrollTop;
            const targetHeight = target.scrollHeight;

            const elementScrollTop = Math.max(0, scrollTop - targetTop);
            const elementScrollBottom = Math.min(targetHeight, scrollTop + windowHeight - targetTop);
            const scrolled = elementScrollBottom - elementScrollTop;
            
            const scrollDepth = targetHeight > 0 
                ? Math.min(100, Math.max(0, (scrolled / targetHeight) * 100))
                : 0;

            setState(prev => {
                const newMilestones = new Set(prev.milestones);
                const milestones = [25, 50, 75, 100];
                
                milestones.forEach(milestone => {
                    if (scrollDepth >= milestone && !newMilestones.has(milestone)) {
                        newMilestones.add(milestone);
                        
                        // Track milestone
                        if (typeof window !== 'undefined' && (window as any).gtag) {
                            (window as any).gtag('event', 'scroll_milestone', {
                                milestone: milestone,
                                article_id: articleId,
                                category: category
                            });
                        }
                    }
                });

                return {
                    ...prev,
                    scrollDepth,
                    milestones: newMilestones
                };
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial calculation

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [enableScrollTracking, targetSelector, articleId, category]);

    // Track time on page
    useEffect(() => {
        if (!enableTimeTracking) return;

        const interval = setInterval(() => {
            setState(prev => {
                const newTime = prev.timeOnPage + 1;
                
                // Show newsletter prompt after 30 seconds
                if (newTime === 30 && !prev.hasShownNewsletter) {
                    setShowNewsletterPrompt(true);
                    return { ...prev, timeOnPage: newTime, hasShownNewsletter: true };
                }
                
                return { ...prev, timeOnPage: newTime };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [enableTimeTracking]);

    // Show calculator prompt at 50% scroll
    useEffect(() => {
        if (state.milestones.has(50) && !state.hasShownCalculator && category) {
            // Only show for relevant categories
            const calculatorCategories = ['mutual-funds', 'loans', 'tax', 'credit-cards'];
            if (calculatorCategories.includes(category)) {
                setShowCalculatorPrompt(true);
                setState(prev => ({ ...prev, hasShownCalculator: true }));
            }
        }
    }, [state.milestones, state.hasShownCalculator, category]);

    // Exit intent detection
    useEffect(() => {
        if (!enableExitIntent) return;

        const handleMouseLeave = (e: MouseEvent) => {
            // Only trigger if mouse is moving towards top of screen
            if (e.clientY <= 0) {
                setShowExitIntent(true);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [enableExitIntent]);

    // Track engagement events
    useEffect(() => {
        if (!articleId) return;

        // Track page view
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'article_view', {
                article_id: articleId,
                category: category,
                read_time: readTime
            });
        }
    }, [articleId, category, readTime]);

    const getCalculatorUrl = () => {
        if (!category) return '/calculators';
        
        const calculatorMap: Record<string, string> = {
            'mutual-funds': '/calculators#sip',
            'loans': '/calculators#emi',
            'tax': '/calculators#tax',
            'credit-cards': '/calculators#credit-score'
        };
        
        return calculatorMap[category] || '/calculators';
    };

    return (
        <>
            {/* Newsletter Prompt (Time-based) */}
            {showNewsletterPrompt && (
                <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300 max-w-sm">
                    <Card className="border-primary-200 dark:border-primary-800 shadow-xl">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-primary-600" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                                        Get Weekly Financial Insights
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                        Join 10,000+ readers getting expert financial tips every week.
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" className="flex-1">
                                            Subscribe Free
                                        </Button>
                                        <button
                                            onClick={() => setShowNewsletterPrompt(false)}
                                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                                        >
                                            <X className="w-4 h-4 text-slate-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Calculator Prompt (Scroll-based) */}
            {showCalculatorPrompt && (
                <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-2 duration-300 max-w-sm">
                    <Card className="border-secondary-200 dark:border-secondary-800 shadow-xl bg-gradient-to-br from-secondary-50 to-white dark:from-secondary-900/20 dark:to-slate-900">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-secondary-500/10 flex items-center justify-center">
                                        <Calculator className="w-5 h-5 text-secondary-600" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                                        Calculate Your {category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Options
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                        Use our free calculator to see your personalized results.
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            size="sm" 
                                            variant="default"
                                            className="flex-1 bg-secondary-600 hover:bg-secondary-700"
                                            asChild
                                        >
                                            <a href={getCalculatorUrl()}>
                                                Open Calculator
                                            </a>
                                        </Button>
                                        <button
                                            onClick={() => setShowCalculatorPrompt(false)}
                                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                                        >
                                            <X className="w-4 h-4 text-slate-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Exit Intent Prompt */}
            {showExitIntent && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <Card className="max-w-md w-full border-primary-200 dark:border-primary-800 shadow-2xl">
                        <CardContent className="p-6">
                            <div className="text-center mb-4">
                                <BookOpen className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    Before You Go...
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                    Save this article for later or explore related content.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button 
                                    variant="default"
                                    className="w-full"
                                    onClick={() => {
                                        // Bookmark functionality
                                        setShowExitIntent(false);
                                    }}
                                >
                                    Save for Later
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        // Show related articles
                                        setShowExitIntent(false);
                                    }}
                                >
                                    Read Related Articles
                                </Button>
                                <button
                                    onClick={() => setShowExitIntent(false)}
                                    className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mt-2"
                                >
                                    Continue Reading
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}

/**
 * Hook to track engagement metrics
 */
export function useEngagementTracking(articleId?: string) {
    const [metrics, setMetrics] = useState({
        scrollDepth: 0,
        timeOnPage: 0,
        milestones: new Set<number>()
    });

    useEffect(() => {
        if (!articleId) return;

        const startTime = Date.now();

        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            const scrollDepth = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;

            setMetrics(prev => {
                const newMilestones = new Set(prev.milestones);
                [25, 50, 75, 100].forEach(milestone => {
                    if (scrollDepth >= milestone && !newMilestones.has(milestone)) {
                        newMilestones.add(milestone);
                    }
                });

                return {
                    ...prev,
                    scrollDepth,
                    milestones: newMilestones
                };
            });
        };

        const interval = setInterval(() => {
            const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
            setMetrics(prev => ({ ...prev, timeOnPage }));
        }, 1000);

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            clearInterval(interval);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [articleId]);

    return metrics;
}
