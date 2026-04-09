import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";
import { RichProduct } from "@/types/rich-product";
import { getCache, setCache, cacheKey } from "@/lib/cache/redis-client";

const CACHE_KEY = cacheKey("listing", "credit-cards");
const CACHE_TTL = 3600; // 1 hour

/**
 * Server-Side Fetcher for Credit Cards
 * Uses Redis cache-aside pattern: check cache first, fall back to DB.
 */
export async function getCreditCardsServer(): Promise<RichProduct[]> {
  // 1. Try cache first
  try {
    const cached = await getCache<RichProduct[]>(CACHE_KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  } catch {
    // Cache miss or error — fall through to DB
  }

  // 2. Fetch from DB
  const supabase = createClient();

  // Select only columns used by the mapping below + limit to 200
  const { data, error } = await supabase
    .from("credit_cards")
    .select(
      "id, slug, name, bank, image_url, description, rating, type, features, pros, cons, apply_link, updated_at, annual_fee, joining_fee, reward_rate, reward_type, min_income",
    )
    .limit(200);

  if (error) {
    logger.error("SERVER FETCH ERROR: credit_cards", {
      message: error.message,
      code: error.code,
    });
    return [];
  }

  // Map to RichProduct (columns matched to actual DB schema)
  const result: RichProduct[] = (data || []).map((card: any) => ({
    id: card.id || card.slug || "unknown",
    slug: card.slug,
    name: card.name,
    category: "credit_card",
    provider: card.bank,
    provider_name: card.bank,
    image_url: card.image_url,
    description: card.description || "",
    rating: {
      overall: Number(card.rating) || 4.5,
      trust_score: 85,
      breakdown: {},
    },
    reviewsCount: 0,
    applyLink: card.apply_link || "#",

    // Spec Data
    bestFor: card.type || "General",
    specs: {
      type: card.type || "Credit",
      annual_fee: card.annual_fee,
      joining_fee: card.joining_fee,
    },

    // Arrays
    features: card.features || {},
    key_features: card.pros
      ? card.pros.map((p: string) => ({ label: "Pro", value: p })).slice(0, 3)
      : [],
    pros: card.pros || [],
    cons: card.cons || [],

    is_verified: true,
    updated_at: card.updated_at,
    affiliate_link: card.apply_link,
  }));

  // 3. Write to cache (fire-and-forget, don't block render)
  if (result.length > 0) {
    setCache(CACHE_KEY, result, {
      ttl: CACHE_TTL,
      tags: ["credit-cards"],
    }).catch(() => {});
  }

  return result;
}
