/**
 * Gold Price Data Source
 *
 * Fetches daily gold prices (22K and 24K) for Indian cities.
 *
 * Sources (free, public):
 *   1. GoldAPI.io (free tier: 6 requests/min, no key needed for INR)
 *   2. metals-api.com (free tier, limited)
 *   3. Fallback: curated/manual data with last known rates
 *
 * Stores in `gold_prices` table, consumed by calculators and market ticker.
 */

import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/service";

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface GoldPrice {
  date: string; // ISO date (YYYY-MM-DD)
  gold_24k_per_gram: number; // INR per gram
  gold_22k_per_gram: number; // INR per gram
  gold_24k_per_10g: number; // INR per 10 grams
  gold_22k_per_10g: number; // INR per 10 grams
  silver_per_kg: number; // INR per kg
  change_24k: number; // Daily change in INR
  change_percent: number; // Daily change %
  source: string;
  updated_at: string;
}

export interface CityGoldPrice {
  city: string;
  gold_24k_per_10g: number;
  gold_22k_per_10g: number;
  making_charges_percent: number;
  gst_percent: number;
}

// Major Indian cities with typical making charge variations
const INDIAN_CITIES = [
  { city: "Delhi", offset: 0, making: 8 },
  { city: "Mumbai", offset: 10, making: 8 },
  { city: "Chennai", offset: -20, making: 10 },
  { city: "Kolkata", offset: 5, making: 9 },
  { city: "Bangalore", offset: 15, making: 8 },
  { city: "Hyderabad", offset: -10, making: 9 },
  { city: "Ahmedabad", offset: -5, making: 7 },
  { city: "Pune", offset: 10, making: 8 },
  { city: "Jaipur", offset: 0, making: 10 },
  { city: "Lucknow", offset: -15, making: 9 },
] as const;

// ─── Fetch from Free APIs ───────────────────────────────────────────────────────

/**
 * Fetch gold price in INR from free public sources.
 * Uses multiple fallbacks to ensure reliability.
 */
export async function fetchGoldPrice(): Promise<GoldPrice | null> {
  // Attempt 1: Free metals API (no key needed for basic)
  const price = await fetchFromMetalPriceAPI();
  if (price) return price;

  // Attempt 2: GoldAPI free endpoint
  const price2 = await fetchFromGoldAPI();
  if (price2) return price2;

  // Attempt 3: Fallback to last known rates
  logger.warn("All gold APIs failed, using last DB record or defaults");
  return null;
}

/**
 * Fetch from Metal Price API (free tier, no auth for limited requests)
 * https://metalpriceapi.com — free: 50 requests/month
 */
