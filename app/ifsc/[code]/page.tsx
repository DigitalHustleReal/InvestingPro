import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    MapPin,
    Phone,
    Building2,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Copy,
    Banknote,
    Zap,
    IndianRupee,
    Smartphone,
    Globe,
    ArrowRight,
    ShieldCheck,
    Info,
    CreditCard,
    ChevronRight,
    Clock,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import IFSCSearchClient from '../IFSCSearchClient';
import { fetchIFSCData, getBankInfo, decodeIFSC, TRANSFER_INFO } from '@/lib/data/ifsc';

interface Props {
    params: { code: string };
}

export const revalidate = 86400; // IFSC data changes rarely — 24h cache

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const ifsc = params.code.toUpperCase();
    const branch = await fetchIFSCData(ifsc);

    if (!branch) {
        return {
            title: 'IFSC Code Not Found | InvestingPro',
            description: 'The IFSC code you entered was not found. Please check and try again.',
        };
    }

    return {
        title: `${ifsc} — ${branch.bank} ${branch.branch} IFSC Code | InvestingPro`,
        description: `${ifsc}: ${branch.bank}, ${branch.branch} branch. Address: ${branch.address}. MICR: ${branch.micr ?? 'N/A'}. NEFT: ${branch.neft ? 'Yes' : 'No'}. RTGS: ${branch.rtgs ? 'Yes' : 'No'}. IMPS: ${branch.imps ? 'Yes' : 'No'}.`,
    };
}

