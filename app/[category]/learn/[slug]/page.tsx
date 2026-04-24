/**
 * Category-Nested Article Route — /[category]/learn/[slug]
 *
 * Phase 2 of the NerdWallet URL migration
 * (see docs/URL_STRUCTURE_NERDWALLET.md).
 *
 * For now this route validates the URL category + article's DB category match,
 * then redirects to the current canonical `/articles/[slug]`. Phase 3 will
 * flip the direction — `/[cat]/learn/[slug]` becomes canonical and
 * `/articles/[slug]` redirects here.
 *
 * Why redirect-first instead of full render?
 *   1. Zero risk to the existing `/articles/[slug]` render (which works).
 *   2. Establishes the URL structure immediately — all NerdWallet-style
 *      links start resolving today.
 *   3. Single flip point in Phase 3 (swap the redirect target + update
 *      canonical in /articles/[slug]).
 */

import { cache } from "react";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import {
  categoryMatches,
  isUrlCategory,
  type UrlCategory,
} from "@/lib/routing/category-map";
import { generateCanonicalUrl } from "@/lib/linking/canonical";

export const dynamic = "force-dynamic"; // redirect route; no caching needed

type ArticleLookup = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  status: string | null;
};

// React.cache dedupes across generateMetadata + default render in the
// same request (server-cache-react, HIGH priority).
const lookupArticle = cache(
  async (slug: string): Promise<ArticleLookup | null> => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("articles")
      .select("slug, title, excerpt, category, status")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    return (data as ArticleLookup) ?? null;
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  if (!isUrlCategory(category)) return { title: "Not Found" };

  const article = await lookupArticle(slug);
  if (!article || !categoryMatches(article.category, category)) {
    return { title: "Not Found" };
  }

  const canonical = generateCanonicalUrl(`/articles/${article.slug}`);
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    alternates: { canonical },
    robots: { index: false, follow: true }, // this path 301s — don't index it
  };
}

export default async function CategoryLearnArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  // 1. URL category must be a recognized top-level
  if (!isUrlCategory(category)) {
    notFound();
  }

  // 2. Article must exist + be published
  const article = await lookupArticle(slug);
  if (!article) {
    notFound();
  }

  // 3. URL category must match the article's DB-derived URL category.
  //    Prevents /loans/learn/sip-calculator (which is an investing article).
  if (!categoryMatches(article.category, category as UrlCategory)) {
    notFound();
  }

  // All checks passed — redirect to the current canonical.
  // Phase 3 will invert this: /articles/[slug] will redirect here instead.
  permanentRedirect(`/articles/${article.slug}`);
}
