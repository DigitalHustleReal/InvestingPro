import React from 'react';
import SEOHead from '@/components/common/SEOHead';
import CategoryHero from '@/components/common/CategoryHero';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';
import MobileEngagementBar from '@/components/common/MobileEngagementBar';
import CreditCardsClient from '../CreditCardsClient';
import { getCreditCardsByCategory } from '@/lib/products/get-cc-by-category';
import { Badge } from '@/components/ui/badge';

export const revalidate = 3600;

export default async function OttCardsPage() {
    let assets = [];
    try {
        assets = await getCreditCardsByCategory([
            'ott', 'netflix', 'amazon prime', 'hotstar', 'disney', 'sony liv', 'zee5', 'streaming', 'subscription',
        ]);
    } catch (error) {
        console.error('[OttCardsPage] Failed to load cards:', error);
        assets = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best Credit Cards for OTT & Netflix Subscriptions India (2025) | InvestingPro"
                description="Get free or discounted Netflix, Amazon Prime, Hotstar, SonyLIV subscriptions with your credit card. Compare India's best OTT credit cards. Apply now."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Best Credit Cards for OTT Subscriptions in India',
                    description: 'Compare credit cards that include free Netflix, Amazon Prime, Hotstar, and other OTT subscriptions as benefits.',
                    url: 'https://investingpro.in/credit-cards/ott-subscriptions',
                    numberOfItems: assets.length,
                }}
            />

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    {/* First-mover badge */}
                    <div className="flex justify-center mb-4">
                        <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-sm px-4 py-1">
                            First comprehensive OTT card comparison in India
                        </Badge>
                    </div>
                    <CategoryHero
                        title="Credit Cards for OTT Subscriptions"
                        subtitle="Get Netflix, Prime & Hotstar — Paid by Your Card"
                        description="Why pay ₹6,000/year for OTT apps when your credit card can cover it? Compare cards offering free or discounted Netflix, Amazon Prime, Hotstar, SonyLIV, and Zee5."
                        primaryCta={{ text: 'Find Your OTT Card', href: '/credit-cards/find-your-card' }}
                        secondaryCta={{ text: 'Compare All Cards', href: '/credit-cards' }}
                        stats={[
                            { label: 'Cards Listed', value: `${assets.length}+` },
                            { label: 'Free OTT Plans', value: 'Yes' },
                            { label: 'Annual OTT Saving', value: '₹6,000+' },
                        ]}
                        badge="Expert Reviewed • Updated March 2026 • Zero Competition"
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
