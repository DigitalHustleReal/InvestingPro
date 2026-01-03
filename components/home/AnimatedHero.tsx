"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Shield, CreditCard, Wallet, PiggyBank, Building2, Calculator, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { NAVIGATION_CONFIG } from "@/lib/navigation/config";

interface AnimatedHeroProps {
    selectedCategory?: string | null;
    onCategorySelect?: (category: string | null) => void;
}

// Single brand gradient for all categories (fintech-optimized)
const BRAND_GRADIENT = 'from-teal-600 via-emerald-600 to-cyan-700';

// Category-specific hero configurations
const categoryHeroConfig: Record<string, {
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;  // For badge differentiation
    gradient: string;
    headline: string;
    subheadline: string;
    image: string;
    cta: { label: string; href: string };
    stats: { label: string; value: string }[];
}> = {
    'credit-cards': {
        icon: CreditCard,
        iconColor: 'text-indigo-300',
        gradient: BRAND_GRADIENT,
        headline: 'Find the perfect credit card for your lifestyle',
        subheadline: 'Compare rewards, cashback, and travel benefits from top Indian banks. Get matched in minutes.',
        image: '💳',
        cta: { label: 'Compare Credit Cards', href: '/credit-cards/compare' },
        stats: [
            { label: 'Cards Compared', value: '500+' },
            { label: 'Top Banks', value: '25+' },
            { label: 'Avg Rewards', value: '5%' }
        ]
    },
    'loans': {
        icon: Wallet,
        iconColor: 'text-amber-300',
        gradient: BRAND_GRADIENT,
        headline: 'Get the best loan rates in India',
        subheadline: 'Compare personal, home, car, and business loans with lowest interest rates. Quick approval process.',
        image: '💰',
        cta: { label: 'Compare Loans', href: '/loans/compare' },
        stats: [
            { label: 'Loan Products', value: '1,000+' },
            { label: 'Lowest Rate', value: '8.5%' },
            { label: 'Quick Approval', value: '24hrs' }
        ]
    },
    'banking': {
        icon: PiggyBank,
        iconColor: 'text-blue-300',
        gradient: BRAND_GRADIENT,
        headline: 'Maximize your savings with best interest rates',
        subheadline: 'Compare savings accounts, fixed deposits, and recurring deposits. Find the highest returns.',
        image: '🏦',
        cta: { label: 'Compare Interest Rates', href: '/banking/compare/rates' },
        stats: [
            { label: 'FD Rates', value: 'Up to 9.5%' },
            { label: 'Banks', value: '50+' },
            { label: 'Zero Balance', value: 'Yes' }
        ]
    },
    'investing': {
        icon: TrendingUp,
        iconColor: 'text-emerald-300',
        gradient: BRAND_GRADIENT,
        headline: 'Build wealth with smart investments',
        subheadline: 'Compare mutual funds, stocks, PPF, NPS, and ELSS. Make informed investment decisions.',
        image: '📈',
        cta: { label: 'Compare Investments', href: '/mutual-funds/compare' },
        stats: [
            { label: 'Funds', value: '5,000+' },
            { label: 'Avg Returns', value: '15%' },
            { label: 'Tax Saving', value: 'Yes' }
        ]
    },
    'insurance': {
        icon: Shield,
        iconColor: 'text-rose-300',
        gradient: BRAND_GRADIENT,
        headline: 'Protect what matters most',
        subheadline: 'Compare life, health, term, and vehicle insurance from top insurers. Get comprehensive coverage.',
        image: '🛡️',
        cta: { label: 'Compare Plans', href: '/insurance/compare' },
        stats: [
            { label: 'Plans', value: '2,000+' },
            { label: 'Insurers', value: '30+' },
            { label: 'Coverage', value: '₹1Cr+' }
        ]
    },
    'small-business': {
        icon: Building2,
        iconColor: 'text-violet-300',
        gradient: BRAND_GRADIENT,
        headline: 'Grow your business with the right financial products',
        subheadline: 'Compare business loans, credit cards, and banking solutions. Tools to manage your business finances.',
        image: '🏢',
        cta: { label: 'Business Solutions', href: '/small-business' },
        stats: [
            { label: 'Business Loans', value: '500+' },
            { label: 'GST Tools', value: 'Free' },
            { label: 'Quick Approval', value: 'Yes' }
        ]
    },
    'taxes': {
        icon: Calculator,
        iconColor: 'text-amber-300',
        gradient: BRAND_GRADIENT,
        headline: 'Save more with smart tax planning',
        subheadline: 'Compare tax-saving investments, calculate your tax liability, and file ITR. Maximize your savings.',
        image: '📊',
        cta: { label: 'Tax-Saving Investments', href: '/taxes' },
        stats: [
            { label: 'Tax Savings', value: 'Up to ₹1.5L' },
            { label: '80C Options', value: '10+' },
            { label: 'ITR Filing', value: 'Free' }
        ]
    },
    'personal-finance': {
        icon: FileText,
        iconColor: 'text-slate-300',
        gradient: BRAND_GRADIENT,
        headline: 'Take control of your finances',
        subheadline: 'Plan your budget, manage debt, build emergency fund, and achieve your financial goals.',
        image: '📋',
        cta: { label: 'Financial Planning', href: '/personal-finance' },
        stats: [
            { label: 'Tools', value: '20+' },
            { label: 'Guides', value: '100+' },
            { label: 'Free', value: '100%' }
        ]
    }
};

