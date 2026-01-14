"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Percent, CheckCircle2, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function KVPCalculator() {
    const [investment, setInvestment] = useState(50000);
    const [interestRate, setInterestRate] = useState(7.5); // Current KVP Rate

    const calculateKVP = () => {
        // KVP doubles the money.
        // Rule of 72 approximation or exact logarithmic calculation
        // n = ln(2) / ln(1 + r/100)
        
        const r = interestRate / 100;
        const yearsToDouble = Math.log(2) / Math.log(1 + r);
        
        const totalMonths = Math.ceil(yearsToDouble * 12);
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        
        // Exact doubling logic used by government often rounds to specific months
        // For 7.5%, it is exactly 115 months (9 years & 7 months)
        
        const maturityAmount = investment * 2;
        
        // Generate timeline data
        const data = [];
        for(let i = 0; i <= years + 1; i++) {
            if (i > years && months === 0) break;
            
            // This is just a visual projection
            const amount = investment * Math.pow(1 + r, i);
            data.push({
                year: `Year ${i}`,
                amount: Math.round(i === years + 1 ? maturityAmount : amount), // Snap to double at end
                invested: investment
            });
        }
        
        // Correct the last point to be exactly the maturity time
        if (data.length > 0) {
             data[data.length - 1].amount = maturityAmount;
             data[data.length - 1].year = `Year ${years} M${months}`;
        }

        return {
            maturityAmount,
            period: { years, months, totalMonths },
            data
        };
    };

    const result = calculateKVP();

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `â‚¹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `â‚¹${(num / 100000).toFixed(2)} L`;
        return `â‚¹${Math.round(num).toLocaleString('en-IN')}`;
    };

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Inputs */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                                <CardTitle className="text-xl mb-1">KVP Calculator</CardTitle>
                                <CardDescription>Kisan Vikas Patra Doubling Calculator</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge variant="secondary" className="bg-success-50 text-success-700 border-success-200">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Govt Guarantee
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Investment */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-slate-700">One-time Investment</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                                    <Input 
                                        type="number" 
                                        value={investment} 
                                        onChange={(e) => setInvestment(Number(e.target.value))}
                                        className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900" 
                                    />
                                </div>
                            </div>
                            <Slider value={[investment]} onValueChange={(v) => setInvestment(v[0])} min={1000} max={1000000} step={1000} className="py-2" />
                            <p className="text-[10px] text-slate-500">Min Investment: â‚¹1,000</p>
                        </div>

                        {/* Rate */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-slate-700">Interest Rate</Label>
                                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                    <Percent className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-sm font-bold text-slate-900">{interestRate}%</span>
                                </div>
                            </div>
                            <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={6} max={9} step={0.1} className="py-2" />
                            <p className="text-[10px] text-slate-500">Current Rate: 7.5%</p>
                        </div>

                         <div className="p-4 bg-accent-50 border border-accent-200 rounded-xl flex items-start gap-3">
                            <Info className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-accent-800 mb-1">Money Doubling Scheme</p>
                                <p className="text-xs text-accent-700 leading-relaxed">
                                    KVP guarantees to double your investment. At {interestRate}%, it takes approximately 
                                    <span className="font-bold"> {result.period.years} years & {result.period.months} months</span>.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl bg-gradient-to-br from-success-50 to-success-50 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-success-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                     <CardContent className="pt-8 relative z-10 flex flex-col justify-between h-full">
                        <div className="text-center mb-8">
                             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Maturity Amount</p>
                             <div className="text-5xl font-extrabold text-success-700 mb-2">
                                {formatCurrency(result.maturityAmount)}
                             </div>
                             <div className="inline-flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full border border-success-100">
                                <span className="text-xs font-medium text-slate-600">Invested: {formatCurrency(investment)}</span>
                                <span className="text-slate-300">|</span>
                                <span className="text-xs font-bold text-success-700">2x Returns</span>
                             </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
                                <p className="text-xs text-slate-500 mb-1">Time to Double</p>
                                <p className="text-lg font-bold text-slate-800">
                                    {result.period.years}Y {result.period.months}M
                                </p>
                            </div>
                             <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
                                <p className="text-xs text-slate-500 mb-1">Total Months</p>
                                <p className="text-lg font-bold text-slate-800">
                                    {result.period.totalMonths} Months
                                </p>
                            </div>
                        </div>
                     </CardContent>
                </Card>
            </div>
             
             {/* Simple Growth Chart */}
            <Card className="border-slate-200 shadow-sm rounded-2xl">
                 <CardContent className="pt-6">
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={result.data}>
                                <defs>
                                    <linearGradient id="colorKVP" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" tick={{fontSize: 12}} stroke="#94a3b8" />
                                <YAxis tick={{fontSize: 12}} stroke="#94a3b8" tickFormatter={(value) => `â‚¹${value/1000}k`} />
                                <Tooltip formatter={(value: number | undefined) => formatCurrency(value || 0)} />
                                <Area type="step" dataKey="amount" stroke="#16a34a" fill="url(#colorKVP)" strokeWidth={2} name="Value" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                 </CardContent>
            </Card>
        </div>
    );
}
