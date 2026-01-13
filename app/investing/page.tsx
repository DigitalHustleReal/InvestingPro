"use client";

import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Landmark,
    Coins,
    BarChart3,
    Gem,
    Building2,
    ShieldCheck,
    CheckCircle2,
    Percent,
    Target,
    ArrowUpRight,
    PieChart,
    ArrowRight,
    BookOpen
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/common/SEOHead";
import Link from 'next/link';
import { api } from '@/lib/api';
import { SmartText } from "@/components/content/SmartText";
import { InvestingFilterSidebar, InvestingFilterState } from '@/components/investing/FilterSidebar';
import { ResponsiveFilterContainer } from '@/components/products/ResponsiveFilterContainer';

const investingTypes = [
    { id: 'mutual-funds', label: 'Mutual Funds', icon: TrendingUp },
    { id: 'stocks', label: 'Stocks & IPOs', icon: Landmark },
    { id: 'ppf-nps', label: 'PPF & NPS', icon: Coins },
    { id: 'elss', label: 'ELSS', icon: BarChart3 },
    { id: 'gold', label: 'Gold', icon: Gem },
    { id: 'demat', label: 'Demat Accounts', icon: Building2 },
];

const FAQ_DATA = [
    {
        q: "How much should I invest monthly?",
        a: "A common rule is 20% of your post-tax income. However, it depends on your financial goals. Start with whatever you can afford, even ₹500/month, and increase it annually."
    },
    {
        q: "What is asset allocation?",
        a: "It's balancing risk and reward by dividing assets among different categories (equity, debt funds, gold). For example, a young investor might hold 70% equity and 30% debt."
    },
    {
        q: "Is investing in stocks risky?",
        a: "Yes, individual stocks can be volatile. Mutual funds reduce this risk by diversification. Over the long term (10+ years), diversified equity has historically beaten inflation."
    },
    {
        q: "How are investment returns taxed?",
        a: "It varies. Long-term equity gains (>1 year) are taxed at 10% above ₹1.25L. Short-term (<1 year) at 15%. Debt funds are taxed at your slab rate."
    }
];

