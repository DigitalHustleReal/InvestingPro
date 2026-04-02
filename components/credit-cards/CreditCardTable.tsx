"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Star, ArrowRight, ArrowUpDown } from "lucide-react";
import { useCompare } from '@/contexts/CompareContext';

type SortKey = 'name' | 'fee' | 'rate' | 'rating';
type SortDir = 'asc' | 'desc';

interface CreditCardTableProps {
    cards: any[];
}

export function CreditCardTable({ cards }: CreditCardTableProps) {
    const { addProduct, removeProduct, isSelected } = useCompare();
    const [sortKey, setSortKey] = useState<SortKey>('rating');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
        else { setSortKey(key); setSortDir(key === 'name' ? 'asc' : 'desc'); }
    };

    const sorted = useMemo(() => {
        return [...cards].sort((a, b) => {
            const mul = sortDir === 'desc' ? -1 : 1;
            if (sortKey === 'name') return mul * (a.name || '').localeCompare(b.name || '');
            if (sortKey === 'fee') {
                const af = parseInt(String(a.features?.annual_fee || a.specs?.annualFee || '0').replace(/[^0-9]/g, '')) || 0;
                const bf = parseInt(String(b.features?.annual_fee || b.specs?.annualFee || '0').replace(/[^0-9]/g, '')) || 0;
                return mul * (af - bf);
            }
            if (sortKey === 'rate') {
                const ar = parseFloat(String(a.features?.reward_rate || a.specs?.rewardRate || '1').replace(/[^0-9.]/g, '')) || 0;
                const br = parseFloat(String(b.features?.reward_rate || b.specs?.rewardRate || '1').replace(/[^0-9.]/g, '')) || 0;
                return mul * (ar - br);
            }
            if (sortKey === 'rating') {
                const ar = typeof a.rating === 'object' ? a.rating?.overall || 0 : a.rating || 0;
                const br = typeof b.rating === 'object' ? b.rating?.overall || 0 : b.rating || 0;
                return mul * (ar - br);
            }
            return 0;
        });
    }, [cards, sortKey, sortDir]);

    function SH({ label, k }: { label: string; k: SortKey }) {
        return (
            <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 cursor-pointer hover:text-green-700 transition-colors">
                {label}<ArrowUpDown size={10} className={sortKey === k ? 'text-green-600' : 'text-gray-300'} />
            </button>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-8" />
                        <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SH label="Card" k="name" /></th>
                        <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SH label="Fee" k="fee" /></th>
                        <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SH label="Rewards" k="rate" /></th>
                        <th className="text-center px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SH label="Rating" k="rating" /></th>
                        <th className="text-center px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Best For</th>
                        <th className="text-right px-4 py-3" />
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {sorted.map((card) => {
                        const selected = isSelected(card.id);
                        const fee = card.features?.annual_fee || card.features?.['Annual Fee'] || card.specs?.annualFee || '0';
                        const feeNum = typeof fee === 'string' ? parseInt(fee.replace(/[^0-9]/g, '')) : fee;
                        const rate = card.features?.reward_rate || card.features?.['Reward Rate'] || card.specs?.rewardRate || '1%';
                        const bestFor = card.best_for || card.bestFor || 'General';
                        let ratingVal = 4.0;
                        if (typeof card.rating === 'number') ratingVal = card.rating;
                        else if (typeof card.rating === 'object' && card.rating?.overall) ratingVal = card.rating.overall;

                        return (
                            <tr key={card.id || card.slug} className={`hover:bg-green-50/30 transition-colors ${selected ? 'bg-green-50/50' : ''}`}>
                                <td className="px-4 py-3"><input type="checkbox" checked={selected} onChange={() => selected ? removeProduct(card.id) : addProduct(card)} className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500/30 cursor-pointer" aria-label={`Compare ${card.name}`} /></td>
                                <td className="px-4 py-3"><Link href={`/credit-cards/${card.slug}`} className="group"><p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors leading-tight">{card.name}</p><p className="text-[11px] text-gray-500">{card.provider || card.provider_name || 'Bank'}</p></Link></td>
                                <td className="px-3 py-3 text-right"><span className={`text-sm font-bold tabular-nums ${feeNum === 0 ? 'text-green-600' : 'text-gray-900'}`}>{feeNum === 0 ? '₹0' : `₹${feeNum.toLocaleString('en-IN')}`}</span>{feeNum === 0 && <p className="text-[9px] text-green-600 font-medium">Lifetime Free</p>}</td>
                                <td className="px-3 py-3 text-right"><span className="text-sm font-bold text-green-600 tabular-nums">{rate}</span></td>
                                <td className="px-3 py-3 text-center"><div className="flex gap-0.5 justify-center">{[...Array(5)].map((_, i) => <Star key={i} size={11} className={i < Math.round(ratingVal) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />)}</div></td>
                                <td className="px-3 py-3 text-center"><span className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{bestFor}</span></td>
                                <td className="px-4 py-3 text-right"><Link href={`/credit-cards/${card.slug}`} className="inline-flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700">Details <ArrowRight size={12} /></Link></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
