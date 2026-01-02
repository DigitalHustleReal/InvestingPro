"use client";

import React, { useState } from 'react';
import { CategoryHero } from "@/components/common/CategoryHero";
import { ProductCard } from "@/components/common/ProductCard";
import { CTAButton, CategoryCTA } from "@/components/common/CTAButton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEOHead from "@/components/common/SEOHead";
import {
    Shield,
    Heart,
    FileText,
    Car,
    Bike,
    Plane,
    TrendingUp,
    ShieldCheck,
    CheckCircle2,
    Percent
} from "lucide-react";

const insuranceTypes = [
    { id: 'life', label: 'Life', icon: Heart },
    { id: 'health', label: 'Health', icon: Shield },
    { id: 'term', label: 'Term', icon: FileText },
    { id: 'car', label: 'Car', icon: Car },
    { id: 'bike', label: 'Bike', icon: Bike },
    { id: 'travel', label: 'Travel', icon: Plane },
];

const mockPlans = [
    {
        id: 1,
        title: "HDFC Life Term Plan",
        provider: "HDFC Life",
        rating: 4.7,
        badge: "Best Value",
        description: "Term life insurance with coverage up to ₹2 Cr. Premium starting from ₹500/month.",
        features: ["Up to ₹2 Cr Cover", "Low Premium", "High Claim Ratio"],
        href: "/insurance/term/hdfc-life"
    },
    {
        id: 2,
        title: "Star Health Family Health",
        provider: "Star Health",
        rating: 4.6,
        badge: "Family Plan",
        description: "Comprehensive health insurance for family. Coverage up to ₹10 Lakh with cashless treatment.",
        features: ["₹10L Coverage", "Cashless Treatment", "Family Plan"],
        href: "/insurance/health/star-health"
    },
    {
        id: 3,
        title: "Bajaj Allianz Car Insurance",
        provider: "Bajaj Allianz",
        rating: 4.5,
        badge: "Quick Claim",
        description: "Comprehensive car insurance with quick claim settlement. Save up to 40% on premiums.",
        features: ["Quick Claims", "40% Savings", "24/7 Support"],
        href: "/insurance/car/bajaj-allianz"
    },
];

export default function InsurancePage() {
    const [activeTab, setActiveTab] = useState('life');

    return (
        <div className="min-h-screen bg-slate-50">
            <SEOHead
                title="Best Insurance Plans in India 2024 - Life, Health, Term, Car Insurance | InvestingPro"
                description="Compare life insurance, health insurance, term insurance, and car insurance from top insurers. Get best coverage at lowest premiums."
            />

            <CategoryHero
                title="Insurance"
                subtitle="Protect What Matters"
                description="Compare life, health, term, car, bike, and travel insurance from top insurers. Find the best coverage at lowest premiums with high claim settlement ratios."
                badge="20+ Insurers"
                badgeIcon={<ShieldCheck className="w-3 h-3" />}
                gradient="purple"
                primaryCTA={{
                    href: "/insurance/get-quote",
                    text: "Get Free Quote"
                }}
                secondaryCTA={{
                    href: "/insurance/compare",
                    text: "Compare Plans"
                }}
                stats={[
                    { label: "Insurers", value: "20+", icon: <ShieldCheck className="w-5 h-5" /> },
                    { label: "Claim Ratio", value: "95%+", icon: <Percent className="w-5 h-5" /> },
                    { label: "Save Up To", value: "40%", icon: <TrendingUp className="w-5 h-5" /> },
                    { label: "Updated Daily", value: "24/7", icon: <CheckCircle2 className="w-5 h-5" /> }
                ]}
            />

            {/* Insurance Type Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 mb-12">
                <Card className="border-0 shadow-xl rounded-2xl bg-white p-6 md:p-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-transparent">
                            {insuranceTypes.map((type) => (
                                <TabsTrigger
                                    key={type.id}
                                    value={type.id}
                                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-xl font-bold"
                                >
                                    <type.icon className="w-4 h-4 mr-2" />
                                    {type.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </Card>
            </div>

            {/* Featured Plans Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Top Insurance Plans</h2>
                        <p className="text-slate-600">Best coverage from verified insurers</p>
                    </div>
                    <CTAButton href="/insurance/compare" variant="outline">
                        Compare All
                    </CTAButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {mockPlans.map((plan, idx) => (
                        <ProductCard
                            key={plan.id}
                            href={plan.href}
                            title={plan.title}
                            provider={plan.provider}
                            rating={plan.rating}
                            badge={plan.badge}
                            badgeColor="bg-purple-500"
                            description={plan.description}
                            features={plan.features}
                            highlight={idx === 0}
                            icon={<Shield className="w-5 h-5" />}
                            ctaText="Get Quote"
                        />
                    ))}
                </div>
            </section>

            {/* Category CTAs */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Explore Insurance Types</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CategoryCTA
                        href="/insurance?type=term"
                        title="Term Insurance"
                        description="Pure protection plans with high coverage"
                        badge="Low Premium"
                        icon={<FileText className="w-6 h-6" />}
                        variant="primary"
                    />
                    <CategoryCTA
                        href="/insurance?type=health"
                        title="Health Insurance"
                        description="Medical coverage for you and your family"
                        badge="Cashless"
                        icon={<Heart className="w-6 h-6" />}
                        variant="secondary"
                    />
                    <CategoryCTA
                        href="/insurance?type=car"
                        title="Car Insurance"
                        description="Comprehensive coverage for your vehicle"
                        badge="Quick Claims"
                        icon={<Car className="w-6 h-6" />}
                        variant="primary"
                    />
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                        Why Compare Insurance on InvestingPro?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <ShieldCheck className="w-8 h-8 text-purple-600" />,
                                title: "IRDAI Registered",
                                description: "All insurers are verified and registered with IRDAI"
                            },
                            {
                                icon: <Percent className="w-8 h-8 text-rose-600" />,
                                title: "High Claim Ratio",
                                description: "Compare insurers with 95%+ claim settlement ratio"
                            },
                            {
                                icon: <CheckCircle2 className="w-8 h-8 text-indigo-600" />,
                                title: "Save Up to 40%",
                                description: "Compare premiums and save on insurance costs"
                            }
                        ].map((feature, idx) => (
                            <Card key={idx} className="border-0 shadow-lg rounded-2xl">
                                <CardContent className="p-8 text-center">
                                    <div className="flex justify-center mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
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
