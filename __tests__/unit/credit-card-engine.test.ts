/**
 * Unit Tests: Credit Card Decision Engine
 *
 * Tests the recommendation and eligibility logic in
 * lib/decision-engines/credit-card-engine.ts.
 * No React, no DOM, no network — pure scoring logic.
 */

import {
  CreditCardDecisionEngine,
  SpendingInput,
  LifestyleInput,
  EligibilityInput,
} from '@/lib/decision-engines/credit-card-engine';
import { CreditCard } from '@/types/credit-card';

// ─── Mock Card Factory ─────────────────────────────────────────────────────

function makeCard(overrides: Partial<CreditCard> = {}): CreditCard {
  return {
    id: 'card-1',
    slug: 'test-card',
    name: 'Test Card',
    bank: 'Test Bank',
    type: 'Rewards',
    description: 'A generic rewards card',
    annual_fee: '₹500',
    joining_fee: '₹0',
    rewards: ['1% reward on all spends'],
    pros: ['Low fee'],
    cons: ['Low rewards'],
    rating: 4.0,
    ...overrides,
  };
}

const cashbackCard = makeCard({
  id: 'cashback-1',
  slug: 'cashback-card',
  name: 'SuperCash Card',
  type: 'Cashback',
  description: '5% cashback on all online spends',
  annual_fee: 'Lifetime Free',
  rewards: ['5% cashback on online', '1% cashback on offline'],
  rating: 4.5,
});

const travelCard = makeCard({
  id: 'travel-1',
  slug: 'travel-card',
  name: 'JetSetter Card',
  type: 'Travel',
  description: 'Earn 4 points per ₹100 on travel. Lounge access included.',
  annual_fee: '₹3,000',
  min_income: '₹50,000/month',
  rewards: ['4 points per ₹100 on travel', 'Lounge access'],
  rating: 4.7,
});

const shoppingCard = makeCard({
  id: 'shopping-1',
  slug: 'shopping-card',
  name: 'ShopMax Card',
  type: 'Shopping',
  description: '3% reward on online shopping',
  annual_fee: '₹1,000',
  rewards: ['3% reward on shopping', '10x points on partner brands'],
  rating: 4.2,
});

const fuelCard = makeCard({
  id: 'fuel-1',
  slug: 'fuel-card',
  name: 'FuelSaver Card',
  type: 'Fuel' as CreditCard['type'],
  description: '2.5% reward on fuel',
  annual_fee: '₹0',
  rewards: ['2.5% reward on fuel', '1% surcharge waiver'],
  rating: 4.0,
});

const premiumCard = makeCard({
  id: 'premium-1',
  slug: 'premium-card',
  name: 'Platinum Elite',
  type: 'Premium',
  description: 'Premium lifestyle card with 2% cashback',
  annual_fee: '₹10,000',
  min_income: '₹1,00,000/month',
  rewards: ['2% cashback on everything', 'Golf access', 'Concierge'],
  rating: 4.8,
});

const lifetimeFreeRewardsCard = makeCard({
  id: 'ltf-rewards',
  slug: 'ltf-rewards',
  name: 'LTF Rewards',
  type: 'Rewards',
  description: '1.5% reward on all spends',
  annual_fee: 'LTF',
  rewards: ['1.5% reward on all spends'],
  rating: 4.3,
});

const diningRewardsCard = makeCard({
  id: 'dining-1',
  slug: 'dining-card',
  name: 'DineOut Card',
  type: 'Rewards',
  description: '5x points on dining',
  annual_fee: '₹500',
  rewards: ['5x points on dining', '2x on groceries'],
  rating: 4.1,
});

const allCards = [
  cashbackCard,
  travelCard,
  shoppingCard,
  fuelCard,
  premiumCard,
  lifetimeFreeRewardsCard,
  diningRewardsCard,
];

// ─── getSpendingBasedRecommendations ────────────────────────────────────────

