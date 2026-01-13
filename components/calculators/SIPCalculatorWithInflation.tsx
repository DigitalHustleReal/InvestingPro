"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { IndianRupee, Calendar, Percent, TrendingDown, Info, CheckCircle2, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export function SIPCalculatorWithInflation() {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [years, setYears] = useState(10);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [inflationRate, setInflationRate] = useState(6);
    const [adjustForInflation, setAdjustForInflation] = useState(false);
    const [stepUpRate, setStepUpRate] = useState(10);
    const [enableStepUp, setEnableStepUp] = useState(false);

    const calculateSIP = () => {
        const monthlyRate = expectedReturn / 12 / 100;
        const totalMonths = years * 12;
        
        let futureValue = 0;
        let invested = 0;
        let currentMonthlyInvestment = monthlyInvestment;

        for (let m = 1; m <= totalMonths; m++) {
            // Apply step-up every 12 months (starting from 13th month)
            if (enableStepUp && m > 1 && (m - 1) % 12 === 0) {
                currentMonthlyInvestment = currentMonthlyInvestment * (1 + stepUpRate / 100);
            }

            invested += currentMonthlyInvestment;
            // PMT * (1+r)^(N-n) * (1+r) ?? No, simple FV of single cashflow: PV * (1+r)^t
            // For SIP: Investment made at START of month earns for remaining months (including this one)? 
            // Usually SIP is done at start date.
            // If made at t=0 (start of month 1), it grows for 'totalMonths' months.
            // If made at t=totalMonths-1 (start of last month), it grows for 1 month.
            
            // Standard Formula assumes investment at BEGINNING of period: P * (1+r) * ((1+r)^n - 1)/r
            // Let's stick to iterative compounding for accuracy with step-up.
            
            // Actually, simpler: 
            // FV = Sum( P_i * (1+r)^(totalMonths - i + 1) ) if invested at start.
            // Let's assume invested at start of month.
            const monthsRemaining = totalMonths - m + 1; // Investment at start of month m
            // Actually standard formula usually implies start of month payment.
            futureValue += currentMonthlyInvestment * Math.pow(1 + monthlyRate, monthsRemaining);
        }
        
        const returns = futureValue - invested;

        let realValue = futureValue;
        let realReturns = returns;
        if (adjustForInflation) {
            realValue = futureValue / Math.pow(1 + inflationRate / 100, years);
            realReturns = realValue - invested;
        }

        return { futureValue, invested, returns, realValue, realReturns };
    };

    const sipResult = calculateSIP();

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    const sipChartData = [
        { name: 'Invested', value: sipResult.invested, color: '#0d9488' },
        { name: 'Returns', value: adjustForInflation ? sipResult.realReturns : sipResult.returns, color: '#10b981' },
    ];

    const generateYearlyData = () => {
        const data = [];
        const monthlyRate = expectedReturn / 12 / 100;
        
        for (let year = 0; year <= years; year++) {
            if (year === 0) {
                 data.push({ year: 'Y0', value: 0, realValue: 0 });
                 continue;
            }

            const totalMonths = year * 12;
            let currentFutureValue = 0;
            let currentMonthlyInvestment = monthlyInvestment;

            // Recalculate up to this year
            for (let m = 1; m <= totalMonths; m++) {
                if (enableStepUp && m > 1 && (m - 1) % 12 === 0) {
                    currentMonthlyInvestment = currentMonthlyInvestment * (1 + stepUpRate / 100);
                }
                const monthsRemaining = totalMonths - m + 1; // from investment time to END of this specific year
                currentFutureValue += currentMonthlyInvestment * Math.pow(1 + monthlyRate, monthsRemaining);
            }

            const realValue = adjustForInflation ? currentFutureValue / Math.pow(1 + inflationRate / 100, year) : currentFutureValue;
            
            data.push({
                year: `Y${year}`,
                value: currentFutureValue,
                realValue: realValue
            });
        }
        return data;
    };

    // Generate year-by-year breakdown
    const generateYearlyBreakdown = () => {
        const data = [];
        const monthlyRate = expectedReturn / 12 / 100;
        
        for (let year = 1; year <= Math.min(years, 15); year++) {
            const totalMonths = year * 12;
            let invested = 0;
            let futureValue = 0;
            let currentMonthlyInvestment = monthlyInvestment;

            // Calculate FV for this specific year marker
            for (let m = 1; m <= totalMonths; m++) {
                if (enableStepUp && m > 1 && (m - 1) % 12 === 0) {
                    currentMonthlyInvestment = currentMonthlyInvestment * (1 + stepUpRate / 100);
                }
                invested += currentMonthlyInvestment;
                const monthsRemaining = totalMonths - m + 1;
                futureValue += currentMonthlyInvestment * Math.pow(1 + monthlyRate, monthsRemaining);
            }

            const returns = futureValue - invested;
            const realValue = adjustForInflation ? futureValue / Math.pow(1 + inflationRate / 100, year) : futureValue;
            const realReturns = realValue - invested;

            data.push({
                year,
                invested,
                returns: adjustForInflation ? realReturns : returns,
                total: realValue,
                roi: ((returns / invested) * 100).toFixed(1)
            });
        }
        return data;
    };

    const growthData = generateYearlyData();
    const yearlyData = generateYearlyBreakdown();

    return (
        <div className="space-y-6">
            {/* Top Row: Inputs on Left, Results on Right */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">SIP Calculator</CardTitle>
                                <CardDescription>Calculate returns on systematic investment plan with inflation adjustment</CardDescription>
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
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
                            <span className="text-xs font-semibold text-slate-600 mr-1">Quick Examples:</span>
                            {[
                                { label: "₹10L Investment", monthlyInvestment: 1000000, years: 10, return: 12 },
                                { label: "Short Term", monthlyInvestment: 500000, years: 5, return: 10 },
                                { label: "Long Term", monthlyInvestment: 2000000, years: 15, return: 12 },
                                { label: "High Return", monthlyInvestment: 1000000, years: 10, return: 15 },
                            ].map((preset, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setmonthlyInvestment(preset.monthlyInvestment);
                                        setyears(preset.years);
                                        setexpectedReturn(preset.return);
                                    }}
                                    className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md font-medium transition-colors border border-slate-200"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Stacked Input Sliders */}
                        <div className="space-y-4">
                            {/* Monthly Investment */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-slate-700 font-semibold">Monthly Investment</Label>
                                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                                        <Input
                                            type="number"
                                            value={monthlyInvestment}
                                            onChange={(e) => setmonthlyInvestment(Number(e.target.value))}
                                            className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900"
                                        />
                                    </div>
                                </div>
                                <Slider
                                    value={[monthlyInvestment]}
                                    onValueChange={(value) => setmonthlyInvestment(value[0])}
                                    min={10000}
                                    max={10000000}
                                    step={10000}
                                    className="py-2"
                                />
                            </div>

                            {/* Investment Period */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-slate-700 font-semibold">Investment Period</Label>
                                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                        <span className="text-sm font-bold text-slate-900">{years} Y</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[years]}
                                    onValueChange={(value) => setyears(value[0])}
                                    min={1}
                                    max={30}
                                    step={1}
                                    className="py-2"
                                />
                            </div>

                            {/* Expected Return */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-slate-700 font-semibold">Expected Return</Label>
                                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                        <Percent className="w-3.5 h-3.5 text-slate-500" />
                                        <span className="text-sm font-bold text-slate-900">{expectedReturn}%</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[expectedReturn]}
                                    onValueChange={(value) => setexpectedReturn(value[0])}
                                    min={1}
                                    max={30}
                                    step={0.5}
                                    className="py-2"
                                />
                            </div>
                        </div>

                        {/* Step-Up Toggle */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-primary-600 rotate-180" />
                                <div>
                                    <Label className="text-sm text-slate-700 font-semibold">Annual Step-Up</Label>
                                    <p className="text-xs text-slate-500">Increase investment yearly</p>
                                </div>
                            </div>
                            <Switch
                                checked={enableStepUp}
                                onCheckedChange={setEnableStepUp}
                            />
                        </div>

                        {/* Step-Up Rate */}
                        {enableStepUp && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-slate-700 font-semibold">Step-Up Percentage</Label>
                                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                        <Percent className="w-3.5 h-3.5 text-slate-500" />
                                        <span className="text-sm font-bold text-slate-900">{stepUpRate}%</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[stepUpRate]}
                                    onValueChange={(value) => setStepUpRate(value[0])}
                                    min={1}
                                    max={50}
                                    step={1}
                                    className="py-2"
                                />
                            </div>
                        )}

                        {/* Inflation Toggle */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-secondary-600" />
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
                                    <Label className="text-sm text-slate-700 font-semibold">Inflation Rate</Label>
                                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                        <Percent className="w-3.5 h-3.5 text-slate-500" />
                                        <span className="text-sm font-bold text-slate-900">{inflationRate}%</span>
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
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl bg-gradient-to-br from-primary-50 to-success-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">Invested</p>
                                <p className="text-base sm:text-lg font-extrabold text-slate-900">{formatCurrency(sipResult.invested)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Returns' : 'Returns'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary-600">
                                    {formatCurrency(adjustForInflation ? sipResult.realReturns : sipResult.returns)}
                                </p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Value' : 'Total'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary-600">
                                    {formatCurrency(adjustForInflation ? sipResult.realValue : sipResult.futureValue)}
                                </p>
                            </div>
                        </div>

                        {adjustForInflation && (
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-secondary-100 mb-4">
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Nominal Value</p>
                                <p className="text-sm font-bold text-slate-600">{formatCurrency(sipResult.futureValue)}</p>
                                <p className="text-xs text-slate-500 mt-1">Before inflation adjustment</p>
                            </div>
                        )}

                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-[280px] h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sipChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={75}
                                            dataKey="value"
                                            strokeWidth={0}
                                            paddingAngle={5}
                                        >
                                            {sipChartData.map((entry, index) => (
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

            {/* Bottom Row: Growth Projection & Year-by-Year Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Growth Projection Chart */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Growth Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colormonthlyInvestment" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colormonthlyInvestmentReal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
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
                                    <Area type="monotone" dataKey="value" stroke="#14b8a6" fill="url(#colormonthlyInvestment)" strokeWidth={2} name="Nominal" />
                                    {adjustForInflation && (
                                        <Area type="monotone" dataKey="realValue" stroke="#2563eb" fill="url(#colormonthlyInvestmentReal)" strokeWidth={2} name="Real (Inflation Adjusted)" />
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
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Investment</p>
                                    <p className="text-lg font-bold text-slate-900">{formatCurrency(monthlyInvestment)}</p>
                                </div>
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Expected ROI</p>
                                    <p className="text-lg font-bold text-primary-600">{expectedReturn}%</p>
                                </div>
                            </div>

                            {/* Yearly Table */}
                            <div className="overflow-x-auto">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-slate-200">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Year</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Returns</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {yearlyData.slice(0, 10).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-slate-900">Year {row.year}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary-600">{formatCurrency(row.returns)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-slate-600">{formatCurrency(row.total)}</td>
                                                    </tr>
                                                ))}
                                                {yearlyData.length > 10 && (
                                                    <tr className="bg-slate-50">
                                                        <td colSpan={3} className="px-3 py-2 text-xs text-center text-slate-500 font-medium">
                                                            ... and {yearlyData.length - 10} more years
                                                        </td>
                                                    </tr>
                                                )}
                                                {yearlyData.length > 0 && (
                                                    <tr className="bg-primary-50 border-t-2 border-primary-200">
                                                        <td className="px-3 py-3 text-sm font-bold text-slate-900">Final</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary-600">{formatCurrency(adjustForInflation ? sipResult.realReturns : sipResult.returns)}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary-600">{formatCurrency(adjustForInflation ? sipResult.realValue : sipResult.futureValue)}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Key Insight */}
                            <div className="p-4 bg-gradient-to-br from-primary-50 to-indigo-50 rounded-xl border border-secondary-100">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 mb-1">Compound Growth</p>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            monthlyInvestment investments benefit from compound interest where returns are reinvested. Higher returns and longer periods significantly increase wealth.
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

