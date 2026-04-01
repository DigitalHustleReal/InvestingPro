"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";
import { IndianRupee, Calendar, Percent, TrendingDown, TrendingUp, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, Trophy, Sparkles, FileText, Lock, Home, GraduationCap, Plane } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { toast } from "sonner";

export function RetirementCalculator() {
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(60);
    const [currentSavings, setCurrentSavings] = useState(500000);
    const [monthlySIP, setMonthlySIP] = useState(20000);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [retirementExpenses, setRetirementExpenses] = useState(50000);
    const [inflationRate, setInflationRate] = useState(6);
    const [adjustForInflation, setAdjustForInflation] = useState(true);
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

    const calculateRetirement = () => {
        const yearsToRetirement = retirementAge - currentAge;
        const monthsToRetirement = yearsToRetirement * 12;
        const monthlyRate = expectedReturn / 100 / 12;

        const currentSavingsFuture = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
        const sipFutureValue = monthlySIP * ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate) * (1 + monthlyRate);
        const totalCorpus = currentSavingsFuture + sipFutureValue;

        const futureMonthlyExpenses = adjustForInflation
            ? retirementExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement)
            : retirementExpenses;

        const annualExpenses = futureMonthlyExpenses * 12;
        const corpusRequired = annualExpenses * 25;

        const shortfall = Math.max(0, corpusRequired - totalCorpus);
        const surplus = Math.max(0, totalCorpus - corpusRequired);

        // Monthly SIP required to meet corpus (if shortfall exists)
        const sipRequired = shortfall > 0
            ? (shortfall * monthlyRate) / ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) * (1 + monthlyRate))
            : 0;

        return {
            totalCorpus,
            corpusRequired,
            shortfall,
            surplus,
            futureMonthlyExpenses,
            yearsToRetirement,
            sipRequired
        };
    };

    const generateProjectionData = () => {
        const data = [];
        const yearsToRetirement = retirementAge - currentAge;
        const monthlyRate = expectedReturn / 100 / 12;

        for (let year = 0; year <= yearsToRetirement; year++) {
            const corpus = currentSavings * Math.pow(1 + expectedReturn / 100, year);
            const sipValue = year === 0 ? 0 : monthlySIP * ((Math.pow(1 + monthlyRate, year * 12) - 1) / monthlyRate) * (1 + monthlyRate);
            data.push({
                age: currentAge + year,
                corpus: corpus + sipValue
            });
        }
        return data;
    };

    const result = calculateRetirement();
    const projectionData = generateProjectionData();

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    const pieData = [
        { name: 'Existing Savings', value: currentSavings * Math.pow(1 + expectedReturn / 100, result.yearsToRetirement), color: '#166534' },
        { name: 'SIP Contribution', value: Math.max(0, result.totalCorpus - currentSavings * Math.pow(1 + expectedReturn / 100, result.yearsToRetirement)), color: '#16a34a' },
    ];

    const inputSliders = (
        <div className="space-y-4">
            {/* Current Age */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Current Age</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <span className="text-sm font-bold text-foreground">{currentAge} Y</span>
                    </div>
                </div>
                <Slider value={[currentAge]} onValueChange={(v) => setCurrentAge(v[0])} min={18} max={60} step={1} className="py-2" />
            </div>

            {/* Retirement Age */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Retirement Age</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <span className="text-sm font-bold text-foreground">{retirementAge} Y</span>
                    </div>
                </div>
                <Slider value={[retirementAge]} onValueChange={(v) => setRetirementAge(v[0])} min={50} max={70} step={1} className="py-2" />
            </div>

            {/* Monthly SIP */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Monthly SIP</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                        <Input type="number" inputMode="decimal" value={monthlySIP} onChange={(e) => setMonthlySIP(Number(e.target.value))} className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                    </div>
                </div>
                <Slider value={[monthlySIP]} onValueChange={(v) => setMonthlySIP(v[0])} min={1000} max={200000} step={1000} className="py-2" />
            </div>

            {/* Current Savings */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Current Savings</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                        <Input type="number" inputMode="decimal" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                    </div>
                </div>
                <Slider value={[currentSavings]} onValueChange={(v) => setCurrentSavings(v[0])} min={0} max={10000000} step={50000} className="py-2" />
            </div>

            {/* Monthly Expenses */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Monthly Expenses (Today)</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                        <Input type="number" inputMode="decimal" value={retirementExpenses} onChange={(e) => setRetirementExpenses(Number(e.target.value))} className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                    </div>
                </div>
                <Slider value={[retirementExpenses]} onValueChange={(v) => setRetirementExpenses(v[0])} min={20000} max={200000} step={5000} className="py-2" />
            </div>

            {/* Expected Return */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                        <Label className="text-sm font-semibold">Expected Return (p.a.)</Label>
                        <div className="group relative">
                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl">
                                <div className="font-semibold mb-1.5">Retirement Formula:</div>
                                <div className="text-[10px] font-mono leading-relaxed">
                                    Corpus = Savings × (1+r)^n + SIP × [((1+r)^n - 1)/r] × (1+r)<br />
                                    Required = Annual Expenses × 25 (4% rule)
                                </div>
                                <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{expectedReturn}%</span>
                    </div>
                </div>
                <Slider value={[expectedReturn]} onValueChange={(v) => setExpectedReturn(v[0])} min={8} max={18} step={0.5} className="py-2" />
            </div>

            {/* Inflation Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-primary" />
                    <div>
                        <Label className="text-sm font-semibold">Adjust Expenses for Inflation</Label>
                        <p className="text-xs text-muted-foreground">Project future expenses with inflation</p>
                    </div>
                </div>
                <Switch checked={adjustForInflation} onCheckedChange={setAdjustForInflation} />
            </div>

            {adjustForInflation && (
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm font-semibold">Expected Inflation Rate (p.a.)</Label>
                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                            <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm font-bold text-foreground">{inflationRate}%</span>
                        </div>
                    </div>
                    <Slider value={[inflationRate]} onValueChange={(v) => setInflationRate(v[0])} min={2} max={10} step={0.5} className="py-2" />
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Mobile: Collapsible Inputs Card */}
            <div className="lg:hidden">
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="cursor-pointer" onClick={() => setInputsExpanded(!inputsExpanded)}>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-lg mb-1">Retirement Calculator</CardTitle>
                                <CardDescription className="text-xs">Tap to adjust inputs</CardDescription>
                            </div>
                            {inputsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                    </CardHeader>
                    {inputsExpanded && (
                        <CardContent className="space-y-4 pt-0">
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Age</p>
                                    <p className="text-sm font-bold text-foreground">{currentAge} → {retirementAge}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Monthly SIP</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(monthlySIP)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Return</p>
                                    <p className="text-sm font-bold text-foreground">{expectedReturn}%</p>
                                </div>
                            </div>
                            {inputSliders}
                        </CardContent>
                    )}
                </Card>
            </div>

            {/* Desktop: Top Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card - Hidden on mobile */}
                <Card className="hidden lg:block border-border shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">Retirement Calculator</CardTitle>
                                <CardDescription>Plan your retirement corpus with inflation-adjusted expenses</CardDescription>
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
                                { label: "Age 25 retire 60", currentAge: 25, retirementAge: 60, sip: 15000, expenses: 50000 },
                                { label: "Age 30 retire 60", currentAge: 30, retirementAge: 60, sip: 20000, expenses: 60000 },
                                { label: "Age 35 retire 55", currentAge: 35, retirementAge: 55, sip: 40000, expenses: 75000 },
                                { label: "FIRE at 45", currentAge: 30, retirementAge: 45, sip: 80000, expenses: 100000 },
                            ].map((preset, idx) => (
                                <button key={idx} onClick={() => { setCurrentAge(preset.currentAge); setRetirementAge(preset.retirementAge); setMonthlySIP(preset.sip); setRetirementExpenses(preset.expenses); }}
                                    className="text-xs px-2.5 py-1 bg-muted hover:bg-muted/80 text-foreground rounded-md font-medium transition-colors border border-border">
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {inputSliders}
                    </CardContent>
                </Card>

                {/* Right: Results Card */}
                <Card className="order-first lg:order-none border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Corpus at Retirement</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.totalCorpus)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Required Corpus</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.corpusRequired)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {result.shortfall > 0 ? 'Shortfall' : 'Surplus'}
                                </p>
                                <p className={`text-base sm:text-lg font-extrabold ${result.shortfall > 0 ? 'text-destructive' : 'text-primary'}`}>
                                    {formatCurrency(result.shortfall > 0 ? result.shortfall : result.surplus)}
                                </p>
                            </div>
                        </div>

                        {result.shortfall > 0 ? (
                            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl mb-4">
                                <p className="text-xs font-bold text-destructive uppercase tracking-widest mb-1">Action Required</p>
                                <p className="text-sm text-destructive">Increase SIP by {formatCurrency(result.sipRequired)}/month to meet your goal</p>
                            </div>
                        ) : (
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl mb-4">
                                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">On Track</p>
                                <p className="text-sm text-primary">You're on track for a comfortable retirement!</p>
                            </div>
                        )}

                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-[280px] h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" strokeWidth={0} paddingAngle={5}>
                                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Chart & Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Projection Chart */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Corpus Growth Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={projectionData}>
                                    <defs>
                                        <linearGradient id="colorRetirement" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="age" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" label={{ value: 'Age', position: 'insideBottom', offset: -2, fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--border))" tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value} />
                                    <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="corpus" stroke="#166534" fill="url(#colorRetirement)" strokeWidth={2} name="Corpus" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Breakdown & Lead Capture */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Year-by-Year Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-muted rounded-xl border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Years to Retire</p>
                                    <p className="text-lg font-bold text-foreground">{result.yearsToRetirement} yrs</p>
                                </div>
                                <div className="p-4 bg-muted rounded-xl border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Return</p>
                                    <p className="text-lg font-bold text-primary">{expectedReturn}%</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-border">
                                        <table className="w-full min-w-full sm:min-w-[400px]">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Age</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Corpus</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Growth</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {(showAllYears ? projectionData : projectionData.filter((_, i) => i % 5 === 0 || i === projectionData.length - 1)).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Age {row.age}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(row.corpus)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">
                                                            {row.corpus > 0 && currentSavings > 0 ? `${((row.corpus / currentSavings - 1) * 100).toFixed(0)}%` : '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {!showAllYears && projectionData.length > 6 && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setShowAllYears(true)}>
                                                        <td colSpan={3} className="px-3 py-3 text-xs text-center text-primary font-bold">Show all years...</td>
                                                    </tr>
                                                )}
                                                {showAllYears && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setShowAllYears(false)}>
                                                        <td colSpan={3} className="px-3 py-3 text-xs text-center text-primary font-bold">Show Less</td>
                                                    </tr>
                                                )}
                                                <tr className="bg-primary/10 border-t-2 border-primary/20">
                                                    <td className="px-3 py-3 text-sm font-bold text-foreground">At {retirementAge}</td>
                                                    <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(result.totalCorpus)}</td>
                                                    <td className="px-3 py-3 text-sm text-right font-bold text-foreground">-</td>
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
                                    You need <span className="font-bold">{formatCurrency(result.corpusRequired)}</span> at age {retirementAge}. Invest <span className="font-bold">{formatCurrency(monthlySIP)}/month</span> SIP for {result.yearsToRetirement} years.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.shortfall === 0 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> Retirement Secured
                                        </Badge>
                                    )}
                                    {result.totalCorpus > 10000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <Home className="w-3 h-3" /> Legacy Wealth
                                        </Badge>
                                    )}
                                    {result.yearsToRetirement <= 20 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <Plane className="w-3 h-3" /> Early Retirement
                                        </Badge>
                                    )}
                                    {result.totalCorpus > 5000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <GraduationCap className="w-3 h-3" /> Child's Education Fund
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Lead Capture */}
                            <div className="p-5 bg-card rounded-xl border border-border shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        Get Retirement Roadmap (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Get a personalized retirement roadmap with fund recommendations for your {formatCurrency(result.corpusRequired)} goal.
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
