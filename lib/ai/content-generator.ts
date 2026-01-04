import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/client';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

interface GlossaryTerm {
    term: string;
    slug: string;
    category: string;
    definition: string;
    detailedExplanation: string;
    example: string;
    relatedTerms: string[];
    searchKeywords: string[];
}

interface BlogPost {
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    metaDescription: string;
    metaKeywords: string[];
    schemaMarkup: any;
    readingTimeMinutes: number;
}

export class AIContentGenerator {
    private supabase = createClient();

    /**
     * Generate a glossary term definition using AI
     */
    async generateGlossaryTerm(term: string, category: string): Promise<GlossaryTerm> {
        const prompt = `You are a financial expert writing glossary definitions for an Indian financial platform.

Generate a comprehensive glossary entry for the term: "${term}"
Category: ${category}

Provide the following in JSON format:
{
  "term": "${term}",
  "definition": "A clear, concise definition in 50-100 words",
  "detailedExplanation": "A detailed explanation in 200-300 words covering what it is, how it works, and why it matters in the Indian context",
  "example": "A practical example showing how this term applies in India, using Indian Rupees (₹) where applicable",
  "relatedTerms": ["term1", "term2", "term3"], // 3-5 related terms
  "searchKeywords": ["keyword1", "keyword2"] // 5-7 SEO keywords
}

Make sure to:
1. Use Indian context (₹, Indian banks, Indian regulations where relevant)
2. Be accurate and factual
3. Use simple language for beginners
4. Include specific examples with numbers
5. Avoid jargon unless explaining it`;

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert financial educator specializing in Indian financial markets and products.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1500,
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0].message.content || '{}';
            const parsed = JSON.parse(content);

            // Create slug from term
            const slug = term.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

