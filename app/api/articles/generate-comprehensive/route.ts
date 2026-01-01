import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';

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
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { topic, category, targetKeywords, targetAudience, contentLength, wordCount, prompt } = body;

        if (!topic) {
            return NextResponse.json(
                { success: false, error: 'Topic is required' },
                { status: 400 }
            );
        }

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
        const errorMessage = error instanceof Error ? error.message : 'Article generation failed';
        logger.error('Article generation API error', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
