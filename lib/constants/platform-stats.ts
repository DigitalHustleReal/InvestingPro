/**
 * Platform Statistics - Single Source of Truth
 *
 * ALL social proof stats should reference this file.
 * Update here to change across entire platform.
 *
 * IMPORTANT: Only use verified, real numbers here.
 * Do NOT fabricate user counts, ratings, or engagement metrics.
 *
 * Last Updated: April 5, 2026
 */

export const PLATFORM_STATS = {
  // Product Coverage (verifiable from DB)
  productCategories: "7",
  productsTracked: "100+",
  productsTrackedNumeric: 100,
  banksPartnered: "50+",
  banksPartneredNumeric: 50,

  // Platform Attributes
  independence: "100%",
  adFree: true,
  updateFrequency: "Daily",

  // Credibility
  established: "2024",
} as const;

/**
 * Pre-formatted stat strings for common use cases
 */
export const STAT_STRINGS = {
  heroTagline: `India's Independent Finance Platform`,
  trustBadge: `100% Independent Research`,
  coverage: `${PLATFORM_STATS.productsTracked} products from ${PLATFORM_STATS.banksPartnered} banks`,
  fullDescription: `Compare. Decide. Apply. India's Independent Financial Comparison Platform. Compare ${PLATFORM_STATS.productsTracked} products across ${PLATFORM_STATS.banksPartnered} banks. Make smart, data-driven decisions.`,
  testimonial: `Compare financial products with transparent, data-driven insights. No marketing fluff — just real numbers.`,
} as const;
