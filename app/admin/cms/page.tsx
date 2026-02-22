"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import BudgetGovernorPanel from '@/components/admin/BudgetGovernorPanel';
import { Sparkles, DollarSign, Zap, Activity, Rss } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function CMSDashboardPage() {
    // Get health status
    const { data: healthData } = useQuery({
        queryKey: ['cms-health'],
        queryFn: async () => {
            const response = await fetch('/api/cms/health');
            if (!response.ok) return null;
            const data = await response.json();
            return data.health;
        },
        refetchInterval: 30000
    });

    // Get budget status
    const { data: budgetData } = useQuery({
        queryKey: ['daily-budget'],
        queryFn: async () => {
            const response = await fetch('/api/cms/budget');
            if (!response.ok) return null;
            const data = await response.json();
            return data.budget;
        },
        refetchInterval: 10000
    });

    const health = healthData || { overall: 'unknown' };
    const budget = budgetData || {};

    const getHealthColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'degraded': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'unhealthy': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    return (
        <AdminLayout>
            <AdminPageContainer>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3 tracking-tight">
                            <Sparkles className="w-8 h-8 text-sky-500" />
                            Pipeline Dashboard
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Monitor and manage the AI-powered content pipeline</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-sky-500" />
                                </div>
                                <Badge className={getHealthColor(health.overall)}>
                                    {health.overall || 'Unknown'}
                                </Badge>
                            </div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">System Health</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">Operational</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-emerald-500" />
                                </div>
                                <Badge className={budget?.paused ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}>
                                    {budget?.paused ? 'Paused' : 'Active'}
                                </Badge>
                            </div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Budget Status</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                ${((budget?.spent_cost_usd || 0) / (budget?.max_cost_usd || 1) * 100).toFixed(1)}%
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-amber-500" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Generation Ready</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">Ready</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                    <Rss className="w-6 h-6 text-indigo-500" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Scrapers</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">Active</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Budget Panel */}
                <div className="mb-8">
                  <BudgetGovernorPanel />
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Link href="/admin/cms/budget">
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-md transition-all cursor-pointer h-full">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Budget</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Manage limits</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/cms/generation">
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-500/40 hover:shadow-md transition-all cursor-pointer h-full">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Generation</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Create content</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/cms/health">
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-500/40 hover:shadow-md transition-all cursor-pointer h-full">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                                        <Activity className="w-6 h-6 text-sky-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Health</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">System check</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/cms/scrapers">
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 hover:shadow-md transition-all cursor-pointer h-full">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                        <Rss className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Scrapers</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Data sources</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </AdminPageContainer>
        </AdminLayout>
    );
}
