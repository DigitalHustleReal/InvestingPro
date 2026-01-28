"use client";

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, TrendingUp, Calculator, Shield, Search, CheckCircle2, Sparkles, BadgeCheck, Clock, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AvatarStack } from "@/components/common/AvatarStack";

// Animated counter for stats
function AnimatedStat({ value, suffix = "" }: { value: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        
        return () => clearInterval(timer);
    }, [value]);
    
    return <span>{count.toLocaleString('en-IN')}{suffix}</span>;
}

export default function HeroSplit() {

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 pt-28 pb-16 lg:pt-36 lg:pb-24">
            {/* Background Effects - Enhanced */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-bl from-primary-100/60 via-secondary-50/30 to-transparent dark:from-primary-900/20 dark:via-secondary-900/10 rounded-full blur-3xl opacity-70 -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-emerald-50/50 via-cyan-50/30 to-transparent dark:from-emerald-900/10 dark:via-cyan-900/5 rounded-full blur-3xl opacity-60 translate-y-1/2 -translate-x-1/3" />
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
                
                {/* Grainy Noise Overlay */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none mix-blend-overlay"
                     style={{
                         backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                     }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Trust Banner - Above the fold credibility */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-12 text-xs sm:text-sm relative z-20"
                >
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <BadgeCheck className="w-4 h-4 text-emerald-500" />
                        <span>100% Free Forever</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span>Unbiased Research</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>Updated Daily</span>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* Left Column: Value Prop - COMPLETELY REDESIGNED */}
                    <div className="lg:w-1/2 text-center lg:text-left space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Benefit-focused headline with staggered animation - SOLID COLOR for readability */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 dark:text-white leading-[1.08] tracking-tight">
                                <motion.span
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="inline"
                                >
                                    Make
                                </motion.span>
                                {' '}
                                <motion.span
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="inline"
                                >
                                    Smarter
                                </motion.span>
                                <br className="hidden sm:block" />
                                <span className="relative inline-block">
                                    <motion.span 
                                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
                                        className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 animate-gradient-x"
                                        style={{ backgroundSize: '200% auto' }}
                                    >
                                        Money Decisions
                                    </motion.span>
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: 0.8 }}
                                    >
                                        <Sparkles className="absolute -top-2 -right-6 w-5 h-5 text-amber-400 animate-pulse" />
                                    </motion.span>
                                </span>
                            </h1>
                            
                            {/* Quantified expertise - what makes us credible */}
                            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed mt-6 mx-auto lg:mx-0">
                                We analyzed <span className="font-bold text-slate-900 dark:text-white">500+ credit cards</span>, 
                                <span className="font-bold text-slate-900 dark:text-white"> 2,000+ mutual funds</span>, and 
                                <span className="font-bold text-slate-900 dark:text-white"> 50+ loan products</span> so you don't have to.
                            </p>
                            
                            {/* What you'll get - outcome focused */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-6 text-sm">
                                {[
                                    "Find the perfect card in 2 minutes",
                                    "Save up to ₹50,000/year on fees",
                                    "Zero ads, zero bias"
                                ].map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Search Bar with Clean Design */}
                            <div className="relative max-w-lg mt-8 mx-auto lg:mx-0">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-primary-700 dark:text-primary-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search cards, funds, calculators..."
                                    className="w-full h-14 sm:h-16 pl-12 pr-28 sm:pr-32 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20 text-base"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            window.location.href = `/search?q=${(e.target as HTMLInputElement).value}`;
                                        }
                                    }}
                                />
                                <div className="absolute inset-y-0 right-2 flex items-center">
                                    <Button variant="default" className="bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-xl text-xs shadow-lg hover:shadow-primary-900/40 transition-all active:scale-95 whitespace-nowrap h-8 sm:h-9 px-3 sm:px-4">
                                        Search
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Quick Action Chips */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-4">
                                <span className="text-xs text-slate-500 dark:text-slate-400">Popular:</span>
                                {["Best Rewards Cards", "Tax Saving Funds", "SIP Calculator", "Home Loan EMI"].map((chip, i) => (
                                    <Link 
                                        key={i}
                                        href={`/search?q=${encodeURIComponent(chip)}`}
                                        className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors"
                                    >
                                        {chip}
                                    </Link>
                                ))}
                            </div>
                            
                            {/* Social Proof - Real Human Headshots */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <AvatarStack size={36} limit={4} />
                                    <div className="text-left">
                                        <div className="flex items-center gap-1">
                                            {[1,2,3,4,5].map((i) => (
                                                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            ))}
                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">4.9</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Trusted by <span className="font-semibold text-slate-700 dark:text-slate-200">50,000+</span> users
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Outcome stat */}
                                <div className="hidden sm:block h-10 w-px bg-slate-200 dark:bg-slate-800" />
                                <div className="text-center sm:text-left">
                                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                        ₹<AnimatedStat value={12} />Cr+
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Saved by our users</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Product Showcase - COMPLETELY REDESIGNED */}
                    <div className="lg:w-1/2 w-full">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {/* Featured Product Card - With Thin Animated Running Border */}
                            <div className="relative mb-4 group">
                                {/* Thin animated running gradient border */}
                                <div 
                                    className="absolute -inset-[1px] rounded-3xl"
                                    style={{
                                        background: 'linear-gradient(90deg, #14b8a6, #06b6d4, #8b5cf6, #ec4899, #f59e0b, #14b8a6)',
                                        backgroundSize: '300% 100%',
                                        animation: 'gradient-border 4s linear infinite',
                                    }}
                                />
                                <Link href="/credit-cards" className="block relative">
                                    <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                        {/* Background Pattern */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-100/50 dark:from-primary-900/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                                        
                                        <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                                            {/* Icon */}
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                                <CreditCard className="w-8 h-8 text-white" />
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-900 rounded-full shadow-sm">Most Popular</span>
                                                </div>
                                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                    Find Your Perfect Credit Card
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                                                    Compare 500+ cards from 30+ banks. Get personalized recommendations based on your spending habits.
                                                </p>
                                                
                                                {/* Outcome chips */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {["Up to 5% Cashback", "₹1L+ Welcome Bonus", "Zero Annual Fee"].map((chip, i) => (
                                                        <span key={i} className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                                                            {chip}
                                                        </span>
                                                    ))}
                                                </div>
                                                
                                                <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
                                                    Compare Cards Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            
                            {/* Secondary Cards Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <SecondaryCard 
                                    title="Mutual Funds"
                                    desc="2,000+ funds analyzed"
                                    outcome="Build long-term wealth"
                                    icon={TrendingUp}
                                    href="/mutual-funds"
                                    iconBg="linear-gradient(135deg, #059669 0%, #0d9488 100%)"
                                    delay={0.3}
                                />
                                <SecondaryCard 
                                    title="Calculators"
                                    desc="15+ free tools"
                                    outcome="Plan your finances"
                                    icon={Calculator}
                                    href="/calculators"
                                    iconBg="linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"
                                    delay={0.4}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SecondaryCard({ title, desc, outcome, icon: Icon, href, iconBg, delay }: { 
    title: string; 
    desc: string; 
    outcome: string;
    icon: any; 
    href: string; 
    iconBg: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
        >
            <Link href={href} className="block group h-full">
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden group-hover:border-slate-300 dark:group-hover:border-slate-700">
                    
                    <div className="relative z-10">
                        {/* Icon - Gradient background */}
                        <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                            style={{ background: iconBg }}
                        >
                            <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                            {desc}
                        </p>
                        
                        {/* Outcome */}
                        <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            {outcome}
                        </div>
                        
                        {/* Arrow indicator */}
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <ChevronRight className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
