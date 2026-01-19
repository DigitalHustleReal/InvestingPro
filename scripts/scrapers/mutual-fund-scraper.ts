/**
 * Mutual Fund Scraper
 * Scrapes mutual fund data from AMFI (official source) and aggregators
 * 
 * Sources:
 * - AMFI (Official): https://www.amfiindia.com/spages/NAVAll.txt
 * - Value Research: https://www.valueresearchonline.com/
 * - Moneycontrol: https://www.moneycontrol.com/mutual-funds/
 */

import { getAllMutualFunds } from '@/lib/amfi-scraper';
import { logger } from '@/lib/logger';

export interface ScrapedMutualFund {
    name: string;
    fund_house: string;
    category: 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Flexi Cap' | 'Multi Cap' | 'ELSS' | 'Index Fund' | 'Debt' | 'Hybrid';
    scheme_code?: number;
    nav: number;
    description?: string;
    aum?: string;
    expense_ratio?: number;
    returns_1y?: number;
    returns_3y?: number;
    returns_5y?: number;
    risk?: 'Low' | 'Moderate' | 'Moderately High' | 'High' | 'Very High';
    min_investment?: string;
    launch_date?: string;
    rating?: number;
    image_url?: string;
}

/**
 * Scrape from AMFI (official source - most reliable)
 */
export async function scrapeAMFI(): Promise<ScrapedMutualFund[]> {
    try {
        logger.info('Scraping mutual funds from AMFI');
        const amfiFunds = await getAllMutualFunds();

        // Transform AMFI data to our format
        const funds: ScrapedMutualFund[] = amfiFunds.map(fund => {
            // Parse scheme name to extract fund house and category
            const schemeName = fund.schemeName;
            const parts = schemeName.split('-');
            
            // Basic parsing (can be improved)
            let fundHouse = parts[0]?.trim() || 'Unknown';
            let category: ScrapedMutualFund['category'] = 'Large Cap';
            let name = schemeName;

            // Try to extract category from name
            const categoryKeywords: Record<string, ScrapedMutualFund['category']> = {
                'large cap': 'Large Cap',
                'mid cap': 'Mid Cap',
                'small cap': 'Small Cap',
                'flexi cap': 'Flexi Cap',
                'multi cap': 'Multi Cap',
                'elss': 'ELSS',
                'index': 'Index Fund',
                'debt': 'Debt',
                'hybrid': 'Hybrid'
            };

            const lowerName = schemeName.toLowerCase();
            for (const [keyword, cat] of Object.entries(categoryKeywords)) {
                if (lowerName.includes(keyword)) {
                    category = cat;
                    break;
                }
            }

            return {
                name: name.substring(0, 200), // Limit length
                fund_house: fundHouse.substring(0, 100),
                category,
                scheme_code: parseInt(fund.schemeCode) || undefined,
                nav: fund.nav,
                // Other fields would need additional scraping or API calls
            };
        });

        logger.info(`Scraped ${funds.length} mutual funds from AMFI`);
        return funds;

    } catch (error) {
        logger.error('Error scraping AMFI', error as Error);
        return [];
    }
}

/**
 * Enrich AMFI data with additional fields from aggregators
 * (Returns, expense ratio, AUM, etc.)
 */
export async function enrichMutualFundData(funds: ScrapedMutualFund[]): Promise<ScrapedMutualFund[]> {
    // TODO: Scrape additional data from Value Research, Moneycontrol
    // For now, return funds as-is
    logger.info(`Enriching ${funds.length} mutual funds (placeholder - needs aggregator scraping)`);
    return funds;
}

/**
 * Scrape all mutual fund sources
 */
export async function scrapeAllMutualFunds(): Promise<ScrapedMutualFund[]> {
    logger.info('Starting mutual fund scraping from all sources');

    // Scrape from AMFI (official source)
    let funds = await scrapeAMFI();

    // Enrich with additional data from aggregators
    funds = await enrichMutualFundData(funds);

    logger.info(`Total mutual funds scraped: ${funds.length}`);

    return funds;
}
