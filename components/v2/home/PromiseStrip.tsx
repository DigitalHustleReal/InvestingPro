// PromiseStrip — Universal trust-signal section.
// Slot: between Hero and TrustBar (position 1.5 in the 11-section homepage).
//
// Purpose: answer the unspoken YMYL question every first-time visitor asks —
// "Why should I trust your money advice?" — with three concrete promises
// that each link to a substantive page (methodology, how-we-make-money,
// editorial standards). Builds E-E-A-T (Google's quality-rater framework)
// without push-selling and without adding mobile-specific design fragments.
//
// Renders identically on desktop (3 columns) and mobile (3 stacked rows).
// Server component — no JS shipped to client. Static content.
//
// Research basis (NerdWallet "Why trust us" + Bankrate "About" + Investopedia
// "Reviewed by" patterns): financial sites that surface methodology +
// independence + freshness in the editorial flow earn 30-40% higher
// time-on-site and lower bounce vs sites that hide it in /about footer.

import Link from "next/link";
import { Shield, BookOpen, Clock } from "lucide-react";

const PROMISES = [
  {
    icon: Shield,
    label: "INDEPENDENCE",
    headline: "No paid placements.",
    body: "Affiliate links never move scores or rankings. Editorial and commercial teams are separated by policy, not just by intention.",
    link: "/about/how-we-make-money",
    linkText: "How we work",
  },
  {
    icon: BookOpen,
    label: "METHODOLOGY",
    headline: "Disclosed weights.",
    body: "Every rating is anchored to primary sources — RBI MCLR, SEBI filings, IRDAI claim ratios, AMFI returns. Math is published.",
    link: "/methodology",
    linkText: "Read methodology",
  },
  {
    icon: Clock,
    label: "AUDIT",
    // The date below is hand-maintained. Update it when the editorial team
    // completes a review pass. Quarterly cadence is the floor; weekly for
    // rate-sensitive surfaces (FDs, savings, MFs).
    headline: "Reviewed Apr 27, 2026.",
    body: "Editorial desk refreshes ratings, fact-checks claims, and updates rates on a published cadence. Stale data is logged, not buried.",
    link: "/about/editorial-standards",
    linkText: "Editorial standards",
  },
] as const;

export default function PromiseStrip() {
  return (
    <section
      aria-labelledby="promise-strip-title"
      className="bg-canvas border-y-2 border-ink/10 py-10 md:py-14"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          id="promise-strip-title"
          className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-6 text-center"
        >
          The InvestingPro Promise
        </div>

        {/* Grid: 3 columns desktop, stacked mobile.
            gap-px + bg-ink/10 background creates thin editorial dividers. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink/10 border-2 border-ink/10 rounded-sm overflow-hidden">
          {PROMISES.map(
            ({ icon: Icon, label, headline, body, link, linkText }) => (
              <div key={label} className="bg-canvas p-6 md:p-7 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Icon
                    className="w-4 h-4 text-indian-gold flex-shrink-0"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-60">
                    {label}
                  </span>
                </div>
                <h3 className="font-display font-black text-[22px] md:text-[24px] text-ink leading-tight mb-2 tracking-tight">
                  {headline}
                </h3>
                <p className="text-[13px] md:text-sm text-ink-60 leading-relaxed mb-4 flex-1">
                  {body}
                </p>
                <Link
                  href={link}
                  className="font-mono text-[11px] uppercase tracking-wider text-indian-gold underline underline-offset-2 hover:no-underline transition-colors"
                  aria-label={`${linkText} — ${headline}`}
                >
                  {linkText} →
                </Link>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