describe('getSpendingBasedRecommendations', () => {
  const engine = new CreditCardDecisionEngine(allCards);

  const baseSpending: SpendingInput = {
    monthlySpending: 30000,
    groceries: 5000,
    fuel: 2000,
    travel: 1000,
    onlineShopping: 8000,
    dining: 3000,
    utilities: 4000,
    other: 7000,
  };

  it('returns the requested number of recommendations', () => {
    const results = engine.getSpendingBasedRecommendations(baseSpending, 3);
    expect(results).toHaveLength(3);
  });

  it('returns results sorted by score descending', () => {
    const results = engine.getSpendingBasedRecommendations(baseSpending, 5);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it('favors cashback cards for general spending', () => {
    const results = engine.getSpendingBasedRecommendations(baseSpending, 7);
    // Cashback card with 5% and lifetime free should rank high
    const cashbackIdx = results.findIndex(r => r.card.id === 'cashback-1');
    expect(cashbackIdx).toBeLessThan(3);
  });

  it('favors travel cards when travel spending is high', () => {
    const highTravelSpending: SpendingInput = {
      ...baseSpending,
      travel: 20000,
      monthlySpending: 50000,
    };
    const results = engine.getSpendingBasedRecommendations(highTravelSpending, 7);
    const travelIdx = results.findIndex(r => r.card.id === 'travel-1');
    expect(travelIdx).toBeLessThan(3);
  });

  it('favors shopping cards when online shopping is high', () => {
    const highShoppingSpending: SpendingInput = {
      ...baseSpending,
      onlineShopping: 25000,
      monthlySpending: 50000,
    };
    const results = engine.getSpendingBasedRecommendations(highShoppingSpending, 7);
    const shoppingIdx = results.findIndex(r => r.card.id === 'shopping-1');
    expect(shoppingIdx).toBeLessThan(4);
  });

  it('favors fuel cards when fuel spending is high', () => {
    const highFuelSpending: SpendingInput = {
      ...baseSpending,
      fuel: 10000,
      monthlySpending: 40000,
    };
    const results = engine.getSpendingBasedRecommendations(highFuelSpending, 7);
    const fuelIdx = results.findIndex(r => r.card.id === 'fuel-1');
    expect(fuelIdx).toBeLessThan(4);
  });

  it('adds high-spender bonus when monthly spending > ₹50,000', () => {
    const highSpender: SpendingInput = {
      ...baseSpending,
      monthlySpending: 60000,
    };
    const results = engine.getSpendingBasedRecommendations(highSpender, 7);
    const highSpenderCard = results.find(r => r.card.id === 'cashback-1');
    expect(highSpenderCard!.reasons).toContain('Ideal for high spenders');
  });

  it('does NOT add high-spender bonus when spending <= ₹50,000', () => {
    const results = engine.getSpendingBasedRecommendations(baseSpending, 7);
    const card = results.find(r => r.card.id === 'cashback-1');
    expect(card!.reasons).not.toContain('Ideal for high spenders');
  });

  it('calculates non-negative estimated rewards', () => {
    const results = engine.getSpendingBasedRecommendations(baseSpending, 7);
    results.forEach(r => {
      expect(r.estimatedRewards).toBeGreaterThanOrEqual(0);
    });
  });

  it('all scores are non-negative', () => {
    const results = engine.getSpendingBasedRecommendations(baseSpending, 7);
    results.forEach(r => {
      expect(r.score).toBeGreaterThanOrEqual(0);
    });
  });

  it('lifetime free card gets bonus + reason', () => {
    const results = engine.getSpendingBasedRecommendations(baseSpending, 7);
    const ltfCard = results.find(r => r.card.id === 'cashback-1');
    expect(ltfCard!.reasons).toContain('Lifetime free - no annual fee');
  });

  it('premium card with high annual fee gets fee penalty in score', () => {
    const engineSingle = new CreditCardDecisionEngine([premiumCard]);
    const results = engineSingle.getSpendingBasedRecommendations(baseSpending, 1);
    // Premium card type doesn't match any reward branch, so it has low score
    // Score starts at 0, gets annual fee penalty, then clamped to 0
    expect(results[0].score).toBe(0);
  });
});

// ─── getLifestyleBasedRecommendations ───────────────────────────────────────

describe('getLifestyleBasedRecommendations', () => {
  const engine = new CreditCardDecisionEngine(allCards);

  it('recommends travel cards for traveler lifestyle', () => {
    const results = engine.getLifestyleBasedRecommendations({
      lifestyle: 'traveler',
      frequency: 'high',
    }, 7);
    const travelIdx = results.findIndex(r => r.card.id === 'travel-1');
    expect(travelIdx).toBe(0);
  });

  it('recommends shopping cards for shopper lifestyle', () => {
    const results = engine.getLifestyleBasedRecommendations({
      lifestyle: 'shopper',
      frequency: 'high',
    }, 7);
    const topCard = results[0].card;
    expect(topCard.type === 'Shopping' || topCard.type === 'Cashback').toBe(true);
  });

  it('recommends fuel cards for fuel_user lifestyle', () => {
    const results = engine.getLifestyleBasedRecommendations({
      lifestyle: 'fuel_user',
      frequency: 'high',
    }, 7);
    const fuelIdx = results.findIndex(r => r.card.id === 'fuel-1');
    expect(fuelIdx).toBe(0);
  });

  it('recommends dining-related cards for dining lifestyle', () => {
    const results = engine.getLifestyleBasedRecommendations({
      lifestyle: 'dining',
      frequency: 'medium',
    }, 7);
    const diningIdx = results.findIndex(r => r.card.id === 'dining-1');
    // Dining card should be ranked high (has "dining" in rewards)
    expect(diningIdx).toBeLessThan(3);
  });

  it('recommends rewards/cashback cards for all_rounder lifestyle', () => {
    const results = engine.getLifestyleBasedRecommendations({
      lifestyle: 'all_rounder',
      frequency: 'medium',
    }, 7);
    const topType = results[0].card.type;
    expect(
      topType === 'Rewards' || topType === 'rewards' ||
      topType === 'Cashback' || topType === 'cashback'
    ).toBe(true);
  });

  it('high frequency adds bonus score', () => {
    const highFreq = engine.getLifestyleBasedRecommendations({
      lifestyle: 'all_rounder',
      frequency: 'high',
    }, 7);
    const lowFreq = engine.getLifestyleBasedRecommendations({
      lifestyle: 'all_rounder',
      frequency: 'low',
    }, 7);
    // Same top card should have higher score with high frequency
    const highScore = highFreq.find(r => r.card.id === 'ltf-rewards')!.score;
    const lowScore = lowFreq.find(r => r.card.id === 'ltf-rewards')!.score;
    expect(highScore).toBeGreaterThan(lowScore);
  });

  it('lifetime free cards get bonus in lifestyle recommendations', () => {
    const results = engine.getLifestyleBasedRecommendations({
      lifestyle: 'all_rounder',
      frequency: 'medium',
    }, 7);
    const ltfCard = results.find(r => r.card.id === 'ltf-rewards');
    expect(ltfCard!.reasons).toContain('Lifetime free');
  });

  it('highly rated cards get rating bonus', () => {
    const results = engine.getLifestyleBasedRecommendations({
      lifestyle: 'traveler',
      frequency: 'medium',
    }, 7);
    const highRated = results.find(r => r.card.id === 'travel-1'); // rating 4.7
    expect(highRated!.reasons).toContain('Highly rated');
  });

  it('estimatedRewards is always 0 for lifestyle recommendations', () => {
    const results = engine.getLifestyleBasedRecommendations({
      lifestyle: 'shopper',
      frequency: 'high',
    }, 7);
    results.forEach(r => {
      expect(r.estimatedRewards).toBe(0);
    });
  });
});

// ─── checkEligibility ───────────────────────────────────────────────────────

describe('checkEligibility', () => {
  const engine = new CreditCardDecisionEngine(allCards);

  it('returns base probability of 50 when no strong signals', () => {
    const card = makeCard({ min_income: undefined });
    const prob = engine.checkEligibility(card, {
      monthlyIncome: 30000,
      employmentStatus: 'self_employed',
    });
    // Base 50, self_employed -5 = 45
    expect(prob).toBe(45);
  });

  it('increases probability for high income vs min requirement', () => {
    // ₹50,000/month min, income is ₹80,000 (>= 1.5x)
    const prob = engine.checkEligibility(travelCard, {
      monthlyIncome: 80000,
      employmentStatus: 'salaried',
    });
    // Base 50 + 30 (income 1.5x) + 10 (salaried) = 90
    expect(prob).toBe(90);
  });

  it('moderate increase for income meeting but not exceeding 1.5x min', () => {
    // ₹50,000/month min, income is ₹55,000 (>= min but < 1.5x)
    const prob = engine.checkEligibility(travelCard, {
      monthlyIncome: 55000,
      employmentStatus: 'salaried',
    });
    // Base 50 + 15 (income >= min) + 10 (salaried) = 75
    expect(prob).toBe(75);
  });

  it('decreases probability when income is below minimum', () => {
    // ₹50,000/month min, income is ₹30,000
    const prob = engine.checkEligibility(travelCard, {
      monthlyIncome: 30000,
      employmentStatus: 'salaried',
    });
    // Base 50 - 20 (below min) + 10 (salaried) = 40
    expect(prob).toBe(40);
  });

  it('high credit score (>= 750) boosts probability', () => {
    const prob = engine.checkEligibility(travelCard, {
      monthlyIncome: 80000,
      employmentStatus: 'salaried',
      creditScore: 780,
    });
    // Base 50 + 30 (income) + 10 (salaried) + 20 (credit) = 100 (capped)
    expect(prob).toBe(100);
  });

  it('moderate credit score (700-749) gives smaller boost', () => {
    const card = makeCard({ min_income: undefined });
    const prob = engine.checkEligibility(card, {
      monthlyIncome: 30000,
      employmentStatus: 'salaried',
      creditScore: 720,
    });
    // Base 50 + 10 (salaried) + 10 (credit 700-749) = 70
    expect(prob).toBe(70);
  });

  it('low credit score (< 650) reduces probability', () => {
    const card = makeCard({ min_income: undefined });
    const prob = engine.checkEligibility(card, {
      monthlyIncome: 30000,
      employmentStatus: 'salaried',
      creditScore: 600,
    });
    // Base 50 + 10 (salaried) - 15 (low credit) = 45
    expect(prob).toBe(45);
  });

  it('salaried gets +10 bonus', () => {
    const card = makeCard({ min_income: undefined });
    const salaried = engine.checkEligibility(card, {
      monthlyIncome: 30000,
      employmentStatus: 'salaried',
    });
    const selfEmployed = engine.checkEligibility(card, {
      monthlyIncome: 30000,
      employmentStatus: 'self_employed',
    });
    expect(salaried - selfEmployed).toBe(15); // +10 vs -5
  });

  it('many existing cards (> 5) reduces probability', () => {
    const card = makeCard({ min_income: undefined });
    const few = engine.checkEligibility(card, {
      monthlyIncome: 30000,
      employmentStatus: 'salaried',
      existingCards: 2,
    });
    const many = engine.checkEligibility(card, {
      monthlyIncome: 30000,
      employmentStatus: 'salaried',
      existingCards: 8,
    });
    expect(few).toBeGreaterThan(many);
    expect(few - many).toBe(10);
  });

  it('premium card type gets -10 penalty', () => {
    const regularCard = makeCard({ type: 'Rewards', min_income: undefined });
    const probRegular = engine.checkEligibility(regularCard, {
      monthlyIncome: 30000,
      employmentStatus: 'salaried',
    });
    const probPremium = engine.checkEligibility(
      makeCard({ type: 'Premium', min_income: undefined }),
      { monthlyIncome: 30000, employmentStatus: 'salaried' },
    );
    expect(probRegular - probPremium).toBe(10);
  });

  it('probability is clamped between 0 and 100', () => {
    // Very bad scenario: below income, low credit, self-employed, many cards, premium
    const prob = engine.checkEligibility(premiumCard, {
      monthlyIncome: 10000,
      employmentStatus: 'self_employed',
      creditScore: 500,
      existingCards: 10,
    });
    expect(prob).toBeGreaterThanOrEqual(0);
    expect(prob).toBeLessThanOrEqual(100);
  });

  it('probability capped at 100 for best-case scenario', () => {
    const prob = engine.checkEligibility(travelCard, {
      monthlyIncome: 500000,
      employmentStatus: 'salaried',
      creditScore: 800,
      existingCards: 0,
    });
    expect(prob).toBeLessThanOrEqual(100);
  });

  it('parses monthly income format for min_income', () => {
    const monthlyIncomeCard = makeCard({
      min_income: '₹25,000/month',
    });
    // ₹25,000/month parsed as 25000
    // Income ₹80,000 >= 1.5 * 25,000 = 37,500 => +30
    const prob = engine.checkEligibility(monthlyIncomeCard, {
      monthlyIncome: 80000,
      employmentStatus: 'salaried',
    });
    // Base 50 + 30 (income 1.5x) + 10 (salaried) = 90
    expect(prob).toBe(90);
  });
});

// ─── getEligibilityForAllCards ──────────────────────────────────────────────

describe('getEligibilityForAllCards', () => {
  const engine = new CreditCardDecisionEngine(allCards);

  it('returns one entry per card', () => {
    const results = engine.getEligibilityForAllCards({
      monthlyIncome: 50000,
      employmentStatus: 'salaried',
    });
    expect(results).toHaveLength(allCards.length);
  });

  it('results are sorted by probability descending', () => {
    const results = engine.getEligibilityForAllCards({
      monthlyIncome: 50000,
      employmentStatus: 'salaried',
      creditScore: 750,
    });
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].probability).toBeGreaterThanOrEqual(results[i].probability);
    }
  });

  it('premium card has lower eligibility than non-premium (same inputs)', () => {
    const results = engine.getEligibilityForAllCards({
      monthlyIncome: 50000,
      employmentStatus: 'salaried',
    });
    const premiumProb = results.find(r => r.card.id === 'premium-1')!.probability;
    const cashbackProb = results.find(r => r.card.id === 'cashback-1')!.probability;
    expect(cashbackProb).toBeGreaterThan(premiumProb);
  });

  it('all probabilities are between 0 and 100', () => {
    const results = engine.getEligibilityForAllCards({
      monthlyIncome: 10000,
      employmentStatus: 'self_employed',
      creditScore: 500,
      existingCards: 10,
    });
    results.forEach(r => {
      expect(r.probability).toBeGreaterThanOrEqual(0);
      expect(r.probability).toBeLessThanOrEqual(100);
    });
  });
});

