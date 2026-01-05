"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, ArrowRight, Sparkles, Activity } from 'lucide-react';
import NewsSentiment from './NewsSentiment';

const opportunities = [
    { symbol: "RELIANCE", signal: "Breakout", prob: "82%", price: "2,534", status: "bullish" },
    { symbol: "HDFC BANK", signal: "Support Zone", prob: "75%", price: "1,745", status: "bullish" },
    { symbol: "TCS", signal: "Overbought", prob: "68%", price: "3,890", status: "bearish" },
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
                            The Alpha Terminal
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
                            Real-time Market <span className="text-primary-500">Intelligence</span>
                        </h2>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed">
                            Institutional-grade data streams analyzed by our proprietary quant models.
                            Surface asymmetric opportunities across Indian equities and credit.
                        </p>
                    </div>
                    <Link href="/advanced-tools/active-trading" className="h-12 px-8 bg-white text-slate-950 font-bold rounded-xl hover:bg-primary-500 hover:text-white transition-all shadow-xl hover:shadow-indigo-500/20 flex items-center gap-2 group">
                        Learn More
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Opportunities Deck */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-st flex items-center gap-2">
                                <Activity size={14} className="text-emerald-400" />
                                Alpha Opportunity Deck
                            </h3>
                            <Badge variant="outline" className="text-[9px] font-bold border-slate-800 text-slate-400">SIG-RATIO: 4.2</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {opportunities.map((item, i) => (
                                <Card key={i} className="bg-slate-900/40 border-slate-800/60 hover:border-emerald-500/30 transition-all group rounded-[2rem] overflow-hidden">
                                    <CardContent className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-xl font-bold text-white">
                                                {item.symbol[0]}
                                            </div>
                                            <Badge className={`px-3 py-1 border-0 rounded-full text-[10px] font-bold uppercase ${item.status === 'bullish' ? 'bg-primary-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                                }`}>
                                                {item.signal}
                                            </Badge>
                                        </div>

                                        <div className="space-y-1 mb-6">
                                            <div className="text-2xl font-bold text-white tracking-tight">{item.symbol}</div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">LTP: ₹{item.price}</div>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-st mb-1">Probability</span>
                                                <span className="text-lg font-bold text-white">{item.prob}</span>
                                            </div>
                                            <Link href="/advanced-tools/active-trading" className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 border-0 rounded-[2rem] overflow-hidden group cursor-pointer relative">
                                <BarChart3 className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                                <CardContent className="p-8 h-full flex flex-col justify-between relative z-10">
                                    <div>
                                        <h4 className="text-2xl font-bold text-white tracking-tight leading-tight mb-4">Advanced <br /> Trading Tools</h4>
                                        <p className="text-white/70 text-sm font-medium leading-relaxed">Access real-time market intelligence and quantitative analysis tools.</p>
                                    </div>
                                    <Link href="/advanced-tools/active-trading">
                                        <Button variant="outline" className="w-fit bg-white/10 border-white/20 text-white hover:bg-white hover:text-slate-950 font-bold rounded-xl border-0 h-12 px-6">
                                            Explore Tools
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
