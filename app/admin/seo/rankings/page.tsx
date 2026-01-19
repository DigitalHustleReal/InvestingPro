"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { 
    TrendingUp, 
    TrendingDown, 
    Minus, 
    Search, 
    BarChart3,
    RefreshCw,
    Plus,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface KeywordRanking {
    keyword: string;
    currentPosition: number | null;
    previousPosition: number | null;
    change: number | null;
    trend: 'up' | 'down' | 'stable' | 'new' | 'lost';
    lastTracked: string;
}

export default function SEORankingsPage() {
    const [newKeyword, setNewKeyword] = useState('');
    const queryClient = useQueryClient();

    // Fetch all tracked keywords
    const { data: keywordsData, isLoading, refetch } = useQuery<{
        success: boolean;
        keywords: KeywordRanking[];
        totalTracked: number;
    }>({
        queryKey: ['seo-rankings'],
        queryFn: async () => {
            const response = await fetch('/api/seo/track');
            if (!response.ok) throw new Error('Failed to fetch rankings');
            return response.json();
        },
        refetchInterval: 60000 // Refetch every minute
    });

    // Add new keyword mutation
    const addKeywordMutation = useMutation({
        mutationFn: async (keyword: string) => {
            const response = await fetch('/api/seo/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword })
            });
            if (!response.ok) throw new Error('Failed to track keyword');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seo-rankings'] });
            setNewKeyword('');
        }
    });

    const handleAddKeyword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newKeyword.trim()) {
            addKeywordMutation.mutate(newKeyword.trim());
        }
    };

    const keywords = keywordsData?.keywords || [];
    const upKeywords = keywords.filter(k => k.trend === 'up');
    const downKeywords = keywords.filter(k => k.trend === 'down');
    const newKeywords = keywords.filter(k => k.trend === 'new');
    const lostKeywords = keywords.filter(k => k.trend === 'lost');

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-4 h-4 text-green-500" />;
            case 'down':
                return <TrendingDown className="w-4 h-4 text-red-500" />;
            case 'new':
                return <Plus className="w-4 h-4 text-blue-500" />;
            case 'lost':
                return <AlertCircle className="w-4 h-4 text-orange-500" />;
            default:
                return <Minus className="w-4 h-4 text-muted-foreground/70 dark:text-muted-foreground/70" />;
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'up':
                return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'down':
                return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'new':
                return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'lost':
                return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            default:
                return 'text-muted-foreground/70 dark:text-muted-foreground/70 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-foreground dark:text-foreground">SEO Rankings Dashboard</h1>
                        <p className="text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground mt-1">
                            Track keyword rankings and monitor SEO performance
                        </p>
                    </div>
                    <Button
                        onClick={() => refetch()}
                        variant="outline"
                        size="sm"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tracked</CardTitle>
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{keywords.length}</div>
                            <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">Keywords being tracked</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ranking Up</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{upKeywords.length}</div>
                            <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">Improved positions</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ranking Down</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{downKeywords.length}</div>
                            <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">Dropped positions</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Rankings</CardTitle>
                            <Plus className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{newKeywords.length}</div>
                            <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">Entered top 100</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Add Keyword Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Add Keyword to Track</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddKeyword} className="flex gap-4">
                            <Input
                                placeholder="Enter keyword to track (e.g., 'best credit cards india')"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                type="submit"
                                disabled={addKeywordMutation.isPending || !newKeyword.trim()}
                            >
                                {addKeywordMutation.isPending ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Plus className="w-4 h-4 mr-2" />
                                )}
                                Add Keyword
                            </Button>
                        </form>
                        <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-2">
                            Keywords are tracked daily. Rankings require SerpApi or Google Search Console API.
                        </p>
                    </CardContent>
                </Card>

                {/* Keywords Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Keyword Rankings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-12">
                                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary-600" />
                                <p className="mt-4 text-muted-foreground/50 dark:text-muted-foreground/50 dark:text-muted-foreground dark:text-muted-foreground">Loading rankings...</p>
                            </div>
                        ) : keywords.length === 0 ? (
                            <div className="text-center py-12">
                                <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
                                <p className="text-muted-foreground/70 dark:text-muted-foreground/70">No keywords tracked yet</p>
                                <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">
                                    Add keywords above to start tracking rankings
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-800">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-foreground/80 dark:text-foreground/80">Keyword</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700 dark:text-foreground/80 dark:text-foreground/80">Position</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700 dark:text-foreground/80 dark:text-foreground/80">Change</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700 dark:text-foreground/80 dark:text-foreground/80">Trend</th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-foreground/80 dark:text-foreground/80">Last Tracked</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {keywords.map((kw, idx) => (
                                            <tr
                                                key={kw.keyword}
                                                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-surface-darker/50 dark:bg-surface-darker/50 transition-colors"
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="font-medium text-slate-900 dark:text-foreground dark:text-foreground">
                                                        {kw.keyword}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {kw.currentPosition !== null ? (
                                                        <span className="font-bold text-lg">
                                                            #{kw.currentPosition}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground dark:text-muted-foreground text-sm">Not in top 100</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {kw.change !== null ? (
                                                        <span className={cn(
                                                            "font-semibold",
                                                            kw.change > 0 ? "text-green-600" : kw.change < 0 ? "text-red-600" : "text-muted-foreground/70 dark:text-muted-foreground/70"
                                                        )}>
                                                            {kw.change > 0 ? '+' : ''}{kw.change}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground dark:text-muted-foreground text-sm">—</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <Badge className={cn("border", getTrendColor(kw.trend))}>
                                                        <span className="flex items-center gap-1">
                                                            {getTrendIcon(kw.trend)}
                                                            {kw.trend.toUpperCase()}
                                                        </span>
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4 text-right text-sm text-muted-foreground/70 dark:text-muted-foreground/70">
                                                    {new Date(kw.lastTracked).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
