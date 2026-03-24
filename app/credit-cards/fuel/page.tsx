import React from 'react';
import SEOHead from '@/components/common/SEOHead';
import CategoryHero from '@/components/common/CategoryHero';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';
import MethodologyBanner from '@/components/common/MethodologyBanner';
import DataFreshnessBar from '@/components/common/DataFreshnessBar';
import CibilCrossLink from '@/components/common/CibilCrossLink';
import MobileEngagementBar from '@/components/common/MobileEngagementBar';
import CreditCardsClient from '../CreditCardsClient';
import { getCreditCardsByCategory } from '@/lib/products/get-cc-by-category';

export const revalidate = 3600;

export default async function FuelCardsPage() {
    let assets = [];
    try {
        assets = await getCreditCardsByCategory(['fuel', 'petrol', 'diesel', 'surcharge', 'bpcl', 'iocl', 'hpcl']);
    } catch (error) {
        console.error('[FuelCardsPage] Failed to load cards:', error);
        assets = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best Fuel Credit Cards in India (2026) — Save on Petrol & Diesel | InvestingPro"
                description="Save up to 5% on every fuel fill-up. Compare the best fuel credit cards in India with surcharge waivers, bonus points on BPCL/HPCL/IOCL, and fuel cashback. Apply now."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Best Fuel Credit Cards in India',
                    description: 'Compare fuel credit cards with surcharge waivers and bonus rewards on petrol and diesel purchases.',
                    url: 'https://investingpro.in/credit-cards/fuel',
                    numberOfItems: assets.length,
                }}
            />

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    <CategoryHero
                        title="Best Fuel Credit Cards"
                        subtitle="Save ₹1,000–₹3,000/Year on Every Fill-Up"
                        description="Compare fuel credit cards with 1% surcharge waivers, bonus reward points on BPCL, HPCL, and IOCL pumps, and accelerated cashback on petrol spends."
                        primaryCta={{ text: 'Find Your Fuel Card', href: '/credit-cards/find-your-card' }}
                        secondaryCta={{ text: 'Compare All Cards', href: '/credit-cards' }}
                        stats={[
                            { label: 'Cards Listed', value: `${assets.length}+` },
                            { label: 'Surcharge Waiver', value: '1%' },
                            { label: 'Fuel Cashback', value: 'Up to 5%' },
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
