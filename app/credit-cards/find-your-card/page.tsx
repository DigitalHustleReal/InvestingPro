"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEOHead from "@/components/common/SEOHead";
import { apiClient as api } from "@/lib/api-client";
import {
  CreditCardDecisionEngine,
  SpendingInput,
  LifestyleInput,
  EligibilityInput,
} from "@/lib/decision-engines/credit-card-engine";
import { CreditCard } from "@/types/credit-card";
import { CardRecommendation } from "@/lib/decision-engines/credit-card-engine";
import { formatCurrency } from "@/lib/utils";
import {
  CreditCard as CardIcon,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import AffiliateLink from "@/components/common/AffiliateLink";

export default function FindYourCardPage() {
  const [activeTab, setActiveTab] = useState<
    "spending" | "lifestyle" | "eligibility"
  >("spending");

  // Spending inputs
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

  // Lifestyle inputs
  const [lifestyleInput, setLifestyleInput] = useState<LifestyleInput>({
    lifestyle: "all_rounder",
    frequency: "medium",
  });

  // Eligibility inputs
  const [eligibilityInput, setEligibilityInput] = useState<EligibilityInput>({
    monthlyIncome: 0,
    employmentStatus: "salaried",
    creditScore: undefined,
    existingCards: 0,
  });

  // Fetch credit cards
  const { data: cards = [], isLoading } = useQuery<CreditCard[]>({
    queryKey: ["credit-cards"],
    queryFn: async () => {
      return await api.entities.CreditCard.list();
    },
  });

  // Calculate recommendations
  const engine = cards.length > 0 ? new CreditCardDecisionEngine(cards) : null;

  let spendingRecommendations: CardRecommendation[] = [];
  let lifestyleRecommendations: CardRecommendation[] = [];
  let eligibilityResults: Array<{ card: CreditCard; probability: number }> = [];

  if (engine) {
    if (activeTab === "spending" && spendingInput.monthlySpending > 0) {
      spendingRecommendations = engine.getSpendingBasedRecommendations(
        spendingInput,
        3,
      );
    }
    if (activeTab === "lifestyle") {
      lifestyleRecommendations = engine.getLifestyleBasedRecommendations(
        lifestyleInput,
        3,
      );
    }
    if (activeTab === "eligibility" && eligibilityInput.monthlyIncome > 0) {
      eligibilityResults = engine.getEligibilityForAllCards(eligibilityInput);
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEOHead
        title="Find Your Perfect Credit Card - Spending-Based Recommendations | InvestingPro"
        description="Get personalized credit card recommendations based on your spending pattern, lifestyle, and eligibility. Compare and apply instantly."
      />

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Credit Card
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Get personalized recommendations based on your spending,
              lifestyle, and eligibility
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="max-w-6xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="spending" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Spending-Based
            </TabsTrigger>
            <TabsTrigger value="lifestyle" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Lifestyle-Based
            </TabsTrigger>
            <TabsTrigger
              value="eligibility"
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Eligibility Check
            </TabsTrigger>
          </TabsList>

          {/* Spending-Based Tab */}
          <TabsContent value="spending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Monthly Spending</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="groceries">Groceries (₹/month)</Label>
                    <Input
                      id="groceries"
                      type="number"
                      value={spendingInput.groceries || ""}
                      onChange={(e) => {
                        setSpendingInput((prev) => ({
                          ...prev,
                          groceries: parseFloat(e.target.value) || 0,
                        }));
                        setTimeout(updateSpendingTotal, 0);
                      }}
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fuel">Fuel (₹/month)</Label>
                    <Input
                      id="fuel"
                      type="number"
                      value={spendingInput.fuel || ""}
                      onChange={(e) => {
                        setSpendingInput((prev) => ({
                          ...prev,
                          fuel: parseFloat(e.target.value) || 0,
                        }));
                        setTimeout(updateSpendingTotal, 0);
                      }}
                      placeholder="3000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="travel">Travel (₹/month)</Label>
                    <Input
                      id="travel"
                      type="number"
                      value={spendingInput.travel || ""}
                      onChange={(e) => {
                        setSpendingInput((prev) => ({
                          ...prev,
                          travel: parseFloat(e.target.value) || 0,
                        }));
                        setTimeout(updateSpendingTotal, 0);
                      }}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="onlineShopping">
                      Online Shopping (₹/month)
                    </Label>
                    <Input
                      id="onlineShopping"
                      type="number"
                      value={spendingInput.onlineShopping || ""}
                      onChange={(e) => {
                        setSpendingInput((prev) => ({
                          ...prev,
                          onlineShopping: parseFloat(e.target.value) || 0,
                        }));
                        setTimeout(updateSpendingTotal, 0);
                      }}
                      placeholder="8000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dining">Dining (₹/month)</Label>
                    <Input
                      id="dining"
                      type="number"
                      value={spendingInput.dining || ""}
                      onChange={(e) => {
                        setSpendingInput((prev) => ({
                          ...prev,
                          dining: parseFloat(e.target.value) || 0,
                        }));
                        setTimeout(updateSpendingTotal, 0);
                      }}
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="utilities">Utilities (₹/month)</Label>
                    <Input
                      id="utilities"
                      type="number"
                      value={spendingInput.utilities || ""}
                      onChange={(e) => {
                        setSpendingInput((prev) => ({
                          ...prev,
                          utilities: parseFloat(e.target.value) || 0,
                        }));
                        setTimeout(updateSpendingTotal, 0);
                      }}
                      placeholder="3000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="other">Other (₹/month)</Label>
                    <Input
                      id="other"
                      type="number"
                      value={spendingInput.other || ""}
                      onChange={(e) => {
                        setSpendingInput((prev) => ({
                          ...prev,
                          other: parseFloat(e.target.value) || 0,
                        }));
                        setTimeout(updateSpendingTotal, 0);
                      }}
                      placeholder="2000"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">
                      Total Monthly Spending:
                    </span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(spendingInput.monthlySpending)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {spendingRecommendations.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                  Recommended Cards for Your Spending
                </h2>
                {spendingRecommendations.map((rec, idx) => (
                  <Card
                    key={rec.card.id}
                    className="border-2 border-primary-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl font-bold text-primary-600">
                              #{idx + 1}
                            </span>
                            <h3 className="text-xl font-bold">
                              {rec.card.name}
                            </h3>
                            <span className="text-sm text-gray-500">
                              by {rec.card.bank}
                            </span>
                          </div>
                          <div className="space-y-2 mb-4">
                            {rec.reasons.map((reason, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-gray-600"
                              >
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span>{reason}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div>
                              <span className="text-gray-500">
                                Estimated Monthly Rewards:{" "}
                              </span>
                              <span className="font-semibold text-green-600">
                                {formatCurrency(rec.estimatedRewards)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                Eligibility:{" "}
                              </span>
                              <span className="font-semibold">
                                {rec.eligibilityProbability}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-6 flex flex-col items-center gap-1">
                          <AffiliateLink
                            productId={rec.card.id}
                            variant="default"
                          >
                            Apply Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </AffiliateLink>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            No CIBIL impact
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Lifestyle-Based Tab */}
          <TabsContent value="lifestyle" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Your Lifestyle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Lifestyle Type</Label>
                  <select
                    value={lifestyleInput.lifestyle}
                    onChange={(e) =>
                      setLifestyleInput((prev) => ({
                        ...prev,
                        lifestyle: e.target.value as any,
                      }))
                    }
                    className="w-full px-4 py-2 border rounded-lg mt-2"
                  >
                    <option value="all_rounder">All Rounder</option>
                    <option value="traveler">Frequent Traveler</option>
                    <option value="shopper">Online Shopper</option>
                    <option value="fuel_user">Regular Driver</option>
                    <option value="dining">Food Enthusiast</option>
                  </select>
                </div>
                <div>
                  <Label>Usage Frequency</Label>
                  <select
                    value={lifestyleInput.frequency}
                    onChange={(e) =>
                      setLifestyleInput((prev) => ({
                        ...prev,
                        frequency: e.target.value as any,
                      }))
                    }
                    className="w-full px-4 py-2 border rounded-lg mt-2"
                  >
                    <option value="low">Low (occasional use)</option>
                    <option value="medium">Medium (regular use)</option>
                    <option value="high">High (frequent use)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {lifestyleRecommendations.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                  Recommended Cards for Your Lifestyle
                </h2>
                {lifestyleRecommendations.map((rec, idx) => (
                  <Card
                    key={rec.card.id}
                    className="border-2 border-primary-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl font-bold text-primary-600">
                              #{idx + 1}
                            </span>
                            <h3 className="text-xl font-bold">
                              {rec.card.name}
                            </h3>
                            <span className="text-sm text-gray-500">
                              by {rec.card.bank}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {rec.reasons.map((reason, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-gray-600"
                              >
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span>{reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="ml-6 flex flex-col items-center gap-1">
                          <AffiliateLink
                            productId={rec.card.id}
                            variant="default"
                          >
                            Apply Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </AffiliateLink>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            No CIBIL impact
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Eligibility Check Tab */}
          <TabsContent value="eligibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Check Your Eligibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="income">Monthly Income (₹)</Label>
                  <Input
                    id="income"
                    type="number"
                    value={eligibilityInput.monthlyIncome || ""}
                    onChange={(e) =>
                      setEligibilityInput((prev) => ({
                        ...prev,
                        monthlyIncome: parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label>Employment Status</Label>
                  <select
                    value={eligibilityInput.employmentStatus}
                    onChange={(e) =>
                      setEligibilityInput((prev) => ({
                        ...prev,
                        employmentStatus: e.target.value as any,
                      }))
                    }
                    className="w-full px-4 py-2 border rounded-lg mt-2"
                  >
                    <option value="salaried">Salaried</option>
                    <option value="self_employed">Self Employed</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="creditScore">Credit Score (Optional)</Label>
                  <Input
                    id="creditScore"
                    type="number"
                    value={eligibilityInput.creditScore || ""}
                    onChange={(e) =>
                      setEligibilityInput((prev) => ({
                        ...prev,
                        creditScore: parseFloat(e.target.value) || undefined,
                      }))
                    }
                    placeholder="750"
                    min="300"
                    max="900"
                  />
                </div>
                <div>
                  <Label htmlFor="existingCards">Existing Credit Cards</Label>
                  <Input
                    id="existingCards"
                    type="number"
                    value={eligibilityInput.existingCards || ""}
                    onChange={(e) =>
                      setEligibilityInput((prev) => ({
                        ...prev,
                        existingCards: parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>

            {eligibilityResults.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Eligibility Results</h2>
                <div className="grid gap-4">
                  {eligibilityResults.slice(0, 10).map((result) => (
                    <Card key={result.card.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">
                              {result.card.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {result.card.bank}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div
                                className={`text-lg font-bold ${
                                  result.probability >= 70
                                    ? "text-green-600"
                                    : result.probability >= 50
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {result.probability}%
                              </div>
                              <div className="text-xs text-gray-500">
                                Approval Chance
                              </div>
                            </div>
                            <AffiliateLink
                              productId={result.card.id}
                              variant="outline"
                            >
                              Apply
                            </AffiliateLink>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
