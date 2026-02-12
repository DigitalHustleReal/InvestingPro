"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { IndianRupee, Calendar, Percent, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export function InflationAdjustedCalculator() {
    const [initialAmount, setInitialAmount] = useState(1000000);
    const [years, setYears] = useState(10);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [inflationRate, setInflationRate] = useState(6);

    const calculateInflationAdjusted = () => {
        const futureValue = initialAmount * Math.pow(1 + expectedReturn / 100, years);
        const inflationAdjustedValue = futureValue / Math.pow(1 + inflationRate / 100, years);
        const realReturn = ((futureValue / initialAmount) / Math.pow(1 + inflationRate / 100, years) - 1) * 100;
        const nominalGains = futureValue - initialAmount;
        const realGains = inflationAdjustedValue - initialAmount;
        const inflationErosion = nominalGains - realGains;

        return {
            futureValue,
            inflationAdjustedValue,
            realReturn,
            nominalGains,
            realGains,
            inflationErosion
        };
    };

    const generateYearlyData = () => {
        const data = [];
        for (let year = 0; year <= years; year++) {
            const futureValue = initialAmount * Math.pow(1 + expectedReturn / 100, year);
            const inflationAdjustedValue = futureValue / Math.pow(1 + inflationRate / 100, year);
            data.push({
                year: `Year ${year}`,
                nominal: futureValue,
                real: inflationAdjustedValue,
                inflation: initialAmount * Math.pow(1 + inflationRate / 100, year)
            });
        }
        return data;
    };

    const result = calculateInflationAdjusted();
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
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Inflation-Adjusted Returns Calculator</CardTitle>
                        <CardDescription>Calculate real returns after accounting for inflation</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Initial Investment */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 dark:text-slate-300 font-semibold">Initial Investment</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        value={initialAmount}
                                        onChange={(e) => setInitialAmount(Number(e.target.value))}
                                        className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0"
                                    />
                                </div>
                            </div>
                            <Slider
                                value={[initialAmount]}
                                onValueChange={(value) => setInitialAmount(value[0])}
                                min={10000}
                                max={10000000}
                                step={10000}
                                className="py-2"
                            />
                        </div>

                        {/* Investment Period */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 dark:text-slate-300 font-semibold">Investment Period</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-sm font-bold text-foreground">{years} Y</span>
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
                                <Label className="text-sm text-slate-700 dark:text-slate-300 font-semibold">Expected Return (p.a.)</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-sm font-bold text-foreground">{expectedReturn}%</span>
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

                        {/* Inflation Rate */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-slate-700 dark:text-slate-300 font-semibold">Expected Inflation Rate (p.a.)</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <TrendingDown className="w-3.5 h-3.5 text-muted-foreground" />
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
                    </CardContent>
                </Card>

                {/* Right: Results Card with Stats */}
                <Card className="border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardContent className="pt-4 sm:pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Initial Investment</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(initialAmount)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Nominal Value</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.futureValue)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Real Value</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.inflationAdjustedValue)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            <div className="text-center p-3 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Real Return</p>
                                <p className="text-sm sm:text-base font-extrabold text-primary">{result.realReturn.toFixed(2)}%</p>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Inflation Erosion</p>
                                <p className="text-sm sm:text-base font-extrabold text-muted-foreground">{formatCurrency(result.inflationErosion)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Nominal vs Real Value Chart */}
            <Card className="border-border shadow-sm rounded-xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500">Nominal vs Real Value</CardTitle>
                </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={yearlyData}>
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
                                    <Legend />
                                    <Line type="monotone" dataKey="nominal" stroke="#0d9488" strokeWidth={2} name="Nominal Value" />
                                    <Line type="monotone" dataKey="real" stroke="#14b8a6" strokeWidth={2} name="Real Value (Inflation Adjusted)" />
                                    <Line type="monotone" dataKey="inflation" stroke="#0ea5e9" strokeWidth={2} strokeDasharray="5 5" name="Inflation Impact" /> {/* secondary-500 */}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
        </div>
    );
}

