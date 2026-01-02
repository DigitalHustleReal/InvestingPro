"use client";

import React, { useEffect, useState } from 'react';
import { getMarketIndices, MarketIndex } from '@/lib/market/service';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MarketOverview() {
    const [indices, setIndices] = useState<MarketIndex[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMarketIndices();
                setIndices(data);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // 5s refresh
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="h-40 bg-slate-50 animate-pulse rounded-xl max-w-7xl mx-auto my-8"></div>;
    }

    return (
        <section className="py-8 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 p-2 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Market Pulse</h2>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Live Updates
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {indices.map((item) => {
                        const isPositive = item.trend === 'up';
                        const isNegative = item.trend === 'down';
                        const colorClass = isPositive ? 'text-emerald-500' : isNegative ? 'text-rose-500' : 'text-slate-400';
                        
                        return (
                            <Card key={item.id} className="p-4 hover:shadow-md transition-shadow border-slate-200">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded w-fit">
                                            {item.name}
                                        </span>
                                        {item.subtext && (
                                            <span className="text-[10px] text-slate-400 mt-1 ml-0.5 font-medium">
                                                {item.subtext}
                                            </span>
                                        )}
                                    </div>
                                    <div className={colorClass}>
                                        {isPositive && <ArrowUpRight className="w-4 h-4" />}
                                        {isNegative && <ArrowDownRight className="w-4 h-4" />}
                                        {item.trend === 'neutral' && <div className="w-4 h-4" />}
                                    </div>
                                </div>
                                <div className="mt-2 text-right">
                                    <div className="text-lg font-bold text-slate-900 tracking-tight">
                                        {item.displayValue}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
