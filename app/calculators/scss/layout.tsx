import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SCSS Calculator — Senior Citizens Savings Scheme Returns | InvestingPro',
    description: 'Calculate returns from Senior Citizens Savings Scheme (SCSS). Find quarterly interest payout and maturity amount for SCSS deposits.',
    alternates: { canonical: 'https://investingpro.in/calculators/scss' },
    openGraph: {
        title: 'SCSS Calculator India | InvestingPro',
        description: 'Calculate SCSS returns and quarterly payouts for senior citizens.',
        url: 'https://investingpro.in/calculators/scss',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function SCSSCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
