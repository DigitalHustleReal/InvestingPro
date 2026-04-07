/**
 * Automatic Article Interlinking System
 *
 * Generates a set of internal links (related articles, calculators,
 * product pages, glossary terms) for any article based on its category.
 */

import { createClient } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InterLinkSet {
  relatedArticles: { title: string; slug: string; anchor: string }[];
  calculatorLinks: { name: string; path: string; context: string }[];
  productPageLinks: { name: string; path: string; category: string }[];
  glossaryLinks: { term: string; slug: string }[];
}

// ---------------------------------------------------------------------------
// Category → Calculator mapping
// Re-uses the established relationships from the linking engine / RelatedCalculators
// ---------------------------------------------------------------------------

const CALC_MAP: Record<
  string,
  { name: string; path: string; context: string }[]
> = {
  "credit-cards": [
    {
      name: "Credit Card Rewards Calculator",
      path: "/calculators/credit-card-rewards",
      context: "See how much you can earn in rewards",
    },
    {
      name: "Credit Card Payoff Calculator",
      path: "/calculators/credit-card-payoff",
      context: "Plan your credit card debt payoff strategy",
    },
    {
      name: "EMI Calculator",
      path: "/calculators/emi",
      context: "Convert outstanding balance to EMI",
    },
  ],
  loans: [
    {
      name: "EMI Calculator",
      path: "/calculators/emi",
      context: "Calculate your monthly loan EMI",
    },
    {
      name: "Loan Eligibility Calculator",
      path: "/calculators/loan-eligibility",
      context: "Check how much you can borrow",
    },
    {
      name: "Tax Savings Calculator",
      path: "/calculators/tax",
      context: "Estimate tax benefits on your loan",
    },
  ],
  banking: [
    {
      name: "FD Calculator",
      path: "/calculators/fd",
      context: "Calculate fixed deposit maturity amount",
    },
    {
      name: "RD Calculator",
      path: "/calculators/rd",
      context: "Plan recurring deposit returns",
    },
    {
      name: "Tax Savings Calculator",
      path: "/calculators/tax",
      context: "Find tax-saving deposit options",
    },
  ],
  investing: [
    {
      name: "SIP Calculator",
      path: "/calculators/sip",
      context: "Plan your systematic investment",
    },
    {
      name: "Lumpsum Calculator",
      path: "/calculators/lumpsum",
      context: "Calculate one-time investment returns",
    },
    {
      name: "Retirement Calculator",
      path: "/calculators/retirement",
      context: "Plan for a secure retirement",
    },
  ],
  "mutual-funds": [
    {
      name: "SIP Calculator",
      path: "/calculators/sip",
      context: "Plan your SIP investments",
    },
    {
      name: "Lumpsum Calculator",
      path: "/calculators/lumpsum",
      context: "Compare lumpsum vs SIP returns",
    },
    {
      name: "ELSS Calculator",
      path: "/calculators/elss",
      context: "Tax-saving ELSS fund returns",
    },
  ],
  insurance: [
    {
      name: "Tax Savings Calculator",
      path: "/calculators/tax",
      context: "Check Section 80C / 80D benefits",
    },
    {
      name: "Retirement Calculator",
      path: "/calculators/retirement",
      context: "Ensure adequate life coverage for retirement",
    },
  ],
  "personal-finance": [
    {
      name: "Retirement Calculator",
      path: "/calculators/retirement",
      context: "See if you are on track for retirement",
    },
    {
      name: "SIP Calculator",
      path: "/calculators/sip",
      context: "Start building wealth with SIPs",
    },
    {
      name: "EMI Calculator",
      path: "/calculators/emi",
      context: "Plan your loan repayments",
    },
  ],
  taxes: [
    {
      name: "Tax Savings Calculator",
      path: "/calculators/tax",
      context: "Maximize your tax deductions",
    },
    {
      name: "HRA Calculator",
      path: "/calculators/hra",
      context: "Calculate your HRA tax exemption",
    },
  ],
  "small-business": [
    {
      name: "GST Calculator",
      path: "/calculators/gst",
      context: "Calculate GST on goods and services",
    },
    {
      name: "EMI Calculator",
      path: "/calculators/emi",
      context: "Plan business loan repayments",
    },
  ],
  "demat-accounts": [
    {
      name: "SIP Calculator",
      path: "/calculators/sip",
      context: "Start investing via your demat account",
    },
    {
      name: "Lumpsum Calculator",
      path: "/calculators/lumpsum",
      context: "Estimate equity investment returns",
    },
  ],
  "fixed-deposits": [
    {
      name: "FD Calculator",
      path: "/calculators/fd",
      context: "Calculate FD maturity amount and interest",
    },
    {
      name: "Tax Savings Calculator",
      path: "/calculators/tax",
      context: "Check tax on FD interest income",
    },
  ],
};

// Category → related categories (for broader article suggestions)
const RELATED_CATEGORIES: Record<string, string[]> = {
  "credit-cards": ["loans", "personal-finance", "banking"],
  loans: ["credit-cards", "banking", "personal-finance"],
  banking: ["loans", "investing", "fixed-deposits"],
  investing: ["mutual-funds", "demat-accounts", "personal-finance"],
  "mutual-funds": ["investing", "demat-accounts", "taxes"],
  insurance: ["personal-finance", "investing", "taxes"],
  "personal-finance": ["investing", "insurance", "taxes"],
  taxes: ["personal-finance", "investing", "insurance"],
  "small-business": ["loans", "banking", "taxes"],
  "demat-accounts": ["investing", "mutual-funds"],
  "fixed-deposits": ["banking", "investing"],
};

