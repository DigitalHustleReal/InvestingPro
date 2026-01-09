/**
 * Seed Initial Content
 * 
 * Generates and publishes 1 article for each category using the AI Content Factory.
 * Run: npx ts-node --project tsconfig.scripts.json scripts/seed-content.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { aiService } from '../lib/ai-service';
import { CATEGORY_CONFIGS } from '../lib/content/content-schema';
import { getAuthorForCategory } from '../lib/content/author-personas';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
}

async function seedContent() {
  console.log('🌱 Starting Content Seeding...\n');

  for (const [categoryKey, config] of Object.entries(CATEGORY_CONFIGS)) {
    console.log(`\n--- Processing Category: ${config.displayName} ---`);
    
    // Pick the first topic
    const topic = config.keyTopics[0];
    const keywords = [topic, 'guide', 'india', '2024'];
    
    console.log(`🤖 Generating article for: "${topic}"...`);
    
    try {
      // Generate content using AI
      const articleData = await aiService.generateArticle(topic, keywords, categoryKey);
      
      // Get author
      const author = getAuthorForCategory(categoryKey as any);
      
      // Prepare DB record
      const record = {
        title: articleData.title,
        slug: slugify(articleData.title),
        excerpt: articleData.meta_description,
        content: articleData.content,
        category: categoryKey,
        status: 'published',
        author_name: author.name,
        // formatted for Supabase timestamptz
        published_at: new Date().toISOString(),
        featured_image: `/images/categories/${categoryKey}.jpg`, // Placeholder
        views: Math.floor(Math.random() * 1000) + 100,
        read_time: Math.ceil(articleData.content.length / 1000), // Approx 200 words/min
        tags: keywords
      };

      console.log(`💾 Saving "${record.title}" to database...`);
      
      const { error } = await supabase
        .from('articles')
        .upsert(record, { onConflict: 'slug' });
        
      if (error) {
        console.error('❌ Error saving article:', error.message);
      } else {
        console.log('✅ Published successfully!');
      }
      
    } catch (err: any) {
      console.error('❌ Failed to generate/save:', err.message);
    }
    
    // Wait a bit to avoid rate limits
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n✨ Seeding complete!');
}

// Run if called directly
if (require.main === module) {
  seedContent()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
