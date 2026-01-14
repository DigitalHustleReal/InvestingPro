"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
    DollarSign, 
    MousePointer2, 
    TrendingUp, 
    Link2, 
    Plus,
    ExternalLink,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

interface AffiliateStats {
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    conversionRate: number;
    topPartners: { partner: string; clicks: number; revenue: number }[];
    topLinks: { name: string; clicks: number; conversions: number }[];
}

export default function AffiliatesPage() {
    const { data: stats, isLoading } = useQuery<AffiliateStats>({
        queryKey: ['affiliate-stats'],
        queryFn: async () => {
            const response = await fetch('/api/admin/affiliates?type=stats');
            if (!response.ok) throw new Error('Failed to fetch stats');
            return response.json();
        },
        refetchInterval: 60000
    });

    const metrics = [
        {
            label: 'Total Clicks',
            value: stats?.totalClicks || 0,
            icon: MousePointer2,
            color: 'text-secondary-400',
            bg: 'bg-secondary-500/10',
            change: '+12%',
            changeType: 'up'
        },
        {
            label: 'Conversions',
            value: stats?.totalConversions || 0,
            icon: TrendingUp,
            color: 'text-primary-400',
            bg: 'bg-primary-500/10',
            change: '+8%',
            changeType: 'up'
        },
        {
            label: 'Revenue',
            value: `â‚¹${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'text-accent-400',
            bg: 'bg-accent-500/10',
            change: '+15%',
            changeType: 'up'
        },
        {
            label: 'Conversion Rate',
            value: `${(stats?.conversionRate || 0).toFixed(1)}%`,
            icon: BarChart3,
            color: 'text-secondary-400',
            bg: 'bg-secondary-500/10',
            change: '-2%',
            changeType: 'down'
        }
    ];

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="p-8 flex items-center justify-center h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-8 max-w-[1600px] mx-auto w-full">
                {/* Breadcrumb */}
                <AdminBreadcrumb />
                
                {/* Header */}
                <div className="mb-10 border-b border-white/5 pb-8 mt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                                    <DollarSign className="w-6 h-6 text-accent-400" />
                                </div>
                                Affiliate Dashboard
                                <Badge className="bg-primary-500/10 text-primary-400 border-primary-500/20 ml-2 font-bold tracking-wider">
                                    LIVE
                                </Badge>
                            </h1>
                            <p className="text-slate-400 mt-3 ml-16 font-medium tracking-wide max-w-2xl">
                                Track affiliate performance, clicks, conversions, and revenue.
                            </p>
                        </div>
                        <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            New Link
                        </Button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {metrics.map((metric, idx) => (
                        <Card key={idx} className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", metric.bg)}>
                                        <metric.icon className={cn("w-5 h-5", metric.color)} />
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-1 text-xs font-bold",
                                        metric.changeType === 'up' ? 'text-primary-400' : 'text-rose-400'
                                    )}>
                                        {metric.changeType === 'up' 
                                            ? <ArrowUpRight className="w-3 h-3" />
                                            : <ArrowDownRight className="w-3 h-3" />
                                        }
                                        {metric.change}
                                    </div>
                                </div>
                                <div className="text-3xl font-extrabold text-white tracking-tight">
                                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                                </div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                    {metric.label}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Top Partners */}
                    <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-white/5 px-6 py-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-6 md:p-8">
                                <TrendingUp className="w-4 h-4 text-primary-400" />
                                Top Partners
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {stats?.topPartners && stats.topPartners.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {stats.topPartners.map((partner, idx) => (
                                        <div key={idx} className="flex items-center justify-between px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                                                    idx === 0 ? "bg-accent-500/20 text-accent-400" :
                                                    idx === 1 ? "bg-slate-500/20 text-slate-400" :
                                                    "bg-accent-500/20 text-accent-400"
                                                )}>
                                                    {idx + 1}
                                                </div>
                                                <span className="font-semibold text-white">{partner.partner}</span>
                                            </div>
                                            <div className="flex items-center gap-6 text-sm">
                                                <div className="text-right">
                                                    <div className="text-slate-400">{partner.clicks} clicks</div>
                                                </div>
                                                <div className="text-right min-w-[80px]">
                                                    <div className="font-bold text-primary-400">â‚¹{partner.revenue}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-slate-500">
                                    No partner data yet
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Top Links */}
                    <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-white/5 px-6 py-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-6 md:p-8">
                                <Link2 className="w-4 h-4 text-primary-400" />
                                Top Performing Links
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {stats?.topLinks && stats.topLinks.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {stats.topLinks.slice(0, 5).map((link, idx) => (
                                        <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <span className="text-sm font-medium text-white line-clamp-1">{link.name}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <Badge className="bg-secondary-500/10 text-secondary-400 border-0">
                                                    {link.clicks} clicks
                                                </Badge>
                                                <Badge className="bg-primary-500/10 text-primary-400 border-0">
                                                    {link.conversions} conv
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-slate-500">
                                    No link data yet
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border-primary-500/20 rounded-2xl p-6">
                        <h4 className="font-bold text-white mb-2">Create Short Link</h4>
                        <p className="text-sm text-slate-400 mb-4">Generate trackable affiliate links</p>
                        <Button variant="ghost" className="text-primary-400 hover:text-primary-300 p-0 h-auto">
                            Create Link â†’
                        </Button>
                    </Card>
                    <Card className="bg-gradient-to-br from-success-500/10 to-primary-500/10 border-primary-500/20 rounded-2xl p-6">
                        <h4 className="font-bold text-white mb-2">Add Partner</h4>
                        <p className="text-sm text-slate-400 mb-4">Register new affiliate partners</p>
                        <Button variant="ghost" className="text-primary-400 hover:text-primary-300 p-0 h-auto">
                            Add Partner â†’
                        </Button>
                    </Card>
                    <Card className="bg-gradient-to-br from-accent-500/10 to-orange-500/10 border-accent-500/20 rounded-2xl p-6">
                        <h4 className="font-bold text-white mb-2">Export Report</h4>
                        <p className="text-sm text-slate-400 mb-4">Download performance data</p>
                        <Button variant="ghost" className="text-accent-400 hover:text-accent-300 p-0 h-auto">
                            Export CSV â†’
                        </Button>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
