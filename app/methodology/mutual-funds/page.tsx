/**
 * Methodology — Mutual Funds (per-segment rubric)
 *
 * Sub-page of /methodology covering Indian mutual funds. Anchored
 * to ValueResearch + Morningstar frameworks adapted for SEBI's 2018
 * scheme-categorisation rules: equity (large/mid/small/multi/flexi/
 * sectoral), debt (10+ subcategories), hybrid, ELSS, index/ETF.
 *
 * Risk-adjusted return dominates because past returns alone don't
 * survive forward selection bias. Expense ratio matters more in
 * India where the direct-vs-regular plan TER gap is large.
 */

import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { generateCanonicalUrl } from "@/lib/linking/canonical";

export const revalidate = 86400;
const LAST_UPDATED = "2026-04-26";
const VERSION = "1.0";

export const metadata: Metadata = {
  title: "How We Rate Mutual Funds — Per-Segment Methodology",
  description:
    "InvestingPro's mutual-fund rating methodology for India: risk-adjusted return, expense ratio, fund-manager tenure, AUM right-sizing. Anchored to AMFI + ValueResearch + Morningstar.",
  alternates: { canonical: generateCanonicalUrl("/methodology/mutual-funds") },
  openGraph: {
    title: "How We Rate Mutual Funds — Methodology",
    description:
      "Per-segment scoring for equity, debt, hybrid, ELSS, index/ETF schemes in India.",
    url: generateCanonicalUrl("/methodology/mutual-funds"),
    type: "article",
  },
};

interface Factor {
  label: string;
  weight: number;
  note: string;
}
interface Segment {
  name: string;
  intro: string;
  formula: string;
  primaryFactors: Factor[];
}

