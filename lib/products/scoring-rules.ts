
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

// Scoring Weights Interface
export interface ScoringWeights {
    rewards?: number; // 0-1
    fees?: number;    // 0-1
    travel?: number;  // 0-1
    shopping?: number;// 0-1
}

export const scoreCreditCard = (card: CreditCard, weights: ScoringWeights = { rewards: 0.35, fees: 0.30, travel: 0.35 }): ProductScore => {
    // defaults
    const wRewards = weights.rewards ?? 0.35;
    const wFees = weights.fees ?? 0.30;
    const wTravel = weights.travel ?? 0.35;
    // Normalize if needed, but for now assuming caller provides reasonable weights or we use direct multipliers

    // 1. Travel Score 
    const travelScore = 
        (getRewardRateScore(card.rewardRate) * 0.4) +
        (getLoungeScore(card.loungeAccess || '') * 0.4) +
        (card.type === 'travel' || card.type === 'premium' ? 2 : 0);

    // 2. Shopping Score 
    const shoppingScore = 
        (getRewardRateScore(card.rewardRate) * 0.7) +
        (card.type === 'shopping' ? 3 : 0);

    // 3. Low Cost Score 
    const feeScore = card.annualFee === 0 ? 10 : Math.max(0, 10 - (card.annualFee / 500));
    
    // Determine Best Fit Tags (Static based on inherent strength)
    const tags: string[] = [];
    if (travelScore > 7) tags.push('Best for Travel');
    if (shoppingScore > 7) tags.push('Top for Shopping');
    if (feeScore > 8) tags.push('Low Cost Gem');
    if (card.type === 'lifetime_free') tags.push('Lifetime Free');

    // Overall Score Calculation (Dynamic based on user weights)
    // We mix the calculated feature scores with the user weights
    // If user cares about Travel, we weight travelScore higher.
    
    // Feature mapping to weights:
    // Travel -> travelScore
    // Rewards -> shoppingScore (proxy for general rewards)
    // Fees -> feeScore
    
    // Normalizing weights to sum to 1 roughly
    const totalWeight = wRewards + wFees + wTravel;
    const nRewards = wRewards / totalWeight;
    const nFees = wFees / totalWeight;
    const nTravel = wTravel / totalWeight;

    const overall = (travelScore * nTravel) + (shoppingScore * nRewards) + (feeScore * nFees);

    return {
        overall: Number(overall.toFixed(1)), // 0-10
        breakdown: [
            { label: 'Travel Benefits', score: Number(travelScore.toFixed(1)), weight: nTravel },
            { label: 'Rewards Power', score: Number(shoppingScore.toFixed(1)), weight: nRewards },
            { label: 'Cost Efficiency', score: Number(feeScore.toFixed(1)), weight: nFees }
        ],
        tags: tags.slice(0, 3)
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
    const tags: string[] = [];
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
    const tags: string[] = [];
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

// ------------------------------------------
// FIXED DEPOSIT SCORING
// ------------------------------------------

export interface FixedDeposit {
    interestRate: number;       // % p.a. (e.g. 7.5)
    maxTenureMonths: number;    // max FD tenure
    minTenureMonths?: number;   // min FD tenure
    bankCategory: 'sbi' | 'nationalised' | 'private' | 'small-finance' | 'nbfc';
    prematurePenaltyPct?: number; // % penalty on early withdrawal (default 1%)
    compoundingFrequency?: 'monthly' | 'quarterly' | 'annual';
}

export const scoreFixedDeposit = (fd: FixedDeposit): ProductScore => {
    // 1. Interest Rate Score (50%) — 7.5% baseline for senior citizens-friendly rate
    // Every 0.25% above 6.5% = +1 point. Cap at 10.
    const rateScore = Math.max(0, Math.min(10, (fd.interestRate - 5.5) * 2.5));

    // 2. Tenure Flexibility Score (20%) — Range of tenure options
    const tenureRange = fd.maxTenureMonths - (fd.minTenureMonths ?? 3);
    const tenureScore = Math.min(10, tenureRange / 6); // 5yr range = 10/10

    // 3. Safety Score (20%) — Based on bank category + RBI DICGC insurance
    const safetyMap: Record<string, number> = {
        'sbi': 10, 'nationalised': 9, 'private': 7.5, 'small-finance': 6, 'nbfc': 4
    };
    const safetyScore = safetyMap[fd.bankCategory] ?? 7;

    // 4. Penalty Score (10%) — Lower penalty = higher score
    const penalty = fd.prematurePenaltyPct ?? 1;
    const penaltyScore = Math.max(0, 10 - (penalty * 4)); // 0% = 10, 2.5% = 0

    const tags: string[] = [];
    if (rateScore > 8) tags.push('High Interest');
    if (safetyScore >= 9) tags.push('Govt-Backed Safety');
    if (safetyScore === 6) tags.push('High Yield SF Bank');
    if (penaltyScore > 8) tags.push('No-Penalty Exit');

    const overall = (rateScore * 0.5) + (tenureScore * 0.2) + (safetyScore * 0.2) + (penaltyScore * 0.1);

    return {
        overall: Number(overall.toFixed(1)),
        breakdown: [
            { label: 'Interest Rate', score: Number(rateScore.toFixed(1)), weight: 0.5 },
            { label: 'Tenure Flexibility', score: Number(tenureScore.toFixed(1)), weight: 0.2 },
            { label: 'Bank Safety', score: Number(safetyScore.toFixed(1)), weight: 0.2 },
            { label: 'Early Exit Penalty', score: Number(penaltyScore.toFixed(1)), weight: 0.1 },
        ],
        tags: tags.slice(0, 3)
    };
};

// ------------------------------------------
// DEMAT ACCOUNT SCORING
// ------------------------------------------

export interface DematAccount {
    brokerageEquityPct?: number;    // % per trade (0 for flat-fee/free)
    flatBrokerageRs?: number;       // Flat Rs per order (e.g. 20)
    annualMaintenanceRs: number;    // AMC per year
    freeResearch: boolean;
    mobileAppRating: number;        // 1-5 App Store rating
    dpChargesPerScript?: number;    // DP charges per scrip debit (default 15.93)
    freeMutualFunds?: boolean;
    ipoApplication?: boolean;
}

export const scoreDematAccount = (acc: DematAccount): ProductScore => {
    // 1. Brokerage Cost Score (40%) — Lower is better
    let brokerScore: number;
    if (acc.flatBrokerageRs !== undefined) {
        // Flat fee model: Rs 0 = 10, Rs 20 = 8, Rs 40 = 6
        brokerScore = Math.max(0, 10 - (acc.flatBrokerageRs / 10));
    } else {
        // Percentage: 0.1% = 8, 0.3% = 4, 0.5% = 0
        brokerScore = Math.max(0, 10 - ((acc.brokerageEquityPct ?? 0.3) * 20));
    }

    // 2. AMC Score (25%) — Rs 0 = 10, Rs 300 = 5, Rs 700+ = 0
    const amcScore = Math.max(0, 10 - (acc.annualMaintenanceRs / 70));

    // 3. Platform / Research Score (20%) — App rating + free research
    const platformScore = Math.min(10, ((acc.mobileAppRating / 5) * 6) + (acc.freeResearch ? 3 : 0) + (acc.freeMutualFunds ? 1 : 0));

    // 4. Feature Score (15%) — Extra features
    const featureScore = Math.min(10,
        (acc.ipoApplication ? 3 : 0) +
        (acc.freeMutualFunds ? 3 : 0) +
        ((acc.dpChargesPerScript ?? 15.93) <= 13 ? 2 : 0) +
        2 // base
    );

    const tags: string[] = [];
    if (brokerScore > 8) tags.push('Zero Brokerage');
    if (amcScore > 8) tags.push('Free AMC');
    if (platformScore > 7.5) tags.push('Top-Rated App');
    if (acc.freeMutualFunds) tags.push('Free MF Investing');

    const overall = (brokerScore * 0.4) + (amcScore * 0.25) + (platformScore * 0.2) + (featureScore * 0.15);

    return {
        overall: Number(overall.toFixed(1)),
        breakdown: [
            { label: 'Brokerage Cost', score: Number(brokerScore.toFixed(1)), weight: 0.4 },
            { label: 'Annual Charges', score: Number(amcScore.toFixed(1)), weight: 0.25 },
            { label: 'Platform Quality', score: Number(platformScore.toFixed(1)), weight: 0.2 },
            { label: 'Feature Set', score: Number(featureScore.toFixed(1)), weight: 0.15 },
        ],
        tags: tags.slice(0, 3)
    };
};

// ------------------------------------------
// INSURANCE SCORING (Term Life)
// ------------------------------------------

export interface InsurancePlan {
    claimSettlementRatio: number;   // % (e.g. 99.2)
    sumAssuredMultiple: number;     // Sum assured / annual premium (e.g. 1000)
    solvencyRatio: number;          // IRDAI solvency ratio (>1.5 is good)
    coverageUpToAge: number;        // e.g. 85
    criticalIllnessRider?: boolean;
    waivPremiumRider?: boolean;
}

export const scoreInsurance = (plan: InsurancePlan): ProductScore => {
    // 1. Claim Settlement Score (35%) — 99.5%+ = 10, 95% = 5
    const claimScore = Math.min(10, Math.max(0, (plan.claimSettlementRatio - 90) * 2));

    // 2. Value Score (30%) — Sum assured multiple (how much cover per Rs of premium)
    // 1000x = 10, 500x = 5
    const valueScore = Math.min(10, plan.sumAssuredMultiple / 100);

    // 3. Solvency / Financial Strength (25%)
    const solvencyScore = Math.min(10, (plan.solvencyRatio - 1.0) * 7);

    // 4. Coverage Age + Riders (10%)
    const coverageScore = Math.min(10,
        ((plan.coverageUpToAge - 60) / 3) +
        (plan.criticalIllnessRider ? 2 : 0) +
        (plan.waivPremiumRider ? 1 : 0)
    );

    const tags: string[] = [];
    if (claimScore > 9) tags.push('99%+ Claim Ratio');
    if (valueScore > 8) tags.push('Best Value');
    if (solvencyScore > 8) tags.push('Financially Strong');
    if (plan.criticalIllnessRider) tags.push('Critical Illness Cover');

    const overall = (claimScore * 0.35) + (valueScore * 0.30) + (solvencyScore * 0.25) + (coverageScore * 0.10);

    return {
        overall: Number(overall.toFixed(1)),
        breakdown: [
            { label: 'Claim Settlement', score: Number(claimScore.toFixed(1)), weight: 0.35 },
            { label: 'Premium Value', score: Number(valueScore.toFixed(1)), weight: 0.30 },
            { label: 'Insurer Strength', score: Number(solvencyScore.toFixed(1)), weight: 0.25 },
            { label: 'Coverage Depth', score: Number(coverageScore.toFixed(1)), weight: 0.10 },
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
