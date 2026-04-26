/**
 * Methodology — hub page (v3)
 *
 * Top-level overview that points to seven per-product methodology
 * sub-pages. Each sub-page has its own scoring rubrics, formulas,
 * and data-source disclosures, because credit cards, loans, and
 * mutual funds genuinely have different physics. This hub explains
 * the principles common to all of them — editorial independence,
 * data provenance, versioning, no-paid-placement — then links out.
 */

import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { generateCanonicalUrl } from "@/lib/linking/canonical";

export const revalidate = 86400;
const LAST_UPDATED = "2026-04-26";

export const metadata: Metadata = {
  title: "How We Rate Financial Products — Methodology",
  description:
    "InvestingPro's transparent ranking methodology — per-product rubrics for credit cards, loans, mutual funds, insurance, banking, brokers, and tax tools. Editorial independence, data sources, update cadence, no paid placements.",
  alternates: { canonical: generateCanonicalUrl("/methodology") },
  openGraph: {
    title: "Methodology — How InvestingPro Rates Financial Products",
    description:
      "Per-product scoring rubrics for credit cards, loans, mutual funds, insurance, banking, brokers, and tax tools.",
    url: generateCanonicalUrl("/methodology"),
    type: "article",
  },
};

interface SubPage {
  slug: string;
  title: string;
  desk: string;
  segments: string;
  oneLine: string;
}

const SUB_PAGES: SubPage[] = [
  {
    slug: "credit-cards",
    title: "Credit cards",
    desk: "Credit Desk",
    segments:
      "6 segments — cashback, travel, premium, no-fee, secured, co-branded",
    oneLine:
      "Score depends on segment. Cashback is 70% net rewards rate; premium card is 50% realised lounge / dining value. NerdWallet-grounded, India-adapted.",
  },
  {
    slug: "loans",
    title: "Loans",
    desk: "Lending Desk",
    segments: "6 segments — personal, home, car, education, gold, business",
    oneLine:
      "Anchored to RBI MCLR + Repo-Linked-Rate disclosures + IBA loan price comparator. Effective APR matters more than headline rate.",
  },
  {
    slug: "banking",
    title: "Banking (FDs, savings, RDs)",
    desk: "Banking Desk",
    segments:
      "5 segments — scheduled FDs, SFB FDs, post-office sovereign, savings, RDs",
    oneLine:
      "DICGC ₹5L coverage scoped per-bank. Sovereign products separate scale because the safety floor is different.",
  },
  {
    slug: "mutual-funds",
    title: "Mutual funds",
    desk: "Investment Desk",
    segments: "5 segments — equity, debt, hybrid, ELSS, index/ETF",
    oneLine:
      "Risk-adjusted returns over headline returns. SEBI 2018 scheme categorisation enforced. Expense ratio + tracking error in index funds.",
  },
  {
    slug: "insurance",
    title: "Insurance",
    desk: "Insurance Desk",
    segments:
      "5 segments — term life, health (individual + floater), motor, travel",
    oneLine:
      "IRDAI claim settlement ratio + claim-paid-on-time % weighted heaviest. Premium is the easy comparison; payout reliability is the real one.",
  },
  {
    slug: "brokers",
    title: "Demat brokers",
    desk: "Investment Desk",
    segments:
      "5 segments — discount, full-service, online-only, mobile-first, F&O / MTF",
    oneLine:
      "SEBI SCORES complaint ratio + NSE/BSE technical-glitch logs over per-order fees. Expiry-day uptime is existential.",
  },
  {
    slug: "taxes",
    title: "Tax tools + content",
    desk: "Tax Desk",
    segments:
      "6 categories — income tax, capital gains, deductions, TDS, crypto, GST",
    oneLine:
      "Different framing — we don't rate products, we rate calculator quality. IT Act anchored. Budget-update SLA: 24 hours.",
  },
];

const PRINCIPLES = [
  {
    title: "Per-product rubrics, not one-size-fits-all",
    body: "Credit-card cashback rate is meaningless to a home-loan borrower. Each product type has its own physics, and we publish a separate methodology for each — with weights and formulas chosen for that segment specifically.",
  },
  {
    title: "Editorial-commercial separation",
    body: "Editorial analysts who set ratings are organisationally separated from the partnerships team. Affiliate compensation cannot influence score, rank, or recommendation. No paid placements anywhere in our rankings.",
  },
  {
    title: "Reproducible + versioned",
    body: "Every score is deterministic — same inputs always produce the same output. When we update a rubric, the previous version is archived and timestamped. You can audit our scoring trail.",
  },
  {
    title: "Data-provenance for every value",
    body: "Every numeric input we use — interest rate, claim ratio, expense ratio, complaint count — has a source URL and fetched-at timestamp. We refresh per source's update frequency (daily / weekly / monthly / annually).",
  },
];

