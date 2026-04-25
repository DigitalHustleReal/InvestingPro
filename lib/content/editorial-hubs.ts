/**
 * Editorial hub runtime accessor — DB-first with static fallback.
 *
 * Source of truth: Supabase `editorial_hubs` table. One table serves
 * multiple placements (not-found-hubs, not-found-calculators, …);
 * callers pass the placement key they want. Fallback to
 * `./editorial-hubs-data.ts` if DB is unreachable.
 */

import { cache } from "react";
import { createServiceClient } from "@/lib/supabase/service";
import {
  getStaticEditorialHubs,
  type EditorialHub,
} from "./editorial-hubs-data";

export type { EditorialHub };

export const getEditorialHubs = cache(
  async (placement: string): Promise<EditorialHub[]> => {
    const supabase = createServiceClient();
    try {
      const { data, error } = await supabase
        .from("editorial_hubs")
        .select("placement, href, title, tagline, accent")
        .eq("placement", placement)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as EditorialHub[];
      }
    } catch {
      // fall through to static
    }
    return getStaticEditorialHubs(placement);
  },
);
