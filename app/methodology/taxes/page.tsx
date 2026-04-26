/**
 * Methodology — Taxes (calculator + content quality rubric)
 *
 * Sub-page of /methodology covering Indian tax calculators + tax
 * content. Unlike the other methodology pages (which rate products
 * like credit cards or insurance), the tax page rates the quality
 * of our tax tools and advisory content. Anchored to Income Tax
 * Act + CBDT circulars + latest Finance Act amendments + ITR-form
 * structure. Edge-case coverage + Budget-change update SLA matter
 * more than any single design feature.
 */

import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { generateCanonicalUrl } from "@/lib/linking/canonical";

export const revalidate = 86400;
const LAST_UPDATED = "2026-04-26";
const VERSION = "1.0";

export const metadata: Metadata = {
  title: "How We Build Tax Tools — Calculator + Content Methodology",
  description:
    "InvestingPro's tax-calculator and tax-content methodology for India: Income Tax Act anchor, Budget-change update SLA, edge-case coverage, ITR-form alignment. Per-tool quality rubric.",
  alternates: { canonical: generateCanonicalUrl("/methodology/taxes") },
  openGraph: {
    title: "How We Build Tax Tools — Methodology",
    description:
      "Per-tool quality rubric for income tax, capital gains, deductions, TDS, crypto, and GST calculators.",
    url: generateCanonicalUrl("/methodology/taxes"),
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
    name: "Income tax slab calculators (old vs new regime)",
    intro:
      "Most-used tax tool. After the FY 2023-24 default-shift to new regime, comparison logic must show old-vs-new break-even by deduction profile. Score weights regulatory accuracy + budget-change update speed + edge-case completeness (senior citizens, NRIs, family pension, marginal-relief).",
    formula:
      "Regulatory accuracy 30% · Budget-update SLA 25% · Edge-case coverage 20% · Output transparency 15% · UX clarity 10%",
    primaryFactors: [
      {
        label: "Regulatory accuracy (IT Act + Finance Act match)",
        weight: 30,
        note: "Slabs, surcharge, cess, marginal relief, rebate u/s 87A — every value cross-checked against the latest Finance Act notification + CBDT circular. Zero tolerance on numerical drift.",
      },
      {
        label:
          "Budget-change update SLA (within 24 hours of Finance Bill assent)",
        weight: 25,
        note: "When the Finance Bill is passed (typically late-March), our calculators reflect new slabs by next-day. Mid-year amendments (e.g., surcharge tweaks) updated within 7 days.",
      },
      {
        label: "Edge-case coverage",
        weight: 20,
        note: "Senior (60–80) + super-senior (80+) slabs, NRI taxability, family-pension standard deduction, agricultural-income clubbing, marginal-relief calculation at boundary thresholds (₹50L/₹1cr/₹2cr/₹5cr).",
      },
      {
        label: "Output transparency (formula + section citations)",
        weight: 15,
        note: "Every line in the output references the IT Act section (e.g., 'Standard deduction u/s 16(ia): ₹50,000'). Users see how the number was derived, not just a black-box total.",
      },
      {
        label: "UX clarity (regime comparison)",
        weight: 10,
        note: "Old-vs-new side-by-side, break-even-deduction-amount calculator, recommendation logic explained in plain language.",
      },
    ],
  },
  {
    name: "Capital gains calculators (equity, debt, property)",
    intro:
      "Most error-prone tax category. Indexation (now removed for debt MFs post-Apr 2023), Section 112A grandfathering for equity (Jan 31 2018), Section 54/54F/54EC reinvestment exemptions — small misses produce huge errors. Score weights edge-case + period-aware logic.",
    formula:
      "Period + asset-class accuracy 30% · Edge-case coverage 25% · Indexation + grandfathering 20% · Reinvestment exemption logic 15% · Output transparency 10%",
    primaryFactors: [
      {
        label: "Period + asset-class accuracy",
        weight: 30,
        note: "STCG / LTCG threshold per asset class — equity (1 yr), debt MF (3 yr pre-Apr-23, slab post-Apr-23), property (2 yr), unlisted shares (2 yr), gold (3 yr / 2 yr depending on physical vs ETF). Rates cross-checked against current Finance Act.",
      },
      {
        label: "Edge-case coverage",
        weight: 25,
        note: "Grandfathering FMV as on Jan-31-2018 for equity, ITR-form schedule-CG line items, set-off + carry-forward rules (8-year LTCG carry), bonus-share + rights-issue cost-basis, demerger / merger / buy-back specifics.",
      },
      {
        label: "Indexation + cost inflation index lookup",
        weight: 20,
        note: "CII table updated each year via CBDT notification. Property + gold ETFs + sovereign gold bonds use indexation; equity + post-Apr-2023 debt MFs do not. Tool routes correctly per asset.",
      },
      {
        label: "Reinvestment exemption logic (Sec 54, 54F, 54EC)",
        weight: 15,
        note: "Sec 54 (residential→residential), 54F (any LTCA→residential), 54EC (₹50L NHAI/REC bonds). Time-limit + cap accurate. Penalty for partial reinvestment correctly computed.",
      },
      {
        label: "Output transparency",
        weight: 10,
        note: "Output cites IT Act section + line item from ITR form Schedule-CG that the user will fill.",
      },
    ],
  },
  {
    name: "Tax-saving + deduction calculators (80C, 80D, HRA, NPS, home loan)",
    intro:
      "Used during tax-saving season (Jan-Mar). Lots of moving parts — each deduction has its own ceiling, sub-limit, and eligibility. Score weights ceiling accuracy + interaction logic between deductions + new-vs-old regime claimable-only-in-old visibility.",
    formula:
      "Ceiling + sub-limit accuracy 30% · Cross-deduction interaction 25% · Regime-specific eligibility 20% · Edge-case (NRI, senior) 15% · Output transparency 10%",
    primaryFactors: [
      {
        label: "Ceiling + sub-limit accuracy",
        weight: 30,
        note: "80C (₹1.5L), 80CCD(1) (within 80C), 80CCD(1B) extra ₹50K NPS, 80D (₹25K self / ₹50K parents senior), 24(b) home loan interest (₹2L self-occupied / unlimited let-out), HRA actual / 50%-of-salary / 40% / rent-paid-minus-10%-salary minimum-of-three.",
      },
      {
        label: "Cross-deduction interaction",
        weight: 25,
        note: "80CCC + 80CCD(1) + 80C share the ₹1.5L cap — many calculators get this wrong. 80CCD(1B) is on top. 80D senior + parent-senior stacking. Section 24(b) interaction with 80EEA / 80EE first-time-buyer.",
      },
      {
        label: "Regime-specific eligibility (claimable in old vs new)",
        weight: 20,
        note: "New regime allows only standard deduction + 80CCD(2) employer NPS. Old regime allows the full set. Calculator shows which deductions vanish if user picks new regime.",
      },
      {
        label: "Edge-case (NRI, senior, super-senior)",
        weight: 15,
        note: "NRIs cannot claim 80TTA / 80TTB; senior citizens get higher 80D + 80TTB + medical-treatment ceilings. Calculator routes correctly.",
      },
      {
        label: "Output transparency + ITR form line item",
        weight: 10,
        note: "Every deduction line points to ITR-1 / ITR-2 schedule line where user reports it. Section number cited.",
      },
    ],
  },
  {
    name: "Advance tax + TDS / TCS calculators",
    intro:
      "Used by salaried + freelance + high-income filers. Advance-tax has four installments with specific cumulative percentages; TDS deduction depends on payment type + payer category. Score weights installment-schedule accuracy + section-26AS reconciliation logic.",
    formula:
      "Installment schedule accuracy 30% · Section-rate accuracy (TDS) 25% · Interest u/s 234A/B/C 20% · Edge-case (presumptive, SMB) 15% · Output transparency 10%",
    primaryFactors: [
      {
        label: "Advance-tax installment schedule (15% / 45% / 75% / 100%)",
        weight: 30,
        note: "By 15-Jun, 15-Sep, 15-Dec, 15-Mar — cumulative % of total liability. Mismatch triggers 234C interest. Calculator must compute per-installment shortfall + cumulative interest correctly.",
      },
      {
        label: "TDS section-rate accuracy",
        weight: 25,
        note: "194A interest, 194C contractor, 194H commission, 194I rent, 194Q purchase, 194R benefits — each has a different rate, threshold, and PAN-not-furnished penalty rate (typically 20%). Cross-checked against latest CBDT notification.",
      },
      {
        label: "Interest u/s 234A / 234B / 234C",
        weight: 20,
        note: "234A late-filing 1%/month, 234B advance-tax shortfall 1%/month, 234C installment delay 1%/month — each computed on different bases. Easy to get wrong.",
      },
      {
        label: "Edge-case (presumptive 44AD/44ADA, SMB GST)",
        weight: 15,
        note: "Presumptive-taxation profile differences — no advance-tax-installment for 44AD if paid by 15-Mar. Salaried + freelance combined-income blending.",
      },
      {
        label: "Output transparency + Form 26AS reconciliation hint",
        weight: 10,
        note: "Output lines tagged to Form 26AS / AIS / TIS source. User can match against tax-credits seen in income-tax portal.",
      },
    ],
  },
  {
    name: "Crypto / VDA tax calculators (post-Apr 2022)",
    intro:
      "New regulatory regime under Section 115BBH — flat 30% on VDA gains, 1% TDS u/s 194S on transfers above threshold, no set-off / no carry-forward. Score weights compliance with the strict regime + handling of frequent-trader corner cases.",
    formula:
      "115BBH regime accuracy 35% · 194S TDS handling 25% · No-set-off + no-carry-forward enforcement 20% · Edge-case (gift, airdrop, mining) 15% · Output transparency 5%",
    primaryFactors: [
      {
        label: "Sec 115BBH regime accuracy",
        weight: 35,
        note: "Flat 30% on net VDA gain, no deduction other than cost of acquisition, no set-off across VDAs or against other heads. Loss in one VDA cannot offset gain in another. Calculator enforces strictly.",
      },
      {
        label:
          "Sec 194S TDS (1% on transfer above ₹10,000 / ₹50,000 threshold)",
        weight: 25,
        note: "1% TDS on consideration above threshold (₹10K specified-persons, ₹50K others). Calculator tracks threshold by counterparty type.",
      },
      {
        label: "No set-off / no carry-forward enforcement",
        weight: 20,
        note: "Loss from VDA cannot be carried forward — each FY stands alone. Common error in DIY calculators that auto-aggregate losses across years.",
      },
      {
        label: "Edge-case (gift, airdrop, staking, mining)",
        weight: 15,
        note: "Gift > ₹50K from non-relative taxable u/s 56(2)(x). Airdrop FMV taxable on receipt. Staking income — no clear CBDT guidance yet; we flag interpretation transparently.",
      },
      {
        label: "Output transparency",
        weight: 5,
        note: "Section + ITR-2 schedule VDA line item cited. User can verify against ITR.",
      },
    ],
  },
  {
    name: "GST + business tax calculators",
    intro:
      "Used by SMBs + freelancers + e-commerce sellers. GST rate slabs (5/12/18/28%) + composition scheme + input-tax-credit + reverse-charge are all interaction-heavy. Score weights HSN-rate accuracy + composition-scheme threshold + ITC eligibility.",
    formula:
      "HSN rate accuracy 30% · Composition scheme + threshold logic 20% · ITC eligibility 20% · Reverse charge 15% · Output transparency 15%",
    primaryFactors: [
      {
        label: "HSN / SAC rate accuracy",
        weight: 30,
        note: "GST rate per HSN code (goods) / SAC code (services), updated against GST Council notifications. We track quarterly changes.",
      },
      {
        label: "Composition scheme + threshold logic",
        weight: 20,
        note: "Composition: 1% (traders), 5% (restaurants), 6% (services). Aggregate-turnover threshold ₹1.5cr (goods) / ₹50L (services). Eligibility flag-checking critical.",
      },
      {
        label: "ITC eligibility",
        weight: 20,
        note: "Most B2B GST is creditable; blocked credits u/s 17(5) (motor vehicles, food, employee benefits, works contract on immovable). Reverse-charge ITC + matching with GSTR-2A / 2B.",
      },
      {
        label: "Reverse charge mechanism (RCM)",
        weight: 15,
        note: "RCM applicable on certain supplies (legal services from advocate, GTA, import of services). Calculator flags RCM payer + ITC route.",
      },
      {
        label: "Output transparency + GSTR mapping",
        weight: 15,
        note: "Output mapped to GSTR-3B / GSTR-1 line item user will report. Composition-scheme users routed to CMP-08 instead.",
      },
    ],
  },
];

