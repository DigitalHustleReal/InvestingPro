/**
 * Data Retention & Archival Script
 *
 * Archives old data according to retention policies:
 * - Articles > 2 years old → Archive to S3
 * - Analytics data > 1 year old → Delete
 * - Workflow instances > 6 months old → Archive
 * - System events/logs > 30 days old → Delete
 *
 * Run weekly via cron job
 */

import { createClient } from "@supabase/supabase-js";
import { logger } from "../lib/logger";
import { randomUUID } from "crypto";

// Conditional import for AWS SDK (optional dependency)
let S3Client: any = null;
let PutObjectCommand: any = null;

// Dynamic import to avoid build errors when AWS SDK is not installed
async function loadAWSSDK() {
  if (S3Client) return { S3Client, PutObjectCommand };

  try {
    const awsSdk = await import("@aws-sdk/client-s3");
    S3Client = awsSdk.S3Client;
    PutObjectCommand = awsSdk.PutObjectCommand;
    return { S3Client, PutObjectCommand };
  } catch (e: any) {
    logger.warn("AWS SDK not installed - S3 archival will be disabled");
    return { S3Client: null, PutObjectCommand: null };
  }
}

// Configuration
const RETENTION_POLICIES = {
  articles: {
    archiveAfterDays: 730, // 2 years
    enabled: true,
  },
  analytics: {
    deleteAfterDays: 365, // 1 year
    enabled: true,
  },
  workflows: {
    archiveAfterDays: 180, // 6 months
    enabled: true,
  },
  systemEvents: {
    deleteAfterDays: 30, // 30 days
    enabled: true,
  },
} as const;

interface ArchivalResult {
  table: string;
  action: "archived" | "deleted";
  count: number;
  errors: string[];
}

/**
 * Initialize Supabase client
 */
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase credentials");
  }

  return createClient(url, serviceKey);
}

/**
 * Initialize S3 client (optional - only if S3 is configured)
 */
async function getS3Client(): Promise<any> {
  const { S3Client: S3, PutObjectCommand: PutCmd } = await loadAWSSDK();

  if (!S3) {
    logger.warn("S3 client not available - AWS SDK not installed");
    return null;
  }

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "us-east-1";
  const bucket = process.env.AWS_S3_ARCHIVE_BUCKET;

  if (!accessKeyId || !secretAccessKey || !bucket) {
    logger.warn(
      "S3 not configured - archival will be skipped. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_ARCHIVE_BUCKET",
    );
    return null;
  }

  return new S3({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Archive articles older than retention period
 */
async function archiveOldArticles(
  supabase: any,
  s3Client: any,
): Promise<ArchivalResult> {
  const result: ArchivalResult = {
    table: "articles",
    action: "archived",
    count: 0,
    errors: [],
  };

  if (!RETENTION_POLICIES.articles.enabled) {
    logger.info("Article archival disabled");
    return result;
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(
      cutoffDate.getDate() - RETENTION_POLICIES.articles.archiveAfterDays,
    );

    // Fetch articles to archive
    const { data: articles, error: fetchError } = await supabase
      .from("articles")
      .select("*")
      .lt("created_at", cutoffDate.toISOString())
      .eq("status", "archived") // Only archive already archived articles
      .limit(1000); // Process in batches

    if (fetchError) {
      throw fetchError;
    }

    if (!articles || articles.length === 0) {
      logger.info("No articles to archive");
      return result;
    }

    logger.info(`Found ${articles.length} articles to archive`);

    // Archive to S3 if available, otherwise mark as archived in DB
    if (s3Client && process.env.AWS_S3_ARCHIVE_BUCKET) {
      const archiveData = {
        timestamp: new Date().toISOString(),
        articles: articles,
        metadata: {
          count: articles.length,
          retentionPolicy: RETENTION_POLICIES.articles,
        },
      };

      const key = `archives/articles/${cutoffDate.toISOString().split("T")[0]}/${randomUUID()}.json`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_ARCHIVE_BUCKET,
          Key: key,
          Body: JSON.stringify(archiveData, null, 2),
          ContentType: "application/json",
          Metadata: {
            "archive-date": new Date().toISOString(),
            "article-count": String(articles.length),
          },
        }),
      );

      logger.info(`Archived ${articles.length} articles to S3: ${key}`);
    } else {
      logger.warn(
        "S3 not configured - articles will be marked as archived but not backed up",
      );
    }

    // Mark articles as archived (they should already be archived status)
    // Optionally, we could move them to an archive table
    result.count = articles.length;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(errorMessage);
    logger.error(
      "Failed to archive articles",
      error instanceof Error ? error : new Error(errorMessage),
    );
  }

  return result;
}

