import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'NPS Calculator — National Pension System Returns Calculator India | InvestingPro',
    description: 'Calculate NPS corpus and pension amount at retirement. Plan your National Pension System contributions with our free NPS calculator. Includes tax benefit estimation.',
    alternates: { canonical: 'https://investingpro.in/calculators/nps' },
    openGraph: {
        title: 'NPS Calculator India | InvestingPro',
        description: 'Calculate NPS corpus & pension. Plan retirement savings with National Pension System.',
        url: 'https://investingpro.in/calculators/nps',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function NPSCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
