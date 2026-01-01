"use client";

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RelatedArticle {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    featured_image?: string;
}

interface RelatedArticlesProps {
    articleId: string;
    className?: string;
}

export default function RelatedArticles({ articleId, className }: RelatedArticlesProps) {
    const { data, isLoading } = useQuery({
        queryKey: ['related-articles', articleId],
        queryFn: async () => {
            const response = await fetch(`/api/search?type=related&articleId=${articleId}&limit=4`);
            if (!response.ok) throw new Error('Failed to fetch related articles');
            return response.json();
        },
        enabled: !!articleId
    });

    const articles: RelatedArticle[] = data?.results || [];

    if (isLoading) {
        return (
            <div className={cn("space-y-4", className)}>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    Related Articles
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (articles.length === 0) {
        return null;
    }

    return (
        <div className={cn("space-y-6", className)}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                You May Also Like
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
                {articles.map((article, index) => (
                    <Link 
                        key={article.id} 
                        href={`/articles/${article.slug}`}
                        className="group"
                    >
                        <Card className="h-full bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-indigo-500/5">
                            <div className="p-5">
                                <div className="flex items-start gap-4">
                                    {article.featured_image ? (
                                        <img 
                                            src={article.featured_image} 
                                            alt={article.title}
                                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-6 h-6 text-indigo-500/50" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <Badge className="mb-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-0 text-[10px] font-bold uppercase tracking-wider">
                                            {article.category?.replace(/-/g, ' ')}
                                        </Badge>
                                        <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {article.title}
                                        </h4>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 flex-1">
                                        {article.excerpt}
                                    </p>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
