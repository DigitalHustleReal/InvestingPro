"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Calendar, Percent, TrendingDown, ChevronDown, ChevronUp, FileText, Lock, Trophy, Sparkles, GraduationCap, CheckCircle2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { toast } from "sonner";

export function SSYCalculator() {
    const [annualContribution, setAnnualContribution] = useState(150000);
    const [girlAge, setGirlAge] = useState(1);
    const [startYear] = useState(new Date().getFullYear());
    const [interestRate, setInterestRate] = useState(8.2);
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
        return `₹${Math.round(num).toLocaleString('en-IN')}`;
    };

    const calculateSSY = () => {
        const investmentDuration = 15;
        const maturityDuration = 21;

        let corpus = 0;
        let totalContributed = 0;

        for (let year = 1; year <= maturityDuration; year++) {
            if (year <= investmentDuration) {
                corpus += annualContribution;
                totalContributed += annualContribution;
            }
            const interest = corpus * (interestRate / 100);
            corpus += interest;
        }

        const maturityAmount = Math.round(corpus);
        const returns = maturityAmount - totalContributed;

        let realValue = maturityAmount;
        let realReturns = returns;

        if (adjustForInflation) {
            realValue = maturityAmount / Math.pow(1 + inflationRate / 100, maturityDuration);
            realReturns = realValue - totalContributed;
        }

        return {
            maturityAmount,
            totalContributed,
            returns,
            realValue,
            realReturns,
            maturityYear: startYear + maturityDuration,
        };
    };

    const result = calculateSSY();

    const generateYearlyData = () => {
        const data = [];
        let corpus = 0;
        const investmentDuration = 15;
        const maturityDuration = 21;

        for (let year = 0; year <= maturityDuration; year++) {
            if (year > 0) {
                if (year <= investmentDuration) {
                    corpus += annualContribution;
                }
                const interest = corpus * (interestRate / 100);
                corpus += interest;
            }

            const realValue = adjustForInflation ? corpus / Math.pow(1 + inflationRate / 100, year) : corpus;

            data.push({
                year: startYear + year,
                age: girlAge + year,
                corpus: Math.round(corpus),
                realValue: Math.round(realValue),
            });
        }
        return data;
    };

    const generateYearlyBreakdown = () => {
        const data = [];
        let corpus = 0;
        let totalContrib = 0;
        const investmentDuration = 15;
        const maturityDuration = 21;

        for (let year = 1; year <= maturityDuration; year++) {
            if (year <= investmentDuration) {
                corpus += annualContribution;
                totalContrib += annualContribution;
            }
            const interest = corpus * (interestRate / 100);
            corpus += interest;

            data.push({
                year,
                age: girlAge + year,
                balance: Math.round(corpus),
                invested: Math.round(totalContrib),
                isInvestmentPhase: year <= investmentDuration,
            });
        }
        return data;
    };

    const growthData = generateYearlyData();
    const yearlyData = generateYearlyBreakdown();

    const pieData = [
        { name: 'Total Invested', value: result.totalContributed, color: '#166534' },
        { name: 'Interest Earned', value: adjustForInflation ? Math.max(0, result.realReturns) : result.returns, color: '#16a34a' },
    ];

    const InputSliders = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm text-foreground font-semibold">Annual Investment</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                        <Input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(Number(e.target.value))} className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground" />
                    </div>
                </div>
                <Slider value={[annualContribution]} onValueChange={(v) => setAnnualContribution(v[0])} min={250} max={150000} step={250} className="py-2" />
                <p className="text-xs text-muted-foreground">Min: ₹250 / Max: ₹1.5 Lakh per year</p>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm text-foreground font-semibold">Girl's Current Age</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{girlAge} Y</span>
                    </div>
                </div>
                <Slider value={[girlAge]} onValueChange={(v) => setGirlAge(v[0])} min={0} max={10} step={1} className="py-2" />
                <p className="text-xs text-muted-foreground">Max age to open account: 10 Years</p>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm text-foreground font-semibold">Interest Rate (p.a.)</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{interestRate}%</span>
                    </div>
                </div>
                <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={7} max={9} step={0.1} className="py-2" />
                <p className="text-xs text-muted-foreground">Current SSY rate: 8.2% (updated quarterly)</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-amber-600" />
                    <div>
                        <Label className="text-sm text-foreground font-semibold">Adjust for Inflation</Label>
                        <p className="text-xs text-muted-foreground">Show real purchasing power</p>
                    </div>
                </div>
                <Switch checked={adjustForInflation} onCheckedChange={setAdjustForInflation} />
            </div>

            {adjustForInflation && (
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm text-foreground font-semibold">Expected Inflation Rate</Label>
                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                            <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm font-bold text-foreground">{inflationRate}%</span>
                        </div>
                    </div>
                    <Slider value={[inflationRate]} onValueChange={(v) => setInflationRate(v[0])} min={2} max={10} step={0.5} className="py-2" />
                </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <p className="text-[10px] font-bold text-primary-700 uppercase tracking-widest mb-1">Tax Benefits</p>
                    <p className="text-xs text-primary-800 font-medium">EEE Status: Tax-free Invest, Interest & Maturity</p>
                </div>
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <p className="text-[10px] font-bold text-primary-700 uppercase tracking-widest mb-1">Maturity</p>
                    <p className="text-xs text-primary-800 font-medium">21 Years from opening (Age {girlAge + 21})</p>
                </div>
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
                                <CardTitle className="text-lg mb-1">SSY Calculator</CardTitle>
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
                                    <p className="text-xs text-muted-foreground mb-1">Age</p>
                                    <p className="text-sm font-bold text-foreground">{girlAge}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Maturity</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(result.maturityAmount)}</p>
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
                                <CardTitle className="text-xl mb-1">SSY Calculator</CardTitle>
                                <CardDescription>Sukanya Samriddhi Yojana — Secure your daughter's future</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge variant="secondary" className="bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Free
                                </Badge>
                                <Badge variant="secondary" className="bg-secondary-50 text-secondary-700 border-secondary-200 hover:bg-secondary-100 text-[10px]">
                                    EEE Tax Benefit
                                </Badge>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                            <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Examples:</span>
                            {[
                                { label: "₹1K/yr (Min)", annual: 1000 },
                                { label: "₹12.5K/yr", annual: 12500 },
                                { label: "₹50K/yr", annual: 50000 },
                                { label: "₹1.5L/yr (Max)", annual: 150000 },
                            ].map((p, idx) => (
                                <button key={idx}
                                    onClick={() => setAnnualContribution(p.annual)}
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
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Total Invested</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(result.totalContributed)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Interest' : 'Interest Earned'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">
                                    +{formatCurrency(adjustForInflation ? Math.max(0, result.realReturns) : result.returns)}
                                </p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Maturity' : 'Maturity Amount'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">
                                    {formatCurrency(adjustForInflation ? result.realValue : result.maturityAmount)}
                                </p>
                            </div>
                        </div>

                        {adjustForInflation && (
                            <div className="p-3 bg-card rounded-xl border border-border mb-4">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Nominal Maturity</p>
                                <p className="text-sm font-bold text-foreground">{formatCurrency(result.maturityAmount)}</p>
                                <p className="text-xs text-muted-foreground mt-1">Before inflation adjustment</p>
                            </div>
                        )}

                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-[280px] h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={75}
                                            dataKey="value"
                                            strokeWidth={0}
                                            paddingAngle={5}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-ssy-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="flex justify-center gap-6 -mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#166534' }} />
                                <span className="text-xs font-medium text-muted-foreground">Invested: {formatCurrency(result.totalContributed)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#16a34a' }} />
                                <span className="text-xs font-medium text-muted-foreground">Interest: {formatCurrency(result.returns)}</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center mt-2">
                            *Maturity at age {girlAge + 21} (after 21 years)
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Section 3 — Bottom 2-col grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Growth Chart */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">SSY Growth Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colorSSYValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorSSYReal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#d97706" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis
                                        dataKey="age"
                                        tick={{ fontSize: 10 }}
                                        stroke="hsl(var(--border))"
                                        label={{ value: "Girl's Age", position: 'insideBottom', offset: -5, fontSize: 10 }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10 }}
                                        stroke="hsl(var(--border))"
                                        tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value}
                                    />
                                    <Tooltip
                                        formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
                                        labelFormatter={(label) => `Age: ${label}`}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="corpus" stroke="#166534" fill="url(#colorSSYValue)" strokeWidth={2} name="Maturity Value" />
                                    {adjustForInflation && (
                                        <Area type="monotone" dataKey="realValue" stroke="#d97706" fill="url(#colorSSYReal)" strokeWidth={2} strokeDasharray="5 5" name="Real Value" />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Breakdown */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Year-by-Year Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Annual Deposit</p>
                                    <p className="text-lg font-bold text-foreground">{formatCurrency(annualContribution)}</p>
                                </div>
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">SSY Rate</p>
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
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Invested</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {(showAllYears ? yearlyData : yearlyData.slice(0, 10)).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground">
                                                            Year {row.year}
                                                            {!row.isInvestmentPhase && <span className="ml-1 text-[10px] text-muted-foreground">(lock-in)</span>}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(row.invested)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{formatCurrency(row.balance)}</td>
                                                    </tr>
                                                ))}
                                                {!showAllYears && yearlyData.length > 10 && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50" onClick={() => setShowAllYears(true)}>
                                                        <td colSpan={3} className="px-3 py-3 text-xs text-center text-primary-600 font-bold">Show {yearlyData.length - 10} more years...</td>
                                                    </tr>
                                                )}
                                                {showAllYears && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50" onClick={() => setShowAllYears(false)}>
                                                        <td colSpan={3} className="px-3 py-3 text-xs text-center text-primary-600 font-bold">Show Less</td>
                                                    </tr>
                                                )}
                                                <tr className="bg-primary/10 border-t-2 border-primary/20">
                                                    <td className="px-3 py-3 text-sm font-bold text-foreground">Maturity</td>
                                                    <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(result.totalContributed)}</td>
                                                    <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(result.maturityAmount)}</td>
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
                                    Starting SSY for your daughter at age {girlAge}: she receives <span className="font-bold">{formatCurrency(adjustForInflation ? result.realValue : result.maturityAmount)}</span> at 21 — 80C tax benefit + tax-free maturity!
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Section 80C Benefit
                                    </Badge>
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <GraduationCap className="w-3 h-3" /> Education & Marriage
                                    </Badge>
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> EEE Tax Status
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
                                <p className="text-xs text-muted-foreground mb-4">Get a complete SSY guide, account opening steps, and tax-saving tips to maximize your daughter's future fund of {formatCurrency(result.maturityAmount)}.</p>
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
