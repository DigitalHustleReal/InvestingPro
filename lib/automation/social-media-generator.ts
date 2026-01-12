/**
 * 📱 SOCIAL MEDIA GENERATOR
 * 
 * 100% Automated Social Media Content Generation
 * 
 * Process:
 * 1. Extract content from article
 * 2. Generate platform-specific prompts
 * 3. Generate social media content with AI
 * 4. Optimize for each platform
 * 5. Schedule and publish
 */

import { socialMediaPromptGenerator, SocialMediaPromptOptions } from '@/lib/prompts/social-media-prompts';
import { selectSocialMediaTemplate } from '@/lib/templates/social-media-templates';
import { multiProviderAI } from '@/lib/ai/providers/multi-provider';
import { logger } from '@/lib/logger';

export interface SocialMediaGenerationResult {
    platform: string;
    contentType: string;
    content: string;
    hashtags: string[];
    cta: string;
    characterCount: number;
    engagementTips: string[];
}

/**
 * Generate social media content for all platforms
 */
export async function generateSocialMediaContent(params: {
    articleTitle: string;
    articleContent: string;
    articleExcerpt?: string;
    category: string;
    keywords?: string[];
    platforms?: Array<'twitter' | 'linkedin' | 'facebook' | 'instagram'>;
}): Promise<SocialMediaGenerationResult[]> {
    const {
        articleTitle,
        articleContent,
        articleExcerpt,
        category,
        keywords = [],
        platforms = ['twitter', 'linkedin', 'facebook', 'instagram']
    } = params;
    
    logger.info('Generating social media content', { articleTitle, platforms });
    
    const results: SocialMediaGenerationResult[] = [];
    
    for (const platform of platforms) {
        try {
            // Determine content type based on platform
            const contentType = platform === 'twitter' ? 'thread' : 'post';
            
            // Generate prompt
            const promptOptions: SocialMediaPromptOptions = {
                articleTitle,
                articleContent,
                articleExcerpt,
                platform,
                contentType,
                category,
                keywords,
                includeCTA: true,
                includeHashtags: true
            };
            
            const promptResult = socialMediaPromptGenerator.generate(promptOptions);
            
            // Generate content with AI
            const aiResult = await multiProviderAI.generate({
                prompt: promptResult.prompt,
                priority: 'speed', // Fast generation for social media
                maxTokens: platform === 'twitter' ? 500 : 1000
            });
            
            // Parse result (assuming JSON format)
            let contentData: any;
            try {
                contentData = JSON.parse(aiResult.content);
            } catch {
                // Fallback if not JSON
                contentData = {
                    post: aiResult.content,
                    hashtags: promptResult.hashtags,
                    cta: promptResult.cta
                };
            }
            
            results.push({
                platform,
                contentType,
                content: contentData.post || contentData.tweets?.map((t: any) => t.tweet).join('\n\n') || aiResult.content,
                hashtags: contentData.hashtags || promptResult.hashtags,
                cta: contentData.cta || promptResult.cta,
                characterCount: (contentData.post || aiResult.content).length,
                engagementTips: promptResult.engagementTips
            });
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            logger.error(`Failed to generate ${platform} content`, error as Error);
        }
    }
    
    return results;
}

/**
 * Generate Twitter thread
 */
export async function generateTwitterThread(params: {
    articleTitle: string;
    articleContent: string;
    category: string;
    keywords?: string[];
}): Promise<{ tweets: Array<{ number: number; tweet: string }>; hashtags: string[] }> {
    const promptResult = socialMediaPromptGenerator.generate({
        articleTitle: params.articleTitle,
        articleContent: params.articleContent,
        platform: 'twitter',
        contentType: 'thread',
        category: params.category,
        keywords: params.keywords,
        includeCTA: true,
        includeHashtags: true
    });
    
    const aiResult = await multiProviderAI.generate({
        prompt: promptResult.prompt,
        priority: 'speed',
        maxTokens: 800
    });
    
    // Parse tweets
    let tweets: Array<{ number: number; tweet: string }> = [];
    try {
        const data = JSON.parse(aiResult.content);
        tweets = data.tweets || data;
    } catch {
        // Fallback: split by newlines
        const lines = aiResult.content.split('\n').filter(l => l.trim());
        tweets = lines.map((line, i) => ({
            number: i + 1,
            tweet: line.trim()
        }));
    }
    
    return {
        tweets,
        hashtags: promptResult.hashtags
    };
}
