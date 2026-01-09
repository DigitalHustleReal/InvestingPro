"use client";

import React, { useState, useEffect } from 'react';
import SEOHead from "@/components/common/SEOHead";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";
import {
    CheckCircle2,
    TrendingUp,
    Shield,
    Zap,
    ChevronRight,
    ChevronLeft,
    Target,
    BarChart3,
    Dna,
    PieChart
} from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Link from "next/link";

const questions = [
    {
        id: 1,
        question: "What is your investment experience?",
        options: [
            { label: "Just starting out", value: 0 },
            { label: "Less than 2 years", value: 5 },
            { label: "2-5 years", value: 10 },
            { label: "More than 5 years", value: 15 }
        ]
    },
    {
        id: 2,
        question: "What is your investment time horizon?",
        options: [
            { label: "Less than 1 year", value: 0 },
            { label: "1-3 years", value: 5 },
            { label: "3-5 years", value: 10 },
            { label: "More than 5 years", value: 15 }
        ]
    },
    {
        id: 3,
        question: "What is your primary investment goal?",
        options: [
            { label: "Preserve capital", value: 0 },
            { label: "Regular income", value: 5 },
            { label: "Balanced growth", value: 10 },
            { label: "Maximum growth", value: 15 }
        ]
    },
    {
        id: 4,
        question: "If your investments lost 20% in a month, you would:",
        options: [
            { label: "Sell everything immediately", value: 0 },
            { label: "Reduce exposure significantly", value: 5 },
            { label: "Hold and wait for recovery", value: 10 },
            { label: "Invest more at lower prices", value: 15 }
        ]
    },
    {
        id: 5,
        question: "What percentage of your income can you invest monthly?",
        options: [
            { label: "Less than 10%", value: 0 },
            { label: "10-20%", value: 5 },
            { label: "20-30%", value: 10 },
            { label: "More than 30%", value: 15 }
        ]
    },
    {
        id: 6,
        question: "Do you have an emergency fund (3-6 months expenses)?",
        options: [
            { label: "No emergency fund", value: 0 },
            { label: "Less than 3 months", value: 5 },
            { label: "3-6 months", value: 10 },
            { label: "More than 6 months", value: 15 }
        ]
    }
];

const riskProfiles: Record<string, any> = {
    Conservative: {
        name: "Conservative",
        icon: Shield,
        color: "from-secondary-500 to-indigo-600",
        bgLight: "bg-secondary-50",
        text: "text-secondary-700",
        description: "You prefer stable, low-risk investments with predictable returns. Your priority is wealth preservation over short-term spikes.",
        recommendations: [
            { category: "Fixed Deposits & Liquid Funds", allocation: "40%", icon: Shield },
            { category: "Debt Mutual Funds", allocation: "30%", icon: BarChart3 },
            { category: "PPF / Government Bonds", allocation: "20%", icon: Target },
            { category: "Large Cap Blue Chip Stocks", allocation: "10%", icon: TrendingUp }
        ]
    },
    Moderate: {
        name: "Moderate",
        icon: TrendingUp,
        color: "from-emerald-500 to-teal-600",
        bgLight: "bg-primary-50",
        text: "text-primary-700",
        description: "You're comfortable with moderate risk for balanced growth. You understand that some volatility is necessary for wealth creation.",
        recommendations: [
            { category: "Large Cap Equity Funds", allocation: "35%", icon: TrendingUp },
            { category: "Flexi-Cap / Mid Cap Funds", allocation: "25%", icon: Zap },
            { category: "Dynamic Bond Funds", allocation: "25%", icon: BarChart3 },
            { category: "Arbitrage / Fixed Income", allocation: "15%", icon: Shield }
        ]
    },
    Aggressive: {
        name: "Aggressive",
        icon: Zap,
        color: "from-secondary-600 to-pink-600",
        bgLight: "bg-secondary-50",
        text: "text-secondary-700",
        description: "You seek maximum returns and can handle high volatility. You have a long-term horizon and view market dips as buying opportunities.",
        recommendations: [
            { category: "Mid & Small Cap Equities", allocation: "40%", icon: Zap },
            { category: "Large Cap Index / Flexi Cap", allocation: "30%", icon: TrendingUp },
            { category: "International / US Equity", allocation: "20%", icon: Target },
            { category: "Short-term Debt / Cash", allocation: "10%", icon: Shield }
        ]
    }
};

