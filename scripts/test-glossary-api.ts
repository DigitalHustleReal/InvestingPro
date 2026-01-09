/**
 * Quick test to verify glossary data is accessible
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testGlossaryAPI() {
  console.log('🔍 Testing Glossary API...\n');

  const { data, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .order('term', { ascending: true })
    .limit(3);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`✅ Found ${data?.length} terms\n`);

  data?.forEach((term, i) => {
    console.log(`Term ${i + 1}: ${term.term}`);
    console.log(`  Category: ${term.category}`);
    console.log(`  Has why_it_matters: ${!!term.why_it_matters}`);
    console.log(`  Has example_numeric: ${!!term.example_numeric}`);
    console.log(`  Has related_calculators: ${!!term.related_calculators}`);
    console.log(`  Slug in DB: ${term.slug || 'NO SLUG COLUMN'}`);
    
    // Generate slug like the page does
    const generatedSlug = term.term.toLowerCase()
      .replace(/[()]/g, '')
      .replace(/\s+/g, '-')
      .replace(/&/g, 'and');
    console.log(`  Generated slug: ${generatedSlug}`);
    console.log('');
  });
}

testGlossaryAPI()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
