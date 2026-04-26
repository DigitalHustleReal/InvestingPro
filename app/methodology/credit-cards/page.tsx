/**
 * Methodology — Credit Cards (per-segment rubric)
 *
 * Sub-page of /methodology covering how InvestingPro rates Indian
 * credit cards. Different card segments use different formulas
 * because the factors that make a great cashback card are not the
 * same as what makes a great travel or premium card. Modelled on
 * NerdWallet's category-specific approach, adapted for the Indian
 * issuer landscape (RBI ombudsman, CIBIL impact, fuel surcharge
 * waivers, lounge access, UPI integration, AMC/Visa/Master tier).
 *
 * v3 design tokens. Last weights review: 2026-04-26.
 */

import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { generateCanonicalUrl } from "@/lib/linking/canonical";

export const revalidate = 86400;

const LAST_UPDATED = "2026-04-26";
const VERSION = "1.0";

export const metadata: Metadata = {
  title: "How We Rate Credit Cards — Per-Segment Methodology",
  description:
    "InvestingPro's credit card scoring methodology for India. Different rubrics for cashback, travel, premium, no-annual-fee, secured, and co-branded cards. Independent ratings, no paid placements.",
  alternates: {
    canonical: generateCanonicalUrl("/methodology/credit-cards"),
  },
  openGraph: {
    title: "How We Rate Credit Cards — Methodology",
    description:
      "Per-segment scoring formulas for cashback, travel, premium, no-fee, secured, and co-branded credit cards in India.",
    url: generateCanonicalUrl("/methodology/credit-cards"),
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
  secondaryNote?: string;
}

const SEGMENTS: Segment[] = [
  {
    name: "Cashback cards",
    intro:
      "The most common Indian segment. Score = direct cash-equivalent return on typical Indian household spending across categories where the card actually earns. We weight by published 2026 NPCI + RBI consumer-spend data — groceries and utilities outweigh entertainment by 4×.",
    formula: "Cash Value 70% · Simplicity 20% · Issuer Trust 10%",
    primaryFactors: [
      {
        label: "Effective base + bonus rate",
        weight: 35,
        note: "Reward % weighted by spending mix: groceries 28%, utilities 18%, fuel 14%, dining 12%, online shopping 10%, travel 8%, recurring 5%, other 5%.",
      },
      {
        label: "Annual fee + waiver realism",
        weight: 25,
        note: "Lower fee scores higher; waiver thresholds discounted by realistic-attainment probability for the typical user (e.g., ₹3 L spend waiver gets full credit only if cardholder typically spends > ₹3 L).",
      },
      {
        label: "Reward redemption value + restrictions",
        weight: 10,
        note: "Statement credit > points-with-cap > points-with-expiry. Caps and exclusions discounted.",
      },
      {
        label: "Simplicity (rotating vs flat)",
        weight: 20,
        note: "Flat-rate beats rotating bonus categories that require activation, hit caps, or change quarterly.",
      },
      {
        label: "Issuer reliability",
        weight: 10,
        note: "RBI ombudsman complaint volume per 1L cards-in-force, app uptime, dispute resolution time.",
      },
    ],
  },
  {
    name: "Travel cards (domestic + international)",
    intro:
      "Different physics from cashback: redemption value isn't fixed — it varies by airline / hotel partner. Lounge access (the single most-cited Indian-traveler benefit) gets explicit weight separate from rewards. International cards add forex markup as a major factor.",
    formula: "Cash Value 60% · Network Reach 25% · Simplicity 15%",
    primaryFactors: [
      {
        label: "Effective travel reward rate",
        weight: 30,
        note: "Points × redemption-value-per-point (computed for top 5 Indian airlines + 3 hotel partners). Typically 1.5×–4× of cashback baseline.",
      },
      {
        label: "Lounge access (domestic + international)",
        weight: 20,
        note: "Visits per year, Priority Pass / DreamFolks / DiyR coverage, guest policy, terminal limitations. Heaviest single Indian-traveler lookup.",
      },
      {
        label: "Forex markup + international acceptance",
        weight: 10,
        note: "Lower forex markup (typical range 0%–3.5%). Visa Infinite / WE / World Elite tiers get reach credit.",
      },
      {
        label: "Annual + renewal fee net of perks",
        weight: 15,
        note: "Premium travel cards charge ₹4 K–₹15 K. Rated against cash-equivalent perks (vouchers, milestone benefits, complimentary memberships).",
      },
      {
        label: "Insurance + concierge",
        weight: 10,
        note: "Travel insurance limits, lost baggage cover, air accident cover, concierge response time.",
      },
      {
        label: "Issuer + network trust",
        weight: 15,
        note: "RBI complaints + concierge / claim-settlement responsiveness.",
      },
    ],
  },
  {
    name: "Premium / luxury cards",
    intro:
      "₹10 K+ annual fee tier. Cash value alone undersells these — the value lives in invitation-only events, golf access, hotel-tier upgrades, and concierge. Score weights real-world utilisation rates, not advertised features.",
    formula:
      "Realised Value 50% · Status & Access 25% · Cash Value 15% · Simplicity 10%",
    primaryFactors: [
      {
        label: "Realised perk utilisation",
        weight: 35,
        note: "Of the perks advertised, what % does a typical user actually claim? Penalises inflated benefit lists.",
      },
      {
        label: "Hotel + airline status partnerships",
        weight: 15,
        note: "Marriott Gold, Hilton Honors Gold, Taj Epicure tiers, accelerated upgrade paths.",
      },
      {
        label: "Concierge + invite-only access",
        weight: 10,
        note: "Response SLA, fulfillment rate (booking restaurants, ticket availability).",
      },
      {
        label: "Cash-equivalent rewards floor",
        weight: 15,
        note: "Even at premium tier, reward rate matters. Scored as in cashback methodology but with lower weight.",
      },
      {
        label: "Annual fee net of milestone benefits",
        weight: 15,
        note: "Premium cards often rebate the fee in Tata CLiQ / EazyDiner vouchers — only counts if redemption is realistic.",
      },
      {
        label: "Issuer prestige + service",
        weight: 10,
        note: "Dedicated relationship manager, priority phone line, claim escalation path.",
      },
    ],
  },
  {
    name: "No-annual-fee / lifetime free",
    intro:
      "Beginner segment + steady-state holders. Annual fee = 0 by definition, so the rubric collapses to rewards efficiency, eligibility friction, and no hidden GFC-style finance charges.",
    formula: "Cash Value 60% · Eligibility 20% · Hidden Cost Avoidance 20%",
    primaryFactors: [
      {
        label: "Effective reward rate",
        weight: 50,
        note: "Same Indian-spending-weighted formula as cashback segment.",
      },
      {
        label: "Eligibility floor (income, CIBIL)",
        weight: 20,
        note: "Lower min-income + CIBIL bar = more accessible. India avg salaried CIBIL is 740; below 700 limits choice.",
      },
      {
        label: "Hidden fees absence",
        weight: 20,
        note: "GST + service charges on cashback, late-fee tiering, finance charge on revolving — must all be transparent.",
      },
      {
        label: "Add-on card + spouse benefit",
        weight: 10,
        note: "Free add-on cards expand household value at zero fee.",
      },
    ],
  },
  {
    name: "Secured / starter cards",
    intro:
      "For thin-CIBIL or new-to-credit users (students, recent immigrants, post-bankruptcy). Goal isn't rewards — it's credit-building. Score weights graduation paths and fixed-deposit (FD) terms.",
    formula: "Required Outlay 40% · Credit Build 35% · Upgrade Path 25%",
    primaryFactors: [
      {
        label: "Required FD / deposit",
        weight: 25,
        note: "Lower required FD ladder = more accessible. Refundable but blocks capital. Some issuers accept ₹10 K, others ₹50 K+.",
      },
      {
        label: "Annual fee + FD interest forgone",
        weight: 15,
        note: "Hidden cost: FD locks earn lower interest than the same money in fixed deposits at 6-7%.",
      },
      {
        label: "Credit bureau reporting (all 4)",
        weight: 20,
        note: "Reports to CIBIL + Experian + Equifax + CRIF High Mark = max credit-building velocity.",
      },
      {
        label: "Free CIBIL access",
        weight: 15,
        note: "Built-in CIBIL tracking helps users see progress + correct errors quickly.",
      },
      {
        label: "Upgrade to unsecured at clear milestone",
        weight: 25,
        note: "12-month / good-standing graduation to unsecured card without re-application — biggest signal of issuer trust in the segment.",
      },
    ],
  },
  {
    name: "Co-branded cards (fuel, e-commerce, airline-partnered)",
    intro:
      "Strongest economics if you concentrate spend at the partner; weakest if spend is broad. Score weights the partner segment's value AND the realistic-share-of-wallet a typical user has there.",
    formula:
      "Partner Cash Value 65% · Out-of-partner Floor 20% · Simplicity 15%",
    primaryFactors: [
      {
        label: "Partner-segment reward rate",
        weight: 35,
        note: "Effective return at the partner: e.g., HPCL, IndianOil, Amazon, Flipkart, MakeMyTrip. Partner cards often offer 4-7% there.",
      },
      {
        label: "Realistic share-of-wallet",
        weight: 15,
        note: "How concentrated does a typical Indian user have their spend at this partner? Penalises niche partners.",
      },
      {
        label: "Out-of-partner reward rate",
        weight: 20,
        note: "Outside the partner the rate often drops to 0.5-1%. Determines value when user shops elsewhere.",
      },
      {
        label: "Annual fee + waiver vs partner spend",
        weight: 15,
        note: "Easier to waive on a card you concentrate spend at. Realism check on the threshold.",
      },
      {
        label: "Partner stability + pricing power",
        weight: 15,
        note: "If the partner can devalue points (e.g., Yatra changing redemption value), the card's value erodes. Penalises history of devaluation.",
      },
    ],
  },
];

const STANDARDISED_ADJUSTMENTS = [
  "New-cardholder welcome bonus value (if attainable in 90 days at typical spend) +0.0 to +0.3 stars",
  "0% intro APR on EMI conversions for big-ticket spends +0.0 to +0.2 stars",
  "Pre-qualification without hard CIBIL pull +0.0 to +0.1 stars",
  "Strong NPCI / UPI integration on card-on-file +0.0 to +0.1 stars",
  "Mandatory third-party app for redemption (extra friction) −0.1 to −0.3 stars",
  "Devaluation history (issuer changed reward formula in last 24 months) −0.2 to −0.5 stars",
  "RBI ombudsman complaint volume > 90th percentile −0.2 to −0.5 stars",
  "Missing standard feature (e.g., no fuel surcharge waiver on a fuel card) −0.3 to −0.7 stars",
];

const DATA_SOURCES = [
  {
    label: "Issuer T&Cs",
    note: "Latest schedule of fees + reward rules per issuer's public Most Important Terms & Conditions (MITC).",
  },
  {
    label: "RBI ombudsman quarterly reports",
    note: "Complaint volumes per 1L cards-in-force, dispute resolution time.",
  },
  {
    label: "NPCI consumer-spend data",
    note: "2026 published India consumer-spending mix used to weight reward-rate calculations across categories.",
  },
  {
    label: "In-house testing",
    note: "Each card application/customer-service pathway tested by an editorial reviewer at least once per 12-month rubric cycle.",
  },
  {
    label: "User-reported claim data",
    note: "Aggregated user reports from third-party complaint registries + InvestingPro corrections inbox.",
  },
];

export default function CreditCardsMethodology() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How We Rate Credit Cards — Per-Segment Methodology",
    datePublished: "2026-04-26T00:00:00+05:30",
    dateModified: `${LAST_UPDATED}T00:00:00+05:30`,
    author: {
      "@type": "Organization",
      name: "InvestingPro Credit Team",
      url: generateCanonicalUrl("/about/editorial-team"),
    },
    publisher: {
      "@type": "Organization",
      name: "InvestingPro",
      url: "https://investingpro.in",
    },
    mainEntityOfPage: generateCanonicalUrl("/methodology/credit-cards"),
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
        name: "Credit Cards",
        item: generateCanonicalUrl("/methodology/credit-cards"),
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

      {/* Hero */}
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
              <li className="text-canvas">Credit Cards</li>
            </ol>
          </nav>

          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            Credit Team · Methodology v{VERSION} · last updated {LAST_UPDATED}
          </div>

          <h1 className="font-display font-black text-[44px] md:text-[64px] leading-[1.02] tracking-tight text-canvas max-w-[860px]">
            How we rate <span className="text-indian-gold">credit cards</span>.
          </h1>

          <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[820px]">
            Six distinct segments, six distinct formulas. The factors that make
            a great cashback card are not the factors that make a great travel
            card or a great secured card. We score each segment on its own
            rubric, weighted by what Indian users actually spend on and what
            they actually use.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-wider text-canvas-70">
            <span>· No paid placements</span>
            <span>· Spending-mix weighted</span>
            <span>· RBI ombudsman included</span>
            <span>· Owned by Credit Team desk</span>
          </div>
        </div>
      </section>

      {/* Why segment-specific */}
      <section className="bg-canvas py-14">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Why segment-specific
          </div>
          <h2 className="font-display text-[34px] md:text-[40px] font-black text-ink leading-tight mb-6 max-w-[820px]">
            Same brand, different game.
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.7] text-ink-80 max-w-[820px]">
            <p>
              Cashback is fixed math: rate × spend = return. Travel is a
              two-step problem: rate, then redemption value (which can vary 5×).
              Premium is mostly status — the cash math undersells what the card
              delivers. Secured cards are about graduation, not rewards. We
              don't pretend a single rubric captures all six.
            </p>
            <p>
              Indian context layers in unique factors: lounge-access networks
              (DreamFolks, Priority Pass, DiyR), fuel surcharge waivers
              (mandatory disclosure on partner cards), CIBIL reporting depth,
              RBI ombudsman complaint volume per 1L-cards-in-force, and add-on
              card / spouse benefits. These get weight where they materially
              change consumer outcomes.
            </p>
            <p>
              Methodology adapted from{" "}
              <a
                href="https://www.nerdwallet.com/l/credit-cards-star-ratings-methodology"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indian-gold hover:underline"
              >
                NerdWallet's credit card rating methodology
              </a>{" "}
              with India-specific weights and data sources.
            </p>
          </div>
        </div>
      </section>

      {/* Per-segment rubrics */}
      <section className="bg-canvas pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Per-segment rubrics
          </div>
          <h2 className="font-display text-[34px] md:text-[40px] font-black text-ink leading-tight mb-10 max-w-[820px]">
            Six formulas. One scoring scale (1–5 stars, 0.1-step).
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

                {/* Mobile factor notes */}
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

      {/* Standardised adjustments */}
      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Standardised adjustments
          </div>
          <h2 className="font-display text-[30px] md:text-[34px] font-black text-ink leading-tight mb-6 max-w-[820px]">
            Cross-segment modifiers.
          </h2>
          <p className="text-[16px] leading-[1.7] text-ink-80 mb-6 max-w-[820px]">
            Applied on top of the base segment formula. These move a card ±0.1
            to ±0.7 stars from where the formula lands it.
          </p>
          <ul className="space-y-3 text-[15px] leading-[1.65] text-ink-80 max-w-[820px]">
            {STANDARDISED_ADJUSTMENTS.map((adj, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-[11px] text-ink-60 mt-1">
                  ·
                </span>
                <span>{adj}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Data sources */}
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

      {/* Update cadence */}
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
              <strong className="text-ink">Monthly:</strong> Issuer fee + reward
              rule audits. Any change since last refresh updates the affected
              cards' scores within 7 days.
            </li>
            <li>
              <strong className="text-ink">Immediate (event-triggered):</strong>{" "}
              Reward devaluation, RBI policy change affecting card products,
              issuer T&C update — re-score within 48 hours.
            </li>
            <li>
              <strong className="text-ink">Quarterly:</strong> Segment weight
              review (the percentages above) by the Credit Team desk. Public
              changelog of weight changes.
            </li>
            <li>
              <strong className="text-ink">Annually:</strong> Full rubric review
              against latest NPCI / RBI consumer-spend data.
            </li>
          </ul>
        </div>
      </section>

      {/* Related */}
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
                href="/methodology/loans"
                className="text-indian-gold hover:underline"
              >
                Loans (personal, home, car, education)
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

      {/* Version footer */}
      <section className="bg-canvas py-10 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-ink-60">
          <div>
            Credit Cards methodology v{VERSION} · last updated {LAST_UPDATED}
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
              Credit Team desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
