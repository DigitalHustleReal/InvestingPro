/**
 * AI Service - DeepSeek Provider
 * 
 * Purpose: Cost-effective AI provider (10x cheaper than OpenAI)
 * DeepSeek V3 is comparable to GPT-4 but at fraction of the cost
 */

import { logger } from '@/lib/logger';

export interface AIResponse {
  content: string;
  provider: 'deepseek';
  validation_warnings?: string[];
  is_draft: boolean;
}

export class DeepSeekService {
  private apiKey: string | null = null;
  private baseURL = 'https://api.deepseek.com/v1';
  private isHealthy: boolean = true;
  private lastHealthCheck: number = 0;
  private failureCount: number = 0;
  private readonly maxFailures = 3;
  private readonly healthCheckInterval = 60000; // 1 minute

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (process.env.DEEPSEEK_API_KEY) {
      this.apiKey = process.env.DEEPSEEK_API_KEY;
      logger.info('DeepSeek service initialized');
    } else {
      logger.warn('DeepSeek API key not found');
    }
  }

  isAvailable(): boolean {
    if (this.failureCount >= this.maxFailures) {
      const timeSinceLastCheck = Date.now() - this.lastHealthCheck;
      if (timeSinceLastCheck < this.healthCheckInterval) {
        return false;
      }
      this.failureCount = 0;
    }

    return this.apiKey !== null && this.isHealthy;
  }

  /**
   * Generate content using DeepSeek
   * DeepSeek V3 pricing: $0.27/1M input tokens, $1.10/1M output tokens
   * Compare to GPT-4: $2.50/1M input, $10/1M output (10x more expensive!)
   */
  async generate(params: {
    systemPrompt: string;
    userPrompt: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<AIResponse> {
    if (!this.isAvailable()) {
      throw new Error('DeepSeek service is not available');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: params.model || 'deepseek-chat', // or 'deepseek-coder' for code
          messages: [
            { role: 'system', content: params.systemPrompt },
            { role: 'user', content: params.userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: params.temperature || 0.3,
          max_tokens: params.maxTokens || 4000
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content in DeepSeek response');
      }

      // Reset failure count on success
      this.failureCount = 0;
      this.isHealthy = true;

      logger.info('DeepSeek generation successful (cost: ~$0.001)');

      return {
        content,
        provider: 'deepseek',
        is_draft: true
      };
    } catch (error) {
      this.handleFailure(error as Error);
      throw error;
    }
  }

  private handleFailure(error: Error): void {
    this.failureCount++;
    this.lastHealthCheck = Date.now();

    if (this.failureCount >= this.maxFailures) {
      this.isHealthy = false;
      logger.error(`DeepSeek circuit breaker opened after ${this.maxFailures} failures`);
    }

    logger.error('DeepSeek service error', error);
  }

  getHealth(): {
    isHealthy: boolean;
    failureCount: number;
    isAvailable: boolean;
  } {
    return {
      isHealthy: this.isHealthy,
      failureCount: this.failureCount,
      isAvailable: this.isAvailable()
    };
  }

  reset(): void {
    this.failureCount = 0;
    this.isHealthy = true;
    this.lastHealthCheck = 0;
    logger.info('DeepSeek circuit breaker reset');
  }
}

// Singleton instance
export const deepSeekService = new DeepSeekService();
