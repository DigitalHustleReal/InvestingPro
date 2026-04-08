/**
 * Content Sensor — the autonomous brain
 *
 * SENSE → SCORE → DECIDE → return top topics to generate
 *
 * Called by cron job every 4 hours. No human input needed.
 * Feed sources come from DB (not hardcoded).
 */

import { createClient } from "@/lib/supabase/client";
import { DEFAULT_FEED_SOURCES, type FeedSource } from "./feed-sources";
import {
  fetchRSSFeed,
  fetchRedditFeed,
  fetchGoogleTrends,
  type FeedItem,
} from "./feed-ingester";
import { scoreTopics, type ScoredTopic } from "./topic-scorer";
import { logger } from "@/lib/logger";

export interface SensorResult {
  topicsFound: number;
  topicsScoredAboveThreshold: number;
  topTopics: ScoredTopic[];
  sourcesChecked: number;
  errors: string[];
}

/**
 * Run the full sensing pipeline
 *
 * @param maxTopics - max topics to return (default 10)
 * @param minScore - minimum score threshold (default 12)
 */
export async function runContentSensor(
  maxTopics: number = 10,
  minScore: number = 12,
): Promise<SensorResult> {
  const errors: string[] = [];
  const supabase = createClient();

  // Step 1: Get feed sources from DB (fall back to defaults)
  let sources: FeedSource[] = [];
  try {
    const { data } = await supabase
      .from("feed_sources")
      .select("*")
      .eq("active", true)
      .order("priority", { ascending: true });

    sources = (data as FeedSource[]) || [];
  } catch {
    // Table might not exist yet — use defaults
  }

  if (sources.length === 0) {
    sources = DEFAULT_FEED_SOURCES;
    logger.info(
      "Using default feed sources (feed_sources table empty or missing)",
    );
  }

  // Step 2: Fetch all feeds in parallel
  const allItems: FeedItem[] = [];

  const fetchPromises = sources.map(async (source) => {
    try {
      let items: FeedItem[] = [];
      const id = source.id || source.name;

      if (source.type === "rss") {
        items = await fetchRSSFeed(
          id,
          source.name,
          source.url,
          source.category,
        );
      } else if (source.type === "api" && source.url.includes("reddit.com")) {
        items = await fetchRedditFeed(
          id,
          source.name,
          source.url,
          source.category,
        );
      }

      return items;
    } catch (err) {
      errors.push(`${source.name}: ${(err as Error).message?.slice(0, 50)}`);
      return [];
    }
  });

  // Also fetch Google Trends
  fetchPromises.push(fetchGoogleTrends("IN"));

  const results = await Promise.allSettled(fetchPromises);
  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  logger.info(
    `Content Sensor: fetched ${allItems.length} items from ${sources.length} sources`,
  );

  // Step 3: Get existing article slugs for dedup
  const { data: existingArticles } = await supabase
    .from("articles")
    .select("slug")
    .limit(1000);

  const existingSlugs = new Set<string>(
    (existingArticles || []).map((a: { slug: string }) => a.slug),
  );

  // Step 4: Score and rank topics
  const scored = scoreTopics(allItems, existingSlugs);
  const aboveThreshold = scored.filter((t) => t.score >= minScore);
  const topTopics = aboveThreshold.slice(0, maxTopics);

  logger.info(
    `Content Sensor: ${scored.length} scored, ${aboveThreshold.length} above threshold, returning top ${topTopics.length}`,
  );

  return {
    topicsFound: allItems.length,
    topicsScoredAboveThreshold: aboveThreshold.length,
    topTopics,
    sourcesChecked: sources.length + 1, // +1 for Google Trends
    errors,
  };
}
