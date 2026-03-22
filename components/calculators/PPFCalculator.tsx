"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Calendar, Percent, TrendingDown, TrendingUp, ChevronDown, ChevronUp, FileText, Lock, Trophy, Sparkles, CheckCircle2, Home, Car, GraduationCap, Plane } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { toast } from "sonner";

export function PPFCalculator() {
    const [annualContribution, setAnnualContribution] = useState(150000);
    const [years, setYears] = useState(15);
    const [interestRate, setInterestRate] = useState(7.1);
    const [inflationRate, setInflationRate] = useState(6);
    const [adjustForInflation, setAdjustForInflation] = useState(false);
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

    const calculatePPF = () => {
        let maturityAmount = 0;
        let totalContributed = 0;
        for (let year = 1; year <= years; year++) {
            totalContributed += annualContribution;
            maturityAmount = (maturityAmount + annualContribution) * (1 + interestRate / 100);
        }
        const returns = maturityAmount - totalContributed;
        let realValue = maturityAmount;
        let realReturns = returns;
        if (adjustForInflation) {
            realValue = maturityAmount / Math.pow(1 + inflationRate / 100, years);
            realReturns = realValue - totalContributed;
        }
        return { maturityAmount, totalContributed, returns, realValue, realReturns };
    };

    const generateYearlyData = () => {
        const data = [];
        let corpus = 0;
        let totalContributed = 0;
        for (let year = 0; year <= years; year++) {
            if (year > 0) {
                totalContributed += annualContribution;
                corpus = (corpus + annualContribution) * (1 + interestRate / 100);
            }
            const realValue = adjustForInflation ? corpus / Math.pow(1 + inflationRate / 100, year) : corpus;
            data.push({ year: `Year ${year}`, corpus, realValue });
        }
        return data;
    };

    const generateYearlyBreakdown = () => {
        const data = [];
        let corpus = 0;
        let totalContributed = 0;
        for (let year = 1; year <= years; year++) {
            totalContributed += annualContribution;
            corpus = (corpus + annualContribution) * (1 + interestRate / 100);
            const interest = corpus - totalContributed;
            data.push({ year, investment: totalContributed, interest, balance: corpus });
        }
        return data;
    };

    const result = calculatePPF();
    const yearlyData = generateYearlyData();
    const yearlyBreakdown = generateYearlyBreakdown();

    const ppfChartData = [
        { name: 'Invested', value: result.totalContributed, color: '#166534' },
        { name: 'Returns', value: adjustForInflation ? result.realReturns : result.returns, color: '#16a34a' },
    ];

    const presets = [
        { label: "₹500/yr (Min)", annual: 500 },
        { label: "₹1K/mo = ₹12K/yr", annual: 12000 },
        { label: "₹5K/mo = ₹60K/yr", annual: 60000 },
        { label: "₹12.5K/mo (Max)", annual: 150000 },
    ];

    const applyPreset = (p: { label: string; annual: number }) => {
        setAnnualContribution(p.annual);
    };

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Section 1: Mobile Collapsible */}
            <div className="lg:hidden">
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="cursor-pointer" onClick={() => setInputsExpanded(!inputsExpanded)}>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-lg mb-1">PPF Calculator</CardTitle>
                                <CardDescription className="text-xs">Tap to adjust inputs</CardDescription>
                            </div>
                            {inputsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                    </CardHeader>
                    {inputsExpanded && (
                        <CardContent className="space-y-4 pt-0">
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Annual</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(annualContribution)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Years</p>
                                    <p className="text-sm font-bold text-foreground">{years}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Rate</p>
                                    <p className="text-sm font-bold text-foreground">{interestRate}%</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold">Annual Contribution</Label>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                            <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                            <Input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(Number(e.target.value))} className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                                        </div>
                                    </div>
                                    <Slider value={[annualContribution]} onValueChange={(v) => setAnnualContribution(v[0])} min={500} max={150000} step={500} className="py-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold">Investment Period</Label>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span className="text-sm font-bold text-foreground">{years} Y</span>
                                        </div>
                                    </div>
                                    <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={15} max={50} step={1} className="py-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold">Interest Rate (p.a.)</Label>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                            <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span className="text-sm font-bold text-foreground">{interestRate}%</span>
                                        </div>
                                    </div>
                                    <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={6} max={9} step={0.1} className="py-2" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                                    <div className="flex items-center gap-2">
                                        <TrendingDown className="w-4 h-4 text-amber-600" />
                                        <div>
                                            <Label className="text-sm font-semibold">Adjust for Inflation</Label>
                                            <p className="text-xs text-muted-foreground">Show real returns after inflation</p>
                                        </div>
                                    </div>
                                    <Switch checked={adjustForInflation} onCheckedChange={setAdjustForInflation} />
                                </div>
                                {adjustForInflation && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-sm font-semibold">Inflation Rate (p.a.)</Label>
                                            <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                                <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                                <span className="text-sm font-bold text-foreground">{inflationRate}%</span>
                                            </div>
                                        </div>
                                        <Slider value={[inflationRate]} onValueChange={(v) => setInflationRate(v[0])} min={2} max={10} step={0.5} className="py-2" />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>

            {/* Section 2: Desktop 2-col */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="hidden lg:block border-border shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">PPF Calculator</CardTitle>
                                <CardDescription>Calculate Public Provident Fund maturity with EEE tax benefits</CardDescription>
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
                            {presets.map((p, i) => (
                                <button key={i} onClick={() => applyPreset(p)} className="text-xs px-2.5 py-1 bg-muted hover:bg-muted/80 text-foreground rounded-md font-medium transition-colors border border-border">
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-foreground font-semibold">Annual Contribution</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(Number(e.target.value))} className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                                </div>
                            </div>
                            <Slider value={[annualContribution]} onValueChange={(v) => setAnnualContribution(v[0])} min={500} max={150000} step={500} className="py-2" />
                            <p className="text-xs text-muted-foreground">Min: ₹500, Max: ₹1.5 Lakh (80C limit)</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-foreground font-semibold">Investment Period</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-sm font-bold text-foreground">{years} Y</span>
                                </div>
                            </div>
                            <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={15} max={50} step={1} className="py-2" />
                            <p className="text-xs text-muted-foreground">Minimum 15 years, can extend in blocks of 5 years</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-foreground font-semibold">Interest Rate (p.a.)</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-sm font-bold text-foreground">{interestRate}%</span>
                                </div>
                            </div>
                            <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={6} max={9} step={0.1} className="py-2" />
                            <p className="text-xs text-muted-foreground">Current PPF rate: 7.1% (updated quarterly by government)</p>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-amber-600" />
                                <div>
                                    <Label className="text-sm text-foreground font-semibold">Adjust for Inflation</Label>
                                    <p className="text-xs text-muted-foreground">Show real returns after inflation</p>
                                </div>
                            </div>
                            <Switch checked={adjustForInflation} onCheckedChange={setAdjustForInflation} />
                        </div>

                        {adjustForInflation && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-foreground font-semibold">Expected Inflation Rate (p.a.)</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-sm font-bold text-foreground">{inflationRate}%</span>
                                    </div>
                                </div>
                                <Slider value={[inflationRate]} onValueChange={(v) => setInflationRate(v[0])} min={2} max={10} step={0.5} className="py-2" />
                            </div>
                        )}

                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Tax Benefits (EEE)</p>
                            <p className="text-xs text-primary">
                                ✓ 80C deduction (up to ₹1.5L) • Interest & maturity completely tax-free
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card id="calculator-results" className="order-first lg:order-none border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Contributed</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(result.totalContributed)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Returns' : 'Returns'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">
                                    {formatCurrency(adjustForInflation ? result.realReturns : result.returns)}
                                </p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Value' : 'Maturity'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">
                                    {formatCurrency(adjustForInflation ? result.realValue : result.maturityAmount)}
                                </p>
                            </div>
                        </div>

                        {adjustForInflation && (
                            <div className="p-3 bg-card rounded-xl border border-border mb-4">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Nominal Value</p>
                                <p className="text-sm font-bold text-foreground">{formatCurrency(result.maturityAmount)}</p>
                                <p className="text-xs text-muted-foreground mt-1">Before inflation adjustment</p>
                            </div>
                        )}

                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-[280px] h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={ppfChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" strokeWidth={0} paddingAngle={5}>
                                            {ppfChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Section 3: Bottom 2-col */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">PPF Growth Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={yearlyData}>
                                    <defs>
                                        <linearGradient id="colorPPFValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPPFReal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--border))" tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value} />
                                    <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="corpus" stroke="#166534" fill="url(#colorPPFValue)" strokeWidth={2} name="Corpus" />
                                    {adjustForInflation && (
                                        <Area type="monotone" dataKey="realValue" stroke="#d97706" fill="url(#colorPPFReal)" strokeWidth={2} strokeDasharray="5 5" name="Real Value" />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Year-by-Year Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Annual Investment</p>
                                    <p className="text-lg font-bold text-foreground">{formatCurrency(annualContribution)}</p>
                                </div>
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">PPF Rate</p>
                                    <p className="text-lg font-bold text-primary-600">{interestRate}%</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-border">
                                        <table className="w-full min-w-full sm:min-w-[500px]">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Year</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Interest</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {(showAllYears ? yearlyBreakdown : yearlyBreakdown.slice(0, 10)).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Year {row.year}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(row.interest)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{formatCurrency(row.balance)}</td>
                                                    </tr>
                                                ))}
                                                {!showAllYears && yearlyBreakdown.length > 10 && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setShowAllYears(true)}>
                                                        <td colSpan={3} className="px-3 py-3 text-xs text-center text-primary-600 font-bold">
                                                            Show {yearlyBreakdown.length - 10} more years...
                                                        </td>
                                                    </tr>
                                                )}
                                                {showAllYears && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setShowAllYears(false)}>
                                                        <td colSpan={3} className="px-3 py-3 text-xs text-center text-primary-600 font-bold">
                                                            Show Less
                                                        </td>
                                                    </tr>
                                                )}
                                                {!showAllYears && yearlyBreakdown.length > 0 && (
                                                    <tr className="bg-primary/10 border-t-2 border-primary/20">
                                                        <td className="px-3 py-3 text-sm font-bold text-foreground">Final</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(result.returns)}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(result.maturityAmount)}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-emerald-950/30 dark:to-emerald-950/30 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy className="w-24 h-24 text-emerald-600" /></div>
                                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> What This Means
                                </h3>
                                <p className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-3">
                                    Your PPF corpus of <span className="font-bold">{formatCurrency(adjustForInflation ? result.realValue : result.maturityAmount)}</span> is completely tax-free — EEE status (Exempt-Exempt-Exempt)!
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {(adjustForInflation ? result.realValue : result.maturityAmount) > 10000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> Financial Freedom
                                        </Badge>
                                    )}
                                    {(adjustForInflation ? result.realValue : result.maturityAmount) > 5000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <Home className="w-3 h-3" /> Dream Home
                                        </Badge>
                                    )}
                                    {(adjustForInflation ? result.realValue : result.maturityAmount) > 2000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <GraduationCap className="w-3 h-3" /> Child's Education
                                        </Badge>
                                    )}
                                    {(adjustForInflation ? result.realValue : result.maturityAmount) > 500000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <Car className="w-3 h-3" /> New Car
                                        </Badge>
                                    )}
                                    {(adjustForInflation ? result.realValue : result.maturityAmount) > 200000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <Plane className="w-3 h-3" /> World Tour
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="p-5 bg-card rounded-xl border border-border shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary-600" />Get PPF vs ELSS Comparison Report (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Get a detailed comparison of PPF vs ELSS with tax-adjusted returns for your investment of {formatCurrency(annualContribution)}/year.
                                </p>
                                <div className="flex gap-2">
                                    <Input placeholder="Enter your email" className="h-9 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
                                    <Button size="sm" className="h-9 bg-primary-600 hover:bg-primary-700 text-white" onClick={handleEmailSubmit} disabled={isSubmitting}>
                                        {isSubmitting ? "Sending..." : "Send"}
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                                    <Lock className="w-3 h-3 inline mr-1" /> No spam. Unsubscribe anytime.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
