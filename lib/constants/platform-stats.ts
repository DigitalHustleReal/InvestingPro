/**
 * Platform Statistics - Single Source of Truth
 * 
 * ALL social proof stats should reference this file.
 * Update here to change across entire platform.
 * 
 * Last Updated: January 5, 2026
 */

export const PLATFORM_STATS = {
  // User Metrics
  usersHelped: '2.1M+',
  usersHelpedFull: '2.1 Million+',
  usersHelpedNumeric: 2100000,
  
  // Trust Signals
  rating: '4.9',
  ratingNumeric: 4.9,
  ratingOutOf: 5,
  
  // Product Coverage
  productsTracked: '500+',
  productsTrackedNumeric: 500,
  banksPartnered: '50+',
  banksPartneredNumeric: 50,
  
  // Platform Attributes
  independence: '100%',
  adFree: true,
  updateFrequency: 'Daily',
  
  // Credibility
  established: '2024',
  trustScore: '95%',
} as const;

/**
 * Pre-formatted stat strings for common use cases
 */
export const STAT_STRINGS = {
  heroTagline: `${PLATFORM_STATS.usersHelped} Indians Helped`,
  trustBadge: `${PLATFORM_STATS.rating}/5 Rating`,
  coverage: `${PLATFORM_STATS.productsTracked} products from ${PLATFORM_STATS.banksPartnered} banks`,
  fullDescription: `Compare. Decide. Apply. India's Smartest Financial Choices. Compare 1000+ products, make smart decisions, and apply instantly. ${PLATFORM_STATS.usersHelped} Indians helped.`,
  testimonial: `We've already helped ${PLATFORM_STATS.usersHelped} Indians save money. You're next.`,
} as const;

/**
 * Structured data for SEO
 */
export const STRUCTURED_DATA_STATS = {
  aggregateRating: {
    '@type': 'AggregateRating',
    // Must be NUMBER not string — Google Rich Results Test fails on strings
    'ratingValue': PLATFORM_STATS.ratingNumeric,
    'bestRating': PLATFORM_STATS.ratingOutOf,
    'worstRating': 1,
    'ratingCount': 21000,
  }
} as const;
