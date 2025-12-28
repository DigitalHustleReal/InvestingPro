/**
 * Content Validation Utilities
 * 
 * Validates content against strict schemas
 */

import {
    ContentSchema,
    PillarPageSchema,
    SubcategoryPageSchema,
    ExplainerArticleSchema,
    GlossaryPageSchema,
    CalculatorExplainerSchema,
    VALIDATION_RULES,
    InternalLink,
} from './schemas';
import { logger } from '@/lib/logger';

export interface ValidationError {
    field: string;
    message: string;
    severity: 'error' | 'warning';
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
}

/**
 * Count words in a string
 */
function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Validate SEO metadata
 */
function validateSEO(seo: ContentSchema['seo'], primaryKeyword: string): ValidationError[] {
    const errors: ValidationError[] = [];

    // Title validation
    if (seo.title.length > VALIDATION_RULES.title_max_chars) {
        errors.push({
            field: 'seo.title',
            message: `Title exceeds ${VALIDATION_RULES.title_max_chars} characters (${seo.title.length})`,
            severity: 'error',
        });
    }

    if (!seo.title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
        errors.push({
            field: 'seo.title',
            message: `Title must include primary keyword: ${primaryKeyword}`,
            severity: 'error',
        });
    }

    // Description validation
    if (seo.description.length > VALIDATION_RULES.description_max_chars) {
        errors.push({
            field: 'seo.description',
            message: `Description exceeds ${VALIDATION_RULES.description_max_chars} characters (${seo.description.length})`,
            severity: 'error',
        });
    }

    if (!seo.description.toLowerCase().includes(primaryKeyword.toLowerCase())) {
        errors.push({
            field: 'seo.description',
            message: `Description must include primary keyword: ${primaryKeyword}`,
            severity: 'warning',
        });
    }

    // Keywords validation
    if (seo.keywords.length > VALIDATION_RULES.keywords_max) {
        errors.push({
            field: 'seo.keywords',
            message: `Too many keywords (max ${VALIDATION_RULES.keywords_max}, found ${seo.keywords.length})`,
            severity: 'warning',
        });
    }

    if (seo.keywords[0] !== primaryKeyword) {
        errors.push({
            field: 'seo.keywords',
            message: 'First keyword must be the primary keyword',
            severity: 'error',
        });
    }

    // H1 validation
    if (seo.h1.length > VALIDATION_RULES.h1_max_chars) {
        errors.push({
            field: 'seo.h1',
            message: `H1 exceeds ${VALIDATION_RULES.h1_max_chars} characters (${seo.h1.length})`,
            severity: 'error',
        });
    }

    return errors;
}

/**
 * Validate internal links
 */
function validateInternalLinks(
    links: InternalLink[],
    rules: ContentSchema['linking_rules']
): ValidationError[] {
    const errors: ValidationError[] = [];

    // Count validation
    if (links.length < rules.min_links) {
        errors.push({
            field: 'internal_links',
            message: `Minimum ${rules.min_links} internal links required (found ${links.length})`,
            severity: 'error',
        });
    }

    if (links.length > rules.max_links) {
        errors.push({
            field: 'internal_links',
            message: `Maximum ${rules.max_links} internal links allowed (found ${links.length})`,
            severity: 'warning',
        });
    }

    // Required link types
    const linkTypes = links.map(l => l.link_type);
    for (const requiredType of rules.required_link_types) {
        if (!linkTypes.includes(requiredType)) {
            errors.push({
                field: 'internal_links',
                message: `Required link type missing: ${requiredType}`,
                severity: 'error',
            });
        }
    }

    // Anchor text validation
    for (const link of links) {
        const wordCount = link.text.split(/\s+/).length;
        if (wordCount > rules.anchor_text_rules.max_words) {
            errors.push({
                field: `internal_links[${link.text}]`,
                message: `Anchor text exceeds ${rules.anchor_text_rules.max_words} words`,
                severity: 'warning',
            });
        }

        if (rules.anchor_text_rules.avoid_generic?.some(generic => 
            link.text.toLowerCase().includes(generic.toLowerCase())
        )) {
            errors.push({
                field: `internal_links[${link.text}]`,
                message: `Avoid generic anchor text: "${link.text}"`,
                severity: 'warning',
            });
        }

        // URL validation
        if (!link.url.startsWith('/') && !link.url.startsWith('http')) {
            errors.push({
                field: `internal_links[${link.text}]`,
                message: `Invalid URL format: ${link.url}`,
                severity: 'error',
            });
        }
    }

    return errors;
}

/**
 * Validate Pillar Page
 */
