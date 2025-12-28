import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

const openai = typeof window === 'undefined' && process.env.OPENAI_API_KEY 
    ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    : null;

export interface ImageGenerationRequest {
    article_id?: string;
    image_type: 'feature' | 'social' | 'thumbnail' | 'infographic' | 'graphic';
    prompt: string;
    size?: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024';
    style?: string;
    brand_colors?: string[];
}

export interface GeneratedImage {
    id?: string;
    article_id?: string;
    image_type: string;
    prompt_used: string;
    image_url: string;
    provider?: string;
    generation_params?: any;
    brand_colors?: string[];
}

/**
 * Image Generation Service
 * 
 * Generates images using AI (DALL-E)
 */
export class ImageGenerationService {
    /**
     * Generate image using DALL-E
     */
    async generateImage(request: ImageGenerationRequest): Promise<string> {
        if (!openai) {
            throw new Error("OpenAI API key not configured");
        }

        try {
            const size = request.size || '1024x1024';
            
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: request.prompt,
                n: 1,
                size: size as any,
                quality: "standard",
                response_format: "url"
            });

            const imageUrl = response.data[0]?.url;
            if (!imageUrl) {
                throw new Error("No image URL returned from OpenAI");
            }

            return imageUrl;
        } catch (error) {
            logger.error("Error generating image", error instanceof Error ? error : new Error(String(error)), { request });
            throw error;
        }
    }

    /**
     * Generate feature image for article
     */
    async generateFeatureImage(
        articleTitle: string,
        articleId?: string,
        brandColors?: string[]
    ): Promise<GeneratedImage> {
        // Build prompt from article title
        const prompt = this.buildFeatureImagePrompt(articleTitle, brandColors);

        const imageUrl = await this.generateImage({
            article_id: articleId,
            image_type: 'feature',
            prompt,
            size: '1024x1024',
            brand_colors: brandColors
        });

        const generatedImage: GeneratedImage = {
            article_id: articleId,
            image_type: 'feature',
            prompt_used: prompt,
            image_url: imageUrl,
            provider: 'dalle',
            generation_params: {
                size: '1024x1024',
                model: 'dall-e-3'
            },
            brand_colors: brandColors
        };

        // Save to database if article_id provided
        if (articleId) {
            await this.saveImage(generatedImage);
        }

        return generatedImage;
    }

    /**
     * Build feature image prompt from article title
     */
    private buildFeatureImagePrompt(title: string, brandColors?: string[]): string {
        const colorHint = brandColors && brandColors.length > 0 
            ? ` Use colors: ${brandColors.join(', ')}.`
            : '';
        
        return `Professional, modern feature image for article: "${title}". Style: Clean, business/financial theme, suitable for blog header.${colorHint} No text overlay. High quality, visually appealing.`;
    }

    /**
     * Save generated image to database
     */
    async saveImage(image: GeneratedImage): Promise<string> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('generated_images')
                .insert({
                    article_id: image.article_id,
                    image_type: image.image_type,
                    prompt_used: image.prompt_used,
                    image_url: image.image_url,
                    provider: image.provider || 'dalle',
                    generation_params: image.generation_params,
                    brand_colors: image.brand_colors,
                    is_active: true
                })
                .select('id')
                .single();

            if (error) throw error;
            return data.id;
        } catch (error) {
            logger.error("Error saving generated image", error instanceof Error ? error : new Error(String(error)), { image });
            throw error;
        }
    }

    /**
     * Get brand color palette
     */
    async getBrandColors(): Promise<Array<{ id: string; color_name: string; hex_code: string }>> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('brand_color_palette')
                .select('id, color_name, hex_code')
                .eq('is_active', true)
                .order('color_name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error("Error fetching brand colors", error instanceof Error ? error : new Error(String(error)));
            return [];
        }
    }

    /**
     * Get images for article
     */
    async getArticleImages(articleId: string): Promise<GeneratedImage[]> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('generated_images')
                .select('*')
                .eq('article_id', articleId)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error("Error fetching article images", error instanceof Error ? error : new Error(String(error)), { articleId });
            throw error;
        }
    }
}

export const imageGenerationService = new ImageGenerationService();

