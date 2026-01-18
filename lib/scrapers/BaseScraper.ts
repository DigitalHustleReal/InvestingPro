import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';

export interface ScraperResult<T> {
  data: T[];
  source: string;
  metadata?: any;
}

export abstract class BaseScraper<T> {
  abstract name: string;
  abstract schedule: string;
  abstract sourceName: string;
  abstract sourceUrl: string;
  
  protected supabase = createClient();

  // Core abstract method to be implemented by specific scrapers
  abstract scrape(): Promise<T[]>;
  
  // Abstract validation schema
  abstract schema: z.ZodSchema<T>;

  /**
   * Main execution method
   */
  async run(): Promise<ScraperResult<T>> {
    console.log(`🚀 Starting ${this.name} scraper...`);
    const startTime = Date.now();

    try {
      // 1. Scrape
      const rawData = await this.scrape();
      console.log(`📦 Scraped ${rawData.length} items from ${this.sourceName}`);

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
        await this.save(validData);
      }

      const duration = Date.now() - startTime;
      console.log(`✅ ${this.name} completed in ${duration}ms. Saved ${validData.length} items.`);

      return {
        data: validData,
        source: this.sourceName,
        metadata: {
            duration,
            total: rawData.length,
            valid: validData.length,
            invalid: invalidData.length
        }
      };

    } catch (error) {
      console.error(`❌ ${this.name} failed:`, error);
      throw error;
    }
  }

  /**
   * Default save implementation (can be overridden)
   */
  async save(data: T[]): Promise<void> {
    // This needs to be implemented by the subclass or we need a generic save structure
    // Since table names vary, we enforce implementation in subclass for now
    throw new Error("Save method must be implemented by subclass");
  }
}
