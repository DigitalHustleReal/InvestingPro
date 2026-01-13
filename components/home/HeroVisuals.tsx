"use client";

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Shield, TrendingUp, Award, CreditCard, Landmark, Calculator, Check, PieChart, BarChart3, Lock } from "lucide-react";
import { PLATFORM_STATS } from "@/lib/constants/platform-stats";

interface HeroVisualsProps {
    currentSlide: string;
}

export default function HeroVisuals({ currentSlide }: HeroVisualsProps) {
    return (
        <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
            <AnimatePresence mode="wait">
                {/* 1. CREDIT CARDS VISUAL */}
                {currentSlide === 'credit-cards' && (
                    <motion.div
                        key="credit-cards"
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-80 h-52 lg:w-96 lg:h-60"
                    >
                        {/* Back Card (Gold/Platinum) */}
                        <motion.div 
                            animate={{ y: [0, -10, 0], rotate: [-6, -8, -6] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute top-0 right-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl skew-x-1"
                        >
                            <div className="absolute top-6 right-6 text-slate-500 italic font-serif opacity-50 text-xl">Platinum</div>
                            <div className="absolute bottom-6 left-6 flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/10" />
                                <div className="w-8 h-8 rounded-full bg-white/5 -ml-4" />
                            </div>
                        </motion.div>

                        {/* Front Card (Premium Blue/Teal) */}
                        <motion.div 
                            animate={{ y: [0, -15, 0], rotate: [3, 5, 3] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.2 }}
                            className="absolute top-4 -left-4 w-full h-full rounded-2xl bg-gradient-to-br from-secondary-600 to-primary-600 shadow-[0_20px_50px_-12px_rgba(13,148,136,0.5)] border-t border-white/20"
                        >
                            <div className="p-6 h-full flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                                
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-8 bg-white/20 rounded-md" /> { /* Chip */ }
                                    <SignalIcon />
                                </div>
                                <div className="text-white/90 font-mono text-xl tracking-widest mt-8">
                                    •••• •••• •••• 4289
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-[10px] text-white/60 uppercase tracking-wider mb-1">Card Holder</div>
                                        <div className="text-sm text-white font-medium">SHIVP PRATAP</div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white font-bold mb-1">CASHBACK</span>
                                        <div className="w-12 h-8 bg-white/90 rounded px-1 flex items-center justify-center font-bold text-slate-900 text-xs italic">VISA</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Floating Badge */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-100 dark:border-slate-700"
                        >
                            <div className="bg-success-100 dark:bg-green-900/30 p-2 rounded-full">
                                <Check className="w-5 h-5 text-success-600 dark:text-green-400" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Approval Chance</div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white">Excellent</div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* 2. LOANS VISUAL */}
                {currentSlide === 'loans' && (
                    <motion.div
                        key="loans"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative"
                    >
                        {/* House/Dream Object */}
                        <motion.div
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-72 mx-auto relative z-10"
                        >
                            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                                <Landmark className="w-8 h-8" />
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide font-semibold mb-1">Loan Application</div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">₹ 50,00,000</div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                                <div className="h-full bg-primary-500 w-[90%]" />
                            </div>
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-slate-500">Interest Rate</span>
                                <span className="text-success-600">8.35% Lowest</span>
                            </div>
                        </motion.div>

                        {/* Approved Stamp Animation */}
                        <motion.div
                            initial={{ scale: 2, opacity: 0, rotate: -20 }}
                            animate={{ scale: 1, opacity: 1, rotate: -12 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 10 }}
                            className="absolute -bottom-4 -right-8 bg-success-500 text-white px-6 py-2 rounded-lg shadow-lg border-4 border-white dark:border-slate-900 transform rotate-[-12deg] z-20"
                        >
                            <div className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                                <Check className="w-6 h-6 border-2 border-white rounded-full p-0.5" /> Approved
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* 3. INSURANCE VISUAL */}
                {currentSlide === 'insurance' && (
                    <motion.div
                        key="insurance"
                        className="relative"
                    >
                        {/* Shield Geometry */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative z-10"
                        >
                            <Shield className="w-64 h-64 text-primary-500 fill-primary-50 dark:fill-primary-900/20 stroke-[1.5]" />
                            <motion.div 
                                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute inset-0 bg-primary-500/10 rounded-full blur-3xl -z-10" 
                            />
                            
                            {/* Inner Protected Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                                <div className="flex -space-x-4 mb-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-full border-2 border-white flex items-center justify-center">👨‍👩‍👧</div>
                                    <div className="w-12 h-12 bg-pink-100 rounded-full border-2 border-white flex items-center justify-center">❤️</div>
                                </div>
                                <div className="bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm border border-primary-100 dark:border-primary-900/50">
                                    <span className="text-xs font-bold text-primary-700 dark:text-primary-300">100% Protected</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Badge Left */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-10 -left-12 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-3"
                        >
                            <div className="bg-orange-100 p-1.5 rounded-lg"><Lock className="w-4 h-4 text-orange-600" /></div>
                            <div className="text-xs font-bold">Term Life</div>
                        </motion.div>

                         {/* Floating Badge Right */}
                         <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="absolute bottom-10 -right-12 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-3"
                        >
                            <div className="bg-primary-100 p-1.5 rounded-lg"><Check className="w-4 h-4 text-primary-600" /></div>
                            <div className="text-xs font-bold">Claim Support</div>
                        </motion.div>
                    </motion.div>
                )}

                {/* 4. INVESTING VISUAL (MUTUAL FUNDS) */}
                {currentSlide === 'invest' && (
                    <motion.div
                        key="invest"
                        className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-80 relative"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide">Total Wealth</div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">₹ 12,45,000</div>
                            </div>
                            <div className="bg-success-100 dark:bg-green-900/30 text-success-700 dark:text-green-400 px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" /> +14.2%
                            </div>
                        </div>

                        {/* Authentically generated bar chart bars */}
                        <div className="h-32 flex items-end justify-between gap-2 mb-4">
                            {[40, 65, 45, 80, 55, 90, 75, 100].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                                    className={`w-full rounded-t-lg ${i === 7 ? 'bg-primary-500' : 'bg-slate-100 dark:bg-slate-800'}`}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                             <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                                 <div className="text-[10px] text-slate-500">SIP Active</div>
                                 <div className="font-semibold text-slate-900 dark:text-white text-sm">₹ 25k/mo</div>
                             </div>
                             <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                                 <div className="text-[10px] text-slate-500">Projected</div>
                                 <div className="font-semibold text-slate-900 dark:text-white text-sm">₹ 2.5 Cr</div>
                             </div>
                        </div>
                    </motion.div>
                )}

                {/* 5. CALCULATORS VISUAL */}
                {currentSlide === 'calculators' && (
                    <motion.div
                        key="calculators"
                        className="relative"
                    >
                        {/* Calculator Interface */}
                        <motion.div
                            initial={{ rotateX: 20, opacity: 0 }}
                            animate={{ rotateX: 0, opacity: 1 }}
                            className="bg-slate-900 p-5 rounded-3xl shadow-2xl w-64 mx-auto text-white border border-slate-700"
                        >
                            <div className="text-right mb-4">
                                <div className="text-slate-400 text-xs mb-1">Monthly Investment</div>
                                <div className="text-2xl font-mono text-primary-400">₹ 10,000</div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn, i) => (
                                    <div key={i} className={`h-10 rounded-lg flex items-center justify-center text-sm font-medium ${['÷', '×', '-', '+', '='].includes(btn) ? 'bg-primary-600' : 'bg-slate-700'}`}>
                                        {btn}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Floating Result Card */}
                         <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 w-56"
                        >
                            <div className="flex items-start gap-3">
                                <div className="bg-primary-100 p-2 rounded-full"><PieChart className="w-5 h-5 text-primary-600" /></div>
                                <div>
                                    <div className="text-xs text-slate-500 font-medium">Future Value (20 yr)</div>
                                    <div className="text-lg font-bold text-primary-600">₹ 98.5 Lakhs</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* DEFAULT / STATS VISUAL */}
                {(currentSlide === 'all' || !['credit-cards', 'loans', 'insurance', 'invest', 'calculators'].includes(currentSlide)) && (
                    <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full relative"
                    >
                         <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-8 shadow-lg relative max-w-sm mx-auto">
                            <motion.div 
                                className="absolute -top-6 -right-6 p-4"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            >
                                <div className="bg-primary-50 dark:bg-slate-800 border-2 border-primary-200 dark:border-primary-900/50 rounded-2xl p-4 shadow-xl">
                                    <div className="text-3xl font-bold text-primary-900 dark:text-primary-100">{PLATFORM_STATS.usersHelped}</div>
                                    <div className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest text-center">Indians Helped</div>
                                </div>
                            </motion.div>

                            <div className="space-y-6 pt-4">
                                {[
                                    { icon: Shield, title: "Independent Research", desc: "Unbiased. Fact-checked. 100% Honest.", color: "text-primary-600" },
                                    { icon: TrendingUp, title: "Detailed Comparisons", desc: "Compare 500+ products side-by-side.", color: "text-success-600" },
                                    { icon: Award, title: "Free Financial Tools", desc: "Calculators & guides at zero cost.", color: "text-primary-600" }
                                ].map((item, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-4 items-center"
                                    >
                                        <div className={`w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${item.color}`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</div>
                                            <div className="text-xs text-slate-500">{item.desc}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}

// Simple internal icon for the credit card
function SignalIcon() {
    return (
        <svg  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white/50 rotate-90">
            <path d="M2 20h.01" />
            <path d="M7 20v-4" />
            <path d="M12 20v-8" />
            <path d="M17 20v-12" />
        </svg>
    )
}
