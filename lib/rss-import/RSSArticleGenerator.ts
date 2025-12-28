import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import OpenAI from "openai";
import type { StructuredContent } from "@/types/structured-content";
import { structuredToMarkdown } from "@/types/structured-content";

const openai = typeof window === 'undefined' && process.env.OPENAI_API_KEY 
    ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    : null;

export interface RSSItem {
    id: string;
    feed_id: string;
    title: string;
    description?: string;
    content?: string;
    original_url: string;
    published_date?: Date;
    categories?: string[];
    extracted_keywords?: string[];
}

export interface GenerationRule {
    transformation_prompt?: string;
    keyword_strategy?: 'extract' | 'use_feed_keywords' | 'generate' | 'hybrid';
    category_mapping?: Record<string, string>;
    auto_publish?: boolean;
    publish_as_draft?: boolean;
    add_source_attribution?: boolean;
    summarize_content?: boolean;
    expand_content?: boolean;
    target_word_count?: number;
}

/**
 * RSS Article Generator Service
 * 
 * Generates articles from RSS feed items using AI
 */
export class RSSArticleGenerator {
    /**
     * Generate article from RSS item
     */
    async generateFromRSSItem(
        rssItem: RSSItem,
        rule: GenerationRule = {}
    ): Promise<{ article_id: string; structured_content: StructuredContent }> {
        if (!openai) {
            throw new Error("OpenAI API key not configured");
        }

        try {
            // Build article generation prompt
            const prompt = this.buildGenerationPrompt(rssItem, rule);

            // Generate structured content using OpenAI
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert content writer specializing in financial and investment content for the Indian market. Generate comprehensive, SEO-optimized articles in structured JSON format."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7
            });

            const structuredContent: StructuredContent = JSON.parse(
                response.choices[0].message.content || '{}'
            );

            // Validate structured content
            if (!structuredContent.title || !structuredContent.sections) {
                throw new Error("Invalid structured content generated");
            }

            // Save article to database
            const articleId = await this.saveArticle(rssItem, structuredContent, rule);

            // Update RSS item
            await this.updateRSSItem(rssItem.id, articleId);