const DESKS_AND_SOURCES = [
  {
    desk: "Credit Desk",
    sources:
      "RBI Master Direction on Credit Cards · Issuer T&Cs · ICRA / CRISIL bank ratings · CIBIL / Experian bureau data",
  },
  {
    desk: "Lending Desk",
    sources:
      "RBI MCLR + Repo-Linked-Rate disclosures · IBA loan price comparator · Lender T&Cs · CIBIL / Experian / CRIF / Equifax bureau data",
  },
  {
    desk: "Banking Desk",
    sources:
      "DICGC ₹5L coverage list · RBI bank-rate disclosures · India Post sovereign-product circulars · Bank tariff schedules",
  },
  {
    desk: "Investment Desk",
    sources:
      "AMFI scheme data · ValueResearch / Morningstar fund analytics · SEBI scheme categorisation · NSE/BSE active-client + glitch logs · SEBI SCORES portal",
  },
  {
    desk: "Insurance Desk",
    sources:
      "IRDAI annual report (CSR + claim-paid-on-time) · IRDAI consumer-grievance system · Insurer policy schedules + brochures",
  },
  {
    desk: "Tax Desk",
    sources:
      "Income Tax Act + Finance Act amendments · CBDT circulars + clarifications · ITR forms (CBDT-released utility) · Cost Inflation Index notification · GST Council notifications",
  },
];

const ADJUSTMENTS_OVERVIEW = [
  "Recent regulator penalty / show-cause order on a provider",
  "Major operational incident in last 12 months (technical glitch, fund mis-use, data leak)",
  "Audited certifications + transparent disclosures",
  "Customer-experience signals (NPS, persistency, complaint ratio)",
];

