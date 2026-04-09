import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";
import { getCache, setCache, cacheKey } from "@/lib/cache/redis-client";

const CACHE_KEY = cacheKey("listing", "insurance");
const CACHE_TTL = 3600; // 1 hour

export interface InsuranceListing {
  id: string;
  slug: string;
  name: string;
  provider_name: string;
  type: string;
  cover_amount: string | null;
  min_premium: number | null;
  premium_range: string | null;
  claim_settlement_ratio: number | null;
  network_hospitals: number | null;
  rating: number | null;
  description: string | null;
  best_for: string | null;
  features: Record<string, any> | null;
  pros: string[] | null;
  cons: string[] | null;
  apply_link: string | null;
  official_link: string | null;
  image_url: string | null;
  is_active: boolean;
  updated_at: string | null;
}

/**
 * Server-Side Fetcher for Insurance Plans
 * Uses Redis cache-aside pattern: check cache first, fall back to DB.
 */
export async function getInsuranceServer(): Promise<InsuranceListing[]> {
  // 1. Try cache first
  try {
    const cached = await getCache<InsuranceListing[]>(CACHE_KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  } catch {
    // Cache miss or error — fall through to DB
  }

  // 2. Fetch from DB
  const supabase = createClient();

  // Note: insurance table may not exist yet — query will fail gracefully
  const { data, error } = await supabase
    .from("insurance_products")
    .select(
      "id, slug, name, provider_name, type, cover_amount, min_premium, premium_range, claim_settlement_ratio, network_hospitals, rating, description, best_for, features, pros, cons, apply_link, official_link, image_url, is_active, updated_at",
    )
    .eq("is_active", true)
    .order("claim_settlement_ratio", { ascending: false, nullsFirst: false })
    .limit(100);

  if (error) {
    logger.error("SERVER FETCH ERROR: insurance", error);
    return [];
  }

  const result: InsuranceListing[] = (data || []).map((ins: any) => ({
    id: ins.id || ins.slug || "unknown",
    slug: ins.slug,
    name: ins.name,
    provider_name: ins.provider_name || "Unknown Insurer",
    type: ins.type || "Health",
    cover_amount: ins.cover_amount,
    min_premium: ins.min_premium,
    premium_range: ins.premium_range,
    claim_settlement_ratio: ins.claim_settlement_ratio,
    network_hospitals: ins.network_hospitals,
    rating: ins.rating,
    description: ins.description,
    best_for: ins.best_for,
    features: ins.features,
    pros: ins.pros,
    cons: ins.cons,
    apply_link: ins.apply_link,
    official_link: ins.official_link,
    image_url: ins.image_url,
    is_active: ins.is_active ?? true,
    updated_at: ins.updated_at,
  }));

  // 3. Write to cache (fire-and-forget)
  if (result.length > 0) {
    setCache(CACHE_KEY, result, {
      ttl: CACHE_TTL,
      tags: ["insurance"],
    }).catch(() => {});
  }

  return result;
}
