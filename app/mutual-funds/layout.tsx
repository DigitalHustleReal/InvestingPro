import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Best Mutual Funds in India (2026) — Compare SIP & Lumpsum Returns | InvestingPro',
    description: 'Compare top mutual funds in India by returns, AUM, and risk rating. Find the best SIP mutual funds across equity, debt, ELSS and hybrid categories.',
    alternates: { canonical: 'https://investingpro.in/mutual-funds' },
    openGraph: {
        title: 'Best Mutual Funds in India (2026) | InvestingPro',
        description: 'Compare top mutual funds. Best SIP funds, ELSS tax-saving funds & more.',
        url: 'https://investingpro.in/mutual-funds',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function MutualFundsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