// Pill badge for transfer capabilities
function CapabilityBadge({
    label,
    enabled,
    icon: Icon,
}: {
    label: string;
    enabled: boolean;
    icon: React.ElementType;
}) {
    return (
        <div
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border ${
                enabled
                    ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-800 dark:text-green-300'
                    : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-500'
            }`}
        >
            {enabled ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
                <XCircle className="h-4 w-4 text-slate-400" />
            )}
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
        </div>
    );
}

// Copy button (client island embedded inline)
function CopyButton({ value, label }: { value: string; label: string }) {
    // We use a minimal inline client pattern via data attributes + script
    // For full SSR this is handled client-side
    return (
        <button
            data-copy={value}
            data-label={label}
            onClick={() => {
                navigator.clipboard.writeText(value);
            }}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-green-700 dark:hover:text-green-400 transition-colors p-1 rounded hover:bg-green-50 dark:hover:bg-green-950/30"
            title={`Copy ${label}`}
        >
            <Copy className="h-3.5 w-3.5" />
        </button>
    );
}

export default async function IFSCDetailPage({ params }: Props) {
    const ifscCode = params.code.toUpperCase();
    const branch = await fetchIFSCData(ifscCode);

    if (!branch) {
        notFound();
    }

    const bankInfo = getBankInfo(branch.bankCode);
    const decoded = decodeIFSC(ifscCode);

    const transferMethods = [
        { key: 'UPI' as const, label: 'UPI', enabled: branch.upi, icon: Smartphone },
        { key: 'IMPS' as const, label: 'IMPS', enabled: branch.imps, icon: Zap },
        { key: 'NEFT' as const, label: 'NEFT', enabled: branch.neft, icon: Banknote },
        { key: 'RTGS' as const, label: 'RTGS', enabled: branch.rtgs, icon: IndianRupee },
    ];

    const enabledCount = transferMethods.filter(m => m.enabled).length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title={`${ifscCode} — ${branch.bank} ${branch.branch} | InvestingPro`}
                description={`IFSC ${ifscCode}: ${branch.bank}, ${branch.branch}. ${branch.address}. NEFT/RTGS/IMPS supported. MICR: ${branch.micr ?? 'N/A'}.`}
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'LocalBusiness',
                    name: `${branch.bank} — ${branch.branch}`,
                    '@id': `https://investingpro.in/ifsc/${ifscCode}`,
                    url: `https://investingpro.in/ifsc/${ifscCode}`,
                    telephone: branch.contact !== 'Not available' ? branch.contact : undefined,
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: branch.address,
                        addressLocality: branch.city,
                        addressRegion: branch.state,
                        addressCountry: 'IN',
                    },
                }}
            />

            {/* ── Hero strip ─────────────────────────────────────────── */}
            <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 pt-24 pb-12">
                <div
                    className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs className="mb-5 [&_*]:text-green-200 [&_a]:text-green-300" />

                    <Link
                        href="/ifsc"
                        className="inline-flex items-center gap-1.5 text-green-200 hover:text-white text-sm mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        All IFSC Codes
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                            {/* Bank name */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-white/10 rounded-lg">
                                    <Building2 className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-green-200 text-sm font-medium">
                                    {branch.bank}
                                </span>
                            </div>

                            {/* IFSC code — hero */}
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-4xl sm:text-5xl font-bold text-white font-mono tracking-widest">
                                    <span className="text-green-300">{decoded.bankCode}</span>
                                    <span className="text-amber-300">{decoded.reserved}</span>
                                    <span className="text-white">{decoded.branchCode}</span>
                                </h1>
                                <CopyButton value={ifscCode} label="IFSC code" />
                            </div>

                            <div className="text-green-100 text-lg font-medium">
                                {branch.branch} Branch
                            </div>
                            <div className="flex items-center gap-1.5 text-green-200 text-sm mt-1">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                <span>{branch.city}, {branch.district}, {branch.state}</span>
                            </div>
                        </div>

                        {/* Transfer capability summary */}
                        <div className="shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 min-w-[180px]">
                            <div className="text-white font-semibold text-sm mb-2">Transfers Supported</div>
                            <div className="text-3xl font-bold text-white font-display mb-0.5">
                                {enabledCount}<span className="text-green-300 text-base font-normal">/4</span>
                            </div>
                            <div className="text-xs text-green-200">methods available</div>
                            <div className="mt-3 flex flex-wrap gap-1">
                                {transferMethods.map(m => (
                                    <span
                                        key={m.key}
                                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            m.enabled
                                                ? 'bg-green-400/20 text-green-200 border border-green-400/30'
                                                : 'bg-white/5 text-green-400/40 border border-white/10 line-through'
                                        }`}
                                    >
                                        {m.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Main content ───────────────────────────────────────── */}
            <div className="container mx-auto px-4 py-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left col: main info */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Branch details card */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-green-700 dark:text-green-400" />
                                <h2 className="font-semibold text-slate-900 dark:text-slate-100">Branch Details</h2>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {[
                                    { label: 'IFSC Code', value: ifscCode, mono: true, copy: ifscCode },
                                    { label: 'Bank', value: branch.bank, mono: false },
                                    { label: 'Branch Name', value: branch.branch, mono: false },
                                    { label: 'City', value: branch.city, mono: false },
                                    { label: 'District', value: branch.district, mono: false },
                                    { label: 'State', value: branch.state, mono: false },
                                    {
                                        label: 'Address',
                                        value: branch.address,
                                        mono: false,
                                        multiline: true,
                                    },
                                    {
                                        label: 'Contact',
                                        value: branch.contact,
                                        mono: false,
                                        icon: branch.contact !== 'Not available' ? (
                                            <a
                                                href={`tel:${branch.contact}`}
                                                className="text-green-700 dark:text-green-400 hover:underline font-medium"
                                            >
                                                {branch.contact}
                                            </a>
                                        ) : undefined,
                                    },
                                ].map(row => (
                                    <div
                                        key={row.label}
                                        className="flex items-start gap-4 px-6 py-3.5"
                                    >
                                        <div className="w-28 shrink-0 text-sm text-slate-500 dark:text-slate-400 pt-0.5">
                                            {row.label}
                                        </div>
                                        <div className="flex-1 flex items-start gap-1.5">
                                            {row.icon ?? (
                                                <span
                                                    className={`text-sm text-slate-900 dark:text-slate-100 leading-relaxed ${
                                                        row.mono ? 'font-mono tracking-wider font-semibold' : ''
                                                    }`}
                                                >
                                                    {row.value}
                                                </span>
                                            )}
                                            {row.copy && (
                                                <CopyButton value={row.copy} label={row.label} />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Banking codes card */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-green-700 dark:text-green-400" />
                                <h2 className="font-semibold text-slate-900 dark:text-slate-100">Banking Codes</h2>
                            </div>
                            <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
                                {[
                                    {
                                        label: 'IFSC Code',
                                        value: ifscCode,
                                        description: 'Used for NEFT, RTGS, IMPS transfers',
                                        highlight: true,
                                    },
                                    {
                                        label: 'MICR Code',
                                        value: branch.micr ?? 'Not available',
                                        description: 'Used on cheques for magnetic ink character recognition',
                                        highlight: false,
                                    },
                                    {
                                        label: 'SWIFT Code',
                                        value: branch.swift ?? 'Not available',
                                        description: 'Used for international wire transfers',
                                        highlight: false,
                                    },
                                ].map(item => (
                                    <div key={item.label} className="p-5">
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{item.label}</div>
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <span
                                                className={`font-mono font-bold text-lg tracking-wider ${
                                                    item.highlight
                                                        ? 'text-green-700 dark:text-green-400'
                                                        : 'text-slate-900 dark:text-slate-100'
                                                }`}
                                            >
                                                {item.value}
                                            </span>
                                            {item.value !== 'Not available' && (
                                                <CopyButton value={item.value} label={item.label} />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Transfer capabilities */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-green-700 dark:text-green-400" />
                                <h2 className="font-semibold text-slate-900 dark:text-slate-100">Transfer Capabilities</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                    {transferMethods.map(m => (
                                        <CapabilityBadge
                                            key={m.key}
                                            label={m.label}
                                            enabled={m.enabled}
                                            icon={m.icon}
                                        />
                                    ))}
                                </div>
                                {/* Detailed info per enabled method */}
                                <div className="space-y-3">
                                    {transferMethods
                                        .filter(m => m.enabled)
                                        .map(m => {
                                            const info = TRANSFER_INFO[m.key];
                                            const Icon = m.icon;
                                            return (
                                                <div
                                                    key={m.key}
                                                    className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                                                >
                                                    <div className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded-md shrink-0">
                                                        <Icon className="h-4 w-4 text-green-700 dark:text-green-400" />
                                                    </div>
                                                    <div className="text-sm">
                                                        <div className="font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
                                                            {m.label}
                                                            {info.minAmount && (
                                                                <span className="ml-2 text-xs font-normal text-slate-500">
                                                                    Min {info.minAmount}
                                                                </span>
                                                            )}
                                                            {info.maxAmount && (
                                                                <span className="ml-1 text-xs font-normal text-slate-500">
                                                                    · Max {info.maxAmount}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-0.5">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {info.settlement}
                                                            </span>
                                                            <span>Charges: {info.charges}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>

                        {/* How to use IFSC */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Info className="h-4 w-4 text-green-700 dark:text-green-400" />
                                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                                    How to Use {ifscCode} for a Transfer
                                </h2>
                            </div>
                            <ol className="space-y-3">
                                {[
                                    {
                                        step: 1,
                                        text: 'Log in to your bank\'s mobile app or internet banking portal.',
                                    },
                                    {
                                        step: 2,
                                        text: 'Go to Fund Transfer → Add Beneficiary.',
                                    },
                                    {
                                        step: 3,
                                        text: `Enter the recipient's account number and this IFSC code: ${ifscCode}`,
                                    },
                                    {
                                        step: 4,
                                        text: 'Select your preferred transfer mode (IMPS for instant, NEFT/RTGS for large amounts).',
                                    },
                                    {
                                        step: 5,
                                        text: 'Verify the beneficiary name shown by the bank and confirm the transfer.',
                                    },
                                ].map(item => (
                                    <li key={item.step} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                            {item.step}
                                        </span>
                                        <span>{item.text}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {/* Right col: sidebar */}
                    <div className="space-y-5">
                        {/* Search another IFSC */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                <Search className="h-4 w-4 text-green-700 dark:text-green-400" />
                                Look Up Another IFSC
                            </h3>
                            <IFSCSearchClient />
                        </div>

                        {/* Bank info card */}
                        {bankInfo && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">About {bankInfo.name}</h3>
                                </div>
                                <div className="p-5 space-y-3">
                                    <div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Full Name</div>
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{bankInfo.fullName}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Type</div>
                                        <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full capitalize">
                                            {bankInfo.type.replace('_', ' ')}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Headquarters</div>
                                        <div className="text-sm text-slate-900 dark:text-slate-100">{bankInfo.headquarters}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Founded</div>
                                        <div className="text-sm text-slate-900 dark:text-slate-100">{bankInfo.foundedYear}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Customer Care</div>
                                        <a
                                            href={`tel:${bankInfo.customerCare}`}
                                            className="text-sm text-green-700 dark:text-green-400 hover:underline flex items-center gap-1 font-medium"
                                        >
                                            <Phone className="h-3.5 w-3.5" />
                                            {bankInfo.customerCare}
                                        </a>
                                    </div>
                                    <a
                                        href={bankInfo.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-sm text-green-700 dark:text-green-400 hover:underline"
                                    >
                                        <Globe className="h-3.5 w-3.5" />
                                        Official Website
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Related products from this bank */}
                        {bankInfo && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                        {bankInfo.name} Products
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Compare offers before you apply
                                    </p>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {[
                                        bankInfo.productSlugs.creditCard && {
                                            icon: CreditCard,
                                            label: 'Credit Cards',
                                            href: '/credit-cards',
                                            color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30',
                                        },
                                        bankInfo.productSlugs.fd && {
                                            icon: Banknote,
                                            label: 'Fixed Deposits',
                                            href: '/fixed-deposits',
                                            color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30',
                                        },
                                        bankInfo.productSlugs.loan && {
                                            icon: IndianRupee,
                                            label: 'Home Loans',
                                            href: '/loans',
                                            color: 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30',
                                        },
                                    ]
                                        .filter(Boolean)
                                        .map(item => {
                                            if (!item) return null;
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                                >
                                                    <div className={`p-1.5 rounded-lg ${item.color}`}>
                                                        <Icon className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 flex-1">
                                                        {item.label}
                                                    </span>
                                                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all" />
                                                </Link>
                                            );
                                        })}
                                </div>
                            </div>
                        )}

                        {/* Quick tip */}
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl p-5">
                            <div className="flex items-start gap-2.5">
                                <ShieldCheck className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-semibold text-amber-900 dark:text-amber-300 text-sm mb-1">
                                        Safety Tip
                                    </div>
                                    <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                                        Always verify the beneficiary name displayed by your bank app after
                                        entering IFSC + account number before confirming any transfer.
                                        Fraudsters sometimes provide wrong IFSC codes to misdirect funds.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* EMI calculator CTA */}
                        <Link
                            href="/calculators/emi-calculator"
                            className="group flex items-center gap-4 p-4 bg-gradient-to-br from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 rounded-2xl text-white transition-all"
                        >
                            <div className="p-2.5 bg-white/10 rounded-xl">
                                <IndianRupee className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-sm">Calculate Loan EMI</div>
                                <div className="text-xs text-green-200 mt-0.5">
                                    Before transferring for loan repayment
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-green-300 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
