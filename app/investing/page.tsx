/**
 * Investing Hub — Server Component (v3)
 *
 * Goal: a NerdWallet-better investing landing page for Indian users.
 * What this page does that NerdWallet's /investing/ does NOT:
 *   - Live market strip (NIFTY / SENSEX / Bank Nifty / 10Y / Gold)
 *   - Persona router (just-starting / building / pre-retirement / NRI-retired)
 *   - India-specific asset class returns table (5y vs 10y CAGR)
 *   - Decision-cards for the comparisons Indians actually run
 *     (SIP vs lumpsum, Index vs active, PPF vs ELSS, NPS vs PPF)
 *   - Editorial desk byline + Organization JSON-LD on a hub page
 *
 * All v3 tokens — ink/canvas/indian-gold/action-green/authority-green.
 * Fonts: Playfair Display (display), Inter (body), JetBrains Mono (data).
 * No blue/purple/pink/cyan/teal/sky. Rounded-sm max. No shadow-lg.
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Home,
  ArrowUpRight,
  TrendingUp,
  Building2,
  Shield,
  BarChart3,
  Landmark,
  PiggyBank,
} from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import { generateCanonicalUrl } from "@/lib/linking/canonical";
import { getEditorialHubs } from "@/lib/content/editorial-hubs";
import { TEAM_MEMBERS } from "@/lib/data/team";
import { deskOrganizationSchema } from "@/lib/content/desk-schema";
import { DeskByline } from "@/components/articles/DeskByline";
import CategoryFAQ from "@/components/routing/CategoryFAQ";
import { articleUrl } from "@/lib/routing/article-url";

export const revalidate = 21600; // 6 hours

export const metadata: Metadata = {
  title: "Investing in India 2026 — Mutual Funds, Stocks, PPF, NPS Compared",
  description:
    "Independent research on mutual funds, stocks, ELSS, PPF, NPS, and gold. Live NIFTY data, asset-class returns, free calculators, no commission. From the InvestingPro Investment Desk.",
  alternates: { canonical: generateCanonicalUrl("/investing") },
  openGraph: {
    title: "Investing in India — InvestingPro",
    description:
      "Mutual funds, stocks, retirement schemes — compared with real Indian data, not US frameworks.",
    url: generateCanonicalUrl("/investing"),
    type: "website",
  },
};

// CMS-MIGRATION: live market quotes — hardcode for now, plumb to NSE/BSE
// data API or a `market_quotes` table. "Indicative · last updated" stamp
// makes the staleness honest until the live feed lands.
const MARKET_QUOTES = [
  { label: "NIFTY 50", value: "24,318", delta: "+0.42%", trend: "up" },
  { label: "SENSEX", value: "79,801", delta: "+0.38%", trend: "up" },
  { label: "Bank NIFTY", value: "51,427", delta: "−0.18%", trend: "down" },
  { label: "10Y G-Sec", value: "6.84%", delta: "+2 bps", trend: "up" },
  { label: "Gold (₹/10g)", value: "₹76,920", delta: "+1.1%", trend: "up" },
] as const;
const MARKET_QUOTES_AS_OF = "Apr 25, 2026 · 3:30 PM IST";

// CMS-MIGRATION: persona-led routing — move to `editorial_hubs` with
// placement = 'investing-personas' once pattern proves out.
const PERSONAS = [
  {
    label: "Just starting",
    age: "20s · ₹0 corpus",
    intent: "First SIP, ELSS, build the habit",
    href: "/investing/learn",
  },
  {
    label: "Building corpus",
    age: "30s–40s · ₹5L–₹50L",
    intent: "Index + active mix, NPS top-up, asset allocation",
    href: "/calculators/portfolio-rebalancing",
  },
  {
    label: "Pre-retirement",
    age: "50s · ₹50L+",
    intent: "Glide path to debt, SWP planning, healthcare buffer",
    href: "/calculators/swp",
  },
  {
    label: "NRI / Retired",
    age: "Income on tap",
    intent: "Tax-efficient withdrawals, REITs, SCSS, dividends",
    href: "/calculators/scss",
  },
] as const;

const INVEST_CATEGORIES = [
  {
    label: "Mutual funds",
    desc: "962 funds, ranked by 5y rolling returns + expense ratio + Sharpe",
    href: "/mutual-funds",
    icon: TrendingUp,
    stat: "962 funds",
    badge: "Most popular",
  },
  {
    label: "PPF & NPS",
    desc: "Government-backed: PPF 7.1% tax-free, NPS Tier-I corpus + pension",
    href: "/ppf-nps",
    icon: Building2,
    stat: "EEE + 80CCD(1B)",
  },
  {
    label: "ELSS funds",
    desc: "3-year lock-in mutual funds, ₹1.5L 80C deduction, equity exposure",
    href: "/mutual-funds?type=elss",
    icon: Shield,
    stat: "Shortest 80C lock-in",
  },
  {
    label: "Index funds",
    desc: "Nifty 50, Nifty Next 50, Sensex — expense ratios under 0.5%",
    href: "/mutual-funds?type=index",
    icon: BarChart3,
    stat: "0.1% – 0.5% expense",
  },
  {
    label: "Stocks & IPOs",
    desc: "Direct equity research, IPO tracker, broker comparison",
    href: "/stocks",
    icon: Landmark,
    stat: "Live NSE / BSE data",
  },
  {
    label: "Demat accounts",
    desc: "Compare brokerage charges, AMC, platform features across 12 brokers",
    href: "/demat-accounts",
    icon: PiggyBank,
    stat: "12 brokers compared",
  },
];

// CMS-MIGRATION: asset-class returns — move to `asset_returns` table with
// (asset, period, cagr, source, as_of). 5y/10y CAGR updated annually.
// Sources cited inline so editorial accuracy is auditable.
const ASSET_RETURNS = [
  {
    asset: "Equity (Nifty 50 TRI)",
    cagr5y: "+15.2%",
    cagr10y: "+12.8%",
    risk: "High",
    source: "NSE Indices · TRI series",
  },
  {
    asset: "Mid-cap (Nifty Midcap 150 TRI)",
    cagr5y: "+22.4%",
    cagr10y: "+16.1%",
    risk: "High",
    source: "NSE Indices",
  },
  {
    asset: "Debt funds (CRISIL composite)",
    cagr5y: "+6.4%",
    cagr10y: "+7.2%",
    risk: "Low",
    source: "CRISIL · pre-tax",
  },
  {
    asset: "Gold (INR)",
    cagr5y: "+13.1%",
    cagr10y: "+9.4%",
    risk: "Medium",
    source: "MCX spot · INR/10g",
  },
  {
    asset: "Real estate (residential)",
    cagr5y: "+4.8%",
    cagr10y: "+5.2%",
    risk: "Medium",
    source: "RBI Housing Price Index",
  },
  {
    asset: "PPF",
    cagr5y: "+7.1%",
    cagr10y: "+7.6%",
    risk: "Sovereign",
    source: "Min. of Finance · current rate",
  },
];
const ASSET_RETURNS_AS_OF = "FY 2026-27 · As of Mar 31, 2026";

// CMS-MIGRATION: decision cards — move to `editorial_hubs` placement
// 'investing-decisions' or a dedicated `comparison_picks` table later.
const DECISIONS = [
  {
    question: "SIP vs lumpsum?",
    answer:
      "SIP wins in volatile or down markets via rupee-cost averaging. Lumpsum wins after a clear correction.",
    href: "/calculators/sip-vs-lumpsum-comparison",
  },
  {
    question: "Index vs active fund?",
    answer:
      "Most large-cap active funds underperform Nifty 50 over 10y net of expense. Index wins by default.",
    href: "/calculators/index-vs-active-fund",
  },
  {
    question: "PPF vs ELSS?",
    answer:
      "PPF: guaranteed 7.1% tax-free, 15y. ELSS: market returns, 3y lock-in. PPF for floor, ELSS for upside.",
    href: "/calculators/ppf-vs-elss",
  },
  {
    question: "NPS vs PPF?",
    answer:
      "NPS adds ₹50K extra deduction (80CCD-1B), but 60% lump-sum + 40% mandatory annuity at 60.",
    href: "/calculators/nps-vs-ppf",
  },
];

type LatestArticle = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  featured_image: string | null;
  read_time: string | number | null;
  published_at: string | null;
};

async function getLatestInvestingArticles(): Promise<LatestArticle[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("articles")
    .select(
      "slug, title, excerpt, category, featured_image, read_time, published_at",
    )
    .eq("status", "published")
    .in("category", [
      "investing",
      "investing-basics",
      "mutual-funds",
      "mutual_fund",
      "stocks",
      "ipo",
      "retirement",
      "demat-accounts",
      "demat_account",
    ])
    .order("published_at", { ascending: false })
    .limit(6);
  return (data as LatestArticle[]) ?? [];
}

function formatReadTime(rt: string | number | null): string {
  if (!rt) return "";
  const n = typeof rt === "string" ? parseInt(rt, 10) : rt;
  return Number.isFinite(n) && n > 0 ? `${n} min read` : "";
}

export default async function InvestingHubPage() {
  const [articles, calculators] = await Promise.all([
    getLatestInvestingArticles(),
    getEditorialHubs("investing-calculators"),
  ]);

  const investmentDesk = TEAM_MEMBERS.find((m) => m.slug === "investment-desk");
  const deskSchema = investmentDesk
    ? deskOrganizationSchema(investmentDesk)
    : null;

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
        name: "Investing",
        item: generateCanonicalUrl("/investing"),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {deskSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(deskSchema) }}
        />
      )}

      {/* ── Hero — ink ──────────────────────────────────────────────── */}
      <section className="surface-ink pt-10 pb-16">
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
              <li className="text-canvas">Investing</li>
            </ol>
          </nav>

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-5">
            Build wealth · The boring way wins
          </div>

          <h1 className="font-display font-black text-[48px] md:text-[72px] lg:text-[84px] leading-[0.98] tracking-tight text-canvas max-w-[1000px]">
            Investing,{" "}
            <span className="text-indian-gold">without the noise.</span>
          </h1>

          <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[740px]">
            Mutual funds, stocks, ELSS, PPF, NPS — compared with real Indian
            data, not US frameworks. No commission. No paid placements.
          </p>
        </div>
      </section>

      {/* ── Live market strip — canvas, mono ─────────────────────────── */}
      <section className="bg-canvas border-b border-ink-12">
        <div className="max-w-[1280px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold">
              Markets · Indicative
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60">
              Updated {MARKET_QUOTES_AS_OF}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-4 font-mono">
            {MARKET_QUOTES.map((q) => (
              <div key={q.label}>
                <div className="text-[10px] uppercase tracking-wider text-ink-60">
                  {q.label}
                </div>
                <div className="text-[20px] font-black text-ink mt-1">
                  {q.value}
                </div>
                <div
                  className={`text-[11px] font-bold mt-0.5 ${
                    q.trend === "up" ? "text-action-green" : "text-warning-red"
                  }`}
                >
                  {q.delta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Desk byline ──────────────────────────────────────────────── */}
      <section className="bg-canvas border-b border-ink-12 py-6">
        <div className="max-w-[1280px] mx-auto px-6">
          <DeskByline category="investing" />
        </div>
      </section>

      {/* ── Personas — canvas ───────────────────────────────────────── */}
      <section className="bg-canvas py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
            Where you are right now
          </div>
          <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight mb-3">
            Pick your stage
          </h2>
          <p className="font-serif text-[17px] text-ink-60 max-w-[720px] mb-10">
            The right move at 25 is not the right move at 55. Start where you
            actually are — not where you wish you were.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PERSONAS.map((p) => (
              <Link
                key={p.label}
                href={p.href}
                className="group block bg-white border border-ink-12 rounded-sm p-6 hover:border-indian-gold transition-colors"
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold">
                  {p.age}
                </div>
                <h3 className="mt-4 font-display text-[24px] font-black text-ink leading-tight group-hover:text-authority-green transition-colors">
                  {p.label}
                </h3>
                <p className="mt-3 text-[13px] text-ink-60 leading-[1.55]">
                  {p.intent}
                </p>
                <div className="mt-5 flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-ink group-hover:text-indian-gold transition-colors">
                  Start here <ArrowUpRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Investment categories — canvas ─────────────────────────── */}
      <section className="bg-canvas border-t border-ink-12 py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
            Vehicles
          </div>
          <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight mb-10">
            Where the money goes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INVEST_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="group block bg-white border border-ink-12 rounded-sm p-6 hover:border-indian-gold transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <Icon
                      className="w-5 h-5 text-indian-gold"
                      strokeWidth={1.75}
                    />
                    {cat.badge && (
                      <span className="font-mono text-[9px] uppercase tracking-wider bg-indian-gold text-ink px-2 py-0.5">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-[22px] font-black text-ink leading-tight group-hover:text-authority-green transition-colors">
                    {cat.label}
                  </h3>
                  <p className="mt-2 text-[13px] text-ink-60 leading-[1.55]">
                    {cat.desc}
                  </p>
                  <div className="mt-5 font-mono text-[10px] uppercase tracking-wider text-indian-gold">
                    {cat.stat}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Asset class returns — canvas ─────────────────────────────── */}
      <section className="bg-canvas py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
            Indian asset class returns
          </div>
          <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight mb-3">
            What works over a decade
          </h2>
          <p className="font-serif text-[17px] text-ink-60 max-w-[720px] mb-10">
            Past performance isn&apos;t indicative — but pretending all assets
            return the same is lying. {ASSET_RETURNS_AS_OF}.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] font-mono text-[14px]">
              <thead>
                <tr className="border-b border-ink-12">
                  <th className="text-left py-3 pr-6 text-[10px] uppercase tracking-wider text-ink-60 font-normal">
                    Asset
                  </th>
                  <th className="text-right py-3 px-4 text-[10px] uppercase tracking-wider text-ink-60 font-normal">
                    5y CAGR
                  </th>
                  <th className="text-right py-3 px-4 text-[10px] uppercase tracking-wider text-indian-gold font-normal">
                    10y CAGR
                  </th>
                  <th className="text-right py-3 px-4 text-[10px] uppercase tracking-wider text-ink-60 font-normal">
                    Risk
                  </th>
                  <th className="text-left py-3 pl-4 text-[10px] uppercase tracking-wider text-ink-60 font-normal">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {ASSET_RETURNS.map((row) => (
                  <tr
                    key={row.asset}
                    className="border-b border-ink-12 hover:bg-ink/5"
                  >
                    <td className="py-4 pr-6 text-[14px] text-ink">
                      {row.asset}
                    </td>
                    <td className="py-4 px-4 text-right text-[14px] text-ink-60">
                      {row.cagr5y}
                    </td>
                    <td className="py-4 px-4 text-right text-[14px] text-indian-gold font-bold">
                      {row.cagr10y}
                    </td>
                    <td className="py-4 px-4 text-right text-[14px] text-ink-60">
                      {row.risk}
                    </td>
                    <td className="py-4 pl-4 text-[11px] text-ink-60">
                      {row.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-mono text-[11px] text-ink-60 mt-6 max-w-[720px] leading-[1.6]">
            CAGR figures are pre-tax, in INR, computed on price returns where
            TRI/composite series are unavailable. Real estate excludes
            transaction cost and taxes — actual realized return is typically 2-3
            percentage points lower.
          </p>
        </div>
      </section>

      {/* ── Calculator picks — canvas ───────────────────────────────── */}
      {calculators.length > 0 && (
        <section className="bg-canvas border-t border-ink-12 py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
                  Run the numbers
                </div>
                <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight">
                  Investing calculators
                </h2>
              </div>
              <Link
                href="/investing/calculators"
                className="font-mono text-[11px] uppercase tracking-wider text-ink-60 hover:text-indian-gold transition-colors inline-flex items-center gap-1"
              >
                All 29 investing calculators{" "}
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {calculators.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group block bg-white border border-ink-12 rounded-sm p-6 hover:border-indian-gold transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[22px] font-black text-indian-gold leading-none">
                      {c.accent ?? "·"}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-ink-60 group-hover:text-indian-gold transition-colors" />
                  </div>
                  <h3 className="mt-6 font-display text-[20px] font-black text-ink leading-tight group-hover:text-authority-green transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-ink-60 leading-[1.5]">
                    {c.tagline}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Decisions worth making — canvas ─────────────────────────── */}
      <section className="bg-canvas py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
            Decisions worth running
          </div>
          <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight mb-3">
            Should you do A or B?
          </h2>
          <p className="font-serif text-[17px] text-ink-60 max-w-[720px] mb-10">
            Four comparisons every Indian investor runs at some point. Run yours
            with your numbers — not a generic rule of thumb.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DECISIONS.map((d) => (
              <Link
                key={d.question}
                href={d.href}
                className="group block bg-white border border-ink-12 rounded-sm p-6 hover:border-indian-gold transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-[22px] font-black text-ink leading-tight group-hover:text-authority-green transition-colors">
                    {d.question}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-ink-60 group-hover:text-indian-gold transition-colors flex-shrink-0 mt-1" />
                </div>
                <p className="mt-4 text-[14px] text-ink-60 leading-[1.55]">
                  {d.answer}
                </p>
                <div className="mt-5 font-mono text-[10px] uppercase tracking-wider text-indian-gold">
                  Open the comparison →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest articles — canvas ───────────────────────────────── */}
      {articles.length > 0 && (
        <section className="bg-canvas border-t border-ink-12 py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
                  From the desk
                </div>
                <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight">
                  Latest investing analysis
                </h2>
              </div>
              <Link
                href="/investing/learn"
                className="font-mono text-[11px] uppercase tracking-wider text-ink-60 hover:text-indian-gold transition-colors inline-flex items-center gap-1"
              >
                All investing articles <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <Link key={a.slug} href={articleUrl(a)} className="group block">
                  {a.featured_image ? (
                    <div className="relative aspect-[16/10] bg-ink-12 overflow-hidden rounded-sm mb-4">
                      <Image
                        src={a.featured_image}
                        alt={a.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-ink/5 rounded-sm mb-4" />
                  )}
                  <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-2">
                    Investment Desk
                    {formatReadTime(a.read_time)
                      ? ` · ${formatReadTime(a.read_time)}`
                      : ""}
                  </div>
                  <h3 className="font-display text-[20px] font-black text-ink leading-[1.2] group-hover:text-authority-green transition-colors">
                    {a.title}
                  </h3>
                  {a.excerpt && (
                    <p className="mt-3 text-[13px] text-ink-60 leading-[1.55] line-clamp-3">
                      {a.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ — DB-driven ─────────────────────────────────────────── */}
      <CategoryFAQ urlCategory="investing" variant="canvas" />

      {/* ── Newsletter CTA — ink ─────────────────────────────────────── */}
      <section className="surface-ink py-14">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
              This week in Indian money
            </div>
            <h3 className="font-display font-black text-[26px] md:text-[32px] text-canvas leading-tight max-w-[640px]">
              Every Sunday — one investing decision worth making, one to avoid,
              one rule change.
            </h3>
          </div>
          <Link
            href="/#newsletter"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indian-gold text-ink font-bold text-[14px] tracking-wide rounded-sm hover:bg-indian-gold/90 transition-colors"
          >
            Subscribe free
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
