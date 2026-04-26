/**
 * Methodology — Insurance (per-segment rubric)
 *
 * Sub-page of /methodology covering Indian insurance products: term
 * life, health (individual / family-floater), motor, travel. Premium
 * is the easy comparison; what actually decides outcomes is whether
 * the policy pays when claimed — that's IRDAI claim-settlement-ratio
 * + claim-settled-on-time data. We weight CSR heavily.
 */

import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { generateCanonicalUrl } from "@/lib/linking/canonical";

export const revalidate = 86400;
const LAST_UPDATED = "2026-04-26";
const VERSION = "1.0";

export const metadata: Metadata = {
  title: "How We Rate Insurance — Per-Segment Methodology",
  description:
    "InvestingPro's insurance rating methodology for India: claim settlement ratio, premium per cover, exclusions, network hospitals. Anchored to IRDAI annual data + insurer schedules.",
  alternates: { canonical: generateCanonicalUrl("/methodology/insurance") },
  openGraph: {
    title: "How We Rate Insurance — Methodology",
    description:
      "Per-segment scoring for term life, health, motor, travel insurance in India.",
    url: generateCanonicalUrl("/methodology/insurance"),
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
    name: "Term life insurance",
    intro:
      "Pure protection product. Death benefit paid out → done. Score weights claim settlement ratio (CSR) heaviest because the entire product utility is contingent on the company paying when called. Premium per ₹1 cr cover is the comparison metric; lower wins, but only for insurers with strong CSR.",
    formula:
      "Claim settlement ratio 35% · Premium for cover 25% · Coverage breadth 20% · Exclusions + waiting periods 10% · Service 10%",
    primaryFactors: [
      {
        label: "Claim settlement ratio (CSR)",
        weight: 35,
        note: "Latest IRDAI annual report: % of claims paid out by count + by amount. We weight 60/40 between 'count' and 'amount' to prioritise the typical retail experience over outlier-claim bias.",
      },
      {
        label: "Premium per ₹1cr cover (age-band normalised)",
        weight: 25,
        note: "Age 25/35/45/55 bands separately — premium quotes vary 10×. Lower wins, but only when CSR is acceptable.",
      },
      {
        label: "Coverage breadth",
        weight: 20,
        note: "Sum-assured caps, return-of-premium variants, accidental-death rider, terminal-illness payout, COVID-era exclusion absent (post-2023).",
      },
      {
        label: "Exclusions + waiting periods",
        weight: 10,
        note: "Suicide clause (typically 12 months), pre-existing disease wait, specific-illness exclusions. Stricter exclusions hurt the score.",
      },
      {
        label: "Customer-claim experience",
        weight: 10,
        note: "IRDAI grievance ratio, third-party complaint data, claim-paid-within-30-days %.",
      },
    ],
  },
  {
    name: "Health insurance — individual",
    intro:
      "More complex than term: claim happens repeatedly across the policy lifetime. Coverage rules — room rent cap, ICU cap, sub-limits, PED waiting — silently determine real-world payout. Premium is meaningful but secondary to coverage clarity + cashless network depth.",
    formula:
      "Claim experience 30% · Coverage clarity (no sub-limits) 25% · Premium for cover 20% · Network hospitals 15% · Riders + value adds 10%",
    primaryFactors: [
      {
        label: "Claim settlement (CSR + paid-on-time)",
        weight: 30,
        note: "IRDAI CSR + IRDAI claim-settled-within-30-days %. Health insurers vary 60-99% on the latter — huge real-world impact.",
      },
      {
        label: "Coverage clarity (sub-limits, room-rent, co-pay)",
        weight: 25,
        note: "No room-rent capping = top score. Per-disease sub-limits, ICU cap, doctor-fee cap — penalise heavily because they erode payout when actually claimed.",
      },
      {
        label: "Premium per ₹10L cover (age + city normalised)",
        weight: 20,
        note: "Premium varies by tier-1 vs tier-2 city, age band, individual vs floater. We score within band.",
      },
      {
        label: "Network hospitals (cashless coverage)",
        weight: 15,
        note: "Cashless network size + tier-1 / tier-2 city density. Some insurers have huge networks but poor cashless TAT.",
      },
      {
        label: "Riders + value adds (no-claim bonus, restoration)",
        weight: 10,
        note: "No-claim bonus accumulator (some go up to 100% NCB), automatic restoration after exhaustion, OPD coverage, maternity, AYUSH treatment.",
      },
    ],
  },
  {
    name: "Health insurance — family floater",
    intro:
      "Insures multiple family members under one sum assured. Different physics: floater-cover-exhaustion risk + adult-child premium structure differ from individual policies. Restoration benefit becomes critical.",
    formula:
      "Claim experience 25% · Restoration + floater rules 25% · Coverage clarity 20% · Premium 20% · Network 10%",
    primaryFactors: [
      {
        label: "Claim settlement (CSR + paid-on-time)",
        weight: 25,
        note: "Same as individual — IRDAI data.",
      },
      {
        label: "Restoration of sum-insured",
        weight: 15,
        note: "If full ₹10L is exhausted on Member A, does the policy restore for Member B? Some insurers offer 100% restoration once per year, others zero.",
      },
      {
        label: "Floater premium efficiency",
        weight: 10,
        note: "Floater = single sum-insured shared. Cheaper than individual policies summed but exposes family to exhaustion risk. Score covers economics + breadth.",
      },
      {
        label: "Coverage clarity",
        weight: 20,
        note: "Same as individual — no sub-limits, no room-rent cap, transparent co-pay.",
      },
      {
        label: "Premium for ₹10L floater (typical 4-member family)",
        weight: 20,
        note: "Common scenario: 35yo father + 33yo mother + 2 kids. Premium normalised against this baseline.",
      },
      { label: "Network hospitals", weight: 10, note: "Same as individual." },
    ],
  },
  {
    name: "Motor insurance",
    intro:
      "Two parts: third-party (legally mandatory, regulated premium) and own-damage (own car damage + theft + natural disaster). OD market is competitive on premium; service quality during claim is the differentiator.",
    formula:
      "Claim experience 30% · OD premium efficiency 25% · Network garages 15% · Add-ons 15% · Renewal NCB protection 15%",
    primaryFactors: [
      {
        label: "Own-damage claim settlement experience",
        weight: 30,
        note: "Time from claim to garage clearance, claim-rejection rate, total-loss-vs-repair decision fairness.",
      },
      {
        label: "OD premium for IDV (city + car-segment normalised)",
        weight: 25,
        note: "Insured Declared Value (IDV) = depreciated car value. Premium per ₹1L IDV varies. Tier-1 cities + premium cars cost more.",
      },
      {
        label: "Network garage size + cashless coverage",
        weight: 15,
        note: "Cashless network at OEM-authorised garages = most relevant for premium / under-warranty cars.",
      },
      {
        label: "Add-ons (zero-dep, engine protect, return-to-invoice)",
        weight: 15,
        note: "Zero-depreciation cover + engine protect cover are now near-essential for post-2018 cars. Score availability + cost.",
      },
      {
        label: "NCB protection + renewal terms",
        weight: 15,
        note: "No-Claim-Bonus protection rider + ease of porting NCB on insurer change. NCB is portable per IRDAI rules — but operationally insurers vary on cooperation.",
      },
    ],
  },
  {
    name: "Travel insurance",
    intro:
      "Short-tenure, single-use product. Claim experience matters but premium-per-day-of-cover dominates because tickets are price-sensitive. International travel insurance has additional medical-coverage requirement (Schengen min ₹30L).",
    formula:
      "Premium per day 30% · Medical coverage 25% · Trip cancellation + delay 20% · Claim experience 15% · Pre-existing disease coverage 10%",
    primaryFactors: [
      {
        label: "Premium per day per ₹1L cover",
        weight: 30,
        note: "Travel insurance is highly price-sensitive. We normalise to per-day-per-cover for like-for-like.",
      },
      {
        label: "Medical evacuation + hospitalisation cover",
        weight: 25,
        note: "₹30L+ for Schengen/USA, ₹15L+ for SE Asia. Higher cover wins. Direct billing in destination matters.",
      },
      {
        label: "Trip cancellation + delay",
        weight: 20,
        note: "Reimbursement cap, qualifying conditions (e.g., natural-disaster-related delay vs simple airline delay).",
      },
      {
        label: "Claim experience for international",
        weight: 15,
        note: "Time to reimburse, support of overseas hospital direct-billing, 24/7 claim helpline. Most differentiating factor for actual user pain.",
      },
      {
        label: "Pre-existing disease (PED) + senior coverage",
        weight: 10,
        note: "Many travel policies exclude PED — bigger risk for seniors. Score insurers that cover declared PED.",
      },
    ],
  },
];

