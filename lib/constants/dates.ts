/**
 * Centralized Date Constants
 * 
 * Purpose: Eliminate "freshness debt" by providing dynamic date values
 * that automatically update without manual intervention.
 */

/**
 * Get the current calendar year
 */
export const CURRENT_YEAR = new Date().getFullYear();

/**
 * Get the current financial year (April to March)
 * Returns format: "FY 2025-26"
 */
export function getCurrentFinancialYear(): string {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed (0 = January)
    
    // Financial year starts in April (month 3)
    if (currentMonth >= 3) {
        // April onwards: FY is current year to next year
        return `FY ${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
    } else {
        // January-March: FY is previous year to current year
        return `FY ${currentYear - 1}-${currentYear.toString().slice(-2)}`;
    }
}

/**
 * Get the current assessment year for tax purposes
 * Assessment Year is always one year ahead of Financial Year
 * Returns format: "AY 2026-27"
 */
export function getCurrentAssessmentYear(): string {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    if (currentMonth >= 3) {
        // April onwards: AY is next year to year after
        return `AY ${currentYear + 1}-${(currentYear + 2).toString().slice(-2)}`;
    } else {
        // January-March: AY is current year to next year
        return `AY ${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
    }
}

/**
 * Convenience exports for common use cases
 */
export const CURRENT_FY = getCurrentFinancialYear();
export const CURRENT_AY = getCurrentAssessmentYear();

/**
 * Get a formatted copyright year range
 * @param startYear - The year the platform launched
 */
export function getCopyrightYearRange(startYear: number = 2024): string {
    return startYear === CURRENT_YEAR 
        ? `${CURRENT_YEAR}` 
        : `${startYear}-${CURRENT_YEAR}`;
}
