/**
 * Taxes Hub — Server Component (v3)
 *
 * NerdWallet /taxes/-style hub for Indian tax planning.
 * Pulls featured articles from DB (category = 'tax-planning' or 'tax').
 * All tokens = v3 (surface-ink hero, canvas sections, indian-gold accents,
 * Playfair display, JetBrains mono labels).
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home, ArrowUpRight } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import { generateCanonicalUrl } from "@/lib/linking/canonical";
import CategoryFAQ from "@/components/routing/CategoryFAQ";

export const revalidate = 21600; // 6 hours — hub page, not time-critical

type TaxArticle = {
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  read_time: string | number | null;
  published_at: string | null;
};

async function getFeaturedTaxArticles(): Promise<TaxArticle[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("articles")
    .select("slug, title, excerpt, featured_image, read_time, published_at")
    .eq("status", "published")
    .in("category", ["tax-planning", "tax", "taxation"])
    .order("published_at", { ascending: false })
    .limit(6);
  return (data as TaxArticle[]) ?? [];
}

export const metadata: Metadata = {
  title: "Indian Tax Planning 2026 — ITR, 80C, HRA, Capital Gains Explained",
  description:
    "Complete Indian tax resource: old vs new regime calculator, Section 80C + 80D deductions, HRA exemption, LTCG on mutual funds, ITR filing guide. Worked examples for every salary bracket.",
  alternates: { canonical: generateCanonicalUrl("/taxes") },
  openGraph: {
    title: "Indian Tax Planning — ITR, 80C, HRA, LTCG",
    description:
      "Old vs new regime, deductions, and capital gains — explained with worked examples for FY 2026-27.",
    url: generateCanonicalUrl("/taxes"),
    type: "website",
  },
};

// CMS-MIGRATION: these arrays (TAX_CALCULATORS, DEDUCTIONS, REGIME_SLABS,
// KEY_DATES) should live in DB tables — annual rev policy, editorial team
// edits without deploy. See docs/MANUAL_ACTIONS_TRACKER.md.
const TAX_CALCULATORS = [
  {
    slug: "old-vs-new-tax",
    title: "Old vs New regime",
    tagline: "Find out which saves you more",
    accent: "₹",
  },
  {
    slug: "tax",
    title: "Income tax",
    tagline: "FY 2026-27 slabs, both regimes",
    accent: "%",
  },
  {
    slug: "hra",
    title: "HRA exemption",
    tagline: "Metro vs non-metro, 3-component rule",
    accent: "₹",
  },
  {
    slug: "80c",
    title: "Section 80C optimizer",
    tagline: "₹1.5L cap across PPF, ELSS, EPF, NPS",
    accent: "§",
  },
  {
    slug: "capital-gains-tax",
    title: "Capital gains (LTCG/STCG)",
    tagline: "Equity, debt, real estate, gold",
    accent: "%",
  },
  {
    slug: "ltcg",
    title: "LTCG calculator",
    tagline: "After 2024 Budget ₹1.25L threshold",
    accent: "₹",
  },
] as const;

const DEDUCTIONS = [
  {
    section: "80C",
    cap: "₹1.5 L",
    covers: "PPF, ELSS, EPF, tax-saver FD, life insurance, home-loan principal",
  },
  {
    section: "80D",
    cap: "₹25–₹1 L",
    covers: "Self + family + senior-parent health insurance premiums",
  },
  {
    section: "80CCD(1B)",
    cap: "₹50,000",
    covers: "Over-and-above NPS contribution on top of 80C",
  },
  {
    section: "80E",
    cap: "No cap",
    covers: "Education-loan interest for higher studies",
  },
  {
    section: "80G",
    cap: "50–100%",
    covers: "Donations to approved charitable institutions",
  },
  {
    section: "24(b)",
    cap: "₹2 L",
    covers: "Home-loan interest on self-occupied property",
  },
];

const REGIME_SLABS = [
  { range: "Up to ₹3 L", old: "Nil", neu: "Nil" },
  { range: "₹3 L – ₹6 L", old: "5%", neu: "5%" },
  { range: "₹6 L – ₹9 L", old: "20%", neu: "10%" },
  { range: "₹9 L – ₹12 L", old: "20%", neu: "15%" },
  { range: "₹12 L – ₹15 L", old: "30%", neu: "20%" },
  { range: "Above ₹15 L", old: "30%", neu: "30%" },
];

const KEY_DATES = [
  { when: "15 Jun 2026", what: "Advance tax — 1st instalment (15%)" },
  { when: "15 Sep 2026", what: "Advance tax — 2nd instalment (45%)" },
  { when: "15 Dec 2026", what: "Advance tax — 3rd instalment (75%)" },
  { when: "31 Jul 2026", what: "ITR filing deadline — non-audit cases" },
  { when: "15 Mar 2027", what: "Advance tax — final instalment (100%)" },
  { when: "31 Oct 2026", what: "ITR filing — audit cases" },
];

function formatReadTime(rt: string | number | null): string {
  if (!rt) return "";
  const n = typeof rt === "string" ? parseInt(rt, 10) : rt;
  return Number.isFinite(n) && n > 0 ? `${n} min read` : "";
}

export default async function TaxesHubPage() {
  const articles = await getFeaturedTaxArticles();

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
        name: "Taxes",
        item: generateCanonicalUrl("/taxes"),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero — ink */}
      <section className="surface-ink pt-10 pb-16">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-canvas-70">
              <li>
                <Link
                  href="/"
                  className="hover:text-indian-gold transition-colors"
                >
                  <Home className="w-3 h-3" />
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 text-canvas-70" />
              <li className="text-canvas">Taxes</li>
            </ol>
          </nav>

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-5">
            India&apos;s tax code · FY 2026-27
          </div>

          <h1 className="font-display font-black text-[48px] md:text-[72px] lg:text-[84px] leading-[0.98] tracking-tight text-canvas max-w-[1000px]">
            Taxes, <span className="text-indian-gold">demystified.</span>
          </h1>

          <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[740px]">
            Every deduction, every regime, every filing deadline — worked out in
            rupees for your salary bracket. No jargon. No misleading promises.
          </p>

          {/* Data strip */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-5 max-w-[900px] font-mono">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-canvas-70">
                Old regime
              </div>
              <div className="text-[22px] font-black text-canvas mt-1">
                6 slabs
              </div>
              <div className="text-[11px] text-canvas-70 mt-0.5">
                With deductions
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-canvas-70">
                New regime
              </div>
              <div className="text-[22px] font-black text-canvas mt-1">
                6 slabs
              </div>
              <div className="text-[11px] text-canvas-70 mt-0.5">
                Lower rates, no deductions
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-canvas-70">
                ITR due
              </div>
              <div className="text-[22px] font-black text-indian-gold mt-1">
                31 Jul 2026
              </div>
              <div className="text-[11px] text-canvas-70 mt-0.5">
                Non-audit cases
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-canvas-70">
                LTCG threshold
              </div>
              <div className="text-[22px] font-black text-canvas mt-1">
                ₹1.25 L
              </div>
              <div className="text-[11px] text-canvas-70 mt-0.5">
                Equity, post-Budget 2024
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculators — canvas */}
      <section className="bg-canvas py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
                Run the numbers
              </div>
              <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight">
                Tax calculators
              </h2>
            </div>
            <Link
              href="/calculators"
              className="font-mono text-[11px] uppercase tracking-wider text-ink-60 hover:text-indian-gold transition-colors inline-flex items-center gap-1"
            >
              All calculators <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TAX_CALCULATORS.map((c) => (
              <Link
                key={c.slug}
                href={`/calculators/${c.slug}`}
                className="group block bg-white border border-ink-12 rounded-sm p-6 hover:border-indian-gold transition-colors"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[22px] font-black text-indian-gold leading-none">
                    {c.accent}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-ink-60 group-hover:text-indian-gold transition-colors" />
                </div>
                <h3 className="mt-6 font-display text-[22px] font-black text-ink leading-tight group-hover:text-indian-gold transition-colors">
                  {c.title}
                </h3>
                <p className="mt-2 text-[13px] text-ink-60 leading-[1.5]">
                  {c.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Regime comparison — ink */}
      <section className="surface-ink py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
            Side-by-side
          </div>
          <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-canvas tracking-tight mb-2">
            Old regime vs New regime
          </h2>
          <p className="font-serif text-[17px] text-canvas-70 max-w-[720px] mb-10">
            FY 2026-27 slabs. New regime is default; opt for old via Form 10-IEA
            only if your deductions ({">"} ₹2–₹3 L) justify it.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] font-mono text-[14px] text-canvas">
              <thead>
                <tr className="border-b border-canvas-15">
                  <th className="text-left py-3 pr-6 text-[10px] uppercase tracking-wider text-canvas-70 font-normal">
                    Taxable income
                  </th>
                  <th className="text-right py-3 px-4 text-[10px] uppercase tracking-wider text-canvas-70 font-normal">
                    Old regime
                  </th>
                  <th className="text-right py-3 pl-4 text-[10px] uppercase tracking-wider text-indian-gold font-normal">
                    New regime
                  </th>
                </tr>
              </thead>
              <tbody>
                {REGIME_SLABS.map((slab) => (
                  <tr
                    key={slab.range}
                    className="border-b border-canvas-15 hover:bg-canvas/5"
                  >
                    <td className="py-4 pr-6 text-[14px]">{slab.range}</td>
                    <td className="py-4 px-4 text-right text-[14px] text-canvas-70">
                      {slab.old}
                    </td>
                    <td className="py-4 pl-4 text-right text-[14px] text-indian-gold font-bold">
                      {slab.neu}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-mono text-[11px] text-canvas-70 mt-6 max-w-[720px] leading-[1.6]">
            Surcharge and 4% health &amp; education cess apply on top. Rebate
            u/s 87A makes incomes up to ₹7 L (new) / ₹5 L (old) effectively
            zero-tax.
          </p>
        </div>
      </section>

      {/* Deductions grid — canvas */}
      <section className="bg-canvas py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
            Old regime only
          </div>
          <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight mb-10">
            Key deductions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEDUCTIONS.map((d) => (
              <div
                key={d.section}
                className="bg-white border border-ink-12 rounded-sm p-6"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display font-black text-[28px] text-ink leading-none">
                    {d.section}
                  </span>
                  <span className="font-mono text-[14px] font-bold text-indian-gold">
                    {d.cap}
                  </span>
                </div>
                <p className="mt-5 text-[14px] text-ink-80 leading-[1.55]">
                  {d.covers}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured articles — ink */}
      {articles.length > 0 && (
        <section className="surface-ink py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
                  Deep dives
                </div>
                <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-canvas tracking-tight">
                  From the tax desk
                </h2>
              </div>
              <Link
                href="/articles?category=tax-planning"
                className="font-mono text-[11px] uppercase tracking-wider text-canvas-70 hover:text-indian-gold transition-colors inline-flex items-center gap-1"
              >
                All tax articles <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/articles/${a.slug}`}
                  className="group block"
                >
                  {a.featured_image && (
                    <div className="relative aspect-[16/10] bg-ink-12 overflow-hidden rounded-sm mb-4">
                      <Image
                        src={a.featured_image}
                        alt={a.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-2">
                    Tax Desk
                    {formatReadTime(a.read_time)
                      ? ` · ${formatReadTime(a.read_time)}`
                      : ""}
                  </div>
                  <h3 className="font-display text-[20px] font-black text-canvas leading-[1.2] group-hover:text-indian-gold transition-colors">
                    {a.title}
                  </h3>
                  {a.excerpt && (
                    <p className="mt-3 text-[13px] text-canvas-70 leading-[1.55] line-clamp-3">
                      {a.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key dates strip — canvas */}
      <section className="bg-canvas py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
            Mark your calendar
          </div>
          <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight mb-10">
            Key dates · FY 2026-27
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
            {KEY_DATES.map((d) => (
              <div
                key={d.when}
                className="flex items-start gap-5 py-4 border-b border-ink-12"
              >
                <div className="shrink-0 font-mono text-[12px] font-bold text-indian-gold tracking-wider uppercase min-w-[110px]">
                  {d.when}
                </div>
                <div className="text-[15px] text-ink leading-[1.5]">
                  {d.what}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ block — GEO-optimized Q&A */}
      <CategoryFAQ urlCategory="taxes" variant="canvas" />

      {/* CTA — ink */}
      <section className="surface-ink py-14">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
              This week in Indian money
            </div>
            <h3 className="font-display font-black text-[26px] md:text-[32px] text-canvas leading-tight max-w-[640px]">
              Every Sunday — tax rule changes, deadlines, and one thing worth
              acting on.
            </h3>
          </div>
          <Link
            href="/#newsletter"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indian-gold text-ink font-bold text-[14px] tracking-wide rounded-sm hover:bg-indian-gold/90 transition-colors"
          >
            Subscribe free
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
