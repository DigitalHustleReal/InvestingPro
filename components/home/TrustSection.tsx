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
        label: "Real-Time",
        description: "Live market data and rate updates"
    }
];

export default function TrustSection() {
    return (
        <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
            {/* Geometric Background Layer */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Dot Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.1]" style={{ 
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', 
                    backgroundSize: '32px 32px' 
                }}></div>
                {/* Ambient Orbs */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-extrabold mb-6 tracking-tight">
                        Why Trust <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">InvestingPro?</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        We're an independent research platform, not a SEBI registered advisor. We help you make informed decisions with unbiased data.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trustPoints.map((point, index) => {
                        const Icon = point.icon;
                        return (
                            <div key={index} className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 hover:bg-slate-800/60 transition-all duration-300 hover:-translate-y-1">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Icon className="w-24 h-24 text-teal-500 rotate-[-15deg] translate-x-4 -translate-y-4" />
                                </div>
                                
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                        <Icon className="w-7 h-7 text-teal-400" />
                                    </div>
                                    <div className="text-3xl font-extrabold text-white mb-2">
                                        {point.stat}
                                    </div>
                                    <div className="text-base font-semibold text-teal-400 mb-3 tracking-wide uppercase text-xs">
                                        {point.label}
                                    </div>
                                    <p className="text-sm text-slate-400 text-center leading-relaxed">
                                        {point.description}
                                    </p>
                                </div>
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

