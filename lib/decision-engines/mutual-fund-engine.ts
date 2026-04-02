import { MutualFund } from '@/types/mutual-fund';

export interface GoalInput {
    goal: 'retirement' | 'education' | 'house' | 'vacation' | 'emergency' | 'wealth_creation';
    amountNeeded: number; // Target amount in ₹
    timeline: number; // Years to achieve goal
    monthlyBudget?: number; // Optional: Monthly SIP budget
}

export interface RiskInput {
    riskProfile: 'conservative' | 'moderate' | 'aggressive' | 'very_aggressive';
    investmentHorizon: 'short' | 'medium' | 'long'; // <3 years, 3-7 years, >7 years
    experience: 'beginner' | 'intermediate' | 'advanced';
}

export interface FundRecommendation {
    fund: MutualFund;
    score: number;
    reasons: string[];
    recommendedSIPAmount: number; // Monthly SIP in ₹
    projectedValue: number; // Projected value at goal timeline
    riskMatch: number; // 0-100, how well it matches risk profile
}

/**
 * Mutual Fund Decision Engine
 * Provides goal-based and risk-profiled recommendations
 */
export class MutualFundDecisionEngine {
    private funds: MutualFund[];

    constructor(funds: MutualFund[]) {
        this.funds = funds;
    }