const STANDARDISED_ADJUSTMENTS = [
  "Calculator gives a numerically wrong result on a documented test case −1.0 to −2.0 stars (immediate fix)",
  "Budget change not reflected within 7 days of assent −0.3 to −0.7 stars",
  "ITR-form-line citation missing −0.1 to −0.3 stars",
  "CBDT circular / Finance Act citation in tooltip / footer +0.0 to +0.2 stars",
  "Edge-case test-suite documented + run on each release +0.0 to +0.3 stars",
  "Independent CA / CMA-reviewed (last 12 months) +0.0 to +0.3 stars",
];

const DATA_SOURCES = [
  {
    label: "Income Tax Act (1961) + Finance Act amendments",
    note: "Authoritative source for all rate, slab, ceiling, and section-eligibility logic. Updated each Finance Act + via CBDT notifications + circulars within the year.",
  },
  {
    label: "CBDT circulars + clarifications",
    note: "Where the Act is ambiguous, CBDT circulars provide binding interpretation. We track every circular and route logic accordingly.",
  },
  {
    label: "ITR forms + utility (Excel + JSON schemas)",
    note: "Each calculator's output is mapped to specific ITR form lines. The CBDT-released ITR utility is a ground-truth check for our outputs.",
  },
  {
    label: "Cost Inflation Index (CII) notification",
    note: "Annual CBDT notification — required for indexed long-term capital gains on property + sovereign-gold-bond + gold-ETF (pre-Apr-2023 debt MFs). Pulled each year.",
  },
  {
    label: "GST Council notifications + GSTN portal",
    note: "GST rate changes, composition-scheme threshold updates, new HSN-mapped notifications. We track quarterly + emergency revisions.",
  },
  {
    label: "Independent CA review",
    note: "Editorial team commissions a Chartered Accountant audit of each major calculator annually + within 7 days of Budget. Audit report archived publicly.",
  },
];

