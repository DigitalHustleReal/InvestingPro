import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Goal Planning Calculator — SIP Required for Financial Goals India | InvestingPro',
    description: 'Calculate monthly SIP required to achieve your financial goals. Plan for house, car, education, retirement and more. Free goal-based investment calculator.',
    alternates: { canonical: 'https://investingpro.in/calculators/goal-planning' },
    openGraph: {
        title: 'Goal Planning Calculator India | InvestingPro',
        description: 'Calculate SIP needed to achieve financial goals. Free goal-based investment planner.',
        url: 'https://investingpro.in/calculators/goal-planning',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function GoalPlanningLayout({ children }: { children: React.ReactNode }) {
    return children;
}
