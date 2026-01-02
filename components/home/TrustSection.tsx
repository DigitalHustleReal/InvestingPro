"use client";

import React from 'react';
import { Shield, TrendingUp, Users, Database, CheckCircle2 } from "lucide-react";

const trustPoints = [
    {
        icon: Database,
        stat: "10,000+",
        label: "Products Compared",
        description: "Comprehensive database of financial products"
    },
    {
        icon: Users,
        stat: "5,000+",
        label: "Active Users",
        description: "Trusted by thousands of investors"
    },
    {
        icon: Shield,
        stat: "100%",
        label: "Unbiased Data",
        description: "Independent research, no paid promotions"
    },
    {
        icon: TrendingUp,
        stat: "Daily",
        label: "Updated",
        description: "Fresh data and latest rates"
    }
];

export default function TrustSection() {
    return (
        <section className="py-16 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                        Why Trust InvestingPro?
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        We're an independent research platform, not a SEBI registered advisor. We help you make informed decisions with unbiased data.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {trustPoints.map((point, index) => {
                        const Icon = point.icon;
                        return (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/10 rounded-2xl mb-4">
                                    <Icon className="w-8 h-8 text-teal-400" />
                                </div>
                                <div className="text-4xl font-bold text-white mb-2">
                                    {point.stat}
                                </div>
                                <div className="text-lg font-semibold text-teal-400 mb-2">
                                    {point.label}
                                </div>
                                <p className="text-sm text-slate-400">
                                    {point.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Trust Badges */}
                <div className="mt-12 pt-12 border-t border-slate-800">
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <div className="flex items-center gap-2 text-slate-400">
                            <CheckCircle2 className="w-5 h-5 text-teal-400" />
                            <span className="text-sm">Independent Research</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <CheckCircle2 className="w-5 h-5 text-teal-400" />
                            <span className="text-sm">No Paid Promotions</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <CheckCircle2 className="w-5 h-5 text-teal-400" />
                            <span className="text-sm">Data-Driven Analysis</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <CheckCircle2 className="w-5 h-5 text-teal-400" />
                            <span className="text-sm">Regular Updates</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

