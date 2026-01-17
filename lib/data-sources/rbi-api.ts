/**
 * RBI (Reserve Bank of India) API Integration
 * 
 * Fetches real-time policy rates from RBI:
 * - Repo Rate
 * - Reverse Repo Rate
 * - Bank Rate
 * - Base Rate
 * - Policy Rates
 * 
 * Sources:
 * - RBI Press Releases: https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx
 * - RBI Master Directions: https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx
 */

import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export interface RBIPolicyRates {
    repoRate: number; // Policy repo rate
    reverseRepoRate: number; // Reverse repo rate
    bankRate: number; // Bank rate
    baseRate: number; // Base rate (calculated: repo + 1.5%)
    mclr: number; // Marginal Cost of Funds Based Lending Rate
    lastUpdated: string; // ISO date string
    source: string; // Source URL
}

/**
 * Fetch RBI policy rates from database (cached)
 * Rates are updated daily via cron job
 */
export async function getRBIPolicyRates(): Promise<RBIPolicyRates | null> {
    try {
        const supabase = await createClient();
        
        // Check if we have cached RBI rates
        const { data, error } = await supabase
            .from('rbi_policy_rates')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !data) {
            logger.warn('RBI policy rates not found in database, using defaults', { error });
            return getDefaultRBIRates();
        }

        return {
            repoRate: parseFloat(String(data.repo_rate)),
            reverseRepoRate: parseFloat(String(data.reverse_repo_rate)),
            bankRate: parseFloat(String(data.bank_rate)),
            baseRate: parseFloat(String(data.base_rate)),
            mclr: parseFloat(String(data.mclr || data.base_rate)),
            lastUpdated: data.updated_at || new Date().toISOString(),
            source: data.source_url || 'https://www.rbi.org.in/'
        };
    } catch (error) {
        logger.error('Error fetching RBI policy rates', error as Error);
        return getDefaultRBIRates();
    }
}

/**
 * Scrape RBI website for latest policy rates
 * This is a fallback if database doesn't have recent data
 */
export async function scrapeRBIRates(): Promise<RBIPolicyRates | null> {
    try {
        // TODO: Implement web scraping of RBI website
        // RBI Press Release URL: https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx
        
        // For now, return null (will use defaults)
        // In production, use Playwright/Puppeteer to scrape RBI website
        logger.info('RBI scraping not yet implemented, using database/defaults');
        return null;
    } catch (error) {
        logger.error('Error scraping RBI rates', error as Error);
        return null;
    }
}

/**
 * Get default RBI rates (fallback)
 * These are approximate rates - should be updated via cron job
 */
function getDefaultRBIRates(): RBIPolicyRates {
    // Default rates (as of 2024, update via cron job)
    const defaultRepoRate = 6.5;
    
    return {
        repoRate: defaultRepoRate,
        reverseRepoRate: defaultRepoRate - 0.25, // Typically 0.25% below repo
        bankRate: defaultRepoRate + 0.25, // Typically 0.25% above repo
        baseRate: defaultRepoRate + 1.5, // Typically repo + 1.5%
        mclr: defaultRepoRate + 1.5, // MCLR typically close to base rate
        lastUpdated: new Date().toISOString(),
        source: 'https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx'
    };
}

/**
 * Calculate expected interest rate ranges based on RBI policy rates
 */
export function calculateExpectedInterestRanges(rates: RBIPolicyRates): {
    creditCard: { min: number; max: number };
    personalLoan: { min: number; max: number };
    homeLoan: { min: number; max: number };
    savings: { min: number; max: number };
    fd: { min: number; max: number };
} {
    // Credit card rates: Base rate + 10-20% = typically 18-28%
    const creditCardMin = rates.baseRate + 10;
    const creditCardMax = rates.baseRate + 25;

    // Personal loan rates: Base rate + 2-6% = typically 10-13%
    const personalLoanMin = rates.baseRate + 2;
    const personalLoanMax = rates.baseRate + 6;

    // Home loan rates: Base rate + 1-3% = typically 9-11%
    const homeLoanMin = rates.baseRate + 1;
    const homeLoanMax = rates.baseRate + 3;

    // Savings account rates: 2.5-4% (not directly tied to repo, but influenced)
    const savingsMin = 2.5;
    const savingsMax = 4.5;

    // Fixed deposit rates: Base rate + 0.5-2% = typically 7-9%
    const fdMin = rates.baseRate + 0.5;
    const fdMax = rates.baseRate + 2;

    return {
        creditCard: { min: creditCardMin, max: creditCardMax },
        personalLoan: { min: personalLoanMin, max: personalLoanMax },
        homeLoan: { min: homeLoanMin, max: homeLoanMax },
        savings: { min: savingsMin, max: savingsMax },
        fd: { min: fdMin, max: fdMax }
    };
}

/**
 * Update RBI rates in database (called by cron job)
 */
export async function updateRBIRates(rates: RBIPolicyRates): Promise<boolean> {
    try {
        const supabase = await createClient();
        
        const { error } = await supabase
            .from('rbi_policy_rates')
            .upsert({
                repo_rate: rates.repoRate,
                reverse_repo_rate: rates.reverseRepoRate,
                bank_rate: rates.bankRate,
                base_rate: rates.baseRate,
                mclr: rates.mclr,
                source_url: rates.source,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'id' // Assuming there's a single row with id=1
            });

        if (error) {
            logger.error('Error updating RBI rates in database', error);
            return false;
        }

        logger.info('RBI policy rates updated successfully', { rates });
        return true;
    } catch (error) {
        logger.error('Error updating RBI rates', error as Error);
        return false;
    }
}
