/**
 * Methodology — Demat brokers (per-segment rubric)
 *
 * Sub-page of /methodology covering Indian discount brokers,
 * full-service brokers, online-only platforms, mobile-app-first
 * brokers, and F&O / MTF specialists. Brokerage is the easy
 * comparison; what actually matters is platform uptime + execution
 * quality + complaint resolution. We anchor to SEBI SCORES
 * complaint-per-active-client data + NSE/BSE technical-glitch
 * incident logs + audited active-client counts.
 */

import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { generateCanonicalUrl } from "@/lib/linking/canonical";

export const revalidate = 86400;
const LAST_UPDATED = "2026-04-26";
const VERSION = "1.0";

export const metadata: Metadata = {
  title: "How We Rate Demat Brokers — Per-Segment Methodology",
  description:
    "InvestingPro's demat-broker rating methodology for India: brokerage transparency, platform reliability, SEBI complaint ratio, F&O execution. Anchored to SEBI SCORES + NSE/BSE incident data.",
  alternates: { canonical: generateCanonicalUrl("/methodology/brokers") },
  openGraph: {
    title: "How We Rate Demat Brokers — Methodology",
    description:
      "Per-segment scoring for discount, full-service, mobile-first and F&O brokers in India.",
    url: generateCanonicalUrl("/methodology/brokers"),
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
    name: "Discount brokers (flat-fee equity)",
    intro:
      "Zerodha-style economics — flat ₹20 per executed order or zero on equity delivery. Brokerage is already a near-commodity, so the score weights platform reliability + complaint resolution heaviest. A broker that's ₹5 cheaper but goes down on expiry day costs the user 100× the savings.",
    formula:
      "Platform reliability 30% · SEBI complaint ratio 25% · Brokerage transparency 20% · Trading tools 15% · Onboarding + KYC speed 10%",
    primaryFactors: [
      {
        label: "Platform reliability (uptime + glitches)",
        weight: 30,
        note: "NSE/BSE technical-glitch incident log + crowdsourced downtime reports + broker's own published uptime SLA. Expiry-day outages weighted 3× regular outages.",
      },
      {
        label: "SEBI complaint ratio (per 1,000 active clients)",
        weight: 25,
        note: "SEBI SCORES portal published complaints divided by NSE/BSE active-client count. Resolution speed + reopened-complaint ratio also factor in.",
      },
      {
        label: "Brokerage + total cost transparency",
        weight: 20,
        note: "Equity / intraday / F&O / commodity per-order rates + DP charges + AMC + call-and-trade. Hidden charges (e.g., crossed-trade fee, square-off fee) penalised.",
      },
      {
        label: "Trading tools (charts, watchlist, basket order)",
        weight: 15,
        note: "Native charting depth, basket / GTT orders, alerts, paper-trading, post-market analysis. Bonus for open API access.",
      },
      {
        label: "Onboarding speed + KYC experience",
        weight: 10,
        note: "Account-open TAT (instant vs 3-day), digital KYC reliability, in-person hassle. Sub-24-hour fully-digital wins.",
      },
    ],
  },
  {
    name: "Full-service brokers",
    intro:
      "HDFC Securities, ICICI Direct, Kotak Securities, Axis Direct — broker bundled with bank account + research advisory + relationship manager. Higher brokerage (typically 0.3–0.5% delivery, 0.03% intraday) is acceptable only if research quality + bank-integration value justifies it. We weight research depth + 3-in-1 account integration.",
    formula:
      "Research quality 30% · 3-in-1 integration 20% · SEBI complaint ratio 20% · Platform reliability 15% · Brokerage value 15%",
    primaryFactors: [
      {
        label: "Research quality (calls + reports + accuracy)",
        weight: 30,
        note: "Number of analyst-covered stocks, hit rate of buy/sell calls (rolling 12-month), depth of macro/sector research, IPO note quality. We track call accuracy via Bloomberg / public-record audit.",
      },
      {
        label: "3-in-1 account integration (savings + demat + trading)",
        weight: 20,
        note: "Seamless fund flow between bank → demat → trading without OTP friction. ASBA IPO experience. Margin top-up speed.",
      },
      {
        label: "SEBI complaint ratio",
        weight: 20,
        note: "Same SCORES + active-client framework as discount brokers.",
      },
      {
        label: "Platform reliability",
        weight: 15,
        note: "Web + mobile uptime. Full-service brokers historically slower at platform-modernisation; we score current state.",
      },
      {
        label: "Brokerage + total cost relative to research delivered",
        weight: 15,
        note: "Premium pricing is acceptable only if research / advisory clearly justifies it. We compare against discount-broker baseline + research-quality adjusted.",
      },
    ],
  },
  {
    name: "Online-only modern platforms",
    intro:
      "Dhan, Fyers, Angel One (post-flat-fee shift) — discount-fee economics + heavier feature stack (advanced order types, options strategies, scanners). User base skews active-trader and product-led. Score weights tools + execution quality + uptime over advisory.",
    formula:
      "Trading tools depth 30% · Platform reliability 25% · SEBI complaint ratio 20% · Brokerage value 15% · API + integrations 10%",
    primaryFactors: [
      {
        label: "Trading tools depth (scanners, strategies, backtesting)",
        weight: 30,
        note: "Pre-built option strategies (covered call, iron condor), strategy backtesting, real-time scanners, pattern detection, bracket orders. Number of supported order types is a proxy for sophistication.",
      },
      {
        label: "Platform reliability (uptime, latency, expiry-day stability)",
        weight: 25,
        note: "Crowdsourced + broker-published uptime. Order-confirmation latency. Expiry-Tuesday/Thursday performance heavily weighted given the F&O lean.",
      },
      {
        label: "SEBI complaint ratio",
        weight: 20,
        note: "Same SCORES framework. Note: complaint counts are proportional to client volume — we normalise per 1,000 active clients.",
      },
      {
        label: "Brokerage + cost transparency",
        weight: 15,
        note: "Flat-fee structure clarity, MTF interest rate, exit-load on F&O squareoff, DP charges.",
      },
      {
        label: "API access + algo / fintech integrations",
        weight: 10,
        note: "Open API for retail (with documented rate limits), integration with TradingView / Sensibull / Streak. Bonus for sandbox + free tier.",
      },
    ],
  },
  {
    name: "Mobile-app-first brokers",
    intro:
      "Groww, Paytm Money, Kuvera, INDmoney — onboarding-led platforms whose primary pull is friction-less mobile UX + entry-level investor education. Often double as MF + equity + bonds + US-stocks aggregators. Score weights UX + ease of first-trade + product breadth.",
    formula:
      "Mobile UX + onboarding 30% · Product breadth (MF + equity + bonds + US) 25% · SEBI complaint ratio 20% · Platform reliability 15% · Cost transparency 10%",
    primaryFactors: [
      {
        label: "Mobile UX + first-trade friction",
        weight: 30,
        note: "Account-open to first-trade in <30 minutes. Clarity of trade-confirmation UI. Number of taps to place a market order. Beginner-onboarding clarity.",
      },
      {
        label: "Product breadth (MF + equity + bonds + US stocks + IPOs)",
        weight: 25,
        note: "Number of investable categories under one roof. Direct vs Regular MF clarity. US-stock fractional support. SGB / bond marketplace quality.",
      },
      {
        label:
          "SEBI complaint ratio (mobile-first complaints often UX-related)",
        weight: 20,
        note: "SCORES + per-1,000-active-clients. Mobile-first brokers historically score worse on complaint density due to younger / first-time investor base — we normalise for tenure.",
      },
      {
        label: "Platform reliability",
        weight: 15,
        note: "Mobile + web uptime + push-notification reliability for order fills. App-store crash rate.",
      },
      {
        label: "Brokerage + cost transparency",
        weight: 10,
        note: "Most mobile-first brokers are free on equity delivery; we score F&O + MTF + DP charges + AMC clarity.",
      },
    ],
  },
  {
    name: "F&O / MTF specialists",
    intro:
      "Brokers preferred by active F&O traders + leveraged-equity (MTF / margin) users. Execution latency, margin policies, and uptime on expiry days are existentially important — a 30-second delay in F&O squareoff can wipe a position. Score weights execution + margin + uptime over UX.",
    formula:
      "Expiry-day uptime 35% · Margin + MTF policy 25% · Execution latency 15% · Brokerage on F&O lots 15% · SEBI complaint ratio 10%",
    primaryFactors: [
      {
        label: "Expiry-day uptime + outage history",
        weight: 35,
        note: "Tuesday (BSE) + Thursday (NSE) weekly expiry uptime. Past expiry-day outage incidents tracked from NSE/BSE technical-glitch logs + user reports. Even one major outage in the last 12 months caps this score.",
      },
      {
        label: "Margin + MTF policy",
        weight: 25,
        note: "Span + exposure margin transparency, MTF interest rate (annualised), pledged-stock haircut, intraday-leverage rules. Intraday squareoff timing + autoclose-fee structure scored.",
      },
      {
        label: "Execution latency (order to confirmation)",
        weight: 15,
        note: "Median latency in milliseconds, slippage on fast-moving F&O. Co-location / exchange-proximity infrastructure is a differentiator at the high end.",
      },
      {
        label: "Brokerage on F&O + MTF lots",
        weight: 15,
        note: "Per-lot fee for futures + per-lot for options. Cap on absolute brokerage per order. STT impact transparency.",
      },
      {
        label: "SEBI complaint ratio (F&O complaints often margin / squareoff)",
        weight: 10,
        note: "Same SCORES framework, with extra weight on margin-related + auto-squareoff complaints.",
      },
    ],
  },
];

