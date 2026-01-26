"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Calculator, BookOpen, Star, ArrowRight } from 'lucide-react';

/**
 * Enhanced Mobile Mockup Component
 * Shows a realistic preview of the InvestingPro mobile homepage
 */
export default function MobileMockup() {
    return (
        <div className="relative w-full max-w-[320px] mx-auto">
            {/* Phone Frame */}
            <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-[3rem] p-3 shadow-2xl">
                {/* Phone Bezel */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-inner">
                    {/* Notch */}
                    <div className="h-14 bg-slate-900 dark:bg-slate-900 flex items-center justify-center relative">
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-700 dark:bg-slate-600 rounded-full" />
                        <div className="absolute top-3 left-4 w-2 h-2 bg-slate-600 rounded-full" />
                        <div className="absolute top-3 right-4 flex gap-1">
                            <div className="w-1 h-1 bg-slate-500 rounded-full" />
                            <div className="w-1 h-1 bg-slate-500 rounded-full" />
                        </div>
                    </div>

                    {/* Mobile Homepage Preview */}
                    <div className="bg-white dark:bg-slate-900 h-[600px] overflow-y-auto">
                        {/* Status Bar */}
                        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                            <span>9:41</span>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-2 border border-slate-400 rounded-sm">
                                    <div className="w-3 h-1.5 bg-slate-400 rounded-sm mt-0.5 ml-0.5" />
                                </div>
                                <div className="w-1 h-1 bg-slate-400 rounded-full" />
                            </div>
                        </div>

                        {/* Hero Section */}
                        <div className="bg-gradient-to-br from-primary-500 to-secondary-500 px-4 pt-6 pb-8 text-white">
                            <h1 className="text-xl font-bold mb-2">Find Your Perfect Financial Product</h1>
                            <div className="relative mt-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search cards, funds..."
                                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/90 text-slate-900 text-sm"
                                />
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="px-4 py-4 bg-slate-50 dark:bg-slate-800">
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">500+</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">Cards</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">2K+</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">Funds</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">15+</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">Tools</div>
                                </div>
                            </div>
                        </div>

                        {/* Trending Section */}
                        <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-orange-500" />
                                    <span className="font-bold text-slate-900 dark:text-white text-sm">Trending</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="space-y-2">
                                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                                    <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">Tax Planning</div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">31 Days Left to Save</div>
                                </div>
                            </div>
                        </div>

                        {/* Latest Insights */}
                        <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary-500" />
                                    <span className="font-bold text-slate-900 dark:text-white text-sm">Latest Guides</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="space-y-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">How To</div>
                                            <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                                                How to Choose the Best Credit Card
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Tools */}
                        <div className="px-4 py-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Calculator className="w-4 h-4 text-emerald-500" />
                                    <span className="font-bold text-slate-900 dark:text-white text-sm">Quick Tools</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {['SIP', 'EMI', 'Tax', 'FD'].map((tool) => (
                                    <div 
                                        key={tool}
                                        className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 border border-emerald-200 dark:border-emerald-800 text-center"
                                    >
                                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{tool}</div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">Calculator</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Navigation */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-2">
                            <div className="flex items-center justify-around">
                                {['Home', 'Compare', 'Tools', 'Guides'].map((item) => (
                                    <div key={item} className="flex flex-col items-center gap-1">
                                        <div className="w-5 h-5 bg-slate-300 dark:bg-slate-600 rounded" />
                                        <span className="text-xs text-slate-600 dark:text-slate-400">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-2 -right-2 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl -z-10" />
                <div className="absolute -bottom-2 -left-2 w-32 h-32 bg-secondary-500/20 rounded-full blur-2xl -z-10" />
            </div>
        </div>
    );
}
