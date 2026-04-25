/**
 * Calculator display metadata — DB-first accessor with static fallback.
 *
 * Source of truth: Supabase `calculators` table. Falls back to
 * `./calculators-seed.ts` when the DB is unreachable.
 *
 * Ordering: alphabetical by slug within a category. Editorial can
 * override by bumping `display_order` (rows render by display_order
 * first, then slug ascending).
 *
 * NOTE: route validation in `app/[category]/calculators/[slug]/page.tsx`
 * uses `CALCULATOR_CATEGORY` (sync) from `lib/routing/category-map.ts`.
 * This accessor is for DISPLAY only. Keep both in sync.
 */

import { cache } from "react";
import { createServiceClient } from "@/lib/supabase/service";
import {
  getStaticCalculatorsForCategory,
  type CalculatorMeta,
} from "./calculators-seed";
import type { UrlCategory } from "@/lib/routing/category-map";

export type { CalculatorMeta };

export const getCalculatorsForCategory = cache(
  async (urlCategory: UrlCategory): Promise<CalculatorMeta[]> => {
    const supabase = createServiceClient();
    try {
      const { data, error } = await supabase
        .from("calculators")
        .select("slug, url_category, title, tagline, accent")
        .eq("url_category", urlCategory)
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("slug", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as CalculatorMeta[];
      }
    } catch {
      // fall through to static
    }
    return getStaticCalculatorsForCategory(urlCategory);
  },
);
