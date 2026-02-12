"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getChartColorPalette, getAssetColor } from '@/lib/utils/chart-colors';

interface AssetAllocationProps {
    holdings: any[];
}

export default function AssetAllocation({ holdings = [] }: AssetAllocationProps) {
    const allocation = holdings.reduce((acc: any, h) => {
        const category = h.asset_type || 'Equity';
        acc[category] = (acc[category] || 0) + (h.quantity * h.current_price);
        return acc;
    }, {});

    const data = Object.entries(allocation).map(([name, value]) => ({
        name,
        value
    }));

    // Use theme colors for chart
    const getColorForCategory = (category: string, index: number): string => {
        return getAssetColor(category) || getChartColorPalette(5)[index % 5];
    };

    return (
        <Card className="rounded-xl border-0 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden p-6 md:p-8">
            <CardHeader className="p-0 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary-50 dark:bg-secondary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        <PieChart className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Asset Allocation</CardTitle>
                        <p className="text-slate-500 font-medium text-sm">Diversification across categories</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 h-[300px]">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getColorForCategory(entry.name, index)} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontWeight: 'bold' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                        No data available
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
