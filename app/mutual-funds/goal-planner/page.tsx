"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Target, 
    GraduationCap, 
    Home, 
    Plane, 
    Shield, 
    TrendingUp,
    Calculator,
    ChevronRight,
    Star,
    CheckCircle2,
    AlertCircle,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient as api } from '@/lib/api-client';
import { MutualFundDecisionEngine, GoalInput, FundRecommendation } from '@/lib/decision-engines/mutual-fund-engine';
import Link from 'next/link';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ProductScoreBadges from '@/components/products/ProductScoreBadges';

const goals = [
    { id: 'retirement', label: 'Retirement', icon: Target, color: 'from-blue-500 to-indigo-600', description: 'Build a secure retirement corpus' },
    { id: 'education', label: "Child's Education", icon: GraduationCap, color: 'from-purple-500 to-pink-600', description: 'Save for education expenses' },
    { id: 'house', label: 'Dream Home', icon: Home, color: 'from-amber-500 to-orange-600', description: 'Down payment or full purchase' },
    { id: 'vacation', label: 'Vacation', icon: Plane, color: 'from-teal-500 to-cyan-600', description: 'Plan your dream trip' },
    { id: 'emergency', label: 'Emergency Fund', icon: Shield, color: 'from-emerald-500 to-green-600', description: '6-12 months expenses backup' },
    { id: 'wealth_creation', label: 'Wealth Creation', icon: TrendingUp, color: 'from-rose-500 to-red-600', description: 'Grow your wealth long-term' },
];

