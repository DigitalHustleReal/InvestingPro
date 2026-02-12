"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Calculator, CreditCard, Shield, Star, Zap } from 'lucide-react';

/**
 * Premium Mobile App Coming Soon Component
 * Shows a beautiful "Coming Soon" message with realistic mobile platform preview
 */
export default function MobileAppComingSoon() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[100px]" />
                {/* Subtle grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
                    
                    {/* Left: Content */}
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
                                <Zap className="w-4 h-4 text-primary-400" />
                                <span className="text-primary-400 text-sm font-bold uppercase tracking-wider">
                                    Coming Soon
                                </span>
                            </div>

                            {/* Headline */}
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                                Mobile App
                                <br />
                                <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent">
                                    On The Way
                                </span>
                            </h2>

                            {/* Description */}
                            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                We're building a beautiful mobile experience. Get instant access to financial insights, 
                                personalized recommendations, and smart tools—right in your pocket.
                            </p>

                            {/* Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-xl mx-auto lg:mx-0">
                                {[
                                    { icon: TrendingUp, text: 'Real-time comparisons' },
                                    { icon: Zap, text: 'Instant calculators' },
                                    { icon: Shield, text: 'Personalized picks' },
                                    { icon: Star, text: 'Deal notifications' }
                                ].map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1, duration: 0.4 }}
                                        className="flex items-center gap-3 text-slate-200 bg-white/5 rounded-lg px-4 py-3 border border-white/10"
                                    >
                                        <feature.icon className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                        <span className="text-sm font-medium">{feature.text}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Notify Me CTA */}
                            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto lg:mx-0">
                                <div className="relative flex-1 w-full">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full h-14 px-5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all backdrop-blur-sm"
                                    />
                                </div>
                                <button className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all whitespace-nowrap hover:scale-105 active:scale-95">
                                    Notify Me
                                </button>
                            </div>

                            <p className="text-xs text-slate-600 mt-4">
                                Be the first to know when we launch. No spam, ever.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right: Premium Mobile Mockup */}
                    <div className="lg:w-1/2 w-full flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative w-full max-w-[340px]"
                        >
                            {/* Glow Effect */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/30 to-secondary-500/30 rounded-[4rem] blur-3xl opacity-60" />
                            
                            {/* Phone Frame */}
                            <div className="relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-[3rem] p-3 shadow-2xl ring-1 ring-white/10">
                                {/* Phone Screen */}
                                <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-inner">
                                    {/* Notch */}
                                    <div className="h-9 bg-slate-950 flex items-center justify-center relative">
                                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-800 rounded-full" />
                                        <div className="absolute top-2.5 left-6 w-1.5 h-1.5 bg-slate-700 rounded-full" />
                                    </div>

                                    {/* Screen Content - Platform Preview */}
                                    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 h-[580px] overflow-hidden">
                                        {/* Status Bar */}
                                        <div className="px-6 py-2 flex items-center justify-between text-white text-xs">
                                            <span className="font-semibold">9:41</span>
                                            <div className="flex items-center gap-1">
                                                <div className="w-4 h-3 border border-white/40 rounded-sm relative">
                                                    <div className="absolute inset-0.5 bg-white/60 rounded-sm" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hero Section Preview */}
                                        <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 px-6 pt-6 pb-10 relative overflow-hidden">
                                            {/* Background pattern */}
                                            <div className="absolute inset-0 opacity-10">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:24px_24px]" />
                                            </div>
                                            
                                            <div className="relative">
                                                {/* Header */}
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="text-xl font-bold text-white">InvestingPro</div>
                                                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30" />
                                                </div>
                                                
                                                {/* Title */}
                                                <h1 className="text-2xl font-black text-white leading-tight mb-2">
                                                    Smart Financial
                                                    <br />Decisions
                                                </h1>
                                                <p className="text-sm text-white/90 mb-5 font-medium">
                                                    Compare • Analyze • Decide
                                                </p>
                                                
                                                {/* Search Bar */}
                                                <div className="relative">
                                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                                    <div className="w-full h-12 bg-white rounded-xl flex items-center px-4 pl-11 shadow-lg">
                                                        <span className="text-sm text-slate-600">Search products...</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Stats */}
                                        <div className="px-6 py-5 bg-slate-900">
                                            <div className="grid grid-cols-3 gap-2 mb-5">
                                                {[
                                                    { value: '500+', label: 'Cards', color: 'from-blue-500 to-cyan-500' },
                                                    { value: '2K+', label: 'Funds', color: 'from-emerald-500 to-teal-500' },
                                                    { value: '15+', label: 'Tools', color: 'from-amber-500 to-orange-500' }
                                                ].map((stat, i) => (
                                                    <div key={i} className="text-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                                        <div className={`text-lg font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                                            {stat.value}
                                                        </div>
                                                        <div className="text-[10px] text-slate-600 font-medium mt-0.5">
                                                            {stat.label}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Category Cards */}
                                            <div className="space-y-3">
                                                {[
                                                    { 
                                                        name: 'Credit Cards', 
                                                        desc: 'Compare & Apply',
                                                        gradient: 'from-blue-500 to-cyan-500',
                                                        icon: CreditCard
                                                    },
                                                    { 
                                                        name: 'Mutual Funds', 
                                                        desc: 'Invest Smarter',
                                                        gradient: 'from-emerald-500 to-teal-500',
                                                        icon: TrendingUp
                                                    },
                                                    { 
                                                        name: 'Calculators', 
                                                        desc: 'Plan Finances',
                                                        gradient: 'from-amber-500 to-orange-500',
                                                        icon: Calculator
                                                    }
                                                ].map((cat, i) => (
                                                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg`}>
                                                            <cat.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-white text-sm">{cat.name}</div>
                                                            <div className="text-xs text-slate-600">{cat.desc}</div>
                                                        </div>
                                                        <div className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Home Indicator */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
