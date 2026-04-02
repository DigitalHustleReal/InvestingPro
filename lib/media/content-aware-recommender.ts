/**
 * Content-Aware Image Recommender
 * 
 * Provides intelligent image recommendations based on article content,
 * not just keyword matching. Analyzes content semantics, visual concepts,
 * and brand consistency.
 */

import { mediaService, MediaFile } from './media-service';
import { createServiceClient } from '@/lib/supabase/service';
import { logger } from '@/lib/logger';

export interface RecommendationParams {
    articleTitle: string;
    articleContent?: string;
    category: string;
    keywords?: string[];
    tone?: 'professional' | 'casual' | 'educational' | 'promotional';
    style?: 'modern' | 'classic' | 'minimalist' | 'vibrant';
    brandColors?: string[];
}

export interface RecommendedImage extends MediaFile {
    relevanceScore: number;
    qualityScore: number;
    matchReasons: string[];
}

export class ContentAwareImageRecommender {
    private supabase = createServiceClient();

    /**
     * Get content-aware image recommendations
     */
    async recommendImages(params: RecommendationParams): Promise<RecommendedImage[]> {
        try {
            // 1. Extract visual concepts from content
            const concepts = await this.extractVisualConcepts(params);
            
            // 2. Search media library with multiple strategies
            const candidates = await this.findCandidateImages(concepts, params);
            
            // 3. Score and rank candidates
            const scored = await this.scoreImages(candidates, params, concepts);
            
            // 4. Filter and sort by relevance
            const ranked = scored
                .filter(img => img.relevanceScore > 0.3) // Minimum relevance threshold
                .sort((a, b) => {
                    // Sort by combined score (relevance + quality)
                    const scoreA = (a.relevanceScore * 0.7) + (a.qualityScore * 0.3);
                    const scoreB = (b.relevanceScore * 0.7) + (b.qualityScore * 0.3);
                    return scoreB - scoreA;
                })
                .slice(0, 10); // Top 10 recommendations
            
            return ranked;
        } catch (error) {
            logger.error('Content-aware recommendation failed', { error, params });
            // Fallback to basic keyword search
            return this.fallbackKeywordSearch(params);
        }
    }

    /**
     * Extract visual concepts from article content
     */
    private async extractVisualConcepts(params: RecommendationParams): Promise<{
        primaryConcepts: string[];
        secondaryConcepts: string[];
        visualKeywords: string[];
    }> {
        const concepts: string[] = [];
        const visualKeywords: string[] = [];
        
        // Extract from title
        const titleWords = this.extractSignificantWords(params.articleTitle);
        concepts.push(...titleWords);
        
        // Extract from content if available
        if (params.articleContent) {
            const contentWords = this.extractSignificantWords(params.articleContent);
            concepts.push(...contentWords);
        }
        
        // Add category-specific visual keywords
        const categoryKeywords = this.getCategoryVisualKeywords(params.category);
        visualKeywords.push(...categoryKeywords);
        
        // Add keywords if provided
        if (params.keywords) {
            concepts.push(...params.keywords);
        }
        
        // Remove duplicates and stop words
        const uniqueConcepts = [...new Set(concepts)]
            .filter(word => !this.isStopWord(word) && word.length > 2);
        
        return {
            primaryConcepts: uniqueConcepts.slice(0, 5),
            secondaryConcepts: uniqueConcepts.slice(5, 10),
            visualKeywords: [...new Set(visualKeywords)]
        };
    }

    /**
     * Find candidate images from media library
     */
    private async findCandidateImages(
        concepts: { primaryConcepts: string[]; secondaryConcepts: string[]; visualKeywords: string[] },
        params: RecommendationParams
    ): Promise<MediaFile[]> {
        const candidates: MediaFile[] = [];
        const seenIds = new Set<string>();
        
        // Strategy 1: Search by title/alt text with primary concepts
        for (const concept of concepts.primaryConcepts) {
            const results = await mediaService.searchMedia(concept, 20);
            for (const img of results) {
                if (!seenIds.has(img.id)) {
                    candidates.push(img);
                    seenIds.add(img.id);
                }
            }
        }
        
        // Strategy 2: Search by tags if available
        if (concepts.visualKeywords.length > 0) {
            const { data: taggedImages } = await this.supabase
                .from('media')
                .select('*')
                .contains('tags', concepts.visualKeywords.slice(0, 3))
                .limit(20);
            
            if (taggedImages) {
                for (const img of taggedImages) {
                    if (!seenIds.has(img.id)) {
                        candidates.push(this.mapToMediaFile(img));
                        seenIds.add(img.id);
                    }
                }
            }
        }
        
        // Strategy 3: Search by folder/category
        const categoryFolder = this.getCategoryFolder(params.category);
        if (categoryFolder) {
            const { data: folderImages } = await this.supabase
                .from('media')
                .select('*')
                .eq('folder', categoryFolder)
                .limit(20);
            
            if (folderImages) {
                for (const img of folderImages) {
                    if (!seenIds.has(img.id)) {
                        candidates.push(this.mapToMediaFile(img));
                        seenIds.add(img.id);
                    }
                }
            }
        }
        
        return candidates;
    }

