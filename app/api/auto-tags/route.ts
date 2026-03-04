/**
 * Auto-Tagging API
 * Extracts relevant tags from article content using AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
    try {
        const { title, excerpt = '', content = '', maxTags = 5 } = await request.json();

        if (!title) {
            return NextResponse.json({ error: 'Title required' }, { status: 400 });
        }

        logger.info('🏷️ Auto-tagging:', title);

        // Use AI to extract tags
        const tags = await extractTagsWithAI(title, excerpt, content, maxTags);
        
        logger.info('✅ Generated tags:', tags);

        return NextResponse.json({
            tags,
            count: tags.length,
            source: 'ai'
        });

    } catch (error: any) {
        logger.error('Auto-tagging error:', error);
        
        // Fallback to keyword extraction
        const fallbackTags = extractKeywords(
            await request.json().then(d => `${d.title} ${d.excerpt}`)
        );
        
        return NextResponse.json({
            tags: fallbackTags,
            count: fallbackTags.length,
            source: 'fallback',
            error: 'Using fallback extraction'
        });
    }
}

async function extractTagsWithAI(
    title: string,
    excerpt: string,
    content: string,
    maxTags: number
): Promise<string[]> {
    try {
        const prompt = `Extract ${maxTags} relevant, SEO-friendly tags for this article.

Title: ${title}
Excerpt: ${excerpt}
${content ? `Content: ${content.substring(0, 1000)}` : ''}

Requirements:
- Return ${maxTags} tags maximum
- Tags should be lowercase, hyphenated (e.g., "credit-card-rewards")
- Focus on main topics, concepts, and keywords
- Make them SEO-friendly and searchable
- Avoid generic words like "guide" or "tips"

Respond with ONLY the tags, comma-separated, nothing else.
Example: investment-strategy,portfolio-diversification,risk-management`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are an SEO expert specializing in extracting relevant, searchable tags from financial content.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.5,
            max_tokens: 100
        });

        const tagsText = response.choices[0]?.message?.content?.trim() || '';
        
        // Parse tags
        const tags = tagsText
            .split(',')
            .map(tag => tag.trim().toLowerCase().replace(/\s+/g, '-'))
            .filter(tag => tag.length > 2 && tag.length < 30)
            .slice(0, maxTags);

        return tags.length > 0 ? tags : extractKeywords(`${title} ${excerpt}`);

    } catch (error) {
        logger.error('AI tag extraction failed:', error);
        return extractKeywords(`${title} ${excerpt}`);
    }
}

function extractKeywords(text: string): string[] {
    // Fallback: simple keyword extraction
    const stopWords = new Set([
        'the', 'and', 'for', 'with', 'from', 'what', 'when', 
        'where', 'how', 'why', 'this', 'that', 'your', 'our',
        'best', 'top', 'guide', 'tips', 'everything', 'about'
    ]);

    const words = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, ' ')
        .split(/\s+/)
        .filter(word => 
            word.length > 3 && 
            !stopWords.has(word) &&
            !/^\d+$/.test(word)
        );

    // Get unique words, prioritize longer ones
    const uniqueWords = [...new Set(words)]
        .sort((a, b) => b.length - a.length)
        .slice(0, 5);

    return uniqueWords.map(w => w.replace(/\s+/g, '-'));
}
