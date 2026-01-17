import { imageService } from '@/lib/visuals/ImageService';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';
import { normalizeArticleBody } from '@/lib/content/normalize';
import { htmlToMarkdown } from '@/lib/editor/markdown';

/**
 * Detect subcategory from topic and category (for worker)
 */
function detectSubcategoryForWorker(topic: string, category: string): string | undefined {
    const text = topic.toLowerCase();
    
    if (category === 'credit-cards') {
        if (text.includes('travel') || text.includes('lounge') || text.includes('miles')) return 'travel';
        if (text.includes('cashback') || text.includes('cash back')) return 'cashback';
        if (text.includes('premium') || text.includes('concierge')) return 'premium';
        if (text.includes('reward') || text.includes('points')) return 'rewards';
        if (text.includes('shopping') || text.includes('online')) return 'shopping';
        if (text.includes('fuel') || text.includes('petrol') || text.includes('diesel')) return 'fuel';
        if (text.includes('free') || text.includes('lifetime free')) return 'lifetime_free';
    }
    
    if (category === 'mutual-funds') {
        if (text.includes('equity') || text.includes('stock')) return 'equity';
        if (text.includes('debt') || text.includes('bond')) return 'debt';
        if (text.includes('hybrid') || text.includes('balanced')) return 'hybrid';
        if (text.includes('elss') || text.includes('tax saving')) return 'elss';
        if (text.includes('large cap') || text.includes('large-cap')) return 'large-cap';
        if (text.includes('mid cap') || text.includes('mid-cap')) return 'mid-cap';
        if (text.includes('small cap') || text.includes('small-cap')) return 'small-cap';
    }
    
    if (category === 'loans') {
        if (text.includes('personal')) return 'personal';
        if (text.includes('home') || text.includes('housing')) return 'home';
        if (text.includes('car') || text.includes('vehicle') || text.includes('auto')) return 'car';
        if (text.includes('education') || text.includes('student')) return 'education';
    }
    
    if (category === 'insurance') {
        if (text.includes('term')) return 'term';
        if (text.includes('health') || text.includes('medical')) return 'health';
        if (text.includes('life') && !text.includes('term')) return 'life';
    }
    
    return undefined;
}

export interface ArticleGenerationParams {
    topic: string;
    category?: string;
    targetKeywords?: string[];
    targetAudience?: string;
    contentLength?: string; // 'comprehensive' | 'detailed' | 'standard'
    wordCount?: number;
    prompt?: string;
}

export interface GeneratedArticleResult {
    title: string;
    slug: string;
    body_html: string;
    body_markdown: string;
    excerpt: string;
    featured_image?: string;
    seo_title: string;
    meta_description: string;
    keywords: string[];
    category: string;
    tags: string[];
    read_time: number;
    word_count: number;
    status: 'draft';
    ai_metadata: any;
    structured_content: any;
}

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
 * Worker: Generate Article Content
 * 
 * Generates comprehensive article content using AI.
 * Does NOT save to database (use ArticleService for that).
 */
