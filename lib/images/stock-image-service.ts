/**
 * 📸 STOCK IMAGE SERVICE
 * 
 * Unifies access to:
 * 1. Pexels (Real high-quality photography)
 * 2. Pixabay (Community stock photos)
 * 3. Pollinations.ai (AI Fallback)
 * 
 * Goal: meaningful, human-centric financial imagery.
 */

import axios from 'axios';
import { logger } from "@/lib/logger";

interface ImageResult {
    url: string;
    alt: string; // Photographer credit / Description
    source: 'unsplash' | 'pexels' | 'pixabay' | 'freepik' | 'pollinations';
}

// Smart mapping for ambiguous or complex financial terms
const KEYWORD_MAP: Record<string, string> = {
    'sip': 'growing money plant jar',
    'mutual fund': 'stock market graph analysis',
    'tax': 'income tax india calculation',
    '80c': 'saving money pig',
    'nps': 'retirement planning couple',
    'ppf': 'indian government bond document',
    'fd': 'fixed deposit certificate bank',
    'budget': 'calculator financial planning',
    'insurance': 'umbrella protection family',
    'market': 'stock exchange bull bear',
    'gold': 'gold coins jewellery investment',
    'crypto': 'bitcoin digital currency',
    'loan': 'home keys loan agreement',
    'credit card': 'credit card payment machine',
    'emergency': 'emergency glass hammer money'
};

export class StockImageService {
    private pexelsKey: string | undefined;
    private pixabayKey: string | undefined;
    private freepikKey: string | undefined;
    private unsplashKey: string | undefined;

    constructor() {
        this.pexelsKey = process.env.PEXELS_API_KEY || 'PwXCmeo4jefIBHvVQO1yBKuPoD2OKyvxvnup0N68wotIq5cldWdyRqlR';
        this.pixabayKey = process.env.PIXABAY_API_KEY || '49964802-81f83edc4f18ee975423b511f';
        this.freepikKey = process.env.FREEPIK_API_KEY || 'FPSX90d2056823ae57c2d1c66e0c10baeb5d';
        this.unsplashKey = process.env.UNSPLASH_ACCESS_KEY || 'IUrwmrGaNkIyc_xurixdcaR0b5fBtiqErUiXL3eqruU';
    }

    /**
     * Get the best featured image for a financial topic
     */
    async getFeaturedImage(topic: string, context: string = 'finance'): Promise<ImageResult> {
        // 1. Smart Keyword Extraction
        const searchTerm = this.extractSearchTerm(topic);
        logger.info(`🖼️ Searching images for: "${searchTerm}" (derived from "${topic}")`);

        // 2. Try Pixabay (Best for general illustrations)
        if (this.pixabayKey) {
            try {
                const img = await this.searchPixabay(searchTerm);
                if (img) return img;
            } catch (e) {
                logger.error('Pixabay search failed:', e);
            }
        }

        // 3. Try Unsplash (Best for high-quality photos)
        if (this.unsplashKey) {
            try {
                const img = await this.searchUnsplash(searchTerm);
                if (img) return img;
            } catch (e) {
                logger.error('Unsplash search failed:', e);
            }
        }
        
        // 4. Try Pexels (Good backup)
        if (this.pexelsKey) {
            try {
                const img = await this.searchPexels(searchTerm, context);
                if (img) return img;
            } catch (e) {
                logger.error('Pexels search failed:', e);
            }
        }

        // 5. Try Freepik (Last resort for stock)
        if (this.freepikKey) {
            try {
                const img = await this.searchFreepik(searchTerm);
                if (img) return img;
            } catch (e) {
                // Silent fail
            }
        }
        
        // 6. Fallback to AI (Pollinations - Flux Model)
        logger.info('⚠️ Stock images not found. Falling back to AI Generation (Flux).');
        return this.generateAIImage(searchTerm); // Use searchTerm, not full topic
    }

