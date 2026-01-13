/**
 * 🎨 AUTOMATED IMAGE GENERATION PIPELINE
 * 
 * 100% Automated Image Generation for Articles
 * 
 * PRIORITY ORDER (Cost Optimization):
 * 1. Stock Photos (FREE): Pexels, Pixabay, Unsplash
 * 2. AI Generation (PAID): DALL-E 3, Stability AI (fallback only)
 * 
 * Process:
 * 1. Search stock photo libraries for relevant images
 * 2. If no good stock images, generate with AI
 * 3. Optimize and save
 * 4. Generate alt text
 * 5. Cache for reuse
 */

import { imagePromptGenerator, ImagePromptOptions } from '@/lib/prompts/image-prompts';
import { aiImageGenerator } from '@/lib/images/ai-image-generator';
import { imageService, ImageResult as StockImageResult } from '@/lib/images/stock-image-service-enhanced';
import { generateAltText } from '@/lib/seo/alt-text-generator';
import { logger } from '@/lib/logger';

export interface ImageGenerationResult {
    featuredImage: string | null;
    featuredImageAlt: string | null;
    inArticleImages: Array<{
        url: string;
        alt: string;
        position: number; // Paragraph index
    }>;
    socialImages: {
        og: string | null;
        twitter: string | null;
        linkedin: string | null;
    };
    generationCost: number;
    cached: boolean;
}

/**
 * Generate all images for an article automatically
 */
