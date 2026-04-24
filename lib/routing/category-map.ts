/**
 * URL Category ↔ DB Category Mapping
 *
 * Source of truth for NerdWallet-aligned category nesting.
 * URL categories (what shows in the browser) are normalized to 7 top-levels.
 * DB categories (articles.category, glossary_terms.category) are messier —
 * legacy values include both hyphens and underscores. This module normalizes
 * at the boundary so the DB can keep its data untouched while URLs stay clean.
 *
 * See docs/URL_STRUCTURE_NERDWALLET.md for the full migration plan.
 */

/** NerdWallet-style top-level URL categories. Add here to whitelist. */
export const URL_CATEGORIES = [
  "credit-cards",
  "loans",
  "banking",
  "investing",
  "insurance",
  "taxes",
  "learn",
] as const;

export type UrlCategory = (typeof URL_CATEGORIES)[number];

/**
 * Map each DB category value to its canonical URL category.
 * New DB values should be added here explicitly — unknown values fall back
 * to `learn` (cross-cutting hub) to prevent 404s.
 */
const DB_TO_URL: Record<string, UrlCategory> = {
  // Credit cards
  "credit-cards": "credit-cards",
  credit_cards: "credit-cards",

  // Loans (including small-business under /loans/business/)
  loans: "loans",
  "personal-loans": "loans",
  personal_loans: "loans",
  "small-business": "loans",
  small_business: "loans",
  "home-loans": "loans",
  "car-loans": "loans",
  "education-loans": "loans",

  // Banking (savings, FDs, schemes)
  banking: "banking",
  "fixed-deposits": "banking",
  fixed_deposit: "banking",
  "savings-accounts": "banking",
  "post-office-savings": "banking",

  // Investing (MF, demat, stocks, IPO, retirement, basics)
  investing: "investing",
  "investing-basics": "investing",
  "mutual-funds": "investing",
  mutual_fund: "investing",
  "demat-accounts": "investing",
  demat_account: "investing",
  stocks: "investing",
  ipo: "investing",
  retirement: "investing",

  // Insurance
  insurance: "insurance",
  "health-insurance": "insurance",
  "life-insurance": "insurance",
  "term-insurance": "insurance",

  // Taxes
  "tax-planning": "taxes",
  tax: "taxes",
  taxes: "taxes",
  taxation: "taxes",

  // Cross-cutting
  "personal-finance": "learn",
  tools: "learn",
  general: "learn",
};

/**
 * Returns the canonical URL category for a DB category value.
 * Falls back to `learn` (cross-cutting hub) for unknown categories.
 */
export function dbCategoryToUrl(
  dbCategory: string | null | undefined,
): UrlCategory {
  if (!dbCategory) return "learn";
  const normalized = dbCategory.toLowerCase().trim();
  return DB_TO_URL[normalized] ?? "learn";
}

/**
 * Is the given string a recognized top-level URL category?
 * Use this at route boundaries to reject unknown paths with notFound().
 */
export function isUrlCategory(candidate: string): candidate is UrlCategory {
  return (URL_CATEGORIES as readonly string[]).includes(candidate);
}

/**
 * Does an article with the given DB category belong under the given URL category?
 * Used to reject mismatched URLs like /loans/learn/sip-calculator (which is investing).
 */
export function categoryMatches(
  dbCategory: string | null | undefined,
  urlCategory: UrlCategory,
): boolean {
  return dbCategoryToUrl(dbCategory) === urlCategory;
}

/**
 * Reverse map built once at module load (js-index-maps, O(1) lookup).
 * Used for listing queries — e.g. "all articles under /investing/".
 */
const URL_TO_DBS: Record<UrlCategory, string[]> = (() => {
  const acc: Partial<Record<UrlCategory, string[]>> = {};
  for (const [db, url] of Object.entries(DB_TO_URL)) {
    (acc[url] ??= []).push(db);
  }
  for (const url of URL_CATEGORIES) acc[url] ??= [];
  return acc as Record<UrlCategory, string[]>;
})();

/**
 * Returns all DB category values that map to the given URL category.
 * Backed by a pre-built reverse map for O(1) access.
 */
export function dbCategoriesForUrl(urlCategory: UrlCategory): string[] {
  return URL_TO_DBS[urlCategory];
}

/**
 * Product review mapping — which Supabase tables to search for a product
 * slug when a user hits /[cat]/reviews/[slug], and where to redirect them
 * to the current canonical detail URL.
 *
 * Order matters: the route tries tables in the listed order and uses the
 * first match. Most populous / most-likely-matched first.
 */
export const PRODUCT_REVIEW_TABLES: Record<
  UrlCategory,
  Array<{ table: string; canonicalPathPrefix: string }>
