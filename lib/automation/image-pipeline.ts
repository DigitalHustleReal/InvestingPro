/**
 * 🎨 AUTOMATED IMAGE GENERATION PIPELINE
 * 
 * 100% Automated Image Generation for Articles
 * 
 * Process:
 * 1. Generate precise, theme-related prompt
 * 2. Generate image with AI (DALL-E 3)
 * 3. Optimize and save
 * 4. Generate alt text
 * 5. Cache for reuse
 */

import { imagePromptGenerator, ImagePromptOptions } from '@/lib/prompts/image-prompts';
import { aiImageGenerator } from '@/lib/images/ai-image-generator';
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
        // 1. Generate Featured Image
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
        
        const featuredImageResult = await aiImageGenerator.generate({
            prompt: enhancedFeaturedPrompt.prompt,
            style: enhancedFeaturedPrompt.style as any,
            size: '1792x1024' as any,
            quality: 'hd',
            brand_guidelines: true
        });
        
        result.featuredImage = featuredImageResult.url;
        totalCost += featuredImageResult.cost_usd;
        
        // Generate alt text for featured image
        result.featuredImageAlt = await generateAltText(
            articleTitle,
            `Featured image for article about ${keywords[0] || category}`,
            keywords[0]
        ).then(r => r.altText).catch(() => articleTitle);
        
        // 2. Generate Social Media Images (OG, Twitter, LinkedIn)
        const socialPrompts = ['og', 'social', 'social'].map((type, i) => {
            const socialType = i === 0 ? 'og' : i === 1 ? 'social' : 'social';
            return imagePromptGenerator.generate({
                articleTitle,
                category,
                keywords,
                articleExcerpt,
                imageType: socialType as any,
                style: 'professional'
            });
        });
        
        // Generate OG image
        const ogResult = await aiImageGenerator.generate({
            prompt: socialPrompts[0].prompt,
            style: 'professional' as any,
            size: '1200x630' as any,
            quality: 'hd',
            brand_guidelines: true
        });
        result.socialImages.og = ogResult.url;
        totalCost += ogResult.cost_usd;
        
        // Generate Twitter image (same as OG for now, can be optimized later)
        result.socialImages.twitter = ogResult.url;
        
        // Generate LinkedIn image (same as OG for now)
        result.socialImages.linkedin = ogResult.url;
        
        // 3. Generate In-Article Images (if content provided)
        if (articleContent) {
            const inArticleCount = calculateInArticleImageCount(articleContent);
            
            for (let i = 0; i < inArticleCount; i++) {
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
                
                result.inArticleImages.push({
                    url: inArticleResult.url,
                    alt: await generateAltText(
                        articleTitle,
                        `Illustration for section ${i + 1} of article about ${keywords[0] || category}`,
                        keywords[0]
                    ).then(r => r.altText).catch(() => `${articleTitle} - Section ${i + 1}`),
                    position: Math.floor((i + 1) * (articleContent.length / (inArticleCount + 1)))
                });
                
                totalCost += inArticleResult.cost_usd;
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 2000));
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
 * Quick featured image generation (for automation)
 */
export async function generateFeaturedImageQuick(params: {
    articleTitle: string;
    category: string;
    keywords: string[];
}): Promise<string | null> {
    try {
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
