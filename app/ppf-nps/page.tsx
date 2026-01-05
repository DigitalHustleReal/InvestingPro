"use client";

import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    PiggyBank,
    Shield,
    TrendingUp,
    Calculator,
    Clock,
    IndianRupee,
    Check,
    ArrowRight,
    Building2,
    Lock,
    Zap,
    Activity,
    ArrowUpRight,
    ShieldCheck,
    Target
} from "lucide-react";

export default function PPFandNPSPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <SEOHead
                title="PPF & NPS: High-Integrity Retirement Systems | InvestingPro"
                description="Compare PPF and NPS. Strategic retirement planning with government-backed security and market-linked alpha."
            />

            {/* Authority Hero Section */}
            <div className="bg-slate-900 border-b border-white/5 pt-28 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-secondary-600 rounded-full blur-[140px] -translate-y-1/2" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary-600 rounded-full blur-[100px] translate-y-1/2" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 bg-secondary-500/10 backdrop-blur-md rounded-full px-4 py-2 border border-secondary-500/20">
                            <ShieldCheck className="w-4 h-4 text-secondary-400" />
                            <span className="text-secondary-400 font-semibold text- uppercase tracking-[0.2em]">Sovereign Guaranteed Assets</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
                            Retirement <span className="text-secondary-400">Tactics</span>: PPF & NPS
                        </h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed">
                            Strategic deployment into EEE-status savings and market-linked pension systems. Build your multi-generational wealth fortress.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
                        {[
                            { icon: Lock, label: "Security", value: "Sovereign" },
                            { icon: Zap, label: "Tax Shield", value: "80C + 80CCD" },
                            { icon: Target, label: "Objective", value: "Retirement" },
                            { icon: Activity, label: "Returns", value: "Benchmark+" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 group hover:border-secondary-500/50 transition-colors">
                                <item.icon className="w-5 h-5 text-secondary-400 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-st leading-none mb-1">{item.label}</p>
                                    <p className="text-sm font-bold text-white">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <Tabs defaultValue="ppf" className="space-y-12">
                    <TabsList className="bg-white p-2 rounded-[2rem] shadow-2xl border border-slate-100 flex h-auto max-w-fit mx-auto lg:mx-0">
                        <TabsTrigger value="ppf" className="rounded-3xl px-10 py-5 font-semibold uppercase tracking-widest text- data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
                            <PiggyBank className="w-4 h-4 mr-2" />
                            Public Provident Fund (PPF)
                        </TabsTrigger>
                        <TabsTrigger value="nps" className="rounded-3xl px-10 py-5 font-semibold uppercase tracking-widest text- data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            National Pension System (NPS)
                        </TabsTrigger>
                    </TabsList>

                    {/* PPF Content */}
                    <TabsContent value="ppf" className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <Card className="rounded-[3rem] border-0 shadow-2xl bg-white overflow-hidden p-6 md:p-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-secondary-50 flex items-center justify-center text-secondary-600">
                                            <ShieldCheck className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">The PPF Fortress</h2>
                                            <p className="text-slate-500 font-medium">Ultra-safe, sovereign savings vehicle</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                                        {[
                                            { label: "Interest Rate", value: "7.1%", sub: "P.A. (Tax Free)", icon: IndianRupee, color: "text-secondary-600", bg: "bg-secondary-50" },
                                            { label: "Lock-in Period", value: "15 Yrs", sub: "Extendable by 5", icon: Clock, color: "text-primary-600", bg: "bg-secondary-50" },
                                            { label: "Tax Benefit", value: "EEE", sub: "80C Status", icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50" },
                                        ].map((stat, i) => (
                                            <div key={i} className={`p-6 rounded-3xl ${stat.bg} border border-transparent hover:border-white/50 transition-all`}>
                                                <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-st mb-1">{stat.label}</p>
                                                <p className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                                                <p className="text-[11px] font-bold text-slate-500 opacity-60 uppercase">{stat.sub}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Strategic Advantages</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {[
                                                "Complete Immunity from Market Volatility",
                                                "Tax-free Compounding (Exempt-Exempt-Exempt)",
                                                "Asset Protection from Legal Attachment",
                                                "Partial Liquidity after 7th Financial Year",
                                                "Loan availability after 3rd Fiscal Year",
                                                "Seamless Bank & Post Office Portability"
                                            ].map((feature, index) => (
                                                <div key={index} className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                                                    <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center shrink-0 text-[10px]"><Check className="w-3 h-3" /></div>
                                                    <span className="text-sm font-bold text-slate-700 leading-tight">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>

                                <Card className="rounded-[3rem] border-0 shadow-2xl bg-white p-6 md:p-8">
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-8">Deployment Protocol</h3>
                                    <div className="space-y-4">
                                        {[
                                            { step: "01", title: "Institutional Selection", desc: "Open via major banks (SBI, HDFC, ICICI) or Indian Post Office network." },
                                            { step: "02", title: "KYC Authorization", desc: "Submit Digital Aadhaar, PAN, and valid residency proofs for verification." },
                                            { step: "03", title: "Initial Capital Infusion", desc: "Minimum deposit of ₹500 required to activate the long-term compounding cycle." },
                                            { step: "04", title: "Strategic Automation", desc: "Set up monthly standing instructions to maximize compounding before 5th of each month." },
                                        ].map((item, index) => (
                                            <div key={index} className="flex gap-6 p-6 hover:bg-slate-50 rounded-3xl transition-colors border border-transparent hover:border-slate-100">
                                                <div className="text-4xl font-semibold text-slate-100 group-hover:text-secondary-100 transition-colors uppercase tracking-st">
                                                    {item.step}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 tracking-tight mb-1">{item.title}</h4>
                                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* Calculator Sidebar */}
                            <div className="space-y-8">
                                <Card className="rounded-[3rem] border-0 shadow-2xl bg-slate-900 text-white p-6 md:p-8 sticky top-28 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-8">
                                            <Calculator className="w-6 h-6 text-secondary-400" />
                                            <h3 className="text-xl font-bold tracking-tight">Compounding Logic</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-st mb-2">Maximized Allocation Projection</p>
                                                <p className="text-4xl font-bold text-white tracking-tight mb-1">₹40.68 L</p>
                                                <p className="text-[11px] font-bold text-slate-500 italic">Investing ₹1.5L/yr for 15 years @ 7.1%</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-st mb-1">Capital Invested</p>
                                                    <p className="text-lg font-bold text-secondary-400">₹22.5 L</p>
                                                </div>
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-st mb-1">Wealth Created</p>
                                                    <p className="text-lg font-bold text-emerald-400">₹18.18 L</p>
                                                </div>
                                            </div>

                                            <Button className="w-full h-14 rounded-2xl bg-white text-slate-900 hover:bg-secondary-500 hover:text-white font-semibold uppercase tracking-widest text- transition-all">
                                                Open PPF Terminal
                                                <ArrowUpRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* NPS Content */}
                    <TabsContent value="nps" className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <Card className="rounded-[3rem] border-0 shadow-2xl bg-white overflow-hidden p-6 md:p-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                                            <TrendingUp className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Modern Pension Utility</h2>
                                            <p className="text-slate-500 font-medium">Yield optimization via Market Assets</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                                        {[
                                            { label: "Avg Returns", value: "9-12%", sub: "10Y Benchmark", icon: TrendingUp, color: "text-primary-600", bg: "bg-primary-50" },
                                            { label: "Exit Maturity", value: "60 Yrs", sub: "Retirement Goal", icon: Target, color: "text-primary-600", bg: "bg-secondary-50" },
                                            { label: "Tier-1 Deduction", value: "₹2.0L", sub: "80C + 80CCD(1B)", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
                                        ].map((stat, i) => (
                                            <div key={i} className={`p-6 rounded-3xl ${stat.bg} border border-transparent hover:border-white/50 transition-all`}>
                                                <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-st mb-1">{stat.label}</p>
                                                <p className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                                                <p className="text-[11px] font-bold text-slate-500 opacity-60 uppercase">{stat.sub}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-10">
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Tax Optimization Matrix</h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="p-6 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                                                <h4 className="text-[10px] font-semibold uppercase text-slate-500 tracking-st mb-3">Core Deduction (80CCD)</h4>
                                                <p className="text-2xl font-bold tracking-tight mb-2">₹1,50,000</p>
                                                <p className="text-sm text-slate-400 font-medium leading-relaxed">Integrated within the shared Section 80C umbrella for annual exemptions.</p>
                                            </div>
                                            <div className="p-6 bg-primary-600 text-white rounded-[2.5rem] relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                                                <h4 className="text-[10px] font-semibold uppercase text-primary-200 tracking-st mb-3">Exclusive Add-on (80CCD-1B)</h4>
                                                <p className="text-2xl font-bold tracking-tight mb-2">₹50,000</p>
                                                <p className="text-sm text-primary-100 font-medium leading-relaxed">Unique sovereign benefit available only for NPS contributors above the 80C cap.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Dynamic Asset Categories</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { name: "Equity (E)", desc: "Market Linked", color: "bg-rose-50 text-rose-600", border: 'border-rose-100' },
                                            { name: "Corp Bond (C)", desc: "Fixed Yield", color: "bg-secondary-50 text-primary-600", border: 'border-secondary-100' },
                                            { name: "Gov Bond (G)", desc: "Zero Risk", color: "bg-emerald-50 text-emerald-600", border: 'border-emerald-100' },
                                            { name: "Alt Assets (A)", desc: "Global Real Estate", color: "bg-secondary-50 text-secondary-600", border: 'border-secondary-100' },
                                        ].map((asset, index) => (
                                            <div key={index} className={`p-4 rounded-3xl ${asset.color} border ${asset.border} text-center`}>
                                                <p className="text-xs font-semibold uppercase tracking-st mb-1">{asset.name}</p>
                                                <p className="text-[10px] font-bold opacity-70 uppercase">{asset.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="rounded-[3rem] border-0 shadow-2xl bg-white p-6 md:p-8">
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-8">Performance Leaderboard (Tier-I)</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {[
                                            { name: "HDFC Pension Management", returns: "11.5%", aum: "₹45K Cr" },
                                            { name: "SBI Pension Fund", returns: "11.2%", aum: "₹2.1L Cr" },
                                            { name: "ICICI Pru Pension Fund", returns: "11.1%", aum: "₹32K Cr" },
                                            { name: "LIC Pension Fund", returns: "10.8%", aum: "₹1.4L Cr" },
                                        ].map((fund, index) => (
                                            <div key={index} className="p-6 border border-slate-100 rounded-[2rem] hover:bg-slate-50 transition-colors group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="font-bold text-slate-900 tracking-tight leading-tight max-w-[120px]">{fund.name}</h4>
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-0 rounded-lg text-[9px] font-bold uppercase">{fund.returns}</Badge>
                                                </div>
                                                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Verified AUM</span>
                                                    <span className="text-xs font-bold text-slate-900">{fund.aum}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* NPS Calculator */}
                            <div className="space-y-8">
                                <Card className="rounded-[3rem] border-0 shadow-2xl bg-slate-900 text-white p-6 md:p-8 sticky top-28 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-8">
                                            <Calculator className="w-6 h-6 text-primary-400" />
                                            <h3 className="text-xl font-bold tracking-tight">Pension Estimator</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-st mb-2">Projected Maturity (Age 60)</p>
                                                <p className="text-4xl font-bold text-white tracking-tight mb-1">₹1.76 Cr</p>
                                                <p className="text-[11px] font-bold text-slate-500 italic">₹10k/mo from age 30 @ 10% returns</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-st mb-1">Monthly Pension</p>
                                                    <p className="text-lg font-bold text-primary-400">₹52.8k</p>
                                                </div>
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-st mb-1">Tax-Free Lump</p>
                                                    <p className="text-lg font-bold text-emerald-400">₹70.4 L</p>
                                                </div>
                                            </div>

                                            <Button className="w-full h-14 rounded-2xl bg-white text-slate-900 hover:bg-primary-500 hover:text-white font-semibold uppercase tracking-widest text- transition-all">
                                                Initiate PRAN Enrollment
                                                <ArrowUpRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Head-to-Head Comparison */}
                <Card className="mt-20 rounded-[3rem] border-0 shadow-2xl bg-white overflow-hidden p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Sovereign Benchmark Review</h3>
                                <p className="text-slate-500 font-medium text-sm">PPF vs NPS Compatibility Analysis</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-6 text-[11px] font-semibold text-slate-400 uppercase tracking-st">Asset Parameters</th>
                                    <th className="pb-6 text-[11px] font-semibold text-secondary-600 uppercase tracking-st text-center">PPF Protocol</th>
                                    <th className="pb-6 text-[11px] font-semibold text-primary-600 uppercase tracking-st text-center">NPS Infrastructure</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[
                                    { feature: "Primary Returns", ppf: "7.1% Sovereign Fixed", nps: "9-12% Alpha (Market Linked)" },
                                    { feature: "Lock-in Horizon", ppf: "15-Year Maturity", nps: "Retirement Goal (60 Yrs)" },
                                    { feature: "Maturity Tax Exemption", ppf: "100% Tax-Exempt (EEE)", nps: "60% Lump Sum / 40% Annuity" },
                                    { feature: "Risk Architecture", ppf: "Zero Sovereign Risk", nps: "Market Volatility Variable" },
                                    { feature: "Liquidity Protocol", ppf: "Partial (Year 7+)", nps: "Tier-II Instant / Tier-I Restricted" },
                                    { feature: "Tax Advantage Max", ppf: "₹1,50,000 (80C Cap)", nps: "₹2,00,000 (80C + 80CCD)" },
                                ].map((row, index) => (
                                    <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 text-sm font-bold text-slate-900">{row.feature}</td>
                                        <td className="py-6 text-center text-sm font-bold text-slate-600">{row.ppf}</td>
                                        <td className="py-6 text-center text-sm font-bold text-slate-600">{row.nps}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
