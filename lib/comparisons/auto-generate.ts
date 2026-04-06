/**
 * Auto-Generate Product Comparisons
 *
 * Takes two product slugs from the same category and generates structured
 * comparison data. Used to programmatically build "vs" comparison pages.
 *
 * Supports: credit_cards, mutual_funds, fixed_deposits, loans
 *
 * Output: structured JSON suitable for rendering comparison tables,
 * winner badges, and SEO-optimized comparison pages.
 */

import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/service";

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ComparisonField {
  label: string;
  slug1Value: string;
  slug2Value: string;
  winner: "slug1" | "slug2" | "tie";
  category:
    | "fees"
    | "rewards"
    | "features"
    | "eligibility"
    | "returns"
    | "general";
}

export interface ComparisonData {
  slug: string; // e.g. "hdfc-regalia-vs-sbi-elite"
  product1: ProductSummary;
  product2: ProductSummary;
  fields: ComparisonField[];
  overallWinner: "product1" | "product2" | "tie";
  winnerReason: string;
  seo: {
    title: string;
    description: string;
    h1: string;
  };
  generatedAt: string;
}

export interface ProductSummary {
  slug: string;
  name: string;
  provider: string;
  category: string;
  rating: number | null;
  imageUrl: string | null;
  applyLink: string | null;
}

// ─── Table Mapping ──────────────────────────────────────────────────────────────

const CATEGORY_TABLE_MAP: Record<string, string> = {
  credit_card: "credit_cards",
  credit_cards: "credit_cards",
  mutual_fund: "mutual_funds",
  mutual_funds: "mutual_funds",
  fixed_deposit: "fixed_deposits",
  fixed_deposits: "fixed_deposits",
  loan: "loans",
  loans: "loans",
};

// ─── Main Generator ─────────────────────────────────────────────────────────────

/**
 * Generate comparison data for two products.
 *
 * @param slug1 - First product slug
 * @param slug2 - Second product slug
 * @param category - Product category (credit_card, mutual_fund, etc.)
 */
export async function generateComparison(
  slug1: string,
  slug2: string,
  category: string = "credit_card",
): Promise<ComparisonData | null> {
  try {
    const tableName = CATEGORY_TABLE_MAP[category];
    if (!tableName) {
      logger.warn(`Unknown category for comparison: ${category}`);
      return null;
    }

    const supabase = createServiceClient();

    // Fetch both products
    const [product1Result, product2Result] = await Promise.all([
      supabase.from(tableName).select("*").eq("slug", slug1).maybeSingle(),
      supabase.from(tableName).select("*").eq("slug", slug2).maybeSingle(),
    ]);

    const p1 = product1Result.data;
    const p2 = product2Result.data;

    if (!p1 || !p2) {
      logger.warn(`Product not found for comparison: ${!p1 ? slug1 : slug2}`);
      return null;
    }

    // Generate comparison based on category
    switch (category) {
      case "credit_card":
      case "credit_cards":
        return generateCreditCardComparison(p1, p2);
      case "mutual_fund":
      case "mutual_funds":
        return generateMutualFundComparison(p1, p2);
      case "fixed_deposit":
      case "fixed_deposits":
        return generateFDComparison(p1, p2);
      default:
        return generateGenericComparison(p1, p2, category);
    }
  } catch (error) {
    logger.error("Error generating comparison", error as Error);
    return null;
  }
}

// ─── Credit Card Comparison ─────────────────────────────────────────────────────

