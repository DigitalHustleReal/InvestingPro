"use client";

import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  Bot,
  PenTool,
  Search,
  BookOpen,
  Sparkles,
  Share2,
  Database,
  BarChart3,
  ShieldCheck,
  Play,
  Settings,
  Activity,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type AgentStatus = "idle" | "working" | "error";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: AgentStatus;
  lastRun: string;
  successRate: number;
  tasksCompleted: number;
}

/* ------------------------------------------------------------------ */
/*  Initial agent data (hardcoded — backend integration later)         */
/* ------------------------------------------------------------------ */

const INITIAL_AGENTS: Agent[] = [
  {
    id: "content-writer",
    name: "Content Writer Agent",
    description:
      "Generates articles with finance-aware context and compliance checks.",
    icon: PenTool,
    status: "idle",
    lastRun: "2026-04-05T08:30:00Z",
    successRate: 94,
    tasksCompleted: 1247,
  },
  {
    id: "seo-optimizer",
    name: "SEO Optimizer Agent",
    description:
      "Optimizes content for search — keywords, meta, internal links.",
    icon: Search,
    status: "working",
    lastRun: "2026-04-05T09:15:00Z",
    successRate: 97,
    tasksCompleted: 982,
  },
  {
    id: "research",
    name: "Research Agent",
    description: "Discovers trending topics and market opportunities.",
    icon: BookOpen,
    status: "idle",
    lastRun: "2026-04-05T07:00:00Z",
    successRate: 91,
    tasksCompleted: 634,
  },
  {
    id: "editor",
    name: "Editor Agent",
    description: "Reviews, polishes grammar, and enforces style guidelines.",
    icon: Sparkles,
    status: "idle",
    lastRun: "2026-04-05T06:45:00Z",
    successRate: 98,
    tasksCompleted: 1105,
  },
  {
    id: "social-media",
    name: "Social Media Agent",
    description:
      "Creates social posts for Twitter/X and LinkedIn distribution.",
    icon: Share2,
    status: "error",
    lastRun: "2026-04-05T05:30:00Z",
    successRate: 86,
    tasksCompleted: 412,
  },
  {
    id: "data-scraper",
    name: "Data Scraper Agent",
    description: "Updates product data — rates, fees, eligibility criteria.",
    icon: Database,
    status: "working",
    lastRun: "2026-04-05T09:00:00Z",
    successRate: 92,
    tasksCompleted: 2089,
  },
  {
    id: "analytics",
    name: "Analytics Agent",
    description:
      "Generates performance reports and identifies growth opportunities.",
    icon: BarChart3,
    status: "idle",
    lastRun: "2026-04-04T23:00:00Z",
    successRate: 99,
    tasksCompleted: 356,
  },
  {
    id: "compliance",
    name: "Compliance Agent",
    description:
      "Checks financial disclaimers, SEBI/RBI compliance, and legal copy.",
    icon: ShieldCheck,
    status: "idle",
    lastRun: "2026-04-05T08:00:00Z",
    successRate: 100,
    tasksCompleted: 891,
  },
];

/* ------------------------------------------------------------------ */
/*  Status helpers                                                     */
/* ------------------------------------------------------------------ */

function statusBadge(status: AgentStatus) {
  switch (status) {
    case "working":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
          <span className="relative mr-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Working
        </Badge>
      );
    case "error":
      return (
        <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30">
          <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500 inline-block" />
          Error
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-muted-foreground">
          <span className="mr-1.5 h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 inline-block" />
          Idle
        </Badge>
      );
  }
}

function formatLastRun(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function AgentsDashboardPage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);

  const handleRunNow = useCallback((agent: Agent) => {
    // Set agent to working
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agent.id ? { ...a, status: "working" as AgentStatus } : a,
      ),
    );
    toast.success(`${agent.name} started`, {
      description: "Task queued — check back in a few moments.",
    });

    // Simulate completion after 3 seconds
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agent.id
            ? {
                ...a,
                status: "idle" as AgentStatus,
                lastRun: new Date().toISOString(),
                tasksCompleted: a.tasksCompleted + 1,
              }
            : a,
        ),
      );
      toast.success(`${agent.name} completed`, {
        description: "Task finished successfully.",
      });
    }, 3000);
  }, []);

  const handleConfigure = useCallback((agent: Agent) => {
    toast.info(`Configure ${agent.name}`, {
      description: "Agent configuration panel coming soon.",
    });
  }, []);

  /* Computed stats */
  const activeCount = agents.filter((a) => a.status === "working").length;
  const tasksToday = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);
  const avgSuccess =
    agents.length > 0
      ? Math.round(
          agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length,
        )
      : 0;

  return (
    <AdminLayout>
      <AdminPageContainer>
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Bot className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
              <p className="text-sm text-muted-foreground">
                Monitor and control autonomous AI agents powering your content
                operations.
              </p>
            </div>
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <Bot className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Agents</p>
                <p className="text-xl font-bold">{agents.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Now</p>
                <p className="text-xl font-bold">{activeCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
                <p className="text-xl font-bold">
                  {tasksToday.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Avg. Success Rate
                </p>
                <p className="text-xl font-bold">{avgSuccess}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <Card
                key={agent.id}
                className={cn(
                  "transition-shadow hover:shadow-md",
                  agent.status === "error" && "border-red-500/30",
                  agent.status === "working" && "border-emerald-500/30",
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          agent.status === "error"
                            ? "bg-red-500/10"
                            : "bg-emerald-500/10",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4.5 w-4.5",
                            agent.status === "error"
                              ? "text-red-600 dark:text-red-400"
                              : "text-emerald-600 dark:text-emerald-400",
                          )}
                        />
                      </div>
                      <CardTitle className="text-sm font-semibold leading-tight">
                        {agent.name}
                      </CardTitle>
                    </div>
                    {statusBadge(agent.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {agent.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Last Run</p>
                      <p className="text-xs font-medium mt-0.5">
                        <Clock className="inline h-3 w-3 mr-0.5 -mt-0.5" />
                        {formatLastRun(agent.lastRun)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Success</p>
                      <p
                        className={cn(
                          "text-xs font-medium mt-0.5",
                          agent.successRate >= 95
                            ? "text-emerald-600 dark:text-emerald-400"
                            : agent.successRate >= 90
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400",
                        )}
                      >
                        {agent.successRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tasks</p>
                      <p className="text-xs font-medium mt-0.5">
                        {agent.tasksCompleted.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={agent.status === "working"}
                      onClick={() => handleRunNow(agent)}
                    >
                      <Play className="h-3.5 w-3.5 mr-1.5" />
                      {agent.status === "working" ? "Running..." : "Run Now"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleConfigure(agent)}
                    >
                      <Settings className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </AdminPageContainer>
    </AdminLayout>
  );
}
