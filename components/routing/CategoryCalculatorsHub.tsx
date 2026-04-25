/**
 * Shared Category Calculators Hub — Server Component
 *
 * Used by the dynamic /[category]/calculators/page.tsx and the literal
 * overrides at /credit-cards/calculators, /loans/calculators,
 * /insurance/calculators (which exist to defeat the [slug] conflict).
 *
 * Calculator display meta migrated to Supabase `calculators` table on
 * 2026-04-25 — see lib/content/calculators.ts. Route validation still
 * uses CALCULATOR_CATEGORY (sync map) from lib/routing/category-map.ts.
 */

import Link from "next/link";
import { ArrowUpRight, ChevronRight, Home } from "lucide-react";
import { urlCategoryLabel, type UrlCategory } from "@/lib/routing/category-map";
import { generateCanonicalUrl } from "@/lib/linking/canonical";
import { getCalculatorsForCategory } from "@/lib/content/calculators";

export default async function CategoryCalculatorsHub({
  urlCategory,
}: {
  urlCategory: UrlCategory;
}) {
  const label = urlCategoryLabel(urlCategory);
  const calculators = await getCalculatorsForCategory(urlCategory);

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
        name: label,
        item: generateCanonicalUrl(`/${urlCategory}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Calculators",
        item: generateCanonicalUrl(`/${urlCategory}/calculators`),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="surface-ink pt-10 pb-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <nav aria-label="Breadcrumb" className="mb-10">
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
                  href={`/${urlCategory}`}
                  className="hover:text-indian-gold transition-colors"
                >
                  {label}
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 text-canvas-70" />
              <li className="text-canvas">Calculators</li>
            </ol>
          </nav>

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-4">
            {label} · Run the numbers
          </div>
          <h1 className="font-display font-black text-[44px] md:text-[64px] lg:text-[76px] leading-[1.02] tracking-tight text-canvas max-w-[980px]">
            {label} <span className="text-indian-gold">calculators.</span>
          </h1>
          <p className="mt-6 font-serif text-[18px] md:text-[20px] leading-[1.55] text-canvas-70 max-w-[740px]">
            Free calculators — rupee-accurate, FY 2026-27 ready, worked examples
            built in.
          </p>
        </div>
      </section>

      <section className="bg-canvas py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          {calculators.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-[18px] text-ink-60">
                No calculators mapped to this category yet.
              </p>
              <Link
                href="/calculators"
                className="mt-6 inline-block font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline"
              >
                Browse all calculators →
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {calculators.map((c) => (
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
                    <h3 className="mt-6 font-display text-[20px] font-black text-ink leading-tight group-hover:text-indian-gold transition-colors">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-[13px] text-ink-60 leading-[1.5]">
                      {c.tagline}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="mt-14 pt-8 border-t border-ink-12 flex items-center justify-between">
                <p className="text-[14px] text-ink-60">
                  Looking for something else?
                </p>
                <Link
                  href="/calculators"
                  className="font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline inline-flex items-center gap-1"
                >
                  All calculators <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

/** Shared metadata builder. */
export function buildCategoryCalculatorsMetadata(urlCategory: UrlCategory) {
  const label = urlCategoryLabel(urlCategory);
  return {
    title: `${label} Calculators — Plan, Compare, Decide`,
    description: `Free ${label.toLowerCase()} calculators for Indian users — rupee-accurate, FY 2026-27 slabs, worked examples built in.`,
    alternates: {
      canonical: generateCanonicalUrl(`/${urlCategory}/calculators`),
    },
    openGraph: {
      title: `${label} Calculators`,
      description: `Run the numbers for ${label.toLowerCase()} decisions.`,
      url: generateCanonicalUrl(`/${urlCategory}/calculators`),
      type: "website" as const,
    },
  };
}
