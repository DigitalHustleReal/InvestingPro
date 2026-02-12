"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, TrendingUp } from "lucide-react";

interface PointsWidgetProps {
    points: number;
    level: string;
}

export default function PointsWidget({ points = 0, level = 'Beginner' }: PointsWidgetProps) {
    const pointsToNext = 1000 - (points % 1000);
    const progress = (points % 1000) / 10;

    return (
        <Card className="rounded-[2.5rem] border-0 shadow-2xl overflow-hidden bg-slate-900 text-white relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/20 transition-all duration-700" />

            <CardContent className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-primary-500 flex items-center justify-center shadow-xl shadow-primary-500/20 group-hover:rotate-6 transition-transform">
                            <Trophy className="w-8 h-8 text-slate-900" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-primary-400 uppercase tracking-[0.2em] mb-1">XP Achievement System</p>
                            <h3 className="text-3xl font-bold tracking-tight">{points.toLocaleString()} <span className="text-slate-500 text-xl font-medium">Points</span></h3>
                        </div>
                    </div>

                    <div className="flex-1 max-w-md">
                        <div className="flex justify-between items-end mb-3">
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                                <span className="text-sm font-semibold uppercase tracking-st">{level} Status</span>
                            </div>
                            <span className="text-xs font-bold text-slate-600">{pointsToNext} XP to Next Tier</span>
                        </div>
                        <Progress value={progress} className="h-3 rounded-full bg-white/10" />
                    </div>

                    <div className="hidden lg:flex flex-col items-end">
                        <div className="flex items-center gap-2 text-primary-400 font-bold mb-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>+150 XP</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Growth this week</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
