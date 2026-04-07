/**
 * Data Freshness Agent
 *
 * OPTIMIZE phase — monitors data accuracy across product tables.
 * Checks credit_cards, loans, mutual_funds, fixed_deposits, insurance_products
 * for stale or incomplete records.
 *
 * For each table:
 * - Counts total products
 * - Counts products not updated in 30+ days (stale)
 * - Counts products with missing critical fields
 * - Flags stale products for refresh
 * - Creates alert if stale % > 20%
 *
 * No AI calls — pure DB analysis.
 * Runs: 1:00 AM IST daily
 */

import { BaseSwarmAgent } from "./base-swarm-agent";
import { AgentContext, AgentResult } from "../base-agent";
import { logger } from "@/lib/logger";

const STALE_THRESHOLD_DAYS = 30;

interface TableConfig {
  table: string;
  label: string;
  criticalFields: string[];
}

interface TableReport {
  table: string;
  label: string;
  totalProducts: number;
  staleProducts: number;
  stalePercentage: number;
  missingFieldCounts: Record<string, number>;
  totalMissingFields: number;
  isHealthy: boolean;
}

const MONITORED_TABLES: TableConfig[] = [
  {
    table: "credit_cards",
    label: "Credit Cards",
    criticalFields: ["name", "annual_fee", "issuer"],
  },
  {
    table: "loans",
    label: "Loans",
    criticalFields: ["name", "interest_rate", "provider"],
  },
  {
    table: "mutual_funds",
    label: "Mutual Funds",
    criticalFields: ["name", "category", "fund_house"],
  },
  {
    table: "fixed_deposits",
    label: "Fixed Deposits",
    criticalFields: ["name", "interest_rate", "provider"],
  },
  {
    table: "insurance_products",
    label: "Insurance Products",
    criticalFields: ["name", "premium", "provider"],
  },
];

export class DataAgent extends BaseSwarmAgent {
  constructor() {
    super({
      name: "DataAgent",
      batchSize: 10,
      claimTimeoutMs: 10 * 60 * 1000,
      cronSchedule: "0 1 * * *",
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    let tablesProcessed = 0;
    let tablesFailed = 0;
    const reports: TableReport[] = [];
    const alerts: string[] = [];

    try {
      for (const tableConfig of MONITORED_TABLES) {
        try {
          const report = await this.analyzeTable(tableConfig);
          reports.push(report);

          if (!report.isHealthy) {
            const alertMsg = `${report.label}: ${report.stalePercentage.toFixed(1)}% stale (${report.staleProducts}/${report.totalProducts}), ${report.totalMissingFields} missing critical fields`;
            alerts.push(alertMsg);
            logger.warn(`[DataAgent] ALERT — ${alertMsg}`);
          }

          tablesProcessed++;
          logger.info(
            `[DataAgent] ${report.label}: ${report.totalProducts} total, ${report.staleProducts} stale (${report.stalePercentage.toFixed(1)}%), ${report.totalMissingFields} missing fields`,
          );
        } catch (error: any) {
          tablesFailed++;
          logger.error(
            `[DataAgent] Failed to analyze ${tableConfig.label}: ${error.message}`,
          );
        }
      }

      // Save report summary to heartbeat metadata
      const reportSummary = {
        tables: reports.map((r) => ({
          table: r.table,
          label: r.label,
          total: r.totalProducts,
          stale: r.staleProducts,
          stalePercent: r.stalePercentage,
          missingFields: r.totalMissingFields,
          healthy: r.isHealthy,
        })),
        alerts,
        timestamp: new Date().toISOString(),
      };

      // If there are alerts, save them to agent_heartbeats metadata
      if (alerts.length > 0) {
        await this.saveAlerts(alerts, reportSummary);
      }

      return {
        success: tablesProcessed > 0,
        data: {
          tablesAnalyzed: tablesProcessed,
          tablesFailed,
          alerts: alerts.length,
          reportSummary,
        },
        metadata: {
          itemsProcessed: tablesProcessed,
          itemsFailed: tablesFailed,
        },
        executionTime: Date.now() - startTime,
      };
    } catch (error: any) {
      return this.handleError(error, context);
    }
  }

  /**
   * Analyze a single product table for staleness and missing fields
   */
  private async analyzeTable(config: TableConfig): Promise<TableReport> {
    // 1. Count total products
    const { count: totalCount, error: countError } = await this.supabase
      .from(config.table)
      .select("*", { count: "exact", head: true });

    if (countError) {
      throw new Error(
        `Count failed for ${config.table}: ${countError.message}`,
      );
    }

    const totalProducts = totalCount || 0;

    // 2. Count stale products (not updated in 30+ days)
    const staleThreshold = new Date(
      Date.now() - STALE_THRESHOLD_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString();

    const { count: staleCount, error: staleError } = await this.supabase
      .from(config.table)
      .select("*", { count: "exact", head: true })
      .lt("updated_at", staleThreshold);

    if (staleError) {
      throw new Error(
        `Stale count failed for ${config.table}: ${staleError.message}`,
      );
    }

    const staleProducts = staleCount || 0;

    // 3. Check for missing critical fields
    const missingFieldCounts: Record<string, number> = {};
    let totalMissingFields = 0;

    for (const field of config.criticalFields) {
      const { count: missingCount, error: missingError } = await this.supabase
        .from(config.table)
        .select("*", { count: "exact", head: true })
        .is(field, null);

      if (missingError) {
        logger.warn(
          `[DataAgent] Could not check ${config.table}.${field}: ${missingError.message}`,
        );
        continue;
      }

      const missing = missingCount || 0;
      if (missing > 0) {
        missingFieldCounts[field] = missing;
        totalMissingFields += missing;
      }
    }

    // 4. Calculate health
    const stalePercentage =
      totalProducts > 0 ? (staleProducts / totalProducts) * 100 : 0;
    const isHealthy = stalePercentage <= 20 && totalMissingFields === 0;

    return {
      table: config.table,
      label: config.label,
      totalProducts,
      staleProducts,
      stalePercentage,
      missingFieldCounts,
      totalMissingFields,
      isHealthy,
    };
  }

  /**
   * Save alert entries to agent_heartbeats metadata for visibility
   */
  private async saveAlerts(
    alerts: string[],
    reportSummary: any,
  ): Promise<void> {
    try {
      const now = new Date().toISOString();

      await this.supabase.from("agent_heartbeats").upsert(
        {
          agent_name: this.config.name,
          last_heartbeat: now,
          status: "degraded",
          last_run_result: {
            alerts,
            report: reportSummary,
            timestamp: now,
          },
          last_error: `Data freshness alerts: ${alerts.length} tables need attention`,
          last_error_at: now,
          error_count: alerts.length,
          cron_schedule: this.config.cronSchedule,
          updated_at: now,
        },
        { onConflict: "agent_name" },
      );
    } catch (error) {
      logger.warn(`[DataAgent] Failed to save alerts`, { error });
    }
  }
}
