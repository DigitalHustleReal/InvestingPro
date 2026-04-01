import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Income Tax Calculator India 2026 — Old vs New Regime | InvestingPro',
    description: 'Calculate income tax under old and new tax regime. Compare tax savings, deductions under 80C, HRA, and standard deduction. Free Indian income tax calculator 2025-26.',
    alternates: { canonical: 'https://investingpro.in/calculators/tax' },
    openGraph: {
        title: 'Income Tax Calculator India (Old vs New Regime) | InvestingPro',
        description: 'Compare income tax old vs new regime. Calculate tax savings for FY 2025-26.',
        url: 'https://investingpro.in/calculators/tax',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function TaxCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
