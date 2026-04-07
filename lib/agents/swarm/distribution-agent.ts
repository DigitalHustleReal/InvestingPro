/**
 * Distribution Agent
 *
 * OPTIMIZE phase — distributes published articles to all channels.
 * Uses existing content-distribution.ts infrastructure.
 *
 * Flow: distribution_queue (pending) → distribute → results
 * Runs: 10:30 AM + 4:30 PM + 8:30 PM IST daily
 */

import { BaseSwarmAgent } from "./base-swarm-agent";
import { AgentContext, AgentResult } from "../base-agent";
import { distributeContent } from "@/lib/automation/content-distribution";
import { logger } from "@/lib/logger";

export class DistributionAgent extends BaseSwarmAgent {
  constructor() {
    super({
      name: "DistributionAgent",
      batchSize: 5,
      claimTimeoutMs: 5 * 60 * 1000,
      cronSchedule: "30 10,16,20 * * *",
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    let itemsProcessed = 0;
    let itemsFailed = 0;

    try {
      // 1. Claim from distribution_queue
      const { items } = await this.claimItems<any>("distribution_queue", {
        limit: this.config.batchSize,
        orderBy: "scheduled_for",
      });

      if (!items.length) {
        return {
          success: true,
          data: { message: "No articles to distribute" },
          metadata: { itemsProcessed: 0, itemsFailed: 0 },
        };
      }

      for (const item of items) {
        try {
          await this.supabase
            .from("distribution_queue")
            .update({ status: "in_progress" })
            .eq("id", item.id);

          // Use existing distribution infrastructure
          const result = await distributeContent(item.article_id);

          const channelResults = {
            telegram: result.messaging?.telegram?.sent || false,
            twitter: result.socialMedia?.twitter || false,
            linkedin: result.socialMedia?.linkedin || false,
            email: result.email?.sent || false,
          };

          const anySuccess = Object.values(channelResults).some(Boolean);

          await this.completeItem("distribution_queue", item.id, {
            status: anySuccess ? "completed" : "partial",
            results: channelResults,
          });

          itemsProcessed++;
          logger.info(
            `[DistributionAgent] Distributed article ${item.article_id}: ${JSON.stringify(channelResults)}`,
          );
        } catch (error: any) {
          itemsFailed++;

          // Retry logic — increment retry count, reset to pending if under limit
          const retryCount = (item.retry_count || 0) + 1;
          if (retryCount < 3) {
            await this.supabase
              .from("distribution_queue")
              .update({
                status: "pending",
                retry_count: retryCount,
                assigned_agent: null,
                claimed_at: null,
              })
              .eq("id", item.id);
          } else {
            await this.failItem("distribution_queue", item.id, error.message);
          }

          logger.error(
            `[DistributionAgent] Failed article ${item.article_id}: ${error.message}`,
          );
        }
      }

      return {
        success: itemsProcessed > 0,
        data: { distributed: itemsProcessed, failed: itemsFailed },
        metadata: { itemsProcessed, itemsFailed },
        executionTime: Date.now() - startTime,
      };
    } catch (error: any) {
      return this.handleError(error, context);
    }
  }
}
