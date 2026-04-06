"use client";

import React from "react";
import {
  CreditCardDecisionEngine,
  SpendingInput,
  CardRecommendation,
} from "@/lib/decision-engines/credit-card-engine";
import { CreditCard } from "@/types/credit-card";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import DecisionCTA from "@/components/common/DecisionCTA";
import ComplianceDisclaimer from "@/components/common/ComplianceDisclaimer";
import CategoryHero from "@/components/common/CategoryHero";
import { formatCurrency } from "@/lib/utils";
import SEOHead from "@/components/common/SEOHead";

interface SpendingPatternPageProps {
  category: string;
  categoryLabel: string;
  amount: number;
  spendingField: keyof SpendingInput;
  cards: any[];
}

export default function SpendingPatternPage({
  category,
  categoryLabel,
  amount,
  spendingField,
  cards,
}: SpendingPatternPageProps) {
  // Create spending input with the specific category amount
  const spendingInput: SpendingInput = {
    monthlySpending: amount,
    groceries: spendingField === "groceries" ? amount : 0,
    fuel: spendingField === "fuel" ? amount : 0,
    travel: spendingField === "travel" ? amount : 0,
    onlineShopping: spendingField === "onlineShopping" ? amount : 0,
    dining: spendingField === "dining" ? amount : 0,
    utilities: spendingField === "utilities" ? amount : 0,
    other: spendingField === "other" ? amount : 0,
  };

  const engine =
    cards.length > 0
      ? new CreditCardDecisionEngine(cards as CreditCard[])
      : null;
  const recommendations: CardRecommendation[] = engine
    ? engine.getSpendingBasedRecommendations(spendingInput, 5)
    : [];

  const formattedAmount = formatCurrency(amount);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEOHead
        title={`Best Credit Cards for ${categoryLabel} - Spend ${formattedAmount}/Month | InvestingPro`}
        description={`Find the best credit cards if you spend ${formattedAmount}/month on ${categoryLabel.toLowerCase()}. Compare rewards, fees, and features. Apply instantly.`}
      />

      <CategoryHero
        title={`Best Credit Cards for ${categoryLabel}`}
        subtitle={`If You Spend ${formattedAmount}/Month`}
        description={`We've analyzed all credit cards to find the best options for maximizing rewards on your ${categoryLabel.toLowerCase()} spending. Compare and apply instantly.`}
        primaryCta={{
          text: "Compare All Cards",
          href: "/credit-cards",
        }}
        secondaryCta={{
          text: "Customize Your Search",
          href: "/credit-cards/recommendations/spending-based",
        }}
        stats={[
          { label: "Cards Analyzed", value: cards.length.toString() },
          { label: "Top Matches", value: recommendations.length.toString() },
          {
            label: "Avg. Monthly Rewards",
            value:
              recommendations.length > 0
                ? formatCurrency(
                    recommendations.reduce(
                      (sum, r) => sum + r.estimatedRewards,
                      0,
                    ) / recommendations.length,
                  )
                : "₹0",
          },
        ]}
        badge={`Spending: ${formattedAmount}/month`}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Key Insight */}
          <Card className="mb-8 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Why This Matters
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    If you spend {formattedAmount}/month on{" "}
                    {categoryLabel.toLowerCase()}, you could earn
                    {recommendations.length > 0
                      ? ` up to ${formatCurrency(recommendations[0].estimatedRewards)}/month in rewards`
                      : " significant rewards"}{" "}
                    with the right credit card. The cards below are optimized
                    for your spending pattern.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {recommendations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  No recommendations for this pattern
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Try our{" "}
                  <Link
                    href="/credit-cards/recommendations/spending-based"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    custom recommendation tool
                  </Link>{" "}
                  or browse{" "}
                  <Link
                    href="/credit-cards"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    all credit cards
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Top Recommended Credit Cards
              </h2>
              {recommendations.map((rec, idx) => (
                <Card
                  key={rec.card.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {rec.card.name}
                          </h3>
                          <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-xs font-semibold">
                            #{idx + 1} Best Match
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {rec.card.provider || rec.card.bank}
                        </p>
                        <div className="flex items-center gap-4 text-sm mb-4">
                          <span className="text-gray-600 dark:text-gray-400">
                            Estimated Rewards:{" "}
                            <strong className="text-success-600 dark:text-success-400">
                              {formatCurrency(rec.estimatedRewards)}/month
                            </strong>
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            Match Score:{" "}
                            <strong className="text-primary-600 dark:text-primary-400">
                              {rec.score.toFixed(0)}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Why This Card:
                      </h4>
                      <ul className="space-y-1">
                        {rec.reasons.map((reason, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400 mt-0.5 shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <DecisionCTA
                        text="Apply Instantly"
                        href={
                          rec.card.apply_link ||
                          `/apply/credit-card/${rec.card.id}`
                        }
                        productId={rec.card.id}
                        variant="primary"
                        className="flex-1"
                        isExternal={!!rec.card.apply_link}
                      />
                      <Link
                        href={`/credit-cards/${rec.card.slug || rec.card.id}`}
                      >
                        <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Related Links */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Explore More Options
              </h3>
              <div className="space-y-2">
                <Link
                  href="/credit-cards/recommendations/spending-based"
                  className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  Customize your spending pattern for personalized
                  recommendations
                </Link>
                <Link
                  href="/credit-cards/find-your-card"
                  className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  Find cards based on your lifestyle and eligibility
                </Link>
                <Link
                  href="/credit-cards"
                  className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  Compare all credit cards
                </Link>
              </div>
            </CardContent>
          </Card>

          <ComplianceDisclaimer variant="compact" className="mt-8" />
        </div>
      </div>
    </div>
  );
}
