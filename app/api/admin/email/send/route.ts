/**
 * Send Email/Newsletter API
 * POST /api/admin/email/send
 * Uses Resend to send emails to subscribers
 */

import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { sendEmail } from "@/lib/email/resend-service";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
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

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Resend not configured. Add RESEND_API_KEY to environment variables.",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { subject, content, audience } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { error: "Subject and content are required." },
        { status: 400 },
      );
    }

    // Get recipients based on audience
    const supabase = await createClient();
    let recipients: string[] = [];

    try {
      let query = supabase
        .from("newsletter_subscribers")
        .select("email")
        .eq("status", "active");

      // If audience is a specific segment, filter by interest
      if (audience && audience !== "all") {
        query = query.contains("interests", [audience]);
      }

      const { data, error } = await query;

      if (error) {
        logger.error("Error fetching subscribers:", error);
        return NextResponse.json(
          {
            error:
              "Failed to fetch subscribers. Check if the newsletter_subscribers table exists.",
          },
          { status: 500 },
        );
      }

      recipients = (data || [])
        .map((s: { email: string }) => s.email)
        .filter(Boolean);
    } catch {
      return NextResponse.json(
        {
          error:
            "Failed to fetch subscribers. The newsletter_subscribers table may not exist.",
        },
        { status: 500 },
      );
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No subscribers found for the selected audience." },
        { status: 400 },
      );
    }

    // Build HTML email body
    const htmlContent = `
            <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <div style="border-bottom: 2px solid #166534; padding-bottom: 16px; margin-bottom: 24px;">
                    <h1 style="color: #166534; margin: 0; font-size: 24px;">${subject}</h1>
                </div>
                <div style="color: #333; line-height: 1.6; white-space: pre-wrap;">${content}</div>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0 16px;" />
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    You received this because you subscribed to InvestingPro.in newsletters.
                </p>
            </div>
        `;

    // Send in batches of 50 (Resend supports batch sending via BCC)
    const batchSize = 50;
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      try {
        const result = await sendEmail({
          to: batch,
          subject,
          html: htmlContent,
        });

        if (result.success) {
          sentCount += batch.length;
        } else {
          failedCount += batch.length;
          logger.error("Batch send failed:", result.error);
        }
      } catch (err) {
        failedCount += batch.length;
        logger.error("Batch send exception:", err);
      }
    }

    // Log the campaign in email_sequences if table exists
    try {
      await supabase.from("email_sequences").insert(
        recipients.map((email) => ({
          subscriber_email: email,
          sequence_type: "newsletter",
          subject,
          content,
          status: "sent",
          sent_at: new Date().toISOString(),
        })),
      );
    } catch {
      // Non-critical — log but don't fail
      logger.warn("Could not log email campaign to email_sequences table");
    }

    return NextResponse.json({
      success: true,
      sentCount,
      failedCount,
      totalRecipients: recipients.length,
    });
  } catch (error: any) {
    logger.error("Error sending newsletter:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to send newsletter.",
      },
      { status: 500 },
    );
  }
}
