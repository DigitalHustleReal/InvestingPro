"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, TrendingUp, PiggyBank, Shield, CreditCard, Calculator, Building2 } from "lucide-react";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";

interface EditorialArticle {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    category?: string;
    last_reviewed_at?: string;
    published_date?: string;
    type?: string;
    status?: string;
    editorial_featured?: boolean;
}

const categoryIcons: Record<string, React.ElementType> = {
    'investing': TrendingUp,
    'mutual-funds': TrendingUp,
    'stocks': TrendingUp,
    'banking': PiggyBank,
    'loans': Building2,
    'insurance': Shield,
    'credit-cards': CreditCard,
    'tools': Calculator,
    'calculators': Calculator,
    'tax-planning': Calculator,
};

const categoryLabels: Record<string, string> = {
    'investing': 'Investing',
    'mutual-funds': 'Investing',
    'stocks': 'Investing',
    'banking': 'Banking',
    'loans': 'Loans',
    'insurance': 'Insurance',
    'credit-cards': 'Credit Cards',
    'tools': 'Tools',
    'calculators': 'Tools',
    'tax-planning': 'Tax Planning',
};

export default function EditorialArticles() {
    const [articles, setArticles] = useState<EditorialArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEditorialArticles();
    }, []);

    const loadEditorialArticles = async () => {
        try {
            // Fetch all articles and filter client-side for flexibility
            // This allows us to handle varying database schemas
            let fetchedArticles = await api.entities.Article.list();

            // Filter for published articles
            const publishedArticles = fetchedArticles.filter((article: any) => 
                article.status === 'published'
            );

            // Filter for editorial featured articles (guide, explainer, policy-explainer types)
            const editorialTypes = ['guide', 'explainer', 'policy-explainer'];
            
            const featuredArticles = publishedArticles
                .filter((article: any) => {
                    // Priority 1: If editorial_featured field exists and is true, include it
                    if (article.editorial_featured === true) {
                        return true;
                    }
                    
                    // Priority 2: If type field exists, check if it's in editorial types
                    if (article.type) {
                        const normalizedType = article.type.toLowerCase().trim();
                        return editorialTypes.includes(normalizedType);
                    }
                    
                    // If neither field exists, exclude (fail-safe: hide section)
                    return false;
                })
                .map((article: any) => ({
                    id: article.id,
                    title: article.title,
                    slug: article.slug,
                    excerpt: article.excerpt || '',
                    category: article.category || '',
                    last_reviewed_at: article.last_reviewed_at || article.updated_at || article.published_date,
                    published_date: article.published_date,
                    type: article.type,
                    status: article.status,
                    editorial_featured: article.editorial_featured,
                }))
                // Sort by last_reviewed_at DESC (most recently reviewed first)
                .sort((a, b) => {
                    const dateA = a.last_reviewed_at ? new Date(a.last_reviewed_at).getTime() : 0;
                    const dateB = b.last_reviewed_at ? new Date(b.last_reviewed_at).getTime() : 0;
                    return dateB - dateA;
                })
                // Limit to 3 articles
                .slice(0, 3);

            setArticles(featuredArticles);
        } catch (error) {
            logger.error('Error loading editorial articles', error as Error);
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    // Hide section if no articles
    if (loading || articles.length === 0) {
        return null;
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Recently reviewed';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
            });
        } catch {
            return 'Recently reviewed';
        }
    };

    const getCategoryIcon = (category?: string) => {
        if (!category) return TrendingUp;
        const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
        return categoryIcons[normalizedCategory] || TrendingUp;
    };

    const getCategoryLabel = (category?: string) => {
        if (!category) return 'Editorial';
        const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
        return categoryLabels[normalizedCategory] || category;
    };

    return (
        <section className="bg-slate-50 py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        From the InvestingPro Editorial Team
                    </h2>
                    <p className="text-lg text-slate-600">
                        Expert insights and guides to help you make informed financial decisions.
                    </p>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => {
                        const IconComponent = getCategoryIcon(article.category);
                        const categoryLabel = getCategoryLabel(article.category);

                        return (
                            <Link
                                key={article.id}
                                href={`/article/${article.slug}`}
                                className="group"
                            >
                                <Card className="h-full border-slate-200 hover:border-slate-300 transition-colors shadow-sm hover:shadow-md">
                                    <CardContent className="p-6 flex flex-col h-full">
                                        {/* Category Label & Icon */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                                                <IconComponent className="w-4 h-4 text-slate-600 group-hover:text-teal-600" />
                                            </div>
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                                {categoryLabel}
                                            </span>
                                        </div>

                                        {/* Headline */}
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
                                            {article.title}
                                        </h3>

                                        {/* Summary */}
                                        {article.excerpt && (
                                            <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
                                                {article.excerpt}
                                            </p>
                                        )}

                                        {/* Last Reviewed Date */}
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto pt-4 border-t border-slate-100">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Last reviewed: {formatDate(article.last_reviewed_at)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

