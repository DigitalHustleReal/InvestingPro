/**
 * Data Freshness Monitor
 *
 * Checks whether financial product data has gone stale.
 * A "stale" record is one where `updated_at` is older than the
 * configured threshold (default: 1 hour for live-rate products,
 * 24 hours for government-scheme products).
 *
 * Called by /api/cron/check-data-freshness every hour.
 * Fires an AlertRule into alertManager when staleness is detected
 * so it shows up alongside other platform alerts.
 */

import { createClient } from '@/lib/supabase/server';
import { alertManager } from '@/lib/monitoring/alert-manager';
import { logger } from '@/lib/logger';

/** Tables to check and their acceptable max-age in minutes. */
export const FRESHNESS_CONFIG: Record<string, number> = {
  products:     60,  // credit cards / loans — 1 hour
  rbi_rates:    60,  // RBI policy rates — 1 hour
  mutual_funds: 60,  // NAV data — 1 hour
  articles:    1440, // articles — 24 hours
};

export interface FreshnessResult {
  table: string;
  thresholdMinutes: number;
  staleCount: number;
  oldestUpdatedAt: string | null;
  stale: boolean;
}

export interface FreshnessReport {
  checkedAt: string;
  results: FreshnessResult[];
  staleTableCount: number;
  healthy: boolean;
}

/**
 * Check every configured table's `updated_at` timestamp.
 * Returns a report and fires alertManager rules for any stale tables.
 */
export async function checkDataFreshness(): Promise<FreshnessReport> {
  const supabase = await createClient();
  const checkedAt = new Date().toISOString();
  const results: FreshnessResult[] = [];

  for (const [table, thresholdMinutes] of Object.entries(FRESHNESS_CONFIG)) {
    try {
      const thresholdISO = new Date(
        Date.now() - thresholdMinutes * 60 * 1000
      ).toISOString();

      // Count rows not updated within the threshold
      const { count, error: countError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .lt('updated_at', thresholdISO);

      if (countError) {
        logger.warn(`data-freshness: could not query table "${table}"`, { error: countError.message });
        continue;
      }

      // Find the oldest row's updated_at for context
      const { data: oldestRow, error: oldestError } = await supabase
        .from(table)
        .select('updated_at')
        .order('updated_at', { ascending: true })
        .limit(1)
        .single();

      const staleCount = count ?? 0;
      const stale = staleCount > 0;
      const oldest = !oldestError && oldestRow ? (oldestRow as { updated_at: string }).updated_at : null;

      results.push({
        table,
        thresholdMinutes,
        staleCount,
        oldestUpdatedAt: oldest,
        stale,
      });

      if (stale) {
        logger.warn(`data-freshness: ${staleCount} stale rows in "${table}"`, {
          thresholdMinutes,
          oldestUpdatedAt: oldest,
        });

        // Surface inside alertManager so it appears in the admin alert feed
        alertManager.addRule({
          name: `data_freshness_${table}`,
          condition: () => true, // Already evaluated above — fire immediately
          severity: 'high',
          message: `${staleCount} row(s) in "${table}" not updated in the last ${thresholdMinutes} min`,
          cooldown: thresholdMinutes * 60 * 1000,
        });
        await alertManager.checkAlerts();
      }
    } catch (err) {
      logger.error(
        `data-freshness: unexpected error checking "${table}"`,
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }

  const staleTableCount = results.filter(r => r.stale).length;

  return {
    checkedAt,
    results,
    staleTableCount,
    healthy: staleTableCount === 0,
  };
}