export async function generateArticleImages(params: {
    articleTitle: string;
    category: string;
    keywords: string[];
    articleExcerpt?: string;
    articleContent?: string;
    themeContext?: {
        trendingTopic?: string;
        seasonalContext?: string;
        eventContext?: string;
    };
}): Promise<ImageGenerationResult> {
    const {
        articleTitle,
        category,
        keywords,
        articleExcerpt,
        articleContent,
        themeContext
    } = params;
    
    logger.info('Generating images for article', { articleTitle, category });
    
    let totalCost = 0;
    const result: ImageGenerationResult = {
        featuredImage: null,
        featuredImageAlt: null,
        inArticleImages: [],
        socialImages: {
            og: null,
            twitter: null,
            linkedin: null
        },
        generationCost: 0,
        cached: false
    };
    
    try {
        // 1. Generate Featured Image - TRY STOCK PHOTOS FIRST
        logger.info('Attempting to find stock photo first (FREE)...');
        
        // Build search query from article context
        const searchQuery = buildImageSearchQuery(articleTitle, category, keywords);
        
        // Try stock photo services first (FREE)
        let featuredImageUrl: string | null = null;
        let featuredImageSource: 'stock' | 'ai' = 'stock';
        
        try {
            const stockResults = await imageService.search({
                query: searchQuery,
                context: category,
                orientation: 'landscape',
                min_width: 1920,
                min_height: 1080,
                max_results: 5
            });
            
            if (stockResults && stockResults.length > 0) {
                // Use best stock photo (already scored by relevance + quality)
                const bestStock = stockResults[0];
                featuredImageUrl = bestStock.url;
                logger.info(`✅ Found relevant stock photo from ${bestStock.source}`, {
                    relevance: bestStock.relevance_score,
                    quality: bestStock.quality_score
                });
            }
        } catch (stockError) {
            logger.warn('Stock photo search failed, will use AI generation', stockError as Error);
        }
        
        // Only use AI generation if no good stock photo found
        if (!featuredImageUrl) {
            logger.info('No suitable stock photo found, generating with AI...');
            featuredImageSource = 'ai';
            
            const featuredPrompt = imagePromptGenerator.generate({
                articleTitle,
                category,
                keywords,
                articleExcerpt,
                imageType: 'featured',
                style: 'professional'
            });
            
            // Enhance with theme context if available
            const enhancedFeaturedPrompt = themeContext
                ? imagePromptGenerator.enhanceWithTheme(featuredPrompt, themeContext)
                : featuredPrompt;
            
            try {
                const featuredImageResult = await aiImageGenerator.generate({
                    prompt: enhancedFeaturedPrompt.prompt,
                    style: enhancedFeaturedPrompt.style as any,
                    size: '1792x1024' as any,
                    quality: 'hd',
                    brand_guidelines: true
                });
                
                featuredImageUrl = featuredImageResult.url;
                totalCost += featuredImageResult.cost || 0.08; // Estimate if not provided
            } catch (aiError) {
                logger.warn('AI image generation failed', aiError as Error);
            }
        }
        
        result.featuredImage = featuredImageUrl;
        // Cost already tracked above (stock = 0, AI = added)
        
        // Generate alt text for featured image
        result.featuredImageAlt = await generateAltText(
            articleTitle,
            `Featured image for article about ${keywords[0] || category}`,
            keywords[0]
        ).then(r => r.altText).catch(() => articleTitle);
        
        // 2. Generate Social Media Images (OG, Twitter, LinkedIn)
        // COST OPTIMIZATION: Reuse featured image for social (resized by platform)
        // Only generate separate if stock photo wasn't suitable for social dimensions
        result.socialImages.og = result.featuredImage; // OG uses same image
        result.socialImages.twitter = result.featuredImage;
        result.socialImages.linkedin = result.featuredImage;
        
        logger.info('Social images: Reusing featured image (cost optimization)');
        
        // 3. Generate In-Article Images (if content provided)
        // COST OPTIMIZATION: Try stock photos first for in-article images
        if (articleContent) {
            const inArticleCount = calculateInArticleImageCount(articleContent);
            
            for (let i = 0; i < inArticleCount; i++) {
                let inArticleUrl: string | null = null;
                
                // Try stock photo first
                try {
                    const searchVariation = `${keywords[i] || keywords[0] || category} ${category}`;
                    const stockResults = await imageService.search({
                        query: searchVariation,
                        context: category,
                        orientation: 'landscape',
                        max_results: 2
                    });
                    
                    if (stockResults && stockResults.length > 0) {
                        inArticleUrl = stockResults[0].url;
                        logger.info(`In-article image ${i + 1}: Using stock photo`);
                    }
                } catch (stockError) {
                    // Ignore stock errors, will fallback to AI
                }
                
                // Fallback to AI if no stock photo
                if (!inArticleUrl) {
                    try {
                        const inArticlePrompt = imagePromptGenerator.generate({
                            articleTitle,
                            category,
                            keywords,
                            articleExcerpt,
                            imageType: 'in-article',
                            style: 'illustration'
                        });
                        
                        const inArticleResult = await aiImageGenerator.generate({
                            prompt: inArticlePrompt.prompt,
                            style: 'illustration' as any,
                            size: '1024x1024' as any,
                            quality: 'standard',
                            brand_guidelines: true
                        });
                        
                        inArticleUrl = inArticleResult.url;
                        totalCost += inArticleResult.cost_usd || 0.04;
                    } catch (aiError) {
                        logger.warn(`In-article image ${i + 1}: AI generation failed`);
                        continue; // Skip this image
                    }
                }
                
                if (inArticleUrl) {
                    result.inArticleImages.push({
                        url: inArticleUrl,
                        alt: await generateAltText(
                            articleTitle,
                            `Illustration for section ${i + 1} of article about ${keywords[0] || category}`,
                            keywords[0]
                        ).then(r => r.altText).catch(() => `${articleTitle} - Section ${i + 1}`),
                        position: Math.floor((i + 1) * (articleContent.length / (inArticleCount + 1)))
                    });
                }
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        result.generationCost = totalCost;
        
        logger.info('Image generation complete', {
            featuredImage: !!result.featuredImage,
            inArticleCount: result.inArticleImages.length,
            totalCost
        });
        
        return result;
        
    } catch (error) {
        logger.error('Image generation failed', error as Error);
        // Return partial results
        result.generationCost = totalCost;
        return result;
    }
}

/**
 * Calculate how many in-article images needed based on content length
 */
function calculateInArticleImageCount(content: string): number {
    const wordCount = content.split(/\s+/).length;
    
    // 1 image per 500 words, max 3 images
    const count = Math.min(3, Math.max(1, Math.floor(wordCount / 500)));
    
    return count;
}

/**
 * Build optimized search query for stock photo search
 */
function buildImageSearchQuery(articleTitle: string, category: string, keywords: string[]): string {
    // Map categories to good stock photo search terms
    const categoryTerms: Record<string, string[]> = {
        'mutual-funds': ['investment growth', 'portfolio', 'financial chart', 'investment'],
        'credit-cards': ['credit card payment', 'digital payment', 'financial transaction'],
        'loans': ['home loan', 'mortgage', 'financial planning', 'banking'],
        'insurance': ['family protection', 'insurance', 'life insurance', 'financial security'],
        'tax-planning': ['tax calculation', 'financial documents', 'accounting', 'tax'],
        'retirement': ['retirement planning', 'senior finance', 'pension', 'savings'],
        'investing-basics': ['investment education', 'financial learning', 'money growth'],
        'stocks': ['stock market', 'trading', 'bull market', 'stock chart']
    };
    
    const catTerms = categoryTerms[category] || ['finance', 'investment', 'money'];
    const primaryKeyword = keywords[0] || catTerms[0];
    
    // Build query: category term + keyword focus
    return `${catTerms[0]} ${primaryKeyword}`.substring(0, 50);
}

/**
 * Quick featured image generation (for automation)
 * PRIORITY: Stock photos first, AI fallback
 */
export async function generateFeaturedImageQuick(params: {
    articleTitle: string;
    category: string;
    keywords: string[];
}): Promise<string | null> {
    try {
        // 1. Try stock photos FIRST (FREE)
        const searchQuery = buildImageSearchQuery(params.articleTitle, params.category, params.keywords);
        
        try {
            const stockResults = await imageService.search({
                query: searchQuery,
                context: params.category,
                orientation: 'landscape',
                min_width: 1920,
                max_results: 3
            });
            
            if (stockResults && stockResults.length > 0) {
                logger.info(`✅ Using FREE stock photo from ${stockResults[0].source}`);
                return stockResults[0].url;
            }
        } catch (stockError) {
            logger.warn('Stock photo search failed in quick generator');
        }
        
        // 2. Fallback to AI generation
        logger.info('No stock photo found, using AI generation (PAID)...');
        const prompt = imagePromptGenerator.generate({
            articleTitle: params.articleTitle,
            category: params.category,
            keywords: params.keywords,
            imageType: 'featured',
            style: 'professional'
        });
        
        const result = await aiImageGenerator.generate({
            prompt: prompt.prompt,
            style: 'professional' as any,
            size: '1792x1024' as any,
            quality: 'hd',
            brand_guidelines: true
        });
        
        return result.url;
    } catch (error) {
        logger.error('Quick featured image generation failed', error as Error);
        return null;
    }
}