const defaultHero = {
    icon: TrendingUp,
    iconColor: 'text-white',
    gradient: BRAND_GRADIENT,
    headline: 'Find your perfect financial product in minutes',
    subheadline: 'Compare credit cards, loans, investments, insurance, and banking products from top Indian providers. Make informed decisions with unbiased data.',
    image: '🎯',
    cta: { label: 'Start Comparing', href: '/compare' },
    stats: [
        { label: 'Products', value: '10,000+' },
        { label: 'Users', value: '5,000+' },
        { label: 'Unbiased', value: '100%' }
    ]
};

export default function AnimatedHero({ selectedCategory: propSelectedCategory, onCategorySelect }: AnimatedHeroProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [internalCategory, setInternalCategory] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const selectedCategory = propSelectedCategory !== undefined ? propSelectedCategory : internalCategory;
    const heroConfig = selectedCategory && categoryHeroConfig[selectedCategory] 
        ? categoryHeroConfig[selectedCategory] 
        : defaultHero;
    
    const Icon = heroConfig.icon;
    const categories = NAVIGATION_CONFIG.filter(cat => cat.slug !== 'tools');

    const handleCategorySelect = (categorySlug: string) => {
        if (selectedCategory === categorySlug) {
            // Deselect
            if (onCategorySelect) {
                onCategorySelect(null);
            } else {
                setInternalCategory(null);
            }
        } else {
            // Animate transition
            setIsAnimating(true);
            setTimeout(() => {
                if (onCategorySelect) {
                    onCategorySelect(categorySlug);
                } else {
                    setInternalCategory(categorySlug);
                }
                setIsAnimating(false);
            }, 300);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            if (selectedCategory) {
                window.location.href = `/${selectedCategory}?search=${encodeURIComponent(searchQuery)}`;
            } else {
                window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
            }
        }
    };

    return (
        <section className="relative overflow-hidden">
            {/* Animated Background - Dark Premium */}
            <div className={`absolute inset-0 bg-slate-950 transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.15]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                </div>
                
                {/* Ambient Aurora Glows */}
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
                <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] animate-float"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
                {/* Category Selector */}
                <div className="mb-12">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {categories.map((category) => {
                            const isActive = selectedCategory === category.slug;
                            const categoryConfig = categoryHeroConfig[category.slug];
                            const CategoryIcon = categoryConfig?.icon || TrendingUp;
                            
                            return (
                                <button
                                    key={category.slug}
                                    onClick={() => handleCategorySelect(category.slug)}
                                    className={`group relative px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                                        isActive
                                            ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25 scale-105 z-10'
                                            : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700 hover:border-slate-600 hover:scale-105'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <CategoryIcon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
                                        <span>{category.name}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Hero Content - Animated */}
                <div className={`grid lg:grid-cols-2 gap-16 items-center transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                    {/* Left Column: Content */}
                    <div className="text-white space-y-8 text-center lg:text-left">
                        {/* Headline Group */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mx-auto lg:mx-0">
                                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                                {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : 'Comparing 5000+ Products'}
                            </div>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                                {heroConfig.headline.split(' ').map((word, i) => (
                                    i < 2 ? <span key={i} className="text-white">{word} </span> : 
                                    <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-500">{word} </span>
                                ))}
                            </h1>
                            
                            <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                {heroConfig.subheadline}
                            </p>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto lg:mx-0 group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                            
                            <div className="relative flex items-center bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
                                <Search className="absolute left-4 w-6 h-6 text-slate-500" />
                                <Input
                                    type="text"
                                    placeholder="Search specific cards, banks, or guides..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-14 pl-14 pr-32 bg-transparent text-white placeholder:text-slate-500 border-none focus:ring-0 text-lg"
                                />
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-all"
                                >
                                    Search
                                </Button>
                            </div>
                        </form>

                        {/* Stats - Horizontal */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 lg:gap-12 pt-4 border-t border-white/5">
                            {heroConfig.stats.map((stat, index) => (
                                <div key={index} className="text-center lg:text-left">
                                    <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Visual - Glass comparison */}
                    <div className="hidden lg:block relative perspective-1000">
                        <div className="relative h-[600px] flex items-center justify-center">
                             {/* Central Card Stack */}
                            <div className="relative w-[400px] h-[500px]">
                                {/* Back Card */}
                                <div className="absolute top-0 right-0 w-[400px] h-[500px] bg-slate-800/40 rounded-3xl border border-slate-700/50 transform rotate-6 scale-95 backdrop-blur-sm"></div>
                                {/* Middle Card */}
                                <div className="absolute top-0 right-0 w-[400px] h-[500px] bg-slate-800/80 rounded-3xl border border-slate-600/50 transform rotate-3 scale-[0.98] backdrop-blur-md shadow-2xl"></div>
                                
                                {/* Front Card - Active Interface */}
                                <div className="absolute inset-0 bg-slate-900/90 rounded-3xl border border-slate-600 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                    {/* Mock Header */}
                                    <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-teal-400" />
                                            </div>
                                            <span className="font-semibold text-white">Analysis</span>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    </div>
                                    
                                    {/* Mock Content */}
                                    <div className="p-6 space-y-6">
                                        <div className="space-y-2">
                                            <div className="h-2 w-20 bg-slate-700 rounded-full"></div>
                                            <div className="h-8 w-full bg-slate-800 rounded-lg animate-pulse-slow"></div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800"></div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="h-2 w-24 bg-slate-600 rounded-full"></div>
                                                        <div className="h-2 w-16 bg-slate-700 rounded-full"></div>
                                                    </div>
                                                    <div className="h-6 w-16 bg-teal-500/20 rounded-md border border-teal-500/30"></div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Graph Area */}
                                        <div className="h-32 rounded-xl bg-gradient-to-b from-teal-500/5 to-transparent border border-teal-500/10 relative overflow-hidden">
                                             <div className="absolute inset-x-0 bottom-0 h-20">
                                                 <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-teal-500">
                                                     <path d="M0 20 Q 25 5 50 10 T 100 0 V 20 H 0 Z" fill="currentColor" fillOpacity="0.2" />
                                                     <path d="M0 20 Q 25 5 50 10 T 100 0" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                                 </svg>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating Badges */}
                                <div className="absolute -left-12 top-20 bg-slate-800 p-4 rounded-xl border border-slate-600 shadow-xl animate-float">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl font-bold text-teal-400">98%</div>
                                        <div className="text-xs text-slate-400 font-medium">Match<br/>Score</div>
                                    </div>
                                </div>

                                <div className="absolute -right-8 bottom-32 bg-slate-800 p-4 rounded-xl border border-slate-600 shadow-xl animate-float-delayed">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <div className="text-sm font-semibold text-white">Approved</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add custom animations */}
            <style jsx global>{`
                @keyframes scale-breathe {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                .animate-scale-breathe {
                    animation: scale-breathe 4s ease-in-out infinite;
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    33% { transform: translateY(-20px) translateX(15px); }
                    66% { transform: translateY(15px) translateX(-10px); }
                }
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
                
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    33% { transform: translateY(15px) translateX(-15px); }
                    66% { transform: translateY(-20px) translateX(10px); }
                }
                .animate-float-delayed {
                    animation: float-delayed 10s ease-in-out infinite;
                }
                
                @keyframes slide-up {
                    0% { transform: translateY(30px) translateX(-50%); opacity: 0; }
                    100% { transform: translateY(0) translateX(-50%); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.8s ease-out;
                }
                
                @keyframes slide-in-left {
                    0% { transform: translateX(-30px); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.6s ease-out 0.2s both;
                }
                
                @keyframes slide-in-right {
                    0% { transform: translateX(30px); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.6s ease-out 0.4s both;
                }
            `}</style>
        </section>
    );
}