function generateCreditCardComparison(p1: any, p2: any): ComparisonData {
  const fields: ComparisonField[] = [];

  // Annual Fee
  const fee1 = parseNumericFee(p1.annual_fee);
  const fee2 = parseNumericFee(p2.annual_fee);
  fields.push({
    label: "Annual Fee",
    slug1Value: formatFee(p1.annual_fee),
    slug2Value: formatFee(p2.annual_fee),
    winner: fee1 < fee2 ? "slug1" : fee1 > fee2 ? "slug2" : "tie",
    category: "fees",
  });

  // Joining Fee
  fields.push({
    label: "Joining Fee",
    slug1Value: formatFee(p1.joining_fee),
    slug2Value: formatFee(p2.joining_fee),
    winner:
      parseNumericFee(p1.joining_fee) < parseNumericFee(p2.joining_fee)
        ? "slug1"
        : parseNumericFee(p1.joining_fee) > parseNumericFee(p2.joining_fee)
          ? "slug2"
          : "tie",
    category: "fees",
  });

  // Interest Rate
  fields.push({
    label: "Interest Rate (p.a.)",
    slug1Value: p1.interest_rate || "N/A",
    slug2Value: p2.interest_rate || "N/A",
    winner: "tie", // Lower is better but hard to parse, mark as tie
    category: "fees",
  });

  // Rewards
  const rewards1 = Array.isArray(p1.rewards)
    ? p1.rewards.join("; ")
    : p1.rewards || "N/A";
  const rewards2 = Array.isArray(p2.rewards)
    ? p2.rewards.join("; ")
    : p2.rewards || "N/A";
  fields.push({
    label: "Rewards",
    slug1Value: rewards1,
    slug2Value: rewards2,
    winner: "tie",
    category: "rewards",
  });

  // Lounge Access
  const lounge1 = extractFeature(p1, "lounge_access") || "None";
  const lounge2 = extractFeature(p2, "lounge_access") || "None";
  fields.push({
    label: "Lounge Access",
    slug1Value: lounge1,
    slug2Value: lounge2,
    winner:
      lounge1 !== "None" && lounge2 === "None"
        ? "slug1"
        : lounge2 !== "None" && lounge1 === "None"
          ? "slug2"
          : "tie",
    category: "features",
  });

  // Fuel Surcharge
  fields.push({
    label: "Fuel Surcharge Waiver",
    slug1Value:
      extractFeature(p1, "fuel_surcharge_waiver") === "true" ? "Yes" : "No",
    slug2Value:
      extractFeature(p2, "fuel_surcharge_waiver") === "true" ? "Yes" : "No",
    winner: "tie",
    category: "features",
  });

  // Rating
  const rating1 = p1.rating || 0;
  const rating2 = p2.rating || 0;
  fields.push({
    label: "Rating",
    slug1Value: rating1 ? `${rating1}/5` : "N/A",
    slug2Value: rating2 ? `${rating2}/5` : "N/A",
    winner: rating1 > rating2 ? "slug1" : rating2 > rating1 ? "slug2" : "tie",
    category: "general",
  });

  // Determine overall winner
  const slug1Wins = fields.filter((f) => f.winner === "slug1").length;
  const slug2Wins = fields.filter((f) => f.winner === "slug2").length;
  const overallWinner =
    slug1Wins > slug2Wins
      ? ("product1" as const)
      : slug2Wins > slug1Wins
        ? ("product2" as const)
        : ("tie" as const);

  const winnerName =
    overallWinner === "product1"
      ? p1.name
      : overallWinner === "product2"
        ? p2.name
        : "Both cards";

  return {
    slug: `${p1.slug}-vs-${p2.slug}`,
    product1: toSummary(p1),
    product2: toSummary(p2),
    fields,
    overallWinner,
    winnerReason:
      overallWinner === "tie"
        ? `${p1.name} and ${p2.name} are closely matched — pick based on your spending.`
        : `${winnerName} wins in ${overallWinner === "product1" ? slug1Wins : slug2Wins} out of ${fields.length} categories.`,
    seo: {
      title: `${p1.name} vs ${p2.name} — Which Card is Better? (2026)`,
      description: `Detailed comparison of ${p1.name} vs ${p2.name}. Compare fees, rewards, lounge access, and more. Find out which credit card is better for you.`,
      h1: `${p1.name} vs ${p2.name}`,
    },
    generatedAt: new Date().toISOString(),
  };
}

// ─── Mutual Fund Comparison ─────────────────────────────────────────────────────

