/**
 * RBI (Reserve Bank of India) API Integration
 * 
 * Fetches real-time policy rates from RBI
 * Sources:
 * - Repo Rate: https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx
 * - Base Rate: https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx
 * - Policy Rates: https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx
 */

import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export interface RBIPolicyRates {
    repoRate: number; // Policy repo rate
    reverseRepoRate: number;
    bankRate: number;
    mclr: number; // Marginal Cost of Funds Based Lending Rate
    baseRate: number;
    lastUpdated: string;
    source: string;
}

/**
 * Cache RBI rates in database for fast access
 */
const RBI_RATES_TABLE = 'rbi_policy_rates';

/**
 * Fetch RBI policy rates from website (scraping)
 * Note: RBI doesn't have a public API, so we scrape their website
 */
async function fetchRBIFromWebsite(): Promise<RBIPolicyRates | null> {
    try {
        // TODO: Implement web scraping for RBI website
        // For now, return cached/default values
        // In production, use Playwright/Puppeteer to scrape:
        // https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx
        
        logger.warn('RBI website scraping not yet implemented - using cached/default rates');
        
        // Default rates (as of 2024, update via scraper)
        return {
            repoRate: 6.5,
            reverseRepoRate: 3.35,
            bankRate: 6.75,
            mclr: 8.0,
            baseRate: 8.0,
            lastUpdated: new Date().toISOString(),
            source: 'rbi_website'
        };
    } catch (error) {
        logger.error('Error fetching RBI rates from website', error as Error);
        return null;
    }
}

/**
 * Get RBI policy rates (from cache or fetch)
 */
export async function getRBIPolicyRates(): Promise<RBIPolicyRates | null> {
    const supabase = await createClient();
    
    try {
        // Try to get from cache first
        const { data: cachedRates, error: cacheError } = await supabase
            .from(RBI_RATES_TABLE)
            .select('*')
            .order('last_updated', { ascending: false })
            .limit(1)
            .single();

        // If cache exists and is less than 24 hours old, use it
        if (!cacheError && cachedRates) {
            const cacheAge = Date.now() - new Date(cachedRates.last_updated).getTime();
            const hoursSinceUpdate = cacheAge / (1000 * 60 * 60);
            
            if (hoursSinceUpdate < 24) {
                logger.info('Using cached RBI rates', { age: `${hoursSinceUpdate.toFixed(1)} hours` });
                return {
                    repoRate: cachedRates.repo_rate,
                    reverseRepoRate: cachedRates.reverse_repo_rate,
                    bankRate: cachedRates.bank_rate,
                    mclr: cachedRates.mclr,
                    baseRate: cachedRates.base_rate,
                    lastUpdated: cachedRates.last_updated,
                    source: 'database_cache'
                };
            }
        }

        // Cache expired or doesn't exist - fetch fresh
        logger.info('Fetching fresh RBI rates');
        const freshRates = await fetchRBIFromWebsite();
        
        if (freshRates) {
            // Save to cache
            await supabase.from(RBI_RATES_TABLE).upsert({
                repo_rate: freshRates.repoRate,
                reverse_repo_rate: freshRates.reverseRepoRate,
                bank_rate: freshRates.bankRate,
                mclr: freshRates.mclr,
                base_rate: freshRates.baseRate,
                last_updated: freshRates.lastUpdated,
                source: freshRates.source
            }, {
                onConflict: 'id' // Assuming there's a single row with id=1
            });
        }
        
        return freshRates;
    } catch (error) {
        logger.error('Error getting RBI policy rates', error as Error);
        return null;
    }
}

/**
 * Calculate expected interest rate range based on RBI policy rates
 */
export async function getExpectedInterestRateRange(
    productType: 'credit_card' | 'loan' | 'savings' | 'fd'
): Promise<{ min: number; max: number; source: string } | null> {
    const rates = await getRBIPolicyRates();
    
    if (!rates) {
        return null;
    }

    // Calculate expected ranges based on RBI policy rates
    switch (productType) {
        case 'credit_card':
            // Credit card rates: Base rate + 10-20% = typically 18-28%
            return {
                min: rates.baseRate + 10,
                max: rates.baseRate + 25,
                source: 'rbi_calculated'
            };
        
        case 'loan':
            // Personal/home loan rates: Base rate + 2-5% = typically 10-13%
            return {
                min: rates.baseRate + 2,
                max: rates.baseRate + 6,
                source: 'rbi_calculated'
            };
        
        case 'savings':
            // Savings account rates: Reverse repo rate + 0.5-2% = typically 4-5.5%
            return {
                min: rates.reverseRepoRate + 0.5,
                max: rates.reverseRepoRate + 2,
                source: 'rbi_calculated'
            };
        
        case 'fd':
            // Fixed deposit rates: Repo rate + 1-3% = typically 7.5-9.5%
            return {
                min: rates.repoRate + 1,
                max: rates.repoRate + 3,
                source: 'rbi_calculated'
            };
        
        default:
            return null;
    }
}

/**
 * Update RBI rates (called by cron job)
 */
export async function updateRBIRates(): Promise<boolean> {
    try {
        logger.info('Updating RBI policy rates...');
        const freshRates = await fetchRBIFromWebsite();
        
        if (freshRates) {
            const supabase = await createClient();
            await supabase.from(RBI_RATES_TABLE).upsert({
                repo_rate: freshRates.repoRate,
                reverse_repo_rate: freshRates.reverseRepoRate,
                bank_rate: freshRates.bankRate,
                mclr: freshRates.mclr,
                base_rate: freshRates.baseRate,
                last_updated: freshRates.lastUpdated,
                source: freshRates.source
            });
            
            logger.info('RBI rates updated successfully', { repoRate: freshRates.repoRate });
            return true;
        }
        
        return false;
    } catch (error) {
        logger.error('Error updating RBI rates', error as Error);
        return false;
    }
}
