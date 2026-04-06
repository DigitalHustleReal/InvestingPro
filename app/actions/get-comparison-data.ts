"use server";
import { getCreditCardsServer } from "@/lib/products/get-credit-cards-server";
import { RichProduct } from "@/types/rich-product";
import { logger } from "@/lib/logger";

/**
 * Fetches products by their slugs for the shared comparison view.
 * Currently optimized for Credit Cards.
 */
export async function getComparisonProducts(
  slugs: string[],
): Promise<RichProduct[]> {
  if (!slugs || slugs.length === 0) return [];

  try {
    // Fetch all cards (cached/optimized in real app)
    const allCards = await getCreditCardsServer();

    // Filter by slug
    return allCards.filter((p) => slugs.includes(p.slug));
  } catch (error) {
    logger.error(
      "Failed to fetch comparison products",
      error instanceof Error ? error : undefined,
    );
    return [];
  }
}
