import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

/**
 * 🏆 PLATFORM AUTHORITY TRACKER
 * 
 * Tracks your website's Domain Authority (DA) over time.
 * Uses multiple estimation methods with graceful fallbacks.
 * 
 * FEATURES:
 * - Estimates DA from platform metrics
 * - Tracks growth over time
 * - Auto-adjusts content strategy
 * - Works without external APIs
 * 
 * AUTHORITY LEVELS:
 * - 0-20: Startup (Target easy keywords)
 * - 20-40: Growth (Target medium keywords)
 * - 40-60: Established (Target hard keywords)
 * - 60+: Authority (Target very hard keywords)
 */

export interface AuthorityMetrics {
    date: string;
    domainAuthority: number; // 0-100
    pageAuthority?: number;
    backlinks?: number;
    referringDomains?: number;
    organicTraffic?: number;
    indexedPages?: number;
    estimationMethod: 'api' | 'calculated' | 'manual';
    confidence: number; // 0-1
}

export interface AuthorityLevel {
    level: 'startup' | 'growth' | 'established' | 'authority';
    da: number;
    targetDifficulty: { min: number; max: number };
    articlesPerWeek: number;
    strategy: string;
}

/**
 * Get current platform authority
 */
export async function getCurrentAuthority(): Promise<AuthorityMetrics> {
    try {
        // Try to get from database first (most recent record)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabase
            .from('platform_metrics')
            .select('*')
            .order('date', { ascending: false })
            .limit(1)
            .single();

        if (!error && data) {
            return {
                date: data.date,
                domainAuthority: data.domain_authority || 0,
                pageAuthority: data.page_authority,
                backlinks: data.backlinks,
                referringDomains: data.referring_domains,
                organicTraffic: data.organic_traffic,
                indexedPages: data.indexed_pages,
                estimationMethod: 'manual',
                confidence: 0.9
            };
        }

        // Fallback: Estimate from article count and age
        logger.info('No metric found, estimating authority');
        return estimateAuthority();

    } catch (error) {
        logger.error('Failed to get current authority', error as Error);
        // Ultimate fallback
        return {
            date: new Date().toISOString().split('T')[0],
            domainAuthority: 15, // Conservative startup estimate
            estimationMethod: 'calculated',
            confidence: 0.3
        };
    }
}

/**
 * Estimate authority based on platform metrics
 * (When no API data available)
 */
async function estimateAuthority(): Promise<AuthorityMetrics> {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Get article count
        const { count: articleCount } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published');

        // Get platform age (oldest article date)
        const { data: oldestArticle } = await supabase
            .from('articles')
            .select('created_at')
            .order('created_at', { ascending: true })
            .limit(1)
            .single();

        const platformAgeMonths = oldestArticle
            ? Math.max(1, Math.floor((Date.now() - new Date(oldestArticle.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30)))
            : 1;

        // Simple DA estimation formula
        // Base: 10 (every site starts here)
        // Articles: +0.5 per article (max 30 points)
        // Age: +1 per month (max 20 points)
        const baseDA = 10;
        const articleBonus = Math.min(30, (articleCount || 0) * 0.5);
        const ageBonus = Math.min(20, platformAgeMonths * 1);

        const estimatedDA = Math.round(baseDA + articleBonus + ageBonus);

        logger.info('Estimated DA', {
            articles: articleCount,
            ageMonths: platformAgeMonths,
            estimatedDA
        });

        return {
            date: new Date().toISOString().split('T')[0],
            domainAuthority: estimatedDA,
            indexedPages: articleCount || 0,
            estimationMethod: 'calculated',
            confidence: 0.6
        };

    } catch (error) {
        logger.error('Failed to estimate authority', error as Error);
        return {
            date: new Date().toISOString().split('T')[0],
            domainAuthority: 15,
            estimationMethod: 'calculated',
            confidence: 0.3
        };
    }
}

/**
 * Record authority metrics to database
 */
