/**
 * Authoritative Source Validation for Fact-Checker
 * 
 * Validates financial data against official sources:
 * - RBI (Reserve Bank of India) - Interest rates, regulations
 * - AMFI (Association of Mutual Funds in India) - Mutual fund data
 * - SEBI (Securities and Exchange Board of India) - Regulations
 * - Product Database (credit_cards, mutual_funds tables) - Scraped official data
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { getRBIPolicyRates, calculateExpectedInterestRanges } from '@/lib/data-sources/rbi-api';
import { getAMFIFundData } from '@/lib/data-sources/amfi-api';
import type { FinancialData } from './fact-checker';

export interface AuthoritativeValidationResult {
    isValid: boolean;
    source: 'rbi' | 'amfi' | 'sebi' | 'product_db' | 'manual';
    verifiedValue?: number | string;
    officialValue?: number | string;
    discrepancy?: number; // Percentage difference
    confidence: number; // 0-100
    sourceUrl?: string;
    lastUpdated?: string;
}

/**
 * Validate interest rates against RBI data
 * RBI publishes base rates, repo rates, and policy rates
 */
export async function validateAgainstRBI(
    data: FinancialData,
    productType: 'credit_card' | 'loan' | 'savings' | 'fd'
): Promise<AuthoritativeValidationResult[]> {
    const results: AuthoritativeValidationResult[] = [];

    if (data.interestRate) {
        const rate = parseFloat(String(data.interestRate));
        
        // Fetch real-time RBI policy rates
        const rbiRates = await getRBIPolicyRates();
        if (!rbiRates) {
            logger.warn('RBI rates not available, skipping RBI validation');
            return results;
        }

        // Calculate expected ranges based on real-time RBI rates
        const expectedRanges = calculateExpectedInterestRanges(rbiRates);
        
        let expectedRange: { min: number; max: number };
        let rangeName: string;

        if (productType === 'credit_card') {
            expectedRange = expectedRanges.creditCard;
            rangeName = 'credit card';
        } else if (productType === 'loan') {
            expectedRange = expectedRanges.personalLoan;
            rangeName = 'personal loan';
        } else if (productType === 'savings') {
            expectedRange = expectedRanges.savings;
            rangeName = 'savings account';
        } else if (productType === 'fd') {
            expectedRange = expectedRanges.fd;
            rangeName = 'fixed deposit';
        } else {
            // Default to loan range
            expectedRange = expectedRanges.personalLoan;
            rangeName = 'loan';
        }
        
        if (rate < expectedRange.min || rate > expectedRange.max) {
            const discrepancy = rate < expectedRange.min 
                ? expectedRange.min - rate 
                : rate - expectedRange.max;
            
            results.push({
                isValid: false,
                source: 'rbi',
                verifiedValue: rate,
                officialValue: `${expectedRange.min}-${expectedRange.max}%`,
                discrepancy,
                confidence: 90,
                sourceUrl: rbiRates.source,
                lastUpdated: rbiRates.lastUpdated
            });
        } else {
            results.push({
                isValid: true,
                source: 'rbi',
                verifiedValue: rate,
                officialValue: `${expectedRange.min}-${expectedRange.max}%`,
                confidence: 90, // Higher confidence with real-time data
                sourceUrl: rbiRates.source,
                lastUpdated: rbiRates.lastUpdated
            });
        }
    }

    return results;
}

/**
 * Validate mutual fund data against AMFI
 * AMFI provides official NAV, AUM, expense ratios
 */
