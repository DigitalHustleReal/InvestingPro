/**
 * Centralized logic for resolving featured images and category icons.
 * Provides fallback mapping for known missing assets to high-quality Unsplash images or local SVGs.
 */

// Mapping of internal missing filenames to high-quality remote fallbacks
const STOCK_FALLBACK_MAP: Record<string, string> = {
  "fixed_deposits.jpg":
    "https://images.unsplash.com/photo-1618044733300-9472054094ee?w=800&h=450&fit=crop&auto=format&q=80",
  "insurance.jpg":
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=450&fit=crop&auto=format&q=80",
  "credit_cards.jpg":
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop&auto=format&q=80",
  "saving_schemes.jpg":
    "https://images.unsplash.com/photo-1579621970795-87f9ac756a70?w=800&h=450&fit=crop&auto=format&q=80",
  "loans.jpg":
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop&auto=format&q=80",
  "mutual_funds.jpg":
    "https://images.unsplash.com/photo-1611974714024-462740941821?w=800&h=450&fit=crop&auto=format&q=80",
  "stocks.jpg":
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop&auto=format&q=80",
};

// Category-based defaults when no image filename exists — high-res finance photos
const CATEGORY_DEFAULT_MAP: Record<string, string> = {
  "credit-card":
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop&auto=format&q=80",
  credit_card:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop&auto=format&q=80",
  "credit-cards":
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop&auto=format&q=80",
  credit_cards:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop&auto=format&q=80",
  loan: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop&auto=format&q=80",
  loans:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop&auto=format&q=80",
  "personal-loans":
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop&auto=format&q=80",
  "home-loans":
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=450&fit=crop&auto=format&q=80",
  insurance:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=450&fit=crop&auto=format&q=80",
  "fixed-deposits":
    "https://images.unsplash.com/photo-1618044733300-9472054094ee?w=800&h=450&fit=crop&auto=format&q=80",
  fixed_deposits:
    "https://images.unsplash.com/photo-1618044733300-9472054094ee?w=800&h=450&fit=crop&auto=format&q=80",
  "mutual-funds":
    "https://images.unsplash.com/photo-1611974714024-462740941821?w=800&h=450&fit=crop&auto=format&q=80",
  mutual_funds:
    "https://images.unsplash.com/photo-1611974714024-462740941821?w=800&h=450&fit=crop&auto=format&q=80",
  mutual_fund:
    "https://images.unsplash.com/photo-1611974714024-462740941821?w=800&h=450&fit=crop&auto=format&q=80",
  stocks:
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop&auto=format&q=80",
  investing:
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop&auto=format&q=80",
  tax: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop&auto=format&q=80",
  "tax-planning":
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop&auto=format&q=80",
  banking:
    "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&h=450&fit=crop&auto=format&q=80",
  savings:
    "https://images.unsplash.com/photo-1579621970795-87f9ac756a70?w=800&h=450&fit=crop&auto=format&q=80",
  budgeting:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop&auto=format&q=80",
  retirement:
    "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?w=800&h=450&fit=crop&auto=format&q=80",
  demat:
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop&auto=format&q=80",
  "demat-accounts":
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop&auto=format&q=80",
};

/**
 * Resolves a featured image URL based on raw input and category.
 * Prevents 404 errors by mapping known missing local files to remote fallbacks.
 */
export function resolveFeaturedImage(
  img: string | null | undefined,
  category?: string,
): string {
  // 1. Handle empty input
  if (!img) {
    if (category) {
      const normalizedCategory = category.toLowerCase().replace(/-/g, "_");
      if (CATEGORY_DEFAULT_MAP[normalizedCategory])
        return CATEGORY_DEFAULT_MAP[normalizedCategory];

      // Fuzzy match for categories containing keywords
      for (const key in CATEGORY_DEFAULT_MAP) {
        if (normalizedCategory.includes(key)) return CATEGORY_DEFAULT_MAP[key];
      }
    }
    return "https://images.unsplash.com/photo-1611974714024-462740941821?w=800&h=450&fit=crop&auto=format&q=80"; // Final generic fallback
  }

  // 2. Handle absolute URLs (both remote and local)
  if (img.startsWith("http") || img.startsWith("/")) {
    // Fix potential common URL issues (e.g. broken Unsplash dimensions from automation)
    if (img.includes("images.unsplash.com") && img.includes("w=80080")) {
      return img.replace("w=80080", "w=800");
    }
    return img;
  }

  // 3. Handle specific known filename mappings
  if (STOCK_FALLBACK_MAP[img]) {
    return STOCK_FALLBACK_MAP[img];
  }

  // 4. Fallback to default stock directory for simple filenames
  return `/images/stock/${img}`;
}
