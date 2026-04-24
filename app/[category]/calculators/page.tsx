/**
 * Category Calculators Hub — /[category]/calculators/ (dynamic)
 *
 * Delegates to the shared CategoryCalculatorsHub Server Component. Literal
 * overrides exist at /credit-cards/calculators, /loans/calculators,
 * /insurance/calculators (categories whose parent dir has [slug]).
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isUrlCategory, type UrlCategory } from "@/lib/routing/category-map";
import CategoryCalculatorsHub, {
  buildCategoryCalculatorsMetadata,
} from "@/components/routing/CategoryCalculatorsHub";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isUrlCategory(category)) return { title: "Not Found" };
  return buildCategoryCalculatorsMetadata(category);
}

export default async function CategoryCalculatorsHubPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isUrlCategory(category)) notFound();
  return <CategoryCalculatorsHub urlCategory={category as UrlCategory} />;
}
