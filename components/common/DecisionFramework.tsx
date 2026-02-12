"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    AlertCircle, 
    GitCompare, 
    CheckCircle2, 
    Rocket,
    ArrowRight,
    Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
    trackDecisionStage, 
    getCurrentStage, 
    hasCompletedStage,
    getNextAction,
    DecisionStage 
} from '@/lib/frameworks/decision-framework';
import DecisionCTA from './DecisionCTA';
import Link from 'next/link';

interface DecisionFrameworkProps {
    productId?: string;
    productName?: string;
    category?: 'credit-cards' | 'mutual-funds' | 'loans' | 'insurance';
    affiliateLink?: string;
    onStageChange?: (stage: DecisionStage) => void;
    className?: string;
    variant?: 'full' | 'compact' | 'inline';
}

const STAGES: Array<{
    id: DecisionStage;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}> = [
    {
        id: 'problem',
        label: 'Identify Your Need',
        description: 'Understand what you\'re looking for',
        icon: AlertCircle
    },
    {
        id: 'compare',
        label: 'Compare Options',
        description: 'See side-by-side comparisons',
        icon: GitCompare
    },
    {
        id: 'decide',
        label: 'Make Your Decision',
        description: 'Get personalized recommendations',
        icon: CheckCircle2
    },
    {
        id: 'apply',
        label: 'Apply Instantly',
        description: 'Complete your application',
        icon: Rocket
    }
];

/**
 * Decision Framework Component
 * 
 * Implements Problem → Compare → Decide → Apply framework
 * Tracks user journey and provides clear next steps
 */
export default function DecisionFramework({
    productId,
    productName,
    category,
    affiliateLink,
    onStageChange,
    className,
    variant = 'full'
}: DecisionFrameworkProps) {
    const [currentStage, setCurrentStage] = useState<DecisionStage>('problem');
    const [completedStages, setCompletedStages] = useState<Set<DecisionStage>>(new Set());

    useEffect(() => {
        // Initialize from session
        const stage = getCurrentStage();
        setCurrentStage(stage);

        // Mark completed stages
        const completed = new Set<DecisionStage>();
        STAGES.forEach(s => {
            if (hasCompletedStage(s.id)) {
                completed.add(s.id);
            }
        });
        setCompletedStages(completed);

        // Track current page view
        if (productId) {
            trackDecisionStage('compare', productId, category);
        }
    }, [productId, category]);

    const handleStageClick = (stage: DecisionStage) => {
        setCurrentStage(stage);
        trackDecisionStage(stage, productId, category);
        
        if (onStageChange) {
            onStageChange(stage);
        }
    };

    const nextAction = getNextAction(currentStage, category);
    const currentStageIndex = STAGES.findIndex(s => s.id === currentStage);

    if (variant === 'compact') {
        return (
            <Card className={cn("bg-primary-50 dark:bg-slate-900 border-primary-200 dark:border-slate-800 shadow-lg dark:shadow-slate-900/50", className)}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            {STAGES.map((stage, idx) => {
                                const StageIcon = stage.icon;
                                const isActive = stage.id === currentStage;
                                const isCompleted = completedStages.has(stage.id);
                                const isPast = idx < currentStageIndex;

                                return (
                                    <React.Fragment key={stage.id}>
                                        <div
                                            className={cn(
                                                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                                                isActive && "bg-primary-600 dark:bg-primary-700 text-white",
                                                isCompleted && !isActive && "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300",
                                                !isActive && !isCompleted && "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-600"
                                            )}
                                            onClick={() => handleStageClick(stage.id)}
                                        >
                                            {isCompleted ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <StageIcon className="w-4 h-4" />
                                            )}
                                            <span className="text-xs font-medium hidden sm:inline">{stage.label}</span>
                                        </div>
                                        {idx < STAGES.length - 1 && (
                                            <ArrowRight className="w-4 h-4 text-slate-600" />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                        {affiliateLink && currentStage === 'apply' && (
                            <DecisionCTA
                                text="Apply Now"
                                href={affiliateLink}
                                productId={productId}
                                variant="primary"
                                size="sm"
                                isExternal={true}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (variant === 'inline') {
        return (
            <div className={cn("flex items-center gap-2 text-sm", className)}>
                {STAGES.map((stage, idx) => {
                    const isActive = stage.id === currentStage;
                    const isCompleted = completedStages.has(stage.id);

                    return (
                        <React.Fragment key={stage.id}>
                            <div
                                className={cn(
                                    "flex items-center gap-1.5 px-2 py-1 rounded",
                                    isActive && "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium",
                                    isCompleted && !isActive && "text-success-600 dark:text-success-400",
                                    !isActive && !isCompleted && "text-slate-500 dark:text-slate-600"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="w-3 h-3" />
                                ) : (
                                    <span className="w-3 h-3 rounded-full border-2 border-current" />
                                )}
                                <span className="text-xs">{stage.label}</span>
                            </div>
                            {idx < STAGES.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-slate-600" />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }

    // Full variant
    return (
        <Card className={cn("bg-gradient-to-br from-primary-50 to-slate-50 dark:from-slate-900 dark:to-slate-950 border-primary-200 dark:border-primary-800", className)}>
            <CardContent className="p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Your Decision Journey
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-600">
                        Follow these steps to make the best financial decision
                    </p>
                </div>

                <div className="space-y-4">
                    {STAGES.map((stage, idx) => {
                        const StageIcon = stage.icon;
                        const isActive = stage.id === currentStage;
                        const isCompleted = completedStages.has(stage.id);
                        const isPast = idx < currentStageIndex;
                        const isUpcoming = idx > currentStageIndex;

                        return (
                            <div
                                key={stage.id}
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer",
                                    isActive && "border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20",
                                    isCompleted && !isActive && "border-success-300 dark:border-success-700 bg-success-50 dark:bg-success-900/10",
                                    !isActive && !isCompleted && "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                )}
                                onClick={() => handleStageClick(stage.id)}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                    isActive && "bg-primary-600 dark:bg-primary-500 text-white",
                                    isCompleted && !isActive && "bg-success-600 dark:bg-success-500 text-white",
                                    !isActive && !isCompleted && "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-600"
                                )}>
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <StageIcon className="w-5 h-5" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className={cn(
                                            "font-semibold",
                                            isActive && "text-primary-900 dark:text-primary-100",
                                            isCompleted && !isActive && "text-success-900 dark:text-success-100",
                                            !isActive && !isCompleted && "text-slate-700 dark:text-slate-300"
                                        )}>
                                            {stage.label}
                                        </h4>
                                        {isActive && (
                                            <Badge variant="secondary" className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                                                Current
                                            </Badge>
                                        )}
                                        {isCompleted && !isActive && (
                                            <Badge variant="secondary" className="bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300">
                                                Completed
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-600">
                                        {stage.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Next Action CTA */}
                {currentStage !== 'apply' && (
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                                    Next Step
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-600">
                                    {nextAction.cta}
                                </p>
                            </div>
                            <Link href={nextAction.href}>
                                <DecisionCTA
                                    text={nextAction.cta}
                                    href={nextAction.href}
                                    variant="primary"
                                    size="sm"
                                    showIcon={true}
                                />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Apply CTA (when at apply stage) */}
                {currentStage === 'apply' && affiliateLink && (
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-center">
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                                Ready to apply for {productName || 'this product'}?
                            </p>
                            <DecisionCTA
                                text="Apply Instantly"
                                href={affiliateLink}
                                productId={productId}
                                variant="primary"
                                size="lg"
                                className="w-full md:w-auto"
                                isExternal={true}
                                showIcon={true}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
