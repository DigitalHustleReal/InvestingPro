/**
 * Featured Image Generator using Flux.1
 * Generates high-quality images for articles
 */

import { logger } from '@/lib/logger';

interface ImageGenerationParams {
    title: string;
    keywords: string[];
    category: string;
}

interface GeneratedImage {
    url: string;
    width: number;
    height: number;
    format: string;
}

/**
 * Generate featured image using Flux.1 via Replicate
 */
export async function generateFeaturedImage(params: ImageGenerationParams): Promise<string | null> {
    const { title, keywords, category } = params;
    
    try {
        // Create optimized prompt for financial content
        const prompt = createImagePrompt(title, keywords, category);
        
        logger.info('Generating featured image', { title, prompt });
        
        // Use Replicate API for Flux.1
        const replicateToken = process.env.REPLICATE_API_TOKEN;
        
        if (!replicateToken) {
            logger.warn('REPLICATE_API_TOKEN not set, skipping image generation');
            return null;
        }
        
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${replicateToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                version: 'black-forest-labs/flux-schnell', // Fast, free tier
                input: {
                    prompt: prompt,
                    num_outputs: 1,
                    aspect_ratio: '16:9', // Perfect for featured images
                    output_format: 'webp',
                    output_quality: 90
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`Replicate API error: ${response.statusText}`);
        }
        
        const prediction = await response.json();
        
        // Poll for completion
        const imageUrl = await pollForCompletion(prediction.id, replicateToken);
        
        if (!imageUrl) {
            logger.warn('Image generation failed or timed out');
            return null;
        }
        
        // Upload to Supabase storage
        const publicUrl = await uploadToSupabase(imageUrl, title);
        
        logger.info('Featured image generated successfully', { publicUrl });
        
        return publicUrl;
        
    } catch (error) {
        logger.error('Failed to generate featured image', error as Error);
        return null;
    }
}

/**
 * Create optimized prompt for financial/investment images
 */
function createImagePrompt(title: string, keywords: string[], category: string): string {
    // Map categories to visual themes
    const themeMap: Record<string, string> = {
        'mutual-funds': 'modern financial charts, growth graphs, investment portfolio',
        'tax-planning': 'tax documents, calculator, financial planning, money management',
        'credit-cards': 'credit cards, digital payments, financial technology',
        'loans': 'home loan, financial documents, calculator, planning',
        'insurance': 'protection, security, family safety, financial shield',
        'stocks': 'stock market, trading charts, financial graphs',
        'banking': 'bank building, digital banking, financial services'
    };
    
    const theme = themeMap[category] || 'financial planning, money management';
    
    // Create professional, clean prompt
    const prompt = `
Professional financial illustration for article titled "${title}".
Style: Modern, clean, minimalist, professional business aesthetic.
Theme: ${theme}.
Colors: Blue, teal, white, professional corporate colors.
Elements: ${keywords.slice(0, 3).join(', ')}.
Mood: Trustworthy, professional, educational.
Quality: High-quality, sharp, well-composed, suitable for financial website.
No text, no people, abstract and professional.
    `.trim();
    
    return prompt;
}

/**
 * Poll Replicate API for completion
 */
async function pollForCompletion(predictionId: string, token: string, maxAttempts = 30): Promise<string | null> {
    for (let i = 0; i < maxAttempts; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
        
        const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
            headers: {
                'Authorization': `Token ${token}`,
            }
        });
        
        const prediction = await response.json();
        
        if (prediction.status === 'succeeded') {
            return prediction.output?.[0] || null;
        }
        
        if (prediction.status === 'failed') {
            logger.error('Image generation failed', new Error(prediction.error || 'Unknown Replicate error'));
            return null;
        }
        
        // Continue polling if still processing
    }
    
    logger.warn('Image generation timed out');
    return null;
}

/**
 * Upload image to Supabase storage
 */
async function uploadToSupabase(imageUrl: string, title: string): Promise<string> {
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Download image
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Generate filename
    const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    const filename = `featured/${slug}-${Date.now()}.webp`;
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
        .from('article-images')
        .upload(filename, imageBuffer, {
            contentType: 'image/webp',
            cacheControl: '31536000', // 1 year
            upsert: false
        });
    
    if (error) {
        throw new Error(`Supabase upload failed: ${error.message}`);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(filename);
    
    return publicUrl;
}

/**
 * Quick generation for existing article generator
 */
export async function generateFeaturedImageQuick(params: {
    articleTitle: string;
    category: string;
    keywords: string[];
}): Promise<string | null> {
    return generateFeaturedImage({
        title: params.articleTitle,
        keywords: params.keywords,
        category: params.category
    });
}
