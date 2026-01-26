"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Smartphone, Star, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import MobileMockup from './MobileMockup';

export default function AppDownloadSection() {
    return (
        <section className="py-16 bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-50 dark:from-primary-950/50 dark:via-secondary-950/50 dark:to-primary-950/50 border-y border-slate-200 dark:border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Smartphone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                                Mobile App
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Take Your Financial Planning With You
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                            Compare credit cards, calculate SIP returns, and access expert guides — all in one app. Free forever, no ads.
                        </p>
                        
                        {/* Features */}
                        <div className="space-y-3 mb-8">
                            {[
                                "Compare 500+ credit cards on the go",
                                "15+ financial calculators",
                                "Expert guides & insights",
                                "100% free, no hidden fees"
                            ].map((feature, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-white">4.8/5</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">150K+ reviews</div>
                            </div>
                        </div>

                        {/* Download Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button 
                                asChild
                                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 h-14 px-6 rounded-xl font-semibold group"
                            >
                                <Link href="#" className="flex items-center gap-2">
                                    <Download className="w-5 h-5" />
                                    Download on App Store
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button 
                                asChild
                                variant="outline"
                                className="border-2 border-slate-900 dark:border-white h-14 px-6 rounded-xl font-semibold group"
                            >
                                <Link href="#" className="flex items-center gap-2">
                                    <Download className="w-5 h-5" />
                                    Get on Google Play
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right: Enhanced Mobile Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative flex items-center justify-center"
                    >
                        <MobileMockup />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
