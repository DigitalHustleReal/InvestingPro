/**
 * /glossary/[slug] — Server-component glossary term detail page.
 *
 * Pre-2026-04-26: this was a 'use client' page with runtime fetch via
 * api.entities.Glossary.list() — meaning Google couldn't reliably
 * index any of the 101 terms (they all loaded via client JS only).
 *
 * Now: full SSG with generateStaticParams (101 terms pre-rendered),
 * generateMetadata for proper meta tags, JSON-LD DefinedTerm schema,
 * v3 design tokens. This is one of the largest single SEO wins on
 * the platform — every glossary term becomes a real indexable URL.
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home, BookOpen, Calculator } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { generateCanonicalUrl } from "@/lib/linking/canonical";

export const revalidate = 3600;
const LAST_UPDATED_FALLBACK = "2026-04-26";

interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  category: string;
  definition: string;
  detailed_explanation?: string | null;
  example?: string | null;
  example_numeric?: string | null;
  example_text?: string | null;
  why_it_matters?: string | null;
  how_to_use?: string | null;
  common_mistakes?: string[] | null;
  related_terms?: string[] | null;
  related_calculators?: string[] | null;
  related_guides?: string[] | null;
  full_form?: string | null;
  pronunciation?: string | null;
  sources?: string[] | string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  updated_at?: string | null;
  reviewed_at?: string | null;
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon);
}

async function getTerm(slug: string): Promise<GlossaryTerm | null> {
  const supabase = getServiceClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("glossary_terms")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return (data as GlossaryTerm) || null;
}

async function getRelatedTerms(
  slugs: string[],
): Promise<{ slug: string; term: string }[]> {
  if (!slugs?.length) return [];
  const supabase = getServiceClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("glossary_terms")
    .select("slug, term")
    .in("slug", slugs.slice(0, 6))
    .eq("status", "published");
  return (data as { slug: string; term: string }[]) || [];
}

export async function generateStaticParams() {
  const supabase = getServiceClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("glossary_terms")
    .select("slug")
    .eq("status", "published")
    .limit(1000);
  return (data || []).map((t: { slug: string }) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = await getTerm(slug);
  if (!term) {
    return {
      title: "Term not found | InvestingPro Glossary",
    };
  }
  const title =
    term.seo_title ||
    `${term.term} — Definition, Examples & Calculator | InvestingPro`;
  const description =
    term.seo_description ||
    `${term.term}: ${term.definition?.slice(0, 155) || "Plain-English finance term explained with Indian examples."}`;
  return {
    title,
    description,
    alternates: { canonical: generateCanonicalUrl(`/glossary/${slug}`) },
    openGraph: {
      title,
      description,
      url: generateCanonicalUrl(`/glossary/${slug}`),
      type: "article",
    },
  };
}

function ParaList({ value }: { value?: string | null }) {
  if (!value) return null;
  // Render newline-separated paragraphs while keeping inline formatting plain.
  const parts = value.split(/\n{2,}|\r\n{2,}/g).filter(Boolean);
  if (parts.length <= 1) {
    return <p className="text-[16px] leading-[1.75] text-ink mb-4">{value}</p>;
  }
  return (
    <>
      {parts.map((p, i) => (
        <p key={i} className="text-[16px] leading-[1.75] text-ink mb-4">
          {p}
        </p>
      ))}
    </>
  );
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = await getTerm(slug);
  if (!term) notFound();

  const relatedTerms = term.related_terms
    ? await getRelatedTerms(term.related_terms as string[])
    : [];

  // JSON-LD: DefinedTerm + BreadcrumbList
  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "InvestingPro Glossary",
      url: "https://investingpro.in/glossary",
    },
    url: generateCanonicalUrl(`/glossary/${slug}`),
    ...(term.updated_at ? { dateModified: term.updated_at } : {}),
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
        name: "Glossary",
        item: generateCanonicalUrl("/glossary"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: term.term,
        item: generateCanonicalUrl(`/glossary/${slug}`),
      },
    ],
  };

  const lastReviewed = term.reviewed_at
    ? new Date(term.reviewed_at).toISOString().split("T")[0]
    : term.updated_at
      ? new Date(term.updated_at).toISOString().split("T")[0]
      : LAST_UPDATED_FALLBACK;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-canvas">
        {/* Hero */}
        <section className="surface-ink pt-12 pb-14">
          <div className="max-w-[900px] mx-auto px-6">
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
                    href="/glossary"
                    className="hover:text-indian-gold transition-colors"
                  >
                    Glossary
                  </Link>
                </li>
                <ChevronRight className="w-3 h-3 text-canvas-70" />
                <li className="text-canvas truncate">{term.term}</li>
              </ol>
            </nav>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
              {term.category || "Finance term"} · Last reviewed {lastReviewed}
            </div>
            <h1 className="font-display font-black text-[44px] md:text-[60px] leading-[1.05] tracking-tight text-canvas">
              {term.term}
              {term.full_form && (
                <span className="block font-display font-medium text-[18px] md:text-[22px] text-canvas-70 mt-3 italic">
                  {term.full_form}
                </span>
              )}
            </h1>
            <p className="mt-6 font-serif text-[19px] md:text-[21px] leading-[1.55] text-canvas max-w-[820px]">
              {term.definition}
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="bg-canvas py-12">
          <div className="max-w-[820px] mx-auto px-6 article-prose">
            {term.detailed_explanation && (
              <div className="mb-10">
                <h2 className="font-display text-[28px] md:text-[32px] font-black text-ink leading-tight mb-4">
                  Understanding {term.term}
                </h2>
                <ParaList value={term.detailed_explanation} />
              </div>
            )}

            {term.why_it_matters && (
              <div className="mb-10">
                <h2 className="font-display text-[28px] md:text-[32px] font-black text-ink leading-tight mb-4">
                  Why it matters
                </h2>
                <ParaList value={term.why_it_matters} />
              </div>
            )}

            {(term.example_numeric || term.example_text || term.example) && (
              <div className="mb-10">
                <h2 className="font-display text-[28px] md:text-[32px] font-black text-ink leading-tight mb-4">
                  Example
                </h2>
                {term.example_numeric && (
                  <div className="border-l-2 border-indian-gold pl-5 mb-4 py-2">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-1">
                      Numeric example
                    </div>
                    <ParaList value={term.example_numeric} />
                  </div>
                )}
                {term.example_text && <ParaList value={term.example_text} />}
                {!term.example_numeric &&
                  !term.example_text &&
                  term.example && <ParaList value={term.example} />}
              </div>
            )}

            {term.how_to_use && (
              <div className="mb-10">
                <h2 className="font-display text-[28px] md:text-[32px] font-black text-ink leading-tight mb-4">
                  How to use it
                </h2>
                <ParaList value={term.how_to_use} />
              </div>
            )}

            {term.common_mistakes && term.common_mistakes.length > 0 && (
              <div className="mb-10">
                <h2 className="font-display text-[28px] md:text-[32px] font-black text-ink leading-tight mb-4">
                  Common mistakes
                </h2>
                <ul className="space-y-3 text-[16px] leading-[1.7] text-ink">
                  {term.common_mistakes.map((m, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono text-[11px] text-warning-red mt-1">
                        ·
                      </span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {term.related_calculators &&
              term.related_calculators.length > 0 && (
                <div className="mb-10 border-t-2 border-ink-12 pt-8">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3 flex items-center gap-2">
                    <Calculator className="w-3.5 h-3.5" /> Related calculators
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[15px]">
                    {term.related_calculators.slice(0, 6).map((c) => (
                      <li key={c}>
                        <Link
                          href={`/calculators/${c}`}
                          className="text-indian-gold hover:underline"
                        >
                          {c
                            .split("-")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}{" "}
                          calculator &rarr;
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {relatedTerms.length > 0 && (
              <div className="border-t-2 border-ink-12 pt-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" /> Related terms
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[15px]">
                  {relatedTerms.map((rt) => (
                    <li key={rt.slug}>
                      <Link
                        href={`/glossary/${rt.slug}`}
                        className="text-indian-gold hover:underline"
                      >
                        {rt.term} &rarr;
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Footer strip */}
        <section className="bg-canvas py-10 border-t-2 border-ink-12">
          <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-ink-60">
            <div>
              {term.term} · last reviewed {lastReviewed}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link
                href="/glossary"
                className="hover:text-indian-gold transition-colors"
              >
                All terms
              </Link>
              <Link
                href="/methodology"
                className="hover:text-indian-gold transition-colors"
              >
                Methodology
              </Link>
              <Link
                href="/articles"
                className="hover:text-indian-gold transition-colors"
              >
                Read articles
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
