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

export default async function UpiRupayCardsPage() {
    let assets = [];
    try {
        assets = await getCreditCardsByCategory(['rupay', 'upi', 'upi credit card', 'rupay credit']);
    } catch (error) {
        console.error('[UpiRupayCardsPage] Failed to load cards:', error);
        assets = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best RuPay UPI Credit Cards in India (2025) — Link to PhonePe, GPay | InvestingPro"
                description="Compare the best RuPay credit cards you can link to UPI apps (PhonePe, Google Pay, Paytm). Earn rewards on UPI spends. Zero foreign transaction fees on RuPay. Apply now."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Best RuPay UPI Credit Cards in India',
                    description: 'Compare RuPay credit cards that can be linked to UPI apps for seamless payments and rewards on UPI transactions.',
                    url: 'https://investingpro.in/credit-cards/upi-rupay',
                    numberOfItems: assets.length,
                }}
            />

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    <CategoryHero
                        title="Best RuPay UPI Credit Cards"
                        subtitle="Link to PhonePe, Google Pay & Earn Rewards"
                        description="India's only credit cards you can add to UPI apps and earn reward points on every QR scan. Compare RuPay credit cards from HDFC, SBI, Axis, and more."
                        primaryCta={{ text: 'Find Your RuPay Card', href: '/credit-cards/find-your-card' }}
                        secondaryCta={{ text: 'Compare All Cards', href: '/credit-cards' }}
                        stats={[
                            { label: 'Cards Listed', value: `${assets.length}+` },
                            { label: 'UPI Compatible', value: 'Yes' },
                            { label: 'Foreign Fee', value: '0%' },
                        ]}
                        badge="Expert Reviewed • Updated March 2026 • Low Competition"
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
