/**
 * Automated Featured Image Service
 * Intelligently selects or generates featured images based on keywords
 * with smart randomization to avoid duplicates
 */

import { StockPhotoService } from './stock-photo-service';
import { logger } from '@/lib/logger';
import { generateFeaturedImage } from '../ai/image-generator';
import { mediaService, MediaFile } from './media-service';

interface AutoImageOptions {
    keywords: string[];
    category?: string;
    avoidDuplicates?: boolean;
    preferAI?: boolean;
    saveToLibrary?: boolean;
}

interface ImageSelection {
    url: string;
    source: 'stock-pexels' | 'stock-pixabay' | 'ai-generated' | 'library';
    keyword: string;
}

// Track recently used images to avoid duplicates
const recentlyUsedImages = new Set<string>();
const MAX_RECENT_CACHE = 50;

export class AutoFeaturedImageService {
    /**
     * Automatically select or generate a featured image based on keywords
     */
    static async getFeaturedImage(
        title: string,
        options: AutoImageOptions = { keywords: [] }
    ): Promise<ImageSelection | null> {
        const {
            keywords = [],
            category = '',
            avoidDuplicates = true,
            preferAI = false,
            saveToLibrary = true
        } = options;

        try {
            // Extract keywords from title if not provided
            const searchKeywords = keywords.length > 0
                ? keywords
                : this.extractKeywords(title, category);

            logger.info('🎨 Auto-selecting featured image for:', { title, searchKeywords });

            // Try different strategies in order
            if (preferAI) {
                // AI-first approach
                const aiImage = await this.generateAIImage(title, category, saveToLibrary);
                if (aiImage) return aiImage;

                const stockImage = await this.searchStockPhotos(searchKeywords, avoidDuplicates);
                if (stockImage) return stockImage;
            } else {
                // Stock-first approach (cheaper, faster)
                const stockImage = await this.searchStockPhotos(searchKeywords, avoidDuplicates);
                if (stockImage) return stockImage;

                const aiImage = await this.generateAIImage(title, category, saveToLibrary);
                if (aiImage) return aiImage;
            }

            // Fallback: check library for existing images
            const libraryImage = await this.searchLibrary(searchKeywords);
            if (libraryImage) return libraryImage;

            logger.warn('❌ Could not find or generate featured image');
            return null;
        } catch (error) {
            logger.error('Auto featured image selection failed:', error);
            return null;
        }
    }

    /**
     * Search stock photos with smart randomization
     */
    private static async searchStockPhotos(
        keywords: string[],
        avoidDuplicates: boolean
    ): Promise<ImageSelection | null> {
        // Try each keyword, randomize order
        const shuffledKeywords = this.shuffleArray([...keywords]);

        for (const keyword of shuffledKeywords) {
            try {
                const photos = await StockPhotoService.searchPhotos(keyword, 1);
                
                if (photos.length === 0) continue;

                // Randomize which photo to use from results
                const availablePhotos = avoidDuplicates
                    ? photos.filter(p => !recentlyUsedImages.has(p.downloadUrl))
                    : photos;

                if (availablePhotos.length === 0) continue;

                const randomIndex = Math.floor(Math.random() * availablePhotos.length);
                const selectedPhoto = availablePhotos[randomIndex];

                // Track usage
                this.trackUsedImage(selectedPhoto.downloadUrl);

                logger.info(`✅ Selected ${selectedPhoto.source} image for keyword: "${keyword}"`);

                return {
                    url: selectedPhoto.url,
                    source: selectedPhoto.source === 'pexels' ? 'stock-pexels' : 'stock-pixabay',
                    keyword
                };
            } catch (error) {
                logger.error(`Failed to search "${keyword}":`, error);
                continue;
            }
        }

        return null;
    }

    /**
     * Generate AI image with DALL-E 3
     */
    private static async generateAIImage(
        title: string,
        category: string,
        saveToLibrary: boolean
    ): Promise<ImageSelection | null> {
        try {
            const imageUrl = await generateFeaturedImage(title, category);
            
            if (!imageUrl) return null;

            // Optionally save to library
            if (saveToLibrary) {
                try {
                    // Download and upload to Supabase
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();
                    const file = new File([blob], `ai-${Date.now()}.jpg`, { type: 'image/jpeg' });
                    
                    await mediaService.uploadImage(file, {
                        folder: 'ai-featured',
                        title: `AI: ${title}`,
                        altText: title
                    });
                } catch (uploadError) {
                    logger.error('Failed to save AI image to library:', uploadError);
                }
            }

            this.trackUsedImage(imageUrl);
            logger.info('✅ Generated AI image with DALL-E 3');

            return {
                url: imageUrl,
                source: 'ai-generated',
                keyword: title
            };
        } catch (error) {
            logger.error('AI image generation failed:', error);
            return null;
        }
    }

    /**
     * Search existing library for relevant images
     */
    private static async searchLibrary(keywords: string[]): Promise<ImageSelection | null> {
        try {
            for (const keyword of keywords) {
                const results = await mediaService.search({
                    query: keyword,
                    limit: 10
                });

                if (results.length === 0) continue;

                // Randomize selection
                const availableResults = results.filter((r: any) => !recentlyUsedImages.has(r.publicUrl));
                if (availableResults.length === 0) continue;

                const randomIndex = Math.floor(Math.random() * availableResults.length);
                const selected = availableResults[randomIndex];

                this.trackUsedImage(selected.publicUrl);
                logger.info(`✅ Found library image for keyword: "${keyword}"`);

                return {
                    url: selected.publicUrl,
                    source: 'library',
                    keyword
                };
            }
        } catch (error) {
            logger.error('Library search failed:', error);
        }

        return null;
    }

    /**
     * Extract relevant keywords from title and category
     */
    private static extractKeywords(title: string, category: string): string[] {
        const keywords: string[] = [];

        // Add category as primary keyword
        if (category) {
            const formattedCategory = category.replace(/-/g, ' ');
            keywords.push(formattedCategory);
        }

        // Extract main topic from title (first 3-4 significant words)
        const words = title
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(' ')
            .filter(w => w.length > 3 && !this.isStopWord(w));

        // Take first 2-3 keywords
        keywords.push(...words.slice(0, 3));

        // Add some generic finance keywords as fallback
        keywords.push('finance', 'money', 'business', 'investment');

        return keywords;
    }

    /**
     * Check if word is a stop word (common words to ignore)
     */
    private static isStopWord(word: string): boolean {
        const stopWords = ['the', 'and', 'for', 'with', 'from', 'what', 'when', 'where', 'how', 'why', 'this', 'that', 'your', 'best', 'top'];
        return stopWords.includes(word);
    }

    /**
     * Shuffle array (Fisher-Yates algorithm)
     */
    private static shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Track recently used image to avoid duplicates
     */
    private static trackUsedImage(url: string) {
        recentlyUsedImages.add(url);
        
        // Keep cache size manageable
        if (recentlyUsedImages.size > MAX_RECENT_CACHE) {
            const firstItem = recentlyUsedImages.values().next().value;
            recentlyUsedImages.delete(firstItem);
        }
    }

    /**
     * Clear the duplicate tracking cache
     */
    static clearCache() {
        recentlyUsedImages.clear();
    }
}
