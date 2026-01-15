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



import { api } from '@/lib/api';
import { RichProductCard } from "@/components/products/RichProductCard";
import { RichProduct } from "@/types/rich-product";


import { LoanFilterSidebar, LoanFilterState } from "@/components/loans/FilterSidebar";
import { ResponsiveFilterContainer } from "@/components/products/ResponsiveFilterContainer";
import { LoansTable } from "@/components/loans/LoansTable";
import { LayoutGrid, Table as TableIcon } from 'lucide-react';
import { EMICalculatorEnhanced } from '@/components/calculators/EMICalculatorEnhanced';
import ContextualNewsWidget from '@/components/news/ContextualNewsWidget';
import RatesWidget from '@/components/rates/RatesWidget';
import CategoryHero from '@/components/common/CategoryHero';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';

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
    
    // View Mode State
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

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

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    
                    {/* Premium Authoritative Hero */}
                    <CategoryHero
                        title="Compare Best Loans in India"
                        subtitle="Lowest Interest Rates. Instant Approval."
                        description="Compare 30+ lenders for Personal, Home, and Car loans. Get digital approval in 5 minutes with lowest interest rates starting from 8.50%."
                        primaryCta={{
                            text: "Compare Loans",
                            href: "#compare"
                        }}
                        secondaryCta={{
                            text: "Calculate EMI",
                            href: "#emi-calculator"
                        }}
                        stats={[
                            { label: "Lenders", value: "30+" },
                            { label: "Starting ROI", value: "8.50%" },
                            { label: "Disbursal", value: "24hrs" }
                        ]}
                        badge="Lowest Interest Rates • Instant Approval • Digital Process"
                        variant="primary"
                        className="mb-12"
                    />

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mb-12 relative group z-20">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-stone-400 group-focus-within:text-primary-600 transition-colors" />
                        </div>
                        <Input
                            placeholder="Search lenders (e.g. 'HDFC', 'SBI Home Loan')..."
                            className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary-500 shadow-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* EMI Calculator Widget */}
                    <div id="emi-calculator" className="max-w-md mx-auto mb-12">
                        <Card className="rounded-[2.5rem] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl shadow-primary-500/10 overflow-hidden relative">
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-success-400 via-primary-500 to-secondary-500" />
                            
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Calculator className="w-5 h-5 text-primary-500" />
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
                                        className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-success-500"
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
                                            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-secondary-500"
                                        />
                                    </div>

                                    {/* Result Box */}
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 mb-6">
                                        <div className="text-center">
                                            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Monthly Approx EMI</div>
                                            <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                                                {formatRupee(emi)}
                                            </div>
                                            <div className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-2">
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
                            {/* Rates Widget */}
                            <RatesWidget category="loans" title="Live Interest Rates" />

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

                            {/* News Widget */}
                            <ContextualNewsWidget category="loans" title="Banking News" />
                         </div>
                    </ResponsiveFilterContainer>

                    {/* Results Grid */}
                    <div className="flex-1">
                        
                        {/* Status Bar with View Toggle */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Top Loan Offers <span className="text-slate-400 font-medium text-sm ml-2">({filteredAssets.length})</span>
                            </h2>
                            
                            {/* View Toggle */}
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                        viewMode === 'table'
                                            ? 'bg-primary-600 text-white'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    <TableIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">Table</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                        viewMode === 'grid'
                                            ? 'bg-primary-600 text-white'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                    <span className="hidden sm:inline">Cards</span>
                                </button>
                            </div>
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
                            <>
                                {viewMode === 'table' ? (
                                    <LoansTable loans={filteredAssets} />
                                ) : (
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                        {richProducts.map((product) => (
                                            <RichProductCard key={product.id} product={product} onCompare={handleCompareToggle} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* --- EMI CALCULATOR SECTION --- */}
            <div className="container mx-auto px-4 pb-16 pt-8">
                <div className="text-center mb-8">
                    <Badge className="mb-4 bg-primary-50 text-primary-700 border-primary-200">Advanced EMI Tool</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Complete EMI Calculator with Amortization
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Calculate your loan EMI with detailed month-by-month and year-by-year payment breakdown
                    </p>
                </div>
                <EMICalculatorEnhanced />
            </div>

            {/* --- EDUCATIONAL CONTENT HUB --- */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-primary-50 text-primary-700 border-primary-100">Loan Knowledge Base</Badge>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Everything You Need to Know About Loans</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Don't just sign the papers. Understand the fine print, interest calculations, and hidden charges.
                        </p>
                    </div>

                    {/* 1. Types of Loans Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-24">
                        {[
                            { title: "Personal Loans", desc: "Unsecured loans for any purpose. Higher interest rates (10-18%). Best for emergencies or consolidation.", icon: Wallet },
                            { title: "Home Loans", desc: "Secured against property. Lowest rates (8.5-9.5%). Tax benefits under Sec 24(b) and 80C.", icon: Home },
                            { title: "Car Loans", desc: "Hypothecated to the bank until repaid. Fixed or floating rates. Tenure up to 7 years.", icon: Car }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                    <item.icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* 2. Visual Guide Placeholder (Canva) */}
                    <div className="bg-gradient-to-br from-primary-600 to-secondary-600 dark:from-primary-500 dark:to-secondary-500 rounded-[3rem] overflow-hidden relative mb-24 text-white shadow-2xl shadow-primary-500/20">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="p-12 md:p-20 md:w-1/2 relative z-10">
                                <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">Step-by-Step Guide</Badge>
                                <h3 className="text-4xl font-bold mb-6">How to Get Approved Instantly</h3>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3"><CheckCircle2 className="text-white/90" /> Check your CIBIL Score (750+ is ideal)</li>
                                    <li className="flex items-center gap-3"><CheckCircle2 className="text-white/90" /> Keep Salary Slips & Bank Statements ready</li>
                                    <li className="flex items-center gap-3"><CheckCircle2 className="text-white/90" /> Compare ROI across top 3 lenders</li>
                                </ul>
                                <Button className="bg-white hover:bg-secondary-50 text-primary-600 font-bold h-12 px-8 rounded-xl shadow-lg transition-all">
                                    Check My CIBIL Score
                                </Button>
                            </div>
                            <div className="md:w-1/2 bg-white/10 backdrop-blur-sm h-[400px] md:h-full flex items-center justify-center border-l border-white/20 border-dashed">
                                {/* PLACEHOLDER FOR CANVA IMAGE */}
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-white/40">
                                        <span className="text-xs text-white/60 font-mono">IMAGE</span>
                                    </div>
                                    <p className="text-white/60 font-mono text-sm">Use Content Injection<br/>"Loan Approval Process Infographic"</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. FAQ Accordion (Simplified) */}
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-center mb-10 text-slate-900 dark:text-white">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            {[
                                { q: "What is the minimum credit score for a personal loan?", a: "Most banks require a CIBIL score of 750+. However, some fintech lenders offer loans to scores as low as 650 with higher interest rates." },
                                { q: "Is interest rate negotiable?", a: "Yes. If you have a high credit score and a stable income, you can negotiate with the relationship manager for a 0.25-0.5% reduction." },
                                { q: "What are foreclosure charges?", a: "Fees charged if you repay the loan before the tenure ends. Typically 2-4% of the outstanding principal. Choose lenders with zero foreclosure charges." }
                            ].map((faq, i) => (
                                <details key={i} className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 cursor-pointer">
                                    <summary className="font-bold text-slate-900 dark:text-white flex justify-between items-center list-none">
                                        {faq.q}
                                        <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                                    </summary>
                                    <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed pl-0">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Compliance Disclaimer */}
            <div className="container mx-auto px-4 pb-8">
                <ComplianceDisclaimer variant="compact" />
            </div>

        </div>
    );
}