// ─── Helper methods (tested through public API) ────────────────────────────

describe('helper methods (via public API)', () => {
  it('extractCashbackRate parses percentage from rewards text', () => {
    // cashbackCard has "5% cashback" in description
    const engine = new CreditCardDecisionEngine([cashbackCard]);
    const results = engine.getSpendingBasedRecommendations({
      monthlySpending: 10000,
      groceries: 0, fuel: 0, travel: 0, onlineShopping: 0,
      dining: 0, utilities: 0, other: 10000,
    }, 1);
    // 5% of 10000 = 500
    expect(results[0].estimatedRewards).toBe(500);
  });

  it('extractCashbackRate defaults to 1% when no match', () => {
    const plainCashback = makeCard({
      type: 'Cashback',
      description: 'Great cashback card',
      rewards: ['Earn cashback on purchases'],
    });
    const engine = new CreditCardDecisionEngine([plainCashback]);
    const results = engine.getSpendingBasedRecommendations({
      monthlySpending: 10000,
      groceries: 0, fuel: 0, travel: 0, onlineShopping: 0,
      dining: 0, utilities: 0, other: 10000,
    }, 1);
    // Default 1% of 10000 = 100
    expect(results[0].estimatedRewards).toBe(100);
  });

  it('annual fee card gets lower score than lifetime free card', () => {
    // Compare a card with annual fee vs one that's lifetime free
    const feeCard = makeCard({
      type: 'Cashback',
      annual_fee: '₹5,000',
      rewards: ['1% cashback on all spends'],
    });
    const freeCard = makeCard({
      type: 'Cashback',
      annual_fee: 'Lifetime Free',
      rewards: ['1% cashback on all spends'],
    });
    const engine = new CreditCardDecisionEngine([feeCard, freeCard]);
    const spending: SpendingInput = {
      monthlySpending: 20000,
      groceries: 0, fuel: 0, travel: 0, onlineShopping: 0,
      dining: 0, utilities: 0, other: 20000,
    };
    const results = engine.getSpendingBasedRecommendations(spending, 2);
    const freeResult = results.find(r => r.card.annual_fee === 'Lifetime Free');
    const feeResult = results.find(r => r.card.annual_fee === '₹5,000');
    expect(freeResult!.score).toBeGreaterThan(feeResult!.score);
  });

  it('isLifetimeFree detects "Lifetime Free"', () => {
    const engine = new CreditCardDecisionEngine([cashbackCard]); // annual_fee: 'Lifetime Free'
    const results = engine.getSpendingBasedRecommendations({
      monthlySpending: 10000,
      groceries: 0, fuel: 0, travel: 0, onlineShopping: 0,
      dining: 0, utilities: 0, other: 10000,
    }, 1);
    expect(results[0].reasons).toContain('Lifetime free - no annual fee');
  });

  it('isLifetimeFree detects "LTF"', () => {
    const engine = new CreditCardDecisionEngine([lifetimeFreeRewardsCard]); // annual_fee: 'LTF'
    const results = engine.getLifestyleBasedRecommendations({
      lifestyle: 'all_rounder',
      frequency: 'medium',
    }, 1);
    expect(results[0].reasons).toContain('Lifetime free');
  });

  it('isLifetimeFree detects "0" as free', () => {
    const zeroFeeCard = makeCard({ annual_fee: '0', type: 'Cashback', description: '1% cashback' });
    const engine = new CreditCardDecisionEngine([zeroFeeCard]);
    const results = engine.getSpendingBasedRecommendations({
      monthlySpending: 10000,
      groceries: 0, fuel: 0, travel: 0, onlineShopping: 0,
      dining: 0, utilities: 0, other: 10000,
    }, 1);
    expect(results[0].reasons).toContain('Lifetime free - no annual fee');
  });
});

