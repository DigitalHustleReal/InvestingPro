"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, CheckCircle, Clock, TrendingUp, Info } from 'lucide-react';
import { calculateTrustScoreBreakdown, type TrustScoreBreakdown } from '@/lib/trust/trust-utils';

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
    
    const colorClasses = {
        emerald: 'from-emerald-500 to-teal-500',
        teal: 'from-teal-500 to-cyan-500',
        amber: 'from-amber-500 to-orange-500',
        rose: 'from-rose-500 to-red-500'
    };

    const bgColorClasses = {
        emerald: 'bg-emerald-50',
        teal: 'bg-teal-50',
        amber: 'bg-amber-50',
        rose: 'bg-rose-50'
    };

    const textColorClasses = {
        emerald: 'text-emerald-600',
        teal: 'text-teal-600',
        amber: 'text-amber-600',
        rose: 'text-rose-600'
    };

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${bgColorClasses[breakdown.color as keyof typeof bgColorClasses]}`}>
                    <Shield className={`w-4 h-4 ${textColorClasses[breakdown.color as keyof typeof textColorClasses]}`} />
                    <span className={`text-sm font-bold ${textColorClasses[breakdown.color as keyof typeof textColorClasses]}`}>
                        {breakdown.overall}/100
                    </span>
                </div>
                <span className="text-xs text-slate-500">{breakdown.label}</span>
            </div>
        );
    }

    return (
        <Card className="border-slate-200 overflow-hidden">
            <div className={`bg-gradient-to-r ${colorClasses[breakdown.color as keyof typeof colorClasses]} p-4 text-white`}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        <span className="font-bold text-sm uppercase tracking-wider">InvestingPro Trust Score</span>
                    </div>
                    <div className="relative group/info">
                        <Info className="w-4 h-4 cursor-help" />
                        <div className="absolute right-0 bottom-full mb-2 hidden group-hover/info:block w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-50">
                            <div className="font-bold mb-1">How We Calculate Trust Scores</div>
                            <div className="text-slate-300 leading-relaxed">
                                Our proprietary score (0-100) combines data freshness, user reviews, market presence, and verification status to help you make informed decisions.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">{breakdown.overall}</span>
                    <span className="text-lg font-semibold opacity-90">/ 100</span>
                    <span className="ml-2 text-sm bg-white/20 px-3 py-1 rounded-full font-bold">
                        {breakdown.label}
                    </span>
                </div>
            </div>

            <CardContent className="p-4">
                <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Score Breakdown
                    </div>

                    {/* Data Freshness */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-3.5 h-3.5 text-teal-600" />
                                <span className="font-medium text-slate-700">Data Freshness</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                                {breakdown.components.dataFreshness}/30
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-teal-500 rounded-full transition-all"
                                style={{ width: `${(breakdown.components.dataFreshness / 30) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* User Reviews */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 text-sm">
                                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                                <span className="font-medium text-slate-700">User Reviews</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                                {breakdown.components.userReviews}/30
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${(breakdown.components.userReviews / 30) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Market Presence */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 text-sm">
                                <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                                <span className="font-medium text-slate-700">Market Presence</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                                {breakdown.components.marketPresence}/15
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-purple-500 rounded-full transition-all"
                                style={{ width: `${(breakdown.components.marketPresence / 15) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Verification */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="font-medium text-slate-700">Verification</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                                {breakdown.components.verification}/25
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-emerald-500 rounded-full transition-all"
                                style={{ width: `${(breakdown.components.verification / 25) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Higher scores indicate fresher data, better user feedback, and verified information. 
                        We update scores daily based on real-time market data.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
