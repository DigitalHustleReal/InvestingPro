/**
 * Form Validation Utilities
 * 
 * Provides validation functions and error display components
 */

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
}

export interface ValidationErrors {
    [field: string]: string;
}

/**
 * Validate a single field value
 */
export function validateField(
    fieldName: string,
    value: any,
    rules: ValidationRule
): string | null {
    // Required check
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        return `${fieldName} is required`;
    }

    if (!value || (typeof value === 'string' && !value.trim())) {
        return null; // Skip other validations if empty and not required
    }

    // Min length check
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        return `${fieldName} must be at least ${rules.minLength} characters`;
    }

    // Max length check
    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        return `${fieldName} must be no more than ${rules.maxLength} characters`;
    }

    // Pattern check
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        return `${fieldName} format is invalid`;
    }

    // Custom validation
    if (rules.custom) {
        const customError = rules.custom(value);
        if (customError) {
            return customError;
        }
    }

    return null;
}

/**
 * Validate multiple fields at once
 */
export function validateForm(
    values: Record<string, any>,
    rules: Record<string, ValidationRule>
): ValidationErrors {
    const errors: ValidationErrors = {};

    for (const [fieldName, fieldRules] of Object.entries(rules)) {
        const error = validateField(fieldName, values[fieldName], fieldRules);
        if (error) {
            errors[fieldName] = error;
        }
    }

    return errors;
}

/**
 * Article form validation rules
 */
export const articleValidationRules = {
    title: {
        required: true,
        minLength: 10,
        maxLength: 100,
    } as ValidationRule,
    excerpt: {
        required: false,
        maxLength: 300,
    } as ValidationRule,
    slug: {
        required: true,
        pattern: /^[a-z0-9-]+$/,
        custom: (value: string) => {
            if (value && (value.startsWith('-') || value.endsWith('-'))) {
                return 'Slug cannot start or end with a hyphen';
            }
            return null;
        },
    } as ValidationRule,
    category: {
        required: true,
    } as ValidationRule,
};

/**
 * Get character count helper
 */
export function getCharacterCount(value: string | undefined | null): number {
    return value?.length || 0;
}

/**
 * Check if slug is valid
 */
export function isValidSlug(slug: string): boolean {
    return /^[a-z0-9-]+$/.test(slug) && !slug.startsWith('-') && !slug.endsWith('-');
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
