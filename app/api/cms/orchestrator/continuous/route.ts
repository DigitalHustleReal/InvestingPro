import { NextRequest, NextResponse } from "next/server";
import {
  cmsOrchestrator,
  OrchestrationContext,
} from "@/lib/agents/orchestrator";
import { logger } from "@/lib/logger";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

/**
 * Continuous Operation API
 *
 * Starts/stops continuous content generation mode
 */

let continuousModeRunning = false;
let continuousModeInterval: NodeJS.Timeout | null = null;

export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    const body = await request.json();
    const action = body.action; // 'start' | 'stop'

    if (action === "start") {
      if (continuousModeRunning) {
        return NextResponse.json({
          success: false,
          error: "Continuous mode already running",
        });
      }

      const context: OrchestrationContext = {
        mode: body.mode || "fully-automated",
        goals: body.goals || {
          volume: 5,
          quality: 80,
          revenue: 0,
          seo: true,
        },
      };

      continuousModeRunning = true;

      // Start continuous mode in background
      cmsOrchestrator.instance
        .startContinuousMode(context)
        .catch((error: any) => {
          logger.error("Continuous mode error", error);
          continuousModeRunning = false;
        });

      return NextResponse.json({
        success: true,
        message: "Continuous mode started",
        running: true,
      });
    } else if (action === "stop") {
      continuousModeRunning = false;

      if (continuousModeInterval) {
        clearInterval(continuousModeInterval);
        continuousModeInterval = null;
      }

      return NextResponse.json({
        success: true,
        message: "Continuous mode stopped",
        running: false,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action",
      },
      { status: 400 },
    );
  } catch (error: any) {
    logger.error("Continuous mode API error", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * Get continuous mode status
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    running: continuousModeRunning,
  });
}
