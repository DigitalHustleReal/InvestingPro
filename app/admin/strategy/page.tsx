"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
    Target, 
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    RefreshCw,
    Zap,
    BarChart3,
    Search,
    ArrowRight,
    Star,
    Clock,
    DollarSign,
    FileText,
    Lightbulb
} from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

interface ContentGap {
    id: string;
    topic: string;
    keyword: string;
    category: string;
    gapType: 'missing' | 'weak' | 'outdated' | 'underserved';
    priority: 'high' | 'medium' | 'low';
    competitorCount: number;
    revenuePotential: 'high' | 'medium' | 'low';
    estimatedMonthlyRevenue?: number;
    recommendation: string;
    suggestedTitle?: string;
}

interface CategoryCoverage {
    category: string;
    yourArticleCount: number;
    estimatedMarketSize: number;
    coveragePercentage: number;
    topMissingTopics: string[];
    growthPotential: 'high' | 'medium' | 'low';
}

interface Opportunity {
    id: string;
    keyword: string;
    topic: string;
    category: string;
    overallScore: number;
    estimatedMonthlyRevenue: number;
    competitionLevel: 'low' | 'medium' | 'high';
    priority: 'urgent' | 'high' | 'medium' | 'low';
    suggestedContentType: string;
}

export default function ContentStrategyPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Fetch overview data
    const { data: overviewData, isLoading: overviewLoading, refetch: refetchOverview } = useQuery({
        queryKey: ['strategy-overview'],
        queryFn: async () => {
            const response = await fetch('/api/admin/strategy/gaps?type=overview&limit=10');
            if (!response.ok) {
                return {
                    success: true,
                    data: {
                        highPriorityGaps: [],
                        categoryCoverage: [],
                        summary: { avgCoverage: 0, highGrowthCategories: [] },
                    },
                };
            }
            return response.json();
        },
        refetchInterval: 60000,
    });

    // Fetch category-specific data
    const { data: categoryData, isLoading: categoryLoading } = useQuery({
        queryKey: ['strategy-category', selectedCategory],
        queryFn: async () => {
            if (selectedCategory === 'all') return null;
            const response = await fetch(`/api/admin/strategy/gaps?type=category&category=${selectedCategory}`);
            if (!response.ok) return null;
            return response.json();
        },
        enabled: selectedCategory !== 'all',
    });

    // Discover opportunities mutation
    const discoverMutation = useMutation({
        mutationFn: async (category: string) => {
            const response = await fetch('/api/admin/strategy/gaps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'discover', category }),
            });
            if (!response.ok) throw new Error('Failed to discover');
            return response.json();
        },
    });

    const gaps: ContentGap[] = overviewData?.data?.highPriorityGaps || [];
    const coverage: CategoryCoverage[] = overviewData?.data?.categoryCoverage || [];
    const summary = overviewData?.data?.summary || {};

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-danger-500/20 text-danger-400 border-danger-500/30';
            case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'medium': return 'bg-warning-500/20 text-warning-400 border-warning-500/30';
            case 'low': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
            default: return 'bg-muted/20 text-muted-foreground border-muted/30';
        }
    };

    const getGapTypeIcon = (type: string) => {
        switch (type) {
            case 'missing': return <AlertTriangle className="w-4 h-4 text-danger-400" />;
            case 'weak': return <TrendingUp className="w-4 h-4 text-warning-400" />;
            case 'outdated': return <Clock className="w-4 h-4 text-orange-400" />;
            case 'underserved': return <BarChart3 className="w-4 h-4 text-primary-400" />;
            default: return null;
        }
    };

    const getCompetitionColor = (level: string) => {
        switch (level) {
            case 'low': return 'text-success-400';
            case 'medium': return 'text-warning-400';
            case 'high': return 'text-danger-400';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 font-sans">
                <AdminBreadcrumb />
                
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 shadow-lg shadow-accent-500/25 flex items-center justify-center">
                            <Target className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                                Content Strategy AI
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Discover gaps and opportunities to grow your content
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => refetchOverview()} variant="outline" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh Analysis
                    </Button>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-primary-500/10 to-primary-600/5 border-primary-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Target className="w-5 h-5 text-primary-400" />
                                <Badge variant="outline" className="text-xs">Coverage</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {overviewLoading ? '...' : `${summary.avgCoverage || 0}%`}
                            </div>
                            <p className="text-xs text-muted-foreground">Average category coverage</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-danger-500/10 to-danger-600/5 border-danger-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <AlertTriangle className="w-5 h-5 text-danger-400" />
                                <Badge variant="outline" className="text-xs">Gaps</Badge>
                            </div>
                            <div className="text-3xl font-bold text-danger-400 mb-1">
                                {overviewLoading ? '...' : gaps.length}
                            </div>
                            <p className="text-xs text-muted-foreground">High-priority gaps found</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-success-500/10 to-success-600/5 border-success-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <TrendingUp className="w-5 h-5 text-success-400" />
                                <Badge variant="outline" className="text-xs">Growth</Badge>
                            </div>
                            <div className="text-3xl font-bold text-success-400 mb-1">
                                {overviewLoading ? '...' : summary.highGrowthCategories?.length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">High-growth categories</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-warning-500/10 to-warning-600/5 border-warning-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <DollarSign className="w-5 h-5 text-warning-400" />
                                <Badge variant="outline" className="text-xs">Revenue</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                ₹{overviewLoading ? '...' : Math.round(
                                    gaps.reduce((sum, g) => sum + (g.estimatedMonthlyRevenue || 0), 0) / 1000
                                )}K
                            </div>
                            <p className="text-xs text-muted-foreground">Potential monthly revenue</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {['all', 'credit-cards', 'mutual-funds', 'loans', 'insurance', 'taxes'].map((cat) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(cat)}
                            className="capitalize"
                        >
                            {cat === 'all' ? 'All Categories' : cat.replace('-', ' ')}
                        </Button>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* High Priority Gaps */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-danger-400" />
                                    High-Priority Content Gaps
                                </div>
                                <Badge variant="outline">{gaps.length} gaps</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {overviewLoading ? (
                                <div className="text-center py-8 text-muted-foreground">Loading...</div>
                            ) : gaps.length === 0 ? (
                                <div className="text-center py-8">
                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-success-400 opacity-50" />
                                    <p className="text-muted-foreground">No critical gaps found!</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                    {gaps.map((gap) => (
                                        <div 
                                            key={gap.id}
                                            className="p-4 bg-muted/10 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {getGapTypeIcon(gap.gapType)}
                                                    <span className="font-medium text-foreground">{gap.topic}</span>
                                                </div>
                                                <Badge className={getPriorityColor(gap.priority)}>
                                                    {gap.priority}
                                                </Badge>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                                <span className="capitalize">{gap.category.replace('-', ' ')}</span>
                                                <span>•</span>
                                                <span className="capitalize">{gap.gapType}</span>
                                                <span>•</span>
                                                <span>{gap.competitorCount} competitors</span>
                                            </div>

                                            <p className="text-sm text-muted-foreground mb-3">
                                                {gap.recommendation}
                                            </p>

                                            {gap.suggestedTitle && (
                                                <div className="p-2 bg-primary-500/10 rounded text-sm">
                                                    <span className="text-muted-foreground">Suggested: </span>
                                                    <span className="text-foreground">{gap.suggestedTitle}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-success-400" />
                                                    <span className="text-sm text-success-400">
                                                        ₹{gap.estimatedMonthlyRevenue?.toLocaleString()}/mo potential
                                                    </span>
                                                </div>
                                                <Button size="sm" variant="outline" className="gap-1">
                                                    Create
                                                    <ArrowRight className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Category Coverage */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary-400" />
                                Category Coverage
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {overviewLoading ? (
                                <div className="text-center py-8 text-muted-foreground">Loading...</div>
                            ) : (
                                <div className="space-y-4">
                                    {coverage.map((cat) => (
                                        <div 
                                            key={cat.category}
                                            className="p-4 bg-muted/10 rounded-lg border border-border/50"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <span className="font-medium text-foreground capitalize">
                                                        {cat.category.replace('-', ' ')}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground ml-2">
                                                        {cat.yourArticleCount} / {cat.estimatedMarketSize} articles
                                                    </span>
                                                </div>
                                                <Badge className={
                                                    cat.growthPotential === 'high' 
                                                        ? 'bg-success-500/20 text-success-400'
                                                        : cat.growthPotential === 'medium'
                                                        ? 'bg-warning-500/20 text-warning-400'
                                                        : 'bg-slate-500/20 text-slate-400'
                                                }>
                                                    {cat.growthPotential} growth
                                                </Badge>
                                            </div>
                                            
                                            {/* Progress bar */}
                                            <div className="h-2 bg-muted/30 rounded-full overflow-hidden mb-3">
                                                <div 
                                                    className={`h-full transition-all ${
                                                        cat.coveragePercentage >= 70 ? 'bg-success-500' :
                                                        cat.coveragePercentage >= 40 ? 'bg-warning-500' :
                                                        'bg-danger-500'
                                                    }`}
                                                    style={{ width: `${Math.min(100, cat.coveragePercentage)}%` }}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    {cat.coveragePercentage}% coverage
                                                </span>
                                                {cat.topMissingTopics.length > 0 && (
                                                    <span className="text-muted-foreground">
                                                        Missing: {cat.topMissingTopics[0]}
                                                        {cat.topMissingTopics.length > 1 && ` +${cat.topMissingTopics.length - 1}`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="bg-card/50 border-border/50 mb-8">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <Zap className="w-5 h-5 text-warning-400" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button 
                                variant="outline" 
                                className="h-auto p-4 flex-col items-start gap-2"
                                onClick={() => discoverMutation.mutate('credit-cards')}
                                disabled={discoverMutation.isPending}
                            >
                                <Search className="w-5 h-5 text-primary-400" />
                                <div className="text-left">
                                    <div className="font-medium">Discover Keywords</div>
                                    <div className="text-xs text-muted-foreground">Find new opportunities</div>
                                </div>
                            </Button>

                            <Button 
                                variant="outline" 
                                className="h-auto p-4 flex-col items-start gap-2"
                            >
                                <FileText className="w-5 h-5 text-success-400" />
                                <div className="text-left">
                                    <div className="font-medium">Generate Content</div>
                                    <div className="text-xs text-muted-foreground">Create from top gap</div>
                                </div>
                            </Button>

                            <Button 
                                variant="outline" 
                                className="h-auto p-4 flex-col items-start gap-2"
                            >
                                <RefreshCw className="w-5 h-5 text-warning-400" />
                                <div className="text-left">
                                    <div className="font-medium">Refresh Analysis</div>
                                    <div className="text-xs text-muted-foreground">Re-analyze all gaps</div>
                                </div>
                            </Button>

                            <Button 
                                variant="outline" 
                                className="h-auto p-4 flex-col items-start gap-2"
                            >
                                <Star className="w-5 h-5 text-accent-400" />
                                <div className="text-left">
                                    <div className="font-medium">View Competitors</div>
                                    <div className="text-xs text-muted-foreground">Competitor analysis</div>
                                </div>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Strategic Recommendations */}
                <Card className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 border-primary-500/20">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-warning-400" />
                            Strategic Recommendations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-background/50 rounded-lg">
                                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-success-500/20 flex items-center justify-center text-success-400 text-sm">1</span>
                                    Focus on Credit Cards
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Highest revenue potential category. Fill 5 high-priority gaps to capture ₹15K+ monthly.
                                </p>
                            </div>

                            <div className="p-4 bg-background/50 rounded-lg">
                                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-warning-500/20 flex items-center justify-center text-warning-400 text-sm">2</span>
                                    Update Stale Content
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Several articles are outdated. Refreshing them can recover lost rankings quickly.
                                </p>
                            </div>

                            <div className="p-4 bg-background/50 rounded-lg">
                                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm">3</span>
                                    Build Topic Clusters
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Create pillar pages for &quot;Best Credit Cards&quot; and &quot;SIP Investment&quot; to dominate search.
                                </p>
                            </div>

                            <div className="p-4 bg-background/50 rounded-lg">
                                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-sm">4</span>
                                    Target Low Competition
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Several quick-win keywords identified with low difficulty. Easy ranking opportunities.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
