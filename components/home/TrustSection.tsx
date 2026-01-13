"use client";

import React from 'react';
import { Shield, TrendingUp, Users, Database, CheckCircle2, Star } from "lucide-react";
import { getDisplayStats } from '@/lib/platform-stats';
import { AnimatedCounter } from '../common/AnimatedCounter';

import { DotPattern } from "@/components/common/Patterns";

export default function TrustSection() {
    const stats = getDisplayStats();
    
    const trustPoints = [
        {
            icon: Database,
            value: stats.productsAnalyzed.value,
            display: stats.productsAnalyzed.display,
            label: stats.productsAnalyzed.label,
            description: stats.productsAnalyzed.description,
            animated: true
        },
        {
            icon: Users,
            value: stats.monthlyUsers.value,
            display: stats.monthlyUsers.display,
            label: stats.monthlyUsers.label,
            description: stats.monthlyUsers.description,
            animated: true
        },
        {
            icon: Star,
            value: stats.averageRating.value,
            display: `${stats.averageRating.display}/5`,
            label: stats.averageRating.label,
            description: stats.averageRating.description,
            animated: true,
            decimals: 1
        },
        {
            icon: TrendingUp,
            value: 0, // Not animated
            display: stats.marketScans.display,
            label: stats.marketScans.label,
            description: stats.marketScans.description,
            animated: false
        }
    ];

    return (
        <section className="relative py-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
            {/* Ambient Gradient Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                 <DotPattern className="text-slate-200 dark:text-slate-800/80 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                 <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary-100/50 dark:bg-secondary-500/10 rounded-full blur-[100px]"></div>
                 <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-100/50 dark:bg-primary-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
                        Why Trust <span className="text-primary-600 dark:text-primary-400">InvestingPro?</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        We're an independent research platform, not a SEBI registered advisor. We help you make informed decisions with unbiased data.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {trustPoints.map((point, index) => {
                        const Icon = point.icon;
                        return (
                            <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800/50 hover:shadow-lg dark:hover:shadow-none transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 dark:bg-primary-500/10 rounded-xl mb-6 text-primary-600 dark:text-primary-400">
                                    <Icon className="w-7 h-7" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                    {point.animated && point.value > 0 ? (
                                        <AnimatedCounter 
                                            end={point.value} 
                                            duration={2000}
                                            decimals={point.decimals || 0}
                                            suffix={point.decimals ? '/5' : ''}
                                        />
                                    ) : (
                                        point.display
                                    )}
                                </div>
                                <div className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3 uppercase tracking-wider">
                                    {point.label}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {point.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Trust Badges */}
                <div className="mt-12 pt-12 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            <span className="text-sm">Independent Research</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            <span className="text-sm">No Paid Promotions</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            <span className="text-sm">Data-Driven Analysis</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            <span className="text-sm">Regular Updates</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
