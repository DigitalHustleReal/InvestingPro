/**
 * Distribution Agent Cron
 *
 * OPTIMIZE phase — distributes published articles to all channels.
 * Schedule: 10:30 AM + 4:30 PM + 8:30 PM IST daily
 */

import { NextRequest, NextResponse } from "next/server";
import { DistributionAgent } from "@/lib/agents/swarm/distribution-agent";
import { logger } from "@/lib/logger";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    logger.warn("[CRON] Unauthorized distribution attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const agent = new DistributionAgent();
    const result = await agent.runWithHeartbeat();

    return NextResponse.json({
      success: result.success,
      agent: "DistributionAgent",
      timestamp: new Date().toISOString(),
      data: result.data,
      executionTime: result.executionTime,
    });
  } catch (error) {
    logger.error("[CRON] DistributionAgent error:", error);
    return NextResponse.json({ error: "Distribution failed" }, { status: 500 });
  }
}
