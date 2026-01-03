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
            {/* Animated Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${heroConfig.gradient} transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>
                
                {/* Animated Blobs */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                {/* Category Selector - Above Hero Content (NerdWallet Style) */}
                <div className="mb-10">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {categories.map((category) => {
                            const isActive = selectedCategory === category.slug;
                            const categoryConfig = categoryHeroConfig[category.slug];
                            const CategoryIcon = categoryConfig?.icon || TrendingUp;
                            
                            return (
                                <button
                                    key={category.slug}
                                    onClick={() => handleCategorySelect(category.slug)}
                                    className={`group relative px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                        isActive
                                            ? 'bg-white text-slate-900 shadow-2xl scale-105 z-10'
                                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:scale-105 hover:shadow-lg'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <CategoryIcon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
                                        <span>{category.name}</span>
                                    </div>
                                    {/* Active Indicator Line */}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-b-xl"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Hero Content - Animated */}
                <div className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                    {/* Left Column: Content */}
                    <div className="text-white space-y-6">
                        {/* Category Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                            <Icon className={`w-5 h-5 ${heroConfig.iconColor || 'text-white'}`} />
                            <span className="text-sm font-semibold text-white">
                                {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : 'All Categories'}
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                            {heroConfig.headline}
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                            {heroConfig.subheadline}
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search products, calculators, guides..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-14 pl-14 pr-32 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-white/50 rounded-xl text-lg shadow-xl"
                            />
                            <Button
                                type="submit"
                                size="lg"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg"
                            >
                                Search
                            </Button>
                        </form>

                        {/* CTA Button */}
                        <div className="flex items-center gap-4">
                            <Link href={heroConfig.cta.href}>
                                <Button 
                                    size="lg"
                                    className="bg-white text-slate-900 hover:bg-white/90 shadow-xl font-semibold px-8 py-6 text-base rounded-xl"
                                >
                                    {heroConfig.cta.label}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6 pt-4">
                            {heroConfig.stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-sm text-white/80">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Visual - Enhanced */}
                    <div className="hidden lg:block relative">
                        <div className="relative h-full min-h-[600px] flex items-center justify-center">
                            {/* Main Visual Container */}
                            <div className="relative w-full max-w-md">
                                {/* Large Icon with Glow */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative">
                                        {/* Icon Background Glow */}
                                        <div className="absolute inset-0 bg-white/30 rounded-full blur-3xl scale-150 animate-pulse-slow"></div>
                                        
                                        {/* Main Icon */}
                                        <div className="relative z-10">
                                            <Icon className="w-48 h-48 text-white/90 drop-shadow-2xl animate-scale-breathe" />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating Decorative Elements */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/15 rounded-full blur-3xl animate-float"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-delayed"></div>
                                
                                {/* Stats Cards - Floating */}
                                <div className="absolute top-10 left-0 bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-xl animate-slide-in-left">
                                    <div className="text-2xl font-bold text-white mb-1">{heroConfig.stats[0]?.value}</div>
                                    <div className="text-xs text-white/80 font-medium">{heroConfig.stats[0]?.label}</div>
                                </div>
                                
                                <div className="absolute top-32 right-0 bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-xl animate-slide-in-right">
                                    <div className="text-2xl font-bold text-white mb-1">{heroConfig.stats[1]?.value}</div>
                                    <div className="text-xs text-white/80 font-medium">{heroConfig.stats[1]?.label}</div>
                                </div>
                                
                                {/* Comparison Card - Bottom */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl w-full max-w-sm animate-slide-up">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/25 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">Quick Comparison</div>
                                                <div className="text-xs text-white/70">Side-by-side analysis</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-2 bg-white/25 rounded-full w-full backdrop-blur-sm"></div>
                                            <div className="h-2 bg-white/25 rounded-full w-3/4 backdrop-blur-sm"></div>
                                            <div className="h-2 bg-white/25 rounded-full w-1/2 backdrop-blur-sm"></div>
                                        </div>
                                        <Link href={heroConfig.cta.href}>
                                            <div className="pt-2 text-xs text-white/80 font-medium hover:text-white transition-colors cursor-pointer">
                                                Compare products →
                                            </div>
                                        </Link>
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

