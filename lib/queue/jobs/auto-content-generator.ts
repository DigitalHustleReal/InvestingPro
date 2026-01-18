/**
 * Automated Content Generation Cron Job
 * 
 * Runs continuously in the background to generate articles
 * Schedule: Every 2 hours (10 articles per day max)
 * 
 * This ensures you wake up to fresh content every morning!
 */

import { inngest } from '../inngest-client';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for cron jobs (not server-only)
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase credentials not found');
  }
  
  return createClient(url, key);
}

export const autoContentGenerator = inngest.createFunction(
  {
    id: 'auto-content-generator',
    name: 'Automated Content Generator',
  },
  { cron: '0 */2 * * *' }, // Every 2 hours
  async ({ event, step }) => {
    console.log('🤖 Auto Content Generator Started');

    // Step 1: Check how many articles generated today
    const articlesGeneratedToday = await step.run('check-daily-count', async () => {
      const supabase = getSupabaseClient();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      console.log(`📊 Articles generated today: ${count || 0}`);
      return count || 0;
    });

    // Limit to 10 articles per day
    if (articlesGeneratedToday >= 10) {
      console.log('✅ Daily quota reached (10 articles). Skipping this run.');
      return { 
        success: true, 
        message: 'Daily quota reached',
        articlesGenerated: 0,
        totalToday: articlesGeneratedToday
      };
    }

    // Step 2: Determine what to generate
    const contentPlan = await step.run('plan-content', async () => {
      const supabase = getSupabaseClient();
      
      // Get categories that need content
      const { data: categories } = await supabase
        .from('categories')
        .select('slug, name')
        .in('slug', ['credit-cards', 'mutual-funds', 'loans', 'insurance', 'tax-planning']);

      // Rotate through categories
      const categoryIndex = articlesGeneratedToday % (categories?.length || 5);
      const selectedCategory = categories?.[categoryIndex] || { slug: 'credit-cards', name: 'Credit Cards' };

      console.log(`📝 Selected category: ${selectedCategory.name}`);

      return {
        category: selectedCategory.slug,
        categoryName: selectedCategory.name,
        articleType: articlesGeneratedToday % 3 === 0 ? 'pillar' : 'article', // Every 3rd is a pillar page
      };
    });

    // Step 3: Generate the article
    const article = await step.run('generate-article', async () => {
      // Import the article generator
      const { generateArticleCore } = await import('@/lib/automation/article-generator');

      try {
        // Generate article using the comprehensive pipeline
        const result = await generateArticleCore(
          `Best ${contentPlan.categoryName} for 2026`, // Topic based on category
          (msg: string) => console.log(msg), // Log function
          { dryRun: false } // Options
        );

        if (result.success && result.article) {
          console.log(`✅ Article generated: ${result.article.title}`);
          
          return {
            success: true as const,
            articleId: result.article.id || null,
            title: result.article.title || 'Untitled',
            category: contentPlan.category,
          };
        } else {
          return {
            success: false as const,
            error: result.error || 'Article generation failed',
          };
        }
      } catch (error) {
        console.error('❌ Article generation failed:', error);
        return {
          success: false as const,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    // Step 4: Log the result
    await step.run('log-result', async () => {
      const supabase = getSupabaseClient();
      
      await supabase.from('generation_logs').insert({
        job_type: 'auto_content_generator',
        status: article.success ? 'success' : 'failed',
        metadata: {
          articleId: article.success ? article.articleId : null,
          title: article.success ? article.title : null,
          category: article.success ? article.category : null,
          error: !article.success ? article.error : null,
          dailyCount: articlesGeneratedToday + 1,
        },
      });
    });

    console.log('🎉 Auto Content Generator Completed');

    return {
      success: article.success,
      articlesGenerated: article.success ? 1 : 0,
      totalToday: articlesGeneratedToday + (article.success ? 1 : 0),
      article: article.success ? {
        id: article.articleId,
        title: article.title,
        category: article.category,
      } : null,
      error: !article.success ? article.error : undefined,
    };
  }
);
