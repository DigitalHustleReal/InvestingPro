"use client";

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

export interface KpiCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    href?: string;
}

export default function KpiCard({
    label,
    value,
    subtext,
    icon: Icon,
    trend,
    trendValue,
    href
}: KpiCardProps) {
    const isPositive = trend === 'up';
    const isNegative = trend === 'down';

    const CardContent = (
        <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-white/10 hover:shadow-2xl h-full flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* Background Glow */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl group-hover:from-blue-500/20 transition-colors duration-300" />

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-inter mb-2">
                        {label}
                    </p>
                    <h3 className="text-3xl font-bold text-white tracking-tight font-inter tabular-nums">
                        {value}
                    </h3>
                </div>

                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            {(subtext || trend) && (
                <div className="relative z-10 flex items-center gap-2 mt-4 text-xs font-medium">
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 px-1.5 py-0.5 rounded-md border backdrop-blur-md",
                            isPositive ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : 
                            isNegative ? "text-rose-400 bg-rose-400/10 border-rose-400/20" : 
                            "text-slate-300 bg-slate-300/10 border-slate-300/20"
                        )}>
                            {isPositive && <ArrowUpRight className="w-3 h-3" />}
                            {isNegative && <ArrowDownRight className="w-3 h-3" />}
                            {trend === 'neutral' && <Minus className="w-3 h-3" />}
                            {trendValue && <span>{trendValue}</span>}
                        </div>
                    )}
                    {subtext && (
                        <span className="text-slate-500 font-inter">{subtext}</span>
                    )}
                </div>
            )}
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block h-full no-underline">
                {CardContent}
            </Link>
        );
    }

    return CardContent;
}