export default function MethodologyHub() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How We Rate Financial Products — InvestingPro Methodology",
    datePublished: "2026-04-26T00:00:00+05:30",
    dateModified: `${LAST_UPDATED}T00:00:00+05:30`,
    author: {
      "@type": "Organization",
      name: "InvestingPro Editorial",
      url: generateCanonicalUrl("/about/editorial-team"),
    },
    publisher: {
      "@type": "Organization",
      name: "InvestingPro",
      url: "https://investingpro.in",
    },
    mainEntityOfPage: generateCanonicalUrl("/methodology"),
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
              <li className="text-canvas">Methodology</li>
            </ol>
          </nav>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            Editorial · Methodology · last updated {LAST_UPDATED}
          </div>
          <h1 className="font-display font-black text-[44px] md:text-[64px] leading-[1.02] tracking-tight text-canvas max-w-[860px]">
            How we rate{" "}
            <span className="text-indian-gold">financial products</span>.
          </h1>
          <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[820px]">
            Seven per-product methodology pages — credit cards, loans, banking,
            mutual funds, insurance, brokers, and tax tools. Each has its own
            rubric because the products genuinely behave differently. This hub
            explains the principles common to all of them — editorial
            independence, data provenance, versioning, and no paid placements —
            then sends you to the page that matters.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-wider text-canvas-70">
            <span>· Per-product rubrics</span>
            <span>· No paid placements</span>
            <span>· Reproducible scores</span>
            <span>· Source-of-truth audited</span>
          </div>
        </div>
      </section>

      {/* Sub-pages directory */}
      <section className="bg-canvas pb-20 pt-14">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Per-product methodology
          </div>
          <h2 className="font-display text-[34px] md:text-[40px] font-black text-ink leading-tight mb-10 max-w-[820px]">
            Seven rubrics. One scoring scale.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {SUB_PAGES.map((p) => (
              <Link
                key={p.slug}
                href={`/methodology/${p.slug}`}
                className="block border-t-2 border-ink-12 pt-6 hover:border-indian-gold transition-colors group"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-2">
                  {p.desk}
                </div>
                <h3 className="font-display text-[24px] md:text-[26px] font-black text-ink leading-tight mb-2 group-hover:text-indian-gold transition-colors">
                  {p.title}
                </h3>
                <div className="font-mono text-[11px] uppercase tracking-wider text-ink-60 mb-3">
                  {p.segments}
                </div>
                <p className="text-[15px] leading-[1.6] text-ink-80 mb-3">
                  {p.oneLine}
                </p>
                <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold flex items-center gap-1">
                  Read full methodology <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Common principles */}
      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Common principles
          </div>
          <h2 className="font-display text-[30px] md:text-[36px] font-black text-ink leading-tight mb-8 max-w-[820px]">
            What every rubric shares.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 max-w-[1000px]">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="border-l-2 border-indian-gold pl-5">
                <h3 className="font-display text-[20px] font-bold text-ink mb-2 leading-tight">
                  {p.title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-ink-80">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial independence */}
      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Editorial independence
          </div>
          <h2 className="font-display text-[30px] md:text-[36px] font-black text-ink leading-tight mb-6 max-w-[820px]">
            Money doesn't move scores.
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.7] text-ink-80 max-w-[820px]">
            <p>
              We earn affiliate commissions when readers apply through our
              links. That revenue funds the editorial team. It does not — at any
              point, in any product type — change a score, rank, or "Our Take"
              verdict.
            </p>
            <p>
              Editorial analysts are organisationally separate from the
              partnerships team. Affiliate availability is a UI decision ("Apply
              Now" button shown vs hidden) — it never reaches the rubric.
            </p>
            <p>
              No bank, AMC, lender, broker, or insurer can pay to rank higher.
              The top-ranked product on every list is always the highest-scoring
              product by that segment's published rubric.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider">
            <Link
              href="/how-we-make-money"
              className="text-indian-gold hover:underline"
            >
              How we make money →
            </Link>
            <Link
              href="/affiliate-disclosure"
              className="text-indian-gold hover:underline"
            >
              Affiliate disclosure →
            </Link>
            <Link
              href="/about/editorial-standards"
              className="text-indian-gold hover:underline"
            >
              Editorial standards →
            </Link>
          </div>
        </div>
      </section>

      {/* Desks + sources */}
      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Editorial desks + data sources
          </div>
          <h2 className="font-display text-[30px] md:text-[36px] font-black text-ink leading-tight mb-8 max-w-[820px]">
            Who owns each rubric.
          </h2>
          <div className="space-y-5 max-w-[820px]">
            {DESKS_AND_SOURCES.map((d) => (
              <div key={d.desk} className="border-l-2 border-indian-gold pl-5">
                <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-1">
                  {d.desk}
                </div>
                <p className="text-[15px] leading-[1.6] text-ink-80">
                  {d.sources}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standardised adjustments */}
      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Cross-product modifiers
          </div>
          <h2 className="font-display text-[30px] md:text-[36px] font-black text-ink leading-tight mb-6 max-w-[820px]">
            Adjustments applied across rubrics.
          </h2>
          <p className="text-[15px] leading-[1.6] text-ink-80 mb-5 max-w-[820px]">
            Beyond per-segment factor weights, we apply standardised adjustments
            where evidence warrants. These shift a product's score within ±1.0
            stars.
          </p>
          <ul className="space-y-3 text-[15px] leading-[1.65] text-ink-80 max-w-[820px]">
            {ADJUSTMENTS_OVERVIEW.map((a, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-[11px] text-ink-60 mt-1">
                  ·
                </span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
          <p className="text-[14px] leading-[1.6] text-ink-60 mt-5 italic max-w-[820px]">
            Each per-product methodology page lists its specific adjustments and
            the magnitude per signal.
          </p>
        </div>
      </section>

      {/* Update cadence + versioning */}
      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Update cadence + versioning
          </div>
          <h2 className="font-display text-[30px] md:text-[36px] font-black text-ink leading-tight mb-6 max-w-[820px]">
            When scores get refreshed.
          </h2>
          <ul className="space-y-3 text-[15px] leading-[1.65] text-ink-80 max-w-[820px]">
            <li>
              <strong className="text-ink">Daily:</strong> live-data feeds (FD
              rates, NAVs, GSec yields, GST notifications).
            </li>
            <li>
              <strong className="text-ink">Weekly / monthly:</strong> per-source
              schedules — issuer rate cards, AMFI / IRDAI / SEBI portals.
            </li>
            <li>
              <strong className="text-ink">Quarterly:</strong> in-house product
              audits + ITR-form alignment + GST rate audits.
            </li>
            <li>
              <strong className="text-ink">Annually:</strong> full rubric
              refresh after regulator annual reports + Cost Inflation Index +
              Finance Act passage.
            </li>
            <li>
              <strong className="text-ink">Event-triggered:</strong> regulator
              penalty / major incident → re-score within 7 days.
            </li>
            <li>
              <strong className="text-ink">Versioning:</strong> each rubric is
              versioned (v1.0, v1.1...). Previous versions are archived; we
              never silently change weights.
            </li>
          </ul>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Important disclosures
          </div>
          <h2 className="font-display text-[26px] md:text-[30px] font-black text-ink leading-tight mb-4 max-w-[820px]">
            Information, not advice.
          </h2>
          <ul className="space-y-3 text-[15px] leading-[1.65] text-ink-80 max-w-[820px]">
            <li>
              <strong className="text-ink">
                Not a SEBI-registered investment advisor.
              </strong>{" "}
              InvestingPro.in is a financial comparison + information platform,
              not a registered IA under SEBI (Investment Advisers) Regulations,
              2013.
            </li>
            <li>
              <strong className="text-ink">For information only.</strong>{" "}
              Rankings, scores, comparisons, and calculators are general
              information and educational tools — not personalised financial,
              investment, tax, or legal advice.
            </li>
            <li>
              <strong className="text-ink">
                Past performance does not predict future results.
              </strong>{" "}
              Mutual fund and investment-product rankings reflect historical
              data only.
            </li>
            <li>
              <strong className="text-ink">Consult a qualified advisor.</strong>{" "}
              Before any financial decision, consult a SEBI-registered IA, tax
              advisor, or qualified professional who can assess your individual
              circumstances.
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-canvas py-10 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-ink-60">
          <div>Methodology hub · last updated {LAST_UPDATED}</div>
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
              Editorial team
            </Link>
            <Link
              href="/affiliate-disclosure"
              className="hover:text-indian-gold transition-colors"
            >
              Affiliate disclosure
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
