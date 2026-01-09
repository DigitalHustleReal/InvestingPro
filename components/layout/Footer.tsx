"use client";

import React from 'react';
import Link from "next/link";
import {
    TrendingUp,
    Youtube,
    Instagram,
    Mail,
    Heart,
    ArrowUp
} from "lucide-react";
import Logo from "@/components/common/Logo";
import NewsletterWidget from "@/components/engagement/NewsletterWidget";
import { NAVIGATION_CATEGORIES } from '@/lib/navigation/categories';
import { SecurityBadgeGroup } from '@/components/compliance/SecurityBadge';

// Helper to replace createPageUrl
const getHref = (pageName: string) => {
    const map: Record<string, string> = {
        Home: '/',
        MutualFunds: '/mutual-funds',
        Stocks: '/stocks',
        FixedDeposits: '/fixed-deposits',
        PPFandNPS: '/ppf-nps',
        Insurance: '/insurance',
        Calculators: '/calculators',
        Blog: '/blog',
        About: '/about',
        Methodology: '/methodology',
        EditorialPolicy: '/editorial-policy',
        Disclosure: '/how-we-make-money', // Fixed: was '/disclosure', now '/how-we-make-money'
        Privacy: '/privacy',
        Terms: '/terms',
        Disclaimer: '/disclaimer',
        Accessibility: '/accessibility',
        AlphaTerminal: '/terminal',
        Glossary: '/glossary',
        Guides: '/guides'
    };
    return map[pageName] || '/';
};

const footerLinks = {
    products: [
        { name: "Mutual Funds", page: "MutualFunds" },

        { name: "Fixed Deposits", page: "FixedDeposits" },
        { name: "PPF & NPS", page: "PPFandNPS" },
        { name: "Insurance", page: "Insurance" },
    ],
    tools: [
        { name: "SIP Calculator", page: "Calculators" },
        { name: "EMI Calculator", page: "Calculators" },
        { name: "FD Calculator", page: "Calculators" },
        { name: "GST Calculator", page: "Calculators" },
        { name: "Compare Funds", page: "MutualFunds" },
        { name: "Tax Calculator", page: "Calculators" },
        { name: "Alpha Terminal", page: "AlphaTerminal" },
    ],
    resources: [
        { name: "Glossary", page: "Glossary" },
        { name: "Guides", page: "Guides" },
    ],
    legal: [
        { name: "Privacy Policy", page: "Privacy" },
        { name: "Terms of Service", page: "Terms" },
        { name: "Disclaimer", page: "Disclaimer" },
        { name: "Accessibility", page: "Accessibility" },
    ],
    company: [
        { name: "About Us", page: "About" },
        { name: "How We Make Money", page: "Disclosure" },
        { name: "Methodology", page: "Methodology" },
        { name: "Editorial Policy", page: "EditorialPolicy" },
    ]
};