    private extractSearchTerm(topic: string): string {
        const lowerTopic = topic.toLowerCase();

        // 1. Check explicit mappings first
        for (const [key, value] of Object.entries(KEYWORD_MAP)) {
            if (lowerTopic.includes(key)) {
                return value;
            }
        }

        // 2. Clean common garbage words
        const clean = topic
            .replace(/Guide|Complete|Beginners|How to|Start|In India|2026|Best|Review|Top|Vs|Difference|What is/gi, '')
            .replace(/[0-9]/g, '') // Remove numbers like 2026, 80C (unless mapped)
            .trim();

        // 3. If too short, fallback to generic
        if (clean.length < 3) return 'finance investment india';

        // 4. Append context
        return `${clean} finance`;
    }

    private async searchUnsplash(query: string): Promise<ImageResult | null> {
        const response = await axios.get(`https://api.unsplash.com/search/photos`, {
            headers: { 'Authorization': `Client-ID ${this.unsplashKey}` },
            params: {
                query: query, 
                per_page: 5,
                orientation: 'landscape',
                content_filter: 'high',
                order_by: 'relevant' // KEY: Relevance, not recent
            }
        });

        if (response.data.results && response.data.results.length > 0) {
            // STRICTLY take the first result (most relevant)
            const photo = response.data.results[0];
            return {
                url: photo.urls.regular,
                alt: `Photo by ${photo.user.name} on Unsplash`,
                source: 'unsplash'
            };
        }
        return null;
    }

    private async searchPixabay(query: string): Promise<ImageResult | null> {
        const response = await axios.get(`https://pixabay.com/api/`, {
            params: {
                key: this.pixabayKey,
                q: query,
                image_type: 'photo',
                orientation: 'horizontal',
                per_page: 5,
                safesearch: true,
                order: 'popular' // KEY: Popularity ensures quality
            }
        });

        if (response.data.hits && response.data.hits.length > 0) {
            const photo = response.data.hits[0];
            return {
                url: photo.webformatURL, // Good enough quality, faster load
                alt: `Image by ${photo.user} on Pixabay`,
                source: 'pixabay'
            };
        }
        return null;
    }

    private async searchFreepik(query: string): Promise<ImageResult | null> {
        const response = await axios.get(`https://api.freepik.com/v1/resources`, {
            headers: { 
                'x-freepik-api-key': this.freepikKey,
                'Accept-Language': 'en-US'
            },
            params: {
                term: query,
                filters: {
                    content_type: { photo: 1 } // Only photos, no vectors/PSD
                },
                page: 1,
                limit: 3,
                order: 'relevant'
            }
        });

        if (response.data.data && response.data.data.length > 0) {
            const item = response.data.data[0]; // NO RANDOMNESS
            return {
                url: item.image?.source?.url || item.preview?.url,
                alt: item.title || query,
                source: 'freepik' as any
            };
        }
        return null;
    }

    private async searchPexels(query: string, context: string): Promise<ImageResult | null> {
        const response = await axios.get(`https://api.pexels.com/v1/search`, {
            headers: { Authorization: this.pexelsKey },
            params: {
                query: `${query}`, // Don't redundantly add context if query is already enriched
                per_page: 5,
                orientation: 'landscape'
            }
        });

        if (response.data.photos && response.data.photos.length > 0) {
            const photo = response.data.photos[0];
            return {
                url: photo.src.large,
                alt: `Photo by ${photo.photographer} on Pexels`,
                source: 'pexels'
            };
        }
        return null;
    }

    private async generateAIImage(prompt: string): Promise<ImageResult> {
        // Use synchronous Pollinations URL (faster, no waiting)
        const encodedPrompt = encodeURIComponent(prompt + ", photorealistic, 4k, financial context, high quality, highly detailed");
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?nolog=true`;
        
        return {
            url: url,
            alt: `AI generated illustration for ${prompt}`,
            source: 'pollinations'
        };
    }
}

export const imageService = new StockImageService();
