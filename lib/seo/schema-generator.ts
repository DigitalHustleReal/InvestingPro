/**
 * 🧬 SYSTEM FOR AI-SEO / GEO (Generative Engine Optimization)
 * 
 * Generates JSON-LD Schema markup to help AI engines (Google SGE, ChatGPT, Perplexity)
 * understand and cite our content.
 */

export interface SchemaOptions {
    headline: string;
    description: string;
    image: string;
    datePublished: string;
    authorName: string;
    url: string;
    faq?: { question: string; answer: string }[];
}

export function generateArticleSchema(options: SchemaOptions) {
    const { headline, description, image, datePublished, authorName, url, faq } = options;

    // 1. Base Article Schema
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": headline,
        "description": description,
        "image": image,
        "datePublished": datePublished,
        "dateModified": datePublished, // Ideally updated when modified
        "author": {
            "@type": "Person",
            "name": authorName,
            "url": "https://investingpro.in/experts/vikram-mehta" // Link to expert bio
        },
        "publisher": {
            "@type": "Organization",
            "name": "InvestingPro India",
            "logo": {
                "@type": "ImageObject",
                "url": "https://investingpro.in/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        },
        // GEO / AI SEO Specifics
        "isAccessibleForFree": true,
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".key-takeaways", ".quick-verdict"]
        }
    };

    // 2. FAQ Schema (Critical for Featured Snippets & AI Answers)
    let faqSchema = null;
    if (faq && faq.length > 0) {
        faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faq.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                }
            }))
        };
    }

    // 3. Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://investingpro.in"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Articles",
                "item": "https://investingpro.in/articles"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": headline,
                "item": url
            }
        ]
    };

    return {
        articleSchema,
        faqSchema,
        breadcrumbSchema,
        // Combined JSON-LD string
        scriptTags: [
            JSON.stringify(articleSchema),
            faqSchema ? JSON.stringify(faqSchema) : null,
            JSON.stringify(breadcrumbSchema)
        ].filter(Boolean)
    };
}

/**
 * Extract FAQ items from HTML content (heuristic)
 */
export function extractFAQsFromContent(html: string): { question: string; answer: string }[] {
    const faqs: { question: string; answer: string }[] = [];
    
    // Simple regex to find FAQ section (assumes headings with ?)
    // This is a heuristic; in production, we might want the LLM to output explicit JSON
    const matches = html.matchAll(/<h3>(.*?\?)<\/h3>\s*<p>(.*?)<\/p>/g);
    
    for (const match of matches) {
        if (match[1] && match[2]) {
            faqs.push({
                question: match[1].trim(),
                answer: match[2].trim().replace(/<[^>]*>/g, '') // Strip HTML for schema
            });
        }
    }
    
    return faqs.slice(0, 5); // Limit to top 5
}
