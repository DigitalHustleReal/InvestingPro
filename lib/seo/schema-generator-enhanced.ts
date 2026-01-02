/**
 * 🧬 PRODUCTION SCHEMA.ORG GENERATOR - ENHANCED
 * 
 * Comprehensive structured data generator for maximum search visibility
 * and rich snippet eligibility across Google, Bing, and AI engines.
 * 
 * SCHEMA TYPES SUPPORTED:
 * 1. Article (NewsArticle, BlogPosting)
 * 2. FAQPage
 * 3. HowTo
 * 4. Product (for reviews/comparisons)
 * 5. BreadcrumbList
 * 6. Organization
 * 7. WebSite (site-wide)
 * 8. VideoObject (for embedded videos)
 * 9. Review/Rating
 * 10. FinancialService (for service pages)
 * 
 * FEATURES:
 * - Automatic FAQ extraction from content
 * - HowTo step extraction
 * - Product data structuring
 * - Multi-schema composition
 * - Validation helpers
 * - GEO (Generative Engine Optimization) support
 */

import * as cheerio from 'cheerio';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BaseSchemaOptions {
    url: string;
    siteName?: string;
    siteUrl?: string;
}

export interface ArticleSchemaOptions extends BaseSchemaOptions {
    headline: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    authorName: string;
    authorUrl?: string;
    category?: string;
    keywords?: string[];
    wordCount?: number;
}

export interface FAQSchemaOptions extends BaseSchemaOptions {
    faqs: Array<{
        question: string;
        answer: string;
    }>;
}

export interface HowToSchemaOptions extends BaseSchemaOptions {
    name: string;
    description: string;
    image?: string;
    totalTime?: string; // ISO 8601 duration (e.g., "PT30M" for 30 minutes)
    steps: Array<{
        name: string;
        text: string;
        image?: string;
    }>;
}

export interface ProductSchemaOptions extends BaseSchemaOptions {
    name: string;
    description: string;
    image: string;
    brand?: string;
    offers?: {
        price?: string;
        priceCurrency?: string;
        availability?: string;
        url?: string;
    };
    aggregateRating?: {
        ratingValue: number;
        reviewCount: number;
        bestRating?: number;
        worstRating?: number;
    };
    review?: {
        author: string;
        datePublished: string;
        reviewBody: string;
        ratingValue: number;
    };
}

export interface BreadcrumbItem {
    position: number;
    name: string;
    item: string;
}

export interface OrganizationSchemaOptions {
    name: string;
    url: string;
    logo: string;
    description?: string;
    sameAs?: string[]; // Social media profiles
    contactPoint?: {
        telephone: string;
        contactType: string;
        email?: string;
    };
}

// ============================================================================
// ARTICLE SCHEMA (Enhanced)
// ============================================================================

