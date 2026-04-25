/**
 * Tax data runtime accessors — DB-first with static fallback.
 *
 * Source of truth: Supabase `tax_data` table, filtered by (kind, fy).
 * When the DB query fails or returns empty, falls back to the mirrors
 * in `./tax-data-seed.ts`.
 *
 * FY default is "FY 2026-27" — bump after next Budget.
 */

import { cache } from "react";
import { createServiceClient } from "@/lib/supabase/service";
import {
  TAX_DEDUCTIONS_STATIC,
  TAX_KEY_DATES_STATIC,
  TAX_REGIME_SLABS_STATIC,
  type TaxDeduction,
  type TaxKeyDate,
  type TaxRegimeSlab,
} from "./tax-data-seed";

export type { TaxDeduction, TaxKeyDate, TaxRegimeSlab };

const DEFAULT_FY = "FY 2026-27";

export const getTaxRegimeSlabs = cache(
  async (fy: string = DEFAULT_FY): Promise<TaxRegimeSlab[]> => {
    const supabase = createServiceClient();
    try {
      const { data, error } = await supabase
        .from("tax_data")
        .select("income_range, rate_old, rate_new")
        .eq("kind", "regime_slab")
        .eq("fy", fy)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as TaxRegimeSlab[];
      }
    } catch {
      // fall through to static
    }
    return TAX_REGIME_SLABS_STATIC;
  },
);

export const getTaxDeductions = cache(
  async (fy: string = DEFAULT_FY): Promise<TaxDeduction[]> => {
    const supabase = createServiceClient();
    try {
      const { data, error } = await supabase
        .from("tax_data")
        .select("section, cap, covers")
        .eq("kind", "deduction")
        .eq("fy", fy)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as TaxDeduction[];
      }
    } catch {
      // fall through to static
    }
    return TAX_DEDUCTIONS_STATIC;
  },
);

export const getTaxKeyDates = cache(
  async (fy: string = DEFAULT_FY): Promise<TaxKeyDate[]> => {
    const supabase = createServiceClient();
    try {
      const { data, error } = await supabase
        .from("tax_data")
        .select("date_label, event")
        .eq("kind", "key_date")
        .eq("fy", fy)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as TaxKeyDate[];
      }
    } catch {
      // fall through to static
    }
    return TAX_KEY_DATES_STATIC;
  },
);
