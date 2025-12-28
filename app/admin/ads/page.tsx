"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plus, Megaphone, Eye, MousePointerClick, TrendingUp } from 'lucide-react';

export default function AdsPage() {
    const { data: adPlacements = [], isLoading } = useQuery({
        queryKey: ['adPlacements'],
        queryFn: () => api.entities.AdPlacement.list(),
        initialData: []
    });

    const totalImpressions = adPlacements.reduce((sum: number, ad: any) => sum + (ad.impressions || 0), 0);
    const totalClicks = adPlacements.reduce((sum: number, ad: any) => sum + (ad.clicks || 0), 0);
    const activeAds = adPlacements.filter((ad: any) => ad.status === 'active').length;

    return (
        <AdminLayout>
            <div className="h-full flex flex-col bg-slate-50">
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Ad Placements</h1>
                            <p className="text-sm text-slate-600 mt-1">Manage advertising campaigns and placements</p>
                        </div>
                        <Button className="bg-teal-600 hover:bg-teal-700">
                            <Plus className="w-4 h-4 mr-2" />
                            New Ad
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Active Ads</p>
                                        <p className="text-2xl font-bold text-slate-900">{activeAds}</p>
                                    </div>
                                    <Megaphone className="w-8 h-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Total Impressions</p>
                                        <p className="text-2xl font-bold text-slate-900">{totalImpressions.toLocaleString()}</p>
                                    </div>
                                    <Eye className="w-8 h-8 text-purple-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Total Clicks</p>
                                        <p className="text-2xl font-bold text-slate-900">{totalClicks.toLocaleString()}</p>
                                    </div>
                                    <MousePointerClick className="w-8 h-8 text-emerald-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Ads List */}
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600">Loading...</p>
                        </div>
                    ) : adPlacements.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Megaphone className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No ad placements</h3>
                                <p className="text-slate-600 mb-4">Create your first ad placement to get started</p>
                                <Button className="bg-teal-600 hover:bg-teal-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Ad
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {adPlacements.map((ad: any) => (
                                <Card key={ad.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-slate-900">{ad.name}</h3>
                                                    <Badge className={
                                                        ad.status === 'active' 
                                                            ? 'bg-emerald-100 text-emerald-700' 
                                                            : ad.status === 'paused'
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-slate-100 text-slate-700'
                                                    }>
                                                        {ad.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-3">
                                                    Position: {ad.position} • Type: {ad.ad_type}
                                                </p>
                                                <div className="flex items-center gap-6 text-sm">
                                                    <span className="text-slate-600">
                                                        <span className="font-medium">{ad.impressions || 0}</span> impressions
                                                    </span>
                                                    <span className="text-slate-600">
                                                        <span className="font-medium">{ad.clicks || 0}</span> clicks
                                                    </span>
                                                    {ad.cpc && (
                                                        <span className="text-slate-600">
                                                            CPC: <span className="font-medium">₹{ad.cpc}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
