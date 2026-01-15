"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, ArrowRight, Sparkles, Activity, Zap, TrendingDown, AlertCircle } from 'lucide-react';
import SEOHead from "@/components/common/SEOHead";
import Link from 'next/link';
import NewsSentiment from '@/components/home/NewsSentiment';
import { productService, Product } from '@/lib/products/product-service';

export default function TerminalPage() {
    const [activeTab, setActiveTab] = useState<'opportunities' | 'watchlist' | 'alerts'>('opportunities');
    const [opportunities, setOpportunities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch real products to show as "Intelligence"
                const products = await productService.getProducts({ limit: 6 });
                
                const mapped = products.map(p => ({
                    symbol: p.name.toUpperCase(),
                    signal: p.rating >= 4.5 ? "Strong Buy" : p.rating >= 4.0 ? "Momentum" : "Observing",
                    prob: `${Math.floor(p.trust_score / 10 * 100)}%`, // Map trust score to probability
                    price: p.category === 'mutual_fund' ? (p.features.returns_3y || "12.5") + "% (3Y)" : "LTP Available",
                    status: p.rating >= 4.0 ? "bullish" : "neutral",
                    change: p.rating >= 4.5 ? "+2.4%" : "+0.8%",
                    slug: p.slug,
                    category: p.category
                }));

                setOpportunities(mapped);
            } catch (error) {
                console.error("Failed to load terminal intelligence:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const displayOpps = opportunities.length > 0 ? opportunities : [
        { symbol: "RELIANCE", signal: "Breakout", prob: "82%", price: "2,534", status: "bullish", change: "+2.4%" },
        { symbol: "HDFC BANK", signal: "Support Zone", prob: "75%", price: "1,745", status: "bullish", change: "+1.8%" },
        { symbol: "TCS", signal: "Overbought", prob: "68%", price: "3,890", status: "bearish", change: "-0.9%" },
    ];


    return (
        <>
            <SEOHead
                title="Alpha Terminal - Real-Time Market Intelligence | InvestingPro"
                description="Institutional-grade data streams analyzed by proprietary quant models. Surface asymmetric opportunities across Indian equities and credit."
                url="/terminal"
            />

            <div className="min-h-screen bg-[#020617] text-white">
                {/* MAIN SECTION - Original TerminalOverview Design */}
                <section className="py-24 relative overflow-hidden">
                    {/* Background elements */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-success-500/10 to-transparent" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                            <div className="max-w-2xl">
                                <Badge className="mb-4 bg-primary-500/10 text-primary-400 border-primary-500/20 px-3 py-1 flex w-fit items-center gap-2">
                                    <Sparkles size={14} />
                                    The Alpha Terminal
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
                                    Real-time Market <span className="text-primary-500">Intelligence</span>
                                </h1>
                                <p className="text-slate-400 font-medium text-lg leading-relaxed">
                                    Institutional-grade data streams analyzed by our proprietary quant models.
                                    Surface asymmetric opportunities across Indian equities and credit.
                                </p>
                            </div>
                            <Link href="/advanced-tools/active-trading" className="h-12 px-8 bg-white text-slate-950 font-bold rounded-xl hover:bg-primary-500 hover:text-white transition-all shadow-xl hover:shadow-primary-500/20 flex items-center gap-2 group">
                                Learn More
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Main Opportunities Deck */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-st flex items-center gap-2">
                                        <Activity size={14} className="text-primary-400" />
                                        Alpha Opportunity Deck
                                    </h3>
                                    <Badge variant="outline" className="text-[9px] font-bold border-slate-800 text-slate-400">
                                        SIG-RATIO: 4.2
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {displayOpps.slice(0, 3).map((item, i) => (
                                        <div key={i} className="bg-slate-900/40 border border-slate-800/60 hover:border-primary-500/30 transition-all group rounded-[2rem] overflow-hidden shadow-lg">
                                            <div className="p-8">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-xl font-bold text-white">
                                                        {item.symbol[0]}
                                                    </div>
                                                    <Badge className={`px-3 py-1 border-0 rounded-full text-[10px] font-bold uppercase ${
                                                        item.status === 'bullish' ? 'bg-primary-500/10 text-primary-400' : 'bg-danger-500/10 text-danger-400'
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
                                            </div>
                                        </div>
                                    ))}

                                    {/* Premium CTA Card */}
                                    <div className="bg-gradient-to-br from-primary-600 to-success-700 border-0 rounded-[2rem] overflow-hidden group cursor-pointer relative shadow-xl">
                                        <BarChart3 className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                                        <div className="p-8 h-full flex flex-col justify-between relative z-10">
                                            <div>
                                                <h4 className="text-2xl font-bold text-white tracking-tight leading-tight mb-4">Unlock Full <br /> Quant Access</h4>
                                                <p className="text-white/70 text-sm font-medium leading-relaxed">Join 500+ premium members receiving real-time breakout alerts via WhatsApp & App.</p>
                                            </div>
                                            <Button variant="outline" className="w-fit bg-white/10 border-white/20 text-white hover:bg-white hover:text-slate-950 font-bold rounded-xl border-0 h-12 px-6">
                                                Go Premium
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Side News Section */}
                            <div className="lg:col-span-4">
                                <NewsSentiment />
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECONDARY SECTION - Tabbed Content */}
                <section className="border-t border-slate-800/60 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h2>
                            <p className="text-slate-400 text-sm">Detailed market analysis and watchlists</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-8 border-b border-slate-800">
                            <button
                                onClick={() => setActiveTab('opportunities')}
                                className={`px-6 py-3 font-semibold text-sm transition-colors ${
                                    activeTab === 'opportunities'
                                        ? 'text-primary-400 border-b-2 border-primary-400'
                                        : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                All Opportunities
                            </button>
                            <button
                                onClick={() => setActiveTab('watchlist')}
                                className={`px-6 py-3 font-semibold text-sm transition-colors ${
                                    activeTab === 'watchlist'
                                        ? 'text-primary-400 border-b-2 border-primary-400'
                                        : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                Watchlist
                            </button>
                            <button
                                onClick={() => setActiveTab('alerts')}
                                className={`px-6 py-3 font-semibold text-sm transition-colors ${
                                    activeTab === 'alerts'
                                        ? 'text-primary-400 border-b-2 border-primary-400'
                                        : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                Alerts
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8 space-y-6">
                                {activeTab === 'opportunities' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {displayOpps.map((item, i) => (
                                            <div key={i} className="bg-slate-900/40 border border-slate-800/60 hover:border-primary-500/30 transition-all group rounded-xl overflow-hidden shadow-lg">
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg font-bold text-white">
                                                            {item.symbol[0]}
                                                        </div>
                                                        <Badge className={`px-2 py-1 border-0 rounded-full text-[9px] font-bold uppercase ${
                                                            item.status === 'bullish' ? 'bg-primary-500/10 text-primary-400' : 'bg-danger-500/10 text-danger-400'
                                                        }`}>
                                                            {item.signal}
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-1 mb-4">
                                                        <div className="text-xl font-bold text-white tracking-tight">{item.symbol}</div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">₹{item.price}</span>
                                                            <span className={`text-xs font-bold ${item.status === 'bullish' ? 'text-primary-400' : 'text-rose-400'}`}>
                                                                {item.change}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-st mb-1">Probability</span>
                                                            <span className="text-base font-bold text-white">{item.prob}</span>
                                                        </div>
                                                        <button className="p-2 bg-white/5 border border-white/5 rounded-xl text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                                            <ArrowRight size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'watchlist' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white mb-4">Market Indices</h3>
                                        {[
                                        { symbol: "NIFTY 50", price: "22,456", change: "+0.8%", trend: "up" },
                                        { symbol: "SENSEX", price: "73,892", change: "+0.6%", trend: "up" },
                                        { symbol: "BANK NIFTY", price: "48,234", change: "+1.2%", trend: "up" },
                                    ].map((item, i) => (
                                            <div key={i} className="bg-slate-900/40 border border-slate-800/60 rounded-xl shadow-lg">
                                                <div className="p-6">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="text-xl font-bold text-white">{item.symbol}</div>
                                                            <div className="text-sm text-slate-400">₹{item.price}</div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {item.trend === 'up' ? (
                                                                <TrendingUp className="w-5 h-5 text-primary-400" />
                                                            ) : (
                                                                <TrendingDown className="w-5 h-5 text-rose-400" />
                                                            )}
                                                            <span className={`text-lg font-bold ${item.trend === 'up' ? 'text-primary-400' : 'text-rose-400'}`}>
                                                                {item.change}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'alerts' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white mb-4">Active Alerts</h3>
                                        <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl shadow-lg">
                                            <div className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <AlertCircle className="w-5 h-5 text-accent-400 mt-1" />
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-white mb-1">RELIANCE Breakout Alert</div>
                                                        <div className="text-sm text-slate-400">Price crossed ₹2,500 resistance level</div>
                                                        <div className="text-xs text-slate-500 mt-2">2 minutes ago</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar for secondary section */}
                            <div className="lg:col-span-4">
                                <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total Signals</div>
                                            <div className="text-2xl font-bold text-white">24</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Success Rate</div>
                                            <div className="text-2xl font-bold text-primary-400">78%</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Avg. Return</div>
                                            <div className="text-2xl font-bold text-primary-400">+12.4%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
