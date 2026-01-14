"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Newspaper, ChevronRight } from 'lucide-react';

const newsItems = [
    {
        id: 1,
        source: "RBI",
        title: "RBI Holds Repo Rate at 6.5%, Focuses on Inflation Control",
        time: "2h ago",
        impact: "high",
        tag: "Banking"
    },
    {
        id: 2,
        source: "Economic Times",
        title: "New Tax Regime: 80% of Taxpayers Opt for Simplified Structure",
        time: "4h ago",
        impact: "high",
        tag: "Taxation"
    },
    {
        id: 3,
        source: "Mint",
        title: "Health Insurance Premium Hikes Expected in Q2 2026",
        time: "6h ago",
        impact: "medium",
        tag: "Insurance"
    },
    {
        id: 4,
        source: "Business Standard",
        title: "SBI Launches New Fixed Deposit Scheme with Higher Returns",
        time: "8h ago",
        impact: "medium",
        tag: "Banking"
    }
];

export default function NewsSentiment() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Newspaper size={14} className="text-primary-400" />
                    Financial News Digest
                </h3>
                <Badge variant="outline" className="text-[9px] font-bold border-slate-300 text-slate-600">LIVE FEED</Badge>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {newsItems.map((news) => (
                    <Card key={news.id} className="bg-white border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all group cursor-pointer overflow-hidden rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{news.source}</span>
                                    <span className="text-[10px] text-slate-400">•</span>
                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                        <Clock size={10} /> {news.time}
                                    </span>
                                </div>
                                <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest flex items-center gap-1 ${
                                    news.impact === 'high'
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'bg-slate-100 text-slate-600'
                                }`}>
                                    <AlertCircle size={10} />
                                    {news.impact} Impact
                                </div>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors leading-snug">
                                {news.title}
                            </h4>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                <Badge className="bg-slate-100 text-slate-700 border-0 text-[10px] font-bold">{news.tag}</Badge>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 group-hover:text-primary-600 transition-colors">
                                    Read More <ChevronRight size={12} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <button className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-[10px] font-semibold text-slate-600 uppercase tracking-wider hover:border-primary-400 hover:text-primary-600 transition-all">
                View All Financial News
            </button>
        </div>
    );
}
