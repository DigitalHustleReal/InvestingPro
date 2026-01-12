"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ChevronRight, ExternalLink, Calendar } from "lucide-react";
import Link from 'next/link';

interface NewsItem {
    id: string;
    title: string;
    source: string;
    date: string;
    tags: string[];
    url: string;
}

interface ContextualNewsWidgetProps {
    category: 'credit_card' | 'loans' | 'investing' | 'general';
    title?: string;
}

// Mock News Data - In real app, this would come from API based on category
const MOCK_NEWS: Record<string, NewsItem[]> = {
    credit_card: [
        { id: '1', title: "HDFC Bank Devalues Regalia Gold Rewards: Here's What Changed", source: "CardExpert", date: "2h ago", tags: ["HDFC", "Devaluation"], url: "#" },
        { id: '2', title: "SBI Card Launches New 'Sprint' Application Process for Instant Approvals", source: "LiveMint", date: "5h ago", tags: ["SBI", "Launch"], url: "#" },
        { id: '3', title: "Best Lifetime Free Credit Cards for Airport Lounge Access in 2024", source: "InvestingPro", date: "1d ago", tags: ["Guide", "Travel"], url: "#" },
    ],
    loans: [
        { id: '4', title: "RBI Keeps Repo Rate Unchanged at 6.5%: What It Means for Home Loans", source: "Economic Times", date: "3h ago", tags: ["RBI", "Home Loan"], url: "#" },
        { id: '5', title: "Top 5 Banks Offering Lowest Personal Loan Interest Rates This Month", source: "MoneyControl", date: "6h ago", tags: ["Personal Loan", "Rates"], url: "#" },
    ],
    investing: [
        { id: '6', title: "Gold Prices Hit All-Time High Amid Geopolitical Tensions", source: "CNBC", date: "1h ago", tags: ["Commodities", "Gold"], url: "#" },
        { id: '7', title: "Small Cap Funds See Record Inflows in March: AMFI Data", source: "ValueResearch", date: "4h ago", tags: ["Mutual Funds", "Market"], url: "#" },
    ],
    general: [
        { id: '8', title: "Sensex Crosses 75,000 Mark for the First Time History", source: "BSE", date: "Just Now", tags: ["Market", "Sensex"], url: "#" },
        { id: '9', title: "Income Tax Filing Deadline Extended? Fact Check", source: "TaxGuru", date: "2d ago", tags: ["Tax", "Regulatory"], url: "#" },
    ]
};

export default function ContextualNewsWidget({ category, title }: ContextualNewsWidgetProps) {
    const news = MOCK_NEWS[category] || MOCK_NEWS['general'];
    const displayTitle = title || "Latest Updates";

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
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {news.map((item) => (
                        <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <Link href={item.url} className="block">
                                <div className="flex gap-2 mb-2">
                                    {item.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <h4 className="font-semibold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-primary-600 transition-colors">
                                    {item.title}
                                </h4>
                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.source}</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {item.date}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-xs text-center text-slate-500">
                        Curated for {category.replace('_', ' ')} enthusiasts
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
