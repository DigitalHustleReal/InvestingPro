
import React from 'react';
import Link from 'next/link';
import { Search, IndianRupee, Wallet, Plane, Gift, Crown, ShoppingBag, Fuel, ChevronRight, Compass } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input"; // Note: Search Input in Hero is non-functional in SSR unless wrapped, keeping visual or moving to Client
import SEOHead from "@/components/common/SEOHead";
import TopPicksRow from '@/components/credit-cards/TopPicksRow';
import CategoryHero from '@/components/common/CategoryHero';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import MobileEngagementBar from '@/components/common/MobileEngagementBar';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';
import { Card } from '@/components/ui/card';
import InlineSignup from '@/components/engagement/InlineSignup';

import { getCreditCardsServer } from '@/lib/products/get-credit-cards-server';
import CreditCardsClient from './CreditCardsClient';
import SEOContentBlock from '@/components/common/SEOContentBlock';
import { CREDIT_CARD_SEO_CONTENT } from '@/lib/content/seo-content';

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function CreditCardsPage() {
    // SSR Fetch with Safety Fallback (Defensive Programming)
    let assets = [];
    try {
        assets = await getCreditCardsServer();
        console.log(`[CreditCardsPage] Fetched ${assets?.length || 0} cards`);
    } catch (error) {
        // FAIL OPEN strategy: Log error but render page with empty assets
        console.error("[CreditCardsPage] CRITICAL: Failed to load credit cards:", error);
        assets = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title={`Best Credit Cards in India (${new Date().getFullYear()}) - Compare & Apply Online | InvestingPro`}
                description="Compare 100+ top credit cards in India. Get instant approval, check eligibility, and find cards with best rewards, cashback, and travel benefits. Apply now!"
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": "Best Credit Cards in India",
                    "description": "Compare and apply for the best credit cards in India based on rewards, cashback, and fees.",
                    "url": "https://investingpro.in/credit-cards",
                    "numberOfItems": assets.length
                }}
            />

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                 <div className="container mx-auto px-4">
                      <AutoBreadcrumbs />
                      
                      {/* Premium Authoritative Hero */}
                      <CategoryHero
                          title="Compare 1000+ Credit Cards"
                          subtitle="Make Smart Decisions. Apply Instantly."
                          description="Get personalized recommendations based on your spending pattern, lifestyle, and eligibility. Compare cards side-by-side and apply instantly with our affiliate partners."
                          primaryCta={{
                              text: "Find Your Perfect Card",
                              href: "/credit-cards/find-your-card"
                          }}
                          secondaryCta={{
                              text: "Compare All Cards",
                              href: "#compare"
                          }}
                          stats={[
                              { label: "Cards Compared", value: `${assets.length}+` }, // Dynamic count!
                              { label: "Instant Apply", value: "Yes" },
                              { label: "Decision Engine", value: "Active" }
                          ]}
                          badge="Helps You Decide • Expert-Reviewed • Instant Apply"
                          variant="primary"
                          className="mb-8"
                      />

                      {/* Pre-Launch Critical: Affiliate Disclosure above the fold */}
                      <div className="max-w-xl mx-auto mb-10">
                         <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="rounded-xl border border-primary-200/50" />
                      </div>

                      {/* Search Bar - Visual Only (Real search is in Client Component below or needs Refactoring to use URL params) 
                          For now, we keep it as a visual entry point that scrolls to the list or we move logic to Client.
                          Ideally, this input should be in a Client Component.
                          Lets just leave a static placeholder for UI consistency or hide it.
                      */}
                 </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-20">
                
                {/* Winners Podium - Guidance Layer */}
                <TopPicksRow />

                {/* Interactive Client Section (Filters, List, Search) */}
                <CreditCardsClient initialAssets={assets as any} />
             
            </div>

            {/* Weekly Picks — Frictionless inline signup */}
            <div className="container mx-auto px-4 pb-8">
              <InlineSignup variant="weekly-picks" category="Credit" />
            </div>

            {/* Browse by Category — Internal Link Hub */}
            <div className="container mx-auto px-4 pb-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-outfit">
                    Browse by Category
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                    Find the perfect credit card based on your spending pattern and lifestyle.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { type: 'cashback', label: 'Cashback', icon: Wallet, color: 'text-emerald-600' },
                        { type: 'travel', label: 'Travel', icon: Plane, color: 'text-blue-600' },
                        { type: 'rewards', label: 'Rewards', icon: Gift, color: 'text-purple-600' },
                        { type: 'premium', label: 'Premium', icon: Crown, color: 'text-amber-600' },
                        { type: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-pink-600' },
                        { type: 'fuel', label: 'Fuel', icon: Fuel, color: 'text-orange-600' },
                    ].map(({ type, label, icon: Icon, color }) => (
                        <Link key={type} href={`/credit-cards/category/${type}`}>
                            <Card className="p-4 hover:border-green-300 dark:hover:border-green-700 hover:shadow-md transition-all group cursor-pointer h-full">
                                <Icon className={`w-6 h-6 ${color} mb-2 group-hover:scale-110 transition-transform`} />
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                                    {label} Cards
                                </span>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Browse by Salary — Internal Link Hub */}
            <div className="container mx-auto px-4 pb-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-outfit">
                    Cards by Income Range
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                    Credit cards matched to your monthly salary for higher approval odds.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { bracket: '15000-25000', label: '₹15K - ₹25K' },
                        { bracket: '25000-50000', label: '₹25K - ₹50K' },
                        { bracket: '50000-75000', label: '₹50K - ₹75K' },
                        { bracket: '75000-100000', label: '₹75K - ₹1L' },
                        { bracket: '100000-150000', label: '₹1L - ₹1.5L' },
                        { bracket: '150000-300000', label: '₹1.5L - ₹3L' },
                        { bracket: '300000-500000', label: '₹3L - ₹5L' },
                        { bracket: '500000-plus', label: '₹5L+' },
                    ].map(({ bracket, label }) => (
                        <Link key={bracket} href={`/credit-cards/salary/${bracket}`}>
                            <Card className="p-3 hover:border-green-300 dark:hover:border-green-700 hover:shadow-md transition-all group cursor-pointer flex items-center gap-2">
                                <IndianRupee className="w-4 h-4 text-green-600 shrink-0" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                                    {label}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto shrink-0 group-hover:text-green-600 transition-colors" />
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Guides & Tools */}
            <div className="container mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/credit-cards/airport-lounge-access-india">
                        <Card className="p-5 hover:border-green-300 dark:hover:border-green-700 hover:shadow-lg transition-all group cursor-pointer">
                            <div className="flex items-start gap-3">
                                <Plane className="w-8 h-8 text-green-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                                        Airport Lounge Access Guide
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Compare 50+ cards with lounge benefits. Activation steps, visit limits, and {new Date().getFullYear()} rule changes.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                    <Link href="/credit-cards/compare">
                        <Card className="p-5 hover:border-green-300 dark:hover:border-green-700 hover:shadow-lg transition-all group cursor-pointer">
                            <div className="flex items-start gap-3">
                                <Compass className="w-8 h-8 text-green-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                                        Compare Credit Cards Side-by-Side
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Head-to-head comparison of popular credit cards. HDFC vs SBI, Axis vs ICICI, and more.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>

            {/* Compliance Disclaimer */}
            <div className="container mx-auto px-4 pb-8 space-y-12">
                <SEOContentBlock
                    title={CREDIT_CARD_SEO_CONTENT.title}
                    content={CREDIT_CARD_SEO_CONTENT.content}
                />

                <ComplianceDisclaimer variant="compact" />
            </div>

            {/* Mobile Engagement Bar */}
            <MobileEngagementBar category="credit_card" />

        </div>
    );
};
