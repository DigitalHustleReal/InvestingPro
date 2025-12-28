import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';

/**
 * POST /api/articles/generate-initial
 * Generate initial article draft using AI
 */
export async function POST(request: NextRequest) {
    try {
        const { topic, category, language, tone, template, keywords } = await request.json();

        if (!topic) {
            return NextResponse.json(
                { success: false, error: 'Topic is required' },
                { status: 400 }
            );
        }

        // Build prompt based on template
        let prompt = `Write a comprehensive, SEO-optimized article about "${topic}" for an Indian financial website (InvestingPro.in).\n\n`;
        
        if (category) prompt += `Category: ${category}\n`;
        if (language) prompt += `Language: ${language}\n`;
        if (tone) prompt += `Tone: ${tone}\n`;
        if (keywords) prompt += `Keywords to include: ${keywords}\n`;

        prompt += `\nRequirements:
- SEO-optimized with natural keyword placement
- Clear headings (H2, H3)
- Practical examples relevant to Indian investors
- Actionable insights
- Compelling introduction and conclusion
- 1500-2000 words
- Use informational language only (no financial advice)`;

        // Call AI service
        const aiResponse = await api.integrations.Core.InvokeLLM({
            prompt,
            contextData: { topic, category, language, tone },
            operation: 'article-generation',
            dataSources: [{
                source_type: 'internal',
                source_name: 'Article Generator',
                last_verified: new Date().toISOString(),
                confidence: 0.8
            }]
        });

        // Extract content from response
        const content = aiResponse.content || aiResponse.text || '';
        const title = aiResponse.title || `${topic} - Complete Guide`;
        
        // Generate slug
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        // Extract excerpt (first 200 chars)
        const excerpt = content.substring(0, 200).replace(/\n/g, ' ').trim() + '...';

        return NextResponse.json({
            success: true,
            article: {
                title,
                slug,
                content,
                excerpt,
                category: category || 'investing-basics',
                language: language || 'en',
                tone: tone || 'informative',
                ai_generated: true,
                status: 'draft'
            }
        });
    } catch (error: any) {
        logger.error('Article generation failed', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error.message || 'Article generation failed',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}








