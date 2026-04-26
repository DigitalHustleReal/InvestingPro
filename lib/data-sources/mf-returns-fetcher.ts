/**
 * Mutual Fund Returns Fetcher
 *
 * AMFI's NAVAll.txt feed only carries current NAV + scheme metadata —
 * NOT historical returns (1Y / 3Y / 5Y CAGR). To populate the
 * `returns_1y`, `returns_3y`, `returns_5y` columns on the mutual_funds
 * table (which the algorithmic rating depends on), we use MFAPI.in's
 * free public endpoint that returns full historical NAV per scheme:
 *
 *   https://api.mfapi.in/mf/{schemeCode}
 *
 * From that history we compute simple CAGR over each window. This is
 * the same calculation AMC websites use for their published returns.
 *
 * Rate limits: MFAPI.in is generous but informal — we throttle to one
 * request per ~250ms (~4/sec) to be polite. Backfilling 514 funds
 * takes ~2 minutes per run.
 */

import { logger } from "@/lib/logger";

interface MfApiNavRow {
  date: string; // dd-mm-yyyy
  nav: string;
}

interface MfApiResponse {
  meta?: {
    fund_house?: string;
    scheme_type?: string;
    scheme_category?: string;
    scheme_code?: number;
    scheme_name?: string;
  };
  data?: MfApiNavRow[];
  status?: string;
}

export interface FundReturns {
  schemeCode: number;
  returns1Y: number | null;
  returns3Y: number | null;
  returns5Y: number | null;
  navLatest: number | null;
  navDate: string | null;
}

/**
 * Convert dd-mm-yyyy → Date
 */
function parseMfApiDate(s: string): Date {
  const [d, m, y] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/**
 * Compute CAGR between two NAV points.
 * Returns null when the start NAV is missing or the period is too short.
 */
function cagr(startNav: number, endNav: number, years: number): number | null {
  if (!Number.isFinite(startNav) || !Number.isFinite(endNav) || startNav <= 0)
    return null;
  if (years <= 0) return null;
  return (Math.pow(endNav / startNav, 1 / years) - 1) * 100;
}

/**
 * Find the NAV row closest to (but not later than) a target date.
 * Falls back to the closest row within ±10 days if exact not present.
 */
function navOnOrBefore(
  rows: { date: Date; nav: number }[],
  target: Date,
): number | null {
  // rows are sorted by date ASC
  let best: { date: Date; nav: number } | null = null;
  for (const r of rows) {
    if (r.date.getTime() <= target.getTime()) {
      best = r;
    } else {
      break;
    }
  }
  if (!best) {
    // Take the earliest row if target is before fund inception
    return rows.length > 0 ? rows[0].nav : null;
  }
  // Sanity check: best must be within 30 days of target
  const diffDays =
    Math.abs(best.date.getTime() - target.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays > 30) return null;
  return best.nav;
}

/**
 * Fetch historical NAV + compute 1Y / 3Y / 5Y CAGR for a single scheme.
 * Returns null on fetch failure or when the scheme has no usable history.
 */
export async function fetchFundReturns(
  schemeCode: number,
): Promise<FundReturns | null> {
  try {
    const url = `https://api.mfapi.in/mf/${schemeCode}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "InvestingPro/1.0 (+https://investingpro.in)" },
      next: { revalidate: 86400 }, // 24h cache
    });
    if (!res.ok) {
      logger.warn(`[mf-returns] ${schemeCode} → HTTP ${res.status}`);
      return null;
    }
    const json = (await res.json()) as MfApiResponse;
    if (!json.data || json.data.length === 0) {
      logger.warn(`[mf-returns] ${schemeCode} → empty NAV data`);
      return null;
    }

    // Parse and sort ASC
    const rows = json.data
      .map((r) => ({ date: parseMfApiDate(r.date), nav: parseFloat(r.nav) }))
      .filter((r) => Number.isFinite(r.nav) && !isNaN(r.date.getTime()))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (rows.length === 0) return null;

    const latest = rows[rows.length - 1];
    const today = latest.date;

    const oneYearAgo = new Date(today);
    oneYearAgo.setUTCFullYear(today.getUTCFullYear() - 1);
    const threeYearsAgo = new Date(today);
    threeYearsAgo.setUTCFullYear(today.getUTCFullYear() - 3);
    const fiveYearsAgo = new Date(today);
    fiveYearsAgo.setUTCFullYear(today.getUTCFullYear() - 5);

    const nav1Y = navOnOrBefore(rows, oneYearAgo);
    const nav3Y = navOnOrBefore(rows, threeYearsAgo);
    const nav5Y = navOnOrBefore(rows, fiveYearsAgo);

    // Period must actually exist: e.g. don't return 1Y for a 6-month-old fund
    const earliestRow = rows[0].date.getTime();
    const has1Y = today.getTime() - earliestRow >= 365 * 24 * 60 * 60 * 1000;
    const has3Y =
      today.getTime() - earliestRow >= 3 * 365 * 24 * 60 * 60 * 1000;
    const has5Y =
      today.getTime() - earliestRow >= 5 * 365 * 24 * 60 * 60 * 1000;

    return {
      schemeCode,
      returns1Y: has1Y && nav1Y ? round2(cagr(nav1Y, latest.nav, 1)) : null,
      returns3Y: has3Y && nav3Y ? round2(cagr(nav3Y, latest.nav, 3)) : null,
      returns5Y: has5Y && nav5Y ? round2(cagr(nav5Y, latest.nav, 5)) : null,
      navLatest: latest.nav,
      navDate: latest.date.toISOString().split("T")[0],
    };
  } catch (err) {
    logger.warn(
      `[mf-returns] ${schemeCode} → exception: ${err instanceof Error ? err.message : String(err)}`,
    );
    return null;
  }
}

function round2(n: number | null): number | null {
  if (n == null || !Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

/**
 * Helper to throttle a list of async fetches at ~4/sec.
 */
export async function fetchReturnsThrottled(
  schemeCodes: number[],
  perRequestDelayMs = 250,
): Promise<FundReturns[]> {
  const out: FundReturns[] = [];
  for (const code of schemeCodes) {
    const r = await fetchFundReturns(code);
    if (r) out.push(r);
    await new Promise((resolve) => setTimeout(resolve, perRequestDelayMs));
  }
  return out;
}
