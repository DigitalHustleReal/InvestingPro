/**
 * Strict Content System Schemas
 * 
 * NO free-form writing. All content must follow these rigid schemas.
 * Templates only.
 */

// ============================================================================
// BASE TYPES
// ============================================================================

export type ContentType = 
    | 'pillar_page'
    | 'subcategory_page'
    | 'explainer_article'
    | 'glossary_page'
    | 'calculator_explainer';

export type AllowedSection = 
    // Pillar & Subcategory
    | 'hero'
    | 'overview'
    | 'key_features'
    | 'how_it_works'
    | 'types_variants'
    | 'pros_cons'
    | 'comparison_table'
    | 'use_cases'
    | 'eligibility_criteria'
    | 'documents_required'
    | 'application_process'
    | 'fees_charges'
    | 'tax_implications'
    | 'risks_considerations'
    | 'faq'
    | 'related_products'
    | 'cta'
    // Explainer & Glossary
    | 'definition'
    | 'detailed_explanation'
    | 'examples'
    | 'formula'
    | 'calculation_steps'
    | 'common_mistakes'
    | 'best_practices'
    | 'related_terms'
    // Calculator Explainer
    | 'calculator_intro'
    | 'input_fields'
    | 'output_explanation'
    | 'interpretation_guide'
    | 'use_cases';

// ============================================================================
// SEO METADATA SCHEMA
// ============================================================================

export interface SEOMetadata {
    title: string; // Max 60 chars, must include primary keyword
    description: string; // Max 160 chars, must include primary keyword
    keywords: string[]; // Max 10 keywords, primary first
    canonical_url: string;
    og_title?: string; // Max 60 chars
    og_description?: string; // Max 160 chars
    og_image?: string;
    structured_data: Record<string, any>; // JSON-LD schema
    h1: string; // Must match title intent, max 60 chars
    meta_robots?: 'index,follow' | 'noindex,nofollow' | 'index,nofollow';
}

// ============================================================================
// INTERNAL LINKING RULES
// ============================================================================

export interface InternalLink {
    text: string; // Anchor text (max 5 words)
    url: string; // Must be internal URL
    link_type: 'pillar' | 'subcategory' | 'explainer' | 'glossary' | 'calculator' | 'product';
    context: string; // Where link appears (section name)
    is_required: boolean; // Must this link be present?
}

export interface InternalLinkingRules {
    min_links: number; // Minimum internal links required
    max_links: number; // Maximum internal links allowed
    required_link_types: InternalLink['link_type'][]; // Must include these types
    anchor_text_rules: {
        max_words: number;
        must_include_keyword?: boolean;
        avoid_generic: string[]; // Avoid: "click here", "read more", etc.
    };
}

// ============================================================================
// PILLAR PAGE SCHEMA
// ============================================================================

export interface PillarPageSchema {
    type: 'pillar_page';
    
    // Required Metadata
    category: string; // e.g., 'credit-cards', 'mutual-funds'
    primary_keyword: string; // Main SEO keyword
    secondary_keywords: string[]; // Max 5
    
    // SEO
    seo: SEOMetadata;
    
    // Allowed Sections (IN ORDER, ALL REQUIRED)
    sections: {
        hero: {
            headline: string; // Max 60 chars
            subheadline: string; // Max 120 chars
            cta_text?: string;
        };
        overview: {
            content: string; // Max 200 words
            key_statistics?: Array<{
                label: string;
                value: string;
                source?: string;
            }>;
        };
        key_features: {
            features: Array<{
                title: string; // Max 40 chars
                description: string; // Max 100 words
                icon?: string;
            }>; // Min 3, Max 6
        };
        how_it_works: {
            steps: Array<{
                step_number: number;
                title: string; // Max 40 chars
                description: string; // Max 150 words
            }>; // Min 3, Max 7
        };
        types_variants: {
            variants: Array<{
                name: string;
                description: string; // Max 100 words
                use_case: string; // Max 50 words
            }>; // Min 2, Max 8
        };
        pros_cons: {
            pros: Array<string>; // Min 3, Max 8
            cons: Array<string>; // Min 2, Max 6
        };
        faq: {
            questions: Array<{
                question: string; // Max 100 chars
                answer: string; // Max 200 words
            }>; // Min 5, Max 10
        };
        related_products?: {
            product_ids: string[]; // Max 6
        };
        cta: {
            headline: string; // Max 40 chars
            description: string; // Max 100 words
            cta_text: string; // Max 20 chars
            cta_url: string;
        };
    };
    
