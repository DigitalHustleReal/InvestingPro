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
        // 1. Try Pixabay (User Preference due to better collections)
        if (this.pixabayKey) {
            try {
                const img = await this.searchPixabay(topic);
                if (img) return img;
            } catch (e) {
                console.error('Pixabay search failed:', e);
            }
        }

        // 2. Try Unsplash (Next best for quality)
        if (this.unsplashKey) {
            try {
                const img = await this.searchUnsplash(topic);
                if (img) return img;
            } catch (e) {
                console.error('Unsplash search failed:', e);
            }
        }
        
        // 3. Try Pexels
        if (this.pexelsKey) {
            try {
                const img = await this.searchPexels(topic, context);
                if (img) return img;
            } catch (e) {
                console.error('Pexels search failed:', e);
            }
        }

        // 4. Try Freepik (Optional)
        if (this.freepikKey) {
            try {
                const img = await this.searchFreepik(topic);
                if (img) return img;
            } catch (e) {
                // Silent fail
            }
        }
        
        // 5. Fallback to AI (Pollinations - Flux Model)
        // If no stock image found, we generate one.
        console.log('⚠️ Stock images not found. Falling back to AI Generation (Flux).');
        return this.generateAIImage(topic);
    }

    private async searchUnsplash(topic: string): Promise<ImageResult | null> {
        // Force "Abstract/Editorial" context for premium feel
        const styleKeywords = "abstract geometric minimal business concept high-quality";
        const cleanTopic = topic.replace(/Guide|Complete|Beginners|How to|Start|In India|2026|Best|Review|Top/gi, '').trim();
        const searchQuery = `${cleanTopic} ${styleKeywords}`;

        const response = await axios.get(`https://api.unsplash.com/search/photos`, {
            headers: { 'Authorization': `Client-ID ${this.unsplashKey}` },
            params: {
                query: searchQuery, 
                per_page: 20,
                orientation: 'landscape',
                content_filter: 'high',
                order_by: 'relevant'
            }
        });

        if (response.data.results && response.data.results.length > 0) {
            const photo = response.data.results[Math.floor(Math.random() * response.data.results.length)];
            return {
                url: photo.urls.regular,
                alt: `Photo by ${photo.user.name} on Unsplash`,
                source: 'unsplash'
            };
        }
        return null;
    }

    private async searchFreepik(topic: string): Promise<ImageResult | null> {
        // Freepik API Endpoint
        const response = await axios.get(`https://api.freepik.com/v1/resources`, {
            headers: { 
                'x-freepik-api-key': this.freepikKey,
                'Accept-Language': 'en-US'
            },
            params: {
                term: topic,
                filters: {
                    content_type: { photo: 1, vector: 1 } // Photos or vectors
                },
                page: 1,
                limit: 5,
                order: 'relevant'
            }
        });

        if (response.data.data && response.data.data.length > 0) {
            const item = response.data.data[Math.floor(Math.random() * response.data.data.length)];
            return {
                url: item.image?.source?.url || item.preview?.url, // Freepik structure varies, preview is safe
                alt: item.title || topic,
                source: 'freepik' as any
            };
        }
        return null;
    }

    private async searchPexels(topic: string, context: string): Promise<ImageResult | null> {
        // Enhance query for better results
        const cleanTopic = topic.replace(/2026|Guide|Beginners/gi, '').trim();
        const query = `${cleanTopic} ${context} India finance`.trim().substring(0, 50); // Pexels likes short queries
        
        const response = await axios.get(`https://api.pexels.com/v1/search`, {
            headers: { Authorization: this.pexelsKey },
            params: {
                query: query,
                per_page: 5,
                orientation: 'landscape',
                size: 'large'
            }
        });

        if (response.data.photos && response.data.photos.length > 0) {
            // Pick a random one from top 5 to vary content
            const photo = response.data.photos[Math.floor(Math.random() * response.data.photos.length)];
            return {
                url: photo.src.large2x || photo.src.large,
                alt: photo.alt || topic,
                source: 'pexels'
            };
        }
        return null;
    }

    private async searchPixabay(topic: string): Promise<ImageResult | null> {
        const cleanTopic = topic.replace(/2026|Guide|Beginners/gi, '').trim();
        const query = encodeURIComponent(`${cleanTopic} finance business India`);
        const url = `https://pixabay.com/api/?key=${this.pixabayKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=5`;

        const response = await axios.get(url);

        if (response.data.hits && response.data.hits.length > 0) {
            const photo = response.data.hits[Math.floor(Math.random() * response.data.hits.length)];
            return {
                url: photo.largeImageURL || photo.webformatURL,
                alt: photo.tags || topic,
                source: 'pixabay'
            };
        }
        return null;
    }

    private generateAIImage(topic: string): ImageResult {
        // Flux model via Pollinations
        const prompt = encodeURIComponent(`professional cinematic photo of ${topic}, indian context, 8k, realistic, highly detailed`);
        const seed = Math.floor(Math.random() * 10000);
        const url = `https://pollinations.ai/p/${prompt}?width=1280&height=720&seed=${seed}&model=flux`;
        
        return {
            url: url,
            alt: `AI generated image for ${topic}`,
            source: 'pollinations'
        };
    }
}

// Singleton instance
export const imageService = new StockImageService();
