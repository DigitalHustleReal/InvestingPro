import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";
import { RichProduct } from "@/types/rich-product";
import { getCache, setCache, cacheKey } from "@/lib/cache/redis-client";

const CACHE_KEY = cacheKey("listing", "loans");
const CACHE_TTL = 3600; // 1 hour

/**
 * Server-Side Fetcher for Loans
 * Uses Redis cache-aside pattern: check cache first, fall back to DB.
 */
export async function getLoansServer(): Promise<RichProduct[]> {
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
    .from("loans")
    .select(
      "id, slug, name, bank_name, image_url, description, rating, best_for, type, features, pros, cons, apply_link, affiliate_link, official_link, updated_at, interest_rate_min, interest_rate_max, max_tenure_months, max_amount, processing_fee, metadata",
    )
    .limit(200);

  if (error) {
    logger.error("SERVER FETCH ERROR: loans", error);
    return [];
  }

  // Map to RichProduct format
  const result: RichProduct[] = (data || []).map((loan: any) => ({
    id: loan.id || loan.slug || "unknown",
    slug: loan.slug,
    name: loan.name,
    category: "loan",
    provider: loan.bank_name,
    provider_name: loan.bank_name,
    image_url: loan.image_url,
    description: loan.description || "",
    rating: {
      overall: Number(loan.rating) || 4.2,
      trust_score: 90,
      breakdown: {},
    },
    bestFor: loan.best_for,
    specs: {
      type: loan.type || loan.metadata?.type || "Personal Loan",
    },
    key_features: loan.features
      ? Object.entries(loan.features).map(([k, v]) => ({
          label: k,
          value: String(v),
        }))
      : [],
    features: loan.features || {},
    pros: loan.pros || [],
    cons: loan.cons || [],
    is_verified: true,
    updated_at: loan.updated_at || new Date().toISOString(),
    affiliate_link: loan.apply_link || loan.affiliate_link || "#",
    official_link: loan.official_link,
    metadata: {
      type: loan.type || "Personal Loan",
      interest_rate_min: loan.interest_rate_min,
      interest_rate_max: loan.interest_rate_max,
      max_tenure_months: loan.max_tenure_months,
      max_amount: loan.max_amount,
      processing_fee: loan.processing_fee,
    },
  }));

  // 3. Write to cache (fire-and-forget, don't block render)
  if (result.length > 0) {
    setCache(CACHE_KEY, result, { ttl: CACHE_TTL, tags: ["loans"] }).catch(
      () => {},
    );
  }

  return result;
}
