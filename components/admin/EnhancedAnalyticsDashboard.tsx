import React, { useState } from 'react';
import { StatCard, ContentSection, ActionButton } from './AdminUIKit';
import { 
    TrendingUp, 
    Eye, 
    FileText, 
    BarChart3, 
    Download,
    Users,
    MousePointerClick,
    DollarSign,
    Sparkles
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type DateRange = 'today' | '7d' | '30d' | '90d' | 'all';

interface AnalyticsData {
    overview: {
        totalArticles: number;
        totalViews: number;
        totalUsers: number;
        totalClicks: number;
        totalRevenue: number;
    };
    timeSeries: {
        date: string;
        views: number;
        users: number;
        clicks: number;
    }[];
    topContent: {
        id: string;
        title: string;
        slug: string;
        views: number;
        category: string;
    }[];
    categoryBreakdown: {
        category: string;
        articleCount: number;
        totalViews: number;
    }[];
    conversionFunnel: {
        stage: string;
        users: number;
        conversionRate: number;
    }[];
}

export default function EnhancedAnalyticsDashboard() {
    const [dateRange, setDateRange] = useState<DateRange>('30d');

    const { data: analytics, isLoading } = useQuery<AnalyticsData>({
        queryKey: ['analytics', dateRange],
        queryFn: async () => {
            const response = await fetch(`/api/analytics/enhanced?range=${dateRange}`);
            if (!response.ok) throw new Error('Failed to fetch analytics');
            return response.json();
        },
        refetchInterval: 60000 // Refresh every minute
    });

    const exportData = () => {
        if (!analytics) return;
        const csv = convertToCSV(analytics);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-32 bg-white rounded-xl animate-pulse shadow-sm border border-wt-border-light" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-wt-border-light shadow-sm">
                <div className="flex items-center gap-2 p-1 bg-wt-bg-hover rounded-lg border border-wt-border-subtle">
                    {(['today', '7d', '30d', '90d', 'all'] as DateRange[]).map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={cn(
                                "px-4 py-2 text-xs font-bold rounded-md transition-all",
                                dateRange === range
                                    ? "bg-white text-wt-navy-900 shadow-sm border border-wt-border-subtle"
                                    : "text-wt-navy-400 hover:text-wt-navy-600"
                            )}
                        >
                            {range === 'today' ? 'Today' : 
                             range === '7d' ? '7D' :
                             range === '30d' ? '30D' :
                             range === '90d' ? '90D' : 'All'}
                        </button>
                    ))}
                </div>
                <ActionButton onClick={exportData} variant="secondary" size="sm" icon={Download}>
                    Download CSV
                </ActionButton>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                    label="Total Views"
                    value={analytics?.overview.totalViews || 0}
                    icon={Eye}
                    change="+5.2%"
                    changeType="positive"
                />
                <StatCard
                    label="Unique Users"
                    value={analytics?.overview.totalUsers || 0}
                    icon={Users}
                />
                <StatCard
                    label="Articles"
                    value={analytics?.overview.totalArticles || 0}
                    icon={FileText}
                />
                <StatCard
                    label="CTR (Clicks)"
                    value={analytics?.overview.totalClicks || 0}
                    icon={MousePointerClick}
                    changeType="positive"
                />
                <StatCard
                    label="Est. Revenue"
                    value={`₹${(analytics?.overview.totalRevenue || 0).toLocaleString()}`}
                    icon={DollarSign}
                    changeType="neutral"
                />
            </div>

            {/* Main Insights Chart Area */}
            <ContentSection 
                title="Traffic Performance Trends" 
                subtitle="Visualisasi data views dan user harian"
                actions={<TrendingUp className="w-5 h-5 text-wt-gold" />}
            >
                <TimeSeriesChart data={analytics?.timeSeries || []} />
            </ContentSection>

            {/* Secondary Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ContentSection title="Top Performing Posts" subtitle="Konten dengan views tertinggi">
                    <TopContentList content={analytics?.topContent || []} />
                </ContentSection>

                <ContentSection title="Conversion Funnel" subtitle="Analisis efisiensi pipeline">
                    <ConversionFunnel funnel={analytics?.conversionFunnel || []} />
                </ContentSection>
            </div>

            {/* Category Analysis */}
            <ContentSection title="Category Saturation" subtitle="Analisis volume konten per kategori">
                <CategoryBreakdown categories={analytics?.categoryBreakdown || []} />
            </ContentSection>
        </div>
    );
}

