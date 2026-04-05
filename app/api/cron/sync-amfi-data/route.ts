/**
 * Cron Job: Sync AMFI Mutual Fund Data
 *
 * Fetches the full AMFI NAV text file (~50K schemes) and batch-upserts into
 * the `mutual_funds` table.
 *
 * Vercel Cron schedule: daily at 02:30 UTC (08:00 IST) — see vercel.json
 *
 * Manual trigger:
 *   curl https://investingpro.in/api/cron/sync-amfi-data
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://investingpro.in/api/cron/sync-amfi-data
 *
 * Source: https://portal.amfiindia.com/spages/NAVAll.txt (free, no API key)
 */

import { NextRequest, NextResponse } from "next/server";
import { syncAMFIDataToDatabase } from "@/lib/data-sources/amfi-api";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// AMFI file is large (~10 MB), give it time
export const maxDuration = 120; // seconds

/**
 * GET /api/cron/sync-amfi-data
 * Syncs AMFI mutual fund data to database
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (if set)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      logger.warn("Unauthorized AMFI sync attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.info("Starting AMFI data sync...");

    const result = await syncAMFIDataToDatabase();

    if (result.errors === 0 || result.synced > 0) {
      logger.info("AMFI data sync completed", result);
      return NextResponse.json({
        success: true,
        message: "AMFI data synced",
        synced: result.synced,
        errors: result.errors,
        total: result.total,
        timestamp: new Date().toISOString(),
      });
    } else {
      logger.error("AMFI sync failed completely");
      return NextResponse.json(
        { error: "AMFI sync failed", ...result },
        { status: 500 },
      );
    }
  } catch (error) {
    logger.error("Error syncing AMFI data", error as Error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
