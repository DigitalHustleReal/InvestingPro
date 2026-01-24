"use client";

import React from 'react';
import Link from 'next/link';
import { 
    Calculator, 
    ArrowRightLeft, 
    TrendingUp, 
    ArrowRight,
    Zap,
    ShieldCheck
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';

interface SeamlessCTAProps {
    category: string;
}

export default function SeamlessCTA({ category }: SeamlessCTAProps) {
    const actions = getContextualActions(category);

    if (actions.length === 0) return null;

    return (
        <section className="my-16 border-t border-slate-200 pt-16">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                    <Zap className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Next Steps for You</h2>
                    <p className="text-slate-500 text-sm">Take data-driven actions based on this article</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {actions.map((action, idx) => (
                    <Card key={idx} className="relative group overflow-hidden border-0 shadow-xl rounded-[2rem] bg-primary-950 text-white p-8 hover:scale-[1.02] transition-all duration-300">
                        {/* Gradient Blobs */}
                        <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${action.color}-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                        
                        <div className="relative z-10 h-full flex flex-col">
                            <div className={`w-14 h-14 rounded-2xl bg-${action.color}-500/10 flex items-center justify-center mb-6 border border-${action.color}-500/20`}>
                                <action.icon className={`w-7 h-7 text-${action.color}-400`} />
                            </div>

                            <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-primary-400 transition-colors">
                                {action.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                                {action.description}
                            </p>

                            <Link href={action.href} className="mt-auto">
                                <Button className="w-full bg-white text-primary-950 hover:bg-primary-500 hover:text-white font-bold rounded-xl py-6 flex items-center justify-center gap-2 group/btn border border-transparent hover:border-primary-400/20">
                                    {action.cta}
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            {action.trustBadge && (
                                <div className="flex items-center gap-1.5 mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                    <ShieldCheck className="w-3 h-3 text-primary-500" />
                                    {action.trustBadge}
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
}

function getContextualActions(category: string) {
    const slug = (category || '').toLowerCase();

    if (slug.includes('investing') || slug.includes('mutual')) {
        return [
            {
                title: "SIP Calculator",
                description: "See exactly how much wealth you can build with small monthly investments over time.",
                icon: Calculator,
                href: "/calculators?type=sip",
                cta: "Calculate Now",
                color: "teal",
                trustBadge: "Exact Inflation Adjusted"
            },
            {
                title: "Compare Funds",
                description: "Don't pick blindly. Compare top-rated mutual funds side-by-side on 15+ parameters.",
                icon: ArrowRightLeft,
                href: "/investing/compare",
                cta: "Compare Now",
                color: "secondary",
                trustBadge: "Direct vs Regular"
            },
            {
                title: "Top Stock Picks",
                description: "Access our exclusive list of outperforming stocks analyzed by SEBI registered experts.",
                icon: TrendingUp,
                href: "/stocks",
                cta: "View Stocks",
                color: "amber",
                trustBadge: "Real-time Data"
            }
        ];
    }

    if (slug.includes('credit-cards')) {
        return [
            {
                title: "Reward Calculator",
                description: "Estimate how much you'll save based on your monthly spending patterns.",
                icon: Calculator,
                href: "/calculators?type=rewards",
                cta: "Calculate Savings",
                color: "rose",
                trustBadge: "Value Analysis"
            },
            {
                title: "Card Comparison",
                description: "Compare features, fees, and real-world value of top credit cards in India.",
                icon: ArrowRightLeft,
                href: "/credit-cards/compare",
                cta: "Compare Cards",
                color: "teal",
                trustBadge: "Verified Fees"
            },
            {
                title: "Check Eligibility",
                description: "Find cards you're most likely to get approved for without affecting your credit score.",
                icon: ShieldCheck,
                href: "/products?category=credit_card",
                cta: "Find My Card",
                color: "secondary",
                trustBadge: "Soft Check Only"
            }
        ];
    }

    if (slug.includes('loans') || slug.includes('banking')) {
        return [
            {
                title: "EMI Calculator",
                description: "Calculate your monthly outgoings and see a full amortization schedule.",
                icon: Calculator,
                href: "/calculators/emi",
                cta: "Calculate EMI",
                color: "teal",
                trustBadge: "Bank Accurate"
            },
            {
                title: "Low ROI Search",
                description: "We've mapped the lowest interest rates across all top Indian banks. Find your best rate.",
                icon: ArrowRightLeft,
                href: "/loans/compare",
                cta: "Find Low Rates",
                color: "amber",
                trustBadge: "Updated 2h ago"
            }
        ];
    }

    // Default fallback
    return [
        {
            title: "Financial Planning",
            description: "Use our comprehensive goal planning tool to map out your financial future.",
            icon: Calculator,
            href: "/calculators/goal-planning",
            cta: "Plan Now",
            color: "teal",
            trustBadge: "Expert Certified"
        },
        {
            title: "Expert Review",
            description: "Read in-depth editorial reviews of the newest financial products in India.",
            icon: ShieldCheck,
            href: "/reviews",
            cta: "Read Reviews",
            color: "secondary",
            trustBadge: "100% Independent"
        }
    ];
}
