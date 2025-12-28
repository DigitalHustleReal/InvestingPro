"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { IndianRupee, Calendar, Percent, TrendingUp, TrendingDown, CheckCircle2, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function RetirementCalculator() {
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(60);
    const [currentSavings, setCurrentSavings] = useState(500000);
    const [monthlySIP, setMonthlySIP] = useState(20000);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [retirementExpenses, setRetirementExpenses] = useState(50000);
    const [inflationRate, setInflationRate] = useState(6);
    const [adjustForInflation, setAdjustForInflation] = useState(true);

    const calculateRetirement = () => {
        const yearsToRetirement = retirementAge - currentAge;
        const monthsToRetirement = yearsToRetirement * 12;
        const monthlyRate = expectedReturn / 100 / 12;

        // Calculate corpus at retirement
        const currentSavingsFuture = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
        const sipFutureValue = monthlySIP * ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate) * (1 + monthlyRate);
        const totalCorpus = currentSavingsFuture + sipFutureValue;

        // Calculate retirement expenses
        const futureMonthlyExpenses = adjustForInflation
            ? retirementExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement)
            : retirementExpenses;

        const annualExpenses = futureMonthlyExpenses * 12;
        const corpusRequired = annualExpenses * 25; // 25x rule (4% withdrawal rate)

        const shortfall = Math.max(0, corpusRequired - totalCorpus);
        const surplus = Math.max(0, totalCorpus - corpusRequired);

        return {
            totalCorpus,
            corpusRequired,
            shortfall,
            surplus,
            futureMonthlyExpenses,
            yearsToRetirement
        };
    };

    const generateProjectionData = () => {
        const data = [];
        const yearsToRetirement = retirementAge - currentAge;
        const monthlyRate = expectedReturn / 100 / 12;
        const monthsToRetirement = yearsToRetirement * 12;

        let corpus = currentSavings;
        for (let year = 0; year <= yearsToRetirement + 20; year++) {
            if (year <= yearsToRetirement) {
                // Accumulation phase
                corpus = currentSavings * Math.pow(1 + expectedReturn / 100, year);
                const sipValue = monthlySIP * ((Math.pow(1 + monthlyRate, year * 12) - 1) / monthlyRate) * (1 + monthlyRate);
                corpus = corpus + sipValue;
            } else {
                // Withdrawal phase
                const withdrawalYears = year - yearsToRetirement;
                const monthlyWithdrawal = retirementExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement + withdrawalYears);
                corpus = corpus * (1 + expectedReturn / 100) - (monthlyWithdrawal * 12);
                corpus = Math.max(0, corpus);
            }
            data.push({
                age: currentAge + year,
                corpus: Math.max(0, corpus)
            });
        }
        return data;
    };

    const result = calculateRetirement();
    const projectionData = generateProjectionData();

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
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">Retirement Calculator</CardTitle>
                                <CardDescription>Plan your retirement corpus with inflation-adjusted expenses</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Free
                                </Badge>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 text-[10px]">
                                    No Registration
                                </Badge>
                            </div>
                        </div>
                        {/* Preset Scenarios */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
                            <span className="text-xs font-semibold text-slate-600 mr-1">Quick Examples:</span>
                            {[
                                { label: "Age 30 → 60", currentAge: 30, retirementAge: 60, sip: 20000, expenses: 50000 },
                                { label: "Age 35 → 60", currentAge: 35, retirementAge: 60, sip: 30000, expenses: 60000 },
                                { label: "Age 40 → 60", currentAge: 40, retirementAge: 60, sip: 50000, expenses: 80000 },
                                { label: "Early Retirement", currentAge: 30, retirementAge: 55, sip: 40000, expenses: 60000 },
                            ].map((preset, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setCurrentAge(preset.currentAge);
                                        setRetirementAge(preset.retirementAge);
                                        setMonthlySIP(preset.sip);
                                        setRetirementExpenses(preset.expenses);
                                    }}
                                    className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors border border-slate-200"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Current Age */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 font-semibold">Current Age</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <span className="text-sm font-bold text-slate-900">{currentAge} Y</span>
                                </div>
                            </div>
                            <Slider
                                value={[currentAge]}
                                onValueChange={(value) => setCurrentAge(value[0])}
                                min={18}
                                max={60}
                                step={1}
                                className="py-2"
                            />
                        </div>

                        {/* Retirement Age */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 font-semibold">Retirement Age</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <span className="text-sm font-bold text-slate-900">{retirementAge} Y</span>
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

                        {/* Current Savings */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 font-semibold">Current Savings</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                                    <Input
                                        type="number"
                                        value={currentSavings}
                                        onChange={(e) => setCurrentSavings(Number(e.target.value))}
                                        className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900"
                                    />
                                </div>
                            </div>
                            <Slider
                                value={[currentSavings]}
                                onValueChange={(value) => setCurrentSavings(value[0])}
                                min={0}
                                max={10000000}
                                step={50000}
                                className="py-2"
                            />
                        </div>

                        {/* Monthly SIP */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 font-semibold">Monthly SIP</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                                    <Input
                                        type="number"
                                        value={monthlySIP}
                                        onChange={(e) => setMonthlySIP(Number(e.target.value))}
                                        className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900"
                                    />
                                </div>
                            </div>
                            <Slider
                                value={[monthlySIP]}
                                onValueChange={(value) => setMonthlySIP(value[0])}
                                min={1000}
                                max={200000}
                                step={1000}
                                className="py-2"
                            />
                        </div>

                        {/* Expected Return */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5">
                                    <Label className="text-sm text-slate-700 font-semibold">Expected Return (p.a.)</Label>
                                    <div className="group relative">
                                        <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
                                        <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl">
                                            <div className="font-semibold mb-1.5">Retirement Planning:</div>
                                            <div className="text-[10px] font-mono leading-relaxed">
                                                Corpus = Current Savings × (1+r)^n + SIP × [((1+r)^n - 1)/r] × (1+r)<br />
                                                Required Corpus = Annual Expenses × 25-30<br />
                                                Where r = Annual Return, n = Years to Retirement
                                                <div className="mt-2 pt-2 border-t border-slate-700 text-slate-300">
                                                    Higher returns = Larger corpus = Better retirement
                                                </div>
                                            </div>
                                            <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <Percent className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-sm font-bold text-slate-900">{expectedReturn}%</span>
                                </div>
                            </div>
                            <Slider
                                value={[expectedReturn]}
                                onValueChange={(value) => setExpectedReturn(value[0])}
                                min={8}
                                max={18}
                                step={0.5}
                                className="py-2"
                            />
                        </div>

                        {/* Monthly Expenses */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 font-semibold">Monthly Expenses (Current)</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                                    <Input
                                        type="number"
                                        value={retirementExpenses}
                                        onChange={(e) => setRetirementExpenses(Number(e.target.value))}
                                        className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900"
                                    />
                                </div>
                            </div>
                            <Slider
                                value={[retirementExpenses]}
                                onValueChange={(value) => setRetirementExpenses(value[0])}
                                min={20000}
                                max={200000}
                                step={5000}
                                className="py-2"
                            />
                        </div>

                        {/* Inflation Toggle */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-purple-600" />
                                <div>
                                    <Label className="text-sm text-slate-700 font-semibold">Adjust Expenses for Inflation</Label>
                                    <p className="text-xs text-slate-500">Project future expenses with inflation</p>
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
                    </CardContent>
                </Card>

                {/* Right: Results Card with Stats */}
                <Card className="border-slate-200 shadow-sm rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 relative overflow-hidden">
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-emerald-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 sm:mb-2">Corpus at Retirement</p>
                                <p className="text-base sm:text-lg font-extrabold text-teal-600">{formatCurrency(result.totalCorpus)}</p>
                            </div>
                            <div className="text-center p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-emerald-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 sm:mb-2">Required Corpus</p>
                                <p className="text-base sm:text-lg font-extrabold text-emerald-600">{formatCurrency(result.corpusRequired)}</p>
                            </div>
                            <div className="text-center p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-emerald-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {result.shortfall > 0 ? 'Shortfall' : 'Surplus'}
                                </p>
                                <p className={`text-base sm:text-lg font-extrabold ${result.shortfall > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                    {formatCurrency(result.shortfall > 0 ? result.shortfall : result.surplus)}
                                </p>
                            </div>
                        </div>


                        {result.shortfall > 0 ? (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Action Required</p>
                                <p className="text-sm text-amber-700">Increase SIP to meet retirement goals</p>
                            </div>
                        ) : (
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">On Track</p>
                                <p className="text-sm text-emerald-700">You're on track for retirement!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Projection Chart */}
            <Card className="border-slate-200 shadow-sm rounded-2xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Retirement Projection</CardTitle>
                </CardHeader>
                <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={projectionData}>
                                    <defs>
                                        <linearGradient id="colorRetirement" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="age" tick={{ fontSize: 10 }} stroke="#cbd5e1" />
                                    <YAxis
                                        tick={{ fontSize: 10 }}
                                        stroke="#cbd5e1"
                                        tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value}
                                    />
                                    <Tooltip
                                        formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="corpus" stroke="#10b981" fill="url(#colorRetirement)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
        </div>
    );
}

