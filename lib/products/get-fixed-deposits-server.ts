import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";
import { getCache, setCache, cacheKey } from "@/lib/cache/redis-client";

const CACHE_KEY = cacheKey("listing", "fixed-deposits");
const CACHE_TTL = 3600; // 1 hour

export interface FixedDepositListing {
  id: string;
  slug: string;
  name: string;
  bank_name: string;
  type: string;
  interest_rate: number | null;
  senior_citizen_rate: number | null;
  min_deposit: number | null;
  max_deposit: number | null;
  tenure_min: string | null;
  tenure_max: string | null;
  rating: number | null;
  is_active: boolean;
  updated_at: string | null;
}

/**
 * Server-Side Fetcher for Fixed Deposits
 * Uses Redis cache-aside pattern: check cache first, fall back to DB.
 */
export async function getFixedDepositsServer(): Promise<FixedDepositListing[]> {
  // 1. Try cache first
  try {
    const cached = await getCache<FixedDepositListing[]>(CACHE_KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  } catch {
    // Cache miss or error — fall through to DB
  }

  // 2. Fetch from DB
  const supabase = createClient();

  const { data, error } = await supabase
    .from("fixed_deposits")
    .select(
      "id, slug, name, bank_name, type, interest_rate, senior_citizen_rate, min_deposit, max_deposit, tenure_min, tenure_max, rating, is_active, updated_at",
    )
    .eq("is_active", true)
    .order("interest_rate", { ascending: false, nullsFirst: false })
    .limit(100);

  if (error) {
    // Table may not exist yet — return empty gracefully
    logger.error("SERVER FETCH ERROR: fixed_deposits", error);
    return [];
  }

  const result: FixedDepositListing[] = (data || []).map((fd: any) => ({
    id: fd.id || fd.slug || "unknown",
    slug: fd.slug,
    name: fd.name,
    bank_name: fd.bank_name || fd.name,
    type: fd.type || "Bank",
    interest_rate: fd.interest_rate,
    senior_citizen_rate: fd.senior_citizen_rate,
    min_deposit: fd.min_deposit,
    max_deposit: fd.max_deposit,
    tenure_min: fd.tenure_min,
    tenure_max: fd.tenure_max,
    rating: fd.rating,
    is_active: fd.is_active ?? true,
    updated_at: fd.updated_at,
  }));

  // 3. Write to cache (fire-and-forget)
  if (result.length > 0) {
    setCache(CACHE_KEY, result, {
      ttl: CACHE_TTL,
      tags: ["fixed-deposits"],
    }).catch(() => {});
  }

  return result;
}
