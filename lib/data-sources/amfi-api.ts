/**
 * AMFI (Association of Mutual Funds in India) API Integration
 * 
 * Fetches real-time mutual fund data from AMFI:
 * - NAV (Net Asset Value)
 * - Returns (1Y, 3Y, 5Y)
 * - Expense Ratios
 * - AUM (Assets Under Management)
 * 
 * Official Source: https://portal.amfiindia.com/spages/NAVAll.txt
 */

import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export interface AMFIFundData {
    schemeCode: number;
    isin: string;
    schemeName: string;
    nav: number;
    date: string;
    fundHouse?: string;
    category?: string;
}

export interface AMFIFundDetails {
    schemeCode: number;
    schemeName: string;
    nav: number;
    returns1Y?: number;
    returns3Y?: number;
    returns5Y?: number;
    expenseRatio?: number;
    aum?: string;
    lastUpdated: string;
    source: string;
}

/**
 * Fetch AMFI NAV data directly from official source
 * AMFI provides a text file with all NAV data: https://portal.amfiindia.com/spages/NAVAll.txt
 */
export async function fetchAMFINAVData(): Promise<AMFIFundData[]> {
    try {
        const AMFI_URL = 'https://portal.amfiindia.com/spages/NAVAll.txt';
        
        logger.info('Fetching AMFI NAV data from official source', { url: AMFI_URL });
        
        const response = await fetch(AMFI_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; InvestingPro/1.0)',
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`AMFI API returned ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();
        const funds: AMFIFundData[] = [];
        
        // Parse AMFI text format
        // Format: Scheme Code;ISIN Div Payout/ISIN Growth;ISIN Div Reinvestment;Scheme Name;NAV;Date
        const lines = text.split('\n');
        let currentFundHouse = '';
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            // Skip empty lines
            if (!trimmed) continue;
            
            // Fund house name (starts with "Open Ended Schemes" or fund house name)
            if (trimmed.includes('Open Ended Schemes') || trimmed.includes('Close Ended Schemes')) {
                continue;
            }
            
            // Fund house name (no semicolon, usually in caps)
            if (!trimmed.includes(';') && trimmed.length > 3 && trimmed === trimmed.toUpperCase()) {
                currentFundHouse = trimmed;
                continue;
            }
            
            // NAV data line (contains semicolons)
            if (trimmed.includes(';')) {
                const parts = trimmed.split(';').map(p => p.trim());
                
                if (parts.length >= 5) {
                    const schemeCode = parseInt(parts[0]);
                    const isin = parts[1] || parts[2] || '';
                    const schemeName = parts[3];
                    const nav = parseFloat(parts[4]);
                    const date = parts[5] || new Date().toISOString().split('T')[0];
                    
                    if (!isNaN(schemeCode) && !isNaN(nav) && schemeName) {
                        funds.push({
                            schemeCode,
                            isin,
                            schemeName,
                            nav,
                            date,
                            fundHouse: currentFundHouse
                        });
                    }
                }
            }
        }

        logger.info(`Fetched ${funds.length} mutual fund NAV records from AMFI`);
        return funds;
    } catch (error) {
        logger.error('Error fetching AMFI NAV data', error as Error);
        throw error;
    }
}

/**
 * Get specific fund data from AMFI by scheme code or name
 */
export async function getAMFIFundData(
    schemeCode?: number,
    schemeName?: string
): Promise<AMFIFundDetails | null> {
    try {
        // First check product database (faster, cached)
        const supabase = await createClient();
        
        if (schemeCode) {
            const { data, error } = await supabase
                .from('mutual_funds')
                .select('*')
                .eq('scheme_code', schemeCode)
                .limit(1)
                .single();

            if (!error && data) {
                return {
                    schemeCode: data.scheme_code,
                    schemeName: data.name,
                    nav: parseFloat(String(data.nav)),
                    returns1Y: data.returns_1y ? parseFloat(String(data.returns_1y)) : undefined,
                    returns3Y: data.returns_3y ? parseFloat(String(data.returns_3y)) : undefined,
                    returns5Y: data.returns_5y ? parseFloat(String(data.returns_5y)) : undefined,
                    expenseRatio: data.expense_ratio ? parseFloat(String(data.expense_ratio)) : undefined,
                    aum: data.aum,
                    lastUpdated: data.updated_at || new Date().toISOString(),
                    source: 'https://portal.amfiindia.com/spages/NAVAll.txt'
                };
            }
        }

        if (schemeName) {
            const { data, error } = await supabase
                .from('mutual_funds')
                .select('*')
                .ilike('name', `%${schemeName}%`)
                .limit(1)
                .single();

            if (!error && data) {
                return {
                    schemeCode: data.scheme_code,
                    schemeName: data.name,
                    nav: parseFloat(String(data.nav)),
                    returns1Y: data.returns_1y ? parseFloat(String(data.returns_1y)) : undefined,
                    returns3Y: data.returns_3y ? parseFloat(String(data.returns_3y)) : undefined,
                    returns5Y: data.returns_5y ? parseFloat(String(data.returns_5y)) : undefined,
                    expenseRatio: data.expense_ratio ? parseFloat(String(data.expense_ratio)) : undefined,
                    aum: data.aum,
                    lastUpdated: data.updated_at || new Date().toISOString(),
                    source: 'https://portal.amfiindia.com/spages/NAVAll.txt'
                };
            }
        }

        // If not in database, fetch directly from AMFI (slower, but real-time)
        logger.info('Fund not in database, fetching directly from AMFI', { schemeCode, schemeName });
        const amfiData = await fetchAMFINAVData();
        
        const fund = amfiData.find(f => 
            (schemeCode && f.schemeCode === schemeCode) ||
            (schemeName && f.schemeName.toLowerCase().includes(schemeName.toLowerCase()))
        );

        if (fund) {
            return {
                schemeCode: fund.schemeCode,
                schemeName: fund.schemeName,
                nav: fund.nav,
                lastUpdated: fund.date,
                source: 'https://portal.amfiindia.com/spages/NAVAll.txt'
            };
        }

        return null;
    } catch (error) {
        logger.error('Error getting AMFI fund data', error as Error, { schemeCode, schemeName });
        return null;
    }
}

/**
 * Sync AMFI data to database (called by cron job)
 */
export async function syncAMFIDataToDatabase(): Promise<{ synced: number; errors: number }> {
    try {
        const supabase = await createClient();
        const amfiData = await fetchAMFINAVData();
        
        let synced = 0;
        let errors = 0;

        for (const fund of amfiData) {
            try {
                // Upsert to database
                const { error } = await supabase
                    .from('mutual_funds')
                    .upsert({
                        scheme_code: fund.schemeCode,
                        name: fund.schemeName,
                        fund_house: fund.fundHouse || 'Unknown',
                        nav: fund.nav,
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'scheme_code'
                    });

                if (error) {
                    logger.warn('Error syncing fund to database', { schemeCode: fund.schemeCode, error });
                    errors++;
                } else {
                    synced++;
                }
            } catch (error) {
                logger.error('Error processing fund', error as Error, { schemeCode: fund.schemeCode });
                errors++;
            }
        }

        logger.info(`AMFI data sync complete: ${synced} synced, ${errors} errors`);
        return { synced, errors };
    } catch (error) {
        logger.error('Error syncing AMFI data', error as Error);
        return { synced: 0, errors: 1 };
    }
}
