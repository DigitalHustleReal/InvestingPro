"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CTAButton } from "./CTAButton";
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryHeroProps {
    title: string;
    subtitle: string;
    description: string;
    badge?: string;
    badgeIcon?: React.ReactNode;
    primaryCTA?: {
        href: string;
        text: string;
    };
    secondaryCTA?: {
        href: string;
        text: string;
    };
    stats?: Array<{
        label: string;
        value: string;
        icon?: React.ReactNode;
    }>;
    gradient?: 'teal' | 'indigo' | 'emerald' | 'purple' | 'blue';
    className?: string;
}

export function CategoryHero({
    title,
    subtitle,
    description,
    badge,
    badgeIcon = <Sparkles className="w-3 h-3" />,
    primaryCTA,
    secondaryCTA,
    stats = [],
    gradient = 'teal',
    className
}: CategoryHeroProps) {
    const gradients = {
        teal: "from-teal-600 via-emerald-600 to-green-700",
        indigo: "from-indigo-600 via-purple-600 to-pink-700",
        emerald: "from-emerald-600 via-teal-600 to-cyan-700",
        purple: "from-purple-600 via-indigo-600 to-blue-700",
        blue: "from-blue-600 via-cyan-600 to-teal-700"
    };

    return (
        <div className={cn(
            "relative overflow-hidden bg-gradient-to-br py-16 lg:py-24",
            gradients[gradient],
            className
        )}>
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl">
                    {/* Badge */}
                    {badge && (
                        <Badge className="mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm text-white border-white/30 flex w-fit items-center gap-2">
                            {badgeIcon}
                            {badge}
                        </Badge>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
                        {title}
                        {subtitle && (
                            <span className="block text-white/90 text-3xl sm:text-4xl lg:text-5xl mt-2">
                                {subtitle}
                            </span>
                        )}
                    </h1>

                    {/* Description */}
                    <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
                        {description}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-4 mb-12">
                        {primaryCTA && (
                            <CTAButton
                                href={primaryCTA.href}
                                variant="primary"
                                size="lg"
                                className="bg-white text-teal-600 hover:bg-white/90 shadow-xl"
                            >
                                {primaryCTA.text}
                            </CTAButton>
                        )}
                        {secondaryCTA && (
                            <CTAButton
                                href={secondaryCTA.href}
                                variant="outline"
                                size="lg"
                                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                            >
                                {secondaryCTA.text}
                            </CTAButton>
                        )}
                    </div>

                    {/* Stats */}
                    {stats.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                                >
                                    {stat.icon && (
                                        <div className="text-white mb-2">{stat.icon}</div>
                                    )}
                                    <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                                    <div className="text-xs text-white/80 font-medium uppercase tracking-wider">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}




















