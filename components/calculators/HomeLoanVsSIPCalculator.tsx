"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Calendar, Percent, TrendingUp, TrendingDown, ChevronDown, ChevronUp, FileText, Lock, Trophy, Sparkles, Home, CheckCircle2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast } from "sonner";

export function HomeLoanVsSIPCalculator() {
    const [homePrice, setHomePrice] = useState(5000000);
    const [downPaymentPct, setDownPaymentPct] = useState(20);
    const [interestRate, setInterestRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);
    const [sipReturn, setSipReturn] = useState(12);

    const [inputsExpanded, setInputsExpanded] = useState(false);
    const [showAllYears, setShowAllYears] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEmailSubmit = () => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => { setIsSubmitting(false); setEmail(""); toast.success("Report sent! Check your inbox."); }, 1500);
    };

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    const results = useMemo(() => {
        const loanAmount = homePrice * (1 - downPaymentPct / 100);
        const monthlyRate = interestRate / 12 / 100;
        const totalMonths = tenure * 12;

        // EMI Calculation
        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        const totalPayment = emi * totalMonths;
        const totalInterest = totalPayment - loanAmount;

        // SIP Wealth Calculation (investing EMI amount)
        const monthlyReturn = sipReturn / 12 / 100;
        const sipWealth = emi * ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn) * (1 + monthlyReturn);

        // Year-by-year
        const yearlyData = [];
        for (let y = 1; y <= tenure; y++) {
            const months = y * 12;
            const loanBalance = loanAmount * Math.pow(1 + monthlyRate, months) - emi * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
            const sipCorpus = emi * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn);
            yearlyData.push({
                year: y,
                loanBalance: Math.max(0, Math.round(loanBalance)),
                sipCorpus: Math.round(sipCorpus),
            });
        }

        // Chart data for area chart
        const chartData = [{ year: 'Y0', sipCorpus: 0, homeEquity: homePrice * (downPaymentPct / 100) }];
        for (let y = 1; y <= tenure; y++) {
            const months = y * 12;
            const loanBalance = Math.max(0, loanAmount * Math.pow(1 + monthlyRate, months) - emi * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
            const homeEquity = homePrice - loanBalance;
            const sipCorpus = emi * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn);
            chartData.push({ year: `Y${y}`, sipCorpus: Math.round(sipCorpus), homeEquity: Math.round(homeEquity) });
        }

        return {
            loanAmount: Math.round(loanAmount),
            emi: Math.round(emi),
            totalInterest: Math.round(totalInterest),
            sipWealth: Math.round(sipWealth),
            yearlyData,
            chartData,
        };
    }, [homePrice, downPaymentPct, interestRate, tenure, sipReturn]);

    const sipWins = results.sipWealth > homePrice;

    const InputSliders = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm text-foreground font-semibold">Home Price</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                        <Input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground" />
                    </div>
                </div>
                <Slider value={[homePrice]} onValueChange={(v) => setHomePrice(v[0])} min={1000000} max={50000000} step={500000} className="py-2" />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm text-foreground font-semibold">Down Payment</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{downPaymentPct}%</span>
                    </div>
                </div>
                <Slider value={[downPaymentPct]} onValueChange={(v) => setDownPaymentPct(v[0])} min={10} max={50} step={5} className="py-2" />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm text-foreground font-semibold">Loan Interest Rate</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{interestRate}%</span>
                    </div>
                </div>
                <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={7} max={15} step={0.1} className="py-2" />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm text-foreground font-semibold">Loan Tenure</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{tenure} Y</span>
                    </div>
                </div>
                <Slider value={[tenure]} onValueChange={(v) => setTenure(v[0])} min={5} max={30} step={1} className="py-2" />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm text-foreground font-semibold">SIP Expected Return</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{sipReturn}%</span>
                    </div>
                </div>
                <Slider value={[sipReturn]} onValueChange={(v) => setSipReturn(v[0])} min={10} max={20} step={0.5} className="py-2" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Section 1 — Mobile Collapsible */}
            <div className="lg:hidden">
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="cursor-pointer" onClick={() => setInputsExpanded(!inputsExpanded)}>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-lg mb-1">Home Loan vs SIP</CardTitle>
                                <CardDescription className="text-xs">Tap to adjust inputs</CardDescription>
                            </div>
                            {inputsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                    </CardHeader>
                    {inputsExpanded && (
                        <CardContent className="space-y-4 pt-0">
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Home Price</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(homePrice)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">EMI</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(results.emi)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">SIP Corpus</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(results.sipWealth)}</p>
                                </div>
                            </div>
                            <InputSliders />
                        </CardContent>
                    )}
                </Card>
            </div>

            {/* Section 2 — Desktop 2-col grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card */}
                <Card className="hidden lg:block border-border shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">Home Loan vs SIP</CardTitle>
                                <CardDescription>Compare buying a home vs investing the EMI in mutual funds</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge variant="secondary" className="bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Free
                                </Badge>
                                <Badge variant="secondary" className="bg-secondary-50 text-secondary-700 border-secondary-200 hover:bg-secondary-100 text-[10px]">
                                    No Registration
                                </Badge>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                            <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Examples:</span>
                            {[
                                { label: "₹30L Home 8.5%", price: 3000000, dp: 20, rate: 8.5, t: 20, ret: 12 },
                                { label: "₹60L Home 9%", price: 6000000, dp: 20, rate: 9, t: 20, ret: 12 },
                                { label: "₹1Cr Home 8.5%", price: 10000000, dp: 20, rate: 8.5, t: 20, ret: 12 },
                            ].map((p, idx) => (
                                <button key={idx}
                                    onClick={() => { setHomePrice(p.price); setDownPaymentPct(p.dp); setInterestRate(p.rate); setTenure(p.t); setSipReturn(p.ret); }}
                                    className="text-xs px-2.5 py-1 bg-muted hover:bg-muted/80 text-foreground rounded-md font-medium transition-colors border border-border">
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InputSliders />
                    </CardContent>
                </Card>

                {/* Right: Results Card */}
                <Card className="order-first lg:order-none border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Monthly EMI</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(results.emi)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Total Interest</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(results.totalInterest)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">SIP Corpus</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(results.sipWealth)}</p>
                            </div>
                        </div>

                        {/* Comparison Visual */}
                        <div className="p-4 bg-card rounded-xl border border-border mb-4">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Comparison After {tenure} Years</p>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-foreground flex items-center gap-1"><Home className="w-3 h-3" /> Home Equity</span>
                                        <span className="font-bold text-foreground">{formatCurrency(homePrice)}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ backgroundColor: '#d97706', width: `${Math.min(100, (homePrice / Math.max(homePrice, results.sipWealth)) * 100)}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-foreground flex items-center gap-1"><TrendingUp className="w-3 h-3" /> SIP Wealth</span>
                                        <span className="font-bold text-primary">{formatCurrency(results.sipWealth)}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ backgroundColor: '#166534', width: `${Math.min(100, (results.sipWealth / Math.max(homePrice, results.sipWealth)) * 100)}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-card rounded-xl border border-border">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Loan Amount</p>
                            <p className="text-sm font-bold text-foreground">{formatCurrency(results.loanAmount)}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{downPaymentPct}% down payment of {formatCurrency(homePrice * downPaymentPct / 100)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Section 3 — Bottom 2-col grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Comparison Chart */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Comparison Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={results.chartData}>
                                    <defs>
                                        <linearGradient id="colorHomeLoanSIP" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorHomeLoanEquity" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" />
                                    <YAxis
                                        tick={{ fontSize: 10 }}
                                        stroke="hsl(var(--border))"
                                        tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value}
                                    />
                                    <Tooltip
                                        formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="sipCorpus" stroke="#166534" fill="url(#colorHomeLoanSIP)" strokeWidth={2} name="SIP Corpus" />
                                    <Area type="monotone" dataKey="homeEquity" stroke="#d97706" fill="url(#colorHomeLoanEquity)" strokeWidth={2} name="Home Equity" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#166534' }} />
                                <span className="text-xs font-medium text-muted-foreground">SIP Corpus</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#d97706' }} />
                                <span className="text-xs font-medium text-muted-foreground">Home Equity</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Comparison Table */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Comparison Table</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Loan Rate</p>
                                    <p className="text-lg font-bold text-foreground">{interestRate}%</p>
                                </div>
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">SIP Return</p>
                                    <p className="text-lg font-bold text-primary-600">{sipReturn}%</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-border">
                                        <table className="w-full min-w-full sm:min-w-[500px]">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Year</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Loan Balance</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">SIP Corpus</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {(showAllYears ? results.yearlyData : results.yearlyData.slice(0, 10)).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Year {row.year}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(row.loanBalance)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{formatCurrency(row.sipCorpus)}</td>
                                                    </tr>
                                                ))}
                                                {!showAllYears && results.yearlyData.length > 10 && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50" onClick={() => setShowAllYears(true)}>
                                                        <td colSpan={3} className="px-3 py-3 text-xs text-center text-primary-600 font-bold">Show {results.yearlyData.length - 10} more years...</td>
                                                    </tr>
                                                )}
                                                {showAllYears && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50" onClick={() => setShowAllYears(false)}>
                                                        <td colSpan={3} className="px-3 py-3 text-xs text-center text-primary-600 font-bold">Show Less</td>
                                                    </tr>
                                                )}
                                                <tr className="bg-primary/10 border-t-2 border-primary/20">
                                                    <td className="px-3 py-3 text-sm font-bold text-foreground">Final</td>
                                                    <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(0)}</td>
                                                    <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(results.sipWealth)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* What This Means */}
                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-emerald-950/30 dark:to-emerald-950/30 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy className="w-24 h-24 text-emerald-600" /></div>
                                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> What This Means
                                </h3>
                                <p className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-3">
                                    After {tenure} years: Home loan costs <span className="font-bold">{formatCurrency(results.totalInterest)}</span> in interest, SIP would have grown to <span className="font-bold">{formatCurrency(results.sipWealth)}</span>. {sipWins ? "SIP creates more wealth!" : "Home ownership has equity advantage."}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {sipWins && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> SIP Wins by {formatCurrency(results.sipWealth - homePrice)}
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <Home className="w-3 h-3" /> Opportunity Cost Analysis
                                    </Badge>
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> EMI: {formatCurrency(results.emi)}/mo
                                    </Badge>
                                </div>
                            </div>

                            {/* Lead Capture */}
                            <div className="p-5 bg-card rounded-xl border border-border shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary-600" />Get Detailed Report (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">Get a personalized home loan vs investment analysis with top fund recommendations and EMI optimization strategies.</p>
                                <div className="flex gap-2">
                                    <Input placeholder="Enter your email" className="h-9 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
                                    <Button size="sm" className="h-9 bg-primary-600 hover:bg-primary-700 text-white" onClick={handleEmailSubmit} disabled={isSubmitting}>
                                        {isSubmitting ? "Sending..." : "Send"}
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2 text-center"><Lock className="w-3 h-3 inline mr-1" /> No spam. Unsubscribe anytime.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
