/**
 * AI Service - Groq Provider
 * 
 * Purpose: Isolated Groq service with health monitoring and circuit breaker
 */

import Groq from 'groq-sdk';
import { logger } from '@/lib/logger';

export interface AIResponse {
  content: string;
  provider: 'groq';
  validation_warnings?: string[];
  is_draft: boolean;
}

export class GroqService {
  private client: Groq | null = null;
  private isHealthy: boolean = true;
  private lastHealthCheck: number = 0;
  private failureCount: number = 0;
  private readonly maxFailures = 3;
  private readonly healthCheckInterval = 60000; // 1 minute

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (process.env.GROQ_API_KEY) {
      this.client = new Groq({
        apiKey: process.env.GROQ_API_KEY
      });
      logger.info('Groq service initialized');
    } else {
      logger.warn('Groq API key not found');
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
      throw new Error('Groq service is not available');
    }

    try {
      const response = await this.client!.chat.completions.create({
        model: params.model || 'llama-3.3-70b-versatile',
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
        throw new Error('No content in Groq response');
      }

      this.failureCount = 0;
      this.isHealthy = true;

      return {
        content,
        provider: 'groq',
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
      logger.error(`Groq circuit breaker opened after ${this.maxFailures} failures`);
    }

    logger.error('Groq service error', error);
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
    logger.info('Groq circuit breaker reset');
  }
}

export const groqService = new GroqService();
