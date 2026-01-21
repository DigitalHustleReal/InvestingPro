"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, ArrowRight, Sparkles, Target } from 'lucide-react';
import NewsSentiment from './NewsSentiment';

// Personal Finance focused opportunities - Mutual Funds, SIPs, and Financial Products
const wealthOpportunities = [
    { category: "Large Cap Funds", performance: "12.8%", period: "3Y Returns", rating: "Excellent", type: "growth" },
    { category: "Tax Saver ELSS", performance: "15.2%", period: "5Y Returns", rating: "Outstanding", type: "growth" },
    { category: "Debt Funds", performance: "7.4%", period: "Stable Returns", rating: "Reliable", type: "stable" },
];

export default function TerminalOverview() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary-500/10 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <Badge className="mb-4 bg-primary-500/10 text-primary-400 border-primary-500/20 px-3 py-1 flex w-fit items-center gap-2">
                            <Sparkles size={14} />
                            Featured Tools
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
                            Smart Product <span className="text-primary-500">Comparison</span>
                        </h2>
                        <p className="text-slate-600 font-medium text-lg leading-relaxed">
                            Expert-driven analysis and transparent comparisons across credit cards, loans, and insurance.
                            Find the best financial products tailored to your needs.
                        </p>
                    </div>
                    <Link href="/calculators" className="h-12 px-8 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-xl hover:shadow-primary-500/20 flex items-center gap-2 group">
                        Explore Tools
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Wealth Discovery Deck */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Target size={14} className="text-primary-400" />
                                Wealth Discovery Insights
                            </h3>
                            <Badge variant="outline" className="text-[9px] font-bold border-slate-300 text-slate-600">UPDATED DAILY</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {wealthOpportunities.map((item, i) => (
                                <Card key={i} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-500 hover:shadow-xl transition-all group rounded-xl overflow-hidden">
                                    <CardContent className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-xl font-bold text-primary-600 dark:text-primary-400">
                                                {item.category[0]}
                                            </div>
                                            <Badge className={`px-3 py-1 border-0 rounded-full text-[10px] font-bold uppercase ${item.type === 'growth' ? 'bg-success-100 text-success-700' : 'bg-primary-100 text-primary-700'
                                                }`}>
                                                {item.rating}
                                            </Badge>
                                        </div>

                                        <div className="space-y-1 mb-6">
                                            <div className="text-2xl font-bold text-slate-900 tracking-tight">{item.category}</div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.period}</div>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Performance</span>
                                                <span className="text-lg font-bold text-primary-600">{item.performance}</span>
                                            </div>
                                            <Link href="/mutual-funds" className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500 transition-all">
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <Card className="bg-gradient-to-br from-primary-600 to-primary-800 border-0 rounded-xl overflow-hidden group cursor-pointer relative">
                                <BarChart3 className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                                <CardContent className="p-8 h-full flex flex-col justify-between relative z-10">
                                    <div>
                                        <h4 className="text-2xl font-bold text-white tracking-tight leading-tight mb-4">Financial <br /> Planning Tools</h4>
                                        <p className="text-white/80 text-sm font-medium leading-relaxed">Access expert calculators and comparison tools for smarter financial decisions.</p>
                                    </div>
                                    <Link href="/calculators">
                                        <Button variant="outline" className="w-fit bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary-900 font-bold rounded-xl border-0 h-12 px-6">
                                            View All Tools
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Side News Section */}
                    <div className="lg:col-span-4">
                        <NewsSentiment />
                    </div>
                </div>
            </div>
        </section>
    );
}
