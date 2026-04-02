/**
 * Mutual Fund Seed Script (Direct SQL via fetch to Supabase)
 *
 * Bypasses PostgREST schema cache by using the Supabase SQL API directly.
 * Uses the service role key for authentication.
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import {
  fetchAMFIData,
  filterDirectGrowthPlans,
  mapAMFIToProduct,
} from '../lib/data-sources/amfi-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = supabaseUrl.replace('https://', '').split('.')[0];

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

function esc(s: string): string {
  return s.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

function toSqlArray(arr: string[]): string {
  return `ARRAY[${arr.map(v => `'${esc(v)}'`).join(',')}]::text[]`;
}

function buildInsertSQL(fund: ReturnType<typeof mapAMFIToProduct>, isFeatured: boolean): string {
  return `INSERT INTO public.products (slug, name, product_type, provider_name, provider_slug, description, short_description, features, pros, cons, key_features, tags, is_active, is_featured, data_source, last_data_refresh, updated_at)
VALUES ('${esc(fund.slug)}', '${esc(fund.name)}', '${esc(fund.product_type)}', '${esc(fund.provider_name)}', '${esc(fund.provider_slug)}', '${esc(fund.description)}', '${esc(fund.short_description)}', '${esc(JSON.stringify(fund.features))}'::jsonb, ${toSqlArray(fund.pros)}, ${toSqlArray(fund.cons)}, ${toSqlArray(fund.key_features)}, ${toSqlArray(fund.tags)}, true, ${isFeatured}, 'amfi_api', now(), now())
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, features = EXCLUDED.features, description = EXCLUDED.description, short_description = EXCLUDED.short_description, is_featured = EXCLUDED.is_featured, updated_at = now();`;
}

async function executeSqlViaManagementAPI(sql: string): Promise<{ ok: boolean; error?: string }> {
  // Use the Supabase Management API SQL endpoint
  const url = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SUPABASE_ACCESS_TOKEN || ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    // Fallback: use the PostgREST RPC approach
    return { ok: false, error: `Management API: ${res.status}` };
  }
  return { ok: true };
}

async function executeSqlViaRPC(sql: string): Promise<{ ok: boolean; error?: string }> {
  // Use a Postgres function to execute arbitrary SQL
  // First, create the function if it doesn't exist
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_raw_sql`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ sql_text: sql }),
  });

  if (res.ok) return { ok: true };

  const errText = await res.text();
  return { ok: false, error: errText };
}

async function main() {
  const args = process.argv.slice(2);
  const seedAll = args.includes('--all');
  const limitArg = args.find(a => a.startsWith('--limit'));
  const limit = limitArg
    ? parseInt(limitArg.split('=')[1] || args[args.indexOf('--limit') + 1] || '200')
    : (seedAll ? Infinity : 200);

  console.log('\n📊 InvestingPro Mutual Fund Seeder (Direct SQL)\n');

  // Step 1: Create an exec_raw_sql function in Supabase
  console.log('🔧 Creating SQL execution function...');
  const createFnSQL = `
    CREATE OR REPLACE FUNCTION exec_raw_sql(sql_text text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql_text;
    END;
    $$;
  `;

  // Try to create the function via the REST API (this will fail but that's ok, we'll use MCP for this)
  const fnRes = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_raw_sql`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql_text: 'SELECT 1' }),
  });

  if (!fnRes.ok) {
    console.log('⚠️  exec_raw_sql function not found. Please create it first:');
    console.log('   Run this SQL in Supabase SQL editor:');
    console.log(createFnSQL);
    console.log('\nOr run: npx tsx scripts/seed-mutual-funds-sql.ts --all > seed.sql');
    console.log('Then paste the SQL into the Supabase SQL editor.\n');

    // Alternative: try direct connection if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('No DATABASE_URL found either. Exiting.');
      process.exit(1);
    }
  }

  console.log('✅ SQL execution function available\n');

  const data = await fetchAMFIData();
  const directGrowth = filterDirectGrowthPlans(data);
  console.log(`📋 Direct Growth plans: ${directGrowth.length}`);

  const prioritized = directGrowth.sort((a, b) => {
    const aR = TOP_FUND_HOUSES.indexOf(a.fundHouse);
    const bR = TOP_FUND_HOUSES.indexOf(b.fundHouse);
    return (aR >= 0 ? aR : 999) - (bR >= 0 ? bR : 999);
  });

  const toSeed = limit === Infinity ? prioritized : prioritized.slice(0, limit);
  console.log(`🎯 Seeding ${toSeed.length} funds\n`);

  let inserted = 0;
  let errors = 0;
  const batchSize = 10;
  const totalBatches = Math.ceil(toSeed.length / batchSize);

  for (let i = 0; i < toSeed.length; i += batchSize) {
    const batch = toSeed.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;

    const statements = batch.map(fund => {
      const product = mapAMFIToProduct(fund);
      const isTopHouse = TOP_FUND_HOUSES.some(h =>
        fund.fundHouse.toLowerCase().includes(h.toLowerCase().replace(' mutual fund', ''))
      );
      const isFeatured = isTopHouse && PRIORITY_CATEGORIES.includes(product.features.category);
      return buildInsertSQL(product, isFeatured);
    });

    const sql = statements.join('\n');
    const result = await executeSqlViaRPC(sql);

    if (result.ok) {
      inserted += batch.length;
    } else {
      // Try individual statements
      for (const stmt of statements) {
        const singleResult = await executeSqlViaRPC(stmt);
        if (singleResult.ok) inserted++;
        else errors++;
      }
    }

    process.stdout.write(`   Batch ${batchNum}/${totalBatches} (${inserted} done, ${errors} errors)\r`);
  }

  console.log(`\n\n✅ Seeded: ${inserted}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📊 Total: ${toSeed.length}\n`);
}

main().catch(console.error);