    // Internal Linking
    internal_links: InternalLink[];
    linking_rules: InternalLinkingRules & {
        min_links: 8;
        max_links: 15;
        required_link_types: ['subcategory', 'explainer', 'glossary'];
    };
}

// ============================================================================
// SUBCATEGORY PAGE SCHEMA
// ============================================================================

export interface SubcategoryPageSchema {
    type: 'subcategory_page';
    
    // Required Metadata
    parent_category: string; // Must reference pillar page
    subcategory: string; // e.g., 'rewards-credit-cards'
    primary_keyword: string;
    secondary_keywords: string[]; // Max 3
    
    // SEO
    seo: SEOMetadata;
    
    // Allowed Sections (IN ORDER, SOME REQUIRED)
    sections: {
        hero: {
            headline: string; // Max 60 chars
            subheadline: string; // Max 120 chars
        };
        overview: {
            content: string; // Max 150 words
        };
        key_features: {
            features: Array<{
                title: string;
                description: string; // Max 80 words
            }>; // Min 2, Max 5
        };
        comparison_table?: {
            products: Array<{
                product_id: string;
                comparison_points: Record<string, string>;
            }>; // Min 3, Max 6
        };
        use_cases: {
            cases: Array<{
                scenario: string; // Max 50 chars
                description: string; // Max 100 words
            }>; // Min 2, Max 5
        };
        eligibility_criteria?: {
            criteria: Array<{
                requirement: string;
                description: string; // Max 50 words
            }>; // Min 2, Max 6
        };
        fees_charges?: {
            fees: Array<{
                fee_type: string;
                amount: string;
                frequency?: string;
            }>; // Min 2, Max 8
        };
        faq: {
            questions: Array<{
                question: string;
                answer: string; // Max 150 words
            }>; // Min 3, Max 8
        };
        related_products?: {
            product_ids: string[]; // Max 4
        };
        cta: {
            headline: string;
            description: string; // Max 80 words
            cta_text: string;
            cta_url: string;
        };
    };
    
    // Internal Linking
    internal_links: InternalLink[];
    linking_rules: InternalLinkingRules & {
        min_links: 5;
        max_links: 10;
        required_link_types: ['pillar', 'explainer', 'product'];
    };
}

// ============================================================================
// EXPLAINER ARTICLE SCHEMA
// ============================================================================

export interface ExplainerArticleSchema {
    type: 'explainer_article';
    
    // Required Metadata
    topic: string; // e.g., 'how-sip-works'
    primary_keyword: string;
    related_category: string; // Must reference category
    
    // SEO
    seo: SEOMetadata;
    
    // Allowed Sections (IN ORDER, ALL REQUIRED)
    sections: {
        definition: {
            term: string;
            definition: string; // Max 100 words
            simple_explanation: string; // Max 150 words
        };
        detailed_explanation: {
            content: string; // Max 500 words
            subsections?: Array<{
                heading: string; // Max 40 chars
                content: string; // Max 200 words
            }>; // Max 5
        };
        examples: {
            examples: Array<{
                scenario: string; // Max 50 chars
                explanation: string; // Max 150 words
                calculation?: string; // If applicable
            }>; // Min 2, Max 4
        };
        formula?: {
            formula: string; // LaTeX or plain text
            explanation: string; // Max 100 words
            variables: Array<{
                variable: string;
                description: string; // Max 30 words
            }>;
        };
        common_mistakes?: {
            mistakes: Array<{
                mistake: string; // Max 50 chars
                explanation: string; // Max 100 words
                correction: string; // Max 50 words
            }>; // Min 2, Max 5
        };
        best_practices?: {
            practices: Array<{
                practice: string; // Max 50 chars
                explanation: string; // Max 100 words
            }>; // Min 2, Max 5
        };
        related_terms: {
            terms: Array<{
                term: string;
                url: string; // Must be glossary or explainer
            }>; // Min 2, Max 6
        };
    };
    
    // Internal Linking
    internal_links: InternalLink[];
    linking_rules: InternalLinkingRules & {
        min_links: 4;
        max_links: 8;
        required_link_types: ['glossary', 'pillar'];
    };
}

// ============================================================================
// GLOSSARY PAGE SCHEMA
// ============================================================================

export interface GlossaryPageSchema {
    type: 'glossary_page';
    
    // Required Metadata
    term: string; // e.g., 'SIP', 'NAV', 'APR'
    category: string; // Related category
    
    // SEO
    seo: SEOMetadata;
    
