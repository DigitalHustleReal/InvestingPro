import { getCurrentAuthority, getAuthorityLevel } from '../analytics/authority-tracker';
import { scoreKeywordDifficulty, scoreKeywordBatch } from '../seo/keyword-difficulty-scorer';
import { logger } from '../logger';
import { createClient } from '@supabase/supabase-js';
import slugify from 'slugify';

/**
 * 🎯 CONTENT ORCHESTRATOR
 * 
 * The intelligent brain that plans and schedules content based on:
 * - Your current Domain Authority
 * - Keyword difficulty analysis
 * - Trending topics
 * - Performance feedback
 * 
 * FEATURES:
 * - Auto-generates weekly content plan
 * - Matches article difficulty to platform authority
 * - Prioritizes trending topics
 * - Learns from ranking performance
 */

export interface ContentPlan {
    weekNumber: number;
    startDate: string;
    endDate: string;
    currentAuthority: number;
    recommendedArticles: number;
    scheduledArticles: ScheduledArticle[];
    statistics: {
        easy: number;
        medium: number;
        hard: number;
    };
}

export interface ScheduledArticle {
    topic: string;
    keyword: string;
    difficulty: number;
    difficultyLevel: 'easy' | 'medium' | 'hard' | 'very-hard';
    scheduledDate: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
    estimatedTraffic?: number;
    trending?: boolean;
}

/**
 * Generate a weekly content plan
 */
export async function generateWeeklyPlan(
    options: {
        customKeywords?: string[];
        includeTrending?: boolean;
        startDate?: Date;
    } = {}
): Promise<ContentPlan> {
    const { customKeywords = [], includeTrending = true, startDate = new Date() } = options;

    try {
        logger.info('Generating weekly content plan');

        // 1. Get current authority and strategy
        const authority = await getCurrentAuthority();
        const level = getAuthorityLevel(authority.domainAuthority);

        logger.info('Authority level', {
            da: authority.domainAuthority,
            level: level.level,
            targetArticles: level.articlesPerWeek
        });

        // 2. Get keyword pool
        let keywordPool = customKeywords.length > 0 
            ? customKeywords 
            : await getDefaultKeywords();

        // 3. Add trending keywords if enabled
        if (includeTrending) {
            const trending = await getTrendingKeywords();
            keywordPool = [...trending, ...keywordPool];
        }

        // 4. Score all keywords
        logger.info('Scoring keywords', { count: keywordPool.length });
        const scoredKeywords = await scoreKeywordBatch(keywordPool.slice(0, 30), {
            targetAuthority: authority.domainAuthority
        });

        // 5. Filter and rank by match
        const suitable = scoredKeywords
            .filter(k => k.difficulty <= level.targetDifficulty.max + 10) // Allow slight stretch
            .sort((a, b) => {
                // Prioritize perfect matches, then trending, then difficulty
                const aGap = Math.abs(a.difficulty - authority.domainAuthority);
                const bGap = Math.abs(b.difficulty - authority.domainAuthority);
                return aGap - bGap;
            });

        // 6. Schedule articles throughout the week
        const scheduled: ScheduledArticle[] = [];
        const targetCount = Math.min(level.articlesPerWeek, suitable.length);
        const daysToSpread = 7;

        for (let i = 0; i < targetCount; i++) {
            const keyword = suitable[i];
            const scheduleDate = new Date(startDate);
            scheduleDate.setDate(scheduleDate.getDate() + Math.floor((i / targetCount) * daysToSpread));

            // Determine priority
            const gap = Math.abs(keyword.difficulty - authority.domainAuthority);
            const priority = gap <= 5 ? 'high' : gap <= 15 ? 'medium' : 'low';

            // Determine reason
            let reason = `Perfect match for DA ${authority.domainAuthority}`;
            if (keyword.difficulty < authority.domainAuthority - 10) {
                reason = 'Easy win - high ranking potential';
            } else if (keyword.difficulty > authority.domainAuthority + 10) {
                reason = 'Stretch goal - build authority';
            }

            scheduled.push({
                topic: keyword.keyword,
                keyword: keyword.keyword,
                difficulty: keyword.difficulty,
                difficultyLevel: keyword.level,
                scheduledDate: scheduleDate.toISOString().split('T')[0],
                priority,
                reason,
                trending: keywordPool.indexOf(keyword.keyword) < 5 // First 5 are trending
            });
        }

        // 7. Calculate statistics
        const statistics = {
            easy: scheduled.filter(a => a.difficultyLevel === 'easy').length,
            medium: scheduled.filter(a => a.difficultyLevel === 'medium').length,
            hard: scheduled.filter(a => ['hard', 'very-hard'].includes(a.difficultyLevel)).length
        };

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);

        return {
            weekNumber: getWeekNumber(startDate),
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            currentAuthority: authority.domainAuthority,
            recommendedArticles: level.articlesPerWeek,
            scheduledArticles: scheduled,
            statistics
        };

    } catch (error) {
        logger.error('Failed to generate weekly plan', error as Error);
        throw error;
    }
}

/**
 * Auto-execute the weekly plan (generate articles)
 */
export async function executeWeeklyPlan(plan: ContentPlan): Promise<void> {
    logger.info('Executing weekly content plan', {
        articles: plan.scheduledArticles.length
    });

    for (const article of plan.scheduledArticles) {
        try {
            logger.info('Generating article', { topic: article.topic });
            
            // Import article generator (lazy to avoid circular deps)
            const { generateArticleCore } = await import('../automation/article-generator');
            
            const result = await generateArticleCore(article.topic, (msg) => {
                logger.info(msg);
            });

            if (result.success) {
                logger.info('Article generated', {
                    topic: article.topic,
                    url: result.url
                });
            } else {
                logger.error('Article generation failed', new Error(result.error), {
                    topic: article.topic
                });
            }

            // Rate limiting: Wait 2 minutes between articles
            await new Promise(resolve => setTimeout(resolve, 120000));

        } catch (error) {
            logger.error('Failed to execute article', error as Error, {
                topic: article.topic
            });
        }
    }
}