const STANDARDISED_ADJUSTMENTS = [
  "Recent IRDAI penalty / show-cause order on insurer −0.3 to −0.7 stars",
  "Claim-paid-on-time % below 80% −0.2 to −0.5 stars",
  "COVID-era exclusion still present in policy wording −0.2 to −0.4 stars",
  "Solvency margin > 200% of regulator floor (financial stability) +0.0 to +0.1 stars",
  "Customer NPS / persistency ratio above industry median +0.0 to +0.2 stars",
  "Recent IRDAI award / commendation +0.0 to +0.1 stars",
];

const DATA_SOURCES = [
  {
    label: "IRDAI annual report",
    note: "Claim settlement ratio (CSR), claim-paid-on-time %, complaint volume, solvency margin per insurer. Released annually; we pull each year's edition.",
  },
  {
    label: "Insurer policy schedules + brochures",
    note: "Public premium tables, sub-limits, exclusions, riders. Audited monthly for changes.",
  },
  {
    label: "IRDAI consumer-grievance system",
    note: "Per-insurer grievance count + resolution time.",
  },
  {
    label: "Third-party complaint registries",
    note: "Aggregated complaints from MoneyControl, Mouthshut, BankBazaar customer-experience data.",
  },
  {
    label: "In-house claim sampling",
    note: "Editorial team tracks ~50 anonymised claims per insurer per year via partner network for actual claim-experience data.",
  },
];

