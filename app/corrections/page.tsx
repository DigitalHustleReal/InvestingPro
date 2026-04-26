import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const LAST_UPDATED = "2026-04-26";

export const metadata: Metadata = {
  title: "Corrections Policy | InvestingPro",
  description:
    "How InvestingPro handles errors, corrections, and transparency. Every confirmed correction is logged with the original claim, the corrected version, and the date the change went live.",
  alternates: { canonical: "https://investingpro.in/corrections" },
  openGraph: {
    title: "Corrections Policy | InvestingPro",
    description:
      "How we handle errors, corrections, and transparency on InvestingPro.",
    url: "https://investingpro.in/corrections",
    type: "website",
  },
};

const PROCESS = [
  {
    step: "1 · Report",
    body: "Anyone — reader, source, regulator, partner — can flag an error. Email contact@investingpro.in with the article URL, the specific claim, and the source you believe contradicts it.",
  },
  {
    step: "2 · Acknowledge (within 48 hours)",
    body: "We acknowledge every fact-check request within 48 hours. We do not ignore reports, even when we ultimately disagree.",
  },
  {
    step: "3 · Investigate",
    body: "The relevant editorial desk (Tax / Credit / Investment / Lending / Insurance / Banking) cross-checks the claim against original-source data — RBI / SEBI / IRDAI / AMFI / IT Act / issuer rate cards.",
  },
  {
    step: "4 · Correct + log",
    body: "If the claim is wrong, we update the article and log the correction here on /corrections with: original claim, corrected version, date of change, and source we relied on. The article itself displays a 'Last updated' stamp at the top.",
  },
  {
    step: "5 · Disclose materiality",
    body: "If the error materially changed the recommendation (e.g., a fund was rated 4.5 stars based on a wrong return number), we disclose that prominently in the article and reset the rating.",
  },
];

const COMMITMENTS = [
  "Every confirmed error is logged publicly on this page — not silently edited away.",
  "We never delete an article to hide an error; we correct in place with version history.",
  "Updated articles show a 'Last updated YYYY-MM-DD' stamp at the top of the page.",
  "If a methodology change reverses a recommendation, the prior version is archived.",
  "We disclose conflicts of interest if the error involves a product we earn commission on.",
  "We accept reports about minor typos, factual errors, and methodology disputes equally.",
];

const RECENT_CORRECTIONS: {
  date: string;
  article: string;
  correction: string;
  source: string;
}[] = [
  // Empty until first real correction lands. We will not fabricate
  // historical corrections to look responsive.
];

export default function CorrectionsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Corrections Policy",
    description:
      "How InvestingPro handles errors, corrections, and transparency.",
    url: "https://investingpro.in/corrections",
    dateModified: `${LAST_UPDATED}T00:00:00+05:30`,
    publisher: {
      "@type": "Organization",
      name: "InvestingPro",
      url: "https://investingpro.in",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

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
                <li className="text-canvas">Corrections</li>
              </ol>
            </nav>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
              Trust · Last updated {LAST_UPDATED}
            </div>
            <h1 className="font-display font-black text-[44px] md:text-[64px] leading-[1.02] tracking-tight text-canvas max-w-[860px]">
              Corrections <span className="text-indian-gold">policy</span>.
            </h1>
            <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[820px]">
              When we get something wrong, we fix it transparently — in public,
              with full audit trail, with the date the change went live. No
              silent edits, no hidden retractions.
            </p>
          </div>
        </section>

        <section className="bg-canvas py-14">
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
              Five-step process
            </div>
            <h2 className="font-display text-[30px] md:text-[36px] font-black text-ink leading-tight mb-10 max-w-[820px]">
              From report to correction.
            </h2>
            <div className="space-y-7 max-w-[820px]">
              {PROCESS.map((p) => (
                <div
                  key={p.step}
                  className="border-l-2 border-indian-gold pl-5"
                >
                  <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-2">
                    {p.step}
                  </div>
                  <p className="text-[15px] leading-[1.65] text-ink-80">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-canvas py-14 border-t-2 border-ink-12">
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
              Our commitments
            </div>
            <h2 className="font-display text-[28px] md:text-[34px] font-black text-ink leading-tight mb-6 max-w-[820px]">
              What we promise.
            </h2>
            <ul className="space-y-3 text-[15px] leading-[1.65] text-ink-80 max-w-[820px]">
              {COMMITMENTS.map((c, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-[11px] text-ink-60 mt-1">
                    ·
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-canvas py-14 border-t-2 border-ink-12">
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
              Recent corrections
            </div>
            <h2 className="font-display text-[28px] md:text-[34px] font-black text-ink leading-tight mb-6 max-w-[820px]">
              Public log.
            </h2>
            {RECENT_CORRECTIONS.length === 0 ? (
              <p className="text-[15px] leading-[1.6] text-ink-80 max-w-[820px]">
                No corrections have been logged since launch. As we publish
                more, this section will list every confirmed correction with the
                original claim, the corrected version, and the date. We will not
                pre-populate this list with fabricated entries to look more
                responsive.
              </p>
            ) : (
              <div className="space-y-5 max-w-[820px]">
                {RECENT_CORRECTIONS.map((c, i) => (
                  <div key={i} className="border-l-2 border-warning-red pl-5">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-warning-red mb-1">
                      {c.date}
                    </div>
                    <h3 className="font-display text-[18px] font-bold text-ink mb-2">
                      {c.article}
                    </h3>
                    <p className="text-[14px] leading-[1.6] text-ink-80 mb-2">
                      {c.correction}
                    </p>
                    <p className="text-[12px] text-ink-60 italic">
                      Source: {c.source}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-canvas py-10 border-t-2 border-ink-12">
          <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-ink-60">
            <div>Corrections policy v1.0 · last updated {LAST_UPDATED}</div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link
                href="/fact-check"
                className="hover:text-indian-gold transition-colors"
              >
                Fact-check policy
              </Link>
              <Link
                href="/about/editorial-standards"
                className="hover:text-indian-gold transition-colors"
              >
                Editorial standards
              </Link>
              <Link
                href="/about/editorial-team"
                className="hover:text-indian-gold transition-colors"
              >
                Editorial team
              </Link>
              <a
                href="mailto:contact@investingpro.in"
                className="hover:text-indian-gold transition-colors"
              >
                contact@investingpro.in
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
