import { RichProduct } from '@/types/rich-product';
import { OnboardingData } from '@/components/profile/ProfileOnboarding';

export interface RecommendationResult {
  product: RichProduct;
  matchScore: number;
  matchReasons: string[];
}

export const getPersonalizedRecommendations = (
  userProfile: OnboardingData,
  allProducts: RichProduct[],
  limit: number = 3
): RecommendationResult[] => {
  const results: RecommendationResult[] = [];

  for (const product of allProducts) {
    let score = 0;
    const reasons: string[] = [];
    const specs = product.specs || {};
    
    // 1. Hard Eligibility Filters (Income)
    const minIncome = specs.minIncome || specs.min_income || 0;
    if (userProfile.income < minIncome) {
      // Significantly penalize or skip if income is too low
      // For now, we'll keep it but penalize heavily to show "Rebuild" products
      score -= 100;
    } else if (userProfile.income > minIncome * 2) {
      score += 30;
      reasons.push('Matches your premium income level');
    }

    // 2. Credit Score Match
    const minScore = specs.minCreditScore || 700;
    if (userProfile.creditScore < minScore) {
      score -= 50;
    } else {
      score += 20;
      reasons.push('Matches your credit profile');
    }

    // 3. Goal Matching
    if (userProfile.goals.includes('better-rewards') && product.category === 'credit_card') {
      const rewardRate = specs.rewardRate || specs.rewards?.[0];
      if (rewardRate && (rewardRate.includes('%') || parseFloat(rewardRate) > 2)) {
        score += 40;
        reasons.push('High reward rate for your goal');
      }
    }

    if (userProfile.goals.includes('save-on-interest') && product.category === 'loan') {
      const rate = specs.interestRateMin || specs.interest_rate_min;
      if (rate && parseFloat(rate) < 10) {
        score += 40;
        reasons.push('Low interest rate matches your goal');
      }
    }

    if (userProfile.goals.includes('build-credit')) {
      if (specs.is_credit_builder || (product.name.toLowerCase().includes('secure') || product.name.toLowerCase().includes('fixed deposit'))) {
        score += 50;
        reasons.push('Perfect for building credit');
      }
    }

    // 4. Employment Type
    if (userProfile.employmentType === 'self-employed' && specs.self_employed_friendly) {
      score += 20;
      reasons.push('Self-employed friendly');
    }

    if (score > 40) {
      results.push({ 
        product, 
        matchScore: score, 
        matchReasons: reasons.slice(0, 2) // Top 2 reasons
      });
    }
  }

  // Sort by score descending and return top N
  return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
};
