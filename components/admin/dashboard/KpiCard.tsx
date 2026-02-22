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
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col justify-between animate-scale-in" style={{ animationFillMode: 'backwards' }}>
            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-inter mb-2">
                        {label}
                    </p>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight font-inter tabular-nums">
                        {value}
                    </h3>
                </div>

                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {(subtext || trend) && (
                <div className="relative z-10 flex items-center gap-2 mt-4 text-xs font-medium">
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-md border backdrop-blur-sm",
                            isPositive ? "text-success bg-success/10 border-success/20" : 
                            isNegative ? "text-error bg-error/10 border-error/20" : 
                            "text-muted-foreground bg-muted border-border"
                        )}>
                            {isPositive && <ArrowUpRight className="w-3 h-3" />}
                            {isNegative && <ArrowDownRight className="w-3 h-3" />}
                            {trend === 'neutral' && <Minus className="w-3 h-3" />}
                            {trendValue && <span>{trendValue}</span>}
                        </div>
                    )}
                    {subtext && (
                        <span className="text-muted-foreground font-inter">{subtext}</span>
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
