"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/api-client';
import { Plus, Megaphone, Eye, MousePointerClick, Edit, Pause, Play, Trash2 } from 'lucide-react';
import { AdminPageHeader, ContentSection, StatCard, StatusBadge, ActionButton, EmptyState } from '@/components/admin/AdminUIKit';

export default function AdsPage() {
    const { data: adPlacements = [], isLoading } = useQuery({
        queryKey: ['adPlacements'],
        queryFn: () => api.entities.AdPlacement.list(),
        initialData: []
    });

    const totalImpressions = adPlacements.reduce((sum: number, ad: any) => sum + (ad.impressions || 0), 0);
    const totalClicks = adPlacements.reduce((sum: number, ad: any) => sum + (ad.clicks || 0), 0);
    const activeAds = adPlacements.filter((ad: any) => ad.status === 'active').length;
    const pausedAds = adPlacements.filter((ad: any) => ad.status === 'paused').length;

    const getStatusVariant = (status: string): 'neutral' | 'completed' | 'warning' | 'error' => {
        switch (status) {
            case 'active': return 'completed';
            case 'paused': return 'warning';
            case 'inactive': return 'error';
            default: return 'neutral';
        }
    };

    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                <AdminPageHeader
                    title="Ad Placements"
                    subtitle="Manage advertising campaigns and placements"
                    icon={Megaphone}
                    iconColor="purple"
                    actions={
                        <ActionButton icon={Plus}>New Ad</ActionButton>
                    }
                />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Active Ads" value={activeAds} icon={Play} color="teal" />
                    <StatCard label="Paused" value={pausedAds} icon={Pause} color="amber" />
                    <StatCard label="Impressions" value={totalImpressions.toLocaleString()} icon={Eye} color="purple" />
                    <StatCard label="Total Clicks" value={totalClicks.toLocaleString()} icon={MousePointerClick} color="blue" />
                </div>

                {/* Ads List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-secondary-500/30 border-t-purple-500 rounded-full animate-spin" />
                    </div>
                ) : adPlacements.length === 0 ? (
                    <ContentSection>
                        <EmptyState
                            icon={Megaphone}
                            title="No ad placements"
                            description="Create your first ad placement to start monetizing"
                            action={<ActionButton icon={Plus}>Create Ad</ActionButton>}
                        />
                    </ContentSection>
                ) : (
                    <ContentSection>
                        <div className="overflow-x-auto -mx-6">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-border dark:border-border">
                                        <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">Name</th>
                                        <th className="px-4 py-4 text-left text-xs font-medium text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">Position</th>
                                        <th className="px-4 py-4 text-left text-xs font-medium text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">Status</th>
                                        <th className="px-4 py-4 text-left text-xs font-medium text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">Impressions</th>
                                        <th className="px-4 py-4 text-left text-xs font-medium text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">Clicks</th>
                                        <th className="px-4 py-4 text-left text-xs font-medium text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">CTR</th>
                                        <th className="px-4 py-4 text-right text-xs font-medium text-muted-foreground/70 dark:text-muted-foreground/70 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {adPlacements.map((ad: any) => {
                                        const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0.00';
                                        return (
                                            <tr key={ad.id} className="group hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-secondary-500/20 border border-secondary-500/30 flex items-center justify-center">
                                                            <Megaphone className="w-5 h-5 text-secondary-400" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-foreground dark:text-foreground">{ad.name}</div>
                                                            <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 capitalize">{ad.ad_type}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <code className="text-xs bg-white/5 px-2 py-1 rounded text-muted-foreground dark:text-muted-foreground border border-border dark:border-border">
                                                        {ad.position}
                                                    </code>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <StatusBadge status={getStatusVariant(ad.status)}>
                                                        {ad.status}
                                                    </StatusBadge>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2 text-foreground dark:text-foreground">
                                                        <Eye className="w-4 h-4 text-muted-foreground/70 dark:text-muted-foreground/70" />
                                                        {(ad.impressions || 0).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2 text-foreground dark:text-foreground">
                                                        <MousePointerClick className="w-4 h-4 text-muted-foreground/70 dark:text-muted-foreground/70" />
                                                        {(ad.clicks || 0).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`text-sm font-medium ${
                                                        parseFloat(ctr) > 2 ? 'text-primary-400' : 
                                                        parseFloat(ctr) > 1 ? 'text-accent-400' : 'text-muted-foreground dark:text-muted-foreground'
                                                    }`}>
                                                        {ctr}%
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-2 hover:bg-white/10 rounded-lg text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:text-foreground transition-colors">
                                                            {ad.status === 'active' ? (
                                                                <Pause className="w-4 h-4" />
                                                            ) : (
                                                                <Play className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                        <button className="p-2 hover:bg-white/10 rounded-lg text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:text-foreground transition-colors">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 hover:bg-danger-500/20 rounded-lg text-muted-foreground dark:text-muted-foreground hover:text-danger-400 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </ContentSection>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ContentSection>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500/20 to-pink-500/20 border border-secondary-500/30 flex items-center justify-center shrink-0">
                                <Megaphone className="w-6 h-6 text-secondary-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground dark:text-foreground mb-1">Create Banner Ad</h4>
                                <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-3">Display banners on articles</p>
                                <button className="text-sm text-secondary-400 hover:text-secondary-300 font-medium">Create →</button>
                            </div>
                        </div>
                    </ContentSection>
                    <ContentSection>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-success-500/20 border border-primary-500/30 flex items-center justify-center shrink-0">
                                <Eye className="w-6 h-6 text-primary-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground dark:text-foreground mb-1">Native Ad Units</h4>
                                <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-3">Seamless in-content ads</p>
                                <button className="text-sm text-primary-400 hover:text-primary-300 font-medium">Configure →</button>
                            </div>
                        </div>
                    </ContentSection>
                    <ContentSection>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/20 to-orange-500/20 border border-accent-500/30 flex items-center justify-center shrink-0">
                                <MousePointerClick className="w-6 h-6 text-accent-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground dark:text-foreground mb-1">View Analytics</h4>
                                <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-3">Performance insights</p>
                                <button className="text-sm text-accent-400 hover:text-accent-300 font-medium">View →</button>
                            </div>
                        </div>
                    </ContentSection>
                </div>
            </div>
        </AdminLayout>
    );
}
