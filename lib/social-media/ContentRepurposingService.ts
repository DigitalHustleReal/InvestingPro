import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

const openai = typeof window === 'undefined' && process.env.OPENAI_API_KEY 
    ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    : null;

export interface RepurposingRequest {
    article_id: string;
    article_content: string;
    article_title: string;
    platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
    template_id?: string;
}

export interface RepurposedContent {
    id?: string;
    source_article_id: string;
    platform: string;
    content_text: string;
    hashtags?: string[];
    media_urls?: string[];
    extracted_from?: string;
    auto_generated?: boolean;
}

/**
 * Content Repurposing Service
 * 
 * Converts long-form articles into platform-specific social media posts
 */
export class ContentRepurposingService {
    /**
     * Repurpose article content for social media platform
     */
    async repurposeContent(request: RepurposingRequest): Promise<RepurposedContent> {
        if (!openai) {
            throw new Error("OpenAI API key not configured");
        }

        try {
            const prompt = this.buildRepurposingPrompt(request);
            
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a social media content expert. Create engaging, platform-specific posts from long-form articles."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            });

            const result = JSON.parse(response.choices[0].message.content || '{}');
            
            const repurposedContent: RepurposedContent = {
                source_article_id: request.article_id,
                platform: request.platform,
                content_text: result.content || result.text || '',
                hashtags: result.hashtags || [],
                media_urls: result.media_urls || [],
                extracted_from: result.extracted_from || 'article',
                auto_generated: true
            };

            // Save to database
            await this.saveRepurposedContent(repurposedContent);

            return repurposedContent;
        } catch (error) {
            logger.error("Error repurposing content", error instanceof Error ? error : new Error(String(error)), { request });
            throw error;
        }
    }

    /**
     * Build platform-specific repurposing prompt
     */
    private buildRepurposingPrompt(request: RepurposingRequest): string {
        const platformPrompts = {
            twitter: `Create a Twitter thread (max 5 tweets, 280 chars each) from this article:

Title: ${request.article_title}
Content: ${request.article_content.substring(0, 3000)}

Return JSON:
{
  "content": "Thread tweets joined by \\n\\n",
  "hashtags": ["tag1", "tag2"],
  "extracted_from": "key_points"
}`,

            linkedin: `Create a professional LinkedIn post (300-500 words) from this article:

Title: ${request.article_title}
Content: ${request.article_content.substring(0, 3000)}

Include:
- Engaging hook
- Key takeaways
- Call-to-action
- Relevant hashtags

Return JSON:
{
  "content": "LinkedIn post text",
  "hashtags": ["tag1", "tag2"],
  "extracted_from": "summary"
}`,

            facebook: `Create an engaging Facebook post (200-300 words) from this article:

Title: ${request.article_title}
Content: ${request.article_content.substring(0, 3000)}

Include:
- Hook to grab attention
- Key insights
- Call-to-action

Return JSON:
{
  "content": "Facebook post text",
  "hashtags": ["tag1", "tag2"],
  "extracted_from": "highlights"
}`,

            instagram: `Create an Instagram carousel post description (5-7 key points) from this article:

Title: ${request.article_title}
Content: ${request.article_content.substring(0, 3000)}

Format as numbered points with emojis.

Return JSON:
{
  "content": "Instagram post with numbered points",
  "hashtags": ["tag1", "tag2"],
  "extracted_from": "key_points"
}`
        };

        return platformPrompts[request.platform] || platformPrompts.linkedin;
    }

    /**
     * Save repurposed content to database
     */
    async saveRepurposedContent(content: RepurposedContent): Promise<string> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('repurposed_content')
                .insert({
                    source_article_id: content.source_article_id,
                    platform: content.platform,
                    content_text: content.content_text,
                    hashtags: content.hashtags || [],
                    media_urls: content.media_urls || [],
                    extracted_from: content.extracted_from || 'article',
                    auto_generated: content.auto_generated ?? true,
                    status: 'draft'
                })
                .select('id')
                .single();

            if (error) throw error;
            return data.id;
        } catch (error) {
            logger.error("Error saving repurposed content", error instanceof Error ? error : new Error(String(error)), { content });
            throw error;
        }
    }

    /**
     * Get repurposed content for article
     */
    async getRepurposedContent(articleId: string): Promise<RepurposedContent[]> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('repurposed_content')
                .select('*')
                .eq('source_article_id', articleId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error("Error fetching repurposed content", error instanceof Error ? error : new Error(String(error)), { articleId });
            throw error;
        }
    }
}

export const contentRepurposingService = new ContentRepurposingService();

