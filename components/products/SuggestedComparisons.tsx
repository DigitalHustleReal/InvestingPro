"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeftRight } from 'lucide-react';

const COMMON_COMPARISONS = [
    { s1: 'hdfc-regalia-gold', s2: 'axis-magnus', label: 'HDFC Regalia vs Axis Magnus' },
    { s1: 'hdfc-regalia-gold', s2: 'sbi-card-elite', label: 'Regalia vs SBI Elite' },
    { s1: 'zerodha', s2: 'groww', label: 'Zerodha vs Groww' },
    { s1: 'axis-magnus', s2: 'sbi-card-elite', label: 'Magnus vs SBI Elite' },
];

export default function SuggestedComparisons() {
    return (
        <div className="mt-20 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Popular Comparisons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {COMMON_COMPARISONS.map((comp, i) => (
                    <Link key={i} href={`/compare/${comp.s1}-vs-${comp.s2}`}>
                        <Button variant="outline" className="w-full justify-between hover:border-teal-400 group">
                            <span className="truncate text-slate-600 group-hover:text-teal-700">{comp.label}</span>
                            <ArrowLeftRight className="w-4 h-4 text-slate-300" />
                        </Button>
                    </Link>
                ))}
            </div>
            <p className="mt-4 text-sm text-slate-400 text-center italic">
                Pro Tip: You can compare any two products by changing the URL!
            </p>
        </div>
    );
}
