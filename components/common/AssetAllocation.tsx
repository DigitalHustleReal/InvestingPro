"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getAssetColor } from '@/lib/utils/chart-colors';

interface Holding {
    asset_category: string;
    current_value: number;
}

interface AssetAllocationProps {
    holdings: Holding[];
}

export default function AssetAllocation({ holdings }: AssetAllocationProps) {
    const categoryTotals = holdings.reduce((acc: Record<string, number>, holding) => {
        const category = holding.asset_category;
        acc[category] = (acc[category] || 0) + holding.current_value;
        return acc;
    }, {});

    const data = Object.entries(categoryTotals).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
    }));

    // Get color for each asset category using theme colors
    const getColorForCategory = (category: string): string => {
        return getAssetColor(category);
    };

    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    if (holdings.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
                    No data available
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getColorForCategory(entry.name)} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number | undefined) => `₹${(value || 0).toLocaleString('en-IN')}`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[item.name] || '#94a3b8' }} />
                                <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                                ₹{item.value.toLocaleString('en-IN')} ({totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : 0}%)
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
