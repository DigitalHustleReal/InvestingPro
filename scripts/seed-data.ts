/**
 * Universal Data Seeder
 * Populates Supabase tables from local CSV files in `data/` folder.
 * Usage: npx tsx scripts/seed-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedTable(tableName: string, csvFile: string, mapper: (row: any) => any) {
  const filePath = path.join(process.cwd(), 'data', csvFile);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`CSV file not found: ${filePath}`);
    return;
  }

  console.log(`Seeding ${tableName} from ${csvFile}...`);
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const processedData = records.map(mapper);

  // Upsert data
  const { error } = await supabase
    .from(tableName)
    .upsert(processedData, { onConflict: 'slug' });

  if (error) {
    console.error(`Error seeding ${tableName}:`, error.message);
  } else {
    console.log(`✅ Successfully seeded ${tableName} with ${processedData.length} records.`);
  }
}

// Mappers to transform CSV strings into DB appropriate types (e.g. arrays)
const cardMapper = (row: any) => ({
  ...row,
  rewards: row.rewards ? row.rewards.split('|') : [],
  pros: row.pros ? row.pros.split('|') : [],
  cons: row.cons ? row.cons.split('|') : [],
  updated_at: new Date().toISOString()
});

const loanMapper = (row: any) => ({
  ...row,
  pros: row.pros ? row.pros.split('|') : [],
  cons: row.cons ? row.cons.split('|') : [],
  updated_at: new Date().toISOString()
});

async function main() {
  await seedTable('credit_cards', 'credit_cards.csv', cardMapper);
  // Uncomment below when loans table is created
  // await seedTable('loans', 'loans.csv', loanMapper);
}

main();
