"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Calendar, Percent, CheckCircle2, TrendingUp, User } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export function SSYCalculator() {
    const [yearlyInvestment, setYearlyInvestment] = useState(150000);
    const [girlsAge, setGirlsAge] = useState(5);
    const [startYear, setStartYear] = useState(new Date().getFullYear());
    
    // SSY Rules
    // Interest Rate: Variable, currently ~8.2%
    const [interestRate, setInterestRate] = useState(8.2);
    
    const calculateSSY = () => {
        let balance = 0;
        let totalInvested = 0;
        let data = [];
        
        // Maturity is 21 years from account opening
        const maturityYears = 21;
        // Deposits allowed for 15 years
        const depositYears = 15;

        for (let year = 1; year <= maturityYears; year++) {
            let deposit = 0;
            if (year <= depositYears) {
                deposit = yearlyInvestment;
            }

            // Interest calculated on balance + current year deposit
            // SSY interest is compounded annually
            const interestEarned = (balance + deposit) * (interestRate / 100);
            
            balance = balance + deposit + interestEarned;
            totalInvested += deposit;

            data.push({
                year: startYear + year - 1,
                age: girlsAge + year,
                invested: totalInvested,
                value: Math.round(balance),
                interest: Math.round(balance - totalInvested),
                yearlyDeposit: deposit
            });
        }
        
        return {
            maturityAmount: Math.round(balance),
            totalInvested: Math.round(totalInvested),
            totalInterest: Math.round(balance - totalInvested),
            yearlyData: data
        };
    };

    const result = calculateSSY();

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    const chartData = [
        { name: 'Invested', value: result.totalInvested, color: '#ec4899' }, // Pink for Girl Child scheme theme commonly used
        { name: 'Interest', value: result.totalInterest, color: '#be185d' },
    ];

    return (
        <div className="space-y-6">
            {/* Top Row: Inputs & Quick Results */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Inputs */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">SSY Calculator</CardTitle>
                                <CardDescription>Sukanya Samriddhi Yojana Maturity Calculator</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge variant="secondary" className="bg-pink-50 text-pink-700 border-pink-200">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Govt Backed
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    Tax Free (EEE)
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Yearly Investment */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-slate-700">Yearly Investment</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                                    <Input 
                                        type="number" 
                                        value={yearlyInvestment} 
                                        onChange={(e) => setYearlyInvestment(Number(e.target.value))}
                                        className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900" 
                                    />
                                </div>
                            </div>
                            <Slider value={[yearlyInvestment]} onValueChange={(v) => setYearlyInvestment(v[0])} min={250} max={150000} step={250} className="py-2" />
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                <Info className="w-3 h-3" /> Max ₹1.5 Lakh per financial year
                            </p>
                        </div>

                        {/* Girl's Age */}
                         <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-slate-700">Girl's Age</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <User className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-sm font-bold text-slate-900">{girlsAge} Years</span>
                                </div>
                            </div>
                            <Slider value={[girlsAge]} onValueChange={(v) => setGirlsAge(v[0])} min={0} max={10} step={1} className="py-2" />
                            <p className="text-[10px] text-slate-500">Account calculates for 21 years tenure</p>
                        </div>

                        {/* Interest Rate */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-slate-700">Interest Rate</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <Percent className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-sm font-bold text-slate-900">{interestRate}%</span>
                                </div>
                            </div>
                            <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={7} max={9} step={0.1} className="py-2" />
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                     <CardContent className="pt-6 relative z-10">
                        {/* Main Numbers */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 text-center">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Maturity Amount</p>
                                <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(result.maturityAmount)}</p>
                                <p className="text-[10px] text-slate-500 mt-1">At Age {girlsAge + 21}</p>
                            </div>
                             <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 text-center">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Interest</p>
                                <p className="text-xl font-bold text-pink-600">+{formatCurrency(result.totalInterest)}</p>
                            </div>
                        </div>

                        {/* Pie Chart */}
                        <div className="flex items-center justify-center mb-4">
                             <div className="w-[200px] h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    </PieChart>
                                </ResponsiveContainer>
                             </div>
                        </div>
                        
                        {/* Legend */}
                        <div className="flex justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-pink-500" />
                                <span className="text-sm font-medium text-slate-600">Invested: {formatCurrency(result.totalInvested)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-700" />
                                <span className="text-sm font-medium text-slate-600">Interest: {formatCurrency(result.totalInterest)}</span>
                            </div>
                        </div>
                     </CardContent>
                </Card>
            </div>

            {/* Growth Chart */}
            <Card className="border-slate-200 shadow-sm rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Growth Projection</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={result.yearlyData}>
                                <defs>
                                    <linearGradient id="colorValueSSY" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" tick={{fontSize: 12}} stroke="#94a3b8" />
                                <YAxis tick={{fontSize: 12}} stroke="#94a3b8" tickFormatter={(value) => `₹${value/1000}k`} />
                                <Tooltip 
                                    formatter={(value: number) => formatCurrency(value)}
                                    labelFormatter={(label) => `Year: ${label}`}
                                />
                                <Area type="monotone" dataKey="value" stroke="#be185d" fill="url(#colorValueSSY)" name="Total Value" />
                                <Area type="monotone" dataKey="invested" stroke="#db2777" fill="none" name="Total Invested" strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            
            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-4 bg-slate-50 rounded-lg text-xs text-slate-500">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                    <strong>Note:</strong> Comparison assumes interest rate remains constant at {interestRate}% throughout the tenure. 
                    Deposits are made at the beginning of each year. Maturity is calculated as 21 years from account opening.
                </p>
            </div>
        </div>
    );
}
