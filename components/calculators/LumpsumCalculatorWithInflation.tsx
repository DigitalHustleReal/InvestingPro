"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";
import { IndianRupee, Calendar, Percent, TrendingDown, CheckCircle2, Zap, ChevronDown, ChevronUp, Trophy, Sparkles, FileText, Lock, TrendingUp, Home, GraduationCap, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { toast } from "sonner";

export function LumpsumCalculatorWithInflation() {
    const [lumpsum, setLumpsum] = useState(100000);
    const [lumpsumYears, setLumpsumYears] = useState(5);
    const [lumpsumReturn, setLumpsumReturn] = useState(12);
    const [inflationRate, setInflationRate] = useState(6);
    const [adjustForInflation, setAdjustForInflation] = useState(false);
    const [inputsExpanded, setInputsExpanded] = useState(false);
    const [showAllYears, setShowAllYears] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEmailSubmit = () => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => { setIsSubmitting(false); setEmail(""); toast.success("Report sent! Check your inbox."); }, 1500);
    };

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    const calculateLumpsum = () => {
        const futureValue = lumpsum * Math.pow(1 + lumpsumReturn / 100, lumpsumYears);
        const returns = futureValue - lumpsum;

        let realValue = futureValue;
        let realReturns = returns;
        if (adjustForInflation) {
            realValue = futureValue / Math.pow(1 + inflationRate / 100, lumpsumYears);
            realReturns = realValue - lumpsum;
        }

        return { futureValue, invested: lumpsum, returns, realValue, realReturns };
    };

    const lumpsumResult = calculateLumpsum();

    const lumpsumChartData = [
        { name: 'Invested', value: lumpsumResult.invested, color: '#166534' },
        { name: 'Returns', value: adjustForInflation ? lumpsumResult.realReturns : lumpsumResult.returns, color: '#16a34a' },
    ];

    const generateYearlyData = () => {
        const data = [];
        for (let year = 0; year <= lumpsumYears; year++) {
            const futureValue = lumpsum * Math.pow(1 + lumpsumReturn / 100, year);
            const realValue = adjustForInflation ? futureValue / Math.pow(1 + inflationRate / 100, year) : futureValue;
            data.push({ year: `Y${year}`, value: futureValue, realValue });
        }
        return data;
    };

    const generateYearlyBreakdown = () => {
        const data = [];
        for (let year = 1; year <= Math.min(lumpsumYears, 30); year++) {
            const futureValue = lumpsum * Math.pow(1 + lumpsumReturn / 100, year);
            const returns = futureValue - lumpsum;
            const realValue = adjustForInflation ? futureValue / Math.pow(1 + inflationRate / 100, year) : futureValue;
            const realReturns = realValue - lumpsum;

            data.push({
                year,
                invested: lumpsum,
                returns: adjustForInflation ? realReturns : returns,
                total: realValue,
                roi: ((returns / lumpsum) * 100).toFixed(1)
            });
        }
        return data;
    };

    const growthData = generateYearlyData();
    const yearlyData = generateYearlyBreakdown();
    const multiplier = (lumpsumResult.futureValue / lumpsum).toFixed(1);
    const displayValue = adjustForInflation ? lumpsumResult.realValue : lumpsumResult.futureValue;

    const inputSliders = (
        <div className="space-y-4">
            {/* Investment Amount */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Investment Amount</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                        <Input type="number" value={lumpsum} onChange={(e) => setLumpsum(Number(e.target.value))} className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                    </div>
                </div>
                <Slider value={[lumpsum]} onValueChange={(v) => setLumpsum(v[0])} min={10000} max={10000000} step={10000} className="py-2" />
            </div>

            {/* Investment Period */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Investment Period</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{lumpsumYears} Y</span>
                    </div>
                </div>
                <Slider value={[lumpsumYears]} onValueChange={(v) => setLumpsumYears(v[0])} min={1} max={30} step={1} className="py-2" />
            </div>

            {/* Expected Return */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Expected Return (p.a.)</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{lumpsumReturn}%</span>
                    </div>
                </div>
                <Slider value={[lumpsumReturn]} onValueChange={(v) => setLumpsumReturn(v[0])} min={1} max={30} step={0.5} className="py-2" />
            </div>

            {/* Inflation Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-amber-600" />
                    <div>
                        <Label className="text-sm font-semibold">Adjust for Inflation</Label>
                        <p className="text-xs text-muted-foreground">Show real returns</p>
                    </div>
                </div>
                <Switch checked={adjustForInflation} onCheckedChange={setAdjustForInflation} />
            </div>

            {adjustForInflation && (
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm font-semibold">Inflation Rate</Label>
                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                            <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm font-bold text-foreground">{inflationRate}%</span>
                        </div>
                    </div>
                    <Slider value={[inflationRate]} onValueChange={(v) => setInflationRate(v[0])} min={2} max={10} step={0.5} className="py-2" />
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Mobile: Collapsible Inputs Card */}
            <div className="lg:hidden">
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="cursor-pointer" onClick={() => setInputsExpanded(!inputsExpanded)}>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-lg mb-1">Lumpsum Calculator</CardTitle>
                                <CardDescription className="text-xs">Tap to adjust inputs</CardDescription>
                            </div>
                            {inputsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                    </CardHeader>
                    {inputsExpanded && (
                        <CardContent className="space-y-4 pt-0">
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Amount</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(lumpsum)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Years</p>
                                    <p className="text-sm font-bold text-foreground">{lumpsumYears}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Return</p>
                                    <p className="text-sm font-bold text-foreground">{lumpsumReturn}%</p>
                                </div>
                            </div>
                            {inputSliders}
                        </CardContent>
                    )}
                </Card>
            </div>

            {/* Desktop: Top Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card */}
                <Card className="hidden lg:block border-border shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">Lumpsum Calculator</CardTitle>
                                <CardDescription>Calculate returns on one-time investment with inflation adjustment</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge className="bg-primary/10 text-primary border-primary/20 shadow-sm transition-colors cursor-default">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Free
                                </Badge>
                                <Badge className="bg-primary/10 text-primary border-primary/20 shadow-sm transition-colors cursor-default text-[10px]">
                                    <Zap className="w-3 h-3 mr-1" /> Instant
                                </Badge>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                            <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Examples:</span>
                            {[
                                { label: "₹10K 5yr 12%", lumpsum: 10000, years: 5, ret: 12 },
                                { label: "₹1L 10yr 12%", lumpsum: 100000, years: 10, ret: 12 },
                                { label: "₹5L 15yr 12%", lumpsum: 500000, years: 15, ret: 12 },
                                { label: "₹10L 20yr 15%", lumpsum: 1000000, years: 20, ret: 15 },
                            ].map((preset, idx) => (
                                <button key={idx} onClick={() => { setLumpsum(preset.lumpsum); setLumpsumYears(preset.years); setLumpsumReturn(preset.ret); }}
                                    className="text-xs px-2.5 py-1 bg-muted hover:bg-muted/80 text-foreground rounded-md font-medium transition-colors border border-border">
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {inputSliders}
                    </CardContent>
                </Card>

                {/* Right: Results Card */}
                <Card className="order-first lg:order-none border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Invested</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(lumpsumResult.invested)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Returns' : 'Returns'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">
                                    {formatCurrency(adjustForInflation ? lumpsumResult.realReturns : lumpsumResult.returns)}
                                </p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
                                    {adjustForInflation ? 'Real Value' : 'Total'}
                                </p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">
                                    {formatCurrency(displayValue)}
                                </p>
                            </div>
                        </div>

                        {adjustForInflation && (
                            <div className="p-3 bg-card rounded-xl border border-border mb-4">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Nominal Value</p>
                                <p className="text-sm font-bold text-foreground">{formatCurrency(lumpsumResult.futureValue)}</p>
                                <p className="text-xs text-muted-foreground mt-1">Before inflation adjustment</p>
                            </div>
                        )}

                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-[280px] h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={lumpsumChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" strokeWidth={0} paddingAngle={5}>
                                            {lumpsumChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Chart & Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Growth Projection Chart */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Growth Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colorLumpsumValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorLumpsumReal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--border))" tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value} />
                                    <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="value" stroke="#166534" fill="url(#colorLumpsumValue)" strokeWidth={2} name="Nominal" />
                                    {adjustForInflation && (
                                        <Area type="monotone" dataKey="realValue" stroke="#d97706" fill="url(#colorLumpsumReal)" strokeWidth={2} name="Real (Inflation Adjusted)" />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Year-by-Year Breakdown */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Year-by-Year Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-muted rounded-xl border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Investment</p>
                                    <p className="text-lg font-bold text-foreground">{formatCurrency(lumpsum)}</p>
                                </div>
                                <div className="p-4 bg-muted rounded-xl border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Expected ROI</p>
                                    <p className="text-lg font-bold text-primary">{lumpsumReturn}%</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-border">
                                        <table className="w-full min-w-full sm:min-w-[400px]">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Year</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Returns</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">ROI%</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {(showAllYears ? yearlyData : yearlyData.slice(0, 10)).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Year {row.year}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(row.returns)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{formatCurrency(row.total)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{row.roi}%</td>
                                                    </tr>
                                                ))}
                                                {!showAllYears && yearlyData.length > 10 && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setShowAllYears(true)}>
                                                        <td colSpan={4} className="px-3 py-3 text-xs text-center text-primary font-bold">Show {yearlyData.length - 10} more years...</td>
                                                    </tr>
                                                )}
                                                {showAllYears && (
                                                    <tr className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setShowAllYears(false)}>
                                                        <td colSpan={4} className="px-3 py-3 text-xs text-center text-primary font-bold">Show Less</td>
                                                    </tr>
                                                )}
                                                {yearlyData.length > 0 && (
                                                    <tr className="bg-primary/10 border-t-2 border-primary/20">
                                                        <td className="px-3 py-3 text-sm font-bold text-foreground">Final</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(adjustForInflation ? lumpsumResult.realReturns : lumpsumResult.returns)}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(displayValue)}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-foreground">{multiplier}x</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* What This Means */}
                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-emerald-950/30 dark:to-emerald-950/30 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy className="w-24 h-24 text-emerald-600" /></div>
                                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> What This Means
                                </h3>
                                <p className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-3">
                                    Your <span className="font-bold">{formatCurrency(lumpsum)}</span> one-time investment grows to <span className="font-bold text-2xl underline decoration-emerald-400 decoration-2 underline-offset-2">{formatCurrency(displayValue)}</span> in {lumpsumYears} years — <span className="font-bold">{multiplier}x</span> your money!
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {displayValue > 10000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> Financial Freedom
                                        </Badge>
                                    )}
                                    {displayValue > 5000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <Home className="w-3 h-3" /> Dream Home Down Payment
                                        </Badge>
                                    )}
                                    {displayValue > 1000000 && displayValue <= 5000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <GraduationCap className="w-3 h-3" /> Education Fund
                                        </Badge>
                                    )}
                                    {displayValue > 500000 && displayValue <= 1000000 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <Car className="w-3 h-3" /> New Car
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Lead Capture */}
                            <div className="p-5 bg-card rounded-xl border border-border shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        Get Top Fund Picks (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Get top mutual fund recommendations for lumpsum investment targeting {formatCurrency(displayValue)}.
                                </p>
                                <div className="flex gap-2">
                                    <Input placeholder="Enter your email" className="h-9 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
                                    <Button size="sm" className="h-9 bg-primary-600 hover:bg-primary-700 text-white" onClick={handleEmailSubmit} disabled={isSubmitting}>
                                        {isSubmitting ? "Sending..." : "Send"}
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                                    <Lock className="w-3 h-3 inline mr-1" /> No spam. Unsubscribe anytime.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
