"use client";

import React, { useState } from "react";
import {
  Play,
  RefreshCw,
  Zap,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  ExternalLink,
} from "lucide-react";
import { ActionButton, StatusBadge } from "./AdminUIKit";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePipeline } from "@/hooks/usePipeline";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

/**
 * AutomationControls - UI component for triggering automation actions
 *
 * Provides controls for:
 * - Scraper triggers
 * - Pipeline runs
 * - Content refresh
 * - Article regeneration
 */
interface AutomationControlsProps {
  className?: string;
}

export default function AutomationControls({
  className = "",
}: AutomationControlsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [triggering, setTriggering] = useState<string | null>(null);

  // Fetch pipeline runs status
  const { data: pipelineRuns = [] } = useQuery({
    queryKey: ["pipeline-runs"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/pipeline/runs?limit=10");
        if (!response.ok) return [];
        const data = await response.json();
        return data.runs || [];
      } catch (error) {
        console.error("Failed to fetch pipeline runs:", error);
        return [];
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Trigger scraper
  const handleTriggerScraper = async (scraperType: string) => {
    setTriggering(`scraper-${scraperType}`);
    try {
      const response = await fetch("/api/automation/scraper/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scraper_type: scraperType }),
      });

      if (!response.ok) {
        throw new Error("Failed to trigger scraper");
      }

      const data = await response.json();
      toast.success(`Scraper '${scraperType}' triggered successfully`);
      queryClient.invalidateQueries({ queryKey: ["pipeline-runs"] });
      queryClient.invalidateQueries({ queryKey: ["scraper-status"] });
    } catch (error: any) {
      toast.error(`Failed to trigger scraper: ${error.message}`);
    } finally {
      setTriggering(null);
    }
  };

  // Use standardized pipeline hook
  const { triggerPipeline, isTriggering } = usePipeline();

  // Trigger pipeline run
  const handleTriggerPipeline = async () => {
    toast.promise(triggerPipeline("scrape_and_generate"), {
      loading:
        "Initializing Content Factory: Scanning for high-authority trends...",
      success:
        "Pipeline active! AI is now drafting content from real-time signals.",
      error: "Factory initialization failed. Check system logs.",
    });
  };

  // Trigger content refresh
  const handleContentRefresh = async (
    contentType: string,
    contentId?: string,
  ) => {
    setTriggering(`refresh-${contentType}`);
    try {
      const response = await fetch("/api/automation/content-refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to trigger content refresh");
      }

      const data = await response.json();
      toast.success(
        `Content refresh for '${contentType}' triggered successfully`,
      );
      queryClient.invalidateQueries({ queryKey: ["pipeline-runs"] });
    } catch (error: any) {
      toast.error(`Failed to trigger content refresh: ${error.message}`);
    } finally {
      setTriggering(null);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string; icon: any }> = {
      completed: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-500",
        icon: CheckCircle2,
      },
      running: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-500",
        icon: Loader2,
      },
      failed: { bg: "bg-rose-500/10", text: "text-rose-500", icon: XCircle },
      triggered: { bg: "bg-amber-500/10", text: "text-amber-500", icon: Clock },
    };
    return variants[status] || variants.triggered;
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Scraper Triggers */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 px-8 py-6 bg-gray-50 dark:bg-gray-950/30">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-500" />
            </div>
            CONTENT EXTRACTION NODES
          </h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500/30 hover:shadow-sm transition-all group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Asset Crawler
                </span>
                <StatusBadge status="completed" label="Ready" />
              </div>
              <ActionButton
                onClick={() => handleTriggerScraper("products")}
                isLoading={triggering === "scraper-products"}
                variant="secondary"
                size="sm"
                icon={Play}
                className="w-full text-[10px]"
              >
                Execute
              </ActionButton>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500/30 hover:shadow-sm transition-all group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Sentiment Crawler
                </span>
                <StatusBadge status="completed" label="Ready" />
              </div>
              <ActionButton
                onClick={() => handleTriggerScraper("reviews")}
                isLoading={triggering === "scraper-reviews"}
                variant="secondary"
                size="sm"
                icon={Play}
                className="w-full text-[10px]"
              >
                Execute
              </ActionButton>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500/30 hover:shadow-sm transition-all group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Market Feed Crawler
                </span>
                <StatusBadge status="completed" label="Ready" />
              </div>
              <ActionButton
                onClick={() => handleTriggerScraper("rates")}
                isLoading={triggering === "scraper-rates"}
                variant="secondary"
                size="sm"
                icon={Play}
                className="w-full text-[10px]"
              >
                Execute
              </ActionButton>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Controls */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 px-8 py-6 bg-gray-50 dark:bg-gray-950/30">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            SYNTHESIS ENGINE
          </h3>
        </div>
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between p-7 bg-gray-900 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-800 dark:border-gray-700">
            <div className="mb-6 md:mb-0">
              <h4 className="font-bold text-white tracking-tight text-xl mb-1">
                Content Factory Pipeline
              </h4>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.1em]">
                Automated deep-research and trend analysis sequence
              </p>
            </div>
            <ActionButton
              size="lg"
              className="h-14 px-10"
              onClick={handleTriggerPipeline}
              isLoading={isTriggering === "scrape_and_generate"}
              icon={Play}
            >
              Initialize Reactor
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Manual Content Factory */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 px-8 py-6 bg-gray-50 dark:bg-gray-950/30">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-500" />
            </div>
            PROACTIVE GENERATION
          </h3>
        </div>
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl group hover:border-emerald-500/30 transition-all">
            <div className="mb-4 md:mb-0">
              <h4 className="font-bold text-gray-900 dark:text-white tracking-tight text-lg mb-1">
                Writer Workspace
              </h4>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                Manually trigger AI content generation for specific topics
              </p>
            </div>
            <ActionButton
              size="lg"
              className="h-12 px-8"
              onClick={() => router.push("/admin/content-factory")}
              icon={ExternalLink}
            >
              Launch Workspace
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Recent Pipeline Runs */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 px-8 py-6 bg-gray-50 dark:bg-gray-950/30">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-500" />
            </div>
            EXECUTION HISTORY
          </h3>
        </div>
        {!pipelineRuns || pipelineRuns.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            No system operations logged
          </div>
        ) : (
          <div className="">
            {Array.isArray(pipelineRuns) &&
              pipelineRuns.map((run: any) => {
                const statusBadge = getStatusBadge(run.status);
                const StatusIcon = statusBadge.icon;
                return (
                  <div
                    key={run.id}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors p-8"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <span className="font-extrabold text-gray-900 dark:text-white tracking-widest uppercase text-xs">
                            {run.pipeline_type.replace(/_/g, " ")}
                          </span>
                          <div
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-gray-200 dark:border-gray-800 shadow-sm",
                              run.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : run.status === "failed"
                                  ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                            )}
                          >
                            <StatusIcon
                              className={cn(
                                "w-3 h-3",
                                run.status === "running" ? "animate-spin" : "",
                              )}
                            />
                            {run.status}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium tracking-tight">
                          {run.params?.topic ||
                            run.result?.processed_trend ||
                            "Internal System Task"}
                        </div>
                        <div className="flex items-center gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            {run.triggered_at
                              ? new Date(run.triggered_at).toLocaleTimeString()
                              : "N/A"}
                          </span>
                          {run.completed_at && (
                            <span className="text-emerald-500">
                              Operation Success
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {run.error_message && (
                          <div className="max-w-[200px] text-right">
                            <p className="text-[10px] text-rose-500 font-bold tracking-tight uppercase leading-relaxed">
                              System Fault: {run.error_message}
                            </p>
                          </div>
                        )}

                        {run.result?.article_id && (
                          <ActionButton
                            size="sm"
                            variant="secondary"
                            className="h-10 px-6 text-[10px]"
                            onClick={() =>
                              window.open(
                                `/admin/articles/edit/${run.result.article_id}`,
                                "_blank",
                              )
                            }
                            icon={ExternalLink}
                          >
                            Review Output
                          </ActionButton>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Content Refresh Controls */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 px-8 py-6 bg-gray-50 dark:bg-gray-950/30">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-emerald-500" />
            </div>
            CACHE MAINTENANCE
          </h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl group hover:border-emerald-500/30 transition-all">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  Articles Buffer
                </h4>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Refresh all article indices
                </p>
              </div>
              <ActionButton
                size="sm"
                variant="secondary"
                className="h-10 px-6 text-[10px]"
                onClick={() => handleContentRefresh("article")}
                isLoading={triggering === "refresh-article"}
                icon={RefreshCw}
              >
                Refresh
              </ActionButton>
            </div>
            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl group hover:border-emerald-500/30 transition-all">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  Pillar Page Index
                </h4>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Synchronize cornerstone content
                </p>
              </div>
              <ActionButton
                size="sm"
                variant="secondary"
                className="h-10 px-6 text-[10px]"
                onClick={() => handleContentRefresh("pillar")}
                isLoading={triggering === "refresh-pillar"}
                icon={RefreshCw}
              >
                Sync
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
