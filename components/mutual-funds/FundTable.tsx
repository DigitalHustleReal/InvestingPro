"use client";

import React from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from "lucide-react";
import { useCompare } from '@/contexts/CompareContext';

interface FundTableProps {
    funds: any[];
}

export function FundTable({ funds }: FundTableProps) {
    const { addProduct, removeProduct, isSelected } = useCompare();

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-8" />
                        <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Fund Name</th>
                        <th className="text-center px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="text-center px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Risk</th>
                        <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">1Y</th>
                        <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">3Y</th>
                        <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">5Y</th>
                        <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Exp. Ratio</th>
                        <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider" />
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {funds.map((fund) => {
                        const selected = isSelected(fund.id);
                        return (
                            <tr
                                key={fund.id}
                                className={`hover:bg-green-50/30 transition-colors ${selected ? 'bg-green-50/50' : ''}`}
                            >
                                {/* Checkbox */}
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={() => selected ? removeProduct(fund.id) : addProduct(fund)}
                                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500/30 cursor-pointer"
                                        aria-label={`Compare ${fund.name}`}
                                    />
                                </td>

                                {/* Fund name + category + house */}
                                <td className="px-4 py-3">
                                    <Link href={`/mutual-funds/${fund.id}`} className="group">
                                        <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors leading-tight">{fund.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{fund.category}</span>
                                            <span className="text-[10px] text-gray-400">{fund.fund_house}</span>
                                        </div>
                                    </Link>
                                </td>

                                {/* Rating stars */}
                                <td className="px-3 py-3 text-center">
                                    <div className="flex gap-0.5 justify-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={11} className={i < (fund.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                                        ))}
                                    </div>
                                </td>

                                {/* Risk — simple badge instead of gauge */}
                                <td className="px-3 py-3 text-center">
                                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                                        fund.risk === 'Low' || fund.risk === 'Low to Moderate' ? 'bg-green-50 text-green-700' :
                                        fund.risk === 'High' || fund.risk === 'Very High' ? 'bg-red-50 text-red-600' :
                                        'bg-amber-50 text-amber-700'
                                    }`}>
                                        {fund.risk}
                                    </span>
                                </td>

                                {/* Returns — colored by positive/negative */}
                                <td className="px-3 py-3 text-right">
                                    <span className={`text-sm font-semibold tabular-nums ${fund.returns_1y >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {fund.returns_1y}%
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-right">
                                    <span className={`text-sm font-bold tabular-nums ${fund.returns_3y >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {fund.returns_3y}%
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-right">
                                    <span className={`text-sm font-semibold tabular-nums ${fund.returns_5y >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {fund.returns_5y}%
                                    </span>
                                </td>

                                {/* Expense ratio */}
                                <td className="px-3 py-3 text-right">
                                    <span className="text-sm text-gray-700 tabular-nums">{fund.expense_ratio}%</span>
                                </td>

                                {/* Action */}
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/mutual-funds/${fund.id}`}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700 transition-colors"
                                    >
                                        Details <ArrowRight size={12} />
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
