/**
 * Auto Infographic Integration
 * Automatically generates and attaches infographics to articles
 * 
 * This creates shareable visual content that attracts backlinks
 */

import { generateInfographic, type InfographicGenerationResult } from '@/lib/automation/infographic-generator';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

// =============================================================================
// TYPES
// =============================================================================

export interface ArticleInfographicConfig {
  articleId: string;
  articleTitle: string;
  articleContent: string;
  category: string;
  generateTypes: InfographicType[];
  platforms: InfographicPlatform[];
}

export type InfographicType = 
  | 'comparison'      // Product comparisons
  | 'timeline'        // Historical data
  | 'process'         // Step-by-step guides
  | 'statistics'      // Key numbers/stats
  | 'data-visualization' // Charts and graphs
  | 'flowchart';      // Decision trees

export type InfographicPlatform = 'article' | 'social' | 'newsletter';

export interface GeneratedInfographic {
  type: InfographicType;
  platform: InfographicPlatform;
  url: string;
  alt: string;
  width: number;
  height: number;
  dataPoints: any[];
}

// =============================================================================
// CONTENT ANALYSIS
// =============================================================================

/**
 * Analyze article content to determine best infographic types
 */
export function analyzeContentForInfographics(
  content: string,
  category: string
): InfographicType[] {
  const types: InfographicType[] = [];
  const contentLower = content.toLowerCase();

  // Check for comparison content
  if (
    contentLower.includes(' vs ') ||
    contentLower.includes('compare') ||
    contentLower.includes('comparison') ||
    contentLower.includes('better than') ||
    contentLower.includes('versus')
  ) {
    types.push('comparison');
  }

  // Check for timeline/historical content
  if (
    contentLower.includes('history') ||
    contentLower.includes('timeline') ||
    contentLower.includes('over the years') ||
    contentLower.includes('evolution') ||
    /\d{4}/.test(content) // Contains years
  ) {
    types.push('timeline');
  }

  // Check for process/step content
  if (
    contentLower.includes('how to') ||
    contentLower.includes('step') ||
    contentLower.includes('guide') ||
    contentLower.includes('process') ||
    /step\s*\d+/i.test(content)
  ) {
    types.push('process');
  }

  // Check for statistics
  if (
    contentLower.includes('statistics') ||
    contentLower.includes('data shows') ||
    contentLower.includes('according to') ||
    contentLower.includes('survey') ||
    contentLower.includes('research') ||
    /\d+%/.test(content) // Contains percentages
  ) {
    types.push('statistics');
  }

  // Check for numerical data that could be visualized
  const numberMatches = content.match(/₹[\d,]+|\d+\.\d+%|\d+%/g);
  if (numberMatches && numberMatches.length >= 3) {
    types.push('data-visualization');
  }

  // Check for decision-making content
  if (
    contentLower.includes('should you') ||
    contentLower.includes('which is better') ||
    contentLower.includes('choose between') ||
    contentLower.includes('decision')
  ) {
    types.push('flowchart');
  }

  // Category-specific defaults
  if (types.length === 0) {
    switch (category.toLowerCase()) {
      case 'credit-cards':
      case 'mutual-funds':
      case 'insurance':
        types.push('comparison');
        break;
      case 'tax':
        types.push('process', 'statistics');
        break;
      case 'loans':
        types.push('comparison', 'process');
        break;
      default:
        types.push('statistics');
    }
  }

  return types;
}

/**
 * Extract data points from article for infographic
 */
export function extractDataPoints(content: string): { label: string; value: string }[] {
  const dataPoints: { label: string; value: string }[] = [];

  // Extract percentage values with context
  const percentRegex = /([A-Za-z\s]+?):\s*(\d+\.?\d*%)/g;
  let match;
  while ((match = percentRegex.exec(content)) !== null) {
    dataPoints.push({ label: match[1].trim(), value: match[2] });
  }

  // Extract currency values with context
  const currencyRegex = /([A-Za-z\s]+?):\s*(₹[\d,]+)/g;
  while ((match = currencyRegex.exec(content)) !== null) {
    dataPoints.push({ label: match[1].trim(), value: match[2] });
  }

  // Extract numbered lists
  const listRegex = /(\d+)\.\s+([^.\n]+)/g;
  let count = 0;
  while ((match = listRegex.exec(content)) !== null && count < 10) {
    dataPoints.push({ label: `Step ${match[1]}`, value: match[2].trim() });
    count++;
  }

  return dataPoints.slice(0, 10); // Limit to 10 data points
}

