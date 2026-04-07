/**
 * Content Scout Agent Cron
 *
 * SENSE phase — discovers trending topics from free sources.
 * Schedule: 2:00 AM IST daily
 */

import { NextRequest, NextResponse } from "next/server";
import { ContentScoutAgent } from "@/lib/agents/swarm/content-scout-agent";
import { logger } from "@/lib/logger";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    logger.warn("[CRON] Unauthorized content-scout attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const agent = new ContentScoutAgent();
    const result = await agent.runWithHeartbeat();

    return NextResponse.json({
      success: result.success,
      agent: "ContentScoutAgent",
      timestamp: new Date().toISOString(),
      data: result.data,
      executionTime: result.executionTime,
    });
  } catch (error) {
    logger.error("[CRON] ContentScoutAgent error:", error);
    return NextResponse.json(
      { error: "Content scout failed" },
      { status: 500 },
    );
  }
}
