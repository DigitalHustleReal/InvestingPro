import { CreditCard } from '@/types/credit-card';

export interface SpendingInput {
    monthlySpending: number;
    groceries: number;
    fuel: number;
    travel: number;
    onlineShopping: number;
    dining: number;
    utilities: number;
    other: number;
}

export interface LifestyleInput {
    lifestyle: 'traveler' | 'shopper' | 'fuel_user' | 'dining' | 'all_rounder';
    frequency: 'high' | 'medium' | 'low';
}

export interface EligibilityInput {
    monthlyIncome: number;
    employmentStatus: 'salaried' | 'self_employed' | 'business';
    creditScore?: number;
    existingCards?: number;
}

export interface CardRecommendation {
    card: CreditCard;
    score: number;
    reasons: string[];
    estimatedRewards: number; // Monthly rewards in ₹
    eligibilityProbability: number; // 0-100
}

/**
 * Credit Card Decision Engine
 * Provides spending-based, lifestyle-based, and eligibility-based recommendations
 */
export class CreditCardDecisionEngine {
    private cards: CreditCard[];

    constructor(cards: CreditCard[]) {
        this.cards = cards;
    }

    /**
     * Get spending-based recommendations
     * Optimizes for maximum rewards based on spending pattern
     */
    getSpendingBasedRecommendations(input: SpendingInput, limit: number = 3): CardRecommendation[] {
        const totalSpending = input.monthlySpending;
        
        return this.cards
            .map(card => {
                let score = 0;
                const reasons: string[] = [];
                let estimatedRewards = 0;

                // Calculate rewards based on card type and spending
                if (card.type === 'Cashback' || card.type === 'cashback') {
                    // Cashback cards: typically 1-5% cashback
                    const cashbackRate = this.extractCashbackRate(card);
                    estimatedRewards = (totalSpending * cashbackRate) / 100;
                    score += estimatedRewards * 10; // Higher rewards = higher score
                    reasons.push(`Earn ₹${estimatedRewards.toFixed(0)}/month cashback on your spending`);
                } else if (card.type === 'Travel' || card.type === 'travel') {
                    // Travel cards: points for travel spending
                    const travelSpending = input.travel;
                    const pointsRate = this.extractPointsRate(card);
                    const pointsEarned = (travelSpending * pointsRate) / 100;
                    estimatedRewards = pointsEarned * 0.5; // Approximate ₹ value per point
                    score += travelSpending > 5000 ? estimatedRewards * 15 : estimatedRewards * 5;
                    if (travelSpending > 5000) {
                        reasons.push(`Ideal for frequent travelers (₹${travelSpending}/month on travel)`);
                    }
                } else if (card.type === 'Shopping' || card.type === 'shopping') {
                    // Shopping cards: rewards for online shopping
                    const shoppingSpending = input.onlineShopping;
                    const shoppingRate = this.extractRewardRate(card);
                    estimatedRewards = (shoppingSpending * shoppingRate) / 100;
                    score += shoppingSpending > 10000 ? estimatedRewards * 12 : estimatedRewards * 5;
                    if (shoppingSpending > 10000) {
                        reasons.push(`Maximize rewards on online shopping (₹${shoppingSpending}/month)`);
                    }
                } else if ((card.type as string) === 'Fuel' || (card.type as string) === 'fuel') {
                    // Fuel cards: rewards for fuel spending
                    const fuelSpending = input.fuel;
                    const fuelRate = this.extractRewardRate(card);
                    estimatedRewards = (fuelSpending * fuelRate) / 100;
                    score += fuelSpending > 3000 ? estimatedRewards * 15 : estimatedRewards * 5;
                    if (fuelSpending > 3000) {
                        reasons.push(`Best for fuel spending (₹${fuelSpending}/month)`);
                    }
                } else if (card.type === 'Rewards' || card.type === 'rewards') {
                    // Rewards cards: general rewards
                    const rewardRate = this.extractRewardRate(card);
                    estimatedRewards = (totalSpending * rewardRate) / 100;
                    score += estimatedRewards * 8;
                    reasons.push(`Earn rewards on all spending`);
                }

                // Bonus for lifetime free cards
                if (this.isLifetimeFree(card)) {
                    score += 50;
                    reasons.push('Lifetime free - no annual fee');
                } else {
                    // Penalty for annual fee (but less if waived)
                    const annualFee = this.extractAnnualFee(card);
                    if (annualFee > 0) {
                        const monthlyFee = annualFee / 12;
                        score -= monthlyFee * 2;
                        if (this.hasFeeWaiver(card)) {
                            reasons.push(`Annual fee ₹${annualFee} (waivable)`);
                        } else {
                            reasons.push(`Annual fee ₹${annualFee}`);
                        }
                    }
                }

                // Bonus for high spending match
                if (totalSpending > 50000) {
                    score += 20;
                    reasons.push('Ideal for high spenders');
                }

                // Check eligibility (basic)
                const eligibilityInput: EligibilityInput = {
                    monthlyIncome: input.monthlySpending * 2, // Rough estimate
                    employmentStatus: 'salaried'
                };
                const eligibility = this.checkEligibility(card, eligibilityInput);

                return {
                    card,
                    score: Math.max(0, score),
                    reasons,
                    estimatedRewards,
                    eligibilityProbability: eligibility
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    /**
     * Get lifestyle-based recommendations
     */
    getLifestyleBasedRecommendations(input: LifestyleInput, limit: number = 3): CardRecommendation[] {
        return this.cards
            .map(card => {
                let score = 0;
                const reasons: string[] = [];

                // Match card type to lifestyle
                if (input.lifestyle === 'traveler') {
                    if (card.type === 'Travel' || card.type === 'travel') {
                        score += 100;
                        reasons.push('Perfect for frequent travelers');
                    } else if (card.type === 'Premium' || card.type === 'premium') {
                        score += 60;
                        reasons.push('Premium benefits for travelers');
                    }
                } else if (input.lifestyle === 'shopper') {
                    if (card.type === 'Shopping' || card.type === 'shopping') {
                        score += 100;
                        reasons.push('Maximize rewards on shopping');
                    } else if (card.type === 'Cashback' || card.type === 'cashback') {
                        score += 70;
                        reasons.push('Cashback on all purchases');
                    }
                } else if (input.lifestyle === 'fuel_user') {
                    if ((card.type as string) === 'Fuel' || (card.type as string) === 'fuel') {
                        score += 100;
                        reasons.push('Best for fuel spending');
                    }
                } else if (input.lifestyle === 'dining') {
                    if (card.rewards?.some(r => r.toLowerCase().includes('dining'))) {
                        score += 80;
                        reasons.push('Rewards on dining');
                    }
                } else if (input.lifestyle === 'all_rounder') {
                    if (card.type === 'Rewards' || card.type === 'rewards') {
                        score += 80;
                        reasons.push('Rewards on all categories');
                    } else if (card.type === 'Cashback' || card.type === 'cashback') {
                        score += 70;
                        reasons.push('Cashback on all spending');
                    }
                }

                // Frequency bonus
                if (input.frequency === 'high') {
                    score += 20;
                    reasons.push('Ideal for frequent use');
                }

                // Lifetime free bonus
                if (this.isLifetimeFree(card)) {
                    score += 30;
                    reasons.push('Lifetime free');
                }

                // Rating bonus
                if (card.rating >= 4.5) {
                    score += 15;
                    reasons.push('Highly rated');
                }

                return {
                    card,
                    score: Math.max(0, score),
                    reasons,
                    estimatedRewards: 0, // Lifestyle doesn't calculate rewards
                    eligibilityProbability: 70 // Default
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    /**
     * Check eligibility for a card
     */
    checkEligibility(card: CreditCard, input: EligibilityInput): number {
        let probability = 50; // Base probability

        // Check income requirement
        const minIncome = this.extractMinIncome(card);
        if (minIncome > 0) {
            if (input.monthlyIncome >= minIncome * 1.5) {
                probability += 30;
            } else if (input.monthlyIncome >= minIncome) {
                probability += 15;
            } else {
                probability -= 20;
            }
        }

        // Check credit score (if available)
        if (input.creditScore) {
            if (input.creditScore >= 750) {
                probability += 20;
            } else if (input.creditScore >= 700) {
                probability += 10;
            } else if (input.creditScore < 650) {
                probability -= 15;
            }
        }

        // Employment status
        if (input.employmentStatus === 'salaried') {
            probability += 10;
        } else if (input.employmentStatus === 'self_employed') {
            probability -= 5;
        }

        // Existing cards (too many = lower approval)
        if (input.existingCards && input.existingCards > 5) {
            probability -= 10;
        }

        // Card type (premium = stricter)
        if (card.type === 'Premium' || card.type === 'premium') {
            probability -= 10;
        }

        return Math.max(0, Math.min(100, probability));
    }

    /**
     * Get instant eligibility for all cards
     */
    getEligibilityForAllCards(input: EligibilityInput): Array<{ card: CreditCard; probability: number }> {
        return this.cards.map(card => ({
            card,
            probability: this.checkEligibility(card, input)
        })).sort((a, b) => b.probability - a.probability);
    }

    // Helper methods
    private extractCashbackRate(card: CreditCard): number {
        // Try to extract cashback rate from rewards or description
        const text = `${card.rewards?.join(' ')} ${card.description}`.toLowerCase();
        const match = text.match(/(\d+(?:\.\d+)?)\s*%?\s*cashback/);
        return match ? parseFloat(match[1]) : 1; // Default 1%
    }

    private extractPointsRate(card: CreditCard): number {
        const text = `${card.rewards?.join(' ')} ${card.description}`.toLowerCase();
        const match = text.match(/(\d+)\s*points?\s*per\s*₹?\s*(\d+)/);
        if (match) {
            return (parseFloat(match[1]) / parseFloat(match[2])) * 100;
        }
        return 2; // Default 2% equivalent
    }

    private extractRewardRate(card: CreditCard): number {
        const text = `${card.rewards?.join(' ')} ${card.description}`.toLowerCase();
        const match = text.match(/(\d+(?:\.\d+)?)\s*%?\s*reward/);
        return match ? parseFloat(match[1]) : 1; // Default 1%
    }

    private extractAnnualFee(card: CreditCard): number {
        if (!card.annual_fee) return 0;
        const feeStr = card.annual_fee.toLowerCase();
        if (feeStr.includes('free') || feeStr.includes('0')) return 0;
        const match = feeStr.match(/₹?\s*(\d+(?:,\d+)?)/);
        return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    }

    private extractMinIncome(card: CreditCard): number {
        if (!card.min_income) return 0;
        const incomeStr = card.min_income.toLowerCase();
        const match = incomeStr.match(/₹?\s*(\d+(?:,\d+)?)\s*\/?\s*(?:month|monthly|per month)/);
        if (match) {
            return parseFloat(match[1].replace(/,/g, ''));
        }
        // Try annual
        const annualMatch = incomeStr.match(/₹?\s*(\d+(?:,\d+)?)\s*\/?\s*(?:year|annual|per year)/);
        if (annualMatch) {
            return parseFloat(annualMatch[1].replace(/,/g, '')) / 12;
        }
        return 0;
    }

    private isLifetimeFree(card: CreditCard): boolean {
        const feeStr = (card.annual_fee || '').toLowerCase();
        return feeStr.includes('lifetime free') || feeStr.includes('ltf') || feeStr === 'free' || feeStr === '0';
    }

    private hasFeeWaiver(card: CreditCard): boolean {
        // Check if card has fee waiver condition
        return false; // Would need to parse from card data
    }
}
