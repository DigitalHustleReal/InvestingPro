"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { 
    Sparkles,
    Target,
    CreditCard,
    Calculator,
    Wallet,
    TrendingUp,
    ChevronRight,
    Zap,
    Shield,
    PiggyBank
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DecisionHelperProps {
    category: 'credit_card' | 'loan' | 'mutual_fund' | 'all';
    variant?: 'compact' | 'full' | 'inline';
    className?: string;
}

const categoryTools = {
    credit_card: [
        {
            id: 'wallet-architect',
            title: 'Wallet Architect',
            description: 'Find the perfect card combo for your spending',
            icon: Wallet,
            href: '/credit-cards/smart-compare',
            color: 'from-violet-500 to-purple-600',
            badge: 'Most Popular'
        },
        {
            id: 'approval-check',
            title: 'Approval Checker',
            description: 'Know your approval probability before applying',
            icon: Shield,
            href: '/credit-cards/smart-compare#approval',
            color: 'from-emerald-500 to-teal-600',
        },
        {
            id: 'break-even',
            title: 'Break-Even Calculator',
            description: 'Is the annual fee worth it?',
            icon: Calculator,
            href: '/credit-cards/smart-compare#breakeven',
            color: 'from-amber-500 to-orange-600',
        }
    ],
    loan: [
        {
            id: 'eligibility',
            title: 'Eligibility Checker',
            description: 'Check approval probability across 30+ lenders',
            icon: Shield,
            href: '/loans/eligibility-checker',
            color: 'from-emerald-500 to-teal-600',
            badge: 'Instant Check'
        },
        {
            id: 'emi-calculator',
            title: 'EMI Calculator',
            description: 'Plan your monthly payments',
            icon: Calculator,
            href: '/loans#emi-calculator',
            color: 'from-blue-500 to-indigo-600',
        },
    ],
    mutual_fund: [
        {
            id: 'goal-planner',
            title: 'Goal Planner',
            description: 'Find funds that match your financial goals',
            icon: Target,
            href: '/mutual-funds/goal-planner',
            color: 'from-primary-500 to-secondary-600',
            badge: 'AI Powered'
        },
        {
            id: 'sip-calculator',
            title: 'SIP Calculator',
            description: 'Calculate future value of your SIPs',
            icon: TrendingUp,
            href: '/mutual-funds#sip-calculator',
            color: 'from-green-500 to-emerald-600',
        },
    ],
    all: [] // Will be populated dynamically
};

// Combine all tools for 'all' category
categoryTools.all = [
    ...categoryTools.credit_card.slice(0, 1),
    ...categoryTools.loan.slice(0, 1),
    ...categoryTools.mutual_fund.slice(0, 1),
];

export default function DecisionHelper({ category, variant = 'full', className }: DecisionHelperProps) {
    const tools = categoryTools[category] || categoryTools.all;

    if (variant === 'inline') {
        return (
            <div className={cn("flex gap-3 overflow-x-auto pb-2 scrollbar-hide", className)}>
                {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Link key={tool.id} href={tool.href} className="shrink-0">
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r text-white transition-transform hover:scale-105",
                                tool.color
                            )}>
                                <Icon className="w-5 h-5" />
                                <span className="font-semibold text-sm whitespace-nowrap">{tool.title}</span>
                                <ChevronRight className="w-4 h-4 opacity-70" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <Card className={cn("rounded-2xl border-slate-200 dark:border-slate-800", className)}>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-primary-500" />
                        <span className="font-bold text-sm text-slate-900 dark:text-white">Decision Tools</span>
                    </div>
                    <div className="space-y-2">
                        {tools.slice(0, 2).map((tool) => {
                            const Icon = tool.icon;
                            return (
                                <Link key={tool.id} href={tool.href}>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                        <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center", tool.color)}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{tool.title}</p>
                                            <p className="text-xs text-slate-500 truncate">{tool.description}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Full variant
    return (
        <Card className={cn("rounded-3xl border-0 shadow-xl overflow-hidden", className)}>
            <CardContent className="p-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Decision Helper</h3>
                            <p className="text-sm text-slate-600">Tools to help you decide faster</p>
                        </div>
                    </div>
                </div>

                {/* Tools Grid */}
                <div className="p-6 space-y-4">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link key={tool.id} href={tool.href}>
                                <div className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                        tool.color
                                    )}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-slate-900 dark:text-white">{tool.title}</h4>
                                            {tool.badge && (
                                                <Badge className="bg-primary-100 text-primary-700 border-0 text-[10px]">
                                                    {tool.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-600">{tool.description}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="shrink-0 rounded-xl group-hover:bg-primary-100 group-hover:text-primary-700">
                                        Try Now
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer CTA */}
                {category !== 'all' && (
                    <div className="px-6 pb-6">
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 border border-primary-100 dark:border-primary-900">
                            <p className="text-sm text-slate-600 dark:text-slate-600 mb-3">
                                <Zap className="w-4 h-4 inline mr-1 text-primary-500" />
                                <strong>Pro Tip:</strong> Use our decision tools to make informed choices without endless browsing.
                            </p>
                            <Link href={category === 'credit_card' ? '/credit-cards/smart-compare' : 
                                        category === 'loan' ? '/loans/eligibility-checker' : 
                                        '/mutual-funds/goal-planner'}>
                                <Button className="w-full h-11 rounded-xl bg-primary-700 hover:bg-primary-800">
                                    Get Personalized Recommendation
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
