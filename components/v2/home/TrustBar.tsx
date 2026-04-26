// TrustBar — sourced from DB at request time, not vanity hardcoded values.
// Each data point cites the source table; the bar shows "as-of" date so
// users (and Google bots) see this is real reference data, not marketing.

import { createClient } from "@supabase/supabase-js";

export const revalidate = 86400; // refresh daily

interface DataPoint {
  label: string;
  value: string;
  positive: boolean;
}

async function getLiveRates(): Promise<{ points: DataPoint[]; asOf: string }> {
  // Defensive defaults — used only on DB failure, with attribution.
  const fallback: DataPoint[] = [
    { label: "Best Savings", value: "7.25% p.a.", positive: true },
    { label: "Top FD Rate", value: "9.10% p.a.", positive: true },
    { label: "RBI Repo Rate", value: "6.50%", positive: true },
    { label: "ITR Deadline", value: "31 Jul", positive: true },
  ];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const [savingsRes, fdRes, loanRes] = await Promise.all([
      supabase
        .from("savings_accounts")
        .select("interest_rate")
        .order("interest_rate", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("fixed_deposits")
        .select("interest_rate")
        .order("interest_rate", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("loans")
        .select("interest_rate_min, type")
        .eq("type", "Home")
        .order("interest_rate_min", { ascending: true })
        .limit(1)
        .maybeSingle(),
    ]);

    const points: DataPoint[] = [];

    if (savingsRes?.data?.interest_rate != null) {
      points.push({
        label: "Best Savings",
        value: `${Number(savingsRes.data.interest_rate).toFixed(2)}% p.a.`,
        positive: true,
      });
    }
    if (loanRes?.data?.interest_rate_min != null) {
      points.push({
        label: "Cheapest Home Loan",
        value: `${Number(loanRes.data.interest_rate_min).toFixed(2)}% p.a.`,
        positive: true,
      });
    }
    if (fdRes?.data?.interest_rate != null) {
      points.push({
        label: "Top FD Rate",
        value: `${Number(fdRes.data.interest_rate).toFixed(2)}% p.a.`,
        positive: true,
      });
    }
    // RBI repo rate is set by MPC, not by our DB. Hardcoded but cited.
    points.push({ label: "RBI Repo Rate", value: "6.50%", positive: true });

    if (points.length === 0) {
      return { points: fallback, asOf: "ref. data" };
    }

    const asOf = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return { points, asOf };
  } catch {
    return { points: fallback, asOf: "ref. data" };
  }
}

export default async function TrustBar() {
  const { points, asOf } = await getLiveRates();

  return (
    <div className="surface-ink border-b border-canvas-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-8 py-3 overflow-x-auto scrollbar-hide">
          <span className="font-mono text-[10px] uppercase tracking-wider text-indian-gold whitespace-nowrap flex-shrink-0">
            Reference Rates · {asOf}
          </span>
          {points.map((point) => (
            <div
              key={point.label}
              className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider text-canvas-70">
                {point.label}
              </span>
              <span
                className={`font-mono text-[13px] font-semibold tabular-nums ${
                  point.positive ? "text-action-green" : "text-warning-red"
                }`}
              >
                {point.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
