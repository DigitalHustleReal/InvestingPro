"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RateItem {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
    subtext?: string;
}

interface RatesWidgetProps {
    category: 'loans' | 'investing' | 'banking';
    title?: string;
    className?: string;
}

const RATES_DATA: Record<string, RateItem[]> = {
    loans: [
        { label: "Home Loan (SBI)", value: "8.40%", trend: "stable", subtext: "min" },
        { label: "HDFC Home Loan", value: "8.35%", trend: "down", subtext: "special offer" },
        { label: "Personal Loan (Avg)", value: "10.50%", trend: "up", subtext: "starts from" },
        { label: "Car Loan", value: "8.85%", trend: "stable" }
    ],
    investing: [
        { label: "Gold (24K)", value: "₹72,450", trend: "up", subtext: "per 10g" },
        { label: "Silver", value: "₹83,100", trend: "up", subtext: "per kg" },
        { label: "PPF Rate", value: "7.1%", trend: "stable", subtext: "govt backed" },
        { label: "Inflation", value: "4.85%", trend: "down" }
    ],
    banking: [
        { label: "SBI FD (1Y)", value: "6.80%", trend: "stable" },
        { label: "HDFC FD (1Y)", value: "6.60%", trend: "stable" },
        { label: "Small Bank FD", value: "8.25%", trend: "up", subtext: "Senior Citizen" },
        { label: "Savings Acc", value: "3.50%", trend: "stable" }
    ]
};

export default function RatesWidget({ category, title, className }: RatesWidgetProps) {
    const rates = RATES_DATA[category] || RATES_DATA['banking'];
    const displayTitle = title || "Current Rates";

    return (
        <Card className={cn("bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800", className)}>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    {displayTitle}
                    <span className="text-[10px] font-normal text-slate-500 uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Live</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 dark:divide-slate-800">
                    {rates.map((rate, idx) => (
                        <div key={idx} className="p-4 flex flex-col items-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <span className="text-xs text-slate-500 font-medium mb-1">{rate.label}</span>
                            <div className="flex items-center gap-1">
                                <span className={cn("text-lg font-bold", 
                                    rate.trend === 'up' ? "text-success-600" : 
                                    rate.trend === 'down' ? "text-primary-600" : "text-slate-900 dark:text-white"
                                )}>
                                    {rate.value}
                                </span>
                            </div>
                            {rate.subtext && <span className="text-[10px] text-slate-400">{rate.subtext}</span>}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
