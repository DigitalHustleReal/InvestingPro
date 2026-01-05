"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { IndianRupee, Calendar, Percent, TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function PPFCalculator() {
    const [annualContribution, setAnnualContribution] = useState(150000);
    const [years, setYears] = useState(15);
    const [interestRate, setInterestRate] = useState(7.1); // Current PPF rate
    const [inflationRate, setInflationRate] = useState(6);
    const [adjustForInflation, setAdjustForInflation] = useState(false);

    const calculatePPF = () => {
        // PPF uses compound interest with annual contributions
        let maturityAmount = 0;
        let totalContributed = 0;
        
        for (let year = 1; year <= years; year++) {
            totalContributed += annualContribution;
            // Previous year's amount + this year's contribution, both earn interest
            maturityAmount = (maturityAmount + annualContribution) * (1 + interestRate / 100);
        }
        
        const returns = maturityAmount - totalContributed;
        
        let realValue = maturityAmount;
        let realReturns = returns;
        if (adjustForInflation) {
            realValue = maturityAmount / Math.pow(1 + inflationRate / 100, years);
            realReturns = realValue - totalContributed;
        }

        return {
            maturityAmount,
            totalContributed,
            returns,
            realValue,
            realReturns
        };
    };

    const generateYearlyData = () => {
        const data = [];
        let corpus = 0;
        let totalContributed = 0;
        
        for (let year = 0; year <= years; year++) {
            if (year > 0) {
                totalContributed += annualContribution;
                corpus = (corpus + annualContribution) * (1 + interestRate / 100);
            }
            const realValue = adjustForInflation ? corpus / Math.pow(1 + inflationRate / 100, year) : corpus;
            data.push({
                year: `Year ${year}`,
                corpus: corpus,
                realValue: realValue
            });
        }
        return data;
    };

    const result = calculatePPF();
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
                <Card className="border-slate-200 shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">PPF Calculator</CardTitle>
                        <CardDescription>Calculate Public Provident Fund maturity with tax benefits</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Annual Contribution */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 font-semibold">Annual Contribution</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                                    <Input
                                        type="number"
                                        value={annualContribution}
                                        onChange={(e) => setAnnualContribution(Number(e.target.value))}
                                        className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900"
                                    />
                                </div>
                            </div>
                            <Slider
                                value={[annualContribution]}
                                onValueChange={(value) => setAnnualContribution(value[0])}
                                min={500}
                                max={150000}
                                step={500}
                                className="py-2"
                            />
                            <p className="text-xs text-slate-500">Min: ₹500, Max: ₹1.5 Lakh (80C limit)</p>
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
                                onValueChange={(value) => setYears(value[0])}
                                min={15}
                                max={50}
                                step={1}
                                className="py-2"
                            />
                            <p className="text-xs text-slate-500">Minimum 15 years, can extend in blocks of 5 years</p>
                        </div>

                        {/* Interest Rate */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 font-semibold">Interest Rate (p.a.)</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <Percent className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-sm font-bold text-slate-900">{interestRate}%</span>
                                </div>
                            </div>
                            <Slider
                                value={[interestRate]}
                                onValueChange={(value) => setInterestRate(value[0])}
                                min={6}
                                max={9}
                                step={0.1}
                                className="py-2"
                            />
                            <p className="text-xs text-slate-500">Current PPF rate: 7.1% (updated quarterly by government)</p>
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

                        {/* Tax Benefits Info */}
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">Tax Benefits</p>
                            <p className="text-xs text-emerald-800">
                                ✓ 80C deduction (up to ₹1.5L) • Interest & maturity tax-free
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Results Card with Stats */}
                <Card className="border-slate-200 shadow-sm rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50">
                    <CardContent className="pt-4 sm:pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-emerald-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 sm:mb-2">Contributed</p>
                                <p className="text-base sm:text-lg font-extrabold text-slate-900">{formatCurrency(result.totalContributed)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-emerald-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Returns' : 'Returns'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-emerald-600">
                                    {formatCurrency(adjustForInflation ? result.realReturns : result.returns)}
                                </p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-emerald-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Value' : 'Maturity'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-teal-600">
                                    {formatCurrency(adjustForInflation ? result.realValue : result.maturityAmount)}
                                </p>
                            </div>
                        </div>

                        {adjustForInflation && (
                            <div className="p-3 bg-white rounded-xl border border-secondary-100 mb-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nominal Value</p>
                                <p className="text-sm font-bold text-slate-600">{formatCurrency(result.maturityAmount)}</p>
                                <p className="text-xs text-slate-500 mt-1">Before inflation adjustment</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Growth Chart */}
            <Card className="border-slate-200 shadow-sm rounded-2xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">PPF Growth Projection</CardTitle>
                </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={yearlyData}>
                                    <defs>
                                        <linearGradient id="colorPPF" x1="0" y1="0" x2="0" y2="1">
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
                                    <Area type="monotone" dataKey="corpus" stroke="#14b8a6" fill="url(#colorPPF)" strokeWidth={2} name="Corpus" />
                                    {adjustForInflation && (
                                        <Area type="monotone" dataKey="realValue" stroke="#8b5cf6" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Real Value" />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
        </div>
    );
}

