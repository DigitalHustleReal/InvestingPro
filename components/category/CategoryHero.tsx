"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Shield, CreditCard, Wallet, PiggyBank, Building2, Calculator, FileText } from "lucide-react";
import Link from "next/link";

interface CategoryHeroProps {
    category: {
        name: string;
        slug: string;
        description: string;
    };
    primaryCTA?: {
        label: string;
        href: string;
    };
    secondaryCTA?: {
        label: string;
        href: string;
    };
    searchPlaceholder?: string;
    showSearch?: boolean;
}

// Category-specific configurations
const categoryConfigs: Record<string, {
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    headline: string;
    subheadline: string;
    searchPlaceholder: string;
    primaryCTA: { label: string; href: string };
    secondaryCTA?: { label: string; href: string };
    features: string[];
}> = {
    'credit-cards': {
        icon: CreditCard,
        gradient: 'from-indigo-600 to-purple-600',
        headline: 'Find the perfect credit card for your lifestyle',
        subheadline: 'Compare rewards, cashback, and travel benefits from top Indian banks. Get matched in minutes.',
        searchPlaceholder: 'Search credit cards by bank, rewards, or benefits...',
        primaryCTA: { label: 'Compare Credit Cards', href: '/credit-cards/compare' },
        secondaryCTA: { label: 'Check Eligibility', href: '/credit-cards/calculators/eligibility' },
        features: ['Best Rewards', 'Low Fees', 'Travel Benefits', 'Cashback']
    },
    'loans': {
        icon: Wallet,
        gradient: 'from-emerald-600 to-teal-600',
        headline: 'Get the best loan rates in India',
        subheadline: 'Compare personal, home, car, and business loans with lowest interest rates. Quick approval process.',
        searchPlaceholder: 'Search loans by type, amount, or interest rate...',
        primaryCTA: { label: 'Compare Loans', href: '/loans/compare' },
        secondaryCTA: { label: 'Calculate EMI', href: '/calculators/emi' },
        features: ['Low Interest Rates', 'Quick Approval', 'Flexible Tenure', 'No Hidden Charges']
    },
    'banking': {
        icon: PiggyBank,
        gradient: 'from-blue-600 to-cyan-600',
        headline: 'Maximize your savings with best interest rates',
        subheadline: 'Compare savings accounts, fixed deposits, and recurring deposits. Find the highest returns.',
        searchPlaceholder: 'Search banking products by interest rate or bank...',
        primaryCTA: { label: 'Compare Interest Rates', href: '/banking/compare/rates' },
        secondaryCTA: { label: 'FD Calculator', href: '/calculators/fd' },
        features: ['Up to 9.5% Returns', 'Zero Balance', 'Instant Access', 'Tax Benefits']
    },
    'investing': {
        icon: TrendingUp,
        gradient: 'from-teal-600 to-emerald-600',
        headline: 'Build wealth with smart investments',
        subheadline: 'Compare mutual funds, stocks, PPF, NPS, and ELSS. Make informed investment decisions.',
        searchPlaceholder: 'Search investments by type, returns, or risk...',
        primaryCTA: { label: 'Compare Investments', href: '/mutual-funds/compare' },
        secondaryCTA: { label: 'SIP Calculator', href: '/calculators/sip' },
        features: ['15% Avg Returns', 'Tax Saving', 'Diversified Portfolio', 'Expert Analysis']
    },
    'insurance': {
        icon: Shield,
        gradient: 'from-rose-600 to-pink-600',
        headline: 'Protect what matters most',
        subheadline: 'Compare life, health, term, and vehicle insurance from top insurers. Get comprehensive coverage.',
        searchPlaceholder: 'Search insurance plans by type or coverage...',
        primaryCTA: { label: 'Compare Plans', href: '/insurance/compare' },
        secondaryCTA: { label: 'Premium Calculator', href: '/insurance/calculators/premium' },
        features: ['Best Coverage', 'Low Premiums', 'Quick Claims', '24/7 Support']
    },
    'small-business': {
        icon: Building2,
        gradient: 'from-violet-600 to-purple-600',
        headline: 'Grow your business with the right financial products',
        subheadline: 'Compare business loans, credit cards, and banking solutions. Tools to manage your business finances.',
        searchPlaceholder: 'Search business products or tools...',
        primaryCTA: { label: 'Compare Business Products', href: '/loans/compare/business' },
        secondaryCTA: { label: 'GST Calculator', href: '/calculators/gst' },
        features: ['Business Loans', 'Credit Cards', 'Banking Solutions', 'GST Tools']
    },
    'taxes': {
        icon: Calculator,
        gradient: 'from-amber-600 to-orange-600',
        headline: 'Save more with smart tax planning',
        subheadline: 'Compare tax-saving investments, calculate your tax liability, and file ITR. Maximize your savings.',
        searchPlaceholder: 'Search tax-saving options or calculators...',
        primaryCTA: { label: 'Tax-Saving Investments', href: '/investing/best?type=tax-saving' },
        secondaryCTA: { label: 'Tax Calculator', href: '/calculators/tax' },
        features: ['Tax Saving', 'ITR Filing', 'Section 80C', 'GST Tools']
    },
    'personal-finance': {
        icon: FileText,
        gradient: 'from-slate-700 to-slate-900',
        headline: 'Take control of your finances',
        subheadline: 'Plan your budget, manage debt, build emergency fund, and achieve your financial goals.',
        searchPlaceholder: 'Search financial planning tools or guides...',
        primaryCTA: { label: 'Financial Planning', href: '/personal-finance/guides/financial-planning' },
        secondaryCTA: { label: 'Budget Calculator', href: '/personal-finance/calculators/budget' },
        features: ['Budget Planning', 'Debt Management', 'Emergency Fund', 'Retirement Planning']
    }
};

