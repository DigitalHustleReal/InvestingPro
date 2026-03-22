'use client';

import React, { useState, useMemo } from 'react';
import { Shield, Users, Calculator, CheckCircle2, ChevronDown, ChevronUp, Trophy, Sparkles, FileText, Lock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

export default function InsuranceCoverageCalculator() {
    const [monthlyIncome, setMonthlyIncome] = useState(50000);
    const [dependents, setDependents] = useState(2);
    const [existingLoans, setExistingLoans] = useState(1000000);
    const [monthlyExpenses, setMonthlyExpenses] = useState(30000);
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(60);
    const [inputsExpanded, setInputsExpanded] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEmailSubmit = () => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => { setIsSubmitting(false); setEmail(''); toast.success('Report sent! Check your inbox.'); }, 1500);
    };

    const formatCurrency = (value: number) => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
        return `₹${value.toLocaleString('en-IN')}`;
    };

    // Calculate recommended coverage using HLV method
    const result = useMemo(() => {
        const yearsToRetire = Math.max(retirementAge - currentAge, 1);
        const annualIncome = monthlyIncome * 12;
        const annualExpenses = monthlyExpenses * 12;
        const annualSavings = Math.max(annualIncome - annualExpenses, 0);

        const futureValue = annualSavings * yearsToRetire;
        const dependentSupport = dependents * 500000;
        const recommendedCoverage = futureValue + existingLoans + dependentSupport;

        let premiumRate = 0.005;
        if (currentAge > 30 && currentAge <= 40) premiumRate = 0.008;
        else if (currentAge > 40 && currentAge <= 50) premiumRate = 0.012;
        else if (currentAge > 50) premiumRate = 0.018;

        const estimatedAnnualPremium = recommendedCoverage * premiumRate;

        return {
            recommendedCoverage: Math.round(recommendedCoverage),
            estimatedAnnualPremium: Math.round(estimatedAnnualPremium),
            futureValue: Math.round(futureValue),
            dependentSupport,
            coverageBreakdown: {
                futureIncome: futureValue,
                loans: existingLoans,
                dependents: dependentSupport
            }
        };
    }, [monthlyIncome, dependents, existingLoans, monthlyExpenses, currentAge, retirementAge]);

    const dailyCost = Math.round(result.estimatedAnnualPremium / 365);

    const pieData = [
        { name: 'Income Replacement', value: result.coverageBreakdown.futureIncome, color: '#166534' },
        { name: 'Loan Cover', value: result.coverageBreakdown.loans, color: '#16a34a' },
        { name: 'Dependent Support', value: result.coverageBreakdown.dependents, color: '#d97706' },
    ];

    const barData = [
        { name: 'Recommended Coverage', amount: result.recommendedCoverage },
        { name: 'Income Replacement', amount: result.coverageBreakdown.futureIncome },
        { name: 'Loan Cover', amount: result.coverageBreakdown.loans },
        { name: 'Dependent Fund', amount: result.coverageBreakdown.dependents },
    ];

    const inputSliders = (
        <div className="space-y-4">
            {/* Monthly Income */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Monthly Income</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <span className="text-sm text-muted-foreground font-bold">₹</span>
                        <Input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                    </div>
                </div>
                <Slider value={[monthlyIncome]} onValueChange={(v) => setMonthlyIncome(v[0])} min={10000} max={500000} step={5000} className="py-2" />
            </div>

            {/* Monthly Expenses */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Monthly Expenses</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <span className="text-sm text-muted-foreground font-bold">₹</span>
                        <Input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                    </div>
                </div>
                <Slider value={[monthlyExpenses]} onValueChange={(v) => setMonthlyExpenses(v[0])} min={5000} max={300000} step={2500} className="py-2" />
            </div>

            {/* Number of Dependents */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Number of Dependents</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-bold text-foreground">{dependents}</span>
                    </div>
                </div>
                <Slider value={[dependents]} onValueChange={(v) => setDependents(v[0])} min={0} max={10} step={1} className="py-2" />
            </div>

            {/* Existing Loans */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Outstanding Loans</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <span className="text-sm text-muted-foreground font-bold">₹</span>
                        <Input type="number" value={existingLoans} onChange={(e) => setExistingLoans(Number(e.target.value))} className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                    </div>
                </div>
                <Slider value={[existingLoans]} onValueChange={(v) => setExistingLoans(v[0])} min={0} max={10000000} step={100000} className="py-2" />
            </div>

            {/* Ages */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm font-semibold">Current Age</Label>
                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                            <span className="text-sm font-bold text-foreground">{currentAge}</span>
                        </div>
                    </div>
                    <Slider value={[currentAge]} onValueChange={(v) => setCurrentAge(v[0])} min={18} max={65} step={1} className="py-2" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm font-semibold">Retire at</Label>
                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                            <span className="text-sm font-bold text-foreground">{retirementAge}</span>
                        </div>
                    </div>
                    <Slider value={[retirementAge]} onValueChange={(v) => setRetirementAge(v[0])} min={50} max={70} step={1} className="py-2" />
                </div>
            </div>
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
                                <CardTitle className="text-lg mb-1">Insurance Coverage Calculator</CardTitle>
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
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(monthlyIncome * 12)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Dependents</p>
                                    <p className="text-sm font-bold text-foreground">{dependents}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Coverage</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(result.recommendedCoverage)}</p>
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
                                <CardTitle className="text-xl mb-1">Insurance Coverage Calculator</CardTitle>
                                <CardDescription>Calculate how much life insurance you need to protect your family</CardDescription>
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
                            {[
                                { label: "₹5L income 2 dep", income: 41667, deps: 2, loans: 500000, expenses: 25000 },
                                { label: "₹10L income 3 dep", income: 83333, deps: 3, loans: 1500000, expenses: 50000 },
                                { label: "₹20L income 4 dep", income: 166667, deps: 4, loans: 3000000, expenses: 100000 },
                                { label: "₹30L income 2 dep", income: 250000, deps: 2, loans: 5000000, expenses: 150000 },
                            ].map((preset, idx) => (
                                <button key={idx} onClick={() => { setMonthlyIncome(preset.income); setDependents(preset.deps); setExistingLoans(preset.loans); setMonthlyExpenses(preset.expenses); }}
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
                        <div className="text-center p-6 md:p-8 bg-card rounded-xl shadow-sm border border-border mb-4">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Shield className="w-5 h-5 text-primary" />
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Recommended Coverage</p>
                            </div>
                            <p className="text-3xl sm:text-4xl font-extrabold text-primary mb-1">{formatCurrency(result.recommendedCoverage)}</p>
                            <p className="text-xs text-muted-foreground">To protect your family's future</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-3 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Income Replacement</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.coverageBreakdown.futureIncome)}</p>
                            </div>
                            <div className="text-center p-3 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Loan Cover</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(result.coverageBreakdown.loans)}</p>
                            </div>
                            <div className="text-center p-3 sm:p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Dependent Fund</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(result.coverageBreakdown.dependents)}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-card rounded-xl border border-border mb-4">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Estimated Annual Premium</p>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-bold text-foreground">{formatCurrency(result.estimatedAnnualPremium)}</p>
                                <Badge variant="outline" className="text-xs border-border text-muted-foreground">≈ ₹{dailyCost}/day</Badge>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-[200px] h-[180px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={0} paddingAngle={5}>
                                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Chart & Coverage Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Coverage Analysis Bar Chart */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Coverage Components Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                                    <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value} />
                                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--border))" width={110} />
                                    <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="amount" fill="#166534" name="Amount" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Coverage Breakdown Table + Lead Capture */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Coverage Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-muted rounded-xl border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Annual Income</p>
                                    <p className="text-lg font-bold text-foreground">{formatCurrency(monthlyIncome * 12)}</p>
                                </div>
                                <div className="p-4 bg-muted rounded-xl border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Working Years</p>
                                    <p className="text-lg font-bold text-primary">{Math.max(retirementAge - currentAge, 0)} yrs</p>
                                </div>
                            </div>

                            {/* Coverage Breakdown Table */}
                            <div className="overflow-hidden rounded-xl border border-border">
                                <table className="w-full">
                                    <thead className="bg-muted border-b border-border">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Component</th>
                                            <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        <tr className="hover:bg-muted/50 transition-colors">
                                            <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Income Replacement</td>
                                            <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(result.coverageBreakdown.futureIncome)}</td>
                                        </tr>
                                        <tr className="hover:bg-muted/50 transition-colors">
                                            <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Outstanding Loans</td>
                                            <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(result.coverageBreakdown.loans)}</td>
                                        </tr>
                                        <tr className="hover:bg-muted/50 transition-colors">
                                            <td className="px-3 py-2.5 text-sm font-semibold text-foreground">Dependent Support ({dependents} × ₹5L)</td>
                                            <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(result.coverageBreakdown.dependents)}</td>
                                        </tr>
                                        <tr className="bg-primary/10 border-t-2 border-primary/20">
                                            <td className="px-3 py-3 text-sm font-bold text-foreground">Total Recommended</td>
                                            <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(result.recommendedCoverage)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* What This Means */}
                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-emerald-950/30 dark:to-emerald-950/30 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy className="w-24 h-24 text-emerald-600" /></div>
                                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> What This Means
                                </h3>
                                <p className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-3">
                                    You need <span className="font-bold">{formatCurrency(result.recommendedCoverage)}</span> life cover. At <span className="font-bold">{formatCurrency(result.estimatedAnnualPremium)}/year</span>, this costs just <span className="font-bold">₹{dailyCost}/day</span> for complete peace of mind.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> {dependents} dependents protected
                                    </Badge>
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> HLV method
                                    </Badge>
                                </div>
                            </div>

                            {/* Lead Capture */}
                            <div className="p-5 bg-card rounded-xl border border-border shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        Compare Term Plans (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Compare term insurance plans — get quotes in 2 minutes for {formatCurrency(result.recommendedCoverage)} coverage.
                                </p>
                                <div className="flex gap-2">
                                    <Input placeholder="Enter your email" className="h-9 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
                                    <Button size="sm" className="h-9 bg-primary-600 hover:bg-primary-700 text-white" onClick={handleEmailSubmit} disabled={isSubmitting}>
                                        {isSubmitting ? 'Sending...' : 'Send'}
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
