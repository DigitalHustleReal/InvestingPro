import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";
import { getCache, setCache, cacheKey } from "@/lib/cache/redis-client";

const CACHE_KEY = cacheKey("listing", "mutual-funds");
const CACHE_TTL = 3600; // 1 hour

export interface MutualFundListing {
  id: string;
  slug: string;
  name: string;
  category: string;
  fund_house: string;
  aum: number | null;
  returns_1y: number | null;
  returns_3y: number | null;
  returns_5y: number | null;
  rating: number | null;
  risk: string | null;
  expense_ratio: number | null;
  min_investment: string | null;
  nav: number | null;
  updated_at: string | null;
}

/**
 * Server-Side Fetcher for Mutual Funds
 * Uses Redis cache-aside pattern: check cache first, fall back to DB.
 */
export async function getMutualFundsServer(): Promise<MutualFundListing[]> {
  // 1. Try cache first
  try {
    const cached = await getCache<MutualFundListing[]>(CACHE_KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  } catch {
    // Cache miss or error — fall through to DB
  }

  // 2. Fetch from DB
  const supabase = createClient();

  const { data, error } = await supabase
    .from("mutual_funds")
    .select(
      "id, slug, name, category, fund_house, aum, returns_1y, returns_3y, returns_5y, rating, risk, expense_ratio, min_investment, nav, updated_at",
    )
    .order("returns_3y", { ascending: false, nullsFirst: false })
    .limit(100);

  if (error) {
    logger.error("SERVER FETCH ERROR: mutual_funds", error);
    return [];
  }

  const result: MutualFundListing[] = (data || []).map((p: any) => ({
    id: p.id || p.slug || "unknown",
    slug: p.slug,
    name: p.name,
    category: p.category || "Equity",
    fund_house: p.fund_house || "Unknown",
    aum: p.aum,
    returns_1y: p.returns_1y,
    returns_3y: p.returns_3y,
    returns_5y: p.returns_5y,
    rating: p.rating,
    risk: p.risk || "Moderate",
    expense_ratio: p.expense_ratio,
    min_investment: p.min_investment,
    nav: p.nav,
    updated_at: p.updated_at,
  }));

  // 3. Write to cache (fire-and-forget)
  if (result.length > 0) {
    setCache(CACHE_KEY, result, {
      ttl: CACHE_TTL,
      tags: ["mutual-funds"],
    }).catch(() => {});
  }

  return result;
}
