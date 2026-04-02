"use client";

import React, { useState } from 'react';
import { PiggyBank, Shield, TrendingUp, Calculator, Clock, Landmark, ArrowRight, Lock, Percent } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

const SCHEMES = [
    { id: 'ppf', name: 'Public Provident Fund (PPF)', rate: '7.1%', tenure: '15 years', tax: 'EEE (Exempt-Exempt-Exempt)', minInvest: '₹500/year', maxInvest: '₹1.5L/year', lock: '15 years (partial from 7th year)', section: '80C', icon: PiggyBank, risk: 'Zero Risk', color: 'bg-green-50 text-green-700' },
    { id: 'nps', name: 'National Pension System (NPS)', rate: '9-12% (market-linked)', tenure: 'Till 60 years', tax: 'EET (partially taxable at withdrawal)', minInvest: '₹1,000/year', maxInvest: 'No limit', lock: 'Till age 60', section: '80CCD(1B) + 80C', icon: Landmark, risk: 'Moderate', color: 'bg-blue-50 text-blue-700' },
    { id: 'ssy', name: 'Sukanya Samriddhi Yojana (SSY)', rate: '8.2%', tenure: '21 years', tax: 'EEE', minInvest: '₹250/year', maxInvest: '₹1.5L/year', lock: '21 years (partial from 18)', section: '80C', icon: Shield, risk: 'Zero Risk', color: 'bg-pink-50 text-pink-700' },
    { id: 'scss', name: 'Senior Citizen Savings Scheme', rate: '8.2%', tenure: '5 years', tax: 'Taxable', minInvest: '₹1,000', maxInvest: '₹30L', lock: '5 years', section: '80C', icon: Clock, risk: 'Zero Risk', color: 'bg-amber-50 text-amber-700' },
    { id: 'kvp', name: 'Kisan Vikas Patra (KVP)', rate: '7.5%', tenure: '115 months (doubles)', tax: 'Taxable', minInvest: '₹1,000', maxInvest: 'No limit', lock: '30 months', section: 'None', icon: TrendingUp, risk: 'Zero Risk', color: 'bg-green-50 text-green-700' },
    { id: 'nsc', name: 'National Savings Certificate (NSC)', rate: '7.7%', tenure: '5 years', tax: 'Taxable (reinvested interest deductible)', minInvest: '₹1,000', maxInvest: 'No limit', lock: '5 years', section: '80C', icon: Landmark, risk: 'Zero Risk', color: 'bg-purple-50 text-purple-700' },
    { id: 'mis', name: 'Post Office Monthly Income Scheme', rate: '7.4%', tenure: '5 years', tax: 'Taxable', minInvest: '₹1,000', maxInvest: '₹9L (single) / ₹15L (joint)', lock: '5 years (partial from 1yr)', section: 'None', icon: Calculator, risk: 'Zero Risk', color: 'bg-green-50 text-green-700' },
];

export default function PPFNPSClient() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">{SCHEMES.length} government-backed savings schemes compared</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SCHEMES.map((scheme) => {
                    const Icon = scheme.icon;
                    const isOpen = selected === scheme.id;
                    return (
                        <div key={scheme.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-green-500 hover:shadow-sm transition-all">
                            <button onClick={() => setSelected(isOpen ? null : scheme.id)} className="w-full text-left p-4 cursor-pointer">
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${scheme.color}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-semibold text-gray-900">{scheme.name}</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-[12px] text-gray-500">
                                            <span className="font-semibold text-green-600">{scheme.rate}</span>
                                            <span>{scheme.tenure}</span>
                                            <Badge className="text-[9px] bg-gray-100 text-gray-600 border-0">{scheme.risk}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </button>

                            {isOpen && (
                                <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: 'Interest Rate', value: scheme.rate, icon: Percent },
                                            { label: 'Lock-in', value: scheme.lock, icon: Lock },
                                            { label: 'Min Investment', value: scheme.minInvest, icon: Calculator },
                                            { label: 'Max Investment', value: scheme.maxInvest, icon: TrendingUp },
                                            { label: 'Tax Treatment', value: scheme.tax, icon: Shield },
                                            { label: 'Section', value: scheme.section, icon: Landmark },
                                        ].map((item) => (
                                            <div key={item.label}>
                                                <p className="text-[10px] text-gray-400 uppercase font-medium">{item.label}</p>
                                                <p className="text-sm text-gray-900 font-medium mt-0.5">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href={`/calculators/${scheme.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700">
                                        Open {scheme.name.split('(')[0].trim()} Calculator <ArrowRight size={12} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
