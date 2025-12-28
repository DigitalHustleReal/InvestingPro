import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

const openai = typeof window === 'undefined' && process.env.OPENAI_API_KEY 
    ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    : null;

export interface KeywordData {
    keyword_text: string;
    search_volume?: number;
    competition_score?: number;
    difficulty_score?: number;
    cpc?: number;
    trend_data?: any;
}

export interface LongTailKeyword extends KeywordData {
    keyword_text: string;
    keyword_type: 'long-tail';
    similarity_to_primary?: number;
}

export interface SemanticKeyword extends KeywordData {
    keyword_text: string;
    keyword_type: 'semantic';
    semantic_relation?: string;
}

export interface AlternativeKeyword extends KeywordData {
    keyword_text: string;
    keyword_type: 'alternative';
    similarity_score?: number;
    parent_keyword_id?: string;
}

export interface KeywordResearchResult {
    primary_keyword: string;
    long_tail_keywords: LongTailKeyword[];
    semantic_keywords: SemanticKeyword[];
    alternative_keywords: AlternativeKeyword[];
    lsi_keywords: KeywordData[];
}

export interface TitleVariation {
    title_text: string;
    variation_type: 'semantic' | 'question' | 'number' | 'emotional' | 'power-word' | 'original';
    seo_score?: number;
    click_through_score?: number;
    length_score?: number;
    keyword_density?: number;
}

/**
 * Keyword Research Service
 * 
 * Provides AI-powered keyword research capabilities including:
 * - Long-tail keyword generation
 * - Semantic keyword suggestions
 * - Alternative keyword recommendations
 * - LSI keyword extraction
 * - Title variation generation
 */
export class KeywordResearchService {
    /**
     * Generate long-tail keywords from a primary keyword
     */
    async generateLongTailKeywords(
        primaryKeyword: string,
        count: number = 15
    ): Promise<LongTailKeyword[]> {
        if (!openai) {
            throw new Error("OpenAI API key not configured");
        }

        try {
            const prompt = `Generate ${count} long-tail keyword variations for the primary keyword: "${primaryKeyword}"

Long-tail keywords are specific, multi-word phrases that:
- Are 3-5 words long
- Include the primary keyword naturally
- Address specific search intents (how-to, what-is, best, reviews, etc.)
- Are more specific than the primary keyword

Return a JSON array of objects with this structure:
[
  {
    "keyword_text": "long tail keyword phrase",
    "search_volume": <optional estimated volume 0-1000000>,
    "competition_score": <optional 0-100>,
    "difficulty_score": <optional 0-100>,
    "similarity_to_primary": <optional 0-1>
  }
]

Focus on keywords relevant to financial content, investing, and personal finance in the Indian market.`;

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an SEO keyword research expert specializing in financial content. Generate relevant, searchable long-tail keywords."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7
            });

            const content = response.choices[0].message.content || '{}';
            const result = JSON.parse(content);
            // Handle both { keywords: [...] } and [...] formats
            let keywords = [];
            if (Array.isArray(result)) {
                keywords = result;
            } else if (result.keywords && Array.isArray(result.keywords)) {
                keywords = result.keywords;
            } else if (result.semantic_keywords && Array.isArray(result.semantic_keywords)) {
                keywords = result.semantic_keywords;
            }