export default function CategoryHero({ 
    category, 
    primaryCTA,
    secondaryCTA,
    searchPlaceholder,
    showSearch = true 
}: CategoryHeroProps) {
    const [searchQuery, setSearchQuery] = useState('');
    
    const config = categoryConfigs[category.slug] || {
        icon: TrendingUp,
        gradient: 'from-teal-600 to-emerald-600',
        headline: `Find the best ${category.name.toLowerCase()} for you`,
        subheadline: category.description,
        searchPlaceholder: searchPlaceholder || `Search ${category.name.toLowerCase()}...`,
        primaryCTA: primaryCTA || { label: `Compare ${category.name}`, href: `/${category.slug}/compare` },
        secondaryCTA: secondaryCTA,
        features: []
    };

    const Icon = config.icon;

    return (
        <div className={`relative bg-gradient-to-br ${config.gradient} text-white overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Content */}
                    <div className="space-y-8">
                        {/* Category Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                            <Icon className="w-5 h-5" />
                            <span className="text-sm font-semibold">{category.name}</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                            {config.headline}
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-xl">
                            {config.subheadline}
                        </p>

                        {/* Search Bar */}
                        {showSearch && (
                            <div className="relative max-w-xl">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                <Input
                                    type="text"
                                    placeholder={config.searchPlaceholder}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-14 pl-12 pr-4 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 rounded-xl text-base"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && searchQuery) {
                                            window.location.href = `/${category.slug}?search=${encodeURIComponent(searchQuery)}`;
                                        }
                                    }}
                                />
                            </div>
                        )}

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Link href={config.primaryCTA.href}>
                                <Button 
                                    size="lg"
                                    className="bg-white text-slate-900 hover:bg-white/90 shadow-xl shadow-black/20 font-semibold px-8 py-6 text-base rounded-xl"
                                >
                                    {config.primaryCTA.label}
                                </Button>
                            </Link>
                            {config.secondaryCTA && (
                                <Link href={config.secondaryCTA.href}>
                                    <Button 
                                        size="lg"
                                        variant="outline"
                                        className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-6 text-base rounded-xl"
                                    >
                                        {config.secondaryCTA.label}
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Features */}
                        {config.features.length > 0 && (
                            <div className="flex flex-wrap gap-4 pt-4">
                                {config.features.map((feature, index) => (
                                    <div 
                                        key={index}
                                        className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-sm font-medium"
                                    >
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Visual */}
                    <div className="hidden lg:block relative">
                        <div className="relative">
                            {/* Decorative Elements */}
                            <div className="absolute -top-8 -right-8 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                            
                            {/* Main Visual */}
                            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                                <div className="space-y-6">
                                    {/* Icon */}
                                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <Icon className="w-10 h-10" />
                                    </div>
                                    
                                    {/* Stats or Info */}
                                    <div className="space-y-4">
                                        <div className="h-3 bg-white/20 rounded-full w-3/4"></div>
                                        <div className="h-3 bg-white/20 rounded-full w-1/2"></div>
                                        <div className="h-3 bg-white/20 rounded-full w-2/3"></div>
                                    </div>
                                    
                                    {/* CTA Visual */}
                                    <div className="pt-4">
                                        <div className="h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <span className="text-sm font-semibold">Quick Comparison</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

