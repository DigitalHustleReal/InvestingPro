/**
 * Smart Comparison Engine
 * Advanced algorithms for product comparison and user matching
 *
 * Features:
 * 1. Break-Even Calculator - Is a premium card worth it?
 * 2. Approval Probability - Detailed approval odds
 * 3. Card Combo Optimizer - Best card combinations
 * 4. Decision Matrix - Visual comparison data
 * 5. What-If Simulator - Scenario testing
 */

import { CreditCard } from "@/types/credit-card";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface UserSpendingProfile {
  monthlyIncome: number;
  totalMonthlySpending: number;
  categories: {
    online: number;
    travel: number;
    dining: number;
    groceries: number;
    fuel: number;
    utilities: number;
    entertainment: number;
    other: number;
  };
  creditScore?: number;
  existingCards: number;
  employmentType: "salaried" | "self_employed" | "business" | "student";
  age?: number;
  city?: "metro" | "tier1" | "tier2" | "other";
}

export interface BreakEvenResult {
  card: CreditCard;
  annualFee: number;
  estimatedAnnualRewards: number;
  netBenefit: number;
  breakEvenMonths: number;
  isWorthIt: boolean;
  rewardBreakdown: {
    category: string;
    spending: number;
    rewardRate: number;
    rewards: number;
  }[];
  comparisonWithFreeCard: {
    freeCardRewards: number;
    premiumAdvantage: number;
    recommendation: string;
  };
  verdict: string;
}

export interface ApprovalProbabilityResult {
  card: CreditCard;
  overallProbability: number;
  confidenceLevel: "high" | "medium" | "low";
  factors: ApprovalFactor[];
  recommendations: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface ApprovalFactor {
  name: string;
  status: "positive" | "neutral" | "negative";
  impact: number; // -20 to +20
  currentValue: string;
  requiredValue: string;
  suggestion?: string;
}

export interface CardComboResult {
  cards: CreditCard[];
  totalAnnualValue: number;
  usageStrategy: CardUsageStrategy[];
  vsingleCardValue: number;
  additionalValue: number;
  complexity: "simple" | "moderate" | "complex";
  recommendation: string;
}

export interface CardUsageStrategy {
  card: CreditCard;
  useFor: string[];
  estimatedAnnualRewards: number;
  priority: "primary" | "secondary" | "tertiary";
}

export interface DecisionMatrixData {
  cards: CreditCard[];
  dimensions: MatrixDimension[];
  bestFor: { [dimension: string]: string }; // dimension -> card id
  userBestMatch?: string;
}

export interface MatrixDimension {
  name: string;
  key: string;
  scores: { [cardId: string]: number }; // 0-100
  weight: number;
}

export interface WhatIfScenario {
  type:
    | "spending_change"
    | "income_change"
    | "credit_score_change"
    | "close_card"
    | "new_card";
  change: any;
}

export interface WhatIfResult {
  scenario: WhatIfScenario;
  currentState: any;
  projectedState: any;
  impact: string;
  recommendation: string;
  warnings: string[];
}

// ============================================
// 1. BREAK-EVEN CALCULATOR
// ============================================

export class BreakEvenCalculator {
  /**
   * Calculate if a premium card is worth it based on user's spending
   */
  static calculate(
    card: CreditCard,
    profile: UserSpendingProfile,
  ): BreakEvenResult {
    const annualFee = this.parseAnnualFee(card);
    const rewardBreakdown = this.calculateRewardBreakdown(card, profile);
    const estimatedAnnualRewards = rewardBreakdown.reduce(
      (sum, r) => sum + r.rewards,
      0,
    );

    // Add additional benefits value (lounge access, insurance, etc.)
    const additionalBenefitsValue = this.estimateAdditionalBenefits(
      card,
      profile,
    );
    const totalValue = estimatedAnnualRewards + additionalBenefitsValue;

    const netBenefit = totalValue - annualFee;
    const breakEvenMonths =
      annualFee > 0 ? Math.ceil(annualFee / (totalValue / 12)) : 0;

    // Compare with a typical lifetime free card (1% cashback)
    const freeCardRewards = profile.totalMonthlySpending * 12 * 0.01;
    const premiumAdvantage = totalValue - freeCardRewards;

    const isWorthIt = netBenefit > 0 && premiumAdvantage > annualFee * 0.5;

    let verdict: string;
    if (annualFee === 0) {
      verdict = "This is a lifetime free card - no break-even needed!";
    } else if (netBenefit > annualFee) {
      verdict = `Excellent choice! You'll earn ₹${Math.round(netBenefit).toLocaleString()} more than the annual fee.`;
    } else if (netBenefit > 0) {
      verdict = `Worth it. Net benefit of ₹${Math.round(netBenefit).toLocaleString()}/year after fee.`;
    } else if (netBenefit > -annualFee * 0.5) {
      verdict = `Borderline. Consider if premium features (lounge, insurance) matter to you.`;
    } else {
      verdict = `Not recommended for your spending pattern. A free card would serve you better.`;
    }

    let comparisonRecommendation: string;
    if (premiumAdvantage > annualFee) {
      comparisonRecommendation = `This premium card saves you ₹${Math.round(premiumAdvantage - annualFee).toLocaleString()}/year vs a free card.`;
    } else if (premiumAdvantage > 0) {
      comparisonRecommendation = `Premium card gives ₹${Math.round(premiumAdvantage).toLocaleString()} more rewards, but doesn't fully cover the ₹${annualFee.toLocaleString()} fee.`;
    } else {
      comparisonRecommendation = `A lifetime free card would give you similar or better value.`;
    }

    return {
      card,
      annualFee,
      estimatedAnnualRewards: Math.round(totalValue),
      netBenefit: Math.round(netBenefit),
      breakEvenMonths,
      isWorthIt,
      rewardBreakdown,
      comparisonWithFreeCard: {
        freeCardRewards: Math.round(freeCardRewards),
        premiumAdvantage: Math.round(premiumAdvantage),
        recommendation: comparisonRecommendation,
      },
      verdict,
    };
  }

