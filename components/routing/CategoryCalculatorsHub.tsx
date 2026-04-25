/**
 * Shared Category Calculators Hub — Server Component
 *
 * Used by the dynamic /[category]/calculators/page.tsx and the literal
 * overrides at /credit-cards/calculators, /loans/calculators,
 * /insurance/calculators (which exist to defeat the [slug] conflict).
 */

import Link from "next/link";
import { ArrowUpRight, ChevronRight, Home } from "lucide-react";
import {
  CALCULATOR_CATEGORY,
  urlCategoryLabel,
  type UrlCategory,
} from "@/lib/routing/category-map";
import { generateCanonicalUrl } from "@/lib/linking/canonical";

// CMS-MIGRATION: this 70+ entry static map should live in a `calculators`
// reference table (slug, url_category, title, tagline, accent, popularity).
// Pattern proven for FAQs in `category_faqs` (lib/content/faqs.ts).
// See docs/MANUAL_ACTIONS_TRACKER.md.
/** Curated display labels + taglines per calc slug. */
const CALC_META: Record<
  string,
  { title: string; tagline: string; accent: string }
> = {
  sip: {
    title: "SIP calculator",
    tagline: "Project mutual-fund returns",
    accent: "₹",
  },
  lumpsum: {
    title: "Lumpsum calculator",
    tagline: "One-time investment growth",
    accent: "₹",
  },
  swp: {
    title: "SWP calculator",
    tagline: "Systematic withdrawal planning",
    accent: "₹",
  },
  cagr: {
    title: "CAGR calculator",
    tagline: "Compound annual growth",
    accent: "%",
  },
  "step-up-sip": {
    title: "Step-up SIP",
    tagline: "SIP with annual increment",
    accent: "₹",
  },
  emi: {
    title: "EMI calculator",
    tagline: "Loan monthly payment",
    accent: "₹",
  },
  "home-loan-emi": {
    title: "Home loan EMI",
    tagline: "With prepayment scenarios",
    accent: "₹",
  },
  "car-loan-emi": {
    title: "Car loan EMI",
    tagline: "Including interest + fees",
    accent: "₹",
  },
  "personal-loan-emi": {
    title: "Personal loan EMI",
    tagline: "Compare offers",
    accent: "₹",
  },
  "education-loan-emi": {
    title: "Education loan EMI",
    tagline: "Moratorium + repayment",
    accent: "₹",
  },
  hra: {
    title: "HRA exemption",
    tagline: "Metro vs non-metro, 3-part rule",
    accent: "₹",
  },
  "80c": {
    title: "Section 80C optimizer",
    tagline: "₹1.5L cap across instruments",
    accent: "§",
  },
  "old-vs-new-tax": {
    title: "Old vs new regime",
    tagline: "Find out which saves more",
    accent: "₹",
  },
  tax: {
    title: "Income tax calculator",
    tagline: "FY 2026-27 slabs, both regimes",
    accent: "%",
  },
  ltcg: {
    title: "LTCG calculator",
    tagline: "Post-2024 ₹1.25L threshold",
    accent: "₹",
  },
  "capital-gains-tax": {
    title: "Capital gains tax",
    tagline: "Equity, debt, real estate, gold",
    accent: "%",
  },
  gst: {
    title: "GST calculator",
    tagline: "Tax inclusive / exclusive",
    accent: "%",
  },
  "crypto-tax": {
    title: "Crypto tax",
    tagline: "30% flat + 1% TDS",
    accent: "%",
  },
  "nri-tax": { title: "NRI tax", tagline: "TDS on Indian income", accent: "%" },
  "freelancer-tax": {
    title: "Freelancer tax",
    tagline: "Presumptive + advance tax",
    accent: "%",
  },
  tds: { title: "TDS calculator", tagline: "Section 194 rates", accent: "%" },
  "stamp-duty": {
    title: "Stamp duty",
    tagline: "State-wise property rates",
    accent: "%",
  },
  gratuity: {
    title: "Gratuity calculator",
    tagline: "Exemption + taxable split",
    accent: "₹",
  },
  salary: {
    title: "Salary calculator",
    tagline: "In-hand after deductions",
    accent: "₹",
  },
  fd: {
    title: "FD calculator",
    tagline: "Maturity + interest payout",
    accent: "₹",
  },
  rd: {
    title: "RD calculator",
    tagline: "Monthly deposit growth",
    accent: "₹",
  },
  "senior-citizen-fd": {
    title: "Senior citizen FD",
    tagline: "Higher rate + tax benefit",
    accent: "₹",
  },
  "post-office-savings": {
    title: "Post office savings",
    tagline: "All small-savings schemes",
    accent: "₹",
  },
  "po-fd-vs-bank-fd": {
    title: "PO FD vs bank FD",
    tagline: "Rates + liquidity compared",
    accent: "vs",
  },
  "nsc-vs-fd": {
    title: "NSC vs FD",
    tagline: "5-year tax-saver compared",
    accent: "vs",
  },
  nsc: {
    title: "NSC calculator",
    tagline: "National savings certificate",
    accent: "₹",
  },
  kvp: { title: "KVP calculator", tagline: "Kisan vikas patra", accent: "₹" },
  scss: {
    title: "SCSS calculator",
    tagline: "Senior citizen savings scheme",
    accent: "₹",
  },
  mis: {
    title: "Post office MIS",
    tagline: "Monthly income scheme",
    accent: "₹",
  },
  ppf: {
    title: "PPF calculator",
    tagline: "15-year tax-free growth",
    accent: "₹",
  },
  "ppf-vs-elss": {
    title: "PPF vs ELSS",
    tagline: "Tax-saving compared",
    accent: "vs",
  },
  nps: { title: "NPS calculator", tagline: "Corpus + pension", accent: "₹" },
  "nps-vs-ppf": {
    title: "NPS vs PPF",
    tagline: "Retirement compared",
    accent: "vs",
  },
  "atal-pension-yojana": {
    title: "Atal Pension Yojana",
    tagline: "Gov-backed pension",
    accent: "₹",
  },
  ssy: {
    title: "Sukanya Samriddhi",
    tagline: "Girl-child savings",
    accent: "₹",
  },
  "ssy-vs-ppf": {
    title: "SSY vs PPF",
    tagline: "Long-term growth",
    accent: "vs",
  },
  epf: {
    title: "EPF calculator",
    tagline: "Employee provident fund",
    accent: "₹",
  },
  "epf-vs-vpf": {
    title: "EPF vs VPF",
    tagline: "Voluntary vs mandatory",
    accent: "vs",
  },
  "pm-kisan": {
    title: "PM Kisan",
    tagline: "Farmer income support",
    accent: "₹",
  },
  retirement: {
    title: "Retirement corpus",
    tagline: "How much is enough",
    accent: "₹",
  },
  fire: {
    title: "FIRE calculator",
    tagline: "Financial independence",
    accent: "₹",
  },
  elss: {
    title: "ELSS calculator",
    tagline: "Tax-saving mutual fund",
    accent: "₹",
  },
  "mutual-fund-returns": {
    title: "MF returns",
    tagline: "Back-calculate any period",
    accent: "%",
  },
  "direct-vs-regular-mf": {
    title: "Direct vs regular MF",
    tagline: "Expense-ratio savings",
    accent: "vs",
  },
  "index-vs-active-fund": {
    title: "Index vs active",
    tagline: "Net-of-cost returns",
    accent: "vs",
  },
  "dividend-yield": {
    title: "Dividend yield",
    tagline: "Stock income calc",
    accent: "%",
  },
  "portfolio-rebalancing": {
    title: "Portfolio rebalancing",
    tagline: "Asset-mix targeting",
    accent: "%",
  },
  "gold-investment": {
    title: "Gold investment",
    tagline: "Returns + tax",
    accent: "₹",
  },
  "gold-vs-equity": {
    title: "Gold vs equity",
    tagline: "10-year comparison",
    accent: "vs",
  },
  "real-estate-roi": {
    title: "Real estate ROI",
    tagline: "Net rental yield",
    accent: "%",
  },
  "inflation-adjusted-returns": {
    title: "Inflation-adjusted returns",
    tagline: "Real vs nominal",
    accent: "%",
  },
  "sip-vs-lumpsum-comparison": {
    title: "SIP vs lumpsum",
    tagline: "Timing strategies",
    accent: "vs",
  },
  "lumpsum-vs-sip": {
    title: "Lumpsum vs SIP",
    tagline: "Entry-timing sim",
    accent: "vs",
  },
  "sip-vs-fd": {
    title: "SIP vs FD",
    tagline: "Growth vs safety",
    accent: "vs",
  },
  "sip-vs-rd": {
    title: "SIP vs RD",
    tagline: "Market vs guaranteed",
    accent: "vs",
  },
  "rd-vs-sip": {
    title: "RD vs SIP",
    tagline: "Monthly deposit compared",
    accent: "vs",
  },
  "fd-vs-debt-mf": {
    title: "FD vs debt MF",
    tagline: "Post-tax returns",
    accent: "vs",
  },
  "flat-vs-reducing-rate": {
    title: "Flat vs reducing rate",
    tagline: "True cost of loan",
    accent: "vs",
  },
  "home-loan-vs-sip": {
    title: "Home loan vs SIP",
    tagline: "Pay off or invest?",
    accent: "vs",
  },
  "term-vs-endowment": {
    title: "Term vs endowment",
    tagline: "Insurance vs investment",
    accent: "vs",
  },
  "compound-interest": {
    title: "Compound interest",
    tagline: "Exponential growth",
    accent: "%",
  },
  "simple-interest": {
    title: "Simple interest",
    tagline: "Linear interest",
    accent: "%",
  },
  "financial-health-score": {
    title: "Financial health score",
    tagline: "Multi-factor audit",
    accent: "§",
  },
  "child-education": {
    title: "Child education",
    tagline: "College corpus target",
    accent: "₹",
  },
  "marriage-cost": {
    title: "Marriage cost",
    tagline: "Plan the spend",
    accent: "₹",
  },
  "goal-planning": {
    title: "Goal planning",
    tagline: "Multi-goal tracker",
    accent: "§",
  },
  "rent-vs-buy": {
    title: "Rent vs buy",
    tagline: "City-wise break-even",
    accent: "vs",
  },
  "rent-vs-buy-comparison": {
    title: "Rent vs buy compared",
    tagline: "Total cost of ownership",
    accent: "vs",
  },
  brokerage: {
    title: "Brokerage calculator",
    tagline: "Broker-wise charges",
    accent: "%",
  },
};

