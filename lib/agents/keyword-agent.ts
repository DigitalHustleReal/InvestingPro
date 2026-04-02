/**
 * Keyword Agent
 * 
 * Researches and optimizes keywords:
 * - Long-tail keywords
 * - Semantic keywords
 * - LSI keywords
 * - Keyword difficulty scoring
 * - Search volume analysis
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { KeywordResearchService } from '@/lib/keyword-research/KeywordResearchService';
import { scoreKeywordDifficulty } from '@/lib/seo/keyword-difficulty-scorer';
import { logger } from '@/lib/logger';
import { TrendItem } from './trend-agent';

export interface KeywordResearchResult {
    keyword: string;
    searchVolume?: number;
    difficulty: number;
    difficultyLevel: 'easy' | 'medium' | 'hard' | 'very-hard';
    longTailVariations: string[];
    semanticKeywords: string[];
    lsiKeywords: string[];
    titleVariations: string[];
    relevanceScore: number; // 0-100
    opportunityScore: number; // 0-100 (based on difficulty vs volume)
}

export class KeywordAgent extends BaseAgent {
    private keywordService: KeywordResearchService;
    
    constructor() {
        super('KeywordAgent');
        this.keywordService = new KeywordResearchService();
    }
    
    /**
     * Research keywords based on trends
     */
    async researchKeywords(trends: TrendItem[]): Promise<KeywordResearchResult[]> {
        const startTime = Date.now();
        
        try {
            logger.info('KeywordAgent: Researching keywords...');
            
            const keywordResults: KeywordResearchResult[] = [];
            
            for (const trend of trends.slice(0, 10)) { // Limit to top 10 trends
                try {
                    // Research primary keyword
                    const primaryKeyword = trend.keywords[0] || trend.topic;
                    
                    // Get keyword research using correct method name
                    const research = await this.keywordService.performKeywordResearch(primaryKeyword, trend.category || 'investing-basics');
                    
                    // Get difficulty score
                    const difficultyResult = await scoreKeywordDifficulty(primaryKeyword);
                    
                    // Calculate opportunity score
                    const opportunityScore = this.calculateOpportunityScore(
                        difficultyResult.difficulty,
                        0 // Search volume not available from KeywordResearchResult
                    );

                    keywordResults.push({
                        keyword: primaryKeyword,
                        searchVolume: undefined,
                        difficulty: difficultyResult.difficulty,
                        difficultyLevel: difficultyResult.level,
                        longTailVariations: research?.long_tail_keywords?.map(k => k.keyword_text) || [],
                        semanticKeywords: research?.semantic_keywords?.map(k => k.keyword_text) || [],
                        lsiKeywords: research?.lsi_keywords?.map(k => k.keyword_text) || [],
                        titleVariations: research?.alternative_keywords?.map(k => k.keyword_text) || [],
                        relevanceScore: trend.relevanceScore,
                        opportunityScore
                    });
                    
                    // Rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                } catch (error) {
                    logger.warn(`Failed to research keyword for trend: ${trend.topic}`, error as Error);
                }
            }
            
            // Sort by opportunity score
            const sorted = keywordResults.sort((a, b) => b.opportunityScore - a.opportunityScore);
            
            logger.info(`KeywordAgent: Researched ${sorted.length} keywords`);
            
            return sorted;
            
        } catch (error) {
            logger.error('KeywordAgent: Research failed', error as Error);
            return [];
        }
    }
    
    /**
     * Calculate opportunity score
     * Higher volume + Lower difficulty = Higher opportunity
     */
    private calculateOpportunityScore(difficulty: number, searchVolume: number): number {
        // Normalize search volume (0-100 scale, assuming max 100K searches)
        const normalizedVolume = Math.min(100, (searchVolume / 1000) * 10);
        
        // Invert difficulty (lower difficulty = higher opportunity)
        const invertedDifficulty = 100 - difficulty;
        
        // Weighted average: 60% volume, 40% difficulty
        return (normalizedVolume * 0.6) + (invertedDifficulty * 0.4);
    }
    
    /**
     * Execute agent task
     */
    async execute(context: AgentContext): Promise<AgentResult> {
        const startTime = Date.now();
        
        try {
            const trends = context.trends || [];
            const keywords = await this.researchKeywords(trends);
            
            return {
                success: true,
                data: keywords,
                executionTime: Date.now() - startTime,
                metadata: { count: keywords.length }
            };
        } catch (error) {
            return this.handleError(error, context);
        }
    }
}
