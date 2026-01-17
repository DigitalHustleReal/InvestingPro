/**
 * Fact-Checker Service
 * 
 * Validates financial data and facts before publication
 * Critical for compliance and accuracy in financial content
 */

import { logger } from '@/lib/logger';

export interface FactCheckResult {
    isValid: boolean;
    confidence: number; // 0-100
    errors: FactCheckError[];
    warnings: FactCheckWarning[];
    validatedFacts: ValidatedFact[];
}

export interface FactCheckError {
    type: 'financial_data' | 'regulation' | 'citation' | 'calculation';
    field: string;
    message: string;
    severity: 'critical' | 'warning';
    suggestedFix?: string;
}

export interface FactCheckWarning {
    type: 'unsourced' | 'outdated' | 'approximation';
    message: string;
    field?: string;
}

export interface ValidatedFact {
    fact: string;
    source?: string;
    validatedAt: string;
    confidence: number;
}

export interface FinancialData {
    interestRate?: number | string;
    fee?: number | string;
    return?: number | string;
    price?: number | string;
    percentage?: number | string;
    date?: string;
    regulation?: string;
}

/**
 * Fact-check an article's financial data
 */
export async function factCheckArticle(
    content: string,
    metadata?: {
        category?: string;
        title?: string;
        financialData?: FinancialData;
        sources?: string[];
    }
): Promise<FactCheckResult> {
    const errors: FactCheckError[] = [];
    const warnings: FactCheckWarning[] = [];
    const validatedFacts: ValidatedFact[] = [];

    try {
        // 1. Extract financial data from content
        const extractedData = extractFinancialData(content);

        // 2. Validate financial numbers
        const numberValidation = validateFinancialNumbers(extractedData, metadata?.financialData);
        errors.push(...numberValidation.errors);
        warnings.push(...numberValidation.warnings);
        validatedFacts.push(...numberValidation.validatedFacts);

        // 3. Check for required citations
        const citationCheck = checkCitations(content, metadata?.sources || []);
        warnings.push(...citationCheck.warnings);

        // 4. Validate against authoritative sources (RBI, AMFI, SEBI, Product DB)
        if (metadata?.category) {
            // Import authoritative validation
            const { validateAgainstAuthoritativeSources } = await import('./fact-checker-authoritative');
            
            // Extract product name from content or metadata if available
            const productName = extractProductName(content, metadata.title);
            
            const authoritativeValidation = await validateAgainstAuthoritativeSources(
                extractedData,
                metadata.category,
                productName,
                undefined // schemeCode - can be extracted if needed
            );
            
            // Convert authoritative errors to FactCheckError format
            const authoritativeErrors: FactCheckError[] = authoritativeValidation.errors.map(err => ({
                type: 'financial_data',
                field: err.field,
                message: err.message,
                severity: 'critical', // Authoritative source discrepancies are critical
                suggestedFix: `Verify against ${err.source.toUpperCase()} official source`
            }));
            
            errors.push(...authoritativeErrors);
            
            // Add validated facts from authoritative sources
            const authoritativeValidatedFacts: ValidatedFact[] = authoritativeValidation.validatedFacts.map(fact => ({
                fact: fact.fact,
                source: fact.source,
                validatedAt: new Date().toISOString(),
                confidence: fact.confidence
            }));
            
            validatedFacts.push(...authoritativeValidatedFacts);
        }
        
        // 5. Legacy: Validate against known data sources (fallback)
        if (metadata?.category) {
            const dataValidation = await validateAgainstDataSources(extractedData, metadata.category);
            // Only add if no authoritative validation found
            if (validatedFacts.length === 0) {
                errors.push(...dataValidation.errors);
                validatedFacts.push(...dataValidation.validatedFacts);
            }
        }

        // 6. Check for red flags (impossible numbers, suspicious claims)
        const redFlags = checkRedFlags(content, extractedData);
        errors.push(...redFlags.errors);
        warnings.push(...redFlags.warnings);

        // Calculate confidence score
        const confidence = calculateConfidence(errors, warnings, validatedFacts.length);

        // Block if critical errors found
        const hasCriticalErrors = errors.some(e => e.severity === 'critical');
        const isValid = !hasCriticalErrors;

        return {
            isValid,
            confidence,
            errors,
            warnings,
            validatedFacts
        };

    } catch (error) {
        logger.error('Fact-checking failed', error as Error);
        // Fail safe: return invalid if fact-checking fails
        return {
            isValid: false,
            confidence: 0,
            errors: [{
                type: 'financial_data',
                field: 'system',
                message: 'Fact-checking system error - manual review required',
                severity: 'critical'
            }],
            warnings: [],
            validatedFacts: []
        };
    }
}