const SEGMENTS: Segment[] = [
  {
    name: "Equity funds (large/mid/small/multi/flexi)",
    intro:
      "Risk-adjusted return is the single largest weight because trailing-return-only methodologies survive recency bias poorly. We blend Sharpe + Sortino + rolling-return percentile to triangulate manager skill from luck.",
    formula:
      "Risk-adjusted return 35% · Trailing returns 20% · Expense ratio 15% · Manager + AMC 15% · AUM + portfolio quality 15%",
    primaryFactors: [
      {
        label: "Risk-adjusted return (5y Sharpe + 5y Sortino)",
        weight: 35,
        note: "Sharpe = excess return / std dev. Sortino weights only downside vol — more meaningful for retail. Both versus category benchmark (CRISIL Hybrid 35+65 / Nifty 500 / etc.)",
      },
      {
        label: "Trailing returns + rolling-return percentile",
        weight: 20,
        note: "1y/3y/5y CAGR (each scored vs category). Rolling 3y returns over 5y window — fund consistently top-quartile beats fund that won one year and lost another.",
      },
      {
        label: "Expense ratio (direct plan)",
        weight: 15,
        note: "Direct-plan TER. India regulator caps at 2.25% for equity above ₹500cr AUM, lower for smaller. Index funds < 0.5%, active large-cap < 1.5% acceptable.",
      },
      {
        label: "Fund manager + AMC",
        weight: 15,
        note: "Manager tenure at this fund (3y minimum for skill-attribution). Manager track record at prior funds. AMC's overall record + RBI/SEBI penalties.",
      },
      {
        label: "AUM + portfolio quality",
        weight: 15,
        note: "Right-sized AUM (small-cap funds with > ₹10K cr struggle; large-cap funds with < ₹500cr struggle). Concentration vs benchmark, sector tilts, cash-call discipline.",
      },
    ],
  },
  {
    name: "Debt funds",
    intro:
      "Different physics: yield + duration risk + credit risk are the big three. SEBI's debt-fund categorisation (gilt/short-term/medium/long/dynamic/floater/credit-risk/corporate-bond/banking-PSU/liquid/overnight) defines what risks each fund takes — we score within category, not across.",
    formula:
      "Risk-adjusted return 30% · Yield-to-maturity 20% · Credit quality 20% · Duration management 15% · Expense ratio 15%",
    primaryFactors: [
      {
        label: "Risk-adjusted return",
        weight: 30,
        note: "Especially important in debt — many funds blew up in 2018-2020 chasing yield (DHFL, IL&FS, Franklin). Sharpe + max-drawdown over 3y.",
      },
      {
        label: "Yield-to-maturity (YTM)",
        weight: 20,
        note: "Indicative future return assuming bonds held to maturity. Should be appropriate for category — too-high YTM in 'safe' category = hidden credit risk.",
      },
      {
        label: "Credit quality",
        weight: 20,
        note: "% in AAA / AA / A / below-A / unrated. Concentration in single issuer, exposure to NBFCs vs PSUs vs corporates.",
      },
      {
        label: "Duration management",
        weight: 15,
        note: "Modified duration vs category mandate. Macaulay duration trend over time — skilled managers shorten ahead of rate hikes, lengthen ahead of cuts.",
      },
      {
        label: "Expense ratio",
        weight: 15,
        note: "Debt funds should be cheaper than equity. Direct-plan TER < 0.5% for liquid, < 1% for short-term, < 1.25% for credit-risk.",
      },
    ],
  },
  {
    name: "Hybrid funds",
    intro:
      "Equity + debt mix. SEBI categorisation: aggressive (65-80% equity), conservative (10-25% equity), balanced advantage / dynamic-asset-allocation, equity savings, multi-asset. Each has its own benchmark + risk profile.",
    formula:
      "Risk-adjusted return 30% · Asset allocation discipline 20% · Trailing returns 20% · Expense + manager 15% · Tax efficiency 15%",
    primaryFactors: [
      {
        label: "Risk-adjusted return",
        weight: 30,
        note: "Sharpe + downside capture. Hybrid funds advertise 'lower volatility' — we verify via realised drawdowns.",
      },
      {
        label: "Asset allocation discipline",
        weight: 20,
        note: "Does the fund stay within its SEBI-mandated band? Style drift is common in 'dynamic' funds. Score deviations.",
      },
      {
        label: "Trailing returns vs hybrid benchmark",
        weight: 20,
        note: "CRISIL Hybrid 35+65 / 50+50 / 75+25 — match the fund's intent. Outperformance net of expense.",
      },
      {
        label: "Expense + manager",
        weight: 15,
        note: "Direct-plan TER + manager tenure. Hybrid managers need both equity + debt expertise — penalised if AMC has weak debt team.",
      },
      {
        label: "Tax efficiency",
        weight: 15,
        note: "Equity-oriented hybrid (>65% equity) gets equity tax treatment (10% LTCG above ₹1.25 L). Debt-oriented gets slab-rate. Categorisation by AMFI matters for post-tax score.",
      },
    ],
  },
  {
    name: "ELSS (tax-saving)",
    intro:
      "Equity funds with 3y lock-in + 80C deduction up to ₹1.5 L (old regime only — new regime invalidates). Score includes tax saving as a quantifiable benefit, but only for old-regime taxpayers.",
    formula:
      "Risk-adjusted return 30% · Trailing returns 20% · Tax-savings benefit 20% · Expense 15% · Manager + AUM 15%",
    primaryFactors: [
      {
        label: "Risk-adjusted return",
        weight: 30,
        note: "Same as equity multi-cap. Sharpe + Sortino over 5y.",
      },
      {
        label: "Trailing returns",
        weight: 20,
        note: "ELSS funds compete against Nifty 500 / multi-cap benchmark. Outperformance net of expense ratio.",
      },
      {
        label: "Tax-savings benefit (old regime)",
        weight: 20,
        note: "80C deduction worth ₹1.5 L × marginal tax rate. For 30%-bracket taxpayer, that's ₹46,800/year saved. Effective return boost = saving / total invested.",
      },
      {
        label: "Expense ratio (direct plan)",
        weight: 15,
        note: "ELSS direct-plan TER 0.5-1.5% acceptable. Index ELSS funds (rare) cheaper still.",
      },
      {
        label: "Manager + AUM",
        weight: 15,
        note: "Manager tenure 5y+ ideal. AUM right-sized for the strategy.",
      },
    ],
  },
  {
    name: "Index funds + ETFs",
    intro:
      "Passive products — manager skill is irrelevant; tracking efficiency is everything. Score weights tracking error, expense ratio, liquidity (for ETFs). Active manager-related factors don't apply.",
    formula:
      "Tracking error 35% · Expense ratio 30% · Liquidity (ETFs) 15% · AMC + index choice 20%",
    primaryFactors: [
      {
        label: "Tracking error",
        weight: 35,
        note: "How tightly does NAV match the index? Best Indian Nifty 50 index funds run 0.05-0.15% TE. Above 0.5% indicates poor execution / tracking issues.",
      },
      {
        label: "Expense ratio",
        weight: 30,
        note: "The cheaper, the better. Top Nifty 50 funds: 0.03-0.10% TER. Anything > 0.30% for Nifty 50 is uncompetitive given the alternatives.",
      },
      {
        label: "Liquidity (ETFs only)",
        weight: 15,
        note: "Bid-ask spread + average daily volume. Indian ETFs vary wildly — some have spreads > 1% which destroys index-tracking advantage.",
      },
      {
        label: "Index choice + AMC",
        weight: 20,
        note: "Underlying index (Nifty 50 vs Nifty 500 vs S&P BSE 100, etc.). Some indices are better diversified. AMC rebalancing methodology + securities-lending policy.",
      },
    ],
  },
];

