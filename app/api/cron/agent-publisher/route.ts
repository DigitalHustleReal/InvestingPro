/**
 * Publisher Agent Cron
 *
 * PUBLISH phase — moves approved articles to published status.
 * Schedule: 10:00 AM + 4:00 PM IST daily
 */

import { NextRequest, NextResponse } from "next/server";
import { PublisherAgent } from "@/lib/agents/swarm/publisher-agent";
import { logger } from "@/lib/logger";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    logger.warn("[CRON] Unauthorized publisher attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const agent = new PublisherAgent();
    const result = await agent.runWithHeartbeat();

    return NextResponse.json({
      success: result.success,
      agent: "PublisherAgent",
      timestamp: new Date().toISOString(),
      data: result.data,
      executionTime: result.executionTime,
    });
  } catch (error) {
    logger.error("[CRON] PublisherAgent error:", error);
    return NextResponse.json({ error: "Publisher failed" }, { status: 500 });
  }
}
