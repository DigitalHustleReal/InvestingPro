/**
 * mfapi.in Client — Free Mutual Fund Historical NAV API
 *
 * Endpoint: https://api.mfapi.in/mf/{scheme_code}
 * No auth, no rate limit documented, returns full NAV history
 *
 * Used to enrich our fund data with:
 * - Historical NAV for charts
 * - Calculated returns (1Y/3Y/5Y/10Y CAGR)
 * - SIP simulation returns
 * - Max drawdown / risk metrics
 */

const MFAPI_BASE = 'https://api.mfapi.in/mf';

export interface MFAPIResponse {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
    isin_growth: string | null;
    isin_div_reinvestment: string | null;
  };
  data: Array<{ date: string; nav: string }>;
}

export interface NAVPoint {
  date: Date;
  nav: number;
  dateStr: string;
}

export interface FundReturns {
  return_1m: number | null;
  return_3m: number | null;
  return_6m: number | null;
  return_1y: number | null;
  return_3y: number | null;
  return_5y: number | null;
  return_10y: number | null;
  return_since_inception: number | null;
}

export interface SIPSimulation {
  period_years: number;
  monthly_amount: number;
  total_invested: number;
  current_value: number;
  returns_percent: number;
  xirr: number | null;
}

export interface RiskMetrics {
  max_drawdown: number;
  max_drawdown_date: string;
  recovery_days: number | null;
  negative_years: number;
  total_years: number;
  worst_1y_return: number;
  best_1y_return: number;
  volatility_1y: number | null;
}

export interface EnrichedFundData {
  scheme_code: string;
  latest_nav: number;
  nav_date: string;
  returns: FundReturns;
  sip_returns: SIPSimulation[];
  risk_metrics: RiskMetrics;
  nav_history_30d: NAVPoint[];
  nav_history_1y: NAVPoint[];
  aum_crores: number | null;
  expense_ratio: number | null;
}

/**
 * Fetch fund data from mfapi.in
 */
