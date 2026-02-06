import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { getLoansServer } from '@/lib/products/get-loans-server';
import LoansClient from './LoansClient';
import SEOContentBlock from '@/components/common/SEOContentBlock';
import { LOAN_SEO_CONTENT } from '@/lib/content/seo-content';

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function LoansPage() {
    // SSR Fetch
    // SSR Fetch with Safety Fallback
    let loans: any[] = [];
    try {
        loans = await getLoansServer();
    } catch (error) {
        console.error("Failed to load loans:", error);
        loans = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
            <SEOHead
                title="Compare Best Loans in India 2026 | InvestingPro"
                description="Instant approval loans with lowest interest rates. Calculate EMI, compare Personal, Home, and Car loans from HDFC, SBI, ICICI."
            />
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