/**
 * Delete old analytics data
 */
async function deleteOldAnalytics(supabase: any): Promise<ArchivalResult> {
  const result: ArchivalResult = {
    table: "analytics",
    action: "deleted",
    count: 0,
    errors: [],
  };

  if (!RETENTION_POLICIES.analytics.enabled) {
    logger.info("Analytics deletion disabled");
    return result;
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(
      cutoffDate.getDate() - RETENTION_POLICIES.analytics.deleteAfterDays,
    );

    // Note: article_analytics is rolling-aggregate data (one row per article,
    // updated continuously) — it has no `created_at` column and shouldn't be
    // deleted by date. Skip it intentionally. Previously this raised
    // "column created_at does not exist" → 500 → cron failure.

    // Delete from article_views (column is `viewed_at`, not `created_at`)
    const { error: viewsError } = await supabase
      .from("article_views")
      .delete()
      .lt("viewed_at", cutoffDate.toISOString());

    if (viewsError) {
      throw viewsError;
    }

    // Delete from affiliate_clicks (column is `created_at`, not `clicked_at`)
    const { error: clicksError } = await supabase
      .from("affiliate_clicks")
      .delete()
      .lt("created_at", cutoffDate.toISOString());

    if (clicksError) {
      throw clicksError;
    }

    logger.info(
      `Deleted analytics data older than ${RETENTION_POLICIES.analytics.deleteAfterDays} days`,
    );
    result.count = 1; // Approximate count
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(errorMessage);
    logger.error(
      "Failed to delete old analytics",
      error instanceof Error ? error : new Error(errorMessage),
    );
  }

  return result;
}

/**
 * Archive old workflow instances
 */
async function archiveOldWorkflows(
  supabase: any,
  s3Client: any,
): Promise<ArchivalResult> {
  const result: ArchivalResult = {
    table: "workflow_instances",
    action: "archived",
    count: 0,
    errors: [],
  };

  if (!RETENTION_POLICIES.workflows.enabled) {
    logger.info("Workflow archival disabled");
    return result;
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(
      cutoffDate.getDate() - RETENTION_POLICIES.workflows.archiveAfterDays,
    );

    // Fetch completed/failed workflows to archive
    const { data: workflows, error: fetchError } = await supabase
      .from("workflow_instances")
      .select("*")
      .lt("completed_at", cutoffDate.toISOString())
      .in("state", ["completed", "failed", "cancelled"])
      .limit(1000);

    if (fetchError) {
      throw fetchError;
    }

    if (!workflows || workflows.length === 0) {
      logger.info("No workflows to archive");
      return result;
    }

    logger.info(`Found ${workflows.length} workflows to archive`);

    // Archive to S3 if available
    if (s3Client && process.env.AWS_S3_ARCHIVE_BUCKET) {
      const archiveData = {
        timestamp: new Date().toISOString(),
        workflows: workflows,
        metadata: {
          count: workflows.length,
          retentionPolicy: RETENTION_POLICIES.workflows,
        },
      };

      const key = `archives/workflows/${cutoffDate.toISOString().split("T")[0]}/${randomUUID()}.json`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_ARCHIVE_BUCKET,
          Key: key,
          Body: JSON.stringify(archiveData, null, 2),
          ContentType: "application/json",
          Metadata: {
            "archive-date": new Date().toISOString(),
            "workflow-count": String(workflows.length),
          },
        }),
      );

      logger.info(`Archived ${workflows.length} workflows to S3: ${key}`);
    }

    // Delete archived workflows from database
    const workflowIds = ((workflows as any[]) || [])
      .map((w: any) => w.id)
      .filter(Boolean);
    const { error: deleteError } = await supabase
      .from("workflow_instances")
      .delete()
      .in("id", workflowIds);

    if (deleteError) {
      throw deleteError;
    }

    result.count = workflows.length;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(errorMessage);
    logger.error(
      "Failed to archive workflows",
      error instanceof Error ? error : new Error(errorMessage),
    );
  }

  return result;
}

