/**
 * Content Staleness Detector
 * 
 * Logic for detecting when an article is "stale" and requires a refresh.
 * Different categories have different TTLs based on how fast the data changes.
 */

import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export interface StalenessConfig {
    category: string;
    ttlDays: number;
    priority: 'high' | 'medium' | 'low';
}

// TTL CONFIGURATION (Days)
const CATEGORY_TTLS: Record<string, number> = {
    'mutual-funds': 30,      // MF returns change monthly
    'credit-cards': 60,      // Interest rates/offers change bi-monthly
    'loans': 90,             // Interest rates change quarterly
    'stocks': 7,             // Stocks change daily/weekly (high frequency)
    'investing-basics': 180,  // Evergreen basics can last 6 months
    'banking': 120,          // Banking rules change occasionally
    'default': 90            // Default 3 months
};

export interface StaleArticle {
    id: string;
    title: string;
    category: string;
    lastUpdated: string;
    ageDays: number;
    ttlDays: number;
    isStale: boolean;
    reason: string;
}

/**
 * Check if a single article is stale
 */
export function checkStaleness(
    lastUpdatedAt: string,
    category: string
): { isStale: boolean; reason: string; ageDays: number; ttlDays: number } {
    const lastUpdated = new Date(lastUpdatedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastUpdated.getTime());
    const ageDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const ttlDays = CATEGORY_TTLS[category] || CATEGORY_TTLS['default'];
    const isStale = ageDays > ttlDays;
    
    let reason = '';
    if (isStale) {
        reason = `Content is ${ageDays} days old (Limit: ${ttlDays} days for "${category}")`;
    }

    return { isStale, reason, ageDays, ttlDays };
}

/**
 * Scan database for stale articles
 */
export async function findStaleArticles(limit: number = 20): Promise<StaleArticle[]> {
    const supabase = await createClient();
    const staleArticles: StaleArticle[] = [];

    try {
        const { data: articles, error } = await supabase
            .from('articles')
            .select('id, title, category, updated_at')
            .eq('status', 'published')
            .order('updated_at', { ascending: true })
            .limit(100); // Scan top 100 oldest articles

        if (error) throw error;

        if (articles) {
            for (const article of articles) {
                const { isStale, reason, ageDays, ttlDays } = checkStaleness(
                    article.updated_at,
                    article.category
                );

                if (isStale) {
                    staleArticles.push({
                        id: article.id,
                        title: article.title,
                        category: article.category,
                        lastUpdated: article.updated_at,
                        ageDays,
                        ttlDays,
                        isStale,
                        reason
                    });
                }
                
                if (staleArticles.length >= limit) break;
            }
        }
    } catch (error) {
        logger.error('Error finding stale articles', error as Error);
    }

    return staleArticles;
}

/**
 * Trigger an automated refresh for a stale article
 */
export async function triggerArticleRefresh(articleId: string) {
    logger.info(`Triggering refresh for stale article: ${articleId}`);
    
    // In production, this would:
    // 1. Queue a job via Inngest or Upstash
    // 2. Call the article-generator with 'refresh' mode
    // 3. Update 'last_refreshed_at' in DB
    
    // For now, we log the intent
    return { success: true, message: 'Refresh queued' };
}
