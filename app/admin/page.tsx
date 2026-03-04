"use client";

import React, { useState } from 'react';
import { logger } from '@/lib/logger';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { 
    FileText, 
    Eye, 
    Calendar, 
    DollarSign, 
    Clock, 
} from 'lucide-react';

import ActionCenter from '@/components/admin/dashboard/ActionCenter';
import ActivityTimeline from '@/components/admin/dashboard/ActivityTimeline';
import SystemHealthStrip from '@/components/admin/dashboard/SystemHealthStrip';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import AdvancedMetricsTable from '@/components/admin/AdvancedMetricsTable';
import MetricBentoCard from '@/components/admin/dashboard/MetricBentoCard';
import ContentVelocityChart from '@/components/admin/dashboard/ContentVelocityChart';
import { motion, AnimatePresence } from 'framer-motion';

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
                logger.warn('Dashboard stats RPC returned zero or error, falling back to direct count:', error);
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
    // Sample sparkline data
    const sparklineData = [
        { value: 400 }, { value: 300 }, { value: 500 }, { value: 450 }, 
        { value: 600 }, { value: 550 }, { value: 700 }
    ];

    const velocityData = [
        { name: 'Mon', views: 2400, articles: 2 },
        { name: 'Tue', views: 1398, articles: 4 },
        { name: 'Wed', views: 9800, articles: 6 },
        { name: 'Thu', views: 3908, articles: 3 },
        { name: 'Fri', views: 4800, articles: 8 },
        { name: 'Sat', views: 3800, articles: 5 },
        { name: 'Sun', views: 4300, articles: 7 },
    ];

    return (
        <AdminLayout>
            <AdminPageContainer>
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pb-10"
                >
                    {/* 1. New Action Center */}
                    <ActionCenter />

                    {/* 2. Unified Bento Dashboard Grid - IA Optimized Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 gap-6 items-start">
                        {/* ROW 1: STRATEGIC GROWTH & PERFORMANCE */}
                        
                        {/* Left Side: Performance Metrics (3/12) */}
                        <div className="xl:col-span-3 space-y-6">
                            <MetricBentoCard 
                                label="Content Volume"
                                value={stats?.total_articles || 0}
                                subtext="Total Lifetime Articles"
                                icon={FileText}
                                variant="cyan"
                                data={sparklineData}
                                href="/admin/articles"
                            />
                            <MetricBentoCard 
                                label="Market Reach"
                                value={(stats?.total_views || 0).toLocaleString()}
                                subtext="Total Lifetime Impressions"
                                icon={Eye}
                                trend="up"
                                trendValue="12.5%"
                                variant="emerald"
                                data={sparklineData}
                                href="/admin/analytics"
                            />
                            <MetricBentoCard 
                                label="Est. Revenue"
                                value="₹2,450"
                                subtext="Daily Affiliate Income"
                                icon={DollarSign}
                                variant="rose"
                                data={sparklineData}
                                href="/admin/monetization"
                            />
                        </div>

                        {/* Center: Momentum (6/12) */}
                        <div className="xl:col-span-6 lg:col-span-2 md:col-span-2">
                            <ContentVelocityChart data={velocityData} />
                        </div>

                        {/* Right Side: Velocity & Pipeline (3/12) */}
                        <div className="xl:col-span-3 space-y-6">
                            <MetricBentoCard 
                                label="Monthly Velocity"
                                value={stats?.articles_this_month || 0}
                                subtext={`Target: 50 | ${Math.round(((stats?.articles_this_month || 0) / 50) * 100)}% to Goal`}
                                icon={Calendar}
                                variant="amber"
                                data={sparklineData}
                                href="/admin/articles"
                            />
                            <MetricBentoCard 
                                label="In Pipeline"
                                value={stats?.draft_articles || 0}
                                subtext="Drafts & Reviews"
                                icon={Clock}
                                variant="purple"
                                data={sparklineData}
                                href="/admin/articles?status=draft"
                            />
                        </div>

                        {/* ROW 2: CONTENT PRODUCTION ENGINE (Full Narrative) */}
                        {/* Giving the lifecycle table full width is the ONLY way to prevent horizontal overlap in its internal columns */}
                        <div className="xl:col-span-12 py-2">
                            <AdvancedMetricsTable timeRange={timeRange} />
                        </div>

                        {/* ROW 3: OPERATIONS & MAINTENANCE HUB */}
                        <div className="xl:col-span-3">
                            <SystemHealthStrip variant="column" />
                        </div>

                        <div className="xl:col-span-4 h-[400px]">
                            <ActivityTimeline activities={stats?.recent_activity || []} />
                        </div>

                        <div className="xl:col-span-5">
                            <QuickActions />
                        </div>
                    </div>
                </motion.div>
            </AdminPageContainer>
        </AdminLayout>
    );
}
