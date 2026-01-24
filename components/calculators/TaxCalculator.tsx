"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { IndianRupee, Percent, Receipt, Info, CheckCircle2, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export function TaxCalculator() {
    const [income, setIncome] = useState(1000000);
    const [age, setAge] = useState(35);
    const [deductions, setDeductions] = useState(150000); // Standard 80C limit

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
        const newTaxableIncome = income; // No deductions in new regime
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

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    const comparisonChartData = [
        { name: 'Old Regime', tax: result.oldTax, net: result.oldNetIncome },
        { name: 'New Regime', tax: result.newTax, net: result.newNetIncome },
    ];

    const taxBreakdownData = [
        { name: 'Old Tax', value: result.oldTax, color: '#0ea5e9' }, // secondary-500
        { name: 'New Tax', value: result.newTax, color: '#10b981' }, // success-500
    ];

    return (
        <div className="space-y-6">
            {/* Top Row: Inputs on Left, Results on Right */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">Income Tax Calculator</CardTitle>
                                <CardDescription>Compare Old vs New Tax Regime (2024-25)</CardDescription>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Free
                                </Badge>
                                <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground border-secondary/20 hover:bg-secondary/20 text-[10px]">
                                    No Registration
                                </Badge>
                            </div>
                        </div>
                        {/* Preset Scenarios */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                            <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Examples:</span>
                            {[
                                { label: "₹10L Income", income: 1000000, deductions: 150000 },
                                { label: "₹15L Income", income: 1500000, deductions: 200000 },
                                { label: "₹25L Income", income: 2500000, deductions: 300000 },
                                { label: "High Income", income: 5000000, deductions: 400000 },
                            ].map((preset, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setIncome(preset.income);
                                        setDeductions(preset.deductions);
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
                            {/* Annual Income */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-semibold">Annual Income</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            value={income}
                                            onChange={(e) => setIncome(Number(e.target.value))}
                                            className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0"
                                        />
                                    </div>
                                </div>
                                <Slider
                                    value={[income]}
                                    onValueChange={(value) => setIncome(value[0])}
                                    min={300000}
                                    max={5000000}
                                    step={10000}
                                    className="py-2"
                                />
                            </div>

                            {/* Age */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-semibold">Age</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <span className="text-sm font-bold text-foreground">{age} Y</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[age]}
                                    onValueChange={(value) => setAge(value[0])}
                                    min={18}
                                    max={80}
                                    step={1}
                                    className="py-2"
                                />
                            </div>

                            {/* Deductions */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-semibold">Deductions (80C, etc.)</Label>
                                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            value={deductions}
                                            onChange={(e) => setDeductions(Number(e.target.value))}
                                            className="w-24 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0"
                                        />
                                    </div>
                                </div>
                                <Slider
                                    value={[deductions]}
                                    onValueChange={(value) => setDeductions(value[0])}
                                    min={0}
                                    max={200000}
                                    step={1000}
                                    className="py-2"
                                />
                                <p className="text-xs text-muted-foreground">Only applicable for Old Tax Regime</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Comparison Results Card */}
                <Card className="border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="text-center p-6 md:p-8 bg-card rounded-xl shadow-sm border border-border mb-4">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                {result.betterRegime} Regime is Better
                            </p>
                            <p className="text-3xl font-extrabold text-primary mb-1">
                                Save {formatCurrency(result.savings)}
                            </p>
                            <p className="text-xs text-muted-foreground">per year</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="text-center p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Old Tax</p>
                                <p className="text-lg font-extrabold text-primary">{formatCurrency(result.oldTax)}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">Net: {formatCurrency(result.oldNetIncome)}</p>
                            </div>
                            <div className="text-center p-5 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">New Tax</p>
                                <p className="text-lg font-extrabold text-primary">{formatCurrency(result.newTax)}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">Net: {formatCurrency(result.newNetIncome)}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-[200px] h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={taxBreakdownData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={45}
                                            outerRadius={65}
                                            dataKey="value"
                                            strokeWidth={0}
                                            paddingAngle={5}
                                        >
                                            {taxBreakdownData.map((entry, index) => (
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

            {/* Bottom Row: Comparison Chart & Tax Slabs */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Comparison Chart */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Tax Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={comparisonChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#cbd5e1" />
                                    <YAxis
                                        tick={{ fontSize: 10 }}
                                        stroke="#cbd5e1"
                                        tickFormatter={(value) => value >= 100000 ? `${(value / 100000).toFixed(0)}L` : value}
                                    />
                                    <Tooltip
                                        formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="tax" fill="#2563eb" name="Tax Payable" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="net" fill="#0d9488" name="Net Income" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Tax Slabs Info */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Tax Slabs (2024-25)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-6 md:p-8 bg-muted rounded-xl border border-border">
                                <p className="text-xs font-bold text-foreground mb-2">Old Tax Regime</p>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <p>Up to ₹2.5L: 0%</p>
                                    <p>₹2.5L - ₹5L: 5%</p>
                                    <p>₹5L - ₹10L: 20%</p>
                                    <p>Above ₹10L: 30%</p>
                                </div>
                            </div>

                            <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                                <p className="text-xs font-bold text-primary mb-2">New Tax Regime</p>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <p>Up to ₹3L: 0%</p>
                                    <p>₹3L - ₹7L: 5%</p>
                                    <p>₹7L - ₹10L: 10%</p>
                                    <p>₹10L - ₹12L: 15%</p>
                                    <p>₹12L - ₹15L: 20%</p>
                                    <p>Above ₹15L: 30%</p>
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-primary/5 to-primary-50/5 rounded-xl border border-border">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground mb-1">Tax Regime Selection</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Old regime benefits those with high deductions (80C, HRA, etc.). New regime is better for those with minimal deductions. Health & education cess (4%) is applicable on both.
                                        </p>
                                    </div>
                                </div>
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
            <Card className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-slate-50 dark:from-slate-900 to-white dark:to-slate-800">
                <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                        Income Tax Calculator India 2024-25 - Compare Old vs New Tax Regime
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        Use our free income tax calculator to compare Old vs New tax regime and calculate your tax liability for FY 2024-25. 
                        Our tax calculator helps you determine which regime saves you more money based on your income, deductions, and age. 
                        Make an informed decision about which tax regime to choose for optimal tax savings.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            "Compare Old vs New tax regime side-by-side",
                            "Calculate tax liability with accurate tax slabs for FY 2024-25",
                            "Understand tax savings by choosing the right regime",
                            "Free tax calculator with no registration required",
                            "Instant results showing tax payable and net income",
                            "Includes health & education cess (4%) in calculations"
                        ].map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                <p className="text-slate-700 dark:text-slate-300 font-medium">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="border-0 shadow-lg rounded-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">How to Use Income Tax Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                step: "1",
                                title: "Enter Annual Income",
                                description: "Input your total annual income for FY 2024-25. This includes salary, business income, capital gains, and other sources."
                            },
                            {
                                step: "2",
                                title: "Enter Your Age",
                                description: "Age determines eligibility for senior citizen tax benefits (60+) and super senior citizen benefits (80+)."
                            },
                            {
                                step: "3",
                                title: "Add Deductions",
                                description: "Enter deductions under Section 80C (up to ₹1.5L), HRA, 80D, etc. Only applicable for Old Tax Regime."
                            },
                            {
                                step: "4",
                                title: "Compare Results",
                                description: "View tax payable, net income, and savings for both regimes. Choose the regime that saves you more money."
                            }
                        ].map((step, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-2 top-0 w-8 h-8 rounded-full bg-secondary-600 text-white flex items-center justify-center font-semibold text-">
                                    {step.step}
                                </div>
                                <div className="pl-6">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="border-0 shadow-lg rounded-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-6 md:p-8">
                        <Info className="w-6 h-6 text-secondary-600" />
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
                                q: "What are the tax slabs for FY 2024-25?",
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
                                q: "Is the tax calculator accurate for FY 2024-25?",
                                a: "Yes, our tax calculator uses the latest tax slabs and rates for FY 2024-25 (Assessment Year 2025-26). It includes all tax brackets, cess calculations, and senior citizen benefits. However, this is for estimation purposes. Consult a CA for complex tax situations."
                            },
                            {
                                q: "How much tax will I pay on ₹10 lakhs income?",
                                a: "For ₹10L income: Old regime (with ₹1.5L deductions) - Taxable income ₹8.5L, tax approximately ₹87,500. New regime - Taxable income ₹10L, tax approximately ₹75,000. New regime saves ₹12,500 in this scenario. Actual tax depends on your specific deductions and age."
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-0">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 text-lg">{faq.q}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

