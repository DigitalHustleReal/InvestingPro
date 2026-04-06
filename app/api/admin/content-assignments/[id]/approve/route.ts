/**
 * Approve Content Assignment API
 */

import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user, supabase, error: adminAuthError } = await requireAdminApi();
    if (adminAuthError) return adminAuthError;

    const { id } = await params;

    // Update assignment status
    const { data: assignment, error: assignmentError } = await supabase
      .from("content_assignments")
      .update({
        status: "approved",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("article_id")
      .single();

    if (assignmentError) throw assignmentError;

    // Update article status to ready for publish
    if (assignment?.article_id) {
      await supabase
        .from("articles")
        .update({
          status: "scheduled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", assignment.article_id);
    }

    return NextResponse.json({ success: true, message: "Content approved" });
  } catch (error) {
    logger.error("[API] Approve error:", error);
    return NextResponse.json(
      { error: "Failed to approve content" },
      { status: 500 },
    );
  }
}
