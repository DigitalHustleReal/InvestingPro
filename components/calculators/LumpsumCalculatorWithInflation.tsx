"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { IndianRupee, Calendar, Percent, TrendingDown, Info, CheckCircle2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export function LumpsumCalculatorWithInflation() {
    const [lumpsum, setLumpsum] = useState(100000);
    const [lumpsumYears, setLumpsumYears] = useState(5);
    const [lumpsumReturn, setLumpsumReturn] = useState(12);
    const [inflationRate, setInflationRate] = useState(6);
    const [adjustForInflation, setAdjustForInflation] = useState(false);

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

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    const lumpsumChartData = [
        { name: 'Invested', value: lumpsumResult.invested, color: '#0088cc' },
        { name: 'Returns', value: adjustForInflation ? lumpsumResult.realReturns : lumpsumResult.returns, color: '#17a697' },
    ];

    const generateYearlyData = () => {
        const data = [];
        for (let year = 0; year <= lumpsumYears; year++) {
            const futureValue = lumpsum * Math.pow(1 + lumpsumReturn / 100, year);
            const realValue = adjustForInflation ? futureValue / Math.pow(1 + inflationRate / 100, year) : futureValue;
            data.push({
                year: `Y${year}`,
                value: futureValue,
                realValue: realValue
            });
        }
        return data;
    };

    // Generate year-by-year breakdown
    const generateYearlyBreakdown = () => {
        const data = [];
        for (let year = 1; year <= Math.min(lumpsumYears, 15); year++) {
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

    return (
        <div className="space-y-6">
            {/* Top Row: Inputs on Left, Results on Right */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">Lumpsum Calculator</CardTitle>
                                <CardDescription>Calculate returns on one-time investment with inflation adjustment</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge className="bg-primary/10 text-primary border-primary/20 shadow-sm transition-colors cursor-default">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Free
                                </Badge>
                                <Badge className="bg-primary/10 text-primary border-primary/20 shadow-sm transition-colors cursor-default">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Instant
                                </Badge>
                            </div>
                        </div>
                        {/* Preset Scenarios */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                            <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Examples:</span>
                            {[
                                { label: "₹10L Investment", lumpsum: 1000000, years: 10, return: 12 },
                                { label: "Short Term", lumpsum: 500000, years: 5, return: 10 },
                                { label: "Long Term", lumpsum: 2000000, years: 15, return: 12 },
                                { label: "High Return", lumpsum: 1000000, years: 10, return: 15 },
                            ].map((preset, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setLumpsum(preset.lumpsum);
                                        setLumpsumYears(preset.years);
                                        setLumpsumReturn(preset.return);
                                    }}
                                    className="text-xs px-2.5 py-1 bg-muted hover:bg-muted/80 text-muted-foreground rounded-md font-medium transition-colors border border-border"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Stacked Input Sliders */}
                        <div className="space-y-4">
                            {/* Investment Amount */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-semibold">Investment Amount</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            value={lumpsum}
                                            onChange={(e) => setLumpsum(Number(e.target.value))}
                                            className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0"
                                        />
                                    </div>
                                </div>
                                <Slider
                                    value={[lumpsum]}
                                    onValueChange={(value) => setLumpsum(value[0])}
                                    min={10000}
                                    max={10000000}
                                    step={10000}
                                    className="py-2"
                                />
                            </div>

                            {/* Investment Period */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-slate-700 dark:text-slate-300 font-semibold">Investment Period</Label>
                                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{lumpsumYears} Y</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[lumpsumYears]}
                                    onValueChange={(value) => setLumpsumYears(value[0])}
                                    min={1}
                                    max={30}
                                    step={1}
                                    className="py-2"
                                />
                            </div>

                            {/* Expected Return */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-slate-700 dark:text-slate-300 font-semibold">Expected Return</Label>
                                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5">
                                        <Percent className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{lumpsumReturn}%</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[lumpsumReturn]}
                                    onValueChange={(value) => setLumpsumReturn(value[0])}
                                    min={1}
                                    max={30}
                                    step={0.5}
                                    className="py-2"
                                />
                            </div>
                        </div>

                        {/* Inflation Toggle */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-secondary-600" />
                                <div>
                                    <Label className="text-sm text-slate-700 font-semibold">Adjust for Inflation</Label>
                                    <p className="text-xs text-slate-500">Show real returns</p>
                                </div>
                            </div>
                            <Switch
                                checked={adjustForInflation}
                                onCheckedChange={setAdjustForInflation}
                            />
                        </div>

                        {/* Inflation Rate */}
                        {adjustForInflation && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-slate-700 font-semibold">Inflation Rate</Label>
                                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                        <Percent className="w-3.5 h-3.5 text-slate-500" />
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{inflationRate}%</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[inflationRate]}
                                    onValueChange={(value) => setInflationRate(value[0])}
                                    min={2}
                                    max={10}
                                    step={0.5}
                                    className="py-2"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Right: Results Card */}
                <Card className="border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Invested</p>
                                <p className="text-base sm:text-lg font-extrabold text-secondary">{formatCurrency(lumpsumResult.invested)}</p>
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
                                    {formatCurrency(adjustForInflation ? lumpsumResult.realValue : lumpsumResult.futureValue)}
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
                            <div className="w-full max-w-[280px] h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={lumpsumChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={75}
                                            dataKey="value"
                                            strokeWidth={0}
                                            paddingAngle={5}
                                        >
                                            {lumpsumChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Growth Projection & Year-by-Year Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Growth Projection Chart */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Growth Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colorLumpsum" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} /> {/* secondary-500 */}
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorLumpsumReal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="#cbd5e1" />
                                    <YAxis
                                        tick={{ fontSize: 10 }}
                                        stroke="#cbd5e1"
                                        tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value}
                                    />
                                    <Tooltip
                                        formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#14b8a6" fill="url(#colorLumpsum)" strokeWidth={2} name="Nominal" />
                                    {adjustForInflation && (
                                        <Area type="monotone" dataKey="realValue" stroke="#0ea5e9" fill="url(#colorLumpsumReal)" strokeWidth={2} name="Real (Inflation Adjusted)" />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Year-by-Year Breakdown */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Year-by-Year Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Investment</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(lumpsum)}</p>
                                </div>
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Expected ROI</p>
                                    <p className="text-lg font-bold text-primary-600">{lumpsumReturn}%</p>
                                </div>
                            </div>

                            {/* Yearly Table */}
                            <div className="overflow-x-auto">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-slate-200">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Year</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Returns</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {yearlyData.slice(0, 10).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Year {row.year}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(row.returns)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{formatCurrency(row.total)}</td>
                                                    </tr>
                                                ))}
                                                {yearlyData.length > 10 && (
                                                    <tr className="bg-muted/30">
                                                        <td colSpan={3} className="px-3 py-2 text-xs text-center text-muted-foreground font-medium">
                                                            ... and {yearlyData.length - 10} more years
                                                        </td>
                                                    </tr>
                                                )}
                                                {yearlyData.length > 0 && (
                                                    <tr className="bg-primary/10 border-t-2 border-primary/20">
                                                        <td className="px-3 py-3 text-sm font-bold text-foreground">Final</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(adjustForInflation ? lumpsumResult.realReturns : lumpsumResult.returns)}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(adjustForInflation ? lumpsumResult.realValue : lumpsumResult.futureValue)}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Key Insight */}
                            <div className="p-4 bg-gradient-to-br from-primary-50 to-indigo-50 rounded-xl border border-secondary-100">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Compound Growth</p>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Lumpsum investments benefit from compound interest where returns are reinvested. Higher returns and longer periods significantly increase wealth.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

