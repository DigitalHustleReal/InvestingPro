/**
 * Content Assignments Stats API
 *
 * Returns QA dashboard statistics
 */

import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

export async function GET() {
  try {
    const { user, supabase, error: adminAuthError } = await requireAdminApi();
    if (adminAuthError) return adminAuthError;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get pending count
    const { count: pending } = await supabase
      .from("content_assignments")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_review");

    // Get in_review count
    const { count: in_review } = await supabase
      .from("content_assignments")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_review");

    // Get approved today
    const { count: approved_today } = await supabase
      .from("content_assignments")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")
      .gte("updated_at", today.toISOString());

    // Get rejected today
    const { count: rejected_today } = await supabase
      .from("content_assignments")
      .select("*", { count: "exact", head: true })
      .eq("status", "rejected")
      .gte("updated_at", today.toISOString());

    return NextResponse.json({
      pending: pending || 0,
      in_review: in_review || 0,
      approved_today: approved_today || 0,
      rejected_today: rejected_today || 0,
      avg_review_time: "2.5 hrs", // TODO: Calculate from actual data
    });
  } catch (error) {
    logger.error("[API] Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
