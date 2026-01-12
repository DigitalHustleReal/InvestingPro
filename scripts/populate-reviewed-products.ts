import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createServiceClient } from '../lib/supabase/service';
import { scrapeMouthShutReviews } from './scrape-mouthshut-reviews';
import { ReviewModerator } from '../lib/moderation/review-moderator';

const supabase = createServiceClient();

async function populateReviews(limitProducts: number = 5) {
  console.log('\n' + '═'.repeat(70));
  console.log('🚀 BATCH REVIEW SCRAPER & MODERATOR');
  console.log('═'.repeat(70));

  // 1. Get products that need reviews
  // We'll focus on credit cards for now
  const { data: cards, error } = await supabase
    .from('credit_cards')
    .select('id, name, slug')
    .eq('name', 'HDFC Regalia First')
    .limit(1);

  if (error) {
    console.error('❌ Error fetching cards:', error);
    return;
  }

  console.log(`📊 Processing ${cards.length} products...\n`);

  for (const card of cards) {
    console.log(`\n🔎 [${card.name}]`);
    console.log('─'.repeat(50));

    try {
      // 2. Scrape raw reviews
      const rawReviews = await scrapeMouthShutReviews(card.name, 5);
      
      if (rawReviews.length === 0) {
        console.log('   ⚠️ No reviews found.');
        continue;
      }

      // 3. Moderate and sort with AI
      console.log(`   🤖 Moderating ${rawReviews.length} reviews...`);
      const moderatedReviews = await ReviewModerator.moderateBatch(rawReviews);
      
      console.log(`   ✅ ${moderatedReviews.length} reviews passed moderation.`);

      // 4. Save to database
      for (const review of moderatedReviews) {
        const { error: insertError } = await supabase
          .from('reviews')
          .insert({
            product_slug: card.slug,
            product_type: 'credit_card',
            user_id: '00000000-0000-0000-0000-000000000000', // System/Placeholder UID
            rating: review.rating,
            title: review.title,
            content: review.moderatedContent,
            is_verified_purchase: false,
            helpful_count: Math.floor(Math.random() * 10),
            category: review.category,
            pros: review.pros,
            cons: review.cons
          });

        if (insertError) {
          console.error(`   ❌ Failed to save review: ${insertError.message}`);
        }
      }
      
      console.log(`   ✨ Saved reviews for ${card.name}`);

    } catch (err) {
      console.error(`   ❌ Error processing ${card.name}:`, err);
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log('✅ BATCH PROCESSING COMPLETE');
  console.log('═'.repeat(70) + '\n');
}

// Parse args
const args = process.argv.slice(2);
const limit = parseInt(args[0] || '5');

populateReviews(limit).catch(console.error);
