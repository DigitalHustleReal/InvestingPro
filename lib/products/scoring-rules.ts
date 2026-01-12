
import { CreditCard, Loan, MutualFund, FinancialProduct } from '@/types';

// Scoring Result Interface
export interface ProductScore {
    overall: number; // 0-10
    breakdown: {
        label: string;
        score: number; // 0-10
        weight: number; // 0-1 (percentage)
    }[];
    tags: string[]; // e.g., 'Best for Travel', 'Premium Choice'
}

type ScoringRule = (product: any) => number;

// ------------------------------------------
// CREDIT CARD SCORING
// ------------------------------------------

// Helpers
const getRewardRateScore = (rate: string): number => {
    // Basic heuristic: Extract number from string like "5%" or "4 points"
    const match = rate.match(/(\d+(\.\d+)?)/);
    if (!match) return 5;
    const value = parseFloat(match[1]);
    
    // If percent
    if (rate.includes('%')) {
        return Math.min(value * 2, 10); // 5% = 10 points
    }
    // If points (usually per 100 or 150)
    return Math.min(value * 1.5, 10); // 4 points = 6 points (conservative)
};

const getLoungeScore = (access: string): number => {
    if (!access || access.toLowerCase().includes('nil') || access.toLowerCase().includes('no')) return 0;
    if (access.toLowerCase().includes('unlimited')) return 10;
    
    // Extract count
    const match = access.match(/(\d+)/);
    if (!match) return 5; // Present but unknown count
    const count = parseInt(match[1]);
    return Math.min(count * 1.5, 10); // 8 visits = 10+ points
};

export const scoreCreditCard = (card: CreditCard): ProductScore => {
    // 1. Travel Score (Weights: Rewards 40%, Lounge 40%, Fee 20%)
    const travelScore = 
        (getRewardRateScore(card.rewardRate) * 0.4) +
        (getLoungeScore(card.loungeAccess || '') * 0.4) +
        (card.type === 'travel' || card.type === 'premium' ? 2 : 0); // Bonus

    // 2. Shopping Score (Weights: Rewards 70%, Fee 30%)
    const shoppingScore = 
        (getRewardRateScore(card.rewardRate) * 0.7) +
        (card.type === 'shopping' ? 3 : 0);

    // 3. Low Cost Score (Weights: Low Fee 80%, Ease 20%)
    const feeScore = card.annualFee === 0 ? 10 : Math.max(0, 10 - (card.annualFee / 500)); // 0 fee = 10, 5000 fee = 0
    
    // Determine Best Fit
    let tags: string[] = [];
    if (travelScore > 7) tags.push('Best for Travel');
    if (shoppingScore > 7) tags.push('Top for Shopping');
    if (feeScore > 8) tags.push('Low Cost Gem');
    if (card.type === 'lifetime_free') tags.push('Lifetime Free');

    // Overall Score Calculation (Weighted average of features)
    const overall = (travelScore + shoppingScore + feeScore) / 3;

    return {
        overall: Number(overall.toFixed(1)),
        breakdown: [
            { label: 'Travel Benefits', score: Number(travelScore.toFixed(1)), weight: 0.35 },
            { label: 'Rewards Power', score: Number(shoppingScore.toFixed(1)), weight: 0.35 },
            { label: 'Cost Efficiency', score: Number(feeScore.toFixed(1)), weight: 0.30 }
        ],
        tags: tags.slice(0, 3) // Top 3 tags
    };
};

// ------------------------------------------
// GENERIC SCORER
// ------------------------------------------

export const scoreLoan = (loan: Loan): ProductScore => {
    // 1. Affordability Score (Low Interest is key)
    // Base 8%, every 1% higher reduces score. Cap at 0.
    const interestScore = Math.max(0, Math.min(10, 10 - (loan.interestRateMin - 8.5) * 1.5));
    
    // 2. Flexibility (Tenure & Amount)
    const tenureScore = Math.min(10, (loan.maxTenureMonths / 12) * 1.5); // 5 years = 7.5, 7 years = 10
    
    // 3. Cost (Processing Fee) - Parse string "Up to 2%" -> 2
    let feeVal = 2;
    try {
        const match = loan.processingFee.match(/(\d+(\.\d+)?)/);
        if (match) feeVal = parseFloat(match[0]);
    } catch (e) {}
    const costScore = Math.max(0, 10 - (feeVal * 3)); // 0% fee = 10, 1% = 7, 3% = 1

    // Best For Tags
    let tags: string[] = [];
    if (interestScore > 8) tags.push('Low Interest Rate');
    if (costScore > 8) tags.push('Minimal Fees');
    if (tenureScore > 8) tags.push('Flexible Tenure');
    if (loan.loanType === 'home') tags.push('Home Buyer Choice');

    const overall = (interestScore * 0.5) + (costScore * 0.3) + (tenureScore * 0.2);

    return {
        overall: Number(overall.toFixed(1)),
        breakdown: [
            { label: 'Affordability', score: Number(interestScore.toFixed(1)), weight: 0.5 },
            { label: 'Low Cost', score: Number(costScore.toFixed(1)), weight: 0.3 },
            { label: 'Flexibility', score: Number(tenureScore.toFixed(1)), weight: 0.2 }
        ],
        tags: tags.slice(0, 3)
    };
};

export const scoreMutualFund = (mf: MutualFund): ProductScore => {
    // 1. Returns Score (3Y Returns)
    // 20%+ = 10, 10% = 5
    const returnScore = Math.min(10, mf.returns3Y / 2.5);

    // 2. Cost Efficiency (Expense Ratio)
    // 0% = 10, 2% = 0
    const expenseScore = Math.max(0, 10 - (mf.expenseRatio * 5));

    // 3. Consistency/Rating
    const ratingScore = (mf.rating || 3) * 2; // 5 star = 10

    // Best For Tags
    let tags: string[] = [];
    if (returnScore > 8) tags.push('High Returns');
    if (expenseScore > 8) tags.push('Low Expense');
    if (ratingScore === 10) tags.push('Top Rated');
    if (mf.riskLevel === 'low') tags.push('Safe Bet');

    const overall = (returnScore * 0.5) + (expenseScore * 0.3) + (ratingScore * 0.2);

    return {
        overall: Number(overall.toFixed(1)),
        breakdown: [
            { label: 'Returns', score: Number(returnScore.toFixed(1)), weight: 0.5 },
            { label: 'Cost Efficiency', score: Number(expenseScore.toFixed(1)), weight: 0.3 },
            { label: 'Rating', score: Number(ratingScore.toFixed(1)), weight: 0.2 }
        ],
        tags: tags.slice(0, 3)
    };
};

export const calculateProductScore = (product: FinancialProduct): ProductScore => {
    switch (product.category) {
        case 'credit_card':
            return scoreCreditCard(product as CreditCard);
        case 'loan':
            return scoreLoan(product as Loan);
        case 'mutual_fund':
            return scoreMutualFund(product as MutualFund);
        case 'insurance':
             return { overall: 0, breakdown: [], tags: [] };
        default:
            return { overall: 0, breakdown: [], tags: [] };
    }
};
