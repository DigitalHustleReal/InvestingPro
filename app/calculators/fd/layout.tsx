import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FD Calculator — Fixed Deposit Maturity & Interest Calculator India | InvestingPro',
    description: 'Calculate FD maturity amount and interest earned. Compare fixed deposit returns with simple and compound interest. Free FD calculator for all Indian banks.',
    alternates: { canonical: 'https://investingpro.in/calculators/fd' },
    openGraph: {
        title: 'FD Calculator India | InvestingPro',
        description: 'Calculate fixed deposit maturity and interest. Compare FD returns across banks.',
        url: 'https://investingpro.in/calculators/fd',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function FDCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
