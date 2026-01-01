import { api } from '@/lib/api';
import { logger } from '@/lib/logger';
import type { AIDataSource } from './constraints';

/**
 * Review Analyzer Service
 * 
 * Replaces the Python 'sentiment_analyzer.py' logic.
 * Uses the Unified API to ensure rate limits and safety constraints are respected.
 */

export interface SentimentAnalysisResult {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    key_points: string[];
    concerns: string[];
    summary: string;
}

export const reviewAnalyzer = {
    /**
     * Analyze a single review or a batch of text
     */
    analyzeSentiment: async (text: string, context?: string): Promise<SentimentAnalysisResult> => {
        try {
            const prompt = `Analyze the sentiment of the following financial product review.
            
            Review: "${text.substring(0, 1000)}"
            
            ${context ? `Context: ${context}` : ''}

            Respond in JSON:
            {
                "sentiment": "positive" | "negative" | "neutral",
                "confidence": 0.0-1.0,
                "key_points": ["point1", "point2"],
                "concerns": ["concern1"],
                "summary": "1-sentence summary"
            }`;

            // Use the GENERAL operation which is allowed for analysis
            const result = await api.integrations.Core.InvokeLLM({
                prompt,
                operation: 'general', 
                citations: []
            });

            // Parse result
            let parsed = result;
            // Handle case where result is wrapped in content string
            if (typeof result.content === 'string' && result.content.startsWith('{')) {
                try {
                    parsed = JSON.parse(result.content);
                } catch (e) {
                    // fall through
                }
            }

            return {
                sentiment: parsed.sentiment || 'neutral',
                confidence: parsed.confidence || 0,
                key_points: parsed.key_points || [],
                concerns: parsed.concerns || [],
                summary: parsed.summary || ''
            };

        } catch (error) {
            logger.error('Sentiment Analysis Failed', error as Error);
            return {
                sentiment: 'neutral',
                confidence: 0,
                key_points: [],
                concerns: [],
                summary: 'Analysis failed'
            };
        }
    },

    /**
     * Generate an Aggregate Summary from multiple reviews
     */
    generateAggregateSummary: async (
        productName: string, 
        reviews: string[],
        dataSources: AIDataSource[]
    ) => {
        const combinedText = reviews.slice(0, 20).join('\n---\n'); // Limit context window
        
        return await api.integrations.Core.InvokeLLM({
            prompt: `Summarize the user sentiment for ${productName} based on these reviews.
            
            Reviews:
            ${combinedText.substring(0, 2000)}
            
            Output a JSON summary highlighting:
            1. Overall Sentiment
            2. Top 3 Pros
            3. Top 3 Cons`,
            operation: 'general',
            dataSources
        });
    }
};
