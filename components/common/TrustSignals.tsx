"use client";

import React from 'react';
import { Shield, Award, CheckCircle2, TrendingUp, Users, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustSignal {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    color?: string;
}

interface TrustSignalsProps {
    variant?: 'compact' | 'full';
    className?: string;
    showStats?: boolean;
}

/**
 * Trust Signals Component
 * Displays credibility indicators (stats, credentials, awards)
 * Builds trust and authority
 */
export default function TrustSignals({
    variant = 'compact',
    className,
    showStats = true
}: TrustSignalsProps) {
    // Default trust signals (can be customized based on actual data)
    const signals: TrustSignal[] = [
        {
            icon: Users,
            label: "Users Helped",
            value: "100K+",
            color: "text-primary-600 dark:text-primary-400"
        },
        {
            icon: TrendingUp,
            label: "Products Compared",
            value: "1000+",
            color: "text-secondary-600 dark:text-secondary-400"
        },
        {
            icon: CheckCircle2,
            label: "Expert Reviewed",
            value: "Yes",
            color: "text-success-600 dark:text-success-400"
        },
        {
            icon: Shield,
            label: "100% Independent",
            value: "Yes",
            color: "text-warning-600 dark:text-warning-400"
        }
    ];

    if (variant === 'compact') {
        return (
            <div className={cn("flex flex-wrap items-center gap-4", className)}>
                {signals.slice(0, 3).map((signal, idx) => {
                    const Icon = signal.icon;
                    return (
                        <div key={idx} className="flex items-center gap-2">
                            <Icon className={cn("w-4 h-4", signal.color || "text-slate-600 dark:text-slate-400")} />
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 dark:text-slate-400">{signal.label}</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{signal.value}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Full variant
    return (
        <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
            {signals.map((signal, idx) => {
                const Icon = signal.icon;
                return (
                    <div 
                        key={idx} 
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-center"
                    >
                        <div className="flex justify-center mb-2">
                            <div className={cn("p-2 rounded-lg bg-slate-50 dark:bg-slate-800", signal.color ? `bg-${signal.color.split('-')[1]}-50 dark:bg-${signal.color.split('-')[1]}-900/20` : "")}>
                                <Icon className={cn("w-5 h-5", signal.color || "text-slate-600 dark:text-slate-400")} />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            {signal.value}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                            {signal.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
