/**
 * Cron Job: Update Gold Prices
 *
 * Fetches daily gold (22K/24K) and silver prices for Indian market.
 * Called by Vercel Cron: /api/cron/update-gold-prices
 *
 * Schedule: Daily at 10:30 AM IST (05:00 UTC) — after markets open
 */

import { NextRequest, NextResponse } from "next/server";
import {
  fetchGoldPrice,
  getDefaultGoldPrice,
  storeGoldPrice,
  calculateDailyChange,
} from "@/lib/data-sources/gold-price";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      logger.warn("Unauthorized gold price update attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.info("Starting gold price update...");

    // Fetch from APIs
    let price = await fetchGoldPrice();

    if (!price) {
      logger.warn("All gold APIs failed, using defaults");
      price = getDefaultGoldPrice();
    }

    // Calculate daily change vs previous stored price
    price = await calculateDailyChange(price);

    // Store in database
    const stored = await storeGoldPrice(price);

    if (stored) {
      logger.info("Gold prices updated successfully", {
        gold_24k: price.gold_24k_per_10g,
        gold_22k: price.gold_22k_per_10g,
        change: price.change_24k,
        source: price.source,
      });

      return NextResponse.json({
        success: true,
        message: "Gold prices updated",
        data: {
          gold_24k_per_10g: price.gold_24k_per_10g,
          gold_22k_per_10g: price.gold_22k_per_10g,
          change_24k: price.change_24k,
          change_percent: price.change_percent,
          source: price.source,
        },
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: "Failed to store gold prices" },
      { status: 500 },
    );
  } catch (error) {
    logger.error("Error updating gold prices", error as Error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
