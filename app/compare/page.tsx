"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";
import SEOHead from "@/components/common/SEOHead";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import {
    CheckCircle2,
    XCircle,
    Star,
    TrendingUp,
    ArrowRight,
    Info,
    ShieldCheck,
    AlertCircle
} from "lucide-react";
import Link from 'next/link';

function CompareContent() {
    const searchParams = useSearchParams();
    const type = searchParams?.get('type') || 'mutual-funds';
    const ids = searchParams?.get('ids')?.split(',') || [];
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, [ids.join(',')]);

    const loadItems = async () => {
        setLoading(true);
        try {
            if (type === 'mutual-funds' && ids.length > 0) {
                const funds = await Promise.all(ids.map(id =>
                    api.entities.MutualFund.filter({ id }).then(r => r[0])
                ));
                setItems(funds.filter(Boolean));
            }
        } catch (error) {
            logger.error('Error loading comparison items', error as Error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner text="Analyzing products..." />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <div className="bg-slate-100 p-6 rounded-3xl mb-6">
                    <AlertCircle className="w-12 h-12 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No Items Selected</h2>
                <p className="text-slate-600 mb-8 text-center max-w-md">Choose at least two mutual funds or products to see a side-by-side comparison of their performance and features.</p>
                <Link href="/mutual-funds">
                    <Button className="rounded-full px-8 bg-teal-600 hover:bg-teal-700">
                        Browse Mutual Funds
                    </Button>
                </Link>
            </div>
        );
    }

    const comparisonRows: Array<{ label: string; key: string; render?: (val: any) => React.ReactNode }> = [
        {
            label: 'InvestingPro Rating', key: 'rating', render: (val: number) => (
                <div className="flex flex-col items-center gap-1">
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < (val || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{val || 0}/5 SCORE</span>
                </div>
            )
        },
        {
            label: 'Risk Profile', key: 'risk', render: (val: string) => (
                <Badge className={`rounded-full px-3 py-1 border-0 ${val?.toLowerCase().includes('high') ? 'bg-rose-100 text-rose-700' :
                    val?.toLowerCase().includes('low') ? 'bg-emerald-100 text-emerald-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>
                    {val}
                </Badge>
            )
        },
        {
            label: '1Y Returns', key: 'returns_1y', render: (val: number) => (
                <span className={`font-bold ${val >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {val >= 0 ? '+' : ''}{val}%
                </span>
            )
        },
        {
            label: '3Y Returns', key: 'returns_3y', render: (val: number) => (
                <span className={`font-bold ${val >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {val >= 0 ? '+' : ''}{val}%
                </span>
            )
        },
        {
            label: '5Y Returns', key: 'returns_5y', render: (val: number) => (
                <span className={`font-bold ${val >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {val >= 0 ? '+' : ''}{val}%
                </span>
            )
        },
        { label: 'AUM (Asset Size)', key: 'aum', render: (val: string) => <span className="font-bold text-slate-700">₹{val}</span> },
        {
            label: 'Expense Ratio', key: 'expense_ratio', render: (val: number) => (
                <div className="flex flex-col items-center">
                    <span className="font-bold text-slate-700">{val}%</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Lower is Better</span>
                </div>
            )
        },
        { label: 'Min Investment', key: 'min_investment', render: (val: string) => <span className="font-bold text-slate-700">₹{val}</span> },
        { label: 'Exit Load', key: 'exit_load' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-16">
            <SEOHead
                title={`Compare ${items.map(i => i.name).join(' vs ')} | InvestingPro`}
                description={`Side-by-side comparison of ${items.map(i => i.name).join(', ')}. Compare returns, fees, ratings and more.`}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <Badge className="mb-4 bg-teal-100 text-teal-700 border-0 uppercase tracking-widest text-[10px] font-bold py-1 px-3">Expert Analysis</Badge>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Product Comparison</h1>
                        <p className="text-slate-500 mt-2 font-medium">Detailed side-by-side analysis of your selected financial products.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-full bg-white border-slate-200">
                            Share Comparison
                        </Button>
                        <Button className="rounded-full bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-500/20">
                            Add More Products
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-900">
                                    <th className="p-8 text-left font-bold text-white/50 sticky left-0 bg-slate-900 z-20 text-xs uppercase tracking-[0.2em] border-r border-white/5">Parameter</th>
                                    {items.map((item, idx) => (
                                        <th key={idx} className={`p-8 min-w-[280px] border-r border-white/5 last:border-0 ${idx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800'}`}>
                                            <div className="text-left">
                                                <Badge className="mb-3 bg-teal-500 text-white border-0 text-[10px] font-bold">#{idx + 1} Choice</Badge>
                                                <p className="font-extrabold text-white text-xl leading-tight mb-2">{item.name}</p>
                                                <p className="text-sm text-slate-400 font-bold uppercase tracking-tighter">{item.fund_house || item.bank}</p>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row, idx) => (
                                    <tr key={idx} className="group transition-colors border-b border-slate-50 last:border-0">
                                        <td className="p-6 font-bold text-slate-500 text-sm italic sticky left-0 bg-white z-20 border-r border-slate-50 group-hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-2">
                                                {row.label}
                                                <Info className="w-3.5 h-3.5 text-slate-300" />
                                            </div>
                                        </td>
                                        {items.map((item, itemIdx) => (
                                            <td key={itemIdx} className={`p-6 text-center group-hover:bg-slate-50 transition-colors border-r border-slate-50 last:border-0 ${itemIdx % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                                                <div className="py-2">
                                                    {row.render ? row.render(item[row.key] as any) : (
                                                        <span className="font-bold text-slate-700">{item[row.key] || 'N/A'}</span>
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                                {/* Action Row */}
                                <tr className="bg-slate-50/50">
                                    <td className="p-6 italic font-bold text-slate-400 text-sm sticky left-0 bg-slate-50 z-20 border-r border-slate-100">Recommended Action</td>
                                    {items.map((item, idx) => (
                                        <td key={idx} className="p-6 text-center border-r border-slate-100 last:border-0">
                                            <Link href={`/${type === 'mutual-funds' ? 'mutual-funds' : 'product'}/${item.id}`}>
                                                <Button className="w-full rounded-xl bg-slate-900 hover:bg-teal-600 text-white transition-all font-bold">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Comparison Insight */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <Card className="rounded-3xl border-0 shadow-sm bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
                        <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
                        <CardContent className="p-8 relative z-10">
                            <h3 className="font-bold text-lg mb-2">Editor's Verification</h3>
                            <p className="text-sm text-emerald-50 mb-4 opacity-90">All data points compared here are verified against official SEBI and Fund House disclosures as of Dec 2024.</p>
                        </CardContent>
                    </Card>
                    <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-xl text-slate-900 mb-1">Confused which one to pick?</h3>
                            <p className="text-slate-500">Get a personalized recommendation based on your risk profile and goal period.</p>
                        </div>
                        <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50 font-bold px-6">
                            Ask AI Advisor
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ComparePage() {
    return (
        <Suspense fallback={<LoadingSpinner text="Initializing comparison tool..." />}>
            <CompareContent />
        </Suspense>
    );
}
