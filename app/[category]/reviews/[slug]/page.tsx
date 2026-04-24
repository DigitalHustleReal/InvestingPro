/**
 * Category-Nested Product Review Route — /[category]/reviews/[slug]
 *
 * Phase 2 Step 2 of NerdWallet URL migration.
 * (see docs/URL_STRUCTURE_NERDWALLET.md)
 *
 * For each URL category, tries each configured product table in order and
 * 301-redirects to the current canonical detail URL on first match.
 * Categories with no product tables (taxes, learn) 404.
 *
 * Phase 3 will flip canonical: /[cat]/reviews/[slug] becomes the index URL
 * and current /credit-cards/[slug] etc. redirect here.
 */

import { cache } from "react";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import {
  isUrlCategory,
  PRODUCT_REVIEW_TABLES,
  type UrlCategory,
} from "@/lib/routing/category-map";

export const dynamic = "force-dynamic"; // redirect route — no caching

type ProductMatch = {
  canonicalPath: string;
  name: string | null;
};

// Dedupe the lookup across generateMetadata + default render.
const findProduct = cache(
  async (
    urlCategory: UrlCategory,
    slug: string,
  ): Promise<ProductMatch | null> => {
    const candidates = PRODUCT_REVIEW_TABLES[urlCategory];
    if (!candidates?.length) return null;

    const supabase = createServiceClient();

    for (const { table, canonicalPathPrefix } of candidates) {
      const { data, error } = await supabase
        .from(table)
        .select("slug, name")
        .eq("slug", slug)
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        return {
          canonicalPath: `${canonicalPathPrefix}/${slug}`,
          name: (data as { name: string | null }).name,
        };
      }
    }
    return null;
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  if (!isUrlCategory(category)) return { title: "Not Found" };

  const match = await findProduct(category, slug);
  if (!match) return { title: "Not Found" };

  return {
    title: match.name ?? slug,
    robots: { index: false, follow: true }, // 301s to canonical — don't index this path
  };
}

export default async function CategoryReviewRedirect({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  if (!isUrlCategory(category)) notFound();

  const match = await findProduct(category, slug);
  if (!match) notFound();

  permanentRedirect(match.canonicalPath);
}
