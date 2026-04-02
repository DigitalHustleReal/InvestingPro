"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";

interface Holding {
    id: string;
    asset_name: string;
    asset_type: string;
    asset_category: string;
    quantity: number;
    purchase_price: number;
    current_price: number;
    purchase_date: string;
    invested_amount: number;
    current_value: number;
    returns: number;
    returns_percentage: number;
}

interface HoldingsListProps {
    holdings: Holding[];
    onDelete: (id: string) => void;
}

export default function HoldingsList({ holdings, onDelete }: HoldingsListProps) {
    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {holdings.length === 0 ? (
                        <p className="text-center text-gray-500 py-8 italic">No holdings added yet</p>
                    ) : (
                        holdings.map((holding) => (
                            <div
                                key={holding.id}
                                className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-gray-900">{holding.asset_name}</h4>
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                                            {holding.asset_type}
                                        </Badge>
                                        <Badge className="text-[10px] bg-secondary-100 text-secondary-700 hover:bg-secondary-100 border-0 uppercase">
                                            {holding.asset_category}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                                        <span>{holding.quantity} units</span>
                                        <span className="hidden md:inline text-gray-300">•</span>
                                        <span>Avg: ₹{holding.purchase_price.toLocaleString('en-IN')}</span>
                                        <span className="hidden md:inline text-gray-300">•</span>
                                        <span>Current: ₹{holding.current_price.toLocaleString('en-IN')}</span>
                                        <span className="hidden md:inline text-gray-300">•</span>
                                        <span>{formatDate(holding.purchase_date)}</span>
                                    </div>
                                </div>

                                <div className="flex md:block items-center justify-between border-t md:border-t-0 pt-2 md:pt-0">
                                    <p className="text-[10px] uppercase text-gray-500 md:mb-1">Invested</p>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                        ₹{holding.invested_amount.toLocaleString('en-IN')}
                                    </p>
                                </div>

                                <div className="flex md:block items-center justify-between">
                                    <p className="text-[10px] uppercase text-gray-500 dark:text-gray-600 md:mb-1">Current</p>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                        ₹{holding.current_value.toLocaleString('en-IN')}
                                    </p>
                                </div>

                                <div className="flex md:block items-center justify-between min-w-[120px]">
                                    <p className="text-[10px] uppercase text-gray-500 md:mb-1 text-right">Returns</p>
                                    <div className="flex items-center gap-1 justify-end">
                                        {holding.returns >= 0 ? (
                                            <TrendingUp className="w-3 h-3 text-primary-600" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3 text-danger-600" />
                                        )}
                                        <span className={`font-bold text-sm ${holding.returns >= 0 ? 'text-primary-600' : 'text-danger-600'}`}>
                                            {holding.returns >= 0 ? '+' : ''}₹{Math.abs(holding.returns).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <p className={`text-xs font-medium text-right ${holding.returns >= 0 ? 'text-primary-600' : 'text-danger-600'}`}>
                                        {holding.returns >= 0 ? '+' : ''}{holding.returns_percentage}%
                                    </p>
                                </div>

                                <div className="flex justify-end pt-2 md:pt-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(holding.id)}
                                        className="text-danger-500 hover:text-danger-700 hover:bg-danger-50 h-8 w-8"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
