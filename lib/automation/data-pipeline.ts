/**
 * Data Pipeline (ETL)
 * Extract, Transform, Load pipeline for product data
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { validateCreditCard, validateMutualFund, calculateDataQualityScore, ValidationResult } from './data-validator';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export interface PipelineResult {
    success: boolean;
    extracted: number;
    validated: number;
    loaded: number;
    updated: number;
    failed: number;
    errors: string[];
    qualityScore: number;
}

/**
 * Generate slug from name
 */
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100); // Limit length
}

/**
 * Normalize credit card data
 */
function normalizeCreditCard(data: Record<string, any>): Record<string, any> {
    const normalized: Record<string, any> = {
        ...data
    };

    // Generate slug if missing
    if (!normalized.slug && normalized.name) {
        normalized.slug = generateSlug(normalized.name);
    }

    // Normalize type
    if (normalized.type) {
        const typeMap: Record<string, string> = {
            'cashback': 'Cashback',
            'reward': 'Rewards',
            'rewards': 'Rewards',
            'travel': 'Travel',
            'premium': 'Premium',
            'shopping': 'Shopping',
            'fuel': 'Fuel'
        };
        const lowerType = normalized.type.toLowerCase();
        normalized.type = typeMap[lowerType] || normalized.type;
    }

    // Normalize arrays
    ['rewards', 'pros', 'cons'].forEach(field => {
        if (normalized[field] && !Array.isArray(normalized[field])) {
            if (typeof normalized[field] === 'string') {
                normalized[field] = normalized[field].split(',').map((s: string) => s.trim()).filter(Boolean);
            } else {
                normalized[field] = [];
            }
        }
    });

    // Normalize numeric fields
    if (normalized.rating) {
        const rating = Number(normalized.rating);
        normalized.rating = isNaN(rating) ? null : Math.max(1, Math.min(5, rating));
    }

    return normalized;
}

/**
 * Normalize mutual fund data
 */
function normalizeMutualFund(data: Record<string, any>): Record<string, any> {
    const normalized: Record<string, any> = {
        ...data
    };

    // Generate slug if missing
    if (!normalized.slug && normalized.name) {
        normalized.slug = generateSlug(normalized.name);
    }

    // Normalize NAV
    if (normalized.nav !== undefined && normalized.nav !== null) {
        const nav = Number(normalized.nav);
        normalized.nav = isNaN(nav) ? null : nav;
    }

    // Normalize scheme code
    if (normalized.scheme_code) {
        const code = Number(normalized.scheme_code);
        normalized.scheme_code = isNaN(code) ? null : code;
    }

    // Normalize returns
    ['returns_1y', 'returns_3y', 'returns_5y'].forEach(field => {
        if (normalized[field] !== undefined && normalized[field] !== null) {
            const value = Number(normalized[field]);
            normalized[field] = isNaN(value) ? null : value;
        }
    });

    // Normalize expense ratio
    if (normalized.expense_ratio !== undefined && normalized.expense_ratio !== null) {
        const ratio = Number(normalized.expense_ratio);
        normalized.expense_ratio = isNaN(ratio) ? null : Math.max(0, Math.min(10, ratio));
    }

    // Normalize rating
    if (normalized.rating) {
        const rating = Number(normalized.rating);
        normalized.rating = isNaN(rating) ? null : Math.max(1, Math.min(5, rating));
    }

    return normalized;
}

/**
 * Detect duplicates by slug or name+bank
 */
async function findDuplicateCreditCard(data: Record<string, any>): Promise<string | null> {
    try {
        // Try to find by slug first
        if (data.slug) {
            const { data: existing } = await supabase
                .from('credit_cards')
                .select('id')
                .eq('slug', data.slug)
                .single();

            if (existing) {
                return existing.id;
            }
        }

        // Try to find by name + bank
        if (data.name && data.bank) {
            const { data: existing } = await supabase
                .from('credit_cards')
                .select('id')
                .eq('name', data.name)
                .eq('bank', data.bank)
                .single();

            if (existing) {
                return existing.id;
            }
        }

        return null;
    } catch (error) {
        // If no match found, return null
        return null;
    }
}

/**
 * Detect duplicates by slug or scheme_code
 */