/**
 * Extract financial data from content
 */
function extractFinancialData(content: string): FinancialData {
    const data: FinancialData = {};

    // Extract percentages (e.g., "8.5%", "12.5 percent")
    const percentageRegex = /(\d+\.?\d*)\s*%/g;
    const percentages: number[] = [];
    let match;
    while ((match = percentageRegex.exec(content)) !== null) {
        percentages.push(parseFloat(match[1]));
    }
    if (percentages.length > 0) {
        data.percentage = percentages[0].toString();
    }

    // Extract interest rates
    const interestRateRegex = /(?:interest|rate|yield)\s*(?:of|is|:)?\s*(\d+\.?\d*)\s*%/gi;
    match = interestRateRegex.exec(content);
    if (match) {
        data.interestRate = parseFloat(match[1]).toString();
    }

    // Extract returns (investment returns, annual returns, etc.)
    const returnRegex = /(?:return|returns|annual return|yield)\s*(?:of|is|:)?\s*(\d+\.?\d*)\s*%/gi;
    match = returnRegex.exec(content);
    if (match) {
        data.return = parseFloat(match[1]).toString();
    }
    
    // Also check for "X% return" pattern (common in financial content)
    const returnPatternRegex = /(\d+\.?\d*)\s*%\s*(?:return|returns|annual|yield)/gi;
    match = returnPatternRegex.exec(content);
    if (match && !data.return) {
        data.return = parseFloat(match[1]).toString();
    }

    // Extract fees/amounts (₹ symbol or "rupees")
    const amountRegex = /[₹]\s*(\d+(?:,\d+)*(?:\.\d+)?)|(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:rupees|Rs\.?)/gi;
    match = amountRegex.exec(content);
    if (match) {
        const amount = match[1] || match[2];
        data.fee = amount.replace(/,/g, '');
    }

    // Extract dates (common Indian date formats)
    const dateRegex = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})|(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi;
    match = dateRegex.exec(content);
    if (match) {
        data.date = match[0];
    }

    return data;
}

/**
 * Extract product name from content or title
 * Used to match against product database
 */
function extractProductName(content: string, title?: string): string | undefined {
    // Try to extract from title first
    if (title) {
        // Common patterns: "HDFC Bank Credit Card", "SBI Mutual Fund", etc.
        const titleMatch = title.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Credit Card|Mutual Fund|Loan|Insurance)/);
        if (titleMatch) {
            return titleMatch[1];
        }
    }
    
    // Try to extract from content
    const contentMatch = content.match(/(?:HDFC|SBI|ICICI|Axis|Kotak|PNB|BOI|Canara|Union|IDFC|Yes Bank|IndusInd)\s+(?:Bank|Card|Mutual Fund|Loan)/i);
    if (contentMatch) {
        return contentMatch[0];
    }
    
    return undefined;
}

/**
 * Validate financial numbers for reasonableness
 */