  private static parseAnnualFee(card: CreditCard): number {
    if (!card.annual_fee) return 0;
    const feeStr = String(card.annual_fee).toLowerCase();
    if (feeStr.includes("free") || feeStr.includes("nil") || feeStr === "0")
      return 0;
    const match = feeStr.match(/₹?\s*(\d+(?:,\d+)?)/);
    return match ? parseFloat(match[1].replace(/,/g, "")) : 0;
  }

  private static calculateRewardBreakdown(
    card: CreditCard,
    profile: UserSpendingProfile,
  ): BreakEvenResult["rewardBreakdown"] {
    const breakdown: BreakEvenResult["rewardBreakdown"] = [];
    const cardType = (card.type || "").toLowerCase();

    // Define reward rates based on card type and category
    const rewardRates = this.getRewardRates(card, cardType);

    const categories = [
      { key: "online", name: "Online Shopping", rate: rewardRates.online },
      { key: "travel", name: "Travel", rate: rewardRates.travel },
      { key: "dining", name: "Dining", rate: rewardRates.dining },
      { key: "groceries", name: "Groceries", rate: rewardRates.groceries },
      { key: "fuel", name: "Fuel", rate: rewardRates.fuel },
      { key: "utilities", name: "Utilities", rate: rewardRates.utilities },
      {
        key: "entertainment",
        name: "Entertainment",
        rate: rewardRates.entertainment,
      },
      { key: "other", name: "Other Spending", rate: rewardRates.other },
    ];

    for (const cat of categories) {
      const spending =
        profile.categories[cat.key as keyof typeof profile.categories] * 12;
      if (spending > 0) {
        breakdown.push({
          category: cat.name,
          spending,
          rewardRate: cat.rate,
          rewards: Math.round((spending * cat.rate) / 100),
        });
      }
    }

    return breakdown;
  }

  private static getRewardRates(
    card: CreditCard,
    cardType: string,
  ): Record<string, number> {
    // Base rates
    let rates = {
      online: 1,
      travel: 1,
      dining: 1,
      groceries: 1,
      fuel: 1,
      utilities: 0.5,
      entertainment: 1,
      other: 0.5,
    };

    // Adjust based on card type
    if (cardType.includes("travel") || cardType.includes("premium")) {
      rates.travel = 5;
      rates.dining = 2;
    } else if (cardType.includes("shopping") || cardType.includes("cashback")) {
      rates.online = 5;
      rates.groceries = 2;
    } else if (cardType.includes("fuel")) {
      rates.fuel = 5;
    } else if (cardType.includes("rewards")) {
      rates = { ...rates, online: 2, travel: 2, dining: 2 };
    }

    // Check card description/rewards for specific rates
    const cardText =
      `${card.rewards?.join(" ")} ${card.description || ""}`.toLowerCase();

    const rateMatch = cardText.match(
      /(\d+(?:\.\d+)?)\s*%?\s*(?:cashback|rewards?)/,
    );
    if (rateMatch) {
      const extractedRate = parseFloat(rateMatch[1]);
      if (extractedRate > 1) {
        rates.online = Math.max(rates.online, extractedRate);
      }
    }

    return rates;
  }

  private static estimateAdditionalBenefits(
    card: CreditCard,
    profile: UserSpendingProfile,
  ): number {
    let value = 0;

    // Lounge access value
    if (card.loungeAccess) {
      const loungeText = card.loungeAccess.toLowerCase();
      if (loungeText.includes("unlimited")) {
        value += profile.categories.travel > 5000 ? 12000 : 4000; // ₹1000/visit estimate
      } else {
        const countMatch = loungeText.match(/(\d+)/);
        if (countMatch) {
          const visits = parseInt(countMatch[1]);
          value += visits * 1000; // ₹1000/visit
        }
      }
    }

    // Welcome bonus (amortized over 1 year)
    if (card.welcomeBonus) {
      const bonusMatch = card.welcomeBonus.match(/₹?\s*(\d+(?:,\d+)?)/);
      if (bonusMatch) {
        value += parseFloat(bonusMatch[1].replace(/,/g, ""));
      }
    }

    return value;
  }
}

// ============================================
// 2. APPROVAL PROBABILITY CALCULATOR
// ============================================

export class ApprovalProbabilityCalculator {
  /**
   * Calculate detailed approval probability with factors
   */
  static calculate(
    card: CreditCard,
    profile: UserSpendingProfile,
  ): ApprovalProbabilityResult {
    const factors: ApprovalFactor[] = [];
    let baseProbability = 50;

    // 1. Income Assessment
    const minIncome = this.parseMinIncome(card);
    const incomeFactor = this.assessIncome(profile.monthlyIncome, minIncome);
    factors.push(incomeFactor);
    baseProbability += incomeFactor.impact;

    // 2. Credit Score Assessment
    const minCreditScore = card.minCreditScore || 700;
    const creditFactor = this.assessCreditScore(
      profile.creditScore,
      minCreditScore,
    );
    factors.push(creditFactor);
    baseProbability += creditFactor.impact;

    // 3. Employment Type Assessment
    const employmentFactor = this.assessEmployment(
      profile.employmentType,
      card,
    );
    factors.push(employmentFactor);
    baseProbability += employmentFactor.impact;

    // 4. Existing Cards Assessment
    const cardsFactor = this.assessExistingCards(profile.existingCards);
    factors.push(cardsFactor);
    baseProbability += cardsFactor.impact;

    // 5. Age Assessment
    if (profile.age) {
      const ageFactor = this.assessAge(profile.age, card);
      factors.push(ageFactor);
      baseProbability += ageFactor.impact;
    }

    // 6. Card Type Assessment (premium cards are harder)
    const cardTypeFactor = this.assessCardType(card);
    factors.push(cardTypeFactor);
    baseProbability += cardTypeFactor.impact;

    // 7. Location Assessment
    if (profile.city) {
      const locationFactor = this.assessLocation(profile.city);
      factors.push(locationFactor);
      baseProbability += locationFactor.impact;
    }

    // Normalize probability
    const overallProbability = Math.max(5, Math.min(95, baseProbability));

    // Determine confidence level
    let confidenceLevel: "high" | "medium" | "low" = "medium";
    const knownFactors = factors.filter((f) => f.status !== "neutral").length;
    if (knownFactors >= 5 && profile.creditScore) {
      confidenceLevel = "high";
    } else if (knownFactors < 3) {
      confidenceLevel = "low";
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      factors,
      overallProbability,
    );

    // Determine risk level
    let riskLevel: "low" | "medium" | "high" = "medium";
    if (overallProbability >= 70) riskLevel = "low";
    else if (overallProbability < 40) riskLevel = "high";

    return {
      card,
      overallProbability: Math.round(overallProbability),
      confidenceLevel,
      factors,
      recommendations,
      riskLevel,
    };
  }

