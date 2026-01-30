"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import CMSSubNavigation from '@/components/admin/CMSSubNavigation';
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
            case 'healthy': return 'bg-primary-500/10 text-primary-400 border-primary-500/20';
            case 'degraded': return 'bg-accent-500/10 text-accent-400 border-accent-500/20';
            case 'unhealthy': return 'bg-danger-500/10 text-danger-400 border-danger-500/20';
            default: return 'bg-slate-500/10 text-muted-foreground dark:text-muted-foreground border-slate-500/20';
        }
    };

    return (
        <AdminLayout>
            <CMSSubNavigation />
            <AdminPageContainer>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-2 flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-primary-400" />
                            Pipeline Dashboard
                        </h1>
                        <p className="text-muted-foreground dark:text-muted-foreground">Monitor and manage the AI-powered content pipeline</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-primary-400" />
                                </div>
                                <Badge className={getHealthColor(health.overall)}>
                                    {health.overall || 'Unknown'}
                                </Badge>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-1">System Health</p>
                            <p className="text-2xl font-bold text-foreground dark:text-foreground">Operational</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-secondary-500/10 flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-secondary-400" />
                                </div>
                                <Badge className={budget?.paused ? 'bg-accent-500/10 text-accent-400 border-accent-500/20' : 'bg-primary-500/10 text-primary-400 border-primary-500/20'}>
                                    {budget?.paused ? 'Paused' : 'Active'}
                                </Badge>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-1">Budget Status</p>
                            <p className="text-2xl font-bold text-foreground dark:text-foreground">
                                ${((budget?.spent_cost_usd || 0) / (budget?.max_cost_usd || 1) * 100).toFixed(1)}%
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-primary-400" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-1">Generation Ready</p>
                            <p className="text-2xl font-bold text-foreground dark:text-foreground">Ready</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
                                    <Rss className="w-6 h-6 text-accent-400" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-1">Scrapers</p>
                            <p className="text-2xl font-bold text-foreground dark:text-foreground">Active</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Budget Panel */}
                <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50">
                    <CardHeader className="border-b border-border/50 dark:border-border/50">
                        <CardTitle className="text-lg font-bold text-foreground dark:text-foreground flex items-center gap-3">
                            <DollarSign className="w-5 h-5 text-secondary-400" />
                            Budget Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <BudgetGovernorPanel />
                    </CardContent>
                </Card>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/admin/cms/budget">
                        <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50 hover:border-primary-500/30 transition-all cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-secondary-500/10 flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-secondary-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground dark:text-foreground mb-1">Budget Management</h3>
                                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">Configure spending limits</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/cms/generation">
                        <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50 hover:border-primary-500/30 transition-all cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground dark:text-foreground mb-1">Content Generation</h3>
                                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">Generate articles</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/cms/health">
                        <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50 hover:border-primary-500/30 transition-all cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                                        <Activity className="w-6 h-6 text-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground dark:text-foreground mb-1">Health Monitor</h3>
                                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">System diagnostics</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/cms/scrapers">
                        <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50 hover:border-primary-500/30 transition-all cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
                                        <Rss className="w-6 h-6 text-accent-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground dark:text-foreground mb-1">Scraper Management</h3>
                                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">Manage data scrapers</p>
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
