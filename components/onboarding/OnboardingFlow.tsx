"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/progress";
import {
    TrendingUp,
    ShieldCheck,
    Target,
    Rocket,
    Zap,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    PieChart,
    User,
    Heart,
    Landmark
} from "lucide-react";
import { apiClient as api } from "@/lib/api-client";

interface OnboardingFlowProps {
    open: boolean;
    onComplete: () => void;
}

const steps = [
    {
        title: "Welcome to InvestingPro",
        description: "Let's personalize your wealth journey in 30 seconds.",
        icon: Rocket,
    },
    {
        title: "Your Financial Goal",
        description: "What's your primary objective for the next 12 months?",
        icon: Target,
    },
    {
        title: "Risk Tolerance",
        description: "How do you feel about market volatility?",
        icon: ShieldCheck,
    },
    {
        title: "Interests",
        description: "Which products would you like to explore first?",
        icon: PieChart,
    }
];

export default function OnboardingFlow({ open, onComplete }: OnboardingFlowProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        goal: '',
        risk: '',
        interests: [] as string[]
    });

    const progress = ((currentStep + 1) / steps.length) * 100;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            // Mock saving to metadata
            await api.auth.updateMe({
                onboarding_completed: true,
                financial_profile: formData
            });
            onComplete();
        } catch (error) {
            // Error handled gracefully - user can retry
        } finally {
            setLoading(false);
        }
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 rounded-xl p-0 overflow-hidden border-0 shadow-2xl">
                <div className="grid lg:grid-cols-5 min-h-[500px]">
                    {/* Sidebar */}
                    <div className="lg:col-span-2 bg-slate-900 p-8 text-white hidden lg:flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center mb-8 shadow-lg shadow-primary-500/20">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight mb-2">Build Your <br /> Alpha Profile</h2>
                            <p className="text-slate-600 text-sm font-medium">Join 2.5k+ investors making data-driven decisions.</p>
                        </div>

                        <div className="relative z-10 space-y-6">
                            {steps.map((s, i) => (
                                <div key={i} className={`flex items-center gap-4 transition-all duration-300 ${i === currentStep ? 'opacity-100 translate-x-1' : i < currentStep ? 'opacity-50' : 'opacity-20'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border ${i === currentStep ? 'bg-white text-slate-900 border-white' : 'border-white/50'}`}>
                                        {i < currentStep ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                    </div>
                                    <span className="text-[10px] uppercase font-bold tracking-[0.2em]">{s.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 p-10 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-10">
                                <Progress value={progress} className="h-1.5 flex-1 mr-4 bg-slate-100" />
                                <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-st">{Math.round(progress)}%</span>
                            </div>

                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-6">
                                    {React.createElement(steps[currentStep].icon, { className: "w-7 h-7 text-slate-900" })}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{steps[currentStep].title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">{steps[currentStep].description}</p>
                            </div>

                            <div className="mt-10 py-4 max-h-[240px] overflow-y-auto no-scrollbar">
                                {currentStep === 0 && (
                                    <div className="space-y-4">
                                        <p className="text-sm text-slate-600 font-medium">Click "Get Started" to begin your personalized financial audit.</p>
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { id: 'growth', label: 'Aggressive Capital Growth', sub: 'High risk, multi-bagger potential' },
                                            { id: 'income', label: 'Passive Income Stream', sub: 'Dividends & consistent yield' },
                                            { id: 'preservation', label: 'Capital Preservation', sub: 'Safety first, inflation beating' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setFormData({ ...formData, goal: opt.id })}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${formData.goal === opt.id
                                                    ? 'bg-primary-50 border-primary-500 shadow-lg shadow-primary-500/5'
                                                    : 'bg-white border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <p className="font-extrabold text-slate-900 text-sm">{opt.label}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">{opt.sub}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { id: 'conservative', label: 'Conservative', sub: 'Low volatility, stable bonds/FDs' },
                                            { id: 'moderate', label: 'Moderate', sub: 'Mix of equity and debt' },
                                            { id: 'aggressive', label: 'Aggressive', sub: 'Focus on small/mid caps & tech' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setFormData({ ...formData, risk: opt.id })}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${formData.risk === opt.id
                                                    ? 'bg-primary-50 border-primary-500 shadow-lg shadow-primary-500/5'
                                                    : 'bg-white border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <p className="font-extrabold text-slate-900 text-sm">{opt.label}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">{opt.sub}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'mf', label: 'Mutual Funds', icon: TrendingUp },
                                            { id: 'stocks', label: 'Stocks & IPOs', icon: Landmark },
                                            { id: 'insurance', label: 'Insurance', icon: Heart },
                                            { id: 'tax', label: 'Tax Savers', icon: Zap }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => toggleInterest(opt.id)}
                                                className={`p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-3 relative ${formData.interests.includes(opt.id)
                                                    ? 'bg-accent-50 border-accent-500 shadow-lg shadow-accent-500/5'
                                                    : 'bg-white border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.interests.includes(opt.id) ? 'bg-accent-500 text-white' : 'bg-slate-50 text-slate-600'}`}>
                                                    <opt.icon className="w-5 h-5" />
                                                </div>
                                                <span className="font-bold text-[10px] uppercase tracking-widest text-slate-900">{opt.label}</span>
                                                {formData.interests.includes(opt.id) && (
                                                    <div className="absolute top-2 right-2">
                                                        <CheckCircle2 className="w-4 h-4 text-accent-500" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 mt-10">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                className={`rounded-xl font-bold ${currentStep === 0 ? 'invisible' : ''}`}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                onClick={handleNext}
                                disabled={loading || (currentStep === 1 && !formData.goal) || (currentStep === 2 && !formData.risk)}
                                className="rounded-[1.25rem] bg-slate-900 hover:bg-primary-600 text-white font-bold px-10 h-14 flex-1 shadow-xl shadow-slate-900/10 transition-all active:scale-95"
                            >
                                {loading ? "Initializing..." : currentStep === steps.length - 1 ? "Complete Profile" : currentStep === 0 ? "Get Started" : "Continue"}
                                {!loading && <ChevronRight className="w-5 h-5 ml-2" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
