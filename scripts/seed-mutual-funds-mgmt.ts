/**
 * Mutual Fund Seed Script (via Supabase Management API)
 *
 * Uses the Management API to bypass PostgREST schema cache issues.
 * Requires SUPABASE_ACCESS_TOKEN in .env.local
 *
 * Usage:
 *   npx tsx scripts/seed-mutual-funds-mgmt.ts --all
 *   npx tsx scripts/seed-mutual-funds-mgmt.ts --limit 200
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import {
  fetchAMFIData,
  filterDirectGrowthPlans,
  simplifyCategory,
  type AMFIFund,
} from '../lib/data-sources/amfi-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const projectRef = supabaseUrl.replace('https://', '').split('.')[0];
const accessToken = process.env.SUPABASE_ACCESS_TOKEN!;

if (!accessToken) {
  console.error('Missing SUPABASE_ACCESS_TOKEN in .env.local');
  process.exit(1);
}

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
  return s.replace(/'/g, "''");
}

function toSqlArray(arr: string[]): string {
  return `ARRAY[${arr.map(v => `'${esc(v)}'`).join(',')}]::text[]`;
}

/**
 * Map AMFI fund to the REAL products table schema:
 * id, slug, name, category, provider_name, description, image_url, rating,
 * features (jsonb), pros, cons, affiliate_link, official_link, is_active,
 * last_verified_at, verification_status, verification_notes, trust_score,
 * created_at, updated_at, best_for
 */
function buildInsertSQL(fund: AMFIFund, isFeatured: boolean): string {
  const simpleCat = simplifyCategory(fund.category);
  const isEquity = simpleCat.startsWith('Equity');
  const isDebt = simpleCat.startsWith('Debt');

  let riskLevel = 'Moderate';
  if (simpleCat.includes('Small Cap') || simpleCat.includes('Mid Cap') || simpleCat.includes('Sectoral')) riskLevel = 'High';
  else if (simpleCat.includes('Large Cap') || simpleCat.includes('Flexi Cap') || simpleCat.includes('Index') || simpleCat.includes('ELSS')) riskLevel = 'Moderately High';
  else if (isDebt) riskLevel = simpleCat.includes('Credit Risk') ? 'Moderate' : 'Low to Moderate';
  else if (simpleCat.includes('Liquid') || simpleCat.includes('Overnight')) riskLevel = 'Low';

  const slug = fund.schemeName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);

  const description = `${fund.schemeName} is a ${simpleCat} fund managed by ${fund.fundHouse}. Current NAV: ₹${fund.nav.toFixed(4)} as of ${fund.navDate}.`;

  const features = {
    product_type: 'mutual_fund',
    scheme_code: fund.schemeCode,
    isin: fund.isinGrowth || fund.isinDivReinvest,
    fund_house: fund.fundHouse,
    category: simpleCat,
    sub_category: fund.category,
    short_description: `${simpleCat} fund | NAV: ₹${fund.nav.toFixed(2)}`,
    nav: fund.nav,
    nav_date: fund.navDate,
    risk_level: riskLevel,
    plan_type: fund.planType,
    option_type: fund.optionType,
    is_featured: isFeatured,
    aum_crores: null,
    expense_ratio: null,
    returns_1y: null,
    returns_3y: null,
    returns_5y: null,
    benchmark: null,
    fund_manager: null,
    launch_date: null,
    min_sip: 500,
    min_lumpsum: 5000,
    exit_load: null,
    tags: [
      simpleCat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      riskLevel.toLowerCase().replace(/\s+/g, '-'),
      fund.planType.toLowerCase(),
      isEquity ? 'equity' : isDebt ? 'debt' : 'hybrid',
    ],
  };

  const pros = isEquity
    ? ['Market-linked growth potential', 'Professional fund management', 'Diversified portfolio']
    : isDebt
    ? ['Lower volatility than equity', 'Regular income potential', 'Capital preservation']
    : ['Balanced risk-return profile', 'Diversification across asset classes', 'Professional management'];

  const cons = isEquity
    ? ['Market risk — NAV can decline', 'No guaranteed returns', 'Requires long-term horizon']
    : isDebt
    ? ['Lower returns than equity in long term', 'Interest rate risk', 'Credit risk in some categories']
    : ['Moderate returns compared to pure equity', 'Still has market risk', 'Tax treatment varies'];

  return `INSERT INTO public.products (slug, name, category, provider_name, description, features, pros, cons, is_active, best_for, updated_at)
VALUES ('${esc(slug)}', '${esc(fund.schemeName)}', 'mutual_fund', '${esc(fund.fundHouse)}', '${esc(description)}', '${esc(JSON.stringify(features))}'::jsonb, ${toSqlArray(pros)}, ${toSqlArray(cons)}, true, '${esc(simpleCat)}', now())
ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, features=EXCLUDED.features, description=EXCLUDED.description, best_for=EXCLUDED.best_for, updated_at=now();`;
}

async function executeSql(sql: string): Promise<{ ok: boolean; error?: string }> {
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
    return { ok: false, error: `${res.status}: ${text.substring(0, 300)}` };
  }
  return { ok: true };
}

async function main() {
  const args = process.argv.slice(2);
  const seedAll = args.includes('--all');
  const limitArg = args.find(a => a.startsWith('--limit'));
  const limit = limitArg
    ? parseInt(limitArg.split('=')[1] || args[args.indexOf('--limit') + 1] || '200')
    : (seedAll ? Infinity : 200);

  console.log('\n📊 InvestingPro Mutual Fund Seeder (Management API)\n');

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
  const batchSize = 50;
  const totalBatches = Math.ceil(toSeed.length / batchSize);

  for (let i = 0; i < toSeed.length; i += batchSize) {
    const batch = toSeed.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;

    const statements = batch.map(fund => {
      const isTopHouse = TOP_FUND_HOUSES.some(h =>
        fund.fundHouse.toLowerCase().includes(h.toLowerCase().replace(' mutual fund', ''))
      );
      const isFeatured = isTopHouse && PRIORITY_CATEGORIES.includes(simplifyCategory(fund.category));
      return buildInsertSQL(fund, isFeatured);
    });

    const sql = statements.join('\n');
    const result = await executeSql(sql);

    if (result.ok) {
      inserted += batch.length;
    } else {
      console.error(`\n   ❌ Batch ${batchNum}: ${result.error}`);
      // Try individual statements
      for (const stmt of statements) {
        const r = await executeSql(stmt);
        if (r.ok) inserted++;
        else errors++;
      }
    }

    process.stdout.write(`   Batch ${batchNum}/${totalBatches} (${inserted} done, ${errors} errors)\r`);
  }

  console.log(`\n\n✅ Seeded: ${inserted}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📊 Total: ${toSeed.length}\n`);

  // Verify
  const countResult = await executeSql("SELECT COUNT(*) as total FROM public.products WHERE category = 'mutual_fund'");
  if (countResult.ok) {
    console.log('Verified in database ✅');
  }
}

main().catch(console.error);
