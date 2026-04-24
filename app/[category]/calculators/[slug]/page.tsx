/**
 * Category-Nested Calculator Route — /[category]/calculators/[slug]
 *
 * Phase 2 Step 3 of NerdWallet URL migration.
 * (see docs/URL_STRUCTURE_NERDWALLET.md)
 *
 * Accepts URL category + calc slug, confirms both are known and that the
 * slug lives under the given URL category per CALCULATOR_CATEGORY,
 * then 301s to the current canonical /calculators/[slug].
 *
 * Phase 3 will flip canonical: /[cat]/calculators/[slug] becomes the index
 * URL and the flat /calculators/[slug] path redirects here.
 */

import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { calculatorCategory, isUrlCategory } from "@/lib/routing/category-map";

export const dynamic = "force-dynamic";

/**
 * Accept (cat, slug) only when calculatorCategory(slug) === cat.
 * Unknown slugs default to "learn", so /learn/calculators/<unknown> resolves
 * here and 301s to the flat /calculators/<unknown> if that page exists
 * (a 404 there is better than misrouting to a wrong category).
 */
function accept(category: string, slug: string): boolean {
  if (!isUrlCategory(category)) return false;
  return calculatorCategory(slug) === category;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  if (!accept(category, slug)) return { title: "Not Found" };
  return {
    title: slug,
    robots: { index: false, follow: true }, // 301s to canonical — don't index
  };
}

export default async function CategoryCalculatorRedirect({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  if (!accept(category, slug)) notFound();
  permanentRedirect(`/calculators/${slug}`);
}
