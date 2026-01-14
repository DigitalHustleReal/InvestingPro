/**
 * Content Scoring System
 * 
 * Scores articles based on SEO, intent match, monetization potential, and quality.
 * Used to identify underperforming content for cleanup or optimization.
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import { articleService } from '@/lib/cms/article-service';

export interface ContentScore {
  seoScore: number;        // 0-100
  intentMatch: number;     // 0-100
  monetizationScore: number; // 0-100
  qualityScore: number;    // 0-100
  overallScore: number;    // weighted average
}

export interface LowPerformingArticle {
  articleId: string;
  articleTitle: string;
  overallScore: number;
  pageViews: number;
  lastUpdated: string;
}

class ContentScorer {
  private supabase = createClient();

  /**
   * Calculate SEO score based on article metadata
   */
  private calculateSEOScore(article: any): number {
    let score = 0;
    
    // Title length (50-60 chars is optimal)
    const titleLength = article.title?.length || 0;
    if (titleLength >= 50 && titleLength <= 60) {
      score += 25;
    } else if (titleLength >= 40 && titleLength <= 70) {
      score += 15;
    } else if (titleLength > 0) {
      score += 5;
    }
    
    // Meta description (150-160 chars is optimal)
    const metaLength = article.seo_description?.length || 0;
    if (metaLength >= 150 && metaLength <= 160) {
      score += 25;
    } else if (metaLength >= 120 && metaLength <= 180) {
      score += 15;
    } else if (metaLength > 0) {
      score += 5;
    }
    
    // Has featured image
    if (article.featured_image) {
      score += 20;
    }
    
    // Content length (1500+ words is good)
    const wordCount = article.body_markdown?.split(/\s+/).length || 0;
    if (wordCount >= 1500) {
      score += 30;
    } else if (wordCount >= 1000) {
      score += 20;
    } else if (wordCount >= 500) {
      score += 10;
    }
    
    return Math.min(100, score);
  }

  /**
   * Calculate intent match score
   */
  private calculateIntentScore(article: any): number {
    if (!article.user_intent) return 50; // Neutral score if not classified
    
    let score = 50; // Base score
    
    // Has target keywords
    if (article.target_keywords && article.target_keywords.length > 0) {
      score += 25;
    }
    
    // Keyword density is tracked
    if (article.keyword_density && Object.keys(article.keyword_density).length > 0) {
      score += 25;
    }
    
    return score;
  }

  /**
   * Calculate monetization score
   */
  private calculateMonetizationScore(article: any): number {
    let score = 0;
    
    // Has category (indicates targeting)
    if (article.category) {
      score += 20;
    }
    
    // Has tags (indicates topic coverage)
    if (article.tags && article.tags.length > 0) {
      score += 20;
    }
    
    // Commercial intent articles score higher
    if (article.user_intent === 'commercial' || article.user_intent === 'transactional') {
      score += 30;
    } else if (article.user_intent === 'navigational') {
      score += 20;
    } else {
      score += 10;
    }
    
    // Has structured content (product comparisons, etc.)
    if (article.structured_content) {
      score += 30;
    }
    
    return Math.min(100, score);
  }

  /**
   * Score an article
   */
  async scoreArticle(articleId: string): Promise<ContentScore> {
    try {
      const article = await articleService.getById(articleId);
      if (!article) {
        throw new Error('Article not found');
      }

      const seoScore = this.calculateSEOScore(article);
      const intentScore = this.calculateIntentScore(article);
      const monetizationScore = this.calculateMonetizationScore(article);
      const qualityScore = article.quality_score || 0;

      // Weighted average: SEO 30%, Intent 20%, Monetization 30%, Quality 20%
      const overallScore = 
        (seoScore * 0.3) + 
        (intentScore * 0.2) + 
        (monetizationScore * 0.3) + 
        (qualityScore * 0.2);

      // Save to database
      await this.supabase.rpc('update_content_score', {
        p_article_id: articleId,
        p_seo_score: seoScore,
        p_intent_match: intentScore,
        p_monetization_score: monetizationScore,
        p_quality_score: qualityScore,
      });

      return {
        seoScore,
        intentMatch: intentScore,
        monetizationScore,
        qualityScore,
        overallScore,
      };
    } catch (error) {
      logger.error('Failed to score article', error as Error, { articleId });
      throw error;
    }
  }

  /**
   * Score all published articles
   */
  async scoreAllArticles(): Promise<void> {
    try {
      const articles = await articleService.listPublishedArticles();
      
      logger.info('Starting content scoring', { count: articles.length });
      
      for (const article of articles) {
        try {
          await this.scoreArticle(article.id!);
        } catch (error) {
          logger.warn('Failed to score article', { articleId: article.id, error: (error as Error).message });
        }
      }
      
      logger.info('Content scoring complete', { count: articles.length });
    } catch (error) {
      logger.error('Failed to score all articles', error as Error);
      throw error;
    }
  }

  /**
   * Get low-performing articles
   */
  async getLowPerformingArticles(
    scoreThreshold: number = 40,
    daysBack: number = 30,
    limit: number = 50
  ): Promise<LowPerformingArticle[]> {
    try {
      const { data, error } = await this.supabase.rpc('get_low_performing_content', {
        score_threshold: scoreThreshold,
        days_back: daysBack,
        limit_count: limit,
      });

      if (error) throw error;
      if (!data) return [];

      return data.map((article: any) => ({
        articleId: article.article_id,
        articleTitle: article.article_title,
        overallScore: parseFloat(article.overall_score),
        pageViews: parseInt(article.page_views),
        lastUpdated: article.last_updated,
      }));
    } catch (error) {
      logger.error('Failed to get low-performing articles', error as Error);
      return [];
    }
  }
}

export const contentScorer = new ContentScorer();