            return keywords.map((kw: any) => ({
                keyword_text: kw.keyword_text || kw,
                keyword_type: 'long-tail' as const,
                search_volume: kw.search_volume,
                competition_score: kw.competition_score,
                difficulty_score: kw.difficulty_score,
                similarity_to_primary: kw.similarity_to_primary || 0.8,
                ...(kw.trend_data && { trend_data: kw.trend_data })
            })).filter((kw: LongTailKeyword) => kw.keyword_text);
        } catch (error) {
            logger.error("Error generating long-tail keywords", error instanceof Error ? error : new Error(String(error)), { primaryKeyword });
            throw error;
        }
    }

    /**
     * Generate semantic keyword variations
     */
    async generateSemanticKeywords(
        primaryKeyword: string,
        count: number = 10
    ): Promise<SemanticKeyword[]> {
        if (!openai) {
            throw new Error("OpenAI API key not configured");
        }

        try {
            const prompt = `Generate ${count} semantic keyword variations for: "${primaryKeyword}"

Semantic keywords are words/phrases that:
- Are conceptually related to the primary keyword
- Share similar meaning or intent
- Are synonyms or related terms
- Are commonly searched together

Return a JSON array:
[
  {
    "keyword_text": "semantic keyword",
    "semantic_relation": "synonym" | "related" | "associated",
    "search_volume": <optional>,
    "competition_score": <optional>
  }
]

Focus on financial and investing terminology relevant to the Indian market.`;

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an SEO expert. Generate semantic keyword variations that are conceptually related to the primary keyword."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7
            });

            const content = response.choices[0].message.content || '{}';
            const result = JSON.parse(content);
            // Handle both { keywords: [...] } and [...] formats
            let keywords = [];
            if (Array.isArray(result)) {
                keywords = result;
            } else if (result.keywords && Array.isArray(result.keywords)) {
                keywords = result.keywords;
            } else if (result.semantic_keywords && Array.isArray(result.semantic_keywords)) {
                keywords = result.semantic_keywords;
            }

            return keywords.map((kw: any) => ({
                keyword_text: kw.keyword_text || kw,
                keyword_type: 'semantic' as const,
                semantic_relation: kw.semantic_relation || 'related',
                search_volume: kw.search_volume,
                competition_score: kw.competition_score,
                ...(kw.trend_data && { trend_data: kw.trend_data })
            })).filter((kw: SemanticKeyword) => kw.keyword_text);
        } catch (error) {
            logger.error("Error generating semantic keywords", error instanceof Error ? error : new Error(String(error)), { primaryKeyword });
            throw error;
        }
    }

    /**
     * Generate alternative keyword suggestions
     */
    async generateAlternativeKeywords(
        primaryKeyword: string,
        count: number = 10
    ): Promise<AlternativeKeyword[]> {
        if (!openai) {
            throw new Error("OpenAI API key not configured");
        }

        try {
            const prompt = `Generate ${count} alternative keyword suggestions for: "${primaryKeyword}"

Alternative keywords should:
- Be different ways to express the same search intent
- Include variations, synonyms, or different phrasings
- Have similar search intent but different wording
- Be relevant for the same type of content

Return a JSON array:
[
  {
    "keyword_text": "alternative keyword",
    "similarity_score": <0-1, how similar to primary>,
    "search_volume": <optional>,
    "competition_score": <optional>
  }
]

Focus on financial content terminology.`;

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an SEO expert. Generate alternative keyword suggestions that express similar search intent with different wording."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7
            });

            const content = response.choices[0].message.content || '{}';
            const result = JSON.parse(content);
            // Handle both { keywords: [...] } and [...] formats
            let keywords = [];
            if (Array.isArray(result)) {
                keywords = result;
            } else if (result.keywords && Array.isArray(result.keywords)) {
                keywords = result.keywords;
            } else if (result.alternative_keywords && Array.isArray(result.alternative_keywords)) {
                keywords = result.alternative_keywords;
            }

            return keywords.map((kw: any) => ({
                keyword_text: kw.keyword_text || kw,
                keyword_type: 'alternative' as const,
                similarity_score: kw.similarity_score || 0.7,
                search_volume: kw.search_volume,
                competition_score: kw.competition_score,
                ...(kw.trend_data && { trend_data: kw.trend_data })
            })).filter((kw: AlternativeKeyword) => kw.keyword_text);
        } catch (error) {
            logger.error("Error generating alternative keywords", error instanceof Error ? error : new Error(String(error)), { primaryKeyword });
            throw error;
        }
    }

    /**
     * Perform full keyword research for an article
     */
    async performKeywordResearch(
        primaryKeyword: string,
        articleContext?: string
    ): Promise<KeywordResearchResult> {
        try {
            const [longTail, semantic, alternatives] = await Promise.all([
                this.generateLongTailKeywords(primaryKeyword, 15),
                this.generateSemanticKeywords(primaryKeyword, 10),
                this.generateAlternativeKeywords(primaryKeyword, 10)
            ]);

            // Generate LSI keywords (Latent Semantic Indexing)
            const lsiKeywords = await this.generateLSIKeywords(primaryKeyword, articleContext);

            return {
                primary_keyword: primaryKeyword,
                long_tail_keywords: longTail,
                semantic_keywords: semantic,
                alternative_keywords: alternatives,
                lsi_keywords: lsiKeywords
            };
        } catch (error) {
            logger.error("Error performing keyword research", error instanceof Error ? error : new Error(String(error)), { primaryKeyword });
            throw error;
        }
    }

    /**
     * Generate LSI (Latent Semantic Indexing) keywords
     */
    private async generateLSIKeywords(
        primaryKeyword: string,
        context?: string
    ): Promise<KeywordData[]> {
        if (!openai) {
            return [];
        }

        try {
            const prompt = `Generate 10 LSI (Latent Semantic Indexing) keywords for: "${primaryKeyword}"

LSI keywords are:
- Thematically related terms
- Terms that often appear together in context
- Topic-relevant words that support the primary keyword

${context ? `Context: ${context.substring(0, 500)}` : ''}

Return a JSON array:
[
  {
    "keyword_text": "lsi keyword",
    "search_volume": <optional>
  }
]

Focus on financial and investing terms.`;

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an SEO expert. Generate LSI keywords that are thematically related to the primary keyword."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7
            });

            const content = response.choices[0].message.content || '{}';
            const result = JSON.parse(content);
            // Handle both { keywords: [...] } and [...] formats
            let keywords = [];
            if (Array.isArray(result)) {
                keywords = result;
            } else if (result.keywords && Array.isArray(result.keywords)) {
                keywords = result.keywords;
            } else if (result.semantic_keywords && Array.isArray(result.semantic_keywords)) {
                keywords = result.semantic_keywords;
            }

            return keywords.map((kw: any) => ({
                keyword_text: kw.keyword_text || kw,
                search_volume: kw.search_volume
            })).filter((kw: KeywordData) => kw.keyword_text);
        } catch (error) {
            logger.error("Error generating LSI keywords", error instanceof Error ? error : new Error(String(error)), { primaryKeyword });
            return [];
        }
    }

    /**
     * Generate semantic title variations
     */
    async generateTitleVariations(
        originalTitle: string,
        primaryKeyword: string,
        count: number = 10
    ): Promise<TitleVariation[]> {
        if (!openai) {
            throw new Error("OpenAI API key not configured");
        }

        try {
            const prompt = `Generate ${count} semantic title variations for this article title: "${originalTitle}"

Primary keyword: "${primaryKeyword}"

Generate variations with different styles:
1. Question-based titles (How to..., What is..., Why does...)
2. Number-based titles (5 Ways to..., 10 Best..., Top 7...)
3. Emotional/power-word titles (Ultimate, Complete, Essential, Proven)
4. Semantic variations (same meaning, different words)

For each variation, provide:
- title_text: The title variation
- variation_type: "question" | "number" | "emotional" | "semantic" | "power-word"
- seo_score: 0-100 (consider keyword usage, length, clarity)
- click_through_score: 0-100 (consider appeal, curiosity, value proposition)
- length_score: 0-100 (50-60 chars is optimal)
- keyword_density: 0-1 (how well keyword is integrated)

Return JSON array:
[
  {
    "title_text": "variation title",
    "variation_type": "question",
    "seo_score": 85,
    "click_through_score": 80,
    "length_score": 90,
    "keyword_density": 0.15
  }
]`;

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an SEO title optimization expert. Generate compelling, SEO-optimized title variations."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
                temperature: 0.8
            });

            const content = response.choices[0].message.content || '{}';
            const result = JSON.parse(content);
            // Handle both { variations: [...] } and [...] formats
            let variations = [];
            if (Array.isArray(result)) {
                variations = result;
            } else if (result.variations && Array.isArray(result.variations)) {
                variations = result.variations;
            }

            return variations.map((v: any) => ({
                title_text: v.title_text || v,
                variation_type: v.variation_type || 'semantic',
                seo_score: v.seo_score || 70,
                click_through_score: v.click_through_score || 70,
                length_score: v.length_score || 70,
                keyword_density: v.keyword_density || 0.1
            })).filter((v: TitleVariation) => v.title_text);
        } catch (error) {
            logger.error("Error generating title variations", error instanceof Error ? error : new Error(String(error)), { originalTitle });
            throw error;
        }
    }

    /**
     * Save keywords to database
     */
    async saveKeywords(
        articleId: string,
        primaryKeyword: string,
        keywords: KeywordResearchResult
    ): Promise<void> {
        const supabase = await createClient();

        try {
            // Save primary keyword
            await supabase.from('keyword_research').insert({
                article_id: articleId,
                primary_keyword: primaryKeyword,
                keyword_type: 'primary',
                keyword_text: primaryKeyword,
                suggestions_source: 'ai_generated'
            }).select().single();

            // Save long-tail keywords
            if (keywords.long_tail_keywords.length > 0) {
                await supabase.from('keyword_research').insert(
                    keywords.long_tail_keywords.map(kw => ({
                        article_id: articleId,
                        primary_keyword: primaryKeyword,
                        keyword_type: 'long-tail',
                        keyword_text: kw.keyword_text,
                        search_volume: kw.search_volume,
                        competition_score: kw.competition_score,
                        difficulty_score: kw.difficulty_score,
                        trend_data: kw.trend_data,
                        suggestions_source: 'ai_generated'
                    }))
                );
            }

            // Save semantic keywords
            if (keywords.semantic_keywords.length > 0) {
                await supabase.from('keyword_research').insert(
                    keywords.semantic_keywords.map(kw => ({
                        article_id: articleId,
                        primary_keyword: primaryKeyword,
                        keyword_type: 'semantic',
                        keyword_text: kw.keyword_text,
                        search_volume: kw.search_volume,
                        competition_score: kw.competition_score,
                        suggestions_source: 'ai_generated'
                    }))
                );
            }

            // Save alternative keywords
            if (keywords.alternative_keywords.length > 0) {
                const primaryKeywordRow = await supabase
                    .from('keyword_research')
                    .select('id')
                    .eq('article_id', articleId)
                    .eq('keyword_type', 'primary')
                    .single();

                const parentId = primaryKeywordRow.data?.id;

                await supabase.from('keyword_research').insert(
                    keywords.alternative_keywords.map(kw => ({
                        article_id: articleId,
                        primary_keyword: primaryKeyword,
                        keyword_type: 'alternative',
                        keyword_text: kw.keyword_text,
                        is_alternative: true,
                        parent_keyword_id: parentId,
                        similarity_score: kw.similarity_score,
                        search_volume: kw.search_volume,
                        competition_score: kw.competition_score,
                        suggestions_source: 'ai_generated'
                    }))
                );
            }

            // Save LSI keywords
            if (keywords.lsi_keywords.length > 0) {
                await supabase.from('keyword_research').insert(
                    keywords.lsi_keywords.map(kw => ({
                        article_id: articleId,
                        primary_keyword: primaryKeyword,
                        keyword_type: 'lsi',
                        keyword_text: kw.keyword_text,
                        search_volume: kw.search_volume,
                        suggestions_source: 'ai_generated'
                    }))
                );
            }
        } catch (error) {
            logger.error("Error saving keywords to database", error instanceof Error ? error : new Error(String(error)), { articleId });
            throw error;
        }
    }

    /**
     * Get keywords for an article
     */
    async getKeywordsForArticle(articleId: string): Promise<KeywordResearchResult | null> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('keyword_research')
                .select('*')
                .eq('article_id', articleId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            if (!data || data.length === 0) return null;

            const primary = data.find((k: any) => k.keyword_type === 'primary');
            if (!primary) return null;

            const primaryKeyword = primary.keyword_text;

            return {
                primary_keyword: primaryKeyword,
                long_tail_keywords: data
                    .filter((k: any) => k.keyword_type === 'long-tail')
                    .map((k: any) => ({
                        keyword_text: k.keyword_text,
                        keyword_type: 'long-tail' as const,
                        search_volume: k.search_volume,
                        competition_score: k.competition_score,
                        difficulty_score: k.difficulty_score,
                        trend_data: k.trend_data
                    })),
                semantic_keywords: data
                    .filter((k: any) => k.keyword_type === 'semantic')
                    .map((k: any) => ({
                        keyword_text: k.keyword_text,
                        keyword_type: 'semantic' as const,
                        search_volume: k.search_volume,
                        competition_score: k.competition_score
                    })),
                alternative_keywords: data
                    .filter((k: any) => k.keyword_type === 'alternative')
                    .map((k: any) => ({
                        keyword_text: k.keyword_text,
                        keyword_type: 'alternative' as const,
                        similarity_score: k.similarity_score,
                        parent_keyword_id: k.parent_keyword_id,
                        search_volume: k.search_volume,
                        competition_score: k.competition_score
                    })),
                lsi_keywords: data
                    .filter((k: any) => k.keyword_type === 'lsi')
                    .map((k: any) => ({
                        keyword_text: k.keyword_text,
                        search_volume: k.search_volume
                    }))
            };
        } catch (error) {
            logger.error("Error fetching keywords from database", error instanceof Error ? error : new Error(String(error)), { articleId });
            throw error;
        }
    }
}

export const keywordResearchService = new KeywordResearchService();

