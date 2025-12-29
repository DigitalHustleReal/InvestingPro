import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';

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

        // Build data sources
        const dataSources = [{
            source_type: 'supabase' as const,
            source_name: 'Supabase Database',
            last_verified: new Date().toISOString(),
            confidence: 0.8
        }];

        // Build structured prompt for JSON output per CMS specification
        const structuredPrompt = prompt || `
Generate a comprehensive article about: ${topic}

Category: ${category}
Target Audience: ${targetAudience}
Content Length: ${contentLength}
Word Count Target: ${wordCount || 1500}
Keywords: ${targetKeywords || ''}

CRITICAL: You MUST respond with ONLY valid JSON in this exact structure:
{
  "title": "Article title (60 chars max)",
  "excerpt": "Brief excerpt (150 chars max)",
  "headings": [
    { "level": 1, "text": "H1 heading" },
    { "level": 2, "text": "H2 heading" },
    { "level": 3, "text": "H3 heading" }
  ],
  "sections": [
    {
      "heading_id": "reference to headings array index",
      "content": "Section content in markdown",
      "order": 1
    }
  ],
  "tables": [
    {
      "title": "Table title",
      "headers": ["Column 1", "Column 2"],
      "rows": [["Data 1", "Data 2"]],
      "caption": "Table caption"
    }
  ],
  "faqs": [
    {
      "question": "FAQ question",
      "answer": "FAQ answer"
    }
  ],
  "links": [
    {
      "text": "Link text",
      "url": "/internal/path",
      "type": "internal"
    }
  ],
  "images": [
    {
      "placeholder": "Description of image needed",
      "alt": "Alt text",
      "position": "after_section_1"
    }
  ],
  "seo_title": "SEO optimized title (60 chars max)",
  "seo_description": "Meta description (155 chars max)",
  "tags": ["tag1", "tag2"],
  "read_time": 5
}

Return ONLY valid JSON. No markdown, no code blocks, no explanations.
`;

        // Use unified API service for AI generation
        const generatedContent = await api.integrations.Core.InvokeLLM({
            prompt: structuredPrompt,
            operation: 'summarize_factual_data',
            dataSources,
            contextData: {
                topic,
                category,
                targetKeywords,
                targetAudience,
                contentLength,
                wordCount
            }
        });

        // Parse structured JSON response
        let structuredContent: any = {};
        
        // If content is a string, try to parse it as JSON
        if (typeof generatedContent.content === 'string') {
            try {
                structuredContent = JSON.parse(generatedContent.content);
            } catch (e) {
                // If not JSON, treat as legacy markdown content
                structuredContent = {
                    title: generatedContent.title || topic,
                    content: generatedContent.content,
                    headings: [],
                    sections: [],
                    tables: [],
                    faqs: [],
                    links: [],
                    images: []
                };
            }
        } else if (generatedContent.headings || generatedContent.sections) {
            // Already structured
            structuredContent = generatedContent;
        } else {
            // Fallback to legacy format
            structuredContent = {
                title: generatedContent.title || topic,
                content: generatedContent.content || '',
                headings: [],
                sections: [],
                tables: [],
                faqs: [],
                links: [],
                images: []
            };
        }

        // Convert structured content to markdown for storage (backward compatibility)
        let markdownContent = '';
        if (structuredContent.sections && structuredContent.sections.length > 0) {
            // Build markdown from structured sections
            structuredContent.sections.forEach((section: any, index: number) => {
                const heading = structuredContent.headings?.[section.heading_id] || 
                               structuredContent.headings?.[index];
                if (heading) {
                    markdownContent += `${'#'.repeat(heading.level)} ${heading.text}\n\n`;
                }
                markdownContent += `${section.content}\n\n`;
            });
        } else {
            // Fallback to plain content
            markdownContent = structuredContent.content || generatedContent.content || '';
        }

        // Return structured response with both structured and markdown formats
        return NextResponse.json({
            success: true,
            article: {
                title: structuredContent.title || generatedContent.title || topic,
                slug: (structuredContent.title || generatedContent.title || topic)
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, ''),
                content: markdownContent, // Markdown for storage
                structured_content: structuredContent, // Structured JSON for processing
                excerpt: structuredContent.excerpt || generatedContent.excerpt || generatedContent.seo_description || '',
                seo_title: structuredContent.seo_title || generatedContent.seo_title || structuredContent.title || topic,
                meta_description: structuredContent.seo_description || generatedContent.seo_description || structuredContent.excerpt || '',
                keywords: targetKeywords ? targetKeywords.split(',').map((k: string) => k.trim()) : [],
                category: category || 'investing-basics',
                tags: structuredContent.tags || generatedContent.tags || [],
                read_time: structuredContent.read_time || generatedContent.read_time || 5,
                word_count: wordCount || 1500,
                seo_score: 75, // Default score, will be calculated by SEO component
                status: 'draft' as const,
                ai_metadata: generatedContent.ai_metadata,
                // Structured content components
                headings: structuredContent.headings || [],
                sections: structuredContent.sections || [],
                tables: structuredContent.tables || [],
                faqs: structuredContent.faqs || [],
                internal_links: structuredContent.links || [],
                image_placeholders: structuredContent.images || []
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
