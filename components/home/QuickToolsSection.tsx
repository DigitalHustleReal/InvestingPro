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
        color: "text-blue-600",
        bg: "bg-blue-50",
        popular: true
    },
    {
        icon: TrendingUp,
        title: "SIP Calculator",
        description: "Plan your mutual fund SIP investments",
        href: "/calculators/sip",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        popular: true
    },
    {
        icon: FileText,
        title: "Tax Calculator",
        description: "Calculate income tax and plan tax savings",
        href: "/calculators/tax",
        color: "text-amber-600",
        bg: "bg-amber-50",
        popular: true
    },
    {
        icon: Wallet,
        title: "FD Calculator",
        description: "Calculate fixed deposit returns and maturity",
        href: "/calculators/fd",
        color: "text-cyan-600",
        bg: "bg-cyan-50",
        popular: false
    },
    {
        icon: TrendingUp,
        title: "Goal Planning",
        description: "Plan for retirement, education, home purchase",
        href: "/calculators/goal-planning",
        color: "text-purple-600",
        bg: "bg-purple-50",
        popular: false
    },
    {
        icon: FileText,
        title: "GST Calculator",
        description: "Calculate GST for goods and services",
        href: "/calculators/gst",
        color: "text-violet-600",
        bg: "bg-violet-50",
        popular: false
    }
];

export default function QuickToolsSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        <span className="text-sm font-semibold text-teal-700">Quick Tools</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                        Calculate, Plan & Compare
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Use our free calculators to make informed financial decisions
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {quickTools.map((tool, index) => {
                        const Icon = tool.icon;
                        return (
                            <Link key={index} href={tool.href}>
                                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-14 h-14 ${tool.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <Icon className={`w-7 h-7 ${tool.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                                                        {tool.title}
                                                    </h3>
                                                    {tool.popular && (
                                                        <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-semibold rounded">
                                                            Popular
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                                    {tool.description}
                                                </p>
                                                <div className="flex items-center text-sm font-semibold text-teal-600 group-hover:text-teal-700">
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
                            className="border-2 border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-700 font-semibold px-8 py-6 rounded-xl"
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