  private static parseMinIncome(card: CreditCard): number {
    if (!card.min_income) return 25000; // Default assumption
    const incomeStr = String(card.min_income).toLowerCase();

    // Try monthly
    let match = incomeStr.match(
      /₹?\s*(\d+(?:,\d+)?)\s*(?:\/?\s*(?:month|monthly|per month|pm))/,
    );
    if (match) return parseFloat(match[1].replace(/,/g, ""));

    // Try annual
    match = incomeStr.match(
      /₹?\s*(\d+(?:,\d+)?)\s*(?:\/?\s*(?:year|annual|pa|per annum))/,
    );
    if (match) return parseFloat(match[1].replace(/,/g, "")) / 12;

    // Just a number
    match = incomeStr.match(/₹?\s*(\d+(?:,\d+)?)/);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ""));
      return value > 100000 ? value / 12 : value; // Assume annual if large
    }

    return 25000;
  }

  private static assessIncome(
    userIncome: number,
    minIncome: number,
  ): ApprovalFactor {
    const ratio = userIncome / minIncome;

    if (ratio >= 2) {
      return {
        name: "Monthly Income",
        status: "positive",
        impact: 20,
        currentValue: `₹${userIncome.toLocaleString()}`,
        requiredValue: `₹${minIncome.toLocaleString()}+`,
      };
    } else if (ratio >= 1.5) {
      return {
        name: "Monthly Income",
        status: "positive",
        impact: 15,
        currentValue: `₹${userIncome.toLocaleString()}`,
        requiredValue: `₹${minIncome.toLocaleString()}+`,
      };
    } else if (ratio >= 1) {
      return {
        name: "Monthly Income",
        status: "neutral",
        impact: 5,
        currentValue: `₹${userIncome.toLocaleString()}`,
        requiredValue: `₹${minIncome.toLocaleString()}+`,
        suggestion: "Just meets minimum. Consider income proof documents.",
      };
    } else {
      return {
        name: "Monthly Income",
        status: "negative",
        impact: -20,
        currentValue: `₹${userIncome.toLocaleString()}`,
        requiredValue: `₹${minIncome.toLocaleString()}+`,
        suggestion: `Income below minimum. Consider cards with ₹${Math.round(userIncome * 0.8).toLocaleString()} requirement.`,
      };
    }
  }

  private static assessCreditScore(
    userScore: number | undefined,
    minScore: number,
  ): ApprovalFactor {
    if (!userScore) {
      return {
        name: "Credit Score",
        status: "neutral",
        impact: 0,
        currentValue: "Unknown",
        requiredValue: `${minScore}+`,
        suggestion:
          "Check your credit score on CIBIL or Experian for accurate assessment.",
      };
    }

    if (userScore >= 750) {
      return {
        name: "Credit Score",
        status: "positive",
        impact: 20,
        currentValue: `${userScore}`,
        requiredValue: `${minScore}+`,
      };
    } else if (userScore >= 700) {
      return {
        name: "Credit Score",
        status: "positive",
        impact: 10,
        currentValue: `${userScore}`,
        requiredValue: `${minScore}+`,
      };
    } else if (userScore >= minScore) {
      return {
        name: "Credit Score",
        status: "neutral",
        impact: 0,
        currentValue: `${userScore}`,
        requiredValue: `${minScore}+`,
        suggestion:
          "Score is acceptable but improving to 750+ increases chances.",
      };
    } else {
      return {
        name: "Credit Score",
        status: "negative",
        impact: -25,
        currentValue: `${userScore}`,
        requiredValue: `${minScore}+`,
        suggestion: `Score below minimum. Work on improving credit score before applying.`,
      };
    }
  }

  private static assessEmployment(
    type: UserSpendingProfile["employmentType"],
    card: CreditCard,
  ): ApprovalFactor {
    switch (type) {
      case "salaried":
        return {
          name: "Employment Type",
          status: "positive",
          impact: 10,
          currentValue: "Salaried",
          requiredValue: "Any",
        };
      case "business":
        return {
          name: "Employment Type",
          status: "neutral",
          impact: 5,
          currentValue: "Business Owner",
          requiredValue: "Any",
          suggestion: "Keep ITR and business proof ready.",
        };
      case "self_employed":
        return {
          name: "Employment Type",
          status: "neutral",
          impact: 0,
          currentValue: "Self Employed",
          requiredValue: "Any",
          suggestion: "Bank statements and ITR will be important.",
        };
      case "student":
        return {
          name: "Employment Type",
          status: "negative",
          impact: -15,
          currentValue: "Student",
          requiredValue: "Income Earner",
          suggestion: "Consider student cards or add-on cards.",
        };
      default:
        return {
          name: "Employment Type",
          status: "neutral",
          impact: 0,
          currentValue: type,
          requiredValue: "Any",
        };
    }
  }

  private static assessExistingCards(count: number): ApprovalFactor {
    if (count === 0) {
      return {
        name: "Existing Credit Cards",
        status: "neutral",
        impact: -5,
        currentValue: "0 cards",
        requiredValue: "N/A",
        suggestion:
          "First card applicants may need stronger income/employment proof.",
      };
    } else if (count <= 2) {
      return {
        name: "Existing Credit Cards",
        status: "positive",
        impact: 5,
        currentValue: `${count} card(s)`,
        requiredValue: "N/A",
      };
    } else if (count <= 5) {
      return {
        name: "Existing Credit Cards",
        status: "neutral",
        impact: 0,
        currentValue: `${count} cards`,
        requiredValue: "N/A",
      };
    } else {
      return {
        name: "Existing Credit Cards",
        status: "negative",
        impact: -10,
        currentValue: `${count} cards`,
        requiredValue: "N/A",
        suggestion:
          "High card count may raise concerns. Consider consolidating.",
      };
    }
  }

  private static assessAge(age: number, card: CreditCard): ApprovalFactor {
    if (age < 21) {
      return {
        name: "Age",
        status: "negative",
        impact: -10,
        currentValue: `${age} years`,
        requiredValue: "21+",
        suggestion: "Most cards require age 21+. Consider student cards.",
      };
    } else if (age >= 21 && age <= 25) {
      return {
        name: "Age",
        status: "neutral",
        impact: 0,
        currentValue: `${age} years`,
        requiredValue: "21+",
      };
    } else if (age >= 26 && age <= 55) {
      return {
        name: "Age",
        status: "positive",
        impact: 5,
        currentValue: `${age} years`,
        requiredValue: "21+",
      };
    } else {
      return {
        name: "Age",
        status: "neutral",
        impact: 0,
        currentValue: `${age} years`,
        requiredValue: "21-60",
      };
    }
  }

  private static assessCardType(card: CreditCard): ApprovalFactor {
    const type = (card.type || "").toLowerCase();

    if (type.includes("premium") || type.includes("super premium")) {
      return {
        name: "Card Category",
        status: "negative",
        impact: -10,
        currentValue: "Premium Card",
        requiredValue: "Higher standards",
        suggestion:
          "Premium cards have stricter criteria. Ensure strong profile.",
      };
    } else if (type.includes("lifetime free") || type.includes("basic")) {
      return {
        name: "Card Category",
        status: "positive",
        impact: 5,
        currentValue: "Entry Level",
        requiredValue: "Standard",
      };
    }

    return {
      name: "Card Category",
      status: "neutral",
      impact: 0,
      currentValue: type || "Standard",
      requiredValue: "Standard",
    };
  }

  private static assessLocation(
    city: UserSpendingProfile["city"],
  ): ApprovalFactor {
    switch (city) {
      case "metro":
        return {
          name: "Location",
          status: "positive",
          impact: 5,
          currentValue: "Metro City",
          requiredValue: "Any",
        };
      case "tier1":
        return {
          name: "Location",
          status: "positive",
          impact: 3,
          currentValue: "Tier-1 City",
          requiredValue: "Any",
        };
      default:
        return {
          name: "Location",
          status: "neutral",
          impact: 0,
          currentValue: city || "Other",
          requiredValue: "Any",
        };
    }
  }

  private static generateRecommendations(
    factors: ApprovalFactor[],
    probability: number,
  ): string[] {
    const recommendations: string[] = [];

    // Add factor-specific suggestions
    for (const factor of factors) {
      if (factor.suggestion && factor.status === "negative") {
        recommendations.push(factor.suggestion);
      }
    }

    // General recommendations based on probability
    if (probability < 40) {
      recommendations.push(
        "Consider applying for an entry-level or secured card first.",
      );
      recommendations.push(
        "Build credit history for 6-12 months before reapplying.",
      );
    } else if (probability < 60) {
      recommendations.push("Apply through pre-approved offers if available.");
      recommendations.push(
        "Have all documents ready: salary slips, bank statements, ID proof.",
      );
    } else if (probability >= 70) {
      recommendations.push("Good chances! Apply online for faster processing.");
    }

    return recommendations.slice(0, 4);
  }
}

