"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, AlertTriangle, CheckCircle2, TrendingUp, Info, ChevronDown, ChevronUp, FileText, Lock, Trophy, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { toast } from "sonner";

export function FinancialHealthCalculator() {
    const [monthlyIncome, setMonthlyIncome] = useState(100000);
    const [monthlyExpenses, setMonthlyExpenses] = useState(60000);
    const [totalSavings, setTotalSavings] = useState(500000);
    const [totalDebt, setTotalDebt] = useState(200000);
    const [monthlyDebtPayments, setMonthlyDebtPayments] = useState(15000);
    const [hasHealthInsurance, setHasHealthInsurance] = useState(true);
    const [hasTermInsurance, setHasTermInsurance] = useState(false);
    const [investmentCorp, setInvestmentCorp] = useState(300000);
    const [inputsExpanded, setInputsExpanded] = useState(false);
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

    const emailFloat = (num: number) => parseFloat(num.toFixed(1));

    const calculateHealth = () => {
        let score = 0;
        let deductions = 0;
        const insights: { type: string; text: string }[] = [];

        // 1. Savings Rate (20 points)
        const monthlySavings = monthlyIncome - monthlyExpenses - monthlyDebtPayments;
        const savingsRate = (monthlySavings / monthlyIncome) * 100;

        if (savingsRate >= 30) score += 20;
        else if (savingsRate >= 20) score += 15;
        else if (savingsRate >= 10) score += 10;
        else if (savingsRate > 0) score += 5;
        else insights.push({ type: 'danger', text: "You are spending more than you earn." });

        if (savingsRate < 20) insights.push({ type: 'warning', text: "Try to increase your savings rate to at least 20%." });

        // 2. Emergency Fund (20 points)
        const emergencyMonths = totalSavings / monthlyExpenses;

        if (emergencyMonths >= 6) score += 20;
        else if (emergencyMonths >= 3) score += 10;
        else if (emergencyMonths >= 1) score += 5;
        else insights.push({ type: 'critical', text: "Your emergency fund is critically low." });

        if (emergencyMonths < 6) insights.push({ type: 'info', text: `Build emergency fund to cover 6 months expenses (₹${(monthlyExpenses * 6).toLocaleString()}).` });

        // 3. Debt-to-Income Ratio (20 points)
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
        const annualIncome = monthlyIncome * 12;
        const totalAssets = totalSavings + investmentCorp;
        const netWorth = totalAssets - totalDebt;
        const netWorthRatio = netWorth / annualIncome;

        if (netWorthRatio >= 3) score += 20;
        else if (netWorthRatio >= 1) score += 15;
        else if (netWorthRatio >= 0.5) score += 10;
        else if (netWorthRatio > 0) score += 5;

        const finalScore = Math.min(Math.max(score - deductions, 0), 100);

        let status = "Needs Attention";
        let grade = "D";
        let color = "text-destructive";
        if (finalScore >= 80) { status = "Excellent"; grade = "A+"; color = "text-primary"; }
        else if (finalScore >= 60) { status = "Good"; grade = "A"; color = "text-primary"; }
        else if (finalScore >= 40) { status = "Fair"; grade = "B"; color = "text-indian-gold"; }

        return {
            score: finalScore,
            status,
            grade,
            color,
            metrics: {
                savingsRate: Math.round(savingsRate),
                savingsScore: savingsRate >= 30 ? 20 : savingsRate >= 20 ? 15 : savingsRate >= 10 ? 10 : savingsRate > 0 ? 5 : 0,
                emergencyMonths: emailFloat(emergencyMonths),
                emergencyScore: emergencyMonths >= 6 ? 20 : emergencyMonths >= 3 ? 10 : emergencyMonths >= 1 ? 5 : 0,
                dti: Math.round(dti),
                dtiScore: dti === 0 ? 20 : dti < 30 ? 15 : dti < 50 ? 5 : 0,
                insuranceScore: (hasHealthInsurance ? 10 : 0) + (hasTermInsurance ? 10 : 0),
                netWorthRatio: emailFloat(netWorthRatio),
                netWorthScore: netWorthRatio >= 3 ? 20 : netWorthRatio >= 1 ? 15 : netWorthRatio >= 0.5 ? 10 : netWorthRatio > 0 ? 5 : 0,
            },
            insights
        };
    };

    const result = calculateHealth();

    const scoreBreakdownData = [
        { component: "Savings Rate", score: result.metrics.savingsScore, ideal: 20 },
        { component: "Emergency Fund", score: result.metrics.emergencyScore, ideal: 20 },
        { component: "Debt Ratio", score: result.metrics.dtiScore, ideal: 20 },
        { component: "Insurance", score: result.metrics.insuranceScore, ideal: 20 },
        { component: "Net Worth", score: result.metrics.netWorthScore, ideal: 20 },
    ];

    const getScoreColor = (score: number) => {
        if (score >= 80) return "#166534";
        if (score >= 60) return "#16a34a";
        if (score >= 40) return "#d97706";
        return "#dc2626";
    };

    const presets = [
        { label: "₹30K income", income: 30000 },
        { label: "₹60K income", income: 60000 },
        { label: "₹1L income", income: 100000 },
        { label: "₹2L income", income: 200000 },
    ];

    const applyPreset = (p: { label: string; income: number }) => {
        setMonthlyIncome(p.income);
        setMonthlyExpenses(Math.round(p.income * 0.6));
        setMonthlyDebtPayments(Math.round(p.income * 0.15));
    };

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Section 1: Mobile Collapsible */}
            <div className="lg:hidden">
                <Card className="border-border shadow-sm rounded-sm">
                    <CardHeader className="cursor-pointer" onClick={() => setInputsExpanded(!inputsExpanded)}>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-lg mb-1">Financial Health Check</CardTitle>
                                <CardDescription className="text-xs">Tap to adjust inputs</CardDescription>
                            </div>
                            {inputsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                    </CardHeader>
                    {inputsExpanded && (
                        <CardContent className="space-y-4 pt-0">
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Income</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(monthlyIncome)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Score</p>
                                    <p className="text-sm font-bold" style={{ color: getScoreColor(result.score) }}>{result.score}/100</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Grade</p>
                                    <p className="text-sm font-bold" style={{ color: getScoreColor(result.score) }}>{result.grade}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Monthly Income (In Hand)</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                        <Input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} className="border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                                    </div>
                                    <Slider value={[monthlyIncome]} onValueChange={(v) => setMonthlyIncome(v[0])} min={10000} max={500000} step={1000} className="py-2" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Monthly Expenses</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                        <Input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} className="border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                                    </div>
                                    <Slider value={[monthlyExpenses]} onValueChange={(v) => setMonthlyExpenses(v[0])} min={5000} max={monthlyIncome} step={1000} className="py-2" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Monthly EMI Payments</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                        <Input type="number" value={monthlyDebtPayments} onChange={(e) => setMonthlyDebtPayments(Number(e.target.value))} className="border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>

            {/* Section 2: Desktop 2-col */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="hidden lg:block border-border shadow-sm rounded-sm">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">Financial Health Check</CardTitle>
                                <CardDescription>Enter your details to get a comprehensive financial health score out of 100</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge variant="secondary" className="bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Free
                                </Badge>
                                <Badge variant="secondary" className="bg-secondary-50 text-secondary-700 border-secondary-200 hover:bg-secondary-100 text-[10px]">
                                    No Registration
                                </Badge>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                            <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Examples:</span>
                            {presets.map((p, i) => (
                                <button key={i} onClick={() => applyPreset(p)} className="text-xs px-2.5 py-1 bg-muted hover:bg-muted/80 text-foreground rounded-md font-medium transition-colors border border-border">
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Cash Flow */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">Cash Flow</h3>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">Monthly Income (In Hand)</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} className="border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 w-full" />
                                </div>
                                <Slider value={[monthlyIncome]} onValueChange={(v) => setMonthlyIncome(v[0])} min={10000} max={500000} step={1000} className="py-2" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">Monthly Expenses</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} className="border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 w-full" />
                                </div>
                                <Slider value={[monthlyExpenses]} onValueChange={(v) => setMonthlyExpenses(v[0])} min={5000} max={monthlyIncome} step={1000} className="py-2" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">Monthly Debt Payments (EMI)</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input type="number" value={monthlyDebtPayments} onChange={(e) => setMonthlyDebtPayments(Number(e.target.value))} className="border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 w-full" />
                                </div>
                            </div>
                        </div>

                        {/* Assets & Debt */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">Assets & Liabilities</h3>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">Total Liquid Savings (Cash/Bank)</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input type="number" value={totalSavings} onChange={(e) => setTotalSavings(Number(e.target.value))} className="border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 w-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">Total Investments</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input type="number" value={investmentCorp} onChange={(e) => setInvestmentCorp(Number(e.target.value))} className="border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 w-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">Total Outstanding Debt</Label>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                    <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                    <Input type="number" value={totalDebt} onChange={(e) => setTotalDebt(Number(e.target.value))} className="border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 w-full" />
                                </div>
                            </div>
                        </div>

                        {/* Protection */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">Protection</h3>
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-sm border border-border">
                                <Label className="text-sm font-medium text-foreground">Health Insurance</Label>
                                <Switch checked={hasHealthInsurance} onCheckedChange={setHasHealthInsurance} />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-sm border border-border">
                                <Label className="text-sm font-medium text-foreground">Term / Life Insurance</Label>
                                <Switch checked={hasTermInsurance} onCheckedChange={setHasTermInsurance} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card id="calculator-results" className="order-first lg:order-none border-border shadow-sm rounded-sm bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-sm shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Score</p>
                                <p className="text-base sm:text-lg font-extrabold" style={{ color: getScoreColor(result.score) }}>{result.score}/100</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-sm shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Grade</p>
                                <p className="text-base sm:text-lg font-extrabold" style={{ color: getScoreColor(result.score) }}>{result.grade}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-sm shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Status</p>
                                <p className="text-base sm:text-lg font-extrabold" style={{ color: getScoreColor(result.score) }}>{result.status}</p>
                            </div>
                        </div>

                        {/* Large Score Display */}
                        <div className="flex flex-col items-center justify-center py-6 bg-card rounded-sm border border-border mb-4">
                            <div className="text-6xl font-black mb-1" style={{ color: getScoreColor(result.score) }}>{result.score}</div>
                            <div className="text-sm text-muted-foreground font-medium">out of 100</div>
                            <div className="mt-3">
                                <Badge className="text-white px-4 py-1 text-sm font-bold" style={{ backgroundColor: getScoreColor(result.score) }}>
                                    {result.grade} — {result.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-card rounded-sm shadow-sm border border-border">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Savings Rate</p>
                                <p className="text-base font-extrabold text-foreground">{result.metrics.savingsRate}%</p>
                            </div>
                            <div className="text-center p-3 bg-card rounded-sm shadow-sm border border-border">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Emergency Fund</p>
                                <p className="text-base font-extrabold text-foreground">{result.metrics.emergencyMonths} Mo</p>
                            </div>
                            <div className="text-center p-3 bg-card rounded-sm shadow-sm border border-border">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Debt Fraction</p>
                                <p className="text-base font-extrabold text-foreground">{result.metrics.dti}%</p>
                            </div>
                            <div className="text-center p-3 bg-card rounded-sm shadow-sm border border-border">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Asset Ratio</p>
                                <p className="text-base font-extrabold text-foreground">{result.metrics.netWorthRatio}x</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Section 3: Bottom 2-col */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-border shadow-sm rounded-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Score Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={scoreBreakdownData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                                    <XAxis type="number" domain={[0, 20]} tick={{ fontSize: 10 }} stroke="hsl(var(--border))" tickFormatter={(v) => `${v}pt`} />
                                    <YAxis type="category" dataKey="component" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" width={100} />
                                    <Tooltip formatter={(value: number | string | undefined) => [`${value ?? 0}/20`]} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="ideal" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} name="Ideal" />
                                    <Bar dataKey="score" radius={[0, 4, 4, 0]} name="Your Score">
                                        {scoreBreakdownData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.score >= 16 ? "#166534" : entry.score >= 10 ? "#16a34a" : entry.score >= 5 ? "#d97706" : "#dc2626"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm rounded-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Score Breakdown Table</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-sm border border-border">
                                        <table className="w-full">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Component</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Score</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Ideal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {scoreBreakdownData.map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground">{row.component}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-bold" style={{ color: row.score >= 16 ? "#166534" : row.score >= 10 ? "#16a34a" : row.score >= 5 ? "#d97706" : "#dc2626" }}>
                                                            {row.score}/{row.ideal}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{row.ideal}</td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-primary/10 border-t-2 border-primary/20">
                                                    <td className="px-3 py-3 text-sm font-bold text-foreground">Total</td>
                                                    <td className="px-3 py-3 text-sm text-right font-bold text-primary">{result.score}/100</td>
                                                    <td className="px-3 py-3 text-sm text-right font-bold text-muted-foreground">100</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Action Plan */}
                            {result.insights.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                                        <TrendingUp className="w-3.5 h-3.5 text-primary" /> Action Plan
                                    </h4>
                                    {result.insights.map((insight, i) => (
                                        <div key={i} className={`flex gap-3 p-3 rounded-lg border text-sm ${
                                            insight.type === 'danger' ? 'bg-destructive/10 border-destructive/20 text-destructive' :
                                            insight.type === 'warning' ? 'bg-indian-gold/10 border-amber-100 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-200' :
                                            insight.type === 'critical' ? 'bg-destructive/15 border-destructive/30 text-destructive font-bold' :
                                            'bg-muted border-border text-muted-foreground'
                                        }`}>
                                            {insight.type === 'danger' || insight.type === 'critical' ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> : <Info className="w-4 h-4 shrink-0 mt-0.5" />}
                                            <p>{insight.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-emerald-950/30 dark:to-emerald-950/30 rounded-sm p-5 border border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy className="w-24 h-24 text-emerald-600" /></div>
                                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> What This Means
                                </h3>
                                <p className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-3">
                                    Your financial health score is <span className="font-bold text-2xl underline decoration-emerald-400 decoration-2 underline-offset-2">{result.score}/100</span> (Grade: {result.grade}).
                                    {result.score >= 80 ? " Excellent financial health! Keep maintaining these habits." :
                                     result.score >= 60 ? " Good financial health — a few tweaks can make it excellent." :
                                     result.score >= 40 ? " Fair financial health — focus on savings rate and emergency fund." :
                                     " Needs urgent attention — prioritize building an emergency fund and reducing debt."}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.score >= 80 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Excellent Health
                                        </Badge>
                                    )}
                                    {result.metrics.savingsRate >= 20 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> Strong Saver
                                        </Badge>
                                    )}
                                    {result.metrics.emergencyMonths >= 6 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Emergency Ready
                                        </Badge>
                                    )}
                                    {hasHealthInsurance && hasTermInsurance && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Well Protected
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="p-5 bg-card rounded-sm border border-border shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary-600" />Get Personalized Health Plan (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Receive a personalized financial health improvement plan with actionable steps to reach score 80+.
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
