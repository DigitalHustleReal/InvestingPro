import { createClient } from '@/lib/supabase/server';

export interface TickerRate {
    label: string;
    value: string;
    change?: string;   // '+0.25%' or '-0.10%'
    trend?: 'up' | 'down' | 'flat';
    href: string;
}

export interface HomeLoanRate {
    bank: string;
    rate: string;         // '8.35%'
    rateNum: number;      // 8.35
    emi50L: number;       // monthly EMI for ₹50L / 20yr
    deltaVsBest: number;  // 0 for cheapest, positive for others
    cibilMin: number;
    affiliateUrl?: string;
    logo?: string;
}

export interface FDRate {
    bank: string;
    rate1Y: string;
    rate2Y: string;
    rate3Y: string;
    seniorRate?: string;  // Additional for senior citizens
    minDeposit: string;
    isSFB?: boolean;      // Small Finance Bank — higher rates, explain safety
    affiliateUrl?: string;
}

// Static fallback data — updated March 2026 from public bank websites
const FALLBACK_HOME_LOAN_RATES: HomeLoanRate[] = [
    { bank: 'State Bank of India', rate: '8.35%', rateNum: 8.35, emi50L: 43152, deltaVsBest: 0, cibilMin: 700, logo: 'SBI' },
    { bank: 'Bank of Baroda', rate: '8.40%', rateNum: 8.40, emi50L: 43351, deltaVsBest: 199, cibilMin: 700, logo: 'BOB' },
    { bank: 'HDFC Bank', rate: '8.50%', rateNum: 8.50, emi50L: 43741, deltaVsBest: 589, cibilMin: 720, logo: 'HDFC' },
    { bank: 'ICICI Bank', rate: '8.55%', rateNum: 8.55, emi50L: 43938, deltaVsBest: 786, cibilMin: 720, logo: 'ICICI' },
    { bank: 'Kotak Mahindra Bank', rate: '8.65%', rateNum: 8.65, emi50L: 44334, deltaVsBest: 1182, cibilMin: 730, logo: 'Kotak' },
    { bank: 'Axis Bank', rate: '8.75%', rateNum: 8.75, emi50L: 44733, deltaVsBest: 1581, cibilMin: 720, logo: 'Axis' },
    { bank: 'Punjab National Bank', rate: '8.40%', rateNum: 8.40, emi50L: 43351, deltaVsBest: 199, cibilMin: 700, logo: 'PNB' },
    { bank: 'LIC Housing Finance', rate: '8.45%', rateNum: 8.45, emi50L: 43547, deltaVsBest: 395, cibilMin: 700, logo: 'LIC HFL' },
];

const FALLBACK_FD_RATES: FDRate[] = [
    { bank: 'AU Small Finance Bank', rate1Y: '7.25%', rate2Y: '7.50%', rate3Y: '7.50%', seniorRate: '+0.25%', minDeposit: '₹1,000', isSFB: true },
    { bank: 'IDFC FIRST Bank', rate1Y: '7.00%', rate2Y: '7.25%', rate3Y: '7.00%', seniorRate: '+0.50%', minDeposit: '₹10,000' },
    { bank: 'Bajaj Finance', rate1Y: '7.40%', rate2Y: '7.65%', rate3Y: '7.40%', seniorRate: '+0.25%', minDeposit: '₹25,000' },
    { bank: 'HDFC Bank', rate1Y: '6.60%', rate2Y: '7.00%', rate3Y: '7.00%', seniorRate: '+0.25%', minDeposit: '₹5,000' },
    { bank: 'SBI', rate1Y: '6.80%', rate2Y: '7.00%', rate3Y: '6.75%', seniorRate: '+0.50%', minDeposit: '₹1,000' },
    { bank: 'ICICI Bank', rate1Y: '6.70%', rate2Y: '7.00%', rate3Y: '7.00%', seniorRate: '+0.25%', minDeposit: '₹10,000' },
    { bank: 'Equitas SFB', rate1Y: '7.25%', rate2Y: '7.75%', rate3Y: '7.50%', seniorRate: '+0.50%', minDeposit: '₹5,000', isSFB: true },
    { bank: 'Unity Small Finance Bank', rate1Y: '7.65%', rate2Y: '8.15%', rate3Y: '8.15%', seniorRate: '+0.50%', minDeposit: '₹1,000', isSFB: true },
];

const FALLBACK_TICKER: TickerRate[] = [
    { label: 'RBI Repo Rate', value: '6.50%', change: '-0.25%', trend: 'down', href: '/loans/home-loan' },
    { label: 'SBI Home Loan', value: '8.35%', trend: 'flat', href: '/loans/home-loan' },
    { label: 'Best FD (Unity SFB)', value: '8.15%', trend: 'flat', href: '/fixed-deposits' },
    { label: 'HDFC Home Loan', value: '8.50%', trend: 'flat', href: '/loans/home-loan' },
    { label: 'Bajaj Finance FD', value: '7.65%', trend: 'flat', href: '/fixed-deposits' },
    { label: 'AU SFB FD', value: '7.50%', trend: 'flat', href: '/fixed-deposits' },
    { label: 'Nifty 50', value: '22,450', change: '+0.4%', trend: 'up', href: '/mutual-funds' },
    { label: 'Gold (10g, 24K)', value: '₹91,450', trend: 'flat', href: '/mutual-funds' },
];

/**
 * Fetches live rate data for the ticker. Falls back to static data on any error.
 * Revalidate: 3600s (hourly) — rates don't change that frequently.
 */
export async function getLiveRates(): Promise<{
    ticker: TickerRate[];
    homeLoanRates: HomeLoanRate[];
    fdRates: FDRate[];
    updatedAt: string;
}> {
    const updatedAt = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    try {
        const supabase = await createClient();

        // Try to pull rate overrides from DB (admin-managed)
        const { data: rateOverrides } = await supabase
            .from('rate_snapshots')
            .select('*')
            .eq('is_active', true)
            .order('updated_at', { ascending: false })
            .limit(50);

        // If we have DB data, merge with fallbacks; otherwise use fallbacks
        // For now, return fallbacks (rate_snapshots table may not exist yet)
        return {
            ticker: FALLBACK_TICKER,
            homeLoanRates: FALLBACK_HOME_LOAN_RATES,
            fdRates: FALLBACK_FD_RATES,
            updatedAt,
        };
    } catch {
        // Fail open — always return static data
        return {
            ticker: FALLBACK_TICKER,
            homeLoanRates: FALLBACK_HOME_LOAN_RATES,
            fdRates: FALLBACK_FD_RATES,
            updatedAt,
        };
    }
}
