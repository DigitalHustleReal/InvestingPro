"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { 
    Target, 
    TrendingUp, 
    Shield, 
    Wallet, 
    Calculator,
    ArrowRight,
    PiggyBank,
    Building2
} from "lucide-react";

const goals = [
    {
        icon: TrendingUp,
        title: "Build Wealth",
        description: "Invest in mutual funds, stocks, and SIPs to grow your money",
        color: "text-primary-600",
        bg: "bg-primary-50",
        border: "border-primary-200",
        href: "/investing",
        cta: "Start Investing",
        features: ["SIP Calculator", "Portfolio Builder", "Risk Profiler"]
    },
    {
        icon: Shield,
        title: "Save on Taxes",
        description: "Maximize tax savings with ELSS, PPF, NPS, and Section 80C",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        href: "/taxes",
        cta: "Explore Tax Savings",
        features: ["Tax Calculator", "ELSS Funds", "80C Guide"]
    },
    {
        icon: Wallet,
        title: "Get a Loan",
        description: "Compare personal, home, car, and business loans",
        color: "text-primary-600",
        bg: "bg-secondary-50",
        border: "border-secondary-200",
        href: "/loans",
        cta: "Compare Loans",
        features: ["EMI Calculator", "Eligibility Check", "Rate Comparison"]
    },
    {
        icon: Shield,
        title: "Protect My Family",
        description: "Find the best life, health, and term insurance plans",
        color: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-200",
        href: "/insurance",
        cta: "Compare Insurance",
        features: ["Premium Calculator", "Coverage Guide", "Claim Process"]
    },
    {
        icon: PiggyBank,
        title: "Save More",
        description: "Compare savings accounts, FDs, and RDs for best returns",
        color: "text-cyan-600",
        bg: "bg-cyan-50",
        border: "border-cyan-200",
        href: "/banking",
        cta: "Compare Rates",
        features: ["FD Calculator", "Interest Rates", "Tax Benefits"]
    },
    {
        icon: Building2,
        title: "Grow My Business",
        description: "Business loans, credit cards, and GST tools for entrepreneurs",
        color: "text-secondary-600",
        bg: "bg-secondary-50",
        border: "border-secondary-200",
        href: "/small-business",
        cta: "Business Solutions",
        features: ["GST Calculator", "Business Loans", "Credit Cards"]
    }
];

export default function GoalBasedDiscovery() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full mb-6">
                        <Target className="w-4 h-4 text-teal-600" />
                        <span className="text-sm font-semibold text-teal-700">Goal-Based Discovery</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                        What do you want to achieve?
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Start with your financial goal, and we'll guide you to the right products and tools
                    </p>
                </div>

                {/* Goal Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map((goal, index) => {
                        const Icon = goal.icon;
                        return (
                            <Card 
                                key={index}
                                className={`border-2 ${goal.border} hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden`}
                            >
                                <Link href={goal.href}>
                                    <CardContent className="p-6">
                                        {/* Icon & Title */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`w-12 h-12 ${goal.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <Icon className={`w-6 h-6 ${goal.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                                                    {goal.title}
                                                </h3>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    {goal.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {goal.features.map((feature, idx) => (
                                                <span 
                                                    key={idx}
                                                    className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md font-medium"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>

                                        {/* CTA */}
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                            <span className="text-sm font-semibold text-slate-700 group-hover:text-teal-700 transition-colors">
                                                {goal.cta}
                                            </span>
                                            <ArrowRight className={`w-5 h-5 ${goal.color} group-hover:translate-x-1 transition-transform`} />
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12">
                    <p className="text-slate-600 mb-4">Not sure where to start?</p>
                    <Link href="/risk-profiler">
                        <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-6 rounded-xl">
                            Take Our Risk Profiler
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