export function Footer() {
    const [showScrollTop, setShowScrollTop] = React.useState(false);
    const [disclaimerExpanded, setDisclaimerExpanded] = React.useState(false);

    React.useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) setShowScrollTop(true);
            else setShowScrollTop(false);
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* PROMINENT Trust & Transparency Banner - FTC Compliance */}
                <div className="mb-16 p-8 rounded-2xl border-2 border-primary-600/30 bg-gradient-to-r from-primary-100/30 via-slate-100/50 to-slate-100/30 dark:from-primary-950/30 dark:via-slate-900/50 dark:to-slate-900/30 relative overflow-hidden">
                    {/* Decorative Element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full" />
                    
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            {/* Left: Trust Message */}
                            <div className="text-center md:text-left max-w-xl">
                                <div className="inline-flex items-center gap-2 bg-primary-100/50 dark:bg-primary-900/50 border border-primary-600/50 rounded-full px-4 py-1.5 mb-4">
                                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                                    <span className="text-primary-700 dark:text-primary-300 text-xs font-bold uppercase tracking-widest">100% Independent</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                                    Zero Ads. Zero BS. <br className="hidden md:block" />
                                    <span className="text-primary-600 dark:text-primary-400">100% Honest</span>
                                </h3>
                                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                    We only make money through affiliate partnerships when you apply for products. 
                                    <strong className="text-slate-900 dark:text-white"> Our editorial team has ZERO access to commercial deals.</strong>
                                </p>
                            </div>

                            {/* Right: Disclosure Links */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Link 
                                    href="/how-we-make-money"
                                    className="px-6 py-3 bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 rounded-xl text-slate-700 dark:text-white font-semibold text-sm transition-all flex items-center gap-2 justify-center group"
                                >
                                    <span>How We Make Money</span>
                                    <ArrowUp className="w-4 h-4 rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                                <Link 
                                    href="/methodology"
                                    className="px-6 py-3 bg-primary-50 dark:bg-primary-600/20 hover:bg-primary-100 dark:hover:bg-primary-600/30 border border-primary-200 dark:border-primary-600/50 rounded-xl text-primary-700 dark:text-primary-300 font-semibold text-sm transition-all flex items-center gap-2 justify-center group"
                                >
                                    <span>Our Methodology</span>
                                    <ArrowUp className="w-4 h-4 rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Newsletter - Pre-Footer */}
                {/* Newsletter - Theme-Aligned Card */}
                <div className="relative mb-20 p-8 md:p-12 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-100/10 dark:from-secondary-900/10 via-slate-100/0 dark:via-slate-900/0 to-slate-100/0 dark:to-slate-900/0" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary-500/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left max-w-xl">
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">Master the Market</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-lg">Join 25,000+ investors getting the best IPO insights delivered weekly.</p>
                        </div>
                        <div className="w-full md:w-auto min-w-[340px] bg-white/10 p-1.5 rounded-xl backdrop-blur-sm border border-white/20">
                            <NewsletterWidget variant="minimal" className="w-full" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12">
                    {/* Brand & Contact */}
                    <div className="space-y-6 max-w-xs mx-auto md:mx-0">
                        <div>
                            <Logo 
                                variant="default"
                                size="md"
                                showText={true}
                            />
                        </div>
                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            India's most trusted platform for investment research and comparison.
                        </p>
                        
                        <div className="flex gap-3">
                            {[
                                { 
                                    Icon: () => (
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                        </svg>
                                    ), 
                                    url: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://x.com/investingpro_in', 
                                    label: 'X (Twitter)',
                                    hoverBg: 'bg-black',
                                },
                                { 
                                    Icon: Instagram, 
                                    url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/investingpro.in', 
                                    label: 'Instagram',
                                    hoverBg: 'bg-gradient-to-br from-purple-600 to-pink-500',
                                },
                                { 
                                    Icon: Youtube, 
                                    url: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://www.youtube.com/@investingpro', 
                                    label: 'YouTube',
                                    hoverBg: 'bg-red-600',
                                },
                                { 
                                    Icon: () => (
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                    ), 
                                    url: 'https://wa.me/919999999999', 
                                    label: 'WhatsApp',
                                    hoverBg: 'bg-green-500',
                                },
                                { 
                                    Icon: () => (
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                        </svg>
                                    ), 
                                    url: 'https://t.me/investingpro_in', 
                                    label: 'Telegram',
                                    hoverBg: 'bg-sky-500',
                                }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="group w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <span className={`absolute inset-0 rounded-xl ${social.hoverBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                    <span className="relative z-10 text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors duration-300">
                                        <social.Icon />
                                    </span>
                                </a>
                            ))}
                        </div>

                        {/* Get in Touch Removed - Pre-footer handles this now */}
                    </div>

                    {/* FAT COLUMN 1: All Financial Products */}
                    <div className="max-w-xs mx-auto md:mx-0">
                        <div className="mb-8">
                            <h4 className="text-slate-900 dark:text-white font-bold tracking-wide mb-4">Credit Cards</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "Best Credit Cards", href: "/credit-cards" },
                                    { name: "Lifetime Free Cards", href: "/credit-cards" },
                                    { name: "Travel Cards", href: "/credit-cards" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm md:text-sm text-slate-600 dark:text-slate-400 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-8">
                            <h4 className="text-slate-900 dark:text-white font-bold tracking-wide mb-4">Loans</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "Personal Loans", href: "/loans" },
                                    { name: "Home Loans", href: "/loans" },
                                    { name: "Check Eligibility", href: "/loans" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm text-slate-600 dark:text-slate-400 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-slate-900 dark:text-white font-bold tracking-wide mb-4">Investing</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "Mutual Funds", href: "/mutual-funds" },

                                    { name: "Fixed Deposits", href: "/fixed-deposits" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm text-slate-600 dark:text-slate-400 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-8">
                            <h4 className="text-slate-900 dark:text-white font-bold tracking-wide mb-4">Business & Taxes</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "Income Tax Hub", href: "/taxes" },
                                    { name: "Small Business Finance", href: "/small-business" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm text-slate-600 dark:text-slate-400 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* FAT COLUMN 2: Tools & Knowledge */}
                    <div className="max-w-xs mx-auto md:mx-0">
                        <div className="mb-8">
                            <h4 className="text-slate-900 dark:text-white font-bold tracking-wide mb-4">Calculators</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "SIP Calculator", href: "/calculators" },
                                    { name: "EMI Calculator", href: "/calculators" },
                                    { name: "Income Tax Calculator", href: "/calculators" },
                                    { name: "PPF Calculator", href: "/calculators" },
                                    { name: "GST Calculator", href: "/calculators" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm text-slate-600 dark:text-slate-400 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-slate-900 dark:text-white font-bold tracking-wide mb-4">Resources</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "Glossary", href: "/glossary" },
                                    { name: "Financial Guides", href: "/guides" },
                                    { name: "Market News", href: "/blog" },
                                    { name: "Methodology", href: "/methodology" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm text-slate-600 dark:text-slate-400 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* FAT COLUMN 3: Corporate & Legal */}
                    <div className="max-w-xs mx-auto md:mx-0">
                        <div className="mb-8">
                            <h4 className="text-slate-900 dark:text-white font-bold tracking-wide mb-4">Company</h4>
                            <ul className="space-y-2">
                                {footerLinks.company.map((link, i) => (
                                    <li key={i}>
                                        <Link href={getHref(link.page)} className="text-sm text-slate-600 dark:text-slate-400 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-slate-900 dark:text-white font-bold tracking-wide mb-4">Legal</h4>
                            <ul className="space-y-2">
                                {footerLinks.legal.map((link, i) => (
                                    <li key={i}>
                                        <Link href={getHref(link.page)} className="text-sm text-slate-600 dark:text-slate-400 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>



                <div className="mt-12">
                    <div className="flex flex-col gap-6">
                        {/* Comprehensive Disclaimer */}
                        <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-6 border border-slate-200 dark:border-slate-800/50">
                            <h5 className="text-slate-900 dark:text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-warning-500 rounded-full"></span>
                                Important Legal Disclaimer
                            </h5>
                            <div className={`space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed ${!disclaimerExpanded ? 'line-clamp-3' : ''}`}>
                                <p>
                                    <strong className="text-slate-800 dark:text-slate-300">InvestingPro.in is NOT a SEBI registered investment advisor, financial advisor, or stockbroker.</strong> We are an independent research, education, and discovery platform. Our content, tools, calculators, and product comparisons are provided for informational and educational purposes only.
                                </p>
                                {disclaimerExpanded && (
                                    <>
                                        <p>
                                            <strong className="text-slate-800 dark:text-slate-300">We do NOT provide:</strong> Investment advice, buy/sell/hold recommendations, personalized financial planning, or any form of financial advisory services. All information on this platform is for research, education, and discovery purposes to help you make informed decisions.
                                        </p>
                                        <p>
                                            <strong className="text-slate-800 dark:text-slate-300">Not Investment Advice:</strong> Nothing on this website constitutes a recommendation to buy, sell, or hold any security, financial product, or investment. Past performance does not guarantee future results. All investments carry risk of loss. You should conduct your own research and consult with a qualified, SEBI-registered financial advisor before making any investment decisions.
                                        </p>
                                        <p>

                                        </p>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={() => setDisclaimerExpanded(!disclaimerExpanded)}
                                className="text-primary-400 hover:text-primary-300 text-sm mt-3 font-medium flex items-center gap-1"
                            >
                                {disclaimerExpanded ? 'Show Less' : 'Read Full Disclaimer'}
                                <ArrowUp className={`w-3 h-3 transition-transform ${disclaimerExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            <p className="pt-3 border-t border-slate-200 dark:border-slate-700/50 mt-3">
                                <Link href="/disclaimer" className="text-primary-400 hover:text-primary-300 underline font-medium text-xs">
                                    Read complete terms of service
                                </Link>
                            </p>
                        </div>

                        {/* Copyright & Compliance */}
                        <div className="flex flex-col gap-6 pt-2">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                                <p className="text-sm text-slate-500 order-2 md:order-1">
                                    © {new Date().getFullYear()} InvestingPro.in. All rights reserved.
                                </p>

                                {/* Centered India Badge - The Heart of the App */}
                                <div className="order-1 md:order-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-default">
                                    <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                                        Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in India
                                    </span>
                                </div>

                                <div className="order-3 flex items-center gap-4">
                                     <SecurityBadgeGroup />
                                </div>
                            </div>
                            
                            <p className="text-[11px] text-slate-600 text-center max-w-3xl mx-auto leading-relaxed">
                                InvestingPro.in is an independent research platform. We are not a SEBI registered investment advisor. 
                                <br className="hidden md:block" />
                                All content is for educational purposes only.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Scroll Top Button */}
            <button 
                onClick={scrollToTop}
                aria-label="Back to top"
                className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-primary-500 text-white shadow-xl shadow-primary-500/20 hover:bg-primary-600 transition-all duration-300 transform ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
            >
                <ArrowUp className="w-5 h-5" strokeWidth={2} />
            </button>
        </footer>
    );
}
