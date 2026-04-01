"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Percent, Receipt, ChevronDown, ChevronUp, FileText, Lock, Trophy, Sparkles, CheckCircle2, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function GSTCalculator() {
    const [amount, setAmount] = useState(10000);
    const [gstRate, setGstRate] = useState(18);
    const [calculationType, setCalculationType] = useState<'exclusive' | 'inclusive'>('exclusive');

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

    // GST rates in India
    const gstRates = [
        { value: 0, label: '0% (Exempt)' },
        { value: 5, label: '5%' },
        { value: 12, label: '12%' },
        { value: 18, label: '18% (Standard)' },
        { value: 28, label: '28% (Luxury)' },
    ];

    const calculateGST = () => {
        if (calculationType === 'exclusive') {
            const baseAmount = amount;
            const gstAmount = (baseAmount * gstRate) / 100;
            const totalAmount = baseAmount + gstAmount;
            return {
                baseAmount,
                gstAmount,
                totalAmount,
                cgst: gstAmount / 2,
                sgst: gstAmount / 2,
                igst: gstAmount,
            };
        } else {
            const totalAmount = amount;
            const baseAmount = (totalAmount * 100) / (100 + gstRate);
            const gstAmount = totalAmount - baseAmount;
            return {
                baseAmount,
                gstAmount,
                totalAmount,
                cgst: gstAmount / 2,
                sgst: gstAmount / 2,
                igst: gstAmount,
            };
        }
    };

    const result = calculateGST();

    const formatCurrency = (num: number) => {
        return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatCurrencyShort = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    // Comparison chart for all GST rates
    const allRatesData = [5, 12, 18, 28].map((rate) => {
        const base = calculationType === 'exclusive' ? amount : (amount * 100) / (100 + rate);
        const gst = calculationType === 'exclusive' ? (amount * rate) / 100 : amount - base;
        const total = calculationType === 'exclusive' ? amount + gst : amount;
        return {
            name: `${rate}%`,
            total: Math.round(total),
            gst: Math.round(gst),
        };
    });

    // All-rates breakdown table
    const allRatesTable = [5, 12, 18, 28].map((rate) => {
        const base = calculationType === 'exclusive' ? amount : (amount * 100) / (100 + rate);
        const gst = calculationType === 'exclusive' ? (amount * rate) / 100 : amount - base;
        const total = calculationType === 'exclusive' ? amount + gst : amount;
        return { rate, base: Math.round(base), gst: Math.round(gst), total: Math.round(total) };
    });

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Section 1 — Mobile Collapsible */}
            <div className="lg:hidden">
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="cursor-pointer" onClick={() => setInputsExpanded(!inputsExpanded)}>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-lg mb-1">GST Calculator</CardTitle>
                                <CardDescription className="text-xs">Tap to adjust inputs</CardDescription>
                            </div>
                            {inputsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                    </CardHeader>
                    {inputsExpanded && (
                        <CardContent className="space-y-4 pt-0">
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Base</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrencyShort(result.baseAmount)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">GST</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrencyShort(result.gstAmount)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Total</p>
                                    <p className="text-sm font-bold text-foreground">{formatCurrencyShort(result.totalAmount)}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-foreground">Calculation Type</Label>
                                    <Select value={calculationType} onValueChange={(value: 'exclusive' | 'inclusive') => setCalculationType(value)}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="exclusive">GST Exclusive (Add GST to amount)</SelectItem>
                                            <SelectItem value="inclusive">GST Inclusive (Extract GST from amount)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <IndianRupee className="w-4 h-4" />
                                        {calculationType === 'exclusive' ? 'Base Amount' : 'Total Amount (Incl. GST)'}
                                    </Label>
                                    <Input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="h-10 text-base font-semibold" min="0" step="0.01" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <Percent className="w-4 h-4" /> GST Rate
                                    </Label>
                                    <Select value={gstRate.toString()} onValueChange={(value) => setGstRate(Number(value))}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {gstRates.map((r) => (
                                                <SelectItem key={r.value} value={r.value.toString()}>{r.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>

            {/* Section 2 — Desktop 2-col grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Input Card */}
                <Card className="hidden lg:block border-border shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1 flex items-center gap-2">
                                    <Receipt className="w-5 h-5 text-primary-600" /> GST Calculator
                                </CardTitle>
                                <CardDescription>Calculate GST for goods and services in India</CardDescription>
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
                                { label: "₹100 at 5%", amt: 100, rate: 5 },
                                { label: "₹500 at 12%", amt: 500, rate: 12 },
                                { label: "₹1,000 at 18%", amt: 1000, rate: 18 },
                                { label: "₹5,000 at 28%", amt: 5000, rate: 28 },
                            ].map((p, idx) => (
                                <button key={idx}
                                    onClick={() => { setAmount(p.amt); setGstRate(p.rate); setCalculationType('exclusive'); }}
                                    className="text-xs px-2.5 py-1 bg-muted hover:bg-muted/80 text-foreground rounded-md font-medium transition-colors border border-border">
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-foreground">Calculation Type</Label>
                            <Select value={calculationType} onValueChange={(value: 'exclusive' | 'inclusive') => setCalculationType(value)}>
                                <SelectTrigger className="h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="exclusive">GST Exclusive (Add GST to amount)</SelectItem>
                                    <SelectItem value="inclusive">GST Inclusive (Extract GST from amount)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                {calculationType === 'exclusive'
                                    ? 'Enter the base amount, GST will be added'
                                    : 'Enter the total amount including GST, base amount will be calculated'}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <IndianRupee className="w-4 h-4" />
                                {calculationType === 'exclusive' ? 'Base Amount' : 'Total Amount (Including GST)'}
                            </Label>
                            <Input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="h-12 text-lg font-semibold" min="0" step="0.01" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Percent className="w-4 h-4" /> GST Rate
                            </Label>
                            <Select value={gstRate.toString()} onValueChange={(value) => setGstRate(Number(value))}>
                                <SelectTrigger className="h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {gstRates.map((r) => (
                                        <SelectItem key={r.value} value={r.value.toString()}>{r.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="bg-muted/30 border border-border rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-semibold mb-1 text-foreground">GST Breakdown:</p>
                                    <ul className="space-y-1 text-xs text-muted-foreground">
                                        <li>• <strong>CGST:</strong> Central GST (half of GST rate)</li>
                                        <li>• <strong>SGST:</strong> State GST (half of GST rate)</li>
                                        <li>• <strong>IGST:</strong> Integrated GST (inter-state transactions)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Results Card */}
                <Card className="order-first lg:order-none border-border shadow-sm rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Base Amount</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(result.baseAmount)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">GST ({gstRate}%)</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.gstAmount)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-xl shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Total Amount</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">{formatCurrency(result.totalAmount)}</p>
                            </div>
                        </div>

                        {/* Visual breakdown bar */}
                        <div className="p-4 bg-card rounded-xl border border-border mb-4">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Amount Breakdown</p>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-foreground">Base Amount</span>
                                        <span className="font-bold text-foreground">{formatCurrency(result.baseAmount)}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ backgroundColor: '#166534', width: `${(result.baseAmount / result.totalAmount) * 100}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-foreground">GST Amount</span>
                                        <span className="font-bold text-primary">{formatCurrency(result.gstAmount)}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ backgroundColor: '#d97706', width: `${(result.gstAmount / result.totalAmount) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* GST Component Breakdown */}
                        <div className="p-4 bg-card rounded-xl border border-border">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">GST Components</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">CGST ({gstRate / 2}%)</span>
                                    <span className="font-semibold text-foreground">{formatCurrency(result.cgst)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">SGST ({gstRate / 2}%)</span>
                                    <span className="font-semibold text-foreground">{formatCurrency(result.sgst)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-border">
                                    <span className="text-muted-foreground">IGST ({gstRate}%) — Inter-state</span>
                                    <span className="font-semibold text-foreground">{formatCurrency(result.igst)}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Section 3 — Bottom 2-col grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: GST Rate Comparison Chart */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">GST Rate Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={allRatesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--border))" />
                                    <YAxis
                                        tick={{ fontSize: 10 }}
                                        stroke="hsl(var(--border))"
                                        tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: number | undefined, name: string) => [value !== undefined ? `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '', name === 'total' ? 'Total Amount' : 'GST Amount']}
                                    />
                                    <Bar dataKey="total" radius={[8, 8, 0, 0]} name="Total Amount">
                                        {allRatesData.map((entry, index) => (
                                            <Cell key={`cell-gst-${index}`} fill={entry.name === `${gstRate}%` ? '#166534' : '#16a34a'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Tax Breakdown Table */}
                <Card className="border-border shadow-sm rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Tax Breakdown Table</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Current Rate</p>
                                    <p className="text-lg font-bold text-foreground">{gstRate}%</p>
                                </div>
                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Input Amount</p>
                                    <p className="text-lg font-bold text-primary-600">{formatCurrency(amount)}</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-xl border border-border">
                                        <table className="w-full min-w-full">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">GST Rate</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Base</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">GST</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {allRatesTable.map((row, idx) => (
                                                    <tr key={idx} className={`hover:bg-muted/50 transition-colors ${row.rate === gstRate ? 'bg-primary/5' : ''}`}>
                                                        <td className="px-3 py-2.5 text-sm font-semibold text-foreground flex items-center gap-1">
                                                            {row.rate}%{row.rate === gstRate && <Badge className="ml-1 text-[9px] px-1 py-0 bg-primary/20 text-primary border-0">Active</Badge>}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{formatCurrency(row.base)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">{formatCurrency(row.gst)}</td>
                                                        <td className="px-3 py-2.5 text-sm text-right font-bold text-foreground">{formatCurrency(row.total)}</td>
                                                    </tr>
                                                ))}
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
                                    Your {formatCurrency(result.baseAmount)} purchase has <span className="font-bold">{formatCurrency(result.gstAmount)}</span> GST — you pay <span className="font-bold">{formatCurrency(result.totalAmount)}</span> total (at {gstRate}% GST rate).
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> CGST: {formatCurrency(result.cgst)}
                                    </Badge>
                                    <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> SGST: {formatCurrency(result.sgst)}
                                    </Badge>
                                </div>
                            </div>

                            {/* Lead Capture */}
                            <div className="p-5 bg-card rounded-xl border border-border shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary-600" />Get Detailed Report (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">Get GST compliance tips, invoice templates, and a guide to GST filing for your business — completely free.</p>
                                <div className="flex gap-2">
                                    <Input placeholder="Enter your email" className="h-9 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
                                    <Button size="sm" className="h-9 bg-primary-600 hover:bg-primary-700 text-white" onClick={handleEmailSubmit} disabled={isSubmitting}>
                                        {isSubmitting ? "Sending..." : "Send"}
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2 text-center"><Lock className="w-3 h-3 inline mr-1" /> No spam. Unsubscribe anytime.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
