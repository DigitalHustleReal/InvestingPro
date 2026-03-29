"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/Button";
import { IndianRupee, Calendar, Percent, Info, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, Trophy, Sparkles, FileText, Lock, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast } from "sonner";

export function EMICalculatorEnhanced() {
    const [emiLoan, setEmiLoan] = useState(5000000);
    const [emiRate, setEmiRate] = useState(8.5);
    const [emiTenure, setEmiTenure] = useState(20);
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

    const calculateEMI = () => {
        const monthlyRate = emiRate / 100 / 12;
        const months = emiTenure * 12;
        const emi = (emiLoan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        const totalPayment = emi * months;
        const totalInterest = totalPayment - emiLoan;

        const schedule = [];
        let remainingPrincipal = emiLoan;
        for (let month = 1; month <= Math.min(12, months); month++) {
            const interestPayment = remainingPrincipal * monthlyRate;
            const principalPayment = emi - interestPayment;
            remainingPrincipal -= principalPayment;
            schedule.push({ month: `M${month}`, principal: principalPayment, interest: interestPayment });
        }

        return { emi, totalPayment, totalInterest, schedule };
    };

    const generateYearlyBreakdown = () => {
        const monthlyRate = emiRate / 100 / 12;
        const months = emiTenure * 12;
        const emi = (emiLoan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        const data = [];
        let remainingPrincipal = emiLoan;

        for (let year = 1; year <= emiTenure; year++) {
            let yearPrincipal = 0;
            let yearInterest = 0;

            for (let month = 0; month < 12 && remainingPrincipal > 0; month++) {
                const interestPayment = remainingPrincipal * monthlyRate;
                const principalPayment = emi - interestPayment;
                remainingPrincipal -= principalPayment;
                yearPrincipal += principalPayment;
                yearInterest += interestPayment;
            }

            data.push({ year, principal: yearPrincipal, interest: yearInterest, remaining: Math.max(0, remainingPrincipal) });
        }
        return data;
    };

    // Balance declining chart data
    const generateBalanceData = () => {
        const monthlyRate = emiRate / 100 / 12;
        const months = emiTenure * 12;
        const emi = (emiLoan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        const data = [];
        let remainingPrincipal = emiLoan;

        data.push({ year: 'Y0', balance: emiLoan });
        for (let year = 1; year <= emiTenure; year++) {
            for (let month = 0; month < 12 && remainingPrincipal > 0; month++) {
                const interestPayment = remainingPrincipal * monthlyRate;
                const principalPayment = emi - interestPayment;
                remainingPrincipal -= principalPayment;
            }
            data.push({ year: `Y${year}`, balance: Math.max(0, remainingPrincipal) });
        }
        return data;
    };

    const emiResult = calculateEMI();
    const yearlyData = generateYearlyBreakdown();
    const balanceData = generateBalanceData();

    const emiChartData = [
        { name: 'Principal', value: emiLoan, color: '#166534' },
        { name: 'Interest', value: emiResult.totalInterest, color: '#d97706' },
    ];

    const interestRatio = ((emiResult.totalInterest / emiResult.totalPayment) * 100).toFixed(1);

    const inputSliders = (
        <div className="space-y-4">
            {/* Loan Amount */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Loan Amount</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                        <Input type="number" inputMode="decimal" value={emiLoan} onChange={(e) => setEmiLoan(Number(e.target.value))} className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                    </div>
                </div>
                <Slider value={[emiLoan]} onValueChange={(v) => setEmiLoan(v[0])} min={100000} max={20000000} step={100000} className="py-2" />
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                        <Label className="text-sm font-semibold">Interest Rate</Label>
                        <div className="group relative">
                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl">
                                <div className="font-semibold mb-1.5">EMI Formula:</div>
                                <div className="text-[10px] font-mono leading-relaxed">
                                    EMI = [P × r × (1+r)^n] / [(1+r)^n - 1]<br />
                                    P = Principal, r = Monthly Rate, n = Months
                                    <div className="mt-2 pt-2 border-t border-gray-700 text-gray-300">Higher rate = Higher EMI</div>
                                </div>
                                <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{emiRate}%</span>
                    </div>
                </div>
                <Slider value={[emiRate]} onValueChange={(v) => setEmiRate(v[0])} min={1} max={30} step={0.1} className="py-2" />
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {[7.5, 8.5, 9.5, 11, 12, 14].map((rate) => (
                        <button key={rate} onClick={() => setEmiRate(rate)}
                            className={`text-xs px-2 py-0.5 rounded-md font-medium transition-all ${Math.abs(emiRate - rate) < 0.2 ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-muted-foreground border border-border'}`}>
                            {rate}%
                        </button>
                    ))}
                </div>
            </div>

            {/* Loan Tenure */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Loan Tenure</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{emiTenure} Y</span>
                    </div>
                </div>
                <Slider value={[emiTenure]} onValueChange={(v) => setEmiTenure(v[0])} min={1} max={30} step={1} className="py-2" />
            </div>
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
                                <CardTitle className="text-lg mb-1">EMI Calculator</CardTitle>
                                <CardDescription className="text-xs">Tap to adjust inputs</CardDescription>
                            </div>
                            {inputsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                    </CardHeader>
                    {inputsExpanded && (
                        <CardContent className="space-y-4 pt-0">
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Loan</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(emiLoan)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Rate</p>
                                    <p className="text-sm font-bold text-foreground">{emiRate}%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Tenure</p>
                                    <p className="text-sm font-bold text-foreground">{emiTenure}Y</p>
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
                                <CardTitle className="text-xl mb-1">EMI Calculator</CardTitle>
                                <CardDescription>Calculate your monthly loan EMI with detailed breakdown</CardDescription>
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
                                { label: "Personal ₹2L 2yr", loan: 200000, years: 2, rate: 14 },
                                { label: "Car ₹8L 5yr", loan: 800000, years: 5, rate: 9 },
                                { label: "Home ₹30L 20yr", loan: 3000000, years: 20, rate: 8.5 },
                                { label: "Home ₹60L 30yr", loan: 6000000, years: 30, rate: 8.5 },
                            ].map((preset, idx) => (
                                <button key={idx} onClick={() => { setEmiLoan(preset.loan); setEmiTenure(preset.years); setEmiRate(preset.rate); }}
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
                        <div className="text-center p-6 md:p-8 bg-card rounded-xl shadow-sm border border-border mb-4">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Monthly EMI</p>
                            <p className="text-3xl sm:text-4xl font-extrabold text-primary">{formatCurrency(emiResult.emi)}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-3 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Principal</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(emiLoan)}</p>
                            </div>
                            <div className="text-center p-3 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Total Interest</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(emiResult.totalInterest)}</p>
                            </div>
                            <div className="text-center p-3 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Total Pay</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(emiResult.totalPayment)}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-[200px] h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={emiChartData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={0} paddingAngle={5}>
                                            {emiChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
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
                {/* Left: Outstanding Balance Chart */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Outstanding Balance Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={balanceData}>
                                    <defs>
                                        <linearGradient id="colorEMIBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--border))" tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value} />
                                    <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="balance" stroke="#d97706" fill="url(#colorEMIBalance)" strokeWidth={2} name="Outstanding Balance" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Year-by-Year Breakdown */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Year-by-Year Amortization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-muted rounded-xl border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Monthly EMI</p>
                                    <p className="text-lg font-bold text-foreground">{formatCurrency(emiResult.emi)}</p>
                                </div>
                                <div className="p-4 bg-muted rounded-xl border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Interest Ratio</p>
                                    <p className="text-lg font-bold text-primary">{interestRatio}%</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-border">
                                        <table className="w-full min-w-full sm:min-w-[450px]">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Year</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Principal</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Interest</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {(showAllYears ? yearlyData : yearlyData.slice(0, 10)).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Year {row.year}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(row.principal)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-muted-foreground">{formatCurrency(row.interest)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{formatCurrency(row.remaining)}</td>
                                                    </tr>
                                                ))}
                                                {!showAllYears && yearlyData.length > 10 && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setShowAllYears(true)}>
                                                        <td colSpan={4} className="px-3 py-3 text-xs text-center text-primary font-bold">Show {yearlyData.length - 10} more years...</td>
                                                    </tr>
                                                )}
                                                {showAllYears && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setShowAllYears(false)}>
                                                        <td colSpan={4} className="px-3 py-3 text-xs text-center text-primary font-bold">Show Less</td>
                                                    </tr>
                                                )}
                                                {yearlyData.length > 0 && (
                                                    <tr className="bg-primary/10 border-t-2 border-primary/20">
                                                        <td className="px-3 py-3 text-sm font-bold text-foreground">Total</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(emiLoan)}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(emiResult.totalInterest)}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-foreground">-</td>
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
                                    Your <span className="font-bold">{formatCurrency(emiLoan)}</span> loan costs <span className="font-bold">{formatCurrency(emiResult.totalPayment)}</span> total — you pay <span className="font-bold">{formatCurrency(emiResult.totalInterest)}</span> in interest. Your EMI is <span className="font-bold">{formatCurrency(emiResult.emi)}/month</span>.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <TrendingDown className="w-3 h-3" /> {interestRatio}% goes to interest
                                    </Badge>
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <Info className="w-3 h-3" /> {emiTenure} year tenure
                                    </Badge>
                                </div>
                            </div>

                            {/* Lead Capture */}
                            <div className="p-5 bg-card rounded-xl border border-border shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        Get Top Loan Offers (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Compare top loan offers with lowest interest rates. Save on your {formatCurrency(emiResult.totalInterest)} interest burden.
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
