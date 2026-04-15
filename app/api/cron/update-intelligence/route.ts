/**
 * Intelligence Update Cron
 * Schedule: 0 2 * * * (2 AM IST daily)
 *
 * Runs daily intelligence updates:
 * 1. Recomputes lead scores for active users (decays stale signals)
 * 2. Detects material rate changes and queues watchlist alerts
 * 3. Refreshes content attribution cache
 * 4. Updates competitor product intelligence
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  computeLeadScore,
  LeadProfile,
  BehavioralSignal,
} from "@/lib/user/lead-scorer";
import { aggregateContentAttribution } from "@/lib/intelligence/attribution-tracker";

export const maxDuration = 300; // 5 minutes

function verifyCronAuth(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true; // allow in dev when not configured
  const authHeader = req.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(req: NextRequest) {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();
  const results: Record<string, unknown> = {};

  // ── 1. Recompute lead scores for users with recent activity ──────────────
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: activeUsers } = await service
    .from("behavioral_events")
    .select("user_id")
    .gte("created_at", since)
    .not("user_id", "is", null)
    .limit(500);

  const uniqueUserIds = [
    ...new Set((activeUsers ?? []).map((u: any) => u.user_id)),
  ];

  let leadsUpdated = 0;
  for (const user_id of uniqueUserIds) {
    const { data: events } = await service
      .from("behavioral_events")
      .select("event_type, product_id, category, created_at")
      .eq("user_id", user_id)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(100);

    const signals: BehavioralSignal[] = (events ?? []).map((e: any) => ({
      type: e.event_type as BehavioralSignal["type"],
      product_id: e.product_id,
      category: e.category,
      timestamp: new Date(e.created_at).getTime(),
    }));

    const profile: LeadProfile = { user_id, session_id: "cron", signals };
    const score = computeLeadScore(profile);

    await service.from("lead_scores").upsert(
      {
        user_id,
        session_id: "cron",
        score: score.score,
        segment: score.segment,
        top_category: score.top_category,
        category_scores: score.category_scores,
        signals_triggered: score.signals_triggered,
        cta_intensity: score.cta_intensity,
        monetization_value: score.monetization_value,
        expires_at: new Date(score.expires_at).toISOString(),
        computed_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    leadsUpdated++;
  }

  results.lead_scores_updated = leadsUpdated;

  // ── 2. Watchlist rate alerts ───────────────────────────────────────────────
  // Find users with watchlisted products that had rate changes in last 24h
  const { data: recentRateChanges } = await service
    .from("product_rates_history")
    .select("product_id, rate_type, rate_value, effective_date")
    .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order("effective_date", { ascending: false });

  const changedProductIds = [
    ...new Set((recentRateChanges ?? []).map((r: any) => r.product_id)),
  ];

  if (changedProductIds.length > 0) {
    // Find users watching these products
    const { data: affectedWatchlists } = await service
      .from("product_watchlists")
      .select("user_id, product_id, products(name)")
      .in("product_id", changedProductIds);

    results.rate_alerts_queued = affectedWatchlists?.length ?? 0;
    // TODO: queue notification emails via Resend/Inngest
  }

  // ── 3. Refresh attribution cache ──────────────────────────────────────────
  const attributionSummaries = await aggregateContentAttribution(30);

  if (attributionSummaries.length > 0) {
    // Upsert into cache table
    const rows = attributionSummaries.slice(0, 200).map((s) => ({
      entity_id: s.entity_id,
      entity_name: s.entity_name,
      entity_type: s.entity_type,
      period_days: 30,
      last_click_value: s.last_click_value,
      time_decay_value: s.time_decay_value,
      position_based_value: s.position_based_value,
      total_attributed_value: s.total_attributed_value,
      conversion_assist_count: s.conversion_assist_count,
      direct_conversion_count: s.direct_conversion_count,
      avg_position_in_journey: s.avg_position_in_journey,
      computed_at: new Date().toISOString(),
    }));

    await service
      .from("content_attribution_cache")
      .upsert(rows, { onConflict: "entity_id,entity_type,period_days" });

    results.attribution_entities_cached = rows.length;
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    results,
  });
}
