import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MIS Calculator — Post Office Monthly Income Scheme Calculator India | InvestingPro',
    description: 'Calculate monthly income from Post Office Monthly Income Scheme (POMIS/MIS). Find monthly payout, total interest and maturity amount.',
    alternates: { canonical: 'https://investingpro.in/calculators/mis' },
    openGraph: {
        title: 'MIS Calculator India | InvestingPro',
        description: 'Calculate Post Office Monthly Income Scheme payouts. Free POMIS/MIS calculator.',
        url: 'https://investingpro.in/calculators/mis',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function MISCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
