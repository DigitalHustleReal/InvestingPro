import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SWP Calculator — Systematic Withdrawal Plan Calculator India | InvestingPro',
    description: 'Calculate monthly withdrawals from your mutual fund corpus using SWP. Plan your retirement income with our free Systematic Withdrawal Plan calculator.',
    alternates: { canonical: 'https://investingpro.in/calculators/swp' },
    openGraph: {
        title: 'SWP Calculator India | InvestingPro',
        description: 'Plan monthly withdrawals from mutual funds. Free SWP retirement income calculator.',
        url: 'https://investingpro.in/calculators/swp',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function SWPCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
