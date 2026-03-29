import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'EMI Calculator India — Home Loan, Car Loan, Personal Loan | InvestingPro',
    description: 'Calculate your loan EMI instantly. Free EMI calculator for home loan, car loan, personal loan and business loan. Compare EMIs across banks and tenures.',
    alternates: { canonical: 'https://investingpro.in/calculators/emi' },
    openGraph: {
        title: 'EMI Calculator India | InvestingPro',
        description: 'Calculate EMI for home loan, car loan & personal loan. Compare across banks.',
        url: 'https://investingpro.in/calculators/emi',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function EMICalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