// ============================================
// 3. CARD COMBO OPTIMIZER
// ============================================

export class CardComboOptimizer {
  /**
   * Find the optimal combination of cards for maximum rewards
   */
  static optimize(
    cards: CreditCard[],
    profile: UserSpendingProfile,
    maxCards: number = 3,
  ): CardComboResult {
    // Find best card for each spending category
    const categoryBestCards = this.findCategoryBestCards(cards, profile);

    // Select top cards (deduplicated)
    const selectedCards = this.selectOptimalCombo(categoryBestCards, maxCards);

    // Calculate usage strategy
    const usageStrategy = this.createUsageStrategy(selectedCards, profile);

    // Calculate total value
    const totalAnnualValue = usageStrategy.reduce(
      (sum, s) => sum + s.estimatedAnnualRewards,
      0,
    );

    // Compare with single best card
    const singleCardResult = BreakEvenCalculator.calculate(cards[0], profile);
    const vsingleCardValue = singleCardResult.estimatedAnnualRewards;

    const additionalValue = totalAnnualValue - vsingleCardValue;

    // Determine complexity
    let complexity: "simple" | "moderate" | "complex" = "simple";
    if (selectedCards.length === 2) complexity = "moderate";
    else if (selectedCards.length >= 3) complexity = "complex";

    const recommendation =
      additionalValue > 5000
        ? `This combo earns ₹${Math.round(additionalValue).toLocaleString()} more annually than using a single card.`
        : additionalValue > 0
          ? `Marginal benefit of ₹${Math.round(additionalValue).toLocaleString()}/year. Consider if complexity is worth it.`
          : "A single well-chosen card may be simpler with similar rewards.";

    return {
      cards: selectedCards,
      totalAnnualValue: Math.round(totalAnnualValue),
      usageStrategy,
      vsingleCardValue: Math.round(vsingleCardValue),
      additionalValue: Math.round(additionalValue),
      complexity,
      recommendation,
    };
  }

