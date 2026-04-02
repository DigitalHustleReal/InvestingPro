/**
 * 🔄 CONTENT REPURPOSER
 * 
 * Transforms long-form Markdown articles into multi-channel formats:
 * - Twitter Thread
 * - LinkedIn Post
 * - Instagram Carousel Script
 * - Email Newsletter Snippet
 */

import { logger } from '@/lib/logger';
import { extractJSON } from '@/lib/utils/json';

export type RepurposeFormat = 'twitter' | 'linkedin' | 'instagram' | 'newsletter' | 'pdf';

export interface RepurposeResult {
    format: RepurposeFormat;
    content: any;
    timestamp: string;
}

/**
 * Main repurposing function
 */
export async function repurposeArticle(
    articleContent: string,
    articleTitle: string,
    format: RepurposeFormat,
    options: { targetAudience?: string; tone?: string } = {}
): Promise<RepurposeResult> {
    logger.info(`Repurposing article "${articleTitle}" to ${format}`);

    try {
        const { api } = await import('@/lib/api');
        
        const systemPrompt = `You are a social media strategist for InvestingPro, specializing in personal finance. 
        Your goal is to repurpose a long-form financial article into a high-engagement ${format} format.
        
        TONE: ${options.tone || 'educational, relatable, and expert'}
        AUDIENCE: ${options.targetAudience || 'Indian retail investors, 25-45 years old'}`;

        const userPrompt = `REPURPOSE THIS ARTICLE:
        Title: ${articleTitle}
        
        CONTENT:
        """
        ${articleContent.substring(0, 5000)}
        """

        ${getFormatSpecificInstructions(format)}`;

        const result = await api.integrations.Core.InvokeLLM({
            prompt: userPrompt,
            operation: `repurpose_to_${format}`,
            contextData: { format, articleTitle }
        });

        const parsed = extractJSON(result.content) || { raw: result.content };

        return {
            format,
            content: parsed,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        logger.error(`Failed to repurpose article to ${format}`, error as Error);
        throw error;
    }
}

/**
 * Get format-specific prompt instructions
 */
function getFormatSpecificInstructions(format: RepurposeFormat): string {
    switch (format) {
        case 'twitter':
            return `Create a Twitter thread (6-8 tweets).
            - Tweet 1: Hook + Thread emoji.
            - Tweets 2-7: Key takeaways with 1-2 line bullets.
            - Tweet 8: Call to action to read full article.
            - Each tweet MUST be < 280 characters.
            RETURN JSON: { "tweets": ["...", "..."], "hashtags": ["#PersonalFinance", "..."] }`;
        
        case 'linkedin':
            return `Create a high-impact LinkedIn post.
            - Strong hook (first 2 lines).
            - Use whitespace and line breaks.
            - Summarize 3-5 actionable insights.
            - Bold CTA at the end.
            RETURN JSON: { "post": "...", "hooks": ["Alternative hook 1", "Alternative hook 2"] }`;
        
        case 'instagram':
            return `Create a script for a 7-slide Instagram Carousel.
            - Slide 1: Catchy Title.
            - Slides 2-6: One major tip or insight per slide.
            - Slide 7: Save/Share/Follow CTA.
            RETURN JSON: { "slides": [{ "title": "...", "body": "..." }], "caption": "..." }`;
        
        case 'newsletter':
            return `Create an HTML Email Newsletter snippet.
            - Compelling subject line.
            - 150-word teaser summary.
            - Bulleted list of what they'll learn.
            - "Read More" button copy.
            RETURN JSON: { "subject": "...", "teaser": "...", "bullets": ["...", "..."] }`;
        
        case 'pdf':
            return `Generate a structured outline for a downloadable PDF cheat sheet.
            - Title, Introduction.
            - Checklist of key points.
            - Summary table.
            RETURN JSON: { "title": "...", "sections": [{ "heading": "...", "points": ["..."] }] }`;
            
        default:
            return `Summarize into a concise social-friendly format.`;
    }
}
