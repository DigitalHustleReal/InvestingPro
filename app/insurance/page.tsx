
"use client";

import React, { useState, useEffect } from 'react';
import {
    Shield,
    Heart,
    FileText,
    Car,
    Bike,
    Plane,
    TrendingUp,
    ShieldCheck,
    CheckCircle2,
    AlertTriangle,
    Users,
    Home,
    Zap,
    Target,
    ArrowRight,
    Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/common/SEOHead";
import Link from 'next/link';

import { api } from '@/lib/api';
import { RichProductCard } from "@/components/products/RichProductCard";
import { RichProduct } from "@/types/rich-product";
import { InsuranceFilterSidebar, InsuranceFilterState } from "@/components/insurance/FilterSidebar";
import { ResponsiveFilterContainer } from "@/components/products/ResponsiveFilterContainer";

export default function InsurancePage() {
    const [protectionScore, setProtectionScore] = useState(0);
    const [hasCalculated, setHasCalculated] = useState(false);

    // Dynamic Data State
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter State
    const [filters, setFilters] = useState<InsuranceFilterState>({
        maxPremium: 50000,
        minCover: 5000000,
        insurers: [],
        policyTypes: []
    });

    // Simple quiz state
    const [answers, setAnswers] = useState({
        hasHealthInsurance: false,
        hasLifeInsurance: false,
        hasCarInsurance: false,
        hasDependents: false,
        hasHome: false
    });

    const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

    useEffect(() => {
        const loadAssets = async () => {
            try {
                // Fetch Insurance Products via Generic or specific
                 // @ts-ignore
                 const data = await api.entities.Insurance?.list() || [];
                 setAssets(data);
            } catch (err) {
                 // Fallback or silence
            } finally {
                setLoading(false);
            }
        };
        loadAssets();
    }, []);

    const handleCompareToggle = (id: string) => {
        setSelectedForCompare(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const calculateProtectionScore = () => {
        let score = 0;
        if (answers.hasHealthInsurance) score += 30;
        if (answers.hasLifeInsurance) score += 25;
        if (answers.hasCarInsurance) score += 15;
        if (answers.hasDependents && answers.hasLifeInsurance) score += 20;
        if (answers.hasHome) score += 10;
        
        setProtectionScore(score);
        setHasCalculated(true);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-primary-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreStatus = (score: number) => {
        if (score >= 80) return { text: 'Well Protected', color: 'emerald', icon: ShieldCheck };
        if (score >= 50) return { text: 'Moderately Protected', color: 'yellow', icon: AlertTriangle };
        return { text: 'Needs Urgent Attention', color: 'red', icon: AlertTriangle };
    };

    // Filter Logic
    const filteredAssets = assets.filter(asset => {
        const name = (asset.name || "").toLowerCase();
        const provider = (asset.provider_name || asset.provider || "").toLowerCase();
        const searchMatch = name.includes(searchTerm.toLowerCase()) || provider.includes(searchTerm.toLowerCase());
        
        // Insurer Filter
        const insurerMatch = filters.insurers.length === 0 || 
            filters.insurers.some(i => provider.includes(i.toLowerCase()));

        // Type Filter (metadata.type or from features)
        const type = (asset.metadata?.type || 'Term Life').toLowerCase();
        const typeMatch = filters.policyTypes.length === 0 ||
            filters.policyTypes.some(t => type.includes(t.toLowerCase()));

        // Premium Check (If available in features/metadata)
        // Ignored for now as unstructured

        return searchMatch && insurerMatch && typeMatch;
    });

    // Count active filters for mobile badge
    const activeFiltersCount = 
        (filters.insurers.length > 0 ? 1 : 0) + 
        (filters.policyTypes.length > 0 ? 1 : 0);

    // Transform to RichProduct
    const richProducts: RichProduct[] = filteredAssets.map(a => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        category: 'insurance',
        provider_name: a.provider || "Insurer",
        image_url: a.image_url,
        description: a.description || "",
        rating: {
           overall: a.rating || 4.0,
           trust_score: a.trust_score || 92,
           breakdown: {}
        },
        specs: {
           type: a.metadata?.type || 'Term Life'
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="Best Insurance Plans in India 2026 | Protection Score Analysis"
                description="Find out your Protection Score and compare life, health, car, and term insurance. Don't buy what you don't need."
            />

            {/* --- HERO SECTION --- */}
            <div className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32 bg-gradient-to-b from-blue-50 to-slate-50 dark:from-slate-900 dark:to-slate-950">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 dark:bg-secondary-500/20" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 dark:bg-primary-500/20" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        
                        {/* Hero Text */}
                        <div className="flex-1 text-center lg:text-left">
                            <Badge className="mb-6 px-4 py-1.5 bg-secondary-50 text-secondary-600 dark:bg-secondary-500/10 dark:text-secondary-400 border border-secondary-100 dark:border-secondary-500/20 font-semibold uppercase tracking-wide text-[11px] inline-flex items-center gap-2 rounded-full">
                                <Shield className="w-3.5 h-3.5" />
                                Smart Protection Planning
                            </Badge>
                            
                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white leading-[1.1]">
                                Buy Only What <br className="hidden lg:block" />
                                <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">You Need</span>
                            </h1>
                            
                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                                Take our <span className="font-semibold text-slate-900 dark:text-white">2-minute Protection Score</span> assessment 
                                to find your coverage gaps. Then compare 20+ insurers with zero spam.
                            </p>

                            <div className="relative group max-w-md mx-auto lg:mx-0 mb-8">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-500 group-focus-within:text-secondary-500 transition-colors" />
                                </div>
                                <Input
                                    placeholder="Search plans (e.g. 'HDFC Life', 'Health Insurance')..."
                                    className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-secondary-500 transition-all font-medium shadow-sm"
                                    value={searchTerm}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                />
                            </div>

                             <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-8">
                                {[
                                    { label: "Verified Insurers", value: "20+", icon: ShieldCheck },
                                    { label: "Claim Settlement", value: "95%", icon: CheckCircle2 },
                                    { label: "Avg. Savings", value: "₹14K/yr", icon: TrendingUp }
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

                        {/* Protection Score Widget */}
                        <div className="flex-1 w-full max-w-md lg:max-w-lg">
                            <Card className="rounded-[2.5rem] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-500/10 overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary-400 via-primary-600 to-secondary-500" />
                                
                                <CardHeader className="p-8 pb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Target className="w-5 h-5 text-secondary-500" />
                                            Protection Score
                                        </h3>
                                        {!hasCalculated && (
                                            <Badge variant="outline" className="text-xs">30 sec quiz</Badge>
                                        )}
                                    </div>
                                    {!hasCalculated ? (
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Answer these quick questions to see your coverage gaps
                                        </p>
                                    ) : (() => {
                                        const scoreStatus = getScoreStatus(protectionScore);
                                        const StatusIcon = scoreStatus.icon;
                                        return (
                                            <div className="text-center py-8">
                                                <div className={`text-7xl font-bold ${getScoreColor(protectionScore)} mb-4`}>
                                                    {protectionScore}
                                                    <span className="text-3xl">/100</span>
                                                </div>
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${scoreStatus.color}-100 dark:bg-${scoreStatus.color}-500/20`}>
                                                    <StatusIcon className={`w-4 h-4 text-${scoreStatus.color}-600 dark:text-${scoreStatus.color}-400`} />
                                                    <span className={`font-semibold text-${scoreStatus.color}-700 dark:text-${scoreStatus.color}-300 text-sm`}>
                                                        {scoreStatus.text}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </CardHeader>

                                {/* Quiz Content */}
                                <CardContent className="p-8 pt-0">
                                    {!hasCalculated ? (
                                        <div className="space-y-4">
                                            {[
                                                { key: 'hasHealthInsurance', label: 'Do you have Health Insurance?', icon: Heart },
                                                { key: 'hasLifeInsurance', label: 'Do you have Life/Term Insurance?', icon: Shield },
                                                { key: 'hasCarInsurance', label: 'Do you own a Car (insured)?', icon: Car },
                                                { key: 'hasDependents', label: 'Do you have financial dependents?', icon: Users },
                                                { key: 'hasHome', label: 'Do you own a Home?', icon: Home }
                                            ].map((q) => (
                                                <button
                                                    key={q.key}
                                                    onClick={() => setAnswers({...answers, [q.key]: !answers[q.key as keyof typeof answers]})}
                                                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                                        answers[q.key as keyof typeof answers]
                                                            ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-500/10'
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <q.icon className={`w-4 h-4 ${answers[q.key as keyof typeof answers] ? 'text-secondary-600 dark:text-secondary-400' : 'text-slate-400'}`} />
                                                        <span className={`text-sm font-medium ${answers[q.key as keyof typeof answers] ? 'text-secondary-900 dark:text-secondary-100' : 'text-slate-700 dark:text-slate-300'}`}>
                                                            {q.label}
                                                        </span>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                        answers[q.key as keyof typeof answers]
                                                            ? 'border-secondary-500 bg-secondary-500'
                                                            : 'border-slate-300 dark:border-slate-600'
                                                    }`}>
                                                        {answers[q.key as keyof typeof answers] && (
                                                            <CheckCircle2 className="w-3 h-3 text-white" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                            
                                            <Button 
                                                onClick={calculateProtectionScore}
                                                className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl mt-6"
                                            >
                                                Calculate My Score
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                             <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-3">Recommended Actions:</h4>
                                                <ul className="space-y-2">
                                                    {!answers.hasHealthInsurance && (
                                                        <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                                            <span><strong>Critical:</strong> Get Health Insurance immediately</span>
                                                        </li>
                                                    )}
                                                    {!answers.hasLifeInsurance && answers.hasDependents && (
                                                        <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                                                            <span><strong>Urgent:</strong> Term Insurance for family protection</span>
                                                        </li>
                                                    )}
                                                    {protectionScore >= 80 && (
                                                        <li className="flex items-start gap-2 text-sm text-primary-600 dark:text-primary-400">
                                                            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                                                            <span>You're well protected! Review policies annually.</span>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button className="flex-1 h-12 bg-secondary-600 hover:bg-secondary-700 text-white font-bold rounded-xl" onClick={() => setHasCalculated(false)}>
                                                    View Plans
                                                </Button>
                                                <Button variant="outline" className="h-12 border-slate-200 dark:border-slate-700" onClick={() => {
                                                    setHasCalculated(false);
                                                    setProtectionScore(0);
                                                    setAnswers({
                                                        hasHealthInsurance: false,
                                                        hasLifeInsurance: false,
                                                        hasCarInsurance: false,
                                                        hasDependents: false,
                                                        hasHome: false
                                                    });
                                                }}>
                                                    Retake Quiz
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT & WIDGETS --- */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
                 <div className="flex flex-col lg:flex-row gap-8 items-start">
                     
                     {/* Filter Sidebar */}
                    <ResponsiveFilterContainer activeFiltersCount={activeFiltersCount}>
                         <InsuranceFilterSidebar filters={filters} setFilters={setFilters} />
                         
                         <div className="hidden lg:block mt-8 space-y-6">
                            {/* Claim Settlement Widget */}
                            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white border-0 rounded-[2rem] overflow-hidden">
                                <CardContent className="p-6">
                                    <ShieldCheck className="w-8 h-8 text-primary-400 mb-4" />
                                    <h3 className="text-xl font-bold mb-2">95% Claim Ratio</h3>
                                    <p className="text-slate-400 text-sm mb-4">We only list insurers with proven track records.</p>
                                </CardContent>
                            </Card>
                         </div>
                    </ResponsiveFilterContainer>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                             <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Recommended Plans <span className="text-slate-400 font-medium text-sm ml-2">({filteredAssets.length})</span>
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
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No plans match filters</h3>
                                <p className="text-slate-500">Contact admin to add providers.</p>
                                <Button className="mt-4" variant="outline" asChild>
                                    <Link href="/admin/products">Admin: Add Plans</Link>
                                </Button>
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

            {/* --- EDUCATIONAL CONTENT HUB --- */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-secondary-50 text-secondary-700 border-secondary-100">Protection Academy</Badge>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Demystifying Insurance Claims</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Insurance is not an investment—it's risk management. Learn how to choose coverage that actually pays out.
                        </p>
                    </div>

                    {/* 1. Types of Insurance Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-24">
                        {[
                            { title: "Term Life", desc: "Pure protection for your family. High cover at low cost (₹1Cr cover for ₹500/mo). No returns, just security.", icon: Shield },
                            { title: "Health Insurance", desc: "Covers hospitalization and medical bills. Cashless treatment at network hospitals. Save tax under Sec 80D.", icon: Heart },
                            { title: "Motor Insurance", desc: "Mandatory by law (Third Party). Comprehensive plans cover own damage and theft. No Claim Bonus saves up to 50%.", icon: Car }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                    <item.icon className="w-6 h-6 text-secondary-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* 2. Visual Guide Placeholder (Canva) */}
                    <div className="bg-slate-900 rounded-[3rem] overflow-hidden relative mb-24 text-white">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="p-12 md:p-20 md:w-1/2 relative z-10">
                                <Badge className="mb-6 bg-secondary-500/20 text-secondary-300 border-secondary-500/30">Claim Process</Badge>
                                <h3 className="text-4xl font-bold mb-6">How to File a Cashless Claim</h3>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3"><CheckCircle2 className="text-secondary-400" /> Notify TPA at hospital desk (24-48 hrs before planned)</li>
                                    <li className="flex items-center gap-3"><CheckCircle2 className="text-secondary-400" /> Submit pre-auth form with doctor's ID</li>
                                    <li className="flex items-center gap-3"><CheckCircle2 className="text-secondary-400" /> Insurer approves amount directly to hospital</li>
                                </ul>
                                <Button className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold h-12 px-8 rounded-xl">
                                    Find Network Hospitals
                                </Button>
                            </div>
                            <div className="md:w-1/2 bg-slate-800/50 h-[400px] md:h-full flex items-center justify-center border-l border-slate-700 border-dashed">
                                {/* PLACEHOLDER FOR CANVA IMAGE */}
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-500">
                                        <span className="text-xs text-slate-400 font-mono">IMAGE</span>
                                    </div>
                                    <p className="text-slate-400 font-mono text-sm">Use Content Injection<br/>"Cashless Claim Flowchart"</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. FAQ Accordion */}
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-center mb-10 text-slate-900 dark:text-white">Questions We Get Asked</h3>
                        <div className="space-y-4">
                            {[
                                { q: "What is the difference between Term and Life Insurance?", a: "Term insurance is a pure risk cover that pays your family only upon death. Life insurance (Endowment/ULIP) mixes investment with insurance, usually offering lower cover and lower returns. We recommend Term + Mutual Funds separately." },
                                { q: "Does health insurance cover dental?", a: "Most basic health plans in India do NOT cover dental unless it requires hospitalization (e.g., accident). Some premium OPD plans cover it up to a limit." },
                                { q: "Will my claim be rejected if I smoke?", a: "Only if you lied about it in your application. Always declare your smoking habits. Your premium might increase by 20%, but your claim will be honored." }
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

        </div>
    );
}
