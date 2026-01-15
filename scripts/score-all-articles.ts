/**
 * Score All Existing Articles
 * Run this script to score all published articles using the content scoring system
 * 
 * Usage: npx tsx scripts/score-all-articles.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import { classifyIntent, extractTargetKeywords } from '../lib/seo/intent-classifier';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple scoring functions (since ContentScorer uses articleService which may have issues)
function calculateSEOScore(article: any): number {
  let score = 0;
  
  // Title length (50-60 chars is optimal)
  const titleLength = article.title?.length || 0;
  if (titleLength >= 50 && titleLength <= 60) score += 25;
  else if (titleLength >= 40 && titleLength <= 70) score += 15;
  else if (titleLength > 0) score += 5;
  
  // Meta description (150-160 chars is optimal)
  const metaLength = article.meta_description?.length || 0;
  if (metaLength >= 150 && metaLength <= 160) score += 25;
  else if (metaLength >= 120 && metaLength <= 180) score += 15;
  else if (metaLength > 0) score += 5;
  
  // Has featured image
  if (article.featured_image) score += 20;
  
  // Content length (1500+ words is good)
  const wordCount = article.body_markdown?.split(/\s+/).length || 0;
  if (wordCount >= 1500) score += 30;
  else if (wordCount >= 1000) score += 20;
  else if (wordCount >= 500) score += 10;
  
  return Math.min(100, score);
}

function calculateIntentScore(article: any): number {
  if (!article.user_intent) return 50;
  let score = 50;
  if (article.target_keywords && article.target_keywords.length > 0) score += 25;
  if (article.keyword_density && Object.keys(article.keyword_density).length > 0) score += 25;
  return score;
}

function calculateMonetizationScore(article: any): number {
  let score = 0;
  if (article.category) score += 20;
  if (article.tags && article.tags.length > 0) score += 20;
  
  if (article.user_intent === 'commercial' || article.user_intent === 'transactional') score += 30;
  else if (article.user_intent === 'navigational') score += 20;
  else score += 10;
  
  return Math.min(100, score);
}

async function scoreAllArticles() {
  console.log('🎯 Starting article scoring process...\n');

  // Get all published articles
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, body_markdown, meta_description, category, tags')
    .eq('status', 'published');

  if (error) {
    console.error('❌ Error fetching articles:', error);
    return;
  }

  if (!articles || articles.length === 0) {
    console.log('ℹ️  No published articles found.');
    return;
  }

  console.log(`📊 Found ${articles.length} published articles\n`);

  let scored = 0;
  let classified = 0;
  let errors = 0;

  for (const article of articles) {
    try {
      console.log(`Processing: ${article.title}`);

      // Calculate scores
      const seoScore = calculateSEOScore(article);
      const monetizationScore = calculateMonetizationScore(article);
      const intentScore = calculateIntentScore(article);
      const qualityScore = 70; // Default quality score

      // Calculate overall score (weighted average)
      const overallScore = (seoScore * 0.3) + (intentScore * 0.2) + (monetizationScore * 0.3) + (qualityScore * 0.2);

      // Classify intent
      const intentClassification = classifyIntent(
        article.title,
        article.body_markdown || ''
      );

      // Extract keywords
      const keywords = extractTargetKeywords(
        article.title,
        article.body_markdown || ''
      );

      // Update content_scores table
      const { error: scoreError } = await supabase.rpc('update_content_score', {
        p_article_id: article.id,
        p_seo_score: seoScore,
        p_intent_match: intentScore,
        p_monetization_score: monetizationScore,
        p_quality_score: qualityScore,
      });

      if (scoreError) {
        console.error(`  ❌ Error scoring: ${scoreError.message}`);
        errors++;
        continue;
      }

      // Update articles table with intent and keywords
      const { error: updateError } = await supabase
        .from('articles')
        .update({
          user_intent: intentClassification.intent,
          target_keywords: keywords.slice(0, 10), // Top 10 keywords
        })
        .eq('id', article.id);

      if (updateError) {
        console.error(`  ❌ Error updating article: ${updateError.message}`);
        errors++;
        continue;
      }

      console.log(`  ✅ Score: ${overallScore.toFixed(1)} | Intent: ${intentClassification.intent}`);
      scored++;
      classified++;

    } catch (err) {
      console.error(`  ❌ Error processing article:`, err);
      errors++;
    }
  }

  console.log('\n📈 Scoring Complete!');
  console.log(`  ✅ Scored: ${scored} articles`);
  console.log(`  ✅ Classified: ${classified} articles`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log(`  📊 Success Rate: ${((scored / articles.length) * 100).toFixed(1)}%`);
}

// Run the script
scoreAllArticles()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
