/**
 * AI Orchestrator Service
 * 
 * Purpose: Coordinates multiple AI providers with intelligent fallback
 * Replaces the monolithic AI logic from api.ts
 */

import { openAIService } from './openai.service';
import { groqService } from './groq.service';
import { deepSeekService } from './deepseek.service';
import { togetherAIService } from './together.service';
import { logger } from '@/lib/logger';

export interface AIInvocationParams {
  prompt: string;
  contextData?: any;
  citations?: string[];
  operation?: string;
  systemPrompt?: string;
}

export interface AIResponse {
  content: string;
  provider: string;
  validation_warnings?: string[];
  is_draft: boolean;
}

export class AIOrchestrator {
  /**
   * Invoke AI with automatic fallback between providers
   */
  async invoke(params: AIInvocationParams): Promise<AIResponse> {
    const {
      prompt,
      contextData,
      operation = 'general',
      systemPrompt
    } = params;

    // Build enhanced prompt with context
    const enhancedPrompt = contextData
      ? `${prompt}\n\nVerified Data:\n${JSON.stringify(contextData, null, 2)}`
      : prompt;

    const finalSystemPrompt = systemPrompt || this.generateSystemPrompt(operation);

    // Try providers in order of cost-effectiveness (cheapest first)
    const providers = [
      { name: 'Groq', service: groqService, cost: 'FREE' },              // FREE (limited)
      { name: 'Together AI', service: togetherAIService, cost: '$0.20/1M' }, // Cheapest
      { name: 'DeepSeek', service: deepSeekService, cost: '$0.27/1M' },     // 10x cheaper than GPT-4
      { name: 'OpenAI', service: openAIService, cost: '$2.50/1M' }          // Most expensive (fallback)
    ];

    for (const provider of providers) {
      if (provider.service.isAvailable()) {
        try {
          logger.info(`Attempting AI generation with ${provider.name}`);
          
          const response = await provider.service.generate({
            systemPrompt: finalSystemPrompt,
            userPrompt: enhancedPrompt,
            temperature: 0.3,
            maxTokens: 4000
          });

          logger.info(`Successfully generated content with ${provider.name}`);
          return response;
        } catch (error) {
          logger.warn(`${provider.name} failed, trying next provider`, error as Error);
          continue;
        }
      }
    }

    throw new Error('All AI providers are unavailable');
  }

  /**
   * Generate system prompt based on operation type
   */
  private generateSystemPrompt(operation: string): string {
    const basePrompt = `You are a financial content expert for InvestingPro, India's leading personal finance platform.

STRICT GUIDELINES:
- Provide factual, informational content only
- NO financial advice or recommendations
- Include citations to source data
- Use clear, accessible language
- Focus on education, not persuasion
- All content is DRAFT and requires human review

OUTPUT FORMAT: JSON only`;

    const operationPrompts: Record<string, string> = {
      'article_generation': `${basePrompt}\n\nTASK: Generate comprehensive article content with proper structure, SEO optimization, and factual accuracy.`,
      'summary': `${basePrompt}\n\nTASK: Create concise summaries of financial data and trends.`,
      'comparison': `${basePrompt}\n\nTASK: Generate objective product comparisons based on verified data.`,
      'general': basePrompt
    };

    return operationPrompts[operation] || basePrompt;
  }

  /**
   * Get health status of all providers
   */
  getProvidersHealth(): Record<string, any> {
    return {
      groq: groqService.getHealth(),
      together: togetherAIService.getHealth(),
      deepseek: deepSeekService.getHealth(),
      openai: openAIService.getHealth()
    };
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    groqService.reset();
    togetherAIService.reset();
    deepSeekService.reset();
    openAIService.reset();
    logger.info('All AI provider circuit breakers reset');
  }
}

// Singleton instance
export const aiOrchestrator = new AIOrchestrator();