export default function TaxesMethodology() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How We Build Tax Tools",
    datePublished: "2026-04-26T00:00:00+05:30",
    dateModified: `${LAST_UPDATED}T00:00:00+05:30`,
    author: {
      "@type": "Organization",
      name: "InvestingPro Tax Desk",
      url: generateCanonicalUrl("/about/editorial-team"),
    },
    publisher: {
      "@type": "Organization",
      name: "InvestingPro",
      url: "https://investingpro.in",
    },
    mainEntityOfPage: generateCanonicalUrl("/methodology/taxes"),
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
        name: "Taxes",
        item: generateCanonicalUrl("/methodology/taxes"),
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
              <li className="text-canvas">Taxes</li>
            </ol>
          </nav>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            Tax Desk · Methodology v{VERSION} · last updated {LAST_UPDATED}
          </div>
          <h1 className="font-display font-black text-[44px] md:text-[64px] leading-[1.02] tracking-tight text-canvas max-w-[860px]">
            How we build <span className="text-indian-gold">tax tools</span>.
          </h1>
          <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[820px]">
            Tax doesn't have products to rate — it has tools and content that
            have to be right. Six categories — income tax, capital gains,
            deductions, advance-tax / TDS, crypto / VDA, GST — each scored on
            regulatory accuracy, Budget-update SLA, edge-case coverage, and
            ITR-form alignment. A wrong number costs the user real money; we
            treat numerical drift as a zero-tolerance bug.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-wider text-canvas-70">
            <span>· IT Act + CBDT anchored</span>
            <span>· Budget-update SLA: 24h</span>
            <span>· Tax Desk owns it</span>
          </div>
        </div>
      </section>

      <section className="bg-canvas pb-20 pt-14">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Per-tool quality rubrics
          </div>
          <h2 className="font-display text-[34px] md:text-[40px] font-black text-ink leading-tight mb-10 max-w-[820px]">
            Six formulas. One scoring scale.
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
            Cross-tool modifiers.
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
            When tools get refreshed.
          </h2>
          <ul className="space-y-3 text-[15px] leading-[1.65] text-ink-80 max-w-[820px]">
            <li>
              <strong className="text-ink">Within 24 hours:</strong> Finance
              Bill assent → calculators reflect new slabs / surcharge / cess.
            </li>
            <li>
              <strong className="text-ink">Within 7 days:</strong> CBDT
              notification / circular impact, mid-year amendments, surcharge
              tweaks.
            </li>
            <li>
              <strong className="text-ink">Quarterly:</strong> GST Council
              notification audit. ITR-form line-item mapping verification.
            </li>
            <li>
              <strong className="text-ink">Annually:</strong> Cost Inflation
              Index update. Independent CA audit on each major calculator.
              Edge-case test-suite refresh.
            </li>
            <li>
              <strong className="text-ink">Event-triggered:</strong>{" "}
              User-reported numerical bug → fix + regression test within 48
              hours.
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Disclosure
          </div>
          <h2 className="font-display text-[26px] md:text-[30px] font-black text-ink leading-tight mb-4 max-w-[820px]">
            Tools, not advice.
          </h2>
          <p className="text-[15px] leading-[1.65] text-ink-80 max-w-[820px]">
            Our tax calculators and content are educational tools — they help
            you understand your own tax position. They are not a substitute for
            personalised tax advice from a qualified Chartered Accountant or tax
            professional, especially for cases involving multiple income heads,
            NRI taxation, business income, or complex capital-gains
            transactions. We disclose this prominently on every calculator
            output.
          </p>
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
            Taxes methodology v{VERSION} · last updated {LAST_UPDATED}
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
              Tax Desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
