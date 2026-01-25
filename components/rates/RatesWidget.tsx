"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient as api } from '@/lib/api-client';

interface RateItem {
    key?: string;
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

export default function RatesWidget({ category, title, className }: RatesWidgetProps) {
    const [rates, setRates] = useState<RateItem[]>([]);
    const [loading, setLoading] = useState(true);
    const displayTitle = title || "Current Rates";

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const data = await api.entities.Rates.list(category);
                if (data && data.length > 0) {
                    setRates(data);
                } else {
                    // Fallback or empty state
                    // console.warn("No rates found for category:", category);
                    // Optionally set empty or keep loading false to show "No Data"
                }
            } catch (error) {
                console.error("Failed to load rates", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, [category]);

    if (loading) {
         return (
             <Card className={cn("bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800", className)}>
                <CardContent className="p-6 flex justify-center items-center h-40">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </CardContent>
             </Card>
         );
    }

    if (rates.length === 0) {
        return null; // Don't show empty widget
    }

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
