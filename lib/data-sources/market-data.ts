/**
 * Stock Market Data Source
 *
 * Fetches Sensex and Nifty 50 data from free public sources.
 *
 * Sources (free, public, no API key):
 *   1. Google Finance (public JSON endpoints)
 *   2. Yahoo Finance v8 API (free tier)
 *   3. NSE India public data
 *
 * Used by: MarketTicker component, homepage, analytics
 */

import { logger } from "@/lib/logger";
import {
  getLatestGoldPrice,
  getDefaultGoldPrice,
  type GoldPrice,
} from "./gold-price";

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  lastUpdated: string;
}

export interface MarketTickerData {
  sensex: MarketIndex;
  nifty50: MarketIndex;
  gold: {
    price: number; // 24K per 10g
    change: number;
    changePercent: number;
    isPositive: boolean;
  };
  niftyBank?: MarketIndex;
  lastFetched: string;
  source: string;
}

// ─── Fetch Market Data ──────────────────────────────────────────────────────────

/**
 * Fetch all market ticker data (Sensex, Nifty, Gold)
 * Uses multiple sources with fallbacks.
 */
export async function fetchMarketTickerData(): Promise<MarketTickerData> {
  const [indices, goldPrice] = await Promise.all([
    fetchIndianIndices(),
    getGoldForTicker(),
  ]);

  return {
    sensex: indices.sensex,
    nifty50: indices.nifty50,
    niftyBank: indices.niftyBank,
    gold: {
      price: goldPrice.gold_24k_per_10g,
      change: goldPrice.change_24k,
      changePercent: goldPrice.change_percent,
      isPositive: goldPrice.change_24k >= 0,
    },
    lastFetched: new Date().toISOString(),
    source: indices.source,
  };
}

/**
 * Fetch Sensex and Nifty 50 from free sources
 */
async function fetchIndianIndices(): Promise<{
  sensex: MarketIndex;
  nifty50: MarketIndex;
  niftyBank?: MarketIndex;
  source: string;
}> {
  // Attempt 1: Yahoo Finance (free, reliable)
  const yahoo = await fetchFromYahooFinance();
  if (yahoo) return yahoo;

  // Attempt 2: Google Finance scrape
  const google = await fetchFromGoogleFinance();
  if (google) return google;

  // Fallback: Default values (market closed / API down)
  logger.warn("All market data sources failed, using defaults");
  return getDefaultIndices();
}

/**
 * Yahoo Finance v8 API — free, no API key needed
 * Fetches real-time quote data for Indian indices
 */
async function fetchFromYahooFinance(): Promise<{
  sensex: MarketIndex;
  nifty50: MarketIndex;
  niftyBank?: MarketIndex;
  source: string;
} | null> {
  try {
    // Yahoo Finance symbols for Indian indices
    const symbols = ["^BSESN", "^NSEI", "^NSEBANK"].join(",");
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "InvestingPro-DataBot/1.0 (+https://investingpro.in/bot)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const quotes = data?.quoteResponse?.result;
    if (!quotes || quotes.length === 0) return null;

    const findQuote = (symbol: string) =>
      quotes.find((q: any) => q.symbol === symbol);

    const sensexQ = findQuote("^BSESN");
    const niftyQ = findQuote("^NSEI");
    const bankNiftyQ = findQuote("^NSEBANK");

    if (!sensexQ && !niftyQ) return null;

    const toIndex = (q: any, name: string, symbol: string): MarketIndex => ({
      name,
      symbol,
      value: q?.regularMarketPrice ?? 0,
      change: q?.regularMarketChange ?? 0,
      changePercent: q?.regularMarketChangePercent ?? 0,
      isPositive: (q?.regularMarketChange ?? 0) >= 0,
      lastUpdated: new Date().toISOString(),
    });

    return {
      sensex: sensexQ
        ? toIndex(sensexQ, "Sensex", "BSE")
        : getDefaultIndices().sensex,
      nifty50: niftyQ
        ? toIndex(niftyQ, "Nifty 50", "NSE")
        : getDefaultIndices().nifty50,
      niftyBank: bankNiftyQ
        ? toIndex(bankNiftyQ, "Bank Nifty", "NSEBANK")
        : undefined,
      source: "Yahoo Finance",
    };
  } catch (error) {
    logger.warn("Yahoo Finance fetch failed", {
      error: (error as Error).message,
    });
    return null;
  }
}

/**
 * Google Finance — scrape index data from public page
 */
async function fetchFromGoogleFinance(): Promise<{
  sensex: MarketIndex;
  nifty50: MarketIndex;
  source: string;
} | null> {
  try {
    // Google Finance has public pages for Indian indices
    const niftyUrl = "https://www.google.com/finance/quote/NIFTY_50:INDEXNSE";
    const res = await fetch(niftyUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; InvestingProBot/1.0)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;

    const html = await res.text();

    // Google Finance embeds price data in data attributes and JSON-LD
    // Look for the price pattern
    const priceMatch = html.match(/data-last-price="([\d.]+)"/);
    const changeMatch = html.match(
      /data-last-normal-market-change="([+-]?[\d.]+)"/,
    );
    const changePctMatch = html.match(
      /data-last-normal-market-change-pct="([+-]?[\d.]+)"/,
    );

    if (!priceMatch) return null;

    const niftyValue = parseFloat(priceMatch[1]);
    const niftyChange = changeMatch ? parseFloat(changeMatch[1]) : 0;
    const niftyChangePct = changePctMatch ? parseFloat(changePctMatch[1]) : 0;

    return {
      sensex: getDefaultIndices().sensex, // Can't get Sensex from this page
      nifty50: {
        name: "Nifty 50",
        symbol: "NSE",
        value: niftyValue,
        change: niftyChange,
        changePercent: niftyChangePct,
        isPositive: niftyChange >= 0,
        lastUpdated: new Date().toISOString(),
      },
      source: "Google Finance",
    };
  } catch (error) {
    logger.warn("Google Finance fetch failed", {
      error: (error as Error).message,
    });
    return null;
  }
}

// ─── Gold for Ticker ────────────────────────────────────────────────────────────

async function getGoldForTicker(): Promise<GoldPrice> {
  const dbPrice = await getLatestGoldPrice();
  return dbPrice ?? getDefaultGoldPrice();
}

// ─── Defaults ───────────────────────────────────────────────────────────────────

function getDefaultIndices() {
  const now = new Date().toISOString();
  return {
    sensex: {
      name: "Sensex",
      symbol: "BSE",
      value: 76500,
      change: 0,
      changePercent: 0,
      isPositive: true,
      lastUpdated: now,
    },
    nifty50: {
      name: "Nifty 50",
      symbol: "NSE",
      value: 23200,
      change: 0,
      changePercent: 0,
      isPositive: true,
      lastUpdated: now,
    },
    source: "fallback",
  };
}
