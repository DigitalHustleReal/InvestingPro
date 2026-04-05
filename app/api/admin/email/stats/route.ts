/**
 * Email Stats API
 * Returns subscriber count and email performance stats
 */

import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Check admin authentication
    try {
      await requireAdmin();
    } catch (authError: any) {
      if (authError.message?.includes("Unauthorized")) {
        return NextResponse.json(
          { error: "Unauthorized", message: "Authentication required" },
          { status: 401 },
        );
      }
      if (authError.message?.includes("Forbidden")) {
        return NextResponse.json(
          { error: "Forbidden", message: "Admin access required" },
          { status: 403 },
        );
      }
      throw authError;
    }

    const supabase = await createClient();

    // Try to get subscriber count from newsletter_subscribers table
    let totalSubscribers = 0;
    try {
      const { count, error } = await supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      if (!error && count !== null) {
        totalSubscribers = count;
      }
    } catch {
      // Table may not exist — fallback to 0
    }

    // Try to get email send stats from email_sequences table
    let emailsSent = 0;
    let emailsOpened = 0;
    let emailsClicked = 0;
    try {
      const { data: emails, error } = await supabase
        .from("email_sequences")
        .select("id, opened_at, clicked_at")
        .eq("status", "sent");

      if (!error && emails) {
        emailsSent = emails.length;
        emailsOpened = emails.filter(
          (e: { opened_at: string | null }) => e.opened_at,
        ).length;
        emailsClicked = emails.filter(
          (e: { clicked_at: string | null }) => e.clicked_at,
        ).length;
      }
    } catch {
      // Table may not exist — fallback to 0
    }

    const openRate = emailsSent > 0 ? (emailsOpened / emailsSent) * 100 : 0;
    const clickRate = emailsSent > 0 ? (emailsClicked / emailsSent) * 100 : 0;

    return NextResponse.json({
      totalSubscribers,
      emailsSent,
      openRate: Math.round(openRate * 10) / 10,
      clickRate: Math.round(clickRate * 10) / 10,
      resendConfigured: !!process.env.RESEND_API_KEY,
    });
  } catch (error: any) {
    logger.error("Error fetching email stats:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch email stats.",
      },
      { status: 500 },
    );
  }
}
