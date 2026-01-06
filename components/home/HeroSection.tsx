"use client";

import React from 'react';
import { Button } from "@/components/ui/Button";
import { ArrowRight, TrendingUp, Shield, Award } from "lucide-react";
import Link from "next/link";
import { PLATFORM_STATS, STAT_STRINGS } from "@/lib/constants/platform-stats";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-white pt-24 pb-32">
            {/* Light Premium Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-60 -left-20 w-96 h-96 bg-secondary-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Column: Content */}
                    <div className="lg:w-3/5 text-left">
                        {/* Trust Badge - NEW */}
                        <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-2 mb-8">
                            <Shield className="w-4 h-4 text-primary-600" />
                            <span className="text-primary-700 text-xs font-bold uppercase tracking-widest">Independent • Unbiased • Fact-Checked</span>
                        </div>

                        {/* Benefit-First Headline - REVISED */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-900 leading-[1.1] mb-8 tracking-tight">
                            Find Your Perfect Financial Product <br />
                            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent">
                                In 30 Seconds
                            </span>
                        </h1>

                        {/* Value Prop with Specificity - REVISED */}
                        <p className="text-xl text-stone-600 mb-10 max-w-2xl leading-relaxed">
                            Stop overpaying on fees and interest. We analyze <strong className="text-stone-900">{STAT_STRINGS.coverage}</strong> to find the best match for YOUR financial situation.
                        </p>

                        {/* Primary CTA - Search Bar (Low Friction) - NEW */}
                        <div className="relative group max-w-xl mb-10">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <ArrowRight className="h-5 w-5 text-primary-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="What are you looking for? (Cards, Loans, Investments...)"
                                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white border-2 border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium text-lg shadow-sm hover:shadow-md"
                            />
                        </div>

                        {/* Social Proof Stats - NEW */}
                        <div className="flex flex-wrap gap-8 mb-8">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-stone-500 text-sm font-medium mb-1">
                                    <TrendingUp size={14} className="text-primary-600" /> Indians Helped
                                </div>
                                <div className="text-3xl font-bold text-stone-900">{PLATFORM_STATS.usersHelped}</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-stone-500 text-sm font-medium mb-1">
                                    <Award size={14} className="text-primary-600" /> Average Rating
                                </div>
                                <div className="text-3xl font-bold text-stone-900">{PLATFORM_STATS.rating}/{PLATFORM_STATS.ratingOutOf}</div>
                                <div className="text-xs text-stone-500">({Math.round(parseInt(PLATFORM_STATS.usersHelped.replace(/\D/g, '')) * 0.01).toLocaleString()}+ reviews)</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-stone-500 text-sm font-medium mb-1">
                                    <Shield size={14} className="text-primary-600" /> Independent
                                </div>
                                <div className="text-3xl font-bold text-stone-900">{PLATFORM_STATS.independence}</div>
                            </div>
                        </div>

                        {/* Secondary CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/credit-cards">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold border-2 border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg">
                                    Compare Credit Cards
                                </Button>
                            </Link>
                            <Link href="/calculators">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold border-2 border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg">
                                    Financial Calculators
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Platform Features */}
                    <div className="lg:w-2/5 w-full">
                        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-lg relative">
                            <div className="absolute -top-6 -right-6 p-4">
                                <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-4 shadow-xl">
                                    <div className="text-3xl font-bold text-primary-900">{PLATFORM_STATS.usersHelped}</div>
                                    <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest text-center">Indians Helped</div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {[
                                    {
                                        icon: Shield,
                                        title: "Independent Research Platform",
                                        desc: "We are an independent research, education, and discovery platform. Not a SEBI registered investment advisor or financial advisor. We help you research and compare products to make informed decisions.",
                                        accent: "text-primary-600"
                                    },
                                    {
                                        icon: TrendingUp,
                                        title: "Comprehensive Comparisons",
                                        desc: "Compare credit cards, loans, investments, insurance, and banking products side-by-side. Use our calculators and tools to understand features, fees, and terms.",
                                        accent: "text-success-600"
                                    },
                                    {
                                        icon: Award,
                                        title: "Educational Resources",
                                        desc: "Access guides, calculators, and educational content to understand financial products better. Make informed decisions through research and discovery.",
                                        accent: "text-secondary-600"
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5 group">
                                        <div className={`w-14 h-14 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0 group-hover:border-primary-300 transition-colors`}>
                                            <item.icon className={`w-6 h-6 ${item.accent}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-stone-900 mb-1">{item.title}</h3>
                                            <p className="text-sm text-stone-600 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 p-4 rounded-xl bg-primary-50 border border-primary-200 text-center">
                                <span className="text-[10px] font-bold text-primary-700 uppercase tracking-[0.2em]">Research • Education • Discovery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
