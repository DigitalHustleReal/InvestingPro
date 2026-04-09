"use client";

import dynamic from "next/dynamic";

/**
 * Dynamically imported Recharts components (SSR-safe)
 *
 * Recharts renders blank on SSR because it depends on DOM measurements.
 * These dynamic imports ensure charts only render client-side.
 */
export const AreaChart = dynamic(
  () => import("recharts").then((m) => m.AreaChart),
  { ssr: false },
);
export const Area = dynamic(() => import("recharts").then((m) => m.Area), {
  ssr: false,
});
export const BarChart = dynamic(
  () => import("recharts").then((m) => m.BarChart),
  { ssr: false },
);
export const Bar = dynamic(() => import("recharts").then((m) => m.Bar), {
  ssr: false,
});
export const PieChart = dynamic(
  () => import("recharts").then((m) => m.PieChart),
  { ssr: false },
);
export const Pie = dynamic(() => import("recharts").then((m) => m.Pie), {
  ssr: false,
});
export const Cell = dynamic(() => import("recharts").then((m) => m.Cell), {
  ssr: false,
});
export const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), {
  ssr: false,
});
export const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), {
  ssr: false,
});
export const Tooltip = dynamic(
  () => import("recharts").then((m) => m.Tooltip),
  { ssr: false },
);
export const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false },
);
export const CartesianGrid = dynamic(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false },
);

/**
 * Currency formatter for Indian rupees (₹)
 */
export function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${Math.round(num).toLocaleString("en-IN")}`;
}

/**
 * Y-axis tick formatter for Indian notation
 */
export function yAxisINR(v: number): string {
  if (v >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `${(v / 100000).toFixed(0)}L`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return String(v);
}
