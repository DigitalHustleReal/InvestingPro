/**
 * Basic Tests for Ranking Algorithm
 * Run with: npm test
 */

import { scoreCreditCard, scoreMutualFund, rankProducts } from '@/lib/ranking/algorithm';
import type { CreditCard, MutualFund } from '@/types';

// Mock data
const mockCreditCard: CreditCard = {
    id: 'test-cc-1',
    name: 'Test Credit Card',
    provider: 'Test Bank',
    type: 'cashback',
    annualFee: 0,
    features: ['Feature 1', 'Feature 2'],
    pros: ['Pro 1'],
    rating: 4.5,
    reviewsCount: 100,
    minCreditScore: 650,
};

const mockMutualFund: MutualFund = {
    id: 'test-mf-1',
    name: 'Test Mutual Fund',
    provider: 'Test AMC',
    category: 'Large Cap',
    expenseRatio: 1.2,
    returns1Y: 15.5,
    returns3Y: 18.2,
    returns5Y: 16.8,
    rating: 4.0,
    reviewsCount: 50,
};

describe('Ranking Algorithm', () => {
    describe('scoreCreditCard', () => {
        it('should calculate score for credit card', () => {
            const score = scoreCreditCard(mockCreditCard, [mockCreditCard]);
            
            expect(score).toBeDefined();
            expect(score.totalScore).toBeGreaterThan(0);
            expect(score.totalScore).toBeLessThanOrEqual(100);
            expect(score.breakdown).toHaveProperty('valueScore');
            expect(score.breakdown).toHaveProperty('popularityScore');
            expect(score.breakdown).toHaveProperty('featureScore');
            expect(score.breakdown).toHaveProperty('trustScore');
        });

        it('should give higher score to cards with no annual fee', () => {
            const freeCard = { ...mockCreditCard, annualFee: 0 };
            const paidCard = { ...mockCreditCard, annualFee: 1000 };
            
            const freeScore = scoreCreditCard(freeCard, [freeCard, paidCard]);
            const paidScore = scoreCreditCard(paidCard, [freeCard, paidCard]);
            
            expect(freeScore.breakdown.valueScore).toBeGreaterThan(paidScore.breakdown.valueScore);
        });
    });

    describe('scoreMutualFund', () => {
        it('should calculate score for mutual fund', () => {
            const score = scoreMutualFund(mockMutualFund, [mockMutualFund]);
            
            expect(score).toBeDefined();
            expect(score.totalScore).toBeGreaterThan(0);
            expect(score.totalScore).toBeLessThanOrEqual(100);
        });

        it('should give higher score to funds with better returns', () => {
            const highReturn = { ...mockMutualFund, returns3Y: 25, returns5Y: 22 };
            const lowReturn = { ...mockMutualFund, returns3Y: 10, returns5Y: 8 };
            
            const highScore = scoreMutualFund(highReturn, [highReturn, lowReturn]);
            const lowScore = scoreMutualFund(lowReturn, [highReturn, lowReturn]);
            
            expect(highScore.breakdown.valueScore).toBeGreaterThan(lowScore.breakdown.valueScore);
        });
    });

    describe('rankProducts', () => {
        it('should rank products by score', () => {
            const cards = [
                { ...mockCreditCard, id: '1', rating: 4.5 },
                { ...mockCreditCard, id: '2', rating: 4.0 },
                { ...mockCreditCard, id: '3', rating: 5.0 },
            ];
            
            const ranked = rankProducts(cards, scoreCreditCard);
            
            expect(ranked[0].rank).toBe(1);
            expect(ranked[1].rank).toBe(2);
            expect(ranked[2].rank).toBe(3);
            expect(ranked[0].totalScore).toBeGreaterThanOrEqual(ranked[1].totalScore);
        });

        it('should assign badges to top products', () => {
            const cards = [
                { ...mockCreditCard, id: '1' },
                { ...mockCreditCard, id: '2' },
                { ...mockCreditCard, id: '3' },
            ];
            
            const ranked = rankProducts(cards, scoreCreditCard);
            
            expect(ranked[0].badge).toBe('best_overall');
        });
    });
});

