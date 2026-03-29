import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'KVP Calculator — Kisan Vikas Patra Maturity Calculator India | InvestingPro',
    description: 'Calculate when your investment doubles with Kisan Vikas Patra (KVP). Find KVP maturity amount and interest earned at current government interest rates.',
    alternates: { canonical: 'https://investingpro.in/calculators/kvp' },
    openGraph: {
        title: 'KVP Calculator India | InvestingPro',
        description: 'Calculate Kisan Vikas Patra maturity and doubling period. Free KVP calculator.',
        url: 'https://investingpro.in/calculators/kvp',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function KVPCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