function validateFinancialNumbers(
    data: FinancialData,
    providedData?: FinancialData
): { errors: FactCheckError[]; warnings: FactCheckWarning[]; validatedFacts: ValidatedFact[] } {
    const errors: FactCheckError[] = [];
    const warnings: FactCheckWarning[] = [];
    const validatedFacts: ValidatedFact[] = [];

    // Validate interest rates (should be 0-30% typically for financial products)
    if (data.interestRate) {
        const rateStr = String(data.interestRate);
        const rate = parseFloat(rateStr);
        if (isNaN(rate) || rate < 0 || rate > 50) {
            errors.push({
                type: 'financial_data',
                field: 'interestRate',
                message: `Interest rate ${rateStr}% is outside reasonable range (0-50%)`,
                severity: rate > 100 ? 'critical' : 'warning',
                suggestedFix: 'Verify interest rate from official source'
            });
        } else if (providedData?.interestRate && String(providedData.interestRate) !== rateStr) {
            errors.push({
                type: 'financial_data',
                field: 'interestRate',
                message: `Interest rate mismatch: content says ${rateStr}%, but metadata says ${providedData.interestRate}%`,
                severity: 'critical',
                suggestedFix: 'Verify and align interest rate values'
            });
        } else {
            validatedFacts.push({
                fact: `Interest rate: ${rateStr}%`,
                validatedAt: new Date().toISOString(),
                confidence: 80
            });
        }
    }

    // Validate returns (should be reasonable for investment products)
    if (data.return) {
        const returnStr = String(data.return);
        const returnValue = parseFloat(returnStr);
        if (isNaN(returnValue) || returnValue < -100 || returnValue > 200) {
            errors.push({
                type: 'financial_data',
                field: 'return',
                message: `Return value ${returnStr}% is outside reasonable range (-100% to 200%)`,
                severity: Math.abs(returnValue) > 300 ? 'critical' : 'warning',
                suggestedFix: 'Verify return percentage from official source'
            });
        }
    }

    // Validate fees (should be reasonable amounts)
    if (data.fee) {
        const feeStr = String(data.fee);
        const fee = parseFloat(feeStr);
        if (isNaN(fee) || fee < 0 || fee > 10000000) {
            warnings.push({
                type: 'approximation',
                message: `Fee amount ₹${feeStr} may need verification`,
                field: 'fee'
            });
        }
    }

    return { errors, warnings, validatedFacts };
}

/**
 * Check for required citations when source content is used
 */
function checkCitations(
    content: string,
    sources: string[]
): { warnings: FactCheckWarning[] } {
    const warnings: FactCheckWarning[] = [];

    // Check if content has financial data but no citations
    const hasFinancialData = /(\d+\.?\d*%\s*interest)|(₹\s*\d+)/gi.test(content);
    
    if (hasFinancialData && sources.length === 0) {
        warnings.push({
            type: 'unsourced',
            message: 'Content contains financial data but no sources cited. Consider adding citations for compliance.',
        });
    }

    // Check for citation markers (common patterns)
    const citationPatterns = [
        /\[source\s*\d+\]/i,
        /\(source:\s*[^)]+\)/i,
        /\[citation\s*\d+\]/i,
        /<cite>/i,
        /according to/i,
        /as per/i
    ];

    const hasCitations = citationPatterns.some(pattern => pattern.test(content));
    
    if (hasFinancialData && !hasCitations && sources.length > 0) {
        warnings.push({
            type: 'unsourced',
            message: 'Sources provided but not cited in content. Add inline citations for transparency.',
        });
    }

    return { warnings };
}

/**
 * Validate against known data sources (e.g., product database)
 */
async function validateAgainstDataSources(
    data: FinancialData,
    category: string
): Promise<{ errors: FactCheckError[]; validatedFacts: ValidatedFact[] }> {
    const errors: FactCheckError[] = [];
    const validatedFacts: ValidatedFact[] = [];

    // TODO: Integrate with product database to validate rates/fees
    // For now, we'll do basic validation
    // In production, this would query:
    // - credit_cards table for interest rates
    // - mutual_funds table for expense ratios
    // - loans table for processing fees
    // etc.

    // Placeholder: Basic validation based on category
    // This will be enhanced when product database integration is added
    logger.info('Fact-check: Validating against data sources', { category, data });

    // Note: warnings are handled at a higher level, not here
    // This function returns errors and validatedFacts only

    return { errors, validatedFacts };
}

