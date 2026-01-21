"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Percent, ShieldCheck, Info, CalendarClock, Users } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export function MISCalculator() {
    const [investment, setInvestment] = useState(450000); // Default 4.5 Lakhs
    const [interestRate, setInterestRate] = useState(7.4); // Current MIS Rate
    const [isJointAccount, setIsJointAccount] = useState(false);

    const maxInvestment = isJointAccount ? 1500000 : 900000;

    // Adjust investment if it exceeds limit when type changes
    if (investment > maxInvestment) {
        setInvestment(maxInvestment);
    }

    const calculateMIS = () => {
        // MIS Logic:
        // Tenure: 5 Years fixed
        // Interest Payout: Monthly
        // Formula: Monthly Interest = (P * r/100) / 12
        
        const rate = interestRate / 100;
        const monthlyInterest = (investment * rate) / 12;
        const totalInterest = monthlyInterest * 60; // 5 years * 12 months
        
        // Data for Pie Chart
        const chartData = [
            { name: "Principal Invested", value: investment, color: "#0088cc" }, // secondary
            { name: "Total Interest", value: Math.round(totalInterest), color: "#17a697" } // primary
        ];

        return {
            monthlyInterest: Math.round(monthlyInterest),
            totalInterest: Math.round(totalInterest),
            maturityAmount: investment, // Principal returned
            chartData
        };
    };

    const result = calculateMIS();

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
                                <CardTitle className="text-xl mb-1">MIS Calculator</CardTitle>
                                <CardDescription>Post Office Monthly Income Scheme</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                                    <ShieldCheck className="w-3 h-3 mr-1" /> Govt Scheme
                                </Badge>
                                <button 
                                    onClick={() => setIsJointAccount(!isJointAccount)}
                                    className={`text-xs px-2 py-1 rounded-full border transition-colors flex items-center gap-1 ${isJointAccount ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'}`}
                                >
                                    <Users className="w-3 h-3" />
                                    {isJointAccount ? "Joint Account (max 15L)" : "Single Account (max 9L)"}
                                </button>
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
                                        max={maxInvestment}
                                        className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground" 
                                    />
                                </div>
                            </div>
                            <Slider 
                                value={[investment]} 
                                onValueChange={(v) => setInvestment(v[0])} 
                                min={1000} 
                                max={maxInvestment} 
                                step={1000} 
                                className="py-2" 
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>Min: ₹1,000</span>
                                <span>Max: {formatCurrency(maxInvestment)}</span>
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
                            <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={6} max={9} step={0.1} className="py-2" />
                            <p className="text-[10px] text-muted-foreground">Current Rate: 7.4%</p>
                        </div>

                         <div className="p-4 bg-muted/50 border border-border rounded-xl flex items-start gap-3">
                            <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-foreground mb-1">Guaranteed Monthly Income</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Get a guaranteed monthly payout of <span className="font-bold">{formatCurrency(result.monthlyInterest)}</span> for 5 years. Principal returns at maturity.
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
                             <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Monthly Income</p>
                             <div className="text-5xl font-extrabold text-primary mb-2">
                                {formatCurrency(result.monthlyInterest)}
                             </div>
                             <div className="inline-flex items-center gap-2 bg-card/50 px-3 py-1 rounded-full border border-border">
                                <CalendarClock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs font-bold text-primary">Paid Monthly</span>
                             </div>
                        </div>

                        <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-4 space-y-3">
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Total Interest (5Y)</span>
                                <span className="font-bold text-primary">+{formatCurrency(result.totalInterest)}</span>
                             </div>
                             <div className="flex justify-between items-center text-sm border-t border-dashed border-border pt-3">
                                <span className="text-muted-foreground">Invested Amount</span>
                                <span className="font-bold text-foreground">{formatCurrency(investment)}</span>
                             </div>
                        </div>
                     </CardContent>
                </Card>
            </div>
             
             {/* Simple Pie Chart */}
             <Card className="border-border shadow-sm rounded-xl">
                 <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Total Returns Breakdown (5 Years)</CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="h-[250px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={result.chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {result.chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    formatter={(value: number | undefined) => formatCurrency(value || 0)} 
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                 </CardContent>
            </Card>
        </div>
    );
}
