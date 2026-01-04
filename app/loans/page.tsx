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

export default function LoansPage() {
    // Calculator State
    const [amount, setAmount] = useState(500000);
    const [tenure, setTenure] = useState(3); // Years
    const [rate, setRate] = useState(10.5);
    const [emi, setEmi] = useState(0);
    
    // Product State
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                // If not implemented, we can force category filter here if endpoint supports, or rely on implementation
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

    const formatRupee = (num: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(num);
    };

    // Transform to RichProduct
    const richProducts: RichProduct[] = assets.map(a => ({
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
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 dark:bg-blue-500/20" />
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

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Button className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-600/20 w-full sm:w-auto transition-all hover:scale-105">
                                    Compare Rates
                                </Button>
                                <Button variant="outline" className="h-14 px-8 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl font-semibold text-lg w-full sm:w-auto">
                                    Check Eligibility
                                </Button>
                            </div>

                             <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8">
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
                                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500" />
                                
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
                                        <div className="flex justify-between mt-2 text-xs text-slate-400">
                                            <span>₹50K</span>
                                            <span>₹50L</span>
                                        </div>
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
                                         <div className="flex justify-between mt-2 text-xs text-slate-400">
                                            <span>1 Yr</span>
                                            <span>30 Yrs</span>
                                        </div>
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

            {/* --- MAIN CONTENT & WIDGETS --- */}
            <main className="container mx-auto px-4 py-16">
                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* LEFT COLUMN: PRODUCTS */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Top Loan Offers</h2>
                        </div>
                        
                        {/* Static Categories for filtering (Visual only for now) */}
                        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                             {loanTypes.map((type) => (
                                <button key={type.id} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-semibold hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors whitespace-nowrap">
                                    <type.icon className="w-4 h-4 text-slate-500" />
                                    {type.label}
                                </button>
                             ))}
                        </div>

                        {loading ? (
                             [...Array(3)].map((_, i) => (
                                <div key={i} className="h-64 w-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-3xl" />
                            ))
                        ) : richProducts.length > 0 ? (
                            richProducts.map((product) => (
                                <RichProductCard 
                                    key={product.id} 
                                    product={product} 
                                    layout="list"
                                />
                            ))
                        ) : (
                            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No loan offers found</h3>
                                <p className="text-slate-500">Check back soon for updated rates.</p>
                                <Button className="mt-4" variant="outline" asChild>
                                    <Link href="/admin/products">Admin: Add Loans</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR WIDGETS */}
                    <div className="space-y-8">
                        
                        {/* Eligibility Widget (Quick) */}
                         <Card className="bg-slate-900 text-white rounded-[2rem] overflow-hidden">
                             <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Eligibility Check
                                </h3>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase font-semibold text-slate-400">Monthly Salary</label>
                                        <Input className="bg-white/10 border-white/10 text-white" placeholder="e.g. 50000" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase font-semibold text-slate-400">Current EMIs</label>
                                        <Input className="bg-white/10 border-white/10 text-white" placeholder="e.g. 15000" />
                                    </div>
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold mt-2">
                                        Calculate Amount
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

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
                 </div>
            </main>
        </div>
    );
}

