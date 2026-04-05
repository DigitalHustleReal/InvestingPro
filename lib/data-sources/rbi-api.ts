/**
 * RBI (Reserve Bank of India) API Integration
 *
 * Fetches real-time policy rates from RBI:
 * - Repo Rate
 * - Reverse Repo Rate
 * - Bank Rate
 * - Base Rate
 * - Policy Rates
 *
 * Sources:
 * - RBI Press Releases: https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx
 * - RBI Master Directions: https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx
 */

import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/client";

export interface RBIPolicyRates {
  repoRate: number; // Policy repo rate
  reverseRepoRate: number; // Reverse repo rate
  bankRate: number; // Bank rate
  baseRate: number; // Base rate (calculated: repo + 1.5%)
  mclr: number; // Marginal Cost of Funds Based Lending Rate
  lastUpdated: string; // ISO date string
  source: string; // Source URL
}

/**
 * Fetch RBI policy rates from database (cached)
 * Rates are updated daily via cron job
 */
export async function getRBIPolicyRates(): Promise<RBIPolicyRates | null> {
  try {
    const supabase = await createClient();

    // Check if we have cached RBI rates
    const { data, error } = await supabase
      .from("rbi_policy_rates")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      logger.warn("RBI policy rates not found in database, using defaults", {
        error,
      });
      return getDefaultRBIRates();
    }

    return {
      repoRate: parseFloat(String(data.repo_rate)),
      reverseRepoRate: parseFloat(String(data.reverse_repo_rate)),
      bankRate: parseFloat(String(data.bank_rate)),
      baseRate: parseFloat(String(data.base_rate)),
      mclr: parseFloat(String(data.mclr || data.base_rate)),
      lastUpdated: data.updated_at || new Date().toISOString(),
      source: data.source_url || "https://www.rbi.org.in/",
    };
  } catch (error) {
    logger.error("Error fetching RBI policy rates", error as Error);
    return getDefaultRBIRates();
  }
}

/**
 * Fetch RBI policy rates from the RBI website
 *
 * Strategy: Fetch the RBI "Current Rates" page which lists key policy rates
 * in a structured HTML table. Parse the known fields.
 *
 * Fallback chain:
 *   1. RBI Current Rates page (HTML parse)
 *   2. RBI DBIE API endpoint
 *   3. Return null (caller uses defaults)
 */
export async function scrapeRBIRates(): Promise<RBIPolicyRates | null> {
  try {
    logger.info("Fetching RBI policy rates...");

    // Attempt 1: RBI "Key Policy Rates" page
    // This page has a simple HTML table with repo rate, SDF, MSF, bank rate
    const rbiUrl = "https://www.rbi.org.in/Scripts/BS_NSDPDisplay.aspx?param=4";
    const res = await fetch(rbiUrl, {
      headers: {
        "User-Agent": "InvestingPro-DataBot/1.0 (+https://investingpro.in/bot)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      logger.warn(`RBI page returned ${res.status}`);
      return await fetchRBIRatesFromDBIE();
    }

    const html = await res.text();
    const rates = parseRBIRatesFromHTML(html);

    if (rates) {
      logger.info("Successfully parsed RBI rates from website", { rates });
      return rates;
    }

    // Attempt 2: DBIE fallback
    logger.warn("Could not parse RBI HTML, trying DBIE...");
    return await fetchRBIRatesFromDBIE();
  } catch (error) {
    logger.error("Error fetching RBI rates", error as Error);
    // Try DBIE as final fallback
    try {
      return await fetchRBIRatesFromDBIE();
    } catch {
      return null;
    }
  }
}

/**
 * Parse RBI rates from the HTML response
 * Looks for known patterns: "Repo Rate", "Bank Rate", etc.
 */
function parseRBIRatesFromHTML(html: string): RBIPolicyRates | null {
  try {
    // RBI pages contain rate values in table cells or spans near known labels
    // Pattern: label text followed by a percentage value like "6.50" or "6.50%"
    const ratePatterns: Record<string, RegExp[]> = {
      repo: [
        /Policy\s*Repo\s*Rate[^0-9]*?(\d+\.\d+)\s*%?/i,
        /Repo\s*Rate[^0-9]*?(\d+\.\d+)\s*%?/i,
      ],
      reverseRepo: [
        /Reverse\s*Repo\s*Rate[^0-9]*?(\d+\.\d+)\s*%?/i,
        /Standing\s*Deposit\s*Facility[^0-9]*?(\d+\.\d+)\s*%?/i, // SDF replaced reverse repo
      ],
      bankRate: [
        /Bank\s*Rate[^0-9]*?(\d+\.\d+)\s*%?/i,
        /MSF\s*Rate[^0-9]*?(\d+\.\d+)\s*%?/i, // MSF = Bank Rate
        /Marginal\s*Standing\s*Facility[^0-9]*?(\d+\.\d+)\s*%?/i,
      ],
    };

    const extractRate = (patterns: RegExp[]): number | null => {
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          const val = parseFloat(match[1]);
          if (val > 0 && val < 20) return val; // Sanity check
        }
      }
      return null;
    };

    const repoRate = extractRate(ratePatterns.repo);
    if (!repoRate) {
      logger.warn("Could not extract repo rate from RBI HTML");
      return null;
    }

    // Reverse repo / SDF is typically repo - 0.25
    const reverseRepoRate =
      extractRate(ratePatterns.reverseRepo) ?? repoRate - 0.25;
    // Bank rate / MSF is typically repo + 0.25
    const bankRate = extractRate(ratePatterns.bankRate) ?? repoRate + 0.25;

    return {
      repoRate,
      reverseRepoRate,
      bankRate,
      baseRate: repoRate + 1.5,
      mclr: repoRate + 1.5,
      lastUpdated: new Date().toISOString(),
      source: "https://www.rbi.org.in/Scripts/BS_NSDPDisplay.aspx?param=4",
    };
  } catch (error) {
    logger.error("Error parsing RBI HTML", error as Error);
    return null;
  }
}

