"use client";

import React from 'react';
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, TrendingUp, CheckCircle2, Sparkles } from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";

interface CategoryHeroProps {
    title: string;
    subtitle?: string;
    description: string;
    primaryCta: {
        text: string;
        href: string;
    };
    secondaryCta?: {
        text: string;
        href: string;
    };
    stats?: Array<{
        label: string;
        value: string;
    }>;
    badge?: string;
    className?: string;
    variant?: 'primary' | 'secondary' | 'neutral';
}

/**
 * Premium, Authoritative Category Hero
 * Consistent design across all categories
 * Focuses on authority and decision-making, not just design
 */
export default function CategoryHero({
    title,
    subtitle,
    description,
    primaryCta,
    secondaryCta,
    stats,
    badge = "Helps You Decide • Expert-Reviewed",
    className,
    variant = 'primary'
}: CategoryHeroProps) {
    const variantStyles = {
        primary: {
            gradient: "from-primary-600 via-primary-500 to-primary-600",
            bg: "bg-primary-50 dark:bg-primary-950/20",
            border: "border-primary-200 dark:border-primary-800",
            text: "text-primary-700 dark:text-primary-300",
            button: "bg-primary-600 hover:bg-primary-700 text-white"
        },
        secondary: {
            gradient: "from-green-600 via-emerald-500 to-green-600",
            bg: "bg-green-50 dark:bg-green-950/20",
            border: "border-green-200 dark:border-green-800",
            text: "text-green-700 dark:text-green-300",
            button: "bg-green-600 hover:bg-green-700 text-white"
        },
        neutral: {
            gradient: "from-slate-700 via-slate-600 to-slate-700",
            bg: "bg-slate-50 dark:bg-slate-900/20",
            border: "border-slate-200 dark:border-slate-800",
            text: "text-slate-700 dark:text-slate-300",
            button: "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900"
        }
    };

    const style = variantStyles[variant];

    return (
        <div className={cn("relative overflow-hidden rounded-2xl border-2", style.border, className)}>
            {/* Premium Background with Subtle Gradient */}
            <div className={cn("absolute inset-0 bg-gradient-to-br", style.gradient, "opacity-5 dark:opacity-10")} />
            
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
                 style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 }}
            />

            {/* Content */}
            <div className="relative z-10 p-8 md:p-12">
                <div className="max-w-5xl">
                    {/* Authority Badge */}
                    <div className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 border", style.bg, style.border)}>
                        <Shield className={cn("w-4 h-4", style.text)} />
                        <span className={cn("text-xs font-bold uppercase tracking-widest", style.text)}>
                            {badge}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
                        {title}
                        {subtitle && (
                            <span className={cn("block mt-2 bg-gradient-to-r", style.gradient, "bg-clip-text text-transparent")}>
                                {subtitle}
                            </span>
                        )}
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl leading-relaxed">
                        {description}
                    </p>

                    {/* Stats (Authority Signals) */}
                    {stats && stats.length > 0 && (
                        <div className="flex flex-wrap gap-6 mb-8">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <CheckCircle2 className={cn("w-5 h-5", style.text)} />
                                    <div>
                                        <div className={cn("text-2xl font-bold", style.text)}>
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-4">
                        <Link href={primaryCta.href}>
                            <Button size="lg" className={cn("h-14 px-8 text-base font-bold rounded-xl shadow-lg", style.button)}>
                                {primaryCta.text}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        {secondaryCta && (
                            <Link href={secondaryCta.href}>
                                <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold rounded-xl border-2">
                                    {secondaryCta.text}
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Decorative Elements (Subtle, Premium) */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-5 dark:opacity-10 pointer-events-none">
                <div className={cn("w-full h-full rounded-full blur-3xl bg-gradient-to-br", style.gradient)} />
            </div>
            <div className="absolute bottom-0 left-0 w-48 h-48 opacity-5 dark:opacity-10 pointer-events-none">
                <div className={cn("w-full h-full rounded-full blur-3xl bg-gradient-to-tr", style.gradient)} />
            </div>
        </div>
    );
}
