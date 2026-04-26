/**
 * /advertiser-disclosure — required by FTC + Indian advertising
 * standards (ASCI). Footer-linked, was 404 before.
 */

import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const LAST_UPDATED = "2026-04-26";

export const metadata: Metadata = {
  title: "Advertiser Disclosure | InvestingPro",
  description:
    "How InvestingPro earns money, what relationships exist with advertisers, and our editorial-commercial separation.",
  alternates: { canonical: "https://investingpro.in/advertiser-disclosure" },
};

export default function AdvertiserDisclosurePage() {
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
              <li className="text-canvas">Advertiser Disclosure</li>
            </ol>
          </nav>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            Trust · Last updated {LAST_UPDATED}
          </div>
          <h1 className="font-display font-black text-[44px] md:text-[64px] leading-[1.02] tracking-tight text-canvas max-w-[860px]">
            Advertiser <span className="text-indian-gold">disclosure</span>.
          </h1>
          <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[820px]">
            How we make money, what relationships we have with the
            financial-product issuers we cover, and how we keep editorial
            separate from commercial.
          </p>
        </div>
      </section>

      <section className="bg-canvas py-14">
        <div className="max-w-[820px] mx-auto px-6 space-y-8">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
              How we earn
            </div>
            <h2 className="font-display text-[28px] font-black text-ink leading-tight mb-4">
              Affiliate commissions.
            </h2>
            <p className="text-[16px] leading-[1.7] text-ink-80">
              When you click an &quot;Apply Now&quot; or &quot;Visit Site&quot;
              button on InvestingPro and complete an application that the issuer
              approves, the issuer or affiliate network may pay us a commission.
              This is the primary way we fund the editorial team, the platform
              hosting, and the data-ingestion pipelines.
            </p>
            <p className="text-[16px] leading-[1.7] text-ink-80 mt-4">
              We currently work with two affiliate networks in India:
              <strong className="text-ink"> Cuelinks</strong> and
              <strong className="text-ink"> EarnKaro</strong>. Some issuers also
              have direct-affiliate relationships with us.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
              Editorial-commercial separation
            </div>
            <h2 className="font-display text-[28px] font-black text-ink leading-tight mb-4">
              Money does not move scores.
            </h2>
            <ul className="space-y-3 text-[16px] leading-[1.7] text-ink-80">
              <li className="flex gap-3">
                <span className="font-mono text-[11px] text-ink-60 mt-1">
                  ·
                </span>
                <span>
                  Editorial analysts who set ratings are organisationally
                  separate from the partnerships team.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[11px] text-ink-60 mt-1">
                  ·
                </span>
                <span>
                  Affiliate availability is a UI decision (whether the
                  &quot;Apply Now&quot; button is shown) — it never reaches the
                  rubric that produces the score.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[11px] text-ink-60 mt-1">
                  ·
                </span>
                <span>
                  No bank, AMC, lender, broker, or insurer can pay to rank
                  higher. Rankings are deterministic — same inputs always
                  produce the same output.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[11px] text-ink-60 mt-1">
                  ·
                </span>
                <span>
                  If a product we score 5/5 has no affiliate relationship and a
                  product we score 3.5/5 does, the 5/5 still ranks above the
                  3.5/5.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
              What you should know
            </div>
            <h2 className="font-display text-[28px] font-black text-ink leading-tight mb-4">
              Conflicts we disclose.
            </h2>
            <ul className="space-y-3 text-[16px] leading-[1.7] text-ink-80">
              <li className="flex gap-3">
                <span className="font-mono text-[11px] text-ink-60 mt-1">
                  ·
                </span>
                <span>
                  We may not have an affiliate relationship with every product
                  we cover. When we don&apos;t, we still review the product if
                  it&apos;s competitive in its segment — and we&apos;ll tell you
                  we don&apos;t earn a commission from it.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[11px] text-ink-60 mt-1">
                  ·
                </span>
                <span>
                  Commission rates vary by issuer and by product type.
                  Higher-fee credit cards typically pay higher commissions than
                  no-fee cards. This does NOT influence which we recommend — see{" "}
                  <Link
                    href="/methodology/credit-cards"
                    className="text-indian-gold hover:underline"
                  >
                    our credit-card methodology
                  </Link>{" "}
                  for the actual scoring formula.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[11px] text-ink-60 mt-1">
                  ·
                </span>
                <span>
                  We do not run sponsored articles. Every article on the
                  platform is editorial.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[11px] text-ink-60 mt-1">
                  ·
                </span>
                <span>
                  We do not accept payment for product placements within
                  articles or comparisons.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
              Display advertising
            </div>
            <h2 className="font-display text-[28px] font-black text-ink leading-tight mb-4">
              Banner ads (when shown).
            </h2>
            <p className="text-[16px] leading-[1.7] text-ink-80">
              We may display Google AdSense or similar programmatic ads on
              certain pages. These are clearly distinguishable from editorial
              content (sponsored / Ad labels) and the choice of which ad to show
              is made by Google&apos;s system, not by InvestingPro. Programmatic
              ads do not influence our editorial scoring.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
              Regulatory disclosure
            </div>
            <h2 className="font-display text-[28px] font-black text-ink leading-tight mb-4">
              Not a SEBI-registered advisor.
            </h2>
            <p className="text-[16px] leading-[1.7] text-ink-80">
              InvestingPro.in is a financial comparison + information platform,
              not a SEBI-registered Investment Adviser under SEBI (Investment
              Advisers) Regulations, 2013. Nothing on this site is personalised
              financial advice. Always consult a qualified advisor before making
              financial decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-canvas py-10 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-ink-60">
          <div>Disclosure v1.0 · last updated {LAST_UPDATED}</div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/affiliate-disclosure"
              className="hover:text-indian-gold transition-colors"
            >
              Affiliate disclosure
            </Link>
            <Link
              href="/about/editorial-standards"
              className="hover:text-indian-gold transition-colors"
            >
              Editorial standards
            </Link>
            <Link
              href="/methodology"
              className="hover:text-indian-gold transition-colors"
            >
              Methodology
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
