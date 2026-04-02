/**
 * Mutual Fund Data Enrichment Script
 *
 * Fetches historical NAV from mfapi.in and calculates:
 * - Returns (1M/3M/6M/1Y/3Y/5Y/10Y/Since Inception)
 * - SIP simulation returns
 * - Risk metrics (max drawdown, volatility, negative years)
 *
 * Updates the features JSONB in Supabase products table.
 *
 * Usage:
 *   npx tsx scripts/enrich-mutual-funds.ts              # Top 200 by AUM
 *   npx tsx scripts/enrich-mutual-funds.ts --all         # All funds
 *   npx tsx scripts/enrich-mutual-funds.ts --limit 50    # First 50
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import {
  fetchFundHistory,
  parseNAVHistory,
  calculateReturns,
  calculateSIPReturns,
  calculateRiskMetrics,
} from '../lib/data-sources/mfapi-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const projectRef = supabaseUrl.replace('https://', '').split('.')[0];
const accessToken = process.env.SUPABASE_ACCESS_TOKEN!;

if (!accessToken) {
  console.error('Missing SUPABASE_ACCESS_TOKEN in .env.local');
  process.exit(1);
}

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

async function executeSql(sql: string): Promise<{ ok: boolean; data?: any; error?: string }> {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: `${res.status}: ${text.substring(0, 200)}` };
  }
  const data = await res.json();
  return { ok: true, data };
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const seedAll = args.includes('--all');
  const limitArg = args.find(a => a.startsWith('--limit'));
  const limit = limitArg
    ? parseInt(limitArg.split('=')[1] || args[args.indexOf('--limit') + 1] || '200')
    : (seedAll ? 99999 : 200);

  console.log('\n📊 InvestingPro Mutual Fund Enrichment\n');

  // Get all mutual funds from DB
  const skipEnriched = args.includes('--force') ? '' : "AND (features->>'last_enriched' IS NULL)";
  const result = await executeSql(
    `SELECT slug, name, features->>'scheme_code' as scheme_code
     FROM public.products
     WHERE category = 'mutual_fund' AND features->>'scheme_code' IS NOT NULL
     ${skipEnriched}
     ORDER BY name
     LIMIT ${limit}`
  );

  if (!result.ok || !result.data) {
    console.error('Failed to fetch funds:', result.error);
    process.exit(1);
  }

  const funds = result.data as Array<{ slug: string; name: string; scheme_code: string }>;
  console.log(`Found ${funds.length} funds to enrich\n`);

  let enriched = 0;
  let errors = 0;
  let skipped = 0;

  for (let i = 0; i < funds.length; i++) {
    const fund = funds[i];
    const progress = `[${i + 1}/${funds.length}]`;

    try {
      // Fetch from mfapi.in
      const apiData = await fetchFundHistory(fund.scheme_code);
      const history = parseNAVHistory(apiData.data);

      if (history.length < 10) {
        console.log(`${progress} ⏭️  ${fund.name.substring(0, 50)} — insufficient NAV data (${history.length} points)`);
        skipped++;
        continue;
      }

      // Calculate everything
      const returns = calculateReturns(history);
      const sipReturns = calculateSIPReturns(history, 500);
      const riskMetrics = calculateRiskMetrics(history);
      const latest = history[history.length - 1];

      // Build the enriched features update (merge into existing JSONB)
      const enrichment = {
        nav: latest.nav,
        nav_date: latest.dateStr,
        returns_1m: returns.return_1m,
        returns_3m: returns.return_3m,
        returns_6m: returns.return_6m,
        returns_1y: returns.return_1y,
        returns_3y: returns.return_3y,
        returns_5y: returns.return_5y,
        returns_10y: returns.return_10y,
        returns_since_inception: returns.return_since_inception,
        sip_returns: sipReturns,
        risk_metrics: {
          max_drawdown: riskMetrics.max_drawdown,
          max_drawdown_date: riskMetrics.max_drawdown_date,
          recovery_days: riskMetrics.recovery_days,
          negative_years: riskMetrics.negative_years,
          total_years: riskMetrics.total_years,
          worst_1y_return: riskMetrics.worst_1y_return,
          best_1y_return: riskMetrics.best_1y_return,
          volatility_1y: riskMetrics.volatility_1y,
        },
        last_enriched: new Date().toISOString(),
      };

      // Update Supabase — merge into features JSONB
      const sql = `UPDATE public.products
        SET features = features || '${esc(JSON.stringify(enrichment))}'::jsonb,
            updated_at = now()
        WHERE slug = '${esc(fund.slug)}';`;

      const updateResult = await executeSql(sql);

      if (updateResult.ok) {
        enriched++;
        const retStr = returns.return_3y !== null ? `3Y: ${returns.return_3y}%` : 'no 3Y data';
        process.stdout.write(`${progress} ✅ ${fund.name.substring(0, 45).padEnd(45)} ${retStr}\r\n`);
      } else {
        errors++;
        console.error(`${progress} ❌ ${fund.name.substring(0, 40)} — DB update failed`);
      }

      // Rate limit: ~2 requests/sec to be nice to mfapi.in
      await sleep(500);

    } catch (err: any) {
      errors++;
      if (err.message?.includes('404') || err.message?.includes('not found')) {
        skipped++;
        console.log(`${progress} ⏭️  ${fund.name.substring(0, 50)} — not found on mfapi.in`);
      } else {
        console.error(`${progress} ❌ ${fund.name.substring(0, 40)} — ${err.message?.substring(0, 60)}`);
      }
      // Don't hammer the API on errors
      await sleep(1000);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Enriched: ${enriched}`);
  console.log(`⏭️  Skipped:  ${skipped}`);
  console.log(`❌ Errors:   ${errors}`);
  console.log(`📊 Total:    ${funds.length}`);
  console.log(`${'='.repeat(60)}\n`);
}

main().catch(console.error);
