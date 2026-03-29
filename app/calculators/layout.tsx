import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free Financial Calculators India (2026) — SIP, EMI, PPF & More | InvestingPro',
    description: 'Free online financial calculators for Indian investors. SIP calculator, EMI calculator, PPF calculator, income tax calculator, FD calculator and 25+ more tools.',
    alternates: { canonical: 'https://investingpro.in/calculators' },
    openGraph: {
        title: 'Free Financial Calculators India | InvestingPro',
        description: '25+ free financial calculators — SIP, EMI, PPF, tax, FD and more.',
        url: 'https://investingpro.in/calculators',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