function generateMutualFundComparison(p1: any, p2: any): ComparisonData {
  const fields: ComparisonField[] = [];

  // NAV
  fields.push({
    label: "Current NAV",
    slug1Value: p1.nav ? `₹${p1.nav}` : "N/A",
    slug2Value: p2.nav ? `₹${p2.nav}` : "N/A",
    winner: "tie",
    category: "general",
  });

  // Category
  fields.push({
    label: "Category",
    slug1Value: p1.category || p1.scheme_category || "N/A",
    slug2Value: p2.category || p2.scheme_category || "N/A",
    winner: "tie",
    category: "general",
  });

  // 1Y Return
  const ret1y1 = p1.returns_1y ?? p1.return_1y ?? null;
  const ret1y2 = p2.returns_1y ?? p2.return_1y ?? null;
  fields.push({
    label: "1 Year Return",
    slug1Value: ret1y1 !== null ? `${ret1y1}%` : "N/A",
    slug2Value: ret1y2 !== null ? `${ret1y2}%` : "N/A",
    winner:
      ret1y1 !== null && ret1y2 !== null
        ? ret1y1 > ret1y2
          ? "slug1"
          : ret1y2 > ret1y1
            ? "slug2"
            : "tie"
        : "tie",
    category: "returns",
  });

  // 3Y Return
  const ret3y1 = p1.returns_3y ?? p1.return_3y ?? null;
  const ret3y2 = p2.returns_3y ?? p2.return_3y ?? null;
  fields.push({
    label: "3 Year Return",
    slug1Value: ret3y1 !== null ? `${ret3y1}%` : "N/A",
    slug2Value: ret3y2 !== null ? `${ret3y2}%` : "N/A",
    winner:
      ret3y1 !== null && ret3y2 !== null
        ? ret3y1 > ret3y2
          ? "slug1"
          : ret3y2 > ret3y1
            ? "slug2"
            : "tie"
        : "tie",
    category: "returns",
  });

  // Expense Ratio
  const exp1 = p1.expense_ratio ?? null;
  const exp2 = p2.expense_ratio ?? null;
  fields.push({
    label: "Expense Ratio",
    slug1Value: exp1 !== null ? `${exp1}%` : "N/A",
    slug2Value: exp2 !== null ? `${exp2}%` : "N/A",
    winner:
      exp1 !== null && exp2 !== null
        ? exp1 < exp2
          ? "slug1"
          : exp2 < exp1
            ? "slug2"
            : "tie"
        : "tie",
    category: "fees",
  });

  // AUM
  fields.push({
    label: "AUM",
    slug1Value: p1.aum ? `₹${formatAUM(p1.aum)} Cr` : "N/A",
    slug2Value: p2.aum ? `₹${formatAUM(p2.aum)} Cr` : "N/A",
    winner: "tie",
    category: "general",
  });

  // Min SIP
  fields.push({
    label: "Min SIP",
    slug1Value: p1.min_sip ? `₹${p1.min_sip}` : "₹500",
    slug2Value: p2.min_sip ? `₹${p2.min_sip}` : "₹500",
    winner: "tie",
    category: "eligibility",
  });

  const slug1Wins = fields.filter((f) => f.winner === "slug1").length;
  const slug2Wins = fields.filter((f) => f.winner === "slug2").length;
  const overallWinner =
    slug1Wins > slug2Wins
      ? ("product1" as const)
      : slug2Wins > slug1Wins
        ? ("product2" as const)
        : ("tie" as const);

  return {
    slug: `${p1.slug}-vs-${p2.slug}`,
    product1: toSummary(p1),
    product2: toSummary(p2),
    fields,
    overallWinner,
    winnerReason:
      overallWinner === "tie"
        ? `Both funds perform similarly. Consider your risk appetite and investment horizon.`
        : `${overallWinner === "product1" ? p1.name : p2.name} has stronger performance metrics.`,
    seo: {
      title: `${p1.name} vs ${p2.name} — Fund Comparison (2026)`,
      description: `Compare ${p1.name} vs ${p2.name}. Returns, expense ratio, AUM, and more. Find the better mutual fund for your portfolio.`,
      h1: `${p1.name} vs ${p2.name}`,
    },
    generatedAt: new Date().toISOString(),
  };
}

// ─── FD Comparison ──────────────────────────────────────────────────────────────