            return {
                term: parsed.term || term,
                slug,
                category,
                definition: parsed.definition,
                detailedExplanation: parsed.detailedExplanation,
                example: parsed.example,
                relatedTerms: parsed.relatedTerms || [],
                searchKeywords: parsed.searchKeywords || []
            };
        } catch (error) {
            console.error(`Error generating glossary term for "${term}":`, error);
            throw error;
        }
    }

    /**
     * Generate a blog post using AI
     */
    async generateBlogPost(title: string, category: string, keywords: string[]): Promise<BlogPost> {
        const prompt = `You are a financial content writer creating an SEO-optimized blog post for an Indian financial platform.

Write a comprehensive blog post with the following details:

Title: "${title}"
Category: ${category}
Target Keywords: ${keywords.join(', ')}

Provide the following in JSON format:
{
  "title": "${title}",
  "excerpt": "A compelling 150-character summary for cards/previews",
  "content": "Full article content in Markdown format (1500-2000 words). Include headings (##), bullet points, and clear structure.",
  "metaDescription": "SEO meta description (150-160 characters)",
  "metaKeywords": ["keyword1", "keyword2", ...], // 8-10 keywords
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title}",
    "description": "Article description",
    "author": {
      "@type": "Organization",
      "name": "InvestingPro"
    }
  }
}

Content Requirements:
1. Write for Indian audience (use ₹, Indian examples, Indian banks/products)
2. SEO-optimized with target keywords naturally integrated
3. Include practical examples with real numbers
4. Add a FAQ section at the end (5-7 questions)
5. Include actionable tips and takeaways
6. Use simple, clear language (Grade 8-10 reading level)
7. Add internal link suggestions [like this](slug-here)
8. Structure with clear headings and subheadings

Content Structure:
- Introduction (3-4 paragraphs)
- Main content (5-7 sections with headings)
- Key Takeaways (bullet points)
- FAQ section
- Conclusion

Make it engaging, informative, and actionable.`;

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert financial content writer specializing in Indian personal finance, with deep knowledge of banking, investments, insurance, and taxation in India.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 4000,
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0].message.content || '{}';
            const parsed = JSON.parse(content);

            // Create slug from title
            const slug = title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

            // Calculate reading time (assuming 200 words per minute)
            const wordCount = parsed.content.split(/\s+/).length;
            const readingTimeMinutes = Math.ceil(wordCount / 200);

            return {
                title: parsed.title || title,
                slug,
                category,
                excerpt: parsed.excerpt,
                content: parsed.content,
                metaDescription: parsed.metaDescription,
                metaKeywords: parsed.metaKeywords || [],
                schemaMarkup: parsed.schemaMarkup || {},
                readingTimeMinutes
            };
        } catch (error) {
            console.error(`Error generating blog post for "${title}":`, error);
            throw error;
        }
    }

    /**
     * Batch generate glossary terms for a category
     */
    async batchGenerateGlossary(terms: string[], category: string, batchSize: number = 5): Promise<void> {
        console.log(`Starting batch generation of ${terms.length} glossary terms for ${category}...`);
        
        for (let i = 0; i < terms.length; i += batchSize) {
            const batch = terms.slice(i, i + batchSize);
            console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(terms.length / batchSize)}...`);
            
            const promises = batch.map(async (term) => {
                try {
                    const glossaryTerm = await this.generateGlossaryTerm(term, category);
                    
                    // Save to database
                    const { data, error } = await this.supabase
                        .from('glossary_terms')
                        .insert({
                            term: glossaryTerm.term,
                            slug: glossaryTerm.slug,
                            category: glossaryTerm.category,
                            definition: glossaryTerm.definition,
                            detailed_explanation: glossaryTerm.detailedExplanation,
                            example: glossaryTerm.example,
                            related_terms: glossaryTerm.relatedTerms,
                            search_keywords: glossaryTerm.searchKeywords,
                            published: false, // Requires manual review first
                            ai_generated: true
                        });

                    if (error) {
                        console.error(`Error saving term "${term}":`, error);
                    } else {
                        console.log(`✅ Generated and saved: ${term}`);
                    }
                } catch (error) {
                    console.error(`Failed to generate term "${term}":`, error);
                }
            });

            await Promise.all(promises);
            
            // Rate limiting: wait 2 seconds between batches to avoid API limits
            if (i + batchSize < terms.length) {
                console.log('Waiting 2 seconds before next batch...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        console.log(`✅ Completed batch generation for ${category}`);
    }

    /**
     * Batch generate blog posts
     */
    async batchGenerateBlogPosts(
        postIdeas: Array<{ title: string; keywords: string[] }>,
        category: string,
        batchSize: number = 3
    ): Promise<void> {
        console.log(`Starting batch generation of ${postIdeas.length} blog posts for ${category}...`);
        
        for (let i = 0; i < postIdeas.length; i += batchSize) {
            const batch = postIdeas.slice(i, i + batchSize);
            console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(postIdeas.length / batchSize)}...`);
            
            const promises = batch.map(async (idea) => {
                try {
                    const post = await this.generateBlogPost(idea.title, category, idea.keywords);
                    
                    // Save to database
                    const { data, error } = await this.supabase
                        .from('blog_posts')
                        .insert({
                            title: post.title,
                            slug: post.slug,
                            category: post.category,
                            excerpt: post.excerpt,
                            content: post.content,
                            meta_description: post.metaDescription,
                            meta_keywords: post.metaKeywords,
                            schema_markup: post.schemaMarkup,
                            reading_time_minutes: post.readingTimeMinutes,
                            published: false, // Requires manual review
                            ai_generated: true,
                            ai_model: 'gpt-4'
                        });

                    if (error) {
                        console.error(`Error saving post "${idea.title}":`, error);
                    } else {
                        console.log(`✅ Generated and saved: ${idea.title}`);
                    }
                } catch (error) {
                    console.error(`Failed to generate post "${idea.title}":`, error);
                }
            });

            await Promise.all(promises);
            
            // Rate limiting: wait 3 seconds between batches (blog posts take longer)
            if (i + batchSize < postIdeas.length) {
                console.log('Waiting 3 seconds before next batch...');
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        
        console.log(`✅ Completed batch generation for ${category}`);
    }

    /**
     * Get content generation statistics
     */
    async getGenerationStats() {
        const [glossaryCount, blogCount, pendingQueue] = await Promise.all([
            this.supabase.from('glossary_terms').select('count').single(),
            this.supabase.from('blog_posts').select('count').single(),
            this.supabase.from('content_generation_queue').select('count').eq('status', 'pending').single()
        ]);

        return {
            glossaryTerms: glossaryCount.data?.count || 0,
            blogPosts: blogCount.data?.count || 0,
            pendingTasks: pendingQueue.data?.count || 0
        };
    }
}

// Singleton instance
export const aiContentGenerator = new AIContentGenerator();
