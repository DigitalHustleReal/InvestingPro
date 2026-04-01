"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";
import { IndianRupee, Calendar, Percent, TrendingDown, CheckCircle2, Zap, HelpCircle, ChevronDown, ChevronUp, Trophy, Sparkles, FileText, Lock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { toast } from "sonner";

export function FDCalculator() {
    const [principal, setPrincipal] = useState(100000);
    const [interestRate, setInterestRate] = useState(7.5);
    const [tenure, setTenure] = useState(5);
    const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
    const [compounding, setCompounding] = useState<'quarterly' | 'monthly' | 'annually'>('quarterly');
    const [adjustForInflation, setAdjustForInflation] = useState(false);
    const [inflationRate, setInflationRate] = useState(6);
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

    const calculateFD = () => {
        const months = tenureType === 'years' ? tenure * 12 : tenure;
        const years = months / 12;

        let maturityAmount = 0;
        const rate = interestRate / 100;

        if (compounding === 'quarterly') {
            const quarterlyRate = rate / 4;
            const quarters = years * 4;
            maturityAmount = principal * Math.pow(1 + quarterlyRate, quarters);
        } else if (compounding === 'monthly') {
            const monthlyRate = rate / 12;
            maturityAmount = principal * Math.pow(1 + monthlyRate, months);
        } else {
            maturityAmount = principal * Math.pow(1 + rate, years);
        }

        const interestEarned = maturityAmount - principal;

        let realValue = maturityAmount;
        let realReturn = interestEarned;
        if (adjustForInflation) {
            realValue = maturityAmount / Math.pow(1 + inflationRate / 100, years);
            realReturn = realValue - principal;
        }

        return {
            maturityAmount,
            interestEarned,
            realValue,
            realReturn,
            effectiveRate: ((maturityAmount / principal) - 1) * 100 / years
        };
    };

    const result = calculateFD();

    const generateGrowthData = () => {
        const months = tenureType === 'years' ? tenure * 12 : tenure;
        const years = months / 12;
        const data = [];
        const rate = interestRate / 100;

        for (let year = 0; year <= Math.min(years, 15); year++) {
            let amount = 0;

            if (compounding === 'quarterly') {
                const quarterlyRate = rate / 4;
                amount = principal * Math.pow(1 + quarterlyRate, year * 4);
            } else if (compounding === 'monthly') {
                const monthlyRate = rate / 12;
                amount = principal * Math.pow(1 + monthlyRate, year * 12);
            } else {
                amount = principal * Math.pow(1 + rate, year);
            }

            const realValue = adjustForInflation ? amount / Math.pow(1 + inflationRate / 100, year) : amount;

            data.push({
                year: `Y${year}`,
                value: amount || principal,
                realValue: realValue || principal,
            });
        }
        return data;
    };

    const generateYearlyBreakdown = () => {
        const months = tenureType === 'years' ? tenure * 12 : tenure;
        const years = months / 12;
        const rate = interestRate / 100;
        const data = [];

        for (let year = 1; year <= Math.min(years, 30); year++) {
            let amount = 0;

            if (compounding === 'quarterly') {
                amount = principal * Math.pow(1 + rate / 4, year * 4);
            } else if (compounding === 'monthly') {
                amount = principal * Math.pow(1 + rate / 12, year * 12);
            } else {
                amount = principal * Math.pow(1 + rate, year);
            }

            const interest = amount - principal;
            const realValue = adjustForInflation ? amount / Math.pow(1 + inflationRate / 100, year) : amount;
            const realInterest = realValue - principal;

            data.push({
                year,
                principal,
                interest: adjustForInflation ? realInterest : interest,
                total: realValue,
            });
        }
        return data;
    };

    const growthData = generateGrowthData();
    const yearlyData = generateYearlyBreakdown();
    const displayMaturity = adjustForInflation ? result.realValue : result.maturityAmount;

    const fdChartData = [
        { name: 'Principal', value: principal, color: '#166534' },
        { name: 'Interest', value: result.interestEarned, color: '#16a34a' },
    ];

    const inputSliders = (
        <div className="space-y-4">
            {/* Principal Amount */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Principal Amount</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                        <Input type="number" inputMode="decimal" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                    </div>
                </div>
                <Slider value={[principal]} onValueChange={(v) => setPrincipal(v[0])} min={1000} max={10000000} step={1000} className="py-2" />
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                        <Label className="text-sm font-semibold">Interest Rate</Label>
                        <div className="group relative">
                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl">
                                <div className="font-semibold mb-1.5">FD Formula:</div>
                                <div className="text-[10px] font-mono leading-relaxed">
                                    A = P × (1 + r/n)^(n×t)<br />
                                    P = Principal, r = Rate,<br />
                                    n = Compounding frequency,<br />
                                    t = Time in years
                                    <div className="mt-2 pt-2 border-t border-gray-700 text-gray-300">Quarterly compounding gives higher returns than annual</div>
                                </div>
                                <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{interestRate}%</span>
                    </div>
                </div>
                <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={3} max={10} step={0.1} className="py-2" />
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {[6, 6.5, 7, 7.5, 8].map((rate) => (
                        <button key={rate} onClick={() => setInterestRate(rate)}
                            className={`text-xs px-2 py-0.5 rounded-md font-medium transition-all ${Math.abs(interestRate - rate) < 0.1 ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-muted-foreground border border-border'}`}>
                            {rate}%
                        </button>
                    ))}
                </div>
            </div>

            {/* Tenure */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Tenure</Label>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                            <Input type="number" inputMode="decimal" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-16 border-0 bg-transparent p-0 text-center text-sm font-bold focus-visible:ring-0 text-foreground" />
                        </div>
                        <select value={tenureType} onChange={(e) => setTenureType(e.target.value as 'years' | 'months')} className="px-2 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                            <option value="years">Years</option>
                            <option value="months">Months</option>
                        </select>
                    </div>
                </div>
                <Slider value={[tenure]} onValueChange={(v) => setTenure(v[0])} min={1} max={tenureType === 'years' ? 10 : 120} step={1} className="py-2" />
            </div>

            {/* Compounding Frequency */}
            <div className="space-y-2">
                <Label className="text-sm font-semibold">Compounding</Label>
                <div className="grid grid-cols-3 gap-2">
                    {(['quarterly', 'monthly', 'annually'] as const).map((freq) => (
                        <button key={freq} onClick={() => setCompounding(freq)}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${compounding === freq ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border'}`}>
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inflation Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-amber-600" />
                    <div>
                        <Label className="text-sm font-semibold">Adjust for Inflation</Label>
                        <p className="text-xs text-muted-foreground">Show real returns</p>
                    </div>
                </div>
                <Switch checked={adjustForInflation} onCheckedChange={setAdjustForInflation} />
            </div>

            {adjustForInflation && (
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm font-semibold">Inflation Rate</Label>
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
                                <CardTitle className="text-lg mb-1">FD Calculator</CardTitle>
                                <CardDescription className="text-xs">Tap to adjust inputs</CardDescription>
                            </div>
                            {inputsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                    </CardHeader>
                    {inputsExpanded && (
                        <CardContent className="space-y-4 pt-0">
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Principal</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(principal)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Rate</p>
                                    <p className="text-sm font-bold text-foreground">{interestRate}%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Tenure</p>
                                    <p className="text-sm font-bold text-foreground">{tenure}{tenureType === 'years' ? 'Y' : 'M'}</p>
                                </div>
                            </div>
                            {inputSliders}
                        </CardContent>
                    )}
                </Card>
            </div>

            {/* Desktop: Top Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card */}
                <Card className="hidden lg:block border-border shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">Fixed Deposit Calculator</CardTitle>
                                <CardDescription>Calculate FD maturity amount with compounding interest</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge className="bg-primary/10 text-primary border-primary/20 shadow-sm cursor-default">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Free
                                </Badge>
                                <Badge className="bg-primary/10 text-primary border-primary/20 shadow-sm cursor-default text-[10px]">
                                    <Zap className="w-3 h-3 mr-1" /> Instant
                                </Badge>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                            <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Examples:</span>
                            {[
                                { label: "₹10K 1yr 7%", principal: 10000, years: 1, rate: 7 },
                                { label: "₹1L 3yr 7.5%", principal: 100000, years: 3, rate: 7.5 },
                                { label: "₹5L 5yr 8%", principal: 500000, years: 5, rate: 8 },
                                { label: "₹10L 10yr 8%", principal: 1000000, years: 10, rate: 8 },
                            ].map((preset, idx) => (
                                <button key={idx} onClick={() => { setPrincipal(preset.principal); setTenure(preset.years); setInterestRate(preset.rate); setTenureType('years'); }}
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
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Principal</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(principal)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Interest Earned</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.interestEarned)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Value' : 'Maturity'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(displayMaturity)}</p>
                            </div>
                        </div>

                        {adjustForInflation && (
                            <div className="p-3 bg-card rounded-xl border border-border mb-4">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Nominal Value</p>
                                <p className="text-sm font-bold text-foreground">{formatCurrency(result.maturityAmount)}</p>
                                <p className="text-xs text-muted-foreground mt-1">Before inflation adjustment</p>
                            </div>
                        )}

                        <div className="p-4 bg-card rounded-xl border border-border mb-4">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Effective Annual Rate</p>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-bold text-foreground">{result.effectiveRate.toFixed(2)}% p.a.</p>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">vs PPF 7.1%</Badge>
                                    <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">vs Savings 3.5%</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-[200px] h-[160px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={fdChartData} cx="50%" cy="50%" innerRadius={40} outerRadius={58} dataKey="value" strokeWidth={0} paddingAngle={5}>
                                            {fdChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
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
                {/* Left: Growth Chart */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">FD Growth Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colorFDValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorFDReal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--border))" tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value} />
                                    <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="value" stroke="#166534" fill="url(#colorFDValue)" strokeWidth={2} name="Nominal" />
                                    {adjustForInflation && (
                                        <Area type="monotone" dataKey="realValue" stroke="#d97706" fill="url(#colorFDReal)" strokeWidth={2} name="Real (Inflation Adjusted)" />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Year-by-Year Breakdown */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Year-by-Year Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-muted rounded-xl border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Principal</p>
                                    <p className="text-lg font-bold text-foreground">{formatCurrency(principal)}</p>
                                </div>
                                <div className="p-4 bg-muted rounded-xl border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Interest Rate</p>
                                    <p className="text-lg font-bold text-primary">{interestRate}%</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-border">
                                        <table className="w-full min-w-full sm:min-w-[400px]">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Year</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Interest</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {(showAllYears ? yearlyData : yearlyData.slice(0, 10)).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Year {row.year}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(row.interest)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{formatCurrency(row.total)}</td>
                                                    </tr>
                                                ))}
                                                {!showAllYears && yearlyData.length > 10 && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setShowAllYears(true)}>
                                                        <td colSpan={3} className="px-3 py-3 text-xs text-center text-primary font-bold">Show {yearlyData.length - 10} more years...</td>
                                                    </tr>
                                                )}
                                                {showAllYears && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setShowAllYears(false)}>
                                                        <td colSpan={3} className="px-3 py-3 text-xs text-center text-primary font-bold">Show Less</td>
                                                    </tr>
                                                )}
                                                {yearlyData.length > 0 && (
                                                    <tr className="bg-primary/10 border-t-2 border-primary/20">
                                                        <td className="px-3 py-3 text-sm font-bold text-foreground">Final</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(result.interestEarned)}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(displayMaturity)}</td>
                                                    </tr>
                                                )}
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
                                    Your <span className="font-bold">{formatCurrency(principal)}</span> FD matures to <span className="font-bold">{formatCurrency(result.maturityAmount)}</span> — earning <span className="font-bold">{formatCurrency(result.interestEarned)}</span> interest at <span className="font-bold">{interestRate}%</span> per annum.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> {result.effectiveRate.toFixed(2)}% effective yield
                                    </Badge>
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {tenure} {tenureType} tenure
                                    </Badge>
                                </div>
                            </div>

                            {/* Lead Capture */}
                            <div className="p-5 bg-card rounded-xl border border-border shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        Compare FD Rates (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Get FD rates comparison from top banks and earn more on your {formatCurrency(principal)} deposit.
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
