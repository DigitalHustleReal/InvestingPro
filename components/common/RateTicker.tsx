"use client";

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, ChevronRight, X } from 'lucide-react';
import type { TickerRate } from '@/lib/rates/get-live-rates';

interface RateTickerProps {
    rates: TickerRate[];
    updatedAt: string;
}

function TrendIcon({ trend }: { trend?: 'up' | 'down' | 'flat' }) {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-red-400" />;
    return <Minus className="h-3 w-3 text-slate-400" />;
}

export default function RateTicker({ rates, updatedAt }: RateTickerProps) {
    const [dismissed, setDismissed] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    // Auto-scroll animation via CSS — no JS loop needed
    // Duplicate the rates array so the scroll loops seamlessly
    const doubled = [...rates, ...rates];

    if (dismissed) return null;

    return (
        <div className="w-full bg-green-950 dark:bg-green-950 border-b border-green-800/60 overflow-hidden relative z-50">
            <div className="flex items-center h-8">
                {/* Left label — always visible */}
                <div className="shrink-0 flex items-center gap-1.5 px-3 border-r border-green-800/60 h-full bg-green-900/60">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                    </span>
                    <span className="text-green-300 text-[11px] font-semibold tracking-wide uppercase whitespace-nowrap hidden sm:block">
                        Live Rates
                    </span>
                </div>

                {/* Scrolling ticker */}
                <div className="flex-1 overflow-hidden relative">
                    {/* Fade edges */}
                    <div className="absolute left-0 top-0 w-6 h-full bg-gradient-to-r from-green-950 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 w-6 h-full bg-gradient-to-l from-green-950 to-transparent z-10 pointer-events-none" />

                    <div
                        ref={trackRef}
                        className="flex items-center gap-0 animate-ticker whitespace-nowrap"
                        style={{ willChange: 'transform' }}
                    >
                        {doubled.map((rate, i) => (
                            <Link
                                key={`${rate.label}-${i}`}
                                href={rate.href}
                                className="inline-flex items-center gap-1.5 px-4 text-[12px] text-green-200 hover:text-white transition-colors group shrink-0"
                            >
                                <TrendIcon trend={rate.trend} />
                                <span className="text-green-400 font-medium">{rate.label}</span>
                                <span className="font-mono font-semibold text-white">{rate.value}</span>
                                {rate.change && (
                                    <span className={`text-[10px] font-semibold ${
                                        rate.trend === 'up' ? 'text-green-400' :
                                        rate.trend === 'down' ? 'text-red-400' :
                                        'text-slate-400'
                                    }`}>
                                        {rate.change}
                                    </span>
                                )}
                                <span className="text-green-800 mx-1 select-none">·</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right: updated time + dismiss */}
                <div className="shrink-0 flex items-center gap-2 px-2 border-l border-green-800/60 h-full">
                    <span className="text-green-600 text-[10px] hidden md:block whitespace-nowrap">
                        {updatedAt} IST
                    </span>
                    <Link
                        href="/loans/home-loan"
                        className="hidden sm:flex items-center gap-0.5 text-[11px] text-green-400 hover:text-white transition-colors whitespace-nowrap"
                    >
                        All rates <ChevronRight className="h-3 w-3" />
                    </Link>
                    <button
                        onClick={() => setDismissed(true)}
                        aria-label="Dismiss rate ticker"
                        className="p-0.5 text-green-700 hover:text-green-300 transition-colors"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
