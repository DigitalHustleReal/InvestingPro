/**
 * News Source Poller
 *
 * Fetches new items from RSS feeds, price APIs, and scrape endpoints.
 * Uses SHA-256 hash of (sourceId + guid) to detect already-seen items.
 * Caps at 10 new items per source per poll to prevent backfill floods.
 */
import crypto from "crypto";
import { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

export interface NewsSource {
  id: string;
  name: string;
  type: "rss" | "price_poll" | "scrape";
  url: string;
  category_tags: string[];
  base_importance: number;
  poll_interval_m: number;
  last_item_hash: string | null;
}

export interface RawNewsItem {
  source_id: string;
  source_name: string;
  source_url: string;
  guid: string;
  headline: string;
  summary: string;
  raw_content: string;
  published_at: string;
  item_url: string;
}

function hashItem(sourceId: string, guid: string): string {
  return crypto
    .createHash("sha256")
    .update(`${sourceId}:${guid}`)
    .digest("hex");
}

function parseXmlValue(block: string, tag: string): string {
  const re = new RegExp(
    `<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`,
    "i",
  );
  return (re.exec(block)?.[1] ?? "").trim();
}

async function fetchRssSource(source: NewsSource): Promise<RawNewsItem[]> {
  const res = await fetch(source.url, {
    headers: {
      "User-Agent": "InvestingPro-NewsBot/1.0 (+https://investingpro.in)",
    },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${source.url}`);
  const xml = await res.text();

  const items: RawNewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = parseXmlValue(block, "title");
    const link = parseXmlValue(block, "link") || parseXmlValue(block, "guid");
    const guid = parseXmlValue(block, "guid") || link;
    const pubDate = parseXmlValue(block, "pubDate");
    const description = parseXmlValue(block, "description");

    if (!title || !guid) continue;

    let publishedAt: string;
    try {
      publishedAt = pubDate
        ? new Date(pubDate).toISOString()
        : new Date().toISOString();
    } catch {
      publishedAt = new Date().toISOString();
    }

    items.push({
      source_id: source.id,
      source_name: source.name,
      source_url: source.url,
      guid,
      headline: title.substring(0, 500),
      summary: description.replace(/<[^>]+>/g, "").substring(0, 800),
      raw_content: description.replace(/<[^>]+>/g, "").substring(0, 3000),
      published_at: publishedAt,
      item_url: link,
    });
  }
  return items;
}

async function fetchPricePollSource(
  source: NewsSource,
): Promise<RawNewsItem[]> {
  const res = await fetch(source.url, {
    headers: { "User-Agent": "InvestingPro-NewsBot/1.0" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${source.url}`);
  const text = await res.text();

  // One synthetic item per calendar day per price source
  const guid = `${source.id}:${new Date().toISOString().substring(0, 10)}`;
  return [
    {
      source_id: source.id,
      source_name: source.name,
      source_url: source.url,
      guid,
      headline: `${source.name} daily update`,
      summary: text.substring(0, 500),
      raw_content: text.substring(0, 3000),
      published_at: new Date().toISOString(),
      item_url: source.url,
    },
  ];
}

export async function pollSource(source: NewsSource): Promise<RawNewsItem[]> {
  if (source.type === "rss") return fetchRssSource(source);
  return fetchPricePollSource(source); // price_poll + scrape use same approach
}

export function filterNewItems(
  items: RawNewsItem[],
  lastHash: string | null,
): { newItems: RawNewsItem[]; latestHash: string | null } {
  if (!items.length) return { newItems: [], latestHash: lastHash };

  const latestHash = hashItem(items[0].source_id, items[0].guid);
  // No new items if the top item is the same as last seen
  if (latestHash === lastHash) return { newItems: [], latestHash: lastHash };

  const newItems: RawNewsItem[] = [];
  for (const item of items) {
    const h = hashItem(item.source_id, item.guid);
    if (h === lastHash) break; // Stop at the previously-seen item
    newItems.push(item);
    if (newItems.length >= 10) break; // Hard cap: no backfill floods
  }

  return { newItems, latestHash };
}

export async function pollAllSources(
  supabase: SupabaseClient,
): Promise<RawNewsItem[]> {
  // Fetch active sources that are due for polling
  // (last_polled_at IS NULL or older than 14 min — catches all 15-min sources)
  const threshold = new Date(Date.now() - 14 * 60_000).toISOString();

  const { data: sources, error } = await supabase
    .from("news_sources")
    .select("*")
    .eq("active", true)
    .or(`last_polled_at.is.null,last_polled_at.lt.${threshold}`)
    .order("last_polled_at", { ascending: true, nullsFirst: true })
    .limit(20); // Poll max 20 sources per run to stay within 300s

  if (error) throw error;
  if (!sources?.length) return [];

  const allNew: RawNewsItem[] = [];

  await Promise.allSettled(
    (sources as NewsSource[]).map(async (source) => {
      try {
        const items = await pollSource(source);
        const { newItems, latestHash } = filterNewItems(
          items,
          source.last_item_hash,
        );

        await supabase
          .from("news_sources")
          .update({
            last_polled_at: new Date().toISOString(),
            last_item_hash: latestHash,
            error_count: 0,
            last_error: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", source.id);

        if (newItems.length) {
          allNew.push(...newItems);
          logger.info(
            `[NewsPoller] ${source.name}: ${newItems.length} new items`,
          );
        }
      } catch (err: any) {
        logger.warn(`[NewsPoller] ${source.name} failed: ${err.message}`);
        await supabase
          .from("news_sources")
          .update({
            last_polled_at: new Date().toISOString(),
            last_error: err.message.substring(0, 500),
            updated_at: new Date().toISOString(),
          })
          .eq("id", source.id);
        // Increment error counter via DB function (auto-disables at 5)
        try {
          await supabase.rpc("increment_source_error", {
            source_id: source.id,
          });
        } catch {
          // Non-fatal — best effort
        }
      }
    }),
  );

  return allNew;
}
