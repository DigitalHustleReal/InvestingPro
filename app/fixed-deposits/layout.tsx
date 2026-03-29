import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Best Fixed Deposit (FD) Rates in India (2026) — Compare & Invest | InvestingPro',
    description: 'Compare FD interest rates from 50+ banks and NBFCs in India. Find highest FD rates for senior citizens, short-term and long-term deposits.',
    alternates: { canonical: 'https://investingpro.in/fixed-deposits' },
    openGraph: {
        title: 'Best FD Rates in India (2026) | InvestingPro',
        description: 'Compare FD rates from 50+ banks. Highest interest rates for all tenures.',
        url: 'https://investingpro.in/fixed-deposits',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function FixedDepositsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
