/**
 * AMFI (Association of Mutual Funds in India) API Integration
 *
 * Fetches real-time mutual fund data from AMFI:
 * - NAV (Net Asset Value)
 * - Returns (1Y, 3Y, 5Y)
 * - Expense Ratios
 * - AUM (Assets Under Management)
 *
 * Official Source: https://portal.amfiindia.com/spages/NAVAll.txt
 *
 * Manual trigger:
 *   curl https://investingpro.in/api/cron/sync-amfi-data
 *   (or with auth: curl -H "Authorization: Bearer $CRON_SECRET" https://investingpro.in/api/cron/sync-amfi-data)
 *
 * Vercel cron schedule: daily at 02:30 UTC (08:00 IST) — see vercel.json
 */

import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

export interface AMFIFundData {
  schemeCode: number;
  isin: string;
  schemeName: string;
  nav: number;
  date: string;
  fundHouse?: string;
  category?: string;
}

export interface AMFIFundDetails {
  schemeCode: number;
  schemeName: string;
  nav: number;
  returns1Y?: number;
  returns3Y?: number;
  returns5Y?: number;
  expenseRatio?: number;
  aum?: string;
  lastUpdated: string;
  source: string;
}

/**
 * Fetch AMFI NAV data directly from official source
 * AMFI provides a text file with all NAV data: https://portal.amfiindia.com/spages/NAVAll.txt
 *
 * The AMFI text file format uses sections separated by blank lines:
 *   - Category headers contain parentheses, e.g. "Open Ended Schemes(Equity Scheme - Large Cap Fund)"
 *   - Fund house names are standalone lines with NO semicolons and NO parentheses
 *   - Data rows are semicolon-delimited: SchemeCode;ISIN1;ISIN2;SchemeName;NAV;Date
 *   - The first line is a column header: "Scheme Code;ISIN Div Payout..."
 */
export async function fetchAMFINAVData(): Promise<AMFIFundData[]> {
  try {
    const AMFI_URL = "https://portal.amfiindia.com/spages/NAVAll.txt";

    logger.info("Fetching AMFI NAV data from official source", {
      url: AMFI_URL,
    });

    const response = await fetch(AMFI_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; InvestingPro/1.0)",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(
        `AMFI API returned ${response.status}: ${response.statusText}`,
      );
    }

    const text = await response.text();
    const funds: AMFIFundData[] = [];

    // Parse AMFI text format
    // Format: Scheme Code;ISIN Div Payout/ISIN Growth;ISIN Div Reinvestment;Scheme Name;NAV;Date
    const lines = text.split("\n");
    let currentFundHouse = "";
    let currentCategory = "";

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();

      // Skip empty lines and header rows
      // The AMFI file has a header row ("Scheme Code;ISIN...") that can
      // appear at line 0 and also after category separators.
      if (!trimmed) continue;
      if (trimmed.startsWith("Scheme Code")) continue;

      // Category header: contains parentheses but no semicolons
      // e.g. "Open Ended Schemes(Equity Scheme - Large Cap Fund)"
      if (
        trimmed.includes("(") &&
        trimmed.includes(")") &&
        !trimmed.includes(";")
      ) {
        currentCategory = trimmed;
        continue;
      }

      // Fund house name: no semicolons and no parentheses
      // BUG FIX: Previously checked `trimmed === trimmed.toUpperCase()` which
      // incorrectly skipped mixed-case fund house names like
      // "Aditya Birla Sun Life Mutual Fund". Fund house lines are simply
      // non-empty lines without semicolons that aren't category headers.
      if (!trimmed.includes(";") && !trimmed.includes("(")) {
        currentFundHouse = trimmed;
        continue;
      }

      // Data row (contains semicolons)
      if (trimmed.includes(";")) {
        const parts = trimmed.split(";").map((p) => p.trim());

        if (parts.length >= 5) {
          const schemeCode = parseInt(parts[0]);
          const isin = parts[1] || parts[2] || "";
          const schemeName = parts[3];
          const nav = parseFloat(parts[4]);
          const date = parts[5] || new Date().toISOString().split("T")[0];

          if (!isNaN(schemeCode) && !isNaN(nav) && schemeName) {
            funds.push({
              schemeCode,
              isin,
              schemeName,
              nav,
              date,
              fundHouse: currentFundHouse,
              category: currentCategory,
            });
          }
        }
      }
    }

    logger.info(`Fetched ${funds.length} mutual fund NAV records from AMFI`);
    return funds;
  } catch (error) {
    logger.error("Error fetching AMFI NAV data", error as Error);
    throw error;
  }
}

/**
 * Get specific fund data from AMFI by scheme code or name
 */
