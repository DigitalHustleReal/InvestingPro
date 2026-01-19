"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { IndianRupee, Calendar, Percent, TrendingUp, Info, CheckCircle2, Zap, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function FDCalculator() {
    const [principal, setPrincipal] = useState(100000);
    const [interestRate, setInterestRate] = useState(7.5);
    const [tenure, setTenure] = useState(5);
    const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
    const [compounding, setCompounding] = useState<'quarterly' | 'monthly' | 'annually'>('quarterly');
    const [adjustForInflation, setAdjustForInflation] = useState(false);
    const [inflationRate, setInflationRate] = useState(6);

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

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    // Generate growth projection data
    const generateGrowthData = () => {
        const months = tenureType === 'years' ? tenure * 12 : tenure;
        const years = months / 12;
        const data = [];
        const rate = interestRate / 100;
        
        for (let year = 0; year <= Math.min(years, 10); year++) {
            let amount = 0;
            const currentYears = year;
            
            if (compounding === 'quarterly') {
                const quarterlyRate = rate / 4;
                const quarters = currentYears * 4;
                amount = principal * Math.pow(1 + quarterlyRate, quarters);
            } else if (compounding === 'monthly') {
                const monthlyRate = rate / 12;
                const currentMonths = currentYears * 12;
                amount = principal * Math.pow(1 + monthlyRate, currentMonths);
            } else {
                amount = principal * Math.pow(1 + rate, currentYears);
            }
            
            const realValue = adjustForInflation ? amount / Math.pow(1 + inflationRate / 100, currentYears) : amount;
            
            data.push({
                year: `Y${year}`,
                value: amount || principal,
                realValue: realValue || principal,
            });
        }
        return data;
    };

    // Generate year-by-year breakdown
    const generateYearlyBreakdown = () => {
        const months = tenureType === 'years' ? tenure * 12 : tenure;
        const years = months / 12;
        const rate = interestRate / 100;
        const data = [];

        for (let year = 1; year <= Math.min(years, 15); year++) {
            let amount = 0;
            
            if (compounding === 'quarterly') {
                const quarterlyRate = rate / 4;
                const quarters = year * 4;
                amount = principal * Math.pow(1 + quarterlyRate, quarters);
            } else if (compounding === 'monthly') {
                const monthlyRate = rate / 12;
                const currentMonths = year * 12;
                amount = principal * Math.pow(1 + monthlyRate, currentMonths);
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

    return (
        <div className="space-y-6">
            {/* Top Row: Inputs on Left, Results on Right */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card */}
                <Card className="border-border shadow-sm rounded-2xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">Fixed Deposit Calculator</CardTitle>
                                <CardDescription>Calculate FD maturity amount with compounding interest</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge className="bg-primary/10 text-primary border-primary/20 shadow-sm transition-colors cursor-default">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Free
                                </Badge>
                                <Badge className="bg-primary/10 text-primary border-primary/20 shadow-sm transition-colors cursor-default">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Instant
                                </Badge>
                            </div>
                        </div>
                        {/* Preset Scenarios */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                            <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Examples:</span>
                            {[
                                { label: "₹10L FD", principal: 1000000, years: 5, rate: 7 },
                                { label: "Short Term", principal: 500000, years: 1, rate: 6.5 },
                                { label: "Long Term", principal: 1000000, years: 10, rate: 7.5 },
                                { label: "High Rate", principal: 500000, years: 3, rate: 8 },
                            ].map((preset, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setPrincipal(preset.principal);
                                        setTenure(preset.years);
                                        setInterestRate(preset.rate);
                                    }}
                                    className="text-xs px-2.5 py-1 bg-muted hover:bg-muted/80 text-muted-foreground rounded-md font-medium transition-colors border border-border"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Stacked Input Sliders */}
                        <div className="space-y-4">
                            {/* Principal Amount */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-semibold">Principal Amount</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            value={principal}
                                            onChange={(e) => setPrincipal(Number(e.target.value))}
                                            className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0"
                                        />
                                    </div>
                                </div>
                                <Slider
                                    value={[principal]}
                                    onValueChange={(value) => setPrincipal(value[0])}
                                    min={1000}
                                    max={10000000}
                                    step={1000}
                                    className="py-2"
                                />
                            </div>

                            {/* Interest Rate */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1.5">
                                        <Label className="text-sm font-semibold">Interest Rate</Label>
                                        <div className="group relative">
                                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help" />
                                            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-popover text-popover-foreground text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl border border-border">
                                                <div className="font-semibold mb-1.5">FD Formula:</div>
                                                <div className="text-[10px] font-mono leading-relaxed">
                                                    A = P Ã— (1 + r/n)^(nÃ—t)<br />
                                                    Where:<br />
                                                    P = Principal, r = Rate,<br />
                                                    n = Compounding frequency,<br />
                                                    t = Time in years
                                                    <div className="mt-2 pt-2 border-t border-border text-muted-foreground">
                                                        Quarterly compounding gives higher returns than annual
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-sm font-bold">{interestRate}%</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[interestRate]}
                                    onValueChange={(value) => setInterestRate(value[0])}
                                    min={3}
                                    max={10}
                                    step={0.1}
                                    className="py-2"
                                />
                                {/* Quick adjustment buttons */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {[6, 6.5, 7, 7.5, 8].map((rate) => (
                                        <button
                                            key={rate}
                                            onClick={() => setInterestRate(rate)}
                                            className={`text-xs px-2 py-0.5 rounded-md font-medium transition-all ${
                                                Math.abs(interestRate - rate) < 0.1
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                                            }`}
                                        >
                                            {rate}%
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tenure */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-slate-700 font-semibold">Tenure</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                            <Input
                                                type="number"
                                                value={tenure}
                                                onChange={(e) => setTenure(Number(e.target.value))}
                                                className="w-16 border-0 bg-transparent p-0 text-center text-sm font-bold focus-visible:ring-0 text-slate-900 dark:text-white"
                                            />
                                        </div>
                                        <select
                                            value={tenureType}
                                            onChange={(e) => setTenureType(e.target.value as 'years' | 'months')}
                                            className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
                                        >
                                            <option value="years">Years</option>
                                            <option value="months">Months</option>
                                        </select>
                                    </div>
                                </div>
                                <Slider
                                    value={[tenure]}
                                    onValueChange={(value) => setTenure(value[0])}
                                    min={1}
                                    max={tenureType === 'years' ? 10 : 120}
                                    step={1}
                                    className="py-2"
                                />
                            </div>

                            {/* Compounding Frequency */}
                            <div className="space-y-2">
                                <Label className="text-sm text-slate-700 dark:text-slate-300 font-semibold">Compounding</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['quarterly', 'monthly', 'annually'] as const).map((freq) => (
                                        <button
                                            key={freq}
                                            onClick={() => setCompounding(freq)}
                                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                                compounding === freq
                                                    ? 'bg-accent-600 text-white shadow-lg'
                                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                            }`}
                                        >
                                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Inflation Toggle */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-secondary-600" />
                                <div>
                                    <Label className="text-sm text-slate-700 font-semibold">Adjust for Inflation</Label>
                                    <p className="text-xs text-slate-500">Show real returns</p>
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
                                    <Label className="text-sm text-slate-700 dark:text-slate-300 font-semibold">Inflation Rate</Label>
                                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                        <Percent className="w-3.5 h-3.5 text-slate-500" />
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{inflationRate}%</span>
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
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl bg-gradient-to-br from-accent-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-accent-100 dark:border-accent-800">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">Principal</p>
                                <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{formatCurrency(principal)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-accent-100 dark:border-accent-800">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">Interest</p>
                                <p className="text-base sm:text-lg font-extrabold text-accent-600">{formatCurrency(result.interestEarned)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-accent-100 dark:border-accent-800">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Value' : 'Maturity'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-accent-600">
                                    {formatCurrency(adjustForInflation ? result.realValue : result.maturityAmount)}
                                </p>
                            </div>
                        </div>

                        {adjustForInflation && (
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-accent-100 mb-4">
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Nominal Value</p>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{formatCurrency(result.maturityAmount)}</p>
                                <p className="text-xs text-slate-500 mt-1">Before inflation adjustment</p>
                            </div>
                        )}

                        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-accent-100 dark:border-accent-800">
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Effective Annual Rate</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{result.effectiveRate.toFixed(2)}% p.a.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Growth Chart & Year-by-Year Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Growth Projection Chart */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Growth Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colorFD" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} /> {/* secondary-500 */}
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorFDReal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} /> {/* secondary-500 */}
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="#cbd5e1" />
                                    <YAxis
                                        tick={{ fontSize: 10 }}
                                        stroke="#cbd5e1"
                                        tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value}
                                    />
                                    <Tooltip
                                        formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="url(#colorFD)" strokeWidth={2} name="Nominal" /> {/* secondary-500 */}
                                    {adjustForInflation && (
                                        <Area type="monotone" dataKey="realValue" stroke="#0ea5e9" fill="url(#colorFDReal)" strokeWidth={2} name="Real (Inflation Adjusted)" />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Year-by-Year Breakdown */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Year-by-Year Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-accent-50 rounded-xl border border-accent-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Principal</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(principal)}</p>
                                </div>
                                <div className="p-4 bg-accent-50 rounded-xl border border-accent-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Interest Rate</p>
                                    <p className="text-lg font-bold text-accent-600">{interestRate}%</p>
                                </div>
                            </div>

                            {/* Yearly Table */}
                            <div className="overflow-x-auto">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Year</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Interest</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {yearlyData.slice(0, 10).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-slate-900 dark:text-white">Year {row.year}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-accent-600">{formatCurrency(row.interest)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-slate-600 dark:text-slate-400">{formatCurrency(row.total)}</td>
                                                    </tr>
                                                ))}
                                                {yearlyData.length > 10 && (
                                                    <tr className="bg-slate-50 dark:bg-slate-800">
                                                        <td colSpan={3} className="px-3 py-2 text-xs text-center text-slate-500 font-medium">
                                                            ... and {yearlyData.length - 10} more years
                                                        </td>
                                                    </tr>
                                                )}
                                                {yearlyData.length > 0 && (
                                                    <tr className="bg-accent-50 border-t-2 border-accent-200">
                                                        <td className="px-3 py-3 text-sm font-bold text-slate-900 dark:text-white">Final</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-accent-600">{formatCurrency(result.interestEarned)}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-accent-600">{formatCurrency(adjustForInflation ? result.realValue : result.maturityAmount)}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Key Insight */}
                            <div className="p-4 bg-gradient-to-br from-accent-50 to-orange-50 rounded-xl border border-accent-100">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Compound Interest</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Higher compounding frequency (monthly/quarterly) yields more returns. Compare different options to maximize your FD returns.
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

