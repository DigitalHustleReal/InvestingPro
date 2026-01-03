"use client";

import React, { useState } from 'react';
import { CategoryHero } from "@/components/common/CategoryHero";
import { ProductCard } from "@/components/common/ProductCard";
import { CTAButton, CategoryCTA } from "@/components/common/CTAButton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEOHead from "@/components/common/SEOHead";
import {
    Wallet,
    Home,
    Car,
    GraduationCap,
    Gem,
    Briefcase,
    TrendingDown,
    ShieldCheck,
    CheckCircle2,
    Calculator,
    Percent
} from "lucide-react";

const loanTypes = [
    { id: 'personal', label: 'Personal', icon: Wallet },
    { id: 'home', label: 'Home', icon: Home },
    { id: 'car', label: 'Car', icon: Car },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'gold', label: 'Gold', icon: Gem },
    { id: 'business', label: 'Business', icon: Briefcase },
];

const mockLoans = [
    {
        id: "1",
        category: 'loan',
        name: "HDFC Personal Loan",
        provider: "HDFC Bank",
        rating: 4.6,
        description: "Interest rates starting from 10.5% p.a. Quick approval and flexible repayment options.",
        features: ["10.5% Starting Rate", "Instant Approval", "No Collateral"],
        applyLink: "/loans/personal/hdfc",
        interestRateMin: 10.5,
        interestRateMax: 15.0,
        processingFee: "2.0%",
        maxTenureMonths: 60,
        isPopular: true
    },
    {
        id: "2",
        category: 'loan',
        name: "SBI Home Loan",
        provider: "State Bank of India",
        rating: 4.7,
        description: "Home loans starting from 8.5% p.a. with flexible tenure up to 30 years.",
        features: ["8.5% Starting Rate", "Up to 30 Years", "Low Processing Fee"],
        applyLink: "/loans/home/sbi",
        interestRateMin: 8.5,
        interestRateMax: 9.5,
        processingFee: "0.5%",
        maxTenureMonths: 360,
        isPopular: true
    },
    {
        id: "3",
        category: 'loan',
        name: "ICICI Car Loan",
        provider: "ICICI Bank",
        rating: 4.5,
        description: "Car loans with competitive rates and fast approval. Finance up to 100% of ex-showroom price.",
        features: ["9.5% Starting Rate", "100% Financing", "24hr Approval"],
        applyLink: "/loans/car/icici",
        interestRateMin: 9.5,
        interestRateMax: 11.0,
        processingFee: "1.0%",
        maxTenureMonths: 84,
        isPopular: false
    },
];

export default function LoansPage() {
    const [activeTab, setActiveTab] = useState('personal');

    return (
        <div className="min-h-screen bg-slate-50">
            <SEOHead
                title="Best Loans in India 2024 - Compare Personal, Home, Car & Education Loans | InvestingPro"
                description="Compare lowest interest rates on personal loans, home loans, car loans, and education loans from top Indian banks. Check eligibility and calculate EMI."
            />

            <CategoryHero
                title="Loans"
                subtitle="Lowest Interest Rates"
                description="Compare and find the best loan offers with lowest interest rates from 30+ lenders. Personal, home, car, education, gold, and business loans."
                badge="30+ Lenders Compared"
                badgeIcon={<ShieldCheck className="w-3 h-3" />}
                gradient="emerald"
                primaryCTA={{
                    href: "/loans/check-eligibility",
                    text: "Check Eligibility"
                }}
                secondaryCTA={{
                    href: "/calculators?type=emi",
                    text: "Calculate EMI"
                }}
                stats={[
                    { label: "Lenders", value: "30+", icon: <ShieldCheck className="w-5 h-5" /> },
                    { label: "Lowest Rate", value: "8.5%", icon: <TrendingDown className="w-5 h-5" /> },
                    { label: "Quick Approval", value: "24hrs", icon: <CheckCircle2 className="w-5 h-5" /> },
                    { label: "Updated Daily", value: "24/7", icon: <Percent className="w-5 h-5" /> }
                ]}
            />

            {/* Loan Type Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 mb-12">
                <Card className="border-0 shadow-xl rounded-2xl bg-white p-6 md:p-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-transparent">
                            {loanTypes.map((type) => (
                                <TabsTrigger
                                    key={type.id}
                                    value={type.id}
                                    className="data-[state=active]:bg-primary-600 data-[state=active]:text-white rounded-xl font-bold"
                                >
                                    <type.icon className="w-4 h-4 mr-2" />
                                    {type.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </Card>
            </div>

            {/* Featured Loans Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Top Loan Offers</h2>
                        <p className="text-slate-600">Best rates from verified lenders</p>
                    </div>
                    <CTAButton href="/loans/compare" variant="secondary">
                        Compare All
                    </CTAButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {mockLoans.map((loan, idx) => (
                        <ProductCard
                            key={loan.id}
                            product={loan as any}
                            showCompare={true}
                        />
                    ))}
                </div>
            </section>

            {/* Category CTAs */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Explore Loan Types</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CategoryCTA
                        href="/loans?type=personal"
                        categoryName="Personal Loans"
                        description="Quick unsecured loans for your personal needs"
                    />
                    <CategoryCTA
                        href="/loans?type=home"
                        categoryName="Home Loans"
                        description="Buy your dream home with lowest interest rates"
                    />
                    <CategoryCTA
                        href="/loans?type=car"
                        categoryName="Car Loans"
                        description="Finance your vehicle with flexible repayment"
                    />
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                        Why Compare Loans on InvestingPro?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
                                title: "Verified Lenders",
                                description: "All lenders are verified and trusted financial institutions"
                            },
                            {
                                icon: <TrendingDown className="w-8 h-8 text-teal-600" />,
                                title: "Lowest Rates",
                                description: "Real-time comparison of interest rates from 30+ lenders"
                            },
                            {
                                icon: <Calculator className="w-8 h-8 text-indigo-600" />,
                                title: "Free EMI Calculator",
                                description: "Calculate your EMI and total interest before applying"
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
