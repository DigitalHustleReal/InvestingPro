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

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 lg:min-h-[800px] flex flex-col justify-center">
                
                {/* Global Brand Headline - Separate from widget */}
                <div className="text-center mb-10 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
                        The smartest way to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">compare & grow.</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Join 50,000+ investors making better financial decisions daily.
                    </p>
                </div>

                {/* THE NERDWALLET-STYLE TABBED WIDGET CONTAINER */}
                <div className="w-full max-w-6xl mx-auto">
                    
                    {/* 1. TABS SCROLLER */}
                    <div className="flex overflow-x-auto no-scrollbar pb-0 px-2 lg:px-0 lg:justify-center mb-[-1px] relative z-20">
                        <div className="flex space-x-1 min-w-max">
                            {categories.map((category) => {
                                const isActive = selectedCategory === category.slug;
                                const categoryConfig = categoryHeroConfig[category.slug];
                                const CategoryIcon = categoryConfig?.icon || TrendingUp;
                                
                                return (
                                    <button
                                        key={category.slug}
                                        onClick={() => handleCategorySelect(category.slug)}
                                        className={`group relative flex items-center gap-2 px-6 py-4 rounded-t-2xl font-bold text-sm transition-all duration-200 border-t border-x ${
                                            isActive
                                                ? 'bg-slate-900 border-slate-700 text-teal-400 z-10'
                                                : 'bg-slate-800/40 border-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-white border-b-transparent'
                                        }`}
                                    >
                                        <CategoryIcon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-white'}`} />
                                        <span>{category.name}</span>
                                        {/* Seamless connector to card body */}
                                        {isActive && <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-slate-900"></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 2. MAIN CARD BODY */}
                    <div className="relative z-10 bg-slate-900 border border-slate-700 rounded-b-3xl rounded-tr-3xl rounded-tl-3xl lg:rounded-tl-none shadow-2xl overflow-hidden min-h-[500px]">
                        
                        {/* Background Gradients inside Card */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-teal-500/10 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                        <div className={`grid lg:grid-cols-2 gap-12 p-8 lg:p-14 items-center transition-all duration-500 ${isAnimating ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`}>
                            
                            {/* Left: Actionable Content */}
                            <div className="space-y-8 relative z-20">
                                <div>
                                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                                        {heroConfig.headline}
                                    </h2>
                                    <p className="text-lg text-slate-400 leading-relaxed">
                                        {heroConfig.subheadline}
                                    </p>
                                </div>

                                {/* Dynamic Action Module based on Category */}
                                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 backdrop-blur-sm">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-sm text-slate-400 font-medium">
                                            <span>Start your search</span>
                                            <span className="text-teal-400">{heroConfig.stats[0]?.label}: {heroConfig.stats[0]?.value}</span>
                                        </div>
                                        
                                        <form onSubmit={handleSearch} className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl opacity-30 group-hover:opacity-60 transition duration-300 blur-sm"></div>
                                            <div className="relative flex shadow-xl">
                                                <Input
                                                    type="text"
                                                    placeholder={`Search ${categories.find(c => c.slug === selectedCategory)?.name || 'products'}...`}
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full h-14 pl-5 pr-32 bg-slate-900 border-none text-white placeholder:text-slate-500 focus:ring-0 rounded-l-xl rounded-r-none font-medium text-lg"
                                                />
                                                <Button
                                                    type="submit"
                                                    className="h-14 px-8 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-r-xl rounded-l-none transition-all uppercase tracking-wide text-sm"
                                                >
                                                    Compare
                                                </Button>
                                            </div>
                                        </form>

                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                                            <Shield className="w-3 h-3 text-teal-500" />
                                            <span>100% Free & Unbiased • No text login required</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Links / Pills */}
                                <div className="flex flex-wrap gap-2">
                                     <span className="text-sm text-slate-500 mr-2 py-1">Popular:</span>
                                     {['Best Rates', 'Low Fees', 'Top Rated'].map((tag, i) => (
                                         <span key={i} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 hover:border-teal-500/50 cursor-pointer transition-colors">
                                             {tag}
                                         </span>
                                     ))}
                                </div>
                            </div>

                            {/* Right: Immersive Visual */}
                            <div className="hidden lg:block relative h-full min-h-[400px]">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {/* The Hero Illustration */}
                                    <div className="relative w-full aspect-square max-w-[400px]">
                                        {/* Abstract Shape Background */}
                                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 text-slate-800 fill-current opacity-50 transform scale-110">
                                            <path d="M44.9,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.9C91.4,-34.7,98.1,-20.4,95.8,-6.5C93.5,7.4,82.2,20.9,70.9,32.3C59.6,43.7,48.3,53,36.4,60.8C24.5,68.6,12,74.9,-0.3,75.5C-12.7,76,-25.3,70.8,-36.5,62.8C-47.7,54.8,-57.5,44,-66.1,31.7C-74.7,19.4,-82.1,5.6,-80.7,-7.4C-79.3,-20.4,-69.1,-32.6,-58.4,-42.1C-47.7,-51.6,-36.5,-58.4,-24.5,-67.1C-12.5,-75.8,-0,86.4,12.9,86.8L44.9,-76.4Z" transform="translate(100 100)" />
                                        </svg>
                                        
                                        {/* Icon Container */}
                                        <div className="relative z-10 flex flex-col items-center justify-center h-full">
                                            <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-teal-500/30 transform rotate-3 hover:rotate-6 transition-transform duration-500">
                                                <Icon className="w-16 h-16 text-white" />
                                            </div>
                                            
                                            {/* Floating Stat Card */}
                                            <div className="absolute bottom-10 -right-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl animate-float-delayed">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
                                                        {heroConfig.stats[0]?.value.replace('+','')}
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="text-xs text-white/60 uppercase font-bold tracking-wider">Active</div>
                                                        <div className="text-sm font-semibold text-white">{heroConfig.stats[0]?.label}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Floating Badge */}
                                            <div className="absolute top-10 -left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl animate-float">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                    <span className="text-xs font-bold text-white">Live Data</span>
                                                </div>
                                            </div>
                                        </div>
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

