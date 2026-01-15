/**
 * Automated Content Generation Cron Job
 * 
 * Runs continuously in the background to generate articles
 * Schedule: Every 2.4 hours (10 articles per day)
 * 
 * This ensures you wake up to fresh content every morning!
 */

import { inngest } from '../inngest-client';
import { createClient } from '@/lib/supabase/server';

export const autoContentGenerator = inngest.createFunction(
  {
    id: 'auto-content-generator',
    name: 'Automated Content Generator',
    // Run every 2.4 hours (10 times per day)
    // This gives you 10 articles per day automatically
    cron: '0 */2 * * *', // Every 2 hours (12 times/day, but we'll limit to 10)
  },
  { event: 'cron/auto.content.generate' },
  async ({ event, step }) => {
    console.log('🤖 Auto Content Generator Started');

    // Step 1: Check how many articles generated today
    const articlesGeneratedToday = await step.run('check-daily-count', async () => {
      const supabase = createClient();
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
      const supabase = createClient();
      
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
      const supabase = createClient();
      
      // Import the article generator
      const { generateArticle } = await import('@/lib/automation/article-generator');

      try {
        const result = await generateArticle({
          category: contentPlan.category,
          contentType: contentPlan.articleType,
          provider: 'openai', // Use OpenAI for quality
          autoPublish: false, // Don't auto-publish, keep as draft for review
        });

        console.log(`✅ Article generated: ${result.title}`);
        
        return {
          success: true,
          articleId: result.id,
          title: result.title,
          category: contentPlan.category,
        };
      } catch (error) {
        console.error('❌ Article generation failed:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    // Step 4: Log the result
    await step.run('log-result', async () => {
      const supabase = createClient();
      
      await supabase.from('generation_logs').insert({
        job_type: 'auto_content_generator',
        status: article.success ? 'success' : 'failed',
        metadata: {
          articleId: article.articleId,
          title: article.title,
          category: article.category,
          error: article.error,
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
      error: article.error,
    };
  }
);
