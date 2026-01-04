
"use client";

import React from 'react';
import { RichProductCard } from '@/components/products/RichProductCard';
import { RichProduct } from '@/types/rich-product';

const MOCK_CREDIT_CARD: RichProduct = {
    id: '1',
    slug: 'hdfc-regalia-gold',
    name: 'HDFC Regalia Gold',
    provider_name: 'HDFC Bank',
    category: 'credit_card',
    image_url: 'https://logo.clearbit.com/hdfcbank.com',
    rating: {
        overall: 4.8,
        trust_score: 98,
        breakdown: { fees: 4.5, rewards: 5.0 }
    },
    features: {},
    key_features: [
        { label: 'Annual Fee', value: '₹2,500' },
        { label: 'Reward Rate', value: '3.3%' },
        { label: 'Lounge Access', value: '12 Domestic' },
        { label: 'Welcome Benefit', value: '₹2,500 Voucher' }
    ],
    description: 'Best premium credit card for travel and lifestyle rewards.',
    pros: ['Excellent reward rate', 'Low forex markup', 'Complimentary lounge access'],
    cons: ['High annual fee waiver criteria'],
    is_verified: true,
    updated_at: new Date().toISOString()
};

const MOCK_MUTUAL_FUND: RichProduct = {
    id: '2',
    slug: 'quant-small-cap',
    name: 'Quant Small Cap Fund',
    provider_name: 'Quant Mutual Fund',
    category: 'mutual_fund',
    image_url: 'https://logo.clearbit.com/quant.in',
    rating: {
        overall: 4.5,
        trust_score: 92,
        breakdown: { fees: 5.0, rewards: 4.0 }
    },
    features: {},
    key_features: [
        { label: '3Y Returns', value: '45.2% p.a.' },
        { label: 'Expense Ratio', value: '0.62%' },
        { label: 'Risk', value: 'Very High' },
        { label: 'Min SIP', value: '₹1,000' }
    ],
    description: 'High growth potential small cap fund for long term investors.',
    pros: ['Highest returns in category', 'Active management style'],
    cons: ['High volatility'],
    is_verified: true,
    updated_at: new Date().toISOString()
};

export default function DesignSystemPage() {
    return (
        <div className="p-8 space-y-12 bg-slate-50 min-h-screen">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Design System: Product Cards</h1>
                <p className="text-slate-500">Visual verification of the new "Rich Product Engine".</p>
            </div>

            {/* Grid Layout Demo */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-8 bg-emerald-500 rounded-full"/>
                        Grid View (Universal)
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <RichProductCard product={MOCK_CREDIT_CARD} />
                    <RichProductCard product={MOCK_MUTUAL_FUND} />
                </div>
            </section>

            {/* List Layout Demo */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-8 bg-teal-500 rounded-full"/>
                        List View (Comparison Mode)
                    </h2>
                </div>
                <div className="space-y-4 max-w-4xl">
                    <RichProductCard product={MOCK_CREDIT_CARD} layout="list" />
                    <RichProductCard product={MOCK_MUTUAL_FUND} layout="list" />
                </div>
            </section>
        </div>
    );
}