    // Allowed Sections (IN ORDER, ALL REQUIRED)
    sections: {
        definition: {
            term: string;
            full_form?: string; // If acronym
            definition: string; // Max 150 words
            pronunciation?: string;
        };
        detailed_explanation: {
            content: string; // Max 300 words
        };
        examples: {
            examples: Array<{
                example: string; // Max 100 words
            }>; // Min 1, Max 3
        };
        formula?: {
            formula: string;
            explanation: string; // Max 80 words
        };
        related_terms: {
            terms: Array<{
                term: string;
                url: string;
            }>; // Min 2, Max 5
        };
    };
    
    // Internal Linking
    internal_links: InternalLink[];
    linking_rules: InternalLinkingRules & {
        min_links: 3;
        max_links: 6;
        required_link_types: ['explainer', 'pillar'];
    };
}

// ============================================================================
// CALCULATOR EXPLAINER SCHEMA
// ============================================================================

export interface CalculatorExplainerSchema {
    type: 'calculator_explainer';
    
    // Required Metadata
    calculator_type: string; // e.g., 'sip', 'emi', 'fd'
    primary_keyword: string;
    
    // SEO
    seo: SEOMetadata;
    
    // Allowed Sections (IN ORDER, ALL REQUIRED)
    sections: {
        calculator_intro: {
            headline: string; // Max 50 chars
            description: string; // Max 150 words
            use_case: string; // Max 100 words
        };
        input_fields: {
            fields: Array<{
                field_name: string;
                description: string; // Max 80 words
                unit?: string;
                example?: string;
                tips?: string; // Max 50 words
            }>; // Min 2, Max 8
        };
        output_explanation: {
            outputs: Array<{
                output_name: string;
                description: string; // Max 100 words
                interpretation: string; // Max 80 words
            }>; // Min 1, Max 5
        };
        interpretation_guide: {
            scenarios: Array<{
                scenario: string; // Max 50 chars
                interpretation: string; // Max 150 words
                action?: string; // Max 50 words
            }>; // Min 2, Max 4
        };
        use_cases: {
            cases: Array<{
                use_case: string; // Max 50 chars
                description: string; // Max 100 words
            }>; // Min 2, Max 4
        };
    };
    
    // Internal Linking
    internal_links: InternalLink[];
    linking_rules: InternalLinkingRules & {
        min_links: 3;
        max_links: 6;
        required_link_types: ['explainer', 'glossary'];
    };
}

// ============================================================================
// UNION TYPE
// ============================================================================

export type ContentSchema = 
    | PillarPageSchema
    | SubcategoryPageSchema
    | ExplainerArticleSchema
    | GlossaryPageSchema
    | CalculatorExplainerSchema;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export interface ContentValidationRules {
    // Character Limits
    title_max_chars: 60;
    description_max_chars: 160;
    h1_max_chars: 60;
    headline_max_chars: 60;
    subheadline_max_chars: 120;
    
    // Word Limits
    overview_max_words: 200;
    feature_description_max_words: 100;
    faq_answer_max_words: 200;
    
    // Count Limits
    keywords_max: 10;
    features_min: 2;
    features_max: 8;
    faq_min: 3;
    faq_max: 10;
    
    // Required Sections
    pillar_required_sections: Array<keyof PillarPageSchema['sections']>;
    subcategory_required_sections: Array<keyof SubcategoryPageSchema['sections']>;
    explainer_required_sections: Array<keyof ExplainerArticleSchema['sections']>;
    glossary_required_sections: Array<keyof GlossaryPageSchema['sections']>;
    calculator_required_sections: Array<keyof CalculatorExplainerSchema['sections']>;
}

export const VALIDATION_RULES: ContentValidationRules = {
    title_max_chars: 60,
    description_max_chars: 160,
    h1_max_chars: 60,
    headline_max_chars: 60,
    subheadline_max_chars: 120,
    overview_max_words: 200,
    feature_description_max_words: 100,
    faq_answer_max_words: 200,
    keywords_max: 10,
    features_min: 2,
    features_max: 8,
    faq_min: 3,
    faq_max: 10,
    pillar_required_sections: ['hero', 'overview', 'key_features', 'how_it_works', 'types_variants', 'pros_cons', 'faq', 'cta'],
    subcategory_required_sections: ['hero', 'overview', 'key_features', 'faq', 'cta'],
    explainer_required_sections: ['definition', 'detailed_explanation', 'examples', 'related_terms'],
    glossary_required_sections: ['definition', 'detailed_explanation', 'examples', 'related_terms'],
    calculator_required_sections: ['calculator_intro', 'input_fields', 'output_explanation', 'interpretation_guide', 'use_cases'],
};

