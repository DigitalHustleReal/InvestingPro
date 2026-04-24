/**
 * Category Learn Hub — /[category]/learn/ (dynamic)
 *
 * Delegates to the shared CategoryLearnHub Server Component. Literal
 * overrides exist at /credit-cards/learn, /loans/learn, /insurance/learn
 * (categories whose parent dir has [slug] that'd otherwise swallow this path).
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isUrlCategory, type UrlCategory } from "@/lib/routing/category-map";
import CategoryLearnHub, {
  buildCategoryLearnMetadata,
} from "@/components/routing/CategoryLearnHub";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isUrlCategory(category)) return { title: "Not Found" };
  return buildCategoryLearnMetadata(category);
}

export default async function CategoryLearnHubPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isUrlCategory(category)) notFound();
  return <CategoryLearnHub urlCategory={category as UrlCategory} />;
}
