
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';

export interface SerpAnalysisResult {
    averageWordCount: number;
    targetWordCount: number;
    topCompetitors?: { title: string; estimatedWordCount: number }[];
    difficulty?: string;
}

/**
 * Analyze SERP to determine optimal word count
 * 
 * Strategy:
 * 1. If real SERP API allows, fetch top results.
 * 2. Fallback: Use LLM to analyze topic and estimate competitive length based on its knowledge base.
 *    (This is effectively "Semantic SERP Analysis").
 */
export async function analyzeSerpForWordCount(topic: string, keywords: string[]): Promise<SerpAnalysisResult> {
    try {
        // Use LLM to estimate competition
        // @ts-ignore
        const completion = await api.integrations.Core.InvokeLLM({
            prompt: `
            Analyze the Search Engine Results Page (SERP) landscape for the keyword: "${topic}".
            
            Based on current SEO standards and top-ranking content for this query type:
            1. Identify 3 likely top-ranking competitor types (e.g. "Investopedia Guide", "BankBazaar Comparison").
            2. Estimate their average word count.
            3. Return ONLY valid JSON.
            
            Format:
            {
              "competitors": [
                { "title": "Competitor 1 Description", "estimatedWordCount": 2000 },
                { "title": "Competitor 2 Description", "estimatedWordCount": 1500 }
              ],
              "averageWordCount": 1750,
              "difficulty": "Medium"
            }
            `,
            systemPrompt: "You are an expert SEO Analyst. You estimate content length requirements based on keyword intent and typical competition.",
            operation: 'analysis'
        });

        let data: any = {};
        if (completion.content && typeof completion.content === 'string') {
            try {
                data = JSON.parse(completion.content);
            } catch (e) {
                // Try extracting JSON
                const match = completion.content.match(/\{[\s\S]*\}/);
                if (match) data = JSON.parse(match[0]);
            }
        } else {
             data = completion;
        }

        const avg = data.averageWordCount || 2000;
        
        // Target is 20-30% more than average (average * 1.25)
        const target = Math.round(avg * 1.25);

        logger.info('SERP Analysis Complete', { topic, avg, target });

        return {
            averageWordCount: avg,
            targetWordCount: target,
            topCompetitors: data.competitors,
            difficulty: data.difficulty
        };

    } catch (error) {
        logger.error('SERP Analysis Failed', error as Error);
        // Fallback defaults
        return {
            averageWordCount: 1500,
            targetWordCount: 2000,
            difficulty: 'Unknown'
        };
    }
}
