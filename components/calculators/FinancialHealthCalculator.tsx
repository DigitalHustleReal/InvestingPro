"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { IndianRupee, AlertTriangle, CheckCircle2, TrendingUp, Info } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function FinancialHealthCalculator() {
    const [monthlyIncome, setMonthlyIncome] = useState(100000);
    const [monthlyExpenses, setMonthlyExpenses] = useState(60000);
    const [totalSavings, setTotalSavings] = useState(500000);
    const [totalDebt, setTotalDebt] = useState(200000); // Total outstanding debt
    const [monthlyDebtPayments, setMonthlyDebtPayments] = useState(15000); // EMI etc
    const [hasHealthInsurance, setHasHealthInsurance] = useState(true);
    const [hasTermInsurance, setHasTermInsurance] = useState(false);
    const [investmentCorp, setInvestmentCorp] = useState(300000); // Total investments

    const calculateHealth = () => {
        let score = 0;
        let deductions = 0;
        const insights = [];

        // 1. Savings Rate (20 points)
        // Ideal: > 20% of income
        const monthlySavings = monthlyIncome - monthlyExpenses - monthlyDebtPayments;
        const savingsRate = (monthlySavings / monthlyIncome) * 100;
        
        if (savingsRate >= 30) score += 20;
        else if (savingsRate >= 20) score += 15;
        else if (savingsRate >= 10) score += 10;
        else if (savingsRate > 0) score += 5;
        else {
            insights.push({ type: 'danger', text: "You are spending more than you earn." });
        }

        if (savingsRate < 20) {
            insights.push({ type: 'warning', text: "Try to increase your savings rate to at least 20%." });
        }

        // 2. Emergency Fund (20 points)
        // Ideal: 6 months of expenses
        const emergencyMonths = totalSavings / monthlyExpenses;
        
        if (emergencyMonths >= 6) score += 20;
        else if (emergencyMonths >= 3) score += 10;
        else if (emergencyMonths >= 1) score += 5;
        else {
            insights.push({ type: 'critical', text: "Your emergency fund is critically low." });
        }

        if (emergencyMonths < 6) {
             insights.push({ type: 'info', text: `Build emergency fund to cover 6 months expenses (₹${(monthlyExpenses * 6).toLocaleString()}).` });
        }

        // 3. Debt-to-Income Ratio (20 points) - using monthly payments
        // Ideal: < 30% of income
        const dti = (monthlyDebtPayments / monthlyIncome) * 100;
        
        if (dti === 0) score += 20;
        else if (dti < 30) score += 15;
        else if (dti < 50) score += 5;
        else {
            deductions += 10;
            insights.push({ type: 'danger', text: "Your debt payments are consuming too much of your income." });
        }

        // 4. Insurance (20 points)
        if (hasHealthInsurance) score += 10;
        else insights.push({ type: 'warning', text: "Get health insurance to protect your savings." });

        if (hasTermInsurance) score += 10;
        else insights.push({ type: 'info', text: "Consider term insurance if you have dependents." });

        // 5. Net Worth / Investments (20 points)
        // Adjusted: Net worth = Assets - Liabilities
        const annualIncome = monthlyIncome * 12;
        const totalAssets = totalSavings + investmentCorp;
        const netWorth = totalAssets - totalDebt;
        const netWorthRatio = netWorth / annualIncome; // Years of income saved

        if (netWorthRatio >= 3) score += 20;
        else if (netWorthRatio >= 1) score += 15;
        else if (netWorthRatio >= 0.5) score += 10;
        else if (netWorthRatio > 0) score += 5;

        // Final Adjustment
        const finalScore = Math.min(Math.max(score - deductions, 0), 100);

        let status = "Needs Attention";
        let color = "text-danger-500";
        if (finalScore >= 80) { status = "Excellent"; color = "text-success-600"; }
        else if (finalScore >= 60) { status = "Good"; color = "text-primary-600"; }
        else if (finalScore >= 40) { status = "Fair"; color = "text-yellow-600"; }

        return {
            score: finalScore,
            status,
            color,
            metrics: {
                savingsRate: Math.round(savingsRate),
                emergencyMonths: emailFloat(emergencyMonths),
                dti: Math.round(dti),
                netWorthRatio: emailFloat(netWorthRatio)
            },
            insights
        };
    };

    const result = calculateHealth();

    const emailFloat = (num: number) => parseFloat(num.toFixed(1));

    const getScoreColor = (score: number) => {
        if (score >= 80) return "#059669"; // Emerald 600
        if (score >= 60) return "#0d9488"; // Teal 600
        if (score >= 40) return "#d97706"; // Amber 600
        return "#dc2626"; // Red 600
    };

    const chartData = [
        { name: 'Score', value: result.score, color: getScoreColor(result.score) },
        { name: 'Gap', value: 100 - result.score, color: '#e2e8f0' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Inputs */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl mb-1">Financial Health Check</CardTitle>
                        <CardDescription>Enter your details to get a comprehensive health score</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Income & Expense */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Cash Flow</h3>
                            
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Monthly Income (In Hand)</Label>
                                <div className="flex items-center gap-2">
                                    <div className="relative w-full">
                                        <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                        <Input type="number" className="pl-9" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} />
                                    </div>
                                </div>
                                <Slider value={[monthlyIncome]} onValueChange={(v) => setMonthlyIncome(v[0])} min={10000} max={500000} step={1000} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Monthly Expenses</Label>
                                <div className="relative w-full">
                                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                    <Input type="number" className="pl-9" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} />
                                </div>
                                <Slider value={[monthlyExpenses]} onValueChange={(v) => setMonthlyExpenses(v[0])} min={5000} max={monthlyIncome} step={1000} />
                            </div>
                             <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Monthly Debt Payments (EMI)</Label>
                                <div className="relative w-full">
                                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                    <Input type="number" className="pl-9" value={monthlyDebtPayments} onChange={(e) => setMonthlyDebtPayments(Number(e.target.value))} />
                                </div>
                            </div>
                        </div>

                        {/* Assets & Debt */}
                         <div className="space-y-4 pt-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Assets & Liabilities</h3>
                            
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Total Liquid Savings (Cash/Bank)</Label>
                                <div className="relative w-full">
                                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                    <Input type="number" className="pl-9" value={totalSavings} onChange={(e) => setTotalSavings(Number(e.target.value))} />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Total Investments</Label>
                                <div className="relative w-full">
                                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                    <Input type="number" className="pl-9" value={investmentCorp} onChange={(e) => setInvestmentCorp(Number(e.target.value))} />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Total Outstanding Debt</Label>
                                <div className="relative w-full">
                                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                    <Input type="number" className="pl-9" value={totalDebt} onChange={(e) => setTotalDebt(Number(e.target.value))} />
                                </div>
                            </div>
                        </div>

                        {/* Insurance */}
                         <div className="space-y-4 pt-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Protection</h3>
                            
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-slate-700">Health Insurance</Label>
                                <Switch checked={hasHealthInsurance} onCheckedChange={setHasHealthInsurance} />
                            </div>
                             <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-slate-700">Term/Life Insurance</Label>
                                <Switch checked={hasTermInsurance} onCheckedChange={setHasTermInsurance} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Score & Insights */}
                 <div className="space-y-6">
                    <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                             <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Your Score</CardTitle>
                                <Badge variant="outline" className={`${result.color} border-current bg-transparent`}>{result.status}</Badge>
                             </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                             <div className="flex items-center justify-center relative mb-8">
                                <div className="w-[180px] h-[180px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} startAngle={180} endAngle={0} paddingAngle={0} dataKey="value">
                                                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20%] text-center">
                                    <span className={`text-4xl font-black ${result.color}`}>{result.score}</span>
                                    <span className="text-sm text-slate-400 block font-medium">/ 100</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg text-center">
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Savings Rate</p>
                                    <p className="text-lg font-bold text-slate-800">{result.metrics.savingsRate}%</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg text-center">
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Emergency Fund</p>
                                    <p className="text-lg font-bold text-slate-800">{result.metrics.emergencyMonths} Mo</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg text-center">
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Debt Fraction</p>
                                    <p className="text-lg font-bold text-slate-800">{result.metrics.dti}%</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg text-center">
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Asset Ratio</p>
                                    <p className="text-lg font-bold text-slate-800">{result.metrics.netWorthRatio}x</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary-600" />
                                Action Plan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {result.insights.map((insight, i) => (
                                    <div key={i} className={`flex gap-3 p-3 rounded-lg border ${
                                        insight.type === 'danger' ? 'bg-danger-50 border-danger-100 text-red-800' :
                                        insight.type === 'warning' ? 'bg-accent-50 border-accent-100 text-accent-800' :
                                        insight.type === 'critical' ? 'bg-danger-100 border-red-200 text-red-900 font-bold' :
                                        'bg-blue-50 border-blue-100 text-blue-800'
                                    }`}>
                                        {insight.type === 'danger' || insight.type === 'critical' ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <Info className="w-5 h-5 shrink-0" />}
                                        <p className="text-sm">{insight.text}</p>
                                    </div>
                                ))}
                                {result.insights.length === 0 && (
                                    <div className="flex gap-3 p-3 rounded-lg bg-success-50 border-success-100 text-emerald-800">
                                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                                        <p className="text-sm">You are doing great! Keep maintaining your healthy financial habits.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </div>
    );
}
