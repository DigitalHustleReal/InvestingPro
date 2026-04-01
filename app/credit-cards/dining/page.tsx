import React from 'react';
import SEOHead from '@/components/common/SEOHead';
import CategoryHero from '@/components/common/CategoryHero';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';
import MobileEngagementBar from '@/components/common/MobileEngagementBar';
import MethodologyBanner from '@/components/common/MethodologyBanner';
import DataFreshnessBar from '@/components/common/DataFreshnessBar';
import CibilCrossLink from '@/components/common/CibilCrossLink';
import CreditCardsClient from '../CreditCardsClient';
import { getCreditCardsByCategory } from '@/lib/products/get-cc-by-category';

export const revalidate = 3600;

export default async function DiningCardsPage() {
    let assets = [];
    try {
        assets = await getCreditCardsByCategory(['dining', 'restaurant', 'food', 'swiggy', 'zomato', 'eat']);
    } catch (error) {
        console.error('[DiningCardsPage] Failed to load cards:', error);
        assets = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best Credit Cards for Dining & Restaurants India (2026) | InvestingPro"
                description="Compare the best credit cards for dining in India. Get 5x–10x rewards on Swiggy, Zomato, and restaurant spends. Complimentary dining offers and BOGO deals included."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Best Dining Credit Cards in India',
                    description: 'Compare credit cards offering maximum rewards on dining, restaurant bills, Swiggy, and Zomato orders.',
                    url: 'https://investingpro.in/credit-cards/dining',
                    numberOfItems: assets.length,
                }}
            />

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    <CategoryHero
                        title="Best Credit Cards for Dining"
                        subtitle="Earn on Every Restaurant Bill & Delivery Order"
                        description="Maximise rewards on dining spends — from 5-star restaurants to Swiggy and Zomato deliveries. Compare cards with dining discounts, BOGO offers, and high reward multipliers."
                        primaryCta={{ text: 'Find Your Dining Card', href: '/credit-cards/find-your-card' }}
                        secondaryCta={{ text: 'Compare All Cards', href: '/credit-cards' }}
                        stats={[
                            { label: 'Cards Listed', value: `${assets.length}+` },
                            { label: 'Max Dining Rewards', value: '10x' },
                            { label: 'Delivery App Offers', value: 'Yes' },
                        ]}
                        badge="Expert Reviewed • Updated March 2026 • Affiliate Disclosed"
                        variant="primary"
                        className="mb-8"
                    />
                    <MethodologyBanner vertical="credit-cards" className="mb-4" />
                    <DataFreshnessBar
                        verifiedAt={new Date().toISOString()}
                        source="RBI"
                        updateFrequency="Daily"
                        productCount={assets.length}
                        className="mb-4"
                    />
                    <div className="max-w-xl mx-auto mb-6">
                        <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="rounded-xl border border-primary-200/50" />
                    </div>
                    <CibilCrossLink context="cards" className="mb-6" />
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <CreditCardsClient initialAssets={assets as any} />
            </div>

            <div className="container mx-auto px-4 pb-8">
                <ComplianceDisclaimer variant="compact" />
            </div>

            <MobileEngagementBar category="credit_card" />
        </div>
    );
}
