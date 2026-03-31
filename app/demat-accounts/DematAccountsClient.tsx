"use client";

import React, { useState } from 'react';
import { Search, Star, ArrowRight } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { apiClient as api } from '@/lib/api-client';
import { useQuery } from "@tanstack/react-query";

export default function DematAccountsClient() {
    const [searchTerm, setSearchTerm] = useState("");

    const { data: brokers = [], isLoading } = useQuery({
        queryKey: ['demat-accounts'],
        queryFn: async () => {
            try {
                const res = await api.entities.Broker?.list() || [];
                return Array.isArray(res) ? res : (res as any)?.data || [];
            } catch { return []; }
        },
    });

    const filtered = brokers.filter((b: any) => {
        const name = (b.name || '').toLowerCase();
        return name.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search brokers..." className="pl-10 h-11 bg-white border-gray-200 rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search demat accounts" />
            </div>

            <p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-900">{filtered.length}</span> brokers</p>

            {isLoading ? (
                <div className="py-16 text-center"><div className="inline-flex items-center gap-2 text-sm text-gray-500"><div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />Loading brokers...</div></div>
            ) : filtered.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-xl border border-gray-200"><p className="text-gray-500">No brokers found.</p></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filtered.map((broker: any) => (
                        <Link key={broker.id || broker.slug} href={`/demat-accounts/${broker.slug || broker.id}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-sm transition-all group">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{broker.name}</p>
                                    <p className="text-[11px] text-gray-500 mt-0.5">{broker.type || 'Discount Broker'}</p>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < (broker.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />)}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                                <div><p className="text-[9px] text-gray-400 uppercase">Brokerage</p><p className="text-sm font-semibold text-gray-900">{broker.specs?.brokerage || broker.brokerage || '₹20/trade'}</p></div>
                                <div><p className="text-[9px] text-gray-400 uppercase">AMC</p><p className="text-sm font-semibold text-gray-900">{broker.specs?.amc || broker.amc || '₹0'}</p></div>
                                <div><p className="text-[9px] text-gray-400 uppercase">Opening</p><p className="text-sm font-semibold text-green-600">{broker.specs?.accountOpening || 'Free'}</p></div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
