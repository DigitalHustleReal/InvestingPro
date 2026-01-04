"use client";

import React from 'react';
import Link from 'next/link';
import {
    TrendingUp,
    PiggyBank,
    Landmark,
    Coins,
    Shield,
    CreditCard,
    Wallet,
    Building2,
    ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Updated to match recommended navigation structure (6 primary categories)
const categories = [
    {
        name: "Credit Cards",
        description: "Compare rewards, cashback, and travel benefits from top Indian banks.",
        icon: CreditCard,
        color: "text-indigo-500",
        bg: "bg-indigo-500/5",
        href: "/credit-cards",
        tag: "Best Rewards",
        subcategories: ["Rewards", "Cashback", "Travel", "Fuel", "Shopping"]
    },
    {
        name: "Loans",
        description: "Personal, home, car, education, gold, and business loans with lowest rates.",
        icon: Wallet,
        color: "text-emerald-500",
        bg: "bg-primary-500/5",
        href: "/loans",
        tag: "Low Rates",
        subcategories: ["Personal", "Home", "Car", "Education", "Gold", "Business"]
    },
    {
        name: "Banking",
        description: "Savings accounts, fixed deposits, recurring deposits with best interest rates.",
        icon: PiggyBank,
        color: "text-blue-500",
        bg: "bg-blue-500/5",
        href: "/banking",
        tag: "Up to 9.5%",
        subcategories: ["Savings", "FD", "RD", "Current"]
    },
    {
        name: "Investing",
        description: "Mutual funds, stocks, PPF/NPS, ELSS, gold, and demat accounts compared.",
        icon: TrendingUp,
        color: "text-teal-500",
        bg: "bg-teal-500/5",
        href: "/investing",
        tag: "15% Avg Yield",
        subcategories: ["Mutual Funds", "Stocks", "PPF & NPS", "ELSS", "Gold", "Demat"]
    },
    {
        name: "Insurance",
        description: "Life, health, term, car, bike, and travel insurance from top insurers.",
        icon: Shield,
        color: "text-amber-500", // Amber instead of rose/red
        bg: "bg-amber-500/5",    // Amber instead of rose/red
        href: "/insurance",
        tag: "Best Coverage",
        subcategories: ["Life", "Health", "Term", "Car", "Bike", "Travel"]
    },
    {
        name: "Tools",
        description: "Calculators, credit score checker, and comparison tools for smart decisions.",
        icon: Building2,
        color: "text-purple-500",
        bg: "bg-purple-500/5",
        href: "/calculators",
        tag: "Free Tools",
        subcategories: ["EMI", "SIP", "FD", "Tax", "Credit Score", "Compare"]
    }
];

export default function CategoryGrid() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                            Asset <span className="text-slate-400">Inventory</span>
                        </h2>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            Navigate the Indian financial landscape with precision instrumentation.
                            Our inventory scans 10,000+ data points daily for asymmetric yield.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            href={category.href}
                            className="group bg-white p-8 hover:bg-slate-50 transition-all duration-300 relative"
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div className={`w-12 h-12 rounded-2xl ${category.bg} ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <category.icon className="w-6 h-6" />
                                </div>
                                <Badge className="bg-slate-900/5 text-slate-500 border-0 text-[9px] font-semibold uppercase tracking-st px-2 py-0.5 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                    {category.tag}
                                </Badge>
                            </div>

                            <div className="flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight group-hover:text-indigo-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                                        {category.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-semibold text-indigo-500/0 group-hover:text-indigo-500 transition-all uppercase tracking-st">
                                    Analyze Inventory <ArrowUpRight size={12} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
