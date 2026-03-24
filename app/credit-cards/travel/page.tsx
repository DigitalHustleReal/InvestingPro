import React from 'react';
import SEOHead from '@/components/common/SEOHead';
import CategoryHero from '@/components/common/CategoryHero';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';
import MobileEngagementBar from '@/components/common/MobileEngagementBar';
import CreditCardsClient from '../CreditCardsClient';
import { getCreditCardsByCategory } from '@/lib/products/get-cc-by-category';

export const revalidate = 3600;

export default async function TravelCardsPage() {
    let assets = [];
    try {
        assets = await getCreditCardsByCategory(['travel', 'flight', 'hotel', 'lounge', 'air miles', 'miles', 'airport']);
    } catch (error) {
        console.error('[TravelCardsPage] Failed to load cards:', error);
        assets = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best Travel Credit Cards in India (2025) — Lounge Access & Miles | InvestingPro"
                description="Compare the best travel credit cards in India. Get free airport lounge access, air miles on every spend, complimentary flights, and travel insurance. Compare and apply."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Best Travel Credit Cards in India',
                    description: 'Compare travel credit cards with lounge access, air miles, and travel benefits from top Indian banks.',
                    url: 'https://investingpro.in/credit-cards/travel',
                    numberOfItems: assets.length,
                }}
            />

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    <CategoryHero
                        title="Best Travel Credit Cards"
                        subtitle="Fly More, Pay Less with Every Spend"
                        description="From free airport lounge access to international air miles, compare India's top travel cards. Find the right card whether you fly twice a year or every month."
                        primaryCta={{ text: 'Find Your Travel Card', href: '/credit-cards/find-your-card' }}
                        secondaryCta={{ text: 'Compare All Cards', href: '/credit-cards' }}
                        stats={[
                            { label: 'Cards Listed', value: `${assets.length}+` },
                            { label: 'Free Lounge Access', value: 'Yes' },
                            { label: 'Air Miles Cards', value: 'Yes' },
                        ]}
                        badge="Expert Reviewed • Updated March 2026 • Affiliate Disclosed"
                        variant="primary"
                        className="mb-8"
                    />
                    <div className="max-w-xl mx-auto mb-10">
                        <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="rounded-xl border border-primary-200/50" />
                    </div>
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
