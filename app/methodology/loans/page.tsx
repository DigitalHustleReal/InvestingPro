/**
 * Methodology — Loans (per-segment rubric)
 *
 * Sub-page of /methodology covering personal, home, car, education,
 * gold, and business loans in India. Each segment has its own
 * formula because the consumer outcome that matters differs:
 * a personal loan is rate + processing-fee dominant; a home loan
 * is total-tenure-cost dominant; a gold loan is LTV + storage
 * security dominant.
 *
 * Anchored to RBI MCLR/RLLR / RBI ombudsman / NHB data, plus
 * editorial sampling of disbursal TAT.
 */

import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { generateCanonicalUrl } from "@/lib/linking/canonical";

export const revalidate = 86400;

const LAST_UPDATED = "2026-04-26";
const VERSION = "1.0";

export const metadata: Metadata = {
  title: "How We Rate Loans — Per-Segment Methodology",
  description:
    "InvestingPro's loan rating methodology for India: distinct formulas for personal, home, car, education, gold, and business loans. Anchored to RBI MCLR/RLLR + NHB + ombudsman data.",
  alternates: { canonical: generateCanonicalUrl("/methodology/loans") },
  openGraph: {
    title: "How We Rate Loans — Methodology",
    description:
      "Per-segment scoring for personal, home, car, education, gold, business loans in India.",
    url: generateCanonicalUrl("/methodology/loans"),
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
    name: "Personal loans",
    intro:
      "Unsecured, short-tenure, fast-disbursal. Rate matters most because tenure is short (1–5 years) so the second-order costs (foreclosure, processing) compound fast. Disbursal TAT is a decision factor for emergency users.",
    formula:
      "Effective rate 40% · Fees + foreclosure 25% · Eligibility 15% · TAT + service 20%",
    primaryFactors: [
      {
        label: "Effective interest rate (RLLR-linked)",
        weight: 40,
        note: "Headline rate + bundling discounts (insurance push, salary-account discount). Floor is the RBI repo benchmark. Lenders quoting fixed rates without RLLR linkage scored down.",
      },
      {
        label: "Processing fee + foreclosure penalty",
        weight: 25,
        note: "One-time fee % + GST + prepayment penalty as % of outstanding. Some lenders charge 4-5% to foreclose; RBI banned this for floating retail loans in 2014 but personal loans still allow it.",
      },
      {
        label: "Eligibility friction",
        weight: 15,
        note: "Min income (often ₹15K-₹40K depending on lender), CIBIL floor (typically 700+), employer category restrictions. Self-employed face higher scrutiny.",
      },
      {
        label: "Disbursal TAT + service",
        weight: 20,
        note: "Promised vs actual TAT (we sample monthly). Doc digitization, branch dependency, mobile-app workflow quality, RBI complaint volume.",
      },
    ],
  },
  {
    name: "Home loans",
    intro:
      "Long tenure (15–30 yrs) means small rate differences compound to lakhs. Total-tenure-cost is the dominant metric — including processing, MOD/franking, valuation, top-up flexibility, and the RBI-mandated zero-foreclosure-penalty advantage.",
    formula:
      "Effective tenure cost 50% · Flexibility 20% · Eligibility 15% · Service 15%",
    primaryFactors: [
      {
        label: "Effective rate over tenure",
        weight: 35,
        note: "Year-1 rate often discounted (teaser); we score the effective average over the FULL tenure assuming RBI repo-rate-linked resets every quarter.",
      },
      {
        label: "Processing + statutory fees",
        weight: 15,
        note: "Processing fee + MOD/franking (varies by state) + valuation + technical/legal. Total often 0.5-1% of loan amount.",
      },
      {
        label: "Prepayment + balance transfer",
        weight: 10,
        note: "RBI banned foreclosure penalty on floating-rate retail home loans (2014) — most lenders compliant. We confirm + check for hidden 'admin fees' that substitute.",
      },
      {
        label: "Top-up + tenure flexibility",
        weight: 10,
        note: "Top-up eligibility post-12-months at attractive rate, tenure extension during distress, EMI vacation options.",
      },
      {
        label: "Eligibility (LTV + employer + CIBIL)",
        weight: 15,
        note: "LTV cap (usually 75-90% per RBI by ticket size), income multiplier, salaried-vs-self-employed parity, employer category bands.",
      },
      {
        label: "Disbursal + servicing",
        weight: 15,
        note: "End-to-end TAT (sanction-to-disbursal), part-disbursement for under-construction, statement clarity, RBI ombudsman record.",
      },
    ],
  },
  {
    name: "Car loans",
    intro:
      "Medium tenure (3-7 yrs), often bundled with dealer-financing relationships. Rate is competitive but processing + insurance push can erode the advertised rate. Used-car loans are a distinct niche with different physics.",
    formula:
      "Effective rate 35% · Total cost of ownership 25% · Eligibility 15% · Disbursal speed 25%",
    primaryFactors: [
      {
        label: "Effective rate (new vs used)",
        weight: 35,
        note: "Used cars often 1.5-3% higher than new. We score each separately.",
      },
      {
        label: "Processing + bundled insurance",
        weight: 15,
        note: "Lender push for tied insurance product erodes effective rate. Penalised when bundling is required.",
      },
      {
        label: "Foreclosure terms",
        weight: 10,
        note: "Most lenders allow part-prepayment; foreclosure penalty 2-5% common in vehicle finance.",
      },
      {
        label: "LTV cap",
        weight: 10,
        note: "Standard 80-90% on-road price. Higher LTV = bigger loan, but more interest paid.",
      },
      {
        label: "Eligibility friction",
        weight: 5,
        note: "Income + employer + age. Standardised across lenders; minor differentiator.",
      },
      {
        label: "Disbursal + dealer integration",
        weight: 25,
        note: "Same-day disbursal at dealer point is common with major lenders. Integration quality is the practical differentiator at the showroom.",
      },
    ],
  },
  {
    name: "Education loans",
    intro:
      "Different physics: government interest subsidy under PMVLK / Vidya Lakshmi changes the math, moratorium during course is standard, and collateral-vs-non-collateral split is the key segmentation. We score domestic and overseas separately.",
    formula:
      "Effective rate 30% · Subsidy + moratorium 20% · Eligibility breadth 25% · Service 25%",
    primaryFactors: [
      {
        label: "Effective rate post-subsidy",
        weight: 30,
        note: "PMVLK / CSIS interest subsidy during moratorium effectively reduces the rate. We score net-of-subsidy for eligible borrowers; gross for non-eligible.",
      },
      {
        label: "Moratorium terms",
        weight: 10,
        note: "Course duration + 6-12 month grace period. Some lenders offer 2-year post-course moratorium for premier institutes.",
      },
      {
        label: "Margin / collateral terms",
        weight: 10,
        note: "Non-collateral up to ₹7.5L per IBA scheme; collateral required above. Margin: 5% domestic, 15% overseas typical.",
      },
      {
        label: "Premier-institute fast-track",
        weight: 15,
        note: "Lenders maintain a 'list A' of institutes (IIT/IIM/AIIMS/IISc + global top-100) with relaxed collateral, lower rates, faster sanction. Coverage matters.",
      },
      {
        label: "Documentation + overseas-loan competence",
        weight: 10,
        note: "I-20/CAS handling, foreign currency disbursement, FEMA compliance for overseas study.",
      },
      {
        label: "Disbursement reliability + servicing",
        weight: 25,
        note: "Multi-tranche disbursal aligned with semester fees. Many lenders fail at this — student suffers semester delays.",
      },
    ],
  },
  {
    name: "Gold loans",
    intro:
      "Secured by gold ornaments. Speed-of-disbursal is the killer feature (often 30 minutes). The differentiation lives in LTV cap, storage transparency, valuation method, and the renewal-vs-auction process.",
    formula:
      "Rate 30% · LTV + valuation 25% · Storage + audit 20% · Renewal/auction process 25%",
    primaryFactors: [
      {
        label: "Effective interest rate (annualised)",
        weight: 30,
        note: "Many gold-loan ads quote monthly rate. We always score annualised. Range typically 8-18% depending on tenure + ticket size.",
      },
      {
        label: "LTV cap + valuation",
        weight: 25,
        note: "RBI caps LTV at 75% for banks (90% for NBFC short-term). Valuation method: 22K vs 24K basis, melt charge deduction, transparent calculation.",
      },
      {
        label: "Storage + insurance",
        weight: 10,
        note: "Vault security audited? Insured? Customer can access their gold for periodic check?",
      },
      {
        label: "Renewal vs auction process",
        weight: 15,
        note: "Pre-auction notice period, renewal fee, partial-repayment allowed during tenure. Auction process transparent and time-bound?",
      },
      {
        label: "Branch + service",
        weight: 10,
        note: "Branch density (matters because gold needs physical handover), customer service, dispute mechanism.",
      },
      {
        label: "RBI compliance + audit history",
        weight: 10,
        note: "RBI inspection findings, NBFC vs scheduled bank, complaints volume.",
      },
    ],
  },
  {
    name: "Business loans (MSME / Mudra)",
    intro:
      "MSME segment with large heterogeneity — manufacturing vs services, working-capital vs term-loan, secured vs unsecured. We score collateral-free Mudra loans (PMMY) separately from secured term loans.",
    formula:
      "Effective rate 30% · Collateral terms 20% · Documentation simplicity 15% · Disbursal speed 15% · Service 20%",
    primaryFactors: [
      {
        label: "Effective rate post-CGTMSE coverage",
        weight: 30,
        note: "CGTMSE (Credit Guarantee Trust for MSE) guarantee enables collateral-free up to ₹2 cr. Net-of-guarantee-fee rate is what matters to borrower.",
      },
      {
        label: "Collateral / margin",
        weight: 20,
        note: "Range: 0% (Mudra Shishu / Tarun) to 50%+ for secured term loans. Lower = more accessible but higher rate.",
      },
      {
        label: "Documentation simplicity",
        weight: 15,
        note: "MSME UDYAM number sufficient? GST-only docs accepted? KYC + financial doc bar.",
      },
      {
        label: "Disbursal TAT",
        weight: 15,
        note: "Working-capital limits: same-day to 30 days. Big spread; differentiates lenders.",
      },
      {
        label: "Renewal + relationship banking",
        weight: 10,
        note: "MSME often need annual renewal. Lender's ability to grow with the business matters more than the first sanction.",
      },
      {
        label: "RBI compliance + grievance",
        weight: 10,
        note: "RBI ombudsman record, RBI penalty history (some lenders have been penalised for MSME mis-selling).",
      },
    ],
  },
];

