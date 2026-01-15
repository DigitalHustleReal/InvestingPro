/**
 * Auto Featured Image API Route  
 * Smart priority: Library → Stock Photos → AI Generation
 * With variety management to avoid repetition
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { contentAwareRecommender } from '@/lib/media/content-aware-recommender';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, keywords = [], category = '', content, tone, style } = body;

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        console.log('🎨 Auto-selecting featured image...', { title, keywords, category });

        // PRIORITY 1: Content-Aware Media Library Search (Enhanced)
        try {
            const recommendations = await contentAwareRecommender.recommendImages({
                articleTitle: title,
                articleContent: content,
                category: category || '',
                keywords: keywords.length > 0 ? keywords : extractKeywords(title, category),
                tone: tone || 'professional',
                style: style || 'modern'
            });

            if (recommendations.length > 0) {
                const bestMatch = recommendations[0];
                console.log('✅ Found content-aware match in Media Library!', {
                    score: bestMatch.relevanceScore,
                    reasons: bestMatch.matchReasons
                });
                
                // Track usage
                if (bestMatch.id) {
                    // Usage tracking would happen when article is saved
                }
                
                // Compare with stock photos for variety
                const stockResult = await searchStockPhotos(
                    keywords.length > 0 ? keywords : extractKeywords(title, category),
                    request
                );
                
                return NextResponse.json({
                    url: bestMatch.publicUrl,
                    source: 'media-library',
                    keyword: bestMatch.title || bestMatch.altText || 'content-aware',
                    message: `Using content-aware recommendation from library (relevance: ${(bestMatch.relevanceScore * 100).toFixed(0)}%)`,
                    alternatives: stockResult ? [stockResult] : [],
                    recommendations: recommendations.slice(1, 4).map(r => ({
                        url: r.publicUrl,
                        score: r.relevanceScore,
                        reasons: r.matchReasons
                    }))
                });
            }
        } catch (error) {
            console.warn('Content-aware recommendation failed, falling back to basic search:', error);
        }

        // FALLBACK: Basic Media Library Search
        const searchKeywords = keywords.length > 0 
            ? keywords 
            : extractKeywords(title, category);

        console.log('📋 Keywords:', searchKeywords);

        const libraryResult = await searchMediaLibrary(searchKeywords);
        if (libraryResult) {
            console.log('✅ Found in Media Library (basic search)!');
            
            const stockResult = await searchStockPhotos(searchKeywords, request);
            
            return NextResponse.json({
                url: libraryResult.url,
                source: 'media-library',
                keyword: libraryResult.keyword,
                message: `Using existing image from library (keyword: "${libraryResult.keyword}")`,
                alternatives: stockResult ? [stockResult] : []
            });
        }

        console.log('📁 No images in media library, checking stock photos...');

        // PRIORITY 2: Search Stock Photos (free)
        const stockResult = await searchStockPhotos(searchKeywords, request);
        if (stockResult) {
            console.log('✅ Found on stock photo sites!');
            return NextResponse.json({
                url: stockResult.url,
                source: stockResult.source,
                keyword: stockResult.keyword,
                message: `Selected from ${stockResult.source} (keyword: "${stockResult.keyword}")`
            });
        }

        console.log('📸 No stock photos found, trying AI generation...');

        // PRIORITY 3: Generate with AI (paid - last resort)
        const aiResult = await generateWithAI(title, category);
        if (aiResult) {
            console.log('✅ Generated with AI!');
            return NextResponse.json({
                url: aiResult.url,
                source: 'ai-generated',
                keyword: title,
                message: 'Generated custom image with AI'
            });
        }

        // No options available
        return NextResponse.json({
            error: 'Could not find or generate image. Add stock photo API keys or OpenAI key.'
        }, { status: 404 });
        
    } catch (error: any) {
        console.error('❌ Auto featured image error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to select image'
        }, { status: 500 });
    }
}

/**
 * PRIORITY 1: Search Media Library
 */
async function searchMediaLibrary(keywords: string[]) {
    try {
        for (const keyword of keywords) {
            const { data, error } = await supabase
                .from('media')
                .select('id, public_url, title')
                .ilike('title', `%${keyword}%`)
                .limit(5);

            if (error) {
                console.error('Media library search error:', error);
                continue;
            }

            if (data && data.length > 0) {
                // Pick random to add variety
                const randomIndex = Math.floor(Math.random() * data.length);
                const selected = data[randomIndex];
                
                return {
                    url: selected.public_url,
                    keyword,
                    id: selected.id
                };
            }
        }
    } catch (error) {
        console.error('Media library search failed:', error);
    }
    
    return null;
}

/**
 * PRIORITY 2: Search Stock Photos
 */
async function searchStockPhotos(keywords: string[], request: NextRequest) {
    for (const keyword of keywords) {
        try {
            const stockUrl = `${request.nextUrl.origin}/api/stock-photos?query=${encodeURIComponent(keyword)}&page=1`;
            const response = await fetch(stockUrl);
            
            if (!response.ok) continue;
            
            const data = await response.json();
            
            if (data.photos && data.photos.length > 0) {
                // Pick random for variety
                const randomIndex = Math.floor(Math.random() * Math.min(data.photos.length, 5));
                const photo = data.photos[randomIndex];
                
                return {
                    url: photo.url,
                    source: photo.source,
                    keyword
                };
            }
        } catch (error) {
            console.error(`Stock photo search failed for "${keyword}":`, error);
            continue;
        }
    }
    
    return null;
}

/**
 * PRIORITY 3: Generate with AI
 */
async function generateWithAI(title: string, category: string) {
    try {
        // Check if OpenAI key is configured
        if (!process.env.OPENAI_API_KEY) {
            console.log('⚠️ OpenAI API key not configured');
            return null;
        }

        const { generateFeaturedImage } = await import('@/lib/ai/image-generator');
        const imageUrl = await generateFeaturedImage(title, category);
        
        if (imageUrl) {
            return {
                url: imageUrl,
                source: 'ai-generated'
            };
        }
    } catch (error) {
        console.error('AI generation failed:', error);
    }
    
    return null;
}

/**
 * Extract keywords from title and category
 */
function extractKeywords(title: string, category: string): string[] {
    const keywords: string[] = [];

    // Add category first (most relevant)
    if (category) {
        keywords.push(category.replace(/-/g, ' '));
    }

    // Extract significant words from title
    const words = title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(' ')
        .filter(w => w.length > 3 && !isStopWord(w));

    keywords.push(...words.slice(0, 3));

    // Generic finance fallbacks
    keywords.push('finance', 'money', 'business', 'investment');

    return keywords;
}

function isStopWord(word: string): boolean {
    const stopWords = ['the', 'and', 'for', 'with', 'from', 'what', 'when', 'where', 'how', 'why', 'this', 'that', 'your', 'best', 'top'];
    return stopWords.includes(word);
}