function fallbackMeta(slug: string) {
  return {
    title: slug
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" "),
    tagline: "Calculator",
    accent: "§",
  };
}

export default async function CategoryCalculatorsHub({
  urlCategory,
}: {
  urlCategory: UrlCategory;
}) {
  const label = urlCategoryLabel(urlCategory);
  const slugs = Object.entries(CALCULATOR_CATEGORY)
    .filter(([, cat]) => cat === urlCategory)
    .map(([slug]) => slug)
    .sort();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: generateCanonicalUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: label,
        item: generateCanonicalUrl(`/${urlCategory}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Calculators",
        item: generateCanonicalUrl(`/${urlCategory}/calculators`),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="surface-ink pt-10 pb-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-canvas-70">
              <li>
                <Link
                  href="/"
                  className="hover:text-indian-gold transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-3 h-3" />
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 text-canvas-70" />
              <li>
                <Link
                  href={`/${urlCategory}`}
                  className="hover:text-indian-gold transition-colors"
                >
                  {label}
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 text-canvas-70" />
              <li className="text-canvas">Calculators</li>
            </ol>
          </nav>

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-4">
            {label} · Run the numbers
          </div>
          <h1 className="font-display font-black text-[44px] md:text-[64px] lg:text-[76px] leading-[1.02] tracking-tight text-canvas max-w-[980px]">
            {label} <span className="text-indian-gold">calculators.</span>
          </h1>
          <p className="mt-6 font-serif text-[18px] md:text-[20px] leading-[1.55] text-canvas-70 max-w-[740px]">
            Free calculators — rupee-accurate, FY 2026-27 ready, worked examples
            built in.
          </p>
        </div>
      </section>

      <section className="bg-canvas py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          {slugs.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-[18px] text-ink-60">
                No calculators mapped to this category yet.
              </p>
              <Link
                href="/calculators"
                className="mt-6 inline-block font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline"
              >
                Browse all calculators →
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {slugs.map((slug) => {
                  const meta = CALC_META[slug] ?? fallbackMeta(slug);
                  return (
                    <Link
                      key={slug}
                      href={`/calculators/${slug}`}
                      className="group block bg-white border border-ink-12 rounded-sm p-6 hover:border-indian-gold transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[22px] font-black text-indian-gold leading-none">
                          {meta.accent}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-ink-60 group-hover:text-indian-gold transition-colors" />
                      </div>
                      <h3 className="mt-6 font-display text-[20px] font-black text-ink leading-tight group-hover:text-indian-gold transition-colors">
                        {meta.title}
                      </h3>
                      <p className="mt-2 text-[13px] text-ink-60 leading-[1.5]">
                        {meta.tagline}
                      </p>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-14 pt-8 border-t border-ink-12 flex items-center justify-between">
                <p className="text-[14px] text-ink-60">
                  Looking for something else?
                </p>
                <Link
                  href="/calculators"
                  className="font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline inline-flex items-center gap-1"
                >
                  All calculators <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

/** Shared metadata builder. */
export function buildCategoryCalculatorsMetadata(urlCategory: UrlCategory) {
  const label = urlCategoryLabel(urlCategory);
  return {
    title: `${label} Calculators — Plan, Compare, Decide`,
    description: `Free ${label.toLowerCase()} calculators for Indian users — rupee-accurate, FY 2026-27 slabs, worked examples built in.`,
    alternates: {
      canonical: generateCanonicalUrl(`/${urlCategory}/calculators`),
    },
    openGraph: {
      title: `${label} Calculators`,
      description: `Run the numbers for ${label.toLowerCase()} decisions.`,
      url: generateCanonicalUrl(`/${urlCategory}/calculators`),
      type: "website" as const,
    },
  };
}
