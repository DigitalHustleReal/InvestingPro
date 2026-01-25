"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";
import { IndianRupee, Calendar, Percent, TrendingDown, Info, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, Calculator, Trophy, Sparkles, Home, Car, Plane, Smartphone, GraduationCap, FileText, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { cn } from "@/lib/utils";

export function SIPCalculatorWithInflation() {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [years, setYears] = useState(10);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [inflationRate, setInflationRate] = useState(6);
    const [adjustForInflation, setAdjustForInflation] = useState(false);
    const [stepUpRate, setStepUpRate] = useState(10);
    const [enableStepUp, setEnableStepUp] = useState(false);
    // Mobile UX: Collapsible inputs (UI/UX Phase 1 - Priority 2)
    const [inputsExpanded, setInputsExpanded] = useState(false);

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
        { name: 'Invested', value: sipResult.invested, color: '#0088cc' },
        { name: 'Returns', value: adjustForInflation ? sipResult.realReturns : sipResult.returns, color: '#17a697' },
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
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Mobile: Collapsible Inputs Card (UI/UX Phase 1) */}
            <div className="lg:hidden">
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader 
                        className="cursor-pointer"
                        onClick={() => setInputsExpanded(!inputsExpanded)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-lg mb-1">SIP Calculator</CardTitle>
                                <CardDescription className="text-xs">Tap to adjust inputs</CardDescription>
                            </div>
                            {inputsExpanded ? (
                                <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                        </div>
                    </CardHeader>
                    {inputsExpanded && (
                        <CardContent className="space-y-4 pt-0">
                            {/* Quick Summary - Always Visible */}
                            {/* Quick Summary - Always Visible */}
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(monthlyInvestment)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Years</p>
                                    <p className="text-sm font-bold text-foreground">{years}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Return</p>
                                    <p className="text-sm font-bold text-foreground">{expectedReturn}%</p>
                                </div>
                            </div>
                            
                            {/* Mobile Inputs - Same as desktop but optimized */}
                            <div className="space-y-4">
                                {/* Monthly Investment */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold">Monthly Investment</Label>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                            <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                value={monthlyInvestment}
                                                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                                                className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0"
                                            />
                                        </div>
                                    </div>
                                    <Slider
                                        value={[monthlyInvestment]}
                                        onValueChange={(value) => setMonthlyInvestment(value[0])}
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
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{years} Y</span>
                                        </div>
                                    </div>
                                    <Slider
                                        value={[years]}
                                        onValueChange={(value) => setYears(value[0])}
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
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{expectedReturn}%</span>
                                        </div>
                                    </div>
                                    <Slider
                                        value={[expectedReturn]}
                                        onValueChange={(value) => setExpectedReturn(value[0])}
                                        min={1}
                                        max={30}
                                        step={0.5}
                                        className="py-2"
                                    />
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
                                            <Label className="text-sm text-slate-700 font-semibold">Step-Up %</Label>
                                            <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                                <Percent className="w-3.5 h-3.5 text-slate-500" />
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{stepUpRate}%</span>
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
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>

            {/* Desktop: Top Row: Inputs on Left, Results on Right */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card - Hidden on mobile */}
                <Card className="hidden lg:block border-slate-200 dark:border-slate-700 shadow-sm rounded-xl">
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
                                        setMonthlyInvestment(preset.monthlyInvestment);
                                        setYears(preset.years);
                                        setExpectedReturn(preset.return);
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
                                            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                                            className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <Slider
                                    value={[monthlyInvestment]}
                                    onValueChange={(value) => setMonthlyInvestment(value[0])}
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
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{years} Y</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[years]}
                                    onValueChange={(value) => setYears(value[0])}
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
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{expectedReturn}%</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[expectedReturn]}
                                    onValueChange={(value) => setExpectedReturn(value[0])}
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
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{stepUpRate}%</span>
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

                {/* Right: Results Card - Show first on mobile */}
                <Card id="calculator-results" className="order-first lg:order-none border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden scroll-mt-4">
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Invested</p>
                                <p className="text-base sm:text-lg font-extrabold text-secondary">{formatCurrency(sipResult.invested)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Returns' : 'Returns'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">
                                    {formatCurrency(adjustForInflation ? sipResult.realReturns : sipResult.returns)}
                                </p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Value' : 'Total'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">
                                    {formatCurrency(adjustForInflation ? sipResult.realValue : sipResult.futureValue)}
                                </p>
                            </div>
                        </div>

                        {adjustForInflation && (
                            <div className="p-3 bg-card rounded-xl border border-border mb-4">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Nominal Value</p>
                                <p className="text-sm font-bold text-foreground">{formatCurrency(sipResult.futureValue)}</p>
                                <p className="text-xs text-muted-foreground mt-1">Before inflation adjustment</p>
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
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Growth Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colormonthlyInvestment" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} /> {/* secondary-500 */}
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colormonthlyInvestmentReal" x1="0" y1="0" x2="0" y2="1">
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
                                    <Area type="monotone" dataKey="value" stroke="#14b8a6" fill="url(#colormonthlyInvestment)" strokeWidth={2} name="Nominal" />
                                    {adjustForInflation && (
                                        <Area type="monotone" dataKey="realValue" stroke="#0ea5e9" fill="url(#colormonthlyInvestmentReal)" strokeWidth={2} name="Real (Inflation Adjusted)" />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Year-by-Year Breakdown */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Year-by-Year Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Investment</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(monthlyInvestment)}</p>
                                </div>
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Expected ROI</p>
                                    <p className="text-lg font-bold text-primary-600">{expectedReturn}%</p>
                                </div>
                            </div>

                            {/* Yearly Table - Horizontal scroll on mobile (UI/UX Phase 1) */}
                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-slate-200">
                                        <table className="w-full min-w-[500px]">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Year</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Returns</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {yearlyData.slice(0, 10).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Year {row.year}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(row.returns)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{formatCurrency(row.total)}</td>
                                                    </tr>
                                                ))}
                                                {yearlyData.length > 10 && (
                                                    <tr className="bg-muted/30">
                                                        <td colSpan={3} className="px-3 py-2 text-xs text-center text-muted-foreground font-medium">
                                                            ... and {yearlyData.length - 10} more years
                                                        </td>
                                                    </tr>
                                                )}
                                                {yearlyData.length > 0 && (
                                                    <tr className="bg-primary/10 border-t-2 border-primary/20">
                                                        <td className="px-3 py-3 text-sm font-bold text-foreground">Final</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(adjustForInflation ? sipResult.realReturns : sipResult.returns)}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(adjustForInflation ? sipResult.realValue : sipResult.futureValue)}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Interpretation (Audit Requirement: Results Interpretation) */}
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                   <Trophy className="w-24 h-24 text-emerald-600" />
                                </div>
                                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> What This Means
                                </h3>
                                <p className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-3">
                                    Your investment of <span className="font-bold">{formatCurrency(sipResult.invested)}</span> could grow to <span className="font-bold text-2xl underline decoration-emerald-400 decoration-2 underline-offset-2">{formatCurrency(adjustForInflation ? sipResult.realValue : sipResult.futureValue)}</span>!
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">This amount could fund:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(adjustForInflation ? sipResult.realValue : sipResult.futureValue) > 10000000 && (
                                            <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" /> Financial Freedom
                                            </Badge>
                                        )}
                                        {(adjustForInflation ? sipResult.realValue : sipResult.futureValue) > 5000000 ? (
                                             <>
                                                <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                                    <Home className="w-3 h-3" /> Dream Home
                                                </Badge>
                                                <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                                    <GraduationCap className="w-3 h-3" /> Child's Education
                                                </Badge>
                                             </>
                                        ) : (adjustForInflation ? sipResult.realValue : sipResult.futureValue) > 500000 ? (
                                            <>
                                                <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                                    <Car className="w-3 h-3" /> New Car
                                                </Badge>
                                                <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                                    <Plane className="w-3 h-3" /> World Tour
                                                </Badge>
                                            </>
                                        ) : (
                                            <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                                <Smartphone className="w-3 h-3" /> Gadgets & Lifestyle
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Lead Capture (Audit Requirement: Lead Capture) */}
                            <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary-600" />
                                        Get Detailed Report (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-slate-500 mb-4">
                                    Receive a personalized investment plan with top fund recommendations for your goal of {formatCurrency(adjustForInflation ? sipResult.realValue : sipResult.futureValue)}.
                                </p>
                                <div className="flex gap-2">
                                    <Input placeholder="Enter your email" className="h-9 text-sm" />
                                    <Button size="sm" className="h-9 bg-primary-600 hover:bg-primary-700 text-white">
                                        Send
                                    </Button>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 text-center">
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

