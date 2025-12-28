"use client";

import React, { useState } from 'react';
import { CategoryHero } from "@/components/common/CategoryHero";
import { ProductCard } from "@/components/common/ProductCard";
import { CTAButton, CategoryCTA } from "@/components/common/CTAButton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEOHead from "@/components/common/SEOHead";
import {
    TrendingUp,
    Landmark,
    Coins,
    BarChart3,
    Gem,
    Building2,
    ShieldCheck,
    CheckCircle2,
    Percent,
    Target
} from "lucide-react";

const investingTypes = [
    { id: 'mutual-funds', label: 'Mutual Funds', icon: TrendingUp },
    { id: 'stocks', label: 'Stocks & IPOs', icon: Landmark },
    { id: 'ppf-nps', label: 'PPF & NPS', icon: Coins },
    { id: 'elss', label: 'ELSS', icon: BarChart3 },
    { id: 'gold', label: 'Gold', icon: Gem },
    { id: 'demat', label: 'Demat Accounts', icon: Building2 },
];

const mockProducts = [
    {
        id: 1,
        title: "SBI Bluechip Fund",
        provider: "SBI Mutual Fund",
        rating: 4.7,
        badge: "Top Performer",
        description: "Large-cap equity fund with consistent returns. 5-year return: 15.2% p.a.",
        features: ["15.2% 5Y Return", "Large Cap", "Low Expense Ratio"],
        href: "/investing/mutual-funds/sbi-bluechip"
    },
    {
        id: 2,
        title: "HDFC Tax Saver Fund",
        provider: "HDFC Mutual Fund",
        rating: 4.6,
        badge: "Tax Saving",
        description: "ELSS fund with tax benefits under 80C. Lock-in period: 3 years.",
        features: ["80C Benefits", "3Y Lock-in", "12.8% 5Y Return"],
        href: "/investing/elss/hdfc-tax-saver"
    },
    {
        id: 3,
        title: "Zerodha Demat Account",
        provider: "Zerodha",
        rating: 4.8,
        badge: "Zero Brokerage",
        description: "India's largest stock broker with zero brokerage on equity delivery.",
        features: ["Zero Brokerage", "Free Equity Delivery", "Advanced Platform"],
        href: "/investing/demat/zerodha"
    },
];

export default function InvestingPage() {
    const [activeTab, setActiveTab] = useState('mutual-funds');

    return (
        <div className="min-h-screen bg-slate-50">
            <SEOHead
                title="Best Investment Options in India 2024 - Mutual Funds, Stocks, PPF, NPS | InvestingPro"
                description="Compare mutual funds, stocks, PPF, NPS, ELSS, and gold investments. Find the best investment options with highest returns in India."
            />

            <CategoryHero
                title="Investing"
                subtitle="Grow Your Wealth"
                description="Compare mutual funds, stocks, PPF, NPS, ELSS, and gold investments. Find the best investment options with highest returns and tax benefits."
                badge="5,000+ Products"
                badgeIcon={<TrendingUp className="w-3 h-3" />}
                gradient="teal"
                primaryCTA={{
                    href: "/investing/compare",
                    text: "Compare Investments"
                }}
                secondaryCTA={{
                    href: "/calculators?type=sip",
                    text: "SIP Calculator"
                }}
                stats={[
                    { label: "Mutual Funds", value: "5,000+", icon: <TrendingUp className="w-5 h-5" /> },
                    { label: "Avg Returns", value: "15%", icon: <Percent className="w-5 h-5" /> },
                    { label: "Brokers", value: "25+", icon: <Building2 className="w-5 h-5" /> },
                    { label: "Updated Daily", value: "24/7", icon: <CheckCircle2 className="w-5 h-5" /> }
                ]}
            />

            {/* Investment Type Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 mb-12">
                <Card className="border-0 shadow-xl rounded-2xl bg-white p-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-transparent">
                            {investingTypes.map((type) => (
                                <TabsTrigger
                                    key={type.id}
                                    value={type.id}
                                    className="data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-xl font-bold"
                                >
                                    <type.icon className="w-4 h-4 mr-2" />
                                    {type.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </Card>
            </div>

            {/* Featured Products Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Top Investment Options</h2>
                        <p className="text-slate-600">Handpicked by our investment experts</p>
                    </div>
                    <CTAButton href="/investing/compare" variant="outline">
                        View All
                    </CTAButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {mockProducts.map((product, idx) => (
                        <ProductCard
                            key={product.id}
                            href={product.href}
                            title={product.title}
                            provider={product.provider}
                            rating={product.rating}
                            badge={product.badge}
                            badgeColor="bg-teal-500"
                            description={product.description}
                            features={product.features}
                            highlight={idx === 0}
                            icon={<TrendingUp className="w-5 h-5" />}
                            ctaText="Invest Now"
                        />
                    ))}
                </div>
            </section>

            {/* Category CTAs */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-black text-slate-900 mb-8">Explore Investment Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CategoryCTA
                        href="/mutual-funds"
                        title="Mutual Funds"
                        description="Compare 5,000+ mutual funds with expert analysis"
                        badge="5,000+ Funds"
                        icon={<TrendingUp className="w-6 h-6" />}
                        variant="primary"
                    />
                    <CategoryCTA
                        href="/stocks"
                        title="Stocks & IPOs"
                        description="Real-time market data and broker comparisons"
                        badge="Live Data"
                        icon={<Landmark className="w-6 h-6" />}
                        variant="secondary"
                    />
                    <CategoryCTA
                        href="/ppf-nps"
                        title="PPF & NPS"
                        description="Tax-saving government schemes for retirement"
                        badge="Tax-Free"
                        icon={<Coins className="w-6 h-6" />}
                        variant="primary"
                    />
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-black text-slate-900 mb-12 text-center">
                        Why Compare Investments on InvestingPro?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <ShieldCheck className="w-8 h-8 text-teal-600" />,
                                title: "Expert Analysis",
                                description: "In-depth analysis from SEBI-registered research analysts"
                            },
                            {
                                icon: <Target className="w-8 h-8 text-emerald-600" />,
                                title: "Real Returns",
                                description: "Compare returns after accounting for inflation and taxes"
                            },
                            {
                                icon: <CheckCircle2 className="w-8 h-8 text-indigo-600" />,
                                title: "Updated Daily",
                                description: "Latest NAV, returns, and market data updated daily"
                            }
                        ].map((feature, idx) => (
                            <Card key={idx} className="border-0 shadow-lg rounded-2xl">
                                <CardContent className="p-8 text-center">
                                    <div className="flex justify-center mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">{feature.title}</h3>
                                    <p className="text-slate-600">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}




