export async function recordAuthority(metrics: Partial<AuthorityMetrics> = {}): Promise<boolean> {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Get current metrics if not provided
        const current = metrics.domainAuthority 
            ? metrics 
            : await getCurrentAuthority();

        const today = new Date().toISOString().split('T')[0];

        // Upsert (insert or update if exists for today)
        const { error } = await supabase
            .from('platform_metrics')
            .upsert({
                date: today,
                domain_authority: current.domainAuthority,
                page_authority: current.pageAuthority,
                backlinks: current.backlinks,
                referring_domains: current.referringDomains,
                organic_traffic: current.organicTraffic,
                indexed_pages: current.indexedPages
            }, {
                onConflict: 'date'
            });

        if (error) {
            logger.error('Failed to record authority', error);
            return false;
        }

        logger.info('Authority recorded', { da: current.domainAuthority });
        return true;

    } catch (error) {
        logger.error('Failed to record authority', error as Error);
        return false;
    }
}

/**
 * Get authority level and recommended strategy
 */
export function getAuthorityLevel(da: number): AuthorityLevel {
    if (da < 20) {
        return {
            level: 'startup',
            da,
            targetDifficulty: { min: 0, max: 30 },
            articlesPerWeek: 12,
            strategy: 'Focus on easy, long-tail keywords. Build foundation with high-volume content.'
        };
    }

    if (da < 40) {
        return {
            level: 'growth',
            da,
            targetDifficulty: { min: 25, max: 50 },
            articlesPerWeek: 7,
            strategy: 'Target medium-difficulty keywords. Balance quantity with quality.'
        };
    }

    if (da < 60) {
        return {
            level: 'established',
            da,
            targetDifficulty: { min: 45, max: 70 },
            articlesPerWeek: 4,
            strategy: 'Compete for hard keywords. Focus on pillar content and topical authority.'
        };
    }

    return {
        level: 'authority',
        da,
        targetDifficulty: { min: 65, max: 100 },
        articlesPerWeek: 2,
        strategy: 'Target very competitive keywords. Establish thought leadership with comprehensive guides.'
    };
}

/**
 * Get authority growth trend
 */
export async function getAuthorityTrend(days: number = 30): Promise<AuthorityMetrics[]> {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data, error } = await supabase
            .from('platform_metrics')
            .select('*')
            .gte('date', startDate.toISOString().split('T')[0])
            .order('date', { ascending: true });

        if (error) {
            throw error;
        }

        return (data || []).map(d => ({
            date: d.date,
            domainAuthority: d.domain_authority || 0,
            pageAuthority: d.page_authority,
            backlinks: d.backlinks,
            referringDomains: d.referring_domains,
            organicTraffic: d.organic_traffic,
            indexedPages: d.indexed_pages,
            estimationMethod: 'manual' as const,
            confidence: 0.9
        }));

    } catch (error) {
        logger.error('Failed to get authority trend', error as Error);
        return [];
    }
}

/**
 * Calculate growth rate (% change over period)
 */
export async function getGrowthRate(days: number = 30): Promise<number> {
    try {
        const trend = await getAuthorityTrend(days);

        if (trend.length < 2) {
            return 0;
        }

        const first = trend[0].domainAuthority;
        const last = trend[trend.length - 1].domainAuthority;

        if (first === 0) return 0;

        const growth = ((last - first) / first) * 100;
        return Math.round(growth * 10) / 10; // Round to 1 decimal

    } catch (error) {
        logger.error('Failed to calculate growth rate', error as Error);
        return 0;
    }
}

/**
 * Get recommended keywords based on current authority
 */
export async function getRecommendedKeywords(authority?: AuthorityMetrics): Promise<{
    easy: string[];
    medium: string[];
    hard: string[];
}> {
    const current = authority || await getCurrentAuthority();
    const level = getAuthorityLevel(current.domainAuthority);

    // These would ideally come from keyword research
    // For now, return strategy-based suggestions
    const suggestions = {
        startup: {
            easy: ['Long-tail how-to guides', 'Specific calculator queries', 'Question-based keywords'],
            medium: [],
            hard: []
        },
        growth: {
            easy: ['Niche comparisons', 'Year-specific guides'],
            medium: ['How to invest in...', 'Best [product] for...', 'Guide to...'],
            hard: []
        },
        established: {
            easy: [],
            medium: ['Category comparisons', 'Product reviews'],
            hard: ['Best [category]', 'Top [product] in India', 'Complete guide to...']
        },
        authority: {
            easy: [],
            medium: [],
            hard: ['Best [broad category]', 'Ultimate guide to...', 'Definitive [topic]']
        }
    };

    return suggestions[level.level];
}
