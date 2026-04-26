/**
 * /api/cron/sync-mf-returns
 *
 * Daily cron that backfills 1Y / 3Y / 5Y returns for mutual_funds rows
 * that don't have them yet, by fetching historical NAV from MFAPI.in
 * and computing CAGR. Each run processes a batch (default 50) so we
 * don't blow the function timeout or hit MFAPI rate limits. Over ~10
 * days it'll fully populate the 514 funds that are currently rating-less.
 *
 * After updating returns, it re-runs the same algorithmic rating
 * formula used in the launch-prep migration so newly-rated funds
 * surface immediately.
 */

import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { fetchReturnsThrottled } from "@/lib/data-sources/mf-returns-fetcher";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

let _supabase: SupabaseClient | null = null;
function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!_supabase) _supabase = createClient(url, key);
  return _supabase;
}

const BATCH_SIZE = 50; // Funds processed per run

export async function GET(request: NextRequest) {
  // Cron secret guard
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({
      skipped: true,
      message: "Skipped — Supabase env vars missing",
    });
  }

  try {
    // Pick funds without returns_3y, prioritising those that also lack 1Y
    const { data: funds, error: pickErr } = await supabase
      .from("mutual_funds")
      .select("scheme_code, name")
      .or("returns_3y.is.null,returns_3y.eq.0")
      .not("scheme_code", "is", null)
      .limit(BATCH_SIZE);

    if (pickErr) throw pickErr;
    if (!funds || funds.length === 0) {
      return NextResponse.json({
        message: "All funds have returns data — nothing to backfill",
        processed: 0,
      });
    }

    const codes = funds
      .map((f: { scheme_code: number | null }) => f.scheme_code)
      .filter((c): c is number => typeof c === "number");

    logger.info(`[sync-mf-returns] backfilling ${codes.length} funds`);

    const results = await fetchReturnsThrottled(codes, 250);

    let updated = 0;
    let rated = 0;

    for (const r of results) {
      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (r.returns1Y != null) updatePayload.returns_1y = r.returns1Y;
      if (r.returns3Y != null) updatePayload.returns_3y = r.returns3Y;
      if (r.returns5Y != null) updatePayload.returns_5y = r.returns5Y;
      if (r.navLatest != null) updatePayload.nav = r.navLatest;

      // Algorithmic rating per /methodology/mutual-funds v1.0
      let newRating: number | null = null;
      if (r.returns3Y != null && r.returns3Y > 0) {
        newRating = clamp(
          3.5 + clamp((r.returns3Y - 8) / 12, 0, 1.5),
          3.0,
          5.0,
        );
      } else if (r.returns1Y != null && r.returns1Y > 0) {
        newRating = clamp(
          3.0 + clamp((r.returns1Y - 8) / 14, 0, 1.5),
          3.0,
          4.5,
        );
      }
      if (newRating != null) {
        updatePayload.rating = Math.round(newRating * 10) / 10;
        rated++;
      }

      const { error: updErr } = await supabase
        .from("mutual_funds")
        .update(updatePayload)
        .eq("scheme_code", r.schemeCode);

      if (updErr) {
        logger.warn(
          `[sync-mf-returns] update failed for ${r.schemeCode}: ${updErr.message}`,
        );
      } else {
        updated++;
      }
    }

    return NextResponse.json({
      processed: codes.length,
      fetched: results.length,
      updated,
      newly_rated: rated,
      remaining_to_backfill: undefined, // surfaced separately
    });
  } catch (error) {
    logger.error("[sync-mf-returns] failed", error as Error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
