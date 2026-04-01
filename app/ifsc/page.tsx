import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
    Search,
    Building2,
    Zap,
    ShieldCheck,
    ArrowRight,
    BookOpen,
    AlertCircle,
    CreditCard,
    IndianRupee,
    Clock,
    Banknote,
    Smartphone,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import IFSCSearchClient from './IFSCSearchClient';
import { POPULAR_BANKS, TRANSFER_INFO } from '@/lib/data/ifsc';

export const revalidate = 86400; // revalidate daily — IFSC metadata is stable

export const metadata: Metadata = {
    title: 'IFSC Code Finder — All Banks India | InvestingPro',
    description:
        'Look up any bank branch IFSC code instantly. Get branch address, MICR, SWIFT, NEFT/RTGS/IMPS availability for all Indian banks. Free, accurate, RBI-sourced.',
};

const TRANSFER_CARDS = [
    {
        key: 'UPI',
        icon: Smartphone,
        label: 'UPI',
        badge: 'Most Popular',
        badgeColor: 'bg-green-100 text-green-800',
        color: 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900',
        iconColor: 'text-green-700',
    },
    {
        key: 'IMPS',
        icon: Zap,
        label: 'IMPS',
        badge: '24×7',
        badgeColor: 'bg-blue-100 text-blue-800',
        color: 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900',
        iconColor: 'text-blue-700',
    },
    {
        key: 'NEFT',
        icon: Banknote,
        label: 'NEFT',
        badge: 'Batch',
        badgeColor: 'bg-amber-100 text-amber-800',
        color: 'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900',
        iconColor: 'text-amber-700',
    },
    {
        key: 'RTGS',
        icon: IndianRupee,
        label: 'RTGS',
        badge: '₹2L+ only',
        badgeColor: 'bg-purple-100 text-purple-800',
        color: 'border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-900',
        iconColor: 'text-purple-700',
    },
] as const;

