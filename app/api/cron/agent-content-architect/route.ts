/**
 * Content Architect Agent Cron
 *
 * ANALYZE phase — creates structured article outlines from SERP data.
 * Schedule: 4:00 AM + 4:00 PM IST daily
 */

import { NextRequest, NextResponse } from "next/server";
import { ContentArchitectAgent } from "@/lib/agents/swarm/content-architect-agent";
import { logger } from "@/lib/logger";

export const maxDuration = 180;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    logger.warn("[CRON] Unauthorized content-architect attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const agent = new ContentArchitectAgent();
    const result = await agent.runWithHeartbeat();

    return NextResponse.json({
      success: result.success,
      agent: "ContentArchitectAgent",
      timestamp: new Date().toISOString(),
      data: result.data,
      executionTime: result.executionTime,
    });
  } catch (error) {
    logger.error("[CRON] ContentArchitectAgent error:", error);
    return NextResponse.json(
      { error: "Content architect failed" },
      { status: 500 },
    );
  }
}
