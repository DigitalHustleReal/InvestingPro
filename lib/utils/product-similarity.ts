// Product similarity algorithm for recommendations

import { RichProduct } from '@/types/rich-product';

export interface SimilarityScore {
  product: RichProduct;
  score: number;
  reasons: string[];
}

export const calculateProductSimilarity = (
  product: RichProduct,
  allProducts: RichProduct[]
): SimilarityScore[] => {
  const scores: SimilarityScore[] = [];

  for (const candidate of allProducts) {
    if (candidate.slug === product.slug) continue; // Skip same product

    let score = 0;
    const reasons: string[] = [];

    // Category match (highest weight)
    if (candidate.category === product.category) {
      score += 40;
    }

    // Provider match
    if (candidate.provider_name === product.provider_name) {
      score += 15;
      reasons.push('Same provider');
    }

    // Rating similarity
    if (product.rating?.overall !== undefined && candidate.rating?.overall !== undefined) {
      const ratingDiff = Math.abs(product.rating.overall - candidate.rating.overall);
      if (ratingDiff < 0.5) {
        score += 15;
        reasons.push('Similar rating');
      }
    }

    // Price/Fee similarity (for credit cards)
    const productFee = extractFee(product);
    const candidateFee = extractFee(candidate);
    
    if (typeof productFee === 'number' && typeof candidateFee === 'number') {
      const feeDiff = Math.abs(productFee - candidateFee);
      if (feeDiff < 1000) {
        score += 20;
        reasons.push('Similar fees');
      } else if (feeDiff < 5000) {
        score += 10;
      }
    }

    // Best for / Type similarity
    if (product.bestFor && candidate.bestFor) {
      if (product.bestFor.toLowerCase() === candidate.bestFor.toLowerCase()) {
        score += 10;
        reasons.push(`Both for ${product.bestFor}`);
      }
    }

    if (score > 30) { // Only include if reasonably similar
      scores.push({ product: candidate, score, reasons });
    }
  }

  // Sort by score descending
  return scores.sort((a, b) => b.score - a.score);
};

// Helper to extract fee from product
const extractFee = (product: RichProduct): number | null => {
  const feeStr = product.specs?.annualFee || product.features?.annual_fee;
  if (!feeStr) return null;

  if (typeof feeStr === 'string') {
    if (feeStr.toLowerCase().includes('free') || feeStr.toLowerCase().includes('nil')) {
      return 0;
    }
    const match = feeStr.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  }

  return null;
};

// Get top N similar products
export const getSimilarProducts = (
  product: RichProduct,
  allProducts: RichProduct[],
  limit: number = 4
): RichProduct[] => {
  const similarities = calculateProductSimilarity(product, allProducts);
  return similarities.slice(0, limit).map(s => s.product);
};
