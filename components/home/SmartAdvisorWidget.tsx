"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
    Target,
    TrendingUp,
    Shield,
    CreditCard,
    PiggyBank,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Users,
    Briefcase,
    Home
} from "lucide-react";
import Link from 'next/link';

type GoalType = 'build_wealth' | 'save_money' | 'protect_family' | 'improve_credit' | null;
type LifeStage = 'student' | 'young_professional' | 'established' | 'retirement' | null;

interface Recommendation {
    category: string;
    title: string;
    description: string;
    link: string;
    icon: React.ReactNode;
    priority: 'high' | 'medium';
}

export default function SmartAdvisorWidget() {
    const [step, setStep] = useState<'intro' | 'questions' | 'results'>('intro');
    const [primaryGoal, setPrimaryGoal] = useState<GoalType>(null);
    const [lifeStage, setLifeStage] = useState<LifeStage>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

    const goals = [
        { id: 'build_wealth' as GoalType, label: 'Build Wealth', icon: TrendingUp, color: 'emerald' },
        { id: 'save_money' as GoalType, label: 'Save Money', icon: PiggyBank, color: 'blue' },
        { id: 'protect_family' as GoalType, label: 'Protect Family', icon: Shield, color: 'purple' },
        { id: 'improve_credit' as GoalType, label: 'Improve Credit', icon: CreditCard, color: 'orange' },
    ];

    const lifeStages = [
        { id: 'student' as LifeStage, label: 'Student/Entry Level', icon: Users },
        { id: 'young_professional' as LifeStage, label: 'Young Professional', icon: Briefcase },
        { id: 'established' as LifeStage, label: 'Established Career', icon: Home },
        { id: 'retirement' as LifeStage, label: 'Planning Retirement', icon: PiggyBank },
    ];

    const generateRecommendations = () => {
        const recs: Recommendation[] = [];

        // Build Wealth
        if (primaryGoal === 'build_wealth') {
            recs.push({
                category: 'Investing',
                title: 'High-Growth Mutual Funds',
                description: 'Start with SIP in equity funds for long-term wealth creation',
                link: '/investing',
                icon: <TrendingUp className="w-5 h-5 text-primary-600" />,
                priority: 'high'
            });
            if (lifeStage === 'young_professional' || lifeStage === 'student') {
                recs.push({
                    category: 'Credit Cards',
                    title: 'Cashback Credit Cards',
                    description: 'Earn rewards while building your credit score',
                    link: '/credit-cards',
                    icon: <CreditCard className="w-5 h-5 text-secondary-600" />,
                    priority: 'medium'
                });
            }
        }

        // Save Money
        if (primaryGoal === 'save_money') {
            recs.push({
                category: 'Banking',
                title: 'High-Yield Savings Accounts',
                description: 'Earn up to 7.5% interest on your savings',
                link: '/banking',
                icon: <PiggyBank className="w-5 h-5 text-secondary-600" />,
                priority: 'high'
            });
            recs.push({
                category: 'Credit Cards',
                title: 'Zero-Fee Credit Cards',
                description: 'Save on annual fees while earning rewards',
                link: '/credit-cards',
                icon: <CreditCard className="w-5 h-5 text-secondary-600" />,
                priority: 'medium'
            });
        }

        // Protect Family
        if (primaryGoal === 'protect_family') {
            recs.push({
                category: 'Insurance',
                title: 'Term Life Insurance',
                description: 'Comprehensive family protection starting at ₹399/month',
                link: '/insurance',
                icon: <Shield className="w-5 h-5 text-secondary-600" />,
                priority: 'high'
            });
            recs.push({
                category: 'Insurance',
                title: 'Health Insurance Plans',
                description: 'Medical coverage for your entire family',
                link: '/insurance?type=health',
                icon: <Shield className="w-5 h-5 text-primary-600" />,
                priority: 'high'
            });
        }

        // Improve Credit
        if (primaryGoal === 'improve_credit') {
            recs.push({
                category: 'Credit Cards',
                title: 'Credit Builder Cards',
                description: 'Build your credit history with starter-friendly cards',
                link: '/credit-cards',
                icon: <CreditCard className="w-5 h-5 text-orange-600" />,
                priority: 'high'
            });
            if (lifeStage !== 'student') {
                recs.push({
                    category: 'Loans',
                    title: 'Personal Credit Line',
                    description: 'Flexible credit to manage expenses responsibly',
                    link: '/loans',
                    icon: <TrendingUp className="w-5 h-5 text-secondary-600" />,
                    priority: 'medium'
                });
            }
        }

        // Add IPO recommendation for wealth builders with established income
        if (primaryGoal === 'build_wealth' && (lifeStage === 'established' || lifeStage === 'retirement')) {
            recs.push({
                category: 'IPOs',
                title: 'Upcoming IPO Opportunities',
                description: 'Early access to high-growth public listings',
                link: '/ipo',
                icon: <Sparkles className="w-5 h-5 text-primary-600" />,
                priority: 'medium'
            });
        }

        return recs;
    };

    const handleGetRecommendations = () => {
        const recs = generateRecommendations();
        setRecommendations(recs);
        setStep('results');
    };

    const resetQuiz = () => {
        setStep('intro');
        setPrimaryGoal(null);
        setLifeStage(null);
        setRecommendations([]);
    };

    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <Card className="rounded-[2.5rem] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                        {/* Top Accent Bar */}
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary-400 via-secondary-500 to-secondary-500" />

                        <CardContent className="p-8 md:p-12">
                            {/* INTRO STATE */}
                            {step === 'intro' && (
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 mb-6">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                        Get Personalized Recommendations
                                    </h2>
                                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                                        Answer 2 quick questions and we'll suggest the best financial products tailored to your goals. Takes just <span className="font-semibold text-slate-900 dark:text-white">30 seconds</span>.
                                    </p>
                                    <Button 
                                        onClick={() => setStep('questions')}
                                        className="h-14 px-10 bg-gradient-to-r from-primary-500 to-secondary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/30"
                                    >
                                        Start Smart Advisor
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                    <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-primary-500" />
                                            No Sign-Up Required
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-primary-500" />
                                            100% Free
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* QUESTIONS STATE */}
                            {step === 'questions' && (
                                <div className="space-y-10">
                                    {/* Question 1: Primary Goal */}
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                                            What's your primary financial goal?
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {goals.map((goal) => (
                                                <button
                                                    key={goal.id}
                                                    onClick={() => setPrimaryGoal(goal.id)}
                                                    className={`p-5 rounded-2xl border-2 transition-all ${
                                                        primaryGoal === goal.id
                                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${primaryGoal === goal.id ? `bg-${goal.color}-100 dark:bg-${goal.color}-900/30` : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                            <goal.icon className={`w-5 h-5 ${primaryGoal === goal.id ? `text-${goal.color}-600 dark:text-${goal.color}-400` : 'text-slate-500'}`} />
                                                        </div>
                                                        <span className={`font-semibold ${primaryGoal === goal.id ? 'text-primary-900 dark:text-primary-100' : 'text-slate-700 dark:text-slate-300'}`}>
                                                            {goal.label}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Question 2: Life Stage */}
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-secondary-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                                            What's your current life stage?
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {lifeStages.map((stage) => (
                                                <button
                                                    key={stage.id}
                                                    onClick={() => setLifeStage(stage.id)}
                                                    className={`p-5 rounded-2xl border-2 transition-all ${
                                                        lifeStage === stage.id
                                                            ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-500/10'
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${lifeStage === stage.id ? 'bg-secondary-100 dark:bg-secondary-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                            <stage.icon className={`w-5 h-5 ${lifeStage === stage.id ? 'text-secondary-600 dark:text-secondary-400' : 'text-slate-500'}`} />
                                                        </div>
                                                        <span className={`font-semibold text-sm ${lifeStage === stage.id ? 'text-secondary-900 dark:text-secondary-100' : 'text-slate-700 dark:text-slate-300'}`}>
                                                            {stage.label}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                                        <Button 
                                            onClick={handleGetRecommendations}
                                            disabled={!primaryGoal || !lifeStage}
                                            className={`w-full h-14 rounded-2xl font-bold text-lg ${
                                                primaryGoal && lifeStage
                                                    ? 'bg-gradient-to-r from-primary-500 to-secondary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-xl shadow-primary-500/30'
                                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                            }`}
                                        >
                                            Get My Recommendations
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* RESULTS STATE */}
                            {step === 'results' && (
                                <div>
                                    <div className="text-center mb-10">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
                                            <CheckCircle2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                                            Perfect! Here's Your Personalized Plan
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Based on your goal to <span className="font-semibold text-slate-900 dark:text-white">{goals.find(g => g.id === primaryGoal)?.label}</span>
                                        </p>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        {recommendations.map((rec, idx) => (
                                            <Link key={idx} href={rec.link}>
                                                <div className={`p-6 rounded-2xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${
                                                    rec.priority === 'high'
                                                        ? 'border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-50 to-primary-50 dark:from-primary-900/20 dark:to-primary-900/20'
                                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                                }`}>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-4 flex-1">
                                                            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
                                                                {rec.icon}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Badge variant="outline" className="text-xs font-semibold">
                                                                        {rec.category}
                                                                    </Badge>
                                                                    {rec.priority === 'high' && (
                                                                        <Badge className="text-xs bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 border-0">
                                                                            Priority
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                                                    {rec.title}
                                                                </h4>
                                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                    {rec.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 transition-colors ml-4 shrink-0" />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="flex gap-4">
                                        <Button 
                                            onClick={resetQuiz}
                                            variant="outline"
                                            className="flex-1 h-12 rounded-xl border-slate-300 dark:border-slate-700"
                                        >
                                            Start Over
                                        </Button>
                                        <Link href="/products/credit_card" className="flex-1">
                                            <Button className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold">
                                                Browse All Products
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
