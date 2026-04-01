import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SSY Calculator — Sukanya Samriddhi Yojana Returns Calculator | InvestingPro',
    description: 'Calculate Sukanya Samriddhi Yojana (SSY) maturity amount for your daughter. Find total investment, interest earned and tax-free maturity corpus.',
    alternates: { canonical: 'https://investingpro.in/calculators/ssy' },
    openGraph: {
        title: 'SSY Calculator India | InvestingPro',
        description: 'Calculate Sukanya Samriddhi Yojana corpus for your daughter. Free SSY calculator.',
        url: 'https://investingpro.in/calculators/ssy',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function SSYCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
