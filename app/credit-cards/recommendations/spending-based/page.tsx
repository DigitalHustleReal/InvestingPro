"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/common/SEOHead";
import { apiClient as api } from "@/lib/api-client";
import {
  CreditCardDecisionEngine,
  SpendingInput,
  CardRecommendation,
} from "@/lib/decision-engines/credit-card-engine";
import { CreditCard } from "@/types/credit-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import {
  ShoppingBag,
  Fuel,
  Plane,
  CreditCard as CardIcon,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import DecisionCTA from "@/components/common/DecisionCTA";
import ComplianceDisclaimer from "@/components/common/ComplianceDisclaimer";
import CategoryHero from "@/components/common/CategoryHero";
import { formatCurrency } from "@/lib/utils";

export default function SpendingBasedRecommendationsPage() {
  const [spendingInput, setSpendingInput] = useState<SpendingInput>({
    monthlySpending: 0,
    groceries: 0,
    fuel: 0,
    travel: 0,
    onlineShopping: 0,
    dining: 0,
    utilities: 0,
    other: 0,
  });

  const { data: cards = [], isLoading } = useQuery<CreditCard[]>({
    queryKey: ["credit-cards"],
    queryFn: async () => {
      return await api.entities.CreditCard.list();
    },
  });

  const engine = cards.length > 0 ? new CreditCardDecisionEngine(cards) : null;
  const recommendations: CardRecommendation[] =
    spendingInput.monthlySpending > 0 && engine
      ? engine.getSpendingBasedRecommendations(spendingInput, 5)
      : [];

  const updateSpendingTotal = () => {
    const total =
      spendingInput.groceries +
      spendingInput.fuel +
      spendingInput.travel +
      spendingInput.onlineShopping +
      spendingInput.dining +
      spendingInput.utilities +
      spendingInput.other;
    setSpendingInput((prev) => ({ ...prev, monthlySpending: total }));
  };

  const getTopSpendingCategory = () => {
    const categories = [
      { name: "groceries", amount: spendingInput.groceries, icon: ShoppingBag },
      { name: "fuel", amount: spendingInput.fuel, icon: Fuel },
      { name: "travel", amount: spendingInput.travel, icon: Plane },
      {
        name: "onlineShopping",
        amount: spendingInput.onlineShopping,
        icon: CardIcon,
      },
    ];
    return categories.sort((a, b) => b.amount - a.amount)[0];
  };

  const topCategory = getTopSpendingCategory();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEOHead
        title="Best Credit Cards Based on Your Spending Pattern | InvestingPro"
        description="Get personalized credit card recommendations based on your monthly spending on groceries, fuel, travel, and online shopping. Find the best card that maximizes your rewards."
      />

      <CategoryHero
        title="Find Your Perfect Credit Card"
        subtitle="Based on Your Spending Pattern"
        description="Tell us how much you spend monthly on different categories, and we'll recommend the best credit cards that maximize your rewards."
        primaryCta={{
          text: "Compare All Cards",
          href: "/credit-cards",
        }}
        secondaryCta={{
          text: "Find by Lifestyle",
          href: "/credit-cards/find-your-card",
        }}
        stats={[
          { label: "Cards Compared", value: "50+" },
          { label: "Users Helped", value: "10K+" },
          { label: "Avg. Rewards", value: "₹2,500/mo" },
        ]}
        badge="Spending-Based Recommendations"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  Your Monthly Spending
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="groceries">
                      Groceries & Supermarkets (₹/month)
                    </Label>
                    <Input
                      id="groceries"
                      type="number"
                      placeholder="0"
                      value={spendingInput.groceries || ""}
                      onChange={(e) => {
                        setSpendingInput((prev) => ({
                          ...prev,
                          groceries: parseFloat(e.target.value) || 0,
                        }));
                        updateSpendingTotal();
                      }}
                      onBlur={updateSpendingTotal}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fuel">Fuel & Petrol (₹/month)</Label>
                    <Input
                      id="fuel"
                      type="number"
                      placeholder="0"
                      value={spendingInput.fuel || ""}
                      onChange={(e) => {
                        setSpendingInput((prev) => ({
                          ...prev,
                          fuel: parseFloat(e.target.value) || 0,
                        }));
                        updateSpendingTotal();
                      }}
                      onBlur={updateSpendingTotal}
                    />
                  </div>

                  <div>
                    <Label htmlFor="travel">Travel & Flights (₹/month)</Label>
                    <Input
                      id="travel"
                      type="number"
                      placeholder="0"
                      value={spendingInput.travel || ""}
                      onChange={(e) => {
                        setSpendingInput((prev) => ({
                          ...prev,
                          travel: parseFloat(e.target.value) || 0,
                        }));
                        updateSpendingTotal();
                      }}
                      onBlur={updateSpendingTotal}
                    />
                  </div>

                  <div>
                    <Label htmlFor="onlineShopping">
                      Online Shopping (₹/month)
                    </Label>
                    <Input
                      id="onlineShopping"
                      type="number"
                      placeholder="0"
                      value={spendingInput.onlineShopping || ""}
                      onChange={(e) => {
                        setSpendingInput((prev) => ({
                          ...prev,
                          onlineShopping: parseFloat(e.target.value) || 0,
                        }));
                        updateSpendingTotal();
                      }}
                      onBlur={updateSpendingTotal}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dining">
                      Dining & Restaurants (₹/month)
                    </Label>
                    <Input
                      id="dining"
                      type="number"
                      placeholder="0"
                      value={spendingInput.dining || ""}
                      onChange={(e) => {
                        setSpendingInput((prev) => ({
                          ...prev,
                          dining: parseFloat(e.target.value) || 0,
                        }));
                        updateSpendingTotal();
                      }}
                      onBlur={updateSpendingTotal}
                    />
                  </div>

                  <div>
                    <Label htmlFor="utilities">
                      Utilities & Bills (₹/month)
                    </Label>
                    <Input
                      id="utilities"
                      type="number"
                      placeholder="0"
                      value={spendingInput.utilities || ""}
                      onChange={(e) => {
                        setSpendingInput((prev) => ({
                          ...prev,
                          utilities: parseFloat(e.target.value) || 0,
                        }));
                        updateSpendingTotal();
                      }}
                      onBlur={updateSpendingTotal}
                    />
                  </div>

                  <div>
                    <Label htmlFor="other">Other Expenses (₹/month)</Label>
                    <Input
                      id="other"
                      type="number"
                      placeholder="0"
                      value={spendingInput.other || ""}
                      onChange={(e) => {
                        setSpendingInput((prev) => ({
                          ...prev,
                          other: parseFloat(e.target.value) || 0,
                        }));
                        updateSpendingTotal();
                      }}
                      onBlur={updateSpendingTotal}
                    />
                  </div>
                </div>

                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Total Monthly Spending:
                    </span>
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {formatCurrency(spendingInput.monthlySpending)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations Section */}
            <div className="space-y-6">
              {spendingInput.monthlySpending === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Enter Your Spending
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Fill in your monthly spending to get personalized credit
                      card recommendations.
                    </p>
                  </CardContent>
                </Card>
              ) : isLoading ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      Loading recommendations...
                    </p>
                  </CardContent>
                </Card>
              ) : recommendations.length === 0 ? (
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
                      No recommendations yet
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Try adjusting your spending amounts above, or explore our
                      top-rated cards.
                    </p>
                    <a
                      href="/credit-cards"
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Browse all credit cards &rarr;
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {topCategory.amount > 0 && (
                    <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          {React.createElement(topCategory.icon, {
                            className:
                              "w-6 h-6 text-primary-600 dark:text-primary-400",
                          })}
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Top Spending Category:{" "}
                            {topCategory.name === "onlineShopping"
                              ? "Online Shopping"
                              : topCategory.name.charAt(0).toUpperCase() +
                                topCategory.name.slice(1)}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          You spend {formatCurrency(topCategory.amount)}/month
                          on{" "}
                          {topCategory.name === "onlineShopping"
                            ? "online shopping"
                            : topCategory.name}
                          . We've prioritized cards that maximize rewards in
                          this category.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Recommended Credit Cards
                    </h2>
                    <div className="space-y-4">
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
                                    #{idx + 1} Match
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  {(rec.card as any).provider}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Estimated Rewards:{" "}
                                    <strong className="text-success-600 dark:text-success-400">
                                      {formatCurrency(rec.estimatedRewards)}
                                      /month
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
                                <Button variant="outline" className="flex-1">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Popular Spending Patterns
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Best for Groceries",
                    href: "/credit-cards/recommendations/groceries/15000",
                    icon: ShoppingBag,
                  },
                  {
                    label: "Best for Fuel",
                    href: "/credit-cards/recommendations/fuel/8000",
                    icon: Fuel,
                  },
                  {
                    label: "Best for Travel",
                    href: "/credit-cards/recommendations/travel/25000",
                    icon: Plane,
                  },
                  {
                    label: "Best for Online Shopping",
                    href: "/credit-cards/recommendations/online-shopping/20000",
                    icon: CardIcon,
                  },
                ].map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      <CardContent className="p-4 text-center">
                        {React.createElement(link.icon, {
                          className:
                            "w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2",
                        })}
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {link.label}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <ComplianceDisclaimer variant="compact" className="mt-8" />
        </div>
      </div>
    </div>
  );
}
