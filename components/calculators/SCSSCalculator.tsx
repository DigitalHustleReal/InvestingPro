"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Percent, ShieldCheck, Info, CalendarClock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export function SCSSCalculator() {
    const [investment, setInvestment] = useState(1500000); // Default 15 Lakhs
    const [interestRate, setInterestRate] = useState(8.2); // Current SCSS Rate

    const calculateSCSS = () => {
        // SCSS Logic:
        // Tenure: 5 Years fixed
        // Interest Payout: Quarterly
        // Formula: Quarterly Interest = (P * r/100) / 4
        
        const rate = interestRate / 100;
        const quarterlyInterest = (investment * rate) / 4;
        const totalAnnumInterest = quarterlyInterest * 4;
        
        // 5 Years = 20 Quarters
        const totalInterest = quarterlyInterest * 20;
        const totalAmount = investment; // Principal returned at maturity
        
        const yearlyData = [];
        for(let year = 1; year <= 5; year++) {
            yearlyData.push({
                year: `Year ${year}`,
                interest: Math.round(totalAnnumInterest),
                cumulative: Math.round(totalAnnumInterest * year)
            });
        }

        return {
            quarterlyInterest: Math.round(quarterlyInterest),
            totalInterest: Math.round(totalInterest),
            maturityAmount: Math.round(totalAmount),
            yearlyData
        };
    };

    const result = calculateSCSS();

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${Math.round(num).toLocaleString('en-IN')}`;
    };

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Inputs */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                                <CardTitle className="text-xl mb-1">SCSS Calculator</CardTitle>
                                <CardDescription>Senior Citizen Savings Scheme</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge variant="secondary" className="bg-accent-50 text-accent-700 border-accent-200">
                                    <ShieldCheck className="w-3 h-3 mr-1" /> Govt Backed
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    Quarterly Payout
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Investment */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-slate-700">Investment Amount</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                                    <Input 
                                        type="number" 
                                        value={investment} 
                                        onChange={(e) => setInvestment(Number(e.target.value))}
                                        className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900 dark:text-white" 
                                    />
                                </div>
                            </div>
                            <Slider value={[investment]} onValueChange={(v) => setInvestment(v[0])} min={1000} max={3000000} step={5000} className="py-2" />
                            <div className="flex justify-between text-[10px] text-slate-500">
                                <span>Min: ₹1,000</span>
                                <span>Max: ₹30 Lakhs</span>
                            </div>
                        </div>

                        {/* Rate */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-slate-700">Interest Rate</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <Percent className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{interestRate}%</span>
                                </div>
                            </div>
                            <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={7} max={9} step={0.1} className="py-2" />
                            <p className="text-[10px] text-slate-500">Current Rate: 8.2%</p>
                        </div>

                         <div className="p-4 bg-accent-50 border border-accent-200 rounded-xl flex items-start gap-3">
                            <Info className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-accent-800 mb-1">Regular Income Scheme</p>
                                <p className="text-xs text-accent-700 leading-relaxed">
                                    Interest is paid every quarter (April, July, Oct, Jan). It is a great source of regular income for senior citizens.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl bg-gradient-to-br from-accent-50 to-orange-50 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-accent-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                     <CardContent className="pt-8 relative z-10 flex flex-col justify-between h-full">
                         <div className="text-center mb-6">
                             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Quarterly Income</p>
                             <div className="text-5xl font-extrabold text-accent-700 mb-2">
                                {formatCurrency(result.quarterlyInterest)}
                             </div>
                             <div className="inline-flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full border border-accent-100">
                                <CalendarClock className="w-3 h-3 text-accent-600" />
                                <span className="text-xs font-bold text-accent-700">Paid every 3 months</span>
                             </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-4">
                                <p className="text-xs text-slate-500 mb-1">Total Interest (5Y)</p>
                                <p className="text-lg font-bold text-success-700">
                                    +{formatCurrency(result.totalInterest)}
                                </p>
                            </div>
                             <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-4">
                                <p className="text-xs text-slate-500 mb-1">Maturity Principal</p>
                                <p className="text-lg font-bold text-slate-800">
                                    {formatCurrency(result.maturityAmount)}
                                </p>
                            </div>
                        </div>
                     </CardContent>
                </Card>
            </div>
             
             {/* Yearly Payout Chart */}
            <Card className="border-slate-200 shadow-sm rounded-2xl">
                 <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Projected Interest Income (Cumulative)</CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={result.yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" tick={{fontSize: 12}} stroke="#94a3b8" />
                                <YAxis tick={{fontSize: 12}} stroke="#94a3b8" tickFormatter={(value) => `₹${value/1000}k`} />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl text-xs">
                                                    <p className="font-bold mb-2 text-slate-700">{data.year}</p>
                                                    <div className="space-y-1">
                                                        <p className="flex justify-between gap-4 text-slate-500">
                                                            <span>Annual Payout:</span>
                                                            <span className="font-bold text-accent-600">{formatCurrency(data.interest)}</span>
                                                        </p>
                                                         <p className="flex justify-between gap-4 text-slate-500">
                                                            <span>Cumulative:</span>
                                                            <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(data.cumulative)}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="cumulative" name="Total Interest Received" radius={[4, 4, 0, 0]}>
                                    {result.yearlyData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={`hsl(35, 90%, ${60 - (index * 4)}%)`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </CardContent>
            </Card>
        </div>
    );
}
