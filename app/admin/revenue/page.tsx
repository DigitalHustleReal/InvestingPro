"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  TrendingUp as TrendingUpIcon,
  PieChart,
  BarChart3,
  FileText,
  Building2,
  RefreshCw,
  Award,
  ExternalLink,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface RevenueDashboardData {
  totalRevenue: {
    current: number;
    previous: number;
    growth: number;
  };
  revenueByCategory: {
    creditCards: number;
    mutualFunds: number;
    insurance: number;
    others: number;
  };
  conversionRates: {
    overall: number;
    creditCards: number;
    mutualFunds: number;
  };
  trends: {
    daily: Array<{ date: string; revenue: number }>;
    weekly: Array<{ week: string; revenue: number }>;
    monthly: Array<{ month: string; revenue: number }>;
  };
}

interface CategoryData {
  category: string;
  revenue: number;
  conversions: number;
  conversionRate: number;
  topArticles: Array<{
    articleId: string;
    articleTitle: string;
    revenue: number;
    conversions: number;
  }>;
  topAffiliates: Array<{
    affiliateId: string;
    affiliateName: string;
    revenue: number;
    conversions: number;
  }>;
}

export default function RevenueDashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("30d");

  // Fetch overall dashboard data
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    refetch: refetchDashboard,
  } = useQuery<RevenueDashboardData>({
    queryKey: ["revenue-dashboard", timeRange],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/admin/revenue/dashboard?startDate=${getStartDate(timeRange)}&endDate=${new Date().toISOString()}`,
      );
      if (!response.ok) throw new Error("Failed to fetch revenue data");
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch category-specific data
  const { data: categoryData, isLoading: categoryLoading } =
    useQuery<CategoryData>({
      queryKey: ["revenue-by-category", selectedCategory, timeRange],
      queryFn: async () => {
        if (!selectedCategory) return null;
        const response = await fetch(
          `/api/v1/admin/revenue/by-category?category=${selectedCategory}&startDate=${getStartDate(timeRange)}&endDate=${new Date().toISOString()}`,
        );
        if (!response.ok) throw new Error("Failed to fetch category data");
        return response.json();
      },
      enabled: !!selectedCategory,
    });

  // Fetch top converting articles
  const { data: topArticlesData, isLoading: topArticlesLoading } = useQuery({
    queryKey: ["top-converting-articles", timeRange],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/admin/revenue/top-articles?limit=10&startDate=${getStartDate(timeRange)}&endDate=${new Date().toISOString()}`,
      );
      if (!response.ok) throw new Error("Failed to fetch top articles");
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const getStartDate = (range: string): string => {
    const now = new Date();
    switch (range) {
      case "7d":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case "30d":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case "90d":
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const totalRevenue = dashboardData?.totalRevenue.current || 0;
  const previousRevenue = dashboardData?.totalRevenue.previous || 0;
  const growth = dashboardData?.totalRevenue.growth || 0;
  const isPositiveGrowth = growth >= 0;

  const totalByCategory = dashboardData?.revenueByCategory || {
    creditCards: 0,
    mutualFunds: 0,
    insurance: 0,
    others: 0,
  };

  const totalCategoryRevenue =
    totalByCategory.creditCards +
    totalByCategory.mutualFunds +
    totalByCategory.insurance +
    totalByCategory.others;

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Revenue Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Real-time revenue tracking by category, article, and affiliate
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button
              onClick={() => refetchDashboard()}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {dashboardLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
            <p className="mt-4 text-gray-500">Loading revenue data...</p>
          </div>
        ) : (
          <>
            {/* Primary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Revenue */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalRevenue)}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {isPositiveGrowth ? (
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <span
                      className={
                        isPositiveGrowth ? "text-green-600" : "text-red-600"
                      }
                    >
                      {Math.abs(growth).toFixed(1)}% from previous month
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-2">
                    Previous: {formatCurrency(previousRevenue)}
                  </p>
                </CardContent>
              </Card>

              {/* Overall Conversion Rate */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Overall Conversion Rate
                  </CardTitle>
                  <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData?.conversionRates.overall.toFixed(2) ||
                      "0.00"}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-2">
                    Industry average: 1-2%
                  </p>
                </CardContent>
              </Card>

              {/* Total Conversions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Conversions
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {categoryData?.conversions ||
                      dashboardData?.trends.daily.reduce(
                        (sum, day) => sum + (day.revenue > 0 ? 1 : 0),
                        0,
                      ) ||
                      0}
                  </div>
                  <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-2">
                    {timeRange === "30d" ? "Last 30 days" : `Last ${timeRange}`}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue by Category - PRIMARY METRIC */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Revenue by Category (PRIMARY METRIC)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <button
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === "credit-cards"
                          ? null
                          : "credit-cards",
                      )
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCategory === "credit-cards"
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-gray-200 dark:border-gray-800 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-primary-600" />
                      <span className="font-semibold">Credit Cards</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(totalByCategory.creditCards)}
                    </div>
                    <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                      {totalCategoryRevenue > 0
                        ? (
                            (totalByCategory.creditCards /
                              totalCategoryRevenue) *
                            100
                          ).toFixed(1)
                        : 0}
                      % of total
                    </div>
                    <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                      Conversion:{" "}
                      {dashboardData?.conversionRates.creditCards.toFixed(2) ||
                        "0.00"}
                      %
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === "mutual-funds"
                          ? null
                          : "mutual-funds",
                      )
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCategory === "mutual-funds"
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-gray-200 dark:border-gray-800 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUpIcon className="w-5 h-5 text-green-600" />
                      <span className="font-semibold">Mutual Funds</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(totalByCategory.mutualFunds)}
                    </div>
                    <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                      {totalCategoryRevenue > 0
                        ? (
                            (totalByCategory.mutualFunds /
                              totalCategoryRevenue) *
                            100
                          ).toFixed(1)
                        : 0}
                      % of total
                    </div>
                    <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                      Conversion:{" "}
                      {dashboardData?.conversionRates.mutualFunds.toFixed(2) ||
                        "0.00"}
                      %
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === "insurance" ? null : "insurance",
                      )
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCategory === "insurance"
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-gray-200 dark:border-gray-800 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-secondary-600" />
                      <span className="font-semibold">Insurance</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(totalByCategory.insurance)}
                    </div>
                    <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                      {totalCategoryRevenue > 0
                        ? (
                            (totalByCategory.insurance / totalCategoryRevenue) *
                            100
                          ).toFixed(1)
                        : 0}
                      % of total
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === "all" ? null : "all",
                      )
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCategory === "all"
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-gray-200 dark:border-gray-800 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-muted-foreground/50 dark:text-muted-foreground/50" />
                      <span className="font-semibold">Others</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(totalByCategory.others)}
                    </div>
                    <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                      {totalCategoryRevenue > 0
                        ? (
                            (totalByCategory.others / totalCategoryRevenue) *
                            100
                          ).toFixed(1)
                        : 0}
                      % of total
                    </div>
                  </button>
                </div>

                {/* Category Details */}
                {selectedCategory && categoryData && (
                  <div className="mt-6 space-y-6 border-t pt-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Top Converting Articles - {categoryData.category}
                      </h3>
                      <div className="space-y-2">
                        {categoryData.topArticles.length > 0 ? (
                          categoryData.topArticles.map((article, idx) => (
                            <div
                              key={article.articleId}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-surface-darker dark:bg-surface-darker rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground/70 dark:text-muted-foreground/70">
                                  #{idx + 1}
                                </span>
                                <FileText className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                                <span className="font-medium">
                                  {article.articleTitle}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="font-semibold">
                                    {formatCurrency(article.revenue)}
                                  </div>
                                  <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70">
                                    {article.conversions} conversions
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground/70 dark:text-muted-foreground/70 text-sm">
                            No articles found for this category
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Top Affiliate Partners - {categoryData.category}
                      </h3>
                      <div className="space-y-2">
                        {categoryData.topAffiliates.length > 0 ? (
                          categoryData.topAffiliates.map((affiliate, idx) => (
                            <div
                              key={affiliate.affiliateId}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-surface-darker dark:bg-surface-darker rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground/70 dark:text-muted-foreground/70">
                                  #{idx + 1}
                                </span>
                                <Building2 className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                                <span className="font-medium">
                                  {affiliate.affiliateName}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="font-semibold">
                                    {formatCurrency(affiliate.revenue)}
                                  </div>
                                  <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70">
                                    {affiliate.conversions} conversions
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground/70 dark:text-muted-foreground/70 text-sm">
                            No affiliates found for this category
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Converting Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-600" />
                  Top Converting Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topArticlesLoading ? (
                  <div className="text-center py-8 text-muted-foreground/70 dark:text-muted-foreground/70">
                    Loading top articles...
                  </div>
                ) : topArticlesData?.articles &&
                  topArticlesData.articles.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <div>
                        <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                          Total Revenue from Articles
                        </p>
                        <p className="text-2xl font-bold text-primary-900 dark:text-primary-100">
                          {formatCurrency(topArticlesData.totalRevenue)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70">
                          Total Conversions
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-foreground dark:text-foreground">
                          {topArticlesData.totalConversions}
                        </p>
                      </div>
                    </div>

                    {topArticlesData.articles.map(
                      (article: any, idx: number) => (
                        <div
                          key={article.articleId}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-surface-darker dark:bg-surface-darker rounded-xl hover:bg-gray-100 dark:hover:bg-muted dark:bg-muted transition-colors border border-gray-200 dark:border-gray-800"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                                {idx + 1}
                              </span>
                            </div>
                            <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <a
                                href={`/article/${article.articleSlug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-1 flex items-center gap-1"
                              >
                                {article.articleTitle}
                                <ExternalLink className="w-3 h-3 opacity-60" />
                              </a>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {article.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70">
                                  {article.views.toLocaleString()} views
                                </span>
                                {article.conversionRate > 0 && (
                                  <span className="text-xs text-success-600 dark:text-success-400 font-medium">
                                    {article.conversionRate.toFixed(2)}% CR
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(article.revenue)}
                            </div>
                            <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                              {article.conversions}{" "}
                              {article.conversions === 1
                                ? "conversion"
                                : "conversions"}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground/70 dark:text-muted-foreground/70">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No article conversions found for this period</p>
                    <p className="text-xs mt-2">
                      Articles with affiliate clicks that converted will appear
                      here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Revenue Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Daily Revenue (Last 30 Days)
                    </h4>
                    <div className="h-32 flex items-end gap-1">
                      {dashboardData?.trends.daily.map((day, idx) => {
                        const maxRevenue = Math.max(
                          ...(dashboardData?.trends.daily.map(
                            (d) => d.revenue,
                          ) || [1]),
                        );
                        const height =
                          maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                        return (
                          <div
                            key={idx}
                            className="flex-1 bg-emerald-500 rounded-t hover:bg-emerald-600 transition-colors"
                            style={{ height: `${height}%` }}
                            title={`${day.date}: ${formatCurrency(day.revenue)}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
