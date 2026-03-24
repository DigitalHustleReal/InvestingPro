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

export default async function LoungeAccessCardsPage() {
    let assets = [];
    try {
        assets = await getCreditCardsByCategory(['lounge', 'airport lounge', 'priority pass', 'dreamfolks', 'vip lounge']);
    } catch (error) {
        console.error('[LoungeAccessCardsPage] Failed to load cards:', error);
        assets = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best Credit Cards with Free Airport Lounge Access India (2025) | InvestingPro"
                description="Compare credit cards with free airport lounge access in India. Get complimentary domestic and international lounge visits with Priority Pass, DreamFolks. Apply now."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Best Credit Cards with Airport Lounge Access in India',
                    description: 'Compare credit cards offering complimentary airport lounge access at domestic and international airports via Priority Pass and DreamFolks.',
                    url: 'https://investingpro.in/credit-cards/lounge-access',
                    numberOfItems: assets.length,
                }}
            />

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    <CategoryHero
                        title="Credit Cards with Free Lounge Access"
                        subtitle="Skip the Queue. Relax Before Every Flight."
                        description="Compare India's best cards offering free domestic and international airport lounge access via Priority Pass and DreamFolks. Know exactly how many visits you get per year."
                        primaryCta={{ text: 'Find Your Lounge Card', href: '/credit-cards/find-your-card' }}
                        secondaryCta={{ text: 'Compare All Cards', href: '/credit-cards' }}
                        stats={[
                            { label: 'Cards Listed', value: `${assets.length}+` },
                            { label: 'Domestic Lounges', value: '1,000+' },
                            { label: 'International Lounges', value: '1,400+' },
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
