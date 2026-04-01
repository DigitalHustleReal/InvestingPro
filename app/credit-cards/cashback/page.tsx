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

export default async function CashbackCardsPage() {
    let assets = [];
    try {
        assets = await getCreditCardsByCategory(['cashback', 'cash back', 'statement credit', 'rebate', '5%', '2%']);
    } catch (error) {
        console.error('[CashbackCardsPage] Failed to load cards:', error);
        assets = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best Cashback Credit Cards in India (2026) — Compare & Apply | InvestingPro"
                description="Compare the best cashback credit cards in India. Get 1%–10% cashback on groceries, fuel, online shopping, and more. No-fee options included. Apply instantly."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Best Cashback Credit Cards in India',
                    description: 'Compare cashback credit cards from top Indian banks. Find cards with highest cashback on groceries, fuel, and online spends.',
                    url: 'https://investingpro.in/credit-cards/cashback',
                    numberOfItems: assets.length,
                }}
            />

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    <CategoryHero
                        title="Best Cashback Credit Cards"
                        subtitle="Earn Real Money Back on Every Spend"
                        description="India's most transparent cashback card comparison. See exactly how much you earn on groceries, fuel, dining, and online shopping — before you apply."
                        primaryCta={{ text: 'Find Your Card', href: '/credit-cards/find-your-card' }}
                        secondaryCta={{ text: 'Compare All Cards', href: '/credit-cards' }}
                        stats={[
                            { label: 'Cards Listed', value: `${assets.length}+` },
                            { label: 'Max Cashback', value: '10%' },
                            { label: 'No-Fee Options', value: 'Yes' },
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
