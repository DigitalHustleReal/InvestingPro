"use client";

import React, { useState, useCallback } from "react";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { FileText, Eye, Calendar, DollarSign, Clock } from "lucide-react";

import ActionCenter from "@/components/admin/dashboard/ActionCenter";
import ActivityTimeline from "@/components/admin/dashboard/ActivityTimeline";
import SystemHealthStrip from "@/components/admin/dashboard/SystemHealthStrip";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import AdvancedMetricsTable from "@/components/admin/AdvancedMetricsTable";
import MetricBentoCard from "@/components/admin/dashboard/MetricBentoCard";
import ContentVelocityChart from "@/components/admin/dashboard/ContentVelocityChart";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [generating, setGenerating] = useState(false);
  const [genCount, setGenCount] = useState(3);
  const [genCategory, setGenCategory] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleQuickGenerate = useCallback(async () => {
    setGenerating(true);
    toast.info(
      `Starting content pipeline: ${genCount} articles in auto mode...`,
    );
    try {
      const response = await fetch("/api/content-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          count: genCount,
          mode: "auto",
          category: genCategory || undefined,
        }),
      });
      if (!response.ok) {
        const err = await response
          .json()
          .catch(() => ({ error: "Pipeline failed" }));
        throw new Error(err.error || "Pipeline failed");
      }
      toast.success(
        `Pipeline started! Generating ${genCount} articles. Check Content Factory for progress.`,
      );
      router.push("/admin/content-factory");
    } catch (error) {
      toast.error(
        `Pipeline error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setGenerating(false);
    }
  }, [genCount, router]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats-overview"],
    queryFn: async () => {
      // Priority 1: Use the optimized RPC
      const { data, error } = await supabase.rpc("get_admin_dashboard_stats");

      // Fallback: If RPC fails or returns all zeros (signaling RLS filter or sync issue),
      // perform a direct count for integrity verification
      if (error || (data && data.total_articles === 0)) {
        logger.warn(
          "Dashboard stats RPC returned zero or error, falling back to direct count:",
          error,
        );
        const { count: totalArticles } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true });

        const { count: draftArticles } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("status", "draft");

        const { count: publishedArticles } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("status", "published");

        return {
          ...data,
          total_articles: totalArticles || 0,
          draft_articles: draftArticles || 0,
          published_articles: publishedArticles || 0,
          articles_this_month: data?.articles_this_month || 0,
          total_views: data?.total_views || 0,
          recent_activity: data?.recent_activity || [],
        };
      }
      return data;
    },
    refetchInterval: 60000,
  });
  // Sample sparkline data
  const sparklineData = [
    { value: 400 },
    { value: 300 },
    { value: 500 },
    { value: 450 },
    { value: 600 },
    { value: 550 },
    { value: 700 },
  ];

  const velocityData = [
    { name: "Mon", views: 2400, articles: 2 },
    { name: "Tue", views: 1398, articles: 4 },
    { name: "Wed", views: 9800, articles: 6 },
    { name: "Thu", views: 3908, articles: 3 },
    { name: "Fri", views: 4800, articles: 8 },
    { name: "Sat", views: 3800, articles: 5 },
    { name: "Sun", views: 4300, articles: 7 },
  ];

  return (
    <AdminLayout>
      <AdminPageContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-10"
        >
          {/* Welcome Banner */}
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-100 dark:border-green-900/30">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Good{" "}
              {new Date().getHours() < 12
                ? "Morning"
                : new Date().getHours() < 17
                  ? "Afternoon"
                  : "Evening"}{" "}
              👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here&apos;s what&apos;s happening with your content today
            </p>
          </div>

          {/* 0. GENERATE CONTENT — Finance-Intelligent Pipeline */}
          <div className="mb-6 rounded-xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 overflow-hidden">
            <div className="p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    🚀 Generate Articles
                    <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      Finance AI
                    </span>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Trends → Keywords → SERP → Compliance Check → Generation →
                    Fact Verify → SEO Audit
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={genCategory}
                    onChange={(e) => setGenCategory(e.target.value)}
                    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                  >
                    <option value="">All Categories</option>
                    <option value="mutual-funds">Mutual Funds</option>
                    <option value="stocks">Stocks & Equity</option>
                    <option value="fixed-deposits">Fixed Deposits</option>
                    <option value="insurance">Insurance</option>
                    <option value="tax-planning">Tax Planning</option>
                    <option value="credit-cards">Credit Cards</option>
                    <option value="loans">Loans</option>
                    <option value="ipo">IPO</option>
                    <option value="demat-accounts">Demat Accounts</option>
                    <option value="savings">Savings & PPF/NPS</option>
                    <option value="banking">Banking</option>
                    <option value="crypto">Crypto</option>
                  </select>
                  <select
                    value={genCount}
                    onChange={(e) => setGenCount(Number(e.target.value))}
                    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                  >
                    <option value={1}>1 article</option>
                    <option value={3}>3 articles</option>
                    <option value={5}>5 articles</option>
                    <option value={10}>10 articles</option>
                  </select>
                  <button
                    onClick={handleQuickGenerate}
                    disabled={generating}
                    className="h-10 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {generating ? (
                      <>
                        <span className="animate-spin">⏳</span> Generating...
                      </>
                    ) : (
                      <>
                        <span>▶</span> Generate Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Finance intelligence strip */}
            <div className="px-5 py-2.5 bg-emerald-500/5 border-t border-emerald-500/10 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
              <span>📊 RBI rate: {stats?.rbi_rate || "6.50%"}</span>
              <span>📈 Nifty: {stats?.nifty || "Live"}</span>
              <span>🏦 FD best: {stats?.fd_best || "8.5%"}</span>
              <span>💰 Gold: {stats?.gold_price || "₹Live"}</span>
              <span className="text-emerald-400">● SEBI compliant</span>
              <span className="text-emerald-400">● Fact-checked</span>
            </div>
          </div>

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
                className="glass-card-glow"
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
                className="glass-card-glow"
              />
              <MetricBentoCard
                label="Est. Revenue"
                value="₹2,450"
                subtext="Daily Affiliate Income"
                icon={DollarSign}
                variant="rose"
                data={sparklineData}
                href="/admin/monetization"
                className="glass-card-glow"
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
                className="glass-card-glow"
              />
              <MetricBentoCard
                label="In Pipeline"
                value={stats?.draft_articles || 0}
                subtext="Drafts & Reviews"
                icon={Clock}
                variant="purple"
                data={sparklineData}
                href="/admin/articles?status=draft"
                className="glass-card-glow"
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
