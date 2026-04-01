"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Calendar, Percent, TrendingUp, ChevronDown, ChevronUp, FileText, Lock, Trophy, Sparkles, CheckCircle2, Home, Car, GraduationCap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { toast } from "sonner";

export function SimpleInterestCalculator() {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(8);
    const [time, setTime] = useState(3);
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
        setTimeout(() => {
            setIsSubmitting(false);
            setEmail("");
            toast.success("Report sent! Check your inbox.");
        }, 1500);
    };

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    // SI Formula: (P × R × T) / 100
    const simpleInterest = (principal * rate * time) / 100;
    const totalAmount = principal + simpleInterest;

    const chartData = [
        { name: 'Invested', value: Math.round(principal), color: '#166534' },
        { name: 'Interest Earned', value: Math.round(simpleInterest), color: '#16a34a' },
    ];

    const yearlyData = Array.from({ length: time }, (_, i) => {
        const yr = i + 1;
        const interest = (principal * rate * yr) / 100;
        return {
            year: yr,
            interest: Math.round(interest),
            total: Math.round(principal + interest),
        };
    });

    const growthData = [
        { year: 'Y0', value: Math.round(principal) },
        ...yearlyData.map((r) => ({ year: `Y${r.year}`, value: r.total })),
    ];

    const presets = [
        { label: '₹10K 5% 1yr', p: 10000, r: 5, t: 1 },
        { label: '₹1L 8% 3yr', p: 100000, r: 8, t: 3 },
        { label: '₹5L 10% 5yr', p: 500000, r: 10, t: 5 },
        { label: '₹10L 12% 10yr', p: 1000000, r: 12, t: 10 },
    ];

    const inputSliders = (
        <div className="space-y-4">
            {/* Principal */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold text-foreground">Principal Amount</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                            type="number" inputMode="decimal"
                            value={principal}
                            onChange={(e) => setPrincipal(Number(e.target.value))}
                            className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground"
                        />
                    </div>
                </div>
                <Slider value={[principal]} onValueChange={(v) => setPrincipal(v[0])} min={1000} max={5000000} step={1000} className="py-2" />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>₹1,000</span><span>₹50 L</span>
                </div>
            </div>

            {/* Rate */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold text-foreground">Rate of Interest (% p.a.)</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                            type="number" inputMode="decimal"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="w-20 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground"
                        />
                    </div>
                </div>
                <Slider value={[rate]} onValueChange={(v) => setRate(v[0])} min={1} max={30} step={0.1} className="py-2" />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>1%</span><span>30%</span>
                </div>
            </div>

            {/* Time */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold text-foreground">Time Period (Years)</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                            type="number" inputMode="decimal"
                            value={time}
                            onChange={(e) => setTime(Number(e.target.value))}
                            className="w-20 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground"
                        />
                    </div>
                </div>
                <Slider value={[time]} onValueChange={(v) => setTime(v[0])} min={1} max={30} step={1} className="py-2" />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>1 yr</span><span>30 yrs</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* SECTION 1 — Mobile Collapsible */}
            <div className="lg:hidden">
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="cursor-pointer" onClick={() => setInputsExpanded(!inputsExpanded)}>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-lg mb-1">Simple Interest Calculator</CardTitle>
                                <CardDescription className="text-xs">Tap to adjust inputs</CardDescription>
                            </div>
                            {inputsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                    </CardHeader>
                    {inputsExpanded && (
                        <CardContent className="space-y-4 pt-0">
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground">Principal</p>
                                    <p className="text-xs font-bold text-foreground">{formatCurrency(principal)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground">Rate</p>
                                    <p className="text-xs font-bold text-foreground">{rate}%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground">Time</p>
                                    <p className="text-xs font-bold text-foreground">{time} yrs</p>
                                </div>
                            </div>
                            {inputSliders}
                        </CardContent>
                    )}
                </Card>
            </div>

            {/* SECTION 2 — Desktop 2-col grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card */}
                <Card className="hidden lg:block border-border shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">Simple Interest Calculator</CardTitle>
                                <CardDescription>Calculate interest on principal without compounding</CardDescription>
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
                        {/* Preset Scenarios */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                            <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Examples:</span>
                            {presets.map((preset, idx) => (
                                <button key={idx} onClick={() => { setPrincipal(preset.p); setRate(preset.r); setTime(preset.t); }}
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
                <Card id="calculator-results" className="order-first lg:order-none border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        {/* 3 stat boxes */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">PRINCIPAL</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(principal)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">INTEREST EARNED</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(Math.round(simpleInterest))}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">TOTAL AMOUNT</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(Math.round(totalAmount))}</p>
                            </div>
                        </div>
                        {/* Pie chart */}
                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-[280px] h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" strokeWidth={0} paddingAngle={5}>
                                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="flex justify-center gap-6 -mt-2">
                            {chartData.map((item) => (
                                <div key={item.name} className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs text-muted-foreground">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* SECTION 3 — Bottom 2-col grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Growth Projection Chart */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Growth Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colorSIValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--border))" tickFormatter={(v) => v >= 100000 ? `${(v / 100000).toFixed(0)}L` : String(v)} />
                                    <Tooltip formatter={(v: number | undefined) => v !== undefined ? formatCurrency(v) : ''} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="value" stroke="#166534" fill="url(#colorSIValue)" strokeWidth={2} name="Total Value" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Year-by-Year Breakdown */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Year-by-Year Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">ANNUAL INTEREST</p>
                                    <p className="text-lg font-bold text-foreground">{formatCurrency(Math.round((principal * rate) / 100))}</p>
                                </div>
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">TOTAL RETURN %</p>
                                    <p className="text-lg font-bold text-foreground">{((simpleInterest / principal) * 100).toFixed(1)}%</p>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-border">
                                        <table className="w-full min-w-full sm:min-w-[500px]">
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
                                                        <td colSpan={3} className="px-3 py-3 text-xs text-center text-primary-600 font-bold">Show {yearlyData.length - 10} more years...</td>
                                                    </tr>
                                                )}
                                                {showAllYears && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setShowAllYears(false)}>
                                                        <td colSpan={3} className="px-3 py-3 text-xs text-center text-primary-600 font-bold">Show Less</td>
                                                    </tr>
                                                )}
                                                <tr className="bg-primary/10 border-t-2 border-primary/20">
                                                    <td className="px-3 py-3 text-sm font-bold text-foreground">Final</td>
                                                    <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(Math.round(simpleInterest))}</td>
                                                    <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(Math.round(totalAmount))}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* What This Means */}
                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-emerald-950/30 dark:to-emerald-950/30 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Trophy className="w-24 h-24 text-emerald-600" />
                                </div>
                                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> What This Means
                                </h3>
                                <p className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-3">
                                    Your {formatCurrency(principal)} earns {formatCurrency(Math.round(simpleInterest))} simple interest over {time} {time === 1 ? 'year' : 'years'}, totaling {formatCurrency(Math.round(totalAmount))}.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {totalAmount >= 500000 && (
                                        <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full font-medium">
                                            <Home className="w-3 h-3" /> Home Down Payment
                                        </span>
                                    )}
                                    {totalAmount >= 300000 && (
                                        <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full font-medium">
                                            <Car className="w-3 h-3" /> Vehicle Purchase
                                        </span>
                                    )}
                                    {totalAmount >= 100000 && (
                                        <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full font-medium">
                                            <GraduationCap className="w-3 h-3" /> Education Fund
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full font-medium">
                                        <TrendingUp className="w-3 h-3" /> {((simpleInterest / principal) * 100).toFixed(1)}% Return
                                    </span>
                                </div>
                            </div>

                            {/* Lead Capture */}
                            <div className="p-5 bg-card rounded-xl border border-border shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary-600" />
                                        Get Detailed Report (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">Get a complete breakdown of your simple interest calculation with year-wise interest schedule and investment tips.</p>
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
