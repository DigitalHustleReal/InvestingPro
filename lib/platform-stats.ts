/**
 * Platform Statistics Configuration
 * Single source of truth for ALL platform stats
 *
 * IMPORTANT: Only use verified, real numbers here.
 * Do NOT fabricate user counts, ratings, or engagement metrics.
 *
 * Last Updated: April 2026
 */

/**
 * Calculate current realistic stats based on platform data
 */
export function getPlatformStats() {
  return {
    productsTracked: 100, // Verified from DB — ~100 products seeded
    productCategories: 7, // Credit cards, loans, MFs, demat, FDs, insurance, stocks
    banksTracked: 50, // Banks & NBFCs covered
    calculators: 25, // Free financial calculators
    updateFrequency: "Daily", // Data refresh cadence
  };
}

/**
 * Format numbers for display
 */
export function formatStat(num: number, compact = true): string {
  if (compact) {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString("en-IN");
}

/**
 * Get display-ready stats (only verified numbers)
 */
export function getDisplayStats() {
  const stats = getPlatformStats();

  return {
    productsTracked: {
      value: stats.productsTracked,
      display: `${formatStat(stats.productsTracked)}+`,
      label: "Products Tracked",
      description: "Credit cards, loans, MFs, and more",
    },
    productCategories: {
      value: stats.productCategories,
      display: String(stats.productCategories),
      label: "Product Categories",
      description: "Credit cards, loans, MFs, demat, FDs, insurance, stocks",
    },
    banksTracked: {
      value: stats.banksTracked,
      display: `${stats.banksTracked}+`,
      label: "Banks & NBFCs",
      description: "Indian banks and financial institutions tracked",
    },
    calculators: {
      value: stats.calculators,
      display: String(stats.calculators),
      label: "Free Calculators",
      description: "SIP, EMI, tax, FD, and more",
    },
    unbiased: {
      value: 100,
      display: "100%",
      label: "Independent",
      description: "Independent research, zero paid bias",
    },
    marketScans: {
      value: 1,
      display: "Daily",
      label: "Data Updates",
      description: "Latest rates & product changes",
    },
  };
}
