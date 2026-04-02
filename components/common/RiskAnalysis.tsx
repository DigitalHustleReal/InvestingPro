"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/Button";

interface Holding {
    asset_category: string;
    current_value: number;
}

interface User {
    risk_profile?: 'conservative' | 'moderate' | 'aggressive';
}

interface RiskAnalysisProps {
    holdings: Holding[];
    user: User;
}

export default function RiskAnalysis({ holdings, user }: RiskAnalysisProps) {
    const userRiskProfile = user?.risk_profile || 'moderate';

    const equityAllocation = holdings
        .filter(h => h.asset_category.toLowerCase() === 'equity')
        .reduce((sum, h) => sum + h.current_value, 0);

    const totalValue = holdings.reduce((sum, h) => sum + h.current_value, 0);
    const equityPercent = totalValue > 0 ? Number(((equityAllocation / totalValue) * 100).toFixed(1)) : 0;

    const recommendations = {
        conservative: {
            equity: { min: 20, max: 40 },
            debt: { min: 60, max: 80 },
            colorClass: 'bg-primary-100 text-primary-700',
            borderClass: 'border-primary-200'
        },
        moderate: {
            equity: { min: 40, max: 60 },
            debt: { min: 40, max: 60 },
            colorClass: 'bg-secondary-100 text-secondary-700',
            borderClass: 'border-secondary-200'
        },
        aggressive: {
            equity: { min: 70, max: 90 },
            debt: { min: 10, max: 30 },
            colorClass: 'bg-accent-100 text-accent-700',
            borderClass: 'border-accent-200'
        }
    };

    const profile = recommendations[userRiskProfile];
    const isEquityInRange = equityPercent >= profile.equity.min && equityPercent <= profile.equity.max;

    const insights: { type: 'success' | 'warning' | 'info'; message: string; action: string }[] = [];

    if (equityPercent < profile.equity.min) {
        insights.push({
            type: 'warning',
            message: `Your equity allocation (${equityPercent}%) is lower than recommended (${profile.equity.min}-${profile.equity.max}%) for your ${userRiskProfile} risk profile.`,
            action: 'Consider increasing equity exposure'
        });
    } else if (equityPercent > profile.equity.max) {
        insights.push({
            type: 'warning',
            message: `Your equity allocation (${equityPercent}%) is higher than recommended (${profile.equity.min}-${profile.equity.max}%) for your ${userRiskProfile} risk profile.`,
            action: 'Consider rebalancing towards debt/hybrid funds'
        });
    } else {
        insights.push({
            type: 'success',
            message: `Your equity allocation (${equityPercent}%) aligns well with your ${userRiskProfile} risk profile.`,
            action: 'Portfolio is well balanced'
        });
    }

    if (holdings.length < 5 && holdings.length > 0) {
        insights.push({
            type: 'info',
            message: 'Consider diversifying across more assets to reduce risk',
            action: 'Add 3-5 more holdings across different categories'
        });
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Risk Analysis</CardTitle>
                    <Badge className={`${profile.colorClass} hover:${profile.colorClass} border-0`}>
                        {userRiskProfile.charAt(0).toUpperCase() + userRiskProfile.slice(1)} Profile
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6 md:p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Recommended Equity Allocation</span>
                        <span className="font-semibold text-gray-900">{profile.equity.min}-{profile.equity.max}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Your Current Equity Allocation</span>
                        <span className={`font-bold ${isEquityInRange ? 'text-primary-600' : 'text-accent-600'}`}>
                            {equityPercent}%
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    {insights.map((insight, idx) => {
                        const Icon = insight.type === 'success' ? CheckCircle2 : insight.type === 'warning' ? AlertCircle : TrendingUp;
                        const styleClass = insight.type === 'success' ? 'text-primary-700 bg-primary-50 border-primary-100' :
                            insight.type === 'warning' ? 'text-accent-700 bg-accent-50 border-accent-100' :
                                'text-secondary-700 bg-secondary-50 border-secondary-100';

                        return (
                            <div key={idx} className={`p-3 rounded-lg border ${styleClass}`}>
                                <div className="flex items-start gap-3">
                                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold mb-0.5">{insight.message}</p>
                                        <p className="text-xs opacity-90">{insight.action}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!user?.risk_profile && (
                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-3">Complete your risk profile for personalized insights</p>
                        <Link href="/risk-profiler">
                            <Button variant="outline" size="sm" className="w-full">
                                Take Risk Assessment
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
