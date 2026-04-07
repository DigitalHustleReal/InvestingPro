/**
 * Swarm Supervisor Agent (Meta-Agent)
 *
 * META phase — monitors all other agents, detects failures, adjusts pipeline.
 * Pure monitoring agent — no AI calls needed.
 *
 * Checks:
 * - Agents that haven't run in 24+ hours → marks as "stale"
 * - Agents with error_count > 5 in last run → marks as "degraded"
 * - Pipeline bottlenecks: content_queue has 20+ pending but editor_queue has 0
 * - Queue overflow: any queue with 50+ failed items
 * - Daily publish target: checks if publish rate is on track (5-10/day)
 *
 * Calculates overall swarm health score (0-100):
 * - Each healthy agent = +14 points (7 agents)
 * - Deduct for stale/degraded agents
 * - Deduct for bottlenecks
 * - Deduct for queue failures
 *
 * Runs: every 6 hours (0:00, 6:00, 12:00, 18:00)
 */

import { BaseSwarmAgent } from "./base-swarm-agent";
import { AgentContext, AgentResult } from "../base-agent";
import { logger } from "@/lib/logger";

interface AgentHealthStatus {
  agent_name: string;
  status: "healthy" | "stale" | "degraded" | "missing";
  last_heartbeat: string | null;
  hours_since_heartbeat: number;
  error_count: number;
  items_processed: number;
  items_failed: number;
}

interface SwarmAlert {
  alert_type: string;
  severity: "info" | "warning" | "critical";
  message: string;
  agent_name?: string;
  metadata?: Record<string, any>;
}

// Known agents in the swarm
const EXPECTED_AGENTS = [
  "ContentScoutAgent",
  "ResearchAgent",
  "WriterAgent",
  "EditorAgent",
  "SEOAgent",
  "PublisherAgent",
  "AnalyticsAgent",
];

// Queue tables to monitor
const QUEUE_TABLES = [
  "content_queue",
  "research_queue",
  "editor_queue",
  "seo_queue",
  "publish_queue",
];