  private static findCategoryBestCards(
    cards: CreditCard[],
    profile: UserSpendingProfile,
  ): Map<string, { card: CreditCard; value: number }> {
    const categoryBest = new Map<string, { card: CreditCard; value: number }>();

    const categories: Array<{
      key: keyof typeof profile.categories;
      name: string;
    }> = [
      { key: "online", name: "Online Shopping" },
      { key: "travel", name: "Travel" },
      { key: "dining", name: "Dining" },
      { key: "groceries", name: "Groceries" },
      { key: "fuel", name: "Fuel" },
    ];

    for (const cat of categories) {
      const spending = profile.categories[cat.key];
      if (spending < 1000) continue; // Skip negligible categories

      let bestCard: CreditCard | null = null;
      let bestValue = 0;

      for (const card of cards) {
        const rewardRate = this.getCardRewardRateForCategory(card, cat.key);
        const annualValue = (spending * 12 * rewardRate) / 100;

        if (annualValue > bestValue) {
          bestValue = annualValue;
          bestCard = card;
        }
      }

      if (bestCard) {
        categoryBest.set(cat.name, { card: bestCard, value: bestValue });
      }
    }

    return categoryBest;
  }

  private static getCardRewardRateForCategory(
    card: CreditCard,
    category: string,
  ): number {
    const type = (card.type || "").toLowerCase();

    // Simple heuristic based on card type
    const rates: Record<string, Record<string, number>> = {
      travel: { online: 1, travel: 5, dining: 2, groceries: 1, fuel: 1 },
      shopping: { online: 5, travel: 1, dining: 2, groceries: 3, fuel: 1 },
      cashback: { online: 3, travel: 1, dining: 2, groceries: 2, fuel: 2 },
      fuel: { online: 1, travel: 1, dining: 1, groceries: 1, fuel: 5 },
      rewards: { online: 2, travel: 2, dining: 2, groceries: 2, fuel: 2 },
    };

    // Find matching card type
    for (const [cardType, categoryRates] of Object.entries(rates)) {
      if (type.includes(cardType)) {
        return categoryRates[category] || 1;
      }
    }

    return 1; // Default 1% for unknown types
  }

  private static selectOptimalCombo(
    categoryBest: Map<string, { card: CreditCard; value: number }>,
    maxCards: number,
  ): CreditCard[] {
    // Create card -> total value map
    const cardValues = new Map<
      string,
      { card: CreditCard; totalValue: number; categories: string[] }
    >();

    for (const [category, { card, value }] of categoryBest) {
      const existing = cardValues.get(card.id);
      if (existing) {
        existing.totalValue += value;
        existing.categories.push(category);
      } else {
        cardValues.set(card.id, {
          card,
          totalValue: value,
          categories: [category],
        });
      }
    }

    // Sort by total value and pick top cards
    const sorted = Array.from(cardValues.values()).sort(
      (a, b) => b.totalValue - a.totalValue,
    );

    return sorted.slice(0, maxCards).map((v) => v.card);
  }

  private static createUsageStrategy(
    cards: CreditCard[],
    profile: UserSpendingProfile,
  ): CardUsageStrategy[] {
    const strategies: CardUsageStrategy[] = [];
    const assignedCategories = new Set<string>();

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const useFor: string[] = [];
      let estimatedRewards = 0;

      // Assign categories based on card strength
      const type = (card.type || "").toLowerCase();

      if (type.includes("travel") && !assignedCategories.has("travel")) {
        useFor.push("Travel bookings", "International transactions");
        estimatedRewards += profile.categories.travel * 12 * 0.05;
        assignedCategories.add("travel");
      }
      if (type.includes("shopping") && !assignedCategories.has("online")) {
        useFor.push("Amazon", "Flipkart", "Online shopping");
        estimatedRewards += profile.categories.online * 12 * 0.05;
        assignedCategories.add("online");
      }
      if (type.includes("fuel") && !assignedCategories.has("fuel")) {
        useFor.push("Petrol pumps", "Fuel stations");
        estimatedRewards += profile.categories.fuel * 12 * 0.05;
        assignedCategories.add("fuel");
      }

      // If no specific match, assign general categories
      if (useFor.length === 0) {
        if (!assignedCategories.has("dining")) {
          useFor.push("Dining", "Restaurants");
          estimatedRewards += profile.categories.dining * 12 * 0.02;
          assignedCategories.add("dining");
        }
        if (!assignedCategories.has("groceries")) {
          useFor.push("Groceries", "Supermarkets");
          estimatedRewards += profile.categories.groceries * 12 * 0.02;
          assignedCategories.add("groceries");
        }
      }

      strategies.push({
        card,
        useFor,
        estimatedAnnualRewards: Math.round(estimatedRewards),
        priority: i === 0 ? "primary" : i === 1 ? "secondary" : "tertiary",
      });
    }

    return strategies;
  }
}

// ============================================
// 4. DECISION MATRIX GENERATOR
// ============================================