/**
 * Fetch rates from RBI DBIE (Database on Indian Economy)
 * Secondary source for policy rates
 */
async function fetchRBIRatesFromDBIE(): Promise<RBIPolicyRates | null> {
  try {
    const dbieUrl =
      "https://dbie.rbi.org.in/DBIE/dbie.rbi?site=publicationsView&selectedSeriesId=ST_KEY";
    const res = await fetch(dbieUrl, {
      headers: {
        "User-Agent": "InvestingPro-DataBot/1.0 (+https://investingpro.in/bot)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      logger.warn(`DBIE returned ${res.status}`);
      return null;
    }

    const html = await res.text();
    // DBIE returns HTML with rate tables — use same extraction logic
    return parseRBIRatesFromHTML(html);
  } catch (error) {
    logger.error("DBIE fetch failed", error as Error);
    return null;
  }
}

/**
 * Get default RBI rates (fallback)
 * These are approximate rates - should be updated via cron job
 */
export function getDefaultRBIRates(): RBIPolicyRates {
  // Default rates (as of April 2026 — updated via cron job)
  const defaultRepoRate = 6.25;

  return {
    repoRate: defaultRepoRate,
    reverseRepoRate: defaultRepoRate - 0.25, // Typically 0.25% below repo
    bankRate: defaultRepoRate + 0.25, // Typically 0.25% above repo
    baseRate: defaultRepoRate + 1.5, // Typically repo + 1.5%
    mclr: defaultRepoRate + 1.5, // MCLR typically close to base rate
    lastUpdated: new Date().toISOString(),
    source: "https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx",
  };
}

/**
 * Calculate expected interest rate ranges based on RBI policy rates
 */
export function calculateExpectedInterestRanges(rates: RBIPolicyRates): {
  creditCard: { min: number; max: number };
  personalLoan: { min: number; max: number };
  homeLoan: { min: number; max: number };
  savings: { min: number; max: number };
  fd: { min: number; max: number };
} {
  // Credit card rates: Base rate + 10-20% = typically 18-28%
  const creditCardMin = rates.baseRate + 10;
  const creditCardMax = rates.baseRate + 25;

  // Personal loan rates: Base rate + 2-6% = typically 10-13%
  const personalLoanMin = rates.baseRate + 2;
  const personalLoanMax = rates.baseRate + 6;

  // Home loan rates: Base rate + 1-3% = typically 9-11%
  const homeLoanMin = rates.baseRate + 1;
  const homeLoanMax = rates.baseRate + 3;

  // Savings account rates: 2.5-4% (not directly tied to repo, but influenced)
  const savingsMin = 2.5;
  const savingsMax = 4.5;

  // Fixed deposit rates: Base rate + 0.5-2% = typically 7-9%
  const fdMin = rates.baseRate + 0.5;
  const fdMax = rates.baseRate + 2;

  return {
    creditCard: { min: creditCardMin, max: creditCardMax },
    personalLoan: { min: personalLoanMin, max: personalLoanMax },
    homeLoan: { min: homeLoanMin, max: homeLoanMax },
    savings: { min: savingsMin, max: savingsMax },
    fd: { min: fdMin, max: fdMax },
  };
}

/**
 * Update RBI rates in database (called by cron job)
 */
export async function updateRBIRates(rates: RBIPolicyRates): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("rbi_policy_rates").upsert(
      {
        repo_rate: rates.repoRate,
        reverse_repo_rate: rates.reverseRepoRate,
        bank_rate: rates.bankRate,
        base_rate: rates.baseRate,
        mclr: rates.mclr,
        source_url: rates.source,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id", // Assuming there's a single row with id=1
      },
    );

    if (error) {
      logger.error("Error updating RBI rates in database", error);
      return false;
    }

    logger.info("RBI policy rates updated successfully", { rates });
    return true;
  } catch (error) {
    logger.error("Error updating RBI rates", error as Error);
    return false;
  }
}
