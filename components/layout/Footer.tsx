"use client";

import React from 'react';
import Link from "next/link";
import {
    TrendingUp,
    Facebook,
    Twitter,
    Linkedin,
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
        Disclosure: '/disclosure',
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
        { name: "Stocks & IPOs", page: "Stocks" },
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
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Newsletter - Pre-Footer */}
                {/* Newsletter - Theme-Aligned Card */}
                <div className="relative mb-20 p-8 md:p-12 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-slate-900/0 to-slate-900/0" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left max-w-xl">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Master the Market</h3>
                            <p className="text-slate-400 text-lg">Join 15,000+ investors getting the best IPO insights delivered weekly.</p>
                        </div>
                        <div className="w-full md:w-auto min-w-[340px] bg-white/10 p-1.5 rounded-xl backdrop-blur-sm border border-white/20">
                            <NewsletterWidget variant="minimal" className="w-full" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand & Contact */}
                    <div className="space-y-6">
                        <div>
                            <Logo 
                                variant="dark"
                                size="md"
                                showText={true}
                            />
                        </div>
                        <p className="text-sm leading-relaxed text-slate-300">
                            India's most trusted platform for investment research and comparison.
                        </p>
                        
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, url: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/investingpro.in', label: 'Facebook' },
                                { Icon: Twitter, url: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/investingpro_in', label: 'Twitter' },
                                { Icon: Instagram, url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/investingpro.in', label: 'Instagram' },
                                { Icon: Linkedin, url: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/investingpro', label: 'LinkedIn' },
                                { Icon: Youtube, url: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://www.youtube.com/@investingpro', label: 'YouTube' }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
                                >
                                    <social.Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>

                        {/* Get in Touch Removed - Pre-footer handles this now */}
                    </div>

                    {/* FAT COLUMN 1: All Financial Products */}
                    <div>
                        <div className="mb-8">
                            <h4 className="text-white font-bold tracking-wide mb-4">Credit Cards</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "Best Credit Cards", href: "/credit-cards" },
                                    { name: "Lifetime Free Cards", href: "/credit-cards" },
                                    { name: "Travel Cards", href: "/credit-cards" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-8">
                            <h4 className="text-white font-bold tracking-wide mb-4">Loans</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "Personal Loans", href: "/loans" },
                                    { name: "Home Loans", href: "/loans" },
                                    { name: "Check Eligibility", href: "/loans" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold tracking-wide mb-4">Investing</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "Mutual Funds", href: "/mutual-funds" },
                                    { name: "IPOs", href: "/stocks" },
                                    { name: "Fixed Deposits", href: "/fixed-deposits" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* FAT COLUMN 2: Tools & Knowledge */}
                    <div>
                        <div className="mb-8">
                            <h4 className="text-white font-bold tracking-wide mb-4">Calculators</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "SIP Calculator", href: "/calculators" },
                                    { name: "EMI Calculator", href: "/calculators" },
                                    { name: "Income Tax Calculator", href: "/calculators" },
                                    { name: "PPF Calculator", href: "/calculators" },
                                    { name: "GST Calculator", href: "/calculators" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold tracking-wide mb-4">Resources</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "Glossary", href: "/glossary" },
                                    { name: "Financial Guides", href: "/guides" },
                                    { name: "Market News", href: "/blog" },
                                    { name: "Methodology", href: "/methodology" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* FAT COLUMN 3: Corporate & Legal */}
                    <div>
                        <div className="mb-8">
                            <h4 className="text-white font-bold tracking-wide mb-4">Company</h4>
                            <ul className="space-y-2">
                                {footerLinks.company.map((link, i) => (
                                    <li key={i}>
                                        <Link href={getHref(link.page)} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold tracking-wide mb-4">Legal</h4>
                            <ul className="space-y-2">
                                {footerLinks.legal.map((link, i) => (
                                    <li key={i}>
                                        <Link href={getHref(link.page)} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>



                <div className="mt-12">
                    <div className="flex flex-col gap-6">
                        {/* Comprehensive Disclaimer */}
                        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800/50">
                            <h5 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                Important Legal Disclaimer
                            </h5>
                            <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
                                <p>
                                    <strong className="text-slate-300">InvestingPro.in is NOT a SEBI registered investment advisor, financial advisor, or stockbroker.</strong> We are an independent research, education, and discovery platform. Our content, tools, calculators, and product comparisons are provided for informational and educational purposes only.
                                </p>
                                <p>
                                    <strong className="text-slate-300">We do NOT provide:</strong> Investment advice, buy/sell/hold recommendations, personalized financial planning, or any form of financial advisory services. All information on this platform is for research, education, and discovery purposes to help you make informed decisions.
                                </p>
                                <p>
                                    <strong className="text-slate-300">Not Investment Advice:</strong> Nothing on this website constitutes a recommendation to buy, sell, or hold any security, financial product, or investment. Past performance does not guarantee future results. All investments carry risk of loss. You should conduct your own research and consult with a qualified, SEBI-registered financial advisor before making any investment decisions.
                                </p>
                                <p>
                                    <strong className="text-slate-300">Data Accuracy:</strong> While we strive for accuracy, we do not guarantee the completeness, timeliness, or accuracy of any information. Financial data, rates, and prices are subject to change and may differ from actual market rates. Always verify information with official sources.
                                </p>
                                <p className="pt-2 border-t border-slate-700/50">
                                    <Link href="/disclaimer" className="text-teal-400 hover:text-teal-300 underline font-medium">
                                        Read our complete disclaimer and terms of service
                                    </Link>
                                </p>
                            </div>
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
                                     <button 
                                        onClick={scrollToTop}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
                                        aria-label="Scroll to top"
                                     >
                                        <ArrowUp className="w-4 h-4" />
                                     </button>
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
        </footer>
    );
}
