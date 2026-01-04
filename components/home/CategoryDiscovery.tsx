
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { 
    CreditCard, 
    Landmark, 
    TrendingUp, 
    Shield, 
    Calculator, 
    Newspaper,
    BookOpen,
    Gem
} from "lucide-react";

const categories = [
    {
        title: "Credit Cards",
        icon: CreditCard,
        description: "Compare reward rates, cashback & fees",
        href: "/credit-cards",
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
        title: "Loans",
        icon: Landmark,
        description: "Lowest rates for Home, Personal & Car loans",
        href: "/loans",
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
        title: "Insurance",
        icon: Shield,
        description: "Protect your family with curated plans",
        href: "/insurance",
        color: "text-rose-500",
        bg: "bg-rose-50 dark:bg-rose-900/20"
    },
    {
        title: "Mutual Funds",
        icon: TrendingUp,
        description: "Direct plans with zero commission",
        href: "/mutual-funds",
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
        title: "Calculators",
        icon: Calculator,
        description: "SIP, EMI, Tax & Retirement planners",
        href: "/calculators",
        color: "text-orange-500",
        bg: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
        title: "Market News",
        icon: Newspaper,
        description: "Real-time updates & expert analysis",
        href: "/news",
        color: "text-cyan-500",
        bg: "bg-cyan-50 dark:bg-cyan-900/20"
    }
];

export default function CategoryDiscovery() {
    return (
        <section className="py-16 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Explore by Category</h2>
                    <p className="text-slate-600 dark:text-slate-400">Everything you need to manage your wealth.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat, i) => (
                        <Link href={cat.href} key={i}>
                            <Card className="h-full hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all cursor-pointer bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                                    <div className={`w-12 h-12 rounded-full ${cat.bg} flex items-center justify-center mb-4`}>
                                        <cat.icon className={`w-6 h-6 ${cat.color}`} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">{cat.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {cat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
