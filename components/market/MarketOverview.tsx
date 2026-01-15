"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, BarChart2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

// Mock data for sparklines
const generateSparkData = (trend: 'up' | 'down' | 'stable') => {
    const data = [];
    let val = 50;
    for (let i = 0; i < 20; i++) {
        val = val + (Math.random() * 4 - 2) + (trend === 'up' ? 1 : trend === 'down' ? -1 : 0);
        data.push({ v: val });
    }
    return data;
};

const MACRO_INDICATORS = [
    { name: "Repo Rate", value: "6.50%", change: "Unchanged", trend: "stable", data: generateSparkData('stable') },
    { name: "Inflation (CPI)", value: "4.85%", change: "-0.2% (MoM)", trend: "down", data: generateSparkData('down') },
    { name: "GDP Growth", value: "7.6%", change: "Q3 FY24", trend: "up", data: generateSparkData('up') },
    { name: "USD / INR", value: "â‚¹83.45", change: "+0.05", trend: "up", data: generateSparkData('up') },
];

const TRENDS = [
    { name: "Gold", change: "+12% YTD", positive: true },
    { name: "Real Estate", change: "+8% YoY", positive: true },
    { name: "Fixed Deposits", change: "Peak Rates", positive: true },
    { name: "Small Caps", change: "High Volatility", positive: false },
    { name: "Crude Oil", change: "$89/bbl", positive: false },
];

export default function MarketOverview() {
    return (
        <Card className="border-slate-800 bg-slate-950 text-slate-50 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-slate-800 bg-slate-900/50 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="text-primary-400 w-5 h-5" />
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-300">Macro Indicators</CardTitle>
                    </div>
                    <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px] font-mono">
                        INDIA
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                    {MACRO_INDICATORS.map((index, idx) => (
                        <div key={idx} className="p-4 hover:bg-slate-900/30 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{index.name}</h4>
                                    <div className="text-lg font-bold text-slate-50">{index.value}</div>
                                </div>
                                <Badge className={`px-1.5 py-0.5 text-[10px] font-bold border-0 ${
                                    index.trend === 'up' ? 'bg-primary-500/10 text-primary-400' : 
                                    index.trend === 'down' ? 'bg-primary-500/10 text-primary-400' :
                                    'bg-slate-500/10 text-slate-400'
                                }`}>
                                    {index.change}
                                </Badge>
                            </div>
                            
                            {/* Sparkline */}
                            <div className="h-10 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={index.data}>
                                        <defs>
                                            <linearGradient id={`grad_macro_${idx}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={index.trend === 'up' ? "#2dd4bf" : "#6366f1"} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={index.trend === 'up' ? "#2dd4bf" : "#6366f1"} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <YAxis hide domain={['dataMin', 'dataMax']} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="v" 
                                            stroke={index.trend === 'up' ? "#2dd4bf" : index.trend === 'down' ? "#6366f1": "#94a3b8"} 
                                            fill={`url(#grad_macro_${idx})`} 
                                            strokeWidth={2} 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Stats Row */}
                <div className="border-t border-slate-800 p-3 bg-slate-900/30 flex items-center justify-between text-xs overflow-x-auto whitespace-nowrap gap-4">
                    <div className="flex items-center gap-2 text-slate-400 font-medium">
                        <BarChart2 size={12} />
                        <span>Asset Trends:</span>
                    </div>
                    <div className="flex gap-3">
                        {TRENDS.map((sec, i) => (
                            <div key={i} className="flex items-center gap-1">
                                <span className="text-slate-300 font-semibold">{sec.name}</span>
                                <span className={sec.positive ? "text-primary-400" : "text-danger-400"}>
                                    {sec.change}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
