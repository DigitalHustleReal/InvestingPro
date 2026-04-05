/**
 * Admin API: Automation Control Panel
 *
 * Purpose: API endpoints for managing automation settings and approval queue
 */

import { NextRequest, NextResponse } from "next/server";
import { automationController } from "@/lib/intelligence/automation-controller";
import { approvalQueue } from "@/lib/intelligence/approval-queue";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

// GET /api/admin/automation - Get current settings and stats
export async function GET() {
  try {
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    const settings = automationController.getSettings();
    const counters = automationController.getDailyCounters();
    const queueStats = await approvalQueue.getStats();
    const pending = await approvalQueue.getPending();

    return NextResponse.json({
      success: true,
      settings,
      dailyCounters: counters,
      queueStats,
      pendingApprovals: pending,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// POST /api/admin/automation - Update settings
export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    const { action, ...params } = await request.json();

    switch (action) {
      case "update_settings":
        await automationController.updateSettings(params.settings);
        return NextResponse.json({
          success: true,
          message: "Settings updated successfully",
        });

      case "approve":
        await approvalQueue.approve(
          params.requestId,
          params.reviewerId,
          params.notes,
        );
        return NextResponse.json({
          success: true,
          message: "Request approved",
        });

      case "reject":
        await approvalQueue.reject(
          params.requestId,
          params.reviewerId,
          params.notes,
        );
        return NextResponse.json({
          success: true,
          message: "Request rejected",
        });

      case "modify_and_approve":
        await approvalQueue.modifyAndApprove(
          params.requestId,
          params.reviewerId,
          params.modifiedData,
          params.notes,
        );
        return NextResponse.json({
          success: true,
          message: "Request modified and approved",
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action",
          },
          { status: 400 },
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