export class SupervisorAgent extends BaseSwarmAgent {
  constructor() {
    super({
      name: "SupervisorAgent",
      batchSize: 1, // Scans everything in one pass
      claimTimeoutMs: 10 * 60 * 1000,
      cronSchedule: "0 0,6,12,18 * * *",
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    const alerts: SwarmAlert[] = [];
    const agentStatuses: AgentHealthStatus[] = [];
    let itemsProcessed = 0;
    let itemsFailed = 0;

    try {
      const now = new Date();
      const twentyFourHoursAgo = new Date(
        now.getTime() - 24 * 60 * 60 * 1000,
      ).toISOString();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ).toISOString();

      // 1. Read agent_heartbeats for ALL agents
      const { data: heartbeats, error: heartbeatError } = await this.supabase
        .from("agent_heartbeats")
        .select("*");

      if (heartbeatError) {
        logger.error(
          `${this.config.name}: Failed to fetch heartbeats`,
          new Error(heartbeatError.message),
        );
        return {
          success: false,
          error: heartbeatError.message,
          metadata: { itemsProcessed: 0, itemsFailed: 1 },
          executionTime: Date.now() - startTime,
        };
      }

      const heartbeatMap = new Map<string, any>();
      (heartbeats || []).forEach((hb: any) =>
        heartbeatMap.set(hb.agent_name, hb),
      );

      // 2. Check each expected agent
      for (const agentName of EXPECTED_AGENTS) {
        const hb = heartbeatMap.get(agentName);

        if (!hb) {
          // Agent has never reported
          agentStatuses.push({
            agent_name: agentName,
            status: "missing",
            last_heartbeat: null,
            hours_since_heartbeat: Infinity,
            error_count: 0,
            items_processed: 0,
            items_failed: 0,
          });
          alerts.push({
            alert_type: "agent_missing",
            severity: "warning",
            message: `Agent "${agentName}" has never reported a heartbeat. It may not be deployed or configured.`,
            agent_name: agentName,
          });
          continue;
        }

        const lastHeartbeat = new Date(hb.last_heartbeat);
        const hoursSince =
          (now.getTime() - lastHeartbeat.getTime()) / (1000 * 60 * 60);
        const errorCount = hb.error_count || 0;

        let status: AgentHealthStatus["status"] = "healthy";

        // Check for stale agents (haven't run in 24+ hours)
        if (hoursSince > 24) {
          status = "stale";
          alerts.push({
            alert_type: "agent_stale",
            severity: "warning",
            message: `Agent "${agentName}" hasn't run in ${Math.round(hoursSince)} hours. Last heartbeat: ${hb.last_heartbeat}`,
            agent_name: agentName,
            metadata: { hours_since: Math.round(hoursSince) },
          });
        }

        // Check for degraded agents (error_count > 5)
        if (errorCount > 5) {
          status = "degraded";
          alerts.push({
            alert_type: "agent_degraded",
            severity: "critical",
            message: `Agent "${agentName}" has ${errorCount} errors in its last run. Last error: ${hb.last_error || "unknown"}`,
            agent_name: agentName,
            metadata: { error_count: errorCount, last_error: hb.last_error },
          });
        }

        agentStatuses.push({
          agent_name: agentName,
          status,
          last_heartbeat: hb.last_heartbeat,
          hours_since_heartbeat: Math.round(hoursSince * 10) / 10,
          error_count: errorCount,
          items_processed: hb.items_processed || 0,
          items_failed: hb.items_failed || 0,
        });

        itemsProcessed++;
      }

      // 3. Check pipeline bottlenecks
      await this.checkPipelineBottlenecks(alerts);

      // 4. Check queue overflow (50+ failed items in any queue)
      await this.checkQueueOverflow(alerts);

      // 5. Check daily publish target
      await this.checkPublishRate(alerts, todayStart);

      // 6. Calculate overall swarm health score (0-100)
      const healthScore = this.calculateHealthScore(agentStatuses, alerts);

      // 7. Write alerts to agent_suggestions table
      if (alerts.length > 0) {
        const alertRows = alerts.map((alert) => ({
          agent_name: this.config.name,
          suggestion_type: "swarm_alert",
          title: `[${alert.severity.toUpperCase()}] ${alert.alert_type}: ${alert.agent_name || "system"}`,
          description: alert.message,
          status: "pending",
          priority:
            alert.severity === "critical"
              ? 10
              : alert.severity === "warning"
                ? 7
                : 4,
          metadata: {
            alert_type: alert.alert_type,
            severity: alert.severity,
            agent_name: alert.agent_name,
            generated_at: new Date().toISOString(),
            source: "supervisor_agent",
            ...alert.metadata,
          },
        }));

        const { error: insertError } = await this.supabase
          .from("agent_suggestions")
          .insert(alertRows);

        if (insertError) {
          logger.warn(`${this.config.name}: Failed to insert alerts`, {
            error: insertError,
          });
          itemsFailed++;
        }
      }

      const report = {
        health_score: healthScore,
        total_agents: EXPECTED_AGENTS.length,
        agent_statuses: agentStatuses,
        alerts_count: alerts.length,
        alerts_by_severity: {
          critical: alerts.filter((a) => a.severity === "critical").length,
          warning: alerts.filter((a) => a.severity === "warning").length,
          info: alerts.filter((a) => a.severity === "info").length,
        },
        alerts,
      };

      return {
        success: true,
        data: report,
        metadata: {
          itemsProcessed,
          itemsFailed,
          healthScore,
          report,
        },
        executionTime: Date.now() - startTime,
      };
    } catch (error: any) {
      return this.handleError(error, context);
    }
  }

  /**
   * Check for pipeline bottlenecks:
   * If content_queue has 20+ pending but editor_queue has 0 → Writer might be stuck
   */
  private async checkPipelineBottlenecks(alerts: SwarmAlert[]): Promise<void> {
    try {
      // Check content_queue pending count
      const { count: contentPending } = await this.supabase
        .from("content_queue")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");

      // Check editor_queue pending count
      const { count: editorPending } = await this.supabase
        .from("editor_queue")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");

      if ((contentPending || 0) >= 20 && (editorPending || 0) === 0) {
        alerts.push({
          alert_type: "pipeline_bottleneck",
          severity: "warning",
          message: `Pipeline bottleneck detected: content_queue has ${contentPending} pending items but editor_queue has 0. The WriterAgent may be stuck or failing silently.`,
          metadata: {
            content_queue_pending: contentPending,
            editor_queue_pending: editorPending,
          },
        });
      }

      // Also check if research is backed up
      const { count: researchPending } = await this.supabase
        .from("research_queue")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");

      if ((researchPending || 0) >= 20 && (contentPending || 0) === 0) {
        alerts.push({
          alert_type: "pipeline_bottleneck",
          severity: "warning",
          message: `Pipeline bottleneck detected: research_queue has ${researchPending} pending items but content_queue has 0. The ResearchAgent may be stuck.`,
          metadata: {
            research_queue_pending: researchPending,
            content_queue_pending: contentPending,
          },
        });
      }
    } catch (err) {
      logger.warn(`${this.config.name}: Failed to check pipeline bottlenecks`, {
        error: err,
      });
    }
  }

  /**
   * Check for queue overflow: any queue with 50+ failed items
   */
  private async checkQueueOverflow(alerts: SwarmAlert[]): Promise<void> {
    for (const table of QUEUE_TABLES) {
      try {
        const { count: failedCount } = await this.supabase
          .from(table)
          .select("id", { count: "exact", head: true })
          .eq("status", "failed");

        if ((failedCount || 0) >= 50) {
          alerts.push({
            alert_type: "queue_overflow",
            severity: "critical",
            message: `Queue overflow: ${table} has ${failedCount} failed items. These need manual review or automated retry.`,
            metadata: { queue: table, failed_count: failedCount },
          });
        }
      } catch (err) {
        // Table might not exist yet — not an error
        logger.debug(`${this.config.name}: Could not check queue ${table}`, {
          error: err,
        });
      }
    }
  }

  /**
   * Check daily publish rate against target (5-10 articles/day)
   */
  private async checkPublishRate(
    alerts: SwarmAlert[],
    todayStart: string,
  ): Promise<void> {
    try {
      const { count: publishedToday } = await this.supabase
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .gte("published_at", todayStart);

      const currentHour = new Date().getHours();
      // Expected rate: if it's past noon and we have < 2 published, we're behind
      if (currentHour >= 12 && (publishedToday || 0) < 2) {
        alerts.push({
          alert_type: "publish_rate_low",
          severity: "warning",
          message: `Daily publish rate is behind target. Only ${publishedToday || 0} articles published today (target: 5-10/day). Current time: ${currentHour}:00.`,
          metadata: {
            published_today: publishedToday || 0,
            target_min: 5,
            target_max: 10,
            current_hour: currentHour,
          },
        });
      }

      // If we somehow published > 15, that's suspicious
      if ((publishedToday || 0) > 15) {
        alerts.push({
          alert_type: "publish_rate_high",
          severity: "info",
          message: `Unusually high publish rate: ${publishedToday} articles published today. Verify quality is maintained.`,
          metadata: { published_today: publishedToday },
        });
      }
    } catch (err) {
      logger.warn(`${this.config.name}: Failed to check publish rate`, {
        error: err,
      });
    }
  }

  /**
   * Calculate overall swarm health score (0-100)
   *
   * Scoring:
   * - Each healthy agent = +14 points (7 agents = 98, rounded to 100 max)
   * - Stale agent = +4 points (instead of 14)
   * - Degraded agent = +0 points
   * - Missing agent = +0 points
   * - Each bottleneck alert = -5 points
   * - Each queue overflow = -10 points
   */
  private calculateHealthScore(
    agentStatuses: AgentHealthStatus[],
    alerts: SwarmAlert[],
  ): number {
    let score = 0;
    const pointsPerAgent = 14;

    for (const agent of agentStatuses) {
      switch (agent.status) {
        case "healthy":
          score += pointsPerAgent;
          break;
        case "stale":
          score += 4;
          break;
        case "degraded":
        case "missing":
          score += 0;
          break;
      }
    }

    // Deductions for system-level issues
    const bottleneckCount = alerts.filter(
      (a) => a.alert_type === "pipeline_bottleneck",
    ).length;
    const overflowCount = alerts.filter(
      (a) => a.alert_type === "queue_overflow",
    ).length;

    score -= bottleneckCount * 5;
    score -= overflowCount * 10;

    // Clamp to 0-100
    return Math.max(0, Math.min(100, score));
  }
}
