import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";
import { getCache, setCache, cacheKey } from "@/lib/cache/redis-client";

const CACHE_KEY = cacheKey("listing", "demat-accounts");
const CACHE_TTL = 3600; // 1 hour

export interface DematAccountListing {
  id: string;
  slug: string;
  name: string;
  type: string;
  brokerage_delivery: string | null;
  brokerage_intraday: string | null;
  account_opening_fee: string | null;
  amc: string | null;
  trading_platforms: string | null;
  mobile_app_rating: number | null;
  research_tools: string | null;
  rating: number | null;
  features: Record<string, any> | null;
  pros: string[] | null;
  cons: string[] | null;
  apply_link: string | null;
  official_link: string | null;
  image_url: string | null;
  updated_at: string | null;
}

/**
 * Server-Side Fetcher for Demat Accounts (Brokers)
 * Uses Redis cache-aside pattern: check cache first, fall back to DB.
 */
export async function getDematAccountsServer(): Promise<DematAccountListing[]> {
  // 1. Try cache first
  try {
    const cached = await getCache<DematAccountListing[]>(CACHE_KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  } catch {
    // Cache miss or error — fall through to DB
  }

  // 2. Fetch from DB
  const supabase = createClient();

  const { data, error } = await supabase
    .from("brokers")
    .select(
      "id, slug, name, type, brokerage_delivery, brokerage_intraday, account_opening_fee, amc, trading_platforms, mobile_app_rating, research_tools, rating, features, pros, cons, affiliate_link, official_link, logo_url, updated_at, best_for",
    )
    .eq("is_active", true)
    .limit(100);

  if (error) {
    logger.error("SERVER FETCH ERROR: brokers", {
      message: error.message,
      code: error.code,
    });
    return [];
  }

  const result: DematAccountListing[] = (data || []).map((b: any) => ({
    id: b.id || b.slug || "unknown",
    slug: b.slug,
    name: b.name,
    type: b.type || "Discount",
    brokerage_delivery: b.brokerage_delivery,
    brokerage_intraday: b.brokerage_intraday,
    account_opening_fee: b.account_opening_fee,
    amc: b.amc,
    trading_platforms: b.trading_platforms,
    mobile_app_rating: b.mobile_app_rating,
    research_tools: b.research_tools,
    rating: b.rating,
    features: b.features,
    pros: b.pros,
    cons: b.cons,
    apply_link: b.affiliate_link || b.official_link || "#",
    official_link: b.official_link,
    image_url: b.logo_url,
    updated_at: b.updated_at,
  }));

  // 3. Write to cache (fire-and-forget)
  if (result.length > 0) {
    setCache(CACHE_KEY, result, {
      ttl: CACHE_TTL,
      tags: ["demat-accounts"],
    }).catch(() => {});
  }

  return result;
}