export class DecisionMatrixGenerator {
  /**
   * Generate comparison matrix data for visualization
   */
  static generate(
    cards: CreditCard[],
    profile?: UserSpendingProfile,
  ): DecisionMatrixData {
    const dimensions: MatrixDimension[] = [
      this.createDimension(cards, "travel", "Travel Benefits", 0.25),
      this.createDimension(cards, "shopping", "Shopping Rewards", 0.25),
      this.createDimension(cards, "cost", "Low Cost", 0.2),
      this.createDimension(cards, "premium", "Premium Features", 0.15),
      this.createDimension(cards, "eligibility", "Easy Eligibility", 0.15),
    ];

    // Find best card for each dimension
    const bestFor: { [dimension: string]: string } = {};
    for (const dim of dimensions) {
      let bestCardId = "";
      let bestScore = 0;
      for (const [cardId, score] of Object.entries(dim.scores)) {
        if (score > bestScore) {
          bestScore = score;
          bestCardId = cardId;
        }
      }
      bestFor[dim.key] = bestCardId;
    }

    // Find user's best match if profile provided
    let userBestMatch: string | undefined;
    if (profile) {
      userBestMatch = this.findUserBestMatch(cards, dimensions, profile);
    }

    return {
      cards,
      dimensions,
      bestFor,
      userBestMatch,
    };
  }

  private static createDimension(
    cards: CreditCard[],
    key: string,
    name: string,
    weight: number,
  ): MatrixDimension {
    const scores: { [cardId: string]: number } = {};

    for (const card of cards) {
      scores[card.id] = this.calculateDimensionScore(card, key);
    }

    return { name, key, scores, weight };
  }

  private static calculateDimensionScore(
    card: CreditCard,
    dimension: string,
  ): number {
    const type = (card.type || "").toLowerCase();
    const features = card.features || [];
    const featuresText = features.join(" ").toLowerCase();

    switch (dimension) {
      case "travel":
        let travelScore = 30; // Base
        if (type.includes("travel")) travelScore += 40;
        if (type.includes("premium")) travelScore += 20;
        if (
          card.loungeAccess &&
          !card.loungeAccess.toLowerCase().includes("nil")
        ) {
          travelScore += 30;
        }
        if (
          featuresText.includes("forex") ||
          featuresText.includes("international")
        ) {
          travelScore += 10;
        }
        return Math.min(100, travelScore);

      case "shopping":
        let shopScore = 30;
        if (type.includes("shopping") || type.includes("cashback"))
          shopScore += 40;
        if (
          featuresText.includes("amazon") ||
          featuresText.includes("flipkart")
        ) {
          shopScore += 20;
        }
        if (
          featuresText.includes("emi") ||
          featuresText.includes("no cost emi")
        ) {
          shopScore += 10;
        }
        return Math.min(100, shopScore);

      case "cost":
        const annualFee = this.parseAnnualFee(card);
        if (annualFee === 0) return 100;
        if (annualFee <= 500) return 80;
        if (annualFee <= 1500) return 60;
        if (annualFee <= 5000) return 40;
        return 20;

      case "premium":
        let premiumScore = 20;
        if (type.includes("premium") || type.includes("super premium"))
          premiumScore += 50;
        if (card.loungeAccess?.toLowerCase().includes("unlimited"))
          premiumScore += 20;
        if (featuresText.includes("concierge")) premiumScore += 10;
        if (
          featuresText.includes("insurance") ||
          featuresText.includes("cover")
        )
          premiumScore += 10;
        return Math.min(100, premiumScore);

      case "eligibility":
        let eligScore = 50;
        const minIncome = this.parseMinIncome(card);
        if (minIncome <= 20000) eligScore += 30;
        else if (minIncome <= 35000) eligScore += 15;
        else if (minIncome >= 75000) eligScore -= 20;

        if (!card.minCreditScore || card.minCreditScore <= 650) eligScore += 20;
        return Math.max(10, Math.min(100, eligScore));

      default:
        return 50;
    }
  }

  private static parseAnnualFee(card: CreditCard): number {
    if (!card.annual_fee) return 0;
    const feeStr = String(card.annual_fee).toLowerCase();
    if (feeStr.includes("free") || feeStr.includes("nil") || feeStr === "0")
      return 0;
    const match = feeStr.match(/₹?\s*(\d+(?:,\d+)?)/);
    return match ? parseFloat(match[1].replace(/,/g, "")) : 0;
  }

  private static parseMinIncome(card: CreditCard): number {
    if (!card.min_income) return 25000;
    const match = card.min_income.match(/(\d+(?:,\d+)?)/);
    return match ? parseFloat(match[1].replace(/,/g, "")) : 25000;
  }

  private static findUserBestMatch(
    cards: CreditCard[],
    dimensions: MatrixDimension[],
    profile: UserSpendingProfile,
  ): string {
    // Create user weight profile based on spending
    const totalSpending = Object.values(profile.categories).reduce(
      (a, b) => a + b,
      0,
    );
    const userWeights: Record<string, number> = {
      travel: profile.categories.travel / totalSpending,
      shopping:
        (profile.categories.online + profile.categories.groceries) /
        totalSpending,
      cost: profile.monthlyIncome < 50000 ? 0.3 : 0.1,
      premium: profile.monthlyIncome > 100000 ? 0.2 : 0.05,
      eligibility: 0.15,
    };

    let bestCardId = "";
    let bestScore = 0;

    for (const card of cards) {
      let cardScore = 0;
      for (const dim of dimensions) {
        const dimScore = dim.scores[card.id] || 0;
        const userWeight = userWeights[dim.key] || dim.weight;
        cardScore += dimScore * userWeight;
      }

      if (cardScore > bestScore) {
        bestScore = cardScore;
        bestCardId = card.id;
      }
    }

    return bestCardId;
  }
}

// ============================================
// 5. WHAT-IF SIMULATOR
// ============================================