const STANDARDISED_ADJUSTMENTS = [
  "Recent SEBI penalty / restraint order on broker −0.4 to −0.8 stars",
  "NSE/BSE technical-glitch incident in last 6 months −0.2 to −0.5 stars",
  "Client-funds misuse / pledged-shares misuse history −0.5 to −1.0 stars",
  "Major data-breach / KYC leak in last 12 months −0.3 to −0.6 stars",
  "ISO 27001 / SOC 2 certification + published security disclosure +0.0 to +0.1 stars",
  "Open API + retail-developer ecosystem traction +0.0 to +0.2 stars",
  "Public earnings + audited active-client count (transparency) +0.0 to +0.1 stars",
];

const DATA_SOURCES = [
  {
    label: "SEBI SCORES portal",
    note: "Per-broker complaint count, resolution time, reopened-complaint ratio. Pulled monthly. Normalised per 1,000 active clients to account for size.",
  },
  {
    label: "NSE + BSE active-client + glitch logs",
    note: "Audited active-client counts (released monthly). NSE/BSE published technical-glitch incidents. Clearing-corp default events.",
  },
  {
    label: "Broker-published rate cards + KYC kit",
    note: "Brokerage + DP + AMC + margin rate audited monthly. Hidden charges flagged.",
  },
  {
    label: "Crowdsourced uptime monitors",
    note: "Aggregate downtime reports from Downdetector + Reddit r/IndianStreetBets + Twitter mentions. Cross-verified against broker's status page.",
  },
  {
    label: "Regulatory filings + annual reports",
    note: "Listed brokers (Angel One, IIFL Sec, Motilal Oswal, etc.): audited revenue, client-funds quantum, active-client trajectory.",
  },
  {
    label: "In-house broker audit",
    note: "Editorial team opens + funds + trades on each rated broker quarterly to verify onboarding TAT, order latency, fund-withdrawal SLA, support responsiveness.",
  },
];

