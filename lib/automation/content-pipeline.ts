/**
 * 🚀 INTELLIGENT CONTENT PIPELINE
 * 
 * End-to-end orchestrator that chains:
 *   Trend Discovery → Keyword Research → Topic Selection → 
 *   Article Generation → Post-Gen SEO Audit
 * 
 * Modes:
 *   - 'auto'     : Full pipeline (trends → keywords → generation)
 *   - 'trending' : Discover trends, generate from top results
 *   - 'keyword'  : Accept seed keyword, expand, and generate
 */

import { TrendAgent, type TrendItem } from '@/lib/agents/trend-agent';
import { researchKeyword, findKeywordOpportunities, type KeywordResearchResult, type KeywordData } from '@/lib/research/keyword-researcher';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

// ============================================================================
// TYPES
// ============================================================================

export type PipelineMode = 'auto' | 'trending' | 'keyword';

export type PipelineStage = 
    | 'initializing'
    | 'trend_discovery'
    | 'keyword_research'
    | 'topic_selection'
    | 'deduplication'
    | 'generating'
    | 'seo_audit'
    | 'complete'
    | 'error';

export interface PipelineEvent {
    stage: PipelineStage;
    message: string;
    data?: any;
    progress?: { current: number; total: number };
    timestamp: string;
}

export interface PipelineOptions {
    count: number;                      // Number of articles to generate
    mode: PipelineMode;                 // Pipeline mode
    category?: string;                  // Optional category filter
    seedKeyword?: string;               // Required for 'keyword' mode
    maxKeywordDifficulty?: number;      // Default: 50
    minOpportunityScore?: number;       // Default: 40
    authorId?: string;                  // Author ID to assign
    authorName?: string;                // Author display name
    runId?: string;                     // Pipeline run ID for tracking
}

export interface PipelineResult {
    success: boolean;
    articles: Array<{
        id: string;
        title: string;
        slug: string;
        status: string;
        topic: string;
        keyword_difficulty?: number;
        opportunity_score?: number;
        seo_score?: number;
    }>;
    pipeline_trace: {
        trends_discovered: number;
        keywords_researched: number;
        topics_selected: number;
        articles_generated: number;
        articles_failed: number;
        total_time_ms: number;
    };
    errors: string[];
}

interface ScoredTopic {
    topic: string;
    category: string;
    difficulty: number;
    opportunity_score: number;
    source: 'trend' | 'keyword' | 'content_gap';
    keyword_data?: KeywordData;
}

// ============================================================================
// SUPABASE CLIENT (lazy)
// ============================================================================

let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabase() {
    if (!supabaseClient) {
        supabaseClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    }
    return supabaseClient;
}

// ============================================================================
// PIPELINE ORCHESTRATOR
// ============================================================================