export async function validateAgainstAMFI(
    data: FinancialData,
    schemeName?: string,
    schemeCode?: number
): Promise<AuthoritativeValidationResult[]> {
    const results: AuthoritativeValidationResult[] = [];
    const supabase = await createClient();

    // Get AMFI data (checks database first, then fetches directly from AMFI if needed)
    if (schemeName || schemeCode) {
        const amfiData = await getAMFIFundData(schemeCode, schemeName);

        if (amfiData) {
            // Validate returns
            if (data.return) {
                const claimedReturn = parseFloat(String(data.return));
                const officialReturn = amfiData.returns1Y || amfiData.returns3Y || amfiData.returns5Y;
                
                if (officialReturn) {
                    const discrepancy = Math.abs(claimedReturn - officialReturn);
                    const isValid = discrepancy < 2; // Allow 2% variance
                    
                    results.push({
                        isValid,
                        source: 'amfi',
                        verifiedValue: claimedReturn,
                        officialValue: officialReturn,
                        discrepancy,
                        confidence: isValid ? 95 : 70,
                        sourceUrl: amfiData.source,
                        lastUpdated: amfiData.lastUpdated
                    });
                } else {
                    // If returns not available, validate NAV (at least check if fund exists)
                    results.push({
                        isValid: true,
                        source: 'amfi',
                        verifiedValue: claimedReturn,
                        officialValue: `Fund found (NAV: ${amfiData.nav}), returns data not available`,
                        confidence: 80,
                        sourceUrl: amfiData.source,
                        lastUpdated: amfiData.lastUpdated
                    });
                }
            }

            // Validate expense ratio
            if (data.fee && amfiData.expenseRatio) {
                const claimedExpense = parseFloat(String(data.fee));
                const officialExpense = amfiData.expenseRatio;
                
                const discrepancy = Math.abs(claimedExpense - officialExpense);
                const isValid = discrepancy < 0.5; // Allow 0.5% variance
                
                results.push({
                    isValid,
                    source: 'amfi',
                    verifiedValue: claimedExpense,
                    officialValue: officialExpense,
                    discrepancy,
                    confidence: isValid ? 95 : 70,
                    sourceUrl: amfiData.source,
                    lastUpdated: amfiData.lastUpdated
                });
            }

            // Validate NAV if provided
            if (data.price) {
                const claimedNAV = parseFloat(String(data.price));
                const officialNAV = amfiData.nav;
                
                const discrepancy = Math.abs(claimedNAV - officialNAV);
                const isValid = discrepancy < 0.01; // Allow 0.01 variance for NAV
                
                results.push({
                    isValid,
                    source: 'amfi',
                    verifiedValue: claimedNAV,
                    officialValue: officialNAV,
                    discrepancy,
                    confidence: isValid ? 98 : 60, // NAV is very precise
                    sourceUrl: amfiData.source,
                    lastUpdated: amfiData.lastUpdated
                });
            }
        } else {
            // Fund not found in AMFI data
            if (data.return || data.fee) {
                results.push({
                    isValid: false,
                    source: 'amfi',
                    verifiedValue: data.return || data.fee,
                    officialValue: 'Fund not found in AMFI database',
                    confidence: 0,
                    sourceUrl: 'https://portal.amfiindia.com/spages/NAVAll.txt'
                });
            }
        }
    }

    return results;
}

/**
 * Validate against product database (credit_cards, mutual_funds tables)
 * These tables contain scraped data from official sources
 */
export async function validateAgainstProductDatabase(
    data: FinancialData,
    category: string,
    productName?: string
): Promise<AuthoritativeValidationResult[]> {
    const results: AuthoritativeValidationResult[] = [];
    const supabase = await createClient();

    if (category === 'credit-cards' && productName) {
        // Validate credit card interest rate
        if (data.interestRate) {
            const { data: cardData, error } = await supabase
                .from('credit_cards')
                .select('interest_rate, name, bank')
                .ilike('name', `%${productName}%`)
                .limit(1)
                .single();

            if (!error && cardData && cardData.interest_rate) {
                const claimedRate = parseFloat(String(data.interestRate));
                const officialRateStr = cardData.interest_rate.replace(/[^0-9.]/g, '');
                const officialRate = parseFloat(officialRateStr);

                if (!isNaN(officialRate)) {
                    const discrepancy = Math.abs(claimedRate - officialRate);
                    const isValid = discrepancy < 2; // Allow 2% variance

                    results.push({
                        isValid,
                        source: 'product_db',
                        verifiedValue: claimedRate,
                        officialValue: officialRate,
                        discrepancy,
                        confidence: isValid ? 90 : 60,
                        lastUpdated: cardData.updated_at || new Date().toISOString()
                    });
                }
            }
        }
    }

    if (category === 'mutual-funds' && productName) {
        // Validate mutual fund returns
        if (data.return) {
            const { data: mfData, error } = await supabase
                .from('mutual_funds')
                .select('returns_1y, returns_3y, returns_5y, name, fund_house')
                .ilike('name', `%${productName}%`)
                .limit(1)
                .single();

            if (!error && mfData) {
                const claimedReturn = parseFloat(String(data.return));
                const officialReturn = mfData.returns_1y || mfData.returns_3y || mfData.returns_5y;

                if (officialReturn) {
                    const discrepancy = Math.abs(claimedReturn - officialReturn);
                    const isValid = discrepancy < 2; // Allow 2% variance

                    results.push({
                        isValid,
                        source: 'product_db',
                        verifiedValue: claimedReturn,
                        officialValue: officialReturn,
                        discrepancy,
                        confidence: isValid ? 90 : 60,
                        lastUpdated: mfData.updated_at || new Date().toISOString()
                    });
                }
            }
        }
    }

    return results;
}

