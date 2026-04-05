"use client";

/**
 * MarketTicker — Horizontal scrolling ticker showing Sensex, Nifty 50, Gold price
 *
 * Displays live market data with green/red indicators.
 * Data is fetched server-side and passed as props, or fetched client-side via API.
 *
 * Usage:
 *   <MarketTicker />                    — fetches from /api/market-data
 *   <MarketTicker data={tickerData} />  — uses pre-fetched data (SSR)
 */

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface TickerItem {
  label: string;
  value: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  prefix?: string; // e.g. "₹" for gold
}

interface MarketTickerProps {
  data?: {
    sensex: TickerItem;
    nifty50: TickerItem;
    gold: TickerItem;
    niftyBank?: TickerItem;
  };
  className?: string;
}

// ─── Formatting Helpers ─────────────────────────────────────────────────────────

function formatNumber(n: number, prefix = ""): string {
  if (n >= 10000) {
    return `${prefix}${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  }
  return `${prefix}${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatChange(change: number, pct: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(0)} (${sign}${pct.toFixed(2)}%)`;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function MarketTicker({ data, className }: MarketTickerProps) {
  const [ticker, setTicker] = useState(data ?? null);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (data) return; // Already have server data

    async function fetchTicker() {
      try {
        const res = await fetch("/api/market-data", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (json.data) {
          setTicker({
            sensex: {
              label: "Sensex",
              value: json.data.sensex.value,
              change: json.data.sensex.change,
              changePercent: json.data.sensex.changePercent,
              isPositive: json.data.sensex.isPositive,
            },
            nifty50: {
              label: "Nifty 50",
              value: json.data.nifty50.value,
              change: json.data.nifty50.change,
              changePercent: json.data.nifty50.changePercent,
              isPositive: json.data.nifty50.isPositive,
            },
            gold: {
              label: "Gold (24K)",
              value: json.data.gold.price,
              change: json.data.gold.change,
              changePercent: json.data.gold.changePercent,
              isPositive: json.data.gold.isPositive,
              prefix: "₹",
            },
            niftyBank: json.data.niftyBank
              ? {
                  label: "Bank Nifty",
                  value: json.data.niftyBank.value,
                  change: json.data.niftyBank.change,
                  changePercent: json.data.niftyBank.changePercent,
                  isPositive: json.data.niftyBank.isPositive,
                }
              : undefined,
          });
        }
      } catch {
        // Silently fail — ticker is non-critical
      } finally {
        setLoading(false);
      }
    }

    fetchTicker();
    // Refresh every 5 minutes during market hours
    const interval = setInterval(fetchTicker, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [data]);

  if (loading || !ticker) {
    return (
      <div
        className={cn(
          "w-full bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-1.5 overflow-hidden",
          className,
        )}
      >
        <div className="flex items-center gap-6 px-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const items: TickerItem[] = [
    { ...ticker.sensex, label: "Sensex" },
    { ...ticker.nifty50, label: "Nifty 50" },
    { ...ticker.gold, label: "Gold (24K/10g)", prefix: "₹" },
  ];

  if (ticker.niftyBank) {
    items.push({ ...ticker.niftyBank, label: "Bank Nifty" });
  }

  return (
    <div
      className={cn(
        "w-full bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-hidden",
        className,
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 py-1.5">
        <div className="flex items-center gap-5 md:gap-8 overflow-x-auto scrollbar-none">
          {items.map((item) => (
            <TickerItemDisplay key={item.label} item={item} />
          ))}
          <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-auto flex-shrink-0 hidden sm:block">
            Live market data
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Ticker Item ────────────────────────────────────────────────────────────────

function TickerItemDisplay({ item }: { item: TickerItem }) {
  const Icon =
    item.change > 0 ? TrendingUp : item.change < 0 ? TrendingDown : Minus;
  const colorClass = item.isPositive
    ? "text-green-600 dark:text-green-400"
    : item.change < 0
      ? "text-red-600 dark:text-red-400"
      : "text-gray-500";

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
        {item.label}
      </span>
      <span className="text-[12px] font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
        {formatNumber(item.value, item.prefix)}
      </span>
      <span
        className={cn(
          "flex items-center gap-0.5 text-[11px] font-medium tabular-nums",
          colorClass,
        )}
      >
        <Icon size={11} />
        {formatChange(item.change, item.changePercent)}
      </span>
    </div>
  );
}
