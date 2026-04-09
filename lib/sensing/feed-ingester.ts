/**
 * Feed Ingester — pulls content from all registered sources
 *
 * Supports: RSS feeds, Reddit JSON API, web scraping
 * Stores raw items in `feed_items` table for processing
 */

import RSSParser from "rss-parser";
import { logger } from "@/lib/logger";

const parser = new RSSParser({
  timeout: 10000,
  headers: { "User-Agent": "InvestingPro/1.0 (https://investingpro.in)" },
});

export interface FeedItem {
  sourceId: string;
  sourceName: string;
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
  category: string;
  raw?: Record<string, unknown>;
}

/**
 * Fetch RSS feed and return normalized items
 */
export async function fetchRSSFeed(
  sourceId: string,
  sourceName: string,
  feedUrl: string,
  category: string,
): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    return (feed.items || []).slice(0, 20).map((item) => ({
      sourceId,
      sourceName,
      title: item.title || "Untitled",
      url: item.link || "",
      summary: item.contentSnippet || item.content || "",
      publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
      category,
    }));
  } catch (err) {
    logger.error(`RSS fetch failed: ${sourceName}`, err as Error);
    return [];
  }
}

/**
 * Fetch Reddit JSON API and return normalized items
 */
export async function fetchRedditFeed(
  sourceId: string,
  sourceName: string,
  jsonUrl: string,
  category: string,
): Promise<FeedItem[]> {
  try {
    const res = await fetch(jsonUrl, {
      headers: { "User-Agent": "InvestingPro/1.0" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const posts = data?.data?.children || [];

    return posts.slice(0, 20).map((post: any) => ({
      sourceId,
      sourceName,
      title: post.data.title,
      url: `https://reddit.com${post.data.permalink}`,
      summary: post.data.selftext?.slice(0, 500) || "",
      publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
      category,
      raw: {
        score: post.data.score,
        numComments: post.data.num_comments,
        subreddit: post.data.subreddit,
      },
    }));
  } catch (err) {
    logger.error(`Reddit fetch failed: ${sourceName}`, err as Error);
    return [];
  }
}

/**
 * Fetch Google Trends (via unofficial RSS)
 */
export async function fetchGoogleTrends(
  country: string = "IN",
): Promise<FeedItem[]> {
  try {
    const url = `https://trends.google.com/trending/rss?geo=${country}`;
    const feed = await parser.parseURL(url);
    return (feed.items || []).slice(0, 20).map((item) => ({
      sourceId: "google-trends",
      sourceName: "Google Trends India",
      title: item.title || "",
      url: item.link || "",
      summary: item.contentSnippet || "",
      publishedAt: item.isoDate || new Date().toISOString(),
      category: "trending",
    }));
  } catch (err) {
    logger.error("Google Trends fetch failed", err as Error);
    return [];
  }
}

/**
 * Fetch X/Twitter finance accounts via Nitter RSS (public, no API key needed)
 * Nitter instances provide RSS feeds of public Twitter accounts.
 * Falls back gracefully if Nitter instances are down.
 */
const NITTER_INSTANCES = [
  "https://nitter.privacydev.net",
  "https://nitter.poast.org",
  "https://nitter.cz",
];

// Indian finance X accounts worth monitoring
const INDIAN_FINANCE_X_ACCOUNTS = [
  { handle: "RBI", category: "regulatory", name: "RBI Official" },
  { handle: "ABORUAG", category: "credit-cards", name: "Abor (CardExpert)" },
  {
    handle: "deepaboruah",
    category: "credit-cards",
    name: "Deepak Boruah (CardExpert)",
  },
  {
    handle: "zeaboruahrodhaonline",
    category: "demat-accounts",
    name: "Zerodha",
  },
  {
    handle: "ABORUAG_insights",
    category: "markets",
    name: "ET Markets Insights",
  },
  {
    handle: "MCaboruahPersonalFin",
    category: "personal-finance",
    name: "MC Personal Finance",
  },
  { handle: "CaboruahlearTax", category: "tax", name: "ClearTax" },
  { handle: "Graboruahoww", category: "investing-basics", name: "Groww" },
  {
    handle: "freaborflecharge",
    category: "personal-finance",
    name: "Freefincal",
  },
  {
    handle: "suaborbhashTD",
    category: "markets",
    name: "Subhash TD (Finance)",
  },
];

export async function fetchXFinanceFeeds(): Promise<FeedItem[]> {
  const allItems: FeedItem[] = [];

  for (const account of INDIAN_FINANCE_X_ACCOUNTS) {
    for (const instance of NITTER_INSTANCES) {
      try {
        const url = `${instance}/${account.handle}/rss`;
        const feed = await parser.parseURL(url);
        const items = (feed.items || []).slice(0, 10).map((item) => ({
          sourceId: `x-${account.handle}`,
          sourceName: `X: ${account.name}`,
          title: (item.title || item.contentSnippet || "").slice(0, 200),
          url: item.link || "",
          summary: item.contentSnippet || "",
          publishedAt: item.isoDate || new Date().toISOString(),
          category: account.category,
        }));
        allItems.push(...items);
        break; // Success — don't try other Nitter instances
      } catch {
        continue; // Try next Nitter instance
      }
    }
  }

  if (allItems.length > 0) {
    logger.info(
      `X/Twitter: fetched ${allItems.length} items from ${INDIAN_FINANCE_X_ACCOUNTS.length} accounts`,
    );
  }

  return allItems;
}
