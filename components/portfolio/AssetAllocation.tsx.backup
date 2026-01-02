"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

    const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

    return (
        <Card className="rounded-[3rem] border-0 shadow-2xl bg-white overflow-hidden p-10">
            <CardHeader className="p-0 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <PieChart className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Asset Allocation</CardTitle>
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
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontWeight: 'bold' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        No data available
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
