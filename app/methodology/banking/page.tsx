/**
 * Methodology — Banking (per-segment rubric)
 *
 * Sub-page of /methodology covering Indian deposit products: bank
 * FDs, post office sovereign schemes, savings accounts, RDs, and
 * structured schemes (PPF, NPS, SCSS, SSY). Banking products are
 * commodity-like — interest rate dominates — but DICGC coverage,
 * sovereign vs non-sovereign backing, and senior-citizen premiums
 * change the economics enough that one rubric does not fit all.
 */

import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { generateCanonicalUrl } from "@/lib/linking/canonical";

export const revalidate = 86400;
const LAST_UPDATED = "2026-04-26";
const VERSION = "1.0";

export const metadata: Metadata = {
  title: "How We Rate Banking Products — Per-Segment Methodology",
  description:
    "InvestingPro's methodology for rating Indian bank FDs, post office schemes, savings accounts, RDs, PPF, NPS, SCSS, SSY. Adjusted for DICGC coverage, sovereign backing, senior premiums.",
  alternates: { canonical: generateCanonicalUrl("/methodology/banking") },
  openGraph: {
    title: "How We Rate Banking Products — Methodology",
    description:
      "Per-segment scoring for FDs, savings accounts, post office schemes, structured deposits.",
    url: generateCanonicalUrl("/methodology/banking"),
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
    name: "Scheduled bank FDs",
    intro:
      "DICGC-insured up to ₹5 L per depositor per bank. Rate dominates because everything else (premature withdrawal terms, auto-renewal) is largely standardised. We weight 1y/3y/5y rates by the typical Indian retail FD-tenure mix.",
    formula:
      "Rate (tenure-mix-weighted) 60% · Bank safety 20% · Operational ease 10% · Premature withdrawal terms 10%",
    primaryFactors: [
      {
        label: "Effective rate (regular + senior)",
        weight: 60,
        note: "Tenure-mix-weighted: 1y 35%, 3y 35%, 5y 25%, 10y 5%. Senior-citizen premium (typically 0.50%) scored separately.",
      },
      {
        label: "Bank safety + DICGC coverage",
        weight: 20,
        note: "Scheduled-commercial-bank status, capital adequacy ratio, last RBI inspection finding. DICGC ₹5L cap noted; concentration above ₹5L per bank flagged.",
      },
      {
        label: "Premature withdrawal penalty",
        weight: 10,
        note: "Penalty %, partial withdrawal allowed, loan-against-FD option (typically up to 90% LTV at +1% over FD rate).",
      },
      {
        label: "Operational ease",
        weight: 10,
        note: "Online booking, NEFT/RTGS funding, e-mandate auto-renewal, consolidated TDS statement.",
      },
    ],
  },
  {
    name: "Small Finance Bank (SFB) FDs",
    intro:
      "Higher rates than scheduled banks (typically +0.50–1.50%), but capital-adequacy and concentration risk demand a different rubric. DICGC ₹5L still applies. Senior-citizen premiums often more aggressive at SFBs.",
    formula:
      "Rate 50% · Bank safety 30% · Concentration risk 10% · Operational ease 10%",
    primaryFactors: [
      {
        label: "Effective rate (regular + senior)",
        weight: 50,
        note: "Same tenure-mix as scheduled banks. SFBs often offer 0.5-1.5% premium — but only at higher CAR / better RBI profile do we treat the premium as durable.",
      },
      {
        label: "Capital adequacy + RBI inspection",
        weight: 30,
        note: "CRAR % (regulator floor 15%), recent RBI penalty events, NPA trend, deposit growth. SFBs vary widely.",
      },
      {
        label: "Concentration risk warning",
        weight: 10,
        note: "Above DICGC ₹5L cap, your deposit is unsecured. We flag prominently. Recommended pattern: split across 2-3 SFBs to keep each under ₹5L.",
      },
      {
        label: "Operational ease",
        weight: 10,
        note: "Branch presence, mobile app maturity, payments-bank ecosystem integration.",
      },
    ],
  },
  {
    name: "Post office FDs + sovereign schemes",
    intro:
      "Government-backed (sovereign credit), DICGC not applicable but irrelevant — these are guaranteed by Government of India. Post Office Time Deposit, KVP, NSC, MIS, SCSS, SSY, PPF. Each has its own mechanics; we score accessibility + liquidity + tax treatment.",
    formula:
      "Effective post-tax return 45% · Liquidity 20% · Tax efficiency 20% · Operational friction 15%",
    primaryFactors: [
      {
        label: "Headline interest rate",
        weight: 30,
        note: "Government-set quarterly. POTD, KVP, NSC, SCSS, SSY each have their own rate schedule. SSY (girl-child) and SCSS (senior) typically highest.",
      },
      {
        label: "Tax treatment",
        weight: 20,
        note: "PPF (EEE), SSY (EEE), NSC (E-T-T with reinvestment), SCSS (T-T-T), POTD (T-T-T). Effective post-tax yield is the actual comparison metric.",
      },
      {
        label: "Liquidity + lock-in",
        weight: 20,
        note: "PPF 15y lock-in (with partial-withdraw window), SSY 21y, NSC 5y, SCSS 5y. Some are illiquid except via scheme rules — score accordingly.",
      },
      {
        label: "Eligibility narrowness",
        weight: 15,
        note: "SSY (girl child only), SCSS (60+ only). Restrictions reduce the addressable scoring weight.",
      },
      {
        label: "Operational friction",
        weight: 15,
        note: "Post office branch dependency, paper-based KYC, limited online presence (improving via India Post Payments Bank but uneven).",
      },
    ],
  },
  {
    name: "Savings accounts",
    intro:
      "Liquidity product, not investment. Rate matters less than fee structure, ATM access, mobile-banking quality. Some banks offer 6%+ on savings for digital-first banks vs 2.7-3.5% standard.",
    formula:
      "Rate 30% · Fee structure 25% · Digital banking quality 25% · Branch + ATM access 10% · Sweep + auto-FD 10%",
    primaryFactors: [
      {
        label: "Effective interest rate",
        weight: 30,
        note: "Tiered? Many banks pay higher rate above ₹50L only. Effective rate at typical balance (₹25K–₹2L) is the metric.",
      },
      {
        label: "Fee structure",
        weight: 25,
        note: "Min balance penalty, ATM transaction fee (after free quota), debit-card AMC, statement fee, NEFT/RTGS fee.",
      },
      {
        label: "Digital banking quality",
        weight: 25,
        note: "App reliability, UPI integration, instant FD booking, e-statement clarity, customer-care SLA.",
      },
      {
        label: "Branch + ATM access",
        weight: 10,
        note: "ATM count + tie-ups (e.g., NPCI shared network). Branch density for cash deposit.",
      },
      {
        label: "Sweep / auto-FD",
        weight: 10,
        note: "Auto-sweep above threshold into FD. Important for liquidity-conscious users who want savings-account flexibility + FD-rate yield.",
      },
    ],
  },
  {
    name: "Recurring deposits (RDs)",
    intro:
      "Disciplined-saver product. Interest math same as FD but applied progressively. We score versus systematic alternatives (SIP-in-debt-fund, sweep-FD).",
    formula:
      "Rate 50% · Flexibility 25% · Penalty terms 15% · Tax treatment 10%",
    primaryFactors: [
      {
        label: "Effective interest rate",
        weight: 50,
        note: "Same as FD typically. Tenure-mix-weighted 6m-10y.",
      },
      {
        label: "Flexibility (skip / pause / step-up)",
        weight: 25,
        note: "Some banks allow missed-installment skip + step-up RD (good for income-growing users). Most do not.",
      },
      {
        label: "Penalty for missed installment",
        weight: 15,
        note: "Penalty per missed month, usually ₹1-3 per ₹100 of installment.",
      },
      {
        label: "Tax treatment",
        weight: 10,
        note: "TDS at 10% above ₹40K interest (₹50K for senior). Tax-saver RDs (5y lock-in) get 80C benefit but rate often lower.",
      },
    ],
  },
];

