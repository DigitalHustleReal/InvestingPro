import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";
import { getCache, setCache, cacheKey } from "@/lib/cache/redis-client";

const CACHE_KEY = cacheKey("listing", "govt-schemes");
const CACHE_TTL = 3600; // 1 hour

export interface GovtSchemeListing {
  id: string;
  slug: string;
  name: string;
  scheme_type: string;
  provider: string;
  current_interest_rate: number | null;
  min_investment: number | null;
  max_investment: number | null;
  lock_in_period: string | null;
  maturity_period: string | null;
  tax_benefit: string | null;
  tax_on_returns: string | null;
  risk_level: string | null;
  description: string | null;
  best_for: string | null;
  features: Record<string, any> | null;
  pros: string[] | null;
  cons: string[] | null;
  rating: number | null;
  official_link: string | null;
  image_url: string | null;
  is_active: boolean;
  updated_at: string | null;
}

/**
 * Server-Side Fetcher for Government Schemes (PPF, NPS, SSY, SCSS, etc.)
 * Uses Redis cache-aside pattern: check cache first, fall back to DB.
 */
export async function getGovtSchemesServer(): Promise<GovtSchemeListing[]> {
  // 1. Try cache first
  try {
    const cached = await getCache<GovtSchemeListing[]>(CACHE_KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  } catch {
    // Cache miss or error — fall through to DB
  }

  // 2. Fetch from DB
  const supabase = createClient();

  const { data, error } = await supabase
    .from("govt_schemes")
    .select(
      "id, slug, name, scheme_type, provider, current_interest_rate, min_investment, max_investment, lock_in_period, maturity_period, tax_benefit, tax_on_returns, risk_level, description, best_for, features, pros, cons, rating, official_link, image_url, is_active, updated_at",
    )
    .eq("is_active", true)
    .order("current_interest_rate", { ascending: false, nullsFirst: false })
    .limit(50);

  if (error) {
    logger.error("SERVER FETCH ERROR: govt_schemes", error);
    return [];
  }

  const result: GovtSchemeListing[] = (data || []).map((gs: any) => ({
    id: gs.id || gs.slug || "unknown",
    slug: gs.slug,
    name: gs.name,
    scheme_type: gs.scheme_type || "Savings",
    provider: gs.provider || "Government of India",
    current_interest_rate: gs.current_interest_rate,
    min_investment: gs.min_investment,
    max_investment: gs.max_investment,
    lock_in_period: gs.lock_in_period,
    maturity_period: gs.maturity_period,
    tax_benefit: gs.tax_benefit,
    tax_on_returns: gs.tax_on_returns,
    risk_level: gs.risk_level || "Zero Risk",
    description: gs.description,
    best_for: gs.best_for,
    features: gs.features,
    pros: gs.pros,
    cons: gs.cons,
    rating: gs.rating,
    official_link: gs.official_link,
    image_url: gs.image_url,
    is_active: gs.is_active ?? true,
    updated_at: gs.updated_at,
  }));

  // 3. Write to cache (fire-and-forget)
  if (result.length > 0) {
    setCache(CACHE_KEY, result, {
      ttl: CACHE_TTL,
      tags: ["govt-schemes"],
    }).catch(() => {});
  }

  return result;
}
