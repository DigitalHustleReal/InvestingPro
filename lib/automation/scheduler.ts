/**
 * Content Scheduling Service
 *
 * Handles scheduling of articles and social posts:
 * - Schedule articles for future publish
 * - Automatic publish on schedule
 * - Schedule social posts
 * - Bulk scheduling
 * - Schedule management
 */

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { distributeContent } from "@/lib/automation/content-distribution";

export interface ScheduleOptions {
  publishAt: string; // ISO timestamp
  socialPosts?: Array<{
    platform: "twitter" | "linkedin" | "facebook";
    scheduledAt: string; // ISO timestamp
    content?: string;
  }>;
}

export interface ScheduledArticle {
  articleId: string;
  title: string;
  slug: string;
  scheduledPublishAt: string;
  status: "scheduled" | "published" | "cancelled";
  socialPosts?: Array<{
    platform: string;
    scheduledAt: string;
    status: "scheduled" | "posted" | "cancelled";
  }>;
}

/**
 * Schedule an article for future publishing
 */
export async function scheduleArticle(
  articleId: string,
  options: ScheduleOptions,
): Promise<{ success: boolean; scheduledPublishAt?: string; error?: string }> {
  const supabase = await createClient();

  try {
    const publishAt = new Date(options.publishAt);
    const now = new Date();

    if (publishAt <= now) {
      return {
        success: false,
        error: "Scheduled publish time must be in the future",
      };
    }

    // Update article with scheduled publish time
    const { data, error } = await supabase
      .from("articles")
      .update({
        status: "scheduled", // Use 'scheduled' status
        scheduled_publish_at: options.publishAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId)
      .select()
      .single();

    if (error) {
      logger.error("Failed to schedule article", error, { articleId });
      return {
        success: false,
        error: error.message,
      };
    }

    // Schedule social posts if provided
    if (options.socialPosts && options.socialPosts.length > 0) {
      // TODO: Store social post schedules in a separate table
      // For now, store in article metadata
      await supabase
        .from("articles")
        .update({
          editorial_notes: {
            ...(data.editorial_notes || {}),
            scheduled_social_posts: options.socialPosts,
          },
        })
        .eq("id", articleId);
    }

    logger.info("Article scheduled successfully", {
      articleId,
      scheduledPublishAt: options.publishAt,
    });

    return {
      success: true,
      scheduledPublishAt: options.publishAt,
    };
  } catch (error) {
    logger.error("Error scheduling article", error as Error, { articleId });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Cancel a scheduled article
 */
export async function cancelScheduledArticle(
  articleId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("articles")
      .update({
        status: "draft",
        scheduled_publish_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId);

    if (error) {
      logger.error("Failed to cancel scheduled article", error, { articleId });
      return {
        success: false,
        error: error.message,
      };
    }

    logger.info("Scheduled article cancelled", { articleId });
    return { success: true };
  } catch (error) {
    logger.error("Error cancelling scheduled article", error as Error, {
      articleId,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get all scheduled articles
 */
export async function getScheduledArticles(options?: {
  limit?: number;
  startDate?: string;
  endDate?: string;
}): Promise<ScheduledArticle[]> {
  const supabase = await createClient();
  const limit = options?.limit || 100;

  try {
    let query = supabase
      .from("articles")
      .select("id, title, slug, scheduled_publish_at, status, editorial_notes")
      .eq("status", "scheduled")
      .not("scheduled_publish_at", "is", null)
      .order("scheduled_publish_at", { ascending: true })
      .limit(limit);

    if (options?.startDate) {
      query = query.gte("scheduled_publish_at", options.startDate);
    }

    if (options?.endDate) {
      query = query.lte("scheduled_publish_at", options.endDate);
    }

    const { data, error } = await query;

    if (error) {
      logger.error("Failed to fetch scheduled articles", error);
      return [];
    }

    return (data || []).map((article: any) => ({
      articleId: article.id,
      title: article.title || "",
      slug: article.slug || "",
      scheduledPublishAt: article.scheduled_publish_at || "",
      status: (article.status || "scheduled") as
        | "scheduled"
        | "published"
        | "cancelled",
      socialPosts:
        (article.editorial_notes as any)?.scheduled_social_posts || [],
    }));
  } catch (error) {
    logger.error("Error fetching scheduled articles", error as Error);
    return [];
  }
}

/**
 * Publish scheduled articles that are due
 * This should be called by a cron job
 */
export async function publishScheduledArticles(): Promise<{
  published: number;
  errors: Array<{ articleId: string; error: string }>;
}> {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const results = {
    published: 0,
    errors: [] as Array<{ articleId: string; error: string }>,
  };

  try {
    // Get articles scheduled to publish now or earlier
    const { data: scheduledArticles, error: fetchError } = await supabase
      .from("articles")
      .select("id, title, slug")
      .eq("status", "scheduled")
      .not("scheduled_publish_at", "is", null)
      .lte("scheduled_publish_at", now);

    if (fetchError || !scheduledArticles) {
      logger.error(
        "Failed to fetch scheduled articles for publishing",
        fetchError as Error,
      );
      return results;
    }

    // Publish each scheduled article
    for (const article of scheduledArticles) {
      try {
        // Import article service dynamically to avoid circular dependencies
        const { articleService } = await import("@/lib/cms/article-service");

        // Publish the article
        await articleService.publishArticle(article.id, {} as any, {} as any);

        // Update scheduled_publish_at to null
        await supabase
          .from("articles")
          .update({ scheduled_publish_at: null })
          .eq("id", article.id);

        results.published++;
        logger.info("Scheduled article published", {
          articleId: article.id,
          title: article.title,
        });

        // Fire-and-forget: distribute to social media + email
        distributeContent(article.id).catch((err) => {
          logger.error(
            "Background distribution failed for scheduled article",
            err instanceof Error ? err : new Error(String(err)),
            {
              articleId: article.id,
            },
          );
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        results.errors.push({
          articleId: article.id,
          error: errorMessage,
        });
        logger.error("Failed to publish scheduled article", error as Error, {
          articleId: article.id,
        });
      }
    }

    logger.info("Scheduled articles publishing complete", {
      published: results.published,
      errors: results.errors.length,
    });

    return results;
  } catch (error) {
    logger.error("Error publishing scheduled articles", error as Error);
    return results;
  }
}

/**
 * Bulk schedule multiple articles
 */
export async function bulkScheduleArticles(
  schedules: Array<{ articleId: string; publishAt: string }>,
): Promise<{
  scheduled: number;
  errors: Array<{ articleId: string; error: string }>;
}> {
  const results = {
    scheduled: 0,
    errors: [] as Array<{ articleId: string; error: string }>,
  };

  for (const schedule of schedules) {
    const result = await scheduleArticle(schedule.articleId, {
      publishAt: schedule.publishAt,
    });

    if (result.success) {
      results.scheduled++;
    } else {
      results.errors.push({
        articleId: schedule.articleId,
        error: result.error || "Unknown error",
      });
    }
  }

  return results;
}

/**
 * Update scheduled publish time
 */
export async function updateScheduledTime(
  articleId: string,
  newPublishAt: string,
): Promise<{ success: boolean; error?: string }> {
  return await scheduleArticle(articleId, { publishAt: newPublishAt });
}
