"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <AdminLayout>
            <div className="p-8 max-w-[1600px] mx-auto w-full">
                {/* Header */}
                <div className="mb-10 border-b border-white/5 pb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                                    <BarChart3 className="w-6 h-6 text-emerald-400" />
                                </div>
                                Content Analytics
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ml-2 font-bold tracking-wider">
                                    LIVE
                                </Badge>
                            </h1>
                            <p className="text-slate-400 mt-3 ml-16 font-medium tracking-wide max-w-2xl">
                                Real-time performance insights and content intelligence.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            Auto-refreshes every minute
                        </div>
                    </div>
                </div>

                {/* Dashboard */}
                <AnalyticsDashboard />
            </div>
        </AdminLayout>
    );
}
