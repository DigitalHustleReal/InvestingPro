/**
 * Real-Time Data Synchronization Orchestrator
 * 
 * Purpose: Continuously monitor data sources and automatically update
 * product information when changes are detected.
 */

import { eventBus, SystemEvent, publishEvent } from '@/lib/infrastructure/event-bus/event-bus';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/client';

interface DataSource {
  id: string;
  name: string;
  url: string;
  type: 'bank_rates' | 'mutual_funds' | 'credit_cards' | 'insurance';
  scrapeFrequency: number; // milliseconds
  lastScraped?: number;
  isActive: boolean;
}

interface ChangeDetection {
  source: string;
  changes: Array<{
    type: 'NEW' | 'UPDATED' | 'DELETED';
    entity: string;
    oldValue?: any;
    newValue?: any;
  }>;
  detectedAt: number;
}

export class RealTimeDataOrchestrator {
  private isRunning = false;
  private scrapers: Map<string, NodeJS.Timeout> = new Map();
  private supabase = createClient();

  /**
   * Start continuous data synchronization
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Data orchestrator already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting real-time data orchestrator');

    // Load data sources from database
    const sources = await this.loadDataSources();

    // Schedule scraping for each source
    for (const source of sources) {
      if (source.isActive) {
        this.scheduleSmartScraping(source);
      }
    }

    // Setup event listeners
    this.setupEventSubscriptions();
  }

  /**
   * Stop all scrapers
   */
  stop(): void {
    this.isRunning = false;
    
    // Clear all scheduled scrapers
    for (const [sourceId, timeout] of this.scrapers) {
      clearInterval(timeout);
      logger.info(`Stopped scraper for ${sourceId}`);
    }
    
    this.scrapers.clear();
    logger.info('Stopped real-time data orchestrator');
  }

  /**
   * Load data sources from database
   */
  private async loadDataSources(): Promise<DataSource[]> {
    try {
      const { data, error } = await this.supabase
        .from('data_sources')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      return data || [];
    } catch (error) {
      logger.error('Error loading data sources', error as Error);
      
      // Return default sources if database fails
      return this.getDefaultDataSources();
    }
  }

  /**
   * Get default data sources
   */
  private getDefaultDataSources(): DataSource[] {
    return [
      {
        id: 'rbi-rates',
        name: 'RBI Interest Rates',
        url: 'https://www.rbi.org.in',
        type: 'bank_rates',
        scrapeFrequency: 24 * 60 * 60 * 1000, // Daily
        isActive: true
      },
      {
        id: 'amfi-nav',
        name: 'AMFI Mutual Fund NAV',
        url: 'https://www.amfiindia.com',
        type: 'mutual_funds',
        scrapeFrequency: 60 * 60 * 1000, // Hourly
        isActive: true
      }
    ];
  }

  /**
   * Schedule smart scraping with adaptive frequency
   */
  private scheduleSmartScraping(source: DataSource): void {
    logger.info(`Scheduling scraper for ${source.name} (every ${source.scrapeFrequency}ms)`);

    const scrapeJob = setInterval(async () => {
      try {
        await this.executeScrape(source);
      } catch (error) {
        logger.error(`Scraping failed for ${source.name}`, error as Error);
        
        await publishEvent(
          SystemEvent.SCRAPER_FAILED,
          { sourceId: source.id, error: (error as Error).message },
          'data-orchestrator'
        );
      }
    }, source.scrapeFrequency);

    this.scrapers.set(source.id, scrapeJob);

    // Execute immediately on start
    this.executeScrape(source);
  }

