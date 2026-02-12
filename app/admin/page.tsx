"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { 
    FileText, 
    Eye, 
    Calendar, 
    Clock, 
} from 'lucide-react';

// New Components
import DashboardHero from '@/components/admin/dashboard/DashboardHero';
import ActivityTimeline from '@/components/admin/dashboard/ActivityTimeline';
import SystemHealthStrip from '@/components/admin/dashboard/SystemHealthStrip';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import AdvancedMetricsTable from '@/components/admin/AdvancedMetricsTable';
import KpiCard from '@/components/admin/dashboard/KpiCard';

export default function AdminDashboardPage() {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
    const supabase = createClient();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats-overview'],
        queryFn: async () => {
            // Priority 1: Use the optimized RPC
            const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
            
            // Fallback: If RPC fails or returns all zeros (signaling RLS filter or sync issue), 
            // perform a direct count for integrity verification
            if (error || (data && data.total_articles === 0)) {
                console.warn('Dashboard stats RPC returned zero or error, falling back to direct count:', error);
                const { count: totalArticles } = await supabase
                    .from('articles')
                    .select('*', { count: 'exact', head: true });
                
                const { count: draftArticles } = await supabase
                    .from('articles')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'draft');

                const { count: publishedArticles } = await supabase
                    .from('articles')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'published');

                return {
                    ...data,
                    total_articles: totalArticles || 0,
                    draft_articles: draftArticles || 0,
                    published_articles: publishedArticles || 0,
                    articles_this_month: data?.articles_this_month || 0,
                    total_views: data?.total_views || 0,
                    recent_activity: data?.recent_activity || []
                };
            }
            return data;
        },
        refetchInterval: 60000
    });

    return (
        <AdminLayout>
            <AdminPageContainer>
                <div className="space-y-8">
                    {/* 1. Hero Section */}
                    <DashboardHero />
                    
                    {/* 2. System Health Strip */}
                    <SystemHealthStrip />

                    {/* 3. KPI Cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <KpiCard 
                            label="Total Articles" 
                            value={stats?.total_articles || 0} 
                            subtext="Lifetime content"
                            icon={FileText}
                            href="/admin/articles"
                        />
                        <KpiCard 
                            label="Total Views" 
                            value={(stats?.total_views || 0).toLocaleString()} 
                            subtext="All-time reads"
                            icon={Eye}
                            trend="up"
                            href="/admin/analytics"
                        />
                        <KpiCard 
                            label="This Month" 
                            value={stats?.articles_this_month || 0} 
                            subtext="New articles"
                            icon={Calendar}
                            href="/admin/articles?sort=created_at&direction=desc"
                        />
                        <KpiCard 
                            label="Pending" 
                            value={stats?.draft_articles || 0} 
                            subtext="Drafts & Reviews"
                            icon={Clock}
                            href="/admin/articles?status=draft"
                        />
                    </div>

                    {/* 4. Main Content Grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Left Column (2/3 width) */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Advanced Metrics Table */}
                            <AdvancedMetricsTable timeRange={timeRange} />
                        </div>

                        {/* Right Column (1/3 width) */}
                        <div className="space-y-8">
                            {/* Recent Activity Timeline */}
                            <div className="h-[400px]">
                                <ActivityTimeline activities={stats?.recent_activity || []} />
                            </div>

                            {/* Quick Actions */}
                            <QuickActions />
                        </div>
                    </div>
                </div>
            </AdminPageContainer>
        </AdminLayout>
    );
}
