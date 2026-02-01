"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
    TrendingUp, 
    TrendingDown, 
    Eye, 
    MousePointerClick, 
    DollarSign,
    Package,
    Building2,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Users,
    Percent,
    Calendar
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ProductPerformanceTrackingProps {
    timeRange?: '7d' | '30d' | '90d' | 'all';
}

/**
 * ProductPerformanceTracking - Comprehensive product and affiliate performance tracking
 * 
 * Tracks:
 * - Product listings and views
 * - Affiliate link clicks and conversions
 * - Earnings from each product/brand
 * - Brand promotion performance
 * - Conversion rates and revenue
 */
export default function ProductPerformanceTracking({ timeRange = '30d' }: ProductPerformanceTrackingProps) {
    // Fetch product performance data
    const { data: productStats = { totals: {}, topProducts: [], categoryStats: [] } } = useQuery({
        queryKey: ['product-performance', timeRange],
        queryFn: async () => {
            const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
            const response = await fetch(`/api/analytics/products?days=${days}`);
            if (!response.ok) throw new Error('Failed to fetch product stats');
            return response.json();
        },
        initialData: { totals: {}, topProducts: [], categoryStats: [] },
    });

    // Fetch affiliate performance data
    const { data: affiliateStats = { totals: {}, topAffiliates: [], topLinks: [] } } = useQuery({
        queryKey: ['affiliate-performance', timeRange],
        queryFn: async () => {
            const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
            const response = await fetch(`/api/analytics/affiliates?days=${days}`);
            if (!response.ok) throw new Error('Failed to fetch affiliate stats');
            return response.json();
        },
        initialData: { totals: {}, topAffiliates: [], topLinks: [] },
    });

    // Fetch brand promotion data
    const { data: brandStats = { totals: {}, topBrands: [], promotions: [] } } = useQuery({
        queryKey: ['brand-performance', timeRange],
        queryFn: async () => {
            const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
            const response = await fetch(`/api/analytics/brands?days=${days}`);
            if (!response.ok) throw new Error('Failed to fetch brand stats');
            return response.json();
        },
        initialData: { totals: {}, topBrands: [], promotions: [] },
    });

    const totals = productStats.totals || {};
    const affiliateTotals = affiliateStats.totals || {};
    const brandTotals = brandStats.totals || {};

    // Calculate metrics
    const totalProductViews = totals.views || 0;
    const totalClicks = affiliateTotals.clicks || 0;
    const totalConversions = affiliateTotals.conversions || 0;
    const totalRevenue = affiliateTotals.revenue || 0;
    const totalProducts = totals.productCount || 0;
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100) : 0;
    const avgRevenuePerConversion = totalConversions > 0 ? (totalRevenue / totalConversions) : 0;

    // Prepare chart data (revenue over time - last 7 days)
    const revenueChartData = React.useMemo(() => {
        const days = 7;
        const data = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Mock data - in production, fetch from API
            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: Math.floor(Math.random() * 5000) + 1000,
                clicks: Math.floor(Math.random() * 200) + 50,
                conversions: Math.floor(Math.random() * 20) + 5,
            });
        }
        
        return data;
    }, []);

    // Category performance for pie chart
    const categoryData = React.useMemo(() => {
        const categories = productStats.categoryStats || [];
        return categories.map((cat: any, idx: number) => ({
            name: cat.category,
            value: cat.revenue || 0,
            color: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'][idx % 6]
        }));
    }, [productStats.categoryStats]);

    const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

    return (
        <div className="space-y-10">
            {/* High-Impact Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden hover:border-wt-gold/30 transition-all group">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-[0.2em]">Product Views</span>
                            <div className="w-10 h-10 rounded-xl bg-wt-gold-subtle flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                <Eye className="w-5 h-5 text-wt-gold" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-extrabold text-wt-text dark:text-wt-text tabular-nums tracking-tight tracking-tighter">
                                {totalProductViews.toLocaleString()}
                            </h3>
                            <p className="text-[10px] font-bold text-wt-gold uppercase tracking-widest flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Product Engagement
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden hover:border-secondary-500/30 transition-all group">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-[0.2em]">Affiliate Clicks</span>
                            <div className="w-10 h-10 rounded-xl bg-secondary-500/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                <MousePointerClick className="w-5 h-5 text-wt-gold" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-extrabold text-wt-text dark:text-wt-text tabular-nums tracking-tighter">
                                {totalClicks.toLocaleString()}
                            </h3>
                            <p className="text-[10px] font-bold text-wt-gold uppercase tracking-widest flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                Conversion Velocity
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden hover:border-wt-gold/30 transition-all group">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-[0.2em]">Total Revenue</span>
                            <div className="w-10 h-10 rounded-xl bg-wt-gold-subtle flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                <DollarSign className="w-5 h-5 text-wt-gold" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-extrabold text-wt-text dark:text-wt-text tabular-nums tracking-tighter">
                                ₹{totalRevenue.toLocaleString()}
                            </h3>
                            <p className="text-[10px] font-bold text-wt-gold uppercase tracking-widest flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {conversionRate.toFixed(1)}% Conversion Rate
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden hover:border-slate-500/30 transition-all group">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-[0.2em]">Active Products</span>
                            <div className="w-10 h-10 rounded-xl bg-wt-card flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                <Package className="w-5 h-5 text-wt-text-muted dark:text-wt-text-muted" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-extrabold text-wt-text dark:text-wt-text tabular-nums tracking-tighter">
                                {totalProducts}
                            </h3>
                            <p className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-widest">Product Inventory</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Visual Intelligence Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-wt-border/50 dark:border-wt-border/50 px-8 py-6">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-wt-text-muted dark:text-wt-text-muted flex items-center gap-6 md:p-8">
                            <BarChart3 className="w-4 h-4 text-wt-gold" />
                            Revenue & Conversions (7D Temporal)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={revenueChartData}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#10b981" 
                                    strokeWidth={4} 
                                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    name="Revenue (₹)"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="clicks" 
                                    stroke="#3b82f6" 
                                    strokeWidth={3} 
                                    dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }}
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                    name="Clicks"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-wt-border/50 dark:border-wt-border/50 px-8 py-6">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-wt-text-muted dark:text-wt-text-muted flex items-center gap-6 md:p-8">
                            <TrendingUp className="w-4 h-4 text-wt-gold" />
                            Revenue by Category
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    formatter={(value: any) => `₹${value.toLocaleString()}`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Top Products by Revenue */}
            <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden">
                <CardHeader className="border-b border-wt-border/50 dark:border-wt-border/50 px-8 py-5">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-wt-gold flex items-center gap-6 md:p-8">
                        <TrendingUp className="w-4 h-4" />
                        Top Products by Revenue
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {productStats.topProducts && productStats.topProducts.length > 0 ? (
                            productStats.topProducts.slice(0, 10).map((product: any, idx: number) => (
                                <div key={product.id || idx} className="flex items-center justify-between p-6 hover:bg-wt-surface/50 dark:bg-wt-surface/50 transition-colors group">
                                    <div className="flex items-center gap-5 flex-1 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-wt-gold-subtle flex items-center justify-center text-[10px] font-bold text-wt-gold border border-wt-gold/20">
                                            0{idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-wt-text dark:text-wt-text tracking-tight line-clamp-1 group-hover:text-wt-gold transition-colors">
                                                {product.name || 'Unknown Product'}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-widest">
                                                    {product.category || 'Standard'}
                                                </p>
                                                <Badge variant="outline" className="text-[9px] border-wt-gold/20 text-wt-gold">
                                                    {product.company || 'Brand'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right ml-4 space-y-1">
                                        <p className="text-sm font-bold text-wt-gold px-3 py-1 bg-wt-gold-subtle rounded-lg tabular-nums border border-wt-gold/20">
                                            ₹{product.revenue?.toLocaleString() || 0}
                                        </p>
                                        <div className="flex items-center gap-2 text-[9px] text-wt-text-muted/70 dark:text-wt-text-muted/70">
                                            <span>{product.clicks || 0} clicks</span>
                                            <span>•</span>
                                            <span>{product.conversions || 0} conv</span>
                                            <span>•</span>
                                            <span className="text-wt-gold">{product.conversionRate?.toFixed(1) || 0}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-wt-text-muted/50 dark:text-wt-text-muted/50 font-bold uppercase tracking-widest text-[10px]">No product data available</div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Top Affiliates/Brands */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-wt-border/50 dark:border-wt-border/50 px-8 py-5">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-wt-gold flex items-center gap-6 md:p-8">
                            <Building2 className="w-4 h-4" />
                            Top Affiliate Partners
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/5">
                            {affiliateStats.topAffiliates && affiliateStats.topAffiliates.length > 0 ? (
                                affiliateStats.topAffiliates.slice(0, 5).map((affiliate: any, idx: number) => (
                                    <div key={affiliate.id || idx} className="flex items-center justify-between p-6 hover:bg-wt-surface/50 dark:bg-wt-surface/50 transition-colors group">
                                        <div className="flex items-center gap-5 flex-1 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-wt-gold-subtle flex items-center justify-center text-[10px] font-bold text-wt-gold border border-wt-gold/20">
                                                0{idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-wt-text dark:text-wt-text tracking-tight line-clamp-1 group-hover:text-wt-gold transition-colors">
                                                    {affiliate.name || affiliate.partner || 'Unknown Partner'}
                                                </p>
                                                <p className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-widest mt-1">
                                                    {affiliate.commission_type || 'CPA'} • {affiliate.commission_rate || 0}%
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-sm font-bold text-wt-text dark:text-wt-text px-3 py-1 bg-wt-surface-hover rounded-lg tabular-nums">
                                                ₹{affiliate.revenue?.toLocaleString() || 0}
                                            </p>
                                            <p className="text-[9px] font-semibold text-wt-text-muted/50 dark:text-wt-text-muted/50 uppercase tracking-st mt-1">
                                                {affiliate.clicks || 0} clicks
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-wt-text-muted/50 dark:text-wt-text-muted/50 font-bold uppercase tracking-widest text-[10px]">No affiliate data available</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-wt-border/50 dark:border-wt-border/50 px-8 py-5">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-wt-gold flex items-center gap-6 md:p-8">
                            <Target className="w-4 h-4" />
                            Brand Promotions Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/5">
                            {brandStats.topBrands && brandStats.topBrands.length > 0 ? (
                                brandStats.topBrands.slice(0, 5).map((brand: any, idx: number) => (
                                    <div key={brand.id || idx} className="flex items-center justify-between p-6 hover:bg-wt-surface/50 dark:bg-wt-surface/50 transition-colors group">
                                        <div className="flex items-center gap-5 flex-1 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-wt-gold-subtle flex items-center justify-center text-[10px] font-bold text-wt-gold border border-wt-gold/20">
                                                0{idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-wt-text dark:text-wt-text tracking-tight line-clamp-1 group-hover:text-wt-gold transition-colors">
                                                    {brand.name || brand.company || 'Unknown Brand'}
                                                </p>
                                                <p className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase tracking-widest mt-1">
                                                    {brand.activePromotions || 0} active promotions
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-sm font-bold text-wt-gold px-3 py-1 bg-wt-gold-subtle rounded-lg tabular-nums border border-wt-gold/20">
                                                ₹{brand.revenue?.toLocaleString() || 0}
                                            </p>
                                            <p className="text-[9px] font-semibold text-wt-text-muted/50 dark:text-wt-text-muted/50 uppercase tracking-st mt-1">
                                                {brand.impressions || 0} impressions
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-wt-text-muted/50 dark:text-wt-text-muted/50 font-bold uppercase tracking-widest text-[10px]">No brand data available</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Key Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Percent className="w-5 h-5 text-wt-gold" />
                            <span className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase">Conversion Rate</span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-wt-text dark:text-wt-text tabular-nums">
                            {conversionRate.toFixed(2)}%
                        </h3>
                        <p className="text-[10px] text-wt-text-muted/70 dark:text-wt-text-muted/70 mt-2">
                            {totalConversions} conversions from {totalClicks} clicks
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <DollarSign className="w-5 h-5 text-wt-gold" />
                            <span className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase">Avg Revenue/Conv</span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-wt-text dark:text-wt-text tabular-nums">
                            ₹{avgRevenuePerConversion.toFixed(0)}
                        </h3>
                        <p className="text-[10px] text-wt-text-muted/70 dark:text-wt-text-muted/70 mt-2">
                            Average earnings per conversion
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="w-5 h-5 text-wt-gold" />
                            <span className="text-[10px] font-bold text-wt-text-muted/70 dark:text-wt-text-muted/70 uppercase">Active Brands</span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-wt-text dark:text-wt-text tabular-nums">
                            {brandStats.topBrands?.length || 0}
                        </h3>
                        <p className="text-[10px] text-wt-text-muted/70 dark:text-wt-text-muted/70 mt-2">
                            Brands with active promotions
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
