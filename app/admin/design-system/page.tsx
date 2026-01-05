"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { RichProductCard } from '@/components/products/RichProductCard';
import { RichProduct } from '@/types/rich-product';
import { Palette, Layout, Type, Box, Sparkles, Layers } from 'lucide-react';
import { AdminPageHeader, ContentSection, StatCard, StatusBadge, ActionButton } from '@/components/admin/AdminUIKit';

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
        <AdminLayout>
            <div className="p-8 space-y-10">
                <AdminPageHeader
                    title="Design System"
                    subtitle="Component library and visual design tokens"
                    icon={Palette}
                    iconColor="purple"
                />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Components" value={12} icon={Box} color="purple" />
                    <StatCard label="Layouts" value={3} icon={Layout} color="blue" />
                    <StatCard label="Typography" value={6} icon={Type} color="teal" />
                    <StatCard label="Tokens" value={24} icon={Sparkles} color="amber" />
                </div>

                {/* Color Palette */}
                <ContentSection title="Color Palette" subtitle="Primary accent colors used across the platform">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { name: 'Teal', color: 'bg-teal-500', hex: '#14b8a6' },
                            { name: 'Emerald', color: 'bg-emerald-500', hex: '#10b981' },
                            { name: 'Blue', color: 'bg-secondary-500', hex: '#3b82f6' },
                            { name: 'Purple', color: 'bg-secondary-500', hex: '#a855f7' },
                            { name: 'Amber', color: 'bg-amber-500', hex: '#f59e0b' },
                            { name: 'Rose', color: 'bg-rose-500', hex: '#f43f5e' },
                            { name: 'Slate', color: 'bg-slate-600', hex: '#475569' },
                            { name: 'Dark BG', color: 'bg-slate-900', hex: '#0f172a' },
                            { name: 'Surface', color: 'bg-slate-800', hex: '#1e293b' },
                            { name: 'Border', color: 'bg-white/10', hex: 'rgba(255,255,255,0.1)' },
                        ].map((c) => (
                            <div key={c.name} className="flex flex-col items-center gap-2">
                                <div className={`w-16 h-16 rounded-xl ${c.color} shadow-lg`} />
                                <span className="text-sm font-medium text-white">{c.name}</span>
                                <code className="text-xs text-slate-500">{c.hex}</code>
                            </div>
                        ))}
                    </div>
                </ContentSection>

                {/* Status Badges */}
                <ContentSection title="Status Badges" subtitle="Semantic color-coded status indicators">
                    <div className="flex flex-wrap gap-4">
                        <StatusBadge variant="success">Published</StatusBadge>
                        <StatusBadge variant="warning">Pending</StatusBadge>
                        <StatusBadge variant="danger">Archived</StatusBadge>
                        <StatusBadge variant="info">Draft</StatusBadge>
                        <StatusBadge variant="default">Default</StatusBadge>
                    </div>
                </ContentSection>

                {/* Action Buttons */}
                <ContentSection title="Action Buttons" subtitle="Primary call-to-action components">
                    <div className="flex flex-wrap gap-4">
                        <ActionButton icon={Sparkles}>Primary Action</ActionButton>
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm flex items-center gap-2">
                            <Layers className="w-4 h-4" /> Secondary Action
                        </button>
                        <button className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg text-sm border border-rose-500/30">
                            Danger Action
                        </button>
                    </div>
                </ContentSection>

                {/* Product Cards */}
                <ContentSection title="Product Cards - Grid View" subtitle="Universal product display component">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        <RichProductCard product={MOCK_CREDIT_CARD} />
                        <RichProductCard product={MOCK_MUTUAL_FUND} />
                    </div>
                </ContentSection>

                {/* Product Cards List */}
                <ContentSection title="Product Cards - List View" subtitle="Comparison mode display">
                    <div className="space-y-4 max-w-4xl mt-4">
                        <RichProductCard product={MOCK_CREDIT_CARD} layout="list" />
                        <RichProductCard product={MOCK_MUTUAL_FUND} layout="list" />
                    </div>
                </ContentSection>

                {/* Typography */}
                <ContentSection title="Typography Scale" subtitle="Text hierarchy and font weights">
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Page Title (text-3xl)</span>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">The quick brown fox</h1>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Section Title (text-xl)</span>
                            <h2 className="text-xl font-bold text-white">The quick brown fox</h2>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Card Title (text-lg)</span>
                            <h3 className="text-lg font-semibold text-white">The quick brown fox</h3>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Body Text (text-sm)</span>
                            <p className="text-sm text-slate-400">The quick brown fox jumps over the lazy dog.</p>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Label (text-xs uppercase)</span>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">THE QUICK BROWN FOX</p>
                        </div>
                    </div>
                </ContentSection>

                {/* Glassmorphism Demo */}
                <ContentSection title="Glassmorphism" subtitle="Frosted glass effects with backdrop blur">
                    <div className="grid md:grid-cols-3 gap-6 mt-4">
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                            <h4 className="font-bold text-white mb-2">Light Glass</h4>
                            <p className="text-sm text-slate-400">3% white opacity</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-xl">
                            <h4 className="font-bold text-white mb-2">Medium Glass</h4>
                            <p className="text-sm text-slate-400">6% white opacity</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border border-teal-500/20 backdrop-blur-xl">
                            <h4 className="font-bold text-white mb-2">Colored Glass</h4>
                            <p className="text-sm text-slate-400">Gradient overlay</p>
                        </div>
                    </div>
                </ContentSection>
            </div>
        </AdminLayout>
    );
}