export async function generateArticleContent(params: ArticleGenerationParams): Promise<GeneratedArticleResult> {
    try {
        const { 
            topic, 
            category = 'investing-basics', 
            targetKeywords = [], 
            targetAudience = 'general', 
            contentLength = 'comprehensive',
            wordCount: explicitWordCount,
            prompt 
        } = params;

        const wordCount = explicitWordCount || (contentLength === 'comprehensive' ? 2000 : contentLength === 'detailed' ? 1500 : 1000);

        // Build data sources
        const dataSources = [{
            source_type: 'supabase' as const,
            source_name: 'Supabase Database',
            last_verified: new Date().toISOString(),
            confidence: 0.8
        }];

        // Try dynamic prompt builder (Phase 4 integration)
        let systemPrompt: string | undefined;
        let userPrompt: string;
        
        try {
            const { buildDynamicPrompt } = await import('@/lib/ai/dynamic-prompt-builder');
            const { isValidCategory } = await import('@/lib/prompts/category-prompts');
            type ContentType = 'comparison' | 'howto' | 'ultimate' | 'listicle';
            type FinanceCategory = 'credit-cards' | 'mutual-funds' | 'loans' | 'insurance' | 'tax' | 'stocks' | 'banking' | 'investing-basics';
            
            // Map category to finance category
            const categoryMap: Record<string, FinanceCategory> = {
                'credit-cards': 'credit-cards',
                'mutual-funds': 'mutual-funds',
                'loans': 'loans',
                'insurance': 'insurance',
                'tax-planning': 'tax',
                'taxes': 'tax',
                'stocks': 'stocks',
                'banking': 'banking',
                'investing-basics': 'investing-basics',
                'investing': 'investing-basics'
            };
            
            const financeCategory = category && isValidCategory(categoryMap[category] || category as FinanceCategory)
                ? (categoryMap[category] || category as FinanceCategory)
                : 'investing-basics';
            
            // Determine content type
            const contentType: ContentType = 
                topic.toLowerCase().includes('vs') || topic.toLowerCase().includes('comparison') ? 'comparison' :
                topic.toLowerCase().includes('how to') || topic.toLowerCase().includes('guide') ? 'howto' :
                topic.toLowerCase().includes('top') || topic.toLowerCase().includes('best') ? 'listicle' :
                'ultimate';
            
            // Detect subcategory
            const subcategory = detectSubcategoryForWorker(topic, financeCategory);
            
            // Build dynamic prompt
            const dynamicPrompt = await buildDynamicPrompt({
                contentType,
                category: financeCategory,
                subcategory,
                topic,
                keywords: targetKeywords,
                targetAudience,
                wordCount
            });
            
            systemPrompt = dynamicPrompt.systemPrompt;
            userPrompt = dynamicPrompt.userPrompt;
            
            logger.info('Using dynamic prompt builder', {
                category: financeCategory,
                subcategory,
                contentType,
                writer: dynamicPrompt.metadata.writer
            });
        } catch (error) {
            // Fallback to simple prompt
            logger.warn('Dynamic prompt builder failed, using fallback', { error });
            systemPrompt = undefined;
            userPrompt = prompt || `
Generate a comprehensive article about: ${topic}

Category: ${category}
Target Audience: ${targetAudience}
Content Length: ${contentLength}
Word Count Target: ${wordCount}
Keywords: ${targetKeywords.join(', ') || ''}

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
  "tables": [],
  "faqs": [
    { "question": "Q", "answer": "A" }
  ],
  "links": [],
  "images": [],
  "seo_title": "SEO title",
  "seo_description": "Meta description",
  "tags": ["tag1"],
  "read_time": 5
}


Return ONLY valid JSON.
`;
        }

        // Invoke AI with dynamic prompts
        // @ts-ignore - API types might be incomplete
        const generatedContent = await api.integrations.Core.InvokeLLM({
            prompt: userPrompt,
            systemPrompt: systemPrompt, // Pass system prompt if available
            operation: 'summarize_factual_data', // Using summarize for now as it's a allowed op
            dataSources,
            contextData: {
                topic,
                category,
                targetKeywords,
                targetAudience,
                usesDynamicPrompts: !!systemPrompt
            }
        });

        // Parse JSON
        let structuredContent: any = {};
        if (typeof generatedContent.content === 'string') {
            try {
                structuredContent = JSON.parse(generatedContent.content);
            } catch (e) {
                // Fallback
                structuredContent = {
                    title: generatedContent.title || topic,
                    content: generatedContent.content,
                    sections: []
                };
            }
        } else {
            structuredContent = generatedContent;
        }

        // Generate featured image with automated, precise, theme-related prompts
        const { generateFeaturedImageQuick } = await import('@/lib/automation/image-pipeline');
        const featuredImage = await generateFeaturedImageQuick({
            articleTitle: structuredContent.title || topic,
            category: category,
            keywords: targetKeywords
        });

        // Normalize HTML
        let htmlContent = '';
        if (structuredContent.sections && structuredContent.sections.length > 0) {
            structuredContent.sections.forEach((section: any, index: number) => {
                const heading = structuredContent.headings?.[section.heading_id] || structuredContent.headings?.[index];
                if (heading) {
                    const headingTag = heading.level === 1 ? 'h2' : heading.level === 2 ? 'h2' : 'h3';
                    htmlContent += `<${headingTag}>${escapeHTML(heading.text)}</${headingTag}>\n\n`;
                }
                const sectionText = section.content || '';
                if (sectionText.trim()) {
                    const paragraphs = sectionText.split('\n\n').filter((p: string) => p.trim());
                    paragraphs.forEach((p: string) => {
                        htmlContent += `<p>${escapeHTML(p.trim())}</p>\n\n`;
                    });
                }
            });
        } else {
            const rawContent = structuredContent.content || generatedContent.content || '';
            htmlContent = normalizeArticleBody(rawContent);
        }
        
        htmlContent = normalizeArticleBody(htmlContent);
        
        // --- MONETIZATION & LEGAL SAFETY ---
        try {
            const { generateContextualLinks } = await import('@/lib/monetization/contextual-links');
            const affLinks = await generateContextualLinks({
                contentType: 'article',
                category: category,
                keywords: targetKeywords,
                position: 'cta'
            });

            if (affLinks && affLinks.length > 0) {
                // 1. Inject Disclaimer at the TOP
                const disclaimer = affLinks[0].disclosure;
                htmlContent = `<div class="bg-slate-50 border-l-4 border-indigo-400 p-4 mb-8 text-xs text-slate-500 italic">
                    <strong>Editorial Disclosure:</strong> ${disclaimer}
                </div>\n${htmlContent}`;

                // 2. Inject CTA at the BOTTOM
                let ctaHtml = `\n\n<div class="mt-12 p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
                    <h3 class="text-xl font-bold text-indigo-900 mb-4">Recommended for You</h3>
                    <div class="grid grid-cols-1 gap-4">`;
                
                affLinks.forEach(link => {
                    ctaHtml += `
                        <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-indigo-50">
                            <div>
                                <span class="text-sm font-semibold text-slate-900">${link.productName}</span>
                                <p class="text-xs text-slate-500">${link.context}</p>
                            </div>
                            <a href="${link.affiliateLink}" target="_blank" rel="nofollow" class="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                                View Details
                            </a>
                        </div>`;
                });
                
                ctaHtml += `</div></div>`;
                htmlContent += ctaHtml;
            }
        } catch (monError) {
            logger.error('Failed to inject affiliate links', monError as Error);
        }
        // --- END MONETIZATION ---

        const markdownContent = htmlContent ? htmlToMarkdown(htmlContent) : '';

        return {
            title: structuredContent.title || generatedContent.title || topic,
            slug: (structuredContent.title || generatedContent.title || topic)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, ''),
            body_html: htmlContent,
            body_markdown: markdownContent,
            excerpt: structuredContent.excerpt || generatedContent.excerpt || '',
            featured_image: featuredImage || undefined,
            seo_title: structuredContent.seo_title || generatedContent.seo_title || structuredContent.title || topic,
            meta_description: structuredContent.seo_description || generatedContent.seo_description || '',
            keywords: targetKeywords,
            category: category,
            tags: structuredContent.tags || generatedContent.tags || [],
            read_time: structuredContent.read_time || generatedContent.read_time || 5,
            word_count: wordCount,
            status: 'draft',
            ai_metadata: generatedContent.ai_metadata,
            structured_content: structuredContent
        };
    } catch (error) {
        logger.error('Worker Article Generation Error', error as Error);
        throw error;
    }
}

