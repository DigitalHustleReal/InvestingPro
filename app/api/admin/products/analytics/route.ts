import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

/**
 * GET /api/admin/products/analytics
 * Returns analytics data for all products including clicks, revenue, and affiliate status
 */
export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    const supabase = await createClient();

    // Fetch all products from all category tables
    const [loans, creditCards, mutualFunds, brokers, fixedDeposits] =
      await Promise.all([
        supabase.from("loans").select("*"),
        supabase.from("credit_cards").select("*"),
        supabase.from("mutual_funds").select("*"),
        supabase.from("brokers").select("*"),
        supabase.from("fixed_deposits").select("*"),
      ]);

    // Transform and combine data
    const products = [
      ...(loans.data || []).map((p: any) => transformProduct(p, "loan")),
      ...(creditCards.data || []).map((p: any) =>
        transformProduct(p, "credit-card"),
      ),
      ...(mutualFunds.data || []).map((p: any) =>
        transformProduct(p, "mutual-fund"),
      ),
      ...(brokers.data || []).map((p: any) =>
        transformProduct(p, "demat-account"),
      ),
      ...(fixedDeposits.data || []).map((p: any) =>
        transformProduct(p, "fixed-deposit"),
      ),
    ];

    return NextResponse.json(products);
  } catch (error: any) {
    logger.error("Error fetching product analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch product analytics" },
      { status: 500 },
    );
  }
}

function transformProduct(product: any, category: string) {
  // Extract affiliate link
  const hasAffiliateLink = !!(product.affiliate_link || product.apply_link);

  // Real analytics not yet wired (analytics_events table currently
  // orphan-writer-pending per 2026-04-26 audit). Return zeros instead
  // of Math.random() fake values — admin dashboard renders empty-state.
  const views = 0;
  const clicks = 0;
  const affiliateIncome = 0;

  return {
    id: product.id,
    name: product.name,
    category: category,
    provider:
      product.provider_name ||
      product.provider ||
      product.bank ||
      product.bank_name ||
      product.fund_house ||
      "Unknown",
    clicks: clicks,
    views: views,
    hasAffiliateLink: hasAffiliateLink,
    affiliateIncome: affiliateIncome,
    conversionRate: views > 0 ? (clicks / views) * 100 : 0,
    lastUpdated:
      product.updated_at || product.created_at || new Date().toISOString(),
  };
}
