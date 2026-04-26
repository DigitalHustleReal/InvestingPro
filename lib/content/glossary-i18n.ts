/**
 * Locale-aware glossary accessor — DB-first with English fallback.
 *
 * Source-of-truth: `public.glossary_terms` (English). Per-locale
 * overrides live in `public.glossary_translations` (one row per
 * (term_id, locale) pair). The accessors below merge both: each
 * translatable field reads from the locale row, falling back to the
 * English source when NULL or missing.
 *
 * Phase 3a (this file): runtime infrastructure only. The `glossary_
 * translations` table starts empty — `/hi/glossary/<slug>` will read
 * the locale path through the runtime, then fall back to English on
 * every field. The Hindi AI translation pass (and editorial review)
 * is a follow-up session, deliberately deferred until the chrome-
 * strings native review (scheduled 2026-05-10) closes feedback so
 * the next 700 entries inherit any tone-correction lessons.
 *
 * Architectural principle (locked 2026-04-25):
 * "Every piece of content shown on the public site flows through the
 * CMS / database. Code-resident content arrays are an anti-pattern."
 *
 * Mirror pattern: `lib/content/faqs.ts`, `lib/content/editorial-hubs.ts`.
 */

import { cache } from "react";
import { createServiceClient } from "@/lib/supabase/service";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";

export type GlossaryTerm = {
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

/**
 * Subset of `GlossaryTerm` columns that have a per-locale override
 * column in `glossary_translations`. Structural fields (slug,
 * category, related_terms, related_calculators, related_guides,
 * sources, dates, reviewer_label) are not localised — they are
 * shared across locales by design.
 */
type GlossaryTranslation = Partial<
  Pick<
    GlossaryTerm,
    | "term"
    | "definition"
    | "detailed_explanation"
    | "example_numeric"
    | "example_text"
    | "why_it_matters"
    | "how_to_use"
    | "common_mistakes"
    | "full_form"
    | "pronunciation"
    | "seo_title"
    | "seo_description"
  >
>;

/** Drop NULL / undefined fields so they don't overwrite English values. */
function compactTranslation(
  row: GlossaryTranslation | null,
): GlossaryTranslation {
  if (!row) return {};
  const out: GlossaryTranslation = {};
  (Object.keys(row) as Array<keyof GlossaryTranslation>).forEach((key) => {
    const value = row[key];
    if (value === null || value === undefined) return;
    if (typeof value === "string" && value.length === 0) return;
    if (Array.isArray(value) && value.length === 0) return;
    // @ts-expect-error narrowed at runtime; TS can't see through the keyof iteration
    out[key] = value;
  });
  return out;
}

/**
 * Resolve a term with per-locale overrides applied. Wrapped in
 * React.cache so generateMetadata + render share one DB round trip.
 *
 * `/glossary/<slug>` (English, default locale) skips the
 * translations join entirely. Non-default locales do one extra
 * `glossary_translations` lookup keyed by (term_id, locale).
 */
export const getGlossaryTerm = cache(
  async (
    slug: string,
    locale: Locale = DEFAULT_LOCALE,
  ): Promise<GlossaryTerm | null> => {
    const supabase = createServiceClient();

    const { data: english } = await supabase
      .from("glossary_terms")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (!english) return null;

    if (locale === DEFAULT_LOCALE) {
      return english as GlossaryTerm;
    }

    if (!isLocale(locale)) {
      // Defensive: caller passed an invalid locale code.
      return english as GlossaryTerm;
    }

    const { data: translation } = await supabase
      .from("glossary_translations")
      .select(
        "term, definition, detailed_explanation, example_numeric, example_text, why_it_matters, how_to_use, common_mistakes, full_form, pronunciation, seo_title, seo_description",
      )
      .eq("term_id", (english as { id: string }).id)
      .eq("locale", locale)
      .maybeSingle();

    return {
      ...(english as GlossaryTerm),
      ...compactTranslation(translation as GlossaryTranslation | null),
    };
  },
);

/**
 * Fetch a small set of related-term cards. Each card shows `term`
 * + `definition` only, both of which are translatable. We do this
 * in two queries (one for the English rows by slug, one for the
 * locale overrides keyed by term_id) and merge in JS — keeps the
 * SQL simple and the cache key shape stable.
 */
export const getRelatedTermCards = cache(
  async (
    slugs: string[],
    locale: Locale = DEFAULT_LOCALE,
  ): Promise<Array<{ slug: string; term: string; definition: string }>> => {
    if (!slugs.length) return [];
    const supabase = createServiceClient();

    const { data: english } = await supabase
      .from("glossary_terms")
      .select("id, slug, term, definition")
      .in("slug", slugs)
      .eq("status", "published")
      .limit(6);

    const rows = (english ?? []) as Array<{
      id: string;
      slug: string;
      term: string;
      definition: string;
    }>;

    if (locale === DEFAULT_LOCALE || !rows.length) {
      return rows.map(({ slug, term, definition }) => ({
        slug,
        term,
        definition,
      }));
    }

    const ids = rows.map((r) => r.id);
    const { data: translations } = await supabase
      .from("glossary_translations")
      .select("term_id, term, definition")
      .in("term_id", ids)
      .eq("locale", locale);

    const byId = new Map<
      string,
      { term?: string | null; definition?: string | null }
    >();
    for (const t of (translations ?? []) as Array<{
      term_id: string;
      term: string | null;
      definition: string | null;
    }>) {
      byId.set(t.term_id, { term: t.term, definition: t.definition });
    }

    return rows.map((r) => {
      const t = byId.get(r.id);
      return {
        slug: r.slug,
        term: t?.term && t.term.length > 0 ? t.term : r.term,
        definition:
          t?.definition && t.definition.length > 0
            ? t.definition
            : r.definition,
      };
    });
  },
);

/**
 * Index page list — every published term, with locale overrides on
 * `term` and `definition` only (the only fields the index renders).
 * One query for English, one for the locale, merged in JS.
 */
export const getGlossaryIndex = cache(
  async (
    locale: Locale = DEFAULT_LOCALE,
  ): Promise<
    Array<{
      slug: string;
      term: string;
      definition: string;
      category: string;
    }>
  > => {
    const supabase = createServiceClient();
    const { data: english } = await supabase
      .from("glossary_terms")
      .select("id, slug, term, definition, category")
      .eq("status", "published")
      .order("term", { ascending: true });

    const rows = (english ?? []) as Array<{
      id: string;
      slug: string;
      term: string;
      definition: string;
      category: string;
    }>;

    if (locale === DEFAULT_LOCALE || !rows.length) {
      return rows.map(({ slug, term, definition, category }) => ({
        slug,
        term,
        definition,
        category,
      }));
    }

    const ids = rows.map((r) => r.id);
    const { data: translations } = await supabase
      .from("glossary_translations")
      .select("term_id, term, definition")
      .in("term_id", ids)
      .eq("locale", locale);

    const byId = new Map<
      string,
      { term?: string | null; definition?: string | null }
    >();
    for (const t of (translations ?? []) as Array<{
      term_id: string;
      term: string | null;
      definition: string | null;
    }>) {
      byId.set(t.term_id, { term: t.term, definition: t.definition });
    }

    return rows.map((r) => {
      const t = byId.get(r.id);
      return {
        slug: r.slug,
        term: t?.term && t.term.length > 0 ? t.term : r.term,
        definition:
          t?.definition && t.definition.length > 0
            ? t.definition
            : r.definition,
        category: r.category,
      };
    });
  },
);