/**
 * Delete old system events/logs
 */
async function deleteOldSystemEvents(supabase: any): Promise<ArchivalResult> {
  const result: ArchivalResult = {
    table: "system_events",
    action: "deleted",
    count: 0,
    errors: [],
  };

  if (!RETENTION_POLICIES.systemEvents.enabled) {
    logger.info("System events deletion disabled");
    return result;
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(
      cutoffDate.getDate() - RETENTION_POLICIES.systemEvents.deleteAfterDays,
    );

    // Delete old system events
    const { data, error } = await supabase
      .from("system_events")
      .delete()
      .lt("created_at", cutoffDate.toISOString())
      .select("id");

    if (error) {
      throw error;
    }

    const count = data?.length || 0;
    logger.info(
      `Deleted ${count} system events older than ${RETENTION_POLICIES.systemEvents.deleteAfterDays} days`,
    );
    result.count = count;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(errorMessage);
    logger.error(
      "Failed to delete old system events",
      error instanceof Error ? error : new Error(errorMessage),
    );
  }

  return result;
}

/**
 * Main archival function
 */
export async function runArchival(): Promise<{
  success: boolean;
  results: ArchivalResult[];
  summary: {
    totalArchived: number;
    totalDeleted: number;
    errors: number;
  };
}> {
  logger.info("Starting data archival process...");

  const supabase = getSupabaseClient() as any;
  const s3Client = await getS3Client();

  const results: ArchivalResult[] = [];

  try {
    // Archive articles
    const articlesResult = await archiveOldArticles(supabase, s3Client);
    results.push(articlesResult);

    // Delete old analytics
    const analyticsResult = await deleteOldAnalytics(supabase);
    results.push(analyticsResult);

    // Archive workflows
    const workflowsResult = await archiveOldWorkflows(supabase, s3Client);
    results.push(workflowsResult);

    // Delete old system events
    const eventsResult = await deleteOldSystemEvents(supabase);
    results.push(eventsResult);

    // Calculate summary
    const summary = {
      totalArchived: results
        .filter((r) => r.action === "archived")
        .reduce((sum, r) => sum + r.count, 0),
      totalDeleted: results
        .filter((r) => r.action === "deleted")
        .reduce((sum, r) => sum + r.count, 0),
      errors: results.reduce((sum, r) => sum + r.errors.length, 0),
    };

    logger.info("Archival process completed", {
      summary,
      results: results.map((r) => ({
        table: r.table,
        action: r.action,
        count: r.count,
        errors: r.errors.length,
      })),
    });

    return {
      success: summary.errors === 0,
      results,
      summary,
    };
  } catch (error) {
    logger.error(
      "Archival process failed",
      error instanceof Error ? error : new Error(String(error)),
    );
    return {
      success: false,
      results,
      summary: {
        totalArchived: 0,
        totalDeleted: 0,
        errors: 1,
      },
    };
  }
}

// Run if executed directly
if (require.main === module) {
  runArchival()
    .then((result) => {
      if (result.success) {
        console.log("✅ Archival completed successfully");
        process.exit(0);
      } else {
        console.error("❌ Archival completed with errors");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("❌ Archival failed:", error);
      process.exit(1);
    });
}
