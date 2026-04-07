"use client";

/**
 * Swarm Dashboard — Founder's single pane of glass.
 *
 * Shows:
 * 1. Agent health grid (heartbeat status per agent)
 * 2. Pipeline funnel (content_queue → articles → published)
 * 3. Queue depths (pending/in_progress/failed per queue)
 * 4. Recent articles pending review
 * 5. Today's metrics
 */

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  RefreshCw,
  Send,
  TrendingUp,
  XCircle,
  Zap,
  Bot,
  Search,
  PenTool,
  BookOpen,
  Megaphone,
  Brain,
} from "lucide-react";

// Agent definitions for display
const AGENTS = [
  {
    name: "ContentScoutAgent",
    label: "Content Scout",
    icon: Search,
    phase: "SENSE",
    color: "text-blue-500",
    schedule: "2:00 AM IST",
  },
  {
    name: "SerpAnalystAgent",
    label: "SERP Analyst",
    icon: TrendingUp,
    phase: "ANALYZE",
    color: "text-purple-500",
    schedule: "3:00 AM/PM IST",
  },
  {
    name: "ContentArchitectAgent",
    label: "Content Architect",
    icon: Brain,
    phase: "ANALYZE",
    color: "text-indigo-500",
    schedule: "4:00 AM/PM IST",
  },
  {
    name: "WriterAgent",
    label: "Writer",
    icon: PenTool,
    phase: "CREATE",
    color: "text-green-500",
    schedule: "6:30 AM/PM IST",
  },
  {
    name: "EditorAgent",
    label: "Editor",
    icon: BookOpen,
    phase: "CREATE",
    color: "text-amber-500",
    schedule: "8:00 AM/PM IST",
  },
  {
    name: "PublisherAgent",
    label: "Publisher",
    icon: FileText,
    phase: "PUBLISH",
    color: "text-emerald-500",
    schedule: "10:00 AM / 4:00 PM IST",
  },
  {
    name: "DistributionAgent",
    label: "Distribution",
    icon: Megaphone,
    phase: "OPTIMIZE",
    color: "text-rose-500",
    schedule: "10:30 AM / 4:30 PM / 8:30 PM IST",
  },
];

interface AgentHeartbeat {
  agent_name: string;
  status: string;
  last_heartbeat: string;
  items_processed: number;
  items_failed: number;
  avg_duration_ms: number;
  last_error: string | null;
  last_run_result: any;
  cron_schedule: string;
}

interface QueueStats {
  table: string;
  pending: number;
  claimed: number;
  in_progress: number;
  completed: number;
  failed: number;
}

interface PipelineMetrics {
  topicsDiscovered: number;
  articlesInDraft: number;
  articlesInReview: number;
  articlesPublished: number;
  publishedToday: number;
  distributedToday: number;
}

