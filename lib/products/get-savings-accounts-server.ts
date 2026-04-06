import { createClient } from "@/lib/supabase/static";
import { logger } from "@/lib/logger";
import { getCache, setCache, cacheKey } from "@/lib/cache/redis-client";

const CACHE_KEY = cacheKey("listing", "savings-accounts");
const CACHE_TTL = 3600; // 1 hour

export interface SavingsAccountListing {
  id: string;
  slug: string;
  name: string;
  bank_name: string;
  type: string;
  interest_rate: number | null;
  min_balance: number | null;
  monthly_free_atm: number | null;
  free_neft_rtgs: boolean;
  debit_card_type: string | null;
  mobile_banking: boolean;
  upi_support: boolean;
  description: string | null;
  best_for: string | null;
  features: Record<string, any> | null;
  pros: string[] | null;
  cons: string[] | null;
  rating: number | null;
  apply_link: string | null;
  official_link: string | null;
  image_url: string | null;
  is_active: boolean;
  updated_at: string | null;
}

/**
 * Server-Side Fetcher for Savings Accounts
 * Uses Redis cache-aside pattern: check cache first, fall back to DB.
 */
export async function getSavingsAccountsServer(): Promise<
  SavingsAccountListing[]
> {
  // 1. Try cache first
  try {
    const cached = await getCache<SavingsAccountListing[]>(CACHE_KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  } catch {
    // Cache miss or error — fall through to DB
  }

  // 2. Fetch from DB
  const supabase = createClient();

  const { data, error } = await supabase
    .from("savings_accounts")
    .select(
      "id, slug, name, bank_name, type, interest_rate, min_balance, monthly_free_atm, free_neft_rtgs, debit_card_type, mobile_banking, upi_support, description, best_for, features, pros, cons, rating, apply_link, official_link, image_url, is_active, updated_at",
    )
    .eq("is_active", true)
    .order("interest_rate", { ascending: false, nullsFirst: false })
    .limit(100);

  if (error) {
    logger.error("SERVER FETCH ERROR: savings_accounts", error);
    return [];
  }

  const result: SavingsAccountListing[] = (data || []).map((sa: any) => ({
    id: sa.id || sa.slug || "unknown",
    slug: sa.slug,
    name: sa.name,
    bank_name: sa.bank_name || sa.name,
    type: sa.type || "Regular",
    interest_rate: sa.interest_rate,
    min_balance: sa.min_balance,
    monthly_free_atm: sa.monthly_free_atm,
    free_neft_rtgs: sa.free_neft_rtgs ?? true,
    debit_card_type: sa.debit_card_type,
    mobile_banking: sa.mobile_banking ?? true,
    upi_support: sa.upi_support ?? true,
    description: sa.description,
    best_for: sa.best_for,
    features: sa.features,
    pros: sa.pros,
    cons: sa.cons,
    rating: sa.rating,
    apply_link: sa.apply_link,
    official_link: sa.official_link,
    image_url: sa.image_url,
    is_active: sa.is_active ?? true,
    updated_at: sa.updated_at,
  }));

  // 3. Write to cache (fire-and-forget)
  if (result.length > 0) {
    setCache(CACHE_KEY, result, {
      ttl: CACHE_TTL,
      tags: ["savings-accounts"],
    }).catch(() => {});
  }

  return result;
}
