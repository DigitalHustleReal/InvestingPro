"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Calendar, Percent, TrendingDown, TrendingUp, AlertCircle, ChevronDown, ChevronUp, FileText, Lock, Trophy, Sparkles, CheckCircle2, Home, GraduationCap, Plane } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { toast } from "sonner";

interface SWPResult {
    monthlyWithdrawal: number;
    totalWithdrawn: number;
    remainingCorpus: number;
    totalMonths: number;
    monthsExhausted: number;
    exhausted: boolean;
}

export function SWPCalculator() {
    const [corpus, setCorpus] = useState(10000000);
    const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(50000);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [years, setYears] = useState(20);
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

    const calculateSWP = (): SWPResult => {
        const monthlyRate = expectedReturn / 100 / 12;
        const months = years * 12;
        let remainingCorpus = corpus;
        let totalWithdrawn = 0;
        let monthsExhausted = 0;
        let exhausted = false;
        let currentWithdrawal = monthlyWithdrawal;

        for (let month = 1; month <= months; month++) {
            if (remainingCorpus <= 0) {
                exhausted = true;
                monthsExhausted = month - 1;
                break;
            }
            remainingCorpus = remainingCorpus * (1 + monthlyRate);
            if (remainingCorpus >= currentWithdrawal) {
                remainingCorpus -= currentWithdrawal;
                totalWithdrawn += currentWithdrawal;
            } else {
                totalWithdrawn += remainingCorpus;
                remainingCorpus = 0;
                exhausted = true;
                monthsExhausted = month;
                break;
            }
            if (adjustForInflation && month % 12 === 0) {
                currentWithdrawal = currentWithdrawal * (1 + inflationRate / 100);
            }
        }

        return {
            monthlyWithdrawal: adjustForInflation ? currentWithdrawal : monthlyWithdrawal,
            totalWithdrawn,
            remainingCorpus: Math.max(0, remainingCorpus),
            totalMonths: months,
            monthsExhausted: exhausted ? monthsExhausted : months,
            exhausted
        };
    };

    const generateProjectionData = () => {
        const data = [];
        const monthlyRate = expectedReturn / 100 / 12;
        const months = years * 12;
        let remainingCorpus = corpus;
        let currentWithdrawal = monthlyWithdrawal;

        for (let month = 0; month <= months; month += 12) {
            if (month === 0) {
                data.push({ year: `Year 0`, corpus, withdrawn: 0 });
            } else {
                let yearWithdrawn = 0;
                for (let m = 0; m < 12; m++) {
                    remainingCorpus = remainingCorpus * (1 + monthlyRate);
                    if (remainingCorpus >= currentWithdrawal) {
                        remainingCorpus -= currentWithdrawal;
                        yearWithdrawn += currentWithdrawal;
                    } else {
                        yearWithdrawn += remainingCorpus;
                        remainingCorpus = 0;
                        break;
                    }
                    if (adjustForInflation && m === 11) {
                        currentWithdrawal = currentWithdrawal * (1 + inflationRate / 100);
                    }
                }
                data.push({ year: `Year ${month / 12}`, corpus: Math.max(0, remainingCorpus), withdrawn: yearWithdrawn });
                if (remainingCorpus <= 0) break;
            }
        }
        return data;
    };

    const generateYearlyBreakdown = () => {
        const monthlyRate = expectedReturn / 100 / 12;
        let remainingCorpus = corpus;
        let currentWithdrawal = monthlyWithdrawal;
        const data = [];

        for (let year = 1; year <= Math.min(years, 15); year++) {
            let yearWithdrawn = 0;
            const startCorpus = remainingCorpus;

            for (let m = 0; m < 12 && remainingCorpus > 0; m++) {
                remainingCorpus = remainingCorpus * (1 + monthlyRate);
                if (remainingCorpus >= currentWithdrawal) {
                    remainingCorpus -= currentWithdrawal;
                    yearWithdrawn += currentWithdrawal;
                } else {
                    yearWithdrawn += remainingCorpus;
                    remainingCorpus = 0;
                    break;
                }
                if (adjustForInflation && m === 11) {
                    currentWithdrawal = currentWithdrawal * (1 + inflationRate / 100);
                }
            }

            data.push({ year, corpusStart: startCorpus, withdrawn: yearWithdrawn, corpusEnd: remainingCorpus });
            if (remainingCorpus <= 0) break;
        }
        return data;
    };

    const result = calculateSWP();
    const projectionData = generateProjectionData();
    const yearlyData = generateYearlyBreakdown();

    const swpChartData = [
        { name: 'Total Withdrawn', value: result.totalWithdrawn, color: '#166534' },
        { name: 'Remaining Corpus', value: result.remainingCorpus, color: '#16a34a' },
    ];

    const presets = [
        { label: "₹10L 5K/mo 8%", corpus: 1000000, withdrawal: 5000, ret: 8 },
        { label: "₹50L 20K/mo 10%", corpus: 5000000, withdrawal: 20000, ret: 10 },
        { label: "₹1Cr 50K/mo 10%", corpus: 10000000, withdrawal: 50000, ret: 10 },
        { label: "₹1Cr 60K/mo 12%", corpus: 10000000, withdrawal: 60000, ret: 12 },
    ];

    const applyPreset = (p: { label: string; corpus: number; withdrawal: number; ret: number }) => {
        setCorpus(p.corpus);
        setMonthlyWithdrawal(p.withdrawal);
        setExpectedReturn(p.ret);
    };

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Section 1: Mobile Collapsible */}
            <div className="lg:hidden">
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="cursor-pointer" onClick={() => setInputsExpanded(!inputsExpanded)}>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-lg mb-1">SWP Calculator</CardTitle>
                                <CardDescription className="text-xs">Tap to adjust inputs</CardDescription>
                            </div>
                            {inputsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                    </CardHeader>
                    {inputsExpanded && (
                        <CardContent className="space-y-4 pt-0">
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Corpus</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(corpus)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(monthlyWithdrawal)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Return</p>
                                    <p className="text-sm font-bold text-foreground">{expectedReturn}%</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold">Initial Corpus</Label>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                            <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                            <Input type="number" inputMode="decimal" value={corpus} onChange={(e) => setCorpus(Number(e.target.value))} className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                                        </div>
                                    </div>
                                    <Slider value={[corpus]} onValueChange={(v) => setCorpus(v[0])} min={1000000} max={100000000} step={100000} className="py-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold">Monthly Withdrawal</Label>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                            <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                            <Input type="number" inputMode="decimal" value={monthlyWithdrawal} onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))} className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                                        </div>
                                    </div>
                                    <Slider value={[monthlyWithdrawal]} onValueChange={(v) => setMonthlyWithdrawal(v[0])} min={10000} max={500000} step={5000} className="py-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold">Expected Return</Label>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                            <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span className="text-sm font-bold text-foreground">{expectedReturn}%</span>
                                        </div>
                                    </div>
                                    <Slider value={[expectedReturn]} onValueChange={(v) => setExpectedReturn(v[0])} min={1} max={20} step={0.5} className="py-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold">Withdrawal Period</Label>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span className="text-sm font-bold text-foreground">{years} Y</span>
                                        </div>
                                    </div>
                                    <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={1} max={40} step={1} className="py-2" />
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
                                <CardTitle className="text-xl mb-1">SWP Calculator</CardTitle>
                                <CardDescription>Calculate systematic withdrawal plan with inflation adjustment and corpus sustainability</CardDescription>
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
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-foreground font-semibold">Initial Corpus</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                        <Input type="number" inputMode="decimal" value={corpus} onChange={(e) => setCorpus(Number(e.target.value))} className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground" />
                                    </div>
                                </div>
                                <Slider value={[corpus]} onValueChange={(v) => setCorpus(v[0])} min={1000000} max={100000000} step={100000} className="py-2" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-foreground font-semibold">Monthly Withdrawal</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                        <Input type="number" inputMode="decimal" value={monthlyWithdrawal} onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))} className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground" />
                                    </div>
                                </div>
                                <Slider value={[monthlyWithdrawal]} onValueChange={(v) => setMonthlyWithdrawal(v[0])} min={10000} max={500000} step={5000} className="py-2" />
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {[30000, 50000, 75000, 100000].map((amount) => (
                                        <button key={amount} onClick={() => setMonthlyWithdrawal(amount)} className={`text-xs px-2 py-0.5 rounded-md font-medium transition-all ${monthlyWithdrawal === amount ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-muted-foreground'}`}>
                                            ₹{amount / 1000}K
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-foreground font-semibold">Expected Return (p.a.)</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-sm font-bold text-foreground">{expectedReturn}%</span>
                                    </div>
                                </div>
                                <Slider value={[expectedReturn]} onValueChange={(v) => setExpectedReturn(v[0])} min={1} max={20} step={0.5} className="py-2" />
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {[8, 10, 12, 15].map((rate) => (
                                        <button key={rate} onClick={() => setExpectedReturn(rate)} className={`text-xs px-2 py-0.5 rounded-md font-medium transition-all ${expectedReturn === rate ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-muted-foreground'}`}>
                                            {rate}%
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-foreground font-semibold">Withdrawal Period</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-sm font-bold text-foreground">{years} Y</span>
                                    </div>
                                </div>
                                <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={1} max={40} step={1} className="py-2" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-amber-600" />
                                <div>
                                    <Label className="text-sm text-foreground font-semibold">Adjust for Inflation</Label>
                                    <p className="text-xs text-muted-foreground">Increase withdrawal annually</p>
                                </div>
                            </div>
                            <Switch checked={adjustForInflation} onCheckedChange={setAdjustForInflation} />
                        </div>

                        {adjustForInflation && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-foreground font-semibold">Inflation Rate</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-sm font-bold text-foreground">{inflationRate}%</span>
                                    </div>
                                </div>
                                <Slider value={[inflationRate]} onValueChange={(v) => setInflationRate(v[0])} min={2} max={10} step={0.5} className="py-2" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card id="calculator-results" className="order-first lg:order-none border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        {result.exhausted && (
                            <div className="p-4 bg-accent-50 border border-accent-200 rounded-xl mb-4">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-accent-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-accent-900 mb-1">Corpus Exhausted</p>
                                        <p className="text-xs text-accent-700">
                                            Corpus exhausted after {result.monthsExhausted} months. Consider reducing withdrawal or increasing returns.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Total Withdrawn</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.totalWithdrawn)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Remaining</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.remainingCorpus)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Duration</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">
                                    {Math.floor(result.monthsExhausted / 12)}Y {result.monthsExhausted % 12}M
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-card rounded-xl border border-border mb-4">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Monthly Withdrawal</p>
                            <p className="text-lg font-bold text-primary">{formatCurrency(result.monthlyWithdrawal)}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {adjustForInflation ? 'Inflation-adjusted amount' : 'Fixed amount per month'}
                            </p>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-[280px] h-[240px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={swpChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" strokeWidth={0} paddingAngle={5}>
                                            {swpChartData.map((entry, index) => (
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
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Corpus Depletion Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={projectionData}>
                                    <defs>
                                        <linearGradient id="colorSWPCorpus" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--border))" tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value} />
                                    <Tooltip formatter={(value: any) => formatCurrency(value)} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="corpus" stroke="#166534" fill="url(#colorSWPCorpus)" strokeWidth={2} name="Corpus Remaining" />
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
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Monthly Withdrawal</p>
                                    <p className="text-lg font-bold text-foreground">{formatCurrency(result.monthlyWithdrawal)}</p>
                                </div>
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Expected Return</p>
                                    <p className="text-lg font-bold text-primary-600">{expectedReturn}%</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-border">
                                        <table className="w-full min-w-full sm:min-w-[500px]">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Year</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Withdrawn</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Remaining</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {(showAllYears ? yearlyData : yearlyData.slice(0, 10)).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Year {row.year}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(row.withdrawn)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{formatCurrency(row.corpusEnd)}</td>
                                                    </tr>
                                                ))}
                                                {!showAllYears && yearlyData.length > 10 && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setShowAllYears(true)}>
                                                        <td colSpan={3} className="px-3 py-3 text-xs text-center text-primary-600 font-bold">
                                                            Show {yearlyData.length - 10} more years...
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
                                                {!showAllYears && yearlyData.length > 0 && (
                                                    <tr className="bg-primary/10 border-t-2 border-primary/20">
                                                        <td className="px-3 py-3 text-sm font-bold text-foreground">Final</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(result.totalWithdrawn)}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(result.remainingCorpus)}</td>
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
                                    Your <span className="font-bold">{formatCurrency(corpus)}</span> corpus supports <span className="font-bold text-2xl underline decoration-emerald-400 decoration-2 underline-offset-2">{formatCurrency(monthlyWithdrawal)}/month</span> for {Math.floor(result.monthsExhausted / 12)} years!
                                    {!result.exhausted && ` With ₹${formatCurrency(result.remainingCorpus)} remaining.`}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {!result.exhausted && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> Sustainable Withdrawal
                                        </Badge>
                                    )}
                                    {result.remainingCorpus > 5000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <Home className="w-3 h-3" /> Legacy for Family
                                        </Badge>
                                    )}
                                    {result.totalWithdrawn > 5000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <GraduationCap className="w-3 h-3" /> Comfortable Retirement
                                        </Badge>
                                    )}
                                    {result.totalWithdrawn > 2000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <Plane className="w-3 h-3" /> Travel & Lifestyle
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="p-5 bg-card rounded-xl border border-border shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary-600" />Get Retirement Withdrawal Strategy (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Get a personalized retirement withdrawal plan optimized for your {formatCurrency(corpus)} corpus and {formatCurrency(monthlyWithdrawal)}/month lifestyle.
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
