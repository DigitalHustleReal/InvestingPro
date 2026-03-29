import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Compound Interest Calculator India — Wealth Growth Estimator | InvestingPro',
    description: 'Calculate compound interest and future value of investments. See how money grows with different compounding frequencies — monthly, quarterly, annually.',
    alternates: { canonical: 'https://investingpro.in/calculators/compound-interest' },
    openGraph: {
        title: 'Compound Interest Calculator India | InvestingPro',
        description: 'See how your money grows with compound interest. Free wealth calculator.',
        url: 'https://investingpro.in/calculators/compound-interest',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function CompoundInterestLayout({ children }: { children: React.ReactNode }) {
    return children;
}