export default function RiskProfiler() {
    const [user, setUser] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [result, setResult] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const currentUser = await api.auth.me();
            setUser(currentUser);
            if (currentUser?.risk_profile) {
                setResult({
                    profile: currentUser.risk_profile,
                    score: currentUser.risk_score || 0
                });
            }
        } catch (error) {
            logger.error('Error loading user', error as Error);
        } finally {
            setIsLoaded(true);
        }
    };

    const handleAnswer = (questionId: number, value: number) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            calculateResult();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const calculateResult = () => {
        const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
        const maxScore = questions.length * 15;
        const percentage = (totalScore / maxScore) * 100;

        let profile;
        if (percentage < 40) profile = "Conservative";
        else if (percentage < 70) profile = "Moderate";
        else profile = "Aggressive";

        setResult({ profile, score: Math.round(percentage) });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const saveToProfile = async () => {
        if (!result) return;

        setSaving(true);
        try {
            await api.auth.updateMe({
                risk_profile: result.profile,
                risk_score: result.score
            });
            // In a real app we'd use toast
            alert('Your Investment DNA has been synchronized with your profile.');
        } catch (error: any) {
            alert('Error updating profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setAnswers({});
        setResult(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentQuestion = questions[currentStep];
    const isAnswered = answers[currentQuestion?.id] !== undefined;
    const profileData = result ? riskProfiles[result.profile] : null;
    const ProfileIcon = profileData?.icon;

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <LoadingSpinner text="Benchmarking Your Risk Tolerance..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <SEOHead
                title="Investment DNA - Institutional Risk Profiler | InvestingPro"
                description="Discover your investment personality with our proprietary assessment tool. Get professional asset allocation based on your risk appetite."
            />

            {/* Authority Hero Section */}
            <div className="bg-slate-900 border-b border-white/5 pt-28 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-secondary-600 rounded-full blur-[140px] -translate-y-1/2" />
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <Badge className="bg-secondary-500/10 text-secondary-400 border-secondary-500/20 px-4 py-2 mb-8 rounded-full">
                        <Dna className="w-4 h-4 mr-2" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Psychometric Analysis engine</span>
                    </Badge>
                    <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                        Unlock Your <br /> <span className="text-secondary-400">Investment DNA</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Our proprietary algorithm analyzes your psychology, financial capacity, and goal horizon to architect a personalized allocation strategy.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                {!result ? (
                    <div className="space-y-8">
                        {/* Progress Visualizer */}
                        <Card className="rounded-[2rem] border-0 shadow-2xl bg-white p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-st">Question Sequence</span>
                                    <span className="text-2xl font-bold text-slate-900">{currentStep + 1} <span className="text-slate-200">/ {questions.length}</span></span>
                                </div>
                                <Badge className="bg-slate-900 text-white rounded-xl px-4 py-2 font-bold italic">
                                    {Math.round(((currentStep + 1) / questions.length) * 100)}% ANALYZED
                                </Badge>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-secondary-500 to-indigo-600 h-full transition-all duration-700 ease-out rounded-full"
                                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </Card>

                        {/* Question Architecture */}
                        <Card className="rounded-[3rem] border-0 shadow-2xl bg-white p-6 md:p-8 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-bl-[4rem] -mr-8 -mt-8" />

                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-10 leading-snug">
                                    {currentQuestion.question}
                                </h2>

                                <RadioGroup
                                    value={answers[currentQuestion.id]?.toString()}
                                    onValueChange={(val) => handleAnswer(currentQuestion.id, parseInt(val))}
                                    className="grid gap-4"
                                >
                                    {currentQuestion.options.map((option, idx) => (
                                        <div key={idx} className="relative group">
                                            <RadioGroupItem
                                                value={option.value.toString()}
                                                id={`q${currentQuestion.id}-${idx}`}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={`q${currentQuestion.id}-${idx}`}
                                                className="flex items-center gap-4 p-6 rounded-3xl border-2 border-slate-50 bg-slate-50/50 cursor-pointer transition-all peer-data-[state=checked]:border-secondary-500 peer-data-[state=checked]:bg-white peer-data-[state=checked]:shadow-xl group-hover:bg-white group-hover:border-slate-200"
                                            >
                                                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-semibold group-hover:bg-slate-900 group-hover:text-white peer-data-[state=checked]:bg-secondary-600 peer-data-[state=checked]:text-white transition-all text-">
                                                    {String.fromCharCode(65 + idx)}
                                                </div>
                                                <span className="text-lg font-bold text-slate-700 peer-data-[state=checked]:text-slate-900">
                                                    {option.label}
                                                </span>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </Card>

                        {/* Navigation Array */}
                        <div className="flex gap-6">
                            <Button
                                variant="ghost"
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                                className="flex-1 h-16 rounded-[1.5rem] font-semibold text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest text-"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous Question
                            </Button>
                            <Button
                                onClick={handleNext}
                                disabled={!isAnswered}
                                className={`flex-1 h-16 rounded-[1.5rem] font-bold text-white shadow-2xl transition-all uppercase tracking-widest text-[10px] active:scale-95 ${!isAnswered ? 'bg-slate-200' : 'bg-slate-900 hover:bg-secondary-600 shadow-purple-500/20'}`}
                            >
                                {currentStep === questions.length - 1 ? 'Generate DNA Results' : 'Confirm & Continue'}
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {/* Results Header */}
                        <Card className="rounded-[4rem] border-0 shadow-2xl bg-white p-6 md:p-8 text-center overflow-hidden relative">
                            <div className={`absolute top-0 inset-x-0 h-4 bg-gradient-to-r ${profileData.color}`} />
                            <div className={`w-28 h-28 rounded-[2.5rem] bg-gradient-to-br ${profileData.color} mx-auto mb-8 flex items-center justify-center shadow-2xl group`}>
                                {ProfileIcon && <ProfileIcon className="w-14 h-14 text-white group-hover:scale-110 transition-transform duration-500" />}
                            </div>

                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-4">Investment Archetype</h2>
                            <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                                {result.profile} <br />
                                <span className={`text-4xl opacity-40 italic font-medium`}>Strategist</span>
                            </h1>

                            <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-2xl mx-auto mb-10">
                                {profileData.description}
                            </p>

                            <div className="flex justify-center gap-12 border-t border-slate-50 pt-10">
                                <div className="text-center">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-st mb-1">Risk Score</p>
                                    <p className="text-3xl font-bold text-slate-900">{result.score}<span className="text-slate-200">/100</span></p>
                                </div>
                            </div>
                        </Card>

                        {/* Asset Strategy Grid */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <Card className="rounded-[3rem] border-0 shadow-2xl bg-white p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-10">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Deployment Strategy</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Allocation Matrix</p>
                                        </div>
                                        <PieChart className="w-8 h-8 text-slate-100" />
                                    </div>

                                    <div className="space-y-4">
                                        {profileData.recommendations.map((rec: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-white transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-secondary-600 transition-colors shadow-sm`}>
                                                        <rec.icon className="w-6 h-6" />
                                                    </div>
                                                    <span className="text-lg font-bold text-slate-900">{rec.category}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-2xl font-bold text-slate-900">{rec.allocation}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Target Allocation</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            <div className="lg:col-span-1 space-y-8">
                                <Card className={`rounded-[3rem] border-0 shadow-xl p-10 bg-gradient-to-br ${profileData.color} text-white group overflow-hidden relative`}>
                                    <CheckCircle2 className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                                    <div className="relative z-10">
                                        <h4 className="text-[10px] font-semibold opacity-60 uppercase tracking-st mb-6">Expert Verdict</h4>
                                        <p className="text-lg font-bold leading-relaxed mb-10">
                                            Your profile suggests a robust threshold for market cycles. We recommend rebalancing your portfolio every <span className="underline decoration-white/30 underline-offset-4">90 days</span> to maintain this alignment.
                                        </p>
                                        <Button className="w-full bg-white text-slate-900 rounded-2xl font-bold h-14 hover:bg-slate-50">
                                            Download Analysis PDF
                                        </Button>
                                    </div>
                                </Card>

                                <Card className="rounded-[3rem] border-0 shadow-xl bg-white p-8">
                                    <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-st mb-6 px-2">Next Phase</h4>
                                    <div className="space-y-6">
                                        {[
                                            { link: "/mutual-funds", label: "Explore Direct Funds", desc: "Start SIPs in top funds." },
                                            { link: "/stocks", label: "Stock Opportunities", desc: "Equity breakouts & IPOs." }
                                        ].map((next, i) => (
                                            <Link href={next.link} key={i} className="flex items-center justify-between group p-2">
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-secondary-600 transition-colors">{next.label}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{next.desc}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Results Actions */}
                        <div className="flex flex-col sm:flex-row gap-6 pt-10">
                            <Button
                                onClick={resetQuiz}
                                variant="ghost"
                                className="flex-1 h-20 rounded-[2rem] font-semibold text-slate-400 uppercase tracking-widest text- hover:text-slate-900 transition-all"
                            >
                                Reset Assessment Engine
                            </Button>
                            <Button
                                onClick={saveToProfile}
                                disabled={saving}
                                className="flex-[2] h-20 rounded-[2.5rem] bg-slate-900 hover:bg-secondary-600 text-white font-bold text-xl shadow-2xl shadow-slate-900/20 active:scale-95 transition-all group"
                            >
                                {saving ? (
                                    <span className="animate-pulse">Synchronizing Data...</span>
                                ) : (
                                    <>
                                        <Shield className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                                        Synchronize with Global Profile
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
