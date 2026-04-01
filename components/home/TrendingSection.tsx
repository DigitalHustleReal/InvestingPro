"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';

interface TrendingItem {
    id: string;
    title: string;
    description: string;
    category: string;
    impact: 'high' | 'medium' | 'low';
    actionUrl: string;
    actionText: string;
    urgency?: string;
    icon?: string;
}

// Mock trending data - Replace with real API call later
const mockTrendingItems: TrendingItem[] = [
    {
        id: '1',
        title: 'Home Loan Checkup: Fixed vs Floating EMIs',
        description: 'Understand how a small change in interest rates can affect your EMI and total repayment over time.',
        category: 'Loans',
        impact: 'high',
        actionUrl: '/loans/home-loan',
        actionText: 'Compare Home Loans',
        urgency: undefined,
        icon: '📰'
    },
    {
        id: '2',
        title: 'Simple Guide to Tax-Saving Investments',
        description: 'Walk through Section 80C basics and see how ELSS, PPF, and EPF fit into your plan.',
        category: 'Taxes',
        impact: 'high',
        actionUrl: '/calculators/tax',
        actionText: 'Estimate Your Tax',
        urgency: undefined,
        icon: '📈'
    },
    {
        id: '3',
        title: 'Cashback vs Rewards: Which Card Fits You?',
        description: 'Learn the trade-offs between flat cashback and points, and when each makes sense.',
        category: 'Credit Cards',
        impact: 'medium',
        actionUrl: '/credit-cards',
        actionText: 'Compare Cards',
        urgency: undefined,
        icon: '💳'
    }
];

export default function TrendingSection() {
    // TODO: Replace with real API call
    // const { data: trendingItems = [] } = useQuery({
    //     queryKey: ['trending-insights'],
    //     queryFn: async () => {
    //         const response = await fetch('/api/trends?category=personal-finance&limit=3');
    //         if (!response.ok) return mockTrendingItems;
    //         return response.json();
    //     },
    //     staleTime: 3600000, // 1 hour
    // });

    const trendingItems = mockTrendingItems;

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'high':
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
            case 'medium':
                return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            default:
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
        }
    };

    return (
        <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 border-y border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                Trending This Week
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-600">
                                Market insights that impact your finances
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className="border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20">
                        <Sparkles className="w-3 h-3 mr-1.5" />
                        Editor&apos;s Picks
                    </Badge>
                </div>

                {/* Trending Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {trendingItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Impact Badge */}
                            <div className="absolute top-4 right-4">
                                <Badge className={getImpactColor(item.impact)}>
                                    {item.impact === 'high' ? 'High Impact' : item.impact === 'medium' ? 'Medium Impact' : 'Low Impact'}
                                </Badge>
                            </div>

                            {/* Icon */}
                            <div className="text-3xl mb-4">{item.icon || '📊'}</div>

                            {/* Category */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                                    {item.category}
                                </span>
                                {item.urgency && (
                                    <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                                        <Clock className="w-3 h-3" />
                                        {item.urgency}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                {item.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                {item.description}
                            </p>

                            {/* CTA */}
                            <Link href={item.actionUrl}>
                                <Button 
                                    variant="outline" 
                                    className="w-full border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 group/btn"
                                >
                                    {item.actionText}
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* View All Link */}
                <div className="mt-8 text-center">
                    <Link 
                        href="/blog" 
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                        View all market insights
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
