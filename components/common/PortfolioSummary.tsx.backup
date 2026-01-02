"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";

interface Holding {
    invested_amount: number;
    current_value: number;
}

interface PortfolioSummaryProps {
    holdings: Holding[];
}

export default function PortfolioSummary({ holdings }: PortfolioSummaryProps) {
    const totalInvested = holdings.reduce((sum, h) => sum + h.invested_amount, 0);
    const totalCurrent = holdings.reduce((sum, h) => sum + h.current_value, 0);
    const totalReturns = totalCurrent - totalInvested;
    const totalReturnsPercent = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : "0.00";

    const stats = [
        {
            label: 'Total Invested',
            value: `₹${totalInvested.toLocaleString('en-IN')}`,
            icon: Wallet,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            label: 'Current Value',
            value: `₹${totalCurrent.toLocaleString('en-IN')}`,
            icon: Target,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            label: 'Total Returns',
            value: `₹${Math.abs(totalReturns).toLocaleString('en-IN')}`,
            icon: totalReturns >= 0 ? TrendingUp : TrendingDown,
            color: totalReturns >= 0 ? 'text-emerald-600' : 'text-red-600',
            bgColor: totalReturns >= 0 ? 'bg-emerald-100' : 'bg-red-100',
            subValue: `${totalReturns >= 0 ? '+' : '-'}${Math.abs(Number(totalReturnsPercent))}%`
        },
        {
            label: 'Total Holdings',
            value: holdings.length,
            icon: Wallet,
            color: 'text-slate-600',
            bgColor: 'bg-slate-100'
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                    <Card key={idx}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-2">
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            {stat.subValue && (
                                <p className={`text-sm font-medium ${stat.color} mt-1`}>{stat.subValue}</p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