const STANDARDISED_ADJUSTMENTS = [
  "Fund manager change in last 12 months (re-evaluate manager-tenure component) − 0.0 to −0.4 stars",
  "AMC sponsor change / merger event −0.0 to −0.3 stars (until new track record established)",
  "SEBI penalty event on the AMC −0.2 to −0.7 stars",
  "Fund's AUM doubled in last 12 months without category-warranted growth (capacity risk) −0.1 to −0.3 stars",
  "Direct-plan TER reduced (good for investor) +0.0 to +0.2 stars",
  "Active style drift outside category mandate −0.2 to −0.5 stars",
];

const DATA_SOURCES = [
  {
    label: "AMFI daily NAV feed",
    note: "All schemes' daily NAVs, primary source for return calculations.",
  },
  {
    label: "Scheme Information Document (SID) + monthly factsheets",
    note: "Portfolio holdings, sector exposure, top-10 holdings, expense ratio, fund manager.",
  },
  {
    label: "ValueResearch + Morningstar benchmarks",
    note: "Cross-referenced for category benchmarks + rolling-return percentile context.",
  },
  {
    label: "CRISIL ratings",
    note: "Independent credit ratings on debt-fund holdings.",
  },
  {
    label: "SEBI scheme categorisation circular",
    note: "2018 scheme-cat rules define fund mandate boundaries.",
  },
];

