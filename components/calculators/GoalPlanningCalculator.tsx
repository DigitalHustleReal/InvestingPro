"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { IndianRupee, Calendar, Percent, Target, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export function GoalPlanningCalculator() {
    const [goalAmount, setGoalAmount] = useState(5000000);
    const [years, setYears] = useState(10);
    const [currentSavings, setCurrentSavings] = useState(100000);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [inflationRate, setInflationRate] = useState(6);
    const [adjustForInflation, setAdjustForInflation] = useState(true);

    const calculateGoal = () => {
        // Calculate required monthly SIP
        const futureGoal = adjustForInflation 
            ? goalAmount * Math.pow(1 + inflationRate / 100, years)
            : goalAmount;
        
        const monthlyRate = expectedReturn / 100 / 12;
        const months = years * 12;
        
        // Future value of current savings
        const currentSavingsFuture = currentSavings * Math.pow(1 + expectedReturn / 100, years);
        
        // Required additional corpus
        const requiredCorpus = Math.max(0, futureGoal - currentSavingsFuture);
        
        // Calculate required monthly SIP
        const requiredSIP = requiredCorpus > 0
            ? requiredCorpus / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
            : 0;
        
        // Calculate with different SIP amounts
        const sipAmounts = [5000, 10000, 15000, 20000, 25000, 30000];
        const projections = sipAmounts.map(sip => {
            const sipFuture = sip * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
            const totalCorpus = currentSavingsFuture + sipFuture;
            const shortfall = Math.max(0, futureGoal - totalCorpus);
            return { sip, corpus: totalCorpus, shortfall, achievable: shortfall <= 0 };
        });

        return {
            futureGoal,
            currentSavingsFuture,
            requiredCorpus,
            requiredSIP,
            projections
        };
    };

    const generateYearlyData = () => {
        const data = [];
        const monthlyRate = expectedReturn / 100 / 12;
        const months = years * 12;
        const futureGoal = adjustForInflation 
            ? goalAmount * Math.pow(1 + inflationRate / 100, years)
            : goalAmount;
        const requiredSIP = calculateGoal().requiredSIP;
        
        let corpus = currentSavings;
        for (let year = 0; year <= years; year++) {
            if (year > 0) {
                corpus = corpus * (1 + expectedReturn / 100);
                const sipValue = requiredSIP * ((Math.pow(1 + monthlyRate, year * 12) - 1) / monthlyRate) * (1 + monthlyRate);
                corpus = corpus + sipValue;
            }
            data.push({
                year: `Year ${year}`,
                corpus: corpus,
                goal: futureGoal
            });
        }
        return data;
    };

    const result = calculateGoal();
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
                        <CardTitle className="text-xl">Goal Planning Calculator</CardTitle>
                        <CardDescription>Calculate required SIP to achieve your financial goals</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Goal Amount */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-foreground font-semibold">Goal Amount</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <Target className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        value={goalAmount}
                                        onChange={(e) => setGoalAmount(Number(e.target.value))}
                                        className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground"
                                    />
                                </div>
                            </div>
                            <Slider
                                value={[goalAmount]}
                                onValueChange={(value) => setGoalAmount(value[0])}
                                min={100000}
                                max={10000000}
                                step={50000}
                                className="py-2"
                            />
                        </div>

                        {/* Time to Goal */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-foreground font-semibold">Time to Goal</Label>
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

                        {/* Current Savings */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-foreground font-semibold">Current Savings</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        value={currentSavings}
                                        onChange={(e) => setCurrentSavings(Number(e.target.value))}
                                        className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground"
                                    />
                                </div>
                            </div>
                            <Slider
                                value={[currentSavings]}
                                onValueChange={(value) => setCurrentSavings(value[0])}
                                min={0}
                                max={5000000}
                                step={50000}
                                className="py-2"
                            />
                        </div>

                        {/* Expected Return */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm text-foreground font-semibold">Expected Return (p.a.)</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-sm font-bold text-foreground">{expectedReturn}%</span>
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

                        {/* Inflation Toggle */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-secondary-600" />
                                <div>
                                    <Label className="text-sm text-foreground font-semibold">Adjust Goal for Inflation</Label>
                                    <p className="text-xs text-muted-foreground">Project future goal amount with inflation</p>
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
                                    <Label className="text-sm text-foreground font-semibold">Expected Inflation Rate (p.a.)</Label>
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

                {/* Right: Results Card with Stats */}
                <Card className="border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardContent className="pt-4 sm:pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Required SIP</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.requiredSIP)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Future Goal</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.futureGoal)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Required Corpus</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(result.requiredCorpus)}</p>
                            </div>
                        </div>


                        <div className="p-4 bg-card rounded-xl border border-secondary/20 mb-4">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Current Savings (Future Value)</p>
                            <p className="text-sm font-bold text-muted-foreground">{formatCurrency(result.currentSavingsFuture)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Goal Progress Chart */}
            <Card className="border-border shadow-sm rounded-xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Goal Progress Projection</CardTitle>
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
                                    <Line type="monotone" dataKey="corpus" stroke="#17a697" strokeWidth={2} name="Your Corpus" />
                                    <Line type="monotone" dataKey="goal" stroke="#0088cc" strokeWidth={2} strokeDasharray="5 5" name="Goal Amount" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
        </div>
    );
}

