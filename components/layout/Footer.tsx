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
    Mail
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
        Methodology: '/methodology',
        EditorialPolicy: '/editorial-policy',
        Privacy: '/privacy',
        Terms: '/terms',
        Disclaimer: '/disclaimer',
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
    company: [
        { name: "Blog", page: "Blog" },
        { name: "Methodology", page: "Methodology" },
        { name: "Editorial Policy", page: "EditorialPolicy" },
    ],
    resources: [
        { name: "Glossary", page: "Glossary" },
        { name: "Guides", page: "Guides" },
    ],
    legal: [
        { name: "Privacy Policy", page: "Privacy" },
        { name: "Terms of Service", page: "Terms" },
        { name: "Disclaimer", page: "Disclaimer" },
    ]
};

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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

                        {/* Get in Touch */}
                        <div className="pt-2">
                            <h5 className="text-white font-semibold text-sm mb-2">Get in Touch</h5>
                            <a href="mailto:support@investingpro.in" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                                <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </span>
                                support@investingpro.in
                            </a>
                        </div>
                    </div>

                    {/* Explore - Fat Column */}
                    <div>
                        <div className="mb-8">
                            <h4 className="text-white font-semibold mb-4">Credit Cards</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "Best Credit Cards", href: "/credit-cards/best" },
                                    { name: "Best Rewards Cards", href: "/credit-cards/best/rewards" },
                                    { name: "Lifetime Free Cards", href: "/credit-cards/best/lifetime-free" },
                                    { name: "Travel Credit Cards", href: "/credit-cards/best/travel" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm hover:text-teal-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Loans</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "Personal Loans", href: "/loans/personal-loan" },
                                    { name: "Home Loans", href: "/loans/home-loan" },
                                    { name: "Car Loans", href: "/loans/car-loan" },
                                    { name: "Check Eligibility", href: "/loans/calculators/eligibility" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm hover:text-teal-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Growth - Fat Column */}
                    <div>
                        <div className="mb-8">
                            <h4 className="text-white font-semibold mb-4">Investing</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "Best Mutual Funds", href: "/mutual-funds/best" },
                                    { name: "SIP Calculator", href: "/calculators/sip" },
                                    { name: "Compare Funds", href: "/mutual-funds/compare" },
                                    { name: "Stock Market News", href: "/news/markets" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm hover:text-teal-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Calculators</h4>
                            <ul className="space-y-2">
                                {[
                                    { name: "SIP Calculator", href: "/calculators/sip" },
                                    { name: "EMI Calculator", href: "/calculators/emi" },
                                    { name: "Income Tax Calculator", href: "/calculators/income-tax" },
                                    { name: "PPF Calculator", href: "/calculators/ppf" },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link href={link.href} className="text-sm hover:text-teal-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Company & Legal - Fat Column */}
                    <div>
                        <div className="mb-8">
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2">
                                {footerLinks.company.map((link, i) => (
                                    <li key={i}>
                                        <Link href={getHref(link.page)} className="text-sm hover:text-teal-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                                {footerLinks.resources.map((link, i) => (
                                    <li key={i}>
                                        <Link href={getHref(link.page)} className="text-sm hover:text-teal-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2">
                                {footerLinks.legal.map((link, i) => (
                                    <li key={i}>
                                        <Link href={getHref(link.page)} className="text-sm hover:text-teal-400 transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Newsletter Removed as per refinement request */}

                {/* Ecosystem Awareness - Institutional, footnote-style */}
                <div className="border-t border-slate-800 mt-8 pt-8">
                    <div className="mb-6">
                        <p className="text-[10px] font-medium text-slate-600 uppercase tracking-widest mb-3">
                            Related Platforms
                        </p>
                        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[11px] text-slate-500 leading-relaxed">
                            <a
                                href="https://beststockbrokers.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-slate-300 transition-colors"
                            >
                                BestStockBrokers.org
                            </a>
                            <a
                                href="https://swingtrader.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-slate-300 transition-colors"
                            >
                                SwingTrader.com
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8">
                    <div className="flex flex-col gap-6">
                        {/* Comprehensive Disclaimer */}
                        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
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
                        <div className="space-y-4">
                            {/* Security Badges */}
                            <div className="flex justify-center md:justify-start">
                                <SecurityBadgeGroup />
                            </div>
                            
                            {/* Copyright */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <p className="text-sm text-slate-500">
                                    © {new Date().getFullYear()} InvestingPro.in. All rights reserved.
                                </p>
                                <p className="text-xs text-slate-600 text-center md:text-right">
                                    InvestingPro.in is an independent platform. Not affiliated with SEBI or any financial institution.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