export class WhatIfSimulator {
  /**
   * Simulate different scenarios and their impact
   */
  static simulate(
    scenario: WhatIfScenario,
    cards: CreditCard[],
    currentProfile: UserSpendingProfile,
  ): WhatIfResult {
    const modifiedProfile = {
      ...currentProfile,
      categories: { ...currentProfile.categories },
    };
    const warnings: string[] = [];
    let impact = "";
    let recommendation = "";

    switch (scenario.type) {
      case "spending_change":
        return this.simulateSpendingChange(
          scenario,
          cards,
          currentProfile,
          modifiedProfile,
        );

      case "income_change":
        return this.simulateIncomeChange(
          scenario,
          cards,
          currentProfile,
          modifiedProfile,
        );

      case "credit_score_change":
        return this.simulateCreditScoreChange(
          scenario,
          cards,
          currentProfile,
          modifiedProfile,
        );

      case "close_card":
        return this.simulateCloseCard(scenario, currentProfile);

      case "new_card":
        return this.simulateNewCard(scenario, cards, currentProfile);

      default:
        return {
          scenario,
          currentState: currentProfile,
          projectedState: modifiedProfile,
          impact: "Unknown scenario type",
          recommendation: "Please select a valid scenario.",
          warnings: ["Invalid scenario type"],
        };
    }
  }

  private static simulateSpendingChange(
    scenario: WhatIfScenario,
    cards: CreditCard[],
    currentProfile: UserSpendingProfile,
    modifiedProfile: UserSpendingProfile,
  ): WhatIfResult {
    const { category, newAmount } = scenario.change as {
      category: string;
      newAmount: number;
    };
    const currentAmount =
      currentProfile.categories[
        category as keyof typeof currentProfile.categories
      ];

    modifiedProfile.categories[
      category as keyof typeof modifiedProfile.categories
    ] = newAmount;
    modifiedProfile.totalMonthlySpending += newAmount - currentAmount;

    // Find best card for current vs modified
    const currentBest = this.findBestCard(cards, currentProfile);
    const modifiedBest = this.findBestCard(cards, modifiedProfile);

    const cardChanged = currentBest.id !== modifiedBest.id;

    let impact: string;
    let recommendation: string;
    const warnings: string[] = [];

    if (cardChanged) {
      impact = `Your best card changes from ${currentBest.name} to ${modifiedBest.name}`;
      recommendation = `Consider applying for ${modifiedBest.name} to maximize rewards on ${category}.`;
    } else {
      const currentRewards = BreakEvenCalculator.calculate(
        currentBest,
        currentProfile,
      ).estimatedAnnualRewards;
      const modifiedRewards = BreakEvenCalculator.calculate(
        currentBest,
        modifiedProfile,
      ).estimatedAnnualRewards;
      const diff = modifiedRewards - currentRewards;

      impact = `Your annual rewards ${diff >= 0 ? "increase" : "decrease"} by ₹${Math.abs(diff).toLocaleString()}`;
      recommendation =
        diff >= 0
          ? `Good change! Your current card ${currentBest.name} still serves you best.`
          : `Your rewards decrease. Consider if this spending change is necessary.`;
    }

    if (newAmount > currentProfile.monthlyIncome * 0.5) {
      warnings.push("New spending exceeds 50% of income. Review budget.");
    }

    return {
      scenario,
      currentState: { bestCard: currentBest.name, spending: currentAmount },
      projectedState: { bestCard: modifiedBest.name, spending: newAmount },
      impact,
      recommendation,
      warnings,
    };
  }

  private static simulateIncomeChange(
    scenario: WhatIfScenario,
    cards: CreditCard[],
    currentProfile: UserSpendingProfile,
    modifiedProfile: UserSpendingProfile,
  ): WhatIfResult {
    const { newIncome } = scenario.change as { newIncome: number };
    modifiedProfile.monthlyIncome = newIncome;

    // Check which cards become available
    const currentlyEligible = cards.filter((c) => {
      const result = ApprovalProbabilityCalculator.calculate(c, currentProfile);
      return result.overallProbability >= 50;
    });

    const newlyEligible = cards.filter((c) => {
      const result = ApprovalProbabilityCalculator.calculate(
        c,
        modifiedProfile,
      );
      return result.overallProbability >= 50;
    });

    const newCards = newlyEligible.filter(
      (nc) => !currentlyEligible.find((cc) => cc.id === nc.id),
    );

    let impact: string;
    let recommendation: string;
    const warnings: string[] = [];

    if (newCards.length > 0) {
      impact = `${newCards.length} new premium cards become accessible: ${newCards
        .slice(0, 3)
        .map((c) => c.name)
        .join(", ")}`;
      recommendation = `You can now apply for higher-tier cards. Consider ${newCards[0]?.name} for better rewards.`;
    } else if (newIncome > currentProfile.monthlyIncome) {
      impact =
        "Income increase improves your approval odds for existing card options.";
      recommendation =
        "Your approval probability has improved across all cards.";
    } else {
      impact = "Some premium cards may become less accessible.";
      recommendation = "Focus on cards within your new income range.";
      warnings.push(
        "Lower income may affect credit limit on new applications.",
      );
    }

    return {
      scenario,
      currentState: {
        income: currentProfile.monthlyIncome,
        eligibleCards: currentlyEligible.length,
      },
      projectedState: {
        income: newIncome,
        eligibleCards: newlyEligible.length,
      },
      impact,
      recommendation,
      warnings,
    };
  }