  /**
   * Execute scraping for a data source
   */
  private async executeScrape(source: DataSource): Promise<void> {
    logger.info(`Scraping ${source.name}...`);

    try {
      // Call appropriate scraper based on type
      let newData: any;
      
      switch (source.type) {
        case 'bank_rates':
          newData = await this.scrapeBankRates(source);
          break;
        case 'mutual_funds':
          newData = await this.scrapeMutualFunds(source);
          break;
        case 'credit_cards':
          newData = await this.scrapeCreditCards(source);
          break;
        default:
          logger.warn(`Unknown source type: ${source.type}`);
          return;
      }

      // Detect changes
      const changes = await this.detectChanges(source.id, newData);

      if (changes.changes.length > 0) {
        logger.info(`Detected ${changes.changes.length} changes from ${source.name}`);
        
        // Update database
        await this.applyChanges(changes);
        
        // Publish events for each significant change
        for (const change of changes.changes) {
          if (change.type === 'UPDATED') {
            await publishEvent(
              SystemEvent.RATE_UPDATED,
              {
                product: change.entity,
                oldValue: change.oldValue,
                newValue: change.newValue,
                source: source.name
              },
              'data-orchestrator'
            );
          } else if (change.type === 'NEW') {
            await publishEvent(
              SystemEvent.NEW_PRODUCT_DETECTED,
              {
                product: change.entity,
                data: change.newValue,
                source: source.name
              },
              'data-orchestrator'
            );
          }
        }
      }

      // Update last scraped timestamp
      await this.updateLastScraped(source.id);

      await publishEvent(
        SystemEvent.SCRAPER_SUCCESS,
        { sourceId: source.id, changesDetected: changes.changes.length },
        'data-orchestrator'
      );

    } catch (error) {
      throw error;
    }
  }

  /**
   * Scrape bank rates (placeholder - implement actual scraping)
   */
  private async scrapeBankRates(source: DataSource): Promise<any> {
    // TODO: Implement actual scraping using Playwright/Cheerio
    // For now, return mock data
    return {
      'sbi-home-loan': { rate: 8.40, lastUpdated: Date.now() },
      'hdfc-home-loan': { rate: 8.35, lastUpdated: Date.now() }
    };
  }

  /**
   * Scrape mutual fund NAVs (placeholder)
   */
  private async scrapeMutualFunds(source: DataSource): Promise<any> {
    // TODO: Implement AMFI scraping
    return {};
  }

  /**
   * Scrape credit card data (placeholder)
   */
  private async scrapeCreditCards(source: DataSource): Promise<any> {
    // TODO: Implement credit card scraping
    return {};
  }

  /**
   * Detect changes between old and new data
   */
  private async detectChanges(sourceId: string, newData: any): Promise<ChangeDetection> {
    const changes: ChangeDetection = {
      source: sourceId,
      changes: [],
      detectedAt: Date.now()
    };

    try {
      // Get existing data from database
      const { data: existingData } = await this.supabase
        .from('product_data_cache')
        .select('*')
        .eq('source_id', sourceId)
        .single();

      if (!existingData) {
        // All data is new
        for (const [key, value] of Object.entries(newData)) {
          changes.changes.push({
            type: 'NEW',
            entity: key,
            newValue: value
          });
        }
      } else {
        // Compare with existing data
        const oldData = existingData.data;
        
        for (const [key, newValue] of Object.entries(newData)) {
          const oldValue = oldData[key];
          
          if (!oldValue) {
            changes.changes.push({
              type: 'NEW',
              entity: key,
              newValue
            });
          } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            changes.changes.push({
              type: 'UPDATED',
              entity: key,
              oldValue,
              newValue
            });
          }
        }
      }

      return changes;
    } catch (error) {
      logger.error('Error detecting changes', error as Error);
      return changes;
    }
  }

  /**
   * Apply changes to database
   */
  private async applyChanges(changes: ChangeDetection): Promise<void> {
    try {
      // Update cache
      await this.supabase
        .from('product_data_cache')
        .upsert({
          source_id: changes.source,
          data: changes.changes.reduce((acc, change) => {
            acc[change.entity] = change.newValue;
            return acc;
          }, {} as any),
          updated_at: new Date().toISOString()
        });

      logger.info(`Applied ${changes.changes.length} changes to database`);
    } catch (error) {
      logger.error('Error applying changes', error as Error);
    }
  }

  /**
   * Update last scraped timestamp
   */
  private async updateLastScraped(sourceId: string): Promise<void> {
    try {
      await this.supabase
        .from('data_sources')
        .update({ last_scraped: new Date().toISOString() })
        .eq('id', sourceId);
    } catch (error) {
      logger.error('Error updating last scraped', error as Error);
    }
  }

  /**
   * Setup event subscriptions
   */
  private setupEventSubscriptions(): void {
    // React to scraper failures - implement retry logic
    eventBus.subscribe(SystemEvent.SCRAPER_FAILED, async (payload) => {
      logger.warn(`Scraper failed for ${payload.data.sourceId}, will retry on next cycle`);
      // Could implement exponential backoff here
    });
  }
}

// Singleton instance
export const dataOrchestrator = new RealTimeDataOrchestrator();
