/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  WATCHLIST & SAVED PORTFOLIOS SERVICE                           ║
 * ║                                                                  ║
 * ║  Users save products to compare later and build portfolios.     ║
 * ║  This creates SWITCHING COSTS — users with saved watchlists     ║
 * ║  and portfolios are 4x less likely to switch to a competitor.   ║
 * ║                                                                  ║
 * ║  Also feeds the recommendation engine with strong intent data:  ║
 * ║  "User saved 3 mutual funds → they're ready to invest"          ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/client";

export interface WatchlistItem {
  id?: string;
  user_id: string;
  product_id: string;
  product_name?: string;
  category?: string;
  note?: string;
  comparison_group_id?: string; // group related products
  added_at?: string;
}

export interface SavedPortfolio {
  id?: string;
  user_id: string;
  name: string;
  description?: string;
  portfolio_items: PortfolioItem[];
  total_monthly_investment?: number;
  risk_level: "conservative" | "moderate" | "aggressive";
  goal?: string;
  goal_amount?: number;
  goal_timeline_years?: number;
  is_public?: boolean; // can be shared via link
  share_token?: string; // unique token for sharing
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioItem {
  product_id: string;
  product_name: string;
  category: string;
  weight_pct: number; // % of total portfolio allocation
  monthly_amount?: number; // ₹ per month for SIPs
  purpose?: string; // "emergency fund", "retirement core", etc.
}

// ─── Watchlist CRUD ───────────────────────────────────────────────────────────

export async function addToWatchlist(
  item: WatchlistItem,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createClient();

  // Check for duplicate
  const { data: existing } = await supabase
    .from("product_watchlists")
    .select("id")
    .eq("user_id", item.user_id)
    .eq("product_id", item.product_id)
    .single();

  if (existing) {
    return { success: false, error: "Product already in watchlist" };
  }

  const { data, error } = await supabase
    .from("product_watchlists")
    .insert({
      user_id: item.user_id,
      product_id: item.product_id,
      note: item.note,
      comparison_group_id: item.comparison_group_id,
      added_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, id: data?.id };
}

export async function removeFromWatchlist(
  user_id: string,
  product_id: string,
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("product_watchlists")
    .delete()
    .eq("user_id", user_id)
    .eq("product_id", product_id);

  return !error;
}

export async function getUserWatchlist(
  user_id: string,
): Promise<WatchlistItem[]> {
  const supabase = createClient();

  const { data } = await supabase
    .from("product_watchlists")
    .select(
      `
      id,
      product_id,
      note,
      comparison_group_id,
      added_at,
      products (
        name,
        category,
        provider
      )
    `,
    )
    .eq("user_id", user_id)
    .order("added_at", { ascending: false });

  if (!data) return [];

  return data.map((item: any) => ({
    id: item.id,
    user_id,
    product_id: item.product_id,
    product_name: item.products?.name,
    category: item.products?.category,
    note: item.note,
    comparison_group_id: item.comparison_group_id,
    added_at: item.added_at,
  }));
}

export async function updateWatchlistNote(
  user_id: string,
  product_id: string,
  note: string,
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("product_watchlists")
    .update({ note })
    .eq("user_id", user_id)
    .eq("product_id", product_id);

  return !error;
}

// ─── Portfolio CRUD ───────────────────────────────────────────────────────────

export async function createPortfolio(
  portfolio: SavedPortfolio,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createClient();

  const total_weight = portfolio.portfolio_items.reduce(
    (sum, i) => sum + i.weight_pct,
    0,
  );
  if (Math.abs(total_weight - 100) > 0.5) {
    return {
      success: false,
      error: `Portfolio weights must sum to 100% (got ${total_weight}%)`,
    };
  }

  const share_token = portfolio.is_public ? generateShareToken() : undefined;

  const { data, error } = await supabase
    .from("saved_portfolios")
    .insert({
      user_id: portfolio.user_id,
      name: portfolio.name,
      description: portfolio.description,
      portfolio_items: portfolio.portfolio_items,
      total_monthly_investment: portfolio.total_monthly_investment,
      risk_level: portfolio.risk_level,
      goal: portfolio.goal,
      goal_amount: portfolio.goal_amount,
      goal_timeline_years: portfolio.goal_timeline_years,
      is_public: portfolio.is_public ?? false,
      share_token,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, id: data?.id };
}

export async function getUserPortfolios(
  user_id: string,
): Promise<SavedPortfolio[]> {
  const supabase = createClient();

  const { data } = await supabase
    .from("saved_portfolios")
    .select(
      "id, user_id, name, description, portfolio_items, total_monthly_investment, risk_level, goal, goal_amount, goal_timeline_years, is_public, share_token, created_at, updated_at",
    )
    .eq("user_id", user_id)
    .order("updated_at", { ascending: false })
    .limit(50);

  return (data as SavedPortfolio[]) ?? [];
}

export async function getPortfolioByShareToken(
  token: string,
): Promise<SavedPortfolio | null> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("saved_portfolios")
    .select(
      "id, user_id, name, description, portfolio_items, total_monthly_investment, risk_level, goal, goal_amount, goal_timeline_years, is_public, share_token, created_at, updated_at",
    )
    .eq("share_token", token)
    .eq("is_public", true)
    .single();

  return data as SavedPortfolio | null;
}

export async function updatePortfolio(
  id: string,
  user_id: string,
  updates: Partial<SavedPortfolio>,
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("saved_portfolios")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user_id);

  return !error;
}

export async function deletePortfolio(
  id: string,
  user_id: string,
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("saved_portfolios")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  return !error;
}

// ─── Portfolio analytics ──────────────────────────────────────────────────────

export interface PortfolioAnalysis {
  total_monthly_investment: number;
  estimated_annual_return_pct: number;
  projected_corpus_10y: number;
  projected_corpus_20y: number;
  risk_breakdown: { low: number; moderate: number; high: number };
  category_breakdown: Record<string, number>;
  diversification_score: number; // 0-100
  recommendations: string[];
}

export function analyzePortfolio(
  portfolio: SavedPortfolio,
  products: Array<{
    id: string;
    returns_3y?: number;
    risk_level?: string;
    category?: string;
  }>,
): PortfolioAnalysis {
  const items = portfolio.portfolio_items;
  const total_monthly = portfolio.total_monthly_investment ?? 0;

  let weighted_return = 0;
  const risk_breakdown = { low: 0, moderate: 0, high: 0 };
  const category_breakdown: Record<string, number> = {};

  for (const item of items) {
    const product = products.find((p) => p.id === item.product_id);
    const return_rate = product?.returns_3y ?? 10; // default 10%
    weighted_return += return_rate * (item.weight_pct / 100);

    const risk = product?.risk_level ?? "moderate";
    if (risk === "low") risk_breakdown.low += item.weight_pct;
    else if (risk === "high" || risk === "very_high")
      risk_breakdown.high += item.weight_pct;
    else risk_breakdown.moderate += item.weight_pct;

    const cat = product?.category ?? item.category;
    category_breakdown[cat] = (category_breakdown[cat] ?? 0) + item.weight_pct;
  }

  // Compound interest: SIP future value
  const r = weighted_return / 100 / 12; // monthly rate
  const corpus = (n: number) =>
    total_monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

  const categories = Object.keys(category_breakdown).length;
  const diversification_score = Math.min(
    100,
    categories * 20 +
      (risk_breakdown.moderate > 30 && risk_breakdown.moderate < 70 ? 20 : 0) +
      (risk_breakdown.high < 60 ? 10 : 0),
  );

  const recommendations: string[] = [];
  if (risk_breakdown.high > 70)
    recommendations.push("Consider adding debt funds for stability");
  if (categories < 2)
    recommendations.push("Diversify across more asset classes");
  if (!items.some((i) => i.category === "insurance"))
    recommendations.push("Add term insurance to protect this portfolio");

  return {
    total_monthly_investment: total_monthly,
    estimated_annual_return_pct: Math.round(weighted_return * 10) / 10,
    projected_corpus_10y: Math.round(corpus(120)), // 120 months
    projected_corpus_20y: Math.round(corpus(240)),
    risk_breakdown,
    category_breakdown,
    diversification_score,
    recommendations,
  };
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function generateShareToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
