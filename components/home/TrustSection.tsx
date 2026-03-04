"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users, Database, CheckCircle2, Star, Award } from "lucide-react";
import Image from 'next/image';
import { getDisplayStats } from '@/lib/platform-stats';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { AvatarStack } from "@/components/common/AvatarStack";
import { DotPattern } from "@/components/common/Patterns";

interface Testimonial {
    id: string;
    name: string;
    role?: string;
    company?: string;
    content: string;
    rating: number;
    avatar_url?: string;
    featured: boolean;
}

export default function TrustSection() {
    const stats = getDisplayStats();
    
    // Fetch testimonials
    const { data: testimonials = [] } = useQuery<Testimonial[]>({
        queryKey: ['testimonials', 'trust-section'],
        queryFn: async () => {
            const response = await fetch('/api/testimonials?featured=true&limit=3');
            if (!response.ok) return [];
            return response.json();
        },
    });

    // Combined trust stats from TrustBar + TrustSection
    const trustStats = [
        {
            label: "Community Members",
            value: 50000,
            displaySuffix: "+",
            displayPrefix: "",
            icon: Users,
            color: "text-primary-600 dark:text-primary-400",
            bg: "bg-primary-100 dark:bg-primary-900/20"
        },
        {
            label: "Credit Value Tracked",
            value: 500,
            displaySuffix: "Cr+",
            displayPrefix: "₹",
            icon: TrendingUp,
            color: "text-success-600 dark:text-success-400",
            bg: "bg-success-100 dark:bg-success-900/20"
        },
        {
            label: "Partner Banks",
            value: 50,
            displaySuffix: "+",
            displayPrefix: "",
            icon: Shield,
            color: "text-accent-600 dark:text-accent-400",
            bg: "bg-accent-100 dark:bg-accent-900/20"
        },
        {
            label: "Expert Reviews",
            value: 1000,
            displaySuffix: "+",
            displayPrefix: "",
            icon: Award,
            color: "text-secondary-600 dark:text-secondary-400",
            bg: "bg-secondary-100 dark:bg-secondary-900/20"
        }
    ];

    const trustPoints = [
        {
            icon: Database,
            value: stats.productsAnalyzed.value,
            display: stats.productsAnalyzed.display,
            label: stats.productsAnalyzed.label,
            description: stats.productsAnalyzed.description,
            animated: true
        },
        {
            icon: Users,
            value: stats.monthlyUsers.value,
            display: stats.monthlyUsers.display,
            label: stats.monthlyUsers.label,
            description: stats.monthlyUsers.description,
            animated: true
        },
        {
            icon: Star,
            value: stats.averageRating.value,
            display: `${stats.averageRating.display}/5`,
            label: stats.averageRating.label,
            description: stats.averageRating.description,
            animated: true,
            decimals: 1
        },
        {
            icon: TrendingUp,
            value: 0,
            display: stats.marketScans.display,
            label: stats.marketScans.label,
            description: stats.marketScans.description,
            animated: false
        }
    ];

    return (
        <section className="relative py-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
            {/* Ambient Gradient Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <DotPattern className="text-slate-200 dark:text-slate-800/80 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary-100/50 dark:bg-secondary-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-100/50 dark:bg-primary-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
                        Why Trust <span className="text-primary-600 dark:text-primary-400">InvestingPro?</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-600 max-w-2xl mx-auto">
                        We're an independent research platform, not a SEBI registered advisor. We help you make informed decisions with transparent, data-driven insights.
                    </p>
                </div>

                {/* Quick Trust Stats Bar (from TrustBar) */}
                <div className="mb-16 pb-12 border-b border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {trustStats.map((stat, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">
                                    <AnimatedCounter 
                                        value={stat.value} 
                                        prefix={stat.displayPrefix}
                                        suffix={stat.displaySuffix}
                                    />
                                </h4>
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-600 uppercase tracking-wide">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Data Source Attribution */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 dark:text-slate-600">
                            <span className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-500" />
                                Data from AMFI & RBI
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                            <span className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-amber-500" />
                                Independent Research
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                            <span className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                Updated Daily
                            </span>
                        </div>
                    </div>
                </div>

                {/* Detailed Trust Points Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {trustPoints.map((point, index) => {
                        const Icon = point.icon;
                        return (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center text-center p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800/50 hover:shadow-lg dark:hover:shadow-none transition-all duration-300"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 dark:bg-primary-500/10 rounded-xl mb-6 text-primary-600 dark:text-primary-400">
                                    <Icon className="w-7 h-7" />
                                </div>
                                {point.label === "Monthly Users" ? (
                                    <div className="mb-2">
                                        <AvatarStack size={48} />
                                        <div className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
                                            {point.display}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                        {point.animated && point.value > 0 ? (
                                            <AnimatedCounter 
                                                end={point.value} 
                                                duration={2000}
                                                decimals={point.decimals || 0}
                                                suffix={point.decimals ? '/5' : ''}
                                            />
                                        ) : (
                                            point.display
                                        )}
                                    </div>
                                )}
                                <div className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3 uppercase tracking-wider">
                                    {point.label}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-600 leading-relaxed">
                                    {point.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* User Testimonials (from TestimonialsCarousel) */}
                {testimonials.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-center mb-8 text-slate-900 dark:text-white">
                            What Our Users Say
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < (testimonial.rating || 5)
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'fill-slate-300 text-slate-300 dark:fill-slate-600 dark:text-slate-600'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 mb-4 italic leading-relaxed">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="flex items-center gap-3">
                                        {testimonial.avatar_url ? (
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                <Image
                                                    src={testimonial.avatar_url}
                                                    alt={testimonial.name}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
                                                {testimonial.name.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-semibold text-slate-900 dark:text-white text-sm">
                                                {testimonial.name}
                                            </div>
                                            {testimonial.role && (
                                                <div className="text-xs text-slate-500 dark:text-slate-600">
                                                    {testimonial.role}
                                                    {testimonial.company && ` at ${testimonial.company}`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Trust Badges */}
                <div className="mt-12 pt-12 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-600">
                            <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            <span className="text-sm">Independent Research</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-600">
                            <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            <span className="text-sm">No Paid Promotions</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-600">
                            <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            <span className="text-sm">Data-Driven Analysis</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-600">
                            <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            <span className="text-sm">Regular Updates</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
