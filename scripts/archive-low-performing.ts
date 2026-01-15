/**
 * Archive Low-Performing Content
 * Identifies and archives articles with low scores and low traffic
 * 
 * Usage: npx tsx scripts/archive-low-performing.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SCORE_THRESHOLD = 40; // Archive articles with score < 40
const DAYS_BACK = 30; // Look at last 30 days of traffic
const PROTECTED_CATEGORIES = ['credit-cards', 'mutual-funds']; // Don't archive these

async function archiveLowPerformingContent() {
  console.log('🗑️  Starting low-performing content cleanup...\n');

  // Get low-performing articles using the database function
  const { data: lowPerformers, error } = await supabase.rpc(
    'get_low_performing_content',
    {
      score_threshold: SCORE_THRESHOLD,
      days_back: DAYS_BACK,
      limit_count: 100,
    }
  );

  if (error) {
    console.error('❌ Error fetching low performers:', error);
    return;
  }

  if (!lowPerformers || lowPerformers.length === 0) {
    console.log('✅ No low-performing content found!');
    return;
  }

  console.log(`📊 Found ${lowPerformers.length} low-performing articles\n`);

  let archived = 0;
  let skipped = 0;
  let errors = 0;

  for (const article of lowPerformers) {
    try {
      // Get full article details to check category
      const { data: fullArticle, error: fetchError } = await supabase
        .from('articles')
        .select('id, title, category, slug')
        .eq('id', article.article_id)
        .single();

      if (fetchError || !fullArticle) {
        console.error(`  ❌ Error fetching article details`);
        errors++;
        continue;
      }

      // Skip protected categories
      if (PROTECTED_CATEGORIES.includes(fullArticle.category)) {
        console.log(`  ⏭️  Skipped (protected): ${fullArticle.title}`);
        skipped++;
        continue;
      }

      console.log(`  📦 Archiving: ${fullArticle.title}`);
      console.log(`     Score: ${article.overall_score} | Views: ${article.page_views}`);

      // Archive the article (change status to 'archived')
      const { error: archiveError } = await supabase
        .from('articles')
        .update({ status: 'archived' })
        .eq('id', article.article_id);

      if (archiveError) {
        console.error(`  ❌ Error archiving: ${archiveError.message}`);
        errors++;
        continue;
      }

      console.log(`  ✅ Archived successfully`);
      archived++;

    } catch (err) {
      console.error(`  ❌ Error processing article:`, err);
      errors++;
    }
  }

  console.log('\n📈 Cleanup Complete!');
  console.log(`  ✅ Archived: ${archived} articles`);
  console.log(`  ⏭️  Skipped: ${skipped} articles (protected categories)`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log(`  📊 Total Processed: ${archived + skipped + errors}/${lowPerformers.length}`);
}

// Run the script
archiveLowPerformingContent()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