async function fetchFromMetalPriceAPI(): Promise<GoldPrice | null> {
  try {
    // Use the free frankfurter-like open API for gold spot in INR
    // gold.org publishes spot prices; we use a free proxy
    const url =
      "https://api.metalpriceapi.com/v1/latest?api_key=demo&base=XAU&currencies=INR";
    const res = await fetch(url, {
      headers: { "User-Agent": "InvestingPro-DataBot/1.0" },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.rates?.INR) return null;

    // XAU rate is per troy ounce (31.1035 grams)
    const inrPerOunce = data.rates.INR;
    const inrPerGram24k = Math.round(inrPerOunce / 31.1035);
    const inrPerGram22k = Math.round(inrPerGram24k * (22 / 24));

    return {
      date: new Date().toISOString().split("T")[0],
      gold_24k_per_gram: inrPerGram24k,
      gold_22k_per_gram: inrPerGram22k,
      gold_24k_per_10g: inrPerGram24k * 10,
      gold_22k_per_10g: inrPerGram22k * 10,
      silver_per_kg: 0, // Not available from this source
      change_24k: 0,
      change_percent: 0,
      source: "metalpriceapi.com",
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    logger.warn("MetalPriceAPI fetch failed", {
      error: (error as Error).message,
    });
    return null;
  }
}

/**
 * Fetch from GoldAPI.io (free tier: limited requests)
 */
async function fetchFromGoldAPI(): Promise<GoldPrice | null> {
  try {
    // Public gold price endpoint — scrape a free gold rate page
    // goodreturns.in publishes gold prices in a parseable format
    const url = "https://www.goodreturns.in/gold-rates/";
    const res = await fetch(url, {
      headers: {
        "User-Agent": "InvestingPro-DataBot/1.0 (+https://investingpro.in/bot)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;

    const html = await res.text();

    // Parse gold prices from goodreturns.in HTML
    // They display "22 Carat Gold Price" and "24 Carat Gold Price" per 10 grams
    const gold22kMatch =
      html.match(
        /22\s*(?:Carat|Karat|K)\s*(?:Gold\s*)?(?:Price|Rate)[^₹]*?₹\s*([\d,]+)/i,
      ) || html.match(/22K[^₹]*?₹\s*([\d,]+)/i);
    const gold24kMatch =
      html.match(
        /24\s*(?:Carat|Karat|K)\s*(?:Gold\s*)?(?:Price|Rate)[^₹]*?₹\s*([\d,]+)/i,
      ) || html.match(/24K[^₹]*?₹\s*([\d,]+)/i);

    if (!gold22kMatch && !gold24kMatch) {
      logger.warn("Could not parse gold prices from goodreturns.in");
      return null;
    }

    const parse = (s: string) => parseInt(s.replace(/,/g, ""), 10);

    const gold22k10g = gold22kMatch ? parse(gold22kMatch[1]) : 0;
    const gold24k10g = gold24kMatch ? parse(gold24kMatch[1]) : 0;

    // If only one is available, derive the other
    const final24k = gold24k10g || Math.round(gold22k10g * (24 / 22));
    const final22k = gold22k10g || Math.round(gold24k10g * (22 / 24));

    if (final24k <= 0) return null;

    return {
      date: new Date().toISOString().split("T")[0],
      gold_24k_per_gram: Math.round(final24k / 10),
      gold_22k_per_gram: Math.round(final22k / 10),
      gold_24k_per_10g: final24k,
      gold_22k_per_10g: final22k,
      silver_per_kg: 0,
      change_24k: 0,
      change_percent: 0,
      source: "goodreturns.in",
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    logger.warn("GoodReturns gold fetch failed", {
      error: (error as Error).message,
    });
    return null;
  }
}

// ─── City-wise Prices ───────────────────────────────────────────────────────────

/**
 * Get gold prices for all major Indian cities.
 * City prices vary slightly due to local taxes, transport, and making charges.
 */
export function getCityGoldPrices(basePrice: GoldPrice): CityGoldPrice[] {
  return INDIAN_CITIES.map(({ city, offset, making }) => ({
    city,
    gold_24k_per_10g: basePrice.gold_24k_per_10g + offset,
    gold_22k_per_10g: basePrice.gold_22k_per_10g + offset,
    making_charges_percent: making,
    gst_percent: 3,
  }));
}

// ─── Default Prices (Fallback) ──────────────────────────────────────────────────

/**
 * Fallback gold prices when APIs are unavailable.
 * Updated manually — cron job keeps these current in DB.
 */
export function getDefaultGoldPrice(): GoldPrice {
  return {
    date: new Date().toISOString().split("T")[0],
    gold_24k_per_gram: 7650,
    gold_22k_per_gram: 7015,
    gold_24k_per_10g: 76500,
    gold_22k_per_10g: 70150,
    silver_per_kg: 92000,
    change_24k: 0,
    change_percent: 0,
    source: "fallback (manual)",
    updated_at: new Date().toISOString(),
  };
}

// ─── Database Operations ────────────────────────────────────────────────────────

/**
 * Store gold price in database
 */
export async function storeGoldPrice(price: GoldPrice): Promise<boolean> {
  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("gold_prices").upsert(
      {
        date: price.date,
        gold_24k_per_gram: price.gold_24k_per_gram,
        gold_22k_per_gram: price.gold_22k_per_gram,
        gold_24k_per_10g: price.gold_24k_per_10g,
        gold_22k_per_10g: price.gold_22k_per_10g,
        silver_per_kg: price.silver_per_kg,
        change_24k: price.change_24k,
        change_percent: price.change_percent,
        source: price.source,
        updated_at: price.updated_at,
      },
      { onConflict: "date" },
    );

    if (error) {
      logger.error("Failed to store gold price", error);
      return false;
    }
    return true;
  } catch (error) {
    logger.error("Error storing gold price", error as Error);
    return false;
  }
}

/**
 * Get latest gold price from database
 */
export async function getLatestGoldPrice(): Promise<GoldPrice | null> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("gold_prices")
      .select("*")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      date: data.date,
      gold_24k_per_gram: data.gold_24k_per_gram,
      gold_22k_per_gram: data.gold_22k_per_gram,
      gold_24k_per_10g: data.gold_24k_per_10g,
      gold_22k_per_10g: data.gold_22k_per_10g,
      silver_per_kg: data.silver_per_kg || 0,
      change_24k: data.change_24k || 0,
      change_percent: data.change_percent || 0,
      source: data.source,
      updated_at: data.updated_at,
    };
  } catch (error) {
    logger.error("Error fetching gold price from DB", error as Error);
    return null;
  }
}

/**
 * Calculate daily change by comparing with previous day
 */
export async function calculateDailyChange(
  todayPrice: GoldPrice,
): Promise<GoldPrice> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("gold_prices")
      .select("gold_24k_per_10g")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (data && data.gold_24k_per_10g) {
      const prevPrice = data.gold_24k_per_10g;
      const change = todayPrice.gold_24k_per_10g - prevPrice;
      const changePct =
        prevPrice > 0 ? parseFloat(((change / prevPrice) * 100).toFixed(2)) : 0;
      return {
        ...todayPrice,
        change_24k: change,
        change_percent: changePct,
      };
    }
  } catch {
    // No previous data
  }
  return todayPrice;
}
