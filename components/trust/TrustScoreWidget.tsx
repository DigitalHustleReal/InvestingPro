"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, CheckCircle, Clock, TrendingUp, Info } from 'lucide-react';
import { calculateTrustScoreBreakdown } from '@/lib/trust/trust-utils';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface TrustScoreWidgetProps {
    trustScore: number;
    verificationStatus: string;
    lastUpdated: Date;
    compact?: boolean;
}

export default function TrustScoreWidget({ 
    trustScore, 
    verificationStatus, 
    lastUpdated,
    compact = false 
}: TrustScoreWidgetProps) {
    const breakdown = calculateTrustScoreBreakdown(trustScore, verificationStatus, lastUpdated);
    
    // Normalized color scheme - blues and grays only, no flashy gradients
    const scoreColor = breakdown.overall >= 75 ? 'text-blue-600' : 
                      breakdown.overall >= 50 ? 'text-slate-700' : 
                      'text-amber-600'; // Amber instead of red for low scores

    const scoreBg = breakdown.overall >= 75 ? 'bg-blue-50' : 
                    breakdown.overall >= 50 ? 'bg-slate-50' : 
                    'bg-amber-50';

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${scoreBg}`}>
                    <Shield className={`w-4 h-4 ${scoreColor}`} />
                    <span className={`text-sm font-semibold ${scoreColor}`}>
                        <AnimatedCounter end={breakdown.overall} suffix="/100" />
                    </span>
                </div>
                <span className="text-xs text-slate-500">{breakdown.label}</span>
            </div>
        );
    }

    return (
        <Card className="border-slate-200 overflow-hidden shadow-sm">
            {/* Subtle header - no gradients */}
            <div className={`${scoreBg} p-4 border-b border-slate-200`}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Shield className={`w-5 h-5 ${scoreColor}`} />
                        <span className="font-semibold text-sm text-slate-700">Trust Score</span>
                    </div>
                    <div className="relative group/info">
                        <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help transition-colors" />
                        <div className="absolute right-0 bottom-full mb-2 hidden group-hover/info:block w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50">
                            <div className="font-semibold mb-1">How We Calculate</div>
                            <div className="text-slate-300 leading-relaxed">
                                Based on data freshness, editorial verification, user feedback, and market presence.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${scoreColor}`}>
                        <AnimatedCounter end={breakdown.overall} duration={2000} />
                    </span>
                    <span className="text-sm text-slate-500">/ 100</span>
                    <span className="ml-2 text-xs bg-white/60 px-2 py-1 rounded text-slate-600 font-medium">
                        {breakdown.label}
                    </span>
                </div>
            </div>

            <CardContent className="p-4">
                <div className="space-y-3">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                        Score Components
                    </div>

                    {/* Data Freshness */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                <span className="font-medium text-slate-700">Data Freshness</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-600">
                                <AnimatedCounter end={breakdown.components.dataFreshness} duration={1500} suffix="/30" />
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                    width: `${(breakdown.components.dataFreshness / 30) * 100}%`,
                                    transitionDelay: '200ms'
                                }}
                            />
                        </div>
                    </div>

                    {/* User Reviews */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 text-sm">
                                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                                <span className="font-medium text-slate-700">User Feedback</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-600">
                                <AnimatedCounter end={breakdown.components.userReviews} duration={1500} suffix="/30" />
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-slate-400 rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                    width: `${(breakdown.components.userReviews / 30) * 100}%`,
                                    transitionDelay: '400ms'
                                }}
                            />
                        </div>
                    </div>

                    {/* Market Presence */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 text-sm">
                                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                                <span className="font-medium text-slate-700">Market Standing</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-600">
                                <AnimatedCounter end={breakdown.components.marketPresence} duration={1500} suffix="/15" />
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-slate-400 rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                    width: `${(breakdown.components.marketPresence / 15) * 100}%`,
                                    transitionDelay: '600ms'
                                }}
                            />
                        </div>
                    </div>

                    {/* Verification */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                                <span className="font-medium text-slate-700">Editorial Review</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-600">
                                <AnimatedCounter end={breakdown.components.verification} duration={1500} suffix="/25" />
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                    width: `${(breakdown.components.verification / 25) * 100}%`,
                                    transitionDelay: '800ms'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Updated daily based on real-time data verification and market analysis.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
