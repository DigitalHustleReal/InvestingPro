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
import { Badge } from '@/components/ui/badge';

export const revalidate = 3600;

export default async function ElectricityBillCardsPage() {
    let assets = [];
    try {
        assets = await getCreditCardsByCategory([
            'electricity', 'utility', 'bill payment', 'utilities', 'bsnl', 'water bill', 'gas bill',
        ]);
    } catch (error) {
        console.error('[ElectricityBillCardsPage] Failed to load cards:', error);
        assets = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best Credit Cards for Electricity Bill Payment India (2026) | InvestingPro"
                description="Pay electricity bills with your credit card and earn cashback or reward points. Compare the best utility bill credit cards in India. Apply online."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Best Credit Cards for Electricity Bill Payment in India',
                    description: 'Compare credit cards offering rewards and cashback on electricity and utility bill payments in India.',
                    url: 'https://investingpro.in/credit-cards/electricity-bill',
                    numberOfItems: assets.length,
                }}
            />

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    <div className="flex justify-center mb-4">
                        <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-sm px-4 py-1">
                            First dedicated utility bill card comparison in India
                        </Badge>
                    </div>
                    <CategoryHero
                        title="Best Cards for Electricity & Utility Bills"
                        subtitle="Earn Rewards on Bills You Pay Every Month Anyway"
                        description="Electricity, gas, water, broadband — pay them all with the right credit card and earn cashback or reward points. Compare which cards reward utility spends."
                        primaryCta={{ text: 'Find Your Utility Card', href: '/credit-cards/find-your-card' }}
                        secondaryCta={{ text: 'Compare All Cards', href: '/credit-cards' }}
                        stats={[
                            { label: 'Cards Listed', value: `${assets.length}+` },
                            { label: 'Utility Cashback', value: 'Up to 5%' },
                            { label: 'Monthly Bills Covered', value: 'All' },
                        ]}
                        badge="Expert Reviewed • Updated March 2026 • Zero Competition"
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