// Category → product listing page path prefix
const PRODUCT_PATH_MAP: Record<string, string> = {
  "credit-cards": "/credit-cards",
  loans: "/loans",
  "mutual-funds": "/mutual-funds",
  "demat-accounts": "/demat-accounts",
  "fixed-deposits": "/fixed-deposits",
  insurance: "/insurance",
  banking: "/banking",
};

// Glossary category label → navigation slug mapping
const GLOSSARY_CATEGORY_MAP: Record<string, string[]> = {
  "credit-cards": ["Credit Cards", "Banking", "Loans"],
  loans: ["Loans", "Banking"],
  banking: ["Banking", "Investing"],
  investing: ["Investing", "Taxation"],
  "mutual-funds": ["Investing", "Mutual Funds"],
  insurance: ["Insurance"],
  "personal-finance": ["General", "Investing", "Taxation"],
  taxes: ["Taxation", "General"],
  "small-business": ["Banking", "Loans", "Taxation"],
  "demat-accounts": ["Investing"],
  "fixed-deposits": ["Banking", "Investing"],
};

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

/**
 * Generate a complete set of interlinks for an article.
 *
 * @param articleCategory  The slug of the article's primary category
 *                         (e.g. "credit-cards", "investing", "mutual-funds")
 * @param articleTitle     The title of the current article (used for exclusion)
 * @param articleSlug      The slug of the current article (excluded from results)
 */
export async function generateInterlinks(
  articleCategory: string,
  articleTitle: string,
  articleSlug: string,
): Promise<InterLinkSet> {
  const result: InterLinkSet = {
    relatedArticles: [],
    calculatorLinks: [],
    productPageLinks: [],
    glossaryLinks: [],
  };

  const supabase = createClient();

  // Run all queries in parallel for speed
  const [articles, products, glossary] = await Promise.all([
    fetchRelatedArticles(supabase, articleCategory, articleSlug),
    fetchTopProducts(supabase, articleCategory),
    fetchGlossaryTerms(supabase, articleCategory),
  ]);

  result.relatedArticles = articles;
  result.productPageLinks = products;
  result.glossaryLinks = glossary;

  // Calculator links are purely deterministic — no DB query needed
  result.calculatorLinks = getCalculatorLinks(articleCategory);

  return result;
}

// ---------------------------------------------------------------------------
// Data fetchers
// ---------------------------------------------------------------------------

async function fetchRelatedArticles(
  supabase: ReturnType<typeof createClient>,
  category: string,
  currentSlug: string,
): Promise<InterLinkSet["relatedArticles"]> {
  try {
    // Fetch from same category first
    const { data: sameCategory, error: err1 } = await supabase
      .from("articles")
      .select("title, slug")
      .eq("status", "published")
      .eq("category", category)
      .neq("slug", currentSlug)
      .order("published_at", { ascending: false })
      .limit(3);

    if (err1) throw err1;

    const articles: InterLinkSet["relatedArticles"] = (sameCategory || []).map(
      (a: { title: string; slug: string }) => ({
        title: a.title,
        slug: a.slug,
        anchor: a.title,
      }),
    );

    // If we have fewer than 5, pull from related categories
    if (articles.length < 5) {
      const related = RELATED_CATEGORIES[category] || [];
      if (related.length > 0) {
        const { data: relatedArticles, error: err2 } = await supabase
          .from("articles")
          .select("title, slug")
          .eq("status", "published")
          .in("category", related)
          .neq("slug", currentSlug)
          .order("published_at", { ascending: false })
          .limit(5 - articles.length);

        if (!err2 && relatedArticles) {
          for (const a of relatedArticles as {
            title: string;
            slug: string;
          }[]) {
            articles.push({ title: a.title, slug: a.slug, anchor: a.title });
          }
        }
      }
    }

    return articles.slice(0, 5);
  } catch {
    // Graceful degradation — return empty if table missing or query fails
    return [];
  }
}

async function fetchTopProducts(
  supabase: ReturnType<typeof createClient>,
  category: string,
): Promise<InterLinkSet["productPageLinks"]> {
  try {
    const pathPrefix = PRODUCT_PATH_MAP[category];
    if (!pathPrefix) return [];

    const { data, error } = await supabase
      .from("products")
      .select("name, slug, category")
      .eq("category", category)
      .eq("status", "published")
      .order("rating", { ascending: false })
      .limit(3);

    if (error || !data) return [];

    return (data as { name: string; slug: string; category: string }[]).map(
      (p) => ({
        name: p.name,
        path: `${pathPrefix}/${p.slug}`,
        category: p.category,
      }),
    );
  } catch {
    return [];
  }
}

async function fetchGlossaryTerms(
  supabase: ReturnType<typeof createClient>,
  category: string,
): Promise<InterLinkSet["glossaryLinks"]> {
  try {
    const glossaryCategories = GLOSSARY_CATEGORY_MAP[category] || ["General"];

    const { data, error } = await supabase
      .from("glossary_terms")
      .select("term, slug")
      .in("category", glossaryCategories)
      .eq("status", "published")
      .order("term", { ascending: true })
      .limit(5);

    if (error || !data) return [];

    return (data as { term: string; slug: string }[]).map((t) => ({
      term: t.term,
      slug: t.slug,
    }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Deterministic helpers
// ---------------------------------------------------------------------------

function getCalculatorLinks(category: string): InterLinkSet["calculatorLinks"] {
  return CALC_MAP[category] || CALC_MAP["personal-finance"] || [];
}
