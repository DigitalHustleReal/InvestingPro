/**
 * Static fallback for the calculators reference table. Mirrors the DB
 * `calculators` table and consumed by `./calculators.ts` as a resilience
 * fallback.
 *
 * Keep in sync with:
 *   - `calculators` Supabase table (migration `create_calculators`)
 *   - `CALCULATOR_CATEGORY` in `lib/routing/category-map.ts`
 *     (that map is the SYNC source of truth for route validation;
 *     this file + DB table hold the DISPLAY meta)
 *
 * Invariant: every key in `CALCULATOR_CATEGORY` must exist here with
 * the same url_category. Route-validation works off CALCULATOR_CATEGORY
 * so a mismatch is a release-blocking lint issue.
 */

import type { UrlCategory } from "@/lib/routing/category-map";

export type CalculatorMeta = {
  slug: string;
  url_category: UrlCategory;
  title: string;
  tagline: string;
  accent: string;
};

/** 76 calculator entries, grouped by url_category for readability. */
export const CALCULATORS_STATIC: CalculatorMeta[] = [
  // ── Taxes (14) ───────────────────────────────────────────────────
  {
    slug: "tax",
    url_category: "taxes",
    title: "Income tax calculator",
    tagline: "FY 2026-27 slabs, both regimes",
    accent: "%",
  },
  {
    slug: "old-vs-new-tax",
    url_category: "taxes",
    title: "Old vs new regime",
    tagline: "Find out which saves more",
    accent: "₹",
  },
  {
    slug: "hra",
    url_category: "taxes",
    title: "HRA exemption",
    tagline: "Metro vs non-metro, 3-part rule",
    accent: "₹",
  },
  {
    slug: "80c",
    url_category: "taxes",
    title: "Section 80C optimizer",
    tagline: "₹1.5L cap across instruments",
    accent: "§",
  },
  {
    slug: "capital-gains-tax",
    url_category: "taxes",
    title: "Capital gains tax",
    tagline: "Equity, debt, real estate, gold",
    accent: "%",
  },
  {
    slug: "ltcg",
    url_category: "taxes",
    title: "LTCG calculator",
    tagline: "Post-2024 ₹1.25L threshold",
    accent: "₹",
  },
  {
    slug: "crypto-tax",
    url_category: "taxes",
    title: "Crypto tax",
    tagline: "30% flat + 1% TDS",
    accent: "%",
  },
  {
    slug: "nri-tax",
    url_category: "taxes",
    title: "NRI tax",
    tagline: "TDS on Indian income",
    accent: "%",
  },
  {
    slug: "freelancer-tax",
    url_category: "taxes",
    title: "Freelancer tax",
    tagline: "Presumptive + advance tax",
    accent: "%",
  },
  {
    slug: "tds",
    url_category: "taxes",
    title: "TDS calculator",
    tagline: "Section 194 rates",
    accent: "%",
  },
  {
    slug: "gst",
    url_category: "taxes",
    title: "GST calculator",
    tagline: "Tax inclusive / exclusive",
    accent: "%",
  },
  {
    slug: "stamp-duty",
    url_category: "taxes",
    title: "Stamp duty",
    tagline: "State-wise property rates",
    accent: "%",
  },
  {
    slug: "gratuity",
    url_category: "taxes",
    title: "Gratuity calculator",
    tagline: "Exemption + taxable split",
    accent: "₹",
  },
  {
    slug: "salary",
    url_category: "taxes",
    title: "Salary calculator",
    tagline: "In-hand after deductions",
    accent: "₹",
  },

  // ── Loans (7) ────────────────────────────────────────────────────
  {
    slug: "emi",
    url_category: "loans",
    title: "EMI calculator",
    tagline: "Loan monthly payment",
    accent: "₹",
  },
  {
    slug: "home-loan-emi",
    url_category: "loans",
    title: "Home loan EMI",
    tagline: "With prepayment scenarios",
    accent: "₹",
  },
  {
    slug: "car-loan-emi",
    url_category: "loans",
    title: "Car loan EMI",
    tagline: "Including interest + fees",
    accent: "₹",
  },
  {
    slug: "personal-loan-emi",
    url_category: "loans",
    title: "Personal loan EMI",
    tagline: "Compare offers",
    accent: "₹",
  },
  {
    slug: "education-loan-emi",
    url_category: "loans",
    title: "Education loan EMI",
    tagline: "Moratorium + repayment",
    accent: "₹",
  },
  {
    slug: "flat-vs-reducing-rate",
    url_category: "loans",
    title: "Flat vs reducing rate",
    tagline: "True cost of loan",
    accent: "vs",
  },
  {
    slug: "home-loan-vs-sip",
    url_category: "loans",
    title: "Home loan vs SIP",
    tagline: "Pay off or invest?",
    accent: "vs",
  },

  // ── Banking (14) ─────────────────────────────────────────────────
  {
    slug: "fd",
    url_category: "banking",
    title: "FD calculator",
    tagline: "Maturity + interest payout",
    accent: "₹",
  },
  {
    slug: "rd",
    url_category: "banking",
    title: "RD calculator",
    tagline: "Monthly deposit growth",
    accent: "₹",
  },
  {
    slug: "senior-citizen-fd",
    url_category: "banking",
    title: "Senior citizen FD",
    tagline: "Higher rate + tax benefit",
    accent: "₹",
  },
  {
    slug: "post-office-savings",
    url_category: "banking",
    title: "Post office savings",
    tagline: "All small-savings schemes",
    accent: "₹",
  },
  {
    slug: "po-fd-vs-bank-fd",
    url_category: "banking",
    title: "PO FD vs bank FD",
    tagline: "Rates + liquidity compared",
    accent: "vs",
  },
  {
    slug: "nsc-vs-fd",
    url_category: "banking",
    title: "NSC vs FD",
    tagline: "5-year tax-saver compared",
    accent: "vs",
  },
  {
    slug: "nsc",
    url_category: "banking",
    title: "NSC calculator",
    tagline: "National savings certificate",
    accent: "₹",
  },
  {
    slug: "kvp",
    url_category: "banking",
    title: "KVP calculator",
    tagline: "Kisan vikas patra",
    accent: "₹",
  },
  {
    slug: "scss",
    url_category: "banking",
    title: "SCSS calculator",
    tagline: "Senior citizen savings scheme",
    accent: "₹",
  },
  {
    slug: "mis",
    url_category: "banking",
    title: "Post office MIS",
    tagline: "Monthly income scheme",
    accent: "₹",
  },
  {
    slug: "rd-vs-sip",
    url_category: "banking",
    title: "RD vs SIP",
    tagline: "Monthly deposit compared",
    accent: "vs",
  },
  {
    slug: "fd-vs-debt-mf",
    url_category: "banking",
    title: "FD vs debt MF",
    tagline: "Post-tax returns",
    accent: "vs",
  },
  {
    slug: "sip-vs-fd",
    url_category: "banking",
    title: "SIP vs FD",
    tagline: "Growth vs safety",
    accent: "vs",
  },
  {
    slug: "sip-vs-rd",
    url_category: "banking",
    title: "SIP vs RD",
    tagline: "Market vs guaranteed",
    accent: "vs",
  },

  // ── Investing (29) ───────────────────────────────────────────────
  {
    slug: "sip",
    url_category: "investing",
    title: "SIP calculator",
    tagline: "Project mutual-fund returns",
    accent: "₹",
  },
  {
    slug: "lumpsum",
    url_category: "investing",
    title: "Lumpsum calculator",
    tagline: "One-time investment growth",
    accent: "₹",
  },
  {
    slug: "swp",
    url_category: "investing",
    title: "SWP calculator",
    tagline: "Systematic withdrawal planning",
    accent: "₹",
  },
  {
    slug: "cagr",
    url_category: "investing",
    title: "CAGR calculator",
    tagline: "Compound annual growth",
    accent: "%",
  },
  {
    slug: "step-up-sip",
    url_category: "investing",
    title: "Step-up SIP",
    tagline: "SIP with annual increment",
    accent: "₹",
  },
  {
    slug: "sip-vs-lumpsum-comparison",
    url_category: "investing",
    title: "SIP vs lumpsum",
    tagline: "Timing strategies",
    accent: "vs",
  },
  {
    slug: "lumpsum-vs-sip",
    url_category: "investing",
    title: "Lumpsum vs SIP",
    tagline: "Entry-timing sim",
    accent: "vs",
  },
  {
    slug: "mutual-fund-returns",
    url_category: "investing",
    title: "MF returns",
    tagline: "Back-calculate any period",
    accent: "%",
  },
  {
    slug: "direct-vs-regular-mf",
    url_category: "investing",
    title: "Direct vs regular MF",
    tagline: "Expense-ratio savings",
    accent: "vs",
  },
  {
    slug: "index-vs-active-fund",
    url_category: "investing",
    title: "Index vs active",
    tagline: "Net-of-cost returns",
    accent: "vs",
  },
  {
    slug: "dividend-yield",
    url_category: "investing",
    title: "Dividend yield",
    tagline: "Stock income calc",
    accent: "%",
  },
  {
    slug: "portfolio-rebalancing",
    url_category: "investing",
    title: "Portfolio rebalancing",
    tagline: "Asset-mix targeting",
    accent: "%",
  },
  {
    slug: "gold-investment",
    url_category: "investing",
    title: "Gold investment",
    tagline: "Returns + tax",
    accent: "₹",
  },
  {
    slug: "gold-vs-equity",
    url_category: "investing",
    title: "Gold vs equity",
    tagline: "10-year comparison",
    accent: "vs",
  },
  {
    slug: "real-estate-roi",
    url_category: "investing",
    title: "Real estate ROI",
    tagline: "Net rental yield",
    accent: "%",
  },
  {
    slug: "inflation-adjusted-returns",
    url_category: "investing",
    title: "Inflation-adjusted returns",
    tagline: "Real vs nominal",
    accent: "%",
  },
  {
    slug: "elss",
    url_category: "investing",
    title: "ELSS calculator",
    tagline: "Tax-saving mutual fund",
    accent: "₹",
  },
  {
    slug: "ppf",
    url_category: "investing",
    title: "PPF calculator",
    tagline: "15-year tax-free growth",
    accent: "₹",
  },
  {
    slug: "ppf-vs-elss",
    url_category: "investing",
    title: "PPF vs ELSS",
    tagline: "Tax-saving compared",
    accent: "vs",
  },
  {
    slug: "nps-vs-ppf",
    url_category: "investing",
    title: "NPS vs PPF",
    tagline: "Retirement compared",
    accent: "vs",
  },
  {
    slug: "nps",
    url_category: "investing",
    title: "NPS calculator",
    tagline: "Corpus + pension",
    accent: "₹",
  },
  {
    slug: "atal-pension-yojana",
    url_category: "investing",
    title: "Atal Pension Yojana",
    tagline: "Gov-backed pension",
    accent: "₹",
  },
  {
    slug: "ssy",
    url_category: "investing",
    title: "Sukanya Samriddhi",
    tagline: "Girl-child savings",
    accent: "₹",
  },
  {
    slug: "ssy-vs-ppf",
    url_category: "investing",
    title: "SSY vs PPF",
    tagline: "Long-term growth",
    accent: "vs",
  },
  {
    slug: "epf",
    url_category: "investing",
    title: "EPF calculator",
    tagline: "Employee provident fund",
    accent: "₹",
  },
  {
    slug: "epf-vs-vpf",
    url_category: "investing",
    title: "EPF vs VPF",
    tagline: "Voluntary vs mandatory",
    accent: "vs",
  },
  {
    slug: "pm-kisan",
    url_category: "investing",
    title: "PM Kisan",
    tagline: "Farmer income support",
    accent: "₹",
  },
  {
    slug: "retirement",
    url_category: "investing",
    title: "Retirement corpus",
    tagline: "How much is enough",
    accent: "₹",
  },
  {
    slug: "fire",
    url_category: "investing",
    title: "FIRE calculator",
    tagline: "Financial independence",
    accent: "₹",
  },

  // ── Insurance (1) ────────────────────────────────────────────────
  {
    slug: "term-vs-endowment",
    url_category: "insurance",
    title: "Term vs endowment",
    tagline: "Insurance vs investment",
    accent: "vs",
  },

  // ── Learn / cross-cutting (9) ────────────────────────────────────
  {
    slug: "compound-interest",
    url_category: "learn",
    title: "Compound interest",
    tagline: "Exponential growth",
    accent: "%",
  },
  {
    slug: "simple-interest",
    url_category: "learn",
    title: "Simple interest",
    tagline: "Linear interest",
    accent: "%",
  },
  {
    slug: "financial-health-score",
    url_category: "learn",
    title: "Financial health score",
    tagline: "Multi-factor audit",
    accent: "§",
  },
  {
    slug: "child-education",
    url_category: "learn",
    title: "Child education",
    tagline: "College corpus target",
    accent: "₹",
  },
  {
    slug: "marriage-cost",
    url_category: "learn",
    title: "Marriage cost",
    tagline: "Plan the spend",
    accent: "₹",
  },
  {
    slug: "goal-planning",
    url_category: "learn",
    title: "Goal planning",
    tagline: "Multi-goal tracker",
    accent: "§",
  },
  {
    slug: "rent-vs-buy",
    url_category: "learn",
    title: "Rent vs buy",
    tagline: "City-wise break-even",
    accent: "vs",
  },
  {
    slug: "rent-vs-buy-comparison",
    url_category: "learn",
    title: "Rent vs buy compared",
    tagline: "Total cost of ownership",
    accent: "vs",
  },
  {
    slug: "brokerage",
    url_category: "learn",
    title: "Brokerage calculator",
    tagline: "Broker-wise charges",
    accent: "%",
  },
];

export function getStaticCalculatorsForCategory(
  urlCategory: UrlCategory,
): CalculatorMeta[] {
  return CALCULATORS_STATIC.filter((c) => c.url_category === urlCategory).sort(
    (a, b) => a.slug.localeCompare(b.slug),
  );
}
