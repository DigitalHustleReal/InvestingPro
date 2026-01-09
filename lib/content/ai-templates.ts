/**
 * 🤖 AI-FIRST CONTENT TEMPLATES
 * 
 * Optimized for both Google SERP AND AI search engines:
 * - ChatGPT citations
 * - Perplexity sources
 * - Google SGE snippets
 * - Traditional SEO
 */

export const AI_OPTIMIZED_TEMPLATES = {
    /**
     * Definition Block - Optimized for AI citations
     * ChatGPT loves single-sentence, clear definitions
     */
    definition: (term: string, definition: string) => `
## Quick Definition

**${term}** is ${definition}

> **Key Takeaway:** ${definition}
`,

    /**
     * FAQ Section - Structured for AI + Schema markup
     */
    faqSection: (faqs: Array<{ question: string; answer: string }>) => {
        const faqHtml = faqs.map(faq => `
### ${faq.question}

${faq.answer}

`).join('\n');
        
        return `
## Frequently Asked Questions

${faqHtml}
`;
    },

    /**
     * Comparison Table - AI engines love structured data
     */
    comparisonTable: (title: string, options: Array<{ name: string; [key: string]: any }>) => {
        if (options.length === 0) return '';
        
        const headers = Object.keys(options[0]);
        const headerRow = `| ${headers.join(' | ')} |`;
        const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
        const dataRows = options.map(opt => 
            `| ${headers.map(h => opt[h] || '-').join(' | ')} |`
        ).join('\n');
        
        return `
## ${title}

${headerRow}
${separatorRow}
${dataRows}
`;
    },

    /**
     * Step-by-Step Guide - Perfect for AI to quote
     */
    stepByStep: (title: string, steps: Array<{ title: string; description: string }>) => {
        const stepsHtml = steps.map((step, idx) => `
### Step ${idx + 1}: ${step.title}

${step.description}
`).join('\n');
        
        return `
## ${title}

${stepsHtml}
`;
    },

    /**
     * Bullet List - Scannable for AI
     */
    bulletList: (title: string, items: string[]) => `
## ${title}

${items.map(item => `- ${item}`).join('\n')}
`,

    /**
     * Data/Statistics Block - Authority signal
     */
    dataBlock: (title: string, stats: Array<{ metric: string; value: string; source?: string }>) => {
        const statsHtml = stats.map(stat => {
            const sourceText = stat.source ? ` (Source: ${stat.source})` : '';
            return `- **${stat.metric}:** ${stat.value}${sourceText}`;
        }).join('\n');
        
        return `
## ${title}

${statsHtml}
`;
    },

    /**
     * Expert Quote - E-E-A-T signal
     */
    expertQuote: (quote: string, expert: string, credentials: string) => `
> "${quote}"
> 
> — ${expert}, ${credentials}
`,

    /**
     * Pros & Cons - AI loves structured comparisons
     */
    prosAndCons: (pros: string[], cons: string[]) => `
## Advantages

${pros.map(pro => `✅ ${pro}`).join('\n')}

## Disadvantages

${cons.map(con => `❌ ${con}`).join('\n')}
`,

    /**
     * Key Points Summary - For AI snapshots
     */
    keyPoints: (points: string[]) => `
## Key Points

${points.map((point, idx) => `${idx + 1}. ${point}`).join('\n')}
`,

    /**
     * Full Article Template - AI-optimized structure
     */
    fullArticle: (config: {
        title: string;
        definition: string;
        keyPoints: string[];
        sections: Array<{ heading: string; content: string }>;
        faqs: Array<{ question: string; answer: string }>;
        lastUpdated: string;
    }) => `
# ${config.title}

${AI_OPTIMIZED_TEMPLATES.definition(config.title.replace(' - Complete Guide 2026', ''), config.definition)}

${AI_OPTIMIZED_TEMPLATES.keyPoints(config.keyPoints)}

${config.sections.map(section => `
## ${section.heading}

${section.content}
`).join('\n')}

${AI_OPTIMIZED_TEMPLATES.faqSection(config.faqs)}

---

**Last Updated:** ${config.lastUpdated}
**Reviewed By:** Financial Content Team
`
};

/**
 * Generate AI-optimized content prompt
 */
export function generateAIOptimizedPrompt(topic: string, targetKeyword: string): string {
    return `
You are creating content optimized for BOTH traditional Google search AND AI search engines (ChatGPT, Perplexity, SGE).

Topic: ${topic}
Primary Keyword: ${targetKeyword}

CRITICAL AI OPTIMIZATION REQUIREMENTS:

1. **Start with Clear Definition** (ChatGPT Citation Format)
   - Single sentence, 15-25 words
   - No fluff, direct and quotable
   - Example: "SIP (Systematic Investment Plan) is a method of investing fixed amounts in mutual funds at regular intervals."

2. **Use Bullet Lists** (AI Parsing Friendly)
   - Not paragraphs for key points
   - Each bullet = self-contained idea
   - Maximum 8-10 words per bullet

3. **Include Data Tables** (Perplexity Loves These)
   - Comparison tables
   - Feature matrices  
   - Statistics tables
   - Minimum 3 tables per article

4. **FAQ Section** (SGE + AI Chat Optimization)
   - 8-10 common questions
   - 2-3 sentence answers
   - Natural language format
   - Include question words (What, How, Why, When)

5. **Step-by-Step Guides** (Highly Quotable)
   - Numbered steps
   - Action-oriented
   - Clear outcomes

6. **Expert Attribution** (Authority Signal)
   - "According to SEBI..."
   - "RBI guidelines state..."
   - "AMFI data shows..."

7. **Structured Content Hierarchy**
   - H2 for main sections (6-8 sections)
   - H3 for subsections
   - Short paragraphs (2-3 sentences max)

8. **Recency Signals**
   - Include "2026" in relevant contexts
   - Reference latest regulations
   - Current data/statistics

9. **No AI Clichés**
   - Avoid: "delve", "landscape", "navigating"
   - Write naturally, conversationally
   - Use simple, direct language

OUTPUT FORMAT (JSON):
{
    "title": "SEO-optimized title with primary keyword",
    "definition": "Single-sentence definition for AI",
    "key_points": ["Point 1", "Point 2", ...],
    "content": "<full HTML content>",
    "faqs": [
        {"question": "...", "answer": "..."}
    ],
    "seo_title": "60 chars max",
    "seo_description": "155 chars max"
}
`;
}

/**
 * Schema.org markup for AI engines
 */
export function generateSchemaMarkup(article: {
    title: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified: string;
    faqs?: Array<{ question: string; answer: string }>;
}): string {
    const baseSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.description,
        "author": {
            "@type": "Person",
            "name": article.author
        },
        "datePublished": article.datePublished,
        "dateModified": article.dateModified
    };
    
    // Add FAQ schema if provided
    if (article.faqs && article.faqs.length > 0) {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": article.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };
        
        return JSON.stringify([baseSchema, faqSchema], null, 2);
    }
    
    return JSON.stringify(baseSchema, null, 2);
}
