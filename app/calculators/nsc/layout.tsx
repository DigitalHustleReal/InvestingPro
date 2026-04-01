import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'NSC Calculator — National Savings Certificate Returns India | InvestingPro',
    description: 'Calculate National Savings Certificate (NSC) maturity amount and interest. NSC offers guaranteed returns with 80C tax deduction benefits.',
    alternates: { canonical: 'https://investingpro.in/calculators/nsc' },
    openGraph: {
        title: 'NSC Calculator India | InvestingPro',
        description: 'Calculate NSC returns and 80C tax savings. Free National Savings Certificate calculator.',
        url: 'https://investingpro.in/calculators/nsc',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function NSCCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
