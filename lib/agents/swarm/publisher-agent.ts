/**
 * Publisher Agent
 *
 * PUBLISH phase — moves approved articles to published status.
 * Auto-publishes articles with quality >= 85 that passed editor review.
 * Queues published articles for distribution.
 *
 * Flow: articles (review-ready) → publish → distribution_queue
 * Runs: 10:00 AM + 4:00 PM IST daily
 */

import { BaseSwarmAgent } from "./base-swarm-agent";
import { AgentContext, AgentResult } from "../base-agent";
import { logger } from "@/lib/logger";

const MIN_PUBLISH_QUALITY = 80;
const MAX_PUBLISH_PER_RUN = 5;

export class PublisherAgent extends BaseSwarmAgent {
  constructor() {
    super({
      name: "PublisherAgent",
      batchSize: MAX_PUBLISH_PER_RUN,
      claimTimeoutMs: 5 * 60 * 1000,
      cronSchedule: "0 10,16 * * *",
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    let itemsProcessed = 0;
    let itemsFailed = 0;

    try {
      // 1. Find articles ready to publish
      const { data: readyArticles, error: fetchError } = await this.supabase
        .from("articles")
        .select("id, title, slug, quality_score, category, excerpt, word_count")
        .eq("status", "review-ready")
        .gte("quality_score", MIN_PUBLISH_QUALITY)
        .order("quality_score", { ascending: false })
        .limit(this.config.batchSize);

      if (fetchError || !readyArticles?.length) {
        return {
          success: true,
          data: { message: "No articles ready to publish" },
          metadata: { itemsProcessed: 0, itemsFailed: 0 },
        };
      }

      // 2. Check how many we've already published today (rate limit)
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const { count: publishedToday } = await this.supabase
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .gte("published_at", todayStart.toISOString());

      const dailyLimit = 10;
      const remainingSlots = Math.max(0, dailyLimit - (publishedToday || 0));

      if (remainingSlots === 0) {
        return {
          success: true,
          data: {
            message: `Daily publish limit reached (${dailyLimit}/day)`,
          },
          metadata: { itemsProcessed: 0, itemsFailed: 0 },
        };
      }

      const toPublish = readyArticles.slice(0, remainingSlots);

      // 3. Publish each article
      for (const article of toPublish) {
        try {
          const now = new Date().toISOString();

          // Publish
          const { error: publishError } = await this.supabase
            .from("articles")
            .update({
              status: "published",
              published_at: now,
              published_date: now,
              updated_at: now,
            })
            .eq("id", article.id);

          if (publishError) throw publishError;

          // Queue for distribution
          await this.enqueue("distribution_queue", [
            {
              article_id: article.id,
              channels: ["telegram", "twitter", "linkedin"],
              status: "pending",
              scheduled_for: now,
            },
          ]);

          itemsProcessed++;
          logger.info(
            `[PublisherAgent] Published: "${article.title}" (quality: ${article.quality_score})`,
          );
        } catch (error: any) {
          itemsFailed++;
          logger.error(
            `[PublisherAgent] Failed to publish "${article.title}": ${error.message}`,
          );
        }
      }

      return {
        success: itemsProcessed > 0,
        data: {
          published: itemsProcessed,
          failed: itemsFailed,
          publishedToday: (publishedToday || 0) + itemsProcessed,
        },
        metadata: { itemsProcessed, itemsFailed },
        executionTime: Date.now() - startTime,
      };
    } catch (error: any) {
      return this.handleError(error, context);
    }
  }
}
