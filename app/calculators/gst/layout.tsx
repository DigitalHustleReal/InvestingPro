import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'GST Calculator India — Calculate GST on Products & Services | InvestingPro',
    description: 'Calculate GST amount and final price including or excluding tax. Supports 5%, 12%, 18% and 28% GST slabs. Free Indian GST calculator.',
    alternates: { canonical: 'https://investingpro.in/calculators/gst' },
    openGraph: {
        title: 'GST Calculator India | InvestingPro',
        description: 'Calculate GST amount for all tax slabs. Free Indian GST calculator.',
        url: 'https://investingpro.in/calculators/gst',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function GSTCalculatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
