"use client";

import React, { useState } from 'react';
import { Question, Answer, calculateRiskScore, getRiskProfile, QUESTIONS } from '@/lib/risk-calculator';
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/progress";
import RiskResult from './RiskResult';
import { ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RiskQuestionnaire() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [isComplete, setIsComplete] = useState(false);

    const currentQuestion = QUESTIONS[currentStep];
    const progress = ((currentStep) / QUESTIONS.length) * 100;

    const handleAnswer = (score: number) => {
        const newAnswers = { ...answers, [currentQuestion.id]: score };
        setAnswers(newAnswers);

        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handleRetake = () => {
        setAnswers({});
        setCurrentStep(0);
        setIsComplete(false);
    };

    if (isComplete) {
        const score = calculateRiskScore(answers);
        const profile = getRiskProfile(score);
        return <RiskResult score={score} profile={profile} onRetake={handleRetake} />;
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
                    <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2 bg-slate-100 dark:bg-slate-800" indicatorClassName="bg-primary-600" />
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200 dark:border-slate-800 p-8 min-h-[400px] flex flex-col justify-center animate-slide-up">
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center leading-tight">
                    {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.answers.map((answer, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(answer.score)}
                            className={cn(
                                "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                                "border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10"
                            )}
                        >
                            <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-700 dark:group-hover:text-primary-300 text-lg">
                                {answer.text}
                            </span>
                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-primary-500 group-hover:bg-primary-500 flex items-center justify-center transition-colors">
                                <Check className="w-3 h-3 text-white opacity-0 group-hover:opacity-100" />
                            </div>
                        </button>
                    ))}
                </div>

                {currentStep > 0 && (
                    <div className="mt-8">
                         <Button 
                            variant="ghost" 
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            className="text-slate-600 hover:text-slate-600"
                        >
                            Back to previous question
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
