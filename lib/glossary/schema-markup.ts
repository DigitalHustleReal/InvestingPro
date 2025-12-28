/**
 * Auto-generate Schema Markup (JSON-LD) for Glossary Terms
 */

export interface GlossaryTerm {
    term: string;
    full_form?: string;
    definition: string;
    slug: string;
    category: string;
    sources: Array<{
        name: string;
        url: string;
    }>;
}

/**
 * Generate JSON-LD schema markup for glossary term
 */
export function generateSchemaMarkup(term: GlossaryTerm): Record<string, any> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://investingpro.in';
    const termUrl = `${baseUrl}/glossary/${term.slug}`;

    // Main DefinedTerm schema
    const schema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        name: term.term,
        description: term.definition.substring(0, 160), // Max 160 chars for description
        url: termUrl,
        inDefinedTermSet: {
            '@type': 'DefinedTermSet',
            name: 'InvestingPro Financial Glossary',
            url: `${baseUrl}/glossary`,
        },
    };

    // Add full form if available
    if (term.full_form) {
        schema.alternateName = term.full_form;
    }

    // Add category
    schema.about = {
        '@type': 'Thing',
        name: term.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    };

    // Add sources as citations
    if (term.sources && term.sources.length > 0) {
        schema.citation = term.sources.map(source => ({
            '@type': 'WebPage',
            name: source.name,
            url: source.url,
        }));
    }

    // Add BreadcrumbList
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Glossary',
                item: `${baseUrl}/glossary`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: term.term,
                item: termUrl,
            },
        ],
    };

    // Return both schemas
    return {
        main: schema,
        breadcrumb: breadcrumbSchema,
    };
}

/**
 * Generate FAQPage schema if term has FAQs
 */
export function generateFAQSchema(
    term: string,
    slug: string,
    faqs: Array<{ question: string; answer: string }>
): Record<string, any> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://investingpro.in';
    const termUrl = `${baseUrl}/glossary/${slug}`;

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
        url: termUrl,
    };
}

