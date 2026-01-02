"use client";

import React from 'react';
import { ShieldCheck, Lock, Globe, Database, TrendingUp, RefreshCw } from 'lucide-react';

const trustSignals = [
    { icon: Database, label: "Data-Driven Analysis", desc: "Real-time market data" },
    { icon: RefreshCw, label: "Updated Regularly", desc: "Daily data refresh" },
    { icon: TrendingUp, label: "Institutional Grade", desc: "Professional tools" },
];

const TrustStrip = () => {
    return (
        <div className="w-full bg-slate-900 border-y border-white/5 py-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <span className="text-white font-semibold text- uppercase tracking-[0.2em]">Institutional Trust</span>
                        </div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Verified Financial Data & Analysis</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
                        {trustSignals.map((signal, i) => (
                            <div key={i} className="flex items-center gap-3 text-white/60">
                                <signal.icon className="w-5 h-5 text-emerald-500" />
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-[10px] uppercase tracking-wider leading-none">{signal.label}</span>
                                    <span className="text-slate-500 text-[9px] font-medium uppercase tracking-tighter">{signal.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <Lock className="w-4 h-4 text-blue-500" />
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-[10px] uppercase tracking-wider leading-none">AES-256</span>
                                <span className="text-slate-500 text-[9px] font-medium uppercase tracking-tighter">Bank-Grade encryption</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-emerald-500" />
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-[10px] uppercase tracking-wider leading-none">ISO 27001</span>
                                <span className="text-slate-500 text-[9px] font-medium uppercase tracking-tighter">Security Certified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrustStrip;
