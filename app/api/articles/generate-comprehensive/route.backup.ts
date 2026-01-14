import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { articleGenerateSchema } from '@/lib/validation/schemas';

/**
 * Escape HTML entities
 */
function escapeHTML(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Generate Comprehensive Article API
 * 
 * CMS API Route for AI content generation
 * Returns structured JSON per CMS specification
 */
export const POST = createAPIWrapper('/api/articles/generate-comprehensive', {
    rateLimitType: 'ai', // AI generation - strict rate limit
    trackMetrics: true,
})(
    withValidation(articleGenerateSchema, undefined)(
        async (request: NextRequest, body: any, _query: unknown) => {
    try {
        // Body is already validated by middleware
        const { topic, category, targetKeywords, targetAudience, contentLength, wordCount, prompt } = body;

        const { generateArticleContent } = await import('@/lib/workers/articleGenerator');
        
        const articleResult = await generateArticleContent({
            topic,
            category,
            targetKeywords,
            targetAudience,
            contentLength,
            wordCount,
            prompt
        });

        // Return structured response matching original API contract
        return NextResponse.json({
            success: true,
            article: {
                ...articleResult,
                // Ensure compatibility with frontend expectations
                content: articleResult.body_markdown,
                structured_content: articleResult.structured_content,
                seo_score: 75, // Default
                headings: articleResult.structured_content.headings || [],
                sections: articleResult.structured_content.sections || [],
                tables: articleResult.structured_content.tables || [],
                faqs: articleResult.structured_content.faqs || [],
                internal_links: articleResult.structured_content.links || [],
                image_placeholders: articleResult.structured_content.images || []
            }
        });

    } catch (error: unknown) {
        logger.error('Article generation API error', error instanceof Error ? error : new Error(String(error)));
        throw error; // Let API wrapper handle error response
    }
    }
)
);
