"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { IndianRupee, TrendingUp, TrendingDown, ChevronDown, ChevronUp, FileText, Lock, Trophy, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { toast } from "sonner";

interface AssetClass {
    name: string;
    currentValue: number;
    targetAllocation: number;
    color: string;
}

export default function PortfolioRebalancingCalculator() {
    const [assets, setAssets] = useState<AssetClass[]>([
        { name: "Equity", currentValue: 500000, targetAllocation: 60, color: "#166534" },
        { name: "Debt", currentValue: 300000, targetAllocation: 30, color: "#d97706" },
        { name: "Gold", currentValue: 50000, targetAllocation: 10, color: "#16a34a" },
    ]);

    const [totalValue, setTotalValue] = useState(0);
    const [actions, setActions] = useState<{ name: string; action: "BUY" | "SELL"; amount: number }[]>([]);
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

    useEffect(() => {
        const total = assets.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
        setTotalValue(total);
        calculateRebalancing(total);
    }, [assets]);

    const handleValueChange = (index: number, value: string) => {
        const newAssets = [...assets];
        newAssets[index].currentValue = parseFloat(value) || 0;
        setAssets(newAssets);
    };

    const handleAllocationChange = (index: number, value: number) => {
        const newAssets = [...assets];
        newAssets[index].targetAllocation = value;
        setAssets(newAssets);
    };

    const calculateRebalancing = (total: number) => {
        if (total === 0) return;
        const newActions = assets.map(asset => {
            const targetValue = (total * asset.targetAllocation) / 100;
            const difference = targetValue - asset.currentValue;
            return { name: asset.name, action: difference > 0 ? "BUY" : "SELL", amount: Math.abs(difference) };
        }) as { name: string; action: "BUY" | "SELL"; amount: number }[];
        setActions(newActions);
    };

    const currentAllocationData = assets.map(a => ({
        name: a.name,
        value: totalValue > 0 ? parseFloat(((a.currentValue / totalValue) * 100).toFixed(1)) : 0
    }));

    const targetAllocationData = assets.map(a => ({
        name: a.name,
        value: a.targetAllocation
    }));

    const barChartData = assets.map((a, i) => ({
        name: a.name,
        Current: totalValue > 0 ? parseFloat(((a.currentValue / totalValue) * 100).toFixed(1)) : 0,
        Target: a.targetAllocation,
    }));

    const totalTargetAllocation = assets.reduce((sum, a) => sum + a.targetAllocation, 0);

    const presets = [
        { label: "80/20 Aggressive", eq: 80, debt: 20, gold: 0 },
        { label: "60/30/10 Balanced", eq: 60, debt: 30, gold: 10 },
        { label: "40/40/20 Conservative", eq: 40, debt: 40, gold: 20 },
    ];

    const applyPreset = (p: { label: string; eq: number; debt: number; gold: number }) => {
        setAssets(prev => [
            { ...prev[0], targetAllocation: p.eq },
            { ...prev[1], targetAllocation: p.debt },
            { ...prev[2], targetAllocation: p.gold },
        ]);
    };

    return (
        <div className="space-y-6 pb-20 md:pb-6">
            {/* Section 1: Mobile Collapsible */}
            <div className="lg:hidden">
                <Card className="border-border shadow-sm rounded-sm">
                    <CardHeader className="cursor-pointer" onClick={() => setInputsExpanded(!inputsExpanded)}>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-lg mb-1">Portfolio Rebalancing</CardTitle>
                                <CardDescription className="text-xs">Tap to adjust inputs</CardDescription>
                            </div>
                            {inputsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                    </CardHeader>
                    {inputsExpanded && (
                        <CardContent className="space-y-4 pt-0">
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                                {assets.map((a, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-xs text-muted-foreground mb-1">{a.name}</p>
                                        <p className="text-sm font-bold text-foreground">{formatCurrency(a.currentValue)}</p>
                                    </div>
                                ))}
                            </div>
                            {assets.map((asset, index) => (
                                <div key={index} className="space-y-3 pb-4 border-b border-border last:border-0">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }} />
                                            {asset.name}
                                        </Label>
                                        <span className="text-xs text-muted-foreground">Target: {asset.targetAllocation}%</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
                                        <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                        <Input type="number" value={asset.currentValue} onChange={(e) => handleValueChange(index, e.target.value)} className="border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                                    </div>
                                </div>
                            ))}
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
                                <CardTitle className="text-xl mb-1">Portfolio Rebalancing Calculator</CardTitle>
                                <CardDescription>Enter your current holdings and target allocation to get rebalancing recommendations</CardDescription>
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
                    <CardContent className="space-y-4">
                        {assets.map((asset, index) => (
                            <div key={index} className="space-y-3 pb-4 border-b border-border last:border-0">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }} />
                                        {asset.name}
                                    </Label>
                                    <span className="text-xs text-muted-foreground">Target: {asset.targetAllocation}%</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Current Value (₹)</label>
                                        <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                                            <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                                            <Input type="number" value={asset.currentValue} onChange={(e) => handleValueChange(index, e.target.value)} className="border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Target % (currently {asset.targetAllocation}%)</label>
                                        <Slider value={[asset.targetAllocation]} max={100} step={1} onValueChange={(vals) => handleAllocationChange(index, vals[0])} className="py-2" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="p-3 bg-muted rounded-sm flex justify-between items-center">
                            <span className="text-muted-foreground font-medium text-sm">Total Portfolio Value</span>
                            <span className="text-lg font-bold text-foreground">{formatCurrency(totalValue)}</span>
                        </div>
                        {totalTargetAllocation !== 100 && (
                            <p className="text-xs text-destructive font-medium">
                                Target allocations sum to {totalTargetAllocation}% (should be 100%)
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card id="calculator-results" className="order-first lg:order-none border-border shadow-sm rounded-sm bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <CardContent className="pt-4 sm:pt-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-sm shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Total Value</p>
                                <p className="text-base sm:text-lg font-extrabold text-foreground">{formatCurrency(totalValue)}</p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-sm shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Equity %</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">
                                    {totalValue > 0 ? ((assets[0].currentValue / totalValue) * 100).toFixed(1) : 0}%
                                </p>
                            </div>
                            <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-sm shadow-sm border border-border">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">Rebalance Amt</p>
                                <p className="text-base sm:text-lg font-extrabold text-primary">
                                    {formatCurrency(actions.reduce((sum, a) => sum + (a.action === "BUY" ? a.amount : 0), 0))}
                                </p>
                            </div>
                        </div>

                        {/* Dual Pie Charts: Current vs Target */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center mb-2">Current</p>
                                <div className="h-[160px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={currentAllocationData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0} paddingAngle={3}>
                                                {currentAllocationData.map((_, index) => (
                                                    <Cell key={`current-${index}`} fill={assets[index].color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => `${value}%`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center mb-2">Target</p>
                                <div className="h-[160px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={targetAllocationData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0} paddingAngle={3}>
                                                {targetAllocationData.map((_, index) => (
                                                    <Cell key={`target-${index}`} fill={assets[index].color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => `${value}%`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2 justify-center">
                            {assets.map((a, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                                    <span className="text-xs text-muted-foreground">{a.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Section 3: Bottom 2-col */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-border shadow-sm rounded-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Rebalancing Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 lg:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--border))" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--border))" tickFormatter={(v) => `${v}%`} />
                                    <Tooltip formatter={(value: any) => `${value}%`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Legend />
                                    <Bar dataKey="Current" fill="#166534" radius={[4, 4, 0, 0]} name="Current %" />
                                    <Bar dataKey="Target" fill="#d97706" radius={[4, 4, 0, 0]} name="Target %" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm rounded-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Rebalancing Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="min-w-full">
                                    <div className="overflow-hidden rounded-sm border border-border">
                                        <table className="w-full">
                                            <thead className="bg-muted border-b border-border">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Asset</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Current</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Target</th>
                                                    <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {assets.map((asset, index) => {
                                                    const currentPct = totalValue > 0 ? ((asset.currentValue / totalValue) * 100).toFixed(1) : "0.0";
                                                    const action = actions[index];
                                                    return (
                                                        <tr key={index} className="hover:bg-muted/50 transition-colors">
                                                            <td className="px-3 py-2.5 text-sm font-semibold text-foreground flex items-center gap-2">
                                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: asset.color }} />
                                                                {asset.name}
                                                            </td>
                                                            <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{currentPct}%</td>
                                                            <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">{asset.targetAllocation}%</td>
                                                            <td className="px-3 py-2.5 text-sm text-right">
                                                                {action && (
                                                                    <span className={`font-bold text-xs px-2 py-1 rounded-md ${action.action === "BUY" ? "text-primary bg-primary/10" : "text-destructive bg-destructive/10"}`}>
                                                                        {action.action === "BUY" ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
                                                                        {action.action} {formatCurrency(action.amount)}
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-emerald-950/30 dark:to-emerald-950/30 rounded-sm p-5 border border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy className="w-24 h-24 text-emerald-600" /></div>
                                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> What This Means
                                </h3>
                                <p className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-3">
                                    To reach your target allocation,{" "}
                                    {actions.filter(a => a.action === "BUY").length > 0 && (
                                        <span>buy <span className="font-bold">{formatCurrency(actions.filter(a => a.action === "BUY").reduce((s, a) => s + a.amount, 0))}</span> in {actions.filter(a => a.action === "BUY").map(a => a.name).join(", ")}</span>
                                    )}
                                    {actions.filter(a => a.action === "BUY").length > 0 && actions.filter(a => a.action === "SELL").length > 0 && " and "}
                                    {actions.filter(a => a.action === "SELL").length > 0 && (
                                        <span>sell <span className="font-bold">{formatCurrency(actions.filter(a => a.action === "SELL").reduce((s, a) => s + a.amount, 0))}</span> from {actions.filter(a => a.action === "SELL").map(a => a.name).join(", ")}</span>
                                    )}
                                    . Well-diversified portfolios manage risk better.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {totalTargetAllocation === 100 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Valid Allocation
                                        </Badge>
                                    )}
                                    {assets[0].targetAllocation >= 60 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> Growth Oriented
                                        </Badge>
                                    )}
                                    {assets[1].targetAllocation >= 40 && (
                                        <Badge variant="outline" className="bg-white/50 border-emerald-200 text-emerald-800 flex items-center gap-1">
                                            <RefreshCw className="w-3 h-3" /> Conservative Mix
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="p-5 bg-card rounded-sm border border-border shadow-sm mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary-600" />Get Personalized Rebalancing Strategy (Free)
                                    </h3>
                                    <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">PDF</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Get a personalized portfolio rebalancing plan for your {formatCurrency(totalValue)} portfolio with tax-efficient recommendations.
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
