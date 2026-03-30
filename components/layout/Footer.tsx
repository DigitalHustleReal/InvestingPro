"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUp, Heart } from "lucide-react";
import Logo from "@/components/common/Logo";

// ─── Link data ────────────────────────────────────────────────────────────────

const PRODUCTS = [
    { name: "Credit Cards",   href: "/credit-cards" },
    { name: "Loans",          href: "/loans" },
    { name: "Mutual Funds",   href: "/mutual-funds" },
    { name: "Fixed Deposits", href: "/fixed-deposits" },
    { name: "Insurance",      href: "/insurance" },
    { name: "PPF & NPS",      href: "/ppf-nps" },
    { name: "Demat Accounts", href: "/demat-accounts" },
];

const TOOLS = [
    { name: "SIP Calculator",       href: "/calculators/sip" },
    { name: "EMI Calculator",       href: "/calculators/emi" },
    { name: "Income Tax Calculator",href: "/calculators/tax" },
    { name: "Home Loan EMI",        href: "/calculators/home-loan" },
    { name: "FD Calculator",        href: "/calculators/fd" },
    { name: "SWP Calculator",       href: "/calculators/swp" },
    { name: "All Calculators",      href: "/calculators" },
    { name: "Compare Products",     href: "/compare" },
    { name: "Glossary",             href: "/glossary" },
];

const COMPANY = [
    { name: "About Us",            href: "/about" },
    { name: "How We Make Money",   href: "/how-we-make-money" },
    { name: "Methodology",         href: "/methodology" },
    { name: "Editorial Policy",    href: "/editorial-policy" },
    { name: "Contact",             href: "/contact-us" },
    { name: "Pricing",             href: "/pricing" },
    { name: "Blog",                href: "/blog" },
];

const LEGAL = [
    { name: "Terms",               href: "/terms-of-service" },
    { name: "Privacy",             href: "/privacy-policy" },
    { name: "Cookies",             href: "/cookie-policy" },
    { name: "Disclaimer",          href: "/disclaimer" },
    { name: "Affiliate Disclosure",href: "/affiliate-disclosure" },
    { name: "Accessibility",       href: "/accessibility" },
];

// ─── Reusable link column ──────────────────────────────────────────────────────

function LinkColumn({ title, links }: { title: string; links: { name: string; href: string }[] }) {
    return (
        <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                {title}
            </h4>
            <ul className="space-y-2.5">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer() {
    const [showScrollTop, setShowScrollTop] = React.useState(false);
    const [disclaimerExpanded, setDisclaimerExpanded] = React.useState(false);

    React.useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <footer className="bg-white dark:bg-[#071410] border-t border-slate-200 dark:border-green-900/30">

            {/* ── Newsletter strip ─────────────────────────────────────────── */}
            <div className="border-b border-slate-100 dark:border-slate-800/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        <span className="text-slate-900 dark:text-white font-semibold">InvestingPro Weekly</span>
                        {' '}— independent finance insights, every Monday. No spam.
                    </p>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex items-center gap-2 w-full sm:w-auto"
                    >
                        <input
                            type="email"
                            placeholder="you@email.com"
                            className="h-9 px-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent w-full sm:w-56 transition"
                        />
                        <button
                            type="submit"
                            className="h-9 px-4 text-sm font-semibold bg-green-700 hover:bg-green-800 text-white rounded-lg transition whitespace-nowrap"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Main link grid ───────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 lg:gap-16">

                    {/* Brand column */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <Logo variant="default" size="md" showText={true} />
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[220px]">
                            Independent research and comparison for Indian investors.
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Not SEBI registered. Not investment advice.
                        </p>
                    </div>

                    <LinkColumn title="Products"  links={PRODUCTS} />
                    <LinkColumn title="Tools & Guides" links={TOOLS} />
                    <LinkColumn title="Company"   links={COMPANY} />
                </div>
            </div>

            {/* ── Bottom bar ───────────────────────────────────────────────── */}
            <div className="border-t border-slate-100 dark:border-slate-800/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Copyright */}
                    <p className="text-xs text-slate-400 dark:text-slate-500 order-3 md:order-1">
                        © {new Date().getFullYear()} InvestingPro.in. All rights reserved.
                    </p>

                    {/* Legal links */}
                    <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 order-1 md:order-2">
                        {LEGAL.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* India badge */}
                    <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 order-2 md:order-3">
                        Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India
                    </p>
                </div>

                {/* Legal disclaimer — single, collapsible */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5">
                    <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4">
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                            <strong className="text-slate-500 dark:text-slate-400">Not investment advice.</strong>{' '}
                            InvestingPro.in is an independent research and comparison platform. We are not a SEBI
                            registered investment advisor, financial advisor, or stockbroker. All content is for
                            informational and educational purposes only.
                            {disclaimerExpanded && (
                                <>{' '}Nothing on this site constitutes a recommendation to buy, sell, or hold any
                                security or financial product. Past performance does not guarantee future results.
                                All investments carry risk of loss. Consult a SEBI-registered advisor before
                                making any investment decisions. Not affiliated with, endorsed by, or associated
                                with Investing.com or its parent companies.</>
                            )}
                            {' '}
                            <button
                                onClick={() => setDisclaimerExpanded(!disclaimerExpanded)}
                                className="text-slate-500 dark:text-slate-400 underline underline-offset-2 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                            >
                                {disclaimerExpanded ? 'Show less' : 'Read full disclaimer'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Scroll-to-top ─────────────────────────────────────────────── */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
                className={`fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 p-3 rounded-full bg-green-700 text-white shadow-lg hover:bg-green-800 transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            >
                <ArrowUp className="w-5 h-5" strokeWidth={2} />
            </button>
        </footer>
    );
}