export function validatePillarPage(content: PillarPageSchema): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // SEO validation
    const seoErrors = validateSEO(content.seo, content.primary_keyword);
    errors.push(...seoErrors.filter(e => e.severity === 'error'));
    warnings.push(...seoErrors.filter(e => e.severity === 'warning'));

    // Required sections check
    const requiredSections = VALIDATION_RULES.pillar_required_sections;
    for (const section of requiredSections) {
        if (!content.sections[section]) {
            errors.push({
                field: `sections.${section}`,
                message: `Required section missing: ${section}`,
                severity: 'error',
            });
        }
    }

    // Section content validation
    if (content.sections.overview) {
        const wordCount = countWords(content.sections.overview.content);
        if (wordCount > VALIDATION_RULES.overview_max_words) {
            errors.push({
                field: 'sections.overview.content',
                message: `Overview exceeds ${VALIDATION_RULES.overview_max_words} words (${wordCount})`,
                severity: 'error',
            });
        }
    }

    if (content.sections.key_features) {
        const featureCount = content.sections.key_features.features.length;
        if (featureCount < VALIDATION_RULES.features_min) {
            errors.push({
                field: 'sections.key_features.features',
                message: `Minimum ${VALIDATION_RULES.features_min} features required (found ${featureCount})`,
                severity: 'error',
            });
        }
        if (featureCount > VALIDATION_RULES.features_max) {
            warnings.push({
                field: 'sections.key_features.features',
                message: `Maximum ${VALIDATION_RULES.features_max} features recommended (found ${featureCount})`,
                severity: 'warning',
            });
        }
    }

    if (content.sections.faq) {
        const faqCount = content.sections.faq.questions.length;
        if (faqCount < VALIDATION_RULES.faq_min) {
            errors.push({
                field: 'sections.faq.questions',
                message: `Minimum ${VALIDATION_RULES.faq_min} FAQs required (found ${faqCount})`,
                severity: 'error',
            });
        }
        if (faqCount > VALIDATION_RULES.faq_max) {
            warnings.push({
                field: 'sections.faq.questions',
                message: `Maximum ${VALIDATION_RULES.faq_max} FAQs recommended (found ${faqCount})`,
                severity: 'warning',
            });
        }
    }

    // Internal links validation
    const linkErrors = validateInternalLinks(content.internal_links, content.linking_rules);
    errors.push(...linkErrors.filter(e => e.severity === 'error'));
    warnings.push(...linkErrors.filter(e => e.severity === 'warning'));

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Validate Subcategory Page
 */
export function validateSubcategoryPage(content: SubcategoryPageSchema): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // SEO validation
    const seoErrors = validateSEO(content.seo, content.primary_keyword);
    errors.push(...seoErrors.filter(e => e.severity === 'error'));
    warnings.push(...seoErrors.filter(e => e.severity === 'warning'));

    // Required sections check
    const requiredSections = VALIDATION_RULES.subcategory_required_sections;
    for (const section of requiredSections) {
        if (!content.sections[section]) {
            errors.push({
                field: `sections.${section}`,
                message: `Required section missing: ${section}`,
                severity: 'error',
            });
        }
    }

    // Internal links validation
    const linkErrors = validateInternalLinks(content.internal_links, content.linking_rules);
    errors.push(...linkErrors.filter(e => e.severity === 'error'));
    warnings.push(...linkErrors.filter(e => e.severity === 'warning'));

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Validate Explainer Article
 */
export function validateExplainerArticle(content: ExplainerArticleSchema): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // SEO validation
    const seoErrors = validateSEO(content.seo, content.primary_keyword);
    errors.push(...seoErrors.filter(e => e.severity === 'error'));
    warnings.push(...seoErrors.filter(e => e.severity === 'warning'));

    // Required sections check
    const requiredSections = VALIDATION_RULES.explainer_required_sections;
    for (const section of requiredSections) {
        if (!content.sections[section]) {
            errors.push({
                field: `sections.${section}`,
                message: `Required section missing: ${section}`,
                severity: 'error',
            });
        }
    }

    // Internal links validation
    const linkErrors = validateInternalLinks(content.internal_links, content.linking_rules);
    errors.push(...linkErrors.filter(e => e.severity === 'error'));
    warnings.push(...linkErrors.filter(e => e.severity === 'warning'));

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Validate Glossary Page
 */
export function validateGlossaryPage(content: GlossaryPageSchema): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // SEO validation
    const seoErrors = validateSEO(content.seo, content.term);
    errors.push(...seoErrors.filter(e => e.severity === 'error'));
    warnings.push(...seoErrors.filter(e => e.severity === 'warning'));

    // Required sections check
    const requiredSections = VALIDATION_RULES.glossary_required_sections;
    for (const section of requiredSections) {
        if (!content.sections[section]) {
            errors.push({
                field: `sections.${section}`,
                message: `Required section missing: ${section}`,
                severity: 'error',
            });
        }
    }

    // Internal links validation
    const linkErrors = validateInternalLinks(content.internal_links, content.linking_rules);
    errors.push(...linkErrors.filter(e => e.severity === 'error'));
    warnings.push(...linkErrors.filter(e => e.severity === 'warning'));

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Validate Calculator Explainer
 */
export function validateCalculatorExplainer(content: CalculatorExplainerSchema): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // SEO validation
    const seoErrors = validateSEO(content.seo, content.primary_keyword);
    errors.push(...seoErrors.filter(e => e.severity === 'error'));
    warnings.push(...seoErrors.filter(e => e.severity === 'warning'));

    // Required sections check
    const requiredSections = VALIDATION_RULES.calculator_required_sections;
    for (const section of requiredSections) {
        if (!content.sections[section]) {
            errors.push({
                field: `sections.${section}`,
                message: `Required section missing: ${section}`,
                severity: 'error',
            });
        }
    }

    // Internal links validation
    const linkErrors = validateInternalLinks(content.internal_links, content.linking_rules);
    errors.push(...linkErrors.filter(e => e.severity === 'error'));
    warnings.push(...linkErrors.filter(e => e.severity === 'warning'));

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Validate any content schema
 */
export function validateContent(content: ContentSchema): ValidationResult {
    switch (content.type) {
        case 'pillar_page':
            return validatePillarPage(content);
        case 'subcategory_page':
            return validateSubcategoryPage(content);
        case 'explainer_article':
            return validateExplainerArticle(content);
        case 'glossary_page':
            return validateGlossaryPage(content);
        case 'calculator_explainer':
            return validateCalculatorExplainer(content);
        default:
            logger.error('Unknown content type', new Error('Unknown content type'), { content });
            return {
                valid: false,
                errors: [{
                    field: 'type',
                    message: 'Unknown content type',
                    severity: 'error',
                }],
                warnings: [],
            };
    }
}