async function findDuplicateMutualFund(data: Record<string, any>): Promise<string | null> {
    try {
        // Try to find by scheme_code first (most reliable)
        if (data.scheme_code) {
            const { data: existing } = await supabase
                .from('mutual_funds')
                .select('id')
                .eq('scheme_code', data.scheme_code)
                .single();

            if (existing) {
                return existing.id;
            }
        }

        // Try to find by slug
        if (data.slug) {
            const { data: existing } = await supabase
                .from('mutual_funds')
                .select('id')
                .eq('slug', data.slug)
                .single();

            if (existing) {
                return existing.id;
            }
        }

        // Try to find by name + fund_house
        if (data.name && data.fund_house) {
            const { data: existing } = await supabase
                .from('mutual_funds')
                .select('id')
                .eq('name', data.name)
                .eq('fund_house', data.fund_house)
                .single();

            if (existing) {
                return existing.id;
            }
        }

        return null;
    } catch (error) {
        return null;
    }
}

/**
 * Process credit cards through ETL pipeline
 */
export async function processCreditCards(rawData: Record<string, any>[]): Promise<PipelineResult> {
    const errors: string[] = [];
    const validationResults: ValidationResult[] = [];
    let loaded = 0;
    let updated = 0;
    let failed = 0;

    for (const item of rawData) {
        try {
            // Transform/Normalize
            const normalized = normalizeCreditCard(item);

            // Validate
            const validation = validateCreditCard(normalized);
            validationResults.push(validation);

            if (!validation.isValid) {
                errors.push(`Validation failed for ${normalized.name || 'unknown'}: ${validation.errors.join(', ')}`);
                failed++;
                continue;
            }

            // Check for duplicates
            const existingId = await findDuplicateCreditCard(normalized);

            // Load into database
            if (existingId) {
                // Update existing
                const { error: updateError } = await supabase
                    .from('credit_cards')
                    .update({
                        ...normalized,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingId);

                if (updateError) {
                    errors.push(`Failed to update ${normalized.name}: ${updateError.message}`);
                    failed++;
                } else {
                    updated++;
                    logger.debug('Updated credit card', { name: normalized.name, id: existingId });
                }
            } else {
                // Insert new
                const { error: insertError } = await supabase
                    .from('credit_cards')
                    .insert([normalized]);

                if (insertError) {
                    errors.push(`Failed to insert ${normalized.name}: ${insertError.message}`);
                    failed++;
                } else {
                    loaded++;
                    logger.debug('Inserted credit card', { name: normalized.name });
                }
            }
        } catch (error: any) {
            errors.push(`Error processing credit card: ${error.message}`);
            failed++;
            logger.error('Error processing credit card', error, { item });
        }
    }

    const qualityScore = calculateDataQualityScore(validationResults);

    return {
        success: failed === 0,
        extracted: rawData.length,
        validated: validationResults.filter(r => r.isValid).length,
        loaded,
        updated,
        failed,
        errors,
        qualityScore: qualityScore.averageScore
    };
}

/**
 * Process mutual funds through ETL pipeline
 */
export async function processMutualFunds(rawData: Record<string, any>[]): Promise<PipelineResult> {
    const errors: string[] = [];
    const validationResults: ValidationResult[] = [];
    let loaded = 0;
    let updated = 0;
    let failed = 0;

    for (const item of rawData) {
        try {
            // Transform/Normalize
            const normalized = normalizeMutualFund(item);

            // Validate
            const validation = validateMutualFund(normalized);
            validationResults.push(validation);

            if (!validation.isValid) {
                errors.push(`Validation failed for ${normalized.name || 'unknown'}: ${validation.errors.join(', ')}`);
                failed++;
                continue;
            }

            // Check for duplicates
            const existingId = await findDuplicateMutualFund(normalized);

            // Load into database
            if (existingId) {
                // Update existing
                const { error: updateError } = await supabase
                    .from('mutual_funds')
                    .update({
                        ...normalized,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingId);

                if (updateError) {
                    errors.push(`Failed to update ${normalized.name}: ${updateError.message}`);
                    failed++;
                } else {
                    updated++;
                    logger.debug('Updated mutual fund', { name: normalized.name, id: existingId });
                }
            } else {
                // Insert new
                const { error: insertError } = await supabase
                    .from('mutual_funds')
                    .insert([normalized]);

                if (insertError) {
                    errors.push(`Failed to insert ${normalized.name}: ${insertError.message}`);
                    failed++;
                } else {
                    loaded++;
                    logger.debug('Inserted mutual fund', { name: normalized.name });
                }
            }
        } catch (error: any) {
            errors.push(`Error processing mutual fund: ${error.message}`);
            failed++;
            logger.error('Error processing mutual fund', error, { item });
        }
    }

    const qualityScore = calculateDataQualityScore(validationResults);

    return {
        success: failed === 0,
        extracted: rawData.length,
        validated: validationResults.filter(r => r.isValid).length,
        loaded,
        updated,
        failed,
        errors,
        qualityScore: qualityScore.averageScore
    };
}
