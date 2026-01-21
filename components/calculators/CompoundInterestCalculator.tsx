"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IndianRupee, Percent, Clock, Calculator, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export function CompoundInterestCalculator() {
    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(10);
    const [time, setTime] = useState(5);
    const [frequency, setFrequency] = useState("1"); // 1 = Annually

    const calculateCI = () => {
        // CI Formula: A = P(1 + r/n)^(nt)
        // r = rate/100, n = times per year, t = years
        
        const r = rate / 100;
        const n = Number(frequency);
        const t = time;
        
        const totalAmount = principal * Math.pow((1 + (r/n)), (n * t));
        const totalInterest = totalAmount - principal;

        // Generate Growth Chart vs Simple Interest
        const data = [];
        for(let i = 0; i <= t; i++) {
            // CI Value
            const ciAmount = principal * Math.pow((1 + (r/n)), (n * i));
            // SI Value (for comparison)
            const siAmount = principal + ((principal * rate * i) / 100);
            
            data.push({
                year: `Year ${i}`,
                compound: Math.round(ciAmount),
                simple: Math.round(siAmount)
            });
        }

        return {
            totalInterest: Math.round(totalInterest),
            totalAmount: Math.round(totalAmount),
            data
        };
    };

    const result = calculateCI();

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
                                <CardTitle className="text-xl mb-1">Compound Interest</CardTitle>
                                <CardDescription>Power of Compounding</CardDescription>
                            </div>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                <TrendingUp className="w-3 h-3 mr-1" /> Exponential
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Principal */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-foreground">Principal Amount</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input 
                                        type="number" 
                                        value={principal} 
                                        onChange={(e) => setPrincipal(Number(e.target.value))}
                                        className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground" 
                                    />
                                </div>
                            </div>
                            <Slider value={[principal]} onValueChange={(v) => setPrincipal(v[0])} min={1000} max={10000000} step={1000} className="py-2" />
                        </div>

                        {/* Rate */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-semibold text-foreground">Rate of Interest (% p.a)</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input 
                                        type="number" 
                                        value={rate} 
                                        onChange={(e) => setRate(Number(e.target.value))}
                                        className="w-20 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground" 
                                    />
                                </div>
                            </div>
                            <Slider value={[rate]} onValueChange={(v) => setRate(v[0])} min={1} max={30} step={0.1} className="py-2" />
                        </div>

                         {/* Time & Frequency */}
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold text-foreground">Time (Years)</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5 mb-2">
                                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input 
                                        type="number" 
                                        value={time} 
                                        onChange={(e) => setTime(Number(e.target.value))}
                                        className="w-full border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground" 
                                    />
                                </div>
                                <Slider value={[time]} onValueChange={(v) => setTime(v[0])} min={1} max={50} step={1} className="py-2" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold text-foreground">Compounding Frequency</Label>
                                <Select value={frequency} onValueChange={setFrequency}>
                                    <SelectTrigger className="w-full bg-muted border-0 font-medium text-foreground">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Annually</SelectItem>
                                        <SelectItem value="2">Semi-Annually</SelectItem>
                                        <SelectItem value="4">Quarterly</SelectItem>
                                        <SelectItem value="12">Monthly</SelectItem>
                                        <SelectItem value="365">Daily</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                {formatCurrency(result.totalAmount)}
                             </div>
                        </div>

                        <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border p-4 space-y-3">
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Principal</span>
                                <span className="font-bold text-foreground">{formatCurrency(principal)}</span>
                             </div>
                             <div className="flex justify-between items-center text-sm border-t border-dashed border-border pt-3">
                                <span className="text-muted-foreground">Compound Interest</span>
                                <span className="font-bold text-primary">+{formatCurrency(result.totalInterest)}</span>
                             </div>
                        </div>
                        
                         <div className="p-4 bg-primary/5 rounded-xl mt-4 border border-primary/20">
                             <div className="flex items-center gap-2 mb-2">
                                <Calculator className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold text-primary-700">Formula</span>
                             </div>
                             <p className="text-[10px] text-primary-800 font-mono leading-relaxed">
                                A = P(1 + r/n)^(nt)
                             </p>
                        </div>
                     </CardContent>
                </Card>
            </div>
             
            {/* Comparison Chart */}
            <Card className="border-border shadow-sm rounded-xl">
                 <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Growth: Compound vs Simple</CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={result.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCompound" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#17a697" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#17a697" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.5} />
                                <XAxis dataKey="year" tick={{fontSize: 12}} stroke="#94a3b8" />
                                <YAxis tick={{fontSize: 12}} stroke="#94a3b8" tickFormatter={(value) => `₹${value/1000}k`} />
                                <Tooltip 
                                    formatter={(value: number | undefined) => formatCurrency(value || 0)} 
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="compound" stroke="#17a697" fillOpacity={1} fill="url(#colorCompound)" name="Compound Interest" strokeWidth={2} />
                                <Area type="monotone" dataKey="simple" stroke="#0088cc" fill="transparent" strokeDasharray="5 5" name="Simple Interest" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                 </CardContent>
            </Card>
        </div>
    );
}