export async function fetchFundHistory(schemeCode: string): Promise<MFAPIResponse> {
  const res = await fetch(`${MFAPI_BASE}/${schemeCode}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`mfapi.in error: ${res.status} for scheme ${schemeCode}`);
  }

  return res.json();
}

/**
 * Parse date string from mfapi.in format (DD-MM-YYYY)
 */
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('-');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * Convert raw API data to sorted NAV points
 */
export function parseNAVHistory(data: MFAPIResponse['data']): NAVPoint[] {
  return data
    .map(d => ({
      date: parseDate(d.date),
      nav: parseFloat(d.nav),
      dateStr: d.date,
    }))
    .filter(d => !isNaN(d.nav) && d.nav > 0)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 */
function calculateCAGR(startNAV: number, endNAV: number, years: number): number {
  if (startNAV <= 0 || years <= 0) return 0;
  return (Math.pow(endNAV / startNAV, 1 / years) - 1) * 100;
}

/**
 * Find NAV closest to a target date
 */
function findNAVAtDate(history: NAVPoint[], targetDate: Date): NAVPoint | null {
  const targetTime = targetDate.getTime();
  let closest: NAVPoint | null = null;
  let minDiff = Infinity;

  for (const point of history) {
    const diff = Math.abs(point.date.getTime() - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closest = point;
    }
  }

  // Allow up to 7 days tolerance
  if (closest && minDiff <= 7 * 24 * 60 * 60 * 1000) {
    return closest;
  }
  return null;
}

/**
 * Calculate returns for various periods
 */
export function calculateReturns(history: NAVPoint[]): FundReturns {
  if (history.length < 2) {
    return {
      return_1m: null, return_3m: null, return_6m: null,
      return_1y: null, return_3y: null, return_5y: null,
      return_10y: null, return_since_inception: null,
    };
  }

  const latest = history[history.length - 1];
  const now = latest.date;

  const periods = [
    { key: 'return_1m', months: 1 },
    { key: 'return_3m', months: 3 },
    { key: 'return_6m', months: 6 },
    { key: 'return_1y', months: 12 },
    { key: 'return_3y', months: 36 },
    { key: 'return_5y', months: 60 },
    { key: 'return_10y', months: 120 },
  ] as const;

  const returns: Record<string, number | null> = {};

  for (const period of periods) {
    const targetDate = new Date(now);
    targetDate.setMonth(targetDate.getMonth() - period.months);
    const pastNAV = findNAVAtDate(history, targetDate);

    if (pastNAV) {
      const years = period.months / 12;
      if (years >= 1) {
        returns[period.key] = Math.round(calculateCAGR(pastNAV.nav, latest.nav, years) * 100) / 100;
      } else {
        // Absolute return for < 1 year
        returns[period.key] = Math.round(((latest.nav - pastNAV.nav) / pastNAV.nav) * 100 * 100) / 100;
      }
    } else {
      returns[period.key] = null;
    }
  }

  // Since inception
  const first = history[0];
  const totalYears = (latest.date.getTime() - first.date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  returns.return_since_inception = totalYears > 0
    ? Math.round(calculateCAGR(first.nav, latest.nav, totalYears) * 100) / 100
    : null;

  return returns as FundReturns;
}

/**
 * Simulate SIP returns based on historical NAV
 */
export function calculateSIPReturns(
  history: NAVPoint[],
  monthlyAmount: number = 500
): SIPSimulation[] {
  const latest = history[history.length - 1];
  if (!latest) return [];

  const periods = [1, 3, 5, 10];
  const results: SIPSimulation[] = [];

  for (const years of periods) {
    const startDate = new Date(latest.date);
    startDate.setFullYear(startDate.getFullYear() - years);

    // Find monthly NAV points
    let totalUnits = 0;
    let totalInvested = 0;
    const monthlyDate = new Date(startDate);

    while (monthlyDate <= latest.date) {
      const navPoint = findNAVAtDate(history, monthlyDate);
      if (navPoint) {
        totalUnits += monthlyAmount / navPoint.nav;
        totalInvested += monthlyAmount;
      }
      monthlyDate.setMonth(monthlyDate.getMonth() + 1);
    }

    if (totalInvested > 0) {
      const currentValue = Math.round(totalUnits * latest.nav);
      const returnsPercent = Math.round(((currentValue - totalInvested) / totalInvested) * 100 * 100) / 100;

      results.push({
        period_years: years,
        monthly_amount: monthlyAmount,
        total_invested: totalInvested,
        current_value: currentValue,
        returns_percent: returnsPercent,
        xirr: null, // Complex calculation, skip for now
      });
    }
  }

  return results;
}

/**
 * Calculate risk metrics from NAV history
 */
export function calculateRiskMetrics(history: NAVPoint[]): RiskMetrics {
  if (history.length < 30) {
    return {
      max_drawdown: 0, max_drawdown_date: '', recovery_days: null,
      negative_years: 0, total_years: 0,
      worst_1y_return: 0, best_1y_return: 0, volatility_1y: null,
    };
  }

  // Max drawdown
  let peak = history[0].nav;
  let maxDrawdown = 0;
  let maxDrawdownDate = '';

  for (const point of history) {
    if (point.nav > peak) peak = point.nav;
    const drawdown = ((peak - point.nav) / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      maxDrawdownDate = point.dateStr;
    }
  }

  // Recovery days from max drawdown
  let recoveryDays: number | null = null;
  if (maxDrawdownDate) {
    const ddDate = parseDate(maxDrawdownDate);
    const ddIdx = history.findIndex(p => p.dateStr === maxDrawdownDate);
    if (ddIdx >= 0) {
      const preDrawdownPeak = peak;
      for (let i = ddIdx + 1; i < history.length; i++) {
        if (history[i].nav >= preDrawdownPeak) {
          recoveryDays = Math.round((history[i].date.getTime() - ddDate.getTime()) / (24 * 60 * 60 * 1000));
          break;
        }
      }
    }
  }

  // Rolling 1-year returns
  const rollingReturns: number[] = [];
  for (let i = 252; i < history.length; i++) {
    const ret = ((history[i].nav - history[i - 252].nav) / history[i - 252].nav) * 100;
    rollingReturns.push(ret);
  }

  // Year-over-year returns for negative year count
  const latest = history[history.length - 1];
  const first = history[0];
  const totalYears = Math.floor((latest.date.getTime() - first.date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  let negativeYears = 0;

  for (let y = 0; y < totalYears; y++) {
    const yearStart = new Date(latest.date);
    yearStart.setFullYear(yearStart.getFullYear() - y - 1);
    const yearEnd = new Date(latest.date);
    yearEnd.setFullYear(yearEnd.getFullYear() - y);

    const startNav = findNAVAtDate(history, yearStart);
    const endNav = findNAVAtDate(history, yearEnd);
    if (startNav && endNav && endNav.nav < startNav.nav) negativeYears++;
  }

  // Volatility (annualized std dev of daily returns)
  let volatility: number | null = null;
  const recentHistory = history.slice(-252); // Last ~1 year
  if (recentHistory.length > 30) {
    const dailyReturns = [];
    for (let i = 1; i < recentHistory.length; i++) {
      dailyReturns.push((recentHistory[i].nav - recentHistory[i - 1].nav) / recentHistory[i - 1].nav);
    }
    const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
    const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / dailyReturns.length;
    volatility = Math.round(Math.sqrt(variance * 252) * 100 * 100) / 100; // Annualized
  }

  return {
    max_drawdown: Math.round(maxDrawdown * 100) / 100,
    max_drawdown_date: maxDrawdownDate,
    recovery_days: recoveryDays,
    negative_years: negativeYears,
    total_years: totalYears,
    worst_1y_return: rollingReturns.length > 0 ? Math.round(Math.min(...rollingReturns) * 100) / 100 : 0,
    best_1y_return: rollingReturns.length > 0 ? Math.round(Math.max(...rollingReturns) * 100) / 100 : 0,
    volatility_1y: volatility,
  };
}

/**
 * Full enrichment: fetch + calculate everything for a fund
 */
export async function enrichFundData(schemeCode: string): Promise<EnrichedFundData> {
  const apiData = await fetchFundHistory(schemeCode);
  const history = parseNAVHistory(apiData.data);

  const latest = history[history.length - 1];
  const returns = calculateReturns(history);
  const sipReturns = calculateSIPReturns(history, 500);
  const riskMetrics = calculateRiskMetrics(history);

  // Last 30 days and 1 year for charts
  const now = latest.date;
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return {
    scheme_code: schemeCode,
    latest_nav: latest.nav,
    nav_date: latest.dateStr,
    returns,
    sip_returns: sipReturns,
    risk_metrics: riskMetrics,
    nav_history_30d: history.filter(p => p.date >= thirtyDaysAgo),
    nav_history_1y: history.filter(p => p.date >= oneYearAgo),
    aum_crores: null, // Not available from mfapi.in
    expense_ratio: null, // Not available from mfapi.in
  };
}