export default function BrokersMethodology() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How We Rate Demat Brokers",
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
    mainEntityOfPage: generateCanonicalUrl("/methodology/brokers"),
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
        name: "Brokers",
        item: generateCanonicalUrl("/methodology/brokers"),
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
              <li className="text-canvas">Brokers</li>
            </ol>
          </nav>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            Investment Desk · Methodology v{VERSION} · last updated{" "}
            {LAST_UPDATED}
          </div>
          <h1 className="font-display font-black text-[44px] md:text-[64px] leading-[1.02] tracking-tight text-canvas max-w-[860px]">
            How we rate <span className="text-indian-gold">demat brokers</span>.
          </h1>
          <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[820px]">
            Five segments — discount, full-service, online-only modern,
            mobile-app-first, F&amp;O / MTF specialist — each scored on its own
            rubric. Brokerage is already near-commoditised; the score weights
            platform reliability, expiry-day uptime, and SEBI SCORES complaint
            ratio over per-order fees.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-wider text-canvas-70">
            <span>· SEBI SCORES anchored</span>
            <span>· Uptime weighted heavily</span>
            <span>· Investment Desk owns it</span>
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
              <strong className="text-ink">Monthly:</strong> SEBI SCORES
              complaint pull, NSE/BSE active-client count, broker rate-card
              audit.
            </li>
            <li>
              <strong className="text-ink">Quarterly:</strong> In-house broker
              audit (account-open + trade + withdraw cycle on each rated
              broker).
            </li>
            <li>
              <strong className="text-ink">Event-triggered:</strong> SEBI
              penalty / NSE/BSE technical-glitch / client-funds incident →
              re-score within 7 days.
            </li>
            <li>
              <strong className="text-ink">Annually:</strong> Full rubric
              refresh after RBI / SEBI annual reports + listed-broker audited
              filings.
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
                href="/methodology/mutual-funds"
                className="text-indian-gold hover:underline"
              >
                Mutual funds
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
            Brokers methodology v{VERSION} · last updated {LAST_UPDATED}
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
