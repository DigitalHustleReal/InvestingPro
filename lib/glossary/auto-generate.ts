/**
 * Auto-generate Glossary Term
 * 
 * Complete automation pipeline:
 * 1. AI drafts from factual data
 * 2. Auto-generates internal links
 * 3. Auto-generates schema markup
 * 4. Saves to Supabase
 */

import { draftGlossaryTerm, GlossaryDraftInput } from './ai-drafting';
import { generateInternalLinks } from './link-generation';
import { generateSchemaMarkup } from './schema-markup';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';
import { generateSEOTitle, generateSEODescription } from '@/lib/content/seo-rules';

export interface AutoGenerateGlossaryInput {
    term: string;
    full_form?: string;
    pronunciation?: string;
    category: string;
    sources: Array<{
        name: string;
        url: string;
        type: 'regulatory' | 'official_site' | 'rbi' | 'sebi' | 'amfi' | 'scraped';
        verified: boolean;
        data?: string;
    }>;
    related_calculators?: string[];
    related_guides?: string[];
}

export interface AutoGenerateGlossaryOutput {
    success: boolean;
    term_id?: string;
    slug?: string;
    errors?: string[];
    warnings?: string[];
}

/**
 * Auto-generate complete glossary term entry
 */
export async function autoGenerateGlossaryTerm(
    input: AutoGenerateGlossaryInput
): Promise<AutoGenerateGlossaryOutput> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
        // Step 1: Generate slug
        const slug = input.term
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        // Step 2: AI draft content
        logger.info('Drafting glossary term with AI', { term: input.term });
        const draft = await draftGlossaryTerm({
            term: input.term,
            full_form: input.full_form,
            category: input.category,
            sources: input.sources,
            related_calculators: input.related_calculators,
            related_guides: input.related_guides,
        });

        if (draft.ai_metadata.forbidden_phrases_found.length > 0) {
            warnings.push(`Found ${draft.ai_metadata.forbidden_phrases_found.length} forbidden phrase(s) in draft`);
        }

        // Step 3: Generate internal links
        logger.info('Generating internal links', { term: input.term });
        const internalLinks = await generateInternalLinks(
            input.term,
            input.category,
            input.related_calculators,
            input.related_guides,
            draft.related_terms
        );

        // Step 4: Generate schema markup
        logger.info('Generating schema markup', { term: input.term });
        const schemaMarkup = generateSchemaMarkup({
            term: input.term,
            full_form: input.full_form,
            definition: draft.definition,
            slug,
            category: input.category,
            sources: input.sources,
        });

        // Step 5: Generate SEO metadata
        const seoTitle = generateSEOTitle(
            input.term,
            input.full_form || 'Definition',
            'glossary_page'
        );
        const seoDescription = generateSEODescription(
            input.term,
            draft.definition.substring(0, 120),
            'glossary_page',
            false
        );

        // Step 6: Prepare data for Supabase
        const glossaryData = {
            term: input.term,
            slug,
            full_form: input.full_form || null,
            pronunciation: input.pronunciation || null,
            category: input.category,
            definition: draft.definition,
            why_it_matters: draft.why_it_matters,
            example_numeric: draft.example_numeric,
            example_text: draft.example_text || null,
            related_calculators: input.related_calculators || [],
            related_guides: input.related_guides || [],
            related_terms: draft.related_terms.map(t => 
                t.toLowerCase().replace(/\s+/g, '-')
            ),
            sources: input.sources,
            ai_metadata: draft.ai_metadata,
            internal_links: internalLinks,
            schema_markup: schemaMarkup.main,
            seo_title: seoTitle,
            seo_description: seoDescription,
            meta_keywords: [input.term, ...(input.full_form ? [input.full_form] : [])],
            status: 'draft',
            is_ai_generated: true,
            requires_review: true,
            review_status: 'pending',
        };

        // Step 7: Save to Supabase
        logger.info('Saving glossary term to Supabase', { term: input.term, slug });
        const result = await (api as any).entities?.Glossary?.create?.(glossaryData);

        if (!result) {
            errors.push('Failed to save glossary term to database');
            return {
                success: false,
                errors,
                warnings,
            };
        }

        logger.info('Glossary term auto-generated successfully', { term: input.term, slug });

        return {
            success: true,
            slug,
            warnings: warnings.length > 0 ? warnings : undefined,
        };

    } catch (error: any) {
        logger.error('Error auto-generating glossary term', error as Error, { term: input.term });
        errors.push(error.message || 'Unknown error occurred');
        return {
            success: false,
            errors,
            warnings,
        };
    }
}

