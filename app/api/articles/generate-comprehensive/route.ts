import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';

/**
 * POST /api/articles/generate-comprehensive
 * Generate complete SEO-optimized article with all metadata
 */
export async function POST(request: NextRequest) {
    try {
        const { topic, category, targetKeywords, targetAudience, contentLength, wordCount, prompt } = await request.json();

        if (!topic) {
            return NextResponse.json(
                { success: false, error: 'Topic is required' },
                { status: 400 }
            );
        }

        // Call AI service with comprehensive prompt
        const aiResponse = await api.integrations.Core.InvokeLLM({
            prompt,
            contextData: { 
                topic, 
                category, 
                targetKeywords, 
                targetAudience, 
                contentLength,
                wordCount 
            },
            operation: 'article-generation',
            dataSources: [{
                source_type: 'internal',
                source_name: 'One-Click Article Generator',
                last_verified: new Date().toISOString(),
                confidence: 0.9
            }]
        });

        // Parse response (could be JSON string or object)
        let articleData: any;
        const rawContent = aiResponse.content || aiResponse.text || '';
        
        try {
            // Try to parse as JSON first
            let parsedContent: any;
            if (typeof rawContent === 'string') {
                // Remove markdown code blocks if present
                const cleaned = rawContent
                    .replace(/^```json\s*/i, '')
                    .replace(/^```\s*/i, '')
                    .replace(/\s*```$/i, '')
                    .trim();
                
                if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
                    parsedContent = JSON.parse(cleaned);
                } else {
                    parsedContent = null;
                }
            } else if (typeof rawContent === 'object') {
                parsedContent = rawContent;
            } else {
                parsedContent = null;
            }

            if (parsedContent && typeof parsedContent === 'object' && !Array.isArray(parsedContent)) {
                // Valid JSON object
                articleData = parsedContent;
                
                // Ensure content is HTML formatted
                if (articleData.content && !articleData.content.includes('<')) {
                    // Convert markdown/plain text to HTML
                    articleData.content = convertToHTML(articleData.content);
                }
            } else {
                // Not JSON, create structured response from raw content
                articleData = createArticleFromContent(rawContent, topic, category, targetKeywords);
            }
        } catch (parseError: any) {
            logger.warn('JSON parsing failed, creating article from content', { error: parseError.message });
            // If parsing fails, create structured response from raw content
            articleData = createArticleFromContent(rawContent, topic, category, targetKeywords);
        }

        // Ensure all required fields
        const title = articleData.title || `${topic} - Complete Guide`;
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        const seoTitle = articleData.seo_title || title;
        const metaDescription = articleData.meta_description || articleData.seo_description || articleData.excerpt || 
            `Complete guide about ${topic} for Indian investors. Learn everything you need to know.`;

        // Extract keywords and tags
        const keywords = Array.isArray(articleData.keywords) 
            ? articleData.keywords 
            : (articleData.keywords ? articleData.keywords.split(',').map((k: string) => k.trim()) : [topic]);
        
        const tags = Array.isArray(articleData.tags)
            ? articleData.tags
            : (articleData.tags ? articleData.tags.split(',').map((t: string) => t.trim()) : [category]);

        // Calculate SEO score
        const seoScore = articleData.seo_score || calculateSEOScore({
            title: seoTitle,
            metaDescription,
            content: articleData.content,
            keywords,
        });

        // Ensure content is not empty
        const finalContent = articleData.content || '';
        if (!finalContent || finalContent.trim().length === 0) {
            logger.error('Generated article has no content', { topic, category });
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Generated article has no content. Please try again or check AI service configuration.',
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            article: {
                title,
                slug,
                content: finalContent,
                excerpt: articleData.excerpt || metaDescription.substring(0, 150) || finalContent.substring(0, 150),
                seo_title: seoTitle,
                meta_description: metaDescription,
                keywords,
                tags,
                category: category || 'investing-basics',
                read_time: articleData.read_time || Math.ceil((finalContent.split(/\s+/) || []).length / 200),
                word_count: articleData.word_count || (finalContent.split(/\s+/) || []).length,
                seo_score: seoScore,
                status: 'draft',
                ai_generated: true,
                seo_analysis: articleData.seo_analysis || {
                    title_length: seoTitle.length,
                    meta_description_length: metaDescription.length,
                    keyword_density: calculateKeywordDensity(finalContent, keywords),
                    headings_count: (finalContent.match(/<h[2-3]>/gi) || []).length,
                    recommendations: generateSEORecommendations(seoTitle, metaDescription, finalContent, keywords),
                },
            }
        });
    } catch (error: any) {
        logger.error('Comprehensive article generation failed', error);
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

// Helper: Calculate SEO score
function calculateSEOScore({ title, metaDescription, content, keywords }: {
    title: string;
    metaDescription: string;
    content: string;
    keywords: string[];
}): number {
    let score = 0;
    let maxScore = 0;

    // Title (20 points)
    maxScore += 20;
    if (title.length >= 30 && title.length <= 60) score += 20;
    else if (title.length > 0 && title.length < 70) score += 15;
    else score += 10;

    // Meta Description (20 points)
    maxScore += 20;
    if (metaDescription.length >= 120 && metaDescription.length <= 155) score += 20;
    else if (metaDescription.length > 0 && metaDescription.length < 160) score += 15;
    else score += 10;

    // Content Length (20 points)
    maxScore += 20;
    const wordCount = content.split(/\s+/).length;
    if (wordCount >= 1500) score += 20;
    else if (wordCount >= 1000) score += 15;
    else if (wordCount >= 500) score += 10;
    else score += 5;

    // Headings (15 points)
    maxScore += 15;
    const headings = (content.match(/<h[2-3]>/gi) || []).length;
    if (headings >= 3) score += 15;
    else if (headings >= 2) score += 10;
    else if (headings >= 1) score += 5;

    // Keywords (15 points)
    maxScore += 15;
    if (keywords.length >= 3) score += 15;
    else if (keywords.length >= 2) score += 10;
    else if (keywords.length >= 1) score += 5;

    // Keyword Density (10 points)
    maxScore += 10;
    const density = calculateKeywordDensity(content, keywords);
    if (density >= 1 && density <= 2) score += 10;
    else if (density > 0 && density < 3) score += 7;
    else score += 3;

    return Math.round((score / maxScore) * 100);
}

// Helper: Calculate keyword density
function calculateKeywordDensity(content: string, keywords: string[]): number {
    if (!content || keywords.length === 0) return 0;
    
    const wordCount = content.split(/\s+/).length;
    if (wordCount === 0) return 0;

    let keywordCount = 0;
    const lowerContent = content.toLowerCase();
    keywords.forEach(keyword => {
        const regex = new RegExp(keyword.toLowerCase(), 'gi');
        keywordCount += (lowerContent.match(regex) || []).length;
    });

    return (keywordCount / wordCount) * 100;
}

// Helper: Convert plain text/markdown to HTML
function convertToHTML(text: string): string {
    if (!text) return '';
    
    // Split into paragraphs
    let html = text
        .split(/\n\n+/)
        .map(para => {
            para = para.trim();
            if (!para) return '';
            
            // Check if it's a heading
            if (para.match(/^#{1,3}\s+/)) {
                const level = para.match(/^(#{1,3})/)?.[1].length || 2;
                const text = para.replace(/^#{1,3}\s+/, '');
                return `<h${level}>${text}</h${level}>`;
            }
            
            // Check if it's a list item
            if (para.match(/^[-*•]\s+/)) {
                const items = para.split(/\n/).filter(line => line.trim().match(/^[-*•]\s+/));
                if (items.length > 0) {
                    const listItems = items.map(item => 
                        `<li>${item.replace(/^[-*•]\s+/, '').trim()}</li>`
                    ).join('');
                    return `<ul>${listItems}</ul>`;
                }
            }
            
            // Check if it's a numbered list
            if (para.match(/^\d+\.\s+/)) {
                const items = para.split(/\n/).filter(line => line.trim().match(/^\d+\.\s+/));
                if (items.length > 0) {
                    const listItems = items.map(item => 
                        `<li>${item.replace(/^\d+\.\s+/, '').trim()}</li>`
                    ).join('');
                    return `<ol>${listItems}</ol>`;
                }
            }
            
            // Regular paragraph
            return `<p>${para}</p>`;
        })
        .filter(Boolean)
        .join('\n');
    
    return html;
}

// Helper: Create article structure from plain content
function createArticleFromContent(content: string, topic: string, category: string, keywords: string[]): any {
    // Extract title from first line or generate
    const lines = content.split('\n').filter(l => l.trim());
    let title = lines[0]?.replace(/^#+\s*/, '').trim() || `${topic} - Complete Guide`;
    
    // Remove title from content if it was there
    let articleContent = content;
    if (lines[0] && lines[0].match(/^#+\s+/)) {
        articleContent = lines.slice(1).join('\n');
    }
    
    // Convert to HTML
    const htmlContent = convertToHTML(articleContent);
    
    // Extract excerpt
    const plainText = articleContent.replace(/[#*`]/g, '').replace(/\n+/g, ' ').trim();
    const excerpt = plainText.substring(0, 150).trim() + (plainText.length > 150 ? '...' : '');
    
    // Generate keywords if not provided
    const finalKeywords = keywords.length > 0 ? keywords : [
        topic.toLowerCase(),
        ...topic.split(' ').map(w => w.toLowerCase()),
        category
    ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 8);
    
    // Generate tags
    const tags = [
        category,
        ...finalKeywords.slice(0, 5)
    ].filter((v, i, a) => a.indexOf(v) === i);
    
    // Calculate word count
    const wordCount = plainText.split(/\s+/).filter(w => w.length > 0).length;
    
    return {
        title: title.substring(0, 60), // Ensure title is within SEO limits
        seo_title: title.substring(0, 60),
        meta_description: excerpt.substring(0, 155),
        content: htmlContent || `<p>${plainText}</p>`,
        excerpt: excerpt.substring(0, 150),
        keywords: finalKeywords,
        tags: tags,
        read_time: Math.max(1, Math.ceil(wordCount / 200)),
        word_count: wordCount,
        seo_score: 75, // Will be recalculated
    };
}

// Helper: Generate SEO recommendations
function generateSEORecommendations(title: string, metaDescription: string, content: string, keywords: string[]): string[] {
    const recommendations: string[] = [];

    if (title.length < 30) {
        recommendations.push('Title is too short. Aim for 30-60 characters.');
    } else if (title.length > 60) {
        recommendations.push('Title is too long. Keep it under 60 characters.');
    }

    if (metaDescription.length < 120) {
        recommendations.push('Meta description is too short. Aim for 120-155 characters.');
    } else if (metaDescription.length > 155) {
        recommendations.push('Meta description is too long. Keep it under 155 characters.');
    }

    const wordCount = content.split(/\s+/).length;
    if (wordCount < 1000) {
        recommendations.push('Content is too short. Aim for at least 1000 words for better SEO.');
    }

    const headings = (content.match(/<h[2-3]>/gi) || []).length;
    if (headings < 3) {
        recommendations.push('Add more H2/H3 headings to improve structure and SEO.');
    }

    const density = calculateKeywordDensity(content, keywords);
    if (density < 1) {
        recommendations.push('Increase keyword usage naturally throughout the content.');
    } else if (density > 2.5) {
        recommendations.push('Keyword density is too high. Reduce to 1-2% for better SEO.');
    }

    return recommendations;
}