/**
 * Check for red flags (impossible numbers, suspicious claims)
 */
function checkRedFlags(
    content: string,
    data: FinancialData
): { errors: FactCheckError[]; warnings: FactCheckWarning[] } {
    const errors: FactCheckError[] = [];
    const warnings: FactCheckWarning[] = [];

    // Red flag: Guaranteed returns > 20% (too good to be true)
    if (data.return) {
        const returnStr = String(data.return);
        const returnValue = parseFloat(returnStr);
        if (!isNaN(returnValue) && returnValue > 20 && content.toLowerCase().includes('guaranteed')) {
            errors.push({
                type: 'financial_data',
                field: 'return',
                message: `Guaranteed return of ${returnStr}% is unusually high. Verify source and compliance.`,
                severity: 'critical',
                suggestedFix: 'Remove "guaranteed" language or verify compliance with SEBI regulations'
            });
        }
    }

    // Red flag: Zero fees (may need disclosure)
    if (data.fee === '0' || data.fee === 'zero' || data.fee === 0) {
        warnings.push({
            type: 'unsourced',
            message: 'Zero fees claimed - ensure this is accurate and all hidden fees are disclosed',
            field: 'fee'
        });
    }

    // Red flag: Negative interest rates (unusual for India)
    if (data.interestRate) {
        const rateStr = String(data.interestRate);
        const rate = parseFloat(rateStr);
        if (!isNaN(rate) && rate < 0) {
            errors.push({
                type: 'financial_data',
                field: 'interestRate',
                message: `Negative interest rate ${rateStr}% is unusual. Verify accuracy.`,
                severity: 'critical',
                suggestedFix: 'Verify interest rate from official source'
            });
        }
    }

    // Check for unsubstantiated claims
    const claims = [
        /best.*guaranteed/i,
        /risk-free/i,
        /no hidden charges/i,
        /instant approval/i
    ];

    claims.forEach(pattern => {
        if (pattern.test(content)) {
            warnings.push({
                type: 'unsourced',
                message: `Unsubstantiated claim detected: "${content.match(pattern)?.[0]}". Ensure compliance with advertising regulations.`
            });
        }
    });

    return { errors, warnings };
}

/**
 * Calculate confidence score based on validation results
 */
function calculateConfidence(
    errors: FactCheckError[],
    warnings: FactCheckWarning[],
    validatedFactsCount: number
): number {
    let confidence = 100;

    // Deduct for errors
    const criticalErrors = errors.filter(e => e.severity === 'critical').length;
    const warningErrors = errors.filter(e => e.severity === 'warning').length;
    
    confidence -= criticalErrors * 20; // -20 per critical error
    confidence -= warningErrors * 10; // -10 per warning error
    confidence -= warnings.length * 5; // -5 per warning

    // Boost for validated facts
    confidence += Math.min(validatedFactsCount * 5, 20); // +5 per fact, max +20

    // Ensure 0-100 range
    return Math.max(0, Math.min(100, confidence));
}

/**
 * Format fact-check result for display
 */
export function formatFactCheckResult(result: FactCheckResult): string {
    if (result.isValid && result.errors.length === 0) {
        return `✅ Fact-check passed (Confidence: ${result.confidence}%)`;
    }

    const criticalErrors = result.errors.filter(e => e.severity === 'critical');
    const warnings = result.warnings.length;

    if (criticalErrors.length > 0) {
        return `❌ Fact-check failed: ${criticalErrors.length} critical error(s), ${warnings} warning(s)`;
    }

    return `⚠️ Fact-check passed with warnings: ${warnings} warning(s)`;
}
