/**
 * Data Validator
 * Validates and scores data quality for scraped products
 */

import { logger } from '@/lib/logger';

export interface ValidationResult {
    isValid: boolean;
    score: number; // 0-100
    errors: string[];
    warnings: string[];
}

export interface ValidationRules {
    requiredFields: string[];
    fieldFormats: Record<string, RegExp | ((value: any) => boolean)>;
    numericRanges?: Record<string, { min?: number; max?: number }>;
    enumValues?: Record<string, string[]>;
}

/**
 * Validate credit card data
 */
export function validateCreditCard(data: Record<string, any>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Required fields
    const requiredFields = ['name', 'bank', 'type', 'slug'];
    for (const field of requiredFields) {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
            errors.push(`Missing required field: ${field}`);
            score -= 20;
        }
    }

    // Field format validation
    if (data.type && !['Cashback', 'Rewards', 'Travel', 'Premium', 'Shopping', 'Fuel'].includes(data.type)) {
        errors.push(`Invalid type: ${data.type}. Must be one of: Cashback, Rewards, Travel, Premium, Shopping, Fuel`);
        score -= 10;
    }

    // Slug validation
    if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
        errors.push(`Invalid slug format: ${data.slug}. Must be lowercase alphanumeric with hyphens`);
        score -= 10;
    }

    // Rating validation
    if (data.rating !== undefined) {
        const rating = Number(data.rating);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            warnings.push(`Rating out of range: ${data.rating}. Should be 1-5`);
            score -= 5;
        }
    }

    // URL validation
    if (data.apply_link && !isValidUrl(data.apply_link)) {
        warnings.push(`Invalid apply_link URL: ${data.apply_link}`);
        score -= 5;
    }

    if (data.image_url && !isValidUrl(data.image_url)) {
        warnings.push(`Invalid image_url URL: ${data.image_url}`);
        score -= 5;
    }

    // Array fields
    if (data.rewards && !Array.isArray(data.rewards)) {
        warnings.push(`Rewards should be an array`);
        score -= 5;
    }

    if (data.pros && !Array.isArray(data.pros)) {
        warnings.push(`Pros should be an array`);
        score -= 5;
    }

    if (data.cons && !Array.isArray(data.cons)) {
        warnings.push(`Cons should be an array`);
        score -= 5;
    }

    return {
        isValid: errors.length === 0,
        score: Math.max(0, score),
        errors,
        warnings
    };
}

/**
 * Validate mutual fund data
 */
export function validateMutualFund(data: Record<string, any>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Required fields
    const requiredFields = ['name', 'fund_house', 'category', 'nav', 'slug'];
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null || 
            (typeof data[field] === 'string' && data[field].trim() === '')) {
            errors.push(`Missing required field: ${field}`);
            score -= 20;
        }
    }

    // NAV validation
    if (data.nav !== undefined) {
        const nav = Number(data.nav);
        if (isNaN(nav) || nav <= 0) {
            errors.push(`Invalid NAV: ${data.nav}. Must be a positive number`);
            score -= 15;
        }
    }

    // Category validation
    const validCategories = ['Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Multi Cap', 'ELSS', 'Index Fund', 'Debt', 'Hybrid'];
    if (data.category && !validCategories.includes(data.category)) {
        errors.push(`Invalid category: ${data.category}`);
        score -= 10;
    }

    // Risk validation
    const validRisks = ['Low', 'Moderate', 'Moderately High', 'High', 'Very High'];
    if (data.risk && !validRisks.includes(data.risk)) {
        warnings.push(`Invalid risk level: ${data.risk}`);
        score -= 5;
    }

    // Returns validation (should be percentages)
    ['returns_1y', 'returns_3y', 'returns_5y'].forEach(field => {
        if (data[field] !== undefined && data[field] !== null) {
            const value = Number(data[field]);
            if (isNaN(value) || value < -100 || value > 1000) {
                warnings.push(`${field} out of reasonable range: ${data[field]}`);
                score -= 3;
            }
        }
    });

    // Scheme code validation
    if (data.scheme_code) {
        const code = Number(data.scheme_code);
        if (isNaN(code) || code <= 0 || code > 999999) {
            warnings.push(`Invalid scheme_code: ${data.scheme_code}`);
            score -= 5;
        }
    }

    // Slug validation
    if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
        errors.push(`Invalid slug format: ${data.slug}`);
        score -= 10;
    }

    // Rating validation
    if (data.rating !== undefined) {
        const rating = Number(data.rating);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            warnings.push(`Rating out of range: ${data.rating}`);
            score -= 5;
        }
    }

    return {
        isValid: errors.length === 0,
        score: Math.max(0, score),
        errors,
        warnings
    };
}

/**
 * Check if string is a valid URL
 */
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Calculate overall data quality score for a dataset
 */
export function calculateDataQualityScore(validationResults: ValidationResult[]): {
    averageScore: number;
    totalItems: number;
    validItems: number;
    invalidItems: number;
    errorsCount: number;
    warningsCount: number;
} {
    if (validationResults.length === 0) {
        return {
            averageScore: 0,
            totalItems: 0,
            validItems: 0,
            invalidItems: 0,
            errorsCount: 0,
            warningsCount: 0
        };
    }

    const totalScore = validationResults.reduce((sum, result) => sum + result.score, 0);
    const averageScore = totalScore / validationResults.length;
    const validItems = validationResults.filter(r => r.isValid).length;
    const invalidItems = validationResults.length - validItems;
    const errorsCount = validationResults.reduce((sum, r) => sum + r.errors.length, 0);
    const warningsCount = validationResults.reduce((sum, r) => sum + r.warnings.length, 0);

    return {
        averageScore: Number(averageScore.toFixed(2)),
        totalItems: validationResults.length,
        validItems,
        invalidItems,
        errorsCount,
        warningsCount
    };
}