/**
 * Get default keyword pool (financial topics)
 */
async function getDefaultKeywords(): Promise<string[]> {
    return [
        // Easy long-tail
        'how to calculate SIP returns step by step',
        'what is NAV in mutual funds with example',
        'difference between SIP and lump sum investment',
        'how to start investing with 1000 rupees',
        'best tax saving options under section 80C',
        
        // Medium difficulty
        'best SIP plans for beginners in India',
        'how to invest in mutual funds online',
        'top performing mutual funds 2026',
        'retirement planning for 30 year olds',
        'how to build emergency fund in India',
        
        // Harder (for growth stage)
        'best mutual funds in India',
        'complete guide to investing in stocks',
        'best credit cards for rewards in India',
        'how to invest in stock market for beginners',
        'best investment options in India 2026'
    ];
}

/**
 * Get trending keywords from RSS feeds and Google Trends
 */
async function getTrendingKeywords(): Promise<string[]> {
    try {
        const allTrends: string[] = [];
        
        // 1. Get trending from RSS feeds (Economic Times, Moneycontrol, etc.)
        try {
            const { TrendsService } = await import('../trends/TrendsService');
            const trendsService = new TrendsService();
            const rssTrends = await trendsService.getTrendingTopics('personal-finance');
            allTrends.push(...rssTrends.map(t => t.keyword));
            logger.info('RSS trending topics fetched', { count: rssTrends.length });
        } catch (error) {
            logger.warn('Failed to fetch RSS trends', error as Error);
        }
        
        // 2. Get trending from Google Trends (via GhostScraper)
        try {
            const { GhostScraper } = await import('../scraper/ghost_scraper');
            const scraper = new GhostScraper();
            const googleTrends = await scraper.scanTrendingTopics();
            allTrends.push(...googleTrends);
            logger.info('Google Trends fetched', { count: googleTrends.length });
        } catch (error) {
            logger.warn('Failed to fetch Google Trends', error as Error);
        }
        
        // 3. Fallback to default trending topics if nothing found
        if (allTrends.length === 0) {
            logger.warn('No trending topics found, using fallback');
            return [
                'union budget 2026 tax changes',
                'new income tax slabs 2026',
                'latest RBI repo rate impact',
                'best mutual funds 2026',
                'tax saving investment options'
            ];
        }
        
        // 4. Deduplicate and return top 10
        const uniqueTrends = Array.from(new Set(allTrends));
        logger.info('Total unique trending topics', { count: uniqueTrends.length });
        return uniqueTrends.slice(0, 10);
        
    } catch (error) {
        logger.error('Failed to get trending keywords', error as Error);
        // Return fallback topics
        return [
            'union budget 2026 tax changes',
            'new income tax slabs 2026',
            'latest RBI repo rate impact'
        ];
    }
}

/**
 * Get week number of year
 */
function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Save plan to database for tracking
 */
export async function savePlan(plan: ContentPlan): Promise<boolean> {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Create draft articles for each scheduled topic
        for (const article of plan.scheduledArticles) {
            const slug = slugify(article.topic, { lower: true, strict: true });

            await supabase
                .from('articles')
                .insert({
                    title: article.topic,
                    slug: `${slug}-${Date.now()}`, // Unique slug
                    status: 'draft',
                    difficulty_score: article.difficulty,
                    primary_keyword: article.keyword,
                    published_date: article.scheduledDate,
                    ai_generated: true,
                    author_name: 'AI Orchestrator'
                });
        }

        logger.info('Content plan saved to database', {
            articles: plan.scheduledArticles.length
        });
        return true;

    } catch (error) {
        logger.error('Failed to save plan', error as Error);
        return false;
    }
}

/**
 * Get performance feedback (learn from rankings)
 */
export async function getPerformanceFeedback(): Promise<{
    topPerformers: string[];
    underperformers: string[];
    recommendations: string[];
}> {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Get articles with performance data
        const { data: articles } = await supabase
            .from('articles')
            .select('id, title, difficulty_score, target_authority, views')
            .eq('status', 'published')
            .order('views', { ascending: false })
            .limit(20);

        if (!articles || articles.length === 0) {
            return {
                topPerformers: [],
                underperformers: [],
                recommendations: ['Not enough data yet. Publish more articles to see patterns.']
            };
        }

        // Analyze patterns
        const topPerformers = articles
            .slice(0, 5)
            .map(a => `${a.title} (Difficulty: ${a.difficulty_score}, Views: ${a.views})`);

        const recommendations: string[] = [];

        // Check if we're targeting the right difficulty
        const avgDifficulty = articles.reduce((sum, a) => sum + (a.difficulty_score || 0), 0) / articles.length;
        const avgAuthority = articles[0]?.target_authority || 15;

        if (avgDifficulty > avgAuthority + 20) {
            recommendations.push('You\'re targeting keywords that are too difficult. Focus on easier topics.');
        } else if (avgDifficulty < avgAuthority - 10) {
            recommendations.push('You could target more challenging keywords to grow authority faster.');
        } else {
            recommendations.push('Good balance! Current difficulty matches your authority.');
        }

        return {
            topPerformers,
            underperformers: [],
            recommendations
        };

    } catch (error) {
        logger.error('Failed to get performance feedback', error as Error);
        return {
            topPerformers: [],
            underperformers: [],
            recommendations: []
        };
    }
}
