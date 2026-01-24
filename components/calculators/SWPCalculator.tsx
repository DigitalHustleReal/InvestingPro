"use client";

import { useState } from 'react';


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { IndianRupee, Calendar, Percent, TrendingDown, AlertCircle, Info, CheckCircle2, Zap, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

            // Apply returns first
            remainingCorpus = remainingCorpus * (1 + monthlyRate);

            // Withdraw amount
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

            // Adjust for inflation if enabled
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
                data.push({
                    year: `Year 0`,
                    corpus: corpus,
                    withdrawn: 0
                });
            } else {
                // Calculate for the year
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
                data.push({
                    year: `Year ${month / 12}`,
                    corpus: Math.max(0, remainingCorpus),
                    withdrawn: yearWithdrawn
                });
                if (remainingCorpus <= 0) break;
            }
        }
        return data;
    };

    const result = calculateSWP();
    const projectionData = generateProjectionData();

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    // Generate year-by-year breakdown
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

            data.push({
                year,
                corpusStart: startCorpus,
                withdrawn: yearWithdrawn,
                corpusEnd: remainingCorpus,
            });
            if (remainingCorpus <= 0) break;
        }
        return data;
    };

    const yearlyData = generateYearlyBreakdown();

    return (
        <div className="space-y-6">
            {/* Top Row: Inputs on Left, Results on Right */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">SWP Calculator</CardTitle>
                                <CardDescription>Calculate systematic withdrawal plan with inflation adjustment</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge className="bg-primary/10 text-primary border-primary/20 shadow-sm hover:bg-primary/20 transition-colors cursor-default">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Free
                                </Badge>
                                <Badge className="bg-primary/10 text-primary border-primary/20 shadow-sm hover:bg-primary/20 transition-colors cursor-default">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Instant
                                </Badge>
                            </div>
                        </div>
                        {/* Preset Scenarios */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                            <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Examples:</span>
                            {[
                                { label: "Retirement ₹1Cr", corpus: 10000000, withdrawal: 50000, years: 20, return: 12 },
                                { label: "Moderate Income", corpus: 5000000, withdrawal: 30000, years: 15, return: 10 },
                                { label: "Conservative", corpus: 10000000, withdrawal: 40000, years: 25, return: 8 },
                                { label: "High Return", corpus: 10000000, withdrawal: 60000, years: 20, return: 15 },
                            ].map((preset, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setCorpus(preset.corpus);
                                        setMonthlyWithdrawal(preset.withdrawal);
                                        setYears(preset.years);
                                        setExpectedReturn(preset.return);
                                    }}
                                    className="text-xs px-2.5 py-1 bg-muted dark:bg-muted hover:bg-muted/80 dark:hover:bg-muted/80 text-muted-foreground dark:text-muted-foreground rounded-md font-medium transition-colors border border-border"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Stacked Input Sliders */}
                        <div className="space-y-4">
                            {/* Initial Corpus */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-foreground font-semibold">Initial Corpus</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            value={corpus}
                                            onChange={(e) => setCorpus(Number(e.target.value))}
                                            className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground"
                                        />
                                    </div>
                                </div>
                                <Slider
                                    value={[corpus]}
                                    onValueChange={(value) => setCorpus(value[0])}
                                    min={1000000}
                                    max={100000000}
                                    step={100000}
                                    className="py-2"
                                />
                            </div>

                            {/* Monthly Withdrawal */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-foreground font-semibold">Monthly Withdrawal</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            value={monthlyWithdrawal}
                                            onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
                                            className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground"
                                        />
                                    </div>
                                </div>
                                <Slider
                                    value={[monthlyWithdrawal]}
                                    onValueChange={(value) => setMonthlyWithdrawal(value[0])}
                                    min={10000}
                                    max={500000}
                                    step={5000}
                                    className="py-2"
                                />
                                {/* Quick adjustment buttons */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {[30000, 50000, 75000, 100000].map((amount) => (
                                        <button
                                            key={amount}
                                            onClick={() => setMonthlyWithdrawal(amount)}
                                            className={`text-xs px-2 py-0.5 rounded-md font-medium transition-all ${
                                                monthlyWithdrawal === amount
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                                            }`}
                                        >
                                            ₹{amount / 1000}K
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Expected Return */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1.5">
                                        <Label className="text-sm text-slate-700 font-semibold">Expected Return</Label>
                                        <div className="group relative">
                                            <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
                                            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl">
                                                <div className="font-semibold mb-1.5">SWP Calculation:</div>
                                                <div className="text-[10px] font-mono leading-relaxed">
                                                    Monthly: Corpus × (1 + r) - Withdrawal<br />
                                                    Where r = Annual Return ÷ 12
                                                    <div className="mt-2 pt-2 border-t border-slate-700 text-slate-300">
                                                        Higher returns = Longer corpus sustainability
                                                    </div>
                                                </div>
                                                <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-sm font-bold text-foreground">{expectedReturn}%</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[expectedReturn]}
                                    onValueChange={(value) => setExpectedReturn(value[0])}
                                    min={1}
                                    max={20}
                                    step={0.5}
                                    className="py-2"
                                />
                                {/* Quick adjustment buttons */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {[8, 10, 12, 15].map((rate) => (
                                        <button
                                            key={rate}
                                            onClick={() => setExpectedReturn(rate)}
                                            className={`text-xs px-2 py-0.5 rounded-md font-medium transition-all ${
                                                expectedReturn === rate
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                                            }`}
                                        >
                                            {rate}%
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Withdrawal Period */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-foreground font-semibold">Withdrawal Period</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-sm font-bold text-foreground">{years} Y</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[years]}
                                    onValueChange={(value) => setYears(value[0])}
                                    min={1}
                                    max={40}
                                    step={1}
                                    className="py-2"
                                />
                            </div>
                        </div>

                        {/* Inflation Toggle */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-secondary-600" />
                                <div>
                                    <Label className="text-sm text-foreground font-semibold">Adjust for Inflation</Label>
                                    <p className="text-xs text-muted-foreground">Increase withdrawal annually</p>
                                </div>
                            </div>
                            <Switch
                                checked={adjustForInflation}
                                onCheckedChange={setAdjustForInflation}
                            />
                        </div>

                        {/* Inflation Rate */}
                        {adjustForInflation && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-foreground font-semibold">Inflation Rate</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-sm font-bold text-foreground">{inflationRate}%</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[inflationRate]}
                                    onValueChange={(value) => setInflationRate(value[0])}
                                    min={2}
                                    max={10}
                                    step={0.5}
                                    className="py-2"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Right: Results Card */}
                <Card className="border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        {result.exhausted && (
                            <div className="p-6 md:p-8 sm:p-4 bg-accent-50 border border-accent-200 rounded-xl mb-4">
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
                            <div className="text-center p-3 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Total Withdrawn</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.totalWithdrawn)}</p>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Remaining</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.remainingCorpus)}</p>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
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
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Projection Chart & Year-by-Year Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Corpus Projection Chart */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Corpus Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={projectionData}>
                                    <defs>
                                        <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0088cc" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0088cc" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.5} vertical={false} />
                                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                                    <YAxis
                                        tick={{ fontSize: 10 }}
                                        stroke="#94a3b8"
                                        tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value}
                                    />
                                    <Tooltip
                                        formatter={(value: any) => formatCurrency(value)}
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    />
                                    <Area type="monotone" dataKey="corpus" stroke="#0088cc" fill="url(#colorCorpus)" strokeWidth={2} />
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
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Monthly Withdrawal</p>
                                    <p className="text-lg font-bold text-primary">{formatCurrency(result.monthlyWithdrawal)}</p>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Expected Return</p>
                                    <p className="text-lg font-bold text-primary">{expectedReturn}%</p>
                                </div>
                            </div>

                            {/* Yearly Table */}
                            <div className="overflow-x-auto">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-border">
                                        <table className="w-full">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Year</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Withdrawn</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Remaining</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {yearlyData.slice(0, 10).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Year {row.year}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(row.withdrawn)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{formatCurrency(row.corpusEnd)}</td>
                                                    </tr>
                                                ))}
                                                {yearlyData.length > 10 && (
                                                    <tr className="bg-muted/20">
                                                        <td colSpan={3} className="px-3 py-2 text-xs text-center text-muted-foreground font-medium">
                                                            ... and {yearlyData.length - 10} more years
                                                        </td>
                                                    </tr>
                                                )}
                                                {yearlyData.length > 0 && (
                                                    <tr className="bg-primary/5 border-t-2 border-primary/20">
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

                            {/* Key Insight */}
                            <div className="p-4 bg-gradient-to-br from-primary/5 to-primary-50/5 rounded-xl border border-border">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground mb-1">Withdrawal Strategy</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Higher returns and lower withdrawals help your corpus last longer. Adjust withdrawal amount to match your needs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