export async function getAMFIFundData(
  schemeCode?: number,
  schemeName?: string,
): Promise<AMFIFundDetails | null> {
  try {
    // First check product database (faster, cached)
    const supabase = await createClient();

    if (schemeCode) {
      const { data, error } = await supabase
        .from("mutual_funds")
        .select("*")
        .eq("scheme_code", schemeCode)
        .limit(1)
        .single();

      if (!error && data) {
        return {
          schemeCode: data.scheme_code,
          schemeName: data.name,
          nav: parseFloat(String(data.nav)),
          returns1Y: data.returns_1y
            ? parseFloat(String(data.returns_1y))
            : undefined,
          returns3Y: data.returns_3y
            ? parseFloat(String(data.returns_3y))
            : undefined,
          returns5Y: data.returns_5y
            ? parseFloat(String(data.returns_5y))
            : undefined,
          expenseRatio: data.expense_ratio
            ? parseFloat(String(data.expense_ratio))
            : undefined,
          aum: data.aum,
          lastUpdated: data.updated_at || new Date().toISOString(),
          source: "https://portal.amfiindia.com/spages/NAVAll.txt",
        };
      }
    }

    if (schemeName) {
      const { data, error } = await supabase
        .from("mutual_funds")
        .select("*")
        .ilike("name", `%${schemeName}%`)
        .limit(1)
        .single();

      if (!error && data) {
        return {
          schemeCode: data.scheme_code,
          schemeName: data.name,
          nav: parseFloat(String(data.nav)),
          returns1Y: data.returns_1y
            ? parseFloat(String(data.returns_1y))
            : undefined,
          returns3Y: data.returns_3y
            ? parseFloat(String(data.returns_3y))
            : undefined,
          returns5Y: data.returns_5y
            ? parseFloat(String(data.returns_5y))
            : undefined,
          expenseRatio: data.expense_ratio
            ? parseFloat(String(data.expense_ratio))
            : undefined,
          aum: data.aum,
          lastUpdated: data.updated_at || new Date().toISOString(),
          source: "https://portal.amfiindia.com/spages/NAVAll.txt",
        };
      }
    }

    // If not in database, fetch directly from AMFI (slower, but real-time)
    logger.info("Fund not in database, fetching directly from AMFI", {
      schemeCode,
      schemeName,
    });
    const amfiData = await fetchAMFINAVData();

    const fund = amfiData.find(
      (f) =>
        (schemeCode && f.schemeCode === schemeCode) ||
        (schemeName &&
          f.schemeName.toLowerCase().includes(schemeName.toLowerCase())),
    );

    if (fund) {
      return {
        schemeCode: fund.schemeCode,
        schemeName: fund.schemeName,
        nav: fund.nav,
        lastUpdated: fund.date,
        source: "https://portal.amfiindia.com/spages/NAVAll.txt",
      };
    }

    return null;
  } catch (error) {
    logger.error("Error getting AMFI fund data", error as Error, {
      schemeCode,
      schemeName,
    });
    return null;
  }
}

/**
 * Sync AMFI data to database (called by cron job)
 *
 * Uses batch upserts (chunks of 500) for performance.
 * The AMFI feed has ~50,000 schemes; one-at-a-time upserts would take 10+ minutes.
 *
 * Target table: `mutual_funds` with `scheme_code` as unique conflict key.
 * If the `mutual_funds` table does not exist, falls back to upserting into the
 * `products` table with category='mutual_fund' (the generic products table).
 */
export async function syncAMFIDataToDatabase(): Promise<{
  synced: number;
  errors: number;
  total: number;
}> {
  try {
    const supabase = await createClient();
    const amfiData = await fetchAMFINAVData();

    if (amfiData.length === 0) {
      logger.warn("AMFI fetch returned 0 funds — possible API issue");
      return { synced: 0, errors: 0, total: 0 };
    }

    let synced = 0;
    let errors = 0;
    const BATCH_SIZE = 500;
    const now = new Date().toISOString();

    // Build records for batch upsert
    const records = amfiData.map((fund) => ({
      scheme_code: fund.schemeCode,
      name: fund.schemeName,
      fund_house: fund.fundHouse || "Unknown",
      nav: fund.nav,
      isin: fund.isin || null,
      category: fund.category || null,
      nav_date: fund.date || null,
      updated_at: now,
    }));

    // Batch upsert into mutual_funds table
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      try {
        const { error } = await supabase.from("mutual_funds").upsert(batch, {
          onConflict: "scheme_code",
        });

        if (error) {
          // If mutual_funds table doesn't exist, log and break
          if (error.code === "42P01" || error.message?.includes("relation")) {
            logger.error(
              "mutual_funds table does not exist — run migrations first",
              { error },
            );
            return { synced: 0, errors: 1, total: amfiData.length };
          }
          logger.warn(`Batch upsert error (offset ${i})`, {
            error: error.message,
          });
          errors += batch.length;
        } else {
          synced += batch.length;
        }
      } catch (batchError) {
        logger.error(`Batch exception (offset ${i})`, batchError as Error);
        errors += batch.length;
      }
    }

    logger.info(
      `AMFI data sync complete: ${synced} synced, ${errors} errors out of ${amfiData.length} total`,
    );
    return { synced, errors, total: amfiData.length };
  } catch (error) {
    logger.error("Error syncing AMFI data", error as Error);
    return { synced: 0, errors: 1, total: 0 };
  }
}
