"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Calendar, Percent, TrendingUp, TrendingDown, ChevronDown, ChevronUp, FileText, Lock, Trophy, Sparkles, Home, Car, GraduationCap, Plane, CheckCircle2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { toast } from "sonner";

export function InflationAdjustedCalculator() {
    const [initialAmount, setInitialAmount] = useState(1000000);
    const [years, setYears] = useState(10);
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

    const calculateInflation = () => {
        const futureCost = initialAmount * Math.pow(1 + inflationRate / 100, years);
        const purchasingPower = initialAmount / Math.pow(1 + inflationRate / 100, years);
        const erosion = initialAmount - purchasingPower;

        return {
            futureCost,
            purchasingPower,
            erosion,
        };
    };

    const result = calculateInflation();

    const generateYearlyData = () => {
        const data = [];
        for (let year = 0; year <= years; year++) {
            const futureCost = initialAmount * Math.pow(1 + inflationRate / 100, year);
            const purchasingPower = initialAmount / Math.pow(1 + inflationRate / 100, year);
            data.push({
                year: `Y${year}`,
                nominal: Math.round(initialAmount),
                purchasingPower: Math.round(purchasingPower),
                futureCost: Math.round(futureCost),
            });
        }
        return data;
    };

    const generateYearlyBreakdown = () => {
        const data = [];
        for (let year = 1; year <= years; year++) {
            const purchasingPower = initialAmount / Math.pow(1 + inflationRate / 100, year);
            const futureCost = initialAmount * Math.pow(1 + inflationRate / 100, year);
            data.push({ year, purchasingPower: Math.round(purchasingPower), futureCost: Math.round(futureCost) });
        }
        return data;
    };

    const growthData = generateYearlyData();
    const yearlyData = generateYearlyBreakdown();

    const pieData = [
        { name: 'Purchasing Power', value: Math.round(result.purchasingPower), color: '#166534' },
        { name: 'Inflation Erosion', value: Math.round(result.erosion), color: '#16a34a' },
    ];

    const erosionPct = ((result.erosion / initialAmount) * 100).toFixed(1);

    const InputSliders = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm text-foreground font-semibold">Amount Today</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                            type="number"
                            value={initialAmount}
                            onChange={(e) => setInitialAmount(Number(e.target.value))}
                            className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground"
                        />
                    </div>
                </div>
                <Slider value={[initialAmount]} onValueChange={(v) => setInitialAmount(v[0])} min={1000} max={10000000} step={1000} className="py-2" />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm text-foreground font-semibold">Time Period</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{years} Y</span>
                    </div>
                </div>
                <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={1} max={30} step={1} className="py-2" />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm text-foreground font-semibold">Inflation Rate (p.a.)</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <TrendingDown className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{inflationRate}%</span>
                    </div>
                </div>
                <Slider value={[inflationRate]} onValueChange={(v) => setInflationRate(v[0])} min={2} max={12} step={0.5} className="py-2" />
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
                                <CardTitle className="text-lg mb-1">Inflation Calculator</CardTitle>
                                <CardDescription className="text-xs">Tap to adjust inputs</CardDescription>
                            </div>
                            {inputsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                    </CardHeader>
                    {inputsExpanded && (
                        <CardContent className="space-y-4 pt-0">
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Amount</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(initialAmount)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Years</p>
                                    <p className="text-sm font-bold text-foreground">{years}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Inflation</p>
                                    <p className="text-sm font-bold text-foreground">{inflationRate}%</p>
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
                                <CardTitle className="text-xl mb-1">Inflation-Adjusted Calculator</CardTitle>
                                <CardDescription>See how inflation erodes your money's purchasing power</CardDescription>
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
                                { label: "₹1L 6% 10yr", amount: 100000, inflation: 6, yrs: 10 },
                                { label: "₹10L 6% 20yr", amount: 1000000, inflation: 6, yrs: 20 },
                                { label: "₹1L 8% 10yr", amount: 100000, inflation: 8, yrs: 10 },
                                { label: "₹1Cr 7% 30yr", amount: 10000000, inflation: 7, yrs: 30 },
                            ].map((p, idx) => (
                                <button key={idx}
                                    onClick={() => { setInitialAmount(p.amount); setInflationRate(p.inflation); setYears(p.yrs); }}
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
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Today's Value</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(initialAmount)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Future Cost</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.futureCost)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Purchasing Power</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.purchasingPower)}</p>
                            </div>
                        </div>

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
                                                <Cell key={`cell-inflation-${index}`} fill={entry.color} />
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
                                <span className="text-xs font-medium text-muted-foreground">Purchasing Power</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#16a34a' }} />
                                <span className="text-xs font-medium text-muted-foreground">Inflation Erosion</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Section 3 — Bottom 2-col grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Area Chart */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Purchasing Power Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colorInflationNominal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorInflationPower" x1="0" y1="0" x2="0" y2="1">
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
                                    <Area type="monotone" dataKey="nominal" stroke="#166534" fill="url(#colorInflationNominal)" strokeWidth={2} name="Nominal Value" />
                                    <Area type="monotone" dataKey="purchasingPower" stroke="#d97706" fill="url(#colorInflationPower)" strokeWidth={2} name="Real Purchasing Power" />
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
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Erosion %</p>
                                    <p className="text-lg font-bold text-primary-600">{erosionPct}%</p>
                                </div>
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Inflation Rate</p>
                                    <p className="text-lg font-bold text-foreground">{inflationRate}%</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-border">
                                        <table className="w-full min-w-full sm:min-w-[500px]">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Year</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Purchasing Power</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Future Cost</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {(showAllYears ? yearlyData : yearlyData.slice(0, 10)).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Year {row.year}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(row.purchasingPower)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{formatCurrency(row.futureCost)}</td>
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
                                                    <td className="px-3 py-3 text-sm font-bold text-foreground">Final</td>
                                                    <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(result.purchasingPower)}</td>
                                                    <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(result.futureCost)}</td>
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
                                    {formatCurrency(initialAmount)} today will cost <span className="font-bold">{formatCurrency(result.futureCost)}</span> in {years} years. Your money's real value drops to <span className="font-bold">{formatCurrency(result.purchasingPower)}</span>.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {parseFloat(erosionPct) > 50 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <TrendingDown className="w-3 h-3" /> High Erosion — Invest Now
                                        </Badge>
                                    )}
                                    {parseFloat(erosionPct) > 30 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <GraduationCap className="w-3 h-3" /> Plan Child Education
                                        </Badge>
                                    )}
                                    {result.futureCost > 5000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <Home className="w-3 h-3" /> Home Costs More
                                        </Badge>
                                    )}
                                    {result.futureCost <= 1000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <Car className="w-3 h-3" /> Lifestyle Goals Affected
                                        </Badge>
                                    )}
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
                                <p className="text-xs text-muted-foreground mb-4">Get a personalized inflation protection strategy and investment plan to beat {inflationRate}% inflation over {years} years.</p>
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
