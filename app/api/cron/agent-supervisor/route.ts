/**
 * Swarm Supervisor Cron — meta-agent that monitors all other agents.
 * Schedule: Every 6 hours (0:00, 6:00, 12:00, 18:00 IST)
 */
import { NextRequest, NextResponse } from "next/server";
import { SupervisorAgent } from "@/lib/agents/swarm/supervisor-agent";
import { logger } from "@/lib/logger";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const agent = new SupervisorAgent();
    const result = await agent.runWithHeartbeat();
    return NextResponse.json({
      success: result.success,
      agent: "SupervisorAgent",
      timestamp: new Date().toISOString(),
      data: result.data,
      executionTime: result.executionTime,
    });
  } catch (error) {
    logger.error("[CRON] SupervisorAgent error:", error);
    return NextResponse.json(
      { error: "Supervisor agent failed" },
      { status: 500 },
    );
  }
}
