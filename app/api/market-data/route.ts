/**
 * API Route: /api/market-data
 *
 * Returns current market ticker data (Sensex, Nifty 50, Gold).
 * Used by the MarketTicker component for client-side polling.
 *
 * Cache: 5 minutes (during market hours)
 */

import { NextResponse } from "next/server";
import { fetchMarketTickerData } from "@/lib/data-sources/market-data";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await fetchMarketTickerData();

    return NextResponse.json(
      { data, timestamp: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    logger.error("Error fetching market data", error as Error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 },
    );
  }
}
