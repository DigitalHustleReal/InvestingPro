/**
 * /fact-check — Fact-Check Policy.
 * E-E-A-T page Google evaluates for YMYL trust signals.
 */

import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  RefreshCw,
  FileSearch,
  MessageSquare,
} from "lucide-react";

const LAST_UPDATED = "2026-04-26";

export const metadata: Metadata = {
  title: "Fact-Check Policy | InvestingPro",
  description:
    "How InvestingPro fact-checks every published article — primary sources, citation discipline, editorial review chain, correction policy, and how to flag errors.",
  alternates: { canonical: "https://investingpro.in/fact-check" },
};

const STAGES = [
  {
    icon: BookOpen,
    title: "1 · Primary research only",
    body: "Every article cites original-source data — RBI circulars, SEBI guidelines, Income Tax Act sections, IRDAI annual reports, AMFI scheme data, India Post sovereign-product circulars, issuer rate cards. Secondary blogs, press summaries, and AI-generated stat claims are never accepted as the primary source.",
  },
  {
    icon: FileSearch,
    title: "2 · Cross-source verification",
    body: "Every numeric value (interest rate, claim ratio, expense ratio, tax slab, complaint count) is verified against at least two independent sources before publication. Discrepancies are flagged and the article is held until reconciled.",
  },
  {
    icon: CheckCircle2,
    title: "3 · Per-segment desk review",
    body: "The relevant editorial desk (Tax / Credit / Investment / Lending / Insurance / Banking) reviews the article for accuracy, completeness, and clarity. Misleading claims, unsupported comparisons, generic 'experts say' phrasing, and uncited numbers are flagged and rewritten.",
  },
  {
    icon: AlertCircle,
    title: "4 · Pre-publish fact-check sweep",
    body: "Final automated check: every numeric claim must have a citation within 100 words. Round-number percentages (50%/60%/70%/80% of Indians...) are flagged for source verification. Last-updated date is set; FAQ schema validated.",
  },
  {
    icon: RefreshCw,
    title: "5 · Ongoing freshness",
    body: "Articles are reviewed when underlying data changes — new FD rates, Budget amendments, product launches, IRDAI / SEBI / RBI circulars. Updated articles show the revision date prominently. Articles older than 18 months without review get auto-flagged for editorial sweep.",
  },
];

const STANDARDS = [
  "Every numeric claim must cite a primary source — typically a regulator, issuer rate card, or audited annual report",
  "Quotes must come with a verifiable name + organisation; anonymous 'industry experts' attributions are rewritten",
  "Statistics older than 24 months are flagged for refresh or removal",
  "Tax-law content is updated within 7 days of CBDT notification or Finance Act amendment",
  "Calculator outputs are independently verified against the relevant CBDT / SEBI / RBI utility before launch",
  "Affiliate-network data (commission rates, product availability) is refreshed monthly from network APIs",
];

const HOW_TO_REPORT = [
  {
    icon: MessageSquare,
    title: "Spotted an error?",
    body: "Email contact@investingpro.in with the article URL, the specific claim, and the source you believe contradicts it. We acknowledge fact-check requests within 48 hours.",
  },
];

export default function FactCheckPage() {
  return (
    <div className="min-h-screen bg-canvas">
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
              <li className="text-canvas">Fact-Check Policy</li>
            </ol>
          </nav>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            Trust · Last updated {LAST_UPDATED}
          </div>
          <h1 className="font-display font-black text-[44px] md:text-[64px] leading-[1.02] tracking-tight text-canvas max-w-[860px]">
            Fact-check <span className="text-indian-gold">policy</span>.
          </h1>
          <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[820px]">
            Five-stage editorial pipeline behind every published article.
            Primary-source-only, cross-source verified, desk-reviewed,
            zero-tolerance on uncited statistics.
          </p>
        </div>
      </section>

      <section className="bg-canvas py-14">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Five stages
          </div>
          <h2 className="font-display text-[30px] md:text-[36px] font-black text-ink leading-tight mb-10 max-w-[820px]">
            From draft to published.
          </h2>
          <div className="space-y-8 max-w-[820px]">
            {STAGES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="border-l-2 border-indian-gold pl-5">
                <Icon className="w-5 h-5 text-indian-gold mb-3" />
                <h3 className="font-display text-[22px] font-bold text-ink mb-2 leading-tight">
                  {title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-ink-80">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Editorial standards
          </div>
          <h2 className="font-display text-[28px] md:text-[34px] font-black text-ink leading-tight mb-6 max-w-[820px]">
            Hard rules.
          </h2>
          <ul className="space-y-3 text-[15px] leading-[1.65] text-ink-80 max-w-[820px]">
            {STANDARDS.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-[11px] text-ink-60 mt-1">
                  ·
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-canvas py-14 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Report an error
          </div>
          <h2 className="font-display text-[28px] md:text-[34px] font-black text-ink leading-tight mb-6 max-w-[820px]">
            Help us improve.
          </h2>
          <div className="space-y-5 max-w-[820px]">
            {HOW_TO_REPORT.map(({ icon: Icon, title, body }) => (
              <div key={title} className="border-l-2 border-indian-gold pl-5">
                <Icon className="w-5 h-5 text-indian-gold mb-3" />
                <h3 className="font-display text-[20px] font-bold text-ink mb-2 leading-tight">
                  {title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-ink-80">{body}</p>
              </div>
            ))}
          </div>
          <p className="text-[14px] leading-[1.6] text-ink-60 mt-6 italic max-w-[820px]">
            All confirmed corrections are logged on our{" "}
            <Link
              href="/corrections"
              className="text-indian-gold hover:underline"
            >
              corrections page
            </Link>{" "}
            with the original claim, the corrected version, and the date the
            change went live.
          </p>
        </div>
      </section>

      <section className="bg-canvas py-10 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-ink-60">
          <div>Fact-check policy v1.0 · last updated {LAST_UPDATED}</div>
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
              href="/methodology"
              className="hover:text-indian-gold transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="/about/editorial-team"
              className="hover:text-indian-gold transition-colors"
            >
              Editorial team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
