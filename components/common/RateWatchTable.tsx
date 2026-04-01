"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowUpRight,
    CheckCircle2,
    TrendingDown,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Info,
} from 'lucide-react';
import type { HomeLoanRate, FDRate } from '@/lib/rates/get-live-rates';

/* ─────────────────────────────────────────────
   HOME LOAN RATE TABLE
───────────────────────────────────────────── */

interface HomeLoanRateTableProps {
    rates: HomeLoanRate[];
    updatedAt: string;
    className?: string;
}

export function HomeLoanRateTable({ rates, updatedAt, className = '' }: HomeLoanRateTableProps) {
    const [showAll, setShowAll] = useState(false);
    const visible = showAll ? rates : rates.slice(0, 6);
    const best = rates[0]; // Sorted by rate, first = cheapest

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        Home Loan Rates Today
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Starting rates for 800+ CIBIL · ₹50L / 20yr comparison
                    </p>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400 font-semibold">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                        </span>
                        Updated today
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{updatedAt} IST</div>
                </div>
            </div>

            {/* Research note */}
            <div className="px-5 py-3 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/30 flex items-start gap-2">
                <Info className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-400">
                    <strong>InvestingPro Research:</strong> SBI has the lowest headline rate ({best.rate}) but your actual rate depends on CIBIL, loan size, and property type.
                    A CIBIL of 749 vs 750 can cost ₹4.8L extra on a ₹60L loan over 20 years.{' '}
                    <Link href="/cibil-score" className="underline font-medium">Check your CIBIL first →</Link>
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-left">
                            <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Bank</th>
                            <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Rate (p.a.)</th>
                            <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 hidden sm:table-cell">EMI / ₹50L</th>
                            <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">vs Cheapest</th>
                            <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 hidden sm:table-cell">Min CIBIL</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {visible.map((row, i) => (
                            <tr
                                key={row.bank}
                                className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${
                                    i === 0 ? 'bg-green-50/40 dark:bg-green-950/10' : ''
                                }`}
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400 shrink-0">
                                            {row.logo ?? row.bank.substring(0, 3).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">{row.bank}</div>
                                            {i === 0 && (
                                                <span className="text-[10px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-1.5 py-0.5 rounded-full">
                                                    Cheapest
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`font-mono font-bold text-base ${
                                        i === 0 ? 'text-green-700 dark:text-green-400' : 'text-slate-900 dark:text-slate-100'
                                    }`}>
                                        {row.rate}
                                    </span>
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell">
                                    <span className="font-mono text-slate-700 dark:text-slate-300">
                                        ₹{row.emi50L.toLocaleString('en-IN')}
                                    </span>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    {row.deltaVsBest === 0 ? (
                                        <span className="flex items-center gap-1 text-green-700 dark:text-green-400 text-xs font-semibold">
                                            <CheckCircle2 className="h-3.5 w-3.5" /> Best
                                        </span>
                                    ) : (
                                        <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
                                            +₹{row.deltaVsBest.toLocaleString('en-IN')}/mo
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell text-slate-600 dark:text-slate-400 text-xs">
                                    {row.cibilMin}+
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {row.affiliateUrl ? (
                                        <a
                                            href={row.affiliateUrl}
                                            target="_blank"
                                            rel="noopener noreferrer sponsored"
                                            className="inline-flex items-center gap-1 text-xs font-semibold bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            Apply <ArrowUpRight className="h-3 w-3" />
                                        </a>
                                    ) : (
                                        <Link
                                            href="/loans/home-loan"
                                            className="text-xs text-green-700 dark:text-green-400 hover:underline font-medium"
                                        >
                                            Apply →
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Show more */}
            {rates.length > 6 && (
                <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                        onClick={() => setShowAll(v => !v)}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-green-700 dark:hover:text-green-400 transition-colors mx-auto"
                    >
                        {showAll ? (
                            <><ChevronUp className="h-3.5 w-3.5" /> Show less</>
                        ) : (
                            <><ChevronDown className="h-3.5 w-3.5" /> Show {rates.length - 6} more banks</>
                        )}
                    </button>
                </div>
            )}

            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    Starting rates for 800+ CIBIL. Actual rate depends on CIBIL score, loan amount, property type, and lender assessment. Data sourced from bank websites.
                </p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   FD RATE TABLE
───────────────────────────────────────────── */

interface FDRateTableProps {
    rates: FDRate[];
    updatedAt: string;
    className?: string;
}

export function FDRateTable({ rates, updatedAt, className = '' }: FDRateTableProps) {
    const [showAll, setShowAll] = useState(false);
    const visible = showAll ? rates : rates.slice(0, 5);

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden ${className}`}>
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-slate-900 dark:text-slate-100">Best FD Rates Today</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        All banks · 1Y, 2Y, 3Y tenures · Senior citizen rates shown
                    </p>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400 font-semibold justify-end">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                        </span>
                        Updated today
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{updatedAt} IST</div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-left">
                            <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Bank</th>
                            <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-center">1 Year</th>
                            <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-center">2 Years</th>
                            <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-center">3 Years</th>
                            <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 hidden sm:table-cell">Senior +</th>
                            <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">Min Deposit</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {visible.map((row, i) => (
                            <tr
                                key={row.bank}
                                className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${
                                    row.isSFB ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''
                                }`}
                            >
                                <td className="px-4 py-3">
                                    <div className="font-medium text-slate-900 dark:text-slate-100">{row.bank}</div>
                                    {row.isSFB && (
                                        <span className="text-[10px] text-amber-700 dark:text-amber-400 flex items-center gap-0.5 mt-0.5">
                                            <AlertCircle className="h-2.5 w-2.5" /> Small Finance Bank
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-center font-mono font-semibold text-slate-800 dark:text-slate-200">
                                    {row.rate1Y}
                                </td>
                                <td className="px-4 py-3 text-center font-mono font-semibold text-slate-800 dark:text-slate-200">
                                    {row.rate2Y}
                                </td>
                                <td className="px-4 py-3 text-center font-mono font-bold text-green-700 dark:text-green-400">
                                    {row.rate3Y}
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell text-xs text-slate-500 dark:text-slate-400">
                                    {row.seniorRate ?? '—'}
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-500 dark:text-slate-400 font-mono">
                                    {row.minDeposit}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {row.affiliateUrl ? (
                                        <a
                                            href={row.affiliateUrl}
                                            target="_blank"
                                            rel="noopener noreferrer sponsored"
                                            className="text-xs font-semibold bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                                        >
                                            Open FD <ArrowUpRight className="h-3 w-3" />
                                        </a>
                                    ) : (
                                        <Link
                                            href="/fixed-deposits"
                                            className="text-xs text-green-700 dark:text-green-400 hover:underline font-medium"
                                        >
                                            Open →
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {rates.length > 5 && (
                <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                        onClick={() => setShowAll(v => !v)}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-green-700 dark:hover:text-green-400 transition-colors mx-auto"
                    >
                        {showAll ? (
                            <><ChevronUp className="h-3.5 w-3.5" /> Show less</>
                        ) : (
                            <><ChevronDown className="h-3.5 w-3.5" /> Compare {rates.length - 5} more banks</>
                        )}
                    </button>
                </div>
            )}

            <div className="px-4 py-2.5 bg-amber-50/50 dark:bg-amber-950/10 border-t border-amber-100 dark:border-amber-900/30 flex items-start gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-800 dark:text-amber-400">
                    Small Finance Bank FDs are covered under DICGC insurance up to ₹5 lakh per depositor. Rates sourced from bank websites — verify before investing.
                </p>
            </div>
        </div>
    );
}
