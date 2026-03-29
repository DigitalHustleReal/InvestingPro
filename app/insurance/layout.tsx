import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Best Insurance Plans in India (2026) — Compare & Buy Online | InvestingPro',
    description: 'Compare term insurance, health insurance, car insurance and more from top insurers in India. Get the best coverage at lowest premiums.',
    alternates: { canonical: 'https://investingpro.in/insurance' },
    openGraph: {
        title: 'Best Insurance Plans in India (2026) | InvestingPro',
        description: 'Compare term, health & car insurance from top Indian insurers.',
        url: 'https://investingpro.in/insurance',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function InsuranceLayout({ children }: { children: React.ReactNode }) {
    return children;
}
