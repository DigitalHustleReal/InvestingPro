/**
 * Base Swarm Agent
 *
 * Extends BaseAgent with queue-based communication patterns.
 * Each swarm agent runs independently on its own cron schedule,
 * communicating with other agents via DB queue tables.
 *
 * Key patterns:
 * - claimItems(): Atomically claim work from a queue table
 * - releaseItems(): Release claimed items back to pending
 * - heartbeat(): Report health to agent_heartbeats table
 * - runWithHeartbeat(): Execute with automatic health tracking
 */

import { BaseAgent, AgentContext, AgentResult } from "../base-agent";
import { logger } from "@/lib/logger";

export interface SwarmAgentConfig {
  name: string;
  batchSize: number; // Max items to process per run
  claimTimeoutMs: number; // How long before claimed items expire (default 10min)
  cronSchedule?: string; // For documentation/heartbeat
}

export interface QueueClaimResult<T = any> {
  items: T[];
  claimedCount: number;
}

export abstract class BaseSwarmAgent extends BaseAgent {
  protected config: SwarmAgentConfig;

  constructor(config: SwarmAgentConfig) {
    super(config.name);
    this.config = {
      ...config,
      claimTimeoutMs: config.claimTimeoutMs ?? 10 * 60 * 1000,
    };
  }

  /**
   * Atomically claim items from a queue table.
   * Uses UPDATE ... WHERE status='pending' ... RETURNING to prevent race conditions.
   */
  protected async claimItems<T = any>(
    table: string,
    options: {
      limit?: number;
      orderBy?: string;
      filters?: Record<string, any>;
      select?: string;
    } = {},
  ): Promise<QueueClaimResult<T>> {
    const {
      limit = this.config.batchSize,
      orderBy = "created_at",
      filters = {},
      select = "*",
    } = options;

    try {
      // First, release any stale claims (older than claimTimeout)
      const staleThreshold = new Date(
        Date.now() - this.config.claimTimeoutMs,
      ).toISOString();
      await this.supabase
        .from(table)
        .update({
          status: "pending",
          assigned_agent: null,
          claimed_at: null,
        })
        .eq("status", "claimed")
        .lt("claimed_at", staleThreshold);

      // Build query for pending items
      let query = this.supabase
        .from(table)
        .select(select)
        .eq("status", "pending")
        .order(orderBy, {
          ascending: orderBy === "priority" ? false : true,
        })
        .limit(limit);

      // Apply additional filters
      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }

      const { data: pendingItems, error: fetchError } = await query;
      if (fetchError || !pendingItems?.length) {
        return { items: [], claimedCount: 0 };
      }

      // Claim them
      const ids = pendingItems.map((item: any) => item.id);
      const { data: claimed, error: claimError } = await this.supabase
        .from(table)
        .update({
          status: "claimed",
          assigned_agent: this.config.name,
          claimed_at: new Date().toISOString(),
        })
        .in("id", ids)
        .eq("status", "pending") // Double-check still pending (prevents race)
        .select(select);

      if (claimError) {
        logger.warn(`${this.config.name}: Failed to claim items`, {
          error: claimError,
        });
        return { items: [], claimedCount: 0 };
      }

      return {
        items: (claimed as T[]) || [],
        claimedCount: claimed?.length || 0,
      };
    } catch (error) {
      logger.error(
        `${this.config.name}: claimItems failed`,
        error instanceof Error ? error : new Error(String(error)),
      );
      return { items: [], claimedCount: 0 };
    }
  }

  /**
   * Mark a queue item as completed
   */
  protected async completeItem(
    table: string,
    id: string,
    updates: Record<string, any> = {},
  ): Promise<void> {
    await this.supabase
      .from(table)
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        ...updates,
      })
      .eq("id", id);
  }

  /**
   * Mark a queue item as failed
   */
  protected async failItem(
    table: string,
    id: string,
    error: string,
  ): Promise<void> {
    await this.supabase
      .from(table)
      .update({
        status: "failed",
        error_message: error,
        completed_at: new Date().toISOString(),
      })
      .eq("id", id);
  }

  /**
   * Insert items into a queue table
   */
  protected async enqueue(
    table: string,
    items: Record<string, any>[],
  ): Promise<number> {
    if (!items.length) return 0;
    const { data, error } = await this.supabase
      .from(table)
      .insert(items)
      .select("id");
    if (error) {
      logger.error(
        `${this.config.name}: enqueue failed`,
        new Error(error.message),
      );
      return 0;
    }
    return data?.length || 0;
  }

  /**
   * Send heartbeat to agent_heartbeats table
   */
  protected async heartbeat(result: {
    itemsProcessed: number;
    itemsFailed: number;
    durationMs: number;
    lastError?: string;
  }): Promise<void> {
    try {
      const now = new Date().toISOString();
      const heartbeatData = {
        agent_name: this.config.name,
        last_heartbeat: now,
        status:
          result.itemsFailed > result.itemsProcessed / 2
            ? "degraded"
            : "healthy",
        last_run_result: {
          items_processed: result.itemsProcessed,
          items_failed: result.itemsFailed,
          duration_ms: result.durationMs,
          timestamp: now,
        },
        items_processed: result.itemsProcessed,
        items_failed: result.itemsFailed,
        avg_duration_ms: result.durationMs,
        last_error: result.lastError || null,
        last_error_at: result.lastError ? now : undefined,
        error_count: result.itemsFailed,
        cron_schedule: this.config.cronSchedule,
        updated_at: now,
      };

      // Upsert by agent_name
      await this.supabase.from("agent_heartbeats").upsert(heartbeatData, {
        onConflict: "agent_name",
      });
    } catch (error) {
      logger.warn(`${this.config.name}: heartbeat failed`, { error });
    }
  }

  /**
   * Run the agent with automatic heartbeat tracking.
   * This is the main entry point called by cron routes.
   */
  async runWithHeartbeat(context: AgentContext = {}): Promise<AgentResult> {
    const startTime = Date.now();
    let itemsProcessed = 0;
    let itemsFailed = 0;
    let lastError: string | undefined;

    try {
      logger.info(`[Swarm] ${this.config.name} starting...`);
      const result = await this.execute(context);

      itemsProcessed = result.metadata?.itemsProcessed || 0;
      itemsFailed = result.metadata?.itemsFailed || 0;
      if (!result.success) lastError = result.error;

      const durationMs = Date.now() - startTime;
      await this.heartbeat({
        itemsProcessed,
        itemsFailed,
        durationMs,
        lastError,
      });

      logger.info(
        `[Swarm] ${this.config.name} completed: ${itemsProcessed} processed, ${itemsFailed} failed, ${durationMs}ms`,
      );
      return result;
    } catch (error: any) {
      lastError = error.message;
      const durationMs = Date.now() - startTime;
      await this.heartbeat({
        itemsProcessed,
        itemsFailed: itemsFailed + 1,
        durationMs,
        lastError,
      });

      return this.handleError(error, context);
    }
  }
}