function generateFDComparison(p1: any, p2: any): ComparisonData {
  const fields: ComparisonField[] = [];

  // Interest Rate
  const rate1 = p1.interest_rate ?? p1.rate ?? null;
  const rate2 = p2.interest_rate ?? p2.rate ?? null;
  fields.push({
    label: "Interest Rate",
    slug1Value: rate1 !== null ? `${rate1}%` : "N/A",
    slug2Value: rate2 !== null ? `${rate2}%` : "N/A",
    winner:
      rate1 !== null && rate2 !== null
        ? rate1 > rate2
          ? "slug1"
          : rate2 > rate1
            ? "slug2"
            : "tie"
        : "tie",
    category: "returns",
  });

  // Senior Citizen Rate
  const sr1 = p1.senior_citizen_rate ?? null;
  const sr2 = p2.senior_citizen_rate ?? null;
  fields.push({
    label: "Senior Citizen Rate",
    slug1Value: sr1 !== null ? `${sr1}%` : "N/A",
    slug2Value: sr2 !== null ? `${sr2}%` : "N/A",
    winner:
      sr1 !== null && sr2 !== null
        ? sr1 > sr2
          ? "slug1"
          : sr2 > sr1
            ? "slug2"
            : "tie"
        : "tie",
    category: "returns",
  });

  // Min Deposit
  const min1 = p1.min_deposit ?? null;
  const min2 = p2.min_deposit ?? null;
  fields.push({
    label: "Minimum Deposit",
    slug1Value: min1 !== null ? `₹${min1.toLocaleString("en-IN")}` : "N/A",
    slug2Value: min2 !== null ? `₹${min2.toLocaleString("en-IN")}` : "N/A",
    winner:
      min1 !== null && min2 !== null
        ? min1 < min2
          ? "slug1"
          : min2 < min1
            ? "slug2"
            : "tie"
        : "tie",
    category: "eligibility",
  });

  // Tenure
  fields.push({
    label: "Tenure Range",
    slug1Value: formatTenure(p1),
    slug2Value: formatTenure(p2),
    winner: "tie",
    category: "features",
  });

  // Bank/Provider
  fields.push({
    label: "Bank",
    slug1Value: p1.bank_name || p1.provider_name || "N/A",
    slug2Value: p2.bank_name || p2.provider_name || "N/A",
    winner: "tie",
    category: "general",
  });

  const slug1Wins = fields.filter((f) => f.winner === "slug1").length;
  const slug2Wins = fields.filter((f) => f.winner === "slug2").length;
  const overallWinner =
    slug1Wins > slug2Wins
      ? ("product1" as const)
      : slug2Wins > slug1Wins
        ? ("product2" as const)
        : ("tie" as const);

  return {
    slug: `${p1.slug}-vs-${p2.slug}`,
    product1: toSummary(p1),
    product2: toSummary(p2),
    fields,
    overallWinner,
    winnerReason:
      overallWinner === "tie"
        ? `Both FDs offer competitive rates. Choose based on your tenure and deposit amount.`
        : `${overallWinner === "product1" ? p1.name : p2.name} offers better rates overall.`,
    seo: {
      title: `${p1.name} vs ${p2.name} FD — Rate Comparison (2026)`,
      description: `Compare ${p1.name} vs ${p2.name} fixed deposit rates. Interest rates, tenure, senior citizen rates, and more.`,
      h1: `${p1.name} vs ${p2.name} FD Comparison`,
    },
    generatedAt: new Date().toISOString(),
  };
}

// ─── Generic Comparison ─────────────────────────────────────────────────────────

