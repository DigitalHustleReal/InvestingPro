"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

/**
 * LiveRateBadge — shows a live financial rate fetched from /api/rates
 *
 * Usage in article HTML:
 *   <span data-live-rate="rbi_repo"></span>
 *   <span data-live-rate="sbi_fd_1y"></span>
 *
 * The TableEnhancer hydrates these spans with real data.
 */

interface RateData {
  value: number;
  unit: string;
  label: string;
  source: string;
}

interface RatesResponse {
  updatedAt: string;
  rates: Record<string, RateData>;
}

let cachedRates: RatesResponse | null = null;

export async function fetchRates(): Promise<RatesResponse | null> {
  if (cachedRates) return cachedRates;

  try {
    const res = await fetch("/api/rates", { next: { revalidate: 21600 } });
    if (!res.ok) return null;
    const data = await res.json();
    cachedRates = data;
    return data;
  } catch {
    return null;
  }
}

export function formatRate(rate: RateData): string {
  if (rate.unit === "₹") {
    return `₹${rate.value.toLocaleString("en-IN")}`;
  }
  return `${rate.value}${rate.unit}`;
}

/**
 * LiveRateInline — renders a single rate inline in text
 */
export function LiveRateInline({ rateKey }: { rateKey: string }) {
  const [rate, setRate] = useState<RateData | null>(null);

  useEffect(() => {
    fetchRates().then((data) => {
      if (data?.rates[rateKey]) {
        setRate(data.rates[rateKey]);
      }
    });
  }, [rateKey]);

  if (!rate) return <span className="text-muted-foreground">--</span>;

  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary/5 text-primary font-semibold rounded text-sm"
      title={`${rate.label} — Source: ${rate.source}`}
    >
      {formatRate(rate)}
      <RefreshCw className="w-2.5 h-2.5 opacity-40" />
    </span>
  );
}

/**
 * LiveRatesHydrator — finds all [data-live-rate] spans in article content
 * and replaces their text with live data from /api/rates
 */
export default function LiveRatesHydrator() {
  useEffect(() => {
    const hydrate = async () => {
      const data = await fetchRates();
      if (!data) return;

      const spans = document.querySelectorAll("[data-live-rate]");
      spans.forEach((span) => {
        const key = span.getAttribute("data-live-rate");
        if (!key || !data.rates[key]) return;

        const rate = data.rates[key];
        span.textContent = formatRate(rate);
        span.setAttribute(
          "title",
          `${rate.label} — Source: ${rate.source}, Updated: ${data.updatedAt}`,
        );
        (span as HTMLElement).style.cssText =
          "display:inline-flex;align-items:center;gap:4px;padding:2px 8px;background:rgba(22,163,74,0.08);color:#166534;font-weight:600;border-radius:4px;font-size:0.9em;";
      });
    };

    // Wait for content to render
    setTimeout(hydrate, 1200);
  }, []);

  return null;
}
