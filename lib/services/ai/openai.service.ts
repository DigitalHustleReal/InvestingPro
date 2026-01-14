/**
 * AI Service - OpenAI Provider
 * 
 * Purpose: Isolated OpenAI service with health monitoring and circuit breaker
 */

import OpenAI from 'openai';
import { logger } from '@/lib/logger';

export interface AIResponse {
  content: string;
  provider: 'openai';
  validation_warnings?: string[];
  is_draft: boolean;
}

export class OpenAIService {
  private client: OpenAI | null = null;
  private isHealthy: boolean = true;
  private lastHealthCheck: number = 0;
  private failureCount: number = 0;
  private readonly maxFailures = 3;
  private readonly healthCheckInterval = 60000; // 1 minute

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (process.env.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      logger.info('OpenAI service initialized');
    } else {
      logger.warn('OpenAI API key not found');
    }
  }

  /**
   * Check if service is healthy and available
   */
  isAvailable(): boolean {
    // Check circuit breaker
    if (this.failureCount >= this.maxFailures) {
      const timeSinceLastCheck = Date.now() - this.lastHealthCheck;
      if (timeSinceLastCheck < this.healthCheckInterval) {
        return false; // Circuit is open
      }
      // Try to reset circuit
      this.failureCount = 0;
    }

    return this.client !== null && this.isHealthy;
  }

  /**
   * Generate content using OpenAI
   */
  async generate(params: {
    systemPrompt: string;
    userPrompt: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<AIResponse> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI service is not available');
    }

    try {
      const response = await this.client!.chat.completions.create({
        model: params.model || process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: params.temperature || 0.3,
        max_tokens: params.maxTokens || 4000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      // Reset failure count on success
      this.failureCount = 0;
      this.isHealthy = true;

      return {
        content,
        provider: 'openai',
        is_draft: true
      };
    } catch (error) {
      this.handleFailure(error as Error);
      throw error;
    }
  }

  /**
   * Handle service failure
   */
  private handleFailure(error: Error): void {
    this.failureCount++;
    this.lastHealthCheck = Date.now();

    if (this.failureCount >= this.maxFailures) {
      this.isHealthy = false;
      logger.error(`OpenAI circuit breaker opened after ${this.maxFailures} failures`);
    }

    logger.error('OpenAI service error', error);
  }

  /**
   * Get service health status
   */
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

  /**
   * Reset circuit breaker
   */
  reset(): void {
    this.failureCount = 0;
    this.isHealthy = true;
    this.lastHealthCheck = 0;
    logger.info('OpenAI circuit breaker reset');
  }
}

// Singleton instance
export const openAIService = new OpenAIService();