            return {
                article_id: articleId,
                structured_content: structuredContent
            };
        } catch (error) {
            logger.error("Error generating article from RSS item", error instanceof Error ? error : new Error(String(error)), { rssItem, rule });
            throw error;
        }
    }

    /**
     * Build article generation prompt
     */
    private buildGenerationPrompt(rssItem: RSSItem, rule: GenerationRule): string {
        const targetWordCount = rule.target_word_count || 1500;
        const keywords = rssItem.extracted_keywords?.join(', ') || '';
        const sourceNote = rule.add_source_attribution !== false 
            ? `\n\nInclude source attribution: Original article: ${rssItem.original_url}`
            : '';

        const transformation = rule.summarize_content 
            ? "Summarize and condense the key points."
            : rule.expand_content 
            ? "Expand on the content with additional context, examples, and insights."
            : "Transform this content into a comprehensive, original article.";

        return `Generate a comprehensive article based on this RSS feed item:

Title: ${rssItem.title}
Description: ${rssItem.description || ''}
Content: ${(rssItem.content || '').substring(0, 3000)}
${keywords ? `Keywords: ${keywords}` : ''}

Requirements:
- ${transformation}
- Target word count: ${targetWordCount} words
- Generate structured JSON content (headings, sections, FAQs if relevant)
- Make it comprehensive, valuable, and SEO-optimized
- Focus on financial/investment topics relevant to the Indian market
${sourceNote}

Return ONLY valid JSON in this exact structure:
{
  "title": "Article title (60 chars max, SEO optimized)",
  "excerpt": "Brief excerpt (150 chars max)",
  "headings": [
    { "level": 1, "text": "H1 heading" },
    { "level": 2, "text": "H2 heading" },
    { "level": 3, "text": "H3 heading" }
  ],
  "sections": [
    {
      "heading_id": 0,
      "content": "Section content in markdown",
      "order": 1
    }
  ],
  "faqs": [
    {
      "question": "FAQ question",
      "answer": "FAQ answer"
    }
  ],
  "seo_title": "SEO optimized title (60 chars max)",
  "seo_description": "Meta description (155 chars max)",
  "tags": ["tag1", "tag2"],
  "read_time": 5
}

Return ONLY valid JSON. No markdown, no code blocks, no explanations.`;
    }

    /**
     * Save generated article to database
     */
    private async saveArticle(
        rssItem: RSSItem,
        structuredContent: StructuredContent,
        rule: GenerationRule
    ): Promise<string> {
        const supabase = await createClient();

        try {
            // Convert structured content to markdown
            const markdownContent = this.structuredToMarkdown(structructuredContent);

            // Map category if category_mapping provided
            let categoryId = null;
            if (rssItem.categories && rssItem.categories.length > 0 && rule.category_mapping) {
                const mappedCategory = rule.category_mapping[rssItem.categories[0]];
                if (mappedCategory) {
                    const { data: category } = await supabase
                        .from('categories')
                        .select('id')
                        .eq('slug', mappedCategory)
                        .single();
                    categoryId = category?.id || null;
                }
            }

            // Determine status
            const status = rule.auto_publish ? 'published' : (rule.publish_as_draft !== false ? 'draft' : 'draft');

            // Build article data
            const articleData: any = {
                title: structuredContent.title,
                slug: this.generateSlug(structuredContent.title),
                excerpt: structuredContent.excerpt || '',
                content: markdownContent,
                meta_title: structuredContent.seo_title || structuredContent.title,
                meta_description: structuredContent.seo_description || structuredContent.excerpt || '',
                keywords: rssItem.extracted_keywords || [],
                status: status,
                category_id: categoryId,
                published_at: status === 'published' ? new Date().toISOString() : null
            };

            // Add source attribution if enabled
            if (rule.add_source_attribution !== false) {
                articleData.content = `${markdownContent}\n\n---\n\n*Source: [${rssItem.title}](${rssItem.original_url})*`;
            }

            const { data: article, error } = await supabase
                .from('articles')
                .insert(articleData)
                .select('id')
                .single();

            if (error) throw error;

            return article.id;
        } catch (error) {
            logger.error("Error saving generated article", error instanceof Error ? error : new Error(String(error)), { rssItem });
            throw error;
        }
    }


    /**
     * Generate slug from title
     */
    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .substring(0, 100);
    }

    /**
     * Update RSS item with generated article ID
     */
    private async updateRSSItem(rssItemId: string, articleId: string): Promise<void> {
        const supabase = await createClient();

        try {
            const { error } = await supabase
                .from('rss_feed_items')
                .update({
                    generated_article_id: articleId,
                    processing_status: 'article_generated',
                    processed_at: new Date().toISOString()
                })
                .eq('id', rssItemId);

            if (error) throw error;
        } catch (error) {
            logger.error("Error updating RSS item", error instanceof Error ? error : new Error(String(error)), { rssItemId, articleId });
            throw error;
        }
    }

    /**
     * Get generation rules for feed
     */
    async getGenerationRules(feedId: string): Promise<GenerationRule | null> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('rss_article_generation_rules')
                .select('*')
                .eq('feed_id', feedId)
                .eq('is_active', true)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
            if (!data) return null;

            return {
                transformation_prompt: data.transformation_prompt || undefined,
                keyword_strategy: data.keyword_strategy || 'extract',
                category_mapping: data.category_mapping || {},
                auto_publish: data.auto_publish || false,
                publish_as_draft: data.publish_as_draft !== false,
                add_source_attribution: data.add_source_attribution !== false,
                summarize_content: data.summarize_content || false,
                expand_content: data.expand_content || false,
                target_word_count: data.target_word_count || 1500
            };
        } catch (error) {
            logger.error("Error fetching generation rules", error instanceof Error ? error : new Error(String(error)), { feedId });
            return null;
        }
    }

    /**
     * Save or update generation rules
     */
    async saveGenerationRules(feedId: string, rules: GenerationRule): Promise<string> {
        const supabase = await createClient();

        try {
            // Check if rules exist
            const { data: existing } = await supabase
                .from('rss_article_generation_rules')
                .select('id')
                .eq('feed_id', feedId)
                .eq('is_active', true)
                .single();

            const ruleData: any = {
                feed_id: feedId,
                rule_name: 'Default Rule',
                transformation_prompt: rules.transformation_prompt,
                keyword_strategy: rules.keyword_strategy || 'extract',
                category_mapping: rules.category_mapping || {},
                auto_publish: rules.auto_publish || false,
                publish_as_draft: rules.publish_as_draft !== false,
                add_source_attribution: rules.add_source_attribution !== false,
                summarize_content: rules.summarize_content || false,
                expand_content: rules.expand_content || false,
                target_word_count: rules.target_word_count || 1500,
                is_active: true
            };

            let result;
            if (existing) {
                // Update existing
                const { data, error } = await supabase
                    .from('rss_article_generation_rules')
                    .update(ruleData)
                    .eq('id', existing.id)
                    .select('id')
                    .single();
                
                if (error) throw error;
                result = data.id;
            } else {
                // Create new
                const { data, error } = await supabase
                    .from('rss_article_generation_rules')
                    .insert(ruleData)
                    .select('id')
                    .single();
                
                if (error) throw error;
                result = data.id;
            }

            return result;
        } catch (error) {
            logger.error("Error saving generation rules", error instanceof Error ? error : new Error(String(error)), { feedId, rules });
            throw error;
        }
    }
}

export const rssArticleGenerator = new RSSArticleGenerator();

