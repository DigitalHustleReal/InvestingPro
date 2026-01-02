
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkRecentArticles() {
  console.log('🔍 Checking recent articles...');

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, status, created_at, quality_score, category, featured_image, image_alt_text')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('❌ Error fetching articles:', error.message);
    return;
  }

  if (!articles || articles.length === 0) {
    console.log('⚠️ No articles found.');
    return;
  }

  console.log(`✅ Found ${articles.length} most recent articles:`);
  articles.forEach(a => {
    console.log(`\n---------------------------------------------------`);
    console.log(`📄 [${a.status.toUpperCase()}] ${a.title}`);
    console.log(`   📅 Created: ${new Date(a.created_at).toLocaleString()}`);
    console.log(`   🏆 Quality Score: ${a.quality_score ?? 'N/A'}/100`);
    console.log(`   🖼️ Image: ${a.featured_image || 'None'}`);
    console.log(`      Alt: ${a.image_alt_text || 'None'}`);
    console.log(`   📂 Category: ${a.category}`);
    
    // Check if Unsplash
    if (a.featured_image && a.featured_image.includes('unsplash')) {
        console.log(`   ✨ SOURCE: Unsplash (Verified)`);
    } else if (a.featured_image && a.featured_image.includes('pexels')) {
        console.log(`   ✨ SOURCE: Pexels (Verified)`);
    }
  });
}

checkRecentArticles();
