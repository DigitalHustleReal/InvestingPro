"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, MoreHorizontal, Eye } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Mock Sparkline Data
const generateSparkData = () => {
    return Array.from({ length: 20 }, (_, i) => ({ v: 50 + Math.random() * 20 + i }));
};

const WATCHLIST = [
    { symbol: "RELIANCE", name: "Reliance Industries", price: "2,980.50", change: "+1.5%", positive: true, data: generateSparkData() },
    { symbol: "HDFCBANK", name: "HDFC Bank Ltd", price: "1,540.30", change: "-0.8%", positive: false, data: generateSparkData() },
    { symbol: "TATASTEEL", name: "Tata Steel", price: "145.20", change: "+2.1%", positive: true, data: generateSparkData() },
    { symbol: "INFY", name: "Infosys Ltd", price: "1,450.60", change: "+0.5%", positive: true, data: generateSparkData() },
];

export default function WatchlistSparklines() {
    return (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary-500" /> My Watchlist
                </CardTitle>
                <button className="text-slate-400 hover:text-primary-500">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {WATCHLIST.map((stock, idx) => (
                        <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="w-1/3">
                                <div className="font-bold text-slate-900 dark:text-white">{stock.symbol}</div>
                                <div className="text-xs text-slate-500 truncate">{stock.name}</div>
                            </div>
                            
                            {/* Sparkline */}
                            <div className="w-1/3 h-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stock.data}>
                                        <Line 
                                            type="monotone" 
                                            dataKey="v" 
                                            stroke={stock.positive ? "#10b981" : "#f43f5e"} 
                                            strokeWidth={2} 
                                            dot={false} 
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="w-1/3 text-right">
                                <div className="font-bold text-slate-900 dark:text-white">₹{stock.price}</div>
                                <div className={`text-xs font-bold ${stock.positive ? 'text-primary-600 dark:text-primary-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                    {stock.change}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
