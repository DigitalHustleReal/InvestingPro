/**
 * Mutual Fund Seed Script
 *
 * Fetches ALL mutual fund data from AMFI India API and seeds into Supabase.
 * Filters to Direct Growth plans only (most relevant for investors).
 *
 * Usage:
 *   npx tsx scripts/seed-mutual-funds.ts
 *   npx tsx scripts/seed-mutual-funds.ts --limit 200   # Seed top 200 only
 *   npx tsx scripts/seed-mutual-funds.ts --all          # Seed all funds
 *
 * Requires: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import {
  fetchAMFIData,
  filterDirectGrowthPlans,
  mapAMFIToProduct,
  type AMFIFund,
} from '../lib/data-sources/amfi-client';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Top fund houses by AUM (prioritized for featured status)
const TOP_FUND_HOUSES = [
  'SBI Mutual Fund',
  'ICICI Prudential Mutual Fund',
  'HDFC Mutual Fund',
  'Nippon India Mutual Fund',
  'Kotak Mahindra Mutual Fund',
  'Aditya Birla Sun Life Mutual Fund',
  'Axis Mutual Fund',
  'UTI Mutual Fund',
  'DSP Mutual Fund',
  'Tata Mutual Fund',
  'Mirae Asset Mutual Fund',
  'Canara Robeco Mutual Fund',
  'Motilal Oswal Mutual Fund',
  'Parag Parikh Mutual Fund',
  'Edelweiss Mutual Fund',
  'PGIM India Mutual Fund',
  'Bandhan Mutual Fund',
  'Quant Mutual Fund',
  'Sundaram Mutual Fund',
  'Franklin Templeton Mutual Fund',
];

// Priority categories for featuring
const PRIORITY_CATEGORIES = [
  'Equity - Large Cap',
  'Equity - Flexi Cap',
  'Equity - Mid Cap',
  'Equity - Small Cap',
  'Equity - ELSS (Tax Saving)',
  'Equity - Large & Mid Cap',
  'Equity - Index',
  'Hybrid - Balanced Advantage',
  'Hybrid - Aggressive',
];

async function seedMutualFunds() {
  const args = process.argv.slice(2);
  const limitArg = args.find((a) => a.startsWith('--limit'));
  const seedAll = args.includes('--all');
  const limit = limitArg ? parseInt(limitArg.split('=')[1] || args[args.indexOf('--limit') + 1] || '200') : (seedAll ? Infinity : 200);

  console.log('\n📊 InvestingPro Mutual Fund Seeder\n');
  console.log(`Mode: ${seedAll ? 'ALL funds' : `Top ${limit} funds`}\n`);

  // Step 1: Fetch from AMFI
  console.log('⬇️  Fetching data from AMFI India...');
  const data = await fetchAMFIData();
  console.log(`   Total schemes: ${data.funds.length}`);
  console.log(`   Fund houses: ${data.fundHouses.length}`);
  console.log(`   Categories: ${data.categories.length}`);
  console.log(`   Last updated: ${data.lastUpdated}\n`);

  // Step 2: Filter Direct Growth plans
  const directGrowth = filterDirectGrowthPlans(data);
  console.log(`📋 Direct Growth plans: ${directGrowth.length}\n`);

  // Step 3: Prioritize — top fund houses + priority categories first
  const prioritized = directGrowth.sort((a, b) => {
    const aTopHouse = TOP_FUND_HOUSES.indexOf(a.fundHouse);
    const bTopHouse = TOP_FUND_HOUSES.indexOf(b.fundHouse);
    const aHouseRank = aTopHouse >= 0 ? aTopHouse : 999;
    const bHouseRank = bTopHouse >= 0 ? bTopHouse : 999;
    return aHouseRank - bHouseRank;
  });

  // Apply limit
  const toSeed = limit === Infinity ? prioritized : prioritized.slice(0, limit);
  console.log(`🎯 Seeding ${toSeed.length} funds\n`);

  // Step 4: Map and upsert
  let inserted = 0;
  let errors = 0;
  const batchSize = 50;

  for (let i = 0; i < toSeed.length; i += batchSize) {
    const batch = toSeed.slice(i, i + batchSize);
    const records = batch.map((fund) => {
      const product = mapAMFIToProduct(fund);
      const isTopHouse = TOP_FUND_HOUSES.some((h) =>
        fund.fundHouse.toLowerCase().includes(h.toLowerCase().replace(' mutual fund', ''))
      );
      return {
        ...product,
        is_featured: isTopHouse && PRIORITY_CATEGORIES.includes(product.features.category),
        updated_at: new Date().toISOString(),
      };
    });

    const { error } = await supabase
      .from('products')
      .upsert(records, { onConflict: 'slug', ignoreDuplicates: false });

    if (error) {
      console.error(`   ❌ Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
      // Try individual inserts for this batch
      for (const record of records) {
        const { error: singleError } = await supabase
          .from('products')
          .upsert(record, { onConflict: 'slug' });
        if (singleError) {
          errors++;
        } else {
          inserted++;
        }
      }
    } else {
      inserted += batch.length;
      process.stdout.write(`   ✅ Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(toSeed.length / batchSize)} (${inserted} done)\r`);
    }
  }

  console.log(`\n\n${'='.repeat(50)}`);
  console.log(`✅ Seeded: ${inserted}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📊 Total attempted: ${toSeed.length}`);
  console.log(`${'='.repeat(50)}\n`);

  // Summary by category
  const byCat: Record<string, number> = {};
  toSeed.forEach((f) => {
    const product = mapAMFIToProduct(f);
    const cat = product.features.category;
    byCat[cat] = (byCat[cat] || 0) + 1;
  });

  console.log('Funds by category:');
  Object.entries(byCat)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

  // Summary by fund house
  const byHouse: Record<string, number> = {};
  toSeed.forEach((f) => {
    byHouse[f.fundHouse] = (byHouse[f.fundHouse] || 0) + 1;
  });

  console.log('\nFunds by fund house (top 20):');
  Object.entries(byHouse)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([house, count]) => {
      console.log(`  ${house}: ${count}`);
    });
}

seedMutualFunds().catch(console.error);
