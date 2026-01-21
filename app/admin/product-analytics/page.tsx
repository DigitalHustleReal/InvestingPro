"use client";

import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { 
    Package, 
    DollarSign, 
    MousePointerClick,
    TrendingUp,
    Link as LinkIcon,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    Download,
    Eye,
    BarChart3,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    Zap
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface ProductAnalytics {
    id: string;
    name: string;
    category: string;
    provider: string;
    clicks: number;
    hasAffiliateLink: boolean;
    affiliateIncome: number;
    conversionRate: number;
    views: number;
    lastUpdated: string;
}

export default function ProductAnalyticsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'revenue' | 'clicks' | 'name'>('revenue');

    // Fetch all products with analytics
    const { data: products = [], isLoading } = useQuery<ProductAnalytics[]>({
        queryKey: ['product-analytics'],
        queryFn: async () => {
            const response = await fetch('/api/admin/products/analytics');
            if (!response.ok) return [];
            return await response.json();
        },
        refetchInterval: 30000 // Refresh every 30s
    });

    // Calculate aggregated stats
    const stats = useMemo(() => {
        const totalProducts = products.length;
        const withAffiliateLinks = products.filter((p: ProductAnalytics) => p.hasAffiliateLink).length;
        const totalRevenue = products.reduce((sum: number, p: ProductAnalytics) => sum + (p.affiliateIncome || 0), 0);
        const totalClicks = products.reduce((sum: number, p: ProductAnalytics) => sum + (p.clicks || 0), 0);
        
        return {
            totalProducts,
            withAffiliateLinks,
            affiliateLinkPercentage: totalProducts > 0 ? Math.round((withAffiliateLinks / totalProducts) * 100) : 0,
            totalRevenue,
            totalClicks,
            avgRevenuePerProduct: totalProducts > 0 ? totalRevenue / totalProducts : 0
        };
    }, [products]);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = new Set(products.map((p: ProductAnalytics) => p.category));
        return ['all', ...Array.from(cats)];
    }, [products]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = products.filter((p: ProductAnalytics) => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 p.provider.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        // Sort
        filtered.sort((a: ProductAnalytics, b: ProductAnalytics) => {
            if (sortBy === 'revenue') return (b.affiliateIncome || 0) - (a.affiliateIncome || 0);
            if (sortBy === 'clicks') return (b.clicks || 0) - (a.clicks || 0);
            return a.name.localeCompare(b.name);
        });

        return filtered;
    }, [products, searchTerm, selectedCategory, sortBy]);

    // Category breakdown
    const categoryStats = useMemo(() => {
        const stats: Record<string, { count: number; revenue: number; clicks: number }> = {};
        
        products.forEach((p: ProductAnalytics) => {
            if (!stats[p.category]) {
                stats[p.category] = { count: 0, revenue: 0, clicks: 0 };
            }
            stats[p.category].count++;
            stats[p.category].revenue += p.affiliateIncome || 0;
            stats[p.category].clicks += p.clicks || 0;
        });

        return Object.entries(stats).map(([category, data]) => ({
            category,
            ...data
        })).sort((a, b) => b.revenue - a.revenue);
    }, [products]);

    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-2">Product Performance Analytics</h1>
                        <p className="text-muted-foreground dark:text-muted-foreground">Track clicks, revenue, and affiliate performance per product</p>
                    </div>
                    <Button className="bg-primary-500 hover:bg-primary-600">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        label="Total Products"
                        value={stats.totalProducts}
                        icon={Package}
                        color="primary"
                        trend={`${stats.withAffiliateLinks} monetized`}
                    />
                    <StatCard
                        label="Total Clicks"
                        value={stats.totalClicks.toLocaleString()}
                        icon={MousePointerClick}
                        color="secondary"
                        trend="Last 30 days"
                    />
                    <StatCard
                        label="Total Revenue"
                        value={`₹${stats.totalRevenue.toLocaleString()}`}
                        icon={DollarSign}
                        color="success"
                        trend={`₹${Math.round(stats.avgRevenuePerProduct)}/product avg`}
                    />
                    <StatCard
                        label="Monetization"
                        value={`${stats.affiliateLinkPercentage}%`}
                        icon={LinkIcon}
                        color="accent"
                        trend={`${stats.withAffiliateLinks}/${stats.totalProducts} products`}
                    />
                </div>

                {/* Filters & Search */}
                <Card className="bg-white/5 border-border dark:border-border rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                                <Input
                                    placeholder="Search products or providers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white/5 border-border dark:border-border text-foreground dark:text-foreground h-11"
                                />
                            </div>

                            {/* Category Filter */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 bg-white/5 border border-border dark:border-border rounded-xl text-foreground dark:text-foreground text-sm h-11"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat} className="bg-surface-darker dark:bg-surface-darker">
                                        {cat === 'all' ? 'All Categories' : cat}
                                    </option>
                                ))}
                            </select>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-4 py-2 bg-white/5 border border-border dark:border-border rounded-xl text-foreground dark:text-foreground text-sm h-11"
                            >
                                <option value="revenue" className="bg-surface-darker dark:bg-surface-darker">Highest Revenue</option>
                                <option value="clicks" className="bg-surface-darker dark:bg-surface-darker">Most Clicks</option>
                                <option value="name" className="bg-surface-darker dark:bg-surface-darker">Name (A-Z)</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Category Breakdown Cards */}
                <div>
                    <h2 className="text-xl font-bold text-foreground dark:text-foreground mb-4">Performance by Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {categoryStats.slice(0, 6).map((cat) => (
                            <Card key={cat.category} className="bg-white/5 border-border dark:border-border rounded-xl hover:border-primary-500/30 transition-all">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-foreground dark:text-foreground capitalize">{cat.category}</h3>
                                        <Badge className="bg-primary-500/20 text-primary-400 border-primary-500/30">
                                            {cat.count} products
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground/70 dark:text-muted-foreground/70 text-xs uppercase tracking-wider mb-1">Revenue</p>
                                            <p className="text-success-400 font-bold">₹{cat.revenue.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground/70 dark:text-muted-foreground/70 text-xs uppercase tracking-wider mb-1">Clicks</p>
                                            <p className="text-secondary-400 font-bold">{cat.clicks.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Products Table */}
                <Card className="bg-white/5 border-border dark:border-border rounded-2xl">
                    <CardHeader className="border-b border-border dark:border-border">
                        <CardTitle className="text-foreground dark:text-foreground flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary-400" />
                            All Products ({filteredProducts.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-20 text-center text-muted-foreground dark:text-muted-foreground">Loading products...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="p-20 text-center">
                                <Package className="w-12 h-12 text-muted-foreground/50 dark:text-muted-foreground/50 mx-auto mb-4" />
                                <p className="text-muted-foreground dark:text-muted-foreground">No products match your filters</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5">
                                        <tr className="text-left text-xs text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                                            <th className="p-4">Product</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4 text-center">Affiliate Link</th>
                                            <th className="p-4 text-right">Views</th>
                                            <th className="p-4 text-right">Clicks</th>
                                            <th className="p-4 text-right">CTR</th>
                                            <th className="p-4 text-right">Revenue</th>
                                            <th className="p-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredProducts.map((product: ProductAnalytics) => (
                                            <ProductRow key={product.id} product={product} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

const statColors = {
    primary: 'from-primary-500/20 to-primary-600/10 border-primary-500/30',
    success: 'from-success-500/20 to-success-600/10 border-success-500/30',
    secondary: 'from-secondary-500/20 to-secondary-600/10 border-secondary-500/30',
    accent: 'from-accent-500/20 to-accent-600/10 border-accent-500/30'
} as const;

type StatColor = keyof typeof statColors;

function StatCard(
    {
        label,
        value,
        icon: Icon,
        color = 'primary',
        trend
    }: {
        label: string;
        value: string | number;
        icon: React.ComponentType<{ className?: string }>;
        color?: StatColor;
        trend?: string;
    }
) {
    return (
        <Card className={`bg-gradient-to-br ${statColors[color]} border rounded-2xl`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-5 h-5 text-${color}-400`} />
                    <span className="text-xs text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">{label}</span>
                </div>
                <div className="text-3xl font-bold text-foreground dark:text-foreground mb-1">{value}</div>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">{trend}</p>
            </CardContent>
        </Card>
    );
}

function ProductRow({ product }: { product: ProductAnalytics }) {
    const ctr = product.views > 0 ? ((product.clicks / product.views) * 100).toFixed(1) : '0.0';
    const hasRevenue = product.affiliateIncome > 0;

    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="p-4">
                <div>
                    <p className="font-medium text-foreground dark:text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">{product.provider}</p>
                </div>
            </td>
            <td className="p-4">
                <Badge variant="outline" className="text-xs capitalize border-border/70 dark:border-border/70 text-foreground/80 dark:text-foreground/80">
                    {product.category}
                </Badge>
            </td>
            <td className="p-4 text-center">
                {product.hasAffiliateLink ? (
                    <CheckCircle2 className="w-5 h-5 text-success-500 mx-auto" />
                ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground/50 dark:text-muted-foreground/50 mx-auto" />
                )}
            </td>
            <td className="p-4 text-right text-foreground/80 dark:text-foreground/80">{product.views?.toLocaleString() || '0'}</td>
            <td className="p-4 text-right">
                <span className="text-secondary-400 font-semibold">{product.clicks?.toLocaleString() || '0'}</span>
            </td>
            <td className="p-4 text-right">
                <span className={`font-semibold ${parseFloat(ctr) > 2 ? 'text-success-400' : 'text-muted-foreground dark:text-muted-foreground'}`}>
                    {ctr}%
                </span>
            </td>
            <td className="p-4 text-right">
                {hasRevenue ? (
                    <span className="text-success-400 font-bold">₹{product.affiliateIncome.toLocaleString()}</span>
                ) : (
                    <span className="text-muted-foreground/50 dark:text-muted-foreground/50">₹0</span>
                )}
            </td>
            <td className="p-4">
                <div className="flex items-center justify-center gap-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <BarChart3 className="w-4 h-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}
