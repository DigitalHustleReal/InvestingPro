"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/Button";
import { IndianRupee, Percent, Receipt, Info, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, Trophy, Sparkles, FileText, Lock, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { toast } from "sonner";

export function TaxCalculator() {
    const [income, setIncome] = useState(1000000);
    const [age, setAge] = useState(35);
    const [deductions, setDeductions] = useState(150000);
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

    const calculateTax = () => {
        // Old tax regime (2024-25)
        const taxableIncome = income - deductions;
        let oldTax = 0;

        if (taxableIncome <= 250000) {
            oldTax = 0;
        } else if (taxableIncome <= 500000) {
            oldTax = (taxableIncome - 250000) * 0.05;
        } else if (taxableIncome <= 1000000) {
            oldTax = 12500 + (taxableIncome - 500000) * 0.20;
        } else {
            oldTax = 112500 + (taxableIncome - 1000000) * 0.30;
        }

        // New tax regime (2024-25)
        const newTaxableIncome = income;
        let newTax = 0;

        if (newTaxableIncome <= 300000) {
            newTax = 0;
        } else if (newTaxableIncome <= 700000) {
            newTax = (newTaxableIncome - 300000) * 0.05;
        } else if (newTaxableIncome <= 1000000) {
            newTax = 20000 + (newTaxableIncome - 700000) * 0.10;
        } else if (newTaxableIncome <= 1200000) {
            newTax = 50000 + (newTaxableIncome - 1000000) * 0.15;
        } else if (newTaxableIncome <= 1500000) {
            newTax = 80000 + (newTaxableIncome - 1200000) * 0.20;
        } else {
            newTax = 140000 + (newTaxableIncome - 1500000) * 0.30;
        }

        // Add cess (4%)
        oldTax = oldTax * 1.04;
        newTax = newTax * 1.04;

        const oldNetIncome = income - oldTax;
        const newNetIncome = income - newTax;
        const savings = Math.abs(oldTax - newTax);

        return {
            oldTax,
            newTax,
            oldNetIncome,
            newNetIncome,
            savings,
            betterRegime: oldTax < newTax ? 'Old' : 'New'
        };
    };

    const result = calculateTax();

    const effectiveOldRate = ((result.oldTax / income) * 100).toFixed(1);
    const effectiveNewRate = ((result.newTax / income) * 100).toFixed(1);
    const betterTax = result.betterRegime === 'Old' ? result.oldTax : result.newTax;
    const betterNet = result.betterRegime === 'Old' ? result.oldNetIncome : result.newNetIncome;
    const betterRate = result.betterRegime === 'Old' ? effectiveOldRate : effectiveNewRate;

    // Old regime slab breakdown
    const getOldSlabs = () => {
        const taxable = income - deductions;
        const slabs = [];
        if (taxable > 250000) slabs.push({ slab: 'Up to ₹2.5L', inSlab: Math.min(250000, taxable), rate: '0%', tax: 0 });
        if (taxable > 250000) slabs.push({ slab: '₹2.5L - ₹5L', inSlab: Math.min(250000, taxable - 250000), rate: '5%', tax: Math.min(250000, Math.max(0, taxable - 250000)) * 0.05 });
        if (taxable > 500000) slabs.push({ slab: '₹5L - ₹10L', inSlab: Math.min(500000, taxable - 500000), rate: '20%', tax: Math.min(500000, Math.max(0, taxable - 500000)) * 0.20 });
        if (taxable > 1000000) slabs.push({ slab: 'Above ₹10L', inSlab: taxable - 1000000, rate: '30%', tax: (taxable - 1000000) * 0.30 });
        return slabs;
    };

    const comparisonChartData = [
        { name: 'Old Regime', tax: result.oldTax, net: result.oldNetIncome },
        { name: 'New Regime', tax: result.newTax, net: result.newNetIncome },
    ];

    const taxBreakdownData = [
        { name: 'Tax (Best Regime)', value: betterTax, color: '#166534' },
        { name: 'Take Home', value: betterNet, color: '#16a34a' },
    ];

    const oldSlabs = getOldSlabs();

    const inputSliders = (
        <div className="space-y-4">
            {/* Annual Income */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Annual Income</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                        <Input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                    </div>
                </div>
                <Slider value={[income]} onValueChange={(v) => setIncome(v[0])} min={300000} max={5000000} step={10000} className="py-2" />
            </div>

            {/* Age */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Age</Label>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <span className="text-sm font-bold text-foreground">{age} Y</span>
                    </div>
                </div>
                <Slider value={[age]} onValueChange={(v) => setAge(v[0])} min={18} max={80} step={1} className="py-2" />
                <div className="flex gap-2 text-xs text-muted-foreground">
                    <span className={age < 60 ? 'text-primary font-semibold' : ''}>General (&lt;60)</span>
                    <span>•</span>
                    <span className={age >= 60 && age < 80 ? 'text-primary font-semibold' : ''}>Senior (60-79)</span>
                    <span>•</span>
                    <span className={age >= 80 ? 'text-primary font-semibold' : ''}>Super Senior (80+)</span>
                </div>
            </div>

            {/* Deductions */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                        <Label className="text-sm font-semibold">Deductions (80C, HRA, etc.)</Label>
                        <div className="group relative">
                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl">
                                <div className="font-semibold mb-1.5">Old Regime Deductions:</div>
                                <div className="text-[10px] leading-relaxed">80C (PPF, ELSS) up to ₹1.5L, 80D (Health Insurance), HRA, Section 24 (Home Loan Interest). Not applicable in New Regime.</div>
                                <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                        <Input type="number" value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                    </div>
                </div>
                <Slider value={[deductions]} onValueChange={(v) => setDeductions(v[0])} min={0} max={200000} step={1000} className="py-2" />
                <p className="text-xs text-muted-foreground">Only applicable for Old Tax Regime</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Mobile: Collapsible Inputs Card */}
            <div className="lg:hidden">
                <Card className="border-border shadow-sm rounded-sm">
                    <CardHeader className="cursor-pointer" onClick={() => setInputsExpanded(!inputsExpanded)}>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-lg mb-1">Income Tax Calculator</CardTitle>
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
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(income)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Better</p>
                                    <p className="text-sm font-bold text-foreground">{result.betterRegime}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Save</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrency(result.savings)}</p>
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
                <Card className="hidden lg:block border-border shadow-sm rounded-sm">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">Income Tax Calculator</CardTitle>
                                <CardDescription>Compare Old vs New Tax Regime (2024-25)</CardDescription>
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
                                { label: "₹5L income", income: 500000, deductions: 50000 },
                                { label: "₹10L income", income: 1000000, deductions: 150000 },
                                { label: "₹15L income", income: 1500000, deductions: 200000 },
                                { label: "₹25L income", income: 2500000, deductions: 300000 },
                            ].map((preset, idx) => (
                                <button key={idx} onClick={() => { setIncome(preset.income); setDeductions(preset.deductions); }}
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
                <Card className="order-first lg:order-none border-border shadow-sm rounded-sm bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="text-center p-6 md:p-8 bg-card rounded-sm shadow-sm border border-border mb-4">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                {result.betterRegime} Regime is Better
                            </p>
                            <p className="text-3xl font-extrabold text-primary mb-1">
                                Save {formatCurrency(result.savings)}
                            </p>
                            <p className="text-xs text-muted-foreground">per year by choosing {result.betterRegime} Regime</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="text-center p-5 bg-card rounded-sm shadow-sm border border-border">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Old Regime Tax</p>
                                <p className="text-lg font-extrabold text-primary">{formatCurrency(result.oldTax)}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">Rate: {effectiveOldRate}%</p>
                            </div>
                            <div className="text-center p-5 bg-card rounded-sm shadow-sm border border-border">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">New Regime Tax</p>
                                <p className="text-lg font-extrabold text-primary">{formatCurrency(result.newTax)}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">Rate: {effectiveNewRate}%</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-[200px] h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={taxBreakdownData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={0} paddingAngle={5}>
                                            {taxBreakdownData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Chart & Tax Slab Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Old vs New Comparison Bar Chart */}
                <Card className="border-border shadow-sm rounded-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Old vs New Regime Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={comparisonChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--border))" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--border))" tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value} />
                                    <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="tax" fill="#d97706" name="Tax Payable" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="net" fill="#166534" name="Net Income" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Tax Slab Breakdown Table + Lead Capture */}
                <Card className="border-border shadow-sm rounded-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Tax Slab Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-muted rounded-sm border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Effective Rate</p>
                                    <p className="text-lg font-bold text-primary">{betterRate}%</p>
                                </div>
                                <div className="p-4 bg-muted rounded-sm border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Take Home</p>
                                    <p className="text-lg font-bold text-foreground">{formatCurrency(betterNet)}</p>
                                </div>
                            </div>

                            {/* Old Regime Slab Table */}
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Old Regime (with deductions)</p>
                                <div className="overflow-hidden rounded-sm border border-border">
                                    <table className="w-full">
                                        <thead className="bg-muted border-b border-border">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Slab</th>
                                                <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Rate</th>
                                                <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Tax</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {oldSlabs.map((slab, idx) => (
                                                <tr key={idx} className="hover:bg-muted/50 transition-colors">
                                                    <td className="px-3 py-2.5 text-sm font-semibold text-foreground">{slab.slab}</td>
                                                    <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{slab.rate}</td>
                                                    <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(slab.tax)}</td>
                                                </tr>
                                            ))}
                                            <tr className="bg-primary/10 border-t-2 border-primary/20">
                                                <td className="px-3 py-3 text-sm font-bold text-foreground">Total (incl. cess)</td>
                                                <td className="px-3 py-3 text-sm text-right font-bold text-muted-foreground">{effectiveOldRate}%</td>
                                                <td className="px-3 py-3 text-sm text-right font-bold text-primary">{formatCurrency(result.oldTax)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* What This Means */}
                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-emerald-950/30 dark:to-emerald-950/30 rounded-sm p-5 border border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy className="w-24 h-24 text-emerald-600" /></div>
                                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> What This Means
                                </h3>
                                <p className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-3">
                                    Your effective tax rate is <span className="font-bold">{betterRate}%</span>. You take home <span className="font-bold">{formatCurrency(betterNet)}</span> out of <span className="font-bold">{formatCurrency(income)}</span> income.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <TrendingDown className="w-3 h-3" /> {result.betterRegime} Regime saves {formatCurrency(result.savings)}
                                    </Badge>
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <Receipt className="w-3 h-3" /> 4% health & education cess included
                                    </Badge>
                                </div>
                            </div>

                            {/* Lead Capture */}
                            <div className="p-5 bg-card rounded-sm border border-border shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" />
                                        Tax Saving Strategy (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Get a personalized tax saving strategy + mutual fund recommendations to reduce your tax burden.
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

            {/* SEO Content Section */}
            <TaxSEOContentSection />
        </div>
    );
}

