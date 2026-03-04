"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    TrendingUp,
    Shield,
    CreditCard,
    Wallet,
    PiggyBank,
    Building2,
    Calculator,
    FileText,
    ArrowRight,
    Zap,
    CheckCircle2,
    Star,
    BarChart3,
    Target,
    Sparkles
} from "lucide-react";
import Link from "next/link";

const categoryCards = [
    { id: 'credit-cards', label: 'Credit Cards', icon: CreditCard, color: 'primary', count: '150+' },
    { id: 'loans', label: 'Loans', icon: Wallet, color: 'primary', count: '200+' },
    { id: 'investing', label: 'Investing', icon: TrendingUp, color: 'primary', count: '800+' },
    { id: 'insurance', label: 'Insurance', icon: Shield, color: 'primary', count: '120+' },
    { id: 'banking', label: 'Banking', icon: PiggyBank, color: 'primary', count: '60+' },
    { id: 'ipo', label: 'IPOs', icon: BarChart3, color: 'primary', count: 'Live' },
];

const trustBadges = [
    { icon: CheckCircle2, text: 'Independent Research', color: 'emerald' },
    { icon: Shield, text: 'Data Security', color: 'primary' },
    { icon: Sparkles, text: 'AI-Powered', color: 'primary' },
];

export default function AnimatedHero() {
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Background Decor - Premium Ambient Lighting */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary-300/20 dark:bg-primary-500/20 rounded-full blur-[140px] translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-secondary-300/20 dark:bg-secondary-600/20 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 animate-pulse-slow" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/3 left-1/2 w-[600px] h-[600px] bg-secondary-300/10 dark:bg-secondary-500/10 rounded-full blur-[100px] -translate-x-1/2 animate-float" />
                
                {/* Grain texture overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-5" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Top Badge */}
                <div className="flex justify-center mb-8 animate-fade-in-up">
                    <Badge className="px-4 py-2 bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 border-2 border-primary-100 dark:border-primary-500/20 font-bold uppercase tracking-wide text-xs inline-flex items-center gap-2 rounded-full shadow-lg shadow-primary-500/10">
                        <Zap className="w-4 h-4" />
                        India's #1 Financial Comparison Platform
                    </Badge>
                </div>

                {/* Main Headline */}
                <div className="text-center mb-12 max-w-5xl mx-auto">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                        Make Better Financial
                        <br />
                        Decisions with{' '}
                        <span className="bg-gradient-to-r from-primary-500 via-success-500 to-cyan-500 bg-clip-text text-transparent">
                            Data-Driven Insights
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                        Compare <strong className="font-bold text-slate-900 dark:text-white">10,000+</strong> financial products. 
                        Get institutional-grade analysis. <strong className="font-bold text-slate-900 dark:text-white">100% free</strong>, forever.
                    </p>
                </div>

                {/* Search Bar - Premium Design */}
                <div className="max-w-3xl mx-auto mb-16">
                    <form onSubmit={handleSearch} className="relative group">
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-secondary-500 rounded-xl opacity-20 dark:opacity-30 group-hover:opacity-40 dark:group-hover:opacity-50 blur-xl transition duration-500" />
                        
                        <div className="relative bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl">
                            <div className="flex items-center p-2">
                                <div className="pl-4 pr-3">
                                    <Search className="w-5 h-5 text-primary-700 dark:text-primary-500" />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Search credit cards, loans, mutual funds..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 border-0 bg-transparent text-lg text-slate-900 dark:text-white placeholder:text-slate-600 focus:ring-0 h-16"
                                />
                                <Button
                                    type="submit"
                                    className="h-14 px-10 bg-gradient-to-r from-primary-700 to-success-700 hover:from-primary-800 hover:to-success-800 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all mr-1"
                                >
                                    Search
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </div>

                        {/* Trust badges under search */}
                        <div className="flex items-center justify-center gap-6 mt-4">
                            {trustBadges.map((badge, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-600 text-sm">
                                    <badge.icon className={`w-4 h-4 text-${badge.color}-500`} />
                                    <span className="font-medium">{badge.text}</span>
                                </div>
                            ))}
                        </div>
                    </form>
                </div>

                {/* Category Grid - Interactive Cards */}
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            Explore Financial Products
                        </h2>
                        <p className="text-slate-600 dark:text-slate-600">
                            Click any category to start comparing
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categoryCards.map((category) => {
                            const Icon = category.icon;
                            const isHovered = hoveredCategory === category.id;

                            return (
                                <Link 
                                    href={`/${category.id}`} 
                                    key={category.id}
                                    onMouseEnter={() => setHoveredCategory(category.id)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                >
                                    <Card className={`
                                        group h-full cursor-pointer transition-all duration-300
                                        bg-white dark:bg-slate-900 
                                        border-2 border-slate-200 dark:border-slate-800
                                        hover:border-primary-500 dark:hover:border-primary-500
                                        hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/20
                                        ${isHovered ? 'scale-105' : ''}
                                    `}>
                                        <CardContent className="p-6 text-center">
                                            {/* Icon with animated background */}
                                            <div className="relative mb-4">
                                                {/* Animated glow on hover */}
                                                <div className={`
                                                    absolute inset-0 bg-gradient-to-br from-${category.color}-400 to-${category.color}-600 
                                                    rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300
                                                `} />
                                                
                                                <div className={`
                                                    relative w-14 h-14 mx-auto rounded-xl 
                                                    bg-slate-100 dark:bg-slate-800 
                                                    group-hover:bg-gradient-to-br group-hover:from-${category.color}-500 group-hover:to-${category.color}-600
                                                    flex items-center justify-center
                                                    transition-all duration-300
                                                `}>
                                                    <Icon className={`
                                                        w-7 h-7 
                                                        text-slate-600 dark:text-slate-600
                                                        group-hover:text-white
                                                        transition-colors duration-300
                                                    `} />
                                                </div>
                                            </div>

                                            {/* Label */}
                                            <div className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                {category.label}
                                            </div>

                                            {/* Count Badge */}
                                            <div className={`
                                                text-xs font-semibold
                                                text-${category.color}-600 dark:text-${category.color}-400
                                            `}>
                                                {category.count} Products
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="max-w-4xl mx-auto mt-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {(() => {
                            const { getDisplayStats } = require('@/lib/platform-stats');
                            const { AnimatedCounter } = require('@/components/common/AnimatedCounter');
                            const stats = getDisplayStats();
                            
                            const displayStats = [
                                { ...stats.productsAnalyzed, icon: Target, animated: true },
                                { ...stats.monthlyUsers, icon: TrendingUp, animated: true },
                                { ...stats.averageRating, icon: Star, display: `${stats.averageRating.display}/5`, animated: true, decimals: 1 },
                                { ...stats.moneySaved, icon: Sparkles, animated: false }, // Too large to animate smoothly
                            ];
                            
                            return displayStats.map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <div 
                                        key={i} 
                                        className="p-6 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800"
                                    >
                                        <Icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                                            {stat.animated && stat.value ? (
                                                <AnimatedCounter 
                                                    end={stat.value} 
                                                    duration={2000}
                                                    decimals={stat.decimals || 0}
                                                />
                                            ) : (
                                                stat.display
                                            )}
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-slate-600 font-medium">
                                            {stat.label}
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            </div>

            {/* Custom animations */}
            <style jsx global>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.05); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translate(-50%, 0); }
                    50% { transform: translate(-50%, -20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out;
                }
            `}</style>
        </section>
    );
}
