"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Wallet, PieChart } from "lucide-react";

interface PortfolioSummaryProps {
    holdings: any[];
}

export default function PortfolioSummary({ holdings = [] }: PortfolioSummaryProps) {
    const totalValue = holdings.reduce((sum, h) => sum + (h.quantity * h.current_price), 0);
    const totalInvestment = holdings.reduce((sum, h) => sum + (h.quantity * h.average_price), 0);
    const totalProfit = totalValue - totalInvestment;
    const profitPercentage = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;

    const stats = [
        {
            label: "Current Value",
            value: `₹${totalValue.toLocaleString('en-IN')}`,
            icon: Wallet,
            color: "text-primary-600",
            bg: "bg-secondary-50"
        },
        {
            label: "Total Investment",
            value: `₹${totalInvestment.toLocaleString('en-IN')}`,
            icon: DollarSign,
            color: "text-slate-600",
            bg: "bg-slate-50"
        },
        {
            label: "Overall Profit",
            value: `₹${Math.abs(totalProfit).toLocaleString('en-IN')}`,
            subValue: `${profitPercentage.toFixed(2)}%`,
            icon: totalProfit >= 0 ? TrendingUp : TrendingDown,
            color: totalProfit >= 0 ? "text-primary-600" : "text-rose-600",
            bg: totalProfit >= 0 ? "bg-primary-50" : "bg-rose-50"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="rounded-[2.5rem] border-0 shadow-xl overflow-hidden group hover:-translate-y-1 transition-all">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:rotate-6 transition-transform`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            {stat.subValue && (
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${stat.bg} ${stat.color} uppercase tracking-widest`}>
                                    {stat.subValue}
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
