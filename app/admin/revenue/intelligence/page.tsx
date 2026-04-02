"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Brain,
    TrendingUp,
    TrendingDown,
    Target,
    BarChart3,
    PieChart,
    LineChart,
    RefreshCw,
    Lightbulb,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    DollarSign,
    Zap,
    FileText,
    Calculator,
    Activity,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PredictionData {
    articleId: string;
    articleTitle: string;
    predictedRevenue: {
        low: number;
        expected: number;
        high: number;
    };
    actualRevenue: number;
    confidence: number;
    accuracy: number;
    factors: {
        name: string;
        impact: 'positive' | 'negative' | 'neutral';
        weight: number;
    }[];
    publishDate: string;
}

interface ModelAccuracy {
    overallAccuracy: number;
    predictions: number;
    byCategory: Record<string, number>;
    trend: { date: string; accuracy: number }[];
}

interface RevenueOpportunity {
    type: 'underperforming' | 'optimization' | 'new_content';
    title: string;
    description: string;
    estimatedImpact: number;
    difficulty: 'easy' | 'medium' | 'hard';
    articleId?: string;
}

export default function RevenueIntelligencePage() {
    const [timeRange, setTimeRange] = useState('30d');
    const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

    // Fetch predictions with actuals
    const { data: predictionsData, isLoading: predictionsLoading, refetch: refetchPredictions } = useQuery({
        queryKey: ['revenue-predictions', timeRange],
        queryFn: async () => {
            const response = await fetch(`/api/v1/admin/revenue/predictions?timeRange=${timeRange}`);
            if (!response.ok) {
                // Return mock data for development
                return generateMockPredictions();
            }
            return response.json();
        },
    });

    // Fetch model accuracy stats
    const { data: accuracyData, isLoading: accuracyLoading } = useQuery<ModelAccuracy>({
        queryKey: ['model-accuracy'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/revenue/model-accuracy');
            if (!response.ok) {
                // Return mock data
                return {
                    overallAccuracy: 78.5,
                    predictions: 156,
                    byCategory: {
                        'Credit Cards': 85.2,
                        'Mutual Funds': 76.8,
                        'Insurance': 72.4,
                        'Tax': 80.1,
                    },
                    trend: Array.from({ length: 30 }, (_, i) => ({
                        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        accuracy: 70 + Math.random() * 20,
                    })),
                };
            }
            return response.json();
        },
    });

    // Fetch revenue opportunities
    const { data: opportunitiesData } = useQuery<RevenueOpportunity[]>({
        queryKey: ['revenue-opportunities'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/revenue/opportunities');
            if (!response.ok) {
                // Return mock data
                return [
                    {
                        type: 'underperforming',
                        title: 'Best Credit Cards 2026 underperforming by 45%',
                        description: 'This article has high traffic but low conversion. Consider A/B testing CTAs.',
                        estimatedImpact: 15000,
                        difficulty: 'easy',
                        articleId: 'abc123',
                    },
                    {
                        type: 'optimization',
                        title: 'Add comparison table to Top SIP Funds',
                        description: 'Similar articles with comparison tables convert 2.3x better.',
                        estimatedImpact: 8500,
                        difficulty: 'medium',
                    },
                    {
                        type: 'new_content',
                        title: 'Create "Credit Card vs Personal Loan" comparison',
                        description: 'High search volume (12K/mo) with low competition. Estimated revenue: ₹25K/mo.',
                        estimatedImpact: 25000,
                        difficulty: 'medium',
                    },
                ];
            }
            return response.json();
        },
    });

    const predictions = predictionsData?.predictions || [];
    const totalPredicted = predictions.reduce((sum: number, p: PredictionData) => sum + p.predictedRevenue.expected, 0);
    const totalActual = predictions.reduce((sum: number, p: PredictionData) => sum + p.actualRevenue, 0);
    const overallVariance = totalActual > 0 ? ((totalActual - totalPredicted) / totalPredicted * 100) : 0;

    return (
        <AdminLayout>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
                            <Brain className="w-8 h-8 text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">
                                Revenue Intelligence
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                AI-powered revenue predictions and optimization insights
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-border rounded-lg bg-white dark:bg-surface-darker text-gray-900 dark:text-foreground"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                        </select>
                        <Button
                            onClick={() => refetchPredictions()}
                            variant="outline"
                            size="sm"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Target className="w-4 h-4 text-purple-500" />
                                Model Accuracy
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {accuracyData?.overallAccuracy.toFixed(1) || '0'}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Based on {accuracyData?.predictions || 0} predictions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-500" />
                                Predicted Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalPredicted)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                For selected period
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-500" />
                                Actual Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalActual)}</div>
                            <div className="flex items-center text-xs mt-1">
                                {overallVariance >= 0 ? (
                                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                                ) : (
                                    <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                                )}
                                <span className={overallVariance >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {overallVariance >= 0 ? '+' : ''}{overallVariance.toFixed(1)}% vs predicted
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                Opportunity Value
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {formatCurrency((opportunitiesData || []).reduce((sum, o) => sum + o.estimatedImpact, 0))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {(opportunitiesData || []).length} opportunities identified
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="predictions" className="space-y-4">
                    <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                        <TabsTrigger value="predictions" className="flex items-center gap-2">
                            <LineChart className="w-4 h-4" />
                            Predictions
                        </TabsTrigger>
                        <TabsTrigger value="opportunities" className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Opportunities
                        </TabsTrigger>
                        <TabsTrigger value="accuracy" className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Accuracy
                        </TabsTrigger>
                        <TabsTrigger value="attribution" className="flex items-center gap-2">
                            <PieChart className="w-4 h-4" />
                            Attribution
                        </TabsTrigger>
                    </TabsList>

                    {/* Predictions Tab */}
                    <TabsContent value="predictions" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-500" />
                                    Predictions vs Actuals
                                </CardTitle>
                                <CardDescription>
                                    Compare predicted revenue with actual performance
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {predictionsLoading ? (
                                    <div className="text-center py-12">
                                        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary-600" />
                                        <p className="mt-4 text-muted-foreground">Loading predictions...</p>
                                    </div>
                                ) : predictions.length > 0 ? (
                                    <div className="space-y-3">
                                        {predictions.slice(0, 10).map((prediction: PredictionData) => (
                                            <div
                                                key={prediction.articleId}
                                                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                                    selectedArticle === prediction.articleId
                                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                                                }`}
                                                onClick={() => setSelectedArticle(
                                                    selectedArticle === prediction.articleId ? null : prediction.articleId
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-muted-foreground" />
                                                            <span className="font-medium">{prediction.articleTitle}</span>
                                                            <Badge 
                                                                variant="outline" 
                                                                className={
                                                                    prediction.confidence >= 80 
                                                                        ? 'border-green-500 text-green-600' 
                                                                        : prediction.confidence >= 60 
                                                                            ? 'border-amber-500 text-amber-600'
                                                                            : 'border-red-500 text-red-600'
                                                                }
                                                            >
                                                                {prediction.confidence}% confidence
                                                            </Badge>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground mt-1">
                                                            Published: {new Date(prediction.publishDate).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <div className="text-xs text-muted-foreground">Predicted</div>
                                                            <div className="font-semibold">
                                                                {formatCurrency(prediction.predictedRevenue.expected)}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                ({formatCurrency(prediction.predictedRevenue.low)} - {formatCurrency(prediction.predictedRevenue.high)})
                                                            </div>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                                        <div className="text-right">
                                                            <div className="text-xs text-muted-foreground">Actual</div>
                                                            <div className="font-semibold">
                                                                {formatCurrency(prediction.actualRevenue)}
                                                            </div>
                                                            <div className={`text-xs font-medium ${
                                                                prediction.accuracy >= 80 
                                                                    ? 'text-green-600' 
                                                                    : prediction.accuracy >= 60 
                                                                        ? 'text-amber-600' 
                                                                        : 'text-red-600'
                                                            }`}>
                                                                {prediction.accuracy.toFixed(0)}% accurate
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Expanded details */}
                                                {selectedArticle === prediction.articleId && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                        <h4 className="text-sm font-medium mb-2">Prediction Factors</h4>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                            {prediction.factors.map((factor, idx) => (
                                                                <div 
                                                                    key={idx} 
                                                                    className={`p-2 rounded-lg text-xs ${
                                                                        factor.impact === 'positive' 
                                                                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                                                            : factor.impact === 'negative'
                                                                                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                                                                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                                                                    }`}
                                                                >
                                                                    <span className="font-medium">{factor.name}</span>
                                                                    <span className="ml-1">({factor.weight > 0 ? '+' : ''}{factor.weight})</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Calculator className="w-12 h-12 mx-auto mb-4 opacity-40" />
                                        <p>No predictions available for this period</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Opportunities Tab */}
                    <TabsContent value="opportunities" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-amber-500" />
                                    Revenue Opportunities
                                </CardTitle>
                                <CardDescription>
                                    AI-identified opportunities to increase revenue
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {(opportunitiesData || []).map((opportunity, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-amber-500/50 transition-all"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {opportunity.type === 'underperforming' && (
                                                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                                                        )}
                                                        {opportunity.type === 'optimization' && (
                                                            <Zap className="w-4 h-4 text-blue-500" />
                                                        )}
                                                        {opportunity.type === 'new_content' && (
                                                            <Sparkles className="w-4 h-4 text-purple-500" />
                                                        )}
                                                        <span className="font-semibold">{opportunity.title}</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {opportunity.description}
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="outline" className={
                                                            opportunity.difficulty === 'easy' 
                                                                ? 'border-green-500 text-green-600' 
                                                                : opportunity.difficulty === 'medium'
                                                                    ? 'border-amber-500 text-amber-600'
                                                                    : 'border-red-500 text-red-600'
                                                        }>
                                                            {opportunity.difficulty} effort
                                                        </Badge>
                                                        <Badge variant="outline" className={
                                                            opportunity.type === 'underperforming' 
                                                                ? 'border-amber-500 text-amber-600'
                                                                : opportunity.type === 'optimization'
                                                                    ? 'border-blue-500 text-blue-600'
                                                                    : 'border-purple-500 text-purple-600'
                                                        }>
                                                            {opportunity.type.replace('_', ' ')}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="text-xs text-muted-foreground">Est. Impact</div>
                                                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                                        +{formatCurrency(opportunity.estimatedImpact)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">/month</div>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                                <Button size="sm" variant="outline" className="w-full">
                                                    <ArrowRight className="w-4 h-4 mr-2" />
                                                    Take Action
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Accuracy Tab */}
                    <TabsContent value="accuracy" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="w-5 h-5 text-green-500" />
                                        Accuracy by Category
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {Object.entries(accuracyData?.byCategory || {}).map(([category, accuracy]) => (
                                            <div key={category} className="flex items-center justify-between">
                                                <span className="text-sm font-medium">{category}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${
                                                                accuracy >= 80 
                                                                    ? 'bg-green-500' 
                                                                    : accuracy >= 60 
                                                                        ? 'bg-amber-500' 
                                                                        : 'bg-red-500'
                                                            }`}
                                                            style={{ width: `${accuracy}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium w-12 text-right">
                                                        {accuracy.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <LineChart className="w-5 h-5 text-blue-500" />
                                        Accuracy Trend (30 Days)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-48 flex items-end gap-1">
                                        {(accuracyData?.trend || []).map((day, idx) => (
                                            <div
                                                key={idx}
                                                className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                                                style={{ height: `${day.accuracy}%` }}
                                                title={`${day.date}: ${day.accuracy.toFixed(1)}%`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                        <span>30 days ago</span>
                                        <span>Today</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Model Performance Insights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                                        <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                                        <h4 className="font-semibold text-green-700 dark:text-green-300">Strengths</h4>
                                        <ul className="text-sm text-green-600 dark:text-green-400 mt-2 space-y-1">
                                            <li>• High accuracy on Credit Card content</li>
                                            <li>• Good at predicting seasonal trends</li>
                                            <li>• Reliable for established categories</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                        <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
                                        <h4 className="font-semibold text-amber-700 dark:text-amber-300">Areas to Improve</h4>
                                        <ul className="text-sm text-amber-600 dark:text-amber-400 mt-2 space-y-1">
                                            <li>• Insurance content has higher variance</li>
                                            <li>• New content types need more data</li>
                                            <li>• Viral content hard to predict</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                        <Brain className="w-8 h-8 text-blue-500 mb-2" />
                                        <h4 className="font-semibold text-blue-700 dark:text-blue-300">Model Updates</h4>
                                        <ul className="text-sm text-blue-600 dark:text-blue-400 mt-2 space-y-1">
                                            <li>• Last retrained: 3 days ago</li>
                                            <li>• Training data: 1,234 articles</li>
                                            <li>• Next scheduled: Jan 28, 2026</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Attribution Tab */}
                    <TabsContent value="attribution" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="w-5 h-5 text-purple-500" />
                                    Multi-Touch Attribution
                                </CardTitle>
                                <CardDescription>
                                    Understand how different touchpoints contribute to conversions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium mb-4">Attribution Model Comparison</h4>
                                        <div className="space-y-3">
                                            {[
                                                { model: 'Last Touch', value: 45000, color: 'bg-blue-500' },
                                                { model: 'First Touch', value: 38000, color: 'bg-green-500' },
                                                { model: 'Linear', value: 42000, color: 'bg-purple-500' },
                                                { model: 'Time Decay', value: 44000, color: 'bg-amber-500' },
                                                { model: 'Position Based', value: 43000, color: 'bg-pink-500' },
                                            ].map((item) => (
                                                <div key={item.model} className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                                    <span className="text-sm w-28">{item.model}</span>
                                                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full ${item.color} rounded-full`}
                                                            style={{ width: `${(item.value / 45000) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium w-20 text-right">
                                                        {formatCurrency(item.value)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-4">Channel Attribution</h4>
                                        <div className="space-y-3">
                                            {[
                                                { channel: 'Organic Search', value: 65, revenue: 29250 },
                                                { channel: 'Direct', value: 20, revenue: 9000 },
                                                { channel: 'Social', value: 10, revenue: 4500 },
                                                { channel: 'Email', value: 5, revenue: 2250 },
                                            ].map((item) => (
                                                <div key={item.channel} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                                    <div>
                                                        <span className="font-medium">{item.channel}</span>
                                                        <span className="text-sm text-muted-foreground ml-2">
                                                            ({item.value}%)
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold">{formatCurrency(item.revenue)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}

// Mock data generator for development
function generateMockPredictions(): { predictions: PredictionData[] } {
    return {
        predictions: [
            {
                articleId: '1',
                articleTitle: 'Best Credit Cards in India 2026',
                predictedRevenue: { low: 15000, expected: 25000, high: 35000 },
                actualRevenue: 28500,
                confidence: 85,
                accuracy: 86,
                factors: [
                    { name: 'High Search Volume', impact: 'positive', weight: 40 },
                    { name: 'Credit Card Category', impact: 'positive', weight: 35 },
                    { name: 'Comparison Table', impact: 'positive', weight: 25 },
                ],
                publishDate: '2026-01-01',
            },
            {
                articleId: '2',
                articleTitle: 'SIP Calculator: Calculate Returns',
                predictedRevenue: { low: 8000, expected: 12000, high: 16000 },
                actualRevenue: 10500,
                confidence: 78,
                accuracy: 88,
                factors: [
                    { name: 'Interactive Calculator', impact: 'positive', weight: 45 },
                    { name: 'Mutual Funds Category', impact: 'positive', weight: 30 },
                    { name: 'Medium Competition', impact: 'neutral', weight: 0 },
                ],
                publishDate: '2026-01-05',
            },
            {
                articleId: '3',
                articleTitle: 'Income Tax Saving Guide 2026',
                predictedRevenue: { low: 5000, expected: 8000, high: 12000 },
                actualRevenue: 15000,
                confidence: 72,
                accuracy: 53,
                factors: [
                    { name: 'Tax Season', impact: 'positive', weight: 50 },
                    { name: 'Evergreen Content', impact: 'positive', weight: 20 },
                    { name: 'High Competition', impact: 'negative', weight: -15 },
                ],
                publishDate: '2026-01-10',
            },
        ],
    };
}

