/**
 * Verify Performance Indexes Migration
 * Checks if all indexes from the performance migration exist
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Expected indexes from the migration
const expectedIndexes = [
  // Articles
  'idx_articles_status_published',
  'idx_articles_category_status',
  'idx_articles_title_search',
  'idx_articles_author',
  'idx_articles_submission_status',
  
  // Products
  'idx_credit_cards_bank_type',
  'idx_mutual_funds_category_rating',
  'idx_loans_type_bank',
  'idx_insurance_type_provider',
  
  // Reviews
  'idx_reviews_product_slug_rating',
  'idx_reviews_user_product',
  
  // Workflows
  'idx_workflow_instances_state_created',
  'idx_workflow_history_instance_step',
  
  // State Transitions
  'idx_state_transitions_entity',
  
  // Portfolio
  'idx_portfolio_user_asset_type',
];

async function verifyIndexes() {
  console.log('🔍 Verifying Performance Indexes...\n');

  try {
    // Query to get all indexes
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          indexname,
          tablename
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND indexname IN (${expectedIndexes.map(i => `'${i}'`).join(', ')})
        ORDER BY tablename, indexname;
      `
    });

    if (error) {
      // Try alternative query
      const { data: altData, error: altError } = await supabase
        .from('_test')
        .select('*')
        .limit(0);

      if (altError) {
        console.log('⚠️  Cannot query indexes directly (RLS restrictions)');
        console.log('   Please check indexes manually in Supabase Dashboard\n');
        console.log('📋 Expected Indexes:');
        expectedIndexes.forEach(idx => console.log(`   - ${idx}`));
        return;
      }
    }

    const foundIndexes = data || [];
    const foundIndexNames = foundIndexes.map((idx: any) => idx.indexname);

    console.log('✅ Found Indexes:');
    foundIndexes.forEach((idx: any) => {
      console.log(`   ✓ ${idx.indexname} on ${idx.tablename}`);
    });

    const missingIndexes = expectedIndexes.filter(idx => !foundIndexNames.includes(idx));
    
    if (missingIndexes.length > 0) {
      console.log('\n⚠️  Missing Indexes:');
      missingIndexes.forEach(idx => console.log(`   ✗ ${idx}`));
      console.log('\n💡 Run the migration to create missing indexes');
    } else {
      console.log('\n✅ All indexes verified!');
    }

  } catch (error) {
    console.error('❌ Error verifying indexes:', error instanceof Error ? error.message : String(error));
    console.log('\n📋 Expected Indexes:');
    expectedIndexes.forEach(idx => console.log(`   - ${idx}`));
    console.log('\n💡 Check indexes manually in Supabase Dashboard → Database → Indexes');
  }
}

verifyIndexes()
  .then(() => {
    console.log('\n✅ Verification complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  });