// ─── Edge Cases ─────────────────────────────────────────────────────────────

describe('edge cases', () => {
  it('handles empty card list gracefully', () => {
    const engine = new CreditCardDecisionEngine([]);
    const results = engine.getSpendingBasedRecommendations({
      monthlySpending: 10000,
      groceries: 0, fuel: 0, travel: 0, onlineShopping: 0,
      dining: 0, utilities: 0, other: 10000,
    }, 3);
    expect(results).toHaveLength(0);
  });

  it('handles zero monthly spending', () => {
    const engine = new CreditCardDecisionEngine(allCards);
    const results = engine.getSpendingBasedRecommendations({
      monthlySpending: 0,
      groceries: 0, fuel: 0, travel: 0, onlineShopping: 0,
      dining: 0, utilities: 0, other: 0,
    }, 3);
    results.forEach(r => {
      expect(r.score).toBeGreaterThanOrEqual(0);
    });
  });

  it('limit larger than card count returns all cards', () => {
    const engine = new CreditCardDecisionEngine([cashbackCard, travelCard]);
    const results = engine.getSpendingBasedRecommendations({
      monthlySpending: 10000,
      groceries: 0, fuel: 0, travel: 0, onlineShopping: 0,
      dining: 0, utilities: 0, other: 10000,
    }, 10);
    expect(results).toHaveLength(2);
  });

  it('card without min_income does not crash eligibility check', () => {
    const card = makeCard({ min_income: undefined });
    const engine = new CreditCardDecisionEngine([card]);
    expect(() => {
      engine.checkEligibility(card, {
        monthlyIncome: 30000,
        employmentStatus: 'salaried',
      });
    }).not.toThrow();
  });

  it('card without annual_fee does not crash', () => {
    const card = makeCard({ annual_fee: '' });
    const engine = new CreditCardDecisionEngine([card]);
    const results = engine.getSpendingBasedRecommendations({
      monthlySpending: 10000,
      groceries: 0, fuel: 0, travel: 0, onlineShopping: 0,
      dining: 0, utilities: 0, other: 10000,
    }, 1);
    expect(results).toHaveLength(1);
  });
});
