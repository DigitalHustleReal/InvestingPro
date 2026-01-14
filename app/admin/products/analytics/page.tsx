"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MousePointerClick, 
  DollarSign,
  RefreshCw,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';

interface ProductStats {
  slug: string;
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: string;
  conversionRate: string;
}

interface AnalyticsData {
  totals: {
    totalViews: number;
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
  };
  topProducts: ProductStats[];
  avgCTR: string;
  period: { days: number };
}

export default function ProductAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/product-stats?days=${days}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [days]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return `â‚¹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-emerald-400 bg-clip-text text-transparent">
            Product Intelligence
          </h1>
          <p className="text-slate-400 mt-1">Track views, clicks, and conversions across all products</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={days} 
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <Button 
            onClick={fetchData}
            variant="outline"
            className="border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : data ? (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Total Views</p>
                    <p className="text-3xl font-bold">{formatNumber(data.totals.totalViews)}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-primary-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Total Clicks</p>
                    <p className="text-3xl font-bold">{formatNumber(data.totals.totalClicks)}</p>
                    <p className="text-xs text-primary-400 mt-1">CTR: {data.avgCTR}%</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary-500/20 rounded-xl flex items-center justify-center">
                    <MousePointerClick className="w-6 h-6 text-secondary-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Conversions</p>
                    <p className="text-3xl font-bold">{formatNumber(data.totals.totalConversions)}</p>
                  </div>
                  <div className="w-12 h-12 bg-success-500/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-success-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Revenue</p>
                    <p className="text-3xl font-bold">{formatCurrency(data.totals.totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-accent-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products Table */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                Top Products by Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Product</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Views</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Clicks</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">CTR</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Conversions</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Conv. Rate</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProducts.map((product, index) => (
                      <tr key={product.slug} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="font-medium text-white truncate max-w-[200px]">
                              {product.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-mono">{formatNumber(product.views)}</td>
                        <td className="py-4 px-4 text-right font-mono">{formatNumber(product.clicks)}</td>
                        <td className="py-4 px-4 text-right">
                          <span className={`font-mono ${parseFloat(product.ctr) > 5 ? 'text-success-400' : 'text-slate-400'}`}>
                            {product.ctr}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-mono">{product.conversions}</td>
                        <td className="py-4 px-4 text-right">
                          <span className={`font-mono ${parseFloat(product.conversionRate) > 10 ? 'text-success-400' : 'text-slate-400'}`}>
                            {product.conversionRate}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-mono text-accent-400">
                          {formatCurrency(product.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {data.topProducts.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No data yet. Views will appear once products are visited.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-12 text-slate-500">
          Failed to load analytics data
        </div>
      )}
    </div>
  );
}
