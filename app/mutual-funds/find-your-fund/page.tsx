"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEOHead from "@/components/common/SEOHead";
import { apiClient as api } from '@/lib/api-client';
import { MutualFundDecisionEngine, GoalInput, RiskInput } from '@/lib/decision-engines/mutual-fund-engine';
import { MutualFund } from '@/types/mutual-fund';
import { FundRecommendation } from '@/lib/decision-engines/mutual-fund-engine';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingUp, Shield, Sparkles, ArrowRight, CheckCircle2, Target, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import AffiliateLink from '@/components/common/AffiliateLink';

export default function FindYourFundPage() {
    const [activeTab, setActiveTab] = useState<'goal' | 'risk'>('goal');

    // Goal inputs
    const [goalInput, setGoalInput] = useState<GoalInput>({
        goal: 'retirement',
        amountNeeded: 0,
        timeline: 0,
        monthlyBudget: undefined
    });

    // Risk inputs
    const [riskInput, setRiskInput] = useState<RiskInput>({
        riskProfile: 'moderate',
        investmentHorizon: 'long',
        experience: 'beginner'
    });

    // Fetch mutual funds
    const { data: funds = [], isLoading } = useQuery<MutualFund[]>({
        queryKey: ['mutual-funds'],
        queryFn: async () => {
            const result = await api.entities.MutualFund.list();
            // Handle both array and { data, count } response
            return Array.isArray(result) ? result : (result as any).data || [];
        }
    });

    // Calculate recommendations
    const engine = funds.length > 0 ? new MutualFundDecisionEngine(funds) : null;

    let goalRecommendations: FundRecommendation[] = [];
    let riskRecommendations: FundRecommendation[] = [];

    if (engine) {
        if (activeTab === 'goal' && goalInput.amountNeeded > 0 && goalInput.timeline > 0) {
            goalRecommendations = engine.getGoalBasedRecommendations(goalInput, 3);
        }
        if (activeTab === 'risk') {
            riskRecommendations = engine.getRiskProfiledRecommendations(riskInput, 3);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <SEOHead
                title="Find Your Perfect Mutual Fund - Goal-Based Recommendations | InvestingPro"
                description="Get personalized mutual fund recommendations based on your investment goals, risk profile, and timeline. Compare and start SIP instantly."
            />

            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200 py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Find Your Perfect Mutual Fund
                        </h1>
                        <p className="text-xl text-green-100 mb-8">
                            Get personalized recommendations based on your goals, risk profile, and timeline
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="max-w-6xl mx-auto">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="goal" className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Goal-Based
                        </TabsTrigger>
                        <TabsTrigger value="risk" className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Risk-Profiled
                        </TabsTrigger>
                    </TabsList>

                    {/* Goal-Based Tab */}
                    <TabsContent value="goal" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Enter Your Investment Goal</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Investment Goal</Label>
                                    <select
                                        value={goalInput.goal}
                                        onChange={(e) => setGoalInput(prev => ({ ...prev, goal: e.target.value as any }))}
                                        className="w-full px-4 py-2 border rounded-lg mt-2"
                                    >
                                        <option value="retirement">Retirement</option>
                                        <option value="education">Child's Education</option>
                                        <option value="house">Buy a House</option>
                                        <option value="vacation">Vacation</option>
                                        <option value="emergency">Emergency Fund</option>
                                        <option value="wealth_creation">Wealth Creation</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="amountNeeded">Target Amount (₹)</Label>
                                    <Input
                                        id="amountNeeded"
                                        type="number"
                                        value={goalInput.amountNeeded || ''}
                                        onChange={(e) => setGoalInput(prev => ({ ...prev, amountNeeded: parseFloat(e.target.value) || 0 }))}
                                        placeholder="1000000"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="timeline">Timeline (Years)</Label>
                                    <Input
                                        id="timeline"
                                        type="number"
                                        value={goalInput.timeline || ''}
                                        onChange={(e) => setGoalInput(prev => ({ ...prev, timeline: parseFloat(e.target.value) || 0 }))}
                                        placeholder="10"
                                        min="1"
                                        max="50"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="monthlyBudget">Monthly SIP Budget (₹) - Optional</Label>
                                    <Input
                                        id="monthlyBudget"
                                        type="number"
                                        value={goalInput.monthlyBudget || ''}
                                        onChange={(e) => setGoalInput(prev => ({ ...prev, monthlyBudget: parseFloat(e.target.value) || undefined }))}
                                        placeholder="5000"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Leave empty to calculate required SIP amount
                                    </p>
                                </div>
                                {goalInput.amountNeeded > 0 && goalInput.timeline > 0 && goalRecommendations.length > 0 && (
                                    <div className="pt-4 border-t">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold">Recommended Monthly SIP:</span>
                                            <span className="text-2xl font-bold text-green-600">
                                                {formatCurrency(goalRecommendations[0]?.recommendedSIPAmount || 0)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {goalRecommendations.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Recommended Funds for Your Goal</h2>
                                {goalRecommendations.map((rec, idx) => (
                                    <Card key={rec.fund.id} className="border-2 border-green-200">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-2xl font-bold text-green-600">#{idx + 1}</span>
                                                        <h3 className="text-xl font-bold">{rec.fund.name}</h3>
                                                        <span className="text-sm text-gray-500">by {rec.fund.fund_house}</span>
                                                    </div>
                                                    <div className="space-y-2 mb-4">
                                                        {rec.reasons.map((reason, i) => (
                                                            <div key={i} className="flex items-center gap-2 text-gray-600">
                                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                                <span>{reason}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-gray-500">Recommended SIP: </span>
                                                            <span className="font-semibold text-green-600">
                                                                {formatCurrency(rec.recommendedSIPAmount)}/month
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Projected Value: </span>
                                                            <span className="font-semibold">
                                                                {formatCurrency(rec.projectedValue)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Risk Match: </span>
                                                            <span className="font-semibold">
                                                                {rec.riskMatch}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ml-6">
                                                    <AffiliateLink
                                                        productId={rec.fund.id}
                                                        variant="default"
                                                    >
                                                        Start SIP
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </AffiliateLink>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Risk-Profiled Tab */}
                    <TabsContent value="risk" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Your Risk Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Risk Profile</Label>
                                    <select
                                        value={riskInput.riskProfile}
                                        onChange={(e) => setRiskInput(prev => ({ ...prev, riskProfile: e.target.value as any }))}
                                        className="w-full px-4 py-2 border rounded-lg mt-2"
                                    >
                                        <option value="conservative">Conservative (Low Risk)</option>
                                        <option value="moderate">Moderate (Balanced)</option>
                                        <option value="aggressive">Aggressive (High Risk, High Returns)</option>
                                        <option value="very_aggressive">Very Aggressive (Very High Risk)</option>
                                    </select>
                                </div>
                                <div>
                                    <Label>Investment Horizon</Label>
                                    <select
                                        value={riskInput.investmentHorizon}
                                        onChange={(e) => setRiskInput(prev => ({ ...prev, investmentHorizon: e.target.value as any }))}
                                        className="w-full px-4 py-2 border rounded-lg mt-2"
                                    >
                                        <option value="short">Short Term (&lt; 3 years)</option>
                                        <option value="medium">Medium Term (3-7 years)</option>
                                        <option value="long">Long Term (&gt; 7 years)</option>
                                    </select>
                                </div>
                                <div>
                                    <Label>Investment Experience</Label>
                                    <select
                                        value={riskInput.experience}
                                        onChange={(e) => setRiskInput(prev => ({ ...prev, experience: e.target.value as any }))}
                                        className="w-full px-4 py-2 border rounded-lg mt-2"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        {riskRecommendations.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Recommended Funds for Your Risk Profile</h2>
                                {riskRecommendations.map((rec, idx) => (
                                    <Card key={rec.fund.id} className="border-2 border-green-200">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-2xl font-bold text-green-600">#{idx + 1}</span>
                                                        <h3 className="text-xl font-bold">{rec.fund.name}</h3>
                                                        <span className="text-sm text-gray-500">by {rec.fund.fund_house}</span>
                                                    </div>
                                                    <div className="space-y-2 mb-4">
                                                        {rec.reasons.map((reason, i) => (
                                                            <div key={i} className="flex items-center gap-2 text-gray-600">
                                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                                <span>{reason}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-gray-500">Recommended SIP: </span>
                                                            <span className="font-semibold text-green-600">
                                                                {formatCurrency(rec.recommendedSIPAmount)}/month
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Projected Value (5Y): </span>
                                                            <span className="font-semibold">
                                                                {formatCurrency(rec.projectedValue)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Risk Match: </span>
                                                            <span className="font-semibold">
                                                                {rec.riskMatch}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ml-6">
                                                    <AffiliateLink
                                                        productId={rec.fund.id}
                                                        variant="default"
                                                    >
                                                        Start SIP
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </AffiliateLink>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
