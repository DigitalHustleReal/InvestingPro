"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  Activity,
  TrendingUp,
  FileText,
  Search,
  Image as ImageIcon,
  BarChart3,
  DollarSign,
  Target,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Eye,
  Brain,
  Sparkles,
  RefreshCw,
  Link as LinkIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface PipelineActivity {
  id: string;
  type: string;
  status: "running" | "completed" | "failed";
  topic: string;
  timestamp: string;
  metrics: {
    trendingKeywords?: string[];
    characterCount?: number;
    imageCount?: number;
    seoScore?: number;
    readabilityScore?: number;
    qualityScore?: number;
    affiliateLinks?: number;
    estimatedIncome?: number;
    serpPosition?: number;
  };
  progress?: number;
}

export default function PipelineMonitorPage() {
  const [activeTab, setActiveTab] = useState<"live" | "metrics" | "research">(
    "live",
  );

  // Fetch live pipeline activity
  const { data: activities = [], refetch } = useQuery({
    queryKey: ["pipeline-activity"],
    queryFn: async () => {
      const response = await fetch("/api/pipeline/runs?limit=20");
      if (!response.ok) return [];
      const data = await response.json();
      return data.runs || [];
    },
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Fetch aggregated metrics
  const { data: metrics } = useQuery({
    queryKey: ["pipeline-metrics"],
    queryFn: async () => {
      const response = await fetch("/api/pipeline/metrics");
      if (!response.ok) return null;
      return await response.json();
    },
    refetchInterval: 10000,
  });

  const activitiesList = Array.isArray(activities) ? activities : [];
  const runningActivities = activitiesList.filter(
    (a: any) => a.status === "running",
  );
  const completedToday = activitiesList.filter(
    (a: any) =>
      a.status === "completed" &&
      a.started_at &&
      new Date(a.started_at).toDateString() === new Date().toDateString(),
  ).length;

  return (
    <AdminLayout>
      <div className="p-8 space-y-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div
          className="relative overflow-hidden shadow-2xl"
          style={{
            borderRadius: "24px",
            padding: "32px",
            background: "linear-gradient(135deg, #0a192f 0%, #0d213f 100%)",
            border: "1px solid rgba(196, 158, 72, 0.2)",
          }}
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full blur-3xl opacity-10 bg-[#c49e48]" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-[#c49e48]/10 border border-[#c49e48]/20">
                <Activity className="w-10 h-10 text-[#c49e48]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                  Pipeline Intelligence
                </h1>
                <p className="text-gray-300 max-w-md">
                  Real-time visibility and heuristic analysis of the AI content
                  generation engine.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-[#c49e48]/10 text-[#c49e48] border border-[#c49e48]/20 px-4 py-1.5 rounded-full flex gap-2 items-center">
                <div className="w-2 h-2 rounded-full bg-[#c49e48] animate-pulse" />
                {runningActivities.length} Active Nodes
              </Badge>
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="bg-white/5 border-[#c49e48]/20 text-[#c49e48] hover:bg-[#c49e48]/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Telemetry
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label="Active Tasks"
            value={runningActivities.length}
            icon={Zap}
            color="primary"
            trend="+2 from last hour"
          />
          <StatCard
            label="Completed Today"
            value={completedToday}
            icon={CheckCircle2}
            color="success"
            trend="12 articles generated"
          />
          <StatCard
            label="Avg SEO Score"
            value={metrics?.avgSeoScore || "N/A"}
            suffix={metrics?.avgSeoScore ? "/100" : ""}
            icon={Target}
            color="secondary"
            trend={metrics?.avgSeoScore ? "+5% this week" : "No data yet"}
          />
          <StatCard
            label="Est. Revenue"
            value={
              metrics?.estimatedRevenue ? `₹${metrics.estimatedRevenue}` : "N/A"
            }
            icon={DollarSign}
            color="accent"
            trend={
              metrics?.estimatedRevenue
                ? "From affiliates today"
                : "No data yet"
            }
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border dark:border-border">
          {[
            { key: "live", label: "Live Activity", icon: Activity },
            { key: "metrics", label: "Quality Metrics", icon: BarChart3 },
            { key: "research", label: "Research Data", icon: Search },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
                activeTab === tab.key
                  ? "text-primary-400 border-b-2 border-primary-500"
                  : "text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "live" && (
          <LiveActivityTab activities={activitiesList} />
        )}
        {activeTab === "metrics" && <MetricsTab activities={activitiesList} />}
        {activeTab === "research" && (
          <ResearchTab activities={activitiesList} />
        )}
      </div>
    </AdminLayout>
  );
}

const statCardColors = {
  primary: "from-primary-500/20 to-primary-600/10 border-primary-500/30",
  success: "from-success-500/20 to-success-600/10 border-success-500/30",
  secondary:
    "from-secondary-500/20 to-secondary-600/10 border-secondary-500/30",
  accent: "from-accent-500/20 to-accent-600/10 border-accent-500/30",
} as const;

type StatCardColor = keyof typeof statCardColors;

function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  color = "primary",
  trend,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: StatCardColor;
  trend?: string;
}) {
  return (
    <Card
      className={`bg-gradient-to-br ${statCardColors[color]} border rounded-2xl`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon className={`w-5 h-5 text-${color}-400`} />
          <Badge variant="outline" className="text-xs">
            {label}
          </Badge>
        </div>
        <div className="text-3xl font-bold text-foreground dark:text-foreground mb-1">
          {value}
          {suffix && (
            <span className="text-lg text-muted-foreground dark:text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground dark:text-muted-foreground">
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}

function LiveActivityTab({ activities }: { activities: any[] }) {
  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <Card className="bg-white/5 border-border dark:border-border rounded-2xl p-20 text-center">
          <Activity className="w-12 h-12 text-muted-foreground/50 dark:text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground dark:text-muted-foreground">
            No pipeline activity yet. Trigger content generation to see live
            updates.
          </p>
        </Card>
      ) : (
        activities.map((activity: any) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))
      )}
    </div>
  );
}

function ActivityCard({ activity }: { activity: any }) {
  const isRunning = activity.status === "running";
  const isFailed = activity.status === "failed";
  const topic =
    activity.params?.topic ||
    activity.result?.processed_trend ||
    "Unknown Topic";

  return (
    <Card className="bg-white/5 border-border dark:border-border rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge
                className={`
                                ${isRunning ? "bg-primary-500/20 text-primary-400 border-primary-500/30" : ""}
                                ${isFailed ? "bg-danger-500/20 text-danger-400 border-danger-500/30" : ""}
                                ${!isRunning && !isFailed ? "bg-success-500/20 text-success-400 border-success-500/30" : ""}
                            `}
              >
                {isRunning && (
                  <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                )}
                {activity.status}
              </Badge>
              <span className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider">
                {activity.pipeline_type?.replace(/_/g, " ")}
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground dark:text-foreground mb-1">
              {topic}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">
              Started {new Date(activity.started_at).toLocaleString()}
            </p>
          </div>
          {activity.result?.article_id && (
            <Button
              size="sm"
              variant="outline"
              className="border-primary-500/30 text-primary-400"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Article
            </Button>
          )}
        </div>

        {/* Metrics Grid */}
        {activity.result && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <MetricTile
              icon={FileText}
              label="Characters"
              value={
                activity.result.word_count
                  ? `${activity.result.word_count * 5}`
                  : "N/A"
              }
            />
            <MetricTile
              icon={ImageIcon}
              label="Images"
              value={activity.result.image_count || "0"}
            />
            <MetricTile
              icon={Target}
              label="SEO Score"
              value={activity.result.seo_score || "N/A"}
              color="primary"
            />
            <MetricTile
              icon={Brain}
              label="Quality"
              value={activity.result.quality_score || "N/A"}
              color="secondary"
            />
          </div>
        )}

        {/* Trending Keywords */}
        {activity.result?.keywords && (
          <div className="flex items-center gap-2 flex-wrap">
            <TrendingUp className="w-4 h-4 text-accent-400" />
            <span className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider">
              Keywords:
            </span>
            {activity.result.keywords
              .slice(0, 5)
              .map((kw: string, i: number) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-xs border-accent-500/30 text-accent-400"
                >
                  {kw}
                </Badge>
              ))}
          </div>
        )}

        {/* Progress Bar for Running Tasks */}
        {isRunning && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground dark:text-muted-foreground mb-2">
              <span>Generating content...</span>
              <span>~80% complete</span>
            </div>
            <div className="w-full bg-muted dark:bg-muted rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full w-4/5 animate-pulse" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MetricTile({ icon: Icon, label, value, color = "slate" }: any) {
  return (
    <div className="bg-white/5 rounded-xl p-3 border border-border/50 dark:border-border/50">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 text-${color}-400`} />
        <span className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div
        className={`text-lg font-bold text-${color === "slate" ? "white" : `${color}-400`}`}
      >
        {value}
      </div>
    </div>
  );
}

function MetricsTab({ activities }: { activities: any[] }) {
  const completedActivities = activities.filter(
    (a: any) => a.status === "completed" && a.result,
  );

  const avgSeoScore =
    completedActivities.length > 0
      ? Math.round(
          completedActivities.reduce(
            (sum: number, a: any) => sum + (a.result?.seo_score || 0),
            0,
          ) / completedActivities.length,
        )
      : null;

  const avgQualityScore =
    completedActivities.length > 0
      ? Math.round(
          completedActivities.reduce(
            (sum: number, a: any) => sum + (a.result?.quality_score || 0),
            0,
          ) / completedActivities.length,
        )
      : null;

  // Compute real score bars from data
  const avgReadability =
    completedActivities.length > 0
      ? Math.round(
          completedActivities.reduce(
            (sum: number, a: any) => sum + (a.result?.readability_score || 0),
            0,
          ) / completedActivities.length,
        )
      : null;

  const hasData = completedActivities.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white/5 border-border dark:border-border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-foreground dark:text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-400" />
            SEO Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-primary-400 mb-2">
              {avgSeoScore !== null ? (
                avgSeoScore
              ) : (
                <span className="text-muted-foreground text-4xl">—</span>
              )}
            </div>
            <p className="text-muted-foreground dark:text-muted-foreground">
              {hasData ? "Average SEO Score" : "No completed runs yet"}
            </p>
          </div>
          {hasData && (
            <div className="space-y-3">
              <ScoreBar
                label="Avg SEO Score"
                score={avgSeoScore ?? 0}
                color="primary"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-border dark:border-border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-foreground dark:text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-secondary-400" />
            Content Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-secondary-400 mb-2">
              {avgQualityScore !== null ? (
                avgQualityScore
              ) : (
                <span className="text-muted-foreground text-4xl">—</span>
              )}
            </div>
            <p className="text-muted-foreground dark:text-muted-foreground">
              {hasData ? "Average Quality Score" : "No completed runs yet"}
            </p>
          </div>
          {hasData && avgReadability !== null && (
            <div className="space-y-3">
              <ScoreBar
                label="Avg Quality Score"
                score={avgQualityScore ?? 0}
                color="secondary"
              />
              <ScoreBar
                label="Avg Readability"
                score={avgReadability}
                color="secondary"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ScoreBar({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm text-muted-foreground dark:text-muted-foreground mb-1">
        <span>{label}</span>
        <span className={`font-bold text-${color}-400`}>{score}%</span>
      </div>
      <div className="w-full bg-muted dark:bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={`bg-gradient-to-r from-${color}-500 to-${color}-600 h-full`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function ResearchTab({ activities }: { activities: any[] }) {
  const recentResearch = activities.filter(
    (a: any) => a.result?.keywords || a.result?.serp_data,
  );

  // Compute affiliate link counts from completed activities
  const completedActivities = activities.filter(
    (a: any) => a.status === "completed" && a.result,
  );
  const totalAffiliateLinks = completedActivities.reduce(
    (sum: number, a: any) => sum + (a.result?.affiliate_link_count || 0),
    0,
  );
  const hasAffiliateData = totalAffiliateLinks > 0;

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-border dark:border-border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-foreground dark:text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-400" />
            Trending Keywords Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentResearch.length === 0 ? (
            <p className="text-muted-foreground dark:text-muted-foreground text-center py-8">
              No research data available yet.
            </p>
          ) : (
            <div className="space-y-4">
              {recentResearch.slice(0, 5).map((activity: any, i: number) => (
                <div
                  key={i}
                  className="border-b border-border/50 dark:border-border/50 last:border-0 pb-4 last:pb-0"
                >
                  <h4 className="font-bold text-foreground dark:text-foreground mb-2">
                    {activity.params?.topic || "Unknown"}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {activity.result?.keywords?.map((kw: string, j: number) => (
                      <Badge
                        key={j}
                        className="bg-accent-500/20 text-accent-400 border-accent-500/30"
                      >
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-border dark:border-border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-foreground dark:text-foreground flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-success-400" />
            Affiliate Link Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasAffiliateData ? (
            <div className="grid grid-cols-1 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-success-400 mb-1">
                  {totalAffiliateLinks}
                </div>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                  Affiliate Links in Generated Articles
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground dark:text-muted-foreground text-center py-8">
              No affiliate data available yet. Run content generation to see
              stats.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