const STANDARDISED_ADJUSTMENTS = [
  "DICGC concentration risk warning when single-bank deposit > ₹5 L (always disclosed)",
  "Recent RBI moratorium / penalty event on the bank −0.5 to −1.0 stars",
  "Senior-citizen premium > 75 bps over base rate +0.0 to +0.2 stars",
  "Tax-saver variant (5y lock-in for FD) that gets 80C benefit, scored separately",
  "Auto-renewal default favourable to depositor +0.0 to +0.1 stars",
  "Hidden fees on premature withdrawal beyond standard −0.2 to −0.5 stars",
];

const DATA_SOURCES = [
  {
    label: "RBI bank-wise CAR + NPA data",
    note: "Quarterly disclosures. Capital-adequacy ratio, gross-NPA ratio, deposit growth, recent inspection findings.",
  },
  {
    label: "DICGC list of insured banks",
    note: "Confirms DICGC coverage status. Updates when banks join / leave / are sanctioned.",
  },
  {
    label: "Bank-issued rate cards",
    note: "Public rate schedules per bank, refreshed weekly. Tracked changes.",
  },
  {
    label: "India Post / Department of Economic Affairs",
    note: "Quarterly small-savings rate notifications (PPF, SCSS, SSY, KVP, NSC, MIS).",
  },
  {
    label: "RBI ombudsman quarterly reports",
    note: "Bank-wise complaint volume, dispute resolution time.",
  },
];

