/**
 * Feature Explanation Lookup
 * Provides user-friendly explanations for technical product features
 */

interface FeatureExplanation {
    title: string;
    description: string;
    lowerIsBetter?: boolean;
    higherIsBetter?: boolean;
}

export const FEATURE_EXPLANATIONS: Record<string, FeatureExplanation> = {
    // Credit Card Features
    annual_fee: {
        title: "Annual Fee",
        description: "The yearly charge for keeping the card active. Some premium cards waive this fee if you meet spending criteria.",
        lowerIsBetter: true
    },
    joining_fee: {
        title: "Joining Fee",
        description: "One-time fee charged when you first get the card. Often waived during promotional periods.",
        lowerIsBetter: true
    },
    reward_rate: {
        title: "Reward Rate",
        description: "Points or cashback earned per ₹100 spent. Higher rates mean more rewards for your spending.",
        higherIsBetter: true
    },
    cashback: {
        title: "Cashback",
        description: "Direct cash return on purchases. No redemption hassle—money is credited to your statement.",
        higherIsBetter: true
    },
    fuel_surcharge_waiver: {
        title: "Fuel Surcharge Waiver",
        description: "Saves 1% fuel surcharge at petrol pumps. Can add up to significant savings for regular commuters."
    },
    lounge_access: {
        title: "Airport Lounge Access",
        description: "Complimentary access to airport lounges. Premium cards often include international lounge networks."
    },
    
    // Loan Features
    interest_rate: {
        title: "Interest Rate",
        description: "Annual percentage rate charged on your loan. Lower rates significantly reduce total repayment amount.",
        lowerIsBetter: true
    },
    processing_fee: {
        title: "Processing Fee",
        description: "Upfront charge for loan processing. Usually 0.5-2% of loan amount. Negotiate for waivers.",
        lowerIsBetter: true
    },
    tenure: {
        title: "Loan Tenure",
        description: "Repayment period in months/years. Longer tenure = lower EMI but higher total interest paid."
    },
    prepayment_charges: {
        title: "Prepayment Charges",
        description: "Penalty for paying off loan early. Look for loans with zero prepayment charges for flexibility."
    },
    
    // Mutual Fund Features
    expense_ratio: {
        title: "Expense Ratio",
        description: "Annual fee charged by the fund (as % of assets). Lower is better—every 0.5% saved compounds over decades.",
        lowerIsBetter: true
    },
    cagr: {
        title: "CAGR (Returns)",
        description: "Compound Annual Growth Rate. Shows average yearly returns. Past performance doesn't guarantee future results.",
        higherIsBetter: true
    },
    aum: {
        title: "Assets Under Management",
        description: "Total fund size. Larger AUM indicates investor confidence but may limit agility."
    },
    exit_load: {
        title: "Exit Load",
        description: "Penalty for redeeming before a specified period. Typically 1% if redeemed within 1 year.",
        lowerIsBetter: true
    },
    minimum_sip: {
        title: "Minimum SIP Amount",
        description: "Lowest monthly investment allowed. Lower minimums make funds accessible to more investors."
    },
    
    // Insurance Features
    sum_assured: {
        title: "Sum Assured",
        description: "Coverage amount payable on claim. Should be 10-15x your annual income for term insurance.",
        higherIsBetter: true
    },
    premium: {
        title: "Premium",
        description: "Amount paid for insurance coverage. Compare per lakh of coverage across insurers.",
        lowerIsBetter: true
    },
    claim_settlement_ratio: {
        title: "Claim Settlement Ratio",
        description: "% of claims approved by insurer. Above 95% is excellent. Critical for peace of mind.",
        higherIsBetter: true
    },
    waiting_period: {
        title: "Waiting Period",
        description: "Time before certain conditions are covered. Shorter is better for faster access to benefits.",
        lowerIsBetter: true
    },
    room_rent_limit: {
        title: "Room Rent Limit",
        description: "Max daily room charge covered. Unlimited or high limits prevent out-of-pocket expenses."
    },
    
    // Universal Features
    trust_score: {
        title: "InvestingPro Trust Score",
        description: "Our proprietary rating (0-100) based on data accuracy, user reviews, and market standing.",
        higherIsBetter: true
    },
    rating: {
        title: "Overall Rating",
        description: "Aggregate score from expert reviews and user feedback. Consider alongside specific needs.",
        higherIsBetter: true
    },
    verification_status: {
        title: "Verification Status",
        description: "Data freshness indicator. 'Verified' means we've confirmed details within last 30 days."
    }
};

/**
 * Get explanation for a feature key
 */
export function getFeatureExplanation(key: string): FeatureExplanation | null {
    // Direct match
    if (FEATURE_EXPLANATIONS[key]) {
        return FEATURE_EXPLANATIONS[key];
    }
    
    // Fuzzy match - check if key contains any known feature
    for (const [knownKey, explanation] of Object.entries(FEATURE_EXPLANATIONS)) {
        if (key.includes(knownKey) || knownKey.includes(key)) {
            return explanation;
        }
    }
    
    return null;
}

/**
 * Determine if a feature should use "lower is better" or "higher is better" logic
 */
export function getComparisonDirection(key: string): 'lower' | 'higher' | 'neutral' {
    const explanation = getFeatureExplanation(key);
    if (!explanation) return 'neutral';
    
    if (explanation.lowerIsBetter) return 'lower';
    if (explanation.higherIsBetter) return 'higher';
    return 'neutral';
}
