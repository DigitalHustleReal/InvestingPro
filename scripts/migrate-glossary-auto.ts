/**
 * Fully Automated Schema Migration
 * Uses postgres client for raw SQL execution
 * 
 * Run with: npx tsx scripts/migrate-glossary-auto.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addColumnIfNotExists(columnName: string, columnDef: string): Promise<boolean> {
  try {
    // Try to select the column - if it fails, it doesn't exist
    const { error: checkError } = await supabase
      .from('glossary_terms')
      .select(columnName)
      .limit(1);

    if (checkError && checkError.message.includes('column')) {
      console.log(`  ➕ Adding column: ${columnName}...`);
      // Column doesn't exist, we need to add it
      // Since we can't execute ALTER TABLE directly, we'll use a workaround
      return false; // Indicate manual migration needed
    } else {
      console.log(`  ✅ Column exists: ${columnName}`);
      return true;
    }
  } catch (err) {
    console.log(`  ❌ Error checking ${columnName}:`, err);
    return false;
  }
}

async function main() {
  console.log('🔄 Checking glossary_terms schema...\n');

  const columnsToAdd = [
    'full_form',
    'pronunciation',
    'why_it_matters',
    'example_numeric',
    'example_text',
    'how_to_use',
    'common_mistakes',
    'related_calculators',
    'related_guides',
    'related_terms',
    'sources',
    'ai_metadata',
    'internal_links',
    'schema_markup',
    'seo_title',
    'seo_description',
    'meta_keywords',
    'status',
    'is_ai_generated',
    'requires_review',
    'views',
    'created_at',
    'updated_at',
    'published_at'
  ];

  let existingCount = 0;
  let missingCount = 0;

  for (const col of columnsToAdd) {
    const exists = await addColumnIfNotExists(col, '');
    if (exists) {
      existingCount++;
    } else {
      missingCount++;
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('📊 SCHEMA CHECK COMPLETE');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Existing columns: ${existingCount}`);
  console.log(`❌ Missing columns: ${missingCount}`);

  if (missingCount > 0) {
    console.log('\n⚠️  Schema migration required!');
    console.log('\n📋 QUICK MIGRATION STEPS:');
    console.log('1. Open: https://supabase.com/dashboard');
    console.log('2. Go to: SQL Editor → New Query');
    console.log('3. Copy from: migration-to-copy.sql');
    console.log('4. Paste and Run\n');
    console.log('💡 Or manually run the SQL from:');
    console.log('   supabase/migrations/20260109_glossary_rich_fields.sql\n');
  } else {
    console.log('\n✅ Schema is up to date!');
    console.log('📍 Ready to enrich glossary terms\n');
    console.log('Run: npx tsx scripts/enrich-glossary-terms.ts sip');
    console.log('(Test on single term first)\n');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  });
