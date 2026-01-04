"use client";

import React, { useState } from 'react';
import {
    Shield,
    Heart,
    FileText,
    Car,
    Bike,
    Plane,
    TrendingUp,
    ShieldCheck,
    CheckCircle2,
    AlertTriangle,
    Users,
    Home,
    Zap,
    Target,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/common/SEOHead";
import Link from 'next/link';

const insuranceTypes = [
    { id: 'life', label: 'Life', icon: Heart, color: 'rose' },
    { id: 'health', label: 'Health', icon: Shield, color: 'emerald' },
    { id: 'term', label: 'Term', icon: FileText, color: 'blue' },
    { id: 'car', label: 'Car', icon: Car, color: 'violet' },
    { id: 'bike', label: 'Bike', icon: Bike, color: 'orange' },
    { id: 'travel', label: 'Travel', icon: Plane, color: 'teal' },
];

export default function InsurancePage() {
    const [protectionScore, setProtectionScore] = useState(0);
    const [hasCalculated, setHasCalculated] = useState(false);

    // Simple quiz state
    const [answers, setAnswers] = useState({
        hasHealthInsurance: false,
        hasLifeInsurance: false,
        hasCarInsurance: false,
        hasDependents: false,
        hasHome: false
    });

    const calculateProtectionScore = () => {
        let score = 0;
        if (answers.hasHealthInsurance) score += 30;
        if (answers.hasLifeInsurance) score += 25;
        if (answers.hasCarInsurance) score += 15;
        if (answers.hasDependents && answers.hasLifeInsurance) score += 20;
        if (answers.hasHome) score += 10;
        
        setProtectionScore(score);
        setHasCalculated(true);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreStatus = (score: number) => {
        if (score >= 80) return { text: 'Well Protected', color: 'emerald', icon: ShieldCheck };
        if (score >= 50) return { text: 'Moderately Protected', color: 'yellow', icon: AlertTriangle };
        return { text: 'Needs Urgent Attention', color: 'red', icon: AlertTriangle };
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="Best Insurance Plans in India 2026 | Protection Score Analysis"
                description="Find out your Protection Score and compare life, health, car, and term insurance. Don't buy what you don't need."
            />

            {/* --- HERO SECTION --- */}
            <div className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32 bg-gradient-to-b from-blue-50 to-slate-50 dark:from-slate-900 dark:to-slate-950">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 dark:bg-blue-500/20" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 dark:bg-purple-500/20" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        
                        {/* Hero Text */}
                        <div className="flex-1 text-center lg:text-left">
                            <Badge className="mb-6 px-4 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 font-semibold uppercase tracking-wide text-[11px] inline-flex items-center gap-2 rounded-full">
                                <Shield className="w-3.5 h-3.5" />
                                Smart Protection Planning
                            </Badge>
                            
                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white leading-[1.1]">
                                Buy Only What <br className="hidden lg:block" />
                                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">You Need</span>
                            </h1>
                            
                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                                Take our <span className="font-semibold text-slate-900 dark:text-white">2-minute Protection Score</span> assessment 
                                to find your coverage gaps. Then compare 20+ insurers with zero spam.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Button className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 w-full sm:w-auto transition-all hover:scale-105">
                                    Check Your Score
                                </Button>
                                <Button variant="outline" className="h-14 px-8 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl font-semibold text-lg w-full sm:w-auto">
                                    Compare Plans
                                </Button>
                            </div>

                             <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8">
                                {[
                                    { label: "Verified Insurers", value: "20+", icon: ShieldCheck },
                                    { label: "Claim Settlement", value: "95%", icon: CheckCircle2 },
                                    { label: "Avg. Savings", value: "₹14K/yr", icon: TrendingUp }
                                ].map((stat, i) => (
                                    <div key={i} className="flex flex-col">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                                            <stat.icon size={14} /> {stat.label}
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Protection Score Widget */}
                        <div className="flex-1 w-full max-w-md lg:max-w-lg">
                            <Card className="rounded-[2.5rem] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-500/10 overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" />
                                
                                <CardHeader className="p-8 pb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Target className="w-5 h-5 text-blue-500" />
                                            Protection Score
                                        </h3>
                                        {!hasCalculated && (
                                            <Badge variant="outline" className="text-xs">30 sec quiz</Badge>
                                        )}
                                    </div>
                                    {!hasCalculated ? (
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Answer these quick questions to see your coverage gaps
                                        </p>
                                    ) : (() => {
                                        const scoreStatus = getScoreStatus(protectionScore);
                                        const StatusIcon = scoreStatus.icon;
                                        return (
                                            <div className="text-center py-8">
                                                <div className={`text-7xl font-bold ${getScoreColor(protectionScore)} mb-4`}>
                                                    {protectionScore}
                                                    <span className="text-3xl">/100</span>
                                                </div>
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${scoreStatus.color}-100 dark:bg-${scoreStatus.color}-500/20`}>
                                                    <StatusIcon className={`w-4 h-4 text-${scoreStatus.color}-600 dark:text-${scoreStatus.color}-400`} />
                                                    <span className={`font-semibold text-${scoreStatus.color}-700 dark:text-${scoreStatus.color}-300 text-sm`}>
                                                        {scoreStatus.text}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </CardHeader>

                                <CardContent className="p-8 pt-0">
                                    {!hasCalculated ? (
                                        <div className="space-y-4">
                                            {[
                                                { key: 'hasHealthInsurance', label: 'Do you have Health Insurance?', icon: Heart },
                                                { key: 'hasLifeInsurance', label: 'Do you have Life/Term Insurance?', icon: Shield },
                                                { key: 'hasCarInsurance', label: 'Do you own a Car (insured)?', icon: Car },
                                                { key: 'hasDependents', label: 'Do you have financial dependents?', icon: Users },
                                                { key: 'hasHome', label: 'Do you own a Home?', icon: Home }
                                            ].map((q) => (
                                                <button
                                                    key={q.key}
                                                    onClick={() => setAnswers({...answers, [q.key]: !answers[q.key as keyof typeof answers]})}
                                                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                                        answers[q.key as keyof typeof answers]
                                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <q.icon className={`w-4 h-4 ${answers[q.key as keyof typeof answers] ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                                                        <span className={`text-sm font-medium ${answers[q.key as keyof typeof answers] ? 'text-blue-900 dark:text-blue-100' : 'text-slate-700 dark:text-slate-300'}`}>
                                                            {q.label}
                                                        </span>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                        answers[q.key as keyof typeof answers]
                                                            ? 'border-blue-500 bg-blue-500'
                                                            : 'border-slate-300 dark:border-slate-600'
                                                    }`}>
                                                        {answers[q.key as keyof typeof answers] && (
                                                            <CheckCircle2 className="w-3 h-3 text-white" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                            
                                            <Button 
                                                onClick={calculateProtectionScore}
                                                className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl mt-6"
                                            >
                                                Calculate My Score
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-3">Recommended Actions:</h4>
                                                <ul className="space-y-2">
                                                    {!answers.hasHealthInsurance && (
                                                        <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                                            <span><strong>Critical:</strong> Get Health Insurance immediately</span>
                                                        </li>
                                                    )}
                                                    {!answers.hasLifeInsurance && answers.hasDependents && (
                                                        <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                                                            <span><strong>Urgent:</strong> Term Insurance for family protection</span>
                                                        </li>
                                                    )}
                                                    {protectionScore >= 80 && (
                                                        <li className="flex items-start gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                                                            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                                                            <span>You're well protected! Review policies annually.</span>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                            
                                            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">
                                                View Recommended Plans
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                            
                                            <button
                                                onClick={() => {
                                                    setHasCalculated(false);
                                                    setProtectionScore(0);
                                                    setAnswers({
                                                        hasHealthInsurance: false,
                                                        hasLifeInsurance: false,
                                                        hasCarInsurance: false,
                                                        hasDependents: false,
                                                        hasHome: false
                                                    });
                                                }}
                                                className="w-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
                                            >
                                                Retake Quiz
                                            </button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- INSURANCE TYPES GRID --- */}
            <main className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Choose Your Shield</h2>
                    <p className="text-slate-600 dark:text-slate-400">Tailored protection for every life stage.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-24">
                    {insuranceTypes.map((type) => (
                        <Link href={`/insurance?type=${type.id}`} key={type.id}>
                            <Card className={`hover:border-${type.color}-500 dark:hover:border-${type.color}-500 transition-all cursor-pointer group hover:-translate-y-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800`}>
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <div className={`w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-${type.color}-50 dark:group-hover:bg-${type.color}-900/20 flex items-center justify-center mb-4 transition-colors`}>
                                        <type.icon className={`w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-${type.color}-600 dark:group-hover:text-${type.color}-400`} />
                                    </div>
                                    <div className="font-bold text-slate-900 dark:text-white mb-1">{type.label}</div>
                                    <div className={`text-xs text-${type.color}-600 dark:text-${type.color}-400 font-semibold`}>From ₹399/mo</div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Claim Settlement Transparency */}
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white border-0 rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-12">
                        <div className="flex items-center gap-3 mb-8">
                            <Zap className="w-8 h-8 text-yellow-400" />
                            <h2 className="text-3xl font-bold">Why We're Different</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <ShieldCheck className="w-12 h-12 text-emerald-400 mb-4" />
                                <h3 className="text-xl font-bold mb-2">95% Claim Settlement Ratio</h3>
                                <p className="text-slate-400">We only list insurers with proven track records. No spam, no hidden clauses.</p>
                            </div>
                            <div>
                                <Target className="w-12 h-12 text-blue-400 mb-4" />
                                <h3 className="text-xl font-bold mb-2">Protection Score First</h3>
                                <p className="text-slate-400">We help you understand your gaps before selling you anything.</p>
                            </div>
                            <div>
                                <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
                                <h3 className="text-xl font-bold mb-2">Save up to ₹14,000/year</h3>
                                <p className="text-slate-400">Compare apples-to-apples. No jargon, just real savings.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
