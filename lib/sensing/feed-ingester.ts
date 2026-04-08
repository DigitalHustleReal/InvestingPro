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