export default function SwarmDashboardPage() {
  const [heartbeats, setHeartbeats] = useState<AgentHeartbeat[]>([]);
  const [queueStats, setQueueStats] = useState<QueueStats[]>([]);
  const [pipeline, setPipeline] = useState<PipelineMetrics | null>(null);
  const [pendingArticles, setPendingArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const supabase = createClient();

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Agent heartbeats
      const { data: hb } = await supabase
        .from("agent_heartbeats")
        .select("*")
        .order("agent_name");
      setHeartbeats(hb || []);

      // 2. Queue stats
      const queues = ["content_queue", "editor_queue", "distribution_queue"];
      const stats: QueueStats[] = [];

      for (const table of queues) {
        let pending = 0,
          claimed = 0,
          in_progress = 0,
          completed = 0,
          failed = 0;

        const statusKeys = [
          "pending",
          "claimed",
          "in_progress",
          "completed",
          "failed",
        ] as const;
        for (const s of statusKeys) {
          const { count } = await supabase
            .from(table)
            .select("id", { count: "exact", head: true })
            .eq("status", s);
          const val = count || 0;
          if (s === "pending") pending = val;
          else if (s === "claimed") claimed = val;
          else if (s === "in_progress") in_progress = val;
          else if (s === "completed") completed = val;
          else if (s === "failed") failed = val;
        }
        stats.push({ table, pending, claimed, in_progress, completed, failed });
      }
      setQueueStats(stats);

      // 3. Pipeline metrics
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [
        { count: topicsDiscovered },
        { count: articlesInDraft },
        { count: articlesInReview },
        { count: articlesPublished },
        { count: publishedToday },
      ] = await Promise.all([
        supabase
          .from("content_queue")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("articles")
          .select("id", { count: "exact", head: true })
          .eq("status", "draft"),
        supabase
          .from("articles")
          .select("id", { count: "exact", head: true })
          .eq("status", "review-ready"),
        supabase
          .from("articles")
          .select("id", { count: "exact", head: true })
          .eq("status", "published"),
        supabase
          .from("articles")
          .select("id", { count: "exact", head: true })
          .eq("status", "published")
          .gte("published_at", todayStart.toISOString()),
      ]);

      const { count: distributedToday } = await supabase
        .from("distribution_queue")
        .select("id", { count: "exact", head: true })
        .eq("status", "completed")
        .gte("completed_at", todayStart.toISOString());

      setPipeline({
        topicsDiscovered: topicsDiscovered || 0,
        articlesInDraft: articlesInDraft || 0,
        articlesInReview: articlesInReview || 0,
        articlesPublished: articlesPublished || 0,
        publishedToday: publishedToday || 0,
        distributedToday: distributedToday || 0,
      });

      // 4. Articles pending review
      const { data: pending } = await supabase
        .from("articles")
        .select("id, title, quality_score, status, created_at, category")
        .in("status", ["review-ready", "draft"])
        .order("created_at", { ascending: false })
        .limit(10);
      setPendingArticles(pending || []);

      setLastRefresh(new Date());
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const getAgentStatus = (agentName: string) => {
    const hb = heartbeats.find((h) => h.agent_name === agentName);
    if (!hb)
      return {
        status: "never_run",
        label: "Never Run",
        color: "text-gray-400",
      };

    const minutesAgo =
      (Date.now() - new Date(hb.last_heartbeat).getTime()) / 60000;

    if (hb.status === "degraded")
      return { status: "degraded", label: "Degraded", color: "text-amber-500" };
    if (minutesAgo > 1440)
      return { status: "stale", label: "Stale (>24h)", color: "text-red-500" };
    return { status: "healthy", label: "Healthy", color: "text-green-500" };
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatTimeAgo = (date: string) => {
    const mins = (Date.now() - new Date(date).getTime()) / 60000;
    if (mins < 1) return "just now";
    if (mins < 60) return `${Math.round(mins)}m ago`;
    if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
    return `${Math.round(mins / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-7 w-7 text-primary" />
            Agent Swarm Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Autonomous content pipeline — SENSE → ANALYZE → CREATE → PUBLISH →
            OPTIMIZE
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Last refresh: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Pipeline Funnel */}
      {pipeline && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              label: "Topics Discovered",
              value: pipeline.topicsDiscovered,
              icon: Search,
              color: "bg-blue-500/10 text-blue-600",
            },
            {
              label: "Drafts",
              value: pipeline.articlesInDraft,
              icon: PenTool,
              color: "bg-amber-500/10 text-amber-600",
            },
            {
              label: "In Review",
              value: pipeline.articlesInReview,
              icon: BookOpen,
              color: "bg-purple-500/10 text-purple-600",
            },
            {
              label: "Published",
              value: pipeline.articlesPublished,
              icon: CheckCircle2,
              color: "bg-green-500/10 text-green-600",
            },
            {
              label: "Published Today",
              value: pipeline.publishedToday,
              icon: Zap,
              color: "bg-emerald-500/10 text-emerald-600",
            },
            {
              label: "Distributed Today",
              value: pipeline.distributedToday,
              icon: Send,
              color: "bg-rose-500/10 text-rose-600",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-lg border bg-card p-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <div className={`rounded-md p-1.5 ${metric.color}`}>
                  <metric.icon className="h-4 w-4" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {metric.label}
                </span>
              </div>
              <span className="text-2xl font-bold tabular-nums">
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Agent Health Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Agent Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {AGENTS.map((agent) => {
            const status = getAgentStatus(agent.name);
            const hb = heartbeats.find((h) => h.agent_name === agent.name);
            const Icon = agent.icon;

            return (
              <div
                key={agent.name}
                className="rounded-lg border bg-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${agent.color}`} />
                    <div>
                      <span className="font-medium text-sm">{agent.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {agent.phase}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {status.status === "healthy" && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {status.status === "degraded" && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    {status.status === "stale" && (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    {status.status === "never_run" && (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={`text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {hb ? (
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block">
                        Processed
                      </span>
                      <span className="font-medium tabular-nums">
                        {hb.items_processed}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">
                        Failed
                      </span>
                      <span className="font-medium tabular-nums text-red-500">
                        {hb.items_failed}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">
                        Duration
                      </span>
                      <span className="font-medium tabular-nums">
                        {formatDuration(hb.avg_duration_ms || 0)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Scheduled: {agent.schedule}
                  </p>
                )}

                {hb?.last_heartbeat && (
                  <p className="text-xs text-muted-foreground">
                    Last run: {formatTimeAgo(hb.last_heartbeat)}
                  </p>
                )}

                {hb?.last_error && (
                  <p
                    className="text-xs text-red-500 truncate"
                    title={hb.last_error}
                  >
                    {hb.last_error}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Queue Depths */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Loader2 className="h-5 w-5" />
          Queue Depths
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {queueStats.map((q) => (
            <div key={q.table} className="rounded-lg border bg-card p-4">
              <h3 className="font-medium text-sm mb-3">
                {q.table
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Pending", value: q.pending, color: "bg-blue-500" },
                  {
                    label: "In Progress",
                    value: q.in_progress + q.claimed,
                    color: "bg-amber-500",
                  },
                  {
                    label: "Completed",
                    value: q.completed,
                    color: "bg-green-500",
                  },
                  { label: "Failed", value: q.failed, color: "bg-red-500" },
                ].map((row) => {
                  const total =
                    q.pending +
                    q.in_progress +
                    q.claimed +
                    q.completed +
                    q.failed;
                  const pct = total > 0 ? (row.value / total) * 100 : 0;
                  return (
                    <div key={row.label} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-20">
                        {row.label}
                      </span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${row.color} rounded-full transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium tabular-nums w-8 text-right">
                        {row.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Articles Pending Review */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Articles Pending Review
        </h2>
        {pendingArticles.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No articles pending review. The swarm is idle.
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Title</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-center p-3 font-medium">Quality</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {pendingArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="p-3">
                      <a
                        href={`/admin/articles/${article.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {article.title || "Untitled"}
                      </a>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {article.category || "—"}
                    </td>
                    <td className="p-3 text-center">
                      {article.quality_score != null ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            article.quality_score >= 85
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : article.quality_score >= 60
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {article.quality_score}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          article.status === "review-ready"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="p-3 text-right text-muted-foreground">
                      {formatTimeAgo(article.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pipeline Flow Diagram */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Pipeline Flow</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          {[
            { label: "Scout", phase: "SENSE", icon: Search },
            { label: "SERP Analyst", phase: "ANALYZE", icon: TrendingUp },
            { label: "Architect", phase: "ANALYZE", icon: Brain },
            { label: "Writer", phase: "CREATE", icon: PenTool },
            { label: "Editor", phase: "CREATE", icon: BookOpen },
            { label: "Publisher", phase: "PUBLISH", icon: FileText },
            { label: "Distribution", phase: "OPTIMIZE", icon: Megaphone },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-muted/50 min-w-[80px]">
                <step.icon className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">{step.label}</span>
                <span className="text-[10px] text-muted-foreground">
                  {step.phase}
                </span>
              </div>
              {i < 6 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