// =============================================================================
// INFOGRAPHIC GENERATION
// =============================================================================

/**
 * Generate infographics for an article
 */
export async function generateArticleInfographics(
  config: ArticleInfographicConfig
): Promise<GeneratedInfographic[]> {
  const { articleId, articleTitle, articleContent, category, generateTypes, platforms } = config;
  
  logger.info('Generating article infographics', { articleId, types: generateTypes });
  
  const generated: GeneratedInfographic[] = [];

  for (const type of generateTypes) {
    for (const platform of platforms) {
      try {
        // Extract relevant data points
        const dataPoints = extractDataPoints(articleContent);

        // Generate infographic
        const result = await generateInfographic({
          articleTitle,
          articleContent,
          category,
          infographicType: type,
          targetPlatform: platform,
          dataPoints,
        });

        if (result.infographicUrl) {
          generated.push({
            type,
            platform,
            url: result.infographicUrl,
            alt: `${articleTitle} - ${type} infographic`,
            width: platform === 'social' ? 1200 : 800,
            height: platform === 'social' ? 630 : 600,
            dataPoints,
          });
        }
      } catch (error) {
        logger.error('Failed to generate infographic', { 
          articleId, 
          type, 
          platform, 
          error 
        });
      }
    }
  }

  // Save generated infographics to database
  if (generated.length > 0) {
    await saveArticleInfographics(articleId, generated);
  }

  return generated;
}

/**
 * Save infographics to database
 */
async function saveArticleInfographics(
  articleId: string,
  infographics: GeneratedInfographic[]
): Promise<void> {
  try {
    const supabase = await createClient();

    for (const infographic of infographics) {
      await supabase
        .from('article_infographics')
        .upsert({
          article_id: articleId,
          type: infographic.type,
          platform: infographic.platform,
          url: infographic.url,
          alt_text: infographic.alt,
          width: infographic.width,
          height: infographic.height,
          data_points: infographic.dataPoints,
          created_at: new Date().toISOString(),
        }, {
          onConflict: 'article_id,type,platform',
        });
    }

    logger.info('Saved article infographics', { articleId, count: infographics.length });
  } catch (error) {
    logger.error('Failed to save infographics', { articleId, error });
  }
}

/**
 * Get infographics for an article
 */
export async function getArticleInfographics(
  articleId: string
): Promise<GeneratedInfographic[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('article_infographics')
      .select('*')
      .eq('article_id', articleId);

    if (error) throw error;

    return (data || []).map((row: any) => ({
      type: row.type,
      platform: row.platform,
      url: row.url,
      alt: row.alt_text,
      width: row.width,
      height: row.height,
      dataPoints: row.data_points || [],
    }));
  } catch (error) {
    logger.error('Failed to get infographics', { articleId, error });
    return [];
  }
}

// =============================================================================
// AUTO-GENERATION HOOK
// =============================================================================

/**
 * Auto-generate infographics when article is published
 * Can be called from article publish workflow
 */
export async function onArticlePublished(
  articleId: string,
  articleTitle: string,
  articleContent: string,
  category: string
): Promise<void> {
  // Analyze content to determine best infographic types
  const types = analyzeContentForInfographics(articleContent, category);
  
  if (types.length === 0) {
    logger.info('No suitable infographic types for article', { articleId });
    return;
  }

  // Generate for article and social
  await generateArticleInfographics({
    articleId,
    articleTitle,
    articleContent,
    category,
    generateTypes: types.slice(0, 2), // Limit to 2 types per article
    platforms: ['article', 'social'],
  });
}

/**
 * Batch generate infographics for existing articles
 */
export async function batchGenerateInfographics(
  articleIds: string[]
): Promise<{ success: number; failed: number }> {
  const supabase = await createClient();
  let success = 0;
  let failed = 0;

  for (const articleId of articleIds) {
    try {
      // Fetch article
      const { data: article, error } = await supabase
        .from('articles')
        .select('id, title, content, category_id, categories(name)')
        .eq('id', articleId)
        .single();

      if (error || !article) {
        failed++;
        continue;
      }

      await onArticlePublished(
        article.id,
        article.title,
        article.content,
        (article as any).categories?.name || 'general'
      );
      success++;
    } catch (error) {
      logger.error('Batch infographic generation failed', { articleId, error });
      failed++;
    }
  }

  return { success, failed };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  analyzeContentForInfographics,
  extractDataPoints,
  generateArticleInfographics,
  getArticleInfographics,
  onArticlePublished,
  batchGenerateInfographics,
};
