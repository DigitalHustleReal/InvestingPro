"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SEOHealthWidget from '@/components/admin/SEOHealthWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Activity, Search, CheckCircle2, AlertTriangle, XCircle, FileText, Loader2, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

interface ArticleSEOSummary {
    id: string;
    title: string;
    slug: string;
    score?: number;
    status?: 'good' | 'warning' | 'error';
}

export default function SEOHealthPage() {
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

    // Fetch articles list
    const { data: articles, isLoading: articlesLoading } = useQuery({
        queryKey: ['articles-for-seo'],
        queryFn: async () => {
            const response = await fetch('/api/admin/articles?status=published&limit=20');
            if (!response.ok) throw new Error('Failed to fetch articles');
            const data = await response.json();
            return data.articles || data || [];
        }
    });

    // Fetch SEO for selected article
    const { data: seoData, isLoading: seoLoading, refetch: refetchSEO } = useQuery({
        queryKey: ['article-seo', selectedArticleId],
        queryFn: async () => {
            if (!selectedArticleId) return null;
            const response = await fetch(`/api/admin/analytics?type=seo&articleId=${selectedArticleId}`);
            if (!response.ok) throw new Error('Failed to fetch SEO data');
            return response.json();
        },
        enabled: !!selectedArticleId
    });

    const getScoreColor = (score?: number) => {
        if (!score) return 'text-slate-500';
        if (score >= 80) return 'text-emerald-400';
        if (score >= 50) return 'text-amber-400';
        return 'text-rose-400';
    };

    const getStatusIcon = (score?: number) => {
        if (!score) return null;
        if (score >= 80) return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
        if (score >= 50) return <AlertTriangle className="w-4 h-4 text-amber-400" />;
        return <XCircle className="w-4 h-4 text-rose-400" />;
    };

    return (
        <AdminLayout>
            <div className="p-8 max-w-[1600px] mx-auto w-full">
                {/* Breadcrumb */}
                <AdminBreadcrumb />
                
                {/* Header */}
                <div className="mb-10 border-b border-white/5 pb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                                    <Activity className="w-6 h-6 text-primary-400" />
                                </div>
                                SEO Health Monitor
                                <Badge className="bg-primary-500/10 text-primary-400 border-primary-500/20 ml-2 font-bold tracking-wider">
                                    BETA
                                </Badge>
                            </h1>
                            <p className="text-slate-400 mt-3 ml-16 font-medium tracking-wide max-w-2xl">
                                Analyze and optimize your content for search engine visibility.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Article List */}
                    <div className="lg:col-span-5">
                        <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                            <CardHeader className="border-b border-white/5 px-6 py-4">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-6 md:p-8">
                                    <FileText className="w-4 h-4" />
                                    Published Articles
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                                {articlesLoading ? (
                                    <div className="p-8 text-center text-slate-500">
                                        <Loader2 className="w-6 h-6 mx-auto animate-spin mb-2" />
                                        Loading articles...
                                    </div>
                                ) : articles && articles.length > 0 ? (
                                    <div className="divide-y divide-white/5">
                                        {articles.map((article: any) => (
                                            <button
                                                key={article.id}
                                                onClick={() => setSelectedArticleId(article.id)}
                                                className={cn(
                                                    "w-full text-left px-6 py-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-4",
                                                    selectedArticleId === article.id && "bg-primary-500/10 border-l-2 border-l-indigo-500"
                                                )}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold text-white line-clamp-1">
                                                        {article.title}
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1">
                                                        /{article.slug}
                                                    </div>
                                                </div>
                                                <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-500">
                                        No published articles found
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* SEO Analysis */}
                    <div className="lg:col-span-7">
                        {selectedArticleId ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                                        Analysis Results
                                    </h3>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => refetchSEO()}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Re-analyze
                                    </Button>
                                </div>
                                <SEOHealthWidget seoData={seoData} isLoading={seoLoading} />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <Search className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-400 mb-2">
                                        Select an Article
                                    </h3>
                                    <p className="text-sm text-slate-500 max-w-xs">
                                        Choose an article from the list to analyze its SEO health score.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
