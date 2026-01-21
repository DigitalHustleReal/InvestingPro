"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Calendar, Percent, CheckCircle2, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export function RDCalculator() {
    const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
    const [years, setYears] = useState(5);
    const [interestRate, setInterestRate] = useState(6.5);

    const calculateRD = () => {
        const totalMonths = years * 12;
        let maturityAmount = 0;
        const totalInvested = monthlyDeposit * totalMonths;

        // Iterate through each monthly deposit
        // Indian banks typically use quarterly compounding for RDs
        for (let i = 0; i < totalMonths; i++) {
            // Months remaining for this specific installment
            // Installment 1 (i=0) stays for 'totalMonths'
            // Installment N (i=totalMonths-1) stays for 1 month
            const monthsRemaining = totalMonths - i;
            
            // Quarterly Compounding Formula: A = P * (1 + R/400)^(4*t)
            // t = monthsRemaining / 12 year
            const t = monthsRemaining / 12;
            const installmentMaturity = monthlyDeposit * Math.pow(1 + interestRate / 400, 4 * t);
            
            maturityAmount += installmentMaturity;
        }

        const totalInterest = maturityAmount - totalInvested;

        return {
            check: "Quarterly Compounding",
            totalInvested: Math.round(totalInvested),
            maturityAmount: Math.round(maturityAmount),
            totalInterest: Math.round(totalInterest)
        };
    };

    const result = calculateRD();

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    const chartData = [
        { name: 'Invested', value: result.totalInvested, color: '#0088cc' },
        { name: 'Interest', value: result.totalInterest, color: '#17a697' },
    ];

    const generateGrowthData = () => {
        const data = [];
        for (let y = 0; y <= years; y++) {
            if (y === 0) {
                data.push({ year: 'Y0', invested: 0, value: 0 });
                continue;
            }
            // Simple approximation for chart points: Pro-rate the final maturity curve
            // Or re-calculate for partial duration 'y'
            const partialMonths = y * 12;
            const partialInvested = monthlyDeposit * partialMonths;
            let partialMaturity = 0;
            
            for (let i = 0; i < partialMonths; i++) {
                const monthsRemaining = partialMonths - i;
                const t = monthsRemaining / 12;
                partialMaturity += monthlyDeposit * Math.pow(1 + interestRate / 400, 4 * t);
            }

            data.push({
                year: `Y${y}`,
                invested: Math.round(partialInvested),
                value: Math.round(partialMaturity)
            });
        }
        return data;
    };

    const growthData = generateGrowthData();

    return (
        <div className="space-y-6">
            {/* Top Row: Inputs & Quick Results */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Inputs */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">RD Calculator</CardTitle>
                                <CardDescription>Calculate maturity amount for Recurring Deposits</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Quarterly Compounding
                                </Badge>
                            </div>
                        </div>
                        {/* Presets */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                             <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Scenarios:</span>
                             {[
                                { label: "1 Year", deposit: 10000, y: 1, r: 6.5 },
                                { label: "3 Years", deposit: 5000, y: 3, r: 7.0 },
                                { label: "5 Years", deposit: 10000, y: 5, r: 7.2 },
                             ].map((p, i) => (
                                 <button key={i} onClick={() => { setMonthlyDeposit(p.deposit); setYears(p.y); setInterestRate(p.r); }}
                                    className="text-xs px-2.5 py-1 bg-muted hover:bg-muted/80 text-muted-foreground rounded-md font-medium transition-colors border border-border">
                                    {p.label}
                                 </button>
                             ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Monthly Deposit */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-foreground">Monthly Deposit</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input 
                                        type="number" 
                                        value={monthlyDeposit} 
                                        onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                                        className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground" 
                                    />
                                </div>
                            </div>
                            <Slider value={[monthlyDeposit]} onValueChange={(v) => setMonthlyDeposit(v[0])} min={500} max={100000} step={500} className="py-2" />
                        </div>

                        {/* Tenure */}
                         <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-foreground">Time Period (Years)</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-sm font-bold text-foreground">{years} Yr</span>
                                </div>
                            </div>
                            <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={1} max={10} step={1} className="py-2" />
                        </div>

                        {/* Interest Rate */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-foreground">Interest Rate (p.a)</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-sm font-bold text-foreground">{interestRate}%</span>
                                </div>
                            </div>
                            <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={3} max={12} step={0.1} className="py-2" />
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <Card className="border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                     <CardContent className="pt-6 relative z-10">
                        {/* Main Numbers */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-card rounded-xl border border-border text-center">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Maturity Amount</p>
                                <p className="text-2xl font-extrabold text-foreground">{formatCurrency(result.maturityAmount)}</p>
                            </div>
                             <div className="p-4 bg-card rounded-xl border border-border text-center">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Interest</p>
                                <p className="text-xl font-bold text-primary">+{formatCurrency(result.totalInterest)}</p>
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
                                <div className="w-3 h-3 rounded-full bg-secondary" />
                                <span className="text-sm font-medium text-muted-foreground">Invested: {formatCurrency(result.totalInvested)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <span className="text-sm font-medium text-muted-foreground">Returns: {formatCurrency(result.totalInterest)}</span>
                            </div>
                        </div>
                     </CardContent>
                </Card>
            </div>

            {/* Growth Chart */}
            <Card className="border-border shadow-sm rounded-xl">
                <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Growth Projection</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0088cc" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#0088cc" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#17a697" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#17a697" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.5} />
                                <XAxis dataKey="year" tick={{fontSize: 12}} stroke="#94a3b8" />
                                <YAxis tick={{fontSize: 12}} stroke="#94a3b8" tickFormatter={(value) => `₹${value/1000}k`} />
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                />
                                <Area type="monotone" dataKey="invested" stackId="1" stroke="#0088cc" fill="url(#colorInvested)" name="Total Invested" />
                                <Area type="monotone" dataKey="value" stackId="2" stroke="#17a697" fill="url(#colorValue)" name="Maturity Value" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
