import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { getLoansServer } from '@/lib/products/get-loans-server';
import LoansClient from './LoansClient';
import SEOContentBlock from '@/components/common/SEOContentBlock';
import { LOAN_SEO_CONTENT } from '@/lib/content/seo-content';
import MethodologyBanner from '@/components/common/MethodologyBanner';
import DataFreshnessBar from '@/components/common/DataFreshnessBar';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import CategoryHero from '@/components/common/CategoryHero';
import CibilCrossLink from '@/components/common/CibilCrossLink';

import type { Metadata } from 'next';

export const revalidate = 3600; // ISR: Revalidate every hour

export const metadata: Metadata = {
    title: 'Best Loans in India (2026) — Compare Interest Rates | InvestingPro',
    description: 'Compare home loans, personal loans, car loans and business loans from 50+ lenders. Check interest rates, eligibility and apply online.',
    alternates: { canonical: 'https://investingpro.in/loans' },
    openGraph: {
        title: 'Best Loans in India (2026) | InvestingPro',
        description: 'Compare loans from 50+ lenders. Lowest interest rates & instant approval.',
        url: 'https://investingpro.in/loans',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default async function LoansPage() {
    // SSR Fetch
    // SSR Fetch with Safety Fallback
    let loans: any[] = [];
    try {
        loans = await getLoansServer();
        console.log(`[LoansPage] Fetched ${loans?.length || 0} loans`);
    } catch (error) {
        console.error("[LoansPage] CRITICAL: Failed to load loans:", error);
        loans = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
            <SEOHead
                title="Compare Best Loans in India 2026 | InvestingPro"
                description="Instant approval loans with lowest interest rates. Calculate EMI, compare Personal, Home, and Car loans from HDFC, SBI, ICICI."
            />

            {/* Hero + Authority Signals */}
            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-8">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    <CategoryHero
                        title="Compare Best Loans in India"
                        subtitle="Lowest Rates. Instant Approval."
                        description="Compare personal loans, home loans, and car loans from 50+ banks and NBFCs. Check EMI, eligibility, and apply instantly."
                        primaryCta={{ text: "Check Eligibility", href: "/loans/eligibility-checker" }}
                        secondaryCta={{ text: "EMI Calculator", href: "/calculators/emi" }}
                        stats={[
                            { label: "Lenders Compared", value: `${loans.length}+` },
                            { label: "Instant Decision", value: "Yes" },
                            { label: "RBI Regulated", value: "All" },
                        ]}
                        badge="RBI-Regulated Lenders • Lowest Rate Guarantee • Instant Apply"
                        variant="primary"
                        className="mb-6"
                    />
                    <div className="max-w-xl mx-auto mb-6">
                        <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="rounded-xl border border-primary-200/50" />
                    </div>
                    <div className="max-w-3xl mx-auto space-y-3 mb-8">
                        <DataFreshnessBar
                            source="RBI"
                            updateFrequency="Daily"
                            productCount={loans.length}
                        />
                        <MethodologyBanner vertical="loans" />
                        <CibilCrossLink context="loans" />
                    </div>
                </div>
            </div>

            <LoansClient initialLoans={loans as any} />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <SEOContentBlock
                    title={LOAN_SEO_CONTENT.title}
                    content={LOAN_SEO_CONTENT.content}
                />
            </div>
        </div>
    );
}
