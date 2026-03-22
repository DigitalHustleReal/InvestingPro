"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    User, 
    Briefcase, 
    CreditCard,
    Building2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronRight,
    TrendingUp,
    Percent,
    Sparkles,
    Calculator
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient as api } from '@/lib/api-client';
import Link from 'next/link';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ProductScoreBadges from '@/components/products/ProductScoreBadges';

interface EligibilityResult {
    loanId: string;
    loanName: string;
    provider: string;
    probability: number;
    maxAmount: number;
    interestRate: string;
    reasons: string[];
    factors: {
        income: 'positive' | 'negative' | 'neutral';
        creditScore: 'positive' | 'negative' | 'neutral';
        employment: 'positive' | 'negative' | 'neutral';
        age: 'positive' | 'negative' | 'neutral';
    };
}

const employmentTypes = [
    { id: 'salaried', label: 'Salaried', icon: Briefcase, description: 'Working for a company' },
    { id: 'self_employed', label: 'Self Employed', icon: User, description: 'Business owner or freelancer' },
    { id: 'business', label: 'Business Owner', icon: Building2, description: 'Running a registered business' },
];

export default function LoanEligibilityPage() {
    const [step, setStep] = useState(1);
    
    // User inputs
    const [monthlyIncome, setMonthlyIncome] = useState<number>(50000);
    const [employment, setEmployment] = useState<string>('salaried');
    const [creditScore, setCreditScore] = useState<number>(750);
    const [age, setAge] = useState<number>(30);
    const [existingEMIs, setExistingEMIs] = useState<number>(0);
    const [loanAmount, setLoanAmount] = useState<number>(500000);
    
    // Results
    const [results, setResults] = useState<EligibilityResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [loans, setLoans] = useState<any[]>([]);

    // Load loans on mount
    useEffect(() => {
        const loadLoans = async () => {
            try {
                const data = await api.entities.Loan.list();
                setLoans(data || []);
            } catch (error) {
                console.error('Failed to load loans', error);
            }
        };
        loadLoans();
    }, []);

    const calculateEligibility = () => {
        setLoading(true);
        
        // Calculate eligibility for each loan
        const eligibilityResults: EligibilityResult[] = loans.map(loan => {
            let probability = 50; // Base probability
            const reasons: string[] = [];
            const factors = {
                income: 'neutral' as 'positive' | 'negative' | 'neutral',
                creditScore: 'neutral' as 'positive' | 'negative' | 'neutral',
                employment: 'neutral' as 'positive' | 'negative' | 'neutral',
                age: 'neutral' as 'positive' | 'negative' | 'neutral',
            };

            // Income check
            const requiredIncome = loanAmount / 60; // Rough estimate: loan amount / 60 months
            if (monthlyIncome >= requiredIncome * 2) {
                probability += 25;
                factors.income = 'positive';
                reasons.push('Excellent income-to-loan ratio');
            } else if (monthlyIncome >= requiredIncome * 1.5) {
                probability += 15;
                factors.income = 'positive';
                reasons.push('Good income for requested amount');
            } else if (monthlyIncome < requiredIncome) {
                probability -= 20;
                factors.income = 'negative';
                reasons.push('Income may be insufficient');
            }

            // Credit score check
            if (creditScore >= 750) {
                probability += 25;
                factors.creditScore = 'positive';
                reasons.push('Excellent credit score');
            } else if (creditScore >= 700) {
                probability += 15;
                factors.creditScore = 'positive';
                reasons.push('Good credit score');
            } else if (creditScore >= 650) {
                probability += 5;
                factors.creditScore = 'neutral';
                reasons.push('Average credit score');
            } else {
                probability -= 15;
                factors.creditScore = 'negative';
                reasons.push('Low credit score may affect approval');
            }

            // Employment check
            if (employment === 'salaried') {
                probability += 10;
                factors.employment = 'positive';
                reasons.push('Salaried employment preferred');
            } else if (employment === 'business') {
                probability += 5;
                factors.employment = 'neutral';
                reasons.push('Business income considered');
            } else {
                factors.employment = 'neutral';
                reasons.push('Self-employment requires ITR');
            }

            // Age check
            if (age >= 25 && age <= 55) {
                probability += 10;
                factors.age = 'positive';
                reasons.push('Age within ideal range');
            } else if (age < 23 || age > 60) {
                probability -= 10;
                factors.age = 'negative';
                reasons.push('Age may limit tenure options');
            }

            // Existing EMI burden
            const emiBurden = existingEMIs / monthlyIncome;
            if (emiBurden > 0.4) {
                probability -= 15;
                reasons.push('High existing EMI burden');
            } else if (emiBurden < 0.2) {
                probability += 5;
                reasons.push('Low existing obligations');
            }

            // Calculate max loan amount based on income (FOIR of 50%)
            const availableEMI = (monthlyIncome * 0.5) - existingEMIs;
            const maxLoanAmount = availableEMI * 60; // Assuming 5 year tenure at ~10% interest

            // Extract interest rate from loan data
            const interestRate = loan.features?.interest_rate || loan.interest_rate || '10.5% - 16%';

            return {
                loanId: loan.id || loan.slug,
                loanName: loan.name,
                provider: loan.provider_name || loan.provider || 'Lender',
                probability: Math.max(0, Math.min(100, probability)),
                maxAmount: Math.max(0, maxLoanAmount),
                interestRate,
                reasons,
                factors
            };
        });

        // Sort by probability
        eligibilityResults.sort((a, b) => b.probability - a.probability);
        
        setResults(eligibilityResults);
        setStep(2);
        setLoading(false);
    };

    const formatCurrency = (num: number) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
    };

    const getProbabilityColor = (prob: number) => {
        if (prob >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (prob >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
        if (prob >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getFactorIcon = (status: 'positive' | 'negative' | 'neutral') => {
        if (status === 'positive') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        if (status === 'negative') return <XCircle className="w-4 h-4 text-red-500" />;
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            <SEOHead
                title="Loan Eligibility Checker | InvestingPro"
                description="Check your loan eligibility instantly. Get personalized approval probability for Personal, Home, and Car loans from 30+ lenders."
            />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 text-white pt-28 pb-16">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs className="mb-6 text-white/70" />
                    
                    <div className="max-w-3xl">
                        <Badge className="bg-white/20 text-white border-white/30 mb-4">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Instant Eligibility Check
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Know Your Loan Eligibility
                        </h1>
                        <p className="text-xl text-white/90 mb-6">
                            Check approval probability across 30+ lenders without affecting your credit score.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 pb-20">
                {/* Step 1: Input Form */}
                {step === 1 && (
                    <div className="max-w-2xl mx-auto">
                        <Card className="rounded-3xl shadow-2xl border-0">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-3">
                                    <Calculator className="w-6 h-6 text-primary-600" />
                                    Enter Your Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Loan Amount */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Loan Amount Required</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold">₹</span>
                                        <Input
                                            type="number"
                                            value={loanAmount}
                                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                                            className="pl-10 h-14 text-xl font-bold rounded-xl"
                                        />
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {[300000, 500000, 1000000, 2500000, 5000000].map((amt) => (
                                            <button
                                                key={amt}
                                                onClick={() => setLoanAmount(amt)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                                    loanAmount === amt
                                                        ? "bg-primary-600 text-white"
                                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                )}
                                            >
                                                {formatCurrency(amt)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Monthly Income */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Monthly Income (Net)</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold">₹</span>
                                        <Input
                                            type="number"
                                            value={monthlyIncome}
                                            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                                            className="pl-10 h-14 text-xl font-bold rounded-xl"
                                        />
                                    </div>
                                </div>

                                {/* Employment Type */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Employment Type</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {employmentTypes.map((type) => {
                                            const Icon = type.icon;
                                            return (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setEmployment(type.id)}
                                                    className={cn(
                                                        "p-4 rounded-xl border-2 text-center transition-all",
                                                        employment === type.id
                                                            ? "border-primary-500 bg-primary-50"
                                                            : "border-slate-200 hover:border-primary-300"
                                                    )}
                                                >
                                                    <Icon className={cn(
                                                        "w-6 h-6 mx-auto mb-2",
                                                        employment === type.id ? "text-primary-600" : "text-slate-600"
                                                    )} />
                                                    <p className="text-sm font-semibold">{type.label}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Credit Score */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Credit Score (CIBIL)</Label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="300"
                                            max="900"
                                            value={creditScore}
                                            onChange={(e) => setCreditScore(Number(e.target.value))}
                                            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                        />
                                        <span className={cn(
                                            "text-2xl font-bold w-20 text-center",
                                            creditScore >= 750 ? "text-green-600" :
                                            creditScore >= 700 ? "text-amber-600" : "text-red-600"
                                        )}>
                                            {creditScore}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        {creditScore >= 750 ? 'Excellent' : creditScore >= 700 ? 'Good' : creditScore >= 650 ? 'Fair' : 'Needs Improvement'}
                                    </p>
                                </div>

                                {/* Age */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-semibold">Age</Label>
                                        <Input
                                            type="number"
                                            value={age}
                                            onChange={(e) => setAge(Number(e.target.value))}
                                            className="h-12 rounded-xl"
                                            min={21}
                                            max={65}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-semibold">Existing EMIs (₹/month)</Label>
                                        <Input
                                            type="number"
                                            value={existingEMIs}
                                            onChange={(e) => setExistingEMIs(Number(e.target.value))}
                                            className="h-12 rounded-xl"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <Button 
                                    onClick={calculateEligibility}
                                    disabled={loading || loans.length === 0}
                                    className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-lg font-bold"
                                >
                                    {loading ? 'Checking...' : 'Check Eligibility'}
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>

                                <p className="text-xs text-center text-slate-600">
                                    This check does not impact your credit score
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 2: Results */}
                {step === 2 && results.length > 0 && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Summary */}
                        <Card className="rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-emerald-600 to-emerald-600 text-white overflow-hidden">
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                    <div>
                                        <Badge className="bg-white/20 text-white border-white/30 mb-3">
                                            Eligibility Report
                                        </Badge>
                                        <h2 className="text-3xl font-bold mb-2">Your Loan Profile</h2>
                                        <p className="text-white/80">
                                            Requested: {formatCurrency(loanAmount)} | Income: {formatCurrency(monthlyIncome)}/mo
                                        </p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                        <p className="text-sm text-white/70 mb-1">Max Eligible Amount</p>
                                        <p className="text-4xl font-black">{formatCurrency(results[0]?.maxAmount || 0)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Factor Summary */}
                        <Card className="rounded-2xl">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-4">Your Profile Strength</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        {getFactorIcon(results[0]?.factors.income || 'neutral')}
                                        <div>
                                            <p className="text-xs text-slate-500">Income</p>
                                            <p className="font-semibold">{formatCurrency(monthlyIncome)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        {getFactorIcon(results[0]?.factors.creditScore || 'neutral')}
                                        <div>
                                            <p className="text-xs text-slate-500">Credit Score</p>
                                            <p className="font-semibold">{creditScore}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        {getFactorIcon(results[0]?.factors.employment || 'neutral')}
                                        <div>
                                            <p className="text-xs text-slate-500">Employment</p>
                                            <p className="font-semibold capitalize">{employment.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        {getFactorIcon(results[0]?.factors.age || 'neutral')}
                                        <div>
                                            <p className="text-xs text-slate-500">Age</p>
                                            <p className="font-semibold">{age} years</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Loan Results */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Matching Loans ({results.filter(r => r.probability >= 50).length} High Probability)
                            </h3>
                            
                            {results.slice(0, 10).map((result, index) => (
                                <Card key={result.loanId} className={cn(
                                    "rounded-2xl border transition-shadow hover:shadow-lg",
                                    result.probability >= 70 ? "border-green-200" : "border-slate-200"
                                )}>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                                            {/* Probability Gauge */}
                                            <div className={cn(
                                                "w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black text-lg shrink-0 border",
                                                getProbabilityColor(result.probability)
                                            )}>
                                                <span className="text-2xl">{result.probability}%</span>
                                                <span className="text-[10px] font-semibold">MATCH</span>
                                            </div>

                                            {/* Loan Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                                            {result.provider}
                                                        </p>
                                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                                            {result.loanName}
                                                        </h4>
                                                        <ProductScoreBadges
                                                            category="loan"
                                                            tags={result.probability >= 70 ? ['Quick Approval'] : []}
                                                            size="sm"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Key Metrics */}
                                                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                                                    <div>
                                                        <p className="text-xs text-slate-500">Interest Rate</p>
                                                        <p className="text-lg font-bold text-primary-600">{result.interestRate}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500">Max Amount</p>
                                                        <p className="text-lg font-bold text-slate-700">{formatCurrency(result.maxAmount)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500">Status</p>
                                                        <p className={cn(
                                                            "text-lg font-bold",
                                                            result.probability >= 70 ? "text-green-600" :
                                                            result.probability >= 50 ? "text-amber-600" : "text-red-600"
                                                        )}>
                                                            {result.probability >= 70 ? 'Likely' :
                                                             result.probability >= 50 ? 'Possible' : 'Unlikely'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Reasons */}
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {result.reasons.slice(0, 3).map((reason, i) => (
                                                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                            {reason}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <div className="shrink-0">
                                                <Link href={`/loans/${result.loanId}`}>
                                                    <Button className={cn(
                                                        "h-12 px-6 rounded-xl",
                                                        result.probability >= 70 
                                                            ? "bg-emerald-600 hover:bg-emerald-700" 
                                                            : "bg-slate-600 hover:bg-slate-700"
                                                    )}>
                                                        Apply Now
                                                        <ChevronRight className="w-4 h-4 ml-1" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Reset */}
                        <div className="text-center pt-8">
                            <Button 
                                variant="outline" 
                                onClick={() => { setStep(1); setResults([]); }}
                                className="rounded-xl"
                            >
                                Check Again
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
