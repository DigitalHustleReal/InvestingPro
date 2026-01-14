/**
 * AI Service - Mistral Provider
 * 
 * Purpose: Isolated Mistral service with health monitoring and circuit breaker
 */

import { Mistral } from '@mistralai/mistralai';
import { logger } from '@/lib/logger';

export interface AIResponse {
  content: string;
  provider: 'mistral';
  validation_warnings?: string[];
  is_draft: boolean;
}

export class MistralService {
  private client: Mistral | null = null;
  private isHealthy: boolean = true;
  private lastHealthCheck: number = 0;
  private failureCount: number = 0;
  private readonly maxFailures = 3;
  private readonly healthCheckInterval = 60000; // 1 minute

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (process.env.MISTRAL_API_KEY) {
      this.client = new Mistral({
        apiKey: process.env.MISTRAL_API_KEY
      });
      logger.info('Mistral service initialized');
    } else {
      logger.warn('Mistral API key not found');
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

    return this.client !== null && this.isHealthy;
  }

  async generate(params: {
    systemPrompt: string;
    userPrompt: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<AIResponse> {
    if (!this.isAvailable()) {
      throw new Error('Mistral service is not available');
    }

    try {
      const response = await this.client!.chat.complete({
        model: params.model || 'mistral-large-latest',
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt }
        ],
        responseFormat: { type: 'json_object' },
        temperature: params.temperature || 0.3,
        maxTokens: params.maxTokens || 4000
      });

      const content = response.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content in Mistral response');
      }

      this.failureCount = 0;
      this.isHealthy = true;

      return {
        content,
        provider: 'mistral',
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
      logger.error(`Mistral circuit breaker opened after ${this.maxFailures} failures`);
    }

    logger.error('Mistral service error', error);
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
    logger.info('Mistral circuit breaker reset');
  }
}

export const mistralService = new MistralService();