export async function runContentPipeline(
    options: PipelineOptions,
    emit: (event: PipelineEvent) => void
): Promise<PipelineResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const generatedArticles: PipelineResult['articles'] = [];

    const emitStage = async (stage: PipelineStage, message: string, data?: any, progress?: { current: number; total: number }) => {
        emit({
            stage,
            message,
            data,
            progress,
            timestamp: new Date().toISOString()
        });

        // Update database tracking if runId is present
        if (options.runId) {
            try {
                const { PipelineLogger } = await import('@/lib/pipeline-logger');
                const logger = new PipelineLogger('content_factory');
                // We use a simplified update here to avoid full 'start' logic
                const supabase = getSupabase();
                await supabase
                    .from('pipeline_runs')
                    .update({
                        status: stage === 'generating' ? 'running' : stage === 'complete' ? 'completed' : stage === 'error' ? 'failed' : 'running',
                        last_message: message,
                        current_stage: stage,
                        progress: progress ? Math.round((progress.current / progress.total) * 100) : undefined,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', options.runId);
            } catch (e) {
                // Silently fail database logging to prioritize pipeline execution
            }
        }
    };

    try {
        // ====================================================================
        // STAGE 1: TREND DISCOVERY
        // ====================================================================
        emitStage('trend_discovery', 'Scanning for trending personal finance topics...');
        
        let trends: TrendItem[] = [];
        
        if (options.mode === 'auto' || options.mode === 'trending') {
            try {
                const trendAgent = new TrendAgent();
                trends = await trendAgent.detectTrends();
                
                // Filter by category if specified
                if (options.category) {
                    trends = trends.filter(t => t.category === options.category);
                }
                
                emitStage('trend_discovery', `Discovered ${trends.length} trending topics`, {
                    top_trends: trends.slice(0, 5).map(t => ({
                        topic: t.topic,
                        category: t.category,
                        score: t.trendScore
                    }))
                });
            } catch (e) {
                const msg = e instanceof Error ? e.message : String(e);
                errors.push(`Trend discovery failed: ${msg}`);
                emitStage('trend_discovery', `⚠️ Trend discovery failed: ${msg}. Using fallback topics.`);
                
                // Fallback to default trends
                const trendAgent = new TrendAgent();
                trends = (trendAgent as any).getDefaultTrends ? (trendAgent as any).getDefaultTrends() : [];
            }
        }

        // ====================================================================
        // STAGE 2: KEYWORD RESEARCH
        // ====================================================================
        emitStage('keyword_research', 'Performing keyword research and opportunity scoring...');
        
        let scoredTopics: ScoredTopic[] = [];

        if (options.mode === 'keyword' && options.seedKeyword) {
            // Keyword mode: expand from seed keyword
            try {
                const keywordResult = await researchKeyword(options.seedKeyword);
                
                // Add the primary keyword
                scoredTopics.push({
                    topic: keywordResult.primary_keyword,
                    category: options.category || 'investing-basics',
                    difficulty: keywordResult.keyword_data.difficulty,
                    opportunity_score: keywordResult.keyword_data.opportunity_score,
                    source: 'keyword',
                    keyword_data: keywordResult.keyword_data
                });

                // Add recommended topics from keyword research
                for (const topic of keywordResult.recommended_topics) {
                    scoredTopics.push({
                        topic,
                        category: options.category || 'investing-basics',
                        difficulty: 40, // Estimated
                        opportunity_score: 65,
                        source: 'content_gap'
                    });
                }

                // Add long-tail opportunities
                for (const kw of keywordResult.long_tail_opportunities.slice(0, 5)) {
                    scoredTopics.push({
                        topic: kw.keyword,
                        category: options.category || 'investing-basics',
                        difficulty: kw.difficulty,
                        opportunity_score: kw.opportunity_score,
                        source: 'keyword',
                        keyword_data: kw
                    });
                }

                emitStage('keyword_research', `Expanded seed keyword into ${scoredTopics.length} potential topics`, {
                    difficulty: keywordResult.keyword_data.difficulty,
                    opportunity: keywordResult.keyword_data.opportunity_score,
                    clusters: keywordResult.clusters.length,
                    long_tail: keywordResult.long_tail_opportunities.length
                });
            } catch (e) {
                const msg = e instanceof Error ? e.message : String(e);
                errors.push(`Keyword research failed: ${msg}`);
                emitStage('keyword_research', `⚠️ Keyword research failed: ${msg}`);
                
                // Fallback: use the seed keyword directly
                scoredTopics.push({
                    topic: options.seedKeyword,
                    category: options.category || 'investing-basics',
                    difficulty: 50,
                    opportunity_score: 50,
                    source: 'keyword'
                });
            }
        } else {
            // Auto/Trending mode: research top trends
            const topTrends = trends.slice(0, Math.min(trends.length, options.count * 2));
            
            for (let i = 0; i < topTrends.length; i++) {
                const trend = topTrends[i];
                emitStage('keyword_research', `Researching keyword: "${trend.topic}" (${i + 1}/${topTrends.length})`, null, {
                    current: i + 1,
                    total: topTrends.length
                });

                try {
                    // Quick difficulty estimation (don't do full research for each trend)
                    const opportunities = await findKeywordOpportunities(
                        trend.topic,
                        options.maxKeywordDifficulty || 50
                    );
                    
                    // Add the trend itself
                    scoredTopics.push({
                        topic: trend.topic,
                        category: trend.category,
                        difficulty: 50,
                        opportunity_score: trend.trendScore,
                        source: 'trend'
                    });

                    // Add keyword opportunities
                    for (const opp of opportunities.slice(0, 3)) {
                        scoredTopics.push({
                            topic: opp.keyword,
                            category: trend.category,
                            difficulty: opp.difficulty,
                            opportunity_score: opp.opportunity_score,
                            source: 'keyword',
                            keyword_data: opp
                        });
                    }
                } catch (e) {
                    // Just use the trend topic directly
                    scoredTopics.push({
                        topic: trend.topic,
                        category: trend.category,
                        difficulty: 50,
                        opportunity_score: trend.trendScore,
                        source: 'trend'
                    });
                }

                // Small delay between keyword research calls
                if (i < topTrends.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            
            emitStage('keyword_research', `Researched ${topTrends.length} trends, found ${scoredTopics.length} potential topics`);
        }

        // ====================================================================
        // STAGE 3: TOPIC SELECTION (Score, Rank, Filter)
        // ====================================================================
        emitStage('topic_selection', 'Ranking and selecting best topics...');

        // Sort by opportunity score (higher = better)
        scoredTopics.sort((a, b) => {
            // Composite score: high opportunity + low difficulty
            const scoreA = a.opportunity_score - (a.difficulty * 0.3);
            const scoreB = b.opportunity_score - (b.difficulty * 0.3);
            return scoreB - scoreA;
        });

        // Filter by thresholds
        const minOpportunity = options.minOpportunityScore || 40;
        const filtered = scoredTopics.filter(t => t.opportunity_score >= minOpportunity);
        const selectedTopics = (filtered.length > 0 ? filtered : scoredTopics).slice(0, options.count);

        emitStage('topic_selection', `Selected ${selectedTopics.length} topics for generation`, {
            selected: selectedTopics.map(t => ({
                topic: t.topic,
                difficulty: t.difficulty,
                opportunity: t.opportunity_score,
                source: t.source
            }))
        });

        // ====================================================================
        // STAGE 4: DEDUPLICATION (Check against existing articles)
        // ====================================================================
        emitStage('deduplication', 'Checking for duplicate content...');

        const supabase = getSupabase();
        const { data: existingArticles } = await supabase
            .from('articles')
            .select('title, slug')
            .limit(500);

        const existingTitles = new Set(
            (existingArticles || []).map((a: any) => a.title?.toLowerCase().trim())
        );
        const existingSlugs = new Set(
            (existingArticles || []).map((a: any) => a.slug?.toLowerCase().trim())
        );

        const deduplicatedTopics = selectedTopics.filter(t => {
            const titleLower = t.topic.toLowerCase().trim();
            const slugVersion = titleLower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            
            if (existingTitles.has(titleLower)) {
                emitStage('deduplication', `⏭️ Skipping duplicate: "${t.topic}"`);
                return false;
            }
            if (existingSlugs.has(slugVersion)) {
                emitStage('deduplication', `⏭️ Skipping duplicate slug: "${t.topic}"`);
                return false;
            }
            return true;
        });

        emitStage('deduplication', `${deduplicatedTopics.length} unique topics after deduplication (${selectedTopics.length - deduplicatedTopics.length} skipped)`);

        if (deduplicatedTopics.length === 0) {
            emitStage('complete', 'No unique topics to generate. All candidates already exist in the database.');
            return {
                success: true,
                articles: [],
                pipeline_trace: {
                    trends_discovered: trends.length,
                    keywords_researched: scoredTopics.length,
                    topics_selected: selectedTopics.length,
                    articles_generated: 0,
                    articles_failed: 0,
                    total_time_ms: Date.now() - startTime
                },
                errors
            };
        }

        // ====================================================================
        // STAGE 5: ARTICLE GENERATION
        // ====================================================================
        emitStage('generating', `Starting generation of ${deduplicatedTopics.length} articles...`);

        // Lazy import to avoid loading heavy modules at service init
        const { generateArticleCore } = await import('@/lib/automation/article-generator');

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < deduplicatedTopics.length; i++) {
            const topic = deduplicatedTopics[i];
            
            emitStage('generating', `Generating article ${i + 1}/${deduplicatedTopics.length}: "${topic.topic}"`, {
                topic: topic.topic,
                category: topic.category,
                difficulty: topic.difficulty,
                opportunity: topic.opportunity_score
            }, {
                current: i + 1,
                total: deduplicatedTopics.length
            });

            try {
                const result = await generateArticleCore(topic.topic, (msg) => {
                    emitStage('generating', msg);
                }, {
                    categorySlug: topic.category,
                    authorId: options.authorId,
                    authorName: options.authorName,
                    jobId: options.runId // Link the runId to the generation job
                });

                if (result.success) {
                    successCount++;
                    const art = result.article;
                    generatedArticles.push({
                        id: art?.id || '',
                        title: art?.title || topic.topic,
                        slug: art?.slug || '',
                        status: art?.status || 'draft',
                        topic: topic.topic,
                        keyword_difficulty: topic.difficulty,
                        opportunity_score: topic.opportunity_score
                    });
                    
                    emitStage('generating', `✅ Generated: "${art?.title || topic.topic}"`, {
                        id: art?.id,
                        slug: art?.slug,
                        status: art?.status
                    });
                } else {
                    failCount++;
                    errors.push(`Failed to generate "${topic.topic}": ${result.error}`);
                    emitStage('generating', `❌ Failed: "${topic.topic}" — ${result.error}`);
                }
            } catch (e) {
                failCount++;
                const msg = e instanceof Error ? e.message : String(e);
                errors.push(`Generation error for "${topic.topic}": ${msg}`);
                emitStage('generating', `❌ Error generating "${topic.topic}": ${msg}`);
            }

            // Delay between articles
            if (i < deduplicatedTopics.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        // ====================================================================
        // STAGE 6: POST-GENERATION SEO AUDIT
        // ====================================================================
        if (generatedArticles.length > 0) {
            emitStage('seo_audit', `Running SEO audit on ${generatedArticles.length} generated articles...`);

            for (const article of generatedArticles) {
                try {
                    const { analyzeArticleSEO } = await import('@/lib/automation/seo-optimizer');
                    const seoResult = await analyzeArticleSEO(article.id);
                    article.seo_score = seoResult.scoreAfter;
                    
                    emitStage('seo_audit', `📊 "${article.title}" — SEO Score: ${seoResult.scoreAfter}/100`, {
                        optimizations: seoResult.optimizations.length,
                        score: seoResult.scoreAfter
                    });
                } catch (e) {
                    emitStage('seo_audit', `⚠️ SEO audit skipped for "${article.title}"`);
                }
            }
        }

        // ====================================================================
        // COMPLETE
        // ====================================================================
        const totalTime = Date.now() - startTime;

        emitStage('complete', `Pipeline complete! Generated ${successCount}/${deduplicatedTopics.length} articles in ${Math.round(totalTime / 1000)}s`, {
            success: successCount,
            failed: failCount,
            total_time_s: Math.round(totalTime / 1000)
        });

        return {
            success: successCount > 0,
            articles: generatedArticles,
            pipeline_trace: {
                trends_discovered: trends.length,
                keywords_researched: scoredTopics.length,
                topics_selected: selectedTopics.length,
                articles_generated: successCount,
                articles_failed: failCount,
                total_time_ms: totalTime
            },
            errors
        };

    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        logger.error('Content pipeline fatal error', e instanceof Error ? e : new Error(msg));
        
        emitStage('error', `💥 Pipeline failed: ${msg}`);
        
        return {
            success: false,
            articles: generatedArticles,
            pipeline_trace: {
                trends_discovered: 0,
                keywords_researched: 0,
                topics_selected: 0,
                articles_generated: 0,
                articles_failed: 0,
                total_time_ms: Date.now() - startTime
            },
            errors: [...errors, msg]
        };
    }
}

// ============================================================================
// BACKWARD COMPATIBILITY EXPORTS
// Used by keyword-content-generator.ts and other legacy consumers
// ============================================================================

export interface PipelineConfig {
    topic: string;
    category: string;
    contentType?: string;
    targetKeyword?: string;
    autoPublish?: boolean;
    generateImages?: boolean;
    minQualityScore?: number;
    maxPlagiarismPercentage?: number;
    minSEOScore?: number;
}

export interface AutomationPipelineResult {
    success: boolean;
    article_id?: string;
    article_slug?: string;
    errors?: string[];
}

/**
 * Legacy wrapper — generates a single article via the new pipeline.
 * Used by keyword-content-generator.ts.
 */
export async function runAutomationPipeline(config: PipelineConfig): Promise<AutomationPipelineResult> {
    try {
        const { generateArticleCore } = await import('@/lib/automation/article-generator');
        
        const result = await generateArticleCore(config.topic, (msg) => {
            logger.info(`[Pipeline] ${msg}`);
        }, {
            categorySlug: config.category
        });

        if (result.success && result.article) {
            return {
                success: true,
                article_id: result.article.id,
                article_slug: result.article.slug
            };
        }

        return {
            success: false,
            errors: [result.error || 'Unknown error']
        };
    } catch (e) {
        return {
            success: false,
            errors: [e instanceof Error ? e.message : String(e)]
        };
    }
}
