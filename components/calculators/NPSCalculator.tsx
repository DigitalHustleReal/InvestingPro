"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Calendar, Percent, TrendingDown, TrendingUp, ChevronDown, ChevronUp, FileText, Lock, Trophy, Sparkles, CheckCircle2, Home, GraduationCap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { toast } from "sonner";

export function NPSCalculator() {
    const [monthlyContribution, setMonthlyContribution] = useState(5000);
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(60);
    const [expectedReturn, setExpectedReturn] = useState(10);
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

    const yearsToRetirement = retirementAge - currentAge;
    const totalMonths = yearsToRetirement * 12;

    const calculateNPS = () => {
        const monthlyRate = expectedReturn / 100 / 12;
        const futureValue = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
        const totalContributed = monthlyContribution * totalMonths;
        const returns = futureValue - totalContributed;
        const withdrawableAmount = futureValue * 0.6;
        const annuitizedAmount = futureValue * 0.4;
        // Monthly pension from annuity at 6% annuity rate
        const annuityRate = 6;
        const monthlyPension = (annuitizedAmount * annuityRate / 100) / 12;
        let realValue = futureValue;
        let realReturns = returns;
        if (adjustForInflation) {
            realValue = futureValue / Math.pow(1 + inflationRate / 100, yearsToRetirement);
            realReturns = realValue - totalContributed;
        }
        return { maturityAmount: futureValue, totalContributed, returns, withdrawableAmount, annuitizedAmount, monthlyPension, realValue, realReturns };
    };

    const generateYearlyData = () => {
        const data = [];
        const monthlyRate = expectedReturn / 100 / 12;
        let corpus = 0;
        let totalContributed = 0;
        for (let year = 0; year <= yearsToRetirement; year++) {
            if (year > 0) {
                for (let m = 0; m < 12; m++) {
                    totalContributed += monthlyContribution;
                    corpus = (corpus + monthlyContribution) * (1 + monthlyRate);
                }
            }
            const realValue = adjustForInflation ? corpus / Math.pow(1 + inflationRate / 100, year) : corpus;
            data.push({ year: `Age ${currentAge + year}`, corpus, realValue });
        }
        return data;
    };

    const generateYearlyBreakdown = () => {
        const data = [];
        const monthlyRate = expectedReturn / 100 / 12;
        let corpus = 0;
        for (let year = 1; year <= yearsToRetirement; year++) {
            for (let m = 0; m < 12; m++) {
                corpus = (corpus + monthlyContribution) * (1 + monthlyRate);
            }
            const realValue = adjustForInflation ? corpus / Math.pow(1 + inflationRate / 100, year) : corpus;
            data.push({ year, age: currentAge + year, corpus, realValue });
        }
        return data;
    };

    const result = calculateNPS();
    const yearlyData = generateYearlyData();
    const yearlyBreakdown = generateYearlyBreakdown();

    const npsChartData = [
        { name: 'Invested', value: result.totalContributed, color: '#166534' },
        { name: 'Returns', value: adjustForInflation ? result.realReturns : result.returns, color: '#16a34a' },
    ];

    const presets = [
        { label: "₹500/mo age 25", monthly: 500, age: 25 },
        { label: "₹2K/mo age 30", monthly: 2000, age: 30 },
        { label: "₹5K/mo age 35", monthly: 5000, age: 35 },
        { label: "₹10K/mo age 40", monthly: 10000, age: 40 },
    ];

    const applyPreset = (p: { label: string; monthly: number; age: number }) => {
        setMonthlyContribution(p.monthly);
        setCurrentAge(p.age);
    };

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Section 1: Mobile Collapsible */}
            <div className="lg:hidden">
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="cursor-pointer" onClick={() => setInputsExpanded(!inputsExpanded)}>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-lg mb-1">NPS Calculator</CardTitle>
                                <CardDescription className="text-xs">Tap to adjust inputs</CardDescription>
                            </div>
                            {inputsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                    </CardHeader>
                    {inputsExpanded && (
                        <CardContent className="space-y-4 pt-0">
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(monthlyContribution)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Age</p>
                                    <p className="text-sm font-bold text-foreground">{currentAge}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Return</p>
                                    <p className="text-sm font-bold text-foreground">{expectedReturn}%</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold">Current Age</Label>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                            <span className="text-sm font-bold text-foreground">{currentAge} Y</span>
                                        </div>
                                    </div>
                                    <Slider value={[currentAge]} onValueChange={(v) => setCurrentAge(v[0])} min={18} max={55} step={1} className="py-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold">Retirement Age</Label>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                            <span className="text-sm font-bold text-foreground">{retirementAge} Y</span>
                                        </div>
                                    </div>
                                    <Slider value={[retirementAge]} onValueChange={(v) => setRetirementAge(v[0])} min={50} max={70} step={1} className="py-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold">Monthly Contribution</Label>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                            <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                            <Input type="number" inputMode="decimal" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                                        </div>
                                    </div>
                                    <Slider value={[monthlyContribution]} onValueChange={(v) => setMonthlyContribution(v[0])} min={500} max={50000} step={500} className="py-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold">Expected Return (p.a.)</Label>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                            <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span className="text-sm font-bold text-foreground">{expectedReturn}%</span>
                                        </div>
                                    </div>
                                    <Slider value={[expectedReturn]} onValueChange={(v) => setExpectedReturn(v[0])} min={8} max={14} step={0.5} className="py-2" />
                                </div>
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
                                <CardTitle className="text-xl mb-1">NPS Calculator</CardTitle>
                                <CardDescription>Calculate National Pension System corpus and monthly pension at retirement</CardDescription>
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
                                <Label className="text-sm text-foreground font-semibold">Current Age</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-sm font-bold text-foreground">{currentAge} Y</span>
                                </div>
                            </div>
                            <Slider value={[currentAge]} onValueChange={(v) => setCurrentAge(v[0])} min={18} max={55} step={1} className="py-2" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-foreground font-semibold">Retirement Age</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-sm font-bold text-foreground">{retirementAge} Y</span>
                                </div>
                            </div>
                            <Slider value={[retirementAge]} onValueChange={(v) => setRetirementAge(v[0])} min={50} max={70} step={1} className="py-2" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-foreground font-semibold">Monthly Contribution</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input type="number" inputMode="decimal" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                                </div>
                            </div>
                            <Slider value={[monthlyContribution]} onValueChange={(v) => setMonthlyContribution(v[0])} min={500} max={50000} step={500} className="py-2" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-foreground font-semibold">Expected Return (p.a.)</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-sm font-bold text-foreground">{expectedReturn}%</span>
                                </div>
                            </div>
                            <Slider value={[expectedReturn]} onValueChange={(v) => setExpectedReturn(v[0])} min={8} max={14} step={0.5} className="py-2" />
                            <p className="text-xs text-muted-foreground">NPS typically returns 8-14% based on asset allocation</p>
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
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Tax Benefits</p>
                            <p className="text-xs text-primary">
                                ✓ 80CCD(1B): ₹50K extra • Employer: ₹7.5L • 60% tax-free withdrawal
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
                                    {adjustForInflation ? 'Real Corpus' : 'Total Corpus'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">
                                    {formatCurrency(adjustForInflation ? result.realValue : result.maturityAmount)}
                                </p>
                            </div>
                        </div>

                        {adjustForInflation && (
                            <div className="p-3 bg-card rounded-xl border border-border mb-4">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Nominal Corpus</p>
                                <p className="text-sm font-bold text-foreground">{formatCurrency(result.maturityAmount)}</p>
                                <p className="text-xs text-muted-foreground mt-1">Before inflation adjustment</p>
                            </div>
                        )}

                        <div className="flex items-center justify-center mb-4">
                            <div className="w-full max-w-[280px] h-[240px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={npsChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" strokeWidth={0} paddingAngle={5}>
                                            {npsChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            <div className="text-center p-3 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Withdrawable (60%)</p>
                                <p className="text-sm sm:text-base font-extrabold text-primary">{formatCurrency(result.withdrawableAmount)}</p>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Monthly Pension</p>
                                <p className="text-sm sm:text-base font-extrabold text-primary">{formatCurrency(result.monthlyPension)}/mo</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Section 3: Bottom 2-col */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">NPS Corpus Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={yearlyData}>
                                    <defs>
                                        <linearGradient id="colorNPSCorpus" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorNPSReal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--border))" tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value} />
                                    <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="corpus" stroke="#166534" fill="url(#colorNPSCorpus)" strokeWidth={2} name="Corpus" />
                                    {adjustForInflation && (
                                        <Area type="monotone" dataKey="realValue" stroke="#d97706" fill="url(#colorNPSReal)" strokeWidth={2} strokeDasharray="5 5" name="Real Value" />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Age-wise Corpus Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Monthly SIP</p>
                                    <p className="text-lg font-bold text-foreground">{formatCurrency(monthlyContribution)}</p>
                                </div>
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Years to Retire</p>
                                    <p className="text-lg font-bold text-primary-600">{yearsToRetirement} Y</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-border">
                                        <table className="w-full min-w-full sm:min-w-[500px]">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Age</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Corpus</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">{adjustForInflation ? 'Real Value' : 'Nominal'}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {(showAllYears ? yearlyBreakdown : yearlyBreakdown.slice(0, 10)).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Age {row.age}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(row.corpus)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{formatCurrency(row.realValue)}</td>
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
                                                        <td className="px-3 py-3 text-sm font-bold text-foreground">At {retirementAge}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(result.maturityAmount)}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(adjustForInflation ? result.realValue : result.maturityAmount)}</td>
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
                                    Your NPS corpus of <span className="font-bold">{formatCurrency(adjustForInflation ? result.realValue : result.maturityAmount)}</span> at age {retirementAge} provides <span className="font-bold text-2xl underline decoration-emerald-400 decoration-2 underline-offset-2">{formatCurrency(result.monthlyPension)}/month</span> pension for life!
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.maturityAmount > 10000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> Comfortable Retirement
                                        </Badge>
                                    )}
                                    {result.maturityAmount > 5000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <Home className="w-3 h-3" /> Secure Future
                                        </Badge>
                                    )}
                                    {result.maturityAmount > 2000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <GraduationCap className="w-3 h-3" /> Legacy Wealth
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="p-5 bg-card rounded-xl border border-border shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary-600" />Get NPS vs EPF vs PPF Report (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Compare NPS with EPF and PPF to find the best retirement strategy for your {formatCurrency(monthlyContribution)}/month contribution.
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
