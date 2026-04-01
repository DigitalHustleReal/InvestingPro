/**
 * Mutual Fund NAV — mfapi.in (wraps AMFI data)
 * Source: amfiindia.com · mfapi.in
 * 16,000+ schemes. Daily NAV updates. CORS enabled. Free.
 * API: https://api.mfapi.in/mf/{schemeCode}
 */

export interface MFScheme {
  schemeCode: number;
  schemeName: string;
  fundHouse: string;
  schemeType: string;     // 'Open Ended' | 'Close Ended'
  schemeCategory: string; // 'Equity' | 'Debt' | 'Hybrid' etc.
  schemeSubCategory: string;
  nav?: number;
  navDate?: string;
}

export interface MFNavResponse {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
  };
  data: Array<{ date: string; nav: string }>;
}

export interface MFDetail extends MFScheme {
  nav: number;
  navDate: string;
  returns: {
    '1w': number | null;
    '1m': number | null;
    '3m': number | null;
    '6m': number | null;
    '1y': number | null;
    '3y': number | null;
    '5y': number | null;
  };
  history: Array<{ date: string; nav: number }>;
}

/** Top 50 popular schemes — seed list for hub page */
export const FEATURED_SCHEMES: MFScheme[] = [
  // Large Cap
  { schemeCode: 120503, schemeName: 'SBI Bluechip Fund - Direct Growth', fundHouse: 'SBI Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Large Cap' },
  { schemeCode: 119598, schemeName: 'HDFC Top 100 Fund - Direct Growth', fundHouse: 'HDFC Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Large Cap' },
  { schemeCode: 125354, schemeName: 'Nippon India Large Cap Fund - Direct Growth', fundHouse: 'Nippon India Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Large Cap' },
  { schemeCode: 120586, schemeName: 'ICICI Pru Bluechip Fund - Direct Growth', fundHouse: 'ICICI Prudential', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Large Cap' },
  // Mid Cap
  { schemeCode: 120841, schemeName: 'Kotak Emerging Equity Fund - Direct Growth', fundHouse: 'Kotak Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Mid Cap' },
  { schemeCode: 119206, schemeName: 'HDFC Mid-Cap Opportunities Fund - Direct Growth', fundHouse: 'HDFC Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Mid Cap' },
  { schemeCode: 125497, schemeName: 'Nippon India Growth Fund - Direct Growth', fundHouse: 'Nippon India Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Mid Cap' },
  { schemeCode: 120505, schemeName: 'SBI Magnum Midcap Fund - Direct Growth', fundHouse: 'SBI Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Mid Cap' },
  // Small Cap
  { schemeCode: 125494, schemeName: 'Nippon India Small Cap Fund - Direct Growth', fundHouse: 'Nippon India Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Small Cap' },
  { schemeCode: 120828, schemeName: 'Kotak Small Cap Fund - Direct Growth', fundHouse: 'Kotak Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Small Cap' },
  { schemeCode: 120465, schemeName: 'SBI Small Cap Fund - Direct Growth', fundHouse: 'SBI Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Small Cap' },
  // Index Funds
  { schemeCode: 120716, schemeName: 'UTI Nifty 50 Index Fund - Direct Growth', fundHouse: 'UTI Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Index' },
  { schemeCode: 120837, schemeName: 'HDFC Index Fund Nifty 50 Plan - Direct Growth', fundHouse: 'HDFC Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Index' },
  { schemeCode: 148621, schemeName: 'Nippon India Index Fund Nifty 50 - Direct Growth', fundHouse: 'Nippon India Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Index' },
  // ELSS (Tax Saving)
  { schemeCode: 120503, schemeName: 'Axis Long Term Equity Fund - Direct Growth', fundHouse: 'Axis Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'ELSS' },
  { schemeCode: 120586, schemeName: 'Mirae Asset Tax Saver Fund - Direct Growth', fundHouse: 'Mirae Asset', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'ELSS' },
  { schemeCode: 119598, schemeName: 'Quant Tax Plan - Direct Growth', fundHouse: 'Quant Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'ELSS' },
  // Flexi Cap
  { schemeCode: 125350, schemeName: 'Parag Parikh Flexi Cap Fund - Direct Growth', fundHouse: 'PPFAS Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Flexi Cap' },
  { schemeCode: 120716, schemeName: 'Quant Flexi Cap Fund - Direct Growth', fundHouse: 'Quant Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Equity', schemeSubCategory: 'Flexi Cap' },
  // Debt
  { schemeCode: 120465, schemeName: 'SBI Short Term Debt Fund - Direct Growth', fundHouse: 'SBI Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Debt', schemeSubCategory: 'Short Duration' },
  { schemeCode: 125497, schemeName: 'HDFC Short Term Debt Fund - Direct Growth', fundHouse: 'HDFC Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Debt', schemeSubCategory: 'Short Duration' },
  // Hybrid
  { schemeCode: 119206, schemeName: 'ICICI Pru Balanced Advantage Fund - Direct Growth', fundHouse: 'ICICI Prudential', schemeType: 'Open Ended', schemeCategory: 'Hybrid', schemeSubCategory: 'Balanced Advantage' },
  { schemeCode: 125354, schemeName: 'SBI Equity Hybrid Fund - Direct Growth', fundHouse: 'SBI Mutual Fund', schemeType: 'Open Ended', schemeCategory: 'Hybrid', schemeSubCategory: 'Aggressive Hybrid' },
];

export const MF_CATEGORIES = ['Equity', 'Debt', 'Hybrid', 'Index', 'ELSS', 'International'] as const;
export const MF_SUBCATEGORIES: Record<string, string[]> = {
  Equity: ['Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Sectoral', 'Thematic'],
  Debt: ['Liquid', 'Short Duration', 'Medium Duration', 'Long Duration', 'Corporate Bond', 'Gilt'],
  Hybrid: ['Aggressive Hybrid', 'Balanced Advantage', 'Multi Asset', 'Conservative Hybrid'],
  Index: ['Nifty 50', 'Nifty Next 50', 'Sensex', 'Nifty Midcap 150'],
  ELSS: ['ELSS (Tax Saving)'],
  International: ['US Equity', 'Global Equity'],
};

/**
 * Fetch live NAV + returns for a scheme from mfapi.in
 * Falls back to empty returns if API unavailable (ISR will retry)
 */
export async function fetchMFNav(schemeCode: number): Promise<MFDetail | null> {
  try {
    const res = await fetch(`https://api.mfapi.in/mf/${schemeCode}`, {
      next: { revalidate: 86400 }, // daily ISR
    });
    if (!res.ok) return null;

    const json: MFNavResponse = await res.json();
    const history = json.data
      .slice(0, 365 * 5)
      .map(d => ({ date: d.date, nav: parseFloat(d.nav) }))
      .filter(d => !isNaN(d.nav));

    if (!history.length) return null;

    const currentNav = history[0].nav;

    const getNavDaysAgo = (days: number) => {
      const target = new Date();
      target.setDate(target.getDate() - days);
      const iso = target.toISOString().split('T')[0];
      // Find closest date
      const found = history.find(h => h.date <= iso.split('-').reverse().join('-'));
      return found?.nav ?? null;
    };

    const calcReturn = (oldNav: number | null) => {
      if (!oldNav || oldNav === 0) return null;
      return ((currentNav - oldNav) / oldNav) * 100;
    };

    // mfapi returns dates as DD-MM-YYYY
    const scheme = FEATURED_SCHEMES.find(s => s.schemeCode === schemeCode);

    return {
      schemeCode,
      schemeName: json.meta.scheme_name,
      fundHouse: json.meta.fund_house,
      schemeType: json.meta.scheme_type,
      schemeCategory: json.meta.scheme_category,
      schemeSubCategory: scheme?.schemeSubCategory ?? '',
      nav: currentNav,
      navDate: history[0].date,
      returns: {
        '1w': calcReturn(getNavDaysAgo(7)),
        '1m': calcReturn(getNavDaysAgo(30)),
        '3m': calcReturn(getNavDaysAgo(90)),
        '6m': calcReturn(getNavDaysAgo(180)),
        '1y': calcReturn(getNavDaysAgo(365)),
        '3y': calcReturn(getNavDaysAgo(365 * 3)),
        '5y': calcReturn(getNavDaysAgo(365 * 5)),
      },
      history: history.slice(0, 252), // ~1 year of daily data
    };
  } catch {
    return null;
  }
}

export function formatReturn(r: number | null): string {
  if (r === null) return '—';
  return `${r >= 0 ? '+' : ''}${r.toFixed(2)}%`;
}

export function returnColor(r: number | null): string {
  if (r === null) return 'text-slate-400';
  return r >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
}
