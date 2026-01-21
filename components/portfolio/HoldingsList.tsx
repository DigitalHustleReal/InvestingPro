"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Trash2, TrendingUp, TrendingDown, ArrowUpRight, BarChart3 } from "lucide-react";

interface HoldingsListProps {
    holdings: any[];
    onDelete: (id: string) => void;
}

export default function HoldingsList({ holdings = [], onDelete }: HoldingsListProps) {
    return (
        <Card className="rounded-xl border-0 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden p-6 md:p-8">
            <CardHeader className="p-0 mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Investment Ledger</CardTitle>
                            <p className="text-slate-500 font-medium text-sm">Detailed overview of your positions</p>
                        </div>
                    </div>
                    <Badge className="bg-slate-100 text-slate-500 border-0 rounded-xl px-4 py-2 font-semibold uppercase tracking-st text-[9px]">
                        {holdings.length} Active Positions
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="pb-6 text-[10px] font-semibold text-slate-400 uppercase tracking-st">Asset Name</th>
                                <th className="pb-6 text-[10px] font-semibold text-slate-400 uppercase tracking-st text-right">Avg Price</th>
                                <th className="pb-6 text-[10px] font-semibold text-slate-400 uppercase tracking-st text-right">Quantity</th>
                                <th className="pb-6 text-[10px] font-semibold text-slate-400 uppercase tracking-st text-right">Market Value</th>
                                <th className="pb-6 text-[10px] font-semibold text-slate-400 uppercase tracking-st text-right">Returns</th>
                                <th className="pb-6 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {holdings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <p className="text-slate-400 font-semibold uppercase tracking-widest text-">Your ledger is empty. Begin by adding a position.</p>
                                    </td>
                                </tr>
                            ) : (
                                holdings.map((holding) => {
                                    const currentValue = holding.quantity * holding.current_price;
                                    const investmentValue = holding.quantity * holding.average_price;
                                    const profit = currentValue - investmentValue;
                                    const profitPercent = (profit / investmentValue) * 100;
                                    const isProfit = profit >= 0;

                                    return (
                                        <tr key={holding.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-semibold text- uppercase">
                                                        {holding.symbol?.slice(0, 2) || holding.asset_name?.slice(0, 2) || 'AS'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 leading-none mb-1">{holding.asset_name}</p>
                                                        <Badge variant="outline" className="text-[8px] font-bold uppercase py-0 px-1.5 border-slate-100 text-slate-400">
                                                            {holding.asset_type || 'Equity'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 text-right font-bold text-slate-600 text-sm">₹{holding.average_price.toLocaleString('en-IN')}</td>
                                            <td className="py-6 text-right font-semibold text-slate-900 text-">{holding.quantity}</td>
                                            <td className="py-6 text-right font-semibold text-slate-900 text-">₹{currentValue.toLocaleString('en-IN')}</td>
                                            <td className="py-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <div className={`flex items-center gap-1 font-bold text-sm ${isProfit ? 'text-primary-600' : 'text-danger-600'}`}>
                                                        {isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                        {profitPercent.toFixed(2)}%
                                                    </div>
                                                    <p className={`text-[10px] font-bold ${isProfit ? 'text-primary-400' : 'text-danger-400'}`}>+₹{Math.abs(profit).toLocaleString('en-IN')}</p>
                                                </div>
                                            </td>
                                            <td className="py-6 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onDelete(holding.id)}
                                                    className="w-10 h-10 rounded-xl text-slate-300 hover:text-danger-600 hover:bg-danger-50 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
