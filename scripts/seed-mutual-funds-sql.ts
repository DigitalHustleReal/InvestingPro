/**
 * Mutual Fund Seed Script (SQL version)
 *
 * Generates SQL INSERT statements for mutual funds from AMFI API.
 * Outputs SQL to stdout for execution via Supabase SQL editor or psql.
 *
 * Usage:
 *   npx tsx scripts/seed-mutual-funds-sql.ts --all > seed.sql
 *   npx tsx scripts/seed-mutual-funds-sql.ts --limit 200 > seed.sql
 */

import {
  fetchAMFIData,
  filterDirectGrowthPlans,
  mapAMFIToProduct,
} from '../lib/data-sources/amfi-client';

const TOP_FUND_HOUSES = [
  'SBI Mutual Fund', 'ICICI Prudential Mutual Fund', 'HDFC Mutual Fund',
  'Nippon India Mutual Fund', 'Kotak Mahindra Mutual Fund',
  'Aditya Birla Sun Life Mutual Fund', 'Axis Mutual Fund', 'UTI Mutual Fund',
  'DSP Mutual Fund', 'Tata Mutual Fund', 'Mirae Asset Mutual Fund',
  'Canara Robeco Mutual Fund', 'Motilal Oswal Mutual Fund',
  'Parag Parikh Mutual Fund', 'Edelweiss Mutual Fund',
  'PGIM India Mutual Fund', 'Bandhan Mutual Fund', 'Quant Mutual Fund',
  'Sundaram Mutual Fund', 'Franklin Templeton Mutual Fund',
];

const PRIORITY_CATEGORIES = [
  'Equity - Large Cap', 'Equity - Flexi Cap', 'Equity - Mid Cap',
  'Equity - Small Cap', 'Equity - ELSS (Tax Saving)',
  'Equity - Large & Mid Cap', 'Equity - Index',
  'Hybrid - Balanced Advantage', 'Hybrid - Aggressive',
];

function escSql(s: string): string {
  return s.replace(/'/g, "''");
}

function toSqlArray(arr: string[]): string {
  return `ARRAY[${arr.map(v => `'${escSql(v)}'`).join(',')}]::text[]`;
}

async function main() {
  const args = process.argv.slice(2);
  const seedAll = args.includes('--all');
  const limitArg = args.find(a => a.startsWith('--limit'));
  const limit = limitArg
    ? parseInt(limitArg.split('=')[1] || args[args.indexOf('--limit') + 1] || '200')
    : (seedAll ? Infinity : 200);

  console.error(`Fetching AMFI data...`);
  const data = await fetchAMFIData();
  const directGrowth = filterDirectGrowthPlans(data);
  console.error(`Found ${directGrowth.length} Direct Growth plans`);

  const prioritized = directGrowth.sort((a, b) => {
    const aR = TOP_FUND_HOUSES.indexOf(a.fundHouse);
    const bR = TOP_FUND_HOUSES.indexOf(b.fundHouse);
    return (aR >= 0 ? aR : 999) - (bR >= 0 ? bR : 999);
  });

  const toSeed = limit === Infinity ? prioritized : prioritized.slice(0, limit);
  console.error(`Generating SQL for ${toSeed.length} funds...`);

  // Output SQL
  const statements: string[] = [];

  for (const fund of toSeed) {
    const p = mapAMFIToProduct(fund);
    const isTopHouse = TOP_FUND_HOUSES.some(h =>
      fund.fundHouse.toLowerCase().includes(h.toLowerCase().replace(' mutual fund', ''))
    );
    const isFeatured = isTopHouse && PRIORITY_CATEGORIES.includes(p.features.category);

    statements.push(`INSERT INTO public.products (slug, name, product_type, provider_name, provider_slug, description, short_description, features, pros, cons, key_features, tags, is_active, is_featured, data_source, last_data_refresh, updated_at)
VALUES (
  '${escSql(p.slug)}',
  '${escSql(p.name)}',
  '${escSql(p.product_type)}',
  '${escSql(p.provider_name)}',
  '${escSql(p.provider_slug)}',
  '${escSql(p.description)}',
  '${escSql(p.short_description)}',
  '${escSql(JSON.stringify(p.features))}'::jsonb,
  ${toSqlArray(p.pros)},
  ${toSqlArray(p.cons)},
  ${toSqlArray(p.key_features)},
  ${toSqlArray(p.tags)},
  true,
  ${isFeatured},
  'amfi_api',
  now(),
  now()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  features = EXCLUDED.features,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  is_featured = EXCLUDED.is_featured,
  updated_at = now();`);
  }

  // Print in batches for manageable execution
  console.log('-- InvestingPro Mutual Fund Seed Data');
  console.log(`-- Generated: ${new Date().toISOString()}`);
  console.log(`-- Total funds: ${statements.length}`);
  console.log('BEGIN;');
  for (const stmt of statements) {
    console.log(stmt);
  }
  console.log('COMMIT;');

  console.error(`Done! ${statements.length} INSERT statements generated.`);
}

main().catch(console.error);
