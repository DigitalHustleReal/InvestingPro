/**
 * Locale-aware Intl helpers.
 *
 * Two principles enforced here:
 *
 *   1. **Indian lakh/crore grouping is preserved across all 8
 *      locales.** The Indian numbering convention groups by 2 digits
 *      after the first 3 (e.g. `1,25,000` not `125,000`). `Intl.
 *      NumberFormat("en-IN")` produces this grouping with Latin
 *      digits, which is the canonical form on Indian fintech and
 *      government surfaces (RBI, SEBI, IRDAI, Income Tax). We use
 *      `en-IN` for all currency / number rendering regardless of
 *      UI locale to keep amounts readable and copy-pasteable.
 *
 *   2. **Dates localise.** Month names, weekday names, and the
 *      "ordinal" portion of relative dates do translate per locale,
 *      via `${locale}-IN` (e.g. `hi-IN`, `bn-IN`). Currency totals
 *      and account numbers don't.
 *
 * Compact form (`compact: true`) renders ₹125,000 as "₹1.25 lakh"
 * and ₹12,500,000 as "₹1.25 cr" — the conventional Indian shorthand.
 * `compact` is opt-in because exact figures matter on most surfaces
 * (tax slabs, EMI breakdowns, FD maturity); compact is reserved for
 * marquee numbers, hub heroes, and trust-bar stats.
 */

import { LOCALE_META, type Locale } from "./config";

/** BCP47 tag for the given locale. Always India-region (-IN suffix). */
export function bcp47(locale: Locale): string {
  return LOCALE_META[locale].htmlLang;
}

const NUMBER_LOCALE = "en-IN";

const baseCurrency = new Intl.NumberFormat(NUMBER_LOCALE, {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const baseCurrencyWithPaise = new Intl.NumberFormat(NUMBER_LOCALE, {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const baseNumber = new Intl.NumberFormat(NUMBER_LOCALE, {
  maximumFractionDigits: 0,
});

const baseNumberDecimal = new Intl.NumberFormat(NUMBER_LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Indian lakh/crore short form.
 *   ₹125_000      → "₹1.25 lakh"
 *   ₹12_50_00_000 → "₹12.5 cr"
 *   ₹50_000       → "₹50,000"      (below threshold, full form)
 *   ₹0            → "₹0"
 */
function indianCompact(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_00_00_000) {
    const value = n / 1_00_00_000;
    return `${sign}₹${trim(value)} cr`;
  }
  if (abs >= 1_00_000) {
    const value = n / 1_00_000;
    return `${sign}₹${trim(value)} lakh`;
  }
  return baseCurrency.format(n);
}

function trim(n: number): string {
  // Two decimals, but strip trailing zeros: 1.50 → 1.5, 12.00 → 12
  const fixed = n.toFixed(2);
  return fixed.replace(/\.?0+$/, "");
}

export interface CurrencyOptions {
  /** Show paise — defaults to false (₹125,000 not ₹125,000.00). */
  paise?: boolean;
  /** Compact lakh/crore form for amounts ≥ 1 lakh. Defaults to false. */
  compact?: boolean;
}

/** Format an INR amount with Indian lakh/crore grouping. */
export function formatCurrency(
  n: number,
  options: CurrencyOptions = {},
): string {
  if (!Number.isFinite(n)) return "—";
  if (options.compact) return indianCompact(n);
  return options.paise
    ? baseCurrencyWithPaise.format(n)
    : baseCurrency.format(n);
}

/** Format a plain number with Indian lakh/crore grouping. */
export function formatNumber(n: number, decimals = 0): string {
  if (!Number.isFinite(n)) return "—";
  return decimals > 0 ? baseNumberDecimal.format(n) : baseNumber.format(n);
}

/**
 * Format a percent. Returns e.g. "7.5%" — always locale-neutral
 * Latin digits since rates appear next to currency.
 */
export function formatPercent(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(decimals).replace(/\.?0+$/, "")}%`;
}

export interface DateOptions {
  /** Style: "short" → 26 Apr 2026, "long" → 26 April 2026, "numeric" → 26/04/2026. */
  style?: "short" | "long" | "numeric";
}

/**
 * Locale-aware date formatter. Month + weekday names translate per
 * locale; the date layout stays Indian (day-month-year).
 */
export function formatDate(
  d: Date | string | number,
  locale: Locale,
  options: DateOptions = {},
): string {
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  const tag = bcp47(locale);
  const style = options.style ?? "short";
  const opts: Intl.DateTimeFormatOptions =
    style === "numeric"
      ? { day: "2-digit", month: "2-digit", year: "numeric" }
      : style === "long"
        ? { day: "numeric", month: "long", year: "numeric" }
        : { day: "numeric", month: "short", year: "numeric" };
  return new Intl.DateTimeFormat(tag, opts).format(date);
}

/**
 * Relative time — "2 days ago", "in 3 months". Uses locale-aware
 * `Intl.RelativeTimeFormat` so the verb + unit translate.
 */
export function formatRelative(
  from: Date | string | number,
  locale: Locale,
  to: Date = new Date(),
): string {
  const fromDate = from instanceof Date ? from : new Date(from);
  if (Number.isNaN(fromDate.getTime())) return "—";
  const diffMs = fromDate.getTime() - to.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const tag = bcp47(locale);
  const rtf = new Intl.RelativeTimeFormat(tag, { numeric: "auto" });
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];
  for (const [unit, secs] of units) {
    if (Math.abs(diffSec) >= secs) {
      return rtf.format(Math.round(diffSec / secs), unit);
    }
  }
  return rtf.format(diffSec, "second");
}
