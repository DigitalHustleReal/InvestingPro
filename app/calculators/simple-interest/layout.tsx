import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Simple Interest Calculator India — SI Formula & Examples | InvestingPro',
    description: 'Calculate simple interest on loans and deposits. Find principal, rate, time and interest with our free simple interest calculator.',
    alternates: { canonical: 'https://investingpro.in/calculators/simple-interest' },
    openGraph: {
        title: 'Simple Interest Calculator India | InvestingPro',
        description: 'Calculate simple interest instantly. Free SI calculator with formula explanation.',
        url: 'https://investingpro.in/calculators/simple-interest',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function SimpleInterestLayout({ children }: { children: React.ReactNode }) {
    return children;
}
