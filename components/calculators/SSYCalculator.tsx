"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { IndianRupee, Calendar, Percent, TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function SSYCalculator() {
    const [annualContribution, setAnnualContribution] = useState(150000);
    const [girlAge, setGirlAge] = useState(1);
    const [startYear, setStartYear] = useState(new Date().getFullYear());
    const [interestRate, setInterestRate] = useState(8.2); // Current SSY rate
    const [inflationRate, setInflationRate] = useState(6);
    const [adjustForInflation, setAdjustForInflation] = useState(false);

    const calculateSSY = () => {
        // SSY Logic:
        // - Maturity: 21 years from account opening
        // - Deposits: Allowed for first 15 years
        // - Interest: Compounded annually
        
        const investmentDuration = 15;
        const maturityDuration = 21;
        
        let corpus = 0;
        let totalContributed = 0;
        
        for (let year = 1; year <= maturityDuration; year++) {
            // Add contribution only for first 15 years
            if (year <= investmentDuration) {
                corpus += annualContribution;
                totalContributed += annualContribution;
            }
            
            // Add interest on the corpus
            const interest = corpus * (interestRate / 100);
            corpus += interest;
        }
        
        const maturityAmount = Math.round(corpus);
        const returns = maturityAmount - totalContributed;
        
        let realValue = maturityAmount;
        let realReturns = returns;
        
        if (adjustForInflation) {
            realValue = maturityAmount / Math.pow(1 + inflationRate / 100, maturityDuration);
            realReturns = realValue - totalContributed;
        }

        return {
            maturityAmount,
            totalContributed,
            returns,
            realValue,
            realReturns,
            maturityYear: startYear + maturityDuration
        };
    };

    const generateYearlyData = () => {
        const data = [];
        let corpus = 0;
        const investmentDuration = 15;
        const maturityDuration = 21;
        
        for (let year = 0; year <= maturityDuration; year++) {
            let yearlyContribution = 0;
            if (year > 0) {
                if (year <= investmentDuration) {
                    yearlyContribution = annualContribution;
                    corpus += yearlyContribution;
                }
                const interest = corpus * (interestRate / 100);
                corpus += interest;
            }
            
            const realValue = adjustForInflation ? corpus / Math.pow(1 + inflationRate / 100, year) : corpus;
            
            data.push({
                year: startYear + year,
                age: girlAge + year,
                corpus: Math.round(corpus),
                realValue: Math.round(realValue),
                investment: year <= investmentDuration ? yearlyContribution : 0
            });
        }
        return data;
    };

    const result = calculateSSY();
    const yearlyData = generateYearlyData();

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${Math.round(num).toLocaleString('en-IN')}`;
    };

    return (
        <div className="space-y-6">
            {/* Top Row: Inputs on Left, Results on Right */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">SSY Calculator</CardTitle>
                        <CardDescription>Sukanya Samriddhi Yojana Maturity Estimator</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Annual Contribution */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 font-semibold">Yearly Investment</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                                    <Input
                                        type="number"
                                        value={annualContribution}
                                        onChange={(e) => setAnnualContribution(Number(e.target.value))}
                                        className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <Slider
                                value={[annualContribution]}
                                onValueChange={(value) => setAnnualContribution(value[0])}
                                min={250}
                                max={150000}
                                step={250}
                                className="py-2"
                            />
                            <p className="text-xs text-slate-500">Min: ₹250, Max: ₹1.5 Lakh</p>
                        </div>

                        {/* Girl's Age */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 font-semibold">Girl's Current Age</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{girlAge} Y</span>
                                </div>
                            </div>
                            <Slider
                                value={[girlAge]}
                                onValueChange={(value) => setGirlAge(value[0])}
                                min={0}
                                max={10}
                                step={1}
                                className="py-2"
                            />
                            <p className="text-xs text-slate-500">Max age to open account: 10 Years</p>
                        </div>

                        {/* Interest Rate */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 font-semibold">Interest Rate (p.a.)</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <Percent className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{interestRate}%</span>
                                </div>
                            </div>
                            <Slider
                                value={[interestRate]}
                                onValueChange={(value) => setInterestRate(value[0])}
                                min={7}
                                max={9}
                                step={0.1}
                                className="py-2"
                            />
                            <p className="text-xs text-slate-500">Current SSY rate: 8.2% (updated quarterly)</p>
                        </div>

                        {/* Inflation Toggle */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-secondary-600" />
                                <div>
                                    <Label className="text-sm text-slate-700 font-semibold">Adjust for Inflation</Label>
                                    <p className="text-xs text-slate-500">Show real purchasing power</p>
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
                                    <Label className="text-sm text-slate-700 font-semibold">Expected Inflation Rate</Label>
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

                        {/* Key Info */}
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <div className="p-3 bg-primary-50 border border-primary-200 rounded-xl">
                                <p className="text-[10px] font-bold text-primary-700 uppercase tracking-widest mb-1">Tax Benefits</p>
                                <p className="text-xs text-primary-800 font-medium">
                                    EEE Status: Tax-free Invest, Interest & Maturity
                                </p>
                            </div>
                            <div className="p-3 bg-primary-50 border border-primary-200 rounded-xl">
                                <p className="text-[10px] font-bold text-primary-700 uppercase tracking-widest mb-1">Maturity</p>
                                <p className="text-xs text-primary-800 font-medium">
                                    21 Years from opening (Age {girlAge + 21})
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Results Card */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl bg-gradient-to-br from-pink-50 to-primary-50 dark:from-slate-900 dark:to-slate-800">
                    <CardContent className="pt-4 sm:pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-primary-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">Total Invested</p>
                                <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white transform transition-all hover:scale-105">{formatCurrency(result.totalContributed)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-primary-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Interest' : 'Interest Earned'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary-600 transform transition-all hover:scale-105">
                                    {formatCurrency(adjustForInflation ? result.realReturns : result.returns)}
                                </p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-primary-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Maturity' : 'Maturity Amount'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary-600 transform transition-all hover:scale-105">
                                    {formatCurrency(adjustForInflation ? result.realValue : result.maturityAmount)}
                                </p>
                            </div>
                        </div>

                        {adjustForInflation && (
                             <div className="px-4 py-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-secondary-100 mb-6 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nominal Maturity</p>
                                    <p className="text-[10px] text-slate-400">Without inflation</p>
                                </div>
                                <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{formatCurrency(result.maturityAmount)}</p>
                            </div>
                        )}

                        <div className="h-64 mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={yearlyData}>
                                    <defs>
                                        <linearGradient id="colorSSY" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis 
                                        dataKey="age" 
                                        tick={{ fontSize: 10 }} 
                                        stroke="#cbd5e1"
                                        label={{ value: "Girl's Age", position: 'insideBottom', offset: -5, fontSize: 10, fill: '#94a3b8' }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10 }} 
                                        stroke="#cbd5e1"
                                        tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                        labelFormatter={(label) => `Age: ${label}`}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="corpus" stroke="#ec4899" fill="url(#colorSSY)" strokeWidth={2} name="Maturity Value" />
                                    {adjustForInflation && (
                                        <Area type="monotone" dataKey="realValue" stroke="#6366f1" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Real Value" />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center mt-2">
                             *Maturity at age {girlAge + 21} (after 21 years)
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
