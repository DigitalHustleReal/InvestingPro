"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
    Building2,
    TrendingUp,
    Shield,
    Zap,
    ArrowRight,
    Search,
    CheckCircle2,
    PiggyBank,
    Wallet,
    CreditCard,
    BarChart3,
    Clock,
    Award,
    Lock,
    Sparkles,
    RefreshCw,
    Target
} from "lucide-react";
import Link from "next/link";
import SEOHead from "@/components/common/SEOHead";
import CategoryHero from '@/components/common/CategoryHero';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';

// Mock data for FD rates (in production, fetch from API)
const fdRates = [
    { bank: 'HDFC Bank', logo: '🏦', regularRate: 7.00, seniorRate: 7.50, tenure: '1 Year', minDeposit: '₹25,000', rating: 4.5, verified: true },
    { bank: 'SBI', logo: '🏛️', regularRate: 6.80, seniorRate: 7.30, tenure: '1 Year', minDeposit: '₹1,000', rating: 4.7, verified: true },
    { bank: 'ICICI Bank', logo: '🏢', regularRate: 7.10, seniorRate: 7.60, tenure: '1 Year', minDeposit: '₹10,000', rating: 4.4, verified: true },
    { bank: 'Axis Bank', logo: '🏪', regularRate: 7.25, seniorRate: 7.75, tenure: '1 Year', minDeposit: '₹5,000', rating: 4.3, verified: true },
    { bank: 'Kotak Mahindra', logo: '🏬', regularRate: 7.20, seniorRate: 7.70, tenure: '1 Year', minDeposit: '₹25,000', rating: 4.5, verified: true },
    { bank: 'Yes Bank', logo: '🏦', regularRate: 7.75, seniorRate: 8.25, tenure: '1 Year', minDeposit: '₹10,000', rating: 4.1, verified: true },
];

const savingsAccounts = [
    {
        bank: 'HDFC Bank',
        account: 'Savings Max',
        rate: 3.50,
        minBalance: '₹10,000',
        features: ['Free Debit Card', 'Net Banking', 'Mobile Banking', 'Unlimited ATM Withdrawals'],
        icon: '🏦'
    },
    {
        bank: 'IDFC First Bank',
        account: 'First Save',
        rate: 7.00,
        minBalance: '₹25,000',
        features: ['High Interest Rate', 'Zero Balance Option', 'Free Debit Card', 'MoneyBack on Spends'],
        icon: '🏪'
    },
    {
        bank: 'Kotak 811',
        account: 'Digital Savings',
        rate: 4.00,
        minBalance: '₹0',
        features: ['Zero Balance', 'Digital Debit Card', 'UPI', 'Free Fund Transfer'],
        icon: '🏬'
    },
];

const bankingCategories = [
    { id: 'savings', label: 'Savings Accounts', icon: PiggyBank, color: 'emerald', count: '50+', description: 'High-yield savings with zero balance options' },
    { id: 'current', label: 'Current Accounts', icon: Wallet, color: 'blue', count: '30+', description: 'Business banking with overdraft facilities' },
    { id: 'fd', label: 'Fixed Deposits', icon: Lock, color: 'amber', count: '100+', description: 'Secure deposits with up to 8.25% returns' },
    { id: 'rd', label: 'Recurring Deposits', icon: BarChart3, color: 'purple', description: 'Monthly savings with guaranteed returns' },
];

