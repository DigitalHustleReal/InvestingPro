/**
 * Market & Rates Service
 * 
 * Provides live/simulated data for financial products and commodities.
 * Focuses on High-Yield numbers (Interest Rates, Gold Price) rather than just Stock Indices.
 */

export interface MarketRate {
    id: string;
    name: string;
    subtext?: string;
    value: number; // Raw value for logic
    displayValue: string; // Formatted "8.35%" or "₹72,400"
    change?: number;
    trend: 'up' | 'down' | 'neutral';
    category: 'loan' | 'insurance' | 'investment' | 'commodity' | 'forex';
    link: string; // CTA Link
    color?: string; // Optional override
}

export async function getLiveRates(): Promise<MarketRate[]> {
    // Simulate slight variance for "Live" feel
    const v = (base: number) => base + (Math.random() * 0.05 - 0.025);

    return [
        {
            id: 'home-loan',
            name: 'Home Loan',
            subtext: 'Lowest Rate',
            value: 8.35,
            displayValue: '8.35%',
            trend: 'down', // Rate falling is GOOD for loans
            category: 'loan',
            link: '/loans/home',
            color: 'text-brand-emerald' 
        },
        {
            id: 'personal-loan',
            name: 'Personal Loan',
            subtext: 'Starts @',
            value: 10.25,
            displayValue: '10.25%',
            trend: 'neutral',
            category: 'loan',
            link: '/loans/personal'
        },
        {
            id: 'fd-highest',
            name: 'Best FD Rate',
            subtext: '3 Year',
            value: 9.10,
            displayValue: '9.10%',
            trend: 'up', // High is GOOD for savings
            category: 'investment',
            link: '/banking/fixed-deposit'
        },
        {
            id: 'gold',
            name: 'Gold (10g)',
            subtext: '24K',
            value: 72450,
            displayValue: '₹72,450',
            change: 120,
            trend: 'up',
            category: 'commodity',
            link: '/investing/gold'
        },
        {
            id: 'nifty',
            name: 'NIFTY 50',
            value: 21750,
            displayValue: '21,750',
            change: 85.5,
            trend: 'up',
            category: 'investment',
            link: '/stocks'
        },
        {
            id: 'savings',
            name: 'Savings A/c',
            subtext: 'Max Rate',
            value: 7.00,
            displayValue: '7.00%',
            trend: 'neutral',
            category: 'investment',
            link: '/banking/savings'
        },
        {
            id: 'usdinr',
            name: 'USD/INR',
            value: 83.45,
            displayValue: '₹83.45',
            change: 0.05,
            trend: 'up',
            category: 'forex',
            link: '/forex'
        }
    ];
}

// Legacy Alias for backward compatibility if needed, but we should refactor consumers
export type MarketIndex = MarketRate;
export const getMarketIndices = getLiveRates;
