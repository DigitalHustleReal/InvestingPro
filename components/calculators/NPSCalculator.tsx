"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { IndianRupee, Calendar, Percent, TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function NPSCalculator() {
    const [monthlyContribution, setMonthlyContribution] = useState(5000);
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(60);
    const [expectedReturn, setExpectedReturn] = useState(10); // NPS typically 8-12%
    const [inflationRate, setInflationRate] = useState(6);
    const [adjustForInflation, setAdjustForInflation] = useState(false);

    const yearsToRetirement = retirementAge - currentAge;
    const totalMonths = yearsToRetirement * 12;

    const calculateNPS = () => {
        const monthlyRate = expectedReturn / 100 / 12;
        const futureValue = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
        const totalContributed = monthlyContribution * totalMonths;
        const returns = futureValue - totalContributed;

        // NPS withdrawal rules: 60% can be withdrawn, 40% must be annuitized
        const withdrawableAmount = futureValue * 0.6;
        const annuitizedAmount = futureValue * 0.4;

        let realValue = futureValue;
        let realReturns = returns;
        if (adjustForInflation) {
            realValue = futureValue / Math.pow(1 + inflationRate / 100, yearsToRetirement);
            realReturns = realValue - totalContributed;
        }

        return {
            maturityAmount: futureValue,
            totalContributed,
            returns,
            withdrawableAmount,
            annuitizedAmount,
            realValue,
            realReturns
        };
    };

    const generateYearlyData = () => {
        const data = [];
        const monthlyRate = expectedReturn / 100 / 12;
        let corpus = 0;
        let totalContributed = 0;
        
        for (let year = 0; year <= yearsToRetirement; year++) {
            if (year > 0) {
                const monthsThisYear = 12;
                for (let m = 0; m < monthsThisYear; m++) {
                    totalContributed += monthlyContribution;
                    corpus = (corpus + monthlyContribution) * (1 + monthlyRate);
                }
            }
            const realValue = adjustForInflation ? corpus / Math.pow(1 + inflationRate / 100, year) : corpus;
            data.push({
                year: `Age ${currentAge + year}`,
                corpus: corpus,
                realValue: realValue
            });
        }
        return data;
    };

    const result = calculateNPS();
    const yearlyData = generateYearlyData();

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    return (
        <div className="space-y-6">
            {/* Top Row: Inputs on Left, Results on Right */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">NPS Calculator</CardTitle>
                        <CardDescription>Calculate National Pension System corpus with tax benefits</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Current Age */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 font-semibold">Current Age</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{currentAge} Y</span>
                                </div>
                            </div>
                            <Slider
                                value={[currentAge]}
                                onValueChange={(value) => setCurrentAge(value[0])}
                                min={18}
                                max={55}
                                step={1}
                                className="py-2"
                            />
                        </div>

                        {/* Retirement Age */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 font-semibold">Retirement Age</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{retirementAge} Y</span>
                                </div>
                            </div>
                            <Slider
                                value={[retirementAge]}
                                onValueChange={(value) => setRetirementAge(value[0])}
                                min={50}
                                max={70}
                                step={1}
                                className="py-2"
                            />
                        </div>

                        {/* Monthly Contribution */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 font-semibold">Monthly Contribution</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                                    <Input
                                        type="number"
                                        value={monthlyContribution}
                                        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                        className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <Slider
                                value={[monthlyContribution]}
                                onValueChange={(value) => setMonthlyContribution(value[0])}
                                min={500}
                                max={50000}
                                step={500}
                                className="py-2"
                            />
                        </div>

                        {/* Expected Return */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 font-semibold">Expected Return (p.a.)</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <Percent className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{expectedReturn}%</span>
                                </div>
                            </div>
                            <Slider
                                value={[expectedReturn]}
                                onValueChange={(value) => setExpectedReturn(value[0])}
                                min={8}
                                max={12}
                                step={0.5}
                                className="py-2"
                            />
                            <p className="text-xs text-slate-500">NPS typically returns 8-12% based on asset allocation</p>
                        </div>

                        {/* Inflation Toggle */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-secondary-600" />
                                <div>
                                    <Label className="text-sm text-slate-700 font-semibold">Adjust for Inflation</Label>
                                    <p className="text-xs text-slate-500">Show real returns after inflation</p>
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
                                    <Label className="text-sm text-slate-700 font-semibold">Expected Inflation Rate (p.a.)</Label>
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

                        {/* Tax Benefits Info */}
                        <div className="p-3 bg-primary-50 border border-primary-200 rounded-xl">
                            <p className="text-xs font-bold text-primary-700 uppercase tracking-widest mb-1">Tax Benefits</p>
                            <p className="text-xs text-primary-800">
                                ✓ 80CCD(1B): ₹50K • Employer: ₹7.5L • 60% tax-free withdrawal
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Results Card with Stats */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl bg-gradient-to-br from-primary-50 to-success-50 dark:from-slate-900 dark:to-slate-800">
                    <CardContent className="pt-4 sm:pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-primary-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">Contributed</p>
                                <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{formatCurrency(result.totalContributed)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-primary-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Returns' : 'Returns'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary-600">
                                    {formatCurrency(adjustForInflation ? result.realReturns : result.returns)}
                                </p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-primary-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Corpus' : 'Total Corpus'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary-600">
                                    {formatCurrency(adjustForInflation ? result.realValue : result.maturityAmount)}
                                </p>
                            </div>
                        </div>

                        {adjustForInflation && (
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-secondary-100 mb-4">
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Nominal Corpus</p>
                                <p className="text-sm font-bold text-slate-600">{formatCurrency(result.maturityAmount)}</p>
                                <p className="text-xs text-slate-500 mt-1">Before inflation adjustment</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            <div className="text-center p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Withdrawable (60%)</p>
                                <p className="text-sm sm:text-base font-extrabold text-primary-600">{formatCurrency(result.withdrawableAmount)}</p>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Annuitized (40%)</p>
                                <p className="text-sm sm:text-base font-extrabold text-slate-600">{formatCurrency(result.annuitizedAmount)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Growth Chart */}
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">NPS Growth Projection</CardTitle>
                </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={yearlyData}>
                                    <defs>
                                        <linearGradient id="colorNPS" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
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
                                    <Area type="monotone" dataKey="corpus" stroke="#14b8a6" fill="url(#colorNPS)" strokeWidth={2} name="Corpus" />
                                    {adjustForInflation && (
                                        <Area type="monotone" dataKey="realValue" stroke="#0ea5e9" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Real Value" />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
        </div>
    );
}

