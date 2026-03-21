"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ChevronRight, Calendar, Loader2 } from "lucide-react";
import Link from 'next/link';
import { apiClient as api } from '@/lib/api-client';
import { createClient } from '@/lib/supabase/client';

interface NewsItem {
    id: string;
    title: string;
    source: string;
    timestamp: string;
    tags: string[];
    url: string;
}

interface ContextualNewsWidgetProps {
    category: 'credit_card' | 'loans' | 'investing' | 'general';
    title?: string;
}

export default function ContextualNewsWidget({ category, title }: ContextualNewsWidgetProps) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const displayTitle = title || "Latest Updates";

    useEffect(() => {
        const fetchNews = async () => {
             try {
                 // Fetch real articles from Supabase
                 const articles = await api.entities.Article.list('-created_at', 5);
                 
                 // Map to UI format
                 if (articles && articles.length > 0) {
                     const newsItems = articles.map((a: any) => ({
                         id: a.id,
                         title: a.title,
                         url: `/news/${a.slug}`,
                         timestamp: new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                         source: a.author || 'InvestingPro',
                         tags: a.tags || ['Market']
                     }));
                     setNews(newsItems);
                 } else {
                     // Fallback to static mock if DB is empty (graceful degradation)
                     setNews(MOCK_FALLBACK[category] || MOCK_FALLBACK['general']);
                 }
                 
             } catch (error) {
                 console.error("Failed to fetch news", error);
                 setNews(MOCK_FALLBACK[category] || MOCK_FALLBACK['general']);
             } finally {
                 setLoading(false);
             }
        };
        
        fetchNews();

        // Realtime subscription for fresh news
        const supabase = createClient();
        const channel = supabase
            .channel('public:articles')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'articles' }, (payload) => {
                const newArticle = payload.new as any;
                setNews(prev => [{
                    id: newArticle.id,
                    title: newArticle.title,
                    url: `/news/${newArticle.slug}`,
                    timestamp: 'Just Now',
                    source: newArticle.author || 'InvestingPro',
                    tags: newArticle.tags || ['News']
                }, ...prev.slice(0, 4)]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [category]);

    return (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                    <Newspaper className="w-5 h-5 text-primary-500" />
                    {displayTitle}
                </CardTitle>
                <Link href="/news" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center">
                    View All <ChevronRight className="w-4 h-4" />
                </Link>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="p-8 flex justify-center">
                        <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {news.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <Link href={item.url} className="block">
                                    <div className="flex gap-2 mb-2">
                                        {item.tags?.slice(0, 2).map(tag => (
                                            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-600">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.source}</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {item.timestamp}
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-xs text-center text-slate-500">
                        Real-time updates via Supabase
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

// Fallback Data
const MOCK_FALLBACK: Record<string, NewsItem[]> = {
    general: [
        { id: '1', title: "Sensex Crosses 75,000 Mark for the First Time History", source: "BSE", timestamp: "Just Now", tags: ["Market"], url: "#" },
        { id: '2', title: "Income Tax Filing Deadline Extended? Fact Check", source: "TaxGuru", timestamp: "2d ago", tags: ["Tax"], url: "#" },
    ],
    credit_card: [
        { id: '1', title: "HDFC Bank Devalues Regalia Gold Rewards", source: "CardExpert", timestamp: "2h ago", tags: ["HDFC"], url: "#" },
        { id: '2', title: "SBI Card Launches New 'Sprint' Application", source: "LiveMint", timestamp: "5h ago", tags: ["SBI"], url: "#" },
    ],
    loans: [
        { id: '4', title: "RBI Keeps Repo Rate Unchanged at 6.5%", source: "Economic Times", timestamp: "3h ago", tags: ["RBI"], url: "#" },
    ],
    investing: [
        { id: '6', title: "Gold Prices Hit All-Time High", source: "CNBC", timestamp: "1h ago", tags: ["Commodities"], url: "#" },
    ]
};
