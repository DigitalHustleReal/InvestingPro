"use client";

import React from 'react';
import { Shield, TrendingUp, Users, Database, CheckCircle2 } from "lucide-react";

const trustPoints = [
    {
        icon: Database,
        stat: "5,000+",
        label: "Products Analyzed",
        description: "Comprehensive database of schemes & cards"
    },
    {
        icon: Users,
        stat: "50,000+",
        label: "Monthly Readers",
        description: "Trusted by India's smartest investors"
    },
    {
        icon: Shield,
        stat: "100%",
        label: "Unbiased",
        description: "Independent research, zero paid bias"
    },
    {
        icon: TrendingUp,
        stat: "Daily",
        label: "Market Scans",
        description: "Latest rates & product changes"
    }
];

export default function TrustSection() {
    return (
        <section className="relative py-24 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
            {/* Ambient Gradient Orbs - Restored & Adapted */}
            <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/50 dark:bg-blue-500/10 rounded-full blur-[100px]"></div>
                 <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-100/50 dark:bg-teal-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
                        Why Trust <span className="text-teal-600 dark:text-teal-400">InvestingPro?</span>
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
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-100 dark:bg-teal-500/10 rounded-xl mb-6 text-teal-600 dark:text-teal-400">
                                    <Icon className="w-7 h-7" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                    {point.stat}
                                </div>
                                <div className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-3 uppercase tracking-wider">
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
                            <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            <span className="text-sm">Independent Research</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            <span className="text-sm">No Paid Promotions</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            <span className="text-sm">Data-Driven Analysis</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            <span className="text-sm">Regular Updates</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

