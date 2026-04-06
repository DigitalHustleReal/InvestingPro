/**
 * Cron Job: Import Financial News from RSS Feeds
 *
 * Fetches latest news from Indian financial RSS feeds and stores in DB.
 * Called by Vercel Cron: /api/cron/import-rss-news
 *
 * Schedule: Every 6 hours
 *
 * Sources:
 *   - MoneyControl (business, markets, mutual funds, personal finance)
 *   - LiveMint (economy, markets)
 *   - Economic Times (markets, personal finance)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  rssImportService,
  type RSSFeed,
} from "@/lib/rss-import/RSSImportService";
import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

// ─── Configured RSS Feeds ───────────────────────────────────────────────────────

const FINANCIAL_RSS_FEEDS: RSSFeed[] = [
  // MoneyControl — India's #1 financial news site
  {
    name: "MoneyControl Business",
    url: "https://www.moneycontrol.com/rss/business.xml",
    category: "business",
    description: "Business news from MoneyControl",
    auto_import: true,
    import_frequency: "daily",
  },
  {
    name: "MoneyControl Markets",
    url: "https://www.moneycontrol.com/rss/marketreports.xml",
    category: "markets",
    description: "Market reports and analysis",
    auto_import: true,
    import_frequency: "daily",
  },
  {
    name: "MoneyControl Mutual Funds",
    url: "https://www.moneycontrol.com/rss/MFNews.xml",
    category: "mutual-funds",
    description: "Mutual fund news and updates",
    auto_import: true,
    import_frequency: "daily",
  },
  {
    name: "MoneyControl Personal Finance",
    url: "https://www.moneycontrol.com/rss/personalfinance.xml",
    category: "personal-finance",
    description: "Personal finance tips and news",
    auto_import: true,
    import_frequency: "daily",
  },
  // LiveMint — Business Standard group
  {
    name: "LiveMint Economy",
    url: "https://www.livemint.com/rss/economy",
    category: "economy",
    description: "Economy news from LiveMint",
    auto_import: true,
    import_frequency: "daily",
  },
  {
    name: "LiveMint Markets",
    url: "https://www.livemint.com/rss/markets",
    category: "markets",
    description: "Market news from LiveMint",
    auto_import: true,
    import_frequency: "daily",
  },
  {
    name: "LiveMint Money",
    url: "https://www.livemint.com/rss/money",
    category: "personal-finance",
    description: "Money and personal finance from LiveMint",
    auto_import: true,
    import_frequency: "daily",
  },
  // Economic Times
  {
    name: "ET Markets",
    url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
    category: "markets",
    description: "Market news from Economic Times",
    auto_import: true,
    import_frequency: "daily",
  },
  {
    name: "ET Personal Finance",
    url: "https://economictimes.indiatimes.com/wealth/personal-finance-news/rssfeeds/11837536.cms",
    category: "personal-finance",
    description: "Personal finance news from ET",
    auto_import: true,
    import_frequency: "daily",
  },
];

// ─── Route Handler ──────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      logger.warn("Unauthorized RSS import attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.info("Starting RSS news import...", {
      feeds: FINANCIAL_RSS_FEEDS.length,
    });

    const supabase = createServiceClient();
    const results: Array<{
      feed: string;
      status: string;
      items: number;
      errors: number;
    }> = [];

    for (const feedConfig of FINANCIAL_RSS_FEEDS) {
      try {
        // Ensure feed exists in DB
        const feedId = await ensureFeedExists(supabase, feedConfig);

        // Import items
        const job = await rssImportService.importFeedItems(feedId);

        results.push({
          feed: feedConfig.name,
          status: job.status,
          items: job.items_processed || 0,
          errors: job.errors_count || 0,
        });

        logger.info(`RSS feed imported: ${feedConfig.name}`, {
          status: job.status,
          processed: job.items_processed,
        });
      } catch (feedError) {
        const errMsg =
          feedError instanceof Error ? feedError.message : String(feedError);
        logger.error(
          `Failed to import RSS feed: ${feedConfig.name}`,
          new Error(errMsg),
        );
        results.push({
          feed: feedConfig.name,
          status: "failed",
          items: 0,
          errors: 1,
        });
      }
    }

    const totalItems = results.reduce((sum, r) => sum + r.items, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);

    logger.info("RSS news import completed", {
      feeds: results.length,
      totalItems,
      totalErrors,
    });

    return NextResponse.json({
      success: true,
      message: `Imported ${totalItems} items from ${results.length} feeds`,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("RSS import cron failed", error as Error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Ensure the feed exists in rss_feeds table, create if not.
 * Returns the feed ID.
 */
async function ensureFeedExists(
  supabase: ReturnType<typeof createServiceClient>,
  feedConfig: RSSFeed,
): Promise<string> {
  // Check if feed with this URL already exists
  const { data: existing } = await supabase
    .from("rss_feeds")
    .select("id")
    .eq("url", feedConfig.url)
    .single();

  if (existing) return existing.id;

  // Create new feed
  const feedId = await rssImportService.createFeed(feedConfig);
  return feedId;
}