const STANDARDISED_ADJUSTMENTS = [
  "Pre-approved offer to existing salary-account holder (skips fresh CIBIL pull) +0.0 to +0.2 stars",
  "Strong digital workflow (e-sign, video KYC, fully online) +0.0 to +0.2 stars",
  "Insurance bundling required (effective rate erosion) −0.1 to −0.3 stars",
  "Top-up offered post-12-months at attractive rate +0.1 to +0.2 stars",
  "Hidden 'admin fee' substituting for prohibited foreclosure penalty −0.3 to −0.5 stars",
  "RBI ombudsman complaint volume > 90th percentile −0.2 to −0.5 stars",
  "Recent RBI penalty for mis-selling −0.3 to −0.7 stars",
];

const DATA_SOURCES = [
  {
    label: "RBI MCLR/RLLR data (monthly)",
    note: "Mandatory disclosure under RBI's external benchmark linking circular. We pull each lender's published rate and benchmark spread.",
  },
  {
    label: "RBI ombudsman quarterly reports",
    note: "Per-lender complaint volume, dispute resolution time, RBI penalty events.",
  },
  {
    label: "NHB + IBA quarterly data",
    note: "Home loan disbursement trends, rate distribution, NHB refi cost.",
  },
  {
    label: "Lender T&Cs + most-important-terms",
    note: "Public schedule of charges, foreclosure terms, fee tables. Audited monthly.",
  },
  {
    label: "In-house TAT sampling",
    note: "Editorial team submits dummy applications quarterly across major lenders to measure actual disbursal TAT vs advertised.",
  },
];

