"use client";

import React from 'react';
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, TrendingUp, Calculator, Shield, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HeroSplit() {
    return (
        <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-32 pb-20 lg:pt-40 lg:pb-32">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary-50/50 to-transparent dark:from-primary-900/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-secondary-50/50 to-transparent dark:from-secondary-900/10 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Left Column: Value Prop */}
                    <div className="lg:w-1/2 text-left space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-widest mb-6">
                                <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                                Updated for 2026
                            </div>
                            
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                                Compare. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                                    Decide.
                                </span> <br />
                                Apply.
                            </h1>
                            
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed mt-6">
                                India's smartest financial decision engine. Compare 1000+ credit cards, mutual funds, and loans with 
                                <span className="font-bold text-slate-900 dark:text-white"> Real-Time Data</span>.
                            </p>
                            
                            {/* Search Bar */}
                            <div className="relative max-w-md mt-10">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for 'HDFC Regalia' or 'SIP'..."
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 transition-all font-medium"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            window.location.href = `/credit-cards?q=${(e.target as HTMLInputElement).value}`;
                                        }
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Decision Engine Grid */}
                    <div className="lg:w-1/2 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Card 1: Credit Cards (Primary) */}
                            <DecisionCard 
                                title="Find a Credit Card"
                                desc="Get matched based on spend"
                                icon={CreditCard}
                                href="/credit-cards"
                                color="bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                                delay={0.1}
                            />
                            
                            {/* Card 2: Mutual Funds */}
                            <DecisionCard 
                                title="Start Investing"
                                desc="SIPs & Long-term Wealth"
                                icon={TrendingUp}
                                href="/mutual-funds"
                                color="bg-success-50 dark:bg-success-900/20 text-success-600"
                                delay={0.2}
                            />
                            
                            {/* Card 3: Calculator Tools */}
                            <DecisionCard 
                                title="Calculators"
                                desc="EMI, Tax, PPF & More"
                                icon={Calculator}
                                href="/calculators"
                                color="bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600"
                                delay={0.3}
                            />
                             
                             {/* Card 4: Insurance/Loans */}
                            <DecisionCard 
                                title="Check Compliance"
                                desc="Safe & Registered Advice"
                                icon={Shield}
                                href="/disclaimer"
                                color="bg-accent-50 dark:bg-accent-900/20 text-accent-600"
                                delay={0.4}
                            />
                        </div>
                        
                        {/* Trust Signal on Grid */}
                        <div className="text-center mt-8">
                            <p className="text-sm font-semibold text-slate-400">
                                Trusted by <span className="text-slate-900 dark:text-white">50,000+ Indians</span> this month
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function DecisionCard({ title, desc, icon: Icon, href, color, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay, duration: 0.4 }}
        >
            <Link href={href} className="block group">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full relative overflow-hidden">
                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                        <Icon className="w-24 h-24" />
                    </div>
                    
                    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {desc}
                    </p>
                    
                    <div className="mt-4 flex items-center text-sm font-bold text-primary-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                        Start Now <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
