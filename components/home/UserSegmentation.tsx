"use client";

import React from 'react';
import {
    UserPlus,
    Target,
    TrendingUp,
    ShieldCheck,
    ChevronRight,
    Zap,
    ArrowRight
} from 'lucide-react';
import { Button } from "@/components/ui/Button";
import Link from 'next/link';

const UserSegmentation = () => {
    const personas = [
        {
            title: "New to Investing",
            desc: "Start with low-risk funds and build your first ₹1 Lakh portfolio.",
            icon: UserPlus,
            color: "text-secondary-400",
            bg: "bg-secondary-500/10",
            border: "border-secondary-500/20",
            link: "/risk-profiler",
            tag: "Safe Start"
        },
        {
            title: "Tax-Saving Focused",
            desc: "Maximize Section 80C benefits with ELSS, PPF, and NPS shortlists.",
            icon: ShieldCheck,
            color: "text-primary-400",
            bg: "bg-primary-500/10",
            border: "border-primary-500/20",
            link: "/ppf-nps",
            tag: "80C Shield"
        },
        {
            title: "Goal-Based Investor",
            desc: "Planned SIPs for retirement, home buying, or children's education.",
            icon: Target,
            color: "text-secondary-400",
            bg: "bg-secondary-500/10",
            border: "border-secondary-500/20",
            link: "/calculators",
            tag: "Future Proof"
        },
        {
            title: "Active Trader",
            desc: "Compare high-speed brokers and access technical screeners.",
            icon: TrendingUp,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            link: "/demat-accounts",
            tag: "Alpha Seeker"
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
                            <Zap size={14} className="text-amber-400" />
                            Personalized Experience
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                            What describes you <span className="text-primary-500">best?</span>
                        </h2>
                        <p className="text-lg text-slate-400 font-medium">
                            Route yourself to the right tools and research hubs designed for your specific financial stage.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {personas.map((item, i) => (
                        <Link
                            key={i}
                            href={item.link}
                            className={`group p-8 rounded-[2rem] bg-slate-900/40 border ${item.border} hover:bg-slate-900 transition-all duration-300 flex flex-col h-full`}
                        >
                            <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} mb-6 group-hover:scale-110 transition-transform`}>
                                <item.icon size={28} />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
                                    <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${item.bg} ${item.color}`}>
                                        {item.tag}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed mb-8">
                                    {item.desc}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-white text-sm font-bold group-hover:text-primary-400 transition-colors">
                                Get Started <ArrowRight size={16} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UserSegmentation;
