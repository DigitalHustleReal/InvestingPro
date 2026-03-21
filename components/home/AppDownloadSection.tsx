"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Sparkles } from 'lucide-react';
import MobileMockup from './MobileMockup';

export default function AppDownloadSection() {
    return (
        <section className="py-12 sm:py-16 bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-50 dark:from-primary-950/50 dark:via-secondary-950/50 dark:to-primary-950/50 border-y border-slate-200 dark:border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                    {/* Mobile Mockup - Mobile-first positioning */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex-shrink-0 order-1 md:order-2"
                    >
                        <MobileMockup />
                    </motion.div>

                    {/* Content - Coming Soon */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex-1 text-center md:text-left order-2 md:order-1"
                    >
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-primary-100/50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-full">
                            <Smartphone className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                                Mobile App
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                Coming Soon
                            </h2>
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 animate-pulse" />
                        </div>
                        
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-2 max-w-xl mx-auto md:mx-0">
                            Take your financial planning everywhere. Compare products, calculate returns, and access expert guides — all in one premium mobile app.
                        </p>
                        
                        <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">
                            Free forever. Zero ads. Premium experience.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
