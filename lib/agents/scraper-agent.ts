/**
 * Scraper Agent
 * 
 * Manages all scrapers:
 * - Executes scrapers
 * - Tracks scraper runs
 * - Monitors scraper health
 * - Tracks data updates
 * - Schedules scraper runs
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { logger } from '@/lib/logger';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ScraperConfig {
    name: string;
    category: 'credit-cards' | 'loans' | 'insurance' | 'mutual-funds' | 'reviews' | 'rates' | 'other';
    sourceUrl: string;
    sourceType: 'bank-website' | 'aggregator' | 'api' | 'rss' | 'other';
    scriptPath: string;
    scheduleType?: 'manual' | 'daily' | 'weekly' | 'monthly' | 'continuous';
}

export interface ScraperRunResult {
    scraperId: string;
    runId: string;
    status: 'completed' | 'failed';
    itemsScraped: number;
    itemsUpdated: number;
    itemsCreated: number;
    itemsFailed: number;
    executionTime: number;
    errors?: string[];
}

export class ScraperAgent extends BaseAgent {
    constructor() {
        super('ScraperAgent');
    }
    
    /**
     * Register a scraper
     */
    async registerScraper(config: ScraperConfig): Promise<string> {
        const startTime = Date.now();
        
        try {
            logger.info('ScraperAgent: Registering scraper...', { name: config.name });
            
            const { data: scraper, error } = await this.supabase
                .from('scrapers')
                .upsert({
                    name: config.name,
                    display_name: config.name,
                    category: config.category,
                    source_url: config.sourceUrl,
                    source_type: config.sourceType,
                    script_path: config.scriptPath,
                    schedule_type: config.scheduleType || 'manual',
                    is_active: true
                }, { onConflict: 'name' })
                .select()
                .single();
            
            if (error) throw error;
            
            logger.info('ScraperAgent: Scraper registered', { scraperId: scraper.id });
            
            return scraper.id;
            
        } catch (error) {
            logger.error('ScraperAgent: Failed to register scraper', error as Error);
            throw error;
        }
    }
    
    /**
     * Execute a scraper
     */
    async executeScraper(scraperId: string, options?: {
        force?: boolean;
        config?: Record<string, any>;
    }): Promise<ScraperRunResult> {
        const startTime = Date.now();
        
        try {
            logger.info('ScraperAgent: Executing scraper...', { scraperId });
            
            // Get scraper config
            const { data: scraper, error: scraperError } = await this.supabase
                .from('scrapers')
                .select('*')
                .eq('id', scraperId)
                .single();
            
            if (scraperError || !scraper) {
                throw new Error(`Scraper not found: ${scraperId}`);
            }
            
            if (!scraper.is_active && !options?.force) {
                throw new Error(`Scraper is not active: ${scraper.name}`);
            }
            
            // Create run record
            const { data: run, error: runError } = await this.supabase
                .from('scraper_runs')
                .insert({
                    scraper_id: scraperId,
                    status: 'running',
                    run_config: options?.config || {}
                })
                .select()
                .single();
            
            if (runError) throw runError;
            
            const runId = run.id;
            
            // Execute scraper script
            let executionResult: any;
            try {
                executionResult = await this.runScraperScript(scraper.script_path, options?.config);
            } catch (error: any) {
                // Update run as failed
                await this.supabase
                    .from('scraper_runs')
                    .update({
                        status: 'failed',
                        completed_at: new Date().toISOString(),
                        error_message: error.message,
                        error_stack: error.stack,
                        execution_time_ms: Date.now() - startTime
                    })
                    .eq('id', runId);
                
                throw error;
            }
            
            // Update run record
            const executionTime = Date.now() - startTime;
            await this.supabase
                .from('scraper_runs')
                .update({
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                    items_scraped: executionResult.itemsScraped || 0,
                    items_updated: executionResult.itemsUpdated || 0,
                    items_created: executionResult.itemsCreated || 0,
                    items_failed: executionResult.itemsFailed || 0,
                    execution_time_ms: executionTime,
                    logs: executionResult.logs || []
                })
                .eq('id', runId);
            
            // Update scraper last_run_at
            await this.supabase
                .from('scrapers')
                .update({
                    last_run_at: new Date().toISOString(),
                    next_run_at: this.calculateNextRun(scraper.schedule_type, scraper.schedule_config)
                })
                .eq('id', scraperId);
            
            // Update scraper health
            await this.updateScraperHealth(scraperId);
            
            logger.info('ScraperAgent: Scraper execution complete', { 
                scraperId, 
                runId,
                itemsScraped: executionResult.itemsScraped 
            });
            
            return {
                scraperId,
                runId,
                status: 'completed',
                itemsScraped: executionResult.itemsScraped || 0,
                itemsUpdated: executionResult.itemsUpdated || 0,
                itemsCreated: executionResult.itemsCreated || 0,
                itemsFailed: executionResult.itemsFailed || 0,
                executionTime
            };
            
        } catch (error) {
            logger.error('ScraperAgent: Scraper execution failed', error as Error);
            throw error;
        }
    }
    
    /**
     * Run scraper script
     */
    private async runScraperScript(scriptPath: string, config?: Record<string, any>): Promise<any> {
        // Execute the scraper script
        // In production, this would use a proper script runner
        const command = `npx tsx ${scriptPath}`;
        
        try {
            const { stdout, stderr } = await execAsync(command, {
                env: {
                    ...process.env,
                    ...config
                },
                maxBuffer: 10 * 1024 * 1024 // 10MB
            });
            
            // Parse output (scrapers should output JSON with results)
            // For now, return mock data
            return {
                itemsScraped: 10,
                itemsUpdated: 8,
                itemsCreated: 2,
                itemsFailed: 0,
                logs: stdout.split('\n').filter((line: string) => line.trim())
            };
            
        } catch (error: any) {
            logger.error('ScraperAgent: Script execution failed', error);
            throw new Error(`Scraper script failed: ${error.message}`);
        }
    }
    
    /**
     * Track data update
     */
    async trackDataUpdate(runId: string, update: {
        productType: string;
        productId?: string;
        productSlug: string;
        updateType: 'created' | 'updated' | 'deleted' | 'no_change';
        fieldsUpdated?: string[];
        oldData?: any;
        newData: any;
        sourceUrl?: string;
    }): Promise<void> {
        try {
            await this.supabase.from('data_updates').insert({
                scraper_run_id: runId,
                product_type: update.productType,
                product_id: update.productId,
                product_slug: update.productSlug,
                update_type: update.updateType,
                fields_updated: update.fieldsUpdated || [],
                old_data: update.oldData,
                new_data: update.newData,
                source_url: update.sourceUrl,
                validation_status: 'pending'
            });
        } catch (error) {
            logger.warn('ScraperAgent: Failed to track data update', error as Error);
        }
    }
    
    /**
     * Update scraper health
     */
    private async updateScraperHealth(scraperId: string): Promise<void> {
        try {
            // Call database function to update health
            await this.supabase.rpc('update_scraper_health', { p_scraper_id: scraperId });
        } catch (error) {
            logger.warn('ScraperAgent: Failed to update scraper health', error as Error);
        }
    }
    
    /**
     * Calculate next run time
     */
    private calculateNextRun(scheduleType: string, scheduleConfig?: any): string | null {
        if (scheduleType === 'manual') return null;
        
        const now = new Date();
        const nextRun = new Date(now);
        
        switch (scheduleType) {
            case 'daily':
                nextRun.setDate(nextRun.getDate() + 1);
                if (scheduleConfig?.time) {
                    const [hours, minutes] = scheduleConfig.time.split(':');
                    nextRun.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                }
                break;
            case 'weekly':
                nextRun.setDate(nextRun.getDate() + 7);
                break;
            case 'monthly':
                nextRun.setMonth(nextRun.getMonth() + 1);
                break;
            case 'continuous':
                // Run every hour
                nextRun.setHours(nextRun.getHours() + 1);
                break;
        }
        
        return nextRun.toISOString();
    }
    
    /**
     * Get all scrapers
     */
    async getAllScrapers(): Promise<any[]> {
        const { data, error } = await this.supabase
            .from('scrapers')
            .select('*')
            .order('name');
        
        if (error) {
            logger.error('ScraperAgent: Failed to get scrapers', error);
            return [];
        }
        
        return data || [];
    }
    
    /**
     * Get scraper runs
     */
    async getScraperRuns(scraperId: string, limit: number = 10): Promise<any[]> {
        const { data, error } = await this.supabase
            .from('scraper_runs')
            .select('*')
            .eq('scraper_id', scraperId)
            .order('started_at', { ascending: false })
            .limit(limit);
        
        if (error) {
            logger.error('ScraperAgent: Failed to get scraper runs', error);
            return [];
        }
        
        return data || [];
    }
    
    /**
     * Get data updates for a run
     */
    async getDataUpdates(runId: string): Promise<any[]> {
        const { data, error } = await this.supabase
            .from('data_updates')
            .select('*')
            .eq('scraper_run_id', runId)
            .order('created_at', { ascending: false });
        
        if (error) {
            logger.error('ScraperAgent: Failed to get data updates', error);
            return [];
        }
        
        return data || [];
    }
    
    /**
     * Execute agent task
     */
    async execute(context: AgentContext): Promise<AgentResult> {
        const startTime = Date.now();
        
        try {
            if (context.action === 'register') {
                const scraperId = await this.registerScraper(context.config);
                return {
                    success: true,
                    data: { scraperId },
                    executionTime: Date.now() - startTime
                };
            } else if (context.action === 'execute') {
                const result = await this.executeScraper(context.scraperId, context.options);
                return {
                    success: true,
                    data: result,
                    executionTime: Date.now() - startTime
                };
            } else if (context.action === 'list') {
                const scrapers = await this.getAllScrapers();
                return {
                    success: true,
                    data: scrapers,
                    executionTime: Date.now() - startTime
                };
            }
            
            return {
                success: false,
                error: 'Invalid action',
                executionTime: Date.now() - startTime
            };
        } catch (error) {
            return this.handleError(error, context);
        }
    }
}
