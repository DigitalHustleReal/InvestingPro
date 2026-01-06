"use client";

import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    TrendingDown,
    Calculator,
    Percent,
    Wallet,
    Home,
    Car,
    GraduationCap,
    Gem,
    Briefcase,
    CheckCircle2,
    ArrowRight,
    Search
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/common/SEOHead";
import Link from 'next/link';

const loanTypes = [
    { id: 'personal', label: 'Personal', icon: Wallet, rate: '10.5%+' },
    { id: 'home', label: 'Home', icon: Home, rate: '8.50%+' },
    { id: 'car', label: 'Car', icon: Car, rate: '8.75%+' },
    { id: 'education', label: 'Education', icon: GraduationCap, rate: '9.50%+' },
    { id: 'gold', label: 'Gold', icon: Gem, rate: '9.00%+' },
    { id: 'business', label: 'Business', icon: Briefcase, rate: '12.0%+' },
];

import { api } from '@/lib/api';
import { RichProductCard } from "@/components/products/RichProductCard";
import { RichProduct } from "@/types/rich-product";


import { LoanFilterSidebar, LoanFilterState } from "@/components/loans/FilterSidebar";
import { ResponsiveFilterContainer } from "@/components/products/ResponsiveFilterContainer";

export default function LoansPage() {
    // Calculator State
    const [amount, setAmount] = useState(500000);
    const [tenure, setTenure] = useState(3); // Years
    const [rate, setRate] = useState(10.5);
    const [emi, setEmi] = useState(0);
    
    // Product State
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter State
    const [filters, setFilters] = useState<LoanFilterState>({
        maxRate: 15,
        maxProcessingFee: 2,
        loanTypes: [],
        banks: []
    });

    const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

    useEffect(() => {
        // EMI Calculation: P * r * (1+r)^n / ((1+r)^n - 1)
        const r = rate / 12 / 100;
        const n = tenure * 12;
        const e = amount * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
        setEmi(Math.round(e));

        // Fetch Loans
        const loadAssets = async () => {
            try {
                // Assuming api.entities.Loan.list() returns products with category='loan'
                 const data = await api.entities.Loan.list(); // Ensure api.ts has Loan.list implemented correctly
                 setAssets(data || []);
            } catch (err) {
                console.error("Failed to load loans", err);
            } finally {
                setLoading(false);
            }
        };
        loadAssets();
    }, [amount, tenure, rate]);

    const handleCompareToggle = (id: string) => {
        setSelectedForCompare(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const formatRupee = (num: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(num);
    };

    // Filter Logic
    const filteredAssets = assets.filter(asset => {
        const name = (asset.name || "").toLowerCase();
        const provider = (asset.provider_name || asset.provider || "").toLowerCase();
        const searchMatch = name.includes(searchTerm.toLowerCase()) || provider.includes(searchTerm.toLowerCase());
        
        // Bank Filter
        const bankMatch = filters.banks.length === 0 || 
            filters.banks.some(b => provider.includes(b.toLowerCase()) || name.includes(b.toLowerCase()));

        // Type Filter (metadata.type or from features)
        const type = (asset.metadata?.type || 'Personal Loan').toLowerCase();
        const typeMatch = filters.loanTypes.length === 0 ||
            filters.loanTypes.some(t => type.includes(t.toLowerCase()));

        // Rate Check (Basic parsing if possible, else ignored)
        // Ignoring rate filter for now as data is unstructured string

        return searchMatch && bankMatch && typeMatch;
    });

    // Count active filters for mobile badge
    const activeFiltersCount = 
        (filters.loanTypes.length > 0 ? 1 : 0) + 
        (filters.banks.length > 0 ? 1 : 0) +
        (filters.maxRate < 15 ? 1 : 0);

    // Transform to RichProduct
    const richProducts: RichProduct[] = filteredAssets.map(a => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        category: 'loan',
        provider_name: a.provider_name || a.provider || "Lender",
        image_url: a.image_url,
        description: a.description || "",
        rating: {
           overall: a.rating || 4.2,
           trust_score: a.trust_score || 90,
           breakdown: {}
        },
        bestFor: a.best_for, // Database value
        specs: {
           type: a.metadata?.type || 'Personal Loan'
        },
        key_features: a.features 
            ? Object.entries(a.features).map(([k,v]) => ({ label: k, value: String(v) }))
            : [],
        features: a.features || {},
        pros: a.pros || [],
        cons: a.cons || [],
        is_verified: true,
        updated_at: a.updated_at || new Date().toISOString(),
        affiliate_link: a.affiliate_link || a.link,
        official_link: a.official_link
    }));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
            <SEOHead
                title="Compare Best Loans in India 2026 | InvestingPro"
                description="Instant approval loans with lowest interest rates. Calculate EMI, compare Personal, Home, and Car loans from HDFC, SBI, ICICI."
            />

            {/* --- HERO SECTION --- */}
            <div className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32 bg-slate-50 dark:bg-slate-950">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 dark:bg-emerald-500/20" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 dark:bg-secondary-500/20" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-5"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        
                        {/* Hero Text */}
                        <div className="flex-1 text-center lg:text-left">
                            <Badge className="mb-6 px-4 py-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 font-semibold uppercase tracking-wide text-[11px] inline-flex items-center gap-2 rounded-full">
                                <TrendingDown className="w-3.5 h-3.5" />
                                Lowest Interest Rates Guaranteed
                            </Badge>
                            
                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white leading-[1.1]">
                                Fund Your Dreams <br className="hidden lg:block" />
                                <span className="text-emerald-600 dark:text-emerald-400">Instantly</span>
                            </h1>
                            
                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                                Compare 30+ lenders for Personal, Home, and Car loans.
                                Digital approval in <span className="font-semibold text-slate-900 dark:text-white">5 minutes</span>.
                            </p>

                            <div className="relative group max-w-md mx-auto lg:mx-0 mb-8">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <Input
                                    placeholder="Search lenders (e.g. 'HDFC', 'SBI Home Loan')..."
                                    className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-emerald-500 transition-all font-medium shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                             <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-8">
                                {[
                                    { label: "Lenders", value: "30+", icon: ShieldCheck },
                                    { label: "Starting ROI", value: "8.50%", icon: Percent },
                                    { label: "Disbursal", value: "24hrs", icon: CheckCircle2 }
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

                        {/* Interactive Calculator Widget */}
                        <div className="flex-1 w-full max-w-md lg:max-w-lg">
                            <Card className="rounded-[2.5rem] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl shadow-emerald-500/10 overflow-hidden relative">
                                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-secondary-500" />
                                
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Calculator className="w-5 h-5 text-emerald-500" />
                                            Quick EMI Estimator
                                        </h3>
                                        <Badge variant="outline" className="text-xs border-slate-200 dark:border-slate-700">Live Rates</Badge>
                                    </div>

                                    {/* Amount Slider */}
                                    <div className="mb-8">
                                        <div className="flex justify-between mb-4">
                                            <label className="text-sm font-medium text-slate-500 uppercase tracking-wider">Loan Amount</label>
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">{formatRupee(amount)}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="50000"
                                            max="5000000"
                                            step="10000"
                                            value={amount}
                                            onChange={(e) => setAmount(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                    </div>

                                    {/* Tenure Slider */}
                                    <div className="mb-8">
                                        <div className="flex justify-between mb-4">
                                            <label className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tenure (Years)</label>
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">{tenure} Years</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="30"
                                            step="1"
                                            value={tenure}
                                            onChange={(e) => setTenure(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>

                                    {/* Result Box */}
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 mb-6">
                                        <div className="text-center">
                                            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Monthly Approx EMI</div>
                                            <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                                                {formatRupee(emi)}
                                            </div>
                                            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                                                @ {rate}% Interest Rate
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                                        Check My Eligibility
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT SCRENER --- */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Filter Sidebar */}
                    <ResponsiveFilterContainer activeFiltersCount={activeFiltersCount}>
                         <LoanFilterSidebar filters={filters} setFilters={setFilters} />
                         
                         {/* Marketing Widgets in Sidebar - Hidden on Mobile Drawer for better UX */}
                         <div className="hidden lg:block mt-8 space-y-6">
                            {/* Documents Checklist Widget */}
                            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem]">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Required Documents</h3>
                                    <ul className="space-y-3">
                                        {['PAN Card', 'Aadhaar Card', 'Last 3 Months Salary Slips', '6 Months Bank Statement'].map((doc, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                                                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                                                    <span className="text-xs font-bold text-slate-500">{i+1}</span>
                                                </div>
                                                {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                         </div>
                    </ResponsiveFilterContainer>

                    {/* Results Grid */}
                    <div className="flex-1">
                        
                        {/* Status Bar */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Top Loan Offers <span className="text-slate-400 font-medium text-sm ml-2">({filteredAssets.length})</span>
                            </h2>
                        </div>

                        {loading ? (
                             <div className="grid md:grid-cols-2 gap-6 animate-pulse">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="h-96 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
                                ))}
                             </div>
                        ) : filteredAssets.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No loans match your filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {richProducts.map((product) => (
                                    <RichProductCard key={product.id} product={product} onCompare={handleCompareToggle} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

