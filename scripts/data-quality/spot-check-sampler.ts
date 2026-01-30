/**
 * Spot-Check Sampler
 * Generates stratified random sample of products for manual accuracy verification
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createServiceClient } from '@/lib/supabase/service';
import { writeFileSync } from 'fs';
import path from 'path';

interface ProductSample {
  id: string;
  category: string;
  name: string;
  source_url?: string;
  key_fields: Record<string, any>;
}

const SAMPLE_SIZE_PER_CATEGORY = 25;
const CATEGORIES = ['credit_cards', 'mutual_funds', 'loans', 'insurance'];

async function generateSample() {
  const supabase = createServiceClient();
  const samples: ProductSample[] = [];

  console.log('🎯 Generating stratified sample for accuracy validation...\n');

  for (const category of CATEGORIES) {
    console.log(`📊 Sampling ${SAMPLE_SIZE_PER_CATEGORY} items from ${category}...`);

    // Get random sample from each category
    const { data, error } = await supabase
      .from(category)
      .select('*')
      .limit(1000); // Get larger pool for randomization

    if (error) {
      console.error(`❌ Error fetching ${category}:`, error);
      continue;
    }

    if (!data || data.length === 0) {
      console.warn(`⚠️ No data found for ${category}`);
      continue;
    }

    // Random sample
    const shuffled = data.sort(() => 0.5 - Math.random());
    const sample = shuffled.slice(0, SAMPLE_SIZE_PER_CATEGORY);

    // Extract key fields for verification
    for (const item of sample) {
      samples.push({
        id: item.id,
        category,
        name: item.name || item.scheme_name || 'Unknown',
        source_url: item.source_url || getSourceUrl(category, item),
        key_fields: extractKeyFields(category, item),
      });
    }

    console.log(`✅ Sampled ${sample.length} items from ${category}\n`);
  }

  // Export to CSV
  const csv = generateCSV(samples);
  const outputPath = path.join(process.cwd(), 'spot-check-sample.csv');
  writeFileSync(outputPath, csv);

  console.log(`\n✅ Sample generated: ${samples.length} products`);
  console.log(`📄 Exported to: ${outputPath}`);
  console.log(`\n📋 Next Steps:`);
  console.log(`1. Open spot-check-sample.csv`);
  console.log(`2. Manually verify each product against source_url`);
  console.log(`3. Mark as "correct" or "incorrect" in verification_status column`);
  console.log(`4. Run accuracy-calculator.ts to get accuracy rate`);
}

function getSourceUrl(category: string, item: any): string {
  // Generate source URL based on category
  switch (category) {
    case 'mutual_funds':
      return 'https://www.amfiindia.com/spages/NAVAll.txt';
    case 'credit_cards':
      return item.bank_url || 'https://www.bankbazaar.com/credit-card.html';
    case 'loans':
      return item.bank_url || 'https://www.bankbazaar.com/personal-loan.html';
    case 'insurance':
      return item.company_url || 'https://www.policybazaar.com/';
    default:
      return 'Manual verification required';
  }
}

function extractKeyFields(category: string, item: any): Record<string, any> {
  // Extract fields to verify based on category
  switch (category) {
    case 'mutual_funds':
      return {
        nav: item.nav,
        scheme_code: item.scheme_code,
        fund_house: item.fund_house,
      };
    case 'credit_cards':
      return {
        annual_fee: item.annual_fee,
        interest_rate: item.interest_rate,
        rewards_rate: item.rewards_rate,
      };
    case 'loans':
      return {
        interest_rate: item.interest_rate,
        processing_fee: item.processing_fee,
        max_amount: item.max_amount,
      };
    case 'insurance':
      return {
        premium: item.premium,
        sum_assured: item.sum_assured,
        coverage_type: item.coverage_type,
      };
    default:
      return {};
  }
}

function generateCSV(samples: ProductSample[]): string {
  const headers = [
    'id',
    'category',
    'name',
    'source_url',
    'key_fields',
    'verification_status',
    'notes',
  ];

  const rows = samples.map(s => [
    s.id,
    s.category,
    `"${s.name.replace(/"/g, '""')}"`,
    s.source_url,
    `"${JSON.stringify(s.key_fields).replace(/"/g, '""')}"`,
    '', // To be filled manually
    '', // To be filled manually
  ]);

  return [
    headers.join(','),
    ...rows.map(r => r.join(',')),
  ].join('\n');
}

// Run if called directly
if (require.main === module) {
  generateSample().catch(console.error);
}

export { generateSample };