    /**
     * Get goal-based recommendations
     * Calculates required SIP amount and recommends funds
     */
    getGoalBasedRecommendations(input: GoalInput, limit: number = 3): FundRecommendation[] {
        const { goal, amountNeeded, timeline, monthlyBudget } = input;
        
        // Calculate required monthly SIP using compound interest formula
        // FV = P * [((1 + r)^n - 1) / r] * (1 + r)
        // Where: FV = Future Value, P = Monthly SIP, r = Monthly Rate, n = Months
        const expectedAnnualReturn = this.getExpectedReturnForGoal(goal);
        const monthlyRate = expectedAnnualReturn / 12 / 100;
        const months = timeline * 12;

        // Calculate required SIP if not provided
        let requiredSIP = monthlyBudget || 0;
        if (!monthlyBudget) {
            // Reverse calculate: P = FV / [((1 + r)^n - 1) / r * (1 + r)]
            const denominator = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
            requiredSIP = amountNeeded / denominator;
        }

        // Calculate projected value if monthly budget is provided
        const calculateProjectedValue = (sipAmount: number, annualReturn: number) => {
            const monthlyRet = annualReturn / 12 / 100;
            const months = timeline * 12;
            return sipAmount * ((Math.pow(1 + monthlyRet, months) - 1) / monthlyRet) * (1 + monthlyRet);
        };

        return this.funds
            .map(fund => {
                let score = 0;
                const reasons: string[] = [];
                
                // Match fund category to goal
                const goalCategory = this.getCategoryForGoal(goal);
                if (fund.category === goalCategory || this.isCategoryMatch(fund.category, goalCategory)) {
                    score += 50;
                    reasons.push(`Ideal for ${goal} goal`);
                }

                // Check returns (use 3Y or 5Y returns)
                const returns = fund.returns_3y || fund.returns_5y || 0;
                if (returns >= expectedAnnualReturn) {
                    score += 30;
                    reasons.push(`Strong returns: ${returns.toFixed(1)}% (3Y)`);
                } else if (returns >= expectedAnnualReturn - 2) {
                    score += 15;
                    reasons.push(`Good returns: ${returns.toFixed(1)}% (3Y)`);
                }

                // Risk matching
                const riskLevel = this.getRiskLevelForGoal(goal);
                if (this.matchesRisk(fund.risk, riskLevel)) {
                    score += 20;
                    reasons.push(`Appropriate risk level for ${goal}`);
                }

                // Rating bonus
                if ((fund.rating ?? 0) >= 4.5) {
                    score += 15;
                    reasons.push('Highly rated fund');
                } else if ((fund.rating ?? 0) >= 4.0) {
                    score += 10;
                    reasons.push('Well-rated fund');
                }

                // AUM bonus (larger AUM = more stable)
                const aum = this.parseAUM(fund.aum);
                if (aum > 1000) { // > ₹1000 Cr
                    score += 10;
                    reasons.push('Large AUM (stable fund)');
                }

                // Expense ratio (lower is better)
                const expenseRatio = fund.expense_ratio || 2.5;
                if (expenseRatio < 1.0) {
                    score += 10;
                    reasons.push(`Low expense ratio: ${expenseRatio}%`);
                } else if (expenseRatio < 1.5) {
                    score += 5;
                    reasons.push(`Reasonable expense ratio: ${expenseRatio}%`);
                }

                // Calculate recommended SIP
                const recommendedSIP = monthlyBudget || requiredSIP;
                const projectedValue = calculateProjectedValue(recommendedSIP, returns || expectedAnnualReturn);

                // Risk match score
                const riskMatch = this.calculateRiskMatch(fund.risk, riskLevel);

                return {
                    fund,
                    score: Math.max(0, score),
                    reasons,
                    recommendedSIPAmount: Math.round(recommendedSIP),
                    projectedValue: Math.round(projectedValue),
                    riskMatch
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    /**
     * Get risk-profiled recommendations
     */
    getRiskProfiledRecommendations(input: RiskInput, limit: number = 3): FundRecommendation[] {
        return this.funds
            .map(fund => {
                let score = 0;
                const reasons: string[] = [];

                // Risk profile matching
                const riskMatch = this.calculateRiskMatch(fund.risk, input.riskProfile);
                score += riskMatch;
                
                if (riskMatch >= 80) {
                    reasons.push(`Perfect risk match for ${input.riskProfile} investors`);
                } else if (riskMatch >= 60) {
                    reasons.push(`Good risk match for ${input.riskProfile} investors`);
                }

                // Investment horizon matching
                const horizonCategory = this.getCategoryForHorizon(input.investmentHorizon);
                if (fund.category === horizonCategory || this.isCategoryMatch(fund.category, horizonCategory)) {
                    score += 30;
                    reasons.push(`Ideal for ${input.investmentHorizon}-term investment`);
                }

                // Returns based on risk profile
                const expectedReturns = this.getExpectedReturnsForRisk(input.riskProfile);
                const returns = fund.returns_3y || fund.returns_5y || 0;
                
                if (returns >= expectedReturns) {
                    score += 25;
                    reasons.push(`Strong returns: ${returns.toFixed(1)}% (3Y)`);
                } else if (returns >= expectedReturns - 2) {
                    score += 15;
                    reasons.push(`Good returns: ${returns.toFixed(1)}% (3Y)`);
                }

                // Rating bonus
                if ((fund.rating ?? 0) >= 4.5) {
                    score += 15;
                    reasons.push('Highly rated fund');
                }

                // Experience level matching
                if (input.experience === 'beginner' && fund.category === 'Index Fund') {
                    score += 10;
                    reasons.push('Beginner-friendly index fund');
                }

                // Calculate default SIP (₹5000/month)
                const defaultSIP = 5000;
                const projectedValue = this.calculateProjectedValue(defaultSIP, returns || expectedReturns, 5); // 5 years default

                return {
                    fund,
                    score: Math.max(0, score),
                    reasons,
                    recommendedSIPAmount: defaultSIP,
                    projectedValue: Math.round(projectedValue),
                    riskMatch
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    /**
     * Calculate projected value for a SIP
     */
    calculateProjectedValue(sipAmount: number, annualReturn: number, years: number): number {
        const monthlyRate = annualReturn / 12 / 100;
        const months = years * 12;
        return sipAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    }

    // Helper methods
    private getExpectedReturnForGoal(goal: string): number {
        const returns: Record<string, number> = {
            retirement: 12, // 12% annual return
            education: 12,
            house: 10,
            vacation: 8,
            emergency: 6, // Conservative for emergency
            wealth_creation: 12
        };
        return returns[goal] || 10;
    }

    private getCategoryForGoal(goal: string): string {
        const categories: Record<string, string> = {
            retirement: 'Large Cap',
            education: 'Large Cap',
            house: 'Hybrid',
            vacation: 'Debt',
            emergency: 'Debt',
            wealth_creation: 'Flexi Cap'
        };
        return categories[goal] || 'Large Cap';
    }

    private getRiskLevelForGoal(goal: string): string {
        const risks: Record<string, string> = {
            retirement: 'Moderate',
            education: 'Moderate',
            house: 'Moderate',
            vacation: 'Low',
            emergency: 'Low',
            wealth_creation: 'Moderately High'
        };
        return risks[goal] || 'Moderate';
    }

    private getCategoryForHorizon(horizon: string): string {
        const categories: Record<string, string> = {
            short: 'Debt',
            medium: 'Hybrid',
            long: 'Large Cap'
        };
        return categories[horizon] || 'Large Cap';
    }

    private getExpectedReturnsForRisk(riskProfile: string): number {
        const returns: Record<string, number> = {
            conservative: 7,
            moderate: 10,
            aggressive: 12,
            very_aggressive: 14
        };
        return returns[riskProfile] || 10;
    }

    private matchesRisk(fundRisk: string | undefined, targetRisk: string): boolean {
        if (!fundRisk) return false;
        
        const riskLevels = ['Low', 'Moderate', 'Moderately High', 'High', 'Very High'];
        const fundRiskIndex = riskLevels.indexOf(fundRisk);
        const targetRiskIndex = riskLevels.indexOf(targetRisk);
        
        if (fundRiskIndex === -1 || targetRiskIndex === -1) return false;
        
        // Allow ±1 level difference
        return Math.abs(fundRiskIndex - targetRiskIndex) <= 1;
    }

    private calculateRiskMatch(fundRisk: string | undefined, targetRisk: string): number {
        if (!fundRisk) return 50; // Default if unknown
        
        const riskLevels = ['Low', 'Moderate', 'Moderately High', 'High', 'Very High'];
        const fundRiskIndex = riskLevels.indexOf(fundRisk);
        const targetRiskIndex = riskLevels.indexOf(targetRisk);
        
        if (fundRiskIndex === -1 || targetRiskIndex === -1) return 50;
        
        const diff = Math.abs(fundRiskIndex - targetRiskIndex);
        
        if (diff === 0) return 100; // Perfect match
        if (diff === 1) return 75; // Close match
        if (diff === 2) return 50; // Moderate match
        return 25; // Poor match
    }

    private isCategoryMatch(fundCategory: string, targetCategory: string): boolean {
        // Flexible matching
        if (fundCategory === targetCategory) return true;
        
        // ELSS matches Equity goals
        if (targetCategory === 'Large Cap' && fundCategory === 'ELSS') return true;
        
        // Flexi Cap matches Large Cap goals
        if (targetCategory === 'Large Cap' && fundCategory === 'Flexi Cap') return true;
        
        return false;
    }

    private parseAUM(aum: string | undefined): number {
        if (!aum) return 0;
        
        // Parse "₹5,000 Cr" or "5000 Cr" format
        const match = aum.match(/(\d+(?:,\d+)?)\s*Cr/i);
        if (match) {
            return parseFloat(match[1].replace(/,/g, ''));
        }
        
        return 0;
    }
}
