/**
 * scripts/backfill-mf-returns.ts
 *
 * One-shot CLI: backfill 1Y/3Y/5Y returns for ALL mutual_funds rows
 * lacking returns_3y, by fetching MFAPI.in historical NAV.
 *
 * Run:
 *   npx tsx scripts/backfill-mf-returns.ts
 *
 * Why this exists alongside the daily cron:
 *   - Cron processes 50/day; covering 514 funds takes ~10 days
 *   - This script processes ALL in one go (~2 min @ 4 req/sec)
 *   - Use this once for the initial fill, then cron keeps the table fresh
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { fetchReturnsThrottled } from "../lib/data-sources/mf-returns-fetcher";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

async function main() {
  console.log("[backfill-mf-returns] Starting full backfill...");

  const { data: funds, error } = await supabase
    .from("mutual_funds")
    .select("scheme_code, name")
    .or("returns_3y.is.null,returns_3y.eq.0")
    .not("scheme_code", "is", null);

  if (error) throw error;
  if (!funds || funds.length === 0) {
    console.log("All funds already have returns_3y data — nothing to do.");
    return;
  }

  const codes = funds
    .map((f: { scheme_code: number | null }) => f.scheme_code)
    .filter((c): c is number => typeof c === "number");

  console.log(`[backfill-mf-returns] processing ${codes.length} funds...`);

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

    let newRating: number | null = null;
    if (r.returns3Y != null && r.returns3Y > 0) {
      newRating = clamp(3.5 + clamp((r.returns3Y - 8) / 12, 0, 1.5), 3.0, 5.0);
    } else if (r.returns1Y != null && r.returns1Y > 0) {
      newRating = clamp(3.0 + clamp((r.returns1Y - 8) / 14, 0, 1.5), 3.0, 4.5);
    }
    if (newRating != null) {
      updatePayload.rating = Math.round(newRating * 10) / 10;
      rated++;
    }

    const { error: updErr } = await supabase
      .from("mutual_funds")
      .update(updatePayload)
      .eq("scheme_code", r.schemeCode);

    if (!updErr) updated++;
  }

  console.log(
    `[backfill-mf-returns] done — fetched ${results.length}/${codes.length}, updated ${updated}, newly rated ${rated}`,
  );
}

main().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
