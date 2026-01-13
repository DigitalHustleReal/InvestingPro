"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Percent, Clock, Calculator } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export function SimpleInterestCalculator() {
    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(5);
    const [time, setTime] = useState(2); // Years

    const calculateSI = () => {
        // SI Formula: (P * R * T) / 100
        const simpleInterest = (principal * rate * time) / 100;
        const totalAmount = principal + simpleInterest;
        
        const chartData = [
            { name: "Principal", value: principal, color: "#cbd5e1" }, // slate-300
            { name: "Interest Earned", value: Math.round(simpleInterest), color: "#3b82f6" } // blue-500
        ];

        return {
            simpleInterest: Math.round(simpleInterest),
            totalAmount: Math.round(totalAmount),
            chartData
        };
    };

    const result = calculateSI();

    const formatCurrency = (num: number) => {
        return `₹${num.toLocaleString('en-IN')}`;
    };

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Inputs */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                                <CardTitle className="text-xl mb-1">Simple Interest</CardTitle>
                                <CardDescription>Basic Interest Calculator</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-xs">
                                Basic Formula
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Principal */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-slate-700">Principal Amount</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                                    <Input 
                                        type="number" 
                                        value={principal} 
                                        onChange={(e) => setPrincipal(Number(e.target.value))}
                                        className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900" 
                                    />
                                </div>
                            </div>
                            <Slider value={[principal]} onValueChange={(v) => setPrincipal(v[0])} min={100} max={1000000} step={100} className="py-2" />
                            <p className="text-[10px] text-slate-500">Min: ₹100</p>
                        </div>

                        {/* Rate */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-slate-700">Rate of Interest (% p.a)</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <Percent className="w-3.5 h-3.5 text-slate-500" />
                                    <Input 
                                        type="number" 
                                        value={rate} 
                                        onChange={(e) => setRate(Number(e.target.value))}
                                        className="w-20 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900" 
                                    />
                                </div>
                            </div>
                            <Slider value={[rate]} onValueChange={(v) => setRate(v[0])} min={1} max={50} step={0.1} className="py-2" />
                        </div>

                         {/* Time */}
                         <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-slate-700">Time Period (Years)</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                                    <Input 
                                        type="number" 
                                        value={time} 
                                        onChange={(e) => setTime(Number(e.target.value))}
                                        className="w-20 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900" 
                                    />
                                </div>
                            </div>
                            <Slider value={[time]} onValueChange={(v) => setTime(v[0])} min={1} max={30} step={1} className="py-2" />
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                     <CardContent className="pt-8 relative z-10 flex flex-col justify-between h-full">
                         <div className="text-center mb-6">
                             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Total Interest</p>
                             <div className="text-5xl font-extrabold text-blue-700 mb-2">
                                {formatCurrency(result.simpleInterest)}
                             </div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-4 space-y-3">
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Principal Amount</span>
                                <span className="font-bold text-slate-900">{formatCurrency(principal)}</span>
                             </div>
                             <div className="flex justify-between items-center text-sm border-t border-dashed border-slate-300 pt-3">
                                <span className="text-slate-600 font-bold">Total Amount</span>
                                <span className="font-bold text-success-700 text-lg">{formatCurrency(result.totalAmount)}</span>
                             </div>
                        </div>
                        
                         <div className="h-[200px] mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={result.chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {result.chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value: number | undefined) => formatCurrency(value || 0)} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                     </CardContent>
                </Card>
            </div>
            
             <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <Calculator className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-slate-700 mb-1">Formula Used</p>
                    <p className="text-xs text-slate-600 font-mono">
                        Simple Interest (SI) = (P × R × T) / 100
                    </p>
                </div>
            </div>
        </div>
    );
}
