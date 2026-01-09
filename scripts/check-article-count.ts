import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkArticleCount() {
  console.log('📊 Checking Article Count...\n');

  try {
    // Get total articles
    const { count: totalCount, error: totalError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // Get published articles
    const { count: publishedCount, error: publishedError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    if (publishedError) throw publishedError;

    // Get draft articles
    const { count: draftCount, error: draftError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft');

    if (draftError) throw draftError;

    // Get sample articles
    const { data: sampleArticles, error: sampleError } = await supabase
      .from('articles')
      .select('title, status, published_date, category')
      .order('created_at', { ascending: false })
      .limit(5);

    if (sampleError) throw sampleError;

    // Display results
    console.log('📈 ARTICLE COUNT SUMMARY:');
    console.log('========================');
    console.log(`Total Articles:     ${totalCount || 0}`);
    console.log(`Published Articles: ${publishedCount || 0} ✅`);
    console.log(`Draft Articles:     ${draftCount || 0} 📝`);
    console.log('');

    // MVL Gap Analysis
    const MVL_TARGET = 60;
    const gap = MVL_TARGET - (publishedCount || 0);
    
    console.log('🎯 MVL GAP ANALYSIS:');
    console.log('===================');
    console.log(`Target for MVL:     ${MVL_TARGET} articles`);
    console.log(`Current Published:  ${publishedCount || 0} articles`);
    console.log(`Gap to MVL:         ${gap > 0 ? gap : 0} articles ${gap > 0 ? '🔴' : '✅'}`);
    console.log('');

    if (sampleArticles && sampleArticles.length > 0) {
      console.log('📄 RECENT ARTICLES:');
      console.log('==================');
      sampleArticles.forEach((article, i) => {
        console.log(`${i + 1}. ${article.title}`);
        console.log(`   Status: ${article.status} | Category: ${article.category || 'N/A'}`);
        console.log(`   Published: ${article.published_date || 'Not published'}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No articles found in database');
      console.log('');
    }

    // Recommendations
    console.log('💡 RECOMMENDATIONS:');
    console.log('==================');
    if ((publishedCount || 0) < MVL_TARGET) {
      console.log(`🔴 CRITICAL: Need ${gap} more articles to reach MVL`);
      console.log('   → Run: npx tsx scripts/master-content-generation.ts');
      console.log(`   → Generate ${Math.min(10, gap)} articles per day for ${Math.ceil(gap / 10)} days`);
    } else {
      console.log('✅ MVL article target met!');
      console.log('   → Focus on Phase 2 content (50 more articles)');
    }

  } catch (error) {
    console.error('❌ Error checking articles:', error);
    process.exit(1);
  }
}

checkArticleCount();
