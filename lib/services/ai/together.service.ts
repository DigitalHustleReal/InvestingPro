/**
 * AI Service - Together AI Provider
 * 
 * Purpose: Access to open-source models (Llama 3, Mixtral, etc.) at low cost
 * Together AI provides inference for many open-source models
 */

import { logger } from '@/lib/logger';

export interface AIResponse {
  content: string;
  provider: 'together';
  validation_warnings?: string[];
  is_draft: boolean;
}

export class TogetherAIService {
  private apiKey: string | null = null;
  private baseURL = 'https://api.together.xyz/v1';
  private isHealthy: boolean = true;
  private lastHealthCheck: number = 0;
  private failureCount: number = 0;
  private readonly maxFailures = 3;
  private readonly healthCheckInterval = 60000;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (process.env.TOGETHER_API_KEY) {
      this.apiKey = process.env.TOGETHER_API_KEY;
      logger.info('Together AI service initialized');
    } else {
      logger.warn('Together AI API key not found');
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
   * Generate content using Together AI
   * Pricing: $0.20/1M tokens (Llama 3 70B) - 12x cheaper than GPT-4!
   * Models available: Llama 3, Mixtral, Qwen, etc.
   */
  async generate(params: {
    systemPrompt: string;
    userPrompt: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<AIResponse> {
    if (!this.isAvailable()) {
      throw new Error('Together AI service is not available');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: params.model || 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
          messages: [
            { role: 'system', content: params.systemPrompt },
            { role: 'user', content: params.userPrompt }
          ],
          temperature: params.temperature || 0.3,
          max_tokens: params.maxTokens || 4000,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`Together AI error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content in Together AI response');
      }

      this.failureCount = 0;
      this.isHealthy = true;

      logger.info('Together AI generation successful (cost: ~$0.0008)');

      return {
        content,
        provider: 'together',
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
      logger.error(`Together AI circuit breaker opened`);
    }

    logger.error('Together AI service error', error);
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
    logger.info('Together AI circuit breaker reset');
  }
}

export const togetherAIService = new TogetherAIService();