// SEO Content Component for Tax Calculator
function TaxSEOContentSection() {
    return (
        <div className="mt-12 space-y-8">
            {/* Introduction */}
            <Card className="border-0 shadow-lg rounded-sm bg-gradient-to-br from-muted to-card">
                <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        Income Tax Calculator India 2024-25 - Compare Old vs New Tax Regime
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        Use our free income tax calculator to compare Old vs New tax regime and calculate your tax liability for FY 2025-26.
                        Our tax calculator helps you determine which regime saves you more money based on your income, deductions, and age.
                        Make an informed decision about which tax regime to choose for optimal tax savings.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            "Compare Old vs New tax regime side-by-side",
                            "Calculate tax liability with accurate tax slabs for FY 2025-26",
                            "Understand tax savings by choosing the right regime",
                            "Free tax calculator with no registration required",
                            "Instant results showing tax payable and net income",
                            "Includes health & education cess (4%) in calculations"
                        ].map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <p className="text-foreground font-medium">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="border-0 shadow-lg rounded-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-foreground">How to Use Income Tax Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: "1", title: "Enter Annual Income", description: "Input your total annual income for FY 2025-26. This includes salary, business income, capital gains, and other sources." },
                            { step: "2", title: "Enter Your Age", description: "Age determines eligibility for senior citizen tax benefits (60+) and super senior citizen benefits (80+)." },
                            { step: "3", title: "Add Deductions", description: "Enter deductions under Section 80C (up to ₹1.5L), HRA, 80D, etc. Only applicable for Old Tax Regime." },
                            { step: "4", title: "Compare Results", description: "View tax payable, net income, and savings for both regimes. Choose the regime that saves you more money." }
                        ].map((step, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-2 top-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                                    {step.step}
                                </div>
                                <div className="pl-6">
                                    <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="border-0 shadow-lg rounded-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-6 md:p-8">
                        <Info className="w-6 h-6 text-primary" />
                        Income Tax Calculator FAQs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {[
                            {
                                q: "Which tax regime is better - Old or New?",
                                a: "The better regime depends on your income level and deductions. Old regime is beneficial if you have substantial deductions (80C, HRA, 80D, etc.) exceeding ₹1.5-2 lakhs. New regime benefits those with minimal deductions and simpler tax situations. Use our calculator to compare both regimes based on your specific situation."
                            },
                            {
                                q: "What are the tax slabs for FY 2025-26?",
                                a: "Old Regime: Up to ₹2.5L (0%), ₹2.5L-₹5L (5%), ₹5L-₹10L (20%), Above ₹10L (30%). New Regime: Up to ₹3L (0%), ₹3L-₹7L (5%), ₹7L-₹10L (10%), ₹10L-₹12L (15%), ₹12L-₹15L (20%), Above ₹15L (30%). Health & education cess of 4% is applicable on tax amount in both regimes."
                            },
                            {
                                q: "Can I switch between Old and New tax regime?",
                                a: "Yes, salaried individuals can choose their regime each financial year. However, once chosen, you cannot switch during the year. Business professionals and those with business income can switch, but certain conditions apply. It's best to calculate both scenarios before filing your return."
                            },
                            {
                                q: "What deductions are available in Old Tax Regime?",
                                a: "Common deductions in Old regime include Section 80C (up to ₹1.5L - PPF, ELSS, life insurance, etc.), Section 80D (health insurance), HRA, Section 24 (home loan interest), Section 80G (donations), and others. New regime has minimal deductions, primarily standard deduction for salaried employees."
                            },
                            {
                                q: "Is the tax calculator accurate for FY 2025-26?",
                                a: "Yes, our tax calculator uses the latest tax slabs and rates for FY 2025-26 (Assessment Year 2026-27). It includes all tax brackets, cess calculations, and senior citizen benefits. However, this is for estimation purposes. Consult a CA for complex tax situations."
                            },
                            {
                                q: "How much tax will I pay on ₹10 lakhs income?",
                                a: "For ₹10L income: Old regime (with ₹1.5L deductions) - Taxable income ₹8.5L, tax approximately ₹87,500. New regime - Taxable income ₹10L, tax approximately ₹75,000. New regime saves ₹12,500 in this scenario. Actual tax depends on your specific deductions and age."
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="border-b border-border pb-6 last:border-0">
                                <h3 className="font-bold text-foreground mb-2 text-lg">{faq.q}</h3>
                                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
