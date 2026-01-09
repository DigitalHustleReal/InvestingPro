"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { 
    Calculator,
    TrendingUp,
    Wallet,
    FileText,
    ArrowRight,
    Sparkles
} from "lucide-react";

const quickTools = [
    {
        icon: Calculator,
        title: "EMI Calculator",
        description: "Calculate loan EMIs for home, personal, car loans",
        href: "/calculators/emi",
        color: "text-primary-600",
        bg: "bg-primary-50",
        popular: true
    },
    {
        icon: TrendingUp,
        title: "SIP Calculator",
        description: "Plan your mutual fund SIP investments",
        href: "/calculators/sip",
        color: "text-primary-600",
        bg: "bg-primary-50",
        popular: true
    },
    {
        icon: FileText,
        title: "Tax Calculator",
        description: "Calculate income tax and plan tax savings",
        href: "/calculators/tax",
        color: "text-primary-600",
        bg: "bg-primary-50",
        popular: true
    },
    {
        icon: Wallet,
        title: "FD Calculator",
        description: "Calculate fixed deposit returns and maturity",
        href: "/calculators/fd",
        color: "text-primary-600",
        bg: "bg-primary-50",
        popular: false
    },
    {
        icon: TrendingUp,
        title: "Goal Planning",
        description: "Plan for retirement, education, home purchase",
        href: "/calculators/goal-planning",
        color: "text-primary-600",
        bg: "bg-primary-50",
        popular: false
    },
    {
        icon: FileText,
        title: "GST Calculator",
        description: "Calculate GST for goods and services",
        href: "/calculators/gst",
        color: "text-primary-600",
        bg: "bg-primary-50",
        popular: false
    }
];

import { DotPattern } from "@/components/common/Patterns";

export default function QuickToolsSection() {
    return (
        <section className="relative py-20 bg-white dark:bg-slate-950 transition-colors overflow-hidden">
             <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
                <DotPattern className="text-slate-200 dark:text-slate-800 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">Quick Tools</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Calculate, Plan & Compare
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Use our free calculators to make informed financial decisions
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {quickTools.map((tool, index) => {
                        const Icon = tool.icon;
                        return (
                            <Link key={index} href={tool.href}>
                                <Card className="border-0 shadow-lg hover:shadow-xl hover:ring-2 hover:ring-primary-500/20 dark:hover:ring-primary-400/20 transition-all duration-300 group cursor-pointer h-full bg-white dark:bg-slate-900 dark:border dark:border-slate-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-14 h-14 ${tool.bg} dark:bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <Icon className={`w-7 h-7 ${tool.color} dark:text-primary-400`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                                                        {tool.title}
                                                    </h3>
                                                    {tool.popular && (
                                                        <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded">
                                                            Popular
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed mb-4">
                                                    {tool.description}
                                                </p>
                                                <div className="flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                                                    Calculate Now
                                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* View All CTA */}
                <div className="text-center">
                    <Link href="/calculators">
                        <Button 
                            variant="outline"
                            size="lg"
                            className="border-2 border-slate-300 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 text-slate-700 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-400 font-semibold px-8 py-6 rounded-xl hover:bg-transparent dark:hover:bg-slate-900/50"
                        >
                            View All Calculators
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