export default function MutualFundsMethodology() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How We Rate Mutual Funds",
    datePublished: "2026-04-26T00:00:00+05:30",
    dateModified: `${LAST_UPDATED}T00:00:00+05:30`,
    author: {
      "@type": "Organization",
      name: "InvestingPro Investment Desk",
      url: generateCanonicalUrl("/about/editorial-team"),
    },
    publisher: {
      "@type": "Organization",
      name: "InvestingPro",
      url: "https://investingpro.in",
    },
    mainEntityOfPage: generateCanonicalUrl("/methodology/mutual-funds"),
  };
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
        name: "Methodology",
        item: generateCanonicalUrl("/methodology"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Mutual Funds",
        item: generateCanonicalUrl("/methodology/mutual-funds"),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="surface-ink pt-12 pb-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <nav aria-label="Breadcrumb" className="mb-8">
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
                  href="/methodology"
                  className="hover:text-indian-gold transition-colors"
                >
                  Methodology
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 text-canvas-70" />
              <li className="text-canvas">Mutual Funds</li>
            </ol>
          </nav>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            Investment Desk · Methodology v{VERSION} · last updated{" "}
            {LAST_UPDATED}
          </div>
          <h1 className="font-display font-black text-[44px] md:text-[64px] leading-[1.02] tracking-tight text-canvas max-w-[860px]">
            How we rate <span className="text-indian-gold">mutual funds</span>.
          </h1>
          <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[820px]">
            Five segments — equity, debt, hybrid, ELSS, index/ETF — each with
            its own scoring formula. Trailing returns alone don't survive
            forward selection bias: we blend Sharpe, Sortino, rolling-return
            percentiles, and SEBI-categorisation discipline into a single
            per-category score.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-wider text-canvas-70">
            <span>· AMFI + ValueResearch + Morningstar grounded</span>
            <span>· SEBI 2018 categorisation respected</span>
            <span>· Direct-plan TER preferred</span>
          </div>
        </div>
      </section>

      <section className="bg-canvas pb-20 pt-14">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Per-segment rubrics
          </div>
          <h2 className="font-display text-[34px] md:text-[40px] font-black text-ink leading-tight mb-10 max-w-[820px]">
            Five formulas. One scoring scale.
          </h2>
          <div className="space-y-12">
            {SEGMENTS.map((seg) => (
              <div
                key={seg.name}
                id={seg.name.toLowerCase().replace(/[^a-z]+/g, "-")}
                className="border-t-2 border-ink-12 pt-8"
              >
                <h3 className="font-display text-[26px] md:text-[30px] font-black text-ink leading-tight mb-3">
                  {seg.name}
                </h3>
                <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-4">
                  Formula — {seg.formula}
                </div>
                <p className="text-[16px] leading-[1.7] text-ink-80 mb-6 max-w-[820px]">
                  {seg.intro}
                </p>
                <div className="bg-canvas border border-ink-12 rounded-sm overflow-hidden">
                  <div className="grid grid-cols-[1fr_70px] md:grid-cols-[260px_1fr_60px] bg-ink/5 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-ink-60">
                    <div>Factor</div>
                    <div className="hidden md:block">What we measure</div>
                    <div className="text-right">Weight</div>
                  </div>
                  {seg.primaryFactors.map((f) => (
                    <div
                      key={f.label}
                      className="grid grid-cols-[1fr_70px] md:grid-cols-[260px_1fr_60px] px-4 py-3 border-t border-ink-12 items-baseline"
                    >
                      <div className="font-mono text-[12px] text-ink font-semibold">
                        {f.label}
                      </div>
                      <div className="hidden md:block text-[13px] text-ink-80 leading-[1.5]">
                        {f.note}
                      </div>
                      <div className="text-right font-mono text-[14px] font-bold text-indian-gold tabular-nums">
                        {f.weight}%
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-[1fr_70px] md:grid-cols-[260px_1fr_60px] px-4 py-2.5 border-t-2 border-ink-12 bg-ink/5 items-baseline">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60">
                      Total
                    </div>
                    <div className="hidden md:block" />
                    <div className="text-right font-mono text-[14px] font-bold text-ink tabular-nums">
                      {seg.primaryFactors.reduce((s, f) => s + f.weight, 0)}%
                    </div>
                  </div>
                </div>
                <div className="md:hidden space-y-2 mt-4 text-[13px] text-ink-70 leading-[1.5]">
                  {seg.primaryFactors.map((f) => (
                    <div key={`m-${f.label}`}>
                      <span className="font-mono text-[11px] text-ink font-semibold">
                        {f.label}:
                      </span>{" "}
                      {f.note}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Standardised adjustments
          </div>
          <h2 className="font-display text-[30px] md:text-[34px] font-black text-ink leading-tight mb-6 max-w-[820px]">
            Cross-segment modifiers.
          </h2>
          <ul className="space-y-3 text-[15px] leading-[1.65] text-ink-80 max-w-[820px]">
            {STANDARDISED_ADJUSTMENTS.map((a, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-[11px] text-ink-60 mt-1">
                  ·
                </span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Data sources
          </div>
          <h2 className="font-display text-[30px] md:text-[34px] font-black text-ink leading-tight mb-8 max-w-[820px]">
            Where the values come from.
          </h2>
          <div className="space-y-5 max-w-[820px]">
            {DATA_SOURCES.map((s) => (
              <div key={s.label} className="border-l-2 border-indian-gold pl-5">
                <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-1">
                  {s.label}
                </div>
                <p className="text-[15px] leading-[1.6] text-ink-80">
                  {s.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Update cadence
          </div>
          <h2 className="font-display text-[30px] md:text-[34px] font-black text-ink leading-tight mb-6 max-w-[820px]">
            When scores get refreshed.
          </h2>
          <ul className="space-y-3 text-[15px] leading-[1.65] text-ink-80 max-w-[820px]">
            <li>
              <strong className="text-ink">Daily:</strong> AMFI NAV ingest,
              return calcs.
            </li>
            <li>
              <strong className="text-ink">Monthly:</strong> Portfolio + sector
              + top-10 review when factsheets publish (typically 7th of next
              month).
            </li>
            <li>
              <strong className="text-ink">Quarterly:</strong> Manager tenure +
              AMC capital + AUM growth audit.
            </li>
            <li>
              <strong className="text-ink">Event-triggered:</strong> Manager
              change, SEBI penalty, AMC merger, scheme merger → re-score within
              7 days.
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Related methodologies
          </div>
          <h2 className="font-display text-[26px] md:text-[30px] font-black text-ink leading-tight mb-6 max-w-[820px]">
            Other product types we rate.
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-[15px] text-ink-80 max-w-[820px]">
            <li>
              <Link
                href="/methodology/credit-cards"
                className="text-indian-gold hover:underline"
              >
                Credit cards
              </Link>
            </li>
            <li>
              <Link
                href="/methodology/loans"
                className="text-indian-gold hover:underline"
              >
                Loans
              </Link>
            </li>
            <li>
              <Link
                href="/methodology/banking"
                className="text-indian-gold hover:underline"
              >
                Banking (FDs, savings, RDs)
              </Link>
            </li>
            <li>
              <Link
                href="/methodology/insurance"
                className="text-indian-gold hover:underline"
              >
                Insurance
              </Link>
            </li>
            <li>
              <Link
                href="/methodology/brokers"
                className="text-indian-gold hover:underline"
              >
                Demat brokers
              </Link>
            </li>
            <li>
              <Link
                href="/methodology"
                className="text-indian-gold hover:underline"
              >
                All methodology (overview)
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-canvas py-10 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-ink-60">
          <div>
            Mutual Funds methodology v{VERSION} · last updated {LAST_UPDATED}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/about/editorial-standards"
              className="hover:text-indian-gold transition-colors"
            >
              Editorial standards
            </Link>
            <Link
              href="/corrections"
              className="hover:text-indian-gold transition-colors"
            >
              Corrections
            </Link>
            <Link
              href="/about/editorial-team"
              className="hover:text-indian-gold transition-colors"
            >
              Investment Desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
