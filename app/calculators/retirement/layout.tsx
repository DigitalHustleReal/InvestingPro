import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Retirement Calculator India — Plan Your Financial Freedom | InvestingPro',
    description: 'Calculate how much you need to retire comfortably in India. Factor in inflation, expenses, and investment returns. Free retirement planning calculator.',
    alternates: { canonical: 'https://investingpro.in/calculators/retirement' },
    openGraph: {
        title: 'Retirement Calculator India | InvestingPro',
        description: 'Plan your retirement corpus. Free calculator with inflation-adjusted projections.',
        url: 'https://investingpro.in/calculators/retirement',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function RetirementCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