> = {
  "credit-cards": [
    { table: "credit_cards", canonicalPathPrefix: "/credit-cards" },
  ],
  loans: [{ table: "loans", canonicalPathPrefix: "/loans" }],
  banking: [
    { table: "fixed_deposits", canonicalPathPrefix: "/fixed-deposits" },
    // savings_accounts currently has no detail page; skip until one exists
  ],
  investing: [
    { table: "mutual_funds", canonicalPathPrefix: "/mutual-funds" },
    { table: "brokers", canonicalPathPrefix: "/demat-accounts" },
    // stocks handled via /investing/stocks/reviews/[slug] path when needed
  ],
  insurance: [{ table: "insurance", canonicalPathPrefix: "/insurance" }],
  taxes: [],
  learn: [],
};

/**
 * Calculator → URL category mapping.
 *
 * Each of the 72 flat calculators under /calculators/[slug] gets a natural
 * home under /[cat]/calculators/[slug]. Unknown / cross-cutting calculators
 * live under /learn/calculators/[slug] by omission from this map (default).
 *
 * Keep synced with `app/calculators/*` directories. When a new calc ships,
 * add it here.
 */
export const CALCULATOR_CATEGORY: Record<string, UrlCategory> = {
  // Taxes
  tax: "taxes",
  "old-vs-new-tax": "taxes",
  hra: "taxes",
  "80c": "taxes",
  "capital-gains-tax": "taxes",
  ltcg: "taxes",
  "crypto-tax": "taxes",
  "nri-tax": "taxes",
  "freelancer-tax": "taxes",
  tds: "taxes",
  gst: "taxes",
  "stamp-duty": "taxes",
  gratuity: "taxes",
  salary: "taxes",

  // Loans
  emi: "loans",
  "home-loan-emi": "loans",
  "car-loan-emi": "loans",
  "personal-loan-emi": "loans",
  "education-loan-emi": "loans",
  "flat-vs-reducing-rate": "loans",
  "home-loan-vs-sip": "loans",

  // Banking (FDs, RDs, savings schemes)
  fd: "banking",
  rd: "banking",
  "senior-citizen-fd": "banking",
  "post-office-savings": "banking",
  "po-fd-vs-bank-fd": "banking",
  "nsc-vs-fd": "banking",
  nsc: "banking",
  kvp: "banking",
  scss: "banking",
  mis: "banking",
  "rd-vs-sip": "banking",
  "fd-vs-debt-mf": "banking",
  "sip-vs-fd": "banking",
  "sip-vs-rd": "banking",

  // Investing (SIP, MF, equity, retirement corpus)
  sip: "investing",
  lumpsum: "investing",
  swp: "investing",
  cagr: "investing",
  "step-up-sip": "investing",
  "sip-vs-lumpsum-comparison": "investing",
  "lumpsum-vs-sip": "investing",
  "mutual-fund-returns": "investing",
  "direct-vs-regular-mf": "investing",
  "index-vs-active-fund": "investing",
  "dividend-yield": "investing",
  "portfolio-rebalancing": "investing",
  "gold-investment": "investing",
  "gold-vs-equity": "investing",
  "real-estate-roi": "investing",
  "inflation-adjusted-returns": "investing",
  elss: "investing",
  ppf: "investing",
  "ppf-vs-elss": "investing",
  "nps-vs-ppf": "investing",
  nps: "investing",
  "atal-pension-yojana": "investing",
  ssy: "investing",
  "ssy-vs-ppf": "investing",
  epf: "investing",
  "epf-vs-vpf": "investing",
  "pm-kisan": "investing",
  retirement: "investing",
  fire: "investing",

  // Insurance
  "term-vs-endowment": "insurance",

  // Learn (cross-cutting / goal planning)
  "compound-interest": "learn",
  "simple-interest": "learn",
  "financial-health-score": "learn",
  "child-education": "learn",
  "marriage-cost": "learn",
  "goal-planning": "learn",
  "rent-vs-buy": "learn",
  "rent-vs-buy-comparison": "learn",
  brokerage: "learn",
};

/**
 * Returns the natural URL category for a calculator slug.
 * Unknown slugs default to `learn` (cross-cutting).
 */
export function calculatorCategory(slug: string): UrlCategory {
  return CALCULATOR_CATEGORY[slug] ?? "learn";
}

/** Human-readable label for a URL category. Used in breadcrumbs + metadata. */
export function urlCategoryLabel(urlCategory: UrlCategory): string {
  const labels: Record<UrlCategory, string> = {
    "credit-cards": "Credit Cards",
    loans: "Loans",
    banking: "Banking",
    investing: "Investing",
    insurance: "Insurance",
    taxes: "Taxes",
    learn: "Learn",
  };
  return labels[urlCategory];
}
