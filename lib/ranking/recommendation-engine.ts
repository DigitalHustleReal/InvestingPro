import { CreditCard, Loan, MutualFund, FinancialProduct } from "@/types";
import { scoreCreditCard, scoreLoan, scoreMutualFund, ProductScore } from "@/lib/products/scoring-rules";

export interface UserPreferences {
    productType: 'credit_card' | 'loan' | 'mutual_fund';
    goal: 'travel' | 'shopping' | 'cashback' | 'low_interest' | 'wealth' | 'tax_saving' | 'general' | 'flexibility' | 'safe';
    spendRange: 'low' | 'medium' | 'high'; // low < 20k, med 20-50k, high > 50k (or investment amount)
    features?: string[];
}

export interface RecommendationResult {
    product: FinancialProduct;
    matchScore: number; // 0-100
    matchReason: string;
    tags: string[];
}

export const getRecommendations = (
    products: FinancialProduct[],
    prefs: UserPreferences
): RecommendationResult[] => {
    // Filter by type
    const relevantProducts = products.filter(p => p.category === prefs.productType);

    return relevantProducts.map(product => {
        let rawScore = 0;
        let matchReason = "Good overall match based on your profile.";
        
        // 1. Calculate Base Score using Day 12 Engine
        let productScore: ProductScore = { overall: 0, breakdown: [], tags: [] };
        
        if (prefs.productType === 'credit_card') {
            const card = product as CreditCard;
            productScore = scoreCreditCard(card);
            
            // Dynamic Weighting
            const b = productScore.breakdown;
            const travel = b.find(x => x.label === 'Travel Benefits')?.score || 0;
            const shopping = b.find(x => x.label === 'Rewards Power')?.score || 0;
            const cost = b.find(x => x.label === 'Cost Efficiency')?.score || 0;
            
            if (prefs.goal === 'travel') {
                rawScore = (travel * 0.7) + (cost * 0.2) + (shopping * 0.1);
                matchReason = `Excellent travel benefits (${travel}/10) match your goal.`;
            } else if (prefs.goal === 'shopping' || prefs.goal === 'cashback') {
                rawScore = (shopping * 0.7) + (cost * 0.2) + (travel * 0.1);
                matchReason = `High reward rate (${shopping}/10) matches your spending style.`;
            } else { // General
                 rawScore = productScore.overall;
            }

        } else if (prefs.productType === 'loan') {
            const loan = product as Loan;
            productScore = scoreLoan(loan);
            
            const b = productScore.breakdown;
            const aff = b.find(x => x.label === 'Affordability')?.score || 0; // Interest
            const flex = b.find(x => x.label === 'Flexibility')?.score || 0; // Tenure
            const cost = b.find(x => x.label === 'Low Cost')?.score || 0; // Fees

            if (prefs.goal === 'low_interest') {
                rawScore = (aff * 0.8) + (cost * 0.2);
                matchReason = `Lowest interest rates (${loan.interestRateMin}%) available.`;
            } else if (prefs.goal === 'flexibility') {
                 rawScore = (flex * 0.7) + (aff * 0.3);
                 matchReason = `Highly flexible tenure (${loan.maxTenureMonths/12} Years).`;
            } else {
                rawScore = productScore.overall;
            }

        } else if (prefs.productType === 'mutual_fund') {
            const mf = product as MutualFund;
            productScore = scoreMutualFund(mf);
            
            const b = productScore.breakdown;
            const returns = b.find(x => x.label === 'Returns')?.score || 0;
            const cost = b.find(x => x.label === 'Cost Efficiency')?.score || 0;
            const safe = b.find(x => x.label === 'Rating')?.score || 0;

            if (prefs.goal === 'wealth') {
                rawScore = (returns * 0.7) + (cost * 0.3);
                matchReason = `High historical returns (${mf.returns3Y}%) for wealth creation.`;
            } else if (prefs.goal === 'tax_saving') {
                // ELSS check
                const isElss = mf.subCategory?.includes('ELSS') || (mf as any).type?.includes('ELSS') || (mf as any).fundCategory?.includes('ELSS');
                rawScore = isElss ? 9.5 : 2; // Hard filter logic
                matchReason = isElss ? "Top Tax Saver Fund (ELSS)." : "Note: This is not an ELSS tax-saving fund.";
            } else if (prefs.goal === 'safe') {
                rawScore = (safe * 0.6) + (returns * 0.4);
                matchReason = `High safety rating (${mf.rating}/5) for steady growth.`;
            } else {
                rawScore = productScore.overall;
            }
        }

        // Spend Adjustment (Example)
        if (prefs.spendRange === 'high' && rawScore > 0) {
            // Boost premium products
             if (product.name.includes('Premium') || product.name.includes('Regalia') || product.name.includes('Gold')) {
                 rawScore += 1;
             }
        }
        
        // Cap at 10
        rawScore = Math.min(10, rawScore);
        
        // Convert to 0-100 match percentage
        const matchScore = Math.round(rawScore * 10);

        return {
            product,
            matchScore,
            matchReason,
            tags: productScore.tags
        };

    }).sort((a, b) => b.matchScore - a.matchScore);
};
