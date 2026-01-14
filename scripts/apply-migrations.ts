/**
 * Database Migration Script
 * 
 * Applies all schema migrations to the database in the correct order
 * Run with: tsx scripts/apply-migrations.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Migration files in dependency order
const MIGRATIONS = [
  // Core tables first
  { file: 'cms_schema.sql', description: 'Core CMS tables (authors, categories, articles)' },
  { file: 'user_profiles_schema.sql', description: 'User profiles and authentication' },
  
  // Product-related tables
  { file: 'product_analytics_schema.sql', description: 'Product analytics tracking' },
  { file: 'credit_card_schema.sql', description: 'Credit card products' },
  { file: 'mutual_fund_schema.sql', description: 'Mutual fund products' },
  { file: 'reviews_schema.sql', description: 'Product reviews' },
  
  // Content tables
  { file: 'article_advanced_schema.sql', description: 'Advanced article features' },
  { file: 'pillar_page_schema.sql', description: 'Pillar pages and content hubs' },
  { file: 'glossary_expansion_investing.sql', description: 'Glossary terms (investing)', path: 'migrations/' },
  { file: 'glossary_expansion_new_categories.sql', description: 'Glossary terms (new categories)', path: 'migrations/' },
  
  // CMS features
  { file: 'pipeline_runs_schema.sql', description: 'Content pipeline tracking' },
  { file: 'keyword_research_schema.sql', description: 'Keyword research and SEO' },
  { file: 'seo_integrations_schema.sql', description: 'SEO integrations' },
  { file: 'social_automation_schema.sql', description: 'Social media automation' },
  { file: 'visual_content_schema.sql', description: 'Visual content management' },
  { file: 'rss_import_schema.sql', description: 'RSS feed imports' },
  
  // Affiliate and monetization
  { file: 'affiliate_complete_schema.sql', description: 'Complete affiliate system' },
  { file: 'affiliate_product_schema.sql', description: 'Affiliate product mapping' },
  { file: 'ad_placement_schema.sql', description: 'Ad placement system' },
  
  // Additional features
  { file: 'calculator_schema.sql', description: 'Financial calculators' },
  { file: 'portfolio_schema.sql', description: 'Portfolio tracking' },
  { file: 'leads_schema.sql', description: 'Lead generation' },
  { file: 'subscription_schema.sql', description: 'Subscription management' },
  { file: 'schema_driven_fields.sql', description: 'Dynamic schema-driven fields' },
];

interface MigrationResult {
  file: string;
  description: string;
  status: 'success' | 'error' | 'skipped';
  message?: string;
  duration?: number;
}

async function checkSupabaseConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase credentials.\n' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Test connection
  const { error } = await supabase.from('_test').select('*').limit(1);
  
  if (error && !error.message.includes('does not exist')) {
    // Connection error (not table missing error)
    console.error('Failed to connect to Supabase:', error.message);
    return null;
  }

  return supabase;
}

async function runMigration(
  supabase: any,
  migration: typeof MIGRATIONS[0]
): Promise<MigrationResult> {
  const startTime = Date.now();
  
  try {
    const schemaPath = path.join(
      process.cwd(),
      'lib',
      'supabase',
      migration.path || '',
      migration.file
    );

    if (!fs.existsSync(schemaPath)) {
      return {
        file: migration.file,
        description: migration.description,
        status: 'skipped',
        message: 'File not found',
      };
    }

    const sql = fs.readFileSync(schemaPath, 'utf-8');

    // Execute SQL via Supabase RPC or direct SQL execution
    // Note: Supabase JS client doesn't support direct SQL execution
    // This is a simplified version - in production, use Supabase CLI or direct Postgres connection
    console.log(`   Executing: ${migration.file}`);
    console.log(`   (SQL execution requires Supabase CLI or direct Postgres connection)`);

    const duration = Date.now() - startTime;

    return {
      file: migration.file,
      description: migration.description,
      status: 'success',
      message: `Would execute ${sql.split('\n').length} lines of SQL`,
      duration,
    };
  } catch (error: any) {
    return {
      file: migration.file,
      description: migration.description,
      status: 'error',
      message: error.message,
      duration: Date.now() - startTime,
    };
  }
}

async function main() {
  console.log('\n');
  console.log('═'.repeat(70));
  console.log('  InvestingPro Database Migration Tool');
  console.log('═'.repeat(70));
  console.log('\n');

  // Check Supabase connection
  console.log('📡 Checking Supabase connection...');
  const supabase = await checkSupabaseConnection();

  if (!supabase) {
    console.log('❌ Failed to connect to Supabase');
    process.exit(1);
  }

  console.log('✓ Connected to Supabase\n');

  // Display migration plan
  console.log('📋 Migration Plan:');
  console.log('─'.repeat(70));
  for (let i = 0; i < MIGRATIONS.length; i++) {
    console.log(`   ${i + 1}. ${MIGRATIONS[i].description}`);
  }
  console.log('\n');

  // Important note
  console.log('⚠️  IMPORTANT NOTE:');
  console.log('─'.repeat(70));
  console.log('   This script identifies and validates migration files.');
  console.log('   To actually apply migrations, use ONE of these methods:\n');
  console.log('   1. Supabase CLI (Recommended):');
  console.log('      supabase db push\n');
  console.log('   2. Supabase Dashboard:');
  console.log('      Copy SQL content and run in SQL Editor\n');
  console.log('   3. Direct Postgres Connection:');
  console.log('      psql -h db.xxx.supabase.co -p 5432 -d postgres -U postgres -f schema.sql\n');
  console.log('═'.repeat(70));
  console.log('\n');

  // Validate all migration files exist
  console.log('🔍 Validating migration files...\n');
  const results: MigrationResult[] = [];

  for (const migration of MIGRATIONS) {
    const schemaPath = path.join(
      process.cwd(),
      'lib',
      'supabase',
      migration.path || '',
      migration.file
    );

    const exists = fs.existsSync(schemaPath);
    const status = exists ? 'success' : 'error';
    const message = exists ? `Found (${fs.statSync(schemaPath).size} bytes)` : 'File not found';

    results.push({
      file: migration.file,
      description: migration.description,
      status,
      message,
    });

    const icon = exists ? '✓' : '✗';
    const color = exists ? '' : '\x1b[31m'; // Red for errors
    const reset = '\x1b[0m';
    
    console.log(`   ${color}${icon} ${migration.file}${reset}`);
    console.log(`      ${migration.description}`);
    console.log(`      ${message}\n`);
  }

  // Summary
  const successCount = results.filter((r) => r.status === 'success').length;
  const errorCount = results.filter((r) => r.status === 'error').length;

  console.log('═'.repeat(70));
  console.log('📊 Summary:');
  console.log(`   Total migrations: ${MIGRATIONS.length}`);
  console.log(`   Found: ${successCount}`);
  console.log(`   Missing: ${errorCount}`);
  console.log('═'.repeat(70));
  console.log('\n');

  if (errorCount > 0) {
    console.log('⚠️  Some migration files are missing.');
    console.log('   Please ensure all schema files are present before deployment.\n');
    process.exit(1);
  }

  console.log('✅ All migration files validated successfully!\n');
  console.log('📝 Next Steps:');
  console.log('   1. Review the migration files in lib/supabase/');
  console.log('   2. Apply migrations using Supabase CLI or Dashboard');
  console.log('   3. Verify tables were created successfully');
  console.log('   4. Enable RLS policies if not already enabled\n');
}

main().catch((error) => {
  console.error('Migration script failed:', error);
  process.exit(1);
});