export default function BankingMethodology() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How We Rate Banking Products",
    datePublished: "2026-04-26T00:00:00+05:30",
    dateModified: `${LAST_UPDATED}T00:00:00+05:30`,
    author: {
      "@type": "Organization",
      name: "InvestingPro Banking Desk",
      url: generateCanonicalUrl("/about/editorial-team"),
    },
    publisher: {
      "@type": "Organization",
      name: "InvestingPro",
      url: "https://investingpro.in",
    },
    mainEntityOfPage: generateCanonicalUrl("/methodology/banking"),
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
        name: "Banking",
        item: generateCanonicalUrl("/methodology/banking"),
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
              <li className="text-canvas">Banking</li>
            </ol>
          </nav>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            Banking Desk · Methodology v{VERSION} · last updated {LAST_UPDATED}
          </div>
          <h1 className="font-display font-black text-[44px] md:text-[64px] leading-[1.02] tracking-tight text-canvas max-w-[860px]">
            How we rate{" "}
            <span className="text-indian-gold">banking products</span>.
          </h1>
          <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[820px]">
            Five segments — bank FDs, SFB FDs, post office sovereign schemes,
            savings accounts, RDs — each with its own scoring rubric. DICGC ₹5L
            coverage, sovereign backing, and senior-citizen premiums change the
            economics enough that we don't pretend a single formula captures all
            of them.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-wider text-canvas-70">
            <span>· DICGC + sovereign scoring</span>
            <span>· Tenure-mix weighted</span>
            <span>· Banking Desk owns it</span>
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
                  <div className="grid grid-cols-[1fr_70px] md:grid-cols-[220px_1fr_60px] bg-ink/5 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-ink-60">
                    <div>Factor</div>
                    <div className="hidden md:block">What we measure</div>
                    <div className="text-right">Weight</div>
                  </div>
                  {seg.primaryFactors.map((f) => (
                    <div
                      key={f.label}
                      className="grid grid-cols-[1fr_70px] md:grid-cols-[220px_1fr_60px] px-4 py-3 border-t border-ink-12 items-baseline"
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
                  <div className="grid grid-cols-[1fr_70px] md:grid-cols-[220px_1fr_60px] px-4 py-2.5 border-t-2 border-ink-12 bg-ink/5 items-baseline">
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
              <strong className="text-ink">Weekly:</strong> Bank-rate scrape
              every Tuesday morning IST. Scheduled-commercial banks + SFBs +
              post office.
            </li>
            <li>
              <strong className="text-ink">Quarterly:</strong> Small-savings
              rate notification + RBI bank-wise CAR/NPA review.
            </li>
            <li>
              <strong className="text-ink">Event-triggered:</strong> RBI
              moratorium / penalty / merger / sanction → immediate re-score
              within 24 hours.
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
                Loans (personal, home, car, education, gold, business)
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
                Insurance (term, health)
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
            Banking methodology v{VERSION} · last updated {LAST_UPDATED}
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
              Banking Desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
