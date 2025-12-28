/**
 * Ranking Protection System
 * 
 * Ensures monetization NEVER affects product rankings
 * This is critical for trust and editorial independence
 */

import { logger } from '@/lib/logger';

/**
 * Ranking factors that are NEVER affected by monetization
 */
export const RANKING_FACTORS = {
    // Core ranking factors (never monetized)
    score: 'score', // Product score/rating
    reviews: 'reviews', // User reviews
    features: 'features', // Product features
    fees: 'fees', // Fees and charges
    eligibility: 'eligibility', // Eligibility criteria
    performance: 'performance', // Historical performance
    trust_score: 'trust_score', // Trust indicators

    // Monetization factors (separate, never affects ranking)
    affiliate_available: 'affiliate_available', // Has affiliate link
    commission_rate: 'commission_rate', // Commission percentage
    ad_priority: 'ad_priority', // Ad placement priority
};

/**
 * Validate that ranking is not affected by monetization
 */
export function validateRankingIntegrity(
    product: any,
    rankingFactors: string[]
): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check that ranking factors don't include monetization
    const monetizationFactors = [
        'affiliate_available',
        'commission_rate',
        'ad_priority',
        'sponsored',
        'paid_placement',
    ];

    for (const factor of rankingFactors) {
        if (monetizationFactors.includes(factor)) {
            errors.push(`Ranking factor "${factor}" is monetization-related and cannot affect rankings`);
        }
    }

    // Check that product score doesn't include monetization
    if (product.score && (product.affiliate_available || product.commission_rate)) {
        // Score should be calculated independently
        // This is just a warning, not an error
        logger.warn('Product has both score and monetization factors - ensure score is independent', {
            productId: product.id,
        });
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Calculate product ranking (monetization-free)
 */
export function calculateRanking(product: any): number {
    // Ranking calculation that EXCLUDES monetization
    let score = 0;

    // User reviews (weighted)
    if (product.reviews && product.reviews.length > 0) {
        const avgRating = product.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / product.reviews.length;
        score += avgRating * 20; // 20% weight
    }

    // Features score
    if (product.features) {
        const featureScore = Object.values(product.features).filter((v: any) => v === true).length;
        score += featureScore * 2; // 2 points per feature
    }

    // Fees (lower is better)
    if (product.fees) {
        const feeScore = Math.max(0, 100 - (product.fees.annual_fee || 0));
        score += feeScore * 0.1; // 10% weight
    }

    // Performance (if applicable)
    if (product.performance) {
        score += (product.performance.return_rate || 0) * 0.5; // 50% weight
    }

    // Trust indicators
    if (product.trust_score) {
        score += product.trust_score * 10; // 10% weight
    }

    // Normalize to 0-100
    return Math.min(100, Math.max(0, score));
}

/**
 * Get ranking explanation (for transparency)
 */
export function getRankingExplanation(product: any): string {
    const factors: string[] = [];

    if (product.reviews && product.reviews.length > 0) {
        factors.push('user reviews');
    }
    if (product.features) {
        factors.push('product features');
    }
    if (product.fees) {
        factors.push('fees and charges');
    }
    if (product.performance) {
        factors.push('historical performance');
    }
    if (product.trust_score) {
        factors.push('trust indicators');
    }

    return `Ranking based on: ${factors.join(', ')}. Not affected by affiliate commissions or advertising.`;
}