/**
 * Validate against SEBI regulations
 * SEBI publishes regulations, circulars, and guidelines
 */
export async function validateAgainstSEBI(
    data: FinancialData,
    claim: string
): Promise<AuthoritativeValidationResult[]> {
    const results: AuthoritativeValidationResult[] = [];

    // SEBI Regulations:
    // - No guaranteed returns for mutual funds
    // - Risk disclosure required
    // - Past performance disclaimer required
    // - Expense ratio limits

    // Check for SEBI violations (already done in compliance checker)
    // This function can add SEBI-specific fact validation

    // TODO: Integrate with SEBI circulars/regulations database
    // SEBI Website: https://www.sebi.gov.in/
    // Circulars: https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=5&smid=0

    return results;
}

/**
 * Main function to validate against all authoritative sources
 */
export async function validateAgainstAuthoritativeSources(
    data: FinancialData,
    category: string,
    productName?: string,
    schemeCode?: number
): Promise<{
    errors: Array<{ field: string; message: string; source: string }>;
    validatedFacts: Array<{ fact: string; source: string; confidence: number }>;
}> {
    const errors: Array<{ field: string; message: string; source: string }> = [];
    const validatedFacts: Array<{ fact: string; source: string; confidence: number }> = [];

    try {
        // 1. Validate against product database (fastest, most accurate)
        const productDbResults = await validateAgainstProductDatabase(data, category, productName);
        
        for (const result of productDbResults) {
            if (!result.isValid && result.discrepancy && result.discrepancy > 5) {
                errors.push({
                    field: result.source === 'product_db' ? 'interestRate' : 'return',
                    message: `Value ${result.verifiedValue} differs from official source by ${result.discrepancy}%. Official value: ${result.officialValue}`,
                    source: result.source
                });
            } else if (result.isValid) {
                validatedFacts.push({
                    fact: `${result.source === 'product_db' ? 'Interest rate' : 'Return'}: ${result.verifiedValue}%`,
                    source: result.source,
                    confidence: result.confidence
                });
            }
        }

        // 2. Validate against RBI (for interest rates)
        if (data.interestRate && (category === 'credit-cards' || category === 'loans')) {
            const rbiResults = await validateAgainstRBI(
                data,
                category === 'credit-cards' ? 'credit_card' : 'loan'
            );
            
            for (const result of rbiResults) {
                if (!result.isValid) {
                    errors.push({
                        field: 'interestRate',
                        message: `Interest rate ${result.verifiedValue}% is outside RBI expected range: ${result.officialValue}`,
                        source: 'rbi'
                    });
                } else {
                    validatedFacts.push({
                        fact: `Interest rate ${result.verifiedValue}% is within RBI expected range`,
                        source: 'rbi',
                        confidence: result.confidence
                    });
                }
            }
        }

        // 3. Validate against AMFI (for mutual funds)
        if (category === 'mutual-funds' && data.return) {
            const amfiResults = await validateAgainstAMFI(data, productName, schemeCode);
            
            for (const result of amfiResults) {
                if (!result.isValid && result.discrepancy && result.discrepancy > 2) {
                    errors.push({
                        field: 'return',
                        message: `Return ${result.verifiedValue}% differs from AMFI data by ${result.discrepancy}%. Official: ${result.officialValue}%`,
                        source: 'amfi'
                    });
                } else if (result.isValid) {
                    validatedFacts.push({
                        fact: `Return ${result.verifiedValue}% matches AMFI data`,
                        source: 'amfi',
                        confidence: result.confidence
                    });
                }
            }
        }

    } catch (error) {
        logger.error('Error validating against authoritative sources', error as Error, { category, productName });
    }

    return { errors, validatedFacts };
}