export default function InsuranceMethodology() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How We Rate Insurance",
    datePublished: "2026-04-26T00:00:00+05:30",
    dateModified: `${LAST_UPDATED}T00:00:00+05:30`,
    author: {
      "@type": "Organization",
      name: "InvestingPro Insurance Desk",
      url: generateCanonicalUrl("/about/editorial-team"),
    },
    publisher: {
      "@type": "Organization",
      name: "InvestingPro",
      url: "https://investingpro.in",
    },
    mainEntityOfPage: generateCanonicalUrl("/methodology/insurance"),
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
        name: "Insurance",
        item: generateCanonicalUrl("/methodology/insurance"),
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
              <li className="text-canvas">Insurance</li>
            </ol>
          </nav>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            Insurance Desk · Methodology v{VERSION} · last updated{" "}
            {LAST_UPDATED}
          </div>
          <h1 className="font-display font-black text-[44px] md:text-[64px] leading-[1.02] tracking-tight text-canvas max-w-[860px]">
            How we rate <span className="text-indian-gold">insurance</span>.
          </h1>
          <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[820px]">
            Five segments — term life, health (individual + family floater),
            motor, travel — each with its own scoring rubric. Premium is the
            easy comparison; what actually decides outcomes is whether the
            policy pays when claimed. We weight IRDAI claim settlement ratio +
            claim-paid-on-time % heaviest.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-wider text-canvas-70">
            <span>· IRDAI-grounded</span>
            <span>· Claim experience first</span>
            <span>· Insurance Desk owns it</span>
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
              <strong className="text-ink">Monthly:</strong> Premium + rider
              audit per insurer. Network hospital count update.
            </li>
            <li>
              <strong className="text-ink">Annually:</strong> Full rubric
              refresh after IRDAI annual report (typically released in
              October-November).
            </li>
            <li>
              <strong className="text-ink">Event-triggered:</strong> IRDAI
              penalty / show-cause / merger event → re-score within 7 days.
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
            Insurance methodology v{VERSION} · last updated {LAST_UPDATED}
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
              Insurance Desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
