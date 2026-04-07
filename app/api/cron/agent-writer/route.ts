/**
 * Writer Agent Cron
 *
 * CREATE phase — generates full articles from queued topics.
 * Schedule: 6:30 AM + 6:30 PM IST daily
 */

import { NextRequest, NextResponse } from "next/server";
import { WriterAgent } from "@/lib/agents/swarm/writer-agent";
import { logger } from "@/lib/logger";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    logger.warn("[CRON] Unauthorized writer attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const agent = new WriterAgent();
    const result = await agent.runWithHeartbeat();

    return NextResponse.json({
      success: result.success,
      agent: "WriterAgent",
      timestamp: new Date().toISOString(),
      data: result.data,
      executionTime: result.executionTime,
    });
  } catch (error) {
    logger.error("[CRON] WriterAgent error:", error);
    return NextResponse.json({ error: "Writer failed" }, { status: 500 });
  }
}