export default function InvestingPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]); // Store unfiltered products
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Filter State
    const [filters, setFilters] = useState<InvestingFilterState>({
        fundTypes: [],
        riskLevels: [],
        minCAGR: 0,
        maxExpenseRatio: 2.5,
        fundHouses: [],
        minInvestment: 0
    });

    useEffect(() => {
        async function loadFeatured() {
            setLoading(true);
            try {
                // Fetch mutual funds as a proxy for featured investing products
                const response = await api.entities.MutualFund.list();
                const data = response.data || [];
                
                if (data && data.length > 0) {
                    const normalized = data.map((p: any) => {
                        const features = p.features || {};
                        return {
                            id: p.id,
                            title: p.name,
                            provider: p.provider_name,
                            rating: p.rating || 4.5,
                            badge: "Featured",
                            description: p.description || "Top rated investment option.",
                            features: p.pros?.slice(0, 3) || ["Verified", "Growth", "Direct"],
                            href: `/investing/${p.category === 'mutual_fund' ? 'mutual-funds' : 'demat'}/${p.slug || p.id}`,
                            // Filter fields
                            fundType: "Mutual Fund",
                            risk: features.risk_level || "Moderate",
                            cagr: parseFloat(features.returns_3y || '0'),
                            expenseRatio: parseFloat(features.expense_ratio || '0'),
                            fundHouse: p.provider_name,
                            minInvestment: parseInt(features.min_sip || '500')
                        };
                    });
                    setAllProducts(normalized);
                    setProducts(normalized.slice(0, 9)); // Show first 9
                }
            } catch (err) {
                console.error("Error loading investing products:", err);
            } finally {
                setLoading(false);
            }
        }
        loadFeatured();
    }, []);
    
    // Apply Filters
    useEffect(() => {
        let filtered = [...allProducts];
        
        // Fund Type filter
        if (filters.fundTypes.length > 0) {
            filtered = filtered.filter(p => filters.fundTypes.includes(p.fundType));
        }
        
        // Risk filter
        if (filters.riskLevels.length > 0) {
            filtered = filtered.filter(p => filters.riskLevels.includes(p.risk));
        }
        
        // CAGR filter
        filtered = filtered.filter(p => p.cagr >= filters.minCAGR);
        
        // Expense Ratio filter
        filtered = filtered.filter(p => p.expenseRatio <= filters.maxExpenseRatio);
        
        // Fund House filter
        if (filters.fundHouses.length > 0) {
            filtered = filtered.filter(p => filters.fundHouses.includes(p.fundHouse));
        }
        
        // Min Investment filter
        filtered = filtered.filter(p => p.minInvestment >= filters.minInvestment);
        
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.provider.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setProducts(filtered.slice(0, 9)); // Show top 9 matching
    }, [filters, searchTerm, allProducts]);
    
    // Count active filters
    const activeFiltersCount = 
        (filters.fundTypes.length > 0 ? 1 : 0) +
        (filters.riskLevels.length > 0 ? 1 : 0) +
        (filters.fundHouses.length > 0 ? 1 : 0);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
            <SEOHead
                title="Best Investment Options in India 2026 | InvestingPro"
                description="Start building wealth with top-rated Mutual Funds, Stocks, and Tax Saving schemes. Compare returns, risk, and fees."
            />

            {/* --- HERO SECTION --- */}
            <div className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32 bg-slate-50 dark:bg-slate-900">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 dark:bg-primary-500/20" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 dark:bg-primary-500/20" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-5"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        
                        {/* Hero Text */}
                        <div className="flex-1 text-center lg:text-left">
                            <Badge className="mb-6 px-4 py-1.5 bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 border border-primary-100 dark:border-primary-500/20 font-semibold uppercase tracking-wide text-[11px] inline-flex items-center gap-2 rounded-full">
                                <Coins className="w-3.5 h-3.5" />
                                Smart Wealth Generation
                            </Badge>
                            
                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white leading-[1.1]">
                                Grow Your Wealth <br className="hidden lg:block" />
                                <span className="bg-gradient-to-r from-primary-500 to-success-500 bg-clip-text text-transparent">With Confidence</span>
                            </h1>
                            
                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                                Access 5,000+ top-rated Mutual Funds, Stocks, and Tax Saving schemes.
                                Data-driven insights to maximize your <span className="font-semibold text-slate-900 dark:text-white">CAGR</span>.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link href="/mutual-funds" className="w-full sm:w-auto">
                                    <Button className="h-14 px-8 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-600/20 w-full transition-all hover:scale-105">
                                        Start Investing
                                    </Button>
                                </Link>
                                <Link href="/mutual-funds/compare" className="w-full sm:w-auto">
                                    <Button variant="outline" className="h-14 px-8 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl font-semibold text-lg w-full">
                                        Compare Funds
                                    </Button>
                                </Link>
                            </div>

                             <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8">
                                {[
                                    { label: "Assets Tracked", value: "₹50Cr+", icon: PieChart },
                                    { label: "Avg Returns", value: "18.2%", icon: ArrowUpRight },
                                    { label: "Zero Commission", value: "Direct", icon: CheckCircle2 }
                                ].map((stat, i) => (
                                    <div key={i} className="flex flex-col">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                                            <stat.icon size={14} /> {stat.label}
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Wealth Chart Visualization */}
                        <div className="flex-1 w-full max-w-lg lg:max-w-xl">
                            <div className="relative aspect-square md:aspect-[4/3] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-primary-500/20 p-8 overflow-hidden group">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-8 z-10 relative">
                                    <div>
                                        <div className="text-sm text-slate-500 font-medium mb-1">Portfolio Value</div>
                                        <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">₹24,50,000</div>
                                        <div className="flex items-center gap-1 text-primary-500 font-bold text-sm mt-1">
                                            <ArrowUpRight size={16} /> +22.4% this year
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                                        <TrendingUp size={24} />
                                    </div>
                                </div>

                                {/* Animated Chart SVG */}
                                <div className="absolute inset-x-0 bottom-0 top-32 overflow-hidden">
                                    <svg viewBox="0 0 400 200" className="w-full h-full transform translate-y-4">
                                        <defs>
                                            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.2" />
                                                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path 
                                            d="M0 200 L0 150 Q 50 140 100 120 T 200 80 T 300 40 L 400 10 L 400 200 Z" 
                                            fill="url(#gradient)" 
                                            className="transition-all duration-1000"
                                        />
                                        <path 
                                            d="M0 150 Q 50 140 100 120 T 200 80 T 300 40 L 400 10" 
                                            fill="none" 
                                            stroke="#14b8a6" 
                                            strokeWidth="4" 
                                            strokeLinecap="round"
                                            className="drop-shadow-lg"
                                        />
                                        
                                        {/* Floating Points */}
                                        <circle cx="100" cy="120" r="4" fill="white" stroke="#14b8a6" strokeWidth="2" className="animate-ping" style={{animationDuration: '3s'}} />
                                        <circle cx="200" cy="80" r="4" fill="white" stroke="#14b8a6" strokeWidth="2" className="animate-ping" style={{animationDuration: '4s'}} />
                                        <circle cx="300" cy="40" r="4" fill="white" stroke="#14b8a6" strokeWidth="2" className="animate-ping" style={{animationDuration: '5s'}} />
                                    </svg>
                                </div>
                                
                                {/* Floating Insight Card */}
                                <div className="absolute bottom-8 right-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-[180px] animate-bounce" style={{animationDuration: '4s'}}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Gem className="w-4 h-4 text-secondary-500" />
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Top Pick</span>
                                    </div>
                                    <div className="text-xs font-semibold text-slate-800 dark:text-white">HDFC Mid-Cap Fund</div>
                                    <div className="text-xs text-primary-500 font-bold">+18% CAGR</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- INVESTING TYPES GRID --- */}
            <main className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Explore Investment Avenues</h2>
                    <p className="text-slate-600 dark:text-slate-400">Diversify your portfolio with the best asset classes.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-24">
                    {investingTypes.map((type) => (
                        <Link href={`/investing?type=${type.id}`} key={type.id}>
                            <Card className="hover:border-primary-500 dark:hover:border-primary-500 transition-all cursor-pointer group hover:-translate-y-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 flex items-center justify-center mb-4 transition-colors">
                                        <type.icon className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                                    </div>
                                    <div className="font-bold text-slate-900 dark:text-white mb-1">{type.label}</div>
                                    <div className="text-xs text-primary-600 dark:text-primary-400 font-semibold">High Growth</div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* --- FILTER + PRODUCTS SECTION --- */}
                <div className="flex flex-col lg:flex-row gap-8 items-start mb-24">
                    
                    {/* Filter Sidebar */}
                    <ResponsiveFilterContainer activeFiltersCount={activeFiltersCount}>
                        <InvestingFilterSidebar filters={filters} setFilters={setFilters} />
                    </ResponsiveFilterContainer>
                    
                    {/* Products List */}
                    <div className="flex-1 w-full">
                        <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Top Rated Funds</h2>
                        <p className="text-slate-600 dark:text-slate-400">Handpicked by SEBI-registered analysts.</p>
                    </div>
                    <Link href="/mutual-funds">
                         <Button variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">View All</Button>
                    </Link>
                </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1,2,3].map(i => (
                                    <div key={i} className="h-96 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] animate-pulse" />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                                <p className="text-lg font-medium text-slate-900 dark:text-white">No funds match your filters</p>
                                <p className="text-slate-500 mt-2">Try adjusting your criteria</p>
                                <Button onClick={() => setFilters({
                                    fundTypes: [],
                                    riskLevels: [],
                                    minCAGR: 0,
                                    maxExpenseRatio: 2.5,
                                    fundHouses: [],
                                    minInvestment: 0
                                })} className="mt-4" variant="outline">Reset Filters</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <Link href={product.href} key={product.id}>
                            <Card className="h-full hover:border-primary-500 dark:hover:border-primary-500 transition-all cursor-pointer hover:-translate-y-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 group">
                                <CardContent className="p-6">
                                    {/* Badge */}
                                    {product.badge && (
                                        <div className="inline-block mb-4">
                                            <Badge className="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 border border-primary-100 dark:border-primary-500/20 font-semibold text-xs px-3 py-1">
                                                {product.badge}
                                            </Badge>
                                        </div>
                                    )}
                                    
                                    {/* Header */}
                                    <div className="mb-4">
                                        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide mb-2">
                                            {product.provider}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {product.title}
                                        </h3>
                                        
                                        {/* Rating */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-accent-400' : 'text-slate-300 dark:text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{product.rating}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Description */}
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                        {product.description}
                                    </p>
                                    
                                    {/* Features */}
                                    <ul className="space-y-2 mb-6">
                                        {(product.features || []).map((feature: string, i: number) => (
                                            <li key={i} className="flex items-start text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    {/* CTA */}
                                    <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl">
                                        Invest Now
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- EDUCATIONAL CONTENT HUB --- */}
                <section className="mb-24">
                     <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Investing Knowledge Hub</h2>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">Master the art of wealth creation.</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Visual Guide Placeholder */}
                        <div className="lg:col-span-1">
                             <div className="sticky top-24 bg-slate-900 text-white p-8 rounded-[2rem] overflow-hidden relative min-h-[400px] flex flex-col justify-center items-center text-center">
                                {/* Placeholder Content */}
                                <div className="z-10 relative">
                                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                        <PieChart className="w-10 h-10 text-primary-300" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Investment Pyramid</h3>
                                    <p className="text-slate-300 mb-8 max-w-[200px] mx-auto">Visual guide to asset allocation and risk management.</p>
                                    <div className="border border-dashed border-slate-600 rounded-xl p-4 bg-slate-800/50">
                                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Image Placeholder</p>
                                    </div>
                                </div>
                                
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Types of Investments */}
                            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-primary-600" />
                                        Core Asset Classes
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            {
                                                title: "Equity (Stocks)",
                                                desc: "Ownership in companies. High risk, high return potential. Best for long-term goals (>5 years).",
                                                icon: TrendingUp // Re-using imported icon
                                            },
                                            {
                                                title: "Fixed Income (Debt)",
                                                desc: "Loans to govt/corporates (Bonds, FDs). Lower risk, stable returns. Good for capital preservation.",
                                                icon: ShieldCheck // Re-using imported icon
                                            },
                                            {
                                                title: "Commodities (Gold)",
                                                desc: "Physical assets like Gold/Silver. Hedge against inflation and market volatility.",
                                                icon: Gem // Re-using imported icon
                                            },
                                            {
                                                title: "Alternative Assets",
                                                desc: "REITs, Crypto, P2P Lending. High risk, uncorrelated returns.",
                                                icon: Coins // Re-using imported icon
                                            }
                                        ].map((type, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 mt-1">
                                                    <type.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{type.title}</h4>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{type.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* FAQ Accordion */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white px-2">Frequently Asked Questions</h3>
                                {FAQ_DATA.map((faq, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-md transition-shadow">
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex justify-between items-center group cursor-pointer">
                                            {faq.q}
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
                                        </h4>
                                        <SmartText className="text-sm">
                                            {faq.a}
                                        </SmartText>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