    /**
     * Score images based on relevance and quality
     */
    private async scoreImages(
        candidates: MediaFile[],
        params: RecommendationParams,
        concepts: { primaryConcepts: string[]; secondaryConcepts: string[]; visualKeywords: string[] }
    ): Promise<RecommendedImage[]> {
        return candidates.map(img => {
            let relevanceScore = 0;
            const matchReasons: string[] = [];
            
            // Title/Alt text matching (highest weight)
            const searchText = `${img.title || ''} ${img.altText || ''} ${img.filename || ''}`.toLowerCase();
            for (const concept of concepts.primaryConcepts) {
                if (searchText.includes(concept.toLowerCase())) {
                    relevanceScore += 0.3;
                    matchReasons.push(`Matches "${concept}" in metadata`);
                }
            }
            
            // Tag matching
            if (img.tags && img.tags.length > 0) {
                const tagMatches = concepts.visualKeywords.filter(kw => 
                    img.tags!.some(tag => tag.toLowerCase().includes(kw.toLowerCase()))
                );
                if (tagMatches.length > 0) {
                    relevanceScore += 0.2 * tagMatches.length;
                    matchReasons.push(`Tagged with: ${tagMatches.join(', ')}`);
                }
            }
            
            // Folder/category matching
            if (img.folder === this.getCategoryFolder(params.category)) {
                relevanceScore += 0.15;
                matchReasons.push('Category folder match');
            }
            
            // Usage frequency (less used = more variety)
            const usageBonus = img.usageCount === 0 ? 0.1 : Math.max(0, 0.05 - (img.usageCount * 0.01));
            relevanceScore += usageBonus;
            if (usageBonus > 0) {
                matchReasons.push('Fresh image (not overused)');
            }
            
            // Quality score based on image properties
            const qualityScore = this.calculateQualityScore(img);
            
            return {
                ...img,
                relevanceScore: Math.min(1, relevanceScore), // Cap at 1.0
                qualityScore,
                matchReasons
            };
        });
    }

    /**
     * Calculate quality score for an image
     */
    private calculateQualityScore(img: MediaFile): number {
        let score = 0.5; // Base score
        
        // Resolution quality
        if (img.width && img.height) {
            const megapixels = (img.width * img.height) / 1000000;
            if (megapixels >= 2) score += 0.2; // High resolution
            else if (megapixels >= 1) score += 0.1; // Medium resolution
        }
        
        // File size (optimized images are better)
        if (img.fileSize) {
            const sizeMB = img.fileSize / (1024 * 1024);
            if (sizeMB < 0.5) score += 0.1; // Well optimized
            else if (sizeMB > 5) score -= 0.1; // Too large
        }
        
        // Metadata completeness
        if (img.altText) score += 0.1;
        if (img.title) score += 0.05;
        if (img.caption) score += 0.05;
        
        return Math.min(1, Math.max(0, score));
    }

    /**
     * Fallback to basic keyword search
     */
    private async fallbackKeywordSearch(params: RecommendationParams): Promise<RecommendedImage[]> {
        const keywords = params.keywords || this.extractSignificantWords(params.articleTitle);
        const results: MediaFile[] = [];
        
        for (const keyword of keywords.slice(0, 3)) {
            const images = await mediaService.searchMedia(keyword, 5);
            results.push(...images);
        }
        
        return results.map(img => ({
            ...img,
            relevanceScore: 0.5,
            qualityScore: this.calculateQualityScore(img),
            matchReasons: ['Keyword match (fallback)']
        }));
    }

    /**
     * Extract significant words from text
     */
    private extractSignificantWords(text: string): string[] {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3 && !this.isStopWord(word));
    }

    /**
     * Check if word is a stop word
     */
    private isStopWord(word: string): boolean {
        const stopWords = [
            'the', 'and', 'for', 'with', 'from', 'what', 'when', 'where', 'how', 'why',
            'this', 'that', 'your', 'best', 'top', 'guide', 'complete', 'beginners',
            'india', '2026', 'investment', 'investing', 'financial', 'finance'
        ];
        return stopWords.includes(word.toLowerCase());
    }

    /**
     * Get visual keywords for category
     */
    private getCategoryVisualKeywords(category: string): string[] {
        const categoryMap: Record<string, string[]> = {
            'credit-cards': ['credit card', 'payment', 'banking', 'money', 'transaction'],
            'mutual-funds': ['investment', 'growth', 'chart', 'graph', 'portfolio'],
            'stocks': ['stock market', 'trading', 'shares', 'equity', 'bull market'],
            'insurance': ['protection', 'security', 'shield', 'safety', 'coverage'],
            'loans': ['loan', 'money', 'finance', 'credit', 'lending'],
            'tax-planning': ['tax', 'calculation', 'document', 'filing', 'compliance'],
            'retirement': ['retirement', 'pension', 'golden years', 'planning', 'future'],
            'investing-basics': ['investment', 'savings', 'growth', 'wealth', 'money']
        };
        
        return categoryMap[category] || ['finance', 'money', 'investment'];
    }

    /**
     * Get folder name for category
     */
    private getCategoryFolder(category: string): string | null {
        const folderMap: Record<string, string> = {
            'credit-cards': 'credit-cards',
            'mutual-funds': 'mutual-funds',
            'stocks': 'stocks',
            'insurance': 'insurance',
            'loans': 'loans',
            'tax-planning': 'tax',
            'retirement': 'retirement',
            'investing-basics': 'investing'
        };
        
        return folderMap[category] || null;
    }

    /**
     * Map database row to MediaFile interface
     */
    private mapToMediaFile(data: any): MediaFile {
        return {
            id: data.id,
            filename: data.filename,
            originalFilename: data.original_filename,
            filePath: data.file_path,
            publicUrl: data.public_url,
            mimeType: data.mime_type,
            fileSize: data.file_size,
            width: data.width,
            height: data.height,
            altText: data.alt_text,
            caption: data.caption,
            title: data.title,
            description: data.description,
            folder: data.folder,
            tags: data.tags,
            usedInArticles: data.used_in_articles,
            usageCount: data.usage_count || 0,
            uploadedBy: data.uploaded_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        };
    }
}

// Singleton export
export const contentAwareRecommender = new ContentAwareImageRecommender();
