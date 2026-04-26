/**
 * Daily Content Generation Cron Job
 * Generates 5 keyword-targeted articles per day
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/daily-content-generation",
 *     "schedule": "0 6 * * *" // 6 AM IST daily
 *   }]
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { env, getServerPublicUrl } from "@/lib/env";
import { logger } from "@/lib/logger";
import { pingIndexNowBatch } from "@/lib/seo/indexnow-helper";

// Verify cron secret (for Vercel Cron Jobs)
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return true; // Allow if no secret configured (for local development)
  }

  return authHeader === `Bearer ${cronSecret}`;
}

// Fallback topics when content sensor has nothing (priority: Credit Cards + Mutual Funds)
const FALLBACK_TOPICS = [
  {
    category: "credit-cards",
    topic: "Best Credit Card for Online Shopping in India 2026",
    keywords: [
      "credit card online shopping",
      "cashback credit card",
      "ecommerce credit card",
    ],
  },
  {
    category: "credit-cards",
    topic: "Best Travel Credit Card with Lounge Access India 2026",
    keywords: [
      "travel credit card",
      "airport lounge access",
      "air miles credit card",
    ],
  },
  {
    category: "credit-cards",
    topic: "Best Credit Card for Fuel Expenses in India 2026",
    keywords: ["fuel credit card", "petrol credit card", "fuel cashback"],
  },
  {
    category: "mutual-funds",
    topic: "Best SIP for ₹5000 Per Month - Long-Term Investment Guide 2026",
    keywords: ["sip 5000", "monthly sip", "long term investment"],
  },
  {
    category: "mutual-funds",
    topic: "Best ELSS Tax Saving Mutual Funds - Section 80C Benefits 2026",
    keywords: ["elss mutual funds", "tax saving", "section 80c"],
  },
  {
    category: "demat-accounts",
    topic: "Best Zero Brokerage Demat Account in India 2026",
    keywords: ["zero brokerage", "demat account", "discount broker"],
  },
  {
    category: "fixed-deposits",
    topic: "Highest FD Interest Rates India 2026 — Bank vs NBFC",
    keywords: ["fd rates", "fixed deposit", "high interest fd"],
  },
  {
    category: "loans",
    topic: "Lowest Personal Loan Interest Rate India 2026 Comparison",
    keywords: [
      "personal loan rate",
      "cheap personal loan",
      "low interest loan",
    ],
  },
  {
    category: "tax",
    topic: "How to Save Tax Under New Regime Without 80C Deductions",
    keywords: ["new tax regime", "save tax", "tax planning"],
  },
  {
    category: "investing-basics",
    topic: "How to Start Investing with ₹1000 Per Month in India",
    keywords: ["start investing", "small investment", "beginner investor"],
  },
];

/**
 * Get topics for today — first try content sensor output, then fallback to rotating list.
 * This connects the Content Sensor → Content Generator pipeline.
 */
