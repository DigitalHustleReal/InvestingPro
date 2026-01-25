"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Shield, Users, TrendingUp, Award } from 'lucide-react';
import { GaugeMeter } from "@/components/ui/GaugeMeter";

export default function TrustBar() {
    const stats = [
        {
            label: "Community Members",
            value: "50k+",
            icon: Users,
            color: "text-primary-600",
            bg: "bg-primary-50 dark:bg-primary-900/10"
        },
        {
            label: "Credit Value Tracked",
            value: "₹500Cr+",
            icon: TrendingUp,
            color: "text-success-600",
            bg: "bg-success-50 dark:bg-success-900/10"
        },
        {
            label: "Partner Banks",
            value: "50+",
            icon: Shield,
            color: "text-accent-600",
            bg: "bg-accent-50 dark:bg-accent-900/10"
        },
        {
            label: "Expert Reviews",
            value: "1000+",
            icon: Award,
            color: "text-secondary-600",
            bg: "bg-secondary-50 dark:bg-secondary-900/10"
        }
    ];

    return (
        <section className="py-8 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-4 group"
                        >
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">
                                    {stat.value}
                                </h4>
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                    {stat.label}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Media Mentions (Audit Section 6: Social Proof) */}
                <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                        As Seen In
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Featured Logos (Text placeholders for now) */}
                        <span className="text-lg font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 pointer-events-none select-none">Economic Times</span>
                        <span className="text-lg font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 pointer-events-none select-none">LiveMint</span>
                        <span className="text-lg font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 pointer-events-none select-none">MoneyControl</span>
                        <span className="text-lg font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 pointer-events-none select-none">CNBC TV18</span>
                        <span className="text-lg font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 pointer-events-none select-none">Business Standard</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
