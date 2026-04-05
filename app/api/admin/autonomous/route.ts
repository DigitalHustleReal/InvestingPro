/**
 * API Route: Start/Stop Autonomous Systems
 *
 * Purpose: Admin endpoint to control autonomous orchestrators
 */

import { NextRequest, NextResponse } from "next/server";
import { contentOrchestrator } from "@/lib/intelligence/orchestrators/content-orchestrator";
import { dataOrchestrator } from "@/lib/intelligence/orchestrators/data-sync-orchestrator";
import { eventBus } from "@/lib/infrastructure/event-bus/event-bus";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    const { action, system } = await request.json();

    if (action === "start") {
      if (system === "content" || system === "all") {
        await contentOrchestrator.start();
      }
      if (system === "data" || system === "all") {
        await dataOrchestrator.start();
      }

      return NextResponse.json({
        success: true,
        message: `Started ${system} orchestrator(s)`,
      });
    }

    if (action === "stop") {
      if (system === "content" || system === "all") {
        contentOrchestrator.stop();
      }
      if (system === "data" || system === "all") {
        dataOrchestrator.stop();
      }

      return NextResponse.json({
        success: true,
        message: `Stopped ${system} orchestrator(s)`,
      });
    }

    if (action === "status") {
      const recentEvents = eventBus.getRecentEvents(50);

      return NextResponse.json({
        success: true,
        recentEvents,
        stats: {
          totalEvents: recentEvents.length,
          eventTypes: [...new Set(recentEvents.map((e) => e.event))],
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action",
      },
      { status: 400 },
    );
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

export async function GET() {
  const { error: authError } = await requireAdminApi();
  if (authError) return authError;

  const recentEvents = eventBus.getRecentEvents(100);

  return NextResponse.json({
    success: true,
    recentEvents,
    stats: {
      totalEvents: recentEvents.length,
      eventTypes: [...new Set(recentEvents.map((e) => e.event))],
      lastEvent: recentEvents[recentEvents.length - 1],
    },
  });
}
