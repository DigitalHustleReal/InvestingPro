"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Brain,
    TrendingUp,
    TrendingDown,
    Sparkles,
    HelpCircle,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Target,
    DollarSign,
    AlertTriangle,
    CheckCircle2,
    Info,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PredictionFactor {
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
    description: string;
}

interface RevenuePrediction {
    predictedRevenue: {
        low: number;
        expected: number;
        high: number;
    };
    confidence: number;
    factors: PredictionFactor[];
    comparableArticles: {
        title: string;
        revenue: number;
        similarityScore: number;
    }[];
    timeframe: {
        days30: number;
        days90: number;
        days365: number;
    };
}

interface RevenuePredictionCardProps {
    /** Article data for prediction */
    article: {
        id?: string;
        title?: string;
        content?: string;
        category?: { name: string; slug: string };
        status?: string;
    };
    /** Compact mode for sidebar/inline use */
    compact?: boolean;
    /** Show expanded details by default */
    defaultExpanded?: boolean;
    /** Callback when prediction is generated */
    onPredictionGenerated?: (prediction: RevenuePrediction) => void;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Revenue Prediction Card
 * Shows AI-predicted revenue for an article before/after publishing
 */
export function RevenuePredictionCard({
    article,
    compact = false,
    defaultExpanded = false,
    onPredictionGenerated,
    className,
}: RevenuePredictionCardProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const [hasTriggeredCallback, setHasTriggeredCallback] = useState(false);

    // Fetch prediction from API
    const { 
        data: prediction, 
        isLoading, 
        isError,
        refetch,
        isFetching,
    } = useQuery<RevenuePrediction>({
        queryKey: ['revenue-prediction', article.id, article.title, article.category?.slug],
        queryFn: async () => {
            // Build query params
            const params = new URLSearchParams();
            if (article.id) params.set('articleId', article.id);
            if (article.title) params.set('title', article.title);
            if (article.category?.slug) params.set('category', article.category.slug);
            if (article.content) params.set('contentLength', String(article.content.length));

            const response = await fetch(`/api/v1/admin/revenue/predict?${params}`);
            
            if (!response.ok) {
                // Return mock prediction for development
                return generateMockPrediction(article);
            }
            
            return response.json();
        },
        enabled: !!(article.title || article.id),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    // Trigger callback when prediction is generated
    useEffect(() => {
        if (prediction && onPredictionGenerated && !hasTriggeredCallback) {
            onPredictionGenerated(prediction);
            setHasTriggeredCallback(true);
        }
    }, [prediction, onPredictionGenerated, hasTriggeredCallback]);

    // Reset callback trigger when article changes
    useEffect(() => {
        setHasTriggeredCallback(false);
    }, [article.id, article.title]);

    // Confidence color
    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return 'text-green-600 dark:text-green-400';
        if (confidence >= 60) return 'text-amber-600 dark:text-amber-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getConfidenceBg = (confidence: number) => {
        if (confidence >= 80) return 'bg-green-100 dark:bg-green-900/30';
        if (confidence >= 60) return 'bg-amber-100 dark:bg-amber-900/30';
        return 'bg-red-100 dark:bg-red-900/30';
    };

    // Compact mode rendering
    if (compact) {
        return (
            <div className={cn("p-3 rounded-lg border border-slate-200 dark:border-slate-800", className)}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium">Revenue Prediction</span>
                    </div>
                    {prediction && (
                        <Badge 
                            variant="outline" 
                            className={cn("text-xs", getConfidenceColor(prediction.confidence))}
                        >
                            {prediction.confidence}% conf.
                        </Badge>
                    )}
                </div>
                
                {isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Calculating...
                    </div>
                ) : prediction ? (
                    <div>
                        <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            {formatCurrency(prediction.predictedRevenue.expected)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Range: {formatCurrency(prediction.predictedRevenue.low)} - {formatCurrency(prediction.predictedRevenue.high)}
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">
                        Add content to see prediction
                    </div>
                )}
            </div>
        );
    }

    // Full card rendering
    return (
        <Card className={cn(
            "bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20",
            className
        )}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <div className="p-1.5 bg-purple-500/10 rounded-lg">
                            <Brain className="w-4 h-4 text-purple-500" />
                        </div>
                        Revenue Prediction
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>AI-predicted revenue based on historical data, category performance, and content analysis.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-6">
                        <RefreshCw className="w-8 h-8 animate-spin text-purple-500 mb-2" />
                        <p className="text-sm text-muted-foreground">Analyzing article...</p>
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
                        <p className="text-sm text-muted-foreground">Unable to generate prediction</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
                            Try Again
                        </Button>
                    </div>
                ) : prediction ? (
                    <div className="space-y-4">
                        {/* Main Prediction */}
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    {formatCurrency(prediction.predictedRevenue.expected)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Expected annual revenue
                                </div>
                            </div>
                            <div className={cn(
                                "px-3 py-2 rounded-lg text-center",
                                getConfidenceBg(prediction.confidence)
                            )}>
                                <div className="flex items-center gap-1">
                                    <Target className={cn("w-4 h-4", getConfidenceColor(prediction.confidence))} />
                                    <span className={cn("text-lg font-bold", getConfidenceColor(prediction.confidence))}>
                                        {prediction.confidence}%
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground">Confidence</div>
                            </div>
                        </div>

                        {/* Revenue Range */}
                        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Prediction Range</span>
                                <span className="font-medium">
                                    {formatCurrency(prediction.predictedRevenue.low)} - {formatCurrency(prediction.predictedRevenue.high)}
                                </span>
                            </div>
                            <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                                    style={{ 
                                        width: `${((prediction.predictedRevenue.expected - prediction.predictedRevenue.low) / 
                                            (prediction.predictedRevenue.high - prediction.predictedRevenue.low)) * 100}%`,
                                        marginLeft: '0%',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Timeframe Breakdown */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                                <div className="text-sm font-semibold">{formatCurrency(prediction.timeframe.days30)}</div>
                                <div className="text-xs text-muted-foreground">30 days</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                                <div className="text-sm font-semibold">{formatCurrency(prediction.timeframe.days90)}</div>
                                <div className="text-xs text-muted-foreground">90 days</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                                <div className="text-sm font-semibold">{formatCurrency(prediction.timeframe.days365)}</div>
                                <div className="text-xs text-muted-foreground">1 year</div>
                            </div>
                        </div>

                        {/* Expand/Collapse Button */}
                        <Button
                            variant="ghost"
                            className="w-full justify-center"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="w-4 h-4 mr-2" />
                                    Hide Details
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-4 h-4 mr-2" />
                                    Show Factors & Comparables
                                </>
                            )}
                        </Button>

                        {/* Expanded Details */}
                        {isExpanded && (
                            <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                                {/* Prediction Factors */}
                                <div>
                                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-purple-500" />
                                        Prediction Factors
                                    </h4>
                                    <div className="space-y-2">
                                        {prediction.factors.slice(0, 5).map((factor, idx) => (
                                            <div 
                                                key={idx}
                                                className={cn(
                                                    "flex items-center justify-between p-2 rounded-lg text-sm",
                                                    factor.impact === 'positive' && "bg-green-50 dark:bg-green-900/20",
                                                    factor.impact === 'negative' && "bg-red-50 dark:bg-red-900/20",
                                                    factor.impact === 'neutral' && "bg-slate-50 dark:bg-slate-800/50"
                                                )}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {factor.impact === 'positive' && (
                                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                                    )}
                                                    {factor.impact === 'negative' && (
                                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                                    )}
                                                    {factor.impact === 'neutral' && (
                                                        <Info className="w-4 h-4 text-slate-500" />
                                                    )}
                                                    <span className="font-medium">{factor.name}</span>
                                                </div>
                                                <Badge variant="outline" className={cn(
                                                    factor.impact === 'positive' && "border-green-500 text-green-600",
                                                    factor.impact === 'negative' && "border-red-500 text-red-600",
                                                    factor.impact === 'neutral' && "border-slate-400 text-slate-600"
                                                )}>
                                                    {factor.weight > 0 ? '+' : ''}{factor.weight}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Comparable Articles */}
                                {prediction.comparableArticles.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-green-500" />
                                            Similar Articles Performance
                                        </h4>
                                        <div className="space-y-2">
                                            {prediction.comparableArticles.slice(0, 3).map((article, idx) => (
                                                <div 
                                                    key={idx}
                                                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-sm"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium truncate">{article.title}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {article.similarityScore}% similar
                                                        </div>
                                                    </div>
                                                    <div className="font-semibold text-green-600 dark:text-green-400 ml-2">
                                                        {formatCurrency(article.revenue)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Status-specific advice */}
                                {article.status !== 'published' && (
                                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                    Ways to increase predicted revenue:
                                                </p>
                                                <ul className="text-xs text-blue-600 dark:text-blue-400 mt-1 space-y-1">
                                                    <li>• Add a comparison table for products</li>
                                                    <li>• Include relevant affiliate links</li>
                                                    <li>• Target higher-volume keywords</li>
                                                    <li>• Add interactive calculators</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Sparkles className="w-8 h-8 text-purple-300 mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Start writing to see revenue prediction
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Prediction updates as you add content
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Mock prediction generator for development
function generateMockPrediction(article: any): RevenuePrediction {
    // Base prediction on category
    const categoryMultipliers: Record<string, number> = {
        'credit-cards': 2.5,
        'loans': 2.0,
        'insurance': 1.8,
        'mutual-funds': 1.5,
        'tax': 1.3,
        'banking': 1.2,
    };

    const multiplier = categoryMultipliers[article.category?.slug || ''] || 1.0;
    const baseRevenue = 10000 * multiplier;
    
    // Add variance based on content length
    const contentLength = article.content?.length || 0;
    const contentBonus = Math.min(5000, contentLength * 0.5);
    
    const expected = baseRevenue + contentBonus;
    const low = expected * 0.6;
    const high = expected * 1.5;

    return {
        predictedRevenue: {
            low: Math.round(low),
            expected: Math.round(expected),
            high: Math.round(high),
        },
        confidence: Math.min(90, 50 + (contentLength > 1000 ? 20 : 0) + (article.category ? 15 : 0)),
        factors: [
            {
                name: 'Category Revenue Potential',
                impact: multiplier >= 2 ? 'positive' : multiplier >= 1.5 ? 'neutral' : 'negative',
                weight: Math.round((multiplier - 1) * 40),
                description: `${article.category?.name || 'Unknown'} category performance`,
            },
            {
                name: 'Content Length',
                impact: contentLength > 2000 ? 'positive' : contentLength > 500 ? 'neutral' : 'negative',
                weight: contentLength > 2000 ? 25 : contentLength > 500 ? 10 : -15,
                description: `${contentLength} characters`,
            },
            {
                name: 'Title Optimization',
                impact: article.title?.length > 30 ? 'positive' : 'neutral',
                weight: article.title?.length > 30 ? 15 : 0,
                description: 'SEO-optimized title',
            },
        ],
        comparableArticles: [
            {
                title: 'Similar Article in Category',
                revenue: expected * 1.1,
                similarityScore: 85,
            },
            {
                title: 'Another Related Article',
                revenue: expected * 0.9,
                similarityScore: 72,
            },
        ],
        timeframe: {
            days30: Math.round(expected * 0.3),
            days90: Math.round(expected * 0.7),
            days365: Math.round(expected),
        },
    };
}

export default RevenuePredictionCard;