// ... internal helper components (TimeSeriesChart, TopContentList, etc.) kept but styled ...
// (I will keep them for now but ensure they use subTextStyle and titleStyle from theme)

function TimeSeriesChart({ data }: { data: any[] }) {
    if (data.length === 0) {
        return <div className="text-center py-12 text-wt-navy-300 font-medium">No performance data found for this range</div>;
    }

    const maxViews = Math.max(...data.map(d => d.views));

    return (
        <div className="mt-4">
            <div className="h-64 flex items-end gap-3 px-2">
                {data.map((point, idx) => {
                    const height = (point.views / maxViews) * 100;
                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                            <div className="w-full bg-wt-navy-50 rounded-t-lg relative group overflow-hidden">
                                <div 
                                    className="w-full bg-gradient-to-t from-wt-navy-900 to-wt-navy-700 rounded-t-lg transition-all duration-500 hover:from-wt-gold hover:to-wt-gold-hover"
                                    style={{ height: `${height}%`, minHeight: '4px' }}
                                />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-wt-navy-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    {point.views.toLocaleString()}
                                </div>
                            </div>
                            <div className="text-[10px] font-bold text-wt-navy-400 uppercase tracking-tighter">
                                {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function TopContentList({ content }: { content: any[] }) {
    return (
        <div className="divide-y divide-wt-border-subtle">
            {content.slice(0, 5).map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 hover:bg-wt-bg-hover rounded-lg px-2 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={cn(
                            "w-7 h-7 rounded flex items-center justify-center text-xs font-bold",
                            idx === 0 ? "bg-wt-gold-subtle text-wt-gold" : "bg-wt-navy-50 text-wt-navy-400"
                        )}>
                            {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-wt-navy-900 truncate">
                                {item.title}
                            </div>
                            <div className="text-xs text-wt-navy-400 font-medium">
                                {item.category?.replace(/-/g, ' ')}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-extrabold text-wt-navy-900 ml-4">
                        <Eye className="w-4 h-4 text-wt-navy-200" />
                        {item.views.toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}

function CategoryBreakdown({ categories }: { categories: any[] }) {
    const maxViews = Math.max(...categories.map(c => c.totalViews));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {categories.slice(0, 6).map((cat) => {
                const percentage = maxViews > 0 ? (cat.totalViews / maxViews) * 100 : 0;
                
                return (
                    <div key={cat.category} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-wt-navy-800 capitalize font-bold">
                                {cat.category?.replace(/-/g, ' ') || 'Uncategorized'}
                            </span>
                            <span className="text-wt-navy-400 font-medium">
                                {cat.totalViews.toLocaleString()} Views
                            </span>
                        </div>
                        <div className="h-2 bg-wt-bg-hover rounded-full overflow-hidden border border-wt-border-subtle">
                            <div 
                                className="h-full bg-gradient-to-r from-wt-navy-800 to-wt-navy-600 rounded-full transition-all duration-700"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ConversionFunnel({ funnel }: { funnel: any[] }) {
    return (
        <div className="space-y-6">
            {funnel.map((stage, idx) => {
                const isFirst = idx === 0;
                const width = isFirst ? 100 : stage.conversionRate;
                
                return (
                    <div key={stage.stage} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-wt-navy-800 font-bold">
                                {stage.stage}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-wt-navy-400 font-medium">
                                    {stage.users.toLocaleString()} Users
                                </span>
                                {!isFirst && (
                                    <Badge className="bg-wt-gold-subtle text-wt-gold border-wt-gold/20 font-bold">
                                        {stage.conversionRate.toFixed(1)}% Conversion
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="h-10 bg-wt-bg-hover rounded-lg overflow-hidden border border-wt-border-subtle group">
                            <div 
                                className="h-full bg-wt-navy-900 group-hover:bg-wt-gold flex items-center justify-center text-white font-extrabold text-xs transition-all duration-500"
                                style={{ width: `${width}%` }}
                            >
                                {stage.users.toLocaleString()}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function convertToCSV(data: AnalyticsData): string {
    const headers = ['Date', 'Views', 'Users', 'Clicks'];
    const rows = data.timeSeries.map(point => [
        point.date,
        point.views,
        point.users,
        point.clicks
    ]);
    
    return [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
}
