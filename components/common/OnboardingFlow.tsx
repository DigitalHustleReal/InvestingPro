"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
    Sparkles,
    FileText,
    Star,
    Calculator,
    TrendingUp,
    User,
    CheckCircle2,
    ArrowRight
} from "lucide-react";
import { api } from "@/lib/api";

const steps = [
    {
        id: 1,
        title: "Welcome to InvestingPro! 🎉",
        description: "Your personal finance companion for smart investing decisions",
        icon: Sparkles,
        content: (
            <div className="space-y-4">
                <p className="text-slate-600">
                    We're excited to have you here! InvestingPro helps you make informed investment decisions with:
                </p>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                        <span className="text-slate-700">Compare 5000+ mutual funds, stocks, and credit cards</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                        <span className="text-slate-700">Free financial calculators and tools</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                        <span className="text-slate-700">Expert articles and community reviews</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                        <span className="text-slate-700">Personalized investment recommendations</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: 2,
        title: "Share Your Knowledge",
        description: "Contribute to our growing community",
        icon: FileText,
        content: (
            <div className="space-y-4">
                <p className="text-slate-600">
                    Become a contributor and share your investment insights!
                </p>
                <div className="grid gap-4">
                    <Card className="bg-gradient-to-br from-primary-50 to-indigo-50 border-secondary-200">
                        <CardContent className="p-6 md:p-8">
                            <div className="flex items-start gap-3">
                                <FileText className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-secondary-900 mb-1">Write Articles</h4>
                                    <p className="text-sm text-secondary-700">Share your investment knowledge and earn 50 points per published article</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-accent-50 to-orange-50 border-accent-200">
                        <CardContent className="p-6 md:p-8">
                            <div className="flex items-start gap-3">
                                <Star className="w-6 h-6 text-accent-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-accent-900 mb-1">Write Reviews</h4>
                                    <p className="text-sm text-accent-700">Review products you've used and help others make better decisions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    },
    {
        id: 3,
        title: "Powerful Financial Tools",
        description: "Plan your investments with precision",
        icon: Calculator,
        content: (
            <div className="space-y-4">
                <p className="text-slate-600">
                    Access free calculators to plan your financial future:
                </p>
                <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Calculator className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">SIP Calculator</p>
                            <p className="text-sm text-slate-500">Plan your systematic investments</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-secondary-600" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">Risk Profiler</p>
                            <p className="text-sm text-slate-500">Discover your investment personality</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                            <Calculator className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">EMI Calculator</p>
                            <p className="text-sm text-slate-500">Calculate loan repayments</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 4,
        title: "Complete Your Profile",
        description: "Get personalized recommendations",
        icon: User,
        content: (
            <div className="space-y-4">
                <p className="text-slate-600">
                    Help us personalize your experience by completing your profile:
                </p>
                <div className="space-y-3">
                    <Link href="/profile">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary-200 bg-gradient-to-br from-primary-50 to-success-50">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-primary-600" />
                                        <span className="font-medium text-slate-900">Add Bio & Profile Picture</span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/risk-assessment">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-secondary-200 bg-gradient-to-br from-purple-50 to-pink-50">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-5 h-5 text-secondary-600" />
                                        <span className="font-medium text-slate-900">Take Risk Profiler Assessment</span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
                <p className="text-sm text-slate-500 text-center mt-6">
                    You can complete these steps anytime from your profile
                </p>
            </div>
        )
    }
];

interface OnboardingFlowProps {
    open: boolean;
    onComplete: () => void;
}

export default function OnboardingFlow({ open, onComplete }: OnboardingFlowProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = async () => {
        try {
            await api.auth.updateMe({ onboarding_completed: true });
            onComplete();
        } catch (error) {
            // Error handled gracefully - complete onboarding anyway
            onComplete();
        }
    };

    const step = steps[currentStep];
    const StepIcon = step.icon;

    return (
        <Dialog open={open} onOpenChange={handleSkip}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-2 sm:p-6">
                    {/* Progress */}
                    <div className="flex gap-2 mb-6">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`flex-1 h-1.5 rounded-full transition-colors ${idx <= currentStep ? 'bg-primary-600' : 'bg-slate-200'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-success-600 flex items-center justify-center mb-6 mx-auto">
                        <StepIcon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h2>
                        <p className="text-slate-600">{step.description}</p>
                    </div>

                    <div className="mb-8">
                        {step.content}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleSkip}
                            className="flex-1"
                        >
                            Skip Tour
                        </Button>
                        <Button
                            onClick={handleNext}
                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                        >
                            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                        </Button>
                    </div>

                    {/* Step counter */}
                    <p className="text-center text-sm text-slate-400 mt-4">
                        Step {currentStep + 1} of {steps.length}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
