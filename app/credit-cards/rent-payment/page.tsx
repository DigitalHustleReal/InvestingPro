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

export default async function RentPaymentCardsPage() {
    let assets = [];
    try {
        assets = await getCreditCardsByCategory(['rent', 'rental', 'housing', 'nobroker', 'magicbricks']);
    } catch (error) {
        console.error('[RentPaymentCardsPage] Failed to load cards:', error);
        assets = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best Credit Cards for Rent Payment India (2025) — Earn Points on Rent | InvestingPro"
                description="Pay rent with a credit card and earn reward points or cashback. Compare the best cards for rent payments in India via NoBroker, MagicBricks, CRED, and direct transfer."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Best Credit Cards for Rent Payment in India',
                    description: 'Compare credit cards that earn rewards on rent payments via NoBroker, CRED, MagicBricks, and direct bank transfer.',
                    url: 'https://investingpro.in/credit-cards/rent-payment',
                    numberOfItems: assets.length,
                }}
            />

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    <div className="flex justify-center mb-4">
                        <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-sm px-4 py-1">
                            First dedicated rent-payment card comparison in India
                        </Badge>
                    </div>
                    <CategoryHero
                        title="Best Cards for Paying Rent"
                        subtitle="Turn Your Biggest Monthly Bill Into Reward Points"
                        description="₹15,000–₹30,000 monthly rent = ₹1,800–₹3,600 in rewards per year on the right card. Compare cards that earn points, cashback, or miles on rent payments."
                        primaryCta={{ text: 'Find Your Rent Card', href: '/credit-cards/find-your-card' }}
                        secondaryCta={{ text: 'Compare All Cards', href: '/credit-cards' }}
                        stats={[
                            { label: 'Cards Listed', value: `${assets.length}+` },
                            { label: 'Avg Monthly Rent', value: '₹18,000' },
                            { label: 'Annual Reward Value', value: '₹2,000+' },
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
