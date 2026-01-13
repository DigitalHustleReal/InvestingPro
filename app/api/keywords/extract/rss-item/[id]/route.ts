import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { keywordResearchService } from '@/lib/keyword-research/KeywordResearchService';
import { logger } from '@/lib/logger';

/**
 * Extract keywords from RSS item
 * POST /api/keywords/extract/rss-item/:id
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        // Get RSS item
        const { data: rssItem, error: itemError } = await supabase
            .from('rss_feed_items')
            .select('*')
            .eq('id', id)
            .single();

        if (itemError || !rssItem) {
            return NextResponse.json(
                { success: false, error: 'RSS item not found' },
                { status: 404 }
            );
        }

        // Extract text content
        const content = [rssItem.title, rssItem.description, rssItem.content]
            .filter(Boolean)
            .join(' ');

        if (!content.trim()) {
            return NextResponse.json(
                { success: false, error: 'No content to extract keywords from' },
                { status: 400 }
            );
        }

        // Perform keyword research
        const primaryKeyword = rssItem.title.split(' ').slice(0, 3).join(' '); // Use first 3 words as primary
        const researchResult = await keywordResearchService.performKeywordResearch(
            primaryKeyword,
            content
        );

        // Extract primary keywords from research
        const extractedKeywords = [
            ...researchResult.long_tail_keywords.map(k => k.keyword_text),
            ...researchResult.semantic_keywords.map(k => k.keyword_text).slice(0, 5),
            ...researchResult.lsi_keywords.map(k => k.keyword_text).slice(0, 5)
        ].slice(0, 20); // Limit to 20 keywords

        // Save extraction result
        const { data: extraction, error: extractionError } = await supabase
            .from('keyword_extractions')
            .insert({
                source_type: 'rss_item',
                source_id: params.id,
                extracted_text: content.substring(0, 5000), // Limit stored text
                extraction_method: 'ai',
                keywords: {
                    primary: researchResult.primary_keyword,
                    long_tail: researchResult.long_tail_keywords.map(k => ({
                        keyword: k.keyword_text,
                        score: k.difficulty_score || 50,
                        relevance: k.similarity_to_primary || 0.8
                    })),
                    semantic: researchResult.semantic_keywords.map(k => ({
                        keyword: k.keyword_text,
                        score: k.competition_score || 50,
                        relevance: 0.7
                    }))
                },
                primary_keywords: [researchResult.primary_keyword],
                long_tail_keywords: researchResult.long_tail_keywords.map(k => k.keyword_text),
                entities: {},
                topics: [],
                sentiment_score: 0.5
            })
            .select()
            .single();

        if (extractionError) {
            logger.error('Error saving keyword extraction', extractionError instanceof Error ? extractionError : new Error(String(extractionError)));
        }

        // Update RSS item with extracted keywords
        await supabase
            .from('rss_feed_items')
            .update({
                extracted_keywords: extractedKeywords,
                processing_status: 'processed'
            })
            .eq('id', params.id);

        return NextResponse.json({
            success: true,
            keywords: extractedKeywords,
            research: researchResult,
            extraction_id: extraction?.id
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to extract keywords';
        logger.error('Error extracting keywords from RSS item', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

