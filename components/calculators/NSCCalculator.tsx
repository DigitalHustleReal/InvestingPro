"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Percent, Info, ShieldCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export function NSCCalculator() {
    const [investment, setInvestment] = useState(10000);
    const [interestRate, setInterestRate] = useState(7.7); // Current NSC Rate

    const calculateNSC = () => {
        // NSC Logic:
        // Tenure: 5 Years fixed
        // Compounding: Annual
        // Formula: A = P * (1 + r/100)^5
        
        const tenure = 5;
        const rate = interestRate / 100;
        const maturityAmount = investment * Math.pow(1 + rate, tenure);
        const totalInterest = maturityAmount - investment;
        
        const yearlyData = [];
        let currentAmount = investment;
        
        for(let year = 1; year <= tenure; year++) {
            const interestEarned = currentAmount * rate;
            const closingBalance = currentAmount + interestEarned;
            
            yearlyData.push({
                year: `Year ${year}`,
                openingBalance: Math.round(currentAmount),
                interest: Math.round(interestEarned),
                closingBalance: Math.round(closingBalance)
            });
            
            currentAmount = closingBalance;
        }

        return {
            maturityAmount: Math.round(maturityAmount),
            totalInterest: Math.round(totalInterest),
            yearlyData
        };
    };

    const result = calculateNSC();

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${Math.round(num).toLocaleString('en-IN')}`;
    };

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Inputs */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                                <CardTitle className="text-xl mb-1">NSC Calculator</CardTitle>
                                <CardDescription>National Savings Certificate (VIII Issue)</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                                    <ShieldCheck className="w-3 h-3 mr-1" /> Sovereign Guarantee
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    80C Tax Benefit
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Investment */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-foreground">Investment Amount</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input 
                                        type="number" 
                                        value={investment} 
                                        onChange={(e) => setInvestment(Number(e.target.value))}
                                        className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground" 
                                    />
                                </div>
                            </div>
                            <Slider value={[investment]} onValueChange={(v) => setInvestment(v[0])} min={1000} max={500000} step={1000} className="py-2" />
                            <p className="text-[10px] text-slate-500">Min Investment: ₹1,000 (No upper limit)</p>
                        </div>

                        {/* Rate */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-foreground">Interest Rate</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-sm font-bold text-foreground">{interestRate}%</span>
                                </div>
                            </div>
                            <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={6} max={9} step={0.1} className="py-2" />
                            <p className="text-[10px] text-muted-foreground">Current Rate: 7.7% (compounded annually)</p>
                        </div>

                         <div className="p-4 bg-muted/50 border border-border rounded-xl flex items-start gap-3">
                            <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-foreground mb-1">Reinvestment Benefit</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Interest earned each year is deemed to be reinvested and qualifies for tax deduction under Section 80C.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <Card className="border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                     <CardContent className="pt-8 relative z-10 flex flex-col justify-between h-full">
                         <div className="text-center mb-6">
                             <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Maturity Amount</p>
                             <div className="text-5xl font-extrabold text-primary mb-2">
                                {formatCurrency(result.maturityAmount)}
                             </div>
                             <p className="text-xs font-medium text-muted-foreground bg-card/50 inline-block px-3 py-1 rounded-full border border-border">
                                 After 5 Years
                             </p>
                        </div>

                        <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-4 space-y-3">
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Principal Invested</span>
                                <span className="font-bold text-foreground">{formatCurrency(investment)}</span>
                             </div>
                             <div className="flex justify-between items-center text-sm border-t border-dashed border-border pt-3">
                                <span className="text-muted-foreground">Total Interest Earned</span>
                                <span className="font-bold text-primary">+{formatCurrency(result.totalInterest)}</span>
                             </div>
                        </div>
                        
                        <p className="text-[10px] text-muted-foreground text-center mt-4">
                            *Interest is compounded annually but paid at maturity
                        </p>
                     </CardContent>
                </Card>
            </div>
             
             {/* Yearly Growth Chart */}
            <Card className="border-border shadow-sm rounded-xl">
                 <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Yearly Growth & Reinvestment</CardTitle>
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
                                                <div className="bg-card p-3 border border-border shadow-xl rounded-xl text-xs">
                                                    <p className="font-bold mb-2 text-foreground">{data.year}</p>
                                                    <div className="space-y-1">
                                                        <p className="flex justify-between gap-4 text-muted-foreground">
                                                            <span>Opening:</span>
                                                            <span className="font-medium text-foreground">{formatCurrency(data.openingBalance)}</span>
                                                        </p>
                                                        <p className="flex justify-between gap-4 text-primary">
                                                            <span>Interest:</span>
                                                            <span className="font-bold">+{formatCurrency(data.interest)}</span>
                                                        </p>
                                                        <div className="border-t border-border pt-1 mt-1 flex justify-between gap-4 text-secondary font-bold">
                                                            <span>Closing:</span>
                                                            <span>{formatCurrency(data.closingBalance)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="closingBalance" name="Balance" radius={[4, 4, 0, 0]}>
                                    {result.yearlyData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={`hsl(var(--primary))`} fillOpacity={0.7 + (index * 0.05)} />
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
