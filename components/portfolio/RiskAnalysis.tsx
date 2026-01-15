"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle, Zap, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RiskAnalysisProps {
    holdings: any[];
    user: any;
}

export default function RiskAnalysis({ holdings = [], user }: RiskAnalysisProps) {
    // Simple risk calculation logic
    const portfolioRiskScore = 65; // Placeholder
    const userRiskProfile = user?.risk_profile || 'Moderate';

    const getRiskColor = (score: number) => {
        if (score < 33) return "text-primary-500";
        if (score < 66) return "text-accent-500";
        return "text-danger-500";
    };

    return (
        <Card className="rounded-[3rem] border-0 shadow-2xl bg-slate-900 text-white overflow-hidden p-6 md:p-8 relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

            <CardHeader className="p-0 mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary-400">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold text-white tracking-tight">Risk Radar</CardTitle>
                        <p className="text-slate-500 font-medium text-sm">Targeting: {userRiskProfile}</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0 relative z-10 space-y-8">
                <div>
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-st">Calculated Volatility</span>
                        <span className={`text-2xl font-bold ${getRiskColor(portfolioRiskScore)}`}>{portfolioRiskScore}/100</span>
                    </div>
                    <Progress value={portfolioRiskScore} className="h-3 rounded-full bg-white/5" />
                </div>

                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-accent-500 shrink-0 mt-1" />
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">
                            Your portfolio is currently <span className="text-white font-bold">12% more aggressive</span> than your intended {userRiskProfile} profile.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-danger-500 shrink-0 mt-1" />
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">
                            Sector concentration in <span className="text-white font-bold">Technology</span> is exceeding safety benchmarks.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/5 text-[10px] font-semibold text-slate-500 uppercase tracking-st">
                    <Info className="w-3.5 h-3.5" />
                    Last synchronized with India VIX: Today
                </div>
            </CardContent>
        </Card>
    );
}
