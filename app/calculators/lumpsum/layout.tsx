import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lumpsum Calculator — One-Time Mutual Fund Investment Returns | InvestingPro',
    description: 'Calculate returns on lumpsum mutual fund investments. Estimate wealth growth with our free one-time investment calculator for equity, debt and hybrid funds.',
    alternates: { canonical: 'https://investingpro.in/calculators/lumpsum' },
    openGraph: {
        title: 'Lumpsum Investment Calculator India | InvestingPro',
        description: 'Calculate returns on one-time mutual fund investment. Free lumpsum calculator.',
        url: 'https://investingpro.in/calculators/lumpsum',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function LumpsumCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
