import { CreditCard, Loan, MutualFund, FinancialProduct } from "@/types";

/**
 * Product Ranking & Scoring System
 * Inspired by NerdWallet's methodology
 */

export interface ProductScore {
    productId: string;
    totalScore: number; // 0-100
    breakdown: {
        valueScore: number; // Cost vs Benefits
        popularityScore: number; // User ratings + review count
        featureScore: number; // Feature richness
        trustScore: number; // Provider reputation
    };
    rank: number;
    badge?: 'best_overall' | 'best_value' | 'most_popular' | 'editors_choice';
}

// ============================================
// CREDIT CARD SCORING
// ============================================
export function scoreCreditCard(card: CreditCard, allCards: CreditCard[]): ProductScore {
    // 1. Value Score (40 points) - Fee vs Rewards
    const valueScore = calculateCreditCardValue(card, allCards);

    // 2. Popularity Score (30 points) - Ratings + Reviews
    const popularityScore = calculatePopularityScore(card.rating, card.reviewsCount);

    // 3. Feature Score (20 points) - Features richness
    const featureScore = calculateFeatureScore(card.features, card.pros);

    // 4. Trust Score (10 points) - Provider reputation
    const trustScore = calculateProviderTrust(card.provider);

    const totalScore = valueScore + popularityScore + featureScore + trustScore;

    return {
        productId: card.id,
        totalScore: Math.round(totalScore),
        breakdown: {
            valueScore: Math.round(valueScore),
            popularityScore: Math.round(popularityScore),
            featureScore: Math.round(featureScore),
            trustScore: Math.round(trustScore)
        },
        rank: 0, // Will be set after sorting
    };
}

function calculateCreditCardValue(card: CreditCard, allCards: CreditCard[]): number {
    // Lower fees = better score
    const avgAnnualFee = allCards.reduce((sum, c) => sum + c.annualFee, 0) / allCards.length;
    const feeScore = card.annualFee === 0 ? 20 : Math.max(0, 20 - (card.annualFee / avgAnnualFee) * 10);

    // More features = better score
    const featureCount = card.features.length + (card.pros?.length || 0);
    const featureScore = Math.min(20, featureCount * 2);

    return feeScore + featureScore;
}

// ============================================
// LOAN SCORING
// ============================================
export function scoreLoan(loan: Loan, allLoans: Loan[]): ProductScore {
    // 1. Interest Rate Score (50 points) - Lower is better
    const interestScore = calculateInterestRateScore(loan, allLoans);

    // 2. Popularity Score (25 points)
    const popularityScore = calculatePopularityScore(loan.rating, loan.reviewsCount) * 0.833; // Scale to 25

    // 3. Fee Score (15 points) - Lower processing fee
    const feeScore = calculateLoanFeeScore(loan.processingFee);

    // 4. Trust Score (10 points)
    const trustScore = calculateProviderTrust(loan.provider);

    const totalScore = interestScore + popularityScore + feeScore + trustScore;

    return {
        productId: loan.id,
        totalScore: Math.round(totalScore),
        breakdown: {
            valueScore: Math.round(interestScore + feeScore),
            popularityScore: Math.round(popularityScore),
            featureScore: 0,
            trustScore: Math.round(trustScore)
        },
        rank: 0,
    };
}

function calculateInterestRateScore(loan: Loan, allLoans: Loan[]): number {
    const avgRate = allLoans.reduce((sum, l) => sum + (l.interestRateMin + l.interestRateMax) / 2, 0) / allLoans.length;
    const loanAvgRate = (loan.interestRateMin + loan.interestRateMax) / 2;

    // Lower rate = higher score
    const deviation = (avgRate - loanAvgRate) / avgRate;
    return Math.max(0, Math.min(50, 25 + deviation * 50));
}

function calculateLoanFeeScore(processingFee: string): number {
    // Parse processing fee (e.g., "Up to 2%" or "Rs. 4999")
    const feeMatch = processingFee.match(/(\d+\.?\d*)/);
    if (!feeMatch) return 7.5; // Default mid-score

    const feeValue = parseFloat(feeMatch[1]);
    // Assuming percentage fees, lower is better
    return Math.max(0, 15 - feeValue * 3);
}

// ============================================
// MUTUAL FUND SCORING
// ============================================
export function scoreMutualFund(fund: MutualFund, allFunds: MutualFund[]): ProductScore {
    // 1. Returns Score (50 points) - Higher returns = better
    const returnsScore = calculateReturnsScore(fund, allFunds);

    // 2. Expense Ratio Score (20 points) - Lower is better
    const expenseScore = calculateExpenseScore(fund, allFunds);

    // 3. Popularity Score (20 points)
    const popularityScore = calculatePopularityScore(fund.rating, fund.reviewsCount) * 0.667; // Scale to 20

    // 4. Trust Score (10 points)
    const trustScore = calculateProviderTrust(fund.provider);

    const totalScore = returnsScore + expenseScore + popularityScore + trustScore;

    return {
        productId: fund.id,
        totalScore: Math.round(totalScore),
        breakdown: {
            valueScore: Math.round(returnsScore + expenseScore),
            popularityScore: Math.round(popularityScore),
            featureScore: 0,
            trustScore: Math.round(trustScore)
        },
        rank: 0,
    };
}