export function generateArticleSchema(options: ArticleSchemaOptions): object {
    const {
        headline,
        description,
        image,
        datePublished,
        dateModified,
        authorName,
        authorUrl,
        url,
        category,
        keywords,
        wordCount,
        siteName = 'InvestingPro India',
        siteUrl = 'https://investingpro.in'
    } = options;

    // Determine article type based on category
    let articleType = 'Article';
    if (category?.toLowerCase().includes('news')) {
        articleType = 'NewsArticle';
    } else if (category) {
        articleType = 'BlogPosting';
    }

    return {
        "@context": "https://schema.org",
        "@type": articleType,
        "headline": headline,
        "description": description,
        "image": {
            "@type": "ImageObject",
            "url": image,
            "width": 1200,
            "height": 630
        },
        "datePublished": datePublished,
        "dateModified": dateModified || datePublished,
        "author": {
            "@type": "Person",
            "name": authorName,
            "url": authorUrl || `${siteUrl}/experts/${slugify(authorName)}`
        },
        "publisher": {
            "@type": "Organization",
            "name": siteName,
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`,
                "width": 600,
                "height": 60
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        },
        ...(category && { "articleSection": category }),
        ...(keywords && keywords.length > 0 && { "keywords": keywords.join(', ') }),
        ...(wordCount && { "wordCount": wordCount }),
        
        // GEO / AI SEO Specifics
        "isAccessibleForFree": true,
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".key-takeaways", ".quick-verdict", "h2"]
        },
        // AI citation metadata
        "citation": {
            "@type": "CreativeWork",
            "author": authorName,
            "publisher": siteName
        }
    };
}

// ============================================================================
// FAQ SCHEMA
// ============================================================================

export function generateFAQSchema(options: FAQSchemaOptions): object {
    const { faqs } = options;

    if (!faqs || faqs.length === 0) {
        return {};
    }

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

// ============================================================================
// HOW-TO SCHEMA
// ============================================================================

export function generateHowToSchema(options: HowToSchemaOptions): object {
    const { name, description, image, totalTime, steps, url } = options;

    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": name,
        "description": description,
        ...(image && { "image": image }),
        ...(totalTime && { "totalTime": totalTime }),
        "step": steps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.name,
            "text": step.text,
            ...(step.image && { "image": step.image })
        })),
        "url": url
    };
}

// ============================================================================
// PRODUCT SCHEMA (For comparisons/reviews)
// ============================================================================

export function generateProductSchema(options: ProductSchemaOptions): object {
    const { name, description, image, brand, offers, aggregateRating, review, url } = options;

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": name,
        "description": description,
        "image": image,
        ...(brand && { "brand": { "@type": "Brand", "name": brand } }),
        ...(offers && {
            "offers": {
                "@type": "Offer",
                "url": url,
                "priceCurrency": offers.priceCurrency || "INR",
                ...(offers.price && { "price": offers.price }),
                "availability": offers.availability || "https://schema.org/InStock"
            }
        }),
        ...(aggregateRating && {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": aggregateRating.ratingValue,
                "reviewCount": aggregateRating.reviewCount,
                "bestRating": aggregateRating.bestRating || 5,
                "worstRating": aggregateRating.worstRating || 1
            }
        }),
        ...(review && {
            "review": {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": review.author
                },
                "datePublished": review.datePublished,
                "reviewBody": review.reviewBody,
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": review.ratingValue,
                    "bestRating": 5,
                    "worstRating": 1
                }
            }
        })
    };
}

// ============================================================================
// BREADCRUMB SCHEMA
// ============================================================================

export function generateBreadcrumbSchema(
    items: BreadcrumbItem[],
    siteUrl: string = 'https://investingpro.in'
): object {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map(item => ({
            "@type": "ListItem",
            "position": item.position,
            "name": item.name,
            "item": item.item.startsWith('http') ? item.item : `${siteUrl}${item.item}`
        }))
    };
}

// ============================================================================
// ORGANIZATION SCHEMA (Site-wide)
// ============================================================================

export function generateOrganizationSchema(options: OrganizationSchemaOptions): object {
    const { name, url, logo, description, sameAs, contactPoint } = options;

    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": name,
        "url": url,
        "logo": logo,
        ...(description && { "description": description }),
        ...(sameAs && sameAs.length > 0 && { "sameAs": sameAs }),
        ...(contactPoint && {
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": contactPoint.telephone,
                "contactType": contactPoint.contactType,
                ...(contactPoint.email && { "email": contactPoint.email })
            }
        })
    };
}

// ============================================================================
// WEBSITE SCHEMA (Site-wide)
// ============================================================================

export function generateWebSiteSchema(
    name: string,
    url: string,
    searchUrl?: string
): object {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": name,
        "url": url,
        ...(searchUrl && {
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${searchUrl}?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            }
        })
    };
}

// ============================================================================
// VIDEO SCHEMA (For embedded videos)
// ============================================================================

export function generateVideoSchema(
    name: string,
    description: string,
    thumbnailUrl: string,
    uploadDate: string,
    duration?: string, // ISO 8601 format (PT1M30S)
    contentUrl?: string
): object {
    return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": name,
        "description": description,
        "thumbnailUrl": thumbnailUrl,
        "uploadDate": uploadDate,
        ...(duration && { "duration": duration }),
        ...(contentUrl && { "contentUrl": contentUrl })
    };
}

// ============================================================================
// CONTENT EXTRACTION HELPERS
// ============================================================================

/**
 * Extract FAQs from HTML content
 */
export function extractFAQsFromContent(html: string): Array<{
    question: string;
    answer: string;
}> {
    const $ = cheerio.load(html);
    const faqs: Array<{ question: string; answer: string }> = [];
    
    // Method 1: Look for FAQ section with questions
    const faqSection = $('[class*="faq"], [id*="faq"]');
    if (faqSection.length > 0) {
        faqSection.find('h3, h4').each((i, heading) => {
            const question = $(heading).text().trim();
            if (question.includes('?')) {
                const answer = $(heading).next('p').text().trim();
                if (answer) {
                    faqs.push({ question, answer });
                }
            }
        });
    }
    
    // Method 2: Find all headings with question marks
    if (faqs.length === 0) {
        $('h2, h3, h4').each((i, heading) => {
            const question = $(heading).text().trim();
            if (question.endsWith('?')) {
                const answer = $(heading).next('p').text().trim();
                if (answer) {
                    faqs.push({ question, answer });
                }
            }
        });
    }
    
    return faqs.slice(0, 10); // Limit to top 10
}

/**
 * Extract HowTo steps from content
 */
export function extractHowToSteps(html: string): Array<{
    name: string;
    text: string;
}> {
    const $ = cheerio.load(html);
    const steps: Array<{ name: string; text: string }> = [];
    
    // Look for ordered lists
    $('ol').each((i, list) => {
        $(list).find('li').each((j, item) => {
            const text = $(item).text().trim();
            if (text.length > 10) {
                // Extract step name (first sentence or strong text)
                const strong = $(item).find('strong').first().text();
                const name = strong || text.split('.')[0] || `Step ${steps.length + 1}`;
                
                steps.push({
                    name: name.substring(0, 100),
                    text: text.substring(0, 500)
                });
            }
        });
    });
    
    // Alternative: look for headings followed by paragraphs
    if (steps.length === 0) {
        $('h3').each((i, heading) => {
            const headingText = $(heading).text().trim();
            if (/step\s*\d+|^\d+\.|how to/i.test(headingText)) {
                const text = $(heading).next('p').text().trim();
                if (text) {
                    steps.push({
                        name: headingText,
                        text: text.substring(0, 500)
                    });
                }
            }
        });
    }
    
    return steps.slice(0, 20);
}

/**
 * Auto-generate breadcrumbs from URL
 */
export function generateBreadcrumbsFromUrl(
    currentUrl: string,
    currentTitle: string,
    siteUrl: string = 'https://investingpro.in'
): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [
        { position: 1, name: 'Home', item: siteUrl }
    ];
    
    const urlParts = currentUrl.replace(siteUrl, '').split('/').filter(p => p);
    
    urlParts.forEach((part, index) => {
        if (index === urlParts.length - 1) {
            // Last part - use actual title
            items.push({
                position: items.length + 1,
                name: currentTitle,
                item: currentUrl
            });
        } else {
            // Intermediate parts
            items.push({
                position: items.length + 1,
                name: part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                item: `${siteUrl}/${urlParts.slice(0, index + 1).join('/')}`
            });
        }
    });
    
    return items;
}

// ============================================================================
// COMPREHENSIVE SCHEMA GENERATOR
// ============================================================================

export interface ComprehensiveSchemaOptions {
    // Article data
    article: ArticleSchemaOptions;
    
    // Optional enhancements
    includeFAQ?: boolean;
    includeHowTo?: boolean;
    includeProduct?: ProductSchemaOptions;
    includeBreadcrumbs?: boolean;
    
    // Content for extraction
    htmlContent?: string;
}

export function generateComprehensiveSchema(
    options: ComprehensiveSchemaOptions
): {
    schemas: object[];
    scriptTags: string[];
} {
    const schemas: object[] = [];
    
    // 1. Article Schema (always included)
    schemas.push(generateArticleSchema(options.article));
    
    // 2. FAQ Schema
    if (options.includeFAQ && options.htmlContent) {
        const faqs = extractFAQsFromContent(options.htmlContent);
        if (faqs.length > 0) {
            schemas.push(generateFAQSchema({ faqs, url: options.article.url }));
        }
    }
    
    // 3. HowTo Schema
    if (options.includeHowTo && options.htmlContent) {
        const steps = extractHowToSteps(options.htmlContent);
        if (steps.length >= 3) {
            schemas.push(generateHowToSchema({
                name: options.article.headline,
                description: options.article.description,
                steps,
                url: options.article.url
            }));
        }
    }
    
    // 4. Product Schema (for comparison articles)
    if (options.includeProduct) {
        schemas.push(generateProductSchema(options.includeProduct));
    }
    
    // 5. Breadcrumbs
    if (options.includeBreadcrumbs) {
        const breadcrumbs = generateBreadcrumbsFromUrl(
            options.article.url,
            options.article.headline,
            options.article.siteUrl
        );
        schemas.push(generateBreadcrumbSchema(breadcrumbs, options.article.siteUrl));
    }
    
    // Convert to script tags
    const scriptTags = schemas.map(schema => JSON.stringify(schema, null, 2));
    
    return { schemas, scriptTags };
}

// ============================================================================
// UTILITIES
// ============================================================================

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

/**
 * Validate schema against Schema.org rules
 */
export function validateSchema(schema: object): {
    valid: boolean;
    errors: string[];
    warnings: string[];
} {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const schemaAny = schema as any;
    
    // Check required fields
    if (!schemaAny['@context']) errors.push('Missing @context');
    if (!schemaAny['@type']) errors.push('Missing @type');
    
    // Type-specific validation
    if (schemaAny['@type'] === 'Article' || schemaAny['@type'] === 'BlogPosting') {
        if (!schemaAny.headline) errors.push('Missing headline');
        if (!schemaAny.image) errors.push('Missing image');
        if (!schemaAny.datePublished) errors.push('Missing datePublished');
        if (!schemaAny.author) errors.push('Missing author');
        if (!schemaAny.publisher) errors.push('Missing publisher');
    }
    
    if (schemaAny['@type'] === 'FAQPage') {
        if (!schemaAny.mainEntity || schemaAny.mainEntity.length === 0) {
            errors.push('FAQPage must have at least one question');
        }
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