export default function IFSCIndexPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="IFSC Code Finder — All Banks India | InvestingPro"
                description="Look up any bank branch IFSC code instantly. Get branch address, MICR, SWIFT, NEFT/RTGS/IMPS details for 1.6 lakh+ branches across India."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'WebApplication',
                    name: 'IFSC Code Finder',
                    applicationCategory: 'FinanceApplication',
                    description: 'Look up IFSC codes for all bank branches in India',
                    url: 'https://investingpro.in/ifsc',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
                }}
            />

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-700 pt-24 pb-16">
                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />
                {/* Decorative blobs */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-4 text-center">
                    <AutoBreadcrumbs className="mb-6 justify-center [&_*]:text-green-200 [&_a]:text-green-300" />

                    <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        RBI-sourced · 1.6 Lakh+ branches · Updated daily
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-display">
                        IFSC Code Finder
                    </h1>
                    <p className="text-lg text-green-100 mb-10 max-w-xl mx-auto">
                        Instantly look up any bank branch — address, MICR, SWIFT, and transfer options.
                        Free and always up-to-date.
                    </p>

                    {/* Search box */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-xl mx-auto">
                        <IFSCSearchClient />
                    </div>

                    {/* Quick examples */}
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                        {['SBIN0001234', 'HDFC0000001', 'ICIC0000001', 'AXIS0000001'].map(code => (
                            <Link
                                key={code}
                                href={`/ifsc/${code}`}
                                className="font-mono text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-green-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                {code}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stats strip ─────────────────────────────────────── */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 dark:divide-slate-700">
                        {[
                            { value: '1.6L+', label: 'Bank Branches' },
                            { value: '200+', label: 'Banks Covered' },
                            { value: '28+', label: 'States & UTs' },
                            { value: '100%', label: 'Free & Accurate' },
                        ].map(stat => (
                            <div key={stat.label} className="py-4 px-4 sm:px-8 text-center">
                                <div className="text-2xl font-bold text-green-700 dark:text-green-400 font-display">
                                    {stat.value}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 space-y-16">
                {/* ── Popular Banks ────────────────────────────────── */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">
                                Browse by Bank
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Tap a bank to search branches by name or city
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {POPULAR_BANKS.map(bank => (
                            <Link
                                key={bank.code}
                                href={`/ifsc?bank=${bank.code}`}
                                className="group flex flex-col items-center gap-3 p-4 rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-800 hover:border-green-300 hover:shadow-md transition-all"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-green-50">
                                    <Building2 className="h-6 w-6 text-green-700" />
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                                        {bank.name}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {bank.branches} branches
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ── Transfer Methods Guide ───────────────────────── */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">
                            Money Transfer Methods Explained
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            All methods use IFSC codes for routing. Understand which to use.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {TRANSFER_CARDS.map(card => {
                            const info = TRANSFER_INFO[card.key];
                            const Icon = card.icon;
                            return (
                                <div
                                    key={card.key}
                                    className={`rounded-xl border p-5 ${card.color}`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`p-2 rounded-lg bg-white/60 dark:bg-white/10 ${card.iconColor}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                                                {card.label}
                                            </span>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                                            {card.badge}
                                        </span>
                                    </div>
                                    <div className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                                        <div className="flex items-start gap-2">
                                            <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-500" />
                                            <span>{info.timing}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Zap className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-500" />
                                            <span>{info.settlement}</span>
                                        </div>
                                        {info.minAmount && (
                                            <div className="flex items-start gap-2">
                                                <IndianRupee className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-500" />
                                                <span>Min: {info.minAmount}</span>
                                            </div>
                                        )}
                                        {info.maxAmount && (
                                            <div className="flex items-start gap-2">
                                                <IndianRupee className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-500" />
                                                <span>Max: {info.maxAmount}</span>
                                            </div>
                                        )}
                                        <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                            Charges: {info.charges}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ── How to Find IFSC ────────────────────────────── */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <BookOpen className="h-5 w-5 text-green-700 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">
                            How to Find Your IFSC Code
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            {
                                step: '01',
                                title: 'Cheque Book',
                                desc: 'Your IFSC code is printed on the bottom of each cheque leaf, usually at the top of the cheque.',
                            },
                            {
                                step: '02',
                                title: 'Passbook',
                                desc: "It's printed on the first page of your passbook along with your account number and branch details.",
                            },
                            {
                                step: '03',
                                title: 'Net/Mobile Banking',
                                desc: "Log in to your bank's app or website → Account Details → Branch Information → IFSC Code.",
                            },
                        ].map(item => (
                            <div key={item.step} className="flex gap-4">
                                <div className="text-4xl font-bold text-green-100 dark:text-green-900 font-display shrink-0 leading-none mt-1">
                                    {item.step}
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                        {item.title}
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {item.desc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── What is IFSC ─────────────────────────────────── */}
                <section>
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-4">
                                What is an IFSC Code?
                            </h2>
                            <div className="prose prose-slate dark:prose-invert text-sm leading-relaxed space-y-3">
                                <p>
                                    IFSC stands for <strong>Indian Financial System Code</strong>. It is an 11-character
                                    alphanumeric code assigned by the Reserve Bank of India (RBI) to uniquely identify
                                    each bank branch participating in electronic fund transfer systems in India.
                                </p>
                                <p>
                                    The code is used in NEFT, RTGS, and IMPS transactions to route money to the correct
                                    bank and branch. Without a valid IFSC, a fund transfer cannot be completed.
                                </p>
                                <p>
                                    IFSC codes are maintained in the RBI's master database and are updated whenever
                                    banks open or close branches or change their details.
                                </p>
                            </div>
                        </div>

                        {/* IFSC anatomy card */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                                Anatomy of an IFSC Code
                            </h3>
                            <div className="font-mono text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-widest mb-4 flex gap-0">
                                <span className="text-green-700 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-l-md">HDFC</span>
                                <span className="text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-1">0</span>
                                <span className="text-blue-700 bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded-r-md">000001</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
                                    <div>
                                        <span className="font-semibold text-slate-900 dark:text-slate-100">Chars 1–4</span>
                                        <span className="text-slate-500 dark:text-slate-400 ml-2">Bank code (e.g. HDFC, SBIN, ICIC)</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                                    <div>
                                        <span className="font-semibold text-slate-900 dark:text-slate-100">Char 5</span>
                                        <span className="text-slate-500 dark:text-slate-400 ml-2">Always '0' — reserved by RBI</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                                    <div>
                                        <span className="font-semibold text-slate-900 dark:text-slate-100">Chars 6–11</span>
                                        <span className="text-slate-500 dark:text-slate-400 ml-2">Unique branch code</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg flex gap-2">
                                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800 dark:text-amber-300">
                                    IFSC is case-insensitive. Our tool accepts both upper and lower case.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CTA: Related tools ───────────────────────────── */}
                <section className="grid sm:grid-cols-2 gap-4">
                    <Link
                        href="/calculators/emi-calculator"
                        className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-green-300 hover:shadow-md transition-all"
                    >
                        <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
                            <IndianRupee className="h-6 w-6 text-green-700 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">EMI Calculator</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                Calculate your loan EMI before applying
                            </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link
                        href="/loans"
                        className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-green-300 hover:shadow-md transition-all"
                    >
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                            <CreditCard className="h-6 w-6 text-amber-700 dark:text-amber-400" />
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">Compare Loans</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                Find the best loan rates from top banks
                            </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                </section>
            </div>
        </div>
    );
}
