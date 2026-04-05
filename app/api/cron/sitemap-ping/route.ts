/**
 * Sitemap Ping Cron Job
 *
 * Runs daily at 6 AM IST
 * Pings Google and Bing with updated sitemap
 */

import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const SITEMAP_URL = `${process.env.NEXT_PUBLIC_BASE_URL || "https://investingpro.in"}/sitemap.xml`;

export async function GET(request: NextRequest) {
  // Verify cron secret (if set)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    logger.warn("Unauthorized sitemap ping attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, any> = {};

  try {
    // Ping Google
    const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const googleResponse = await fetch(googleUrl);
    results.google = {
      status: googleResponse.status,
      success: googleResponse.ok,
    };
  } catch (error) {
    results.google = { status: "error", error: String(error) };
  }

  try {
    // Ping Bing
    const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const bingResponse = await fetch(bingUrl);
    results.bing = {
      status: bingResponse.status,
      success: bingResponse.ok,
    };
  } catch (error) {
    results.bing = { status: "error", error: String(error) };
  }

  logger.info("[CRON] Sitemap ping results:", results);

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    sitemap: SITEMAP_URL,
    results,
  });
}
