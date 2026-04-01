import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PPF Calculator — Public Provident Fund Returns Calculator (2026) | InvestingPro',
    description: 'Calculate PPF maturity amount, interest earned and year-by-year balance. Plan your PPF investments with our free Public Provident Fund calculator.',
    alternates: { canonical: 'https://investingpro.in/calculators/ppf' },
    openGraph: {
        title: 'PPF Calculator India | InvestingPro',
        description: 'Calculate PPF maturity, interest and tax savings. Free PPF investment planner.',
        url: 'https://investingpro.in/calculators/ppf',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function PPFCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
