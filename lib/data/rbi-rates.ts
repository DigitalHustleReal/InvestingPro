/**
 * RBI Rates & Macro Data — DBIE Portal
 * Source: data.rbi.org.in · rbi.org.in/Scripts/Statistics.aspx
 * Updated on MPC meeting dates (6× per year) + monthly for CPI/forex.
 * Seed values: Feb-Mar 2026 RBI data.
 */

export interface RBIRate {
  name: string;
  value: number;
  unit: string;
  lastUpdated: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  change?: number;
}

export interface ForexRate {
  currency: string;
  code: string;
  rate: number; // INR per 1 foreign unit
  lastUpdated: string;
}

export interface InflationData {
  period: string;
  cpi: number;
  foodInflation: number;
  coreInflation: number;
}

/** MPC Policy Rates — Feb 2026 RBI decision */
export const POLICY_RATES: RBIRate[] = [
  {
    name: 'Repo Rate',
    value: 6.25,
    unit: '%',
    lastUpdated: '2026-02-07',
    description: 'Rate at which RBI lends money to commercial banks overnight. A cut makes loans cheaper.',
    trend: 'down',
    change: -0.25,
  },
  {
    name: 'Reverse Repo Rate',
    value: 3.35,
    unit: '%',
    lastUpdated: '2026-02-07',
    description: 'Rate at which RBI borrows money from commercial banks. Lower repo → lower reverse repo.',
    trend: 'stable',
  },
  {
    name: 'CRR (Cash Reserve Ratio)',
    value: 4.0,
    unit: '%',
    lastUpdated: '2026-02-07',
    description: 'Fraction of deposits banks must hold as cash with RBI. Reduction frees up lending capacity.',
    trend: 'stable',
  },
  {
    name: 'SLR (Statutory Liquidity Ratio)',
    value: 18.0,
    unit: '%',
    lastUpdated: '2026-02-07',
    description: 'Fraction of deposits banks must maintain in liquid assets (gold, govt securities).',
    trend: 'stable',
  },
  {
    name: 'SDF (Standing Deposit Facility)',
    value: 6.00,
    unit: '%',
    lastUpdated: '2026-02-07',
    description: 'Lower bound of the liquidity adjustment facility (LAF) corridor. Banks park excess funds here.',
    trend: 'down',
    change: -0.25,
  },
  {
    name: 'MSF (Marginal Standing Facility)',
    value: 6.50,
    unit: '%',
    lastUpdated: '2026-02-07',
    description: 'Upper bound of the LAF corridor. Emergency overnight borrowing rate for banks.',
    trend: 'down',
    change: -0.25,
  },
];

/** CPI Inflation — MoSPI monthly release */
export const INFLATION_DATA: InflationData[] = [
  { period: 'Jan 2026', cpi: 4.26, foodInflation: 5.97, coreInflation: 3.68 },
  { period: 'Dec 2025', cpi: 5.22, foodInflation: 8.39, coreInflation: 3.66 },
  { period: 'Nov 2025', cpi: 5.48, foodInflation: 9.04, coreInflation: 3.66 },
  { period: 'Oct 2025', cpi: 6.21, foodInflation: 10.87, coreInflation: 3.68 },
  { period: 'Sep 2025', cpi: 5.49, foodInflation: 9.24, coreInflation: 3.72 },
  { period: 'Aug 2025', cpi: 3.65, foodInflation: 5.66, coreInflation: 3.60 },
];

/** RBI Reference Forex Rates */
export const FOREX_RATES: ForexRate[] = [
  { currency: 'US Dollar', code: 'USD', rate: 83.45, lastUpdated: '2026-03-24' },
  { currency: 'Euro', code: 'EUR', rate: 90.12, lastUpdated: '2026-03-24' },
  { currency: 'British Pound', code: 'GBP', rate: 106.78, lastUpdated: '2026-03-24' },
  { currency: 'Japanese Yen', code: 'JPY', rate: 0.56, lastUpdated: '2026-03-24' },
];

/** WALR / WALDR — bank-wise average lending/deposit rates (RBI monthly) */
export const WALR_DATA = {
  walr: 9.84,   // Weighted Avg Lending Rate (fresh rupee loans)
  waldr: 6.72,  // Weighted Avg Domestic Term Deposit Rate
  asOfMonth: 'Jan 2026',
};

/** MPC meeting schedule 2026 */
export const MPC_SCHEDULE_2026 = [
  { dates: '5–7 Feb', decision: 'Repo cut 25bps to 6.25%', status: 'done' },
  { dates: '7–9 Apr', decision: 'TBD', status: 'upcoming' },
  { dates: '4–6 Jun', decision: 'TBD', status: 'upcoming' },
  { dates: '5–7 Aug', decision: 'TBD', status: 'upcoming' },
  { dates: '30 Sep–2 Oct', decision: 'TBD', status: 'upcoming' },
  { dates: '4–6 Dec', decision: 'TBD', status: 'upcoming' },
];

/** GDP projections */
export const GDP_DATA = {
  fy2526Estimate: 7.4,
  fy2425Actual: 6.4,
  fy2324Actual: 8.2,
  source: 'RBI Monetary Policy Report, Feb 2026',
};