function calculateReturnsScore(fund: MutualFund, allFunds: MutualFund[]): number {
    // Weight: 3Y (50%), 5Y (30%), 1Y (20%)
    const weighted3Y = fund.returns3Y * 0.5;
    const weighted5Y = fund.returns5Y * 0.3;
    const weighted1Y = fund.returns1Y * 0.2;
    const fundScore = weighted3Y + weighted5Y + weighted1Y;

    const avgScore = allFunds.reduce((sum, f) =>
        sum + (f.returns3Y * 0.5 + f.returns5Y * 0.3 + f.returns1Y * 0.2), 0
    ) / allFunds.length;

    // Normalize to 50 points
    const deviation = (fundScore - avgScore) / avgScore;
    return Math.max(0, Math.min(50, 25 + deviation * 50));
}

function calculateExpenseScore(fund: MutualFund, allFunds: MutualFund[]): number {
    const avgExpense = allFunds.reduce((sum, f) => sum + f.expenseRatio, 0) / allFunds.length;
    const deviation = (avgExpense - fund.expenseRatio) / avgExpense;
    return Math.max(0, Math.min(20, 10 + deviation * 20));
}

// ============================================
// SHARED SCORING FUNCTIONS
// ============================================
function calculatePopularityScore(rating: number, reviewCount: number): number {
    // Rating component (0-5 stars -> 0-20 points)
    const ratingScore = (rating / 5) * 20;

    // Review count component (logarithmic scale, 0-10 points)
    const reviewScore = Math.min(10, Math.log10(reviewCount + 1) * 2);

    return ratingScore + reviewScore;
}

function calculateFeatureScore(features: string[], pros?: string[]): number {
    const totalFeatures = features.length + (pros?.length || 0);
    return Math.min(20, totalFeatures * 1.5);
}

function calculateProviderTrust(provider: string): number {
    // Reputation scores for major providers
    const trustMap: Record<string, number> = {
        'HDFC Bank': 10,
        'SBI Card': 9,
        'SBI': 9,
        'ICICI Bank': 9,
        'Axis Bank': 8,
        'PPFAS Mutual Fund': 10,
        'Quant Mutual Fund': 8,
    };

    return trustMap[provider] || 7; // Default score
}

// ============================================
// RANKING & BADGE ASSIGNMENT
// ============================================
export function rankProducts<T extends FinancialProduct>(
    products: T[],
    scoreFunction: (product: T, allProducts: T[]) => ProductScore
): ProductScore[] {
    // Calculate scores
    const scores = products.map(p => scoreFunction(p, products));

    // Sort by total score (descending)
    scores.sort((a, b) => b.totalScore - a.totalScore);

    // Assign ranks
    scores.forEach((score, index) => {
        score.rank = index + 1;
    });

    // Assign badges
    if (scores.length > 0) {
        scores[0].badge = 'best_overall';

        // Best Value: Highest value score
        const bestValue = [...scores].sort((a, b) => b.breakdown.valueScore - a.breakdown.valueScore)[0];
        if (bestValue && bestValue.productId !== scores[0].productId) {
            bestValue.badge = 'best_value';
        }

        // Most Popular: Highest popularity score
        const mostPopular = [...scores].sort((a, b) => b.breakdown.popularityScore - a.breakdown.popularityScore)[0];
        if (mostPopular && mostPopular.productId !== scores[0].productId && mostPopular.productId !== bestValue?.productId) {
            mostPopular.badge = 'most_popular';
        }
    }

    return scores;
}

// ============================================
// SMART RECOMMENDATIONS
// ============================================
export interface UserProfile {
    spendingPattern?: 'travel' | 'shopping' | 'dining' | 'mixed';
    annualIncome?: number;
    creditScore?: number;
    preferredBanks?: string[];
}

export function getSmartRecommendations(
    cards: CreditCard[],
    userProfile: UserProfile
): CreditCard[] {
    let filtered = [...cards];

    // Filter by eligibility
    if (userProfile.creditScore) {
        filtered = filtered.filter(c => !c.minCreditScore || c.minCreditScore <= userProfile.creditScore!);
    }

    // Filter by spending pattern
    if (userProfile.spendingPattern) {
        const patternMap: Record<string, string> = {
            'travel': 'travel',
            'shopping': 'cashback',
            'dining': 'cashback',
        };
        const preferredType = patternMap[userProfile.spendingPattern];
        if (preferredType) {
            filtered = filtered.filter(c => c.type === preferredType);
        }
    }

    // Rank and return top 5
    const scores = rankProducts(filtered, scoreCreditCard);
    return scores.slice(0, 5).map(s => cards.find(c => c.id === s.productId)!);
}