export default function BankingPage() {
    const [selectedTenure, setSelectedTenure] = useState<'1 Year' | '2 Years' | '3 Years' | '5 Years'>('1 Year');
    const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
    const [sortBy, setSortBy] = useState<'rate' | 'rating'>('rate');

    // Sort FD rates
    const sortedRates = [...fdRates].sort((a, b) => {
        if (sortBy === 'rate') {
            const rateA = isSeniorCitizen ? a.seniorRate : a.regularRate;
            const rateB = isSeniorCitizen ? b.seniorRate : b.regularRate;
            return rateB - rateA;
        }
        return b.rating - a.rating;
    });

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "Banking & Savings Hub - InvestingPro",
        "description": "Compare FD rates, savings accounts, and current accounts from 50+ banks. Get up to 8.25% on fixed deposits.",
    };

    return (
        <main className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
            <SEOHead
                title="Best Banking & Savings Options in India 2026 | InvestingPro"
                description="Compare FD rates up to 8.25%, high-yield savings accounts, and zero-balance accounts from 50+ banks. Updated daily."
                structuredData={structuredData}
            />

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    
                    {/* Premium Authoritative Hero */}
                    <CategoryHero
                        title="Maximize Your Savings"
                        subtitle="Live Rate Radar - Updated Daily"
                        description="Compare FD rates up to 8.25%, high-yield savings accounts, and zero-balance options from 50+ banks. Get the best rates with our live rate comparison."
                        primaryCta={{
                            text: "Compare FD Rates",
                            href: "#fd-rates"
                        }}
                        secondaryCta={{
                            text: "View Savings Accounts",
                            href: "#savings"
                        }}
                        stats={[
                            { label: "Banks Compared", value: "50+" },
                            { label: "Max FD Rate", value: "8.25%" },
                            { label: "Updated", value: "Daily" }
                        ]}
                        badge="Live Rates • Updated Daily • Best Rates Guaranteed"
                        variant="neutral"
                        className="mb-12"
                    />
                </div>
            </div>

            {/* Live Rate Radar - Interactive Table */}
            <section className="py-12 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <Card className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden">
                            {/* Table Header with Controls */}
                            <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                            <Target className="w-6 h-6" />
                                            Fixed Deposit Rate Comparison
                                        </h2>
                                        <p className="text-primary-100 text-sm">
                                            {sortedRates.length} banks offering competitive FD rates
                                        </p>
                                    </div>
                                    
                                    {/* Controls */}
                                    <div className="flex flex-wrap gap-3">
                                        {/* Senior Citizen Toggle */}
                                        <button
                                            onClick={() => setIsSeniorCitizen(!isSeniorCitizen)}
                                            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                                                isSeniorCitizen
                                                    ? 'bg-white text-primary-600 shadow-lg'
                                                    : 'bg-primary-600/30 text-white hover:bg-primary-600/40'
                                            }`}
                                        >
                                            {isSeniorCitizen ? '✓ ' : ''}Senior Citizen
                                        </button>

                                        {/* Sort Toggle */}
                                        <button
                                            onClick={() => setSortBy(sortBy === 'rate' ? 'rating' : 'rate')}
                                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold text-sm transition-all backdrop-blur-sm"
                                        >
                                            Sort: {sortBy === 'rate' ? 'Interest Rate' : 'Bank Rating'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Table Content */}
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-white">Bank</th>
                                                <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 dark:text-white">Interest Rate</th>
                                                <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 dark:text-white">Rating</th>
                                                <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 dark:text-white">Min Deposit</th>
                                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedRates.map((bank, idx) => {
                                                const displayRate = isSeniorCitizen ? bank.seniorRate : bank.regularRate;
                                                const isHighest = idx === 0;
                                                
                                                return (
                                                    <tr 
                                                        key={bank.bank}
                                                        className={`border-b border-slate-200 dark:border-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors ${
                                                            isHighest ? 'bg-primary-50/50 dark:bg-primary-900/20' : ''
                                                        }`}
                                                    >
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="text-3xl">{bank.logo}</div>
                                                                <div>
                                                                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                                        {bank.bank}
                                                                        {bank.verified && (
                                                                            <Badge className="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 border-0 text-xs">
                                                                                <Shield className="w-3 h-3 mr-1" />
                                                                                Verified
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-sm text-slate-500 dark:text-slate-600">
                                                                        Tenure: {bank.tenure}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-center">
                                                            <div className={`text-2xl font-bold ${
                                                                isHighest 
                                                                    ? 'text-primary-600 dark:text-primary-400' 
                                                                    : 'text-slate-900 dark:text-white'
                                                            }`}>
                                                                {displayRate}%
                                                            </div>
                                                            {isSeniorCitizen && (
                                                                <div className="text-xs text-slate-500 dark:text-slate-600 mt-1">
                                                                    Regular: {bank.regularRate}%
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-5 text-center">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <Award className="w-4 h-4 text-accent-500" />
                                                                <span className="font-bold text-slate-900 dark:text-white">{bank.rating}</span>
                                                                <span className="text-slate-500 dark:text-slate-600">/5</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-center">
                                                            <div className="font-semibold text-slate-900 dark:text-white">
                                                                {bank.minDeposit}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <Button 
                                                                variant="outline"
                                                                className="text-primary-600 border-primary-200 hover:bg-primary-50 dark:text-primary-400 dark:border-primary-800 dark:hover:bg-primary-900/20"
                                                            >
                                                                View Details
                                                                <ArrowRight className="w-4 h-4 ml-2" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Table Footer */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                            <Clock className="w-4 h-4" />
                                            Last updated: 3 hours ago
                                        </div>
                                        <Button variant="ghost" className="text-primary-600 dark:text-primary-400">
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Refresh Rates
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            {[
                                { label: 'Highest FD Rate', value: '8.25%', icon: TrendingUp, color: 'emerald' },
                                { label: 'Banks Listed', value: '50+', icon: Building2, color: 'blue' },
                                { label: 'Avg. Rating', value: '4.4/5', icon: Award, color: 'amber' },
                                { label: 'Daily Updates', value: 'Live', icon: Zap, color: 'purple' },
                            ].map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <div 
                                        key={i}
                                        className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-center"
                                    >
                                        <Icon className={`w-5 h-5 text-${stat.color}-500 mx-auto mb-2`} />
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                            {stat.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: High-Yield Savings Accounts */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            High-Yield Savings Accounts
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Earn up to 7% interest on your savings with zero balance options
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {savingsAccounts.map((account, idx) => (
                            <Card key={idx} className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                <CardContent className="p-6">
                                    <div className="text-4xl mb-4">{account.icon}</div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                        {account.bank}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                        {account.account}
                                    </p>

                                    <div className="mb-6">
                                        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                                            {account.rate}%
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-600">
                                            Interest Rate p.a.
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        {account.features.slice(0, 3).map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                            Min Balance: <span className="font-bold text-slate-900 dark:text-white">{account.minBalance}</span>
                                        </div>
                                        <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100">
                                            Open Account
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 3: Banking Categories Grid */}
            <section className="py-20 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Explore All Banking Products
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Compare and choose the best banking solutions for your needs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {bankingCategories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <Card 
                                    key={category.id}
                                    className="group h-full cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                                >
                                    <CardContent className="p-6 text-center">
                                        <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-${category.color}-100 dark:bg-${category.color}-900/30 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon className={`w-7 h-7 text-${category.color}-600 dark:text-${category.color}-400`} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                            {category.label}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                            {category.description}
                                        </p>
                                        {category.count && (
                                            <Badge className={`text-${category.color}-600 dark:text-${category.color}-400 bg-${category.color}-100 dark:bg-${category.color}-900/30 border-0`}>
                                                {category.count}
                                            </Badge>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Compliance Disclaimer */}
            <div className="container mx-auto px-4 pb-8">
                <ComplianceDisclaimer variant="compact" />
            </div>
        </main>
    );
}
