import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { PipelineLogger } from '@/lib/pipeline-logger';
import robotsParser from 'robots-parser';

export interface ScraperResult<T> {
  data: T[];
  source: string;
  metadata?: any;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000, // 1 second
  maxDelayMs: 8000, // 8 seconds max
};

export abstract class BaseScraper<T> {
  abstract name: string;
  abstract schedule: string;
  abstract sourceName: string;
  abstract sourceUrl: string;
  
  protected supabase = createClient();
  protected retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG;
  protected logger: PipelineLogger;

  constructor() {
      // Initialize logger with placeholder name; subclass name available at runtime
      this.logger = new PipelineLogger(this.name || 'base_scraper');
  }

  // Core abstract method to be implemented by specific scrapers
  abstract scrape(): Promise<T[]>;
  
  // Abstract validation schema
  abstract schema: z.ZodSchema<T>;

  /**
   * Sleep helper for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Calculate exponential backoff delay
   */
  private getRetryDelay(attempt: number): number {
    const delay = this.retryConfig.baseDelayMs * Math.pow(2, attempt - 1);
    return Math.min(delay, this.retryConfig.maxDelayMs);
  }

  /**
   * Execute scrape with retry logic
   */
  private async scrapeWithRetry(): Promise<{ data: T[]; retryAttempts: number }> {
    let lastError: Error | null = null;
    let retryAttempts = 0;

    for (let attempt = 1; attempt <= this.retryConfig.maxRetries + 1; attempt++) {
      try {
        const data = await this.scrape();
        return { data, retryAttempts };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        retryAttempts = attempt;

        if (attempt <= this.retryConfig.maxRetries) {
          const delay = this.getRetryDelay(attempt);
          console.warn(`⚠️ ${this.name} scrape attempt ${attempt} failed. Retrying in ${delay}ms...`, lastError.message);
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  /**
   * Check robots.txt compliance for external URLs
   */
  private async checkRobotsTxt(url: string): Promise<{ allowed: boolean; crawlDelay?: number }> {
    try {
      // Parse domain from URL
      const urlObj = new URL(url);
      const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;

      // Fetch robots.txt
      const response = await fetch(robotsUrl);
      if (!response.ok) {
        // No robots.txt = allowed by default
        return { allowed: true };
      }

      const robotsTxt = await response.text();
      const robots = robotsParser({
        userAgent: 'InvestingProBot/1.0 (+https://investingpro.in)',
        allowOnNeutral: true,
      });

      robots.parseRobots(robotsUrl, robotsTxt);

      const allowed = robots.canCrawl(url);
      const crawlDelay = robots.getCrawlDelay();

      console.log(`🤖 robots.txt check for ${urlObj.host}: ${allowed ? '✅ Allowed' : '❌ Blocked'}`);
      if (crawlDelay) {
        console.log(`⏱️ Crawl delay: ${crawlDelay}s`);
      }

      return { allowed, crawlDelay };
    } catch (error) {
      console.warn(`⚠️ Could not check robots.txt for ${url}:`, error);
      // On error, allow by default but log warning
      return { allowed: true };
    }
  }

  /**
   * Main execution method with retry logic
   */
  async run(): Promise<ScraperResult<T>> {
    this.logger = new PipelineLogger(this.name); // Re-init with correct name
    console.log(`🚀 Starting ${this.name} scraper...`);
    
    // Start Pipeline Log
    const runId = await this.logger.start({
        source: this.sourceName,
        url: this.sourceUrl
    });

    const startTime = Date.now();
    let retryAttempts = 0;

    try {
      // 1. Scrape with retry
      const { data: rawData, retryAttempts: attempts } = await this.scrapeWithRetry();
      retryAttempts = attempts;
      console.log(`📦 Scraped ${rawData.length} items from ${this.sourceName}${attempts > 0 ? ` (after ${attempts} retries)` : ''}`);

      // 2. Validate
      const validData: T[] = [];
      const invalidData: any[] = [];

      for (const item of rawData) {
        const result = this.schema.safeParse(item);
        if (result.success) {
          validData.push(result.data);
        } else {
          invalidData.push({ item, error: result.error });
        }
      }

      if (invalidData.length > 0) {
        console.warn(`⚠️ ${invalidData.length} items failed validation`);
      }

      // 3. Save
      if (validData.length > 0) {
        await this.save(validData, runId);
      }

      const duration = Date.now() - startTime;
      console.log(`✅ ${this.name} completed in ${duration}ms. Saved ${validData.length} items.`);

      const resultMetadata = {
        duration,
        total: rawData.length,
        valid: validData.length,
        invalid: invalidData.length,
        retryAttempts
      };

      // 4. Log success to Pipeline Runs (Truth Console)
      await this.logger.complete({
        summary: resultMetadata,
        sample_data: validData.slice(0, 50), // Store sample for verification
        invalid_samples: invalidData.slice(0, 10)
      });

      return {
        data: validData,
        source: this.sourceName,
        metadata: resultMetadata
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.error(`❌ ${this.name} failed after ${retryAttempts} retries:`, error);

      // Log failure to Pipeline Runs
      await this.logger.fail(error as Error);

      throw error;
    }
  }

  /**
   * Default save implementation (can be overridden)
   */
  async save(data: T[], runId?: string): Promise<void> {
    // This needs to be implemented by the subclass
    throw new Error("Save method must be implemented by subclass");
  }
}
