"use client";

import React from 'react';
import Link from 'next/link';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Calendar, TrendingUp, Sparkles } from "lucide-react";

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    category?: string;
    featured_image?: string;
    published_at?: string;
    read_time?: number;
    author_name?: string;
}

export default function LatestInsights() {
    const { data, isLoading } = useQuery({
        queryKey: ['home-latest-insights'],
        queryFn: async () => {
            const response = await fetch('/api/articles/public?limit=4');
            if (!response.ok) throw new Error('Failed to fetch');
            return response.json();
        },
        staleTime: 120000, // Cache for 2 minutes
    });

    const articles: Article[] = data?.articles || [];
    const [featuredArticle, ...sideArticles] = articles;

    // Loading skeleton
    if (isLoading) {
        return (
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-8 w-64 bg-slate-200 rounded animate-pulse mb-12" />
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="h-[400px] bg-slate-200 rounded-3xl animate-pulse" />
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Don't render if no articles
    if (!articles.length) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('en-IN', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });
        } catch {
            return '';
        }
    };

    const formatCategory = (category?: string) => {
        if (!category) return 'Insights';
        return category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Latest Insights</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                            Knowledge That<br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500">Empowers Growth</span>
                        </h2>
                    </div>
                    <Link 
                        href="/blog" 
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                        Browse All Articles
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Featured Article - Left Side */}
                    {featuredArticle && (
                        <Link href={`/article/${featuredArticle.slug}`} className="group">
                            <Card className="h-full overflow-hidden bg-white border-0 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 rounded-3xl">
                                {/* Image container */}
                                <div className="relative h-56 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-600" />
                                    {featuredArticle.featured_image && (
                                        <img 
                                            src={featuredArticle.featured_image} 
                                            alt=""
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-0 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                            {formatCategory(featuredArticle.category)}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-teal-600 transition-colors leading-tight">
                                        {featuredArticle.title}
                                    </h3>
                                    <p className="text-slate-700 mb-6 line-clamp-3 leading-relaxed">
                                        {featuredArticle.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-slate-600">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(featuredArticle.published_at)}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {featuredArticle.read_time || 5} min read
                                            </span>
                                        </div>
                                        <span className="text-teal-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {/* Side Articles - Right Side */}
                    <div className="flex flex-col gap-4">
                        {sideArticles.slice(0, 3).map((article, index) => (
                            <Link key={article.id} href={`/article/${article.slug}`} className="group">
                                <Card className="overflow-hidden bg-white border-slate-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300 rounded-2xl">
                                    <CardContent className="p-5 flex gap-5">
                                        {/* Thumbnail */}
                                        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400" />
                                            {article.featured_image && (
                                                <img 
                                                    src={article.featured_image} 
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                            {/* Number badge for visual interest */}
                                            <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                                                {index + 2}
                                            </div>
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-slate-300 text-slate-600">
                                                    {formatCategory(article.category)}
                                                </Badge>
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {article.read_time || 5} min
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-slate-900 line-clamp-2 group-hover:text-teal-600 transition-colors leading-snug">
                                                {article.title}
                                            </h4>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}

                        {/* View More CTA */}
                        <Link href="/blog" className="group">
                            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-0 rounded-2xl overflow-hidden hover:from-slate-800 hover:to-slate-700 transition-all duration-300">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-bold mb-1">Explore More Insights</p>
                                        <p className="text-slate-400 text-sm">{(data?.total || 200)}+ articles on investing, savings & more</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-teal-500 transition-colors">
                                        <ArrowRight className="w-5 h-5 text-white" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
