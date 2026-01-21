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
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                                <CardTitle className="text-xl mb-1">SCSS Calculator</CardTitle>
                                <CardDescription>Senior Citizen Savings Scheme</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
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
                            <Slider value={[investment]} onValueChange={(v) => setInvestment(v[0])} min={1000} max={3000000} step={5000} className="py-2" />
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>Min: ₹1,000</span>
                                <span>Max: ₹30 Lakhs</span>
                            </div>
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
                            <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={7} max={9} step={0.1} className="py-2" />
                            <p className="text-[10px] text-muted-foreground">Current Rate: 8.2%</p>
                        </div>

                         <div className="p-4 bg-muted/50 border border-border rounded-xl flex items-start gap-3">
                            <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-foreground mb-1">Regular Income Scheme</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Interest is paid every quarter (April, July, Oct, Jan). It is a great source of regular income for senior citizens.
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
                             <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Quarterly Income</p>
                             <div className="text-5xl font-extrabold text-primary mb-2">
                                {formatCurrency(result.quarterlyInterest)}
                             </div>
                             <div className="inline-flex items-center gap-2 bg-card/50 px-3 py-1 rounded-full border border-border">
                                <CalendarClock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs font-bold text-primary">Paid every 3 months</span>
                             </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-4">
                                <p className="text-xs text-muted-foreground mb-1">Total Interest (5Y)</p>
                                <p className="text-lg font-bold text-primary">
                                    +{formatCurrency(result.totalInterest)}
                                </p>
                            </div>
                             <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-4">
                                <p className="text-xs text-muted-foreground mb-1">Maturity Principal</p>
                                <p className="text-lg font-bold text-foreground">
                                    {formatCurrency(result.maturityAmount)}
                                </p>
                            </div>
                        </div>
                     </CardContent>
                </Card>
            </div>
             
             {/* Yearly Payout Chart */}
             <Card className="border-border shadow-sm rounded-xl">
                 <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Projected Interest Income (Cumulative)</CardTitle>
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
                                                            <span>Annual Payout:</span>
                                                            <span className="font-bold text-primary">{formatCurrency(data.interest)}</span>
                                                        </p>
                                                         <p className="flex justify-between gap-4 text-muted-foreground">
                                                            <span>Cumulative:</span>
                                                            <span className="font-medium text-foreground">{formatCurrency(data.cumulative)}</span>
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
