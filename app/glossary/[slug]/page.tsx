/**
 * Glossary Term Detail — ISR Server Component (v3)
 *
 * Renders a single financial term. 101 terms in production.
 * Content-model aware: uses rich fields from `glossary_terms`
 * (definition, why_it_matters, example_numeric, how_to_use,
 * common_mistakes, related_terms/calculators/guides, sources).
 *
 * SEO: DefinedTerm JSON-LD + canonical + breadcrumbs schema.
 * Design: v3 tokens only (surface-ink header, canvas body,
 * indian-gold accents, Playfair headline, mono small-caps labels,
 * .article-prose for narrative).
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import { generateCanonicalUrl } from "@/lib/linking/canonical";

export const revalidate = 3600; // 1 hour
export const dynamicParams = true;

type GlossaryTerm = {
  id: string;
  term: string;
  slug: string;
  category: string;
  definition: string;
  detailed_explanation?: string | null;
  why_it_matters?: string | null;
  example_numeric?: string | null;
  example_text?: string | null;
  how_to_use?: string | null;
  common_mistakes?: string[] | null;
  related_terms?: string[] | null;
  related_calculators?: string[] | null;
  related_guides?: string[] | null;
  sources?: Array<{ title?: string; url?: string; publisher?: string }> | null;
  full_form?: string | null;
  pronunciation?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  updated_at?: string | null;
  published_at?: string | null;
  reviewer_label?: string | null;
};

async function getTerm(slug: string): Promise<GlossaryTerm | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("glossary_terms")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return (data as GlossaryTerm) ?? null;
}

async function getRelatedTermDetails(
  slugs: string[],
): Promise<Array<{ slug: string; term: string; definition: string }>> {
  if (!slugs?.length) return [];
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("glossary_terms")
    .select("slug, term, definition")
    .in("slug", slugs)
    .eq("published", true)
    .limit(6);
  return (
    (data as Array<{ slug: string; term: string; definition: string }>) ?? []
  );
}

export async function generateStaticParams() {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("glossary_terms")
      .select("slug")
      .eq("published", true)
      .order("views", { ascending: false })
      .limit(50);
    return (data || []).map((t: { slug: string }) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = await getTerm(slug);
  if (!term) return { title: "Term Not Found" };

  const canonical = generateCanonicalUrl(`/glossary/${term.slug}`);
  const title = (
    term.seo_title || `${term.term} — Meaning, Examples & How It Works`
  ).replace(/\s*\|\s*InvestingPro\s*$/i, "");
  const description =
    term.seo_description ||
    term.definition.slice(0, 155) + (term.definition.length > 155 ? "…" : "");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      publishedTime: term.published_at ?? undefined,
      modifiedTime: term.updated_at ?? undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

function formatCategory(category: string): string {
  return category
    .split(/[-_]/)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = await getTerm(slug);
  if (!term) notFound();

  const [related, relatedCalcDetails] = await Promise.all([
    getRelatedTermDetails(term.related_terms ?? []),
    Promise.resolve((term.related_calculators ?? []).slice(0, 4)),
  ]);

  const canonical = generateCanonicalUrl(`/glossary/${term.slug}`);

  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "InvestingPro Financial Glossary",
      url: "https://www.investingpro.in/glossary",
    },
    url: canonical,
    ...(term.updated_at && { dateModified: term.updated_at }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.investingpro.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Glossary",
        item: "https://www.investingpro.in/glossary",
      },
      { "@type": "ListItem", position: 3, name: term.term, item: canonical },
    ],
  };

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

      {/* Ink hero strip */}
      <section className="surface-ink pt-10 pb-14">
        <div className="max-w-[1100px] mx-auto px-6">
          {/* Breadcrumbs — v3 inline */}
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
              <li className="text-canvas truncate max-w-[200px]">
                {term.term}
              </li>
            </ol>
          </nav>

          {/* Category eyebrow */}
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            {formatCategory(term.category)} · Glossary
          </div>

          {/* Term title — Playfair display */}
          <h1 className="font-display font-black text-[42px] md:text-[60px] leading-[1.02] tracking-tight text-canvas">
            {term.term}
          </h1>

          {/* Full form + pronunciation meta strip (mono) */}
          {(term.full_form || term.pronunciation) && (
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-canvas-70">
              {term.full_form && (
                <div>
                  <span className="text-canvas-70">Full form — </span>
                  <span className="text-canvas">{term.full_form}</span>
                </div>
              )}
              {term.pronunciation && (
                <div>
                  <span className="text-canvas-70">Pronunciation — </span>
                  <span className="text-canvas">{term.pronunciation}</span>
                </div>
              )}
            </div>
          )}

          {/* Lead definition */}
          <p className="mt-7 font-serif text-[20px] md:text-[22px] leading-[1.55] text-canvas max-w-[820px]">
            {term.definition}
          </p>
        </div>
      </section>

      {/* Canvas body */}
      <section className="bg-canvas py-14">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
          {/* Article body */}
          <article className="article-prose">
            {/* Why it matters */}
            {term.why_it_matters && (
              <section className="mb-12">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
                  Why it matters
                </div>
                <h2 className="font-display text-[30px] font-black text-ink leading-tight mb-4">
                  Why {term.term} matters
                </h2>
                <div className="text-[17px] leading-[1.75] text-ink-80">
                  {term.why_it_matters}
                </div>
              </section>
            )}

            {/* Detailed explanation */}
            {term.detailed_explanation && (
              <section className="mb-12">
                <h2 className="font-display text-[30px] font-black text-ink leading-tight mb-4">
                  Understanding {term.term}
                </h2>
                <div
                  className="text-[17px] leading-[1.75] text-ink-80"
                  dangerouslySetInnerHTML={{
                    __html: term.detailed_explanation,
                  }}
                />
              </section>
            )}

            {/* Examples — numeric + text */}
            {(term.example_numeric || term.example_text) && (
              <section className="mb-12">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
                  Worked example
                </div>
                <h2 className="font-display text-[30px] font-black text-ink leading-tight mb-4">
                  Example
                </h2>
                {term.example_numeric && (
                  <div className="border-l-2 border-indian-gold pl-5 py-3 mb-5 font-mono text-[14px] leading-[1.6] text-ink whitespace-pre-wrap">
                    {term.example_numeric}
                  </div>
                )}
                {term.example_text && (
                  <p className="text-[17px] leading-[1.75] text-ink-80">
                    {term.example_text}
                  </p>
                )}
              </section>
            )}

            {/* How to use */}
            {term.how_to_use && (
              <section className="mb-12">
                <h2 className="font-display text-[30px] font-black text-ink leading-tight mb-4">
                  How to use {term.term}
                </h2>
                <div className="text-[17px] leading-[1.75] text-ink-80">
                  {term.how_to_use}
                </div>
              </section>
            )}

            {/* Common mistakes */}
            {term.common_mistakes && term.common_mistakes.length > 0 && (
              <section className="mb-12">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-warning-red mb-3">
                  Don&apos;t do this
                </div>
                <h2 className="font-display text-[30px] font-black text-ink leading-tight mb-4">
                  Common mistakes
                </h2>
                <ol className="space-y-4">
                  {term.common_mistakes.map((mistake, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="font-mono text-[13px] text-warning-red font-bold shrink-0 mt-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[17px] leading-[1.65] text-ink-80">
                        {mistake}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Sources */}
            {term.sources &&
              Array.isArray(term.sources) &&
              term.sources.length > 0 && (
                <section className="mt-14 pt-8 border-t border-ink-12">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-60 mb-4">
                    Sources
                  </div>
                  <ul className="space-y-2">
                    {term.sources.map((source, i) => (
                      <li
                        key={i}
                        className="text-[14px] text-ink-80 leading-[1.6]"
                      >
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indian-gold transition-colors underline decoration-ink-12 hover:decoration-indian-gold underline-offset-[3px]"
                          >
                            {source.title || source.url}
                          </a>
                        ) : (
                          source.title
                        )}
                        {source.publisher && (
                          <span className="text-ink-60">
                            {" "}
                            — {source.publisher}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {/* Last reviewed */}
            {term.updated_at && (
              <div className="mt-10 pt-6 border-t border-ink-12 font-mono text-[11px] uppercase tracking-wider text-ink-60">
                Last reviewed ·{" "}
                {new Date(term.updated_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                {term.reviewer_label && <span> · {term.reviewer_label}</span>}
              </div>
            )}
          </article>

          {/* Sidebar — sticky */}
          <aside className="space-y-8 lg:sticky lg:top-24 self-start">
            {/* Related terms */}
            {related.length > 0 && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
                  Related terms
                </div>
                <ul className="space-y-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/glossary/${r.slug}`}
                        className="block group"
                      >
                        <div className="font-display text-[16px] font-black text-ink group-hover:text-indian-gold transition-colors leading-tight">
                          {r.term}
                        </div>
                        <div className="text-[12px] text-ink-60 mt-1 line-clamp-2 leading-[1.4]">
                          {r.definition}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related calculators */}
            {relatedCalcDetails.length > 0 && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
                  Use this in a calculator
                </div>
                <ul className="space-y-2">
                  {relatedCalcDetails.map((calcSlug) => (
                    <li key={calcSlug}>
                      <Link
                        href={`/calculators/${calcSlug}`}
                        className="inline-flex items-center gap-2 text-[13px] text-ink hover:text-indian-gold transition-colors"
                      >
                        <span className="font-mono text-[10px] text-ink-60">
                          →
                        </span>
                        <span>
                          {calcSlug
                            .split("-")
                            .map((w) => w[0].toUpperCase() + w.slice(1))
                            .join(" ")}{" "}
                          calculator
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related guides */}
            {term.related_guides && term.related_guides.length > 0 && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
                  Read more
                </div>
                <ul className="space-y-2">
                  {term.related_guides.slice(0, 5).map((guideSlug) => (
                    <li key={guideSlug}>
                      <Link
                        href={`/articles/${guideSlug}`}
                        className="text-[13px] text-ink hover:text-indian-gold transition-colors leading-[1.4] block"
                      >
                        {guideSlug
                          .split("-")
                          .map((w) => w[0].toUpperCase() + w.slice(1))
                          .join(" ")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Back to glossary */}
            <div className="pt-4 border-t border-ink-12">
              <Link
                href="/glossary"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-60 hover:text-indian-gold transition-colors"
              >
                ← All terms
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
