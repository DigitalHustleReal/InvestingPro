import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { testScorer, scoreContent } from '../lib/quality/content-scorer';
import { createServiceClient } from '../lib/supabase/service';

async function testWithRealArticles() {
  console.log('🧪 TESTING QUALITY SCORER WITH REAL ARTICLES\n');
  
  // First run the basic test
  testScorer();
  
  // Now test with real articles from database
  const supabase = createServiceClient();
  
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, content, meta_description')
    .limit(3);
  
  if (!articles || articles.length === 0) {
    console.log('No articles found in database to test.');
    return;
  }
  
  console.log(`\n📝 TESTING WITH ${articles.length} REAL ARTICLES:\n`);
  console.log('='.repeat(60));
  
  for (const article of articles) {
    const score = scoreContent(
      article.title,
      article.content || '',
      article.meta_description || undefined
    );
    
    console.log(`\n📄 Article: ${article.title}`);
    console.log(`   Overall: ${score.overall}/100 ${score.canPublish ? '✅' : '❌'}`);
    console.log(`   Breakdown: R:${score.readability} | S:${score.seo} | St:${score.structure}`);
    
    if (score.recommendations.length > 0) {
      console.log(`   Issues:`);
      score.recommendations.slice(0, 3).forEach(rec => {
        console.log(`     • ${rec}`);
      });
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Quality Scorer Test Complete!\n');
}

testWithRealArticles().catch(console.error);
