"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { IndianRupee, Calendar, Percent, Info, CheckCircle2, HelpCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export function EMICalculatorEnhanced() {
    const [emiLoan, setEmiLoan] = useState(5000000);
    const [emiRate, setEmiRate] = useState(8.5);
    const [emiTenure, setEmiTenure] = useState(20);

    const calculateEMI = () => {
        const monthlyRate = emiRate / 100 / 12;
        const months = emiTenure * 12;
        const emi = (emiLoan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        const totalPayment = emi * months;
        const totalInterest = totalPayment - emiLoan;
        
        // Generate amortization schedule (first 12 months)
        const schedule = [];
        let remainingPrincipal = emiLoan;
        for (let month = 1; month <= Math.min(12, months); month++) {
            const interestPayment = remainingPrincipal * monthlyRate;
            const principalPayment = emi - interestPayment;
            remainingPrincipal -= principalPayment;
            schedule.push({
                month: `M${month}`,
                principal: principalPayment,
                interest: interestPayment
            });
        }

        return { emi, totalPayment, totalInterest, schedule };
    };

    // Generate year-by-year breakdown
    const generateYearlyBreakdown = () => {
        const monthlyRate = emiRate / 100 / 12;
        const months = emiTenure * 12;
        const emi = (emiLoan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        const data = [];
        let remainingPrincipal = emiLoan;

        for (let year = 1; year <= Math.min(emiTenure, 15); year++) {
            let yearPrincipal = 0;
            let yearInterest = 0;

            for (let month = 0; month < 12 && remainingPrincipal > 0; month++) {
                const interestPayment = remainingPrincipal * monthlyRate;
                const principalPayment = emi - interestPayment;
                remainingPrincipal -= principalPayment;
                yearPrincipal += principalPayment;
                yearInterest += interestPayment;
            }

            data.push({
                year,
                principal: yearPrincipal,
                interest: yearInterest,
                remaining: remainingPrincipal,
            });
        }
        return data;
    };

    const emiResult = calculateEMI();
    const yearlyData = generateYearlyBreakdown();

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `â‚¹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `â‚¹${(num / 100000).toFixed(2)} L`;
        return `â‚¹${num.toLocaleString('en-IN')}`;
    };

    const emiChartData = [
        { name: 'Principal', value: emiLoan, color: '#0ea5e9' }, // secondary-500
        { name: 'Interest', value: emiResult.totalInterest, color: '#0284c7' }, // secondary-600
    ];

    return (
        <div className="space-y-6">
            {/* Top Row: Inputs on Left, Results on Right */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">EMI Calculator</CardTitle>
                                <CardDescription>Calculate your monthly loan EMI with detailed breakdown</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge variant="secondary" className="bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Free
                                </Badge>
                                <Badge variant="secondary" className="bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100 text-[10px]">
                                    <Zap className="w-3 h-3 mr-1" /> Instant
                                </Badge>
                            </div>
                        </div>
                        {/* Preset Scenarios */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
                            <span className="text-xs font-semibold text-slate-600 mr-1">Quick Examples:</span>
                            {[
                                { label: "Home Loan â‚¹50L", loan: 5000000, years: 20, rate: 8.5 },
                                { label: "Car Loan â‚¹10L", loan: 1000000, years: 5, rate: 9.5 },
                                { label: "Personal Loan â‚¹5L", loan: 500000, years: 3, rate: 12 },
                                { label: "Business Loan", loan: 2000000, years: 5, rate: 11 },
                            ].map((preset, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setEmiLoan(preset.loan);
                                        setEmiTenure(preset.years);
                                        setEmiRate(preset.rate);
                                    }}
                                    className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md font-medium transition-colors border border-slate-200"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Stacked Input Sliders */}
                        <div className="space-y-4">
                            {/* Loan Amount */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-slate-700 font-semibold">Loan Amount</Label>
                                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                                        <Input
                                            type="number"
                                            value={emiLoan}
                                            onChange={(e) => setEmiLoan(Number(e.target.value))}
                                            className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-slate-900"
                                        />
                                    </div>
                                </div>
                                <Slider
                                    value={[emiLoan]}
                                    onValueChange={(value) => setEmiLoan(value[0])}
                                    min={100000}
                                    max={50000000}
                                    step={100000}
                                    className="py-2"
                                />
                            </div>

                            {/* Interest Rate */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1.5">
                                        <Label className="text-sm text-slate-700 font-semibold">Interest Rate</Label>
                                        <div className="group relative">
                                            <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
                                            <div className="absolute left-0 bottom-full mb-2 w-72 p-3 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl">
                                                <div className="font-semibold mb-1.5">EMI Formula:</div>
                                                <div className="text-[10px] font-mono leading-relaxed">
                                                    EMI = [P Ã— r Ã— (1+r)^n] / [(1+r)^n - 1]<br />
                                                    Where:<br />
                                                    P = Principal (Loan Amount)<br />
                                                    r = Monthly Interest Rate<br />
                                                    (Annual Rate Ã· 12)<br />
                                                    n = Loan Tenure in months
                                                    <div className="mt-2 pt-2 border-t border-slate-700 text-slate-300">
                                                        Higher rate = Higher EMI
                                                    </div>
                                                </div>
                                                <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                        <Percent className="w-3.5 h-3.5 text-slate-500" />
                                        <span className="text-sm font-bold text-slate-900">{emiRate}%</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[emiRate]}
                                    onValueChange={(value) => setEmiRate(value[0])}
                                    min={5}
                                    max={20}
                                    step={0.1}
                                    className="py-2"
                                />
                                {/* Quick adjustment buttons */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {[7.5, 8.5, 9.5, 11, 12].map((rate) => (
                                        <button
                                            key={rate}
                                            onClick={() => setEmiRate(rate)}
                                            className={`text-xs px-2 py-0.5 rounded-md font-medium transition-all ${
                                                Math.abs(emiRate - rate) < 0.2
                                                    ? 'bg-accent-600 text-white'
                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                            }`}
                                        >
                                            {rate}%
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Loan Tenure */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm text-slate-700 font-semibold">Loan Tenure</Label>
                                    <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                        <span className="text-sm font-bold text-slate-900">{emiTenure} Y</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[emiTenure]}
                                    onValueChange={(value) => setEmiTenure(value[0])}
                                    min={1}
                                    max={30}
                                    step={1}
                                    className="py-2"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Results Card */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl bg-gradient-to-br from-accent-50 to-orange-50 relative overflow-hidden">
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="text-center p-6 md:p-8 sm:p-6 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-accent-100 mb-4">
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Monthly EMI</p>
                            <p className="text-3xl sm:text-4xl font-extrabold text-accent-600">{formatCurrency(emiResult.emi)}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-3 sm:p-5 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-accent-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">Principal</p>
                                <p className="text-base sm:text-lg font-extrabold text-slate-900">{formatCurrency(emiLoan)}</p>
                            </div>
                            <div className="text-center p-3 sm:p-5 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-accent-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">Interest</p>
                                <p className="text-base sm:text-lg font-extrabold text-accent-600">{formatCurrency(emiResult.totalInterest)}</p>
                            </div>
                            <div className="text-center p-3 sm:p-5 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-accent-100">
                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 sm:mb-2">Total Pay</p>
                                <p className="text-base sm:text-lg font-extrabold text-slate-700">{formatCurrency(emiResult.totalPayment)}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-[200px] h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={emiChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={45}
                                            outerRadius={65}
                                            dataKey="value"
                                            strokeWidth={0}
                                            paddingAngle={5}
                                        >
                                            {emiChartData.map((entry, index) => (
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

            {/* Bottom Row: Amortization Chart & Year-by-Year Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Amortization Schedule Chart */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Amortization Schedule (First Year)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={emiResult.schedule}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#cbd5e1" />
                                    <YAxis
                                        tick={{ fontSize: 10 }}
                                        stroke="#cbd5e1"
                                        tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value}
                                    />
                                    <Tooltip
                                        formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="principal" stackId="a" fill="#3b82f6" name="Principal" />
                                    <Bar dataKey="interest" stackId="a" fill="#2563eb" name="Interest" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Year-by-Year Breakdown */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Year-by-Year Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-accent-50 rounded-xl border border-accent-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Monthly EMI</p>
                                    <p className="text-lg font-bold text-accent-600">{formatCurrency(emiResult.emi)}</p>
                                </div>
                                <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Interest Rate</p>
                                    <p className="text-lg font-bold text-primary-600">{emiRate}%</p>
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
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Principal</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Interest</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Remaining</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {yearlyData.slice(0, 10).map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-slate-900">Year {row.year}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary-600">{formatCurrency(row.principal)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-accent-600">{formatCurrency(row.interest)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-slate-600">{formatCurrency(row.remaining)}</td>
                                                    </tr>
                                                ))}
                                                {yearlyData.length > 10 && (
                                                    <tr className="bg-slate-50">
                                                        <td colSpan={4} className="px-3 py-2 text-xs text-center text-slate-500 font-medium">
                                                            ... and {yearlyData.length - 10} more years
                                                        </td>
                                                    </tr>
                                                )}
                                                {yearlyData.length > 0 && (
                                                    <tr className="bg-accent-50 border-t-2 border-accent-200">
                                                        <td className="px-3 py-3 text-sm font-bold text-slate-900">Total</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-primary-600">{formatCurrency(emiLoan)}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-accent-600">{formatCurrency(emiResult.totalInterest)}</td>
                                                        <td className="px-3 py-3 text-sm text-right font-bold text-slate-900">-</td>
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
                                        <p className="text-sm font-semibold text-slate-900 mb-1">Payment Structure</p>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Early EMIs have higher interest component. As you pay down principal, interest portion decreases and principal portion increases over time.
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