export default function GoalPlannerPage() {
    const [step, setStep] = useState(1);
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [targetAmount, setTargetAmount] = useState<number>(1000000);
    const [timeline, setTimeline] = useState<number>(5);
    const [monthlyBudget, setMonthlyBudget] = useState<number | undefined>(undefined);
    const [recommendations, setRecommendations] = useState<FundRecommendation[]>([]);
    const [loading, setLoading] = useState(false);
    const [funds, setFunds] = useState<any[]>([]);

    // Load funds on mount
    useEffect(() => {
        const loadFunds = async () => {
            try {
                const { data } = await api.entities.MutualFund.list({ limit: 100 });
                if (data) {
                    // Normalize fund data
                    const normalizedFunds = data.map((p: any) => ({
                        id: p.slug || p.id,
                        name: p.name,
                        category: p.type || 'Equity',
                        aum: p.aum,
                        returns_1y: p.returns1Y,
                        returns_3y: p.returns3Y,
                        returns_5y: p.returns5Y,
                        rating: p.rating,
                        risk: p.riskLevel,
                        expense_ratio: p.expenseRatio,
                        min_investment: p.minInvestment,
                        fund_house: p.providerName
                    }));
                    setFunds(normalizedFunds);
                }
            } catch (error) {
                console.error('Failed to load funds', error);
            }
        };
        loadFunds();
    }, []);

    const handleGoalSelect = (goalId: string) => {
        setSelectedGoal(goalId);
        setStep(2);
    };

    const handleCalculate = async () => {
        if (!selectedGoal || funds.length === 0) return;
        
        setLoading(true);
        try {
            const engine = new MutualFundDecisionEngine(funds);
            const input: GoalInput = {
                goal: selectedGoal as any,
                amountNeeded: targetAmount,
                timeline: timeline,
                monthlyBudget: monthlyBudget
            };
            const results = engine.getGoalBasedRecommendations(input, 5);
            setRecommendations(results);
            setStep(3);
        } catch (error) {
            console.error('Error calculating recommendations', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
    };

    const selectedGoalData = goals.find(g => g.id === selectedGoal);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            <SEOHead
                title="Goal-Based Mutual Fund Planner | InvestingPro"
                description="Find the perfect mutual funds for your financial goals. Calculate required SIP, get AI-powered recommendations based on your retirement, education, or wealth creation goals."
            />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white pt-28 pb-16">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs className="mb-6 text-white/70" />
                    
                    <div className="max-w-3xl">
                        <Badge className="bg-white/20 text-white border-white/30 mb-4">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI-Powered Goal Planner
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Find Funds That Match Your Goals
                        </h1>
                        <p className="text-xl text-white/90 mb-6">
                            Tell us your financial goal and we'll recommend the best mutual funds with exact SIP amounts to achieve it.
                        </p>
                        
                        {/* Progress Steps */}
                        <div className="flex items-center gap-2 text-sm">
                            <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full", step >= 1 ? "bg-white text-primary-600" : "bg-white/20")}>
                                <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                                Select Goal
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/50" />
                            <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full", step >= 2 ? "bg-white text-primary-600" : "bg-white/20")}>
                                <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold", step >= 2 ? "bg-primary-600 text-white" : "bg-white/30 text-white")}>2</span>
                                Set Target
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/50" />
                            <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full", step >= 3 ? "bg-white text-primary-600" : "bg-white/20")}>
                                <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold", step >= 3 ? "bg-primary-600 text-white" : "bg-white/30 text-white")}>3</span>
                                Get Funds
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 pb-20">
                {/* Step 1: Goal Selection */}
                {step === 1 && (
                    <div className="max-w-4xl mx-auto">
                        <Card className="rounded-3xl shadow-2xl border-0">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-2xl">What are you saving for?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {goals.map((goal) => {
                                        const Icon = goal.icon;
                                        return (
                                            <button
                                                key={goal.id}
                                                onClick={() => handleGoalSelect(goal.id)}
                                                className={cn(
                                                    "p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] hover:shadow-lg",
                                                    selectedGoal === goal.id
                                                        ? "border-primary-500 bg-primary-50 dark:bg-primary-950"
                                                        : "border-slate-200 dark:border-slate-700 hover:border-primary-300"
                                                )}
                                            >
                                                <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4", goal.color)}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{goal.label}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{goal.description}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 2: Set Target */}
                {step === 2 && selectedGoalData && (
                    <div className="max-w-2xl mx-auto">
                        <Card className="rounded-3xl shadow-2xl border-0">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center", selectedGoalData.color)}>
                                        <selectedGoalData.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">{selectedGoalData.label}</CardTitle>
                                        <p className="text-slate-500">{selectedGoalData.description}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Target Amount */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">How much do you need?</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                        <Input
                                            type="number"
                                            value={targetAmount}
                                            onChange={(e) => setTargetAmount(Number(e.target.value))}
                                            className="pl-10 h-14 text-xl font-bold rounded-xl"
                                            placeholder="10,00,000"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        {[500000, 1000000, 2500000, 5000000, 10000000].map((amt) => (
                                            <button
                                                key={amt}
                                                onClick={() => setTargetAmount(amt)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                                    targetAmount === amt
                                                        ? "bg-primary-600 text-white"
                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                                                )}
                                            >
                                                {formatCurrency(amt)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">In how many years?</Label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="1"
                                            max="30"
                                            value={timeline}
                                            onChange={(e) => setTimeline(Number(e.target.value))}
                                            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                        />
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white w-20 text-center">
                                            {timeline} {timeline === 1 ? 'year' : 'years'}
                                        </span>
                                    </div>
                                </div>

                                {/* Monthly Budget (Optional) */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Monthly SIP budget (optional)</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                        <Input
                                            type="number"
                                            value={monthlyBudget || ''}
                                            onChange={(e) => setMonthlyBudget(e.target.value ? Number(e.target.value) : undefined)}
                                            className="pl-10 h-14 text-xl font-bold rounded-xl"
                                            placeholder="Leave empty to calculate required SIP"
                                        />
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        If left empty, we'll calculate the required monthly SIP for your goal.
                                    </p>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setStep(1)}
                                        className="flex-1 h-12 rounded-xl"
                                    >
                                        Back
                                    </Button>
                                    <Button 
                                        onClick={handleCalculate}
                                        disabled={loading}
                                        className="flex-1 h-12 rounded-xl bg-primary-600 hover:bg-primary-700"
                                    >
                                        {loading ? 'Analyzing...' : 'Find Best Funds'}
                                        <Calculator className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 3: Recommendations */}
                {step === 3 && recommendations.length > 0 && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Summary Card */}
                        <Card className="rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-primary-600 to-secondary-600 text-white overflow-hidden">
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                    <div>
                                        <Badge className="bg-white/20 text-white border-white/30 mb-3">
                                            Your Goal Plan
                                        </Badge>
                                        <h2 className="text-3xl font-bold mb-2">{selectedGoalData?.label}</h2>
                                        <p className="text-white/80">Target: {formatCurrency(targetAmount)} in {timeline} years</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                        <p className="text-sm text-white/70 mb-1">Required Monthly SIP</p>
                                        <p className="text-4xl font-black">{formatCurrency(recommendations[0]?.recommendedSIPAmount || 0)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommended Funds */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recommended Funds</h3>
                            
                            {recommendations.map((rec, index) => (
                                <Card key={rec.fund.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                                            {/* Rank Badge */}
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0",
                                                index === 0 ? "bg-amber-100 text-amber-700" :
                                                index === 1 ? "bg-slate-100 text-slate-600" :
                                                "bg-orange-50 text-orange-600"
                                            )}>
                                                #{index + 1}
                                            </div>

                                            {/* Fund Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                                            {rec.fund.fund_house}
                                                        </p>
                                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                                            {rec.fund.name}
                                                        </h4>
                                                        <ProductScoreBadges
                                                            category="mutual_fund"
                                                            tags={rec.reasons.slice(0, 2)}
                                                            size="sm"
                                                        />
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-1 justify-end mb-1">
                                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                            <span className="font-bold">{rec.fund.rating || 4.0}</span>
                                                        </div>
                                                        <Badge variant="outline" className={cn(
                                                            "text-xs",
                                                            rec.riskMatch >= 80 ? "border-green-200 text-green-700 bg-green-50" :
                                                            rec.riskMatch >= 60 ? "border-amber-200 text-amber-700 bg-amber-50" :
                                                            "border-slate-200 text-slate-600"
                                                        )}>
                                                            {rec.riskMatch}% Risk Match
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Returns Grid */}
                                                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                    <div>
                                                        <p className="text-xs text-slate-500">3Y Returns</p>
                                                        <p className="text-lg font-bold text-green-600">{rec.fund.returns_3y?.toFixed(1) || 'N/A'}%</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500">Projected Value</p>
                                                        <p className="text-lg font-bold text-primary-600">{formatCurrency(rec.projectedValue)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500">Expense Ratio</p>
                                                        <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{rec.fund.expense_ratio?.toFixed(2) || 'N/A'}%</p>
                                                    </div>
                                                </div>

                                                {/* Reasons */}
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {rec.reasons.map((reason, i) => (
                                                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                            {reason}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <div className="shrink-0">
                                                <Link href={`/mutual-funds/${rec.fund.id}`}>
                                                    <Button className="h-12 px-6 rounded-xl bg-primary-600 hover:bg-primary-700">
                                                        Start SIP
                                                        <ChevronRight className="w-4 h-4 ml-1" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Reset Button */}
                        <div className="text-center pt-8">
                            <Button 
                                variant="outline" 
                                onClick={() => { setStep(1); setRecommendations([]); }}
                                className="rounded-xl"
                            >
                                Plan Another Goal
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