export default function LoansMethodology() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How We Rate Loans — Per-Segment Methodology",
    datePublished: "2026-04-26T00:00:00+05:30",
    dateModified: `${LAST_UPDATED}T00:00:00+05:30`,
    author: {
      "@type": "Organization",
      name: "InvestingPro Lending Desk",
      url: generateCanonicalUrl("/about/editorial-team"),
    },
    publisher: {
      "@type": "Organization",
      name: "InvestingPro",
      url: "https://investingpro.in",
    },
    mainEntityOfPage: generateCanonicalUrl("/methodology/loans"),
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
        name: "Loans",
        item: generateCanonicalUrl("/methodology/loans"),
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
              <li className="text-canvas">Loans</li>
            </ol>
          </nav>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            Lending Desk · Methodology v{VERSION} · last updated {LAST_UPDATED}
          </div>
          <h1 className="font-display font-black text-[44px] md:text-[64px] leading-[1.02] tracking-tight text-canvas max-w-[860px]">
            How we rate <span className="text-indian-gold">loans</span>.
          </h1>
          <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[820px]">
            Six segments — personal, home, car, education, gold, business — each
            with its own scoring formula. Anchored to RBI's external benchmark
            rates (MCLR / RLLR), NHB data, and our own monthly TAT sampling
            against advertised disbursal times.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-wider text-canvas-70">
            <span>· RBI-benchmarked</span>
            <span>· Real TAT sampling</span>
            <span>· No paid placements</span>
            <span>· Lending Desk owns it</span>
          </div>
        </div>
      </section>

      <section className="bg-canvas py-14">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Why segment-specific
          </div>
          <h2 className="font-display text-[34px] md:text-[40px] font-black text-ink leading-tight mb-6 max-w-[820px]">
            A 0.25% rate difference matters very differently across segments.
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.7] text-ink-80 max-w-[820px]">
            <p>
              On a ₹50 L home loan over 20 years, 0.25% = ₹1.5 L+ over the
              tenure. On a ₹2 L personal loan over 3 years, the same 0.25% is
              ₹800. Same delta, different magnitudes — so the weight we assign
              to "effective rate" varies by segment.
            </p>
            <p>
              India-specific factors that drive segment differences: government
              interest subsidies (PMVLK, CGTMSE, CSIS), the RBI's 2014 ban on
              prepayment penalties for floating-rate retail housing loans, MCLR
              vs RLLR linkage transparency, and CGTMSE coverage that effectively
              turns a "secured" MSME loan into a near-collateral-free product.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-canvas pb-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Per-segment rubrics
          </div>
          <h2 className="font-display text-[34px] md:text-[40px] font-black text-ink leading-tight mb-10 max-w-[820px]">
            Six formulas. One scoring scale (1–5 stars).
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
              <strong className="text-ink">Weekly:</strong> RBI repo / MCLR /
              RLLR rate changes propagated within 7 days.
            </li>
            <li>
              <strong className="text-ink">Monthly:</strong> Lender fee +
              foreclosure schedule audit.
            </li>
            <li>
              <strong className="text-ink">Quarterly:</strong> Disbursal-TAT
              sampling round across top 20 lenders.
            </li>
            <li>
              <strong className="text-ink">Event-triggered:</strong> RBI
              ombudsman quarterly report, lender penalty event, RBI policy
              circular — re-score within 48 hours.
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

      <section className="bg-canvas py-10 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-ink-60">
          <div>
            Loans methodology v{VERSION} · last updated {LAST_UPDATED}
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
              Lending Desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