async function getTopicsForToday(
  supabase: any,
): Promise<typeof FALLBACK_TOPICS> {
  // 1. Try content sensor discoveries (stored by content-sense cron)
  try {
    const { data: sensorTopics } = await supabase
      .from("content_topics")
      .select("title, category, keywords, score")
      .eq("status", "pending")
      .order("score", { ascending: false })
      .limit(5);

    if (sensorTopics && sensorTopics.length >= 3) {
      logger.info(`Using ${sensorTopics.length} topics from content sensor`);
      // Mark as processing
      const ids = sensorTopics.map((t: any) => t.id).filter(Boolean);
      if (ids.length > 0) {
        await supabase
          .from("content_topics")
          .update({ status: "processing" })
          .in("id", ids);
      }
      return sensorTopics.map((t: any) => ({
        category: t.category || "investing-basics",
        topic: t.title,
        keywords: t.keywords || [t.title.toLowerCase()],
      }));
    }
  } catch {
    // content_topics table might not exist — fall through to fallback
  }

  // 2. Check existing articles to avoid duplicates
  const { data: existing } = await supabase
    .from("articles")
    .select("slug")
    .limit(1000);
  const existingSlugs = new Set((existing || []).map((a: any) => a.slug));

  // 3. Rotate through fallback topics, skipping already-written ones
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      86400000,
  );

  const topics: typeof FALLBACK_TOPICS = [];
  for (let i = 0; i < FALLBACK_TOPICS.length && topics.length < 3; i++) {
    const idx = (dayOfYear * 3 + i) % FALLBACK_TOPICS.length;
    const topic = FALLBACK_TOPICS[idx];
    const slug = topic.topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!existingSlugs.has(slug)) {
      topics.push(topic);
    }
  }

  return topics.length > 0 ? topics : FALLBACK_TOPICS.slice(0, 3);
}

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    if (!verifyCronSecret(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.info("Daily content generation started");

    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
    );

    // Get topics for today (from content sensor or fallback list)
    const topics = await getTopicsForToday(supabase);
    logger.info(`Generating ${topics.length} articles for today`, {
      topics: topics.map((t) => t.topic),
    });

    // Queue article generation jobs
    const jobIds: string[] = [];
    const results: Array<{
      topic: string;
      success: boolean;
      jobId?: string;
      error?: string;
    }> = [];

    const baseUrl = getServerPublicUrl();
    if (!baseUrl) {
      logger.error(
        "Daily content generation: set NEXT_PUBLIC_APP_URL or NEXT_PUBLIC_BASE_URL (or VERCEL_URL is set)",
      );
      return NextResponse.json(
        {
          error:
            "App URL not configured. Set NEXT_PUBLIC_APP_URL or NEXT_PUBLIC_BASE_URL in Vercel.",
        },
        { status: 503 },
      );
    }

    for (const topicData of topics) {
      try {
        // Call article generation API
        const response = await fetch(
          `${baseUrl}/api/articles/generate-comprehensive`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Use service role key for internal API calls
              Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({
              topic: topicData.topic,
              category: topicData.category,
              targetKeywords: topicData.keywords,
              wordCount: 2000,
              contentLength: "comprehensive",
              autoPublish: true, // Auto-publish if quality score >= 75
              qualityThreshold: 75, // Minimum score to auto-publish (0-100)
            }),
          },
        );

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          throw new Error(error.error || `HTTP ${response.status}`);
        }

        const result = await response.json();
        jobIds.push(result.jobId || result.id);
        results.push({
          topic: topicData.topic,
          success: true,
          jobId: result.jobId || result.id,
        });

        logger.info(`Queued article generation`, {
          topic: topicData.topic,
          jobId: result.jobId,
        });
      } catch (error: any) {
        logger.error(`Failed to queue article generation`, error, {
          topic: topicData.topic,
        });
        results.push({
          topic: topicData.topic,
          success: false,
          error: error.message,
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    // Auto-publish quality-passing drafts that were just generated
    let published = 0;
    let keptAsDraft = 0;
    try {
      const { data: drafts } = await supabase
        .from("articles")
        .select("id, slug, title, quality_score, body_html")
        .eq("status", "draft")
        .gte(
          "created_at",
          new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        ) // Last 2 hours
        .order("created_at", { ascending: false })
        .limit(10);

      const justPublishedSlugs: string[] = [];

      for (const draft of drafts || []) {
        const score = draft.quality_score || 0;
        const wordCount = (draft.body_html || "")
          .replace(/<[^>]*>/g, "")
          .split(/\s+/).length;
        const hasH2 = (draft.body_html || "").includes("<h2");

        // Quality gate: score >= 75, 500+ words, has structure
        if (score >= 75 && wordCount >= 500 && hasH2) {
          const now = new Date().toISOString();
          await supabase
            .from("articles")
            .update({
              status: "published",
              published_at: now,
              published_date: now.split("T")[0],
              updated_at: now,
            })
            .eq("id", draft.id);
          published++;
          if (draft.slug) {
            justPublishedSlugs.push(`/articles/${draft.slug}`);
          }
          logger.info(
            `Auto-published: "${draft.title}" (score: ${score}, words: ${wordCount})`,
          );
        } else {
          keptAsDraft++;
          logger.info(
            `Kept as draft: "${draft.title}" (score: ${score}, words: ${wordCount}) — needs review`,
          );
        }
      }

      // Batch-ping IndexNow (Bing/Yandex) for fresh URLs.
      // Fire-and-forget — failure here must not block the cron run.
      if (justPublishedSlugs.length > 0) {
        pingIndexNowBatch(justPublishedSlugs);
        logger.info(
          `[indexnow] queued ${justPublishedSlugs.length} new article URLs for instant indexing`,
        );
      }
    } catch (pubErr) {
      logger.warn("Auto-publish step failed", {
        error: pubErr instanceof Error ? pubErr.message : String(pubErr),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${successCount}, auto-published ${published}, kept ${keptAsDraft} as draft`,
      generated: successCount,
      published,
      keptAsDraft,
      failed: failureCount,
      jobIds,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error("Error in daily content generation cron", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate daily content",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
