"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
    Mail, 
    Send, 
    MousePointerClick,
    TrendingUp,
    Users,
    BarChart3,
    RefreshCw,
    Eye
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface EmailMetrics {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
}

interface EmailCampaign {
    id: string;
    name: string;
    type: 'newsletter' | 'sequence' | 'promotional';
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    date: string;
}

export default function EmailDashboard() {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

    // Fetch email metrics
    const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery<EmailMetrics>({
        queryKey: ['email-metrics', timeRange],
        queryFn: async () => {
            const response = await fetch(`/api/email/analytics?range=${timeRange}`);
            if (!response.ok) throw new Error('Failed to fetch email metrics');
            return response.json();
        }
    });

    // Fetch email campaigns
    const { data: campaigns, isLoading: campaignsLoading } = useQuery<EmailCampaign[]>({
        queryKey: ['email-campaigns', timeRange],
        queryFn: async () => {
            const response = await fetch(`/api/email/campaigns?range=${timeRange}`);
            if (!response.ok) throw new Error('Failed to fetch email campaigns');
            const data = await response.json();
            return data.campaigns || [];
        }
    });

    return (
        <AdminLayout>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Email Marketing Dashboard</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Track email performance, open rates, and conversions
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            {(['7d', '30d', '90d'] as const).map((range) => (
                                <Button
                                    key={range}
                                    variant={timeRange === range ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setTimeRange(range)}
                                >
                                    {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                                </Button>
                            ))}
                        </div>
                        <Button
                            onClick={() => refetchMetrics()}
                            variant="outline"
                            size="sm"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {metricsLoading ? (
                    <div className="text-center py-12">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary-600" />
                        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading email metrics...</p>
                    </div>
                ) : metrics ? (
                    <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                                    <Send className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.sent.toLocaleString()}</div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {metrics.delivered} delivered
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.openRate.toFixed(1)}%</div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {metrics.opened} opened
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.clickRate.toFixed(1)}%</div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {metrics.clicked} clicked
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(2)}%</div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {metrics.converted} converted
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Campaigns Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Email Campaigns
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {campaignsLoading ? (
                                    <div className="text-center py-8">
                                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary-600" />
                                    </div>
                                ) : campaigns && campaigns.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-200 dark:border-slate-800">
                                                    <th className="text-left py-3 px-4 text-sm font-semibold">Campaign</th>
                                                    <th className="text-center py-3 px-4 text-sm font-semibold">Sent</th>
                                                    <th className="text-center py-3 px-4 text-sm font-semibold">Open Rate</th>
                                                    <th className="text-center py-3 px-4 text-sm font-semibold">Click Rate</th>
                                                    <th className="text-center py-3 px-4 text-sm font-semibold">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {campaigns.map((campaign) => (
                                                    <tr
                                                        key={campaign.id}
                                                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                                                    >
                                                        <td className="py-4 px-4">
                                                            <div className="font-medium">{campaign.name}</div>
                                                            <Badge variant="outline" className="mt-1">
                                                                {campaign.type}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-4 px-4 text-center">{campaign.sent}</td>
                                                        <td className="py-4 px-4 text-center">
                                                            <span className={campaign.openRate >= 20 ? 'text-green-600' : 'text-slate-600'}>
                                                                {campaign.openRate.toFixed(1)}%
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            <span className={campaign.clickRate >= 3 ? 'text-green-600' : 'text-slate-600'}>
                                                                {campaign.clickRate.toFixed(1)}%
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-center text-sm text-slate-500">
                                                            {new Date(campaign.date).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        No campaigns found
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <Mail className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p className="text-slate-500">No email data available</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