  private static simulateCreditScoreChange(
    scenario: WhatIfScenario,
    cards: CreditCard[],
    currentProfile: UserSpendingProfile,
    modifiedProfile: UserSpendingProfile,
  ): WhatIfResult {
    const { newScore } = scenario.change as { newScore: number };
    modifiedProfile.creditScore = newScore;

    // Pick a premium card to check
    const premiumCard =
      cards.find((c) => (c.type || "").toLowerCase().includes("premium")) ||
      cards[0];

    const currentProb = ApprovalProbabilityCalculator.calculate(
      premiumCard,
      currentProfile,
    );
    const newProb = ApprovalProbabilityCalculator.calculate(
      premiumCard,
      modifiedProfile,
    );

    const probDiff =
      newProb.overallProbability - currentProb.overallProbability;

    let impact: string;
    let recommendation: string;
    const warnings: string[] = [];

    if (probDiff > 0) {
      impact = `Approval odds for ${premiumCard.name} increase from ${currentProb.overallProbability}% to ${newProb.overallProbability}%`;
      recommendation =
        newProb.overallProbability >= 70
          ? `Good score! You have strong approval chances for premium cards.`
          : `Score improving. Continue good credit habits for best approval odds.`;
    } else {
      impact = `Approval odds decrease by ${Math.abs(probDiff)}%`;
      recommendation = "Work on improving credit score before applying.";
      warnings.push(
        "Lower credit score significantly impacts premium card approval.",
      );
    }

    return {
      scenario,
      currentState: {
        creditScore: currentProfile.creditScore || "Unknown",
        approvalOdds: currentProb.overallProbability,
      },
      projectedState: {
        creditScore: newScore,
        approvalOdds: newProb.overallProbability,
      },
      impact,
      recommendation,
      warnings,
    };
  }

  private static simulateCloseCard(
    scenario: WhatIfScenario,
    currentProfile: UserSpendingProfile,
  ): WhatIfResult {
    const { cardAge } = scenario.change as { cardAge: number }; // in years

    const warnings: string[] = [];
    let impact: string;
    let recommendation: string;

    // Simulate credit score impact
    const estimatedScoreDrop = cardAge > 5 ? 25 : cardAge > 2 ? 15 : 10;

    impact = `Estimated credit score impact: -${estimatedScoreDrop} to -${estimatedScoreDrop + 10} points`;

    if (cardAge > 5) {
      warnings.push(
        "This is your oldest card. Closing it will significantly impact credit history length.",
      );
      recommendation =
        "NOT RECOMMENDED. Keep this card active even with minimal use.";
    } else if (cardAge > 2) {
      warnings.push("Closing this card will reduce your average account age.");
      recommendation =
        "Consider keeping the card. Use it once every few months to keep it active.";
    } else {
      recommendation =
        "Impact is minimal if you have other older cards. Safe to close if needed.";
    }

    return {
      scenario,
      currentState: { cardAge, existingCards: currentProfile.existingCards },
      projectedState: {
        existingCards: currentProfile.existingCards - 1,
        estimatedScoreChange: -estimatedScoreDrop,
      },
      impact,
      recommendation,
      warnings,
    };
  }

  private static simulateNewCard(
    scenario: WhatIfScenario,
    cards: CreditCard[],
    currentProfile: UserSpendingProfile,
  ): WhatIfResult {
    const { cardId } = scenario.change as { cardId: string };
    const card = cards.find((c) => c.id === cardId);

    if (!card) {
      return {
        scenario,
        currentState: {},
        projectedState: {},
        impact: "Card not found",
        recommendation: "Select a valid card.",
        warnings: ["Invalid card selection"],
      };
    }

    const approval = ApprovalProbabilityCalculator.calculate(
      card,
      currentProfile,
    );
    const breakEven = BreakEvenCalculator.calculate(card, currentProfile);

    const warnings: string[] = [];

    if (approval.overallProbability < 40) {
      warnings.push("Low approval probability. Consider alternatives.");
    }
    if (!breakEven.isWorthIt) {
      warnings.push(
        "Card may not provide positive ROI based on your spending.",
      );
    }
    if (currentProfile.existingCards >= 5) {
      warnings.push(
        "You have multiple cards. New application may face scrutiny.",
      );
    }

    const impact = `${card.name}: ${approval.overallProbability}% approval odds, ₹${breakEven.netBenefit.toLocaleString()}/year net benefit`;

    let recommendation: string;
    if (approval.overallProbability >= 60 && breakEven.isWorthIt) {
      recommendation = `Good choice! Apply for ${card.name}. Expected annual benefit: ₹${breakEven.netBenefit.toLocaleString()}`;
    } else if (approval.overallProbability >= 60) {
      recommendation = `High approval odds but limited value for your spending. Consider if features justify the card.`;
    } else {
      recommendation = `Low approval odds. Consider building credit or choosing an entry-level card first.`;
    }

    return {
      scenario,
      currentState: { existingCards: currentProfile.existingCards },
      projectedState: {
        newCard: card.name,
        approvalOdds: approval.overallProbability,
        annualBenefit: breakEven.netBenefit,
      },
      impact,
      recommendation,
      warnings,
    };
  }

  private static findBestCard(
    cards: CreditCard[],
    profile: UserSpendingProfile,
  ): CreditCard {
    let bestCard = cards[0];
    let bestValue = 0;

    for (const card of cards) {
      const result = BreakEvenCalculator.calculate(card, profile);
      if (result.netBenefit > bestValue) {
        bestValue = result.netBenefit;
        bestCard = card;
      }
    }

    return bestCard;
  }
}

// ============================================
// UNIFIED SMART COMPARISON API
// ============================================

export const SmartComparison = {
  calculateBreakEven: BreakEvenCalculator.calculate.bind(BreakEvenCalculator),
  calculateApprovalProbability: ApprovalProbabilityCalculator.calculate.bind(
    ApprovalProbabilityCalculator,
  ),
  optimizeCardCombo: CardComboOptimizer.optimize.bind(CardComboOptimizer),
  generateDecisionMatrix: DecisionMatrixGenerator.generate.bind(
    DecisionMatrixGenerator,
  ),
  simulateWhatIf: WhatIfSimulator.simulate.bind(WhatIfSimulator),
};

export default SmartComparison;