function generateGenericComparison(
  p1: any,
  p2: any,
  category: string,
): ComparisonData {
  const fields: ComparisonField[] = [];

  // Extract common fields dynamically
  const commonKeys = Object.keys(p1).filter(
    (k) =>
      k in p2 &&
      !["id", "slug", "created_at", "updated_at", "image_url"].includes(k),
  );

  for (const key of commonKeys.slice(0, 10)) {
    const v1 = p1[key];
    const v2 = p2[key];
    if (v1 == null && v2 == null) continue;

    fields.push({
      label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      slug1Value: String(v1 ?? "N/A"),
      slug2Value: String(v2 ?? "N/A"),
      winner: "tie",
      category: "general",
    });
  }

  return {
    slug: `${p1.slug}-vs-${p2.slug}`,
    product1: toSummary(p1),
    product2: toSummary(p2),
    fields,
    overallWinner: "tie",
    winnerReason: `Both products have their strengths. Compare the details to choose the best fit.`,
    seo: {
      title: `${p1.name} vs ${p2.name} — Comparison (2026)`,
      description: `Detailed comparison of ${p1.name} vs ${p2.name}. Compare features, rates, and more.`,
      h1: `${p1.name} vs ${p2.name}`,
    },
    generatedAt: new Date().toISOString(),
  };
}

// ─── Generate Top Comparison Pairs ──────────────────────────────────────────────

/**
 * Auto-generate comparison pairs from top products in a category.
 * Pairs the top N products by rating/popularity.
 */
export async function generateTopComparisonPairs(
  category: string = "credit_card",
  limit: number = 10,
): Promise<string[]> {
  try {
    const tableName = CATEGORY_TABLE_MAP[category];
    if (!tableName) return [];

    const supabase = createServiceClient();
    const { data } = await supabase
      .from(tableName)
      .select("slug, name, rating")
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (!data || data.length < 2) return [];

    // Generate all unique pairs
    const pairs: string[] = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        pairs.push(`${data[i].slug}-vs-${data[j].slug}`);
      }
    }

    return pairs;
  } catch (error) {
    logger.error("Error generating comparison pairs", error as Error);
    return [];
  }
}

// ─── API: Comparison Endpoint ───────────────────────────────────────────────────

/**
 * Store generated comparison data in DB for caching / SEO pre-generation.
 */
export async function storeComparison(
  comparison: ComparisonData,
): Promise<boolean> {
  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("product_comparisons").upsert(
      {
        slug: comparison.slug,
        product1_slug: comparison.product1.slug,
        product2_slug: comparison.product2.slug,
        category: comparison.product1.category,
        comparison_data: comparison,
        seo_title: comparison.seo.title,
        seo_description: comparison.seo.description,
        overall_winner: comparison.overallWinner,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    );

    if (error) {
      logger.error("Failed to store comparison", error);
      return false;
    }
    return true;
  } catch (error) {
    logger.error("Error storing comparison", error as Error);
    return false;
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function toSummary(p: any): ProductSummary {
  return {
    slug: p.slug,
    name: p.name,
    provider: p.bank || p.bank_name || p.provider_name || p.amc_name || "",
    category: p.type || p.category || "",
    rating: p.rating ?? null,
    imageUrl: p.image_url ?? null,
    applyLink: p.apply_link ?? p.official_link ?? null,
  };
}

function parseNumericFee(fee: any): number {
  if (fee === null || fee === undefined) return 0;
  if (typeof fee === "number") return fee;
  const str = String(fee).toLowerCase();
  if (str.includes("free") || str === "0" || str === "nil") return 0;
  const match = str.match(/([\d,]+)/);
  return match ? parseInt(match[1].replace(/,/g, ""), 10) : 999999;
}

function formatFee(fee: any): string {
  if (fee === null || fee === undefined) return "N/A";
  if (typeof fee === "number")
    return fee === 0 ? "Free" : `₹${fee.toLocaleString("en-IN")}`;
  const str = String(fee);
  return str || "N/A";
}

function extractFeature(product: any, key: string): string {
  if (product.features && typeof product.features === "object") {
    return String(product.features[key] ?? "");
  }
  return String(product[key] ?? "");
}

function formatAUM(aum: number): string {
  if (aum >= 10000) return (aum / 10000).toFixed(0) + "L";
  return aum.toFixed(0);
}

function formatTenure(p: any): string {
  const min = p.tenure_min || p.min_tenure || "";
  const max = p.tenure_max || p.max_tenure || "";
  if (min && max) return `${min} — ${max}`;
  if (min) return `From ${min}`;
  if (max) return `Up to ${max}`;
  return "Varies";
}
