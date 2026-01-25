"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RelatedArticle {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    category: string;
    featured_image?: string;
    published_date?: string;
    read_time?: number;
    relevanceScore: number;
    matchReason: string[];
}

interface RelatedArticlesProps {
    articleId: string;
    category?: string;
    variant?: 'sidebar' | 'grid' | 'list';
    limit?: number;
    title?: string;
    className?: string;
}

export default function RelatedArticles({
    articleId,
    category,
    variant = 'sidebar',
    limit = 5,
    title = 'Related Reading',
    className
}: RelatedArticlesProps) {
    const [articles, setArticles] = useState<RelatedArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRelated() {
            try {
                const params = new URLSearchParams({
                    articleId,
                    limit: String(limit),
                });
                if (category) params.set('category', category);

                const response = await fetch(`/api/articles/related?${params}`);
                const data = await response.json();
                
                if (data.articles) {
                    setArticles(data.articles);
                }
            } catch (error) {
                console.error('Failed to fetch related articles', error);
            } finally {
                setLoading(false);
            }
        }
        fetchRelated();
    }, [articleId, category, limit]);

    if (loading) {
        return (
            <div className={cn("space-y-3", className)}>
                <h3 className="font-bold text-lg">{title}</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (articles.length === 0) return null;

    // Sidebar variant (compact list)
    if (variant === 'sidebar') {
        return (
            <div className={cn("space-y-4", className)}>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary-500" />
                    {title}
                </h3>
                <div className="space-y-3">
                    {articles.map((article) => (
                        <Link key={article.id} href={`/articles/${article.slug}`}>
                            <div className="group p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-primary-600 line-clamp-2 mb-1">
                                    {article.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                        {article.category.replace(/-/g, ' ')}
                                    </Badge>
                                    {article.read_time && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {article.read_time} min
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    // Grid variant
    if (variant === 'grid') {
        return (
            <div className={cn("space-y-6", className)}>
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        {title}
                    </h3>
                    <Link href="/articles" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <Link key={article.id} href={`/articles/${article.slug}`}>
                            <Card className="h-full hover:shadow-lg transition-shadow group">
                                {article.featured_image && (
                                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                                        <img
                                            src={article.featured_image}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                <CardContent className="p-4">
                                    <Badge variant="outline" className="text-xs mb-2">
                                        {article.category.replace(/-/g, ' ')}
                                    </Badge>
                                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 line-clamp-2 mb-2">
                                        {article.title}
                                    </h4>
                                    {article.excerpt && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                                            {article.excerpt}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        {article.read_time && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {article.read_time} min read
                                            </span>
                                        )}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    // List variant
    return (
        <div className={cn("space-y-4", className)}>
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">{title}</h3>
            <div className="space-y-3">
                {articles.map((article) => (
                    <Link key={article.id} href={`/articles/${article.slug}`}>
                        <div className="group flex gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            {article.featured_image && (
                                <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0">
                                    <img
                                        src={article.featured_image}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 line-clamp-1 mb-1">
                                    {article.title}
                                </h4>
                                {article.excerpt && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 mb-2">
                                        {article.excerpt}
                                    </p>
                                )}
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <Badge variant="outline" className="text-[10px]">
                                        {article.category.replace(/-/g, ' ')}
                                    </Badge>
                                    {article.matchReason.length > 0 && (
                                        <span className="text-primary-600">{article.matchReason[0]}</span>
                                    )}
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-400 shrink-0 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
